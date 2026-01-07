

function BookCard({ book }) {
    return (
        <div className="reco-card">
            <div style={{ position: 'relative' }}>
                <img
                    src={book.coverImage || `https://placehold.co/400x600?text=${encodeURIComponent(book.title)}`}
                    alt={book.title}
                    className="reco-image"
                />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', lineHeight: 1.3 }}>
                {book.title}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                {book.author}
            </p>

            {/* Optional: Rating or other meta if needed, design shows simple title/author */}
        </div>
    );
}

export default BookCard;
