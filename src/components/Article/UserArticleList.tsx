// src/components/Article/UserArticleList.tsx

import React, { useState } from 'react';
import { useListArticlesQuery } from '../../api/articleApi';
import { Link } from 'react-router-dom';
import {  Spin, List, Tag, message, Select, Input, Table } from 'antd';
import { IArticle } from '../../types/article';
import { useAppSelector } from '../../app/hooks';
import Button from '../common/Button';
import Pagination from './Pagination';
import { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Search } = Input;

const UserArticleList: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string[]>(['Published', 'Draft']);

  const { data, error, isLoading } = useListArticlesQuery({
    page,
    limit: pageSize,
    status: statusFilter,
    authorId: user?._id,
    search: searchTerm,
  });

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page when searching
  };

  const handleStatusChange = (value: string[]) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    if (value === 'views' || value === 'likes' || value === 'comments') {
      setSortBy(value);
      setSortOrder('descend');
    } else {
      setSortBy(value);
      setSortOrder('descend');
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-20">
        <p>Error loading articles.</p>
      </div>
    );

  const columns: ColumnsType<IArticle> = [
    {
      title: 'Title',
      dataIndex: 'title',
      render: (text: string, record: IArticle) => (
        <Link to={`/articles/${record.slug}`} className="text-blue-600 hover:underline">
          {text}
        </Link>
      ),
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: [
        { text: 'Published', value: 'Published' },
        { text: 'Draft', value: 'Draft' },
      ],
      render: (status: string) => (
        <span
          className={`${
            status === 'Published' ? 'text-green-600' : 'text-yellow-600'
          } font-semibold`}
        >
          {status}
        </span>
      ),
    },
    {
      title: 'Views',
      dataIndex: 'views',
      sorter: true,
    },
    {
      title: 'Likes',
      dataIndex: 'likes',
      sorter: true,
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      render: (comments) => comments.length,
      sorter: true,
    },
    {
      title: 'Actions',
      render: (_: any, record: IArticle) => (
        <div className="space-x-2">
          <Link to={`/dashboard/articles/edit/${record._id}`}>
            <Button variant="primary" size="small">
              Edit
            </Button>
          </Link>
          {/* Add more actions if needed */}
        </div>
      ),
    },
  ];

  // Handle sorting and filtering on the client-side
  const sortedData = [...(data?.data || [])].sort((a, b) => {
    if (sortBy === 'comments') {
      return sortOrder === 'ascend'
        ? a.comments.length - b.comments.length
        : b.comments.length - a.comments.length;
    } else {
      return sortOrder === 'ascend'
        ? (a as any)[sortBy] - (b as any)[sortBy]
        : (b as any)[sortBy] - (a as any)[sortBy];
    }
  });

  const filteredData = sortedData.filter((article) =>
    statusFilter.includes(article.status)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 mt-2">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 
        bg-gradient-to-t
           from-teal-600 via-cyan-900 to-gray-900 p-1 rounded-lg shadow-md">
            {/* Header Section */}
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">My Articles</h1>
                <p className="text-gray-50 text-sm">
                Manage your articles and create new content to share with your audience.
                </p>
            </div>

            {/* Button Section */}
            <Link
                to="/dashboard/articles/create"
                className="mt-4 md:mt-0 bg-lemonGreen hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition duration-300 ease-in-out shadow-lg"
            >
                Create New Article
            </Link>
            </div>


        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
          <Search
            placeholder="Search articles"
            onSearch={handleSearch}
            style={{ width: '100%', maxWidth: 300 }}
            allowClear
            className="mb-4 md:mb-0"
          />
          <Select
            mode="multiple"
            allowClear
            placeholder="Filter by status"
            defaultValue={['Published', 'Draft']}
            onChange={handleStatusChange}
            style={{ width: '100%', maxWidth: 300 }}
          >
            <Option value="Published">Published</Option>
            <Option value="Draft">Draft</Option>
          </Select>
          <Select
            defaultValue="createdAt"
            onChange={handleSortChange}
            style={{ width: '100%', maxWidth: 200 }}
          >
            <Option value="createdAt">Date Created</Option>
            <Option value="views">Views</Option>
            <Option value="likes">Likes</Option>
            <Option value="comments">Comments</Option>
          </Select>
        </div>

        {/* Article List */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          pagination={false}
          className="bg-white rounded-lg shadow-md"
        />

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={page}
            totalItems={data?.total || 0}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default UserArticleList;
