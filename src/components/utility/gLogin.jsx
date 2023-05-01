let gLogin;
const apiVersion = 'v1';
const env = process.env.NEXT_PUBLIC_ENVIRONMENT
if (env === 'local') {
    gLogin = "991199193983-h5pq059ivvtim8q0hp86d7asigjbbjcc.apps.googleusercontent.com";
} else if (env === 'development') {
    gLogin = '520170255321-a0i4dvb074idd0q7dcrh4g0mb5gqvaut.apps.googleusercontent.com';
} else {
    gLogin = "991199193983-h5pq059ivvtim8q0hp86d7asigjbbjcc.apps.googleusercontent.com";
}

export const GOOGLE_LOGIN_KEY = gLogin;
