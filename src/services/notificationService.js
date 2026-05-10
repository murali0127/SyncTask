// import {} from '../../public/'

import useMediaQuery from '@mui/material/useMediaQuery';
import { supabase } from '../lib/supabase-client';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

function urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      const raw = window.atob(base64);
      return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

// function formatRelativeTime(dateStr) {
//       const diff = new Date(dateStr).getTime() - Date.now();
//       const abs = Math.abs(diff);
//       const past = diff < 0;
//       if (abs < 60_000) return past ? 'just now' : 'in less than a minute';
//       if (abs < 3_600_000) {
//             const m = Math.round(abs / 60_000);
//             return past ? `${m}m ago` : `in ${m}m`;
//       }
//       const h = Math.round(abs / 3_600_000);
//       return past ? `${h}h ago` : `in ${h}h`;
// }


function detectDeviceName() {
      const us = navigator.userAgent;
      const browser = ua.include('Edg') ? 'Edge'
            : ua.include('Chrome') ? 'Chrome'
                  : ua.include('Firefox') ? 'Firefox'
                        : ua.include('Safari') ? 'Safari' : 'Browser';

      const os = /iPhone|iPad/.test(ua) ? 'iOS'
            : ua.include('Android') ? 'Android'
                  : ua.include('Mac') ? 'Mac'
                        : ua.include('Windows') ? 'Windows' : 'Unknown';
      return `${browser} on ${os}`;
}



//Register the service worker 

export default async function registerSW() {
      if (!('serviceWorker' in navigator)) return null;

      try {
            const register = await navigator.serviceWorker.register('/serviceWorker.js', { scope: '/' });
            console.log('Service Worker Registerd : ', register.scope);
            return register;
      } catch (error) {
            console.error('Service Worker Register failed!!!');
            return;
      }
}

// Request permission + create push subscription + save to Supabase
export async function enablePushNotifications(userId) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
            throw new Error('PERMISSION_DENIED');
      }

      const reg = await navigator.serviceWorker.ready;

      // Reuse existing subscription if already subscribed
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
            sub = await reg.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
      }

      const json = sub.toJSON();

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


// Unsubscribe and remove from Supabase
export async function disablePushNotifications(userId) {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) return;

      const endpoint = sub.endpoint;
      await sub.unsubscribe();

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
