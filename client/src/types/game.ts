export enum BlockType {
  NORMAL = 'normal',
  SMALL = 'small',
  LARGE = 'large',
  BONUS = 'bonus',
  SPEED = 'speed'
}

export interface Block {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
  type: BlockType;
  points: number;
}

export interface Basket {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export interface GameState {
  score: number;
  misses: number;
  level: number;
  highScore: number;
  isNewHighScore: boolean;
  gamePhase: 'ready' | 'playing' | 'paused' | 'ended';
  blocks: Block[];
  particles: Particle[];
  basket: Basket;
  lastBlockSpawn: number;
  spawnInterval: number;
}

export interface Controls {
  left: boolean;
  right: boolean;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  life: number; // remaining life in ms
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
}
