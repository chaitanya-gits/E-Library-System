import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePageTransition } from '../components/pageTransitionContext';

function OAuthSuccessPage() {
    const location = useLocation();
    const { navigateWithTransition } = usePageTransition();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        const name = params.get('name');
        const email = params.get('email');
        const error = params.get('error');

        if (error) {
            navigateWithTransition(`/login?error=${encodeURIComponent(error)}`, { replace: true }, 'Returning to sign in...');
            return;
        }

        if (!id || !email) {
            navigateWithTransition('/login?error=google_auth_failed', { replace: true }, 'Returning to sign in...');
            return;
        }

        localStorage.setItem('user', JSON.stringify({
            id: Number(id),
            name: name || email,
            email,
            active: true,
            activeLoans: 0,
        }));
        localStorage.setItem('isAuthenticated', 'true');
        navigateWithTransition('/books', { replace: true }, 'Opening your library...');
    }, [location.search, navigateWithTransition]);

    return null;
}

export default OAuthSuccessPage;
