import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
type EntryType = "mark" | "measure" | "resource" | "metric" | "react-native-mark";
export interface Spec extends TurboModule {
    now(): number;
    timeOrigin(): number;
    mark(markName: string, markOptions: Object | undefined): void;
    clearMarks(name?: string): void;
    measure(measureName: string, startOrMeasureOptions?: Object | undefined, endMark?: string | number | undefined): Object;
    clearMeasures(name?: string): void;
    metric(name: string, valueOrOptions: Object): Object;
    clearMetrics(name?: string): void;
    getEntries(): Object[];
    getEntriesByName(name: string, type?: EntryType): Object[];
    getEntriesByType(type: EntryType): Object[];
    getPerformanceObserver(callback: (list: Object, observer: Object) => void, observeOption: Object): void;
    returnMessage(): string;
    addListener: (eventName: string) => void;
    removeListeners: (count: number) => void;
}
declare const _default: Spec;
export default _default;
//# sourceMappingURL=NativePerformance.d.ts.map