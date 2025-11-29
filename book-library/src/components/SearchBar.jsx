// src/components/SearchBar.jsx
import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Trigger search in parent (App)
    onSearch(query);

    // Update recent searches
    const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    // Clear input
    setQuery('');
  };

  const handleRecentClick = (recentQuery) => {
    setQuery(recentQuery);
    onSearch(recentQuery);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {recentSearches.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 mb-1">Recent searches:</p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleRecentClick(search)}
                className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-full hover:bg-gray-300 transition"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}