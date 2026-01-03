import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BookDetailsModal.css';

const BookDetailsModal = ({ book, onClose }) => {
    const navigate = useNavigate();
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (book) {
            // Check if book is downloaded
            const downloadedBooks = JSON.parse(localStorage.getItem('downloadedBooks') || '[]');
            setIsDownloaded(downloadedBooks.some(b => b.id === book.id));

            // Check if book is favorite
            const favoriteBooks = JSON.parse(localStorage.getItem('favoriteBooks') || '[]');
            setIsFavorite(favoriteBooks.some(b => b.id === book.id));
        }
    }, [book]);

    if (!book) return null;

    const handleDownloadToggle = () => {
        const downloadedBooks = JSON.parse(localStorage.getItem('downloadedBooks') || '[]');

        if (isDownloaded) {
            // Remove from downloads
            const updatedBooks = downloadedBooks.filter(b => b.id !== book.id);
            localStorage.setItem('downloadedBooks', JSON.stringify(updatedBooks));
            setIsDownloaded(false);
        } else {
            // Add to downloads
            downloadedBooks.push(book);
            localStorage.setItem('downloadedBooks', JSON.stringify(downloadedBooks));
            setIsDownloaded(true);
        }

        window.dispatchEvent(new CustomEvent('booksUpdated'));
    };

    const handleFavoriteToggle = () => {
        const favoriteBooks = JSON.parse(localStorage.getItem('favoriteBooks') || '[]');

        if (isFavorite) {
            // Remove from favorites
            const updatedBooks = favoriteBooks.filter(b => b.id !== book.id);
            localStorage.setItem('favoriteBooks', JSON.stringify(updatedBooks));
            setIsFavorite(false);
        } else {
            // Add to favorites
            favoriteBooks.push(book);
            localStorage.setItem('favoriteBooks', JSON.stringify(favoriteBooks));
            setIsFavorite(true);
        }

        window.dispatchEvent(new CustomEvent('booksUpdated'));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                <div className="modal-content">
                    <div className="modal-left">
                        <div className="modal-book-cover-wrapper">
                            <img src={book.coverImage} alt={book.title} className="modal-book-cover" />
                            <button className="modal-zoom-btn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="modal-right">
                        {book.isBestseller && <span className="bestseller-badge">BESTSELLER</span>}
                        <h1 className="modal-book-title">{book.title}</h1>
                        <p className="modal-book-author">by {book.author}</p>

                        <div className="modal-metadata-grid">
                            <div className="metadata-item">
                                <span className="metadata-label">PUBLISHED</span>
                                <span className="metadata-value">{book.publishedDate}</span>
                            </div>
                            <div className="metadata-item">
                                <span className="metadata-label">ISBN</span>
                                <span className="metadata-value">{book.isbn}</span>
                            </div>
                            <div className="metadata-item">
                                <span className="metadata-label">PAGES</span>
                                <span className="metadata-value">{book.pages}</span>
                            </div>
                            <div className="metadata-item">
                                <span className="metadata-label">LANGUAGE</span>
                                <span className="metadata-value">{book.language}</span>
                            </div>
                        </div>

                        <div className="modal-about">
                            <h3>About the Book</h3>
                            <p>{book.description}</p>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="read-sample-btn"
                                onClick={() => navigate(`/read/${book.id}`)}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                </svg>
                                Read Sample
                            </button>
                            <button
                                className={`icon-action-btn ${isFavorite ? 'active favorite' : ''}`}
                                onClick={handleFavoriteToggle}
                                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill={isFavorite ? 'currentColor' : 'none'}
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </button>
                            <button
                                className={`icon-action-btn ${isDownloaded ? 'active downloaded' : ''}`}
                                onClick={handleDownloadToggle}
                                title={isDownloaded ? 'Remove download' : 'Download for offline'}
                            >
                                {isDownloaded ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailsModal;
