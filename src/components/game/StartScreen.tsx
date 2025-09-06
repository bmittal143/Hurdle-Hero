"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Play, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StartScreenProps {
  onStart: (skin: number) => void;
  highScore: number;
}

const characterSkins = [
    'bg-primary',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
];

const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  const [selectedSkin, setSelectedSkin] = useState(0);

  const nextSkin = () => {
    setSelectedSkin((prev) => (prev + 1) % characterSkins.length);
  };

  const prevSkin = () => {
    setSelectedSkin((prev) => (prev - 1 + characterSkins.length) % characterSkins.length);
  };

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-[400px] text-center animate-in fade-in zoom-in-90">
        <CardHeader>
          <CardTitle className="text-5xl font-headline text-primary">Hurdle Hero</CardTitle>
          <CardDescription>An endless runner adventure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <p className="text-sm text-muted-foreground mb-2">Choose your Hero</p>
                <div className="flex items-center justify-center gap-4">
                    <Button variant="ghost" size="icon" onClick={prevSkin} aria-label="Previous character skin">
                        <ArrowLeft />
                    </Button>
                    <div className="w-16 h-20 rounded-lg flex items-center justify-center bg-muted">
                        <div className={cn("w-10 h-16 rounded-md transition-colors", characterSkins[selectedSkin])} />
                    </div>
                     <Button variant="ghost" size="icon" onClick={nextSkin} aria-label="Next character skin">
                        <ArrowRight />
                    </Button>
                </div>
            </div>
          <div className="flex items-center justify-center gap-2">
            <Award className="text-accent" />
            <p className="text-muted-foreground">High Score: {highScore}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => onStart(selectedSkin)} size="lg" className="w-full">
            <Play className="mr-2 h-4 w-4" />
            Start Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StartScreen;
