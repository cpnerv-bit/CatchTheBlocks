export interface Block {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
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
  gamePhase: 'ready' | 'playing' | 'ended';
  blocks: Block[];
  basket: Basket;
  lastBlockSpawn: number;
  spawnInterval: number;
}

export interface Controls {
  left: boolean;
  right: boolean;
}
