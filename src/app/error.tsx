'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Runtime Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[85vh] w-full items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-white/20 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center sm:p-12">
            
            {/* Icon: Orange for Warning/Error */}
            <div className="mb-6 rounded-full bg-orange-50 p-6 ring-1 ring-orange-100">
              <AlertTriangle className="h-12 w-12 text-orange-600" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We encountered an unexpected error while processing your request.
            </p>
            
            {error.digest && (
              <div className="mt-4 rounded bg-gray-100 px-3 py-1 text-xs font-mono text-gray-500">
                ID: {error.digest}
              </div>
            )}

            <div className="mt-8 flex w-full flex-col gap-3">
              <Button 
                onClick={() => reset()} 
                variant="primary" 
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/'} 
                variant="ghost" 
                className="w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Button>
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}