package com.dailyfocus

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import org.json.JSONArray
import org.json.JSONObject

/**
 * App Blocking Accessibility Service
 * 
 * Intercepts app launches and prevents blocked apps from opening.
 * 
 * How it works:
 * 1. Detects when an app window is opened (TYPE_WINDOW_STATE_CHANGED)
 * 2. Checks if the app should be blocked
 * 3. If blocked, immediately brings Boundly to foreground
 * 4. This effectively prevents the blocked app from being used
 * 
 * Requirements:
 * - User must enable this service in Settings > Accessibility
 * - This is a special permission that requires user action
 */
class AppBlockingAccessibilityService : AccessibilityService() {
    
    companion object {
        private const val TAG = "AppBlockingAccessibility"
        private const val PREFS_NAME = "blocking_config"
        private const val KEY_SELECTED_APPS = "selected_apps"
        private const val KEY_LIMITS = "limits"
    }
    
    override fun onServiceConnected() {
        super.onServiceConnected()
        Log.d(TAG, "AccessibilityService connected")
        
        // Configure the service
        val info = AccessibilityServiceInfo().apply {
            eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED
            feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
            flags = AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS
            notificationTimeout = 0
        }
        setServiceInfo(info)
    }
    
    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return
        
        try {
            // Only process window state changes (app launches/switches)
            if (event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
                val packageName = event.packageName?.toString()
                if (packageName == null || packageName == this.packageName) {
                    return // Skip our own app
                }
                
                Log.d(TAG, "Window state changed for: $packageName")
                
                // Check if this app should be blocked
                if (shouldBlockApp(packageName)) {
                    Log.d(TAG, "Blocking app launch: $packageName")
                    blockApp(packageName)
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error in onAccessibilityEvent: ${e.message}", e)
        }
    }
    
    override fun onInterrupt() {
        Log.d(TAG, "AccessibilityService interrupted")
    }
    
    private fun shouldBlockApp(packageName: String): Boolean {
        return try {
            val prefs = applicationContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val selectedAppsJson = prefs.getString(KEY_SELECTED_APPS, "[]") ?: "[]"
            val limitsJson = prefs.getString(KEY_LIMITS, "{}") ?: "{}"
            
            // Parse JSON
            val selectedApps = parseStringArray(selectedAppsJson)
            val limits = parseLimitsMap(limitsJson)
            
            // Check if app is selected
            if (!selectedApps.contains(packageName)) {
                return false
            }
            
            // Check if limit is set
            val limitMs = limits[packageName] ?: return false
            if (limitMs <= 0) {
                return false
            }
            
            // Get current usage
            val usageMs = getCurrentUsage(packageName)
            
            Log.d(TAG, "Checking app: $packageName, usage: ${usageMs}ms, limit: ${limitMs}ms")
            
            usageMs >= limitMs
        } catch (e: Exception) {
            Log.e(TAG, "Error checking if should block: ${e.message}", e)
            false
        }
    }
    
    private fun getCurrentUsage(packageName: String): Long {
        return try {
            val usageStatsManager = getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
                ?: return 0L
            
            val calendar = java.util.Calendar.getInstance()
            calendar.set(java.util.Calendar.HOUR_OF_DAY, 0)
            calendar.set(java.util.Calendar.MINUTE, 0)
            calendar.set(java.util.Calendar.SECOND, 0)
            calendar.set(java.util.Calendar.MILLISECOND, 0)
            val startTime = calendar.timeInMillis
            val endTime = System.currentTimeMillis()
            
            val stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime
            ) ?: return 0L
            
            val appStat = stats.find { it.packageName == packageName }
            appStat?.totalTimeInForeground ?: 0L
        } catch (e: Exception) {
            Log.e(TAG, "Error getting current usage: ${e.message}")
            0L
        }
    }
    
    private fun blockApp(packageName: String) {
        try {
            // Immediately bring Boundly to foreground
            val intent = Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                putExtra("blocked", true)
                putExtra("blocked_package", packageName)
            }
            startActivity(intent)
            
            // Perform back action to close the blocked app (if possible)
            // Note: This may not work on all Android versions
            performGlobalAction(GLOBAL_ACTION_BACK)
            
            Log.d(TAG, "Blocked app: $packageName - brought Boundly to foreground")
        } catch (e: Exception) {
            Log.e(TAG, "Error blocking app: ${e.message}", e)
        }
    }
    
    // JSON parsing helpers
    private fun parseStringArray(json: String): Set<String> {
        return try {
            val jsonArray = JSONArray(json)
            val result = mutableSetOf<String>()
            for (i in 0 until jsonArray.length()) {
                result.add(jsonArray.getString(i))
            }
            result
        } catch (e: Exception) {
            Log.e(TAG, "Error parsing selected apps: ${e.message}")
            emptySet()
        }
    }
    
    private fun parseLimitsMap(json: String): Map<String, Long> {
        return try {
            val jsonObject = JSONObject(json)
            val result = mutableMapOf<String, Long>()
            val keys = jsonObject.keys()
            while (keys.hasNext()) {
                val key = keys.next()
                result[key] = jsonObject.getLong(key)
            }
            result
        } catch (e: Exception) {
            Log.e(TAG, "Error parsing limits: ${e.message}")
            emptyMap()
        }
    }
}

