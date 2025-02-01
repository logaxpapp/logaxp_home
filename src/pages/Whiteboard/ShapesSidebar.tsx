// src/features/whiteboard/ShapesSidebar.tsx

import React from 'react';
import {
  FaSlash,
  FaArrowRight,
  FaCircle,
  FaArrowLeft,
  FaArrowDown,
  FaArrowUp,
  FaSquare,
  FaPlay,
  FaGem,
  FaDrawPolygon,
  FaProjectDiagram,
  FaCodeBranch,
  FaWaveSquare,
} from 'react-icons/fa';

interface ShapesSidebarProps {
  currentTool: string;
  onSelectTool: (tool: string) => void;
}

const ShapesSidebar: React.FC<ShapesSidebarProps> = ({
  currentTool,
  onSelectTool,
}) => {
  // Helper to handle clicks and log to console
  const handleToolClick = (tool: string) => {
    onSelectTool(tool);
    console.log(`Selected Tool: ${tool}`);
  };

  return (
    <div className="w-14 bg-white flex flex-col items-center py-8 space-y-6">
      {/* LINE TOOL */}
      <button
        onClick={() => handleToolClick('line')}
        className={`p-2 rounded text-gray-700 ${
          currentTool === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        title="Draw a Line"
      >
        <FaSlash />
      </button>

      {/* ARROW TOOL (right arrow) */}
      <button
        onClick={() => handleToolClick('arrow')}
        className={`p-2 rounded text-gray-700 ${
          currentTool === 'arrow' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        title="Draw an Arrow (Right)"
      >
        <FaArrowRight />
      </button>

      {/* CIRCLE TOOL */}
      <button
        onClick={() => handleToolClick('circle')}
        className={`p-2 rounded text-gray-600 ${
          currentTool === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        title="Draw a Circle"
      >
        <FaCircle />
      </button>

      {/* LEFT ARROW TOOL */}
      <button
        onClick={() => handleToolClick('leftArrow')}
        className={`p-2 rounded text-gray-700 ${
          currentTool === 'leftArrow' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        title="Draw a Left Arrow"
      >
        <FaArrowLeft />
      </button>

      {/* DOWN ARROW TOOL */}
      <button
        onClick={() => handleToolClick('downArrow')}
        className={`p-2 rounded text-gray-700 ${
          currentTool === 'downArrow' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        title="Draw a Down Arrow"
      >
        <FaArrowDown />
      </button>

      {/* UP ARROW TOOL */}
      <button
        onClick={() => handleToolClick('upArrow')}
        className={`p-2 rounded text-gray-700 ${
          currentTool === 'upArrow' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        title="Draw an Up Arrow"
      >
        <FaArrowUp />
      </button>

      {/* RECTANGLE TOOL */}
      <button
        onClick={() => handleToolClick('rectangle')}
        className={`p-2 rounded text-gray-700 ${
          currentTool === 'rectangle' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        title="Draw a Rectangle"
      >
        <FaSquare />
      </button>

      {/* TRIANGLE TOOL */}
      <button
        onClick={() => handleToolClick('triangle')}
        className={`p-2 rounded text-gray-700 ${
          currentTool === 'triangle' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        title="Draw a Triangle"
      >
        <FaPlay />
      </button>

      {/* DIAMOND TOOL */}
      <button
        onClick={() => handleToolClick('diamond')}
        className={`p-2 rounded text-gray-700 ${
          currentTool === 'diamond' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        title="Draw a Diamond"
      >
        <FaGem />
      </button>

      {/* POLYGON TOOL (Multi-sided) */}
      <button
        onClick={() => handleToolClick('polygon')}
        className={`p-2 rounded text-gray-700 ${
          currentTool === 'polygon' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        title="Draw a Polygon"
      >
        <FaDrawPolygon />
      </button>

      {/* STRAIGHT CONNECTOR TOOL */}
      <button
        onClick={() => handleToolClick('straightConnector')}
        className={`p-2 rounded text-gray-700 ${
          currentTool === 'straightConnector' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        title="Draw a Straight Connector"
      >
        <FaProjectDiagram />
      </button>

      {/* ELBOW CONNECTOR TOOL */}
      <button
        onClick={() => handleToolClick('elbowConnector')}
        className={`p-2 rounded text-gray-700 ${
          currentTool === 'elbowConnector' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        title="Draw an Elbow Connector"
      >
        <FaCodeBranch />
      </button>

      {/* CURVED CONNECTOR TOOL */}
      <button
        onClick={() => handleToolClick('curvedConnector')}
        className={`p-2 rounded text-gray-700 ${
          currentTool === 'curvedConnector' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        title="Draw a Curved Connector"
      >
        <FaWaveSquare />
      </button>
    </div>
  );
};

export default ShapesSidebar;
