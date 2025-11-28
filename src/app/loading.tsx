'use client';

import { GlobalLoader } from '@/components/shared/GlobalLoader';

export default function Loading() {
  // Always true because this component only mounts when Next.js is loading
  return <GlobalLoader isLoading={true} message="Please wait..." />;
}