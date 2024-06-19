"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultNow = exports.createPerformance = void 0;
var _eventEmitter = require("./event-emitter");
var _performanceObserver = require("./performance-observer");
var _performanceEntry = require("./performance-entry");
// @ts-ignore
const defaultNow = exports.defaultNow = global.performance.now.bind(
// @ts-ignore
global.performance);
const createPerformance = (now = defaultNow) => {
  const timeOrigin = now();
  const {
    addEventListener,
    removeEventListener,
    emit
  } = (0, _eventEmitter.createEventEmitter)();
  const marks = new Map();
  let entries = [];
  function addEntry(entry) {
    entries.push(entry);
    if (entry.entryType === 'mark' || entry.entryType === 'react-native-mark') {
      marks.set(entry.name, entry.startTime);
    }
    emit(entry);
    return entry;
  }
  const removeEntries = (type, name) => {
    entries = entries.filter(entry => {
      if (entry.entryType === type && (!name || entry.name === name)) {
        marks.delete(entry.name);
        return false;
      }
      return true;
    });
  };
  const mark = (markName, markOptions = {}) => addEntry(new _performanceEntry.PerformanceMark(markName, {
    startTime: 'startTime' in markOptions && markOptions.startTime !== undefined ? markOptions.startTime : now(),
    detail: markOptions.detail
  }));
  const clearMarks = name => removeEntries('mark', name);
  const clearMeasures = name => removeEntries('measure', name);
  const clearMetrics = name => removeEntries('metric', name);
  const convertMarkToTimestamp = markOrTimestamp => {
    switch (typeof markOrTimestamp) {
      case 'string':
        {
          if (!marks.has(markOrTimestamp)) {
            throw new Error(`Failed to execute 'measure' on 'Performance': The mark '${markOrTimestamp}' does not exist.`);
          }
          return marks.get(markOrTimestamp);
        }
      case 'number':
        {
          return markOrTimestamp;
        }
      default:
        throw new TypeError(`Failed to execute 'measure' on 'Performance': Expected mark name or timestamp, got '${markOrTimestamp}'.`);
    }
  };
  const measure = (measureName, startOrMeasureOptions, endMark) => {
    let start = 0;
    let end = 0;
    let detail;
    if (startOrMeasureOptions && typeof startOrMeasureOptions === 'object' && startOrMeasureOptions.constructor == Object) {
      if (endMark) {
        throw new TypeError(`Failed to execute 'measure' on 'Performance': The measureOptions and endMark arguments may not be combined.`);
      }
      if (!startOrMeasureOptions.start && !startOrMeasureOptions.end) {
        throw new TypeError(`Failed to execute 'measure' on 'Performance': At least one of the start and end option must be passed.`);
      }
      if (startOrMeasureOptions.start && startOrMeasureOptions.end && startOrMeasureOptions.duration) {
        throw new TypeError(`Failed to execute 'measure' on 'Performance': Cannot send start, end and duration options together.`);
      }
      detail = startOrMeasureOptions.detail;
      if (startOrMeasureOptions && startOrMeasureOptions.end) {
        end = convertMarkToTimestamp(startOrMeasureOptions.end);
      } else if (startOrMeasureOptions && startOrMeasureOptions.start && startOrMeasureOptions.duration) {
        end = convertMarkToTimestamp(startOrMeasureOptions.start) + convertMarkToTimestamp(startOrMeasureOptions.duration);
      } else {
        end = now();
      }
      if (startOrMeasureOptions && startOrMeasureOptions.start) {
        start = convertMarkToTimestamp(startOrMeasureOptions.start);
      } else if (startOrMeasureOptions && startOrMeasureOptions.end && startOrMeasureOptions.duration) {
        start = convertMarkToTimestamp(startOrMeasureOptions.end) - convertMarkToTimestamp(startOrMeasureOptions.duration);
      } else {
        start = timeOrigin;
      }
    } else {
      if (endMark) {
        end = convertMarkToTimestamp(endMark);
      } else {
        end = now();
      }
      if (typeof startOrMeasureOptions === 'string') {
        start = convertMarkToTimestamp(startOrMeasureOptions);
      } else {
        start = timeOrigin;
      }
    }
    return addEntry(new _performanceEntry.PerformanceMeasure(measureName, {
      detail,
      startTime: start,
      duration: end - start
    }));
  };
  const metric = (name, valueOrOptions) => {
    let value;
    let startTime;
    let detail;
    if (typeof valueOrOptions === 'object' && valueOrOptions.constructor == Object) {
      if (!valueOrOptions.value) {
        throw new TypeError(`Failed to execute 'metric' on 'Performance': The value option must be passed.`);
      }
      value = valueOrOptions.value;
      startTime = valueOrOptions.startTime;
      detail = valueOrOptions.detail;
    } else if (typeof valueOrOptions === 'undefined' || valueOrOptions === null) {
      throw new TypeError(`Failed to execute 'metric' on 'Performance': The value option must be passed.`);
    } else {
      value = valueOrOptions;
    }
    return addEntry(new _performanceEntry.PerformanceMetric(name, {
      startTime: startTime ? startTime : now(),
      value,
      detail
    }));
  };
  const getEntries = () => entries.slice(0);
  const getEntriesByName = (name, type) => entries.filter(entry => entry.name === name && (!type || entry.entryType === type));
  function getEntriesByType(type) {
    return entries.filter(entry => entry.entryType === type);
  }
  const PerformanceObserver = (0, _performanceObserver.createPerformanceObserver)({
    addEventListener,
    removeEventListener,
    getEntriesByType
  });
  return {
    PerformanceObserver,
    addEntry,
    performance: {
      timeOrigin,
      now,
      mark,
      clearMarks,
      measure,
      clearMeasures,
      metric,
      clearMetrics,
      getEntries,
      getEntriesByName,
      getEntriesByType
    }
  };
};
exports.createPerformance = createPerformance;
//# sourceMappingURL=performance.js.map