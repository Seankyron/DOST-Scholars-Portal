'use client';

import { ServerCrash, RefreshCw } from 'lucide-react';
import './globals.css'; // Ensure Tailwind styles are loaded

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      {/* We manually re-apply the auth-gradient here because 
         RootLayout (which usually holds it) has crashed.
      */}
      <body className="flex min-h-screen w-full items-center justify-center bg-auth-gradient p-4 font-sans antialiased">
        
        {/* Manual Card Styling to match the other pages */}
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col items-center p-8 text-center sm:p-12">
            
            {/* Icon: Red for Critical Failure */}
            <div className="mb-6 rounded-full bg-red-50 p-6 ring-1 ring-red-100">
              <ServerCrash className="h-12 w-12 text-red-600" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Critical System Error
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              The application has encountered a critical failure and cannot render the layout.
            </p>
            
            {error.digest && (
              <div className="mt-4 rounded bg-gray-100 px-3 py-1 text-xs font-mono text-gray-500">
                System Code: {error.digest}
              </div>
            )}

            <div className="mt-8 w-full">
              <button
                onClick={() => reset()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600/20"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Application
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50/50 px-8 py-4 text-center border-t border-gray-100">
             <p className="text-xs text-gray-400">DOST-SEI Scholars Portal</p>
          </div>
        </div>

      </body>
    </html>
  );
}