// src/components/TeamsDropdown.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useFetchTeamsQuery } from '../../api/usersApi'; // Ensure the correct path
import { ITeam } from '../../types/team';
import { FiChevronDown, FiCheck, FiSearch } from 'react-icons/fi';
import { Transition } from '@headlessui/react'; // For smooth transitions

const TeamsDropdown: React.FC = () => {
  const { data: teamsData, isLoading, error } = useFetchTeamsQuery({ page: 1, limit: 1000 });
  const teams = teamsData?.teams || [];
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter teams based on search term
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <p className="text-gray-500">Loading teams...</p>;
  if (error) return <p className="text-red-500">Failed to load teams.</p>;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={toggleDropdown}
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        Team
        <FiChevronDown
          className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
          <div className="py-1">
            {/* Search Box */}
            <div className="px-4 py-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search teams"
                />
              </div>
            </div>

            {/* Teams List */}
            {filteredTeams.length === 0 ? (
              <div className="px-4 py-2 text-gray-500">No teams found.</div>
            ) : (
              <ul className="max-h-60 overflow-auto">
                {filteredTeams.map((team: ITeam) => (
                  <li
                    key={team._id}
                    className="cursor-pointer hover:bg-gray-100 flex items-center px-4 py-2 transition-colors duration-200"
                    onClick={() => {
                      console.log(`Selected Team ID: ${team._id}`);
                      setIsOpen(false);
                      // You can add additional actions here, such as navigating to the team or updating state
                    }}
                  >
                    {/* Team Avatar/Icon */}
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                      {team.name.charAt(0).toUpperCase()}
                    </div>
                    {/* Team Name */}
                    <span className="flex-grow text-gray-700">{team.name}</span>
                    {/* Checkmark for selection */}
                    <FiCheck className="text-green-500" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default TeamsDropdown;
