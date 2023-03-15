let backendHost;
const apiVersion = 'v1';

const env = process.env.NODE_ENV

if (env === 'development') {
    backendHost = "http://localhost:8000";
} else if (hostname === 'staging.realsite.com') {
    backendHost = 'https://staging.api.realsite.com';
} else if (/^qa/.test(hostname)) {
    backendHost = `https://api.${hostname}`;
} else {
    backendHost = process.env.REACT_APP_BACKEND_HOST || 'http://localhost:8080';
}

export const API_ROOT = `${backendHost}`;