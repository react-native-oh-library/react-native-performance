import { Tester, Filter } from '@rnoh/testerino';
import React, { useState,useEffect } from 'react';
import {
  ScrollView, StyleSheet, View, Text, Button, Alert, FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import performance,{PerformanceObserver,setResourceLoggingEnabled} from '@react-native-oh-tpl/react-native-performance'
export function TestNativePerformance({ filter }: { filter: Filter }) {
  const scrollRef = React.useRef<ScrollView>(null);
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
    <View style={{ width: '100%', height: '100%'}}>
      <Tester style={styles.container} filter={filter}>
        <ScrollView style={{flex:1}} ref={scrollRef}>
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
      </Tester>
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
