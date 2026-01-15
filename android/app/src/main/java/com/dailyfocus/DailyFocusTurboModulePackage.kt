package com.dailyfocus

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import java.util.HashMap

/**
 * TurboModule Package for New Architecture
 * 
 * This package registers TurboModules for the New Architecture.
 * TurboModules are automatically discovered, but we need to provide the implementations.
 */
class DailyFocusTurboModulePackage : TurboReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return when (name) {
            UsageStatsModuleSpec.NAME -> UsageStatsModuleImpl(reactContext)
            ForegroundAppModuleSpec.NAME -> ForegroundAppModuleImpl(reactContext)
            BlockingServiceModuleSpec.NAME -> BlockingServiceModuleImpl(reactContext)
            else -> null
        }
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
            
            moduleInfos[UsageStatsModuleSpec.NAME] = ReactModuleInfo(
                UsageStatsModuleSpec.NAME,
                UsageStatsModuleSpec.NAME,
                false, // canOverrideExistingModule
                true,  // needsEagerInit
                true,  // hasConstants
                false, // isCxxModule
                true   // isTurboModule
            )
            
            moduleInfos[ForegroundAppModuleSpec.NAME] = ReactModuleInfo(
                ForegroundAppModuleSpec.NAME,
                ForegroundAppModuleSpec.NAME,
                false, // canOverrideExistingModule
                true,  // needsEagerInit
                true,  // hasConstants
                false, // isCxxModule
                true   // isTurboModule
            )
            
            moduleInfos[BlockingServiceModuleSpec.NAME] = ReactModuleInfo(
                BlockingServiceModuleSpec.NAME,
                BlockingServiceModuleSpec.NAME,
                false, // canOverrideExistingModule
                true,  // needsEagerInit
                true,  // hasConstants
                false, // isCxxModule
                true   // isTurboModule
            )
            
            moduleInfos
        }
    }
}

