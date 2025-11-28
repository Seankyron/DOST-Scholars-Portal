'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Add a small artificial delay so the user can actually see your beautiful splash screen
      // (Optional: remove setTimeout if you want instant redirection)
      const timer = setTimeout(() => {
        if (user) {
          router.push(user.role === 'admin' ? '/admin/dashboard' : '/scholar/dashboard');
        } else {
          router.push('/login');
        }
      }, 2000); // 2 seconds delay

      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-auth-gradient">
      
      {/* 1. Background Decorative Glow (Optional, adds depth) */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-[500px] w-[500px] rounded-full bg-white/10 blur-[100px]"
      />

      <div className="z-10 flex flex-col items-center text-center">
        
        {/* 2. Floating Logo Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-8"
        >
          {/* Inner Float Animation */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-32 w-32 drop-shadow-2xl md:h-40 md:w-40"
          >
            <Image
              src="/dost-logo.png"
              alt="DOST Logo"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
          
          {/* Subtle shadow ring below the logo to ground it */}
          <motion.div
            animate={{ scale: [1, 0.8, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-4 left-1/2 h-4 w-24 -translate-x-1/2 rounded-[100%] bg-black blur-md"
          />
        </motion.div>

        {/* 3. Typography */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md sm:text-4xl md:text-5xl">
            DOST-SEI Scholars Portal
          </h1>
          
          {/* 4. Minimalist Loader (Pulsing Text) */}
          <div className="flex items-center justify-center gap-1">
             <span className="text-sm font-medium text-blue-50/80">Initializing Portal</span>
             <motion.span 
               animate={{ opacity: [0, 1, 0] }} 
               transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.2 }}
               className="text-sm font-medium text-blue-50/80"
             >
               .
             </motion.span>
             <motion.span 
               animate={{ opacity: [0, 1, 0] }} 
               transition={{ duration: 1.5, delay: 0.2, repeat: Infinity, repeatDelay: 0.2 }}
               className="text-sm font-medium text-blue-50/80"
             >
               .
             </motion.span>
             <motion.span 
               animate={{ opacity: [0, 1, 0] }} 
               transition={{ duration: 1.5, delay: 0.4, repeat: Infinity, repeatDelay: 0.2 }}
               className="text-sm font-medium text-blue-50/80"
             >
               .
             </motion.span>
          </div>
        </motion.div>
      </div>

      {/* 5. Bottom Watermark */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-[10px] text-white/40"
      >
        © {new Date().getFullYear()} Science Education Institute
      </motion.div>

    </div>
  );
}