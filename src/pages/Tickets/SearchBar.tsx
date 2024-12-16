// src/components/Ticket/Filters/SearchBar.tsx
import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => (
  <div className="relative text-gray-600">
    <input
      type="search"
      name="search"
      placeholder="Search tickets..."
      className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none border border-gray-300 w-full md:w-64"
      value={searchTerm}
      onChange={onSearchChange}
    />
    <FaSearch className="absolute right-3 top-3 text-gray-400" />
  </div>
);

export default SearchBar;
