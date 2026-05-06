// import {} from '../../public/'

import { supabase } from '../lib/supabase-client';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

function urlBased64ToUint8Array(base64String) {
      const now = new Date();
      const windowEnd = new Date(now.getTime() + 60_000)  //60 seconds


      const { data: todos, error } = await supabase
            .from('todos')
            .select(
                  `id, title, description, due_date, reminder_minutes_before, user_id`
            )
            .eq('completed', false)
            .eq('reminder_sent', flase)
            .not('reminder_minutes_before', 'is', null)
            .not('due_date', 'is', null)
            .gte(
                  'due_date',
                  new Date(now.getTime()).toISOString()
            );
      if (error) {
            console.error('Query Error : ', error.message);
            return new Response('Error', { status: 500 });
      }

      //FILTER TASK 

      const dueNow = (todos ?? []).filter(todo => {
            const dueDate = new Date(todo.due_date);
            const reminderTime = new Date(
                  dueDate.getTime() - todo.reminder_minutes_before * 60_000
            );

            return reminderTime >= now && reminderTime < windowEnd;

      });

      for (const todo of dueNow) {
            // Get all push subscriptions for this user
            const { data: subs } = await supabase
                  .from('push_subscriptions')
                  .select('endpoint, p256dh, auth_key')
                  .eq('user_id', todo.user_id);

            if (!subs?.length) continue;

            const isOverdue = new Date(todo.due_date) < now;
            const minutesBefore = todo.reminder_minutes_before;

            const notifTitle = isOverdue
                  ? `⚠️ Overdue: ${todo.title}`
                  : minutesBefore === 0
                        ? `🔔 Due now: ${todo.title}`
                        : `⏰ Reminder: ${todo.title}`;

            const notifBody = todo.description
                  || (isOverdue
                        ? `This task was due ${formatRelativeTime(todo.due_date)}`
                        : `Due ${formatRelativeTime(todo.due_date)}`);

            const payload = JSON.stringify({
                  title: notifTitle,
                  body: notifBody,
                  todoId: todo.id,
                  tag: `todo-${todo.id}`,
            });

            // Send to all user devices in parallel
            const pushPromises = subs.map(async (sub) => {
                  try {
                        await webpush.sendNotification(
                              { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } },
                              payload
                        );
                  } catch (err) {
                        // 410 Gone = subscription expired, clean it up
                        if (err.statusCode === 410) {
                              await supabase
                                    .from('push_subscriptions')
                                    .delete()
                                    .eq('endpoint', sub.endpoint);
                        }
                  }
            });

            await Promise.allSettled(pushPromises);

            // Mark reminder as sent — prevents duplicate notifications
            await supabase
                  .from('todos')
                  .update({ reminder_sent: true, reminder_sent_at: now.toISOString() })
                  .eq('id', todo.id);
      }

      return new Response(`Processed ${dueNow.length} reminders`, { status: 200 });
};

function formatRelativeTime(dateStr) {
      const diff = new Date(dateStr).getTime() - Date.now();
      const abs = Math.abs(diff);
      const past = diff < 0;
      if (abs < 60_000) return past ? 'just now' : 'in less than a minute';
      if (abs < 3_600_000) {
            const m = Math.round(abs / 60_000);
            return past ? `${m}m ago` : `in ${m}m`;
      }
      const h = Math.round(abs / 3_600_000);
      return past ? `${h}h ago` : `in ${h}h`;
}



