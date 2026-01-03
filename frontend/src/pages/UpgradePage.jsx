import React from 'react';
import './UpgradePage.css';

const UpgradePage = () => {
    return (
        <div className="upgrade-page-container">
            <div className="upgrade-header">
                <div className="premium-badge">STACXLABS PREMIUM</div>
                <h1>Unlock Your Reading Potential</h1>
                <p>Choose a plan that fits your reading habits. Upgrade anytime to access exclusive features.</p>
            </div>

            <div className="pricing-cards-container">
                {/* Basic Plan */}
                <div className="pricing-card basic">
                    <h3 className="plan-name">Basic</h3>
                    <div className="plan-price">
                        <span className="currency">$</span>
                        <span className="amount">0</span>
                        <span className="period">/ month</span>
                    </div>
                    <p className="plan-desc">Perfect for casual readers just getting started.</p>

                    <div className="divider"></div>

                    <ul className="plan-features">
                        <li className="feature included">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Access to Public Domain
                        </li>
                        <li className="feature included">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Max 3 Saved Books
                        </li>
                        <li className="feature included">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Online Reading Only
                        </li>
                        <li className="feature excluded">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            No Offline Downloads
                        </li>
                    </ul>

                    <button className="plan-btn current">Current Plan</button>
                </div>

                {/* Pro Plan */}
                <div className="pricing-card pro popular">
                    <div className="popular-badge">MOST POPULAR</div>
                    <h3 className="plan-name">StacX Pro</h3>
                    <div className="plan-price">
                        <span className="currency">$</span>
                        <span className="amount">9</span>
                        <span className="period">/ month</span>
                    </div>
                    <p className="plan-desc">For avid readers who need their library anywhere.</p>

                    <div className="divider"></div>

                    <ul className="plan-features">
                        <li className="feature included highlight">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            <b>Unlimited</b> Saved Books
                        </li>
                        <li className="feature included highlight">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            <b>Offline Downloads</b>
                        </li>
                        <li className="feature included highlight">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Night Reading Mode
                        </li>
                        <li className="feature included highlight">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            No Ads
                        </li>
                    </ul>

                    <button className="plan-btn upgrade-pro">Upgrade to Pro</button>
                </div>

                {/* Max Plan */}
                <div className="pricing-card max">
                    <h3 className="plan-name">StacX Max</h3>
                    <div className="plan-price">
                        <span className="currency">$</span>
                        <span className="amount">19</span>
                        <span className="period">/ month</span>
                    </div>
                    <p className="plan-desc">The ultimate experience for you and your family.</p>

                    <div className="divider"></div>

                    <ul className="plan-features">
                        <li className="feature included star">
                            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            Everything in Pro
                        </li>
                        <li className="feature included star">
                            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            <b>Family Sharing</b> (5 Accounts)
                        </li>
                        <li className="feature included star">
                            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            Audiobook Access
                        </li>
                        <li className="feature included star">
                            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            Priority Support
                        </li>
                    </ul>

                    <button className="plan-btn upgrade-max">Upgrade to Max</button>
                </div>
            </div>
        </div>
    );
};

export default UpgradePage;
