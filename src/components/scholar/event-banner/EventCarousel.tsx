'use client';

import { useState, useEffect } from 'react'; 
import { AnimatePresence } from 'framer-motion';
import { EventSlide } from './EventSlide';
import { CarouselControls } from './CarouselControls';
import { Card } from '@/components/ui/card';

const mockBanners = [
  {
    id: 1,
    imageUrl: '/images/banners/banner-1.jpg', // The "ONE DOST 4 U" image
    alt: 'ONE DOST 4 U Banner',
    link: 'https://www.facebook.com/DOST.RPC4A',
  },
  {
    id: 2,
    imageUrl: '/images/banners/banner-2.jpg',
    alt: 'Sample Banner 2',
    link: 'https://www.facebook.com/share/p/1CA5KFQppF/', 
  },
  {
    id: 3,
    imageUrl: '/images/banners/banner-3.jpg',
    alt: 'Sample Banner 3',
    link: 'https://www.facebook.com/share/p/17fXNFZNc3/',
  },
];

const SLIDE_INTERVAL_MS = 4000;

export function EventCarousel() {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false); 

  const paginate = (newDirection: number) => {
    setIndex((prev) => (prev + newDirection + mockBanners.length) % mockBanners.length);
  };

  useEffect(() => {
    if (isHovering) {
      return;
    }

    const timer = setTimeout(() => {
      paginate(1); // Go to the next slide
    }, SLIDE_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [index, isHovering]);

  return (
    <Card 
      className="relative h-64 w-full overflow-hidden shadow-md rounded-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      >
      <AnimatePresence initial={false}>
        <EventSlide
          key={index}
          banner={mockBanners[index]}
        />
      </AnimatePresence>
      <CarouselControls paginate={paginate} />
    </Card>
  );
}