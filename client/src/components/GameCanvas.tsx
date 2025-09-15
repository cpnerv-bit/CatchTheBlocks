import { useEffect, useRef } from "react";
import { useBlockGame } from "../lib/stores/useBlockGame";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { blocks, basket, gamePhase } = useBlockGame();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#87CEEB'; // Sky blue background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (gamePhase === 'playing' || gamePhase === 'ended') {
      // Draw blocks
      blocks.forEach((block) => {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, block.height);
        
        // Add a slight border for better visibility
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(block.x, block.y, block.width, block.height);
      });

      // Draw basket
      ctx.fillStyle = '#8B4513'; // Brown color for basket
      ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
      
      // Add basket rim
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 3;
      ctx.strokeRect(basket.x, basket.y, basket.width, basket.height);
      
      // Add basket handle indicators
      ctx.fillStyle = '#654321';
      ctx.fillRect(basket.x - 5, basket.y + 5, 5, 10);
      ctx.fillRect(basket.x + basket.width, basket.y + 5, 5, 10);
    }

    // Draw ground line
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT - 10);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 10);
    ctx.stroke();

  }, [blocks, basket, gamePhase]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border-4 border-gray-800 rounded-lg shadow-2xl bg-sky-200"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
