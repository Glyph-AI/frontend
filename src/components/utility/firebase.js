import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { genericRequest } from './request_helper';

export const fetchToken = (setTokenFound, messaging, userId) => {
    return getToken(messaging, { 
            vapidKey: 'BA4lbbj9vRoTdbUUa1NBklv5jfnCJu4mxa0610mOh5i7ClPZu0KDv7QhhkOsgCt-Siz3VIs6VG9YPePAHJ7YXTU' 
        }).then((currentToken) => {
        if (currentToken) {
            setTokenFound(true);

            const data = {
                device_token: currentToken,
                user_id: userId
            }

            genericRequest("/notifications/user_device", "POST", JSON.stringify(data), () => {}, { "Content-Type": "application/json"})
            // Track the token -> client mapping, by sending to backend server
            // show on the UI that permission is secured
        } else {
            console.log('No registration token available. Request permission to generate one.');
            setTokenFound(false);
            // shows on the UI that permission is required 
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // catch error while creating client token
    });
}