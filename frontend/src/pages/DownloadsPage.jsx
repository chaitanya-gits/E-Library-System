import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DownloadsPage.css';

function DownloadsPage() {
    const navigate = useNavigate();
    const [downloadedBooks, setDownloadedBooks] = useState([]);

    useEffect(() => {
        loadDownloadedBooks();

        // Listen for updates
        const handleStorageChange = () => {
            loadDownloadedBooks();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('booksUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('booksUpdated', handleStorageChange);
        };
    }, []);

    const loadDownloadedBooks = () => {
        const savedBooks = localStorage.getItem('downloadedBooks');
        if (savedBooks) {
            setDownloadedBooks(JSON.parse(savedBooks));
        }
    };

    const handleReadBook = (book) => {
        navigate(`/read/${book.id}`, { state: { book } });
    };

    const handleRemoveDownload = (bookId) => {
        const updatedBooks = downloadedBooks.filter(book => book.id !== bookId);
        setDownloadedBooks(updatedBooks);
        localStorage.setItem('downloadedBooks', JSON.stringify(updatedBooks));
        window.dispatchEvent(new CustomEvent('booksUpdated'));
    };

    return (
        <div className="downloads-page">
            <div className="downloads-header">
                <h1 className="downloads-title">Downloads</h1>
                <p className="downloads-subtitle">Access your books offline, anytime.</p>
            </div>

            {downloadedBooks.length === 0 ? (
                <div className="empty-downloads-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <h3>No downloads yet</h3>
                    <p>Download books to read them offline anytime</p>
                    <button className="browse-btn" onClick={() => navigate('/books')}>
                        Browse Books
                    </button>
                </div>
            ) : (
                <div className="downloads-grid">
                    {downloadedBooks.map((book, index) => (
                        <div
                            key={book.id}
                            className="download-card"
                            style={{ '--delay': `${index * 0.1}s` }}
                        >
                            <div className="download-card-cover" onClick={() => handleReadBook(book)}>
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    onError={(e) => {
                                        e.target.src = `https://placehold.co/120x180/1e5245/ffffff?text=${encodeURIComponent(book.title)}`;
                                    }}
                                />
                            </div>
                            <div className="download-card-info">
                                <h3 className="download-book-title">{book.title}</h3>
                                <p className="download-book-author">{book.author}</p>
                                <div className="download-status">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                    <span>Downloaded</span>
                                </div>
                            </div>
                            <button
                                className="remove-download-btn"
                                onClick={() => handleRemoveDownload(book.id)}
                                title="Remove download"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DownloadsPage;
