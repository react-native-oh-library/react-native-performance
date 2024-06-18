import { PerformanceReactNativeMark, PerformanceMetric } from './performance-entry';
declare const PerformanceObserver: {
    new (callback: (list: import("./performance-observer").PerformanceObserverEntryList, observer: {
        callback: (list: import("./performance-observer").PerformanceObserverEntryList, observer: any) => void;
        buffer: import("./performance-entry").PerformanceEntry[];
        entryTypes: Set<import("./performance-entry").EntryType>;
        timer?: number;
        observerType: "single" | "multiple";
        emitRecords: () => void;
        scheduleEmission(): void;
        receiveRecord: (entry: import("./performance-entry").PerformanceEntry) => void;
        observe(options: {
            entryTypes: import("./performance-entry").EntryType[];
        }): void;
        observe(options: {
            type: import("./performance-entry").EntryType;
            buffered?: boolean;
        }): void;
        disconnect(): void;
        takeRecords(): import("./performance-entry").PerformanceEntry[];
    }) => void): {
        callback: (list: import("./performance-observer").PerformanceObserverEntryList, observer: any) => void;
        buffer: import("./performance-entry").PerformanceEntry[];
        entryTypes: Set<import("./performance-entry").EntryType>;
        timer?: number;
        observerType: "single" | "multiple";
        emitRecords: () => void;
        scheduleEmission(): void;
        receiveRecord: (entry: import("./performance-entry").PerformanceEntry) => void;
        observe(options: {
            entryTypes: import("./performance-entry").EntryType[];
        }): void;
        observe(options: {
            type: import("./performance-entry").EntryType;
            buffered?: boolean;
        }): void;
        disconnect(): void;
        takeRecords(): import("./performance-entry").PerformanceEntry[];
    };
    supportedEntryTypes: string[];
}, performance: {
    timeOrigin: number;
    now: () => number;
    mark: (markName: string, markOptions?: import("./performance").MarkOptions) => import("./performance-entry").PerformanceMark;
    clearMarks: (name?: string) => void;
    measure: (measureName: string, startOrMeasureOptions?: import("./performance").StartOrMeasureOptions, endMark?: string | number) => import("./performance-entry").PerformanceMeasure;
    clearMeasures: (name?: string) => void;
    metric: (name: string, valueOrOptions: import("./performance").ValueOrOptions) => PerformanceMetric;
    clearMetrics: (name?: string) => void;
    getEntries: () => import("./performance-entry").PerformanceEntry[];
    getEntriesByName: (name: string, type?: import("./performance-entry").EntryType) => import("./performance-entry").PerformanceEntry[];
    getEntriesByType: {
        (type: "measure"): import("./performance-entry").PerformanceMeasure[];
        (type: "mark"): import("./performance-entry").PerformanceMark[];
        (type: "resource"): import("./performance-entry").PerformanceResourceTiming[];
        (type: "metric"): PerformanceMetric[];
        (type: "react-native-mark"): PerformanceReactNativeMark[];
    };
};
export default performance;
export type Performance = typeof performance;
export declare const setResourceLoggingEnabled: (enabled?: boolean) => void;
export { PerformanceObserver };
export type { EntryType, PerformanceMark, PerformanceMeasure, PerformanceMetric, PerformanceEntry, PerformanceReactNativeMark, PerformanceResourceTiming, } from './performance-entry';
//# sourceMappingURL=index.d.ts.map