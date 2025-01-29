// src/pages/Whiteboard/WhiteboardToolbar.tsx

import React from 'react';
import {
  FaPen,
  FaSquare,
  FaEraser,
  FaRegKeyboard,
  FaUndo,
  FaRedo,
  FaTrash,
  FaCameraRetro, // For snapshot icon
} from 'react-icons/fa';

interface WhiteboardToolbarProps {
  snapshotMode: boolean;
  setSnapshotMode: React.Dispatch<React.SetStateAction<boolean>>;

  currentTool: 'pen' | 'rectangle' | 'eraser' | 'text';
  setCurrentTool: React.Dispatch<React.SetStateAction<'pen' | 'rectangle' | 'eraser' | 'text'>>;

  currentColor: string;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;

  lineWidth: number;
  setLineWidth: React.Dispatch<React.SetStateAction<number>>;

  // For Undo/Redo/Clear
  canUndo?: boolean;
  canRedo?: boolean;
  handleUndo?: () => void;
  handleRedo?: () => void;
  handleClear?: () => void;
}

const WhiteboardToolbar: React.FC<WhiteboardToolbarProps> = ({
  snapshotMode,
  setSnapshotMode,
  currentTool,
  setCurrentTool,
  currentColor,
  setCurrentColor,
  lineWidth,
  setLineWidth,

  canUndo = false,
  canRedo = false,
  handleUndo,
  handleRedo,
  handleClear,
}) => {
  return (
    <div className="flex flex-wrap items-center space-x-2 p-2 bg-gray-100 rounded shadow">
      {/* Snapshot Toggle */}
      <button
        onClick={() => setSnapshotMode(!snapshotMode)}
        className={`flex items-center px-3 py-1 rounded transition-colors ${
          snapshotMode ? 'bg-green-700 text-white' : 'bg-green-300 text-green-800'
        } hover:bg-green-400`}
        aria-label="Toggle Snapshot Mode"
        title="Toggle Snapshot Mode"
      >
        <FaCameraRetro className="mr-2" />
        {snapshotMode ? 'Snapshot ON' : 'Snapshot OFF'}
      </button>

      {/* Tool Buttons */}
      <button
        onClick={() => setCurrentTool('pen')}
        className={`flex items-center justify-center p-2 rounded transition-colors ${
          currentTool === 'pen' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
        } hover:bg-blue-500`}
        aria-label="Pen Tool"
        title="Pen Tool"
      >
        <FaPen />
      </button>
      <button
        onClick={() => setCurrentTool('rectangle')}
        className={`flex items-center justify-center p-2 rounded transition-colors ${
          currentTool === 'rectangle' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
        } hover:bg-blue-500`}
        aria-label="Rectangle Tool"
        title="Rectangle Tool"
      >
        <FaSquare />
      </button>
      <button
        onClick={() => setCurrentTool('eraser')}
        className={`flex items-center justify-center p-2 rounded transition-colors ${
          currentTool === 'eraser' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
        } hover:bg-blue-500`}
        aria-label="Eraser Tool"
        title="Eraser Tool"
      >
        <FaEraser />
      </button>
      <button
        onClick={() => setCurrentTool('text')}
        className={`flex items-center justify-center p-2 rounded transition-colors ${
          currentTool === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
        } hover:bg-blue-500`}
        aria-label="Text Tool"
        title="Text Tool"
      >
        <FaRegKeyboard />
      </button>

      {/* Color Picker */}
      <div className="flex items-center space-x-1">
        <label htmlFor="colorPicker" className="text-sm font-medium text-gray-700">
          Color:
        </label>
        <input
          id="colorPicker"
          type="color"
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value)}
          className="w-8 h-8 p-0 border-none cursor-pointer"
          aria-label="Select Color"
          title="Select Color"
        />
      </div>

      {/* Line Width */}
      <div className="flex items-center space-x-1">
        <label htmlFor="lineWidth" className="text-sm font-medium text-gray-700">
          Width:
        </label>
        <input
          id="lineWidth"
          type="range"
          min={1}
          max={20}
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className="w-24"
          aria-label="Line Width"
          title="Adjust Line Width"
        />
        <span className="text-sm text-gray-700">{lineWidth}px</span>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Undo, Redo, Clear Buttons */}
      <div className="flex items-center space-x-2">
        {/* Undo */}
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className={`flex items-center justify-center p-2 rounded transition-colors ${
            canUndo
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Undo"
          title="Undo"
        >
          <FaUndo />
        </button>

        {/* Redo */}
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className={`flex items-center justify-center p-2 rounded transition-colors ${
            canRedo
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Redo"
          title="Redo"
        >
          <FaRedo />
        </button>

        {/* Clear */}
        <button
          onClick={handleClear}
          className="flex items-center justify-center p-2 rounded transition-colors bg-red-400 text-white hover:bg-red-500"
          aria-label="Clear Whiteboard"
          title="Clear Whiteboard"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default WhiteboardToolbar;
