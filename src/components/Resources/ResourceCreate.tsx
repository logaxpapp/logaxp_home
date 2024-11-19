import React, { useState } from 'react';
import { useCreateResourceMutation } from '../../api/resourceApiSlice';
import { ResourceType, Tags } from '../../types/resourceTypes';
import { CreateResourcePayload } from '../../types/resourcePayloads';
import Modal from '../common/Feedback/Modal';
import Button from '../common/Button/Button';
import { uploadImage } from '../../services/cloudinaryService'; // Import the upload service

interface ResourceCreateProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResourceCreate: React.FC<ResourceCreateProps> = ({ isOpen, onClose }) => {
  const [createResource, { isLoading }] = useCreateResourceMutation();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResourceType | ''>('');
  const [tags, setTags] = useState<Tags[]>([]); // Updated to use Tags enum
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
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

      const payload: CreateResourcePayload = {
        title,
        type,
        content,
        images: uploadedImageUrls,
        tags, // Use Tags enum array directly
      };

      await createResource(payload).unwrap();

      setTitle('');
      setType('');
      setTags([]);
      setContent('');
      setImages([]);
      onClose();

      alert('Resource created successfully!');
    } catch (error: any) {
      console.error('Failed to create resource:', error);
      alert(error.message || 'Failed to create resource.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Resource">
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
            className="mt-1 p-2 w-full border rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            className="mt-1 p-2 w-full border rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                    ? 'bg-blue-200 text-gray-700 border-blue-600 text-sm'
                    : 'bg-gray-200 text-gray-700 border-gray-300 text-sm'
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
            className="mt-1 p-2 w-full border rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300">Images</label>
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
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            disabled={isLoading || uploading}
          >
            {isLoading || uploading ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ResourceCreate;
