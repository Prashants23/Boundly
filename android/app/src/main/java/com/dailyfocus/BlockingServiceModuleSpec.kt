package com.dailyfocus

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule

/**
 * BlockingServiceModule TurboModule Spec
 * 
 * Controls the BlockingService foreground service.
 */
@ReactModule(name = BlockingServiceModuleSpec.NAME)
abstract class BlockingServiceModuleSpec internal constructor(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context), TurboModule {

    companion object {
        const val NAME = "BlockingServiceModule"
    }

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    abstract fun startBlockingService(selectedApps: ReadableArray, limits: ReadableArray, promise: Promise)

    @ReactMethod
    abstract fun stopBlockingService(promise: Promise)

    @ReactMethod
    abstract fun isBlockingServiceRunning(promise: Promise)
    
    @ReactMethod
    abstract fun isAccessibilityServiceEnabled(promise: Promise)
    
    @ReactMethod
    abstract fun openAccessibilitySettings(promise: Promise)
}

