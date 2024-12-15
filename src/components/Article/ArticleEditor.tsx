import React, { useEffect, useState } from 'react';
import {
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useGetArticleByIdQuery,
} from '../../api/articleApi';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Select,
  Spin,
  message,
  Typography,
  Card,
  Space,
  Upload,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { IArticle } from '../../types/article';
import { useAppSelector } from '../../app/hooks';
import WYSIWYGEditor from '../common/Input/WYSIWYGEditor';
import { UserRole } from '../../types/user'; // Import UserRole enum
import { uploadImage } from '../../services/cloudinaryService';

const { Title, Text } = Typography;

const ArticleEditor: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  console.log('ArticleEditor received id:', id);
  const [createArticle, { isLoading: isCreating }] = useCreateArticleMutation();
  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
  const { data: article, isLoading: isFetching } = useGetArticleByIdQuery(id!, { skip: !id });
  const user = useAppSelector((state) => state.auth.user);

  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (article) {
      form.setFieldsValue({
        title: article.title,
        content: article.content,
        tags: article.tags,
        status: article.status,
      });
      setImageUrl(article.image); // Set the image if editing
    }
  }, [article, form]);

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const url = await uploadImage(file);
      setImageUrl(url);
      message.success('Image uploaded successfully!');
    } catch (error) {
      message.error('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file: File) => {
    handleImageUpload(file);
    return false; // Prevent auto-upload
  };

  const onFinish = async (values: any) => {
    try {
      const articleData: Partial<IArticle> = { ...values, image: imageUrl };

      if (user?.role !== UserRole.Admin) {
        articleData.status = 'Draft'; // Non-admins can only save as Draft
      }

      if (id) {
        await updateArticle({ id, data: articleData }).unwrap();
        message.success('Article updated successfully!');
      } else {
        await createArticle(articleData).unwrap();
        message.success('Article created successfully!');
      }

      navigate('/dashboard/my-articles');
    } catch (error: any) {
      message.error(error.data?.message || 'An error occurred. Please try again.');
    }
  };

  if (isFetching) return <Spin size="large" className="flex justify-center items-center min-h-screen" />;

  if (!user) return <div>You must be logged in to create or edit articles.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 ">
      <Card
        style={{
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          padding: '20px',
          width: '100%',
         
        }}
      >
        <Title level={3} className="text-center mb-4">
          {id ? 'Edit Article' : 'Create a New Article'}
        </Title>
        <Text type="secondary" className="text-center block mb-6">
          {id
            ? 'Update your article details below.'
            : 'Fill out the form below to create a new article.'}
        </Text>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          style={{ paddingBottom: '20px' }}
        >
          <Form.Item
            name="title"
            label="Article Title"
            rules={[{ required: true, message: 'Title is required.' }]}
          >
            <Input placeholder="Enter a catchy title..." size="large" />
          </Form.Item>
          <Form.Item
            name="content"
            label="Article Content"
            rules={[{ required: true, message: 'Content cannot be empty.' }]}
          >
            <WYSIWYGEditor />
          </Form.Item>
          <Form.Item
            name="tags"
            label="Tags"
            tooltip="Select from existing tags or create new ones."
            rules={[{ required: true, message: 'Please add at least one tag.' }]}
          >
            <Select
              mode="tags"
              placeholder="Add relevant tags (e.g., technology, design)"
              size="large"
              options={[
                { value: 'Technology' },
                { value: 'Design' },
                { value: 'Health' },
                { value: 'Finance' },
                { value: 'Education' },
                { value: 'Lifestyle' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Article Image" tooltip="Upload a relevant image for the article.">
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUpload}
              disabled={uploading}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="Article" style={{ width: '100%' }} />
              ) : (
                <div>
                  {uploading ? <Spin /> : <UploadOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          {user?.role === UserRole.Admin && (
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select placeholder="Select status" size="large">
                <Select.Option value="Draft">Draft</Select.Option>
                <Select.Option value="Published">Published</Select.Option>
                <Select.Option value="Archived">Archived</Select.Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item className="text-center">
            <Space size="large">
              <Button
                type="default"
                size="large"
                onClick={() => navigate('/dashboard/my-articles')}
                style={{ borderRadius: '6px' }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={isCreating || isUpdating}
                style={{ borderRadius: '6px' }}
              >
                {id ? 'Update Article' : 'Create Article'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ArticleEditor;
