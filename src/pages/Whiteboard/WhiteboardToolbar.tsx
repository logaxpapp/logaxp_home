// src/features/whiteboard/WhiteboardToolbar.tsx
import React from 'react';
import {
  FaPen,
  FaSquare,
  FaEraser,
  FaRegKeyboard,
  FaUndo,
  FaRedo,
  FaTrash,
  FaCameraRetro,
  FaBold,
  FaItalic,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaListUl,
} from 'react-icons/fa';

// In WhiteboardToolbar.tsx (props interface)
import { WhiteboardTool } from '../../types/whiteboard';

interface WhiteboardToolbarProps {
  snapshotMode: boolean;
  setSnapshotMode: React.Dispatch<React.SetStateAction<boolean>>;

  // BOTH must be WhiteboardTool
  currentTool: WhiteboardTool;
  setCurrentTool: React.Dispatch<React.SetStateAction<WhiteboardTool>>; 

  currentColor: string;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;

  lineWidth: number;
  setLineWidth: React.Dispatch<React.SetStateAction<number>>;

  // text style toggles
  isBold: boolean;
  setIsBold: React.Dispatch<React.SetStateAction<boolean>>;
  isItalic: boolean;
  setIsItalic: React.Dispatch<React.SetStateAction<boolean>>;
  textAlign: 'left' | 'center' | 'right';
  setTextAlign: React.Dispatch<React.SetStateAction<'left' | 'center' | 'right'>>;
  useBullet: boolean;
  setUseBullet: React.Dispatch<React.SetStateAction<boolean>>;

  canUndo: boolean;
  canRedo: boolean;
  handleUndo: () => void;
  handleRedo: () => void;
  handleClear: () => void;
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
  isBold,
  setIsBold,
  isItalic,
  setIsItalic,
  textAlign,
  setTextAlign,
  useBullet,
  setUseBullet,
  canUndo,
  canRedo,
  handleUndo,
  handleRedo,
  handleClear,
}) => {
  return (
    <div className="flex flex-wrap items-center space-x-6 p-3 bg-white shadow">
      {/* Snapshot Toggle */}
      <button
        onClick={() => setSnapshotMode(!snapshotMode)}
        className={`flex items-center px-3 py-1 rounded transition-colors ${
          snapshotMode ? 'bg-green-700 text-white' : 'bg-green-300 text-green-800'
        } hover:bg-green-400`}
        title="Toggle Snapshot Mode"
      >
        <FaCameraRetro className="mr-1" />
        {snapshotMode ? 'Snapshot ON' : 'Snapshot OFF'}
      </button>

      {/* Tools (Pen, Rectangle, Eraser, Text) */}
      <button
        onClick={() => setCurrentTool('pen')}
        className={`p-2 rounded transition-colors ${
          currentTool === 'pen' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
        } hover:bg-blue-500`}
        title="Pen Tool"
      >
        <FaPen />
      </button>
      <button
        onClick={() => setCurrentTool('rectangle')}
        className={`p-2 rounded transition-colors ${
          currentTool === 'rectangle' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
        } hover:bg-blue-500`}
        title="Rectangle Tool"
      >
        <FaSquare />
      </button>
      <button
        onClick={() => setCurrentTool('eraser')}
        className={`p-2 rounded transition-colors ${
          currentTool === 'eraser' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
        } hover:bg-blue-500`}
        title="Eraser Tool"
      >
        <FaEraser />
      </button>
      <button
        onClick={() => setCurrentTool('text')}
        className={`p-2 rounded transition-colors ${
          currentTool === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
        } hover:bg-blue-500`}
        title="Text Tool"
      >
        <FaRegKeyboard />
      </button>

      {/* Color Picker */}
      <input
        type="color"
        value={currentColor}
        onChange={(e) => setCurrentColor(e.target.value)}
        className="w-8 h-8 cursor-pointer"
        title="Choose Color"
      />

      {/* Line Width */}
      <div className="flex items-center space-x-1">
        <input
          type="range"
          min={1}
          max={20}
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className="w-24"
          title="Line Width"
        />
        <span className="text-sm">{lineWidth}px</span>
      </div>

      {/* Text style toggles (Bold, Italic, Align, Bullet) */}
      <button
        onClick={() => setIsBold((prev) => !prev)}
        className={`p-2 rounded transition-colors ${
          isBold ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
        } hover:bg-blue-500`}
        title="Bold"
      >
        <FaBold />
      </button>
      <button
        onClick={() => setIsItalic((prev) => !prev)}
        className={`p-2 rounded transition-colors ${
          isItalic ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
        } hover:bg-blue-500`}
        title="Italic"
      >
        <FaItalic />
      </button>
      <button
        onClick={() => setTextAlign('left')}
        className={`p-2 rounded transition-colors ${
          textAlign === 'left' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
        } hover:bg-blue-500`}
        title="Align Left"
      >
        <FaAlignLeft />
      </button>
      <button
        onClick={() => setTextAlign('center')}
        className={`p-2 rounded transition-colors ${
          textAlign === 'center' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
        } hover:bg-blue-500`}
        title="Align Center"
      >
        <FaAlignCenter />
      </button>
      <button
        onClick={() => setTextAlign('right')}
        className={`p-2 rounded transition-colors ${
          textAlign === 'right' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
        } hover:bg-blue-500`}
        title="Align Right"
      >
        <FaAlignRight />
      </button>
      <button
        onClick={() => setUseBullet((prev) => !prev)}
        className={`p-2 rounded transition-colors ${
          useBullet ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
        } hover:bg-blue-500`}
        title="Bullet List"
      >
        <FaListUl />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Undo / Redo / Clear */}
      <button
        onClick={handleUndo}
        disabled={!canUndo}
        className={`p-2 rounded transition-colors ${
          canUndo ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-100 text-gray-400'
        }`}
        title="Undo"
      >
        <FaUndo />
      </button>
      <button
        onClick={handleRedo}
        disabled={!canRedo}
        className={`p-2 rounded transition-colors ${
          canRedo ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-100 text-gray-400'
        }`}
        title="Redo"
      >
        <FaRedo />
      </button>
      <button
        onClick={handleClear}
        className="p-2 rounded transition-colors bg-red-500 text-white hover:bg-red-600"
        title="Clear Whiteboard"
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default WhiteboardToolbar;
