"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import * as C from '@/lib/game-constants';

interface CharacterProps {
  character: {
    y: number;
    isJumping: boolean;
    isCrouching: boolean;
    width: number;
    height: number;
  };
  skin: number;
  shieldTimer: number;
}

const characterSkins = [
    'bg-primary', // Default Orange
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
];

const Character: React.FC<CharacterProps> = ({ character, skin, shieldTimer }) => {
  const { y, isCrouching, width, height } = character;
  
  const characterStyle: React.CSSProperties = {
    bottom: `${y}px`,
    left: `${C.CHARACTER_X_POSITION}px`,
    width: `${width}px`,
    height: `${height}px`,
    transition: 'height 0.1s ease-out',
  };

  const skinClass = characterSkins[skin] || characterSkins[0];

  return (
    <div style={characterStyle} className="absolute z-10">
      {shieldTimer > 0 && (
        <div className="absolute -inset-2 rounded-full bg-accent/50 animate-pulse" />
      )}
      <div
        className={cn(
          "w-full h-full rounded-md shadow-lg transform duration-100",
          skinClass,
          isCrouching ? 'scale-y-90' : '',
        )}
      />
    </div>
  );
};

export default Character;
