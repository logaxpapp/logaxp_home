// src/components/Article/ArticleDetail.tsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  useGetArticleQuery,
  useLikeArticleMutation,
  useAddCommentMutation,
  useGetRelatedArticlesQuery,
  useGetTrendingArticlesQuery,
} from '../../api/articleApi';
import {
  Spin,
  Button,
  Input,
  List,
  Typography,
  Avatar,
  Card,
  Divider,
  Tag,
  message,
  Tooltip,
} from 'antd';
import {
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import DefaultAvatar from '../../assets/images/banner.jpeg';
import { useAppSelector } from '../../app/hooks';

const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    data: article,
    error,
    isLoading,
    refetch,
  } = useGetArticleQuery(slug!);

  const [likeArticle] = useLikeArticleMutation();
  const [addComment] = useAddCommentMutation();

  const user = useAppSelector((state) => state.auth.user);

  const [commentContent, setCommentContent] = React.useState('');

  // Fetch related articles when article is available
  const { data: relatedArticles } = useGetRelatedArticlesQuery(article?._id || '', {
    skip: !article?._id,
  });

  // Fetch trending articles
  const { data: trendingArticles } = useGetTrendingArticlesQuery(5);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );

  if (error || !article)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Title level={2}>Article Not Found</Title>
          <Link to="/articles">
            <Button type="primary">Go back to articles</Button>
          </Link>
        </div>
      </div>
    );

  const handleLike = async () => {
    try {
      await likeArticle(article._id).unwrap();
      message.success('Article liked!');
      refetch(); // Refresh article data
    } catch {
      message.error('Failed to like the article.');
    }
  };

  const handleAddComment = async () => {
    if (commentContent.trim()) {
      try {
        await addComment({ id: article._id, content: commentContent }).unwrap();
        setCommentContent('');
        message.success('Comment added!');
        refetch(); // Refresh article data
      } catch {
        message.error('Failed to add comment.');
      }
    }
  };

  const renderRelatedArticles = () => {
    if (!relatedArticles || relatedArticles.length === 0) return null;

    return (
      <Card title="Related Articles" className="shadow-md rounded-lg">
        <List
          dataSource={relatedArticles}
          renderItem={(item) => (
            <List.Item>
              <Link to={`/articles/${item.slug}`}>{item.title}</Link>
            </List.Item>
          )}
        />
      </Card>
    );
  };

  const renderTrendingArticles = () => {
    if (!trendingArticles || trendingArticles.length === 0) return null;

    return (
      <Card title="Trending Articles" className="shadow-md rounded-lg">
        <List
          dataSource={trendingArticles}
          renderItem={(item) => (
            <List.Item>
              <Link to={`/articles/${item.slug}`}>
                <div className="flex items-center">
                  <Avatar
                    src={item.image || DefaultAvatar}
                    size="large"
                    className="mr-3"
                  />
                  <div>
                    <Text strong>{item.title}</Text>
                    <div className="text-sm text-gray-500">
                      {item.views} views
                    </div>
                  </div>
                </div>
              </Link>
            </List.Item>
          )}
        />
      </Card>
    );
  };

  const shareArticle = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success('Article URL copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1">
        <Card
          cover={
            <img
              alt={article.title}
              src={article.image || DefaultAvatar}
              className="w-full h-72 object-cover rounded-t-lg"
            />
          }
          className="shadow-md rounded-lg"
        >
          <div className="flex items-center mb-4">
            <Avatar
              src={article.author?.profile_picture_url || DefaultAvatar}
              size={64}
              className="mr-4"
            />
            <div>
              <Title level={2} style={{ marginBottom: '0' }}>
                {article.title || 'Untitled'}
              </Title>
              <Text type="secondary">
                By {article.author?.name || 'Unknown Author'} |{' '}
                {new Date(article.createdAt).toLocaleDateString()}
              </Text>
            </div>
          </div>
          <Divider />

          <div
            className="prose lg:prose-xl"
            dangerouslySetInnerHTML={{ __html: article.content || 'No content available.' }}
          />

          <Divider />

          <div className="flex items-center space-x-4">
            <Button type="primary" icon={<LikeOutlined />} onClick={handleLike}>
              Like ({article.likes || 0})
            </Button>
            <Button icon={<CommentOutlined />}>
              Comments ({article.comments.length || 0})
            </Button>
            <Tooltip title="Share Article">
              <Button icon={<ShareAltOutlined />} onClick={shareArticle} />
            </Tooltip>
          </div>

          <div className="mt-6">
            {article.tags?.map((tag) => (
              <Tag key={tag} color="blue" className="mb-2">
                {tag}
              </Tag>
            ))}
          </div>
        </Card>

        {/* Comments Section */}
        <Card
          title="Comments"
          bordered={false}
          className="shadow-md rounded-lg mt-8"
        >
          {user ? (
            <div className="mb-6">
              <TextArea
                rows={4}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write your comment here..."
                className="mb-2"
              />
              <Button type="primary" onClick={handleAddComment}>
                Add Comment
              </Button>
            </div>
          ) : (
            <div className="mb-6 text-center">
              <Text>Please log in to add a comment.</Text>
            </div>
          )}
          <List
            itemLayout="horizontal"
            dataSource={article.comments || []}
            renderItem={(comment) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar src={comment.user?.profile_picture_url || DefaultAvatar} />
                  }
                  title={comment.user?.name || 'Anonymous'}
                  description={comment.content}
                />
                <span>{new Date(comment.createdAt).toLocaleString()}</span>
              </List.Item>
            )}
          />
        </Card>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-1/3 space-y-6">
        {renderRelatedArticles()}
        {renderTrendingArticles()}
      </div>
    </div>
  );
};

export default ArticleDetail;
