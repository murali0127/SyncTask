import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../lib/context/AuthContext";
import { registerSW, enablePushNotifications, disablePushNotifications, getPermissionState, isNotificationSupported } from '../services/notificationService'
import { supabase } from '../lib/supabase-client'


export function useNotifications() {
      const { user } = useAuth();
      const [permission, setPermission] = useState(getPermissionState());
      const [isEnabled, setIsEnabled] = useState(false);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);


      //Register SW on Mount

      useEffect(() => { registerSW() }, []);

      //Listen && Handles SW Messages
      useEffect(() => {
            if (!navigator.serviceWorker) return;  //returns Undefined

            //Header of SW Message
            const header = (event) => {
                  const { type, todoId, minutes } = event.data || {};

                  if (type === 'SW_COMPLETE') {
                        handleCompleteFromSW(todoId);
                  }
                  if (type === 'SW_SNOOZE') {
                        handleSnoozeFromSW(todoId, minutes);
                  }
            };


            navigator.serviceWorker.addEventListener('message', header);
            return () => navigator.serviceWorker.removeEventListener('message', header);
      }, []);


      const handleCompleteFromSW = async (todoId) => {
            if (!todoId) return;

            await supabase
                  .from('todos')
                  .update({
                        completed: true,
                        updated_at: new Date().toISOString()
                  })
                  .eq('id', todoId)

      };

      const handleSnoozeFromSW = async (todoId, min) => {
            if (!todoId) return;

            const snoozeUntil = new Date(Date.now() + min * 60_000).toISOString();

            await supabase
                  .from('todos')
                  .update({
                        due_date: snoozeUntil,
                        reminder_sent: false,
                        reminder_sent_at: null,
                        reminder_minutes_before: 0,
                        updated_at: new Date().toISOString()
                  })
                  .eq('id', todoId);
      }

      const enable = useCallback(async () => {
            if (!user?.id) return;
            setLoading(true);
            setError(null);
            try {
                  await enablePushNotifications(user.id);
                  setPermission('granted');
                  setIsEnabled(true);
            } catch (error) {
                  if (error.message === 'PERMISSION_DENIED') {
                        setPermission('denied');
                        setError('Please enable notification in your browser settings.');
                  } else {
                        setError('Failed to enable notifications. Try again');
                        console.error('[SyncTask SW] Enable error : ', error);
                  }
            } finally {
                  setLoading(false);
            }
      }, [user?.id]);


      const disable = useCallback(async () => {
            if (!user?.id) return;
            setLoading(true);
            try {
                  await disablePushNotifications(user.id);
                  setIsEnabled(false);
                  setPermission('default');
            } finally {
                  setLoading(false);
            }
      }, [user?.id]);


      return { permission, isEnabled, loading, error, enable, disable, isSupported: isNotificationSupported() };
}

