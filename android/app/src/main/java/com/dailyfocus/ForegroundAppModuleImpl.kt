package com.dailyfocus

import android.app.ActivityManager
import android.content.Context
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableNativeMap

/**
 * ForegroundAppModule Implementation
 * 
 * Implements the TurboModule spec for detecting current foreground app.
 */
class ForegroundAppModuleImpl(reactContext: ReactApplicationContext) :
    ForegroundAppModuleSpec(reactContext) {

    private fun getActivityManager(): ActivityManager? {
        val context = reactApplicationContext.applicationContext
        return context.getSystemService(Context.ACTIVITY_SERVICE) as? ActivityManager
    }

    private fun getPackageManager(): PackageManager {
        return reactApplicationContext.applicationContext.packageManager
    }

    override fun getCurrentForegroundApp(promise: Promise) {
        try {
            val activityManager = getActivityManager() ?: run {
                promise.resolve(null)
                return
            }

            val packageName = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                getForegroundAppAndroid10Plus(activityManager)
            } else {
                getForegroundAppLegacy(activityManager)
            }

            if (packageName == null) {
                promise.resolve(null)
                return
            }

            if (packageName == reactApplicationContext.packageName) {
                promise.resolve(null)
                return
            }

            val packageManager = getPackageManager()
            try {
                val appInfo = packageManager.getApplicationInfo(packageName, 0)
                val appName = packageManager.getApplicationLabel(appInfo).toString()

                val result = WritableNativeMap()
                result.putString("packageName", packageName)
                result.putString("appName", appName)
                promise.resolve(result)
            } catch (e: PackageManager.NameNotFoundException) {
                promise.resolve(null)
            }
        } catch (e: Exception) {
            promise.reject("FOREGROUND_APP_ERROR", "Error getting foreground app: ${e.message}", e)
        }
    }

    private fun getForegroundAppAndroid10Plus(activityManager: ActivityManager): String? {
        val runningProcesses = activityManager.runningAppProcesses ?: return null

        for (processInfo in runningProcesses) {
            if (processInfo.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                val packageName = processInfo.pkgList?.firstOrNull()
                if (packageName != null) {
                    return packageName
                }
            }
        }

        return null
    }

    @Suppress("DEPRECATION")
    private fun getForegroundAppLegacy(activityManager: ActivityManager): String? {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            val runningTasks = activityManager.appTasks
            if (runningTasks.isNotEmpty()) {
                return null
            }
        }

        return getForegroundAppAndroid10Plus(activityManager)
    }

    override fun addForegroundAppListener(callback: com.facebook.react.bridge.Callback) {
        // For MVP, we'll handle this in JS layer with periodic checks
        // This is a placeholder for future implementation
    }

    override fun removeForegroundAppListener() {
        // Placeholder
    }
}

