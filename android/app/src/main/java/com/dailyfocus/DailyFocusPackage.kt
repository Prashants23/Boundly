package com.dailyfocus

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 * Legacy Package for backward compatibility
 * 
 * Note: With New Architecture, TurboModules are registered via DailyFocusTurboModulePackage.
 * This package is kept for backward compatibility with old architecture.
 */
class DailyFocusPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        // TurboModules are handled by DailyFocusTurboModulePackage
        // This is kept for backward compatibility
        return emptyList()
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}

