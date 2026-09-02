import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImaginePromptProps {
  prompt: string;
  imageUrl: string;
  aspectRatio?: string;
  tool?: string;
}

const ImaginePrompt: React.FC<ImaginePromptProps> = ({
  prompt,
  imageUrl,
  aspectRatio = "16:9",
  tool = "image_gen",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const params: Record<string, string> = {
    tool,
    aspect_ratio: aspectRatio,
  };

  const playHoverSound = () => {
    const audio = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGN0fPTgjMGHm7A7+OZURE"
    );
    audio.volume = 0.1;
    audio.play().catch(() => {});
  };

  const handleMouseEnter = () => {
    if (isPinned) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
    if (!isPinned) playHoverSound();
  };

  const handleMouseLeave = () => {
    if (isPinned) return;
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300);
  };

  const handleClick = () => {
    setIsPinned(!isPinned);
    if (!isPinned) {
      setIsHovered(true);
      playHoverSound();
    }
  };

  return (
    <div className="my-12">
      <div
        className="relative inline-block"
        style={{ maxWidth: "750px", cursor: isPinned ? "pointer" : "default" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="relative">
          <div
            className="relative overflow-hidden rounded-sm border border-gray-300 dark:border-gray-700"
            style={{ lineHeight: 0, fontSize: 0 }}
          >
            <div
              className="absolute top-0 left-0 right-0 px-2 py-1 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-300 dark:border-gray-700 z-10"
              style={{ lineHeight: "normal", fontSize: "inherit" }}
            >
              <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 dark:text-gray-500">
                <span className="font-bold uppercase tracking-wider">
                  Imagine
                </span>
                <span className="text-[8px]">AI-GENERATED</span>
              </div>
            </div>

            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 min-h-[400px]" />
            )}

            <img
              src={imageUrl}
              alt="AI Generated Image"
              className="w-full h-auto"
              style={{ display: "block", maxWidth: "100%", height: "auto" }}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />

            <div
              className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-300 dark:border-gray-700"
              style={{ lineHeight: "normal", fontSize: "inherit" }}
            >
              <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 dark:text-gray-500">
                <div className="flex items-center gap-1 truncate mr-2">
                  <span className="font-bold">ref:</span>
                  <span className="truncate">
                    {tool}('{aspectRatio}')
                  </span>
                </div>
                <div className="flex-shrink-0">'{aspectRatio}'</div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {(isHovered || isPinned) && (
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 300,
                }}
                className="absolute top-0 left-[calc(100%+1.5rem)] z-20 max-md:left-0 max-md:top-[calc(100%+0.75rem)] max-md:w-full"
                style={{
                  width: "380px",
                  pointerEvents: "auto",
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="bg-white dark:bg-gray-900 border border-gray-400 dark:border-gray-600 shadow-xl"
                  style={{
                    fontFamily:
                      "'SF Mono', 'Monaco', 'Inconsolata', monospace",
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,250,250,0.95) 100%)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div className="px-4 py-2 border-b border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold tracking-wider text-gray-600 dark:text-gray-400">
                          IMAGINE SPEC
                        </span>
                        {isPinned && (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-500">
                        {tool}
                      </span>
                    </div>
                  </div>

                  <div className="px-4 py-3 border-b border-gray-300 dark:border-gray-700">
                    <div className="text-[9px] font-bold text-gray-500 dark:text-gray-500 mb-1 tracking-wider">
                      PROMPT_MAIN
                    </div>
                    <div className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
                      {prompt}
                    </div>
                  </div>

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
                    </div>
                  </div>

                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-300 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(prompt);
                        }}
                        className="text-[9px] font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200 uppercase tracking-wider"
                      >
                        [COPY_PROMPT]
                      </button>
                    </div>
                  </div>

                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-gray-600 dark:border-gray-400"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-gray-600 dark:border-gray-400"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-gray-600 dark:border-gray-400"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-gray-600 dark:border-gray-400"></div>
                </div>

                <svg
                  className="absolute top-8 right-full w-4 h-px max-md:hidden"
                  style={{ marginRight: "-1px" }}
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

export default ImaginePrompt;
