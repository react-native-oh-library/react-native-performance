/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */
import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry} from 'react-native';
type EntryType = "mark" | "measure" | "resource" | "metric" | "react-native-mark"
export interface Spec extends TurboModule {
    now():number;
    timeOrigin():number;
    mark(markName: string, markOptions:Object|undefined):void;
    clearMarks(name?: string):void;
    measure(measureName: string, startOrMeasureOptions?: Object|undefined, endMark?: string | number|undefined):Object;
    clearMeasures(name?: string):void;
    metric(name: string, valueOrOptions:Object):Object;
    clearMetrics(name?: string):void;
    getEntries():Object[];
    getEntriesByName(name: string, type?:EntryType):Object[];
    getEntriesByType(type: EntryType):Object[]; 
    getPerformanceObserver(callback:(list:Object,observer:Object)=>void,observeOption:Object):void;
    returnMessage():string;
    // Events
    addListener: (eventName: string) => void;
    removeListeners: (count: number) => void;
} 
 
export default TurboModuleRegistry.get<Spec>('PerformanceNativeModule') as Spec | null;