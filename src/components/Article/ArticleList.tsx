// src/components/Article/ArticleList.tsx

import React, { useState } from 'react';
import { useListArticlesQuery } from '../../api/articleApi';
import { Link } from 'react-router-dom';
import {
  Button,
  Spin,
  Typography,
  Card,
  Pagination,
  Select,
  Tooltip,
  Grid,
  Row,
  Col,
  Tag,
  List,
} from 'antd';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import DefaultAvatar from '../../assets/images/banner.jpeg';
import { useAppSelector } from '../../app/hooks';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const ArticleList: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data, error, isLoading } = useListArticlesQuery({ page, limit: pageSize });
  const user = useAppSelector((state) => state.auth.user);
  const screens = useBreakpoint();

  const handlePageChange = (page: number, pageSize?: number) => {
    setPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const handleViewToggle = () => {
    setViewMode((prevMode) => (prevMode === 'grid' ? 'list' : 'grid'));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !data?.data?.length) {
    return <div>No articles found or failed to load.</div>;
  }

  // Separate the first 5 articles for the featured layout
  const featuredArticles = data.data.slice(0, 5);
  const remainingArticles = data.data.slice(5);

  const renderFeaturedArticles = () => (
    <Row gutter={[16, 16]}>
      {/* Featured Article (Big Card) */}
      <Col xs={24} md={12}>
        {renderLargeArticleItem(featuredArticles[0])}
      </Col>
      {/* Smaller Articles */}
      <Col xs={24} md={12}>
        <Row gutter={[16, 16]}>
          {featuredArticles.slice(1).map((article: any) => (
            <Col xs={12} key={article._id}>
              {renderArticleItem(article)}
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );

  const renderArticleItem = (article: any) => (
    <Card
      hoverable
      className="rounded-lg shadow-md"
      style={{ width: '100%' }}
      cover={
        <Link to={`/articles/${article.slug}`}>
          <img
            alt={article.title}
            src={article.image || DefaultAvatar}
            style={{
              width: '100%',
              height: '150px',
              objectFit: 'cover',
            }}
            className="rounded-t-md"
          />
        </Link>
      }
    >
      <div style={{ padding: '16px' }}>
        {/* Title */}
        <Link to={`/articles/${article.slug}`}>
          <Title level={5} ellipsis={{ rows: 2 }} className="text-black mb-2">
            {article.title}
          </Title>
        </Link>
        {/* Author and Date */}
        <Text type="secondary" className="block mb-2" style={{ fontSize: '12px' }}>
          {article.author?.name || 'Unknown Author'} |{' '}
          {new Date(article.createdAt).toLocaleDateString()}
        </Text>
        {/* Tags */}
        <div style={{ marginBottom: '12px' }}>
          {article.tags?.map((tag: string) => (
            <Tag key={tag} color="geekblue" style={{ marginBottom: '4px' }}>
              {tag}
            </Tag>
          ))}
        </div>
      </div>
    </Card>
  );

  const renderLargeArticleItem = (article: any) => (
    <Card
      hoverable
      className="rounded-lg shadow-md"
      style={{ width: '100%', height: '100%' }}
      cover={
        <Link to={`/articles/${article.slug}`}>
          <img
            alt={article.title}
            src={article.image || DefaultAvatar}
            style={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
            }}
            className="rounded-t-md"
          />
        </Link>
      }
    >
      <div style={{ padding: '16px' }}>
        {/* Title */}
        <Link to={`/articles/${article.slug}`}>
          <Title level={3} ellipsis={{ rows: 2 }} className="text-black mb-2">
            {article.title}
          </Title>
        </Link>
        {/* Author and Date */}
        <Text type="secondary" className="block mb-2" style={{ fontSize: '14px' }}>
          {article.author?.name || 'Unknown Author'} |{' '}
          {new Date(article.createdAt).toLocaleDateString()}
        </Text>
        {/* Content Snippet */}
        <Text className="block mb-3" style={{ fontSize: '14px' }}>
          {article.content?.replace(/<[^>]+>/g, '').substring(0, 150)}...
        </Text>
        {/* Tags */}
        <div style={{ marginBottom: '12px' }}>
          {article.tags?.map((tag: string) => (
            <Tag key={tag} color="geekblue" style={{ marginBottom: '4px' }}>
              {tag}
            </Tag>
          ))}
        </div>
        {/* Footer Section */}
        <div className="flex justify-between text-gray-600" style={{ fontSize: '13px' }}>
          <Text>{article.views} Views</Text>
          <Text>{article.likes} Likes</Text>
          <Text>{article.comments?.length || 0} Comments</Text>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <Title level={2}>Trending Articles</Title>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Select
              defaultValue={pageSize}
              onChange={(value) => setPageSize(value)}
              options={[
                { value: 6, label: '6 / page' },
                { value: 12, label: '12 / page' },
                { value: 24, label: '24 / page' },
              ]}
              style={{ width: 120 }}
            />
            <Tooltip title="Toggle View">
              <Button
                icon={viewMode === 'grid' ? <BarsOutlined /> : <AppstoreOutlined />}
                onClick={handleViewToggle}
              />
            </Tooltip>
            {user && (
              <Link to="/dashboard/articles/create">
                <Button type="primary" size="large" style={{ borderRadius: '6px' }}>
                  Create Article
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Featured Articles */}
        {viewMode === 'grid' && (
          <div className="mb-8">
            {renderFeaturedArticles()}
          </div>
        )}

        {/* Remaining Articles */}
        {viewMode === 'grid' ? (
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            dataSource={remainingArticles}
            renderItem={(article) => (
              <List.Item>
                {renderArticleItem(article)}
              </List.Item>
            )}
          />
        ) : (
          <List
            dataSource={data.data}
            renderItem={(article) => (
              <List.Item>
                <div className="flex items-start">
                  <Link to={`/articles/${article.slug}`} className="mr-4">
                    <img
                      alt={article.title}
                      src={article.image || DefaultAvatar}
                      style={{ height: '120px', width: '200px', objectFit: 'cover' }}
                      className="rounded"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link to={`/articles/${article.slug}`}>
                      <Title level={4} className="text-blue-600 mb-1">
                        {article.title}
                      </Title>
                    </Link>
                    <Text type="secondary" className="block mb-1">
                      {article.author?.name || 'Unknown Author'} |{' '}
                      {new Date(article.createdAt).toLocaleDateString()}
                    </Text>
                    <Text className="block mb-2">
                      {article.content?.replace(/<[^>]+>/g, '').substring(0, 150)}...
                    </Text>
                    <div className="mb-2">
                      {article.tags?.map((tag: string) => (
                        <Tag key={tag} color="geekblue">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                    <div className="flex space-x-4">
                      <Text>{article.views} Views</Text>
                      <Text>{article.likes} Likes</Text>
                      <Text>{article.comments?.length || 0} Comments</Text>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <Pagination
            current={data.page || 1}
            total={data.total || 0}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
