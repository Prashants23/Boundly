/**
 * Navigation Events Utility
 * 
 * Simple event emitter for React Native (without Node.js events module)
 * Used to handle navigation callbacks without passing functions in params
 * (which causes React Navigation warnings about non-serializable values)
 */

type Listener = (source: string) => void;

class NavigationEvents {
  private static instance: NavigationEvents;
  private listeners: Map<string, Set<Listener>> = new Map();

  static getInstance(): NavigationEvents {
    if (!NavigationEvents.instance) {
      NavigationEvents.instance = new NavigationEvents();
    }
    return NavigationEvents.instance;
  }

  emitPermissionGranted(source: string) {
    const listeners = this.listeners.get('permissionGranted');
    if (listeners) {
      listeners.forEach((listener) => listener(source));
    }
  }

  onPermissionGranted(callback: Listener) {
    if (!this.listeners.has('permissionGranted')) {
      this.listeners.set('permissionGranted', new Set());
    }
    this.listeners.get('permissionGranted')!.add(callback);
  }

  offPermissionGranted(callback: Listener) {
    const listeners = this.listeners.get('permissionGranted');
    if (listeners) {
      listeners.delete(callback);
    }
  }
}

export const navigationEvents = NavigationEvents.getInstance();

