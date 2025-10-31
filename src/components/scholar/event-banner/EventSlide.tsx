'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface EventSlideProps {
  banner: {
    id: number;
    imageUrl: string;
    alt: string;
    link: string;
  };
}

export function EventSlide({ banner }: EventSlideProps) {
  return (
    <motion.div
      className="absolute h-full w-full"
      key={banner.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* This Link component makes the banner clickable */}
      <Link href={banner.link} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
        <Image
          src={banner.imageUrl}
          alt={banner.alt}
          layout="fill"
          objectFit="cover"
          className="cursor-pointer"
          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x192?text=Event+Banner')}
        />
      </Link>
    </motion.div>
  );
}