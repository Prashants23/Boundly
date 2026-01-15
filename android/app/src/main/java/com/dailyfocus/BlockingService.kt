package com.dailyfocus

import android.app.*
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledFuture
import java.util.concurrent.TimeUnit

/**
 * Blocking Service - Foreground Service
 * 
 * Continuously monitors foreground app and blocks apps that exceed limits.
 * 
 * How it works:
 * 1. Runs as foreground service (with notification)
 * 2. Checks foreground app every 2 seconds
 * 3. If blocked app detected, brings Boundly to foreground
 * 4. Uses UsageStatsManager to check current usage
 * 
 * Battery Considerations:
 * - Uses efficient polling (2 seconds)
 * - Stops when no apps are being tracked
 * - Can be stopped by user
 */
class BlockingService : Service() {
    private val executor = Executors.newSingleThreadScheduledExecutor()
    private var checkTask: ScheduledFuture<*>? = null
    private val CHECK_INTERVAL_SECONDS = 2L
    
    companion object {
        private const val TAG = "BlockingService"
        private const val NOTIFICATION_ID = 1001
        private const val CHANNEL_ID = "blocking_service_channel"
        
        // Action to start/stop service
        const val ACTION_START = "com.dailyfocus.BLOCKING_SERVICE_START"
        const val ACTION_STOP = "com.dailyfocus.BLOCKING_SERVICE_STOP"
        
        // SharedPreferences keys for storing blocking config
        private const val PREFS_NAME = "blocking_config"
        private const val KEY_SELECTED_APPS = "selected_apps"
        private const val KEY_LIMITS = "limits"
        private const val KEY_BLOCKED_APP = "blocked_app"
        private const val KEY_BLOCKED_APP_NAME = "blocked_app_name"
    }
    
    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        Log.d(TAG, "BlockingService created")
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> {
                Log.d(TAG, "Starting blocking service")
                startForeground(NOTIFICATION_ID, createNotification())
                startMonitoring()
            }
            ACTION_STOP -> {
                Log.d(TAG, "Stopping blocking service")
                stopMonitoring()
                stopForeground(true)
                stopSelf()
            }
        }
        return START_STICKY // Restart if killed
    }
    
    override fun onBind(intent: Intent?): IBinder? {
        return null
    }
    
    override fun onDestroy() {
        super.onDestroy()
        stopMonitoring()
        Log.d(TAG, "BlockingService destroyed")
    }
    
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "App Blocking Service",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Monitors apps and enforces daily limits"
                setShowBadge(false)
            }
            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }
    
    private fun createNotification(): Notification {
        val intent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Boundly")
            .setContentText("Monitoring apps and enforcing limits")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }
    
    private fun startMonitoring() {
        if (checkTask != null) {
            Log.d(TAG, "Monitoring already started")
            return
        }
        
        Log.d(TAG, "Starting monitoring task")
        checkTask = executor.scheduleWithFixedDelay(
            { checkAndBlock() },
            0,
            CHECK_INTERVAL_SECONDS,
            TimeUnit.SECONDS
        )
    }
    
    private fun stopMonitoring() {
        checkTask?.cancel(true)
        checkTask = null
        Log.d(TAG, "Stopped monitoring")
    }
    
    private fun checkAndBlock() {
        try {
            // Check if we have any apps to monitor
            val prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val selectedAppsJson = prefs.getString(KEY_SELECTED_APPS, "[]") ?: "[]"
            if (selectedAppsJson == "[]") {
                // No apps to monitor, stop service
                Log.d(TAG, "No apps to monitor, stopping service")
                stopSelf()
                return
            }

            val foregroundApp = getForegroundApp()
            if (foregroundApp == null) {
                return
            }
            
            val ourPackageName = applicationContext.packageName
            
            // Skip if it's our own app
            if (foregroundApp == ourPackageName) {
                return
            }
            
            // Check if this app should be blocked
            val blockResult = shouldBlockApp(foregroundApp)
            if (blockResult != null) {
                val (shouldBlock, info) = blockResult
                if (shouldBlock) {
                    Log.d(TAG, "Blocking app detected: $foregroundApp (${info.appName}) - usage: ${info.usageMs}ms, limit: ${info.limitMs}ms")
                    // Store blocked app info for React Native to read
                    val prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                    prefs.edit()
                        .putString(KEY_BLOCKED_APP, foregroundApp)
                        .putString(KEY_BLOCKED_APP_NAME, info.appName)
                        .putLong("blocked_usage_ms", info.usageMs)
                        .putLong("blocked_limit_ms", info.limitMs)
                        .apply()
                    bringAppToForeground()
                } else {
                    // Clear blocked app info if not blocked
                    val prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                    prefs.edit()
                        .remove(KEY_BLOCKED_APP)
                        .remove(KEY_BLOCKED_APP_NAME)
                        .remove("blocked_usage_ms")
                        .remove("blocked_limit_ms")
                        .apply()
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error in checkAndBlock: ${e.message}", e)
        }
    }
    
    private fun getForegroundApp(): String? {
        return try {
            val activityManager = getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
            val ourPackageName = applicationContext.packageName
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val runningProcesses = activityManager.runningAppProcesses ?: return null
                for (processInfo in runningProcesses) {
                    if (processInfo.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                        val packageName = processInfo.pkgList?.firstOrNull()
                        if (packageName != null && packageName != ourPackageName) {
                            return packageName
                        }
                    }
                }
            }
            null
        } catch (e: Exception) {
            Log.e(TAG, "Error getting foreground app: ${e.message}")
            null
        }
    }
    
    private data class BlockInfo(val appName: String, val usageMs: Long, val limitMs: Long)
    
    private fun shouldBlockApp(packageName: String): Pair<Boolean, BlockInfo>? {
        return try {
            // Get selected apps and limits from SharedPreferences
            val prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val selectedAppsJson = prefs.getString(KEY_SELECTED_APPS, "[]") ?: "[]"
            val limitsJson = prefs.getString(KEY_LIMITS, "{}") ?: "{}"
            
            // Parse JSON
            val selectedApps = parseStringArray(selectedAppsJson)
            val limits = parseLimitsMap(limitsJson)
            
            // Check if app is selected
            if (!selectedApps.contains(packageName)) {
                return null
            }
            
            // Check if limit is set
            val limitMs = limits[packageName] ?: return null
            if (limitMs <= 0) {
                return null
            }
            
            // Get current usage
            val usageMs = getCurrentUsage(packageName)
            
            // Get app name
            val appName = try {
                val packageManager = packageManager
                val appInfo = packageManager.getApplicationInfo(packageName, 0)
                packageManager.getApplicationLabel(appInfo).toString()
            } catch (e: Exception) {
                packageName.substringAfterLast(".")
            }
            
            Log.d(TAG, "Checking app: $packageName ($appName), usage: ${usageMs}ms, limit: ${limitMs}ms")
            
            val shouldBlock = usageMs >= limitMs
            Pair(shouldBlock, BlockInfo(appName, usageMs, limitMs))
        } catch (e: Exception) {
            Log.e(TAG, "Error checking if should block: ${e.message}", e)
            null
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
    
    private fun bringAppToForeground() {
        try {
            val intent = Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                putExtra("blocked", true)
            }
            startActivity(intent)
            Log.d(TAG, "Brought Boundly to foreground")
        } catch (e: Exception) {
            Log.e(TAG, "Error bringing app to foreground: ${e.message}", e)
        }
    }
    
    // JSON parsing helpers using org.json
    private fun parseStringArray(json: String): Set<String> {
        return try {
            val jsonArray = org.json.JSONArray(json)
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
            val jsonObject = org.json.JSONObject(json)
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

