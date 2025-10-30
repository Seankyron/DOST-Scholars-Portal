'use client';

import { useState, useCallback } from 'react';
import { copyToClipboard } from '@/lib/utils/clipboard';

export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    const success = await copyToClipboard(text);
    setIsCopied(success);

    if (success) {
      setTimeout(() => setIsCopied(false), 2000);
    }

    return success;
  }, []);

  return { isCopied, copy };
}
