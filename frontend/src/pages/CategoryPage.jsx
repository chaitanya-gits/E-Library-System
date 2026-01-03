import { useState, useEffect } from 'react';
import { bookApi } from '../services/api';
import Loading from '../components/Loading';
import BookDetailsModal from '../components/BookDetailsModal';
import '../styles/CategoryPage.css';

// Sample book covers using reliable image sources
const sampleBooks = [
    {
        id: 1,
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        coverImage: 'https://m.media-amazon.com/images/I/71TRUbzcvaL._AC_UF1000,1000_QL80_.jpg',
        category: 'Business',
        publishedDate: 'Sep 08, 2020',
        isbn: '9780857197689',
        pages: '256',
        language: 'English',
        description: "Doing well with money isn't necessarily about what you know. It's about how you behave. In The Psychology of Money, award-winning author Morgan Housel shares 19 short stories exploring the strange ways people think about money.",
        isBestseller: true
    },
    {
        id: 2,
        title: 'Company of One',
        author: 'Paul Jarvis',
        coverImage: 'https://m.media-amazon.com/images/I/71e5yHjPsZL._SL1500_.jpg',
        category: 'Business',
        publishedDate: 'Jan 15, 2019',
        isbn: '9781328915870',
        pages: '272',
        language: 'English',
        description: "What if the real key to a richer and more fulfilling career was not to create and scale a new business, but rather, to be able to work for yourself?",
        isBestseller: false
    },
    {
        id: 3,
        title: 'How Innovation Works',
        author: 'Matt Ridley',
        coverImage: 'https://m.media-amazon.com/images/I/91hrgdN3J0L._SY466_.jpg',
        category: 'Sci-Fi',
        publishedDate: 'May 19, 2020',
        isbn: '9780062916594',
        pages: '416',
        language: 'English',
        description: "Innovation is the main event of the modern age, the reason we experience dramatic improvements in our living standards.",
        isBestseller: true
    },
    {
        id: 4,
        title: 'The Picture of Dorian Gray',
        author: 'Oscar Wilde',
        coverImage: 'https://m.media-amazon.com/images/I/91R44SkY9wL._SY522_.jpg',
        category: 'Classics',
        publishedDate: 'July 1, 1890',
        isbn: '9780141439570',
        pages: '250',
        language: 'English',
        description: "Entropy and elegance collide in Oscar Wilde's masterpiece. Dorian Gray remains eternally young while his portrait ages hideously.",
        isBestseller: false
    },
    {
        id: 5,
        title: 'Atomic Habits',
        author: 'James Clear',
        coverImage: 'https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg',
        category: 'Self-Help',
        publishedDate: 'Oct 16, 2018',
        isbn: '9780735211292',
        pages: '320',
        language: 'English',
        description: "James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
        isBestseller: true
    },
    {
        id: 6,
        title: 'The Subtle Art of Not Giving a F*ck',
        author: 'Mark Manson',
        coverImage: 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_UF1000,1000_QL80_.jpg',
        category: 'Self-Help',
        publishedDate: 'Sep 13, 2016',
        isbn: '9780062457714',
        pages: '224',
        language: 'English',
        description: "In this generation-defining self-help guide, a superstar blogger cuts through the crap to show us how to stop trying to be 'positive' all the time.",
        isBestseller: true
    },
    {
        id: 7,
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        coverImage: 'https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg',
        category: 'History',
        publishedDate: 'Feb 10, 2015',
        isbn: '9780062316097',
        pages: '464',
        language: 'English',
        description: "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution.",
        isBestseller: true
    },
    {
        id: 8,
        title: 'Dune',
        author: 'Frank Herbert',
        coverImage: 'https://m.media-amazon.com/images/I/81ym3QUd3KL._AC_UF1000,1000_QL80_.jpg',
        category: 'Sci-Fi',
        publishedDate: 'Aug 01, 1965',
        isbn: '9780441172719',
        pages: '688',
        language: 'English',
        description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.",
        isBestseller: true
    },
    {
        id: 9,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        coverImage: 'https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg',
        category: 'Fiction',
        publishedDate: 'Jul 11, 1960',
        isbn: '9780446310789',
        pages: '336',
        language: 'English',
        description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.",
        isBestseller: true
    },
    {
        id: 10,
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        coverImage: 'https://m.media-amazon.com/images/I/81yP+dpbmeL._SY466_.jpg',
        category: 'Biography',
        publishedDate: 'Oct 24, 2011',
        isbn: '9781451648539',
        pages: '656',
        language: 'English',
        description: "Based on more than forty interviews with Jobs conducted over two years, this is the exclusive biography of Apple's legendary co-founder.",
        isBestseller: true
    },
    {
        id: 11,
        title: 'Into the Wild',
        author: 'Jon Krakauer',
        coverImage: 'https://m.media-amazon.com/images/I/61A+LdmTESL._SY466_.jpg',
        category: 'Travel',
        publishedDate: 'Jan 20, 1996',
        isbn: '9780385486804',
        pages: '224',
        language: 'English',
        description: "In April 1992 a young man from a well-to-do family hitchhiked to Alaska and walked alone into the wilderness north of Mt. McKinley.",
        isBestseller: true
    }
];

// Genre filters matching the image
const genres = [
    { name: 'All', icon: 'grid' },
    { name: 'Business', icon: 'briefcase' },
    { name: 'Fiction', icon: 'book' },
    { name: 'Self-Help', icon: 'heart' },
    { name: 'Sci-Fi', icon: 'rocket' },
    { name: 'Biography', icon: 'user' },
    { name: 'History', icon: 'landmark' },
    { name: 'Classics', icon: 'castle' },
    { name: 'Travel', icon: 'plane' }
];

// SVG Icons for genres
const GenreIcon = ({ type }) => {
    const icons = {
        grid: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
        briefcase: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
        ),
        book: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
        ),
        heart: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
        rocket: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
        ),
        user: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
        landmark: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="22" x2="21" y2="22" />
                <line x1="6" y1="18" x2="6" y2="11" />
                <line x1="10" y1="18" x2="10" y2="11" />
                <line x1="14" y1="18" x2="14" y2="11" />
                <line x1="18" y1="18" x2="18" y2="11" />
                <polygon points="12 2 20 7 4 7" />
            </svg>
        ),
        castle: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z" />
                <path d="M18 11V4H6v7" />
                <path d="M15 22v-4a3 3 0 0 0-3-3v0a3 3 0 0 0-3 3v4" />
                <path d="M22 11V9" />
                <path d="M2 11V9" />
                <path d="M6 4V2" />
                <path d="M18 4V2" />
                <path d="M10 4V2" />
                <path d="M14 4V2" />
            </svg>
        ),
        plane: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </svg>
        )
    };
    return icons[type] || icons.grid;
};

function CategoryPage() {
    const [books, setBooks] = useState(sampleBooks);
    const [filteredBooks, setFilteredBooks] = useState(sampleBooks);
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [selectedBook, setSelectedBook] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const response = await bookApi.getAll();
                if (response.data && response.data.length > 0) {
                    const mergedBooks = response.data.map((book, index) => ({
                        ...book,
                        coverImage: book.coverImage || sampleBooks[index % sampleBooks.length]?.coverImage
                    }));
                    setBooks(mergedBooks);
                    setFilteredBooks(mergedBooks);
                }
            } catch (error) {
                console.error('Failed to fetch books:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    // Filter by genre
    useEffect(() => {
        if (selectedGenre === 'All') {
            setFilteredBooks(books);
        } else {
            setFilteredBooks(books.filter(book => book.category === selectedGenre));
        }
    }, [selectedGenre, books]);

    if (loading) return <Loading />;

    return (
        <div className="category-page">
            {/* Explore Genres Section */}
            <section className="explore-genres-section">
                <h1 className="section-title">Explore Genres</h1>
                <div className="genre-filters">
                    {genres.map((genre) => (
                        <button
                            key={genre.name}
                            className={`genre-btn ${selectedGenre === genre.name ? 'active' : ''}`}
                            onClick={() => setSelectedGenre(genre.name)}
                        >
                            <span className="genre-icon">
                                <GenreIcon type={genre.icon} />
                            </span>
                            <span className="genre-name">{genre.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Trending Books Section */}
            <section className="trending-books-section">
                <div className="section-header">
                    <h2>Trending Books</h2>
                    <button className="view-all-btn">
                        View all
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>

                <div className="trending-books-scroll">
                    {filteredBooks.map((book, index) => (
                        <div
                            key={book.id}
                            className="trending-book-card"
                            style={{ '--delay': `${index * 0.08}s` }}
                            onClick={() => setSelectedBook(book)}
                        >
                            <div className="trending-book-cover">
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    onError={(e) => {
                                        e.target.src = `https://placehold.co/200x300/1e5245/ffffff?text=${encodeURIComponent(book.title)}`;
                                    }}
                                />
                                <button className="expand-btn">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                    </svg>
                                </button>
                            </div>
                            <div className="trending-book-info">
                                <h3 className="trending-book-title">{book.title}</h3>
                                <p className="trending-book-author">{book.author}</p>
                            </div>
                        </div>
                    ))}
                    {filteredBooks.length === 0 && (
                        <p className="no-books-message">No books found in this genre.</p>
                    )}
                </div>
            </section>

            {/* Book Details Modal */}
            <BookDetailsModal
                book={selectedBook}
                onClose={() => setSelectedBook(null)}
            />
        </div>
    );
}

export default CategoryPage;
