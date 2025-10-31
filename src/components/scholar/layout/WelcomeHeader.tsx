'use client';

import { EventQuote } from '../event-banner/EventQuote';

// Mock data
const scholarName = 'Joshua';

export function WelcomeHeader() {
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