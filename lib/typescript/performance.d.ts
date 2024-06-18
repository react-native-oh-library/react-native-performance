import { EntryType, PerformanceMark, PerformanceMeasure, PerformanceMetric, PerformanceEntry, PerformanceReactNativeMark, PerformanceResourceTiming } from './performance-entry';
export declare const defaultNow: () => number;
export type MarkOptions = {
    startTime?: number;
    detail?: any;
};
export type MeasureOptions = {
    start?: string | number;
    end?: string | number;
    duration?: number;
    detail?: any;
};
export type StartOrMeasureOptions = string | MeasureOptions | undefined;
export type MetricOptions = {
    startTime: number;
    detail: any;
    value: number | string;
};
export type ValueOrOptions = number | string | MetricOptions;
export declare const createPerformance: (now?: () => number) => {
    PerformanceObserver: {
        new (callback: (list: import("./performance-observer").PerformanceObserverEntryList, observer: {
            callback: (list: import("./performance-observer").PerformanceObserverEntryList, observer: any) => void;
            buffer: PerformanceEntry[];
            entryTypes: Set<EntryType>;
            timer?: number;
            observerType: "single" | "multiple";
            emitRecords: () => void;
            scheduleEmission(): void;
            receiveRecord: (entry: PerformanceEntry) => void;
            observe(options: {
                entryTypes: EntryType[];
            }): void;
            observe(options: {
                type: EntryType;
                buffered?: boolean;
            }): void;
            disconnect(): void;
            takeRecords(): PerformanceEntry[];
        }) => void): {
            callback: (list: import("./performance-observer").PerformanceObserverEntryList, observer: any) => void;
            buffer: PerformanceEntry[];
            entryTypes: Set<EntryType>;
            timer?: number;
            observerType: "single" | "multiple";
            emitRecords: () => void;
            scheduleEmission(): void;
            receiveRecord: (entry: PerformanceEntry) => void;
            observe(options: {
                entryTypes: EntryType[];
            }): void;
            observe(options: {
                type: EntryType;
                buffered?: boolean;
            }): void;
            disconnect(): void;
            takeRecords(): PerformanceEntry[];
        };
        supportedEntryTypes: string[];
    };
    addEntry: <T extends PerformanceEntry>(entry: T) => T;
    performance: {
        timeOrigin: number;
        now: () => number;
        mark: (markName: string, markOptions?: MarkOptions) => PerformanceMark;
        clearMarks: (name?: string) => void;
        measure: (measureName: string, startOrMeasureOptions?: StartOrMeasureOptions, endMark?: string | number) => PerformanceMeasure;
        clearMeasures: (name?: string) => void;
        metric: (name: string, valueOrOptions: ValueOrOptions) => PerformanceMetric;
        clearMetrics: (name?: string) => void;
        getEntries: () => PerformanceEntry[];
        getEntriesByName: (name: string, type?: EntryType) => PerformanceEntry[];
        getEntriesByType: {
            (type: 'measure'): PerformanceMeasure[];
            (type: 'mark'): PerformanceMark[];
            (type: 'resource'): PerformanceResourceTiming[];
            (type: 'metric'): PerformanceMetric[];
            (type: 'react-native-mark'): PerformanceReactNativeMark[];
        };
    };
};
export type Performance = ReturnType<typeof createPerformance>['performance'];
//# sourceMappingURL=performance.d.ts.map