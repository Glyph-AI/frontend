let backendHost;
const apiVersion = 'v1';
const env = process.env.ENVIRONMENT
if (env === 'local') {
    backendHost = "http://localhost:8000";
} else if (env === 'development') {
    backendHost = 'https://dev-api.glyphassistant.com';
} else if (/^qa/.test(hostname)) {
    backendHost = `https://api.${hostname}`;
} else {
    backendHost = process.env.REACT_APP_BACKEND_HOST || 'http://localhost:8080';
}

export const API_ROOT = backendHost