import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MidjourneyPromptProps {
  prompt: string;
  imageUrl: string;
  midjourneyUrl?: string;
}

const MidjourneyPrompt: React.FC<MidjourneyPromptProps> = ({
  prompt,
  imageUrl,
  midjourneyUrl,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Fallback to remove skeleton after 2 seconds even if onLoad doesn't fire
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Parse the prompt for parameters
  const parsePromptParams = (prompt: string) => {
    const params: Record<string, string> = {};
    
    // Extract parameters like --chaos, --stylize, etc
    const paramRegex = /--(\w+)\s+([^\s-]+)/g;
    let match;
    while ((match = paramRegex.exec(prompt)) !== null) {
      params[match[1]] = match[2];
    }
    
    // Get the main prompt (everything before the first --)
    const mainPrompt = prompt.split('--')[0].trim();
    
    return { mainPrompt, params };
  };

  const { mainPrompt, params } = parsePromptParams(prompt);

  // Play a subtle click sound on hover
  const playHoverSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGN0fPTgjMGHm7A7+OZURE');
    audio.volume = 0.1;
    audio.play().catch(() => {}); // Ignore errors if audio can't play
  };

  const handleMouseEnter = () => {
    if (isPinned) return; // Don't change hover state if pinned
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
    if (!isPinned) playHoverSound();
  };

  const handleMouseLeave = () => {
    if (isPinned) return; // Don't hide if pinned
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300); // 300ms delay before hiding
  };

  const handleClick = () => {
    setIsPinned(!isPinned);
    if (!isPinned) {
      // When pinning, ensure it's visible
      setIsHovered(true);
      playHoverSound();
    }
  };

  return (
    <div className="my-12">
      <div 
        className="relative inline-block"
        style={{ maxWidth: '750px', cursor: isPinned ? 'pointer' : 'default' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* Main Container with Image */}
        <div className="relative">
          {/* Image */}
          <div className="relative overflow-hidden rounded-sm border border-gray-300 dark:border-gray-700" style={{ lineHeight: 0, fontSize: 0 }}>
            {/* Top Bevel */}
            <div className="absolute top-0 left-0 right-0 px-2 py-1 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-300 dark:border-gray-700 z-10" style={{ lineHeight: 'normal', fontSize: 'inherit' }}>
              <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 dark:text-gray-500">
                <span className="font-bold uppercase tracking-wider">Midjourney</span>
                <span className="text-[8px]">AI-GENERATED</span>
              </div>
            </div>
            
            {/* Loading Skeleton - Show only while loading */}
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 min-h-[400px]" />
            )}
            
            <img
              src={imageUrl}
              alt="AI Generated Image"
              className="w-full h-auto"
              style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)} // Hide skeleton even on error
            />
            
            {/* Bottom Bevel with URL Info */}
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-300 dark:border-gray-700" style={{ lineHeight: 'normal', fontSize: 'inherit' }}>
              <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 dark:text-gray-500">
                <div className="flex items-center gap-1 truncate mr-2">
                  <span className="font-bold">ref:</span>
                  <span className="truncate">url('{midjourneyUrl || imageUrl}')</span>
                </div>
                
                <div className="flex-shrink-0">
                  '{midjourneyUrl?.split('/').pop() || 'local'}'
                </div>
              </div>
            </div>
          </div>

          {/* Spec Sheet Card - Appears on Hover or Click */}
          <AnimatePresence>
            {(isHovered || isPinned) && (
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut', type: 'spring', stiffness: 300 }}
                className="absolute top-0 left-[calc(100%+1.5rem)] z-20"
                style={{ 
                  width: '380px',
                  pointerEvents: 'auto'
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Spec Sheet */}
                <div 
                  className="bg-white dark:bg-gray-900 border border-gray-400 dark:border-gray-600 shadow-xl"
                  style={{
                    fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', monospace",
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,250,250,0.95) 100%)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {/* Simplified Header */}
                  <div className="px-4 py-2 border-b border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold tracking-wider text-gray-600 dark:text-gray-400">
                          MIDJOURNEY SPEC
                        </span>
                        {isPinned && (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-500">
                        ID: {midjourneyUrl?.split('/').pop()?.slice(0, 8) || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Main Prompt Section */}
                  <div className="px-4 py-3 border-b border-gray-300 dark:border-gray-700">
                    <div className="text-[9px] font-bold text-gray-500 dark:text-gray-500 mb-1 tracking-wider">
                      PROMPT_MAIN
                    </div>
                    <div className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
                      {mainPrompt}
                    </div>
                  </div>

                  {/* Parameters Grid */}
                  <div className="px-4 py-3 border-b border-gray-300 dark:border-gray-700">
                    <div className="text-[9px] font-bold text-gray-500 dark:text-gray-500 mb-2 tracking-wider">
                      PARAMETERS
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {Object.entries(params).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-[10px] text-gray-500 dark:text-gray-500 uppercase">
                            {key}:
                          </span>
                          <span className="text-[10px] text-gray-700 dark:text-gray-300 font-medium">
                            {value}
                          </span>
                        </div>
                      ))}
                      {Object.keys(params).length === 0 && (
                        <span className="text-[10px] text-gray-400 dark:text-gray-600 col-span-2">
                          DEFAULT_CONFIG
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-300 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => navigator.clipboard.writeText(prompt)}
                        className="text-[9px] font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200 uppercase tracking-wider"
                      >
                        [COPY_PROMPT]
                      </button>
                      
                      {midjourneyUrl && (
                        <a
                          href={midjourneyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[9px] font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200 uppercase tracking-wider"
                        >
                          [VIEW_SOURCE]
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Corner notches for military spec aesthetic */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-gray-600 dark:border-gray-400"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-gray-600 dark:border-gray-400"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-gray-600 dark:border-gray-400"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-gray-600 dark:border-gray-400"></div>
                </div>

                {/* Connection line from image to card */}
                <svg 
                  className="absolute top-8 right-full w-4 h-px"
                  style={{ marginRight: '-1px' }}
                >
                  <line 
                    x1="0" 
                    y1="0" 
                    x2="16" 
                    y2="0" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    strokeDasharray="2,2"
                    className="text-gray-400 dark:text-gray-600"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MidjourneyPrompt;