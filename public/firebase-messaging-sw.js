// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
// const firebaseConfig = JSON.parse(new URL(location).searchParams.get("firebaseConfig"))
const firebaseConfig = {
    apiKey: "AIzaSyBpR0z7Yj9i-Ko0EERW8_C75LXEqaelxrs",
    authDomain: "glyph-development-382218.firebaseapp.com",
    projectId: "glyph-development-382218",
    storageBucket: "glyph-development-382218.appspot.com",
    messagingSenderId: "520170255321",
    appId: "1:520170255321:web:53178c4f3ee47386275fc8",
    measurementId: "G-ST6TLJH6J5"
};
firebase.initializeApp(firebaseConfig);
// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});