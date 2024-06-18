import type { EntryType, PerformanceEntry } from './performance-entry';
type ObserveOptionType1 = {
    entryTypes: EntryType[];
};
type ObserveOptionType2 = {
    type: EntryType;
    buffered?: boolean;
};
export declare class PerformanceObserverEntryList {
    entries: PerformanceEntry[];
    constructor(entries: PerformanceEntry[]);
    getEntries(): PerformanceEntry[];
    getEntriesByType(type: EntryType): PerformanceEntry[];
    getEntriesByName(name: string, type?: EntryType): PerformanceEntry[];
}
declare const OBSERVER_TYPE_SINGLE = "single";
declare const OBSERVER_TYPE_MULTIPLE = "multiple";
export declare const createPerformanceObserver: ({ addEventListener, removeEventListener, getEntriesByType }: {
    addEventListener: any;
    removeEventListener: any;
    getEntriesByType: any;
}) => {
    new (callback: (list: PerformanceObserverEntryList, observer: {
        callback: (list: PerformanceObserverEntryList, observer: any) => void;
        buffer: PerformanceEntry[];
        entryTypes: Set<EntryType>;
        timer?: number;
        observerType: null | typeof OBSERVER_TYPE_SINGLE | typeof OBSERVER_TYPE_MULTIPLE;
        emitRecords: () => void;
        scheduleEmission(): void;
        receiveRecord: (entry: PerformanceEntry) => void;
        observe(options: ObserveOptionType1): void;
        observe(options: ObserveOptionType2): void;
        disconnect(): void;
        takeRecords(): PerformanceEntry[];
    }) => void): {
        callback: (list: PerformanceObserverEntryList, observer: any) => void;
        buffer: PerformanceEntry[];
        entryTypes: Set<EntryType>;
        timer?: number;
        observerType: null | typeof OBSERVER_TYPE_SINGLE | typeof OBSERVER_TYPE_MULTIPLE;
        emitRecords: () => void;
        scheduleEmission(): void;
        receiveRecord: (entry: PerformanceEntry) => void;
        observe(options: ObserveOptionType1): void;
        observe(options: ObserveOptionType2): void;
        disconnect(): void;
        takeRecords(): PerformanceEntry[];
    };
    supportedEntryTypes: string[];
};
export {};
//# sourceMappingURL=performance-observer.d.ts.map