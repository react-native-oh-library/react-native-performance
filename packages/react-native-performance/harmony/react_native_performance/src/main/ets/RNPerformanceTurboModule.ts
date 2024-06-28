import type { TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { TM } from "@rnoh/react-native-openharmony/generated/ts"
import { TurboModule} from '@rnoh/react-native-openharmony/ts'
import systemDateTime from '@ohos.systemDateTime';
import process from '@ohos.process';
import Logger from './Logger'

export class RNPerformanceTurboModule extends TurboModule implements TM.PerformanceNativeModule.Spec {
  private timeOrin;
  // ----------------------------
  private startTime:number=0;
  private endTime:number=0;

  constructor(protected ctx: TurboModuleContext) {
    super(ctx);
    this.timeOrin = Date.now()
    this.setupMarkerListener();
  }
  async initialTimeProvider(){
    if (this.endTime == 0) {
      let timeSpan=0;
      await systemDateTime.getRealActiveTime().then((time: number) => {
        Logger.info(`Succeeded in getting real active time1 : ${time}`);
        timeSpan=time;
      }).catch((error: Error) => {
        Logger.info(`Failed to get real active time. message: ${error}`);
      });
      Logger.info(`Succeeded in getting real active time2 : ${timeSpan}`);
      this.endTime=timeSpan;
    }
    if (this.startTime == 0) {
      let realtime = process.getStartRealtime();
      this.startTime = this.endTime - realtime;
    }
  }
  async setupMarkerListener(){
    await this.initialTimeProvider();
    let startTime=this.startTime;
    let endTime=this.endTime;
    Logger.info(`Succeeded in getting real active time2 : ${startTime}以及endtime${endTime}`);
    this.ctx.rnInstance.emitDeviceEvent('mark',{
      name:'nativeLaunchStart',
      startTime,
      detail:'Native process initialization started'
    })
    this.ctx.rnInstance.emitDeviceEvent('mark',{
      name:'nativeLaunchEnd',
      startTime:endTime,
      detail:'Native process initialization ended'
    })
  }

  addListener(eventName: string){
    Logger.info(`Succeeded in getting addListener`);
  }
  removeListeners(count: number){
    Logger.info(`Succeeded in getting removeListeners`);
  }
  returnMessage(): string {
    return "从你的全世界路过";
  }
}