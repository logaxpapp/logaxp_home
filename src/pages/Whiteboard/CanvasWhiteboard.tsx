// src/features/whiteboard/CanvasWhiteboard.tsx
import React, { useEffect, useRef, useState, MouseEvent } from 'react';
import { IStroke } from '../../api/whiteboardApi'; // your existing interface
import { getSocket } from '../../socket';
import { FaTimes, FaCheck } from 'react-icons/fa';

interface CanvasWhiteboardProps {
  localStrokes: IStroke[];
  setLocalStrokes: React.Dispatch<React.SetStateAction<IStroke[]>>;
  serverVersion: number;
  whiteboardId: string;
  currentTool: IStroke['type'];
  currentColor: string;
  lineWidth: number;
  isBold?: boolean;
  isItalic?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  useBullet?: boolean;
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
  // ========== Refs for two canvases ==========
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);  // background (dot grid)
  const fgCanvasRef = useRef<HTMLCanvasElement | null>(null);  // foreground (user strokes)

  // For shapes that need a start/end point
  const [startShapePoint, setStartShapePoint] = useState<{ x: number; y: number } | null>(null);

  // Inline text editing
  const [textEditing, setTextEditing] = useState<{
    isVisible: boolean;
    x: number;
    y: number;
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
  }>({
    isVisible: false,
    x: 0,
    y: 0,
    text: '',
    fontSize: 16,
    fontFamily: 'Arial',
    color: '#000000',
  });

  // --------------------
  // Draw the dot grid (background)
  // --------------------
  const drawDotGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const dotSpacing = 40;
    const dotRadius = 0.7;
    ctx.fillStyle = '#000';
    for (let x = 0; x < canvas.width; x += dotSpacing) {
      for (let y = 0; y < canvas.height; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  // --------------------
  // Resize both canvases
  // --------------------
  const resizeCanvases = () => {
    const bgCanvas = bgCanvasRef.current;
    const fgCanvas = fgCanvasRef.current;
    if (!bgCanvas || !fgCanvas) return;

    const container = bgCanvas.parentElement; 
    if (!container) return;

    const width = container.clientWidth;
    const height = (width * 800) / 1470; // maintain aspect ratio or adapt

    // set size for background
    bgCanvas.width = width;
    bgCanvas.height = height;

    // set size for foreground
    fgCanvas.width = width;
    fgCanvas.height = height;

    // redraw the background dot grid after resize
    const bgCtx = bgCanvas.getContext('2d');
    if (bgCtx) {
      bgCtx.clearRect(0, 0, width, height);
      drawDotGrid(bgCtx, bgCanvas);
    }
  };

  // ---------------------------------------------
  // On mount / unmount, resize + draw background
  // ---------------------------------------------
  useEffect(() => {
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);
    return () => window.removeEventListener('resize', resizeCanvases);
  }, []);

  // ---------------------------------------------
  // Redraw user strokes on the foreground canvas
  // whenever localStrokes changes
  // ---------------------------------------------
  useEffect(() => {
    const fgCanvas = fgCanvasRef.current;
    if (!fgCanvas) return;
    const ctx = fgCanvas.getContext('2d');
    if (!ctx) return;

    // Clear the foreground
    ctx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);

    // Now, draw each stroke
    localStrokes.forEach((stroke) => {
      ctx.save();
      ctx.lineWidth = stroke.lineWidth || 2;
      ctx.strokeStyle = stroke.color || '#000';
      ctx.fillStyle = stroke.color || '#000';

      if (stroke.type === 'rectangle' && stroke.points.length === 2) {
        const [start, end] = stroke.points;
        const w = end.x - start.x;
        const h = end.y - start.y;
        ctx.strokeRect(start.x, start.y, w, h);
      } else if (stroke.type === 'text') {
        const [pos] = stroke.points;
        ctx.font = `${stroke.fontSize || 16}px ${stroke.fontFamily || 'Arial'}`;
        ctx.fillText(stroke.text || '', pos.x, pos.y);
      }
      // line
      else if (stroke.type === 'line' && stroke.points.length === 2) {
        drawLine(ctx, stroke.points[0], stroke.points[1]);
      }
      // arrow
      else if (stroke.type === 'arrow' && stroke.points.length === 2) {
        drawLine(ctx, stroke.points[0], stroke.points[1]);
        drawArrowHead(ctx, stroke.points[0], stroke.points[1]);
      }
      // circle
      else if (stroke.type === 'circle' && stroke.points.length === 2) {
        drawCircle(ctx, stroke.points[0], stroke.points[1]);
      }
      // leftArrow, downArrow, upArrow
      else if (stroke.type === 'leftArrow' && stroke.points.length === 2) {
        drawLine(ctx, stroke.points[0], stroke.points[1]);
        drawArrowHead(ctx, stroke.points[1], stroke.points[0]); // reverse
      } else if (stroke.type === 'downArrow' && stroke.points.length === 2) {
        drawLine(ctx, stroke.points[0], stroke.points[1]);
        drawArrowHead(ctx, stroke.points[0], stroke.points[1]);
      } else if (stroke.type === 'upArrow' && stroke.points.length === 2) {
        drawLine(ctx, stroke.points[0], stroke.points[1]);
        drawArrowHead(ctx, stroke.points[1], stroke.points[0]);
      }
      // triangle, diamond, polygon
      else if (stroke.type === 'triangle' && stroke.points.length === 2) {
        drawTriangle(ctx, stroke.points[0], stroke.points[1]);
      } else if (stroke.type === 'diamond' && stroke.points.length === 2) {
        drawDiamond(ctx, stroke.points[0], stroke.points[1]);
      } else if (stroke.type === 'polygon' && stroke.points.length === 2) {
        drawPolygonPlaceholder(ctx, stroke.points[0], stroke.points[1]);
      }
      // connectors
      else if (stroke.type === 'straightConnector' && stroke.points.length === 2) {
        drawLine(ctx, stroke.points[0], stroke.points[1]);
      } else if (stroke.type === 'elbowConnector' && stroke.points.length === 2) {
        drawElbowConnector(ctx, stroke.points[0], stroke.points[1]);
      } else if (stroke.type === 'curvedConnector' && stroke.points.length === 2) {
        drawCurvedConnector(ctx, stroke.points[0], stroke.points[1]);
      }
      // pen or eraser
      else if ((stroke.type === 'pen' || stroke.type === 'eraser') && stroke.points.length) {
        ctx.beginPath();
        stroke.points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
      }

      ctx.restore();
    });
  }, [localStrokes]);

  // ---------------------------------------------------------
  // Drawing helper functions (used in the foreground canvas)
  // ---------------------------------------------------------
  function drawLine(ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  function drawCircle(ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }) {
    const rx = (end.x - start.x) / 2;
    const ry = (end.y - start.y) / 2;
    const cx = start.x + rx;
    const cy = start.y + ry;
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawArrowHead(ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    const headLength = 10;
    ctx.save();
    ctx.translate(end.x, end.y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-headLength, headLength / 2);
    ctx.lineTo(-headLength, -headLength / 2);
    ctx.closePath();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
    ctx.restore();
  }

  function drawTriangle(ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }) {
    const midX = (start.x + end.x) / 2;
    ctx.beginPath();
    ctx.moveTo(midX, start.y);       // top
    ctx.lineTo(end.x, end.y);        // bottom right
    ctx.lineTo(start.x, end.y);      // bottom left
    ctx.closePath();
    ctx.stroke();
  }

  function drawDiamond(ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }) {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    ctx.beginPath();
    ctx.moveTo(midX, start.y);    // top
    ctx.lineTo(end.x, midY);      // right
    ctx.lineTo(midX, end.y);      // bottom
    ctx.lineTo(start.x, midY);    // left
    ctx.closePath();
    ctx.stroke();
  }

  function drawPolygonPlaceholder(ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }) {
    // Just an example hex or pentagon
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, start.y);
    ctx.lineTo(end.x + 20, (start.y + end.y) / 2);
    ctx.lineTo(end.x, end.y);
    ctx.lineTo(start.x, end.y);
    ctx.lineTo(start.x - 20, (start.y + end.y) / 2);
    ctx.closePath();
    ctx.stroke();
  }

  function drawElbowConnector(ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }) {
    // single "L" shaped line
    const midX = (start.x + end.x) / 2;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(midX, start.y);
    ctx.lineTo(midX, end.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  function drawCurvedConnector(ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }) {
    // simple quadratic curve
    const controlX = (start.x + end.x) / 2;
    const controlY = (start.y + end.y) / 2 - 50;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.quadraticCurveTo(controlX, controlY, end.x, end.y);
    ctx.stroke();
  }

  // ============== WebSocket emit ===============
  const emitToServer = (strokes: IStroke[]) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('whiteboard_update', {
      whiteboardId,
      strokes,
      clientVersion: serverVersion,
    });
  };

  // ================= Mouse events on FG Canvas =================
  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    const fgCanvas = fgCanvasRef.current;
    if (!fgCanvas) return;
    const rect = fgCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === 'pen' || currentTool === 'eraser') {
      onBeginStroke?.();
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

    // shapes
    if (
      currentTool === 'rectangle' ||
      currentTool === 'line' ||
      currentTool === 'arrow' ||
      currentTool === 'circle' ||
      currentTool === 'leftArrow' ||
      currentTool === 'downArrow' ||
      currentTool === 'upArrow' ||
      currentTool === 'triangle' ||
      currentTool === 'diamond' ||
      currentTool === 'polygon' ||
      currentTool === 'straightConnector' ||
      currentTool === 'elbowConnector' ||
      currentTool === 'curvedConnector'
    ) {
      onBeginStroke?.();
      setStartShapePoint({ x, y });
      return;
    }

    // text
    if (currentTool === 'text') {
      setTextEditing({
        isVisible: true,
        x,
        y,
        text: '',
        fontSize: 16,
        fontFamily: 'Arial',
        color: currentColor,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) return;
    const fgCanvas = fgCanvasRef.current;
    if (!fgCanvas) return;

    if (currentTool === 'pen' || currentTool === 'eraser') {
      const rect = fgCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setLocalStrokes((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last) {
          last.points.push({ x, y });
        }
        return copy;
      });
    }
  };

  const handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    const fgCanvas = fgCanvasRef.current;
    if (!fgCanvas) return;

    if (startShapePoint) {
      const rect = fgCanvas.getBoundingClientRect();
      const xUp = e.clientX - rect.left;
      const yUp = e.clientY - rect.top;

      const newShape: IStroke = {
        type: currentTool,
        color: currentColor,
        lineWidth,
        points: [startShapePoint, { x: xUp, y: yUp }],
      };
      const updated = [...localStrokes, newShape];
      setLocalStrokes(updated);
      setStartShapePoint(null);
      emitToServer(updated);
    } else if (currentTool === 'pen' || currentTool === 'eraser') {
      emitToServer(localStrokes);
    }
  };

  // ============== Inline text editor ==============
  const handleConfirmText = () => {
    if (!textEditing.isVisible) return;
    const { x, y, text, fontSize, fontFamily, color } = textEditing;
    if (!text.trim()) {
      setTextEditing((p) => ({ ...p, isVisible: false }));
      return;
    }

    const textStroke: IStroke = {
      type: 'text',
      color,
      lineWidth,
      points: [{ x, y }],
      text,
      fontSize,
      fontFamily,
    };
    const updated = [...localStrokes, textStroke];
    setLocalStrokes(updated);
    setTextEditing((p) => ({ ...p, isVisible: false }));
    emitToServer(updated);
  };

  const handleCancelText = () => {
    setTextEditing((p) => ({ ...p, isVisible: false, text: '' }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextEditing((p) => ({ ...p, text: e.target.value }));
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10) || 16;
    setTextEditing((p) => ({ ...p, fontSize: size }));
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTextEditing((p) => ({ ...p, fontFamily: e.target.value }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextEditing((p) => ({ ...p, color: e.target.value }));
  };

  // ===========================
  // Render: Two overlapping canvases + text editor
  // ===========================
  return (
    <div className="relative w-full h-full">
      {/* Background Canvas (non-erasable dot grid) */}
      <canvas
        ref={bgCanvasRef}
        style={{ position: 'absolute', top: 0, left: 0 }}
        className="pointer-events-none"
      />

      {/* Foreground Canvas (erasable strokes) */}
      <canvas
        ref={fgCanvasRef}
        style={{ position: 'absolute', top: 0, left: 0 }}
        className="bg-transparent cursor-crosshair w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      {/* Inline Text Editor */}
      {textEditing.isVisible && (
        <>
          {/* Floating Toolbar for text style */}
          <div
            style={{
              position: 'absolute',
              top: textEditing.y - 45,
              left: textEditing.x,
              transform: 'translate(-50%, -50%)',
              background: '#fff',
              border: '0.5px solid #ddd',
              padding: '4px 10px',
              borderRadius: 12,
              display: 'flex',
              gap: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 10,
            }}
          >
            <div className="flex items-center space-x-1">
              <input
                type="number"
                value={textEditing.fontSize}
                onChange={handleFontSizeChange}
                className="w-12 rounded px-1 text-xs border border-gray-100"
                min={8}
                max={128}
              />
            </div>

            <div className="flex items-center space-x-1">
              <select
                value={textEditing.fontFamily}
                onChange={handleFontFamilyChange}
                className="border border-gray-100 rounded text-xs"
              >
                <option>Arial</option>
                <option>Times New Roman</option>
                <option>Courier New</option>
                <option>Verdana</option>
                <option>Georgia</option>
                <option>Tahoma</option>
                <option>Trebuchet MS</option>
                <option>Lucida Console</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 border border-gray-50 rounded p-1">
              <input
                type="color"
                value={textEditing.color}
                onChange={handleColorChange}
                className="w-8 h-8 p-1"
              />
            </div>

            <button
              onClick={handleConfirmText}
              className="text-green-500 px-2 py-1 rounded text-sm hover:bg-green-600"
              title="Add Text"
            >
              <FaCheck />
            </button>
            <button
              onClick={handleCancelText}
              className="text-gray-500 px-2 py-1 rounded text-sm hover:bg-gray-300"
              title="Cancel"
            >
              <FaTimes />
            </button>
          </div>

          {/* The actual text <textarea> for typing */}
          <textarea
            value={textEditing.text}
            onChange={handleTextChange}
            style={{
              position: 'absolute',
              top: textEditing.y,
              left: textEditing.x,
              transform: 'translate(-50%, -50%)',
              fontSize: textEditing.fontSize,
              fontFamily: textEditing.fontFamily,
              color: textEditing.color,
              background: '#fff',
              border: '0.2px solid #aaa',
              padding: '4px 8px',
              borderRadius: 4,
              outline: 'none',
              resize: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 9,
              minWidth: '100px',
              maxWidth: '400px',
              minHeight: '30px',
              marginTop: '0.8em',
            }}
            autoFocus
            onFocus={(e) => {
              const val = e.currentTarget.value;
              e.currentTarget.value = '';
              e.currentTarget.value = val;
            }}
          />
        </>
      )}
    </div>
  );
};

export default CanvasWhiteboard;
