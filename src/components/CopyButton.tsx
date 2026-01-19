"use client";

import { useState } from 'react';
import { Clipboard, ClipboardCheck } from 'lucide-react';

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
        await navigator.clipboard.writeText(target.innerText);
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
      {copied ? <ClipboardCheck size={16} strokeWidth={1.5} /> : <Clipboard size={16} strokeWidth={1.5} />}
    </button>
  );
}
