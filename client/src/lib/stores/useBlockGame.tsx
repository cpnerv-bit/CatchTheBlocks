import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Block, Basket, GameState, BlockType } from "../../types/game";

interface BlockGameState extends GameState {
  // Actions
  start: () => void;
  restart: () => void;
  end: () => void;
  pause: () => void;
  resume: () => void;
  togglePause: () => void;
  updateBasket: (x: number) => void;
  addBlock: () => void;
  updateBlocks: (deltaTime: number) => void;
  checkCollisions: () => void;
  incrementScore: (points?: number) => void;
  incrementMisses: () => void;
  updateLevel: () => void;
  loadHighScore: () => void;
  saveHighScore: () => void;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const BASKET_WIDTH = 80;
const BASKET_HEIGHT = 20;
const BLOCK_WIDTH = 30;
const BLOCK_HEIGHT = 30;
const BASE_BLOCK_SPEED = 100; // pixels per second
const BASE_SPAWN_INTERVAL = 2000; // milliseconds
const HIGH_SCORE_KEY = 'blockgame-highscore';

// High score utilities
function getStoredHighScore(): number {
  try {
    const stored = localStorage.getItem(HIGH_SCORE_KEY);
    if (!stored) return 0;
    const n = Number.parseInt(stored, 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch (error) {
    console.warn('Failed to load high score:', error);
    return 0;
  }
}

function setStoredHighScore(score: number): void {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  } catch (error) {
    console.warn('Failed to save high score:', error);
  }
}

const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];

// Block type configurations
const BLOCK_TYPES = {
  [BlockType.NORMAL]: { width: 30, height: 30, points: 10, color: '#4ecdc4', probability: 0.5 },
  [BlockType.SMALL]: { width: 20, height: 20, points: 15, color: '#45b7d1', probability: 0.25 },
  [BlockType.LARGE]: { width: 50, height: 40, points: 5, color: '#ff6b6b', probability: 0.15 },
  [BlockType.BONUS]: { width: 25, height: 25, points: 25, color: '#feca57', probability: 0.08 },
  [BlockType.SPEED]: { width: 35, height: 25, points: 20, color: '#ff9ff3', probability: 0.02 }
};

function getRandomBlockType(): BlockType {
  const rand = Math.random();
  let cumulative = 0;
  
  for (const [type, config] of Object.entries(BLOCK_TYPES)) {
    cumulative += config.probability;
    if (rand <= cumulative) {
      return type as BlockType;
    }
  }
  return BlockType.NORMAL;
}

export const useBlockGame = create<BlockGameState>()(
  subscribeWithSelector((set, get) => ({
    score: 0,
    misses: 0,
    level: 1,
    highScore: getStoredHighScore(),
    isNewHighScore: false,
    gamePhase: "ready",
    blocks: [],
    basket: {
      x: CANVAS_WIDTH / 2 - BASKET_WIDTH / 2,
      y: CANVAS_HEIGHT - 40,
      width: BASKET_WIDTH,
      height: BASKET_HEIGHT,
      speed: 300, // pixels per second
    },
    lastBlockSpawn: 0,
    spawnInterval: BASE_SPAWN_INTERVAL,

    start: () => {
      set((state) => {
        if (state.gamePhase === "ready") {
          return {
            gamePhase: "playing",
            lastBlockSpawn: Date.now(),
          };
        }
        return {};
      });
    },

    restart: () => {
      set((state) => ({
        score: 0,
        misses: 0,
        level: 1,
        highScore: state.highScore, // Keep current high score
        isNewHighScore: false,
        gamePhase: "ready",
        blocks: [],
        basket: {
          x: CANVAS_WIDTH / 2 - BASKET_WIDTH / 2,
          y: CANVAS_HEIGHT - 40,
          width: BASKET_WIDTH,
          height: BASKET_HEIGHT,
          speed: 300,
        },
        lastBlockSpawn: 0,
        spawnInterval: BASE_SPAWN_INTERVAL,
      }));
    },

    end: () => {
      set((state) => {
        if (state.gamePhase === "playing" || state.gamePhase === "paused") {
          const wasNewHighScore = state.score > state.highScore;
          const newHighScore = Math.max(state.highScore, state.score);
          
          // Save new high score if it's higher
          if (wasNewHighScore) {
            setStoredHighScore(newHighScore);
            console.log(`New high score achieved: ${newHighScore}`);
          }
          
          return { 
            gamePhase: "ended",
            highScore: newHighScore,
            isNewHighScore: wasNewHighScore
          };
        }
        return {};
      });
    },

    pause: () => {
      set((state) => {
        if (state.gamePhase === "playing") {
          return { gamePhase: "paused" };
        }
        return {};
      });
    },

    resume: () => {
      set((state) => {
        if (state.gamePhase === "paused") {
          return { 
            gamePhase: "playing",
            lastBlockSpawn: Date.now() // Reset spawn timer to prevent immediate block spawn
          };
        }
        return {};
      });
    },

    togglePause: () => {
      set((state) => {
        if (state.gamePhase === "playing") {
          return { gamePhase: "paused" };
        } else if (state.gamePhase === "paused") {
          return { 
            gamePhase: "playing",
            lastBlockSpawn: Date.now() // Reset spawn timer
          };
        }
        return {};
      });
    },

    updateBasket: (x: number) => {
      set((state) => ({
        basket: {
          ...state.basket,
          x: Math.max(0, Math.min(CANVAS_WIDTH - BASKET_WIDTH, x)),
        },
      }));
    },

    addBlock: () => {
      const now = Date.now();
      const state = get();
      
      if (now - state.lastBlockSpawn > state.spawnInterval) {
        const blockType = getRandomBlockType();
        const blockConfig = BLOCK_TYPES[blockType];
        
        // Calculate speed multiplier for SPEED blocks
        const speedMultiplier = blockType === BlockType.SPEED ? 1.5 : 1;
        
        const newBlock: Block = {
          id: `block-${now}`,
          x: Math.random() * (CANVAS_WIDTH - blockConfig.width),
          y: -blockConfig.height,
          width: blockConfig.width,
          height: blockConfig.height,
          speed: (BASE_BLOCK_SPEED + (state.level - 1) * 20) * speedMultiplier,
          color: blockConfig.color,
          type: blockType,
          points: blockConfig.points,
        };

        set((state) => ({
          blocks: [...state.blocks, newBlock],
          lastBlockSpawn: now,
        }));
      }
    },

    updateBlocks: (deltaTime: number) => {
      set((state) => {
        const updatedBlocks = state.blocks
          .map((block) => ({
            ...block,
            y: block.y + (block.speed * deltaTime) / 1000,
          }))
          .filter((block) => {
            // Remove blocks that have fallen off screen
            if (block.y > CANVAS_HEIGHT) {
              // Increment misses for blocks that weren't caught
              setTimeout(() => get().incrementMisses(), 0);
              return false;
            }
            return true;
          });

        return { blocks: updatedBlocks };
      });
    },

    checkCollisions: () => {
      set((state) => {
        const basket = state.basket;
        let newBlocks = [...state.blocks];
        let caughtBlocks: Block[] = [];

        newBlocks = newBlocks.filter((block) => {
          // AABB collision detection
          const collision = 
            block.x < basket.x + basket.width &&
            block.x + block.width > basket.x &&
            block.y < basket.y + basket.height &&
            block.y + block.height > basket.y;

          if (collision) {
            caughtBlocks.push(block);
            return false; // Remove the block
          }
          return true;
        });
        
        // Process all caught blocks
        caughtBlocks.forEach((block) => {
          setTimeout(() => get().incrementScore(block.points), 0);
        });

        return { blocks: newBlocks };
      });
    },

    incrementScore: (points: number = 10) => {
      set((state) => {
        const newScore = state.score + points;
        const newLevel = Math.floor(newScore / 100) + 1;
        const newSpawnInterval = Math.max(500, BASE_SPAWN_INTERVAL - (newLevel - 1) * 200);
        
        return {
          score: newScore,
          level: newLevel,
          spawnInterval: newSpawnInterval,
        };
      });
    },

    incrementMisses: () => {
      set((state) => {
        const newMisses = state.misses + 1;
        if (newMisses >= 3) {
          setTimeout(() => get().end(), 0);
        }
        return { misses: newMisses };
      });
    },

    updateLevel: () => {
      set((state) => {
        const newLevel = Math.floor(state.score / 100) + 1;
        const newSpawnInterval = Math.max(500, BASE_SPAWN_INTERVAL - (newLevel - 1) * 200);
        
        return {
          level: newLevel,
          spawnInterval: newSpawnInterval,
        };
      });
    },

    loadHighScore: () => {
      set(() => ({
        highScore: getStoredHighScore(),
      }));
    },

    saveHighScore: () => {
      const state = get();
      if (state.score > state.highScore) {
        setStoredHighScore(state.score);
        set(() => ({ highScore: state.score }));
      }
    },
  }))
);
