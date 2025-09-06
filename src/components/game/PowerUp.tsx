"use client";

import React from 'react';
import { Shield } from 'lucide-react';

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  powerUpType?: 'shield';
}

interface PowerUpProps {
  powerup: Obstacle;
}

const PowerUp: React.FC<PowerUpProps> = ({ powerup }) => {
  const { x, y, width, height, powerUpType } = powerup;

  const style: React.CSSProperties = {
    left: `${x}px`,
    bottom: `${y}px`,
    width: `${width}px`,
    height: `${height}px`,
  };

  return (
    <div 
        style={style} 
        className="absolute z-10 flex items-center justify-center rounded-full bg-accent text-accent-foreground animate-pulse shadow-lg"
    >
      {powerUpType === 'shield' && <Shield size={20} />}
    </div>
  );
};

export default PowerUp;
