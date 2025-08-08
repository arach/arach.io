import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CollectionEntry } from 'astro:content';

interface SeriesNavigationMinimalProps {
  currentPost: CollectionEntry<'blog'>;
  seriesPosts: CollectionEntry<'blog'>[];
  currentIndex: number;
  previousPost: CollectionEntry<'blog'> | null;
  nextPost: CollectionEntry<'blog'> | null;
}

const SeriesNavigationMinimal: React.FC<SeriesNavigationMinimalProps> = ({
  currentPost,
  seriesPosts,
  currentIndex,
  previousPost,
  nextPost,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const current = currentPost.data.series?.order ?? currentIndex + 1;
  const total = seriesPosts.length;

  // Short titles for minimized view
  const shortTitles: Record<string, string> = {
    'ladderless-path': 'pulling up the ladder',
    'ai-restored-cto-personal-leverage': 'ai as leverage',
    'ai-theater-vs-real-transformation': 'theater vs transformation'
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isExpanded]);

  // Close on outside click when expanded
  useEffect(() => {
    if (!isExpanded) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.series-nav-inline')) {
        setIsExpanded(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isExpanded]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      className="series-nav-inline"
      style={{
        position: 'relative',
        display: 'inline-block',
        marginLeft: 'auto',
        marginTop: isMobile ? '8px' : '0',
        verticalAlign: 'top',
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {/* Trigger Button - Label Style */}
      <motion.button
        onClick={handleToggle}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '3px 10px 3px 11px',
          fontSize: '11px',
          fontWeight: 500,
          fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace",
          color: 'rgb(var(--color-accent))',
          background: 'rgb(var(--color-card) / 0.6)',
          border: '1px solid rgb(var(--color-accent) / 0.15)',
          borderRadius: '12px',
          cursor: 'pointer',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          backdropFilter: 'blur(10px)',
          boxShadow: isExpanded ? '0 2px 8px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease',
          opacity: 0.85,
        }}
        whileHover={{ 
          opacity: 1,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
        }}
        whileTap={{ scale: 0.98 }}
        aria-label={`Series navigation - Part ${current} of ${total}`}
      >
        <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em' }}>SERIES ON AI</span>
        <motion.svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24"
          style={{ opacity: 0.6, marginLeft: '-2px' }}
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path d="M7 10l5 5 5-5z" fill="currentColor" />
        </motion.svg>
      </motion.button>

      {/* Expanded Dropdown - Terminal Aesthetic */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: '0',
              width: isMobile ? 'calc(100vw - 2rem)' : '340px',
              maxWidth: '340px',
              background: 'rgb(var(--color-card) / 0.92)',
              border: '1px solid rgb(var(--color-border) / 0.15)',
              borderRadius: '10px',
              backdropFilter: 'blur(14px)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              padding: '12px',
              zIndex: 1000,
            }}
          >

            {/* Series Items - Minimal Terminal Style */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {seriesPosts.map((post, index) => {
                const isCurrent = post.slug === currentPost.slug;
                const postNumber = post.data.series?.order ?? index + 1;
                const isHovered = hoveredIndex === index;
                const shortTitle = shortTitles[post.slug] || post.data.title.toLowerCase().slice(0, 25);

                return (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onMouseEnter={() => !isCurrent && setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {isCurrent ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        background: 'rgb(var(--color-accent) / 0.08)',
                        borderRadius: '4px',
                        border: '1px solid rgb(var(--color-accent) / 0.15)',
                      }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          color: 'rgb(var(--color-accent))',
                          fontFamily: "'SF Mono', monospace",
                          minWidth: '18px',
                        }}>
                          {postNumber}/
                        </span>
                        <span style={{
                          fontSize: '12px',
                          color: 'rgb(var(--color-accent))',
                          fontWeight: 500,
                          flex: 1,
                          fontFamily: "'SF Mono', monospace",
                          letterSpacing: '-0.04em',
                          textTransform: 'lowercase',
                        }}>
                          {shortTitle}
                        </span>
                        <span style={{
                          fontSize: '14px',
                          color: 'rgb(var(--color-accent))',
                          opacity: 0.6,
                          fontWeight: 500,
                          fontFamily: "'SF Mono', monospace",
                        }}>
                          ←
                        </span>
                      </div>
                    ) : (
                      <a
                        href={`/posts/${post.slug}/`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          textDecoration: 'none',
                          borderRadius: '4px',
                          transition: 'all 0.15s ease',
                          background: isHovered ? 'rgb(var(--color-card-muted) / 0.3)' : 'transparent',
                        }}
                      >
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'rgb(var(--color-text-base))',
                          opacity: isHovered ? 0.7 : 0.4,
                          fontFamily: "'SF Mono', monospace",
                          minWidth: '18px',
                          transition: 'opacity 0.15s ease',
                        }}>
                          {postNumber}/
                        </span>
                        <span style={{
                          fontSize: '12px',
                          color: 'rgb(var(--color-text-base))',
                          opacity: isHovered ? 0.9 : 0.6,
                          flex: 1,
                          fontFamily: "'SF Mono', monospace",
                          letterSpacing: '-0.04em',
                          textTransform: 'lowercase',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          transition: 'all 0.15s ease',
                        }}>
                          <AnimatePresence mode="wait">
                            {isHovered ? (
                              <motion.span
                                key="full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.1 }}
                              >
                                {post.data.title.toLowerCase()}
                              </motion.span>
                            ) : (
                              <motion.span
                                key="short"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.1 }}
                              >
                                {shortTitle}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                      </a>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SeriesNavigationMinimal;