"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface OnScreenControlsProps {
  onJump: () => void;
  onCrouch: (isCrouching: boolean) => void;
}

const OnScreenControls: React.FC<OnScreenControlsProps> = ({ onJump, onCrouch }) => {
  const handleCrouchStart = () => onCrouch(true);
  const handleCrouchEnd = () => onCrouch(false);

  return (
    <div className="fixed bottom-5 left-0 right-0 flex justify-around items-center z-50 px-4">
      <Button
        onClick={onJump}
        className="w-24 h-24 rounded-full bg-primary/80 text-primary-foreground text-lg backdrop-blur-sm"
        aria-label="Jump"
      >
        <ArrowUp size={48} />
      </Button>
      <Button
        onTouchStart={handleCrouchStart}
        onTouchEnd={handleCrouchEnd}
        onMouseDown={handleCrouchStart}
        onMouseUp={handleCrouchEnd}
        onMouseLeave={handleCrouchEnd}
        className="w-24 h-24 rounded-full bg-primary/80 text-primary-foreground text-lg backdrop-blur-sm"
        aria-label="Crouch"
      >
        <ArrowDown size={48} />
      </Button>
    </div>
  );
};

export default OnScreenControls;
