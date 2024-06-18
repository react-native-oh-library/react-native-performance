"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setResourceLoggingEnabled = exports.default = exports.PerformanceObserver = void 0;
var _reactNative = require("react-native");
var _performance = require("./performance");
var _performanceEntry = require("./performance-entry");
var _resourceLogger = require("./resource-logger");
var _NativePerformance = _interopRequireDefault(require("./NativePerformance"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const {
  PerformanceObserver,
  addEntry,
  performance
} = (0, _performance.createPerformance)();
exports.PerformanceObserver = PerformanceObserver;
const RNPerformanceManager = _reactNative.TurboModuleRegistry.get('PerformanceNativeModule');
if (RNPerformanceManager) {
  //测试这个DeviceEventEmitter是不是可以接收到消息
  // console.log("看一看这个RNPerformanceManager数据是不是到啦")
  _reactNative.DeviceEventEmitter.addListener('mark', data => {
    // console.log("看一看这个DeviceEventEmitter数据是不是到啦",JSON.stringify(data))
    addEntry(new _performanceEntry.PerformanceReactNativeMark(data.name, data.startTime, data.detail));
  });
  _reactNative.DeviceEventEmitter.addListener('metric', data => {
    addEntry(new _performanceEntry.PerformanceMetric(data.name, {
      startTime: data.startTime,
      value: data.value,
      detail: data.detail
    }));
  });
}
var _default = exports.default = performance;
const setResourceLoggingEnabled = (enabled = true) => {
  if (enabled) {
    //@ts-ignore
    (0, _resourceLogger.installResourceLogger)(globalThis, performance, addEntry);
  } else {
    (0, _resourceLogger.uninstallResourceLogger)(globalThis);
  }
};
exports.setResourceLoggingEnabled = setResourceLoggingEnabled;
//# sourceMappingURL=index.js.map