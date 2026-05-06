const App_URL = self.location.origin

self.addEventListener('push', (event) => {
      if (!event.data) return;

      const data = event.data.json();

      const options = {
            body: data.body,
            icon: './favicon.svg',       // Add your app icon here
            // badge: '/badge-72.png',      // Small monochrome badge icon
            tag: data.tag || data.todoId, // Collapses duplicate notifications
            renotify: true,
            data: { todoId: data.todoId, url: `${APP_URL}/task/${data.todoId}` },
            actions: [
                  { action: 'complete', title: '✅ Mark Complete' },
                  { action: 'snooze', title: '⏰ Snooze 15 min' },
            ],
            requireInteraction: true, // Stays on screen until user acts (iOS-like)
            vibrate: [200, 100, 200],
      };
      event.waitUntil(
            self.registration.showNotification(data.title, options)
      )
});


//Handle notification Click 
self.addEventListener('notifications', (event) => {
      event.notification.close();
      const { action } = event;
      const { todoId, url } = event.notification.data;

      if (action === 'complete') {
            event.waitUntil(
                  clients.matchAll({ type: 'window' }).then((clientList) => {
                        //FOR EVERY USERS OF THE APPLICATION
                        clientList.forEach(client => {
                              client.pushMessage({ type: 'MARK_COMPLETED', todoId });
                        });
                  })
            );
            return;
      }
      if (action === 'snooze') {
            event.waitUntil(
                  clients.matchAll({ type: 'window' }).then((clientList) => {
                        //FOR EVERY USERS OF THE APPLICATION
                        clientList.forEach(client => {
                              client.pushMessage({ type: 'SNOOZED_TODO', todoId });
                        });
                  })
            );
            return;

      }

      //DEFAULT FUNCIONALITY

      event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                  .then((clientList) => {
                        for (const client of clientList) {
                              if (client.url === url && 'focus' in client) return client.focus();
                        }
                        if (clients.openWindow) return clients.openWindow(url);
                  })
      );
      return;
})