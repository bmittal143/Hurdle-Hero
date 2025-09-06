"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ParallaxBackgroundProps {
  gameSpeed: number;
  theme: number;
}

const themes = [
    { bg: 'from-sky-300 to-sky-500', layer1: 'bg-green-500/30', layer2: 'bg-green-600/30' },
    { bg: 'from-indigo-400 to-indigo-800', layer1: 'bg-gray-700/30', layer2: 'bg-gray-800/30' },
    { bg: 'from-amber-300 to-red-500', layer1: 'bg-orange-700/30', layer2: 'bg-orange-800/30' },
    { bg: 'from-gray-700 to-gray-900', layer1: 'bg-purple-800/20', layer2: 'bg-purple-900/20' },
];

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ gameSpeed, theme }) => {
    const currentTheme = themes[theme % themes.length];

  const layerStyle = (speedMultiplier: number): React.CSSProperties => ({
    animationDuration: `${100 / (gameSpeed * speedMultiplier)}s`,
  });

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-gradient-to-b transition-colors duration-1000", currentTheme.bg)}>
      <div
        className="absolute inset-0 bg-repeat-x opacity-50"
        style={{
            ...layerStyle(0.2),
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animationName: 'scroll',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
        }}
      ></div>
      <div
        className={cn("absolute bottom-0 left-0 w-full h-1/2 opacity-20", currentTheme.layer1)}
        style={{...layerStyle(0.5), animationName: 'scroll', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
       />
      <div
        className={cn("absolute bottom-0 left-0 w-full h-1/3 opacity-30", currentTheme.layer2)}
        style={{...layerStyle(0.8), animationName: 'scroll', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
      />
      <style jsx>{`
        @keyframes scroll {
          from { background-position: 0 0; }
          to { background-position: -1000px 0; }
        }
      `}</style>
    </div>
  );
};

export default ParallaxBackground;
