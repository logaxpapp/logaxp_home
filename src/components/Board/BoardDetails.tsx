// src/components/BoardDetails.tsx

import React, { useState } from 'react';
import { useFetchBoardByIdQuery } from '../../api/tasksApi';
import { useParams, Link } from 'react-router-dom';
import TeamMembersSection from './TeamMembersSection';
import BoardMembersSection from './BoardMembersSection'; 
import InvitationForm from './InvitationForm';
import LabelManager from './LabelManager';
import Pagination from '../common/Pagination/Pagination';

const BoardDetails: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { data: board, error, isLoading } = useFetchBoardByIdQuery(boardId!);

  // State to track active tab: 'lists', 'members', or 'membership'
  const [activeTab, setActiveTab] = useState<'lists' | 'members' | 'membership' |'labels'| 'Invitation'>('lists');

  // Pagination states for Lists
  const [currentListPage, setCurrentListPage] = useState(1);
  const listsPerPage = 5; // Adjust as needed

  // Pagination states for Members
  const [currentMemberPage, setCurrentMemberPage] = useState(1);
  const membersPerPage = 5; // Adjust as needed

  if (isLoading) return <p className="text-gray-500">Loading board...</p>;
  if (error) return <p className="text-red-500">Error fetching board.</p>;
  if (!board) return <p className="text-yellow-500">No board data available.</p>;

  // Calculate pagination for Lists
  const indexOfLastList = currentListPage * listsPerPage;
  const indexOfFirstList = indexOfLastList - listsPerPage;
  const currentLists = board.lists.slice(indexOfFirstList, indexOfLastList);
  const totalListPages = Math.ceil(board.lists.length / listsPerPage);

  // Calculate pagination for Members
  const indexOfLastMember = currentMemberPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = board.members.slice(indexOfFirstMember, indexOfLastMember);
  const totalMemberPages = Math.ceil(board.members.length / membersPerPage);

  return (
    <div className="p-8 bg-white shadow-md rounded-md mx-auto md:min-h-screen my-1 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">{board.name}</h1>
      <p className="text-gray-700 mb-6">{board.description}</p>

      {/* Tab Navigation */}
      <div className="mb-6 ">
        <nav className="flex space-x-4 border-b">
          <button
            className={`py-2 px-4 -mb-px font-semibold text-sm ${
              activeTab === 'lists'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('lists')}
          >
            Lists ({board.lists.length})
          </button>
          <button
            className={`py-2 px-4 -mb-px font-semibold text-sm ${
              activeTab === 'members'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('members')}
          >
            Members ({board.members.length})
          </button>
          <button
            className={`py-2 px-4 -mb-px font-semibold text-sm ${
              activeTab === 'membership'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('membership')}
          >
            Membership Management
          </button>
          <button
          className={`py-2 px-4 -mb-px font-semibold text-sm ${
              activeTab === 'labels'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('labels')}
            >
                Labels ({board.labels.length})
          </button>
          <button
          className={`py-2 px-4 -mb-px font-semibold text-sm ${
              activeTab === 'Invitation'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('Invitation')}
            >
                Team Invitation
          </button>

        </nav>
      </div>

      {/* Conditional Rendering Based on Active Tab */}
      {activeTab === 'lists' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Lists</h2>
          {currentLists.length === 0 ? (
            <p className="text-gray-500">No lists available.</p>
          ) : (
            <ul className="space-y-4">
              {currentLists.map((list) => (
                <li key={list._id} className="p-4 bg-gray-100 rounded-md shadow-sm flex justify-between items-center">
                  <div>
                    <Link
                      to={`/dashboard/lists/${list._id}`}
                      className="text-blue-500 hover:underline text-lg font-medium"
                    >
                      {list.name}
                    </Link>
                    <p className="text-gray-600 mt-1">
                      {list.cards.length > 0
                        ? `${list.cards.length} card(s)`
                        : 'No cards in this list.'}
                    </p>
                  </div>
                  {/* Optional: Add edit/delete buttons here */}
                  <div className="flex space-x-2">
                    {/* Example: Edit and Delete components */}
                    {/* <EditList list={list} />
                    <DeleteList list={list} /> */}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination for Lists */}
          {totalListPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={currentListPage}
                totalPages={totalListPages}
                onPageChange={(pageNumber) => setCurrentListPage(pageNumber)}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'members' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Members</h2>
          {currentMembers.length === 0 ? (
            <p className="text-gray-500">No members available.</p>
          ) : (
            <ul className="space-y-4">
              {currentMembers.map((memberId) => (
                <li key={memberId} className="p-4 bg-gray-100 rounded-md shadow-sm flex justify-between items-center">
                  <div>
                    <Link
                      to={`/dashboard/board/users/${memberId}`}
                      className="text-blue-500 hover:underline text-lg font-medium"
                    >
                      View Member
                    </Link>
                    {/* You can fetch and display member details here if desired */}
                  </div>
                  {/* Optional: Add edit/remove buttons here */}
                  <div className="flex space-x-2">
                    {/* Example: Edit and Remove components */}
                    {/* <EditMember memberId={memberId} />
                    <RemoveMember memberId={memberId} /> */}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination for Members */}
          {totalMemberPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={currentMemberPage}
                totalPages={totalMemberPages}
                onPageChange={(pageNumber) => setCurrentMemberPage(pageNumber)}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'membership' && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Manage Board Members:</h3>
          <BoardMembersSection boardId={boardId!} />
        </div>
      )}

      {activeTab === 'labels' && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Manage Labels</h3>
          <LabelManager boardId={boardId!} />
        </div>
      )}

      {activeTab === 'Invitation' && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Send Board Invitation</h3>
          <InvitationForm boardId={boardId!} />
        </div>
      )}
    </div>
  );
};

export default BoardDetails;
