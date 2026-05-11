// The Actuall CRON job will be takes place in here.
import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';


const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_PRIVATE_KEY;
const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
);


webpush.setVapidDetails(
      import.meta.env.VITE_VAPID_SUBJECT,
      import.meta.env.VITE_VAPID_PUBLIC_KEY,
      import.meta.env.VITE_VAPID_PRIVATE_KEY
)

function formatRelativeTime(dateStr) {
      const diff = new Date(dateStr).getTime() - Date.now();
      const abs = Math.abs(diff);
      const past = diff < 0;

      if (abs < 60_000) return past ? 'just now' : 'in less than a minute';
      if (abs < 3_600_000) {
            const m = Math.round(abs / 60_000);
            return past ? `${m}m ago` : `in ${m}m`;
      }
      if (abs < 86_400_000) {
            const h = Math.round(abs / 3_600_000);
            return past ? `${h}h ago` : `in ${h}h`;
      }
      const d = Math.round(abs / 86_400_000);
      return past ? `${d}d ago` : `in ${d}d`;
}

function buildNotificationContent(todo, now) {
      const isOverdue = new Date(todo.due_date) < now;
      const mins = todo.reminder_minutes_before;

      const title = isOverdue
            ? `⚠️ Overdue: ${todo.title}`
            : mins === 0
                  ? `🔔 Due now: ${todo.title}`
                  : `⏰ ${todo.title}`;

      const body = todo.description?.trim()
            || (isOverdue
                  ? `This task was due ${formatRelativeTime(todo.due_date)}`
                  : `Due ${formatRelativeTime(todo.due_date)}`);

      return { title, body };
}


async function processReminders() {
      const now = new Date();
      const windowEnd = new Date(now.getTime() + 60_000);

      console.log(`[${now.toISOString()}] Checking reminders...`);

      // Fetch all pending todos 
      const { data: todos, error } = await supabase
            .from('todos')
            .select('id, title, description, due_date, reminder_minutes_before, user_id')
            .eq('completed', false)
            .eq('reminder_sent', false)
            .eq('is_deleted', false)
            .not('reminder_minutes_before', 'is', null)
            .not('due_date', 'is', null);

      if (error) {
            console.error('Supabase query error:', error.message);
            return;
      }

      if (!todos?.length) {
            console.log('No pending reminders.');
            return;
      }


      const dueNow = todos.filter(todo => {
            const dueDate = new Date(todo.due_date);
            const reminderFiresAt = new Date(
                  dueDate.getTime() - todo.reminder_minutes_before * 60_000
            );
            return reminderFiresAt >= now && reminderFiresAt < windowEnd;
      });

      if (!dueNow.length) {
            console.log('No reminders firing this minute.');
            return;
      }

      console.log(`Firing ${dueNow.length} reminder(s)...`);

      for (const todo of dueNow) {
            await sendReminderForTodo(todo, now);
      }
}

async function sendReminderForTodo(todo, now) {
      // Get all push subscriptions for this user (multi-device support)
      const { data: subs, error } = await supabase
            .from('push_subscriptions')
            .select('id, endpoint, p256dh, auth_key')
            .eq('user_id', todo.user_id);

      if (error || !subs?.length) {
            console.log(`No subscriptions for user ${todo.user_id}, skipping.`);
            return;
      }

      const { title, body } = buildNotificationContent(todo, now);

      const payload = JSON.stringify({
            title,
            body,
            todoId: todo.id,
            tag: `todo-${todo.id}`,
            timestamp: now.toISOString(),
      });

      // Send to all devices in parallel
      const results = await Promise.allSettled(
            subs.map(async (sub) => {
                  try {
                        await webpush.sendNotification(
                              {
                                    endpoint: sub.endpoint,
                                    keys: { p256dh: sub.p256dh, auth: sub.auth_key },
                              },
                              payload,
                              { TTL: 3600 }
                        );
                        console.log(`  ✓ Sent to device ${sub.id.slice(0, 8)}`);
                  } catch (err) {
                        if (err.statusCode === 410 || err.statusCode === 404) {
                              // Subscription expired — clean it up silently
                              console.log(`  ✗ Stale subscription ${sub.id.slice(0, 8)}, removing.`);
                              await supabase
                                    .from('push_subscriptions')
                                    .delete()
                                    .eq('id', sub.id);
                        } else {
                              console.error(`  ✗ Push error ${err.statusCode}:`, err.body);
                        }
                  }
            })
      );

      const succeeded = results.filter(r => r.status === 'fulfilled').length;

      if (succeeded > 0) {
            // Mark as sent only if at least one device received it
            const { error: updateError } = await supabase
                  .from('todos')
                  .update({
                        reminder_sent: true,
                        reminder_sent_at: now.toISOString(),
                  })
                  .eq('id', todo.id);

            if (updateError) {
                  console.error('Failed to mark reminder_sent:', updateError.message);
            } else {
                  console.log(`  ✓ Marked todo ${todo.id.slice(0, 8)} as reminder_sent`);
            }
      }
}

// ---- Cron Schedular ---- 

cron.schedule('* * * * *', processReminders, {
      timezone: 'Asia/Kolkata',
});

console.log('SyncTask reminder server running. Checking every minute...');

processReminders();