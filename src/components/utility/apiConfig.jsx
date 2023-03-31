let backendHost;
const apiVersion = 'v1';

const env = process.env.NODE_ENV

if (env === 'development') {
    backendHost = "http://localhost:8000";
} else if (env === 'gcloud_development') {
    backendHost = 'https://dev.api.glyphassistant.com';
} else {
    backendHost = process.env.REACT_APP_BACKEND_HOST || 'http://localhost:8080';
}

export const API_ROOT = `${backendHost}`;

if (env === 'development') {
    backendHost = "ws://localhost:8000";
} else if (env === 'gcloud_development') {
    backendHost = 'wss://dev.api.glyphassistant.com';
} else {
    backendHost = process.env.REACT_APP_BACKEND_HOST || 'ws://localhost:8080';
}

export const WS_ROOT = `${backendHost}`;