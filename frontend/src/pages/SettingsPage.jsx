import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SettingsPage.css';

const SettingsPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);

    // Form state
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');

    // Appearance state
    const [darkMode, setDarkMode] = useState(false);
    const [compactView, setCompactView] = useState(false);

    // UI state
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        // Load user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setDisplayName(parsedUser.name || '');
            setEmail(parsedUser.email || '');
        }
        // Load profile image from localStorage
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            setProfileImage(savedImage);
        }

        // Listen for profile image updates from Sidebar
        const handleProfileUpdate = (event) => {
            if (event.detail?.profileImage) {
                setProfileImage(event.detail.profileImage);
            }
        };

        window.addEventListener('profileImageUpdated', handleProfileUpdate);

        return () => {
            window.removeEventListener('profileImageUpdated', handleProfileUpdate);
        };
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();

        if (user) {
            const updatedUser = { ...user, name: displayName, email };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);

            // Dispatch event to update Sidebar
            window.dispatchEvent(new CustomEvent('userUpdated', {
                detail: { user: updatedUser }
            }));
        }
    };

    // Handle double-click on avatar to upload profile picture
    const handleAvatarDoubleClick = () => {
        fileInputRef.current?.click();
    };

    // Handle file selection and dispatch event to sync with Sidebar
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setProfileImage(base64String);
                localStorage.setItem('profileImage', base64String);

                // Dispatch custom event to notify other components (like Sidebar)
                window.dispatchEvent(new CustomEvent('profileImageUpdated', {
                    detail: { profileImage: base64String }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Format membership date
    const formatMembershipDate = (dateString) => {
        if (!dateString) return '2023';
        const date = new Date(dateString);
        return date.getFullYear();
    };

    // Get current date for header
    const getCurrentDate = () => {
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    if (!user) {
        return (
            <div className="settings-page">
                <div className="settings-loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="settings-page">
            {/* Hidden file input for profile picture upload */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />

            <div className="settings-header">
                <h1>Settings</h1>
                <p className="settings-date">{getCurrentDate()}</p>
            </div>

            {/* Profile Card */}
            <div className="profile-card">
                <div className="profile-info">
                    <div
                        className="profile-avatar"
                        onDoubleClick={handleAvatarDoubleClick}
                        title="Double-click to change profile picture"
                    >
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="avatar-image" />
                        ) : (
                            <div className="avatar-circle">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        )}
                        <div className="avatar-badge">
                            <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                        </div>
                        <div className="avatar-edit-hint">
                            <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg>
                        </div>
                    </div>

                    <div className="profile-details">
                        <h2>{user.name || 'User'}</h2>
                        <p className="profile-role">
                            Library Member • Member since {formatMembershipDate(user.membershipDate)}
                        </p>

                    </div>
                </div>

                <button className="btn-sign-out" onClick={handleSignOut}>
                    Sign Out
                </button>
            </div>

            {/* Settings Grid */}
            <div className="settings-grid">
                {/* Appearance Section */}
                <div className="settings-section">
                    <div className="section-header">
                        <div className="section-icon appearance-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        </div>
                        <h3>Appearance</h3>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Dark Mode</h4>
                            <p>Easier on the eyes in low light</p>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={(e) => setDarkMode(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Compact View</h4>
                            <p>Show more items per page</p>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={compactView}
                                onChange={(e) => setCompactView(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                {/* Account Details Section */}
                <div className="settings-section">
                    <div className="section-header">
                        <div className="section-icon account-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <h3>Account Details</h3>
                    </div>

                    <form onSubmit={handleSaveChanges} className="account-form">
                        <div className="form-group">
                            <label htmlFor="displayName">DISPLAY NAME</label>
                            <input
                                type="text"
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="emailAddress">EMAIL</label>
                            <input
                                type="email"
                                id="emailAddress"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>

                        {saveSuccess && (
                            <div className="save-success">
                                ✓ Changes saved successfully!
                            </div>
                        )}

                        <button type="submit" className="btn-save-changes">
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
