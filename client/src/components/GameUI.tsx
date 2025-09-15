import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBlockGame } from "../lib/stores/useBlockGame";
import { useAudio } from "../lib/stores/useAudio";
import { Volume2, VolumeX, Play, RotateCcw, Pause, PlayIcon } from "lucide-react";

export function GameUI() {
  const {
    score,
    misses,
    level,
    highScore,
    isNewHighScore,
    gamePhase,
    start,
    restart,
    togglePause,
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
              <div className="text-yellow-400">Best: {highScore}</div>
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
                <p className="text-gray-600">High Score: <span className="font-bold text-yellow-600">{highScore}</span></p>
                {isNewHighScore && (
                  <p className="text-lg font-bold text-yellow-600 mt-2">★ New High Score! ★</p>
                )}
              </div>
              <Button onClick={restart} size="lg" className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Play Again
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pause Screen */}
      {gamePhase === 'paused' && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center pointer-events-auto">
          <Card className="w-80 bg-white/95">
            <CardContent className="p-6 text-center">
              <Pause className="h-16 w-16 mx-auto mb-4 text-gray-600" />
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Game Paused</h2>
              <p className="text-gray-600 mb-6">
                Press P to resume playing
              </p>
              <div className="space-y-2">
                <Button onClick={togglePause} size="lg" className="w-full">
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Resume
                </Button>
                <Button onClick={restart} variant="outline" size="lg" className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restart Game
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls Help - Bottom */}
      {gamePhase === 'playing' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Card className="bg-black/60 text-white border-gray-600">
            <CardContent className="p-2 px-4">
              <p className="text-sm">← → Arrow Keys to Move • P to Pause</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
