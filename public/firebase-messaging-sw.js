// It's a static script file, so it won't be covered by a module bundling system
// hence, it uses "importScripts" function to load the other libs
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Replace the values with yours
const firebaseConfig = {
  apiKey: 'AIzaSyDfUUSVf086_q7Mtou3_xibbycVlakxMjg',
  authDomain: 'smartlaundry-29ec0.firebaseapp.com',
  projectId: 'smartlaundry-29ec0',
  storageBucket: 'smartlaundry-29ec0.appspot.com',
  messagingSenderId: '253456688828',
  appId: '1:253456688828:web:1e700fe02120f97ec212b9',
  measurementId: 'G-GQ6ZZES3R7'
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.message,
    icon: '/favicon.ico',
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const pathname = event.notification?.data?.link;
  if (!pathname) return;
  const url = new URL(pathname, self.location.origin).href;

  event.waitUntil(self.clients.matchAll({
    type: 'window', includeUncontrolled: true
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url === url && 'focus' in client)
        return client.focus();
    }
    if (self.clients.openWindow)
      return self.clients.openWindow(url);
  }));
});

// Both of them ain't working

// background notifications will be received here
// messaging.setBackgroundMessageHandler(function (payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/favicon.ico'
//   };

//   return self.registration.showNotification(notificationTitle, notificationOptions);
// });
