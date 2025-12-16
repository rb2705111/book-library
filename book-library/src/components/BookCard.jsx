// src/components/BookCard.jsx
export default function BookCard({ book, onToggleFavourite, isFavourite }) {
  const { volumeInfo } = book;
  const title = volumeInfo.title || 'Untitled';
  const authors = volumeInfo.authors?.join(', ') || 'Unknown Author';
  const thumbnail = volumeInfo.imageLinks?.thumbnail
    ? volumeInfo.imageLinks.thumbnail
    : 'https://via.placeholder.com/128x192?text=No+Cover';

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/128x192?text=No+Cover';
  };

  <BookCard
  key={book.id}
  book={book}
  onToggleFavourite={handleToggleFavourite}
  isFavourite={favourites.some(fav => fav.id === book.id)}
/>


  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition">
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-64 object-contain bg-gray-100"
        onError={handleImageError}
      />
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 h-12">{title}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-1">{authors}</p>
        <div className="flex justify-between items-center mt-3">
          <button className="text-xs text-blue-600 hover:underline">
            View details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavourite?.(book);
            }}
            className="text-xl"
            aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
          >
            {isFavourite ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  );
}