// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDfUUSVf086_q7Mtou3_xibbycVlakxMjg',
  authDomain: 'smartlaundry-29ec0.firebaseapp.com',
  projectId: 'smartlaundry-29ec0',
  storageBucket: 'smartlaundry-29ec0.appspot.com',
  messagingSenderId: '253456688828',
  appId: '1:253456688828:web:1e700fe02120f97ec212b9',
  measurementId: 'G-GQ6ZZES3R7'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
