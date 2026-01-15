package com.dailyfocus

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.util.Log
import android.view.accessibility.AccessibilityManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import org.json.JSONArray
import org.json.JSONObject

/**
 * BlockingServiceModule Implementation
 * 
 * Controls the BlockingService foreground service.
 */
class BlockingServiceModuleImpl(reactContext: ReactApplicationContext) :
    BlockingServiceModuleSpec(reactContext) {

    private val PREFS_NAME = "blocking_config"
    private val KEY_SELECTED_APPS = "selected_apps"
    private val KEY_LIMITS = "limits"

    private fun getSharedPreferences(): SharedPreferences {
        return reactApplicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    private fun isServiceRunning(): Boolean {
        val activityManager = reactApplicationContext.getSystemService(Context.ACTIVITY_SERVICE) as android.app.ActivityManager
        val runningServices = activityManager.getRunningServices(Integer.MAX_VALUE)
        return runningServices.any { it.service.className == BlockingService::class.java.name }
    }

    override fun startBlockingService(selectedApps: ReadableArray, limits: ReadableArray, promise: Promise) {
        try {
            Log.d("BlockingServiceModule", "Starting blocking service")
            
            // Convert ReadableArray to JSON array
            val appsArray = JSONArray()
            for (i in 0 until selectedApps.size()) {
                appsArray.put(selectedApps.getString(i))
            }
            
            // Convert ReadableArray of AppLimit objects to JSON object
            val limitsObject = JSONObject()
            for (i in 0 until limits.size()) {
                val limitMap = limits.getMap(i)
                if (limitMap != null) {
                    val packageName = limitMap.getString("packageName")
                    val limitMs = limitMap.getDouble("limitMs").toLong()
                    if (packageName != null) {
                        limitsObject.put(packageName, limitMs)
                    }
                }
            }
            
            // Store in SharedPreferences for service to access
            val prefs = getSharedPreferences()
            prefs.edit()
                .putString(KEY_SELECTED_APPS, appsArray.toString())
                .putString(KEY_LIMITS, limitsObject.toString())
                .apply()
            
            // Start the service
            val intent = Intent(reactApplicationContext, BlockingService::class.java).apply {
                action = BlockingService.ACTION_START
            }
            
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                reactApplicationContext.startForegroundService(intent)
            } else {
                reactApplicationContext.startService(intent)
            }
            
            Log.d("BlockingServiceModule", "Blocking service started")
            promise.resolve(null)
        } catch (e: Exception) {
            Log.e("BlockingServiceModule", "Error starting blocking service: ${e.message}", e)
            promise.reject("SERVICE_ERROR", "Error starting blocking service: ${e.message}", e)
        }
    }

    override fun stopBlockingService(promise: Promise) {
        try {
            Log.d("BlockingServiceModule", "Stopping blocking service")
            
            val intent = Intent(reactApplicationContext, BlockingService::class.java).apply {
                action = BlockingService.ACTION_STOP
            }
            reactApplicationContext.stopService(intent)
            
            Log.d("BlockingServiceModule", "Blocking service stopped")
            promise.resolve(null)
        } catch (e: Exception) {
            Log.e("BlockingServiceModule", "Error stopping blocking service: ${e.message}", e)
            promise.reject("SERVICE_ERROR", "Error stopping blocking service: ${e.message}", e)
        }
    }

    override fun isBlockingServiceRunning(promise: Promise) {
        try {
            val isRunning = isServiceRunning()
            Log.d("BlockingServiceModule", "Service running: $isRunning")
            promise.resolve(isRunning)
        } catch (e: Exception) {
            Log.e("BlockingServiceModule", "Error checking service status: ${e.message}", e)
            promise.reject("SERVICE_ERROR", "Error checking service status: ${e.message}", e)
        }
    }
    
    override fun isAccessibilityServiceEnabled(promise: Promise) {
        try {
            val accessibilityManager = reactApplicationContext.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager
            // Use FEEDBACK_GENERIC constant value (1) directly to avoid import issues
            val enabledServices = accessibilityManager.getEnabledAccessibilityServiceList(1)
            val serviceName = "${reactApplicationContext.packageName}.AppBlockingAccessibilityService"
            val isEnabled = enabledServices.any { 
                it.resolveInfo.serviceInfo.name == serviceName || 
                it.resolveInfo.serviceInfo.packageName == reactApplicationContext.packageName
            }
            Log.d("BlockingServiceModule", "Accessibility service enabled: $isEnabled")
            promise.resolve(isEnabled)
        } catch (e: Exception) {
            Log.e("BlockingServiceModule", "Error checking accessibility service: ${e.message}", e)
            promise.reject("ACCESSIBILITY_ERROR", "Error checking accessibility service: ${e.message}", e)
        }
    }
    
    override fun openAccessibilitySettings(promise: Promise) {
        try {
            val intent = Intent(android.provider.Settings.ACTION_ACCESSIBILITY_SETTINGS)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            reactApplicationContext.startActivity(intent)
            Log.d("BlockingServiceModule", "Opened accessibility settings")
            promise.resolve(null)
        } catch (e: Exception) {
            Log.e("BlockingServiceModule", "Error opening accessibility settings: ${e.message}", e)
            promise.reject("SETTINGS_ERROR", "Error opening accessibility settings: ${e.message}", e)
        }
    }
}

