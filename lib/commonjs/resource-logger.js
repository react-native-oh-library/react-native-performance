"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uninstallResourceLogger = exports.installResourceLogger = void 0;
var _performanceEntry = require("./performance-entry");
const installResourceLogger = (context, performance, addEntry) => {
  if (context.XMLHttpRequest && !context.XMLHttpRequest.performanceOriginal) {
    class XMLHttpRequest extends context.XMLHttpRequest {
      constructor(...args) {
        super(...args);
        this.performanceStartTime = null;
        super.addEventListener('readystatechange', () => {
          if (this.readyState === this.DONE) {
            if (this.responseURL && this.responseHeaders) {
              const responseEnd = performance.now();
              const contentLength = Object.entries(this.responseHeaders).find(([header]) => header.toLowerCase() === 'content-length');
              addEntry(new _performanceEntry.PerformanceResourceTiming({
                name: this.responseURL,
                startTime: this.performanceStartTime,
                duration: responseEnd - this.performanceStartTime,
                initiatorType: 'xmlhttprequest',
                responseEnd,
                transferSize: contentLength ? parseInt(contentLength[1]) : 0
              }));
            }
          }
        });
      }
      open(...args) {
        this.performanceStartTime = performance.now();
        //@ts-ignore
        super.open(...args);
      }
    }
    XMLHttpRequest.performanceOriginal = context.XMLHttpRequest;
    context.XMLHttpRequest = XMLHttpRequest;
  }
};
exports.installResourceLogger = installResourceLogger;
const uninstallResourceLogger = context => {
  if (context.XMLHttpRequest && context.XMLHttpRequest.performanceOriginal) {
    context.XMLHttpRequest = context.XMLHttpRequest.performanceOriginal;
  }
};
exports.uninstallResourceLogger = uninstallResourceLogger;
//# sourceMappingURL=resource-logger.js.map