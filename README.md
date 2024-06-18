# React Native OpenHarmony TPL(third-party-library) Performance API

## 安装与使用

请到三方库的 Releases 发布地址查看配套的版本信息：[@react-native-oh-tpl/react-native-performance Releases](https://github.com/react-native-oh-library/react-native-performance/releases)，并下载适用版本的 tgz 包。

进入到工程目录并输入以下命令：

> [!TIP] # 处替换为 tgz 包的路径
<!-- tabs:start -->

#### **npm**

```bash
npm install @react-native-oh-tpl/react-native-performance@file:#
```

#### **yarn**

```bash
yarn add @react-native-oh-tpl/react-native-performance@file:#
```
## Link

目前鸿蒙暂不支持 AutoLink，所以 Link 步骤需要手动配置。

首先需要使用 DevEco Studio 打开项目里的鸿蒙工程 `harmony`

### 在工程根目录的 `oh-package.json` 添加 overrides 字段

```json
{
  ...
  "overrides": {
    "@rnoh/react-native-openharmony" : "./react_native_openharmony"
  }
}
```

### 引入原生端代码

目前有两种方法：

1. 通过 har 包引入（在 IDE 完善相关功能后该方法会被遗弃，目前首选此方法）；
2. 直接链接源码。

方法一：通过 har 包引入（推荐）

> [!TIP] har 包位于三方库安装路径的 `harmony` 文件夹下。

打开 `entry/oh-package.json5`，添加以下依赖

```json
"dependencies": {
    "@rnoh/react-native-openharmony": "file:../react_native_openharmony",
    "@react-native-oh-tpl/react-native-performance": "file:../../node_modules/@react-native-oh-tpl/react-native-performance/harmony/react_native_performance.har"
  }
```

点击右上角的 `sync` 按钮

或者在终端执行：

```bash
cd entry
ohpm install
```

方法二：直接链接源码

> [!TIP] 如需使用直接链接源码，请参考[直接链接源码说明](/zh-cn/link-source-code.md)

### 配置 CMakeLists 和引入 xxxPackge

打开 `entry/src/main/cpp/CMakeLists.txt`，添加：

```diff
project(rnapp)
cmake_minimum_required(VERSION 3.4.1)
set(CMAKE_SKIP_BUILD_RPATH TRUE)
set(RNOH_APP_DIR "${CMAKE_CURRENT_SOURCE_DIR}")
set(NODE_MODULES "${CMAKE_CURRENT_SOURCE_DIR}/../../../../../node_modules")
+ set(OH_MODULES "${CMAKE_CURRENT_SOURCE_DIR}/../../../oh_modules")
set(RNOH_CPP_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../../../../../react-native-harmony/harmony/cpp")
set(LOG_VERBOSITY_LEVEL 1)
set(CMAKE_ASM_FLAGS "-Wno-error=unused-command-line-argument -Qunused-arguments")
set(CMAKE_CXX_FLAGS "-fstack-protector-strong -Wl,-z,relro,-z,now,-z,noexecstack -s -fPIE -pie")
set(WITH_HITRACE_SYSTRACE 1) # for other CMakeLists.txt files to use
add_compile_definitions(WITH_HITRACE_SYSTRACE)

add_subdirectory("${RNOH_CPP_DIR}" ./rn)

# RNOH_BEGIN: manual_package_linking_1
add_subdirectory("../../../../sample_package/src/main/cpp" ./sample-package)
# RNOH_END: manual_package_linking_1

file(GLOB GENERATED_CPP_FILES "./generated/*.cpp")

add_library(rnoh_app SHARED
    ${GENERATED_CPP_FILES}
    "./PackageProvider.cpp"
    "${RNOH_CPP_DIR}/RNOHAppNapiBridge.cpp"
)
target_link_libraries(rnoh_app PUBLIC rnoh)

# RNOH_BEGIN: manual_package_linking_2
target_link_libraries(rnoh_app PUBLIC rnoh_sample_package)
# RNOH_END: manual_package_linking_2
```

### 在 ArkTs 侧引入 RNPerformancePackage

打开 `entry/src/main/ets/RNPackagesFactory.ts`，添加：

```diff
...
+ import {RNPerformancePackage} from '@react-native-oh-tpl/react-native-performance/ts';

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
    new SamplePackage(ctx),
+   new RNPerformancePackage(ctx)
  ];
}
```

### 运行

点击右上角的 `sync` 按钮

或者在终端执行：

```bash
cd entry
ohpm install
```

然后编译、运行即可。

## 约束与限制

### 兼容性

要使用此库，需要使用正确的 React-Native 和 RNOH 版本。另外，还需要使用配套的 DevEco Studio 和 手机 ROM。

请到三方库相应的 Releases 发布地址查看 Release 配套的版本信息：[@react-native-oh-tpl/react-native-file-viewer Releases](https://github.com/react-native-oh-library/react-native-file-viewer/releases)

本文档内容基于以下版本验证通过：
1. RNOH: 0.72.20-CAPI; SDK: HarmonyOS NEXT Developer Beta1; IDE: DevEco Studio 5.0.3.200; ROM: 3.0.0.18;
This is an implementation of the [`Performance` API](https://developer.mozilla.org/en-US/docs/Web/API/Performance) for React Native based on the [User Timing Level 3](https://www.w3.org/TR/user-timing-3/) and [Performance Timeline Level 2](https://www.w3.org/TR/performance-timeline-2/) drafts.
## API
_Note_: The timestamps used are high resolution (fractions of milliseconds) and monotonically increasing, meaning that they are independent of system clock adjustments. To convert a performance timestamp to a unix epoch timestamp do like this:

```js
const timestamp = Date.now() - performance.timeOrigin + entry.startTime;
```

## Usage

### Basic measure example

Marking timeline events, measuring the duration between them and fetching these entries [works just like on the web](https://developer.mozilla.org/en-US/docs/Web/API/Performance):

```js
import performance from '@react-native-oh-tpl/react-native-performance';

performance.mark('myMark');
performance.measure('myMeasure', 'myMark');
performance.getEntriesByName('myMeasure');
-> [{ name: "myMeasure", entryType: "measure", startTime: 98, duration: 123 }]
```

### Meta data

If you want to add some additional details to your measurements or marks, you may pass a second options object argument with a `detail` entry per the [User Timing Level 3](https://www.w3.org/TR/user-timing-3/) draft:

```js
import performance from '@react-native-oh-tpl/react-native-performance';

performance.mark('myMark', {
  detail: {
    screen: 'settings',
    ...
  }
});
performance.measure('myMeasure', {
  start: 'myMark',
  detail: {
    category: 'render',
    ...
  }
});
performance.getEntriesByType('measure');
-> [{ name: "myMeasure", entryType: "measure", startTime: 98, duration: 123, detail: { ... } }]
```

### Subscribing to entries

The `PerformanceObserver` API enables subscribing to different types of performance entries. The handler is called in batches.

Passing `buffered: true` would include entries produced before the `observe()` call which is useful to delay handing of measurements until after performance critical startup processing.

```js
import { PerformanceObserver } from '@react-native-oh-tpl/react-native-performance';
const measureObserver = new PerformanceObserver((list, observer) => {
  list.getEntries().forEach((entry) => {
    console.log(`${entry.name} took ${entry.duration}ms`);
  });
});
measureObserver.observe({ type: 'measure', buffered: true });
```

### Network resources

Resource logging is disabled by default and currently will only cover `fetch`/`XMLHttpRequest` uses.

```js
import performance, {
  setResourceLoggingEnabled,
} from '@react-native-oh-tpl/react-native-performance';

setResourceLoggingEnabled(true);

await fetch('https://domain.com');
performance.getEntriesByType('resource');
-> [{
  name: "https://domain.com",
  entryType: "resource",
  startTime: 98,
  duration: 123,
  initiatorType: "xmlhttprequest", // fetch is a polyfill on top of XHR in react-native
  fetchStart: 98,
  responseEnd: 221,
  transferSize: 456,
  ...
}]
```

### Custom metrics

If you want to collect custom metrics not based on time, this module provides an extension of the `Performance` API called `.metric()` that produces entries with the type `metric`.

```js
import performance from '@react-native-oh-tpl/react-native-performance';

performance.metric('myMetric', 123);
performance.getEntriesByType('metric');
-> [{ name: "myMetric", entryType: "metric", startTime: 98, duration: 0, value: 123 }]
```
