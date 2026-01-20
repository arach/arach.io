"use client";

import { useState } from 'react';

interface CopyButtonProps {
  targetId: string;
  className?: string;
}

export default function CopyButton({ targetId, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const target = document.getElementById(targetId);
    if (target) {
      try {
        // Get clean plain text, normalize whitespace
        const text = target.innerText
          .replace(/\n{3,}/g, '\n\n')  // Collapse multiple newlines
          .trim();

        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <button
      className={className}
      onClick={handleCopy}
      title="Copy to clipboard"
      type="button"
    >
      {copied ? '✓' : 'copy'}
    </button>
  );
}
