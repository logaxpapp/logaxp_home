import React, { useState, useEffect } from 'react';
import { useFetchResourceByIdQuery, useUpdateResourceMutation } from '../../api/resourceApiSlice';
import { IResource, ResourceType, Tags } from '../../types/resourceTypes';
import { UpdateResourcePayload } from '../../types/resourcePayloads';
import Modal from '../common/Feedback/Modal';
import Button from '../common/Button/Button';
import { uploadImage } from '../../services/cloudinaryService';

interface ResourceEditProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId: string;
}

const ResourceEdit: React.FC<ResourceEditProps> = ({ isOpen, onClose, resourceId }) => {
  const { data: resource, isLoading: isFetching } = useFetchResourceByIdQuery(resourceId, { skip: !isOpen });
  const [updateResource, { isLoading }] = useUpdateResourceMutation();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResourceType | ''>('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<Tags[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (resource) {
      setTitle(resource.title);
      setType(resource.type);
      setContent(resource.content);
      setTags(resource.tags as Tags[]); // Ensure tags are of type Tags[]
      setExistingImages(resource.images);
    }
  }, [resource]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleRemoveExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const handleTagToggle = (tag: Tags) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !type || !content) {
      alert('Please fill in all required fields.');
      return;
    }

    setUploading(true);

    try {
      const uploadedImageUrls = await Promise.all(
        images.map(async (image) => {
          const url = await uploadImage(image);
          return url;
        })
      );

      const allImageUrls = [...existingImages, ...uploadedImageUrls];

      const payload: UpdateResourcePayload = {
        id: resourceId,
        title,
        type,
        content,
        images: allImageUrls,
        tags, // Updated to include tags
      };

      await updateResource(payload).unwrap();

      setTitle('');
      setType('');
      setContent('');
      setTags([]);
      setImages([]);
      setExistingImages([]);
      onClose();

      alert('Resource updated successfully!');
    } catch (error: any) {
      console.error('Failed to update resource:', error);
      alert(error.message || 'Failed to update resource.');
    } finally {
      setUploading(false);
    }
  };

  if (isFetching) return <p>Loading resource...</p>;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Resource">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Title<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 p-2 w-full border rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Type<span className="text-red-500">*</span>
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ResourceType)}
            required
            className="mt-1 p-2 w-full border rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select Type</option>
            {Object.values(ResourceType).map((typeOption) => (
              <option key={typeOption} value={typeOption}>
                {typeOption}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300">Tags</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(Tags).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-md border ${
                  tags.includes(tag)
                    ? 'bg-blue-500 text-white border-blue-600'
                    : 'bg-gray-200 text-gray-700 border-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Content<span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
            className="mt-1 p-2 w-full border rounded-md focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          ></textarea>
        </div>

        {existingImages.length > 0 && (
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Existing Images</label>
            <div className="flex flex-wrap space-x-2">
              {existingImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`Resource Image ${index + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(img)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    title="Remove Image"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-gray-700 dark:text-gray-300">Add Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mt-1 p-2 w-full border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {images.length > 0 && (
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Image Previews</label>
            <div className="flex flex-wrap space-x-2">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
            disabled={isLoading || uploading}
          >
            {isLoading || uploading ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ResourceEdit;
