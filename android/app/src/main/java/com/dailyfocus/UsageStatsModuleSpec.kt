package com.dailyfocus

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule

/**
 * UsageStatsModule TurboModule Spec
 * 
 * This implements the TurboModule interface for UsageStatsManager access.
 * The spec is defined in NativeUsageStatsModule.ts and Codegen generates the interface.
 */
@ReactModule(name = UsageStatsModuleSpec.NAME)
abstract class UsageStatsModuleSpec internal constructor(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context), TurboModule {

    companion object {
        const val NAME = "UsageStatsModule"
    }

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    abstract fun getTodayUsageStats(promise: Promise)

    @ReactMethod
    abstract fun getAppUsageToday(packageName: String, promise: Promise)

    @ReactMethod
    abstract fun hasUsageStatsPermission(promise: Promise)

    @ReactMethod
    abstract fun openUsageStatsSettings(promise: Promise)
}

