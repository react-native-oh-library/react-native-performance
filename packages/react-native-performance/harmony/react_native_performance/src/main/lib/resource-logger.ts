import { PerformanceResourceTiming } from './performance-entry';
import type { PerformanceEntry } from './performance-entry';
import type { Performance } from './performance';
import type{XMLHttpRequest}from './globals'
interface XMLHttpRequestType extends XMLHttpRequest {
  new (...args: any): XMLHttpRequestType;
  performanceOriginal?: XMLHttpRequest;
  performanceStartTime?: number;
  responseURL: string;
  responseHeaders: string[];
  _performanceLogger?:any
}
interface Context {
  XMLHttpRequest: XMLHttpRequestType;
}
export function installResourceLogger(
  xhr: XMLHttpRequestType,
  performance: Performance,
  addEntry: (entry: PerformanceEntry) => PerformanceEntry){

  if (xhr) {
    let time=performance.now()
    console.log("尝试打印一下performanc",JSON.stringify(time))
    console.log("尝试打印一下xhr1",JSON.stringify(xhr))
    xhr.addEventListener('readystatechange',()=>{
      console.log("尝试打印一下xhr2",JSON.stringify(xhr))
    })
    return addEntry(
      new PerformanceResourceTiming({
        name:"测试",
        startTime: 111111111111,
        duration: 100,
        initiatorType: 'xmlhttprequest',
        responseEnd: 2222222222222,
        transferSize: 10
      })
    );
  }
}


export function uninstallResourceLogger(xhr){
  if (xhr && xhr.performanceOriginal) {
    xhr = xhr.performanceOriginal;
  }
};
