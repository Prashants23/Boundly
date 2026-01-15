# Boundly
Set boundaries. Stay focused.

A privacy-first Android React Native app that helps you limit distracting app usage by setting daily limits and blocking apps when limits are exceeded.

## Features

- ✅ Select apps to track
- ✅ Set daily usage limits per app
- ✅ Automatic blocking when limits exceeded
- ✅ Usage statistics (today vs yesterday)
- ✅ Dark mode support
- ✅ Privacy-first (all data stays on device)

## Tech Stack

- **React Native 0.83.1** with New Architecture enabled
- **TypeScript** for type safety
- **React Navigation v7** for navigation
- **Zustand** for state management
- **MMKV** for fast persistent storage
- **Native Android Modules** for usage stats and foreground app detection

## Project Structure

```
src/
├── features/
│   ├── appSelection/    # App selection and permissions
│   ├── limits/          # Setting daily limits
│   ├── blocking/        # Blocking logic and overlay
│   └── stats/           # Usage statistics
├── components/          # Reusable components
├── navigation/          # Navigation setup
├── stores/              # Zustand stores
├── native/              # Native module interfaces
└── utils/               # Utilities (theme, storage, permissions)
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. For Android:
```bash
cd android
./gradlew assembleDebug
```

3. Run the app:
```bash
npm run android
```

## Permissions

The app requires **Usage Stats** and **Accessibility** permissions to function. These are special permissions that must be granted via Android Settings:

### Usage Stats Permission
1. Open the app
2. Follow the permission screen instructions
3. Navigate to Settings > Apps > Special access > Usage access
4. Enable "Boundly"

### Accessibility Service (for app blocking)
1. After setting app limits, you'll see a prompt on the home screen
2. Tap "Open Accessibility Settings"
3. Find "Boundly" in the list
4. Enable the service
5. This allows Boundly to intercept and block app launches

## Architecture Decisions

### Why Zustand over Redux?
- Minimal boilerplate
- ~1KB bundle size
- Simple API, easy to understand
- Perfect for MVP

### Why MMKV over AsyncStorage?
- 30-50x faster
- Synchronous API (no async overhead)
- Thread-safe
- Perfect for frequent reads/writes

### Why Native Modules?
- Direct access to Android UsageStatsManager
- Better performance than JS-only solutions
- Battery-efficient (Android handles tracking)

### Why No Backend?
- Privacy-first: all data stays on device
- Simpler architecture
- No server costs
- Works offline

## Known Limitations

1. **App blocking requires Accessibility Service**
   - Must be enabled manually in Settings
   - Some users may find this intrusive (though necessary for blocking)

2. **Foreground app detection accuracy**
   - Uses ActivityManager which may not be 100% accurate on all Android versions
   - Could be improved with UsageStatsManager for detection

3. **Stats refresh**
   - Usage stats are refreshed manually (pull-to-refresh)
   - Not real-time (refreshes when you check)

## Development

### Adding a New Feature

1. Create feature folder in `src/features/`
2. Add Zustand store if needed (in `src/stores/`)
3. Add navigation route (in `src/navigation/AppNavigator.tsx`)
4. Follow existing patterns (TypeScript, functional components, theme support)

### Code Style

- TypeScript strict mode
- Functional components only
- Early returns
- Small, focused functions
- Self-documenting code
- No magic numbers

## Documentation

- [App Listing and Blocking Architecture](./APP_LISTING_AND_BLOCKING.md) - Detailed explanation of how app listing and blocking work
- [Performance and Compliance](./PERFORMANCE_AND_COMPLIANCE.md) - Performance considerations and Play Store compliance

## License

Private project - All rights reserved
