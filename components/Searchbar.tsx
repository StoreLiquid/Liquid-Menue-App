import React, { useState, useRef, useEffect } from 'react';

interface SearchbarProps {
  onSearch: (term: string) => void;
  initialValue?: string;
}

const Searchbar = ({ onSearch, initialValue = '' }: SearchbarProps) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const isUserInput = useRef(false);
  
  // Wenn sich initialValue ändert, aktualisiere den State
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
      setSearchTerm(value);
    onSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    // Ausblenden der Tastatur auf mobilen Geräten
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleClear = () => {
    // Mark as user-initiated
    isUserInput.current = true;
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 shadow-md">
        <div className="pl-4 pr-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Suche nach Liquids oder Herstellern..."
          value={searchTerm}
          onChange={handleChange}
          className="w-full py-3 px-2 bg-transparent text-gray-200 placeholder-gray-400 outline-none"
          aria-label="Suche nach Liquids oder Herstellern"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="pr-4 text-gray-300 hover:text-white"
            aria-label="Suche zurücksetzen"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};

export default Searchbar; 