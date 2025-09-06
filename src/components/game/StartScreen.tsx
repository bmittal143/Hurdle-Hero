"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Play, ArrowLeft, ArrowRight, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

interface StartScreenProps {
  onStart: (skin: number | string) => void;
  highScore: number;
}

const characterSkins = [
    'bg-primary',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
];

const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  const [selectedSkin, setSelectedSkin] = useState<number | string>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSkinSelect = (skin: number | string) => {
    setSelectedSkin(skin);
  };

  const nextSkin = () => {
    if (typeof selectedSkin === 'number') {
      handleSkinSelect((selectedSkin + 1) % characterSkins.length);
    } else {
        handleSkinSelect(0);
    }
  };

  const prevSkin = () => {
    if (typeof selectedSkin === 'number') {
        handleSkinSelect((selectedSkin - 1 + characterSkins.length) % characterSkins.length);
    } else {
        handleSkinSelect(characterSkins.length - 1);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          handleSkinSelect(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
                    <div className="w-16 h-20 rounded-lg flex items-center justify-center bg-muted overflow-hidden">
                        {typeof selectedSkin === 'string' ? (
                            <Image src={selectedSkin} alt="Custom skin" width={64} height={80} className="object-cover w-full h-full" />
                        ) : (
                            <div className={cn("w-10 h-16 rounded-md transition-colors", characterSkins[selectedSkin])} />
                        )}
                    </div>
                     <Button variant="ghost" size="icon" onClick={nextSkin} aria-label="Next character skin">
                        <ArrowRight />
                    </Button>
                </div>
                <Button onClick={handleUploadClick} variant="outline" className="mt-4">
                    <Upload className="mr-2" />
                    Upload Your Hero
                </Button>
                <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
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
