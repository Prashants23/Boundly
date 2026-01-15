package com.dailyfocus

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule

/**
 * ForegroundAppModule TurboModule Spec
 * 
 * This implements the TurboModule interface for detecting foreground apps.
 * The spec is defined in NativeForegroundAppModule.ts and Codegen generates the interface.
 */
@ReactModule(name = ForegroundAppModuleSpec.NAME)
abstract class ForegroundAppModuleSpec internal constructor(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context), TurboModule {

    companion object {
        const val NAME = "ForegroundAppModule"
    }

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    abstract fun getCurrentForegroundApp(promise: Promise)

    @ReactMethod
    abstract fun addForegroundAppListener(callback: com.facebook.react.bridge.Callback)

    @ReactMethod
    abstract fun removeForegroundAppListener()
}

