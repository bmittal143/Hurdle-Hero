"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, RefreshCw } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, onRestart }) => {
  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-[350px] text-center animate-in fade-in zoom-in-90">
        <CardHeader>
          <CardTitle className="text-4xl font-headline">Game Over</CardTitle>
          <CardDescription>You tripped! Better luck next time.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-muted-foreground">Your Score</p>
            <p className="text-5xl font-bold text-primary">{score}</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Award className="text-accent" />
            <p className="text-muted-foreground">High Score: {highScore}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onRestart} size="lg">
            <RefreshCw className="mr-2 h-4 w-4" />
            Play Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GameOverScreen;
