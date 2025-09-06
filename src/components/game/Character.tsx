"use client";

import React from 'react';
import Image from 'next/image';
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
  skin: string;
  shieldTimer: number;
}

const Character: React.FC<CharacterProps> = ({ character, skin, shieldTimer }) => {
  const { y, isCrouching, width, height } = character;
  
  const characterStyle: React.CSSProperties = {
    bottom: `${y}px`,
    left: `${C.CHARACTER_X_POSITION}px`,
    width: `${width}px`,
    height: `${height}px`,
    transition: 'height 0.1s ease-out',
  };

  return (
    <div style={characterStyle} className="absolute z-10 flex items-center justify-center">
      {shieldTimer > 0 && (
        <div className="absolute -inset-2 rounded-full bg-accent/50 animate-pulse" />
      )}
      <Image
        src={skin}
        alt="Character"
        width={width}
        height={height}
        className={cn(
          "w-full h-full object-contain shadow-lg transform duration-100",
          isCrouching ? 'scale-y-90' : '',
        )}
        unoptimized
      />
    </div>
  );
};

export default Character;
