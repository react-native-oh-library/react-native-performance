import { TurboModuleRegistry, DeviceEventEmitter } from 'react-native';
import { createPerformance } from './performance';
import { PerformanceReactNativeMark, PerformanceMetric } from './performance-entry';
import { installResourceLogger, uninstallResourceLogger } from './resource-logger';
import Performance from './NativePerformance';
const {
  PerformanceObserver,
  addEntry,
  performance
} = createPerformance();
const RNPerformanceManager = TurboModuleRegistry.get('PerformanceNativeModule');
if (RNPerformanceManager) {
  //测试这个DeviceEventEmitter是不是可以接收到消息
  // console.log("看一看这个RNPerformanceManager数据是不是到啦")
  DeviceEventEmitter.addListener('mark', data => {
    // console.log("看一看这个DeviceEventEmitter数据是不是到啦",JSON.stringify(data))
    addEntry(new PerformanceReactNativeMark(data.name, data.startTime, data.detail));
  });
  DeviceEventEmitter.addListener('metric', data => {
    addEntry(new PerformanceMetric(data.name, {
      startTime: data.startTime,
      value: data.value,
      detail: data.detail
    }));
  });
}
export default performance;
export const setResourceLoggingEnabled = (enabled = true) => {
  if (enabled) {
    //@ts-ignore
    installResourceLogger(globalThis, performance, addEntry);
  } else {
    uninstallResourceLogger(globalThis);
  }
};
export { PerformanceObserver };
//# sourceMappingURL=index.js.map