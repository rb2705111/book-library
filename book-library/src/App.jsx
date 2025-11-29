// src/App.jsx
import { useState } from 'react';
import SearchBar from './components/SearchBar';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    console.log('Searching for:', query); // We’ll replace this with API call soon
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="max-w-6xl mx-auto text-center py-8">
        <h1 className="text-3xl font-bold text-gray-800">📚 Book Library</h1>
        <p className="text-gray-600 mt-2">Search and explore millions of books</p>
      </header>

      <main className="max-w-6xl mx-auto">
        <SearchBar onSearch={handleSearch} />
        {searchQuery && (
          <p className="text-center text-gray-700">You searched for: <strong>{searchQuery}</strong></p>
        )}
      </main>
    </div>
  );
}

export default App;