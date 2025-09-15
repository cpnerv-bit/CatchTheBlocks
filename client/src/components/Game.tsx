import { useEffect, useRef } from "react";
import { GameCanvas } from "./GameCanvas";
import { GameUI } from "./GameUI";
import { useBlockGame } from "../lib/stores/useBlockGame";
import { useAudio } from "../lib/stores/useAudio";

export function Game() {
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  
  const {
    gamePhase,
    start,
    togglePause,
    updateBasket,
    addBlock,
    updateBlocks,
    checkCollisions,
    basket,
  } = useBlockGame();
  
  const { backgroundMusic, playSuccess, playHit, isMuted } = useAudio();

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysRef.current[event.code] = true;
      
      // Start game on spacebar or enter
      if ((event.code === 'Space' || event.code === 'Enter') && gamePhase === 'ready') {
        start();
        event.preventDefault();
      }
      
      // Toggle pause on P key during gameplay
      if (event.code === 'KeyP' && (gamePhase === 'playing' || gamePhase === 'paused')) {
        togglePause();
        event.preventDefault();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current[event.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gamePhase, start, togglePause]);

  // Game loop
  useEffect(() => {
    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      if (gamePhase === 'playing') {
        // Handle basket movement
        const keys = keysRef.current;
        if (keys['ArrowLeft'] || keys['KeyA']) {
          updateBasket(basket.x - (basket.speed * deltaTime) / 1000);
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
          updateBasket(basket.x + (basket.speed * deltaTime) / 1000);
        }

        // Add new blocks
        addBlock();

        // Update existing blocks
        updateBlocks(deltaTime);

        // Check for collisions
        checkCollisions();
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gamePhase, basket.x, basket.speed, updateBasket, addBlock, updateBlocks, checkCollisions, togglePause]);

  // Handle background music
  useEffect(() => {
    if (backgroundMusic && gamePhase === 'playing' && !isMuted) {
      backgroundMusic.play().catch(console.log);
    } else if (backgroundMusic) {
      backgroundMusic.pause();
    }
  }, [backgroundMusic, gamePhase, isMuted]);

  // Handle collision sounds
  useEffect(() => {
    const unsubscribe = useBlockGame.subscribe(
      (state) => state.score,
      (score, prevScore) => {
        if (score > prevScore) {
          playSuccess();
        }
      }
    );

    return unsubscribe;
  }, [playSuccess]);

  // Handle miss sounds
  useEffect(() => {
    const unsubscribe = useBlockGame.subscribe(
      (state) => state.misses,
      (misses, prevMisses) => {
        if (misses > prevMisses) {
          playHit();
        }
      }
    );

    return unsubscribe;
  }, [playHit]);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center">
      <div className="relative">
        <GameCanvas />
        <GameUI />
      </div>
    </div>
  );
}
