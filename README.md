> 模板版本：v0.2.2

<p align="center">
  <h1 align="center"> <code>react-native-performance</code> </h1>
</p>
<p align="center">
    <a href="https://github.com/oblador/react-native-performance">
        <img src="https://img.shields.io/badge/platforms-android%20|%20ios%20|%20harmony%20-lightgrey.svg" alt="Supported platforms" />
    </a>
    <a href="https://github.com/oblador/react-native-performance/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
        <!-- <img src="https://img.shields.io/badge/license-Apache-blue.svg" alt="License" /> -->
    </a>
</p>

> [!TIP] [Github 地址](https://github.com/react-native-oh-library/react-native-performance)


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

<!-- tabs:end -->

下面的代码展示了这个库的基本使用场景：

> [!WARNING] 使用时 import 的库名不变。

```js
import React, { useState,useEffect } from 'react';
import {
  ScrollView, StyleSheet, View, Text, Button, Alert, FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import performance,{PerformanceObserver,setResourceLoggingEnabled} from '@react-native-oh-tpl/react-native-performance'
export function TestNativePerformance() {
  const [result1, setResult1] = React.useState(0)
  const [result2, setResult2] = React.useState('')
  const [result3, setResult3] = React.useState('')
  const [result4, setResult4] = React.useState('')
  const [result5, setResult5] = React.useState('')
  const [result6, setResult6] = React.useState('')
  const [result7, setResult7] = React.useState('')
  const handleTimeStampClick1 = () => {
    performance.mark('entry');
    let entry=performance.getEntriesByName('entry')[0];
    const timestamp = Date.now() - performance.timeOrigin + entry.startTime;
    setResult1(timestamp)
  }
  const handleTimeStampClick2 = () => {
    performance.mark('myMark');
    performance.measure('myMeasure2', 'myMark');
    let ms=performance.getEntriesByName('myMeasure2');
    // -> [{ name: "myMeasure", entryType: "measure", startTime: 98, duration: 123 }]
    setResult2(JSON.stringify(ms))
  }
  const handleTimeStampClick3 = () => {
    performance.mark('myMark', {
      detail: {
        screen: 'settings'
      }
    });
    performance.measure('myMeasure3', {
      start: 'myMark',
      detail: {
        category: 'render'
      }
    });
    let ms=performance.getEntriesByName('myMeasure3');
    // -> [{ name: "myMeasure", entryType: "measure", startTime: 98, duration: 123, detail: { ... } }]
    setResult3(JSON.stringify(ms))
  }
  const handleTimeStampClick4 = () => {
    performance.mark('newTimeMark')
    performance.measure('newTime','newTimeMark')
    const measureObserver = new PerformanceObserver((list, observer) => {
      let res=[];
      list.getEntries().forEach((entry) => {
        res.push(JSON.stringify(entry));
      });
      setResult4(res.join(','))
    });
    measureObserver.observe({ type: 'measure', buffered: true });
  }
  const handleTimeStampClick5 = async () => {
    setResourceLoggingEnabled(true);
    await fetch('https://www.baidu.com');
    let res=performance.getEntriesByType('resource');
    setResult5(JSON.stringify(res))
    // -> [{
    //   name: "https://www.baidu.com",
    //   entryType: "resource",
    //   startTime: 98,
    //   duration: 123,
    //   initiatorType: "xmlhttprequest", // fetch is a polyfill on top of XHR in react-native
    //   fetchStart: 98,
    //   responseEnd: 221,
    //   transferSize: 456,
    //   ...
    // }]
  }
  const handleTimeStampClick6 =() => {
    performance.metric('myMetric', 123);
    let res=performance.getEntriesByType('metric');
    setResult6(JSON.stringify(res))
// -> [{ name: "myMetric", entryType: "metric", startTime: 98, duration: 0, value: 123 }]
  }
  const handleTimeStampClick7 =() => {
    let res=performance.getEntriesByType('react-native-mark');
    setResult7(JSON.stringify(res))
  }
  
  
  return (
    <View style={styles.container}>
        <ScrollView style={{flex:1}}>
          <View style={styles.rowStyle}>
          
          <Button
            onPress={handleTimeStampClick1}
            title="Convert a performance timestamp"
          />
          <Text style={styles.fontstyle}>{'展示result1：' + result1}</Text>
          </View>
          <View style={styles.rowStyle}>
          
          <Button
            onPress={handleTimeStampClick2}
            title="Basic measure example"
          />
          <Text style={styles.fontstyle}>{'展示result2：' + result2}</Text>
          </View>
          <View style={styles.rowStyle}>
          
          <Button
            onPress={handleTimeStampClick3}
            title="Meta data"
          />
          <Text style={styles.fontstyle}>{'展示result3：' + result3}</Text>
          </View>
          <View style={styles.rowStyle}>
          
          <Button
            onPress={handleTimeStampClick4}
            title="Subscribing to entries"
          />
          <Text style={styles.fontstyle}>{'展示result4：' + result4}</Text>
          </View>
          <View style={styles.rowStyle}>
          
          <Button
            onPress={handleTimeStampClick5}
            title="Network resources"
          />
          <Text style={styles.fontstyle}>{'展示result5：' + result5}</Text>
          </View>
          <View style={styles.rowStyle}>
          
          <Button
            onPress={handleTimeStampClick6}
            title="Custom metrics"
          />
          <Text style={styles.fontstyle}>{'展示result6：' + result6}</Text>
          </View>
          <View style={styles.rowStyle}>
          
          <Button
            onPress={handleTimeStampClick7}
            title="React Native Marks"
          />
          <Text style={styles.fontstyle}>{'展示result7：' + result7}</Text>
          </View>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rowStyle:{
    marginBottom:20
  },
  fontstyle: {
    fontSize: 32,
    fontWeight: 600
  },
  container: {
    width: '100%', height: '100%', backgroundColor: '#fffafa' 
  }
});

```
## 使用 Codegen

本库已经适配了 `Codegen` ，在使用前需要主动执行生成三方库桥接代码，详细请参考[ Codegen 使用文档](https://gitee.com/react-native-oh-library/usage-docs/blob/master/zh-cn/codegen.md)。

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
...
```


### 在 ArkTs 侧引入 xxx Package

打开 `entry/src/main/ets/RNPackagesFactory.ts`，添加：

```diff
...
+ import {RNPerformancePackage} from 'react-native-performance/ts';

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

请到三方库相应的 Releases 发布地址查看 Release 配套的版本信息：[@react-native-oh-tpl/react-native-performance Releases](https://github.com/react-native-oh-library/react-native-performance/releases)

## API

> [!tip] "Platform"列表示该属性在原三方库上支持的平台。

> [!tip] "HarmonyOS Support"列为 yes 表示 HarmonyOS 平台支持该属性；no 则表示不支持；partially 表示部分支持。使用方法跨平台一致，效果对标 iOS 或 Android 的效果。

| Name              | Description                                                                                                                                                                   | Type            | Required | Platform        | HarmonyOS Support  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------- | ----------------| ------------------ |
| (property) timeOrigin             | 返回Performance用作性能相关时间戳基线的高分辨率时间戳         | number          | yes      | IOS/Android     |      yes           |
| (method) mark            | 根据给出 markName 值，在性能输入缓冲区中创建一个timestamp(时间戳)                                                                                                                                     | Object            | yes      | IOS/Android     |      yes           |
| (method) measure         | 性能记录缓存中使用 measure()创建一个新的测量记录如果仅指定了测量名称，则开始时间戳设置为零，结束时间戳（用于计算持续时间）是Performance.now()返回的值。可以使用字符串将PerformanceMark对象标识为开始标记和结束标记。要只提供一个endMark，您需要提供一个空的测量选项对象：performance.Measure（“myMeasure”，{}，“myEndMarker”）                                                                                                                                                   | Object           | yes      | IOS/Android     |      yes           |
| (method) getEntries          | 对于给定的 filter，此方法返回 PerformanceEntry 对象数组，如果不带任何参数，返回全部 entries                                                                                                                 | Array            | yes      | IOS/Android     |      yes           |
| (method) getEntriesByName  | 返回一个给定名称和 name 和 type 属性的PerformanceEntry对象数组                                                                                                                                                 | Array | yes      | IOS/Android     |      yes           |
| (method) getEntriesByType  | 返回一个给定type 属性的PerformanceEntry对象数组                                                                                                                                                 | Array | yes      | IOS/Android     |      yes           |
| (method) clearMarks | 从缓存中移除声明的标记。如果调用这个方法时没有传递参数，则所有带有entry type这类标记的performance entries 将从 performance entry 缓存区中被移除。                                                                                                                                               | void | yes      | IOS/Android     |      yes           |
| (method) clearMeasures  | 从缓存区中移除声明的测量记录。如果这个方法被调用时没有传入参数，则所有 entry type 标记值为"measure" 的性能实体将被从性能入口缓存区中移除。                                                                                                                                                 | void | yes      | IOS/Android     |      yes           |
|PerformanceObserver  | 给定的观察者 callback 生成一个新的 PerformanceObserver 对象。当通过 observe() 方法注册的 条目类型 的 性能条目事件 被记录下来时，调用该观察者回调。                                                                                                                                                 | Object | yes      | IOS/Android     |      yes           |
| (method)observe(options)  | observe() 方法用于观察传入的参数中指定的性能条目类型的集合。当记录一个指定类型的性能条目时，性能监测对象的回调函数将会被调用。                                                                                                                                                 | void | yes      | IOS/Android     |      yes


## 遗留问题


## 其他

## 开源协议

本项目基于 [TTHE MIT License (MIT)](https://github.com/oblador/react-native-performance/blob/master/LICENSE) ，请自由地享受和参与开源。
