"use client";

import React, { useState, useRef, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Play, ArrowLeft, ArrowRight, WandSparkles, Loader2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { generateHero } from '@/ai/flows/generate-hero-flow';
import { useToast } from '@/hooks/use-toast';

interface StartScreenProps {
  onStart: (skin: string) => void;
  highScore: number;
}

const characterSkins = [
    { name: 'Hero', url: 'https://picsum.photos/80/120?random=1', hint: 'superhero side profile' },
    { name: 'Goku', url: 'https://picsum.photos/80/120?random=2', hint: 'goku anime sprite' },
    { name: 'Naruto', url: 'https://picsum.photos/80/120?random=3', hint: 'naruto anime sprite' },
];

const StartScreen: React.FC<StartScreenProps> = ({ onStart, highScore }) => {
  const [selectedSkinIndex, setSelectedSkinIndex] = useState(0);
  const [customSkin, setCustomSkin] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const currentSkinUrl = customSkin || characterSkins[selectedSkinIndex].url;

  const nextSkin = () => {
    setCustomSkin(null);
    setSelectedSkinIndex((prev) => (prev + 1) % characterSkins.length);
  };

  const prevSkin = () => {
    setCustomSkin(null);
    setSelectedSkinIndex((prev) => (prev - 1 + characterSkins.length) % characterSkins.length);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCustomSkin(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleGenerateHero = () => {
    if (!aiPrompt) {
        toast({ title: 'Prompt is empty', description: 'Please describe the hero you want to create.', variant: 'destructive' });
        return;
    }
    startTransition(async () => {
        try {
            const result = await generateHero({ prompt: aiPrompt });
            if (result.imageDataUri) {
                setCustomSkin(result.imageDataUri);
                toast({ title: 'Hero Generated!', description: 'Your custom hero is ready to run.' });
            }
        } catch (error) {
            console.error(error);
            toast({ title: 'Generation Failed', description: 'Could not create hero. Please try again.', variant: 'destructive' });
        }
    });
  };

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-[450px] text-center animate-in fade-in zoom-in-90">
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
                    <div className="w-20 h-28 rounded-lg flex items-center justify-center bg-muted overflow-hidden relative">
                       {isGenerating ? (
                           <Loader2 className="animate-spin text-primary" size={40}/>
                       ) : (
                        <Image 
                            src={currentSkinUrl}
                            alt={customSkin ? 'Custom Skin' : characterSkins[selectedSkinIndex].name}
                            width={80} 
                            height={112} 
                            className="object-contain w-full h-full"
                            data-ai-hint={!customSkin ? characterSkins[selectedSkinIndex].hint : undefined}
                            unoptimized
                        />
                       )}
                    </div>
                     <Button variant="ghost" size="icon" onClick={nextSkin} aria-label="Next character skin">
                        <ArrowRight />
                    </Button>
                </div>
                <Button onClick={handleUploadClick} variant="outline" size="sm" className="mt-4">
                    <Upload className="mr-2" size={16} />
                    Upload
                </Button>
                <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
            </div>
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Or create a hero with AI</p>
                <Textarea 
                    placeholder="e.g., a knight in shining armor, a futuristic ninja..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="w-full"
                />
                <Button onClick={handleGenerateHero} disabled={isGenerating} className="w-full">
                    {isGenerating ? <Loader2 className="mr-2 animate-spin" /> : <WandSparkles className="mr-2" />}
                    Generate Hero
                </Button>
            </div>
          <div className="flex items-center justify-center gap-2">
            <Award className="text-accent" />
            <p className="text-muted-foreground">High Score: {highScore}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => onStart(currentSkinUrl)} size="lg" className="w-full" disabled={isGenerating}>
            <Play className="mr-2 h-4 w-4" />
            Start Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StartScreen;
