import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookDetailsModal from '../components/BookDetailsModal';
import '../styles/FavoritesPage.css';

function FavoritesPage() {
    const navigate = useNavigate();
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        loadFavoriteBooks();

        // Listen for updates
        const handleStorageChange = () => {
            loadFavoriteBooks();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('booksUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('booksUpdated', handleStorageChange);
        };
    }, []);

    const loadFavoriteBooks = () => {
        const savedBooks = localStorage.getItem('favoriteBooks');
        if (savedBooks) {
            setFavoriteBooks(JSON.parse(savedBooks));
        }
    };

    const handleReadBook = (book) => {
        navigate(`/read/${book.id}`, { state: { book } });
    };

    const handleRemoveFavorite = (e, bookId) => {
        e.stopPropagation();
        const updatedBooks = favoriteBooks.filter(book => book.id !== bookId);
        setFavoriteBooks(updatedBooks);
        localStorage.setItem('favoriteBooks', JSON.stringify(updatedBooks));
        window.dispatchEvent(new CustomEvent('booksUpdated'));
    };

    return (
        <div className="favorites-page">
            <div className="favorites-header">
                <h1 className="favorites-title">Favorites</h1>
                <p className="favorites-subtitle">The collection of books you love.</p>
            </div>

            {favoriteBooks.length === 0 ? (
                <div className="empty-favorites-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <h3>No favorites yet</h3>
                    <p>Start adding books to your favorites collection</p>
                    <button className="browse-btn" onClick={() => navigate('/books')}>
                        Discover Books
                    </button>
                </div>
            ) : (
                <div className="favorites-grid">
                    {favoriteBooks.map((book, index) => (
                        <div
                            key={book.id}
                            className="favorite-card"
                            style={{ '--delay': `${index * 0.1}s` }}
                            onClick={() => setSelectedBook(book)}
                        >
                            <div className="favorite-card-cover">
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    onError={(e) => {
                                        e.target.src = `https://placehold.co/200x300/1e5245/ffffff?text=${encodeURIComponent(book.title)}`;
                                    }}
                                />
                                <button
                                    className="favorite-heart-btn active"
                                    onClick={(e) => handleRemoveFavorite(e, book.id)}
                                    title="Remove from favorites"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                </button>
                                <button
                                    className="favorite-expand-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleReadBook(book);
                                    }}
                                    title="Read book"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                    </svg>
                                </button>
                            </div>
                            <div className="favorite-card-info">
                                <h3 className="favorite-book-title">{book.title}</h3>
                                <p className="favorite-book-author">{book.author}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Book Details Modal */}
            <BookDetailsModal
                book={selectedBook}
                onClose={() => setSelectedBook(null)}
            />
        </div>
    );
}

export default FavoritesPage;
