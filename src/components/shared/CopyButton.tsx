'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils/clipboard';

interface CopyButtonProps {
  text: string;
  label?: string;
  variant?: 'default' | 'icon';
  className?: string;
}

export function CopyButton({ text, label, variant = 'default', className }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleCopy}
        className={`p-2 hover:bg-gray-100 rounded transition-colors ${className}`}
        title="Copy to clipboard"
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4 text-gray-600" />
        )}
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={className}
    >
      {isCopied ? (
        <>
          <Check className="h-4 w-4" />
          {label || 'Copied!'}
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {label || 'Copy'}
        </>
      )}
    </Button>
  );
}