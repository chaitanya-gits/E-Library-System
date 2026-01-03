import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../styles/ReadingPage.css';

const ReadingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [book, setBook] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(15);
    const [progress, setProgress] = useState(0);
    const [sessionStartTime, setSessionStartTime] = useState(null);
    const intervalRef = useRef(null);

    // Sample book content
    const sampleBooks = [
        { id: 1, title: 'Atomic Habits', author: 'James Clear', totalPages: 320 },
        { id: 2, title: 'The Psychology of Money', author: 'Morgan Housel', totalPages: 256 },
        { id: 3, title: 'Company of One', author: 'Paul Jarvis', totalPages: 272 },
        { id: 4, title: 'How Innovation Works', author: 'Matt Ridley', totalPages: 416 },
        { id: 5, title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', totalPages: 250 },
        { id: 6, title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', totalPages: 224 }
    ];

    // Load book and progress on mount
    useEffect(() => {
        // Get book from location state or find by ID
        let foundBook = location.state?.book;
        if (!foundBook) {
            foundBook = sampleBooks.find(b => b.id === parseInt(id)) || sampleBooks[0];
        }

        setBook(foundBook);
        setTotalPages(foundBook.totalPages || 15);

        // Load saved progress
        const savedProgress = JSON.parse(localStorage.getItem('readingProgress') || '{}');
        const bookProgress = savedProgress[foundBook.id];

        if (bookProgress) {
            setCurrentPage(bookProgress.currentPage || 1);
            setProgress(bookProgress.progress || 0);
        }

        // Start tracking time
        setSessionStartTime(Date.now());

        return () => {
            // Save progress when leaving
            saveProgress();
        };
    }, [id]);

    // Track time every minute
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            updateTimeSpent();
        }, 60000); // Update every minute

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            updateTimeSpent(); // Save on unmount
        };
    }, [sessionStartTime, book]);

    const updateTimeSpent = () => {
        if (!sessionStartTime || !book) return;

        const savedProgress = JSON.parse(localStorage.getItem('readingProgress') || '{}');
        const currentTime = Date.now();
        const sessionMinutes = Math.floor((currentTime - sessionStartTime) / 60000);

        if (sessionMinutes > 0) {
            const existingTime = savedProgress[book.id]?.timeSpent || 0;
            savedProgress[book.id] = {
                ...savedProgress[book.id],
                timeSpent: existingTime + 1 // Add 1 minute
            };

            // Update total reading time
            const totalTime = parseInt(localStorage.getItem('totalReadingTime') || '0');
            localStorage.setItem('totalReadingTime', (totalTime + 1).toString());

            localStorage.setItem('readingProgress', JSON.stringify(savedProgress));
        }
    };

    const saveProgress = () => {
        if (!book) return;

        const savedProgress = JSON.parse(localStorage.getItem('readingProgress') || '{}');
        const newProgress = Math.round((currentPage / totalPages) * 100);

        savedProgress[book.id] = {
            ...savedProgress[book.id],
            currentPage: currentPage,
            progress: newProgress,
            lastRead: Date.now(),
            timeSpent: savedProgress[book.id]?.timeSpent || 0
        };

        localStorage.setItem('readingProgress', JSON.stringify(savedProgress));

        // Dispatch event to update My Library
        window.dispatchEvent(new CustomEvent('readingProgressUpdated'));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            const newProgress = Math.round((newPage / totalPages) * 100);
            setProgress(newProgress);

            // Save immediately on page change
            const savedProgress = JSON.parse(localStorage.getItem('readingProgress') || '{}');
            savedProgress[book.id] = {
                ...savedProgress[book.id],
                currentPage: newPage,
                progress: newProgress,
                lastRead: Date.now()
            };
            localStorage.setItem('readingProgress', JSON.stringify(savedProgress));
            window.dispatchEvent(new CustomEvent('readingProgressUpdated'));
        }
    };

    const handleBack = () => {
        saveProgress();
        updateTimeSpent();
        navigate('/library');
    };

    if (!book) return null;

    return (
        <div className="reading-page">
            <header className="reading-header">
                <div className="header-left">
                    <button className="back-btn" onClick={handleBack}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Library
                    </button>
                </div>
                <div className="header-right">
                    <button className="reading-icon-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 7V4h16v3M9 20h6M12 4v16M7 20h10" />
                        </svg>
                    </button>
                    <button className="reading-icon-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                    </button>
                    <button className="reading-icon-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>
                </div>
            </header>

            <main className="reading-content">
                <div className="reading-container">
                    <h1 className="reading-book-title">{book.title}</h1>
                    <p className="reading-book-author">by {book.author}</p>

                    <div className="reading-text">
                        <p>
                            <span className="drop-cap">T</span>his is a sample reading view for <strong>{book.title}</strong>.
                        </p>
                        <p>
                            No matter your goals, {book.title} offers a proven framework for improving--every day. {book.author}, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.
                        </p>
                        <p>
                            Here continues the text of the book in a comfortable reading format, mimicking the experience of a Kindle Paperwhite in light mode.
                        </p>
                        <p>
                            The concept is simple yet profound. In a world obsessed with more—more money, more fame, more output—we often lose sight of the small, consistent changes that lead to long-term success.
                        </p>

                        <div className="reading-divider"></div>

                        <p className="chapter-title">Chapter 1: The Beginning</p>

                        <p>
                            It started as a whisper. A small idea that refused to go away. Innovation, wealth, happiness—they all begin this way. Not with a bang, but with a quiet persistence.
                        </p>

                        <div className="page-navigation">
                            <button
                                className="nav-btn prev-btn"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                                Previous
                            </button>
                            <button
                                className="nav-btn next-btn"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                            >
                                Next
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="reading-footer">
                <div className="progress-indicator">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="footer-info">
                    <span className="page-info">Page {currentPage} of {totalPages}</span>
                    <span className="read-percentage">{progress}% Read</span>
                </div>
            </footer>
        </div>
    );
};

export default ReadingPage;

