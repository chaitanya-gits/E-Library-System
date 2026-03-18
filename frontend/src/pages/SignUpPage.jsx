import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLogo from '../assets/images/google-logo.svg';
import SignInImage from '../assets/images/SignIn_Image.jpg';
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

const SignUpPage = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleSignUp = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!PASSWORD_REGEX.test(password)) {
            setError(PASSWORD_RULE_MESSAGE);
            return;
        }

        try {
            const fullName = `${firstName} ${lastName}`.trim();
            await userApi.create({
                name: fullName,
                email,
                password,
                active: true,
            });

            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 700);
        } catch (requestError) {
            console.error(requestError);
            if (requestError.response?.data?.message) {
                setError(requestError.response.data.message);
            } else {
                setError('Failed to create account. Email may already be taken.');
            }
        }
    };

    const handleGoogleSignUp = () => {
        startGoogleLogin();
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="auth-content">
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">
                        Create your account to access the library.
                    </p>

                    {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem', background: '#fee2e2', padding: '0.5rem', borderRadius: '8px' }}>{error}</div>}
                    {success && <div style={{ color: 'green', marginBottom: '1rem', fontSize: '0.9rem', background: '#dcfce7', padding: '0.5rem', borderRadius: '8px' }}>{success}</div>}

                    <form onSubmit={handleSignUp} className="auth-form">
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    placeholder="James"
                                    value={firstName}
                                    onChange={(event) => setFirstName(event.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    placeholder="Franco"
                                    value={lastName}
                                    onChange={(event) => setLastName(event.target.value)}
                                    required
                                />
                            </div>
                        </div>

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
                            placeholder="Enter password"
                            show={showPassword}
                            onToggle={() => setShowPassword(!showPassword)}
                        />

                        <PasswordInput
                            id="confirmPassword"
                            label="Confirm Password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            placeholder="Re-enter password"
                            show={showConfirmPassword}
                            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                        />

                        <button type="submit" className="btn-auth-primary">Sign Up</button>
                    </form>

                    <div className="auth-divider">
                        <span>Or</span>
                    </div>

                    <div className="social-auth">
                        <button type="button" className="btn-social" onClick={handleGoogleSignUp}>
                            <img src={GoogleLogo} alt="Google" width="24" height="24" />
                            Sign up with Google
                        </button>
                    </div>

                    <div className="auth-redirect">
                        Already have an account? <Link to="/login" style={{ color: '#2563eb' }}>Log in</Link>
                    </div>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-image-overlay">
                    <img
                        src={SignInImage}
                        alt="Library Sign Up"
                        className="auth-hero-image"
                    />
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
