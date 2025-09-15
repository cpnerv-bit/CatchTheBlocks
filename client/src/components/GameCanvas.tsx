import { useEffect, useRef } from "react";
import { useBlockGame } from "../lib/stores/useBlockGame";
import { BlockType } from "../types/game";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { blocks, particles, basket, gamePhase } = useBlockGame();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#87CEEB'; // Sky blue background
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (gamePhase === 'playing' || gamePhase === 'ended') {
      // Draw blocks with type-specific styling
      blocks.forEach((block) => {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, block.height);
        
        // Add type-specific visual effects
        switch (block.type) {
          case BlockType.NORMAL:
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.strokeRect(block.x, block.y, block.width, block.height);
            break;
            
          case BlockType.SMALL:
            // Double border for small blocks
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.strokeRect(block.x, block.y, block.width, block.height);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.strokeRect(block.x + 2, block.y + 2, block.width - 4, block.height - 4);
            break;
            
          case BlockType.LARGE:
            // Thick border for large blocks
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 4;
            ctx.strokeRect(block.x, block.y, block.width, block.height);
            break;
            
          case BlockType.BONUS:
            // Glowing effect for bonus blocks
            ctx.shadowColor = block.color;
            ctx.shadowBlur = 15;
            ctx.fillRect(block.x, block.y, block.width, block.height);
            ctx.shadowBlur = 0;
            
            // Star pattern
            ctx.fillStyle = '#fff';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('★', block.x + block.width/2, block.y + block.height/2 + 5);
            break;
            
          case BlockType.SPEED:
            // Motion lines for speed blocks
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.strokeRect(block.x, block.y, block.width, block.height);
            
            // Motion lines
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
              const y = block.y + 8 + i * 6;
              ctx.beginPath();
              ctx.moveTo(block.x + 5, y);
              ctx.lineTo(block.x + block.width - 5, y);
              ctx.stroke();
            }
            break;
            
          default:
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.strokeRect(block.x, block.y, block.width, block.height);
        }
      });

      // Draw particles
      particles.forEach((particle) => {
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
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

  }, [blocks, particles, basket, gamePhase]);

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
