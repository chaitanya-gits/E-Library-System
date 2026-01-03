import { useState, useEffect } from 'react';
import { bookApi } from '../services/api';
import Loading from '../components/Loading';
import BookDetailsModal from '../components/BookDetailsModal';
import '../styles/BooksPage.css';

// Sample book covers using reliable image sources
const sampleBooks = [
    {
        id: 1,
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        coverImage: 'https://m.media-amazon.com/images/I/71XEsXS5RlL._SY466_.jpg',
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
        category: 'Technology',
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
        category: 'Fiction',
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
        title: 'Deep Work',
        author: 'Cal Newport',
        coverImage: 'https://m.media-amazon.com/images/I/81JJ7fyyKyS._AC_UF1000,1000_QL80_.jpg',
        category: 'Business',
        publishedDate: 'Jan 05, 2016',
        isbn: '9781455586691',
        pages: '296',
        language: 'English',
        description: "Deep work is the ability to focus without distraction on a cognitively demanding task.",
        isBestseller: true
    },
    {
        id: 8,
        title: 'Think and Grow Rich',
        author: 'Napoleon Hill',
        coverImage: 'https://m.media-amazon.com/images/I/71UypkUjStL._AC_UF1000,1000_QL80_.jpg',
        category: 'Business',
        publishedDate: 'Mar 26, 1937',
        isbn: '9781585424337',
        pages: '320',
        language: 'English',
        description: "Think and Grow Rich has been called the 'Granddaddy of All Motivational Literature.'",
        isBestseller: true
    },
    {
        id: 9,
        title: 'Rich Dad Poor Dad',
        author: 'Robert Kiyosaki',
        coverImage: 'https://m.media-amazon.com/images/I/81bsw6fnUiL._AC_UF1000,1000_QL80_.jpg',
        category: 'Business',
        publishedDate: 'Apr 01, 1997',
        isbn: '9781612680194',
        pages: '336',
        language: 'English',
        description: "Rich Dad Poor Dad is Robert's story of growing up with two dads — his real father and the father of his best friend, his rich dad.",
        isBestseller: true
    },
    {
        id: 10,
        title: 'The 7 Habits of Highly Effective People',
        author: 'Stephen Covey',
        coverImage: 'https://m.media-amazon.com/images/I/71Koyhv2bML._SY466_.jpg',
        category: 'Self-Help',
        publishedDate: 'Aug 15, 1989',
        isbn: '9781982137274',
        pages: '432',
        language: 'English',
        description: "One of the most inspiring and impactful books ever written, The 7 Habits of Highly Effective People has captivated readers for nearly three decades.",
        isBestseller: true
    },
    {
        id: 11,
        title: 'The Lean Startup',
        author: 'Eric Ries',
        coverImage: 'https://m.media-amazon.com/images/I/81-QB7nDh4L._AC_UF1000,1000_QL80_.jpg',
        category: 'Business',
        publishedDate: 'Sep 13, 2011',
        isbn: '9780307887894',
        pages: '336',
        language: 'English',
        description: "Most startups fail. But many of those failures are preventable.",
        isBestseller: true
    },
    {
        id: 12,
        title: 'Zero to One',
        author: 'Peter Thiel',
        coverImage: 'https://m.media-amazon.com/images/I/71m-MxdJ2WL._AC_UF1000,1000_QL80_.jpg',
        category: 'Business',
        publishedDate: 'Sep 16, 2014',
        isbn: '9780804139298',
        pages: '224',
        language: 'English',
        description: "The great secret of our time is that there are still uncharted frontiers to explore and new inventions to create.",
        isBestseller: true
    },
    {
        id: 13,
        title: 'The Power of Now',
        author: 'Eckhart Tolle',
        coverImage: 'https://m.media-amazon.com/images/I/41f2TUGvx4L._SY445_SX342_FMwebp_.jpg',
        category: 'Self-Help',
        publishedDate: 'Oct 01, 1997',
        isbn: '9781577314806',
        pages: '236',
        language: 'English',
        description: "To make the journey into The Power of Now we will need to leave our analytical mind and its false created self, the ego, behind.",
        isBestseller: true
    },
    {
        id: 14,
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        coverImage: 'https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg',
        category: 'History',
        publishedDate: 'Feb 10, 2015',
        isbn: '9780062316097',
        pages: '464',
        language: 'English',
        description: "100,000 years ago, at least six human species inhabited the earth. Today there is just one. Us. Homo sapiens.",
        isBestseller: true
    },
    {
        id: 15,
        title: 'Educated',
        author: 'Tara Westover',
        coverImage: 'https://m.media-amazon.com/images/I/81NwOj14S6L._AC_UF1000,1000_QL80_.jpg',
        category: 'Biography',
        publishedDate: 'Feb 20, 2018',
        isbn: '9780399590504',
        pages: '352',
        language: 'English',
        description: "An unforgettable memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
        isBestseller: true
    },
    {
        id: 16,
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        coverImage: 'https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UF1000,1000_QL80_.jpg',
        category: 'Fiction',
        publishedDate: 'Jan 01, 1988',
        isbn: '9780062315007',
        pages: '208',
        language: 'English',
        description: "Paulo Coelho's enchanting novel has inspired a devoted following around the world.",
        isBestseller: true
    },
    {
        id: 17,
        title: 'Start with Why',
        author: 'Simon Sinek',
        coverImage: 'https://m.media-amazon.com/images/I/71FPH6GnDgL._SY466_.jpg',
        category: 'Business',
        publishedDate: 'Oct 29, 2009',
        isbn: '9781591846444',
        pages: '256',
        language: 'English',
        description: "START WITH WHY shows that the leaders who've had the greatest influence in the world all think, act, and communicate the same way.",
        isBestseller: true
    },
    {
        id: 18,
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        coverImage: 'https://m.media-amazon.com/images/I/71wvKXWfcML._AC_UF1000,1000_QL80_.jpg',
        category: 'Psychology',
        publishedDate: 'Oct 25, 2011',
        isbn: '9780374533557',
        pages: '499',
        language: 'English',
        description: "In the international bestseller, Thinking, Fast and Slow, Daniel Kahneman explains the two systems that drive the way we think.",
        isBestseller: true
    },
    {
        id: 19,
        title: 'The 4-Hour Workweek',
        author: 'Tim Ferriss',
        coverImage: 'https://m.media-amazon.com/images/I/6142S0D-PiL._SY466_.jpg',
        category: 'Business',
        publishedDate: 'Apr 24, 2007',
        isbn: '9780307465351',
        pages: '448',
        language: 'English',
        description: "Forget the old concept of retirement and the rest of the deferred-life plan–there is no need to wait and every reason not to.",
        isBestseller: true
    },
    {
        id: 20,
        title: 'Outliers',
        author: 'Malcolm Gladwell',
        coverImage: 'https://m.media-amazon.com/images/I/61XsLQzCkRL._SY466_.jpg',
        category: 'Business',
        publishedDate: 'Nov 18, 2008',
        isbn: '9780316017930',
        pages: '336',
        language: 'English',
        description: "In this stunning new book, Malcolm Gladwell takes us on an intellectual journey through the world of outliers.",
        isBestseller: true
    }
];

function BooksPage() {
    const [books, setBooks] = useState(sampleBooks);
    const [filteredBooks, setFilteredBooks] = useState(sampleBooks);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All Genres');
    const [selectedBook, setSelectedBook] = useState(null);
    const [loading, setLoading] = useState(false);
    const [favoriteBooks, setFavoriteBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const response = await bookApi.getAll();
                if (response.data && response.data.length > 0) {
                    // Merge API books with sample images for demo
                    const mergedBooks = response.data.map((book, index) => ({
                        ...book,
                        coverImage: book.coverImage || sampleBooks[index % sampleBooks.length]?.coverImage
                    }));
                    setBooks(mergedBooks);
                    setFilteredBooks(mergedBooks);
                }
            } catch (error) {
                console.error('Failed to fetch books:', error);
                // Keep sample data if API fails
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();

        // Load favorite books
        const savedFavorites = localStorage.getItem('favoriteBooks');
        if (savedFavorites) {
            setFavoriteBooks(JSON.parse(savedFavorites));
        }
    }, []);

    // Filter logic
    useEffect(() => {
        let filtered = books;

        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(book =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedGenre !== 'All Genres') {
            filtered = filtered.filter(book => book.category === selectedGenre);
        }

        setFilteredBooks(filtered);
    }, [searchTerm, selectedGenre, books]);

    const handleSearch = (e) => {
        e.preventDefault();
    };

    const isFavorite = (bookId) => {
        return favoriteBooks.some(b => b.id === bookId);
    };

    const toggleFavorite = (e, book) => {
        e.stopPropagation();
        let updatedFavorites;
        if (isFavorite(book.id)) {
            updatedFavorites = favoriteBooks.filter(b => b.id !== book.id);
        } else {
            updatedFavorites = [...favoriteBooks, book];
        }
        setFavoriteBooks(updatedFavorites);
        localStorage.setItem('favoriteBooks', JSON.stringify(updatedFavorites));
        window.dispatchEvent(new CustomEvent('booksUpdated'));
    };

    if (loading) return <Loading />;

    return (
        <div className="books-page">
            {/* Glassmorphic Blob Accent */}
            <div className="glass-blob-accent"></div>

            {/* Search Bar - Top Section */}
            <div className="top-search-section">
                <form onSubmit={handleSearch} className="top-search-bar">
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search for books, authors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="search-submit-btn">Search</button>
                </form>
            </div>

            {/* Discover Books Section */}
            <div className="trending-section">
                <div className="section-header">
                    <h2 className="section-title">Discover Books</h2>

                </div>

                <div className="books-grid">
                    {filteredBooks.map((book, index) => (
                        <div
                            key={book.id}
                            className="trending-book-card"
                            style={{ '--delay': `${index * 0.05}s` }}
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
                            <div className="book-info">
                                <h4 className="book-title">{book.title}</h4>
                                <p className="book-author">{book.author}</p>
                            </div>
                        </div>
                    ))}
                    {filteredBooks.length === 0 && (
                        <p className="no-books-message">No books found matching your search.</p>
                    )}
                </div>
            </div>

            {/* Book Details Modal */}
            <BookDetailsModal
                book={selectedBook}
                onClose={() => setSelectedBook(null)}
            />
        </div>
    );
}

export default BooksPage;
