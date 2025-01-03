// src/components/Document/DocumentTagManager.tsx
import React, { useState } from 'react';
import { useAddTagToDocumentMutation, useRemoveTagFromDocumentMutation } from '../../api/documentApi';

interface DocumentTagManagerProps {
  docId: string;
  currentTags: string[];
}

const DocumentTagManager: React.FC<DocumentTagManagerProps> = ({ docId, currentTags }) => {
  const [tagName, setTagName] = useState('');
  const [addTag] = useAddTagToDocumentMutation();
  const [removeTag] = useRemoveTagFromDocumentMutation();

  const handleAddTag = async () => {
    if (!tagName.trim()) return;
    await addTag({ docId, tag: tagName }).unwrap();
    setTagName('');
  };

  const handleRemoveTag = async (tag: string) => {
    await removeTag({ docId, tag }).unwrap();
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-800">Tags</h3>
      <div className="flex items-center gap-2">
        <input
          className="border p-2 rounded"
          placeholder="Enter tag..."
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          onClick={handleAddTag}
        >
          Add Tag
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {currentTags.map((tag) => (
          <span key={tag} className="inline-flex items-center bg-gray-200 px-2 py-1 rounded">
            {tag}
            <button
              className="ml-2 text-red-600 hover:text-red-800"
              onClick={() => handleRemoveTag(tag)}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default DocumentTagManager;
