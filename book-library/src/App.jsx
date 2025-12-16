// src/App.jsx
import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import BookCard from './components/BookCard';

export default function App() {
  // 🔹 Main search state
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const closeModal = () => setSelectedBook(null);

  // 🔹 Favourites state (inside App!)
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem('book-favourites');
    return saved ? JSON.parse(saved) : [];
  });

  // 🔹 Sync favourites to localStorage
  useEffect(() => {
    localStorage.setItem('book-favourites', JSON.stringify(favourites));
  }, [favourites]);

  // 🔹 Toggle favourite
  const handleToggleFavourite = (book) => {
    setFavourites(prev => {
      const isFav = prev.some(fav => fav.id === book.id);
      if (isFav) {
        return prev.filter(fav => fav.id !== book.id);
      } else {
        return [...prev, book];
      }
    });
  };

  // 🔹 Search handler
  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearchQuery(query);

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch books. Please try again.');
      }

      const data = await response.json();
      setBooks(data.items || []);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="max-w-6xl mx-auto text-center py-8">
        <h1 className="text-3xl font-bold text-gray-800">📚 Book Library</h1>
        <p className="text-gray-600 mt-2">Search and explore millions of books</p>
      </header>

      <main className="max-w-6xl mx-auto">
        <SearchBar onSearch={handleSearch} />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Searching books...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-medium text-red-600">Oops! Something went wrong</h3>
            <p className="text-gray-600 mt-2">{error}</p>
            <button
              onClick={() => handleSearch(searchQuery)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && books.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-medium text-gray-800">No books found</h3>
            <p className="text-gray-600 mt-2">
              Try a different title, author, or keyword.
            </p>
          </div>
        )}

        {/* Book List */}
        {!loading && !error && books.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Results for "{searchQuery}"
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onToggleFavourite={handleToggleFavourite}
                  isFavourite={favourites.some(fav => fav.id === book.id)}
                  onViewDetails={() => setSelectedBook(book)} 

                />
              ))}
            </div>
          </>
        )}

        {/* Book Detail Modal */}
{selectedBook && (
  <div 
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    onClick={closeModal}
  >
    <div 
      className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      <button 
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        aria-label="Close modal"
      >
        &times;
      </button>
      
      <div className="md:flex p-6">
        {/* Book Cover */}
        <div className="md:w-1/3 flex justify-center md:justify-start mb-6 md:mb-0">
          <img
            src={selectedBook.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Cover'}
            alt={selectedBook.volumeInfo.title || 'Book cover'}
            className="w-48 h-72 object-contain bg-gray-100 rounded"
            onError={(e) => e.target.src = 'https://via.placeholder.com/128x192?text=No+Cover'}
          />
        </div>

        {/* Book Info */}
        <div className="md:w-2/3 md:pl-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedBook.volumeInfo.title}
              </h1>
              <p className="text-lg text-gray-700 mt-1">
                {selectedBook.volumeInfo.authors?.join(', ') || 'Unknown author'}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavourite(selectedBook);
              }}
              className="text-2xl"
              aria-label={
                favourites.some(f => f.id === selectedBook.id) 
                  ? "Remove from favourites" 
                  : "Add to favourites"
              }
            >
              {favourites.some(f => f.id === selectedBook.id) ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Metadata */}
          <div className="mt-4 text-gray-600 space-y-1 text-sm">
            {selectedBook.volumeInfo.publishedDate && (
              <p><span className="font-medium">Published:</span> {selectedBook.volumeInfo.publishedDate}</p>
            )}
            {selectedBook.volumeInfo.pageCount && (
              <p><span className="font-medium">Pages:</span> {selectedBook.volumeInfo.pageCount}</p>
            )}
            {selectedBook.volumeInfo.publisher && (
              <p><span className="span font-medium">Publisher:</span> {selectedBook.volumeInfo.publisher}</p>
            )}
            {selectedBook.volumeInfo.industryIdentifiers?.map(id => (
              <p key={id.type}>
                <span className="font-medium">{id.type}:</span> {id.identifier}
              </p>
            ))}
          </div>

          {/* Description */}
          {selectedBook.volumeInfo.description && (
            <div className="mt-6">
              <h2 className="font-bold text-gray-800 mb-2">Description</h2>
              <div 
                className="text-gray-700 leading-relaxed text-sm"
                dangerouslySetInnerHTML={{ 
                  __html: selectedBook.volumeInfo.description 
                }}
              />
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={closeModal}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
            {favourites.some(f => f.id === selectedBook.id) ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavourite(selectedBook);
                }}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Remove from Favourites
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavourite(selectedBook);
                }}
                className="px-5 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
              >
                Save to Favourites
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      </main>
    </div>
  );
}