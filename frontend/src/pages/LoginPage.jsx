import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import GoogleLogo from '../assets/images/google-logo.svg';
import SignInImage from '../assets/images/SignIn_Image.jpg';
import { usePageTransition } from '../components/pageTransitionContext';
import { userApi } from '../services/api';
import { startGoogleLogin } from '../services/socialAuth';
import { PASSWORD_REGEX, PASSWORD_RULE_MESSAGE } from '../utils/auth';

const PasswordInput = ({ id, value, onChange, placeholder, show, onToggle, label }) => (
    <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <div style={{ position: 'relative' }}>
            <input
                type={show ? 'text' : 'password'}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
                style={{ width: '100%' }}
            />
            <button
                type="button"
                onClick={onToggle}
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    color: '#64748b'
                }}
            >
                {show ? (
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
            </button>
        </div>
    </div>
);

const LoginPage = () => {
    const [searchParams] = useSearchParams();
    const { beginTransition, navigateWithTransition } = usePageTransition();
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const authError = searchParams.get('error');
        if (authError === 'google_auth_failed') {
            setError('Google sign-in failed. Please try again.');
        } else if (authError === 'google_email_missing') {
            setError('Google did not return an email address for this account.');
        }
    }, [searchParams]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await userApi.login(email, password);
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('isAuthenticated', 'true');
            navigateWithTransition('/books', {}, 'Opening your library...');
        } catch (requestError) {
            console.error(requestError);
            if (requestError.response?.data?.message) {
                setError(requestError.response.data.message);
            } else {
                setError('Invalid credentials');
            }
        }
    };

    const handleGoogleSignIn = () => {
        beginTransition('Connecting to Google...');
        window.setTimeout(() => {
            startGoogleLogin();
        }, 90);
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        if (!newPassword || !confirmNewPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!PASSWORD_REGEX.test(newPassword)) {
            setError(PASSWORD_RULE_MESSAGE);
            return;
        }

        try {
            await userApi.resetPassword(email, newPassword);
            setSuccess('Password reset successfully! Please login with your new password.');
            setTimeout(() => {
                setIsForgotPassword(false);
                setSuccess('');
                setNewPassword('');
                setConfirmNewPassword('');
            }, 2000);
        } catch (requestError) {
            console.error(requestError);
            if (requestError.response?.data?.message) {
                setError(requestError.response.data.message);
            } else {
                setError('Failed to reset password. Please check if the email is correct.');
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="auth-content">
                    <h1 className="auth-title">
                        {isForgotPassword ? 'Reset Password' : 'Welcome Back'}
                    </h1>
                    <p className="auth-subtitle">
                        {isForgotPassword
                            ? 'Create a new strong password for your account.'
                            : 'Sign in to access your library.'}
                    </p>

                    {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem', background: '#fee2e2', padding: '0.5rem', borderRadius: '8px' }}>{error}</div>}
                    {success && <div style={{ color: 'green', marginBottom: '1rem', fontSize: '0.9rem', background: '#dcfce7', padding: '0.5rem', borderRadius: '8px' }}>{success}</div>}

                    {!isForgotPassword ? (
                        <>
                            <form onSubmit={handleLogin} className="auth-form">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="user@email.com"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                    />
                                </div>

                                <PasswordInput
                                    id="password"
                                    label="Password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="At least 8 characters"
                                    show={showPassword}
                                    onToggle={() => setShowPassword(!showPassword)}
                                />

                                <div className="form-footer">
                                    <button
                                        type="button"
                                        onClick={() => setIsForgotPassword(true)}
                                        style={{ color: '#2563eb', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                <button type="submit" className="btn-auth-primary">
                                    Sign in
                                </button>
                            </form>

                            <div className="auth-divider">
                                <span>Or</span>
                            </div>

                            <div className="social-auth">
                                <button type="button" className="btn-social" onClick={handleGoogleSignIn}>
                                    <img src={GoogleLogo} alt="Google" width="24" height="24" />
                                    Sign in with Google
                                </button>
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleResetPassword} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="reset-email">Confirm Email</label>
                                <input
                                    type="email"
                                    id="reset-email"
                                    placeholder="Confirm email address"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                />
                            </div>

                            <PasswordInput
                                id="new-password"
                                label="New Password"
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                placeholder="Enter new password"
                                show={showNewPassword}
                                onToggle={() => setShowNewPassword(!showNewPassword)}
                            />

                            <PasswordInput
                                id="confirm-password"
                                label="Confirm New Password"
                                value={confirmNewPassword}
                                onChange={(event) => setConfirmNewPassword(event.target.value)}
                                placeholder="Re-enter password"
                                show={showConfirmPassword}
                                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                            />

                            <div className="form-footer">
                                <button
                                    type="button"
                                    onClick={() => setIsForgotPassword(false)}
                                    style={{ color: '#64748b', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                >
                                    Cancel
                                </button>
                            </div>

                            <button type="submit" className="btn-auth-primary">
                                Reset Password
                            </button>
                        </form>
                    )}

                    {!isForgotPassword && (
                        <div className="auth-redirect">
                            Don&apos;t have an account? <Link to="/signup" onClick={() => beginTransition('Loading sign up...')} style={{ color: '#2563eb' }}>Sign up</Link>
                        </div>
                    )}
                </div>
            </div>
            <div className="auth-right">
                <div className="auth-image-overlay">
                    <img
                        src={SignInImage}
                        alt="Library Sign In"
                        className="auth-hero-image"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
