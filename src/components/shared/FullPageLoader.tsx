'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface FullPageLoaderProps {
  isLoading: boolean;
  message?: string; // Optional text like "Creating Account..." or "Authenticating..."
}

export function FullPageLoader({ isLoading, message = "Loading..." }: FullPageLoaderProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-auth-gradient"
        >
          <div className="flex flex-col items-center">
            {/* Breathing Logo Animation */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative mb-6 h-28 w-28"
            >
              {/* Ensure this image exists in your public folder */}
              <Image
                src="/dost-logo.png"
                alt="DOST Logo"
                fill
                className="object-contain drop-shadow-xl"
                priority
              />
            </motion.div>

            {/* Pulsing Text */}
            <p className="text-white font-medium animate-pulse tracking-wide text-lg">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}