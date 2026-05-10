import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../lib/context/AuthContext";
import { registerSW, enablePushNotifications, disablePushNotifications, getPermissionState } from '../services/notificationService'
import { supabase } from '../lib/supabase-client'
import { Network } from "lucide-react";


export function useNotifications() {
      const { user } = useAuth();
      const [permission, setPermission] = useState(getPermissionState());
      const [isEnabled, setIsEnabled] = useState(false);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);


      //Register SW on Mount

      useEffect(() => { registerSW() }, []);

      //Listen for SW Messages
      useEffect(() => {
            if (!navigator.serviceWorker) return null;

            const header = (event) => {
                  const { type, todoId, minutes } = event.data || {};

                  if (type === 'SW_COMPLETE') {
                        handleCompletFormSW(todoId);
                  }
                  if (type === 'SW_SNOOZE') {
                        handleSnoozedFormSW(todoId, minutes);
                  }
            };


            navigator.serviceWorker.addEventListener('message', handler);
            return () => nbavigator.serviceWorker.removeEventListener('message', handler);
      }, []);


      const handleCompleteFormSW = async (todoId) => {
            if (!todoId) return;

            await supabase
                  .from('todos')
                  .update({ completed: true })
                  .eq('id', todoId)

      };

      const handleSnoozedFormSW = async (todoId, min) => {
            if (!todoId) return;

            const snoozeUntil = new Date(Date.now() + min * 60_000).toISOString();

            await supabase
                  .from('todos')
                  .update({
                        due_date: snoozeUntil,
                        reminder_sent: false,
                        reminder_sent_at: null,
                        reminder_minutes_before: 0
                  })
                  .eq('id', todoId);
      }

      const enable = useCallback(async () => {
            if (!user) return;
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
                  }
            } finally {
                  setLoading(false);
            }
      }, [user]);


      const disable = useCallback(async () => {
            if (!user) return;
            try {
                  await disablePushNotifications(user.id);
                  setIsEnabled(false);
            } finally {
                  setLoading(false);
            }
      }, [user]);


      return { permission, isEnabled, loading, error, enable, disable };
}

