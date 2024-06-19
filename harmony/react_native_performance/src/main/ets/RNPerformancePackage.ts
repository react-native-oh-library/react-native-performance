import { RNPackage, TurboModulesFactory } from '@rnoh/react-native-openharmony/ts';
import type { TurboModule, TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { RNPerformanceTurboModule } from './RNPerformanceTurboModule';
import { TM } from "@rnoh/react-native-openharmony/generated/ts"

class RNPerformanceTurboModuleFactory extends TurboModulesFactory {
  constructor(protected ctx: TurboModuleContext) {
    super(ctx);
  }
  createTurboModule(name: string): TurboModule | null {
    if (this.hasTurboModule(name)) {
      return new RNPerformanceTurboModule(this.ctx);
    }
    return null;
  }

  hasTurboModule(name: string): boolean {
    return name === TM.PerformanceNativeModule.NAME;
  }

}

export class RNPerformancePackage extends RNPackage {
  createTurboModulesFactory(ctx: TurboModuleContext): TurboModulesFactory {
    return new RNPerformanceTurboModuleFactory(ctx);
  }
}