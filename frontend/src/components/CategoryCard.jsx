

const CategoryCard = ({ title, image }) => {
    // Generate a placeholder color or gradient based on title length if no image
    const placeholderBg = `hsl(${title.length * 20}, 70%, 80%)`;

    return (
        <div className="cat-card">
            <div className="cat-image-wrap" style={{ background: image ? 'transparent' : placeholderBg }}>
                {image ? (
                    <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ fontSize: '2rem', opacity: 0.5 }}>📚</div>
                )}
            </div>
            <div className="cat-title">{title}</div>
        </div>
    );
};

export default CategoryCard;
