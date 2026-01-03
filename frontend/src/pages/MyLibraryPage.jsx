import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MyLibraryPage.css';

// Sample books for the library (in a real app, this would come from API/database)
const sampleBooks = [
    {
        id: 1,
        title: 'Atomic Habits',
        author: 'James Clear',
        coverImage: 'https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg',
        totalPages: 320,
        category: 'Self-Help'
    },
    {
        id: 2,
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        coverImage: 'https://m.media-amazon.com/images/I/71TRUbzcvaL._AC_UF1000,1000_QL80_.jpg',
        totalPages: 256,
        category: 'Business'
    },
    {
        id: 3,
        title: 'Company of One',
        author: 'Paul Jarvis',
        coverImage: 'https://m.media-amazon.com/images/I/71e5yHjPsZL._SL1500_.jpg',
        totalPages: 272,
        category: 'Business'
    },
    {
        id: 4,
        title: 'How Innovation Works',
        author: 'Matt Ridley',
        coverImage: 'https://m.media-amazon.com/images/I/91hrgdN3J0L._SY466_.jpg',
        totalPages: 416,
        category: 'Technology'
    },
    {
        id: 5,
        title: 'The Picture of Dorian Gray',
        author: 'Oscar Wilde',
        coverImage: 'https://m.media-amazon.com/images/I/91R44SkY9wL._SY522_.jpg',
        totalPages: 250,
        category: 'Classics'
    },
    {
        id: 6,
        title: 'The Subtle Art of Not Giving a F*ck',
        author: 'Mark Manson',
        coverImage: 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_UF1000,1000_QL80_.jpg',
        totalPages: 224,
        category: 'Self-Help'
    }
];

// Helper function to format time ago
const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Never';
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
};

// Helper function to format reading time
const formatReadingTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
};

function MyLibraryPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('reading');
    const [readingData, setReadingData] = useState({
        books: [],
        totalTimeSpent: 0,
        booksFinished: 0,
        achievements: 0
    });

    // Load reading data from localStorage
    useEffect(() => {
        loadReadingData();

        // Listen for updates from reading page
        const handleStorageChange = () => {
            loadReadingData();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('readingProgressUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('readingProgressUpdated', handleStorageChange);
        };
    }, []);

    const loadReadingData = () => {
        const savedProgress = localStorage.getItem('readingProgress');
        const savedTime = localStorage.getItem('totalReadingTime');

        let booksWithProgress = [];
        let totalTime = parseInt(savedTime) || 0;
        let finishedCount = 0;

        if (savedProgress) {
            const progressData = JSON.parse(savedProgress);

            booksWithProgress = sampleBooks.map(book => {
                const bookProgress = progressData[book.id] || {};
                const progress = bookProgress.progress || 0;
                const status = progress >= 100 ? 'finished' :
                    progress > 0 ? 'reading' : 'saved';

                if (progress >= 100) finishedCount++;

                return {
                    ...book,
                    currentPage: bookProgress.currentPage || 0,
                    progress: progress,
                    lastRead: bookProgress.lastRead || null,
                    timeSpent: bookProgress.timeSpent || 0,
                    status: status
                };
            });
        } else {
            // Initialize with sample data if no saved progress
            booksWithProgress = sampleBooks.map((book, index) => ({
                ...book,
                currentPage: index === 0 ? 208 : 0,
                progress: index === 0 ? 65 : 0,
                lastRead: index === 0 ? Date.now() - 7200000 : null, // 2 hours ago for first book
                timeSpent: index === 0 ? 180 : 0, // 3 hours for first book
                status: index === 0 ? 'reading' : 'saved'
            }));

            // Save initial data
            const initialProgress = {};
            booksWithProgress.forEach(book => {
                initialProgress[book.id] = {
                    currentPage: book.currentPage,
                    progress: book.progress,
                    lastRead: book.lastRead,
                    timeSpent: book.timeSpent
                };
            });
            localStorage.setItem('readingProgress', JSON.stringify(initialProgress));
            localStorage.setItem('totalReadingTime', '180');
            totalTime = 180;
        }

        // Calculate achievements based on progress
        const achievements = Math.floor(finishedCount / 2) + (totalTime >= 600 ? 1 : 0) + (booksWithProgress.filter(b => b.progress > 0).length >= 3 ? 1 : 0);

        setReadingData({
            books: booksWithProgress,
            totalTimeSpent: totalTime,
            booksFinished: finishedCount,
            achievements: achievements
        });
    };

    const handleContinueReading = (book) => {
        // Navigate to reading page with book data
        navigate(`/read/${book.id}`, { state: { book } });
    };



    // Filter books based on active tab
    const getFilteredBooks = () => {
        switch (activeTab) {
            case 'reading':
                return readingData.books.filter(b => b.status === 'reading');
            case 'saved':
                return readingData.books.filter(b => b.status === 'saved');
            case 'finished':
                return readingData.books.filter(b => b.status === 'finished');
            default:
                return readingData.books;
        }
    };

    const filteredBooks = getFilteredBooks();

    return (
        <div className="my-library-page">
            {/* Header with tabs */}
            <div className="library-header">
                <h1 className="library-title">My Library</h1>
                <div className="library-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'reading' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reading')}
                    >
                        Reading Now
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
                        onClick={() => setActiveTab('saved')}
                    >
                        Saved
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'finished' ? 'active' : ''}`}
                        onClick={() => setActiveTab('finished')}
                    >
                        Finished
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon books-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                            <path d="M12 6v7l3-2 3 2V6"></path>
                        </svg>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{readingData.booksFinished || readingData.books.filter(b => b.progress > 0).length}</span>
                        <span className="stat-label">Books read this year</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon time-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{formatReadingTime(readingData.totalTimeSpent)}</span>
                        <span className="stat-label">Time spent reading</span>
                    </div>
                </div>

                <div className="stat-card achievements-card">
                    <div className="stat-icon achievement-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="6"></circle>
                            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
                        </svg>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{readingData.achievements}</span>
                        <span className="stat-label">Achievements</span>
                    </div>
                </div>
            </div>

            {/* Book Progress Cards */}
            <div className="books-progress-list">
                {filteredBooks.length === 0 ? (
                    <div className="empty-library-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                        <h3>No books in {activeTab === 'reading' ? 'Reading Now' : activeTab === 'saved' ? 'Saved' : 'Finished'}</h3>
                        <p>Start exploring and add books to your library!</p>
                    </div>
                ) : (
                    filteredBooks.map((book, index) => (
                        <div
                            key={book.id}
                            className="book-progress-card"
                            style={{ '--delay': `${index * 0.1}s` }}
                        >
                            <div className="book-cover-section">
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    onError={(e) => {
                                        e.target.src = `https://placehold.co/120x180/1e5245/ffffff?text=${encodeURIComponent(book.title)}`;
                                    }}
                                />
                                <button className="expand-btn">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                    </svg>
                                </button>
                            </div>

                            <div className="book-details-section">
                                <div className="book-header">
                                    <h3 className="book-title">{book.title}</h3>
                                    <p className="book-author">by {book.author}</p>
                                </div>

                                <div className="progress-section">
                                    <div className="progress-header">
                                        <span className="progress-label">PROGRESS</span>
                                        <span className="progress-percentage">{book.progress}%</span>
                                    </div>
                                    <div className="progress-bar-container">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${book.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="book-footer">
                                    <span className="last-read">
                                        Last read: {getTimeAgo(book.lastRead)}
                                    </span>
                                    <button
                                        className="continue-btn"
                                        onClick={() => handleContinueReading(book)}
                                    >
                                        {book.progress > 0 ? 'Continue Reading' : 'Start Reading'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MyLibraryPage;
