package com.dailyfocus

import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import java.util.Calendar
import java.util.HashMap

/**
 * UsageStatsModule Implementation
 * 
 * Implements the TurboModule spec for accessing Android UsageStatsManager.
 */
class UsageStatsModuleImpl(reactContext: ReactApplicationContext) :
    UsageStatsModuleSpec(reactContext) {

    private fun getUsageStatsManager(): UsageStatsManager? {
        val context = reactApplicationContext.applicationContext
        return context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
    }

    private fun getPackageManager(): PackageManager {
        return reactApplicationContext.applicationContext.packageManager
    }

    /**
     * Extracts a meaningful app name from a package name when ApplicationInfo is unavailable.
     * Examples:
     * - com.instagram.android -> Instagram
     * - com.twitter.android -> Twitter
     * - com.whatsapp -> WhatsApp
     * - com.android.chrome -> Chrome
     */
    private fun extractAppNameFromPackage(packageName: String): String {
        // Remove common prefixes
        var name = packageName
            .removePrefix("com.")
            .removePrefix("org.")
            .removePrefix("net.")
        
        // Split by dots and find the most meaningful part
        val parts = name.split(".")
        
        // If it ends with "android", use the part before it
        if (parts.size >= 2 && parts.last() == "android") {
            val appPart = parts[parts.size - 2]
            // Capitalize first letter
            return appPart.replaceFirstChar { it.uppercaseChar() }
        }
        
        // If it's a single part or the last part is meaningful, use it
        val lastPart = parts.last()
        if (lastPart.length > 2 && lastPart != "app" && lastPart != "mobile") {
            return lastPart.replaceFirstChar { it.uppercaseChar() }
        }
        
        // Otherwise, use the second-to-last part if available
        if (parts.size >= 2) {
            val secondLast = parts[parts.size - 2]
            if (secondLast.length > 2) {
                return secondLast.replaceFirstChar { it.uppercaseChar() }
            }
        }
        
        // Final fallback: use the last part
        return lastPart.replaceFirstChar { it.uppercaseChar() }
    }

    override fun hasUsageStatsPermission(promise: Promise) {
        try {
            val context = reactApplicationContext.applicationContext
            val usageStatsManager = getUsageStatsManager() ?: run {
                android.util.Log.w("UsageStatsModule", "UsageStatsManager is null in hasUsageStatsPermission")
                promise.resolve(false)
                return
            }

            // Query with a wider time range to check if permission is actually working
            // If permission is not granted, queryUsageStats will return null
            // If permission is granted but no data, it returns empty list
            val time = System.currentTimeMillis()
            val weekAgo = time - (7 * 24 * 60 * 60 * 1000L)
            val stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_WEEKLY,
                weekAgo,
                time
            )

            // null means permission not granted, empty list means permission granted but no data
            val hasPermission = stats != null
            android.util.Log.d("UsageStatsModule", "Permission check: hasPermission=$hasPermission, statsCount=${stats?.size ?: 0}")
            promise.resolve(hasPermission)
        } catch (e: Exception) {
            android.util.Log.e("UsageStatsModule", "Error checking permission: ${e.message}", e)
            promise.reject("PERMISSION_ERROR", "Error checking permission: ${e.message}", e)
        }
    }

    override fun getTodayUsageStats(promise: Promise) {
        try {
            val usageStatsManager = getUsageStatsManager()
            if (usageStatsManager == null) {
                android.util.Log.e("UsageStatsModule", "UsageStatsManager is null")
                promise.resolve(WritableNativeArray())
                return
            }

            val endTime = System.currentTimeMillis()
            
            // Calculate today's start time (midnight)
            val calendar = Calendar.getInstance()
            calendar.set(Calendar.HOUR_OF_DAY, 0)
            calendar.set(Calendar.MINUTE, 0)
            calendar.set(Calendar.SECOND, 0)
            calendar.set(Calendar.MILLISECOND, 0)
            val todayStartTime = calendar.timeInMillis
            
            // Try multiple strategies to get usage stats
            // Strategy 1: Query with INTERVAL_DAILY for today's data (most accurate)
            android.util.Log.d("UsageStatsModule", "Strategy 1: Querying with INTERVAL_DAILY (today)")
            var stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                todayStartTime,
                endTime
            )
            android.util.Log.d("UsageStatsModule", "Daily query returned ${stats?.size ?: 0} stats")

            // Strategy 2: If that fails, try INTERVAL_BEST (last 30 days) as fallback
            if (stats == null || stats.isEmpty()) {
                android.util.Log.d("UsageStatsModule", "Strategy 2: Querying with INTERVAL_BEST (last 30 days)")
                val thirtyDaysAgo = endTime - (30 * 24 * 60 * 60 * 1000L)
                stats = usageStatsManager.queryUsageStats(
                    UsageStatsManager.INTERVAL_BEST,
                    thirtyDaysAgo,
                    endTime
                )
                android.util.Log.d("UsageStatsModule", "INTERVAL_BEST query returned ${stats?.size ?: 0} stats")
            }

            // Strategy 3: Try weekly (last 7 days)
            if (stats == null || stats.isEmpty()) {
                android.util.Log.d("UsageStatsModule", "Strategy 3: Querying with INTERVAL_WEEKLY (last 7 days)")
                val weekAgo = endTime - (7 * 24 * 60 * 60 * 1000L)
                stats = usageStatsManager.queryUsageStats(
                    UsageStatsManager.INTERVAL_WEEKLY,
                    weekAgo,
                    endTime
                )
                android.util.Log.d("UsageStatsModule", "Weekly query returned ${stats?.size ?: 0} stats")
            }

            // Strategy 4: Try monthly (last 30 days)
            if (stats == null || stats.isEmpty()) {
                android.util.Log.d("UsageStatsModule", "Strategy 4: Querying with INTERVAL_MONTHLY (last 30 days)")
                val monthAgo = endTime - (30 * 24 * 60 * 60 * 1000L)
                stats = usageStatsManager.queryUsageStats(
                    UsageStatsManager.INTERVAL_MONTHLY,
                    monthAgo,
                    endTime
                )
                android.util.Log.d("UsageStatsModule", "Monthly query returned ${stats?.size ?: 0} stats")
            }

            if (stats == null) {
                android.util.Log.e("UsageStatsModule", "queryUsageStats returned NULL - permission might not be granted!")
                promise.resolve(WritableNativeArray())
                return
            }

            if (stats.isEmpty()) {
                android.util.Log.w("UsageStatsModule", "queryUsageStats returned EMPTY list (permission granted but no data)")
                android.util.Log.w("UsageStatsModule", "Falling back to getting all installed apps...")
                
                // Fallback: Get all installed apps when usage stats is empty
                // This allows users to select apps even if they haven't been used yet
                val packageManager = getPackageManager()
                // Include disabled apps in the query (some apps might be disabled but still installed)
                val installedApps = packageManager.getInstalledApplications(
                    PackageManager.GET_META_DATA or PackageManager.MATCH_DISABLED_COMPONENTS.toInt()
                )
                val result = WritableNativeArray()
                var processedCount = 0
                var skippedSystemCount = 0
                var skippedSelfCount = 0
                
                android.util.Log.d("UsageStatsModule", "Found ${installedApps.size} installed apps")
                
                for (appInfo in installedApps) {
                    val packageName = appInfo.packageName
                    
                    if (packageName == reactApplicationContext.packageName) {
                        skippedSelfCount++
                        continue
                    }
                    
                    // Check if it's a user-installed app (not a system app)
                    val isUserInstalled = (appInfo.flags and ApplicationInfo.FLAG_SYSTEM == 0) ||
                                         (appInfo.flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP != 0)
                    
                    // Check if app has a launcher activity (user can launch it)
                    // Try multiple methods for better detection
                    val hasLauncher = try {
                        // Method 1: Check for launch intent
                        val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
                        if (launchIntent != null) {
                            true
                        } else {
                            // Method 2: Check if app has MAIN/LAUNCHER activity category
                            try {
                                val intent = Intent(Intent.ACTION_MAIN)
                                intent.addCategory(Intent.CATEGORY_LAUNCHER)
                                intent.setPackage(packageName)
                                val resolveInfo = packageManager.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY)
                                resolveInfo.isNotEmpty()
                            } catch (e: Exception) {
                                false
                            }
                        }
                    } catch (e: Exception) {
                        android.util.Log.v("UsageStatsModule", "Fallback: Error checking launcher for $packageName: ${e.message}")
                        false
                    }

                    // Include if: user-installed OR has launcher
                    // Play Store apps are always user-installed (FLAG_SYSTEM == 0)
                    // Also include apps with launchers even if marked as system (edge cases)
                    if (!isUserInstalled && !hasLauncher) {
                        skippedSystemCount++
                        // Log what we're skipping for debugging popular apps
                        if (packageName.contains("instagram") || 
                            packageName.contains("whatsapp") || 
                            packageName.contains("facebook") ||
                            packageName.contains("twitter") ||
                            packageName.contains("youtube") ||
                            packageName.contains("chrome") ||
                            packageName.contains("gmail") ||
                            packageName.contains("pay")) {
                            android.util.Log.w("UsageStatsModule", "Fallback: Skipping popular app: $packageName, isUserInstalled: $isUserInstalled, hasLauncher: $hasLauncher, flags: ${appInfo.flags}")
                        }
                        continue
                    }
                    
                    // Log popular apps for debugging (both included and excluded)
                    if (packageName.contains("instagram") || 
                        packageName.contains("whatsapp") || 
                        packageName.contains("com.whatsapp") ||
                        packageName.contains("com.instagram") ||
                        packageName.contains("facebook") ||
                        packageName.contains("twitter") ||
                        packageName.contains("youtube") ||
                        packageName.contains("chrome") ||
                        packageName.contains("gmail") ||
                        packageName.contains("pay") ||
                        packageName.contains("bank")) {
                        android.util.Log.d("UsageStatsModule", "Fallback: Processing popular app: $packageName, isUserInstalled: $isUserInstalled, hasLauncher: $hasLauncher, flags: ${appInfo.flags}")
                    }
                    
                    try {
                        val appName = packageManager.getApplicationLabel(appInfo).toString()
                        
                        val statMap = WritableNativeMap()
                        statMap.putString("packageName", packageName)
                        statMap.putString("appName", appName)
                        statMap.putDouble("totalTimeInForeground", 0.0) // No usage data yet
                        result.pushMap(statMap)
                        processedCount++
                    } catch (e: Exception) {
                        android.util.Log.e("UsageStatsModule", "Error processing installed app $packageName: ${e.message}")
                        continue
                    }
                }
                
                android.util.Log.d("UsageStatsModule", "Fallback complete:")
                android.util.Log.d("UsageStatsModule", "  - Processed: $processedCount")
                android.util.Log.d("UsageStatsModule", "  - Skipped system: $skippedSystemCount")
                android.util.Log.d("UsageStatsModule", "  - Skipped self: $skippedSelfCount")
                android.util.Log.d("UsageStatsModule", "  - Total returned: ${result.size()} apps")
                
                promise.resolve(result)
                return
            }

            // Create a map of usage stats by package name
            // Cap usage at 24 hours max to prevent impossible values (in case of data issues)
            val usageStatsMap = HashMap<String, Long>()
            val maxDailyUsage = 24 * 60 * 60 * 1000L // 24 hours in milliseconds
            for (stat in stats) {
                val usage = stat.totalTimeInForeground
                // Cap at 24 hours to prevent impossible values (e.g., if stats are aggregated incorrectly)
                val cappedUsage = minOf(usage, maxDailyUsage)
                usageStatsMap[stat.packageName] = cappedUsage
            }
            android.util.Log.d("UsageStatsModule", "Successfully got ${stats.size} usage stats entries")
            android.util.Log.d("UsageStatsModule", "Usage stats available for ${usageStatsMap.size} apps (capped at 24h max)")

            // Use apps from usage stats as the primary source (they're definitely user-accessible)
            // Then merge with installed apps to catch any that haven't been used yet
            val packageManager = getPackageManager()
            val result = WritableNativeArray()
            val processedPackages = HashSet<String>()
            var processedCount = 0
            var skippedSystemCount = 0
            var skippedSelfCount = 0

            android.util.Log.d("UsageStatsModule", "Processing apps from usage stats first...")
            android.util.Log.d("UsageStatsModule", "Our package name: ${reactApplicationContext.packageName}")

            // First, add ALL apps from usage stats
            // If an app is in usage stats, it means the user has used it, so it's definitely accessible
            for ((packageName, totalTime) in usageStatsMap) {
                if (packageName == reactApplicationContext.packageName) {
                    skippedSelfCount++
                    continue
                }

                // Try multiple methods to get app info (some apps might be disabled or require special flags)
                val appInfo = try {
                    packageManager.getApplicationInfo(packageName, PackageManager.GET_META_DATA)
                } catch (e: PackageManager.NameNotFoundException) {
                    // Try with MATCH_DISABLED_COMPONENTS flag (includes disabled apps)
                    try {
                        packageManager.getApplicationInfo(packageName, PackageManager.GET_META_DATA or PackageManager.MATCH_DISABLED_COMPONENTS)
                    } catch (e2: PackageManager.NameNotFoundException) {
                        // Try to get package info instead
                        try {
                            val packageInfo = packageManager.getPackageInfo(packageName, PackageManager.GET_META_DATA)
                            packageInfo.applicationInfo
                        } catch (e3: Exception) {
                            android.util.Log.w("UsageStatsModule", "Cannot get app info for $packageName: ${e3.message}")
                            null
                        }
                    }
                } catch (e: Exception) {
                    android.util.Log.w("UsageStatsModule", "Error getting app info for $packageName: ${e.message}")
                    null
                }
                
                val appName = if (appInfo != null) {
                    try {
                        packageManager.getApplicationLabel(appInfo).toString()
                    } catch (e: Exception) {
                        // Fallback: try to extract meaningful name from package
                        extractAppNameFromPackage(packageName)
                    }
                } else {
                    // Fallback: try to extract meaningful name from package
                    extractAppNameFromPackage(packageName)
                }
                
                // Log popular apps for debugging
                if (packageName.contains("instagram") || 
                    packageName.contains("whatsapp") || 
                    packageName.contains("com.whatsapp") ||
                    packageName.contains("com.instagram") ||
                    packageName.contains("facebook") ||
                    packageName.contains("twitter") ||
                    packageName.contains("youtube") ||
                    packageName.contains("chrome")) {
                    android.util.Log.d("UsageStatsModule", "Found popular app in usage stats: $packageName ($appName), time: ${totalTime}ms")
                }

                // Include the app regardless - if it's in usage stats, user has used it
                val statMap = WritableNativeMap()
                statMap.putString("packageName", packageName)
                statMap.putString("appName", appName)
                statMap.putDouble("totalTimeInForeground", totalTime.toDouble())
                result.pushMap(statMap)
                processedPackages.add(packageName)
                processedCount++
            }

            android.util.Log.d("UsageStatsModule", "Added ${processedCount} apps from usage stats")
            android.util.Log.d("UsageStatsModule", "Now checking installed apps for any not in usage stats...")

            // Then, add installed apps that aren't in usage stats (haven't been used yet)
            // Include disabled apps too (some might be disabled but still installed)
            val installedApps = packageManager.getInstalledApplications(
                PackageManager.GET_META_DATA or PackageManager.MATCH_DISABLED_COMPONENTS.toInt()
            )
            var addedFromInstalled = 0

            android.util.Log.d("UsageStatsModule", "Checking ${installedApps.size} installed apps for apps not in usage stats...")

            for (appInfo in installedApps) {
                val packageName = appInfo.packageName
                
                // Skip if already processed or is our app
                if (packageName == reactApplicationContext.packageName || processedPackages.contains(packageName)) {
                    continue
                }

                // Check if it's a user-installed app (not a system app)
                val isUserInstalled = (appInfo.flags and ApplicationInfo.FLAG_SYSTEM == 0) ||
                                     (appInfo.flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP != 0)
                
                // Check if app has a launcher activity (user can launch it)
                // Try multiple methods for better detection
                val hasLauncher = try {
                    // Method 1: Check for launch intent
                    val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
                    if (launchIntent != null) {
                        true
                    } else {
                        // Method 2: Check if app has MAIN/LAUNCHER activity category
                        try {
                            val intent = Intent(Intent.ACTION_MAIN)
                            intent.addCategory(Intent.CATEGORY_LAUNCHER)
                            intent.setPackage(packageName)
                            val resolveInfo = packageManager.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY)
                            resolveInfo.isNotEmpty()
                        } catch (e: Exception) {
                            false
                        }
                    }
                } catch (e: Exception) {
                    android.util.Log.v("UsageStatsModule", "Error checking launcher for $packageName: ${e.message}")
                    false
                }

                // Include if: user-installed OR has launcher
                // This ensures we get all Play Store apps
                if (!isUserInstalled && !hasLauncher) {
                    skippedSystemCount++
                    continue
                }

                // Log popular apps for debugging
                if (packageName.contains("instagram") || 
                    packageName.contains("whatsapp") || 
                    packageName.contains("com.whatsapp") ||
                    packageName.contains("com.instagram") ||
                    packageName.contains("facebook") ||
                    packageName.contains("twitter") ||
                    packageName.contains("youtube")) {
                    android.util.Log.d("UsageStatsModule", "Found popular app in installed: $packageName, userInstalled: $isUserInstalled, hasLauncher: $hasLauncher")
                }

                try {
                    val appName = packageManager.getApplicationLabel(appInfo).toString()

                    val statMap = WritableNativeMap()
                    statMap.putString("packageName", packageName)
                    statMap.putString("appName", appName)
                    statMap.putDouble("totalTimeInForeground", 0.0) // No usage data yet
                    result.pushMap(statMap)
                    processedPackages.add(packageName)
                    processedCount++
                    addedFromInstalled++
                } catch (e: Exception) {
                    android.util.Log.e("UsageStatsModule", "Error processing installed app $packageName: ${e.message}", e)
                    continue
                }
            }

            android.util.Log.d("UsageStatsModule", "Processing complete:")
            android.util.Log.d("UsageStatsModule", "  - From usage stats: ${usageStatsMap.size}")
            android.util.Log.d("UsageStatsModule", "  - Added from installed: $addedFromInstalled")
            android.util.Log.d("UsageStatsModule", "  - Total processed: $processedCount")
            android.util.Log.d("UsageStatsModule", "  - Skipped system apps: $skippedSystemCount")
            android.util.Log.d("UsageStatsModule", "  - Skipped self: $skippedSelfCount")
            android.util.Log.d("UsageStatsModule", "  - Total returned: ${result.size()} apps")

            promise.resolve(result)
        } catch (e: Exception) {
            android.util.Log.e("UsageStatsModule", "Error getting usage stats: ${e.message}", e)
            promise.reject("USAGE_STATS_ERROR", "Error getting usage stats: ${e.message}", e)
        }
    }

    override fun getAppUsageToday(packageName: String, promise: Promise) {
        try {
            val usageStatsManager = getUsageStatsManager()
            if (usageStatsManager == null) {
                promise.resolve(null)
                return
            }

            val calendar = Calendar.getInstance()
            calendar.set(Calendar.HOUR_OF_DAY, 0)
            calendar.set(Calendar.MINUTE, 0)
            calendar.set(Calendar.SECOND, 0)
            calendar.set(Calendar.MILLISECOND, 0)
            val startTime = calendar.timeInMillis
            val endTime = System.currentTimeMillis()

            val stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime
            ) ?: run {
                promise.resolve(null)
                return
            }

            val packageManager = getPackageManager()
            val appStat = stats.find { it.packageName == packageName }

            if (appStat == null || appStat.totalTimeInForeground == 0L) {
                promise.resolve(null)
                return
            }

            try {
                val appInfo = packageManager.getApplicationInfo(packageName, 0)
                val appName = packageManager.getApplicationLabel(appInfo).toString()

                val result = WritableNativeMap()
                result.putString("packageName", packageName)
                result.putString("appName", appName)
                result.putDouble("totalTimeInForeground", appStat.totalTimeInForeground.toDouble())
                promise.resolve(result)
            } catch (e: PackageManager.NameNotFoundException) {
                promise.resolve(null)
            }
        } catch (e: Exception) {
            promise.reject("USAGE_STATS_ERROR", "Error getting app usage: ${e.message}", e)
        }
    }

    override fun openUsageStatsSettings(promise: Promise) {
        try {
            android.util.Log.d("UsageStatsModule", "Opening Usage Stats Settings...")
            
            val activity = reactApplicationContext.currentActivity
            val context = activity ?: reactApplicationContext.applicationContext

            val intent = Intent(android.provider.Settings.ACTION_USAGE_ACCESS_SETTINGS)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK

            android.util.Log.d("UsageStatsModule", "Starting activity with intent: ${intent.action}")
            
            if (activity != null) {
                android.util.Log.d("UsageStatsModule", "Using current activity to start intent")
                activity.startActivity(intent)
            } else {
                android.util.Log.d("UsageStatsModule", "Using application context to start intent")
                reactApplicationContext.startActivity(intent)
            }

            android.util.Log.d("UsageStatsModule", "Settings activity started successfully")
            promise.resolve(null)
        } catch (e: Exception) {
            android.util.Log.e("UsageStatsModule", "Error opening settings: ${e.message}", e)
            promise.reject("SETTINGS_ERROR", "Error opening settings: ${e.message}", e)
        }
    }
}

