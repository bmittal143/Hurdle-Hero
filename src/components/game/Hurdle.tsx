"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface HurdleProps {
  hurdle: Obstacle;
}

const Hurdle: React.FC<HurdleProps> = ({ hurdle }) => {
  const { x, y, width, height } = hurdle;

  const style: React.CSSProperties = {
    left: `${x}px`,
    bottom: `${y}px`,
    width: `${width}px`,
    height: `${height}px`,
  };

  return (
    <div style={style} className={cn(
        "absolute rounded-t-sm bg-destructive z-10",
        height > 50 ? "bg-red-700" : "bg-red-500" // Example of varying style
    )} />
  );
};

export default Hurdle;
