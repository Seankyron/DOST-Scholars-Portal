'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface GlobalLoaderProps {
  isLoading: boolean;
  message?: string; // Customizable text like "Authenticating...", "Saving...", etc.
}

export function GlobalLoader({ isLoading, message = "Loading..." }: GlobalLoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-auth-gradient"
        >
          {/* 1. Breathing Logo */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [1, 0.9, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative mb-8 h-32 w-32 md:h-40 md:w-40"
          >
            <Image
              src="/dost-logo.png" // Make sure this matches your file path
              alt="DOST Logo"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>

          {/* 2. Text & Loading Dots */}
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-md sm:text-3xl">
              DOST-SEI Scholars Portal
            </h2>
            
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-blue-50/90 tracking-wider">
                {message}
              </span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.2 }}
                className="text-sm text-blue-50"
              >
                .
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, delay: 0.2, repeat: Infinity, repeatDelay: 0.2 }}
                className="text-sm text-blue-50"
              >
                .
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, delay: 0.4, repeat: Infinity, repeatDelay: 0.2 }}
                className="text-sm text-blue-50"
              >
                .
              </motion.span>
            </div>
          </div>

          {/* 3. Bottom Watermark (Optional) */}
          <div className="absolute bottom-8 text-[10px] text-white/30">
            Science Education Institute
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}