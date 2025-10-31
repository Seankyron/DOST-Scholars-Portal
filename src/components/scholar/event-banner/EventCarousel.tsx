'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { EventSlide } from './EventSlide';
import { CarouselControls } from './CarouselControls';
import { Card } from '@/components/ui/card';

const mockBanners = [
  {
    id: 1,
    imageUrl: '/images/banners/banner-1.jpg', // The "ONE DOST 4 U" image
    alt: 'ONE DOST 4 U Banner',
    // Add the link you want to redirect to
    link: 'https://www.facebook.com/DOST.RPC4A',
  },
  {
    id: 2,
    imageUrl: '/images/banners/banner-2.jpg',
    alt: 'Sample Banner 2',
    link: '#', // Add other links as needed
  },
  {
    id: 3,
    imageUrl: '/images/banners/banner-3.jpg',
    alt: 'Sample Banner 3',
    link: '#',
  },
];

export function EventCarousel() {
  const [index, setIndex] = useState(0);

  const paginate = (newDirection: number) => {
    setIndex((prev) => (prev + newDirection + mockBanners.length) % mockBanners.length);
  };

  return (
    <Card className="relative h-48 w-full overflow-hidden shadow-md">
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