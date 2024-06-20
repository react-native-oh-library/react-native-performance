import type { TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { TM } from "@rnoh/react-native-openharmony/generated/ts"
import { TurboModule} from '@rnoh/react-native-openharmony/ts'
import systemDateTime from '@ohos.systemDateTime';
import process from '@ohos.process';
import {GlobalThis} from '../lib/global'
import { createEventEmitter } from '../lib/event-emitter';
import type { EntryType } from '../lib/performance-entry';
import { MarkOptions } from '../lib/performance'
import type { StartOrMeasureOptions, ValueOrOptions } from '../lib/performance'
import {PerformanceEntry,PerformanceReactNativeMark,PerformanceMark, PerformanceMeasure, PerformanceMetric } from '../lib/performance-entry'
import { createPerformanceObserver, PerformanceObserverEntryList } from '../lib/performance-observer';
import {
  installResourceLogger,
  uninstallResourceLogger,
} from '../lib/resource-logger';
import Logger from './Logger'
const TAG: string = 'RNPerformanceTurboModule';
const { addEventListener, removeEventListener, emit } = createEventEmitter<PerformanceEntry>();
const marks = new Map<string, number>();
let entries: PerformanceEntry[] = [];

type DataFormat={
  name:string,
  startTime:number,
  detail:string,
  value?:any
}


const addEntry = <T extends PerformanceEntry>(entry: T): T => {
  entries.push(entry);
  if (entry.entryType === 'mark' || entry.entryType === 'react-native-mark') {
    marks.set(entry.name, entry.startTime);
  }
  emit(entry);
  return entry;
}

const removeEntries = (type: EntryType, name?: string) => {
  entries = entries.filter((entry) => {
    if (entry.entryType === type && (!name || entry.name === name)) {
      marks.delete(entry.name);
      return false;
    }
    return true;
  });
};

const convertMarkToTimestamp = (markOrTimestamp: string | number) => {
  switch (typeof markOrTimestamp) {
    case 'string': {
      if (!marks.has(markOrTimestamp)) {
        throw new Error(
          `Failed to execute 'measure' on 'Performance': The mark '${markOrTimestamp}' does not exist.`
        );
      }
      return marks.get(markOrTimestamp);
    }
    case 'number': {
      return markOrTimestamp;
    }
    default:
      throw new TypeError(
        `Failed to execute 'measure' on 'Performance': Expected mark name or timestamp, got '${markOrTimestamp}'.`
      );
  }
};
const getEntriesByType = (type: EntryType) => {
  return entries.filter((entry) => entry.entryType === type);
}
const PerformanceObserver=createPerformanceObserver({
  addEventListener,
  removeEventListener,
  getEntriesByType,
});


export class RNPerformanceTurboModule extends TurboModule implements TM.PerformanceNativeModule.Spec {
  private timeOrin;
  // ----------------------------
  private startTime:number=0;
  private endTime:number=0;

  constructor(protected ctx: TurboModuleContext) {
    super(ctx);
    this.timeOrin = Date.now()
    this.setupMarkerListener();
  }
  async inititalTimeProvider(){
    if (this.endTime == 0) {
      let timeSpan=0;
      await systemDateTime.getRealActiveTime().then((time: number) => {
        console.info(`Succeeded in getting real active time1 : ${time}`);
        timeSpan=time;
      }).catch((error: Error) => {
        console.info(`Failed to get real active time. message: ${error}`);
      });
      console.info(`Succeeded in getting real active time2 : ${timeSpan}`);
      this.endTime=timeSpan;
    }
    if (this.startTime == 0) {
      let realtime = process.getStartRealtime();
      this.startTime = this.endTime - realtime;
    }
  }
  async setupMarkerListener(){
    await this.inititalTimeProvider();
    let startTime=this.startTime;
    let endTime=this.endTime;
    console.info(`Succeeded in getting real active time2 : ${startTime}以及endtime${endTime}`);
    this.ctx.rnInstance.emitDeviceEvent('mark',{
      name:'nativeLaunchStart',
      startTime,
      detail:'本机进程初始化已开始'
    })
    this.ctx.rnInstance.emitDeviceEvent('mark',{
      name:'nativeLaunchEnd',
      startTime:endTime,
      detail:'本机进程初始化已结束'
    })
  }

  addListener(eventName: string){

  }
  removeListeners(count: number){

  }
  now() {
    return Date.now();
  }
  timeOrigin() {
    return this.timeOrin;
  }

  mark(markName: string, markOptions: MarkOptions = {}) {
    let timeNow = this.now();
    addEntry(
      new PerformanceMark(markName, {
        startTime:
        'startTime' in markOptions && markOptions.startTime !== undefined
          ? markOptions.startTime
          : timeNow,
        detail: markOptions.detail,
      }));
  }

  clearMarks(name?: string) {
    removeEntries('mark', name);
  }

  measure(measureName: string, startOrMeasureOptions?: StartOrMeasureOptions, endMark?: string | number) {
    let start = 0;
    let end = 0;
    let detail: any;
    if (
      startOrMeasureOptions &&
        typeof startOrMeasureOptions === 'object' &&
        startOrMeasureOptions.constructor == Object
    ) {
      if (endMark) {
        throw new TypeError(
          `Failed to execute 'measure' on 'Performance': The measureOptions and endMark arguments may not be combined.`
        );
      }
      if (!startOrMeasureOptions.start && !startOrMeasureOptions.end) {
        throw new TypeError(
          `Failed to execute 'measure' on 'Performance': At least one of the start and end option must be passed.`
        );
      }
      if (
        startOrMeasureOptions.start &&
        startOrMeasureOptions.end &&
        startOrMeasureOptions.duration
      ) {
        throw new TypeError(
          `Failed to execute 'measure' on 'Performance': Cannot send start, end and duration options together.`
        );
      }

      detail = startOrMeasureOptions.detail;

      if (startOrMeasureOptions && startOrMeasureOptions.end) {
        end = convertMarkToTimestamp(startOrMeasureOptions.end);
      } else if (
        startOrMeasureOptions &&
        startOrMeasureOptions.start &&
        startOrMeasureOptions.duration
      ) {
        end =
          convertMarkToTimestamp(startOrMeasureOptions.start) +
          convertMarkToTimestamp(startOrMeasureOptions.duration);
      } else {
        end = this.now();
      }

      if (startOrMeasureOptions && startOrMeasureOptions.start) {
        start = convertMarkToTimestamp(startOrMeasureOptions.start);
      } else if (
        startOrMeasureOptions &&
        startOrMeasureOptions.end &&
        startOrMeasureOptions.duration
      ) {
        start =
          convertMarkToTimestamp(startOrMeasureOptions.end) -
          convertMarkToTimestamp(startOrMeasureOptions.duration);
      } else {
        start = this.timeOrigin();
      }
    } else {
      if (endMark) {
        end = convertMarkToTimestamp(endMark);
      } else {
        end = this.now();
      }

      if (typeof startOrMeasureOptions === 'string') {
        start = convertMarkToTimestamp(startOrMeasureOptions);
      } else {
        start = this.timeOrigin();
      }
    }

    return addEntry(
      new PerformanceMeasure(measureName, {
        detail,
        startTime: start,
        duration: end - start,
      })
    );
  }

  clearMeasures(name?: string) {
    removeEntries('measure', name);
  }

  metric(name: string, valueOrOptions: ValueOrOptions) {
    let value: string | number;
    let startTime: number | undefined;
    let detail: any;

    if (
      typeof valueOrOptions === 'object' &&
        valueOrOptions.constructor == Object
    ) {
      if (!valueOrOptions.value) {
        throw new TypeError(
          `Failed to execute 'metric' on 'Performance': The value option must be passed.`
        );
      }
      value = valueOrOptions.value;
      startTime = valueOrOptions.startTime;
      detail = valueOrOptions.detail;
    } else if (
      typeof valueOrOptions === 'undefined' ||
        valueOrOptions === null
    ) {
      throw new TypeError(
        `Failed to execute 'metric' on 'Performance': The value option must be passed.`
      );
    } else {
      value = valueOrOptions as string | number;
    }

    return addEntry(
      new PerformanceMetric(name, {
        startTime: startTime ? startTime : this.now(),
        value,
        detail,
      })
    );
  }

  clearMetrics(name?: string) {
    removeEntries('metric', name);
  }

  getEntries() {
    return entries.slice(0);
  }

  getEntriesByName(name: string, type?: EntryType) {
    return entries.filter(
      (entry) => entry.name === name && (!type || entry.entryType === type)
    );
  }

  getEntriesByType(type: EntryType) {
    return entries.filter((entry) => entry.entryType === type);
  }

  getPerformanceObserverEntryListObject(entries: PerformanceEntry[]) {
    return new PerformanceObserverEntryList(entries);
  }

  getPerformanceObserver(callback,observeOption) {
    let performanceObserver=new PerformanceObserver(callback)
    performanceObserver.observe(observeOption);
    // return performanceObserver;
  }

  returnMessage(): string {
    return "从你的全世界路过";
  }
}