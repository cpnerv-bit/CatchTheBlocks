import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBlockGame } from "../lib/stores/useBlockGame";
import { useAudio } from "../lib/stores/useAudio";
import { Volume2, VolumeX, Play, RotateCcw } from "lucide-react";

export function GameUI() {
  const {
    score,
    misses,
    level,
    gamePhase,
    start,
    restart,
  } = useBlockGame();
  
  const { isMuted, toggleMute } = useAudio();

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Game Stats - Top */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        <Card className="bg-black/80 text-white border-gray-600">
          <CardContent className="p-4">
            <div className="flex gap-6 text-lg font-bold">
              <div>Score: {score}</div>
              <div>Level: {level}</div>
              <div className="text-red-400">Misses: {misses}/3</div>
            </div>
          </CardContent>
        </Card>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMute}
          className="bg-black/80 text-white border-gray-600 hover:bg-gray-700"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Game Start Screen */}
      {gamePhase === 'ready' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-auto">
          <Card className="w-96 bg-white/95">
            <CardContent className="p-8 text-center">
              <h1 className="text-4xl font-bold mb-4 text-gray-800">Block Catcher</h1>
              <p className="text-gray-600 mb-6">
                Use arrow keys (← →) to move the basket and catch falling blocks!
              </p>
              <div className="text-sm text-gray-500 mb-6">
                <p>• Catch blocks to score points</p>
                <p>• Game gets faster as you level up</p>
                <p>• You can miss 3 blocks before game over</p>
              </div>
              <Button onClick={start} size="lg" className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Start Game
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Game Over Screen */}
      {gamePhase === 'ended' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-auto">
          <Card className="w-96 bg-white/95">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Game Over!</h2>
              <div className="text-xl mb-6">
                <p className="text-gray-600">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
                <p className="text-gray-600">Level Reached: <span className="font-bold text-green-600">{level}</span></p>
              </div>
              <Button onClick={restart} size="lg" className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Play Again
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls Help - Bottom */}
      {gamePhase === 'playing' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Card className="bg-black/60 text-white border-gray-600">
            <CardContent className="p-2 px-4">
              <p className="text-sm">← → Arrow Keys to Move</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
