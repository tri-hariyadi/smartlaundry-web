/* eslint-disable no-console */
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';

initializeApp({
  apiKey: 'AIzaSyDfUUSVf086_q7Mtou3_xibbycVlakxMjg',
  authDomain: 'smartlaundry-29ec0.firebaseapp.com',
  projectId: 'smartlaundry-29ec0',
  storageBucket: 'smartlaundry-29ec0.appspot.com',
  messagingSenderId: '253456688828',
  appId: '1:253456688828:web:1e700fe02120f97ec212b9',
  measurementId: 'G-GQ6ZZES3R7'
});


export const requestForToken = async () => {
  const messaging = getMessaging();
  try {
    const currentToken = await getToken(messaging,
      { vapidKey: 'BNlQXTzqaqqIWvx-GH3zQS4COX7qPfR3ryPhB_5TzcorEmcMIkVA8lRwWuRZlu-1SA8Y2FEzRwhvXvIfXfMVnVI' });
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return undefined;
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', JSON.stringify(err));
    return undefined;
  }
};

export const onMessageListener = () => {
  const messaging = getMessaging();

  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};
