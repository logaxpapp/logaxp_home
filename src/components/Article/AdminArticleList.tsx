// src/components/Article/AdminArticleList.tsx

import React, { useState } from 'react';
import { useListArticlesAdminQuery, useUpdateArticleStatusMutation } from '../../api/articleApi';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Spin, List, Tag, Select, message, Typography, Card, Space } from 'antd';
import { IArticle } from '../../types/article';
import { useAppSelector } from '../../app/hooks';

const { Title, Text } = Typography;

const AdminArticleList: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const { data, error, isLoading } = useListArticlesAdminQuery({
    page,
    status: ['Draft', 'Published', 'Archived'],
  });
  const [updateArticleStatus] = useUpdateArticleStatusMutation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleStatusChange = async (articleId: string, newStatus: string) => {
    try {
      await updateArticleStatus({ id: articleId, status: newStatus }).unwrap();
      message.success('Article status updated successfully');
    } catch (err: any) {
      message.error(err.data?.message || 'Failed to update status');
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );

  if (error) return <div>Error loading articles.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card
        style={{
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <Title level={3} className="mb-0">
            Admin Article Management
          </Title>
          <Button
            type="primary"
            size="large"
            style={{ borderRadius: '6px' }}
            onClick={() => navigate('/dashboard/articles/create')}
          >
            Create Article
          </Button>
        </div>
        <List
          itemLayout="vertical"
          dataSource={data?.data}
          renderItem={(article: IArticle) => (
            <List.Item key={article._id} className="border rounded-lg p-4 mb-4 bg-white">
              <List.Item.Meta
                title={
                  <Link to={`/articles/${article.slug}`} className="text-lg font-semibold text-blue-500">
                    {article.title}{' '}
                    {article.status !== 'Published' && (
                      <Tag color="volcano" className="ml-2">
                        {article.status}
                      </Tag>
                    )}
                  </Link>
                }
                description={
                  <Text type="secondary">
                    By {article.author.name} | {new Date(article.createdAt).toLocaleDateString()}
                  </Text>
                }
              />
              <div className="mb-2">
                <Text strong>{article.views}</Text> Views |{' '}
                <Text strong>{article.likes}</Text> Likes |{' '}
                <Text strong>{article.comments.length}</Text> Comments
              </div>
              <div className="mb-2">
                {article.tags.map((tag) => (
                  <Tag key={tag} color="geekblue">
                    {tag}
                  </Tag>
                ))}
              </div>
              <Space size="middle" className="flex justify-between items-center">
                <Link to={`/dashboard/articles/edit/${article._id}`}>
                  <Button type="default" size="middle">
                    Edit
                  </Button>
                </Link>
                <Select
                  value={article.status}
                  onChange={(value) => handleStatusChange(article._id, value)}
                  style={{ width: 140 }}
                  size="middle"
                >
                  <Select.Option value="Draft">Draft</Select.Option>
                  <Select.Option value="Published">Published</Select.Option>
                  <Select.Option value="Archived">Archived</Select.Option>
                </Select>
              </Space>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default AdminArticleList;
