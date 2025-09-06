"use client";

import React, { useRef } from 'react';

interface OnScreenControlsProps {
  onJump: () => void;
  onCrouch: (isCrouching: boolean) => void;
}

const OnScreenControls: React.FC<OnScreenControlsProps> = ({ onJump, onCrouch }) => {
  const touchStartY = useRef(0);
  const touchCrouchActive = useRef(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - touchStartY.current;

    if (deltaY < -30) { // Swipe Up
      onJump();
      touchStartY.current = touchY; // Reset start position to prevent multiple jumps
    } else if (deltaY > 30) { // Swipe Down
      if (!touchCrouchActive.current) {
        onCrouch(true);
        touchCrouchActive.current = true;
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchCrouchActive.current) {
      onCrouch(false);
      touchCrouchActive.current = false;
    }
    touchStartY.current = 0;
  };

  return (
    <div
      className="fixed inset-0 z-40"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Game controls"
    />
  );
};

export default OnScreenControls;
