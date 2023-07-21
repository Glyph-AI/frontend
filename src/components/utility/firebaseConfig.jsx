const env = process.env.NEXT_PUBLIC_ENVIRONMENT

let firebaseConfig;

if (env === 'local') {
    firebaseConfig = {
        apiKey: "AIzaSyBpR0z7Yj9i-Ko0EERW8_C75LXEqaelxrs",
        authDomain: "glyph-development-382218.firebaseapp.com",
        projectId: "glyph-development-382218",
        storageBucket: "glyph-development-382218.appspot.com",
        messagingSenderId: "520170255321",
        appId: "1:520170255321:web:53178c4f3ee47386275fc8",
        measurementId: "G-ST6TLJH6J5"
    };
} else if (env === 'development') {
    firebaseConfig = {
        apiKey: "AIzaSyBpR0z7Yj9i-Ko0EERW8_C75LXEqaelxrs",
        authDomain: "glyph-development-382218.firebaseapp.com",
        projectId: "glyph-development-382218",
        storageBucket: "glyph-development-382218.appspot.com",
        messagingSenderId: "520170255321",
        appId: "1:520170255321:web:53178c4f3ee47386275fc8",
        measurementId: "G-ST6TLJH6J5"
    };
} else if (env === "production") {
    firebaseConfig = {
        apiKey: "AIzaSyDys67V1tn5PnqKJkpNIA6cqzd_QnyBlqM",
        authDomain: "glyph-production.firebaseapp.com",
        projectId: "glyph-production",
        storageBucket: "glyph-production.appspot.com",
        messagingSenderId: "511935008815",
        appId: "1:511935008815:web:8973564cfa1080fe5a76da",
        measurementId: "G-XKZ6CHQ9DY"
    };
} else {
    firebaseConfig = {
        apiKey: "AIzaSyBpR0z7Yj9i-Ko0EERW8_C75LXEqaelxrs",
        authDomain: "glyph-development-382218.firebaseapp.com",
        projectId: "glyph-development-382218",
        storageBucket: "glyph-development-382218.appspot.com",
        messagingSenderId: "520170255321",
        appId: "1:520170255321:web:53178c4f3ee47386275fc8",
        measurementId: "G-ST6TLJH6J5"
    };
}

export const FIREBASE_CONFIG = firebaseConfig