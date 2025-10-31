'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarouselControlsProps {
  paginate: (newDirection: number) => void;
}

export function CarouselControls({ paginate }: CarouselControlsProps) {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-1 h-8 w-8 text-white bg-black/30 hover:bg-black/50"
        onClick={() => paginate(-1)}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 h-8 w-8 text-white bg-black/30 hover:bg-black/50"
        onClick={() => paginate(1)}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </>
  );
}