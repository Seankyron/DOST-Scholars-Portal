'use client';

import { FullPageLoader } from '@/components/shared/FullPageLoader';

export default function Loading() {
  // Since loading.tsx is only mounted when Next.js is loading, 
  // we can hardcode isLoading={true}.
  return <FullPageLoader isLoading={true} message="Loading Portal..." />;
}