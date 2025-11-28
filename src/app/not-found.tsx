'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-[85vh] w-full items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card className="border-white/20 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center sm:p-12">
            
            {/* Icon: Blue for Information/Neutral */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 rounded-full bg-blue-50 p-6 ring-1 ring-blue-100"
            >
              <FileQuestion className="h-12 w-12 text-dost-blue" />
            </motion.div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              404
            </h1>
            <h2 className="mt-2 text-xl font-semibold text-dost-title">
              Page Not Found
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <Button 
                onClick={() => router.back()} 
                variant="outline" 
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              
              <Button asChild variant="primary" className="w-full sm:w-auto">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Return Home
                </Link>
              </Button>
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}