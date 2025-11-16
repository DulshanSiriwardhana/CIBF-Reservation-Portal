import React, { useState } from 'react';
import { FaBook, FaPlus, FaTimes, FaCheckCircle } from 'react-icons/fa';

const Genres = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [customGenre, setCustomGenre] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const predefinedGenres = [
    'Fiction',
    'Non-Fiction',
    'Children\'s Books',
    'Young Adult',
    'Educational',
    'Religious',
    'Science & Technology',
    'History',
    'Biography',
    'Poetry',
    'Comics & Graphic Novels',
    'Self-Help',
    'Business & Economics',
    'Travel',
    'Cookbooks',
    'Art & Photography',
    'Mystery & Thriller',
    'Romance',
    'Fantasy & Sci-Fi',
    'Health & Wellness'
  ];

  const handleGenreToggle = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleAddCustomGenre = () => {
    if (customGenre.trim() && !selectedGenres.includes(customGenre.trim())) {
      setSelectedGenres([...selectedGenres, customGenre.trim()]);
      setCustomGenre('');
    }
  };

  const handleRemoveGenre = (genre) => {
    setSelectedGenres(selectedGenres.filter(g => g !== genre));
  };

  const handleSaveGenres = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FaBook className="text-6xl text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Literary Genres & Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the types of literature you'll be showcasing at your stall. This helps visitors find exactly what they're looking for.
          </p>
        </div>

        {showSuccess && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-center animate-fade-in">
            <FaCheckCircle className="text-green-600 text-xl mr-3" />
            <span className="text-green-800 font-semibold">Genres saved successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Select Your Genres
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {predefinedGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left font-medium ${
                      selectedGenres.includes(genre)
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Add Custom Genre
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={customGenre}
                    onChange={(e) => setCustomGenre(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomGenre()}
                    placeholder="Enter custom genre..."
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none"
                  />
                  <button
                    onClick={handleAddCustomGenre}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Selected Genres
              </h2>
              <p className="text-gray-600 mb-4">
                {selectedGenres.length} genre{selectedGenres.length !== 1 ? 's' : ''} selected
              </p>

              {selectedGenres.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FaBook className="text-4xl mx-auto mb-3 opacity-50" />
                  <p>No genres selected yet</p>
                </div>
              ) : (
                <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                  {selectedGenres.map((genre) => (
                    <div
                      key={genre}
                      className="flex items-center justify-between bg-primary-50 px-4 py-3 rounded-lg"
                    >
                      <span className="text-primary-700 font-medium">{genre}</span>
                      <button
                        onClick={() => handleRemoveGenre(genre)}
                        className="text-primary-600 hover:text-primary-800 transition-colors"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleSaveGenres}
                disabled={selectedGenres.length === 0}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                  selectedGenres.length > 0
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Save Genres
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Why Select Genres?
          </h3>
          <ul className="text-blue-800 space-y-2">
            <li>• Helps visitors discover your stall based on their interests</li>
            <li>• Improves your stall's visibility in search and filters</li>
            <li>• Enables better event organization and categorization</li>
            <li>• Attracts your target audience more effectively</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Genres;