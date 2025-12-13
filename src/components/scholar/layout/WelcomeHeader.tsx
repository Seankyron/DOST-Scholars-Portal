'use client';

import { EventQuote } from '../event-banner/EventQuote';
import { useFetchScholar } from "@/hooks/scholars/Get/useFetchScholar";

export function WelcomeHeader() {
  const { user } = useFetchScholar();
  
  // Use first name if available, otherwise default to "Scholar"
  const scholarName = user?.first_name || 'Scholar';

  return (
    <div className="mb-6 text-center">
      {/* Use the consistent title color */}
      <h1 className="text-3xl font-bold text-dost-title">
        Welcome back, {scholarName}!
      </h1>
      <div className="mt-1">
        <EventQuote />
      </div>
    </div>
  );
}