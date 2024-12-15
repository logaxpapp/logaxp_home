import React, { useState } from 'react';
import { useGetUserGroupsQuery } from '../../api/groupApi';
import { useNavigate } from 'react-router-dom';
import { Pagination, Typography, Spin, Input, Empty } from 'antd';
import { FaUsers, FaSearch } from 'react-icons/fa';

const { Title, Text } = Typography;

const GroupsList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: groupsData, error, isLoading } = useGetUserGroupsQuery({
    page,
    limit: pageSize,
    search,
  });

  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full h-full flex flex-col space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <Title level={3} className="text-gray-800 dark:text-gray-200 font-semibold mb-0">
          Groups
        </Title>
        <div className="relative">
          <Input
            placeholder="Search Groups..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pr-10"
          />
          <FaSearch className="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="flex-grow flex flex-col items-center justify-center">
          <Text type="danger">Error loading groups. Please try again later.</Text>
        </div>
      ) : (
        <>
          {groupsData?.data && groupsData.data.length > 0 ? (
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupsData.data.map((group) => (
                <div
                  key={group._id}
                  className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-md transition transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                  onClick={() => navigate(`/dashboard/chat/group/${group._id}`)}
                >
                  <div>
                    <Title level={5} className="text-gray-800 dark:text-gray-200 mb-1">
                      {group.name}
                    </Title>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                      <FaUsers className="mr-1" />
                      <Text>{group.members.length} members</Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center">
              <Empty description="No groups found" />
            </div>
          )}

          {/* Pagination */}
          {groupsData?.total && groupsData.total > pageSize && (
            <div className="flex justify-center mt-4">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={groupsData.total}
                onChange={(pageNumber) => setPage(pageNumber)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GroupsList;
