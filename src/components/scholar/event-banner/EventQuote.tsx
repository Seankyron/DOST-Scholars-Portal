'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { siteConfig } from '@/config/site'; // <-- 1. Import the config

// 2. Use the quotes from the config file
const quotes = siteConfig.inspirationalQuotes;

export function EventQuote() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 5000); // Changes every 5 seconds
    
    // 3. Clean up the timer
    return () => clearTimeout(timer);
  }, [index, quotes.length]); // 4. Add quotes.length to dependency array

  return (
    <div className="relative h-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex flex-col justify-center"
        >
          <p className="text-sm italic text-gray-700">
            "{quotes[index].quote}"
            <span className="ml-2 not-italic text-gray-500">
              - {quotes[index].author}
            </span>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}