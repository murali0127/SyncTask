// Handles SW registration, push subscription lifecycle, and Supabase persistence.


import { supabase } from '../lib/supabase-client';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

function urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      const raw = window.atob(base64);
      return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}



function detectDeviceName() {
      const ua = navigator.userAgent;
      const browser = ua.includes('Edg') ? 'Edge'
            : ua.includes('Chrome') ? 'Chrome'
                  : ua.includes('Firefox') ? 'Firefox'
                        : ua.includes('Safari') ? 'Safari' : 'Browser';

      const os = /iPhone|iPad/.test(ua) ? 'iOS'
            : ua.includes('Android') ? 'Android'
                  : ua.includes('Mac') ? 'Mac'
                        : ua.includes('Windows') ? 'Windows' : 'Unknown';
      return `${browser} on ${os}`;
}

export function isNotificationSupported() {
      return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
}

// Request permission + create push subscription + save to Supabase
export async function enablePushNotifications(userId) {
      const permission = await Notification.requestPermission();

      if (!isNotificationSupported()) {
            throw new Error('UNSUPPORTED');
      }

      if (permission !== 'granted') {
            throw new Error('PERMISSION_DENIED');
      }

      const reg = await navigator.serviceWorker.ready; //Wait for sw to be activated

      // Re-use existing subscription if already subscribed
      let sub = await reg.pushManager.getSubscription();

      if (!sub) {
            sub = await reg.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
      }

      const json = sub.toJSON();
      // console.log(json);

      const { error } = await supabase
            .from('push_subscriptions')
            .upsert(
                  {
                        user_id: userId,
                        endpoint: json.endpoint,
                        p256dh: json.keys.p256dh,
                        auth_key: json.keys.auth,
                        device_name: detectDeviceName(),
                        last_used_at: new Date().toISOString(),
                  },
                  { onConflict: 'endpoint' }
            );

      if (error) throw error;
      return sub;
}



//Register the service worker 

export async function registerSW() {
      if (!('serviceWorker' in navigator)) return null;

      try {
            const register = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
            console.log('Service Worker Registerd at scope : ', register.scope);
            return register;
      } catch (error) {
            console.error('Service Worker Register failed!!!');
            return;
      }
}



// Unsubscribe and remove from Supabase
export async function disablePushNotifications(userId) {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) return;

      const endpoint = sub.endpoint;
      await sub.unsubscribe();

      // console.log('Disabled , Endpoint ->  ', endpoint);

      await supabase
            .from('push_subscriptions')
            .delete()
            .eq('user_id', userId)
            .eq('endpoint', endpoint);
}

export function getPermissionState() {
      if (!('Notification' in window)) return 'unsupported';
      if (!('serviceWorker' in navigator)) return 'unsupported';
      return Notification.permission; // 'default' | 'granted' | 'denied'
}
