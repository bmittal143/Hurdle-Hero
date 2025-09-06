"use client";

import React, { useState, useEffect, useReducer, useCallback, useRef } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import * as C from '@/lib/game-constants';
import { soundManager } from '@/lib/sounds';

import Character from '@/components/game/Character';
import Hurdle from '@/components/game/Hurdle';
import PowerUp from '@/components/game/PowerUp';
import ParallaxBackground from '@/components/game/ParallaxBackground';
import StartScreen from '@/components/game/StartScreen';
import GameOverScreen from '@/components/game/GameOverScreen';
import OnScreenControls from '@/components/game/OnScreenControls';

type GameState = 'start' | 'playing' | 'gameOver';

interface CharacterState {
  y: number;
  vy: number;
  isJumping: boolean;
  isCrouching: boolean;
  width: number;
  height: number;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'hurdle' | 'powerup';
  powerUpType?: 'shield';
}

interface State {
  gameState: GameState;
  score: number;
  gameSpeed: number;
  character: CharacterState;
  obstacles: Obstacle[];
  shieldTimer: number;
  nextHurdleIn: number;
  nextPowerUpIn: number;
  theme: number;
}

type Action =
  | { type: 'START_GAME' }
  | { type: 'RESTART' }
  | { type: 'JUMP' }
  | { type: 'CROUCH_START' }
  | { type: 'CROUCH_END' }
  | { type: 'GAME_TICK'; deltaTime: number };


let obstacleIdCounter = 0;

const initialCharacterState: CharacterState = {
  y: C.GROUND_HEIGHT,
  vy: 0,
  isJumping: false,
  isCrouching: false,
  width: C.CHARACTER_WIDTH,
  height: C.CHARACTER_HEIGHT_NORMAL,
};

const initialState: State = {
  gameState: 'start',
  score: 0,
  gameSpeed: C.GAME_SPEED_START,
  character: initialCharacterState,
  obstacles: [],
  shieldTimer: 0,
  nextHurdleIn: 2,
  nextPowerUpIn: C.POWERUP_SPAWN_INTERVAL.MIN,
  theme: 0,
};

function gameReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        gameState: 'playing',
      };
    case 'RESTART':
      return {
        ...initialState,
        gameState: 'playing',
      };
    case 'JUMP':
      if (!state.character.isJumping) {
        soundManager.playJump();
        return {
          ...state,
          character: { ...state.character, isJumping: true, vy: C.JUMP_VELOCITY },
        };
      }
      return state;
    case 'CROUCH_START':
      if (!state.character.isJumping) {
        return {
          ...state,
          character: { ...state.character, isCrouching: true, height: C.CHARACTER_HEIGHT_CROUCH },
        };
      }
      return state;
    case 'CROUCH_END':
      return {
        ...state,
        character: { ...state.character, isCrouching: false, height: C.CHARACTER_HEIGHT_NORMAL },
      };
    case 'GAME_TICK':
      if (state.gameState !== 'playing') return state;
      const { deltaTime } = action;

      // Update Character
      let { y, vy, isJumping } = state.character;
      vy += C.GRAVITY * deltaTime;
      y += vy * deltaTime;

      if (y <= C.GROUND_HEIGHT) {
        y = C.GROUND_HEIGHT;
        vy = 0;
        isJumping = false;
      }

      // Update timers and score
      const newScore = state.score + deltaTime * state.gameSpeed * 2;
      const newGameSpeed = state.gameSpeed + C.GAME_SPEED_INCREMENT * deltaTime;
      const newShieldTimer = Math.max(0, state.shieldTimer - deltaTime);

      // Update Obstacles
      const updatedObstacles = state.obstacles
        .map(o => ({ ...o, x: o.x - newGameSpeed * deltaTime * C.WORLD_UNIT_TO_PIXEL }))
        .filter(o => o.x > -o.width);

      // Collision Detection
      const charRect = { x: C.CHARACTER_X_POSITION, y: C.GAME_HEIGHT - y - state.character.height, width: state.character.width, height: state.character.height };
      let gameOver = false;
      let newObstacles = [...updatedObstacles];

      for (const obstacle of updatedObstacles) {
        const obsRect = { x: obstacle.x, y: C.GAME_HEIGHT - obstacle.y - obstacle.height, width: obstacle.width, height: obstacle.height };
        if (
          charRect.x < obsRect.x + obsRect.width &&
          charRect.x + charRect.width > obsRect.x &&
          charRect.y < obsRect.y + obsRect.height &&
          charRect.y + charRect.height > obsRect.y
        ) {
          if (obstacle.type === 'hurdle') {
            if (newShieldTimer > 0) {
              soundManager.playPowerup();
              newObstacles = newObstacles.filter(o => o.id !== obstacle.id);
            } else {
              soundManager.playCrash();
              gameOver = true;
              break;
            }
          } else if (obstacle.type === 'powerup') {
            soundManager.playPowerup();
            newObstacles = newObstacles.filter(o => o.id !== obstacle.id);
            return {
              ...state,
              shieldTimer: C.POWERUP_SHIELD_DURATION,
              obstacles: newObstacles,
            };
          }
        }
      }

      if (gameOver) {
        return { ...state, gameState: 'gameOver' };
      }

      // Spawn new obstacles
      let { nextHurdleIn, nextPowerUpIn } = state;
      nextHurdleIn -= deltaTime * newGameSpeed / 50;
      if (nextHurdleIn <= 0) {
        const isHigh = Math.random() > 0.6;
        const newHurdle: Obstacle = {
          id: obstacleIdCounter++,
          x: C.GAME_WIDTH,
          y: C.GROUND_HEIGHT,
          width: C.HURDLE_WIDTH,
          height: isHigh ? C.HURDLE_HEIGHT_HIGH : C.HURDLE_HEIGHT_LOW,
          type: 'hurdle',
        };
        newObstacles.push(newHurdle);
        nextHurdleIn = Math.random() * (C.HURDLE_SPAWN_INTERVAL.MAX - C.HURDLE_SPAWN_INTERVAL.MIN) + C.HURDLE_SPAWN_INTERVAL.MIN;
      }

      nextPowerUpIn -= deltaTime;
      if (nextPowerUpIn <= 0) {
        const newPowerUp: Obstacle = {
            id: obstacleIdCounter++,
            x: C.GAME_WIDTH,
            y: C.GROUND_HEIGHT + (Math.random() > 0.5 ? 100 : 20),
            width: C.POWERUP_WIDTH,
            height: C.POWERUP_HEIGHT,
            type: 'powerup',
            powerUpType: 'shield',
        };
        newObstacles.push(newPowerUp);
        nextPowerUpIn = Math.random() * (C.POWERUP_SPAWN_INTERVAL.MAX - C.POWERUP_SPAWN_INTERVAL.MIN) + C.POWERUP_SPAWN_INTERVAL.MIN;
      }
      
      const newTheme = Math.floor(newScore / 1000);

      return {
        ...state,
        score: newScore,
        gameSpeed: newGameSpeed,
        character: { ...state.character, y, vy, isJumping },
        obstacles: newObstacles,
        shieldTimer: newShieldTimer,
        nextHurdleIn,
        nextPowerUpIn,
        theme: newTheme
      };
    default:
      return state;
  }
}


export default function Home() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [characterSkin, setCharacterSkin] = useState<number | string>(0);
  const [highScore, setHighScore] = useState(0);
  const isMobile = useIsMobile();
  const lastTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setHighScore(Number(localStorage.getItem('hurdleHeroHighScore') || 0));
  }, []);

  const handleStartGame = useCallback((skin: number | string) => {
    soundManager.startAudio();
    soundManager.playBGM();
    setCharacterSkin(skin);
    dispatch({ type: 'START_GAME' });
  }, []);

  const handleRestart = useCallback(() => {
    dispatch({ type: 'RESTART' });
    if(state.gameState === 'gameOver') soundManager.playBGM();
  }, [state.gameState]);
  
  const handleJump = useCallback(() => {
      if(state.gameState === 'playing') dispatch({type: 'JUMP'})
  }, [state.gameState]);

  const handleCrouch = useCallback((isDown: boolean) => {
      if(state.gameState === 'playing') {
          dispatch({type: isDown ? 'CROUCH_START' : 'CROUCH_END'})
      }
  }, [state.gameState]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'Space') {
        e.preventDefault();
        handleJump();
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        handleCrouch(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        handleCrouch(false);
      }
    }
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    }
  }, [handleJump, handleCrouch]);

  const gameLoop = useCallback((time: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = time;
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const deltaTime = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;
    
    dispatch({ type: 'GAME_TICK', deltaTime });
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    if (state.gameState === 'playing') {
      lastTimeRef.current = null;
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.gameState, gameLoop]);

  useEffect(() => {
    if (state.gameState === 'gameOver') {
      soundManager.stopBGM();
      const newHighScore = Math.max(state.score, highScore);
      if (newHighScore > highScore) {
        setHighScore(newHighScore);
        localStorage.setItem('hurdleHeroHighScore', String(newHighScore));
      }
    }
  }, [state.gameState, state.score, highScore]);
  
  const gameWorldStyle: React.CSSProperties = {
    width: `${C.GAME_WIDTH}px`,
    height: `${C.GAME_HEIGHT}px`,
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background overflow-hidden">
      <div 
        style={gameWorldStyle}
        className="relative overflow-hidden border-4 border-primary rounded-lg shadow-2xl bg-background"
      >
        {state.gameState === 'start' && (
          <StartScreen onStart={handleStartGame} highScore={highScore} />
        )}
        
        {state.gameState === 'gameOver' && (
          <GameOverScreen score={Math.floor(state.score)} highScore={highScore} onRestart={handleRestart} />
        )}

        {(state.gameState === 'playing' || state.gameState === 'gameOver') && (
          <>
            <ParallaxBackground gameSpeed={state.gameSpeed} theme={state.theme} />
            
            <div
              className="absolute bottom-0 left-0 w-full bg-primary/30"
              style={{ height: `${C.GROUND_HEIGHT}px`, zIndex: 1 }}
            />

            <Character character={state.character} skin={characterSkin} shieldTimer={state.shieldTimer} />
            
            {state.obstacles.map(obstacle => 
              obstacle.type === 'hurdle' ? (
                <Hurdle key={obstacle.id} hurdle={obstacle} />
              ) : (
                <PowerUp key={obstacle.id} powerup={obstacle} />
              )
            )}

            <div className="absolute top-4 left-4 text-2xl font-bold text-primary-foreground bg-primary/80 px-4 py-1 rounded-lg shadow-md z-30">
              SCORE: {Math.floor(state.score)}
            </div>
             <div className="absolute top-4 right-4 text-lg font-bold text-primary-foreground bg-primary/80 px-3 py-1 rounded-lg shadow-md z-30">
              HI: {Math.floor(highScore)}
            </div>
          </>
        )}
      </div>
      {isMobile && state.gameState === 'playing' && (
        <OnScreenControls onJump={handleJump} onCrouch={handleCrouch} />
      )}
      <p className="mt-4 text-muted-foreground text-center text-sm">
        Use [↑] or [Space] to Jump, [↓] to Crouch.
      </p>
    </main>
  );
}
