// src/App.jsx
import { useState } from 'react';
import SearchBar from './components/SearchBar';

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// BookCard component (inline for now — we’ll move it later)
function BookCard({ book }) {
  const { volumeInfo } = book;
  const title = volumeInfo.title || 'Untitled';
  const authors = volumeInfo.authors?.join(', ') || 'Unknown Author';
  const thumbnail = volumeInfo.imageLinks?.thumbnail
    ? volumeInfo.imageLinks.thumbnail
    : 'https://via.placeholder.com/128x192?text=No+Cover';

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition">
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-64 object-contain bg-gray-100"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/128x192?text=No+Cover';
        }}
      />
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 h-12">{title}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-1">{authors}</p>
        <div className="flex justify-between items-center mt-3">
          <button className="text-xs text-blue-600 hover:underline">View details</button>
          <button className="text-xl text-gray-400 hover:text-red-500 transition">🤍</button>
        </div>
      </div>
    </div>
  );
}