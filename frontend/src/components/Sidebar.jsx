import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { usePageTransition } from './pageTransitionContext';
import '../styles/SidebarDropdown.css';

const Sidebar = () => {
    const { beginTransition, navigateWithTransition } = usePageTransition();
    const [user, setUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);

    const getAvatarColor = (name) => {
        const colors = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];
        if (!name) return '#E2E8F0';
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setProfileImage(parsedUser.profileImage || null);
        }

        const handleProfileUpdate = (event) => {
            if (event.detail?.profileImage) {
                setProfileImage(event.detail.profileImage);
            }
        };

        const handleUserUpdate = (event) => {
            if (event.detail?.user) {
                setUser(event.detail.user);
                if (event.detail.user.profileImage) {
                    setProfileImage(event.detail.user.profileImage);
                }
            }
        };

        window.addEventListener('profileImageUpdated', handleProfileUpdate);
        window.addEventListener('userUpdated', handleUserUpdate);

        return () => {
            window.removeEventListener('profileImageUpdated', handleProfileUpdate);
            window.removeEventListener('userUpdated', handleUserUpdate);
        };
    }, []);

    const [isDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('theme');
        return savedMode === 'dark';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('profileImage');
        navigateWithTransition('/login', {}, 'Signing you out...');
    };

    const handleSettings = () => {
        setShowUserMenu(false);
        navigateWithTransition('/settings', {}, 'Opening settings...');
    };

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    const handleAvatarDoubleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setProfileImage(base64String);

                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                currentUser.profileImage = base64String;
                localStorage.setItem('user', JSON.stringify(currentUser));
                setUser(currentUser);

                window.dispatchEvent(new CustomEvent('profileImageUpdated', {
                    detail: { profileImage: base64String }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <aside className="sidebar">
            <div className="brand" onClick={() => navigateWithTransition('/books', {}, 'Loading your library...')} style={{ cursor: 'pointer' }}>
                <span className="brand-text">StacXlabs</span>
            </div>

            <div className="menu-group">
                <div className="menu-label">BROWSE</div>
                <NavLink to="/books" onClick={() => beginTransition('Loading your library...')} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <div className="nav-item-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </div>
                    <span>Discover</span>
                </NavLink>

                <NavLink to="/category" onClick={() => beginTransition('Loading categories...')} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <div className="nav-item-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                    </div>
                    <span>Category</span>
                </NavLink>
            </div>

            <div className="menu-group">
                <div className="menu-label">LIBRARY</div>
                <NavLink to="/library" onClick={() => beginTransition('Loading your library...')} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <div className="nav-item-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                    </div>
                    <span>My Library</span>
                </NavLink>

                <NavLink to="/downloads" onClick={() => beginTransition('Loading downloads...')} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <div className="nav-item-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </div>
                    <span>Downloads</span>
                </NavLink>

                <NavLink to="/favorites" onClick={() => beginTransition('Loading favorites...')} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <div className="nav-item-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </div>
                    <span>Favorites</span>
                </NavLink>
            </div>

            <div className="sidebar-user-section">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />

                {showUserMenu && (
                    <div className="user-dropdown-menu">
                        <div className="user-dropdown-item" onClick={handleSettings}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                            <span>Settings</span>
                        </div>

                        <div className="user-dropdown-item upgrade-item" onClick={() => navigateWithTransition('/upgrade', {}, 'Opening plans...')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="icon-blue">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                            </svg>
                            <span>Upgrade Plan</span>
                        </div>

                        <div className="dropdown-separator"></div>

                        <div className="user-dropdown-item logout-item" onClick={handleLogout}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            <span>Logout</span>
                        </div>
                    </div>
                )}

                <div className="sidebar-user-profile" onClick={toggleUserMenu}>
                    <div
                        className="user-profile-avatar"
                        onDoubleClick={(event) => {
                            event.stopPropagation();
                            handleAvatarDoubleClick();
                        }}
                        title="Double-click to change profile picture"
                        style={profileImage ? {
                            backgroundImage: `url(${profileImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundColor: 'transparent'
                        } : {
                            backgroundColor: getAvatarColor(user?.name),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#333',
                            fontWeight: 'bold',
                            fontSize: '16px'
                        }}
                    >
                        {!profileImage && (user?.name ? user.name.charAt(0).toUpperCase() : 'U')}
                    </div>
                    <div className="user-profile-info">
                        <span className="user-profile-name">{user?.name || 'User'}</span>
                        <span className="user-profile-plan">Basic Plan</span>
                    </div>
                    <div className="user-profile-toggle-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-icon">
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
