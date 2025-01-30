import React, { useEffect, useRef, useState } from 'react';
import { IStroke } from '../../api/whiteboardApi';
import { getSocket } from '../../socket';
import { FaFont, FaTimes } from 'react-icons/fa'; // Added icons for undo, redo, and clear

interface CanvasWhiteboardProps {
  localStrokes: IStroke[];
  setLocalStrokes: React.Dispatch<React.SetStateAction<IStroke[]>>;
  serverVersion: number;
  whiteboardId: string;
  currentTool: 'pen' | 'rectangle' | 'eraser' | 'text';
  currentColor: string;
  lineWidth: number;
  onBeginStroke?: () => void;
}

const CanvasWhiteboard: React.FC<CanvasWhiteboardProps> = ({
  localStrokes,
  setLocalStrokes,
  serverVersion,
  whiteboardId,
  currentTool,
  currentColor,
  lineWidth,
  onBeginStroke,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // For rectangle
  const [startRectPoint, setStartRectPoint] = useState<{ x: number; y: number } | null>(null);

  // For text
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null);
  const [textInput, setTextInput] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');


  // 1) Draw a dot grid
  const drawDotGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const dotSpacing = 40;
    const dotRadius = 0.5;
    ctx.fillStyle = '#000';
    for (let x = 0; x < canvas.width; x += dotSpacing) {
      for (let y = 0; y < canvas.height; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  // Function to resize the canvas
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const container = canvas.parentElement;
      if (container) {
        // Set canvas width to container's width
        const width = container.clientWidth;
        const height = (width * 800) / 1470; // Maintain aspect ratio

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
      }
    }
  };

  // Resize canvas on mount and window resize
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);


  // 2) Redraw all strokes whenever localStrokes changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDotGrid(ctx, canvas);

    // Re-draw strokes
   // Inside the useEffect where strokes are redrawn
localStrokes.forEach((stroke) => {
  ctx.save();
  ctx.lineWidth = stroke.lineWidth || 2;
  ctx.strokeStyle = stroke.color || '#000';
  ctx.fillStyle = stroke.color || '#000';

  if (stroke.type === 'rectangle' && stroke.points.length === 2) {
    const [start, end] = stroke.points;
    const rectWidth = end.x - start.x;
    const rectHeight = end.y - start.y;
    ctx.strokeRect(start.x, start.y, rectWidth, rectHeight);

  } else if (stroke.type === 'text') {
    // Text stroke with wrapping
    const [pos] = stroke.points;
    const textValue = stroke.text || '';
    const strokeFontSize = stroke.fontSize || fontSize;
    const strokeFontFamily = stroke.fontFamily || fontFamily;
    ctx.font = `${strokeFontSize}px ${strokeFontFamily}`;

    const maxWidth = canvasRef.current!.width - pos.x; // Available width for text
    const lineHeight = strokeFontSize * 1.2; // Line height for wrapping

    let y = pos.y; // Initial Y position

    // Split text into lines
    const words = textValue.split(' ');
    let line = '';

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        // Draw the current line and move to the next
        ctx.fillText(line.trim(), pos.x, y);
        line = words[i] + ' ';
        y += lineHeight; // Move Y position down
      } else {
        line = testLine;
      }
    }

    // Draw the last line
    ctx.fillText(line.trim(), pos.x, y);

  } else {
    // Pen or eraser
    ctx.beginPath();
    stroke.points.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
  }

  ctx.restore();
});
  }, [localStrokes, fontSize, fontFamily]);

  // 3) Emit to server
  const emitToServer = (strokes: IStroke[]) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('whiteboard_update', {
      whiteboardId,
      strokes,
      clientVersion: serverVersion,
    });
  };

  // 4) Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // pen or eraser
    if (currentTool === 'pen' || currentTool === 'eraser') {
      onBeginStroke?.(); // Let parent store old strokes in undo stack
      const color = currentTool === 'eraser' ? '#FFFFFF' : currentColor;
      const newStroke: IStroke = {
        type: currentTool,
        color,
        lineWidth,
        points: [{ x, y }],
      };
      setLocalStrokes((prev) => [...prev, newStroke]);
      return;
    }

    // rectangle
    if (currentTool === 'rectangle') {
      setStartRectPoint({ x, y });
      return;
    }

    // text
    if (currentTool === 'text') {
      setTextPosition({ x, y });
      setIsTextModalOpen(true);
      return;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1) return;
    if (!canvasRef.current) return;

    // pen or eraser => add points
    if (currentTool === 'pen' || currentTool === 'eraser') {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setLocalStrokes((prev) => {
        const copy = [...prev];
        const lastStroke = copy[copy.length - 1];
        if (lastStroke) {
          lastStroke.points.push({ x, y });
        }
        return copy;
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    // rectangle => finalize
    if (currentTool === 'rectangle' && startRectPoint) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newRectStroke: IStroke = {
        type: 'rectangle',
        color: currentColor,
        lineWidth,
        points: [startRectPoint, { x, y }],
      };
      const updated = [...localStrokes, newRectStroke];
      setLocalStrokes(updated);
      setStartRectPoint(null);

      emitToServer(updated);

    } else if (currentTool === 'pen' || currentTool === 'eraser') {
      // pen or eraser => finalize => emit
      emitToServer(localStrokes);
    }
  };

  // 5) Text Modal
  const handleTextSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!textPosition || textInput.trim() === '') {
      setIsTextModalOpen(false);
      setTextInput('');
      return;
    }

    const newTextStroke: IStroke = {
      type: 'text',
      color: currentColor,
      lineWidth,
      points: [textPosition],
      text: textInput,
      fontSize,
      fontFamily,
    };
    const updated = [...localStrokes, newTextStroke];
    setLocalStrokes(updated);
    setIsTextModalOpen(false);
    setTextInput('');

    emitToServer(updated);
  };

  return (
    <div className="relative container mx-auto">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="bg-white rounded-lg shadow-md cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      {/* Text Modal */}
      {isTextModalOpen && textPosition && (
        <div
          className="
            absolute top-4 left-1/2 transform -translate-x-1/2
            bg-white p-4 rounded-lg shadow-lg
            flex items-center space-x-4
          "
        >
          <FaFont className="text-blue-500 w-6 h-6" />
          <form onSubmit={handleTextSubmit} className="flex items-center space-x-4">
            {/* Text Input */}
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your text..."
              required
            />

            {/* Font Size */}
            <div className="flex items-center space-x-2">
              <FaFont className="text-gray-700" />
              <input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-16 p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 flex-wrap"
                min={8}
                max={200}
                required
              />
            </div>

            {/* Font Family */}
            <div className="flex items-center space-x-2">
              <FaFont className="text-gray-700" />
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
                <option value="Georgia">Georgia</option>
                <option value="Tahoma">Tahoma</option>
                <option value="Trebuchet MS">Trebuchet MS</option>
                <option value="Lucida Console">Lucida Console</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="
                px-4 py-2 bg-blue-500 text-white rounded
                hover:bg-blue-600 transition duration-200
                flex items-center space-x-1
              "
            >
              Add
              <FaFont className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 transition duration-200"
              onClick={() => {
                setIsTextModalOpen(false);
                setTextInput('');
              }}
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CanvasWhiteboard;