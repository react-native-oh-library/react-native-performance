/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */
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