// src/components/Chat/Sidebar.tsx

import React, { useState } from 'react';
import { Input, Avatar, Skeleton, Button, Tabs, Badge, Tooltip } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../app/hooks';
import { useFetchAllUsersQuery } from '../../api/usersApi';
import { useGetUserGroupsQuery } from '../../api/groupApi';
import { useNavigate, useParams } from 'react-router-dom';
import Pagination from '../../components/Article/Pagination';
import { IUser } from '../../types/user';
import { IGroup } from '../../types/group';
import { OnlineStatus } from '../../types/enums';
import DefaultUserAvatar from '../../assets/images/banner.jpeg';

interface SidebarProps {
  onCreateGroup: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onCreateGroup }) => {
  const navigate = useNavigate();
  const { chatType, chatId } = useParams<{ chatType: string; chatId: string }>();
  const user = useAppSelector((state) => state.auth.user);
  console.log('User:', user);
  const userId = user?._id || '';

  // State for search and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  // Fetch data
  const { data: usersData, isLoading: isUsersLoading, error: usersError } = useFetchAllUsersQuery({
    page: currentPage,
    limit: pageSize,
    
  });
  const { data: groupsData, isLoading: isGroupsLoading, error: groupsError } = useGetUserGroupsQuery({
    page: currentPage,
    limit: pageSize,
    search: searchQuery, // API-based search for groups
  });

  const handleUserSelect = (selectedUserId: string) => {
    navigate(`/dashboard/chat/user/${selectedUserId}`);
  };

  const handleGroupSelect = (selectedGroupId: string) => {
    navigate(`/dashboard/chat/group/${selectedGroupId}`);
  };

  const handleTabChange = () => {
    // Reset search and pagination when switching tabs
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="w-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-y-auto">
      <Tabs
        defaultActiveKey="users"
        onChange={handleTabChange}
        items={[
          {
            key: 'users',
            label: 'Users',
            children: (
              <>
                <Input.Search
                  placeholder="Search users"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  enterButton
                  className="mb-4"
                />
                {isUsersLoading ? (
                  <Skeleton active />
                ) : usersError ? (
                  <div className="text-red-500 text-center">Error loading users.</div>
                ) : (
                  <>
                    <div className="space-y-3 mb-4">
                      {usersData?.users
                        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                        .map((user: IUser) => (
                          <div
                            key={user._id}
                            className={`flex items-center p-4 rounded-lg cursor-pointer transition hover:shadow-lg ${
                              chatType === 'user' && chatId === user._id
                                ? 'bg-green-100 text-gray-500'
                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                                onClick={() => handleUserSelect(user._id)}
                              >
                               <div className="relative inline-block">
                                {/* Avatar */}
                                <Avatar 
                                  src={user.profile_picture_url || DefaultUserAvatar} 
                                  icon={<UserOutlined />} 
                                  className="w-10 h-10" 
                                />

                                {/* Online Indicator Dot */}
                                {user.onlineStatus === OnlineStatus.Online && (
                                  <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-green-500 ring-2 ring-white"></span>
                                )}
                                {user.onlineStatus === OnlineStatus.Busy && (
                                  <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-red-500 ring-2 ring-white"></span>
                                )}
                                {user.onlineStatus === OnlineStatus.Away && (
                                  <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-yellow-500 ring-2 ring-white"></span>
                                )}
                                {user.onlineStatus === OnlineStatus.Offline && (
                                  <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-gray-300 ring-2 ring-white"></span>
                                )}
                              </div>


                            <div className="ml-3">
                              <p className="font-semibold truncate">{user.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      totalItems={usersData?.total || 0}
                      pageSize={pageSize}
                      onPageChange={setCurrentPage}
                    />
                  </>
                )}
              </>
            ),
          },
          {
            key: 'groups',
            label: 'Groups',
            children: (
              <>
                <Input.Search
                  placeholder="Search groups"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  enterButton
                  className="mb-4"
                />
                <Button
                  type="primary"
                  onClick={onCreateGroup}
                  className="mb-4 flex items-center gap-2 w-full justify-center"
                  icon={<PlusOutlined />}
                >
                  Create Group
                </Button>
                {isGroupsLoading ? (
                  <Skeleton active />
                ) : groupsError ? (
                  <div className="text-red-500 text-center">Error loading groups.</div>
                ) : (
                  <>
                    <div className="space-y-3 mb-4">
                      {groupsData?.data.map((group: IGroup) => (
                        <div
                          key={group._id}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition hover:shadow-lg ${
                            chatType === 'group' && chatId === group._id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                          onClick={() => handleGroupSelect(group._id)}
                        >
                          <Badge
                            status={
                              // Assuming groups have an onlineStatus, adjust accordingly
                              group.onlineStatus === OnlineStatus.Online ? 'success' : 'default'
                            }
                            offset={[-5, 30]}
                          >
                            <Avatar size="large" src={group.profile_picture_url || ''}>
                              {!group.profile_picture_url && group.name.charAt(0).toUpperCase()}
                            </Avatar>
                          </Badge>
                          <div className="ml-3">
                            <p className="font-semibold truncate">{group.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{`${group.members.length} members`}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      totalItems={groupsData?.total || 0}
                      pageSize={pageSize}
                      onPageChange={setCurrentPage}
                    />
                  </>
                )}
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default Sidebar;
