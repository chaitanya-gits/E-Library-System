import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function OAuthSuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        const name = params.get('name');
        const email = params.get('email');
        const error = params.get('error');

        if (error) {
            navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
            return;
        }

        if (!id || !email) {
            navigate('/login?error=google_auth_failed', { replace: true });
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
        navigate('/books', { replace: true });
    }, [location.search, navigate]);

    return null;
}

export default OAuthSuccessPage;
