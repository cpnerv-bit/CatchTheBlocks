import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Block, Basket, GameState } from "../../types/game";

interface BlockGameState extends GameState {
  // Actions
  start: () => void;
  restart: () => void;
  end: () => void;
  updateBasket: (x: number) => void;
  addBlock: () => void;
  updateBlocks: (deltaTime: number) => void;
  checkCollisions: () => void;
  incrementScore: () => void;
  incrementMisses: () => void;
  updateLevel: () => void;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const BASKET_WIDTH = 80;
const BASKET_HEIGHT = 20;
const BLOCK_WIDTH = 30;
const BLOCK_HEIGHT = 30;
const BASE_BLOCK_SPEED = 100; // pixels per second
const BASE_SPAWN_INTERVAL = 2000; // milliseconds

const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];

export const useBlockGame = create<BlockGameState>()(
  subscribeWithSelector((set, get) => ({
    score: 0,
    misses: 0,
    level: 1,
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
      set(() => ({
        score: 0,
        misses: 0,
        level: 1,
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
        if (state.gamePhase === "playing") {
          return { gamePhase: "ended" };
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
        const newBlock: Block = {
          id: `block-${now}`,
          x: Math.random() * (CANVAS_WIDTH - BLOCK_WIDTH),
          y: -BLOCK_HEIGHT,
          width: BLOCK_WIDTH,
          height: BLOCK_HEIGHT,
          speed: BASE_BLOCK_SPEED + (state.level - 1) * 20,
          color: colors[Math.floor(Math.random() * colors.length)],
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
        let collisionDetected = false;

        newBlocks = newBlocks.filter((block) => {
          // AABB collision detection
          const collision = 
            block.x < basket.x + basket.width &&
            block.x + block.width > basket.x &&
            block.y < basket.y + basket.height &&
            block.y + block.height > basket.y;

          if (collision) {
            collisionDetected = true;
            setTimeout(() => get().incrementScore(), 0);
            return false; // Remove the block
          }
          return true;
        });

        return { blocks: newBlocks };
      });
    },

    incrementScore: () => {
      set((state) => {
        const newScore = state.score + 10;
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
  }))
);
