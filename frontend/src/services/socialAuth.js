const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:8080';

export function startGoogleLogin() {
    window.location.assign(`${AUTH_BASE_URL}/oauth2/authorization/google`);
}
