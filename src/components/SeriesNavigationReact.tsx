import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CollectionEntry } from 'astro:content';

interface SeriesNavigationProps {
  currentPost: CollectionEntry<'blog'>;
  seriesPosts: CollectionEntry<'blog'>[];
  currentIndex: number;
  previousPost: CollectionEntry<'blog'> | null;
  nextPost: CollectionEntry<'blog'> | null;
}

const SeriesNavigationReact: React.FC<SeriesNavigationProps> = ({
  currentPost,
  seriesPosts,
  currentIndex,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [viewportWidth, setViewportWidth] = useState<number>(() => (typeof window !== 'undefined' ? window.innerWidth : 1400));
  const isLargeDisplay = viewportWidth >= 1025;
  
  const shortTitles: Record<string, string> = {
    'ladderless-path': '1/ pulling up the ladder',
    'ai-restored-cto-personal-leverage': '2/ ai as personal leverage',
    'ai-theater-vs-real-transformation': '3/ theater vs transformation'
  };

  // Get the order number for each post
  const getOrderPrefix = (post: CollectionEntry<'blog'>) => {
    return post.data.series?.order ? `${post.data.series.order}/ ` : '';
  };

  // Simple left offset - just a small margin from the left edge
  const leftOffset = 32; // 32px from left edge

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Only render on large displays
  if (!isLargeDisplay) {
    return null;
  }

  return (
    <motion.nav
        id="series-navigation"
        className="fixed text-left bg-skin-card border border-skin-line p-2"
        style={{
          top: '50vh',
          transform: 'translateY(-50%)',
          left: leftOffset,
          width: isNavHovered ? 360 : 200,
          maxHeight: '80vh',
          overflowY: 'auto',
          borderRadius: '0 12px 12px 0',
          background: 'rgb(var(--color-card) / 0.95)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          transition: 'width 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: isNavHovered ? 40 : 20,
        }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      onMouseEnter={() => setIsNavHovered(true)}
      onFocus={() => setIsNavHovered(true)}
      onMouseLeave={() => {
        setIsNavHovered(false);
        setHoveredIndex(null);
      }}
      onBlur={() => setIsNavHovered(false)}
    >
      <div className="mb-1">
        <h3 
          className="font-semibold text-skin-accent"
          style={{
            fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace",
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            fontSize: '0.65rem',
            opacity: 0.9
          }}
        >
          SPECIAL SERIES ON AI
        </h3>
      </div>
      <div className="space-y-0">
        {seriesPosts.map((post, index) => {
          const isCurrent = post.slug === currentPost.slug;
          const shortTitle = shortTitles[post.slug] || post.data.title.toLowerCase().slice(0, 20);
           const isHovered = isNavHovered && hoveredIndex === index;
          const orderPrefix = getOrderPrefix(post);
          
          return (
            <motion.div 
              key={post.slug} 
              className="py-1 px-1 group relative"
               onMouseEnter={() => !isCurrent && setHoveredIndex(index)}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              {isCurrent ? (
                <div className="flex items-center gap-2">
                  <span 
                    className="text-skin-accent font-bold block transition-all duration-200"
                    style={{ 
                      fontSize: '0.75rem', 
                      lineHeight: 1.2, 
                      textTransform: 'lowercase', 
                      letterSpacing: '-0.01em' 
                    }}
                  >
                    {shortTitle}
                  </span>
                  <span 
                    className="text-skin-accent opacity-50 text-xs"
                    style={{ fontSize: '0.6rem', fontWeight: 500 }}
                  >
                    ←
                  </span>
                </div>
              ) : (
                <a
                  href={`/posts/${post.slug}/`}
                  className="text-skin-base hover:text-skin-accent transition-all duration-200 block no-underline"
                  style={{ 
                    fontSize: isHovered ? '0.8rem' : '0.7rem', 
                    lineHeight: 1.2, 
                    opacity: isHovered ? 0.9 : 0.5, 
                    textTransform: 'lowercase', 
                    letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isHovered ? (
                      <motion.span
                        key="full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        {orderPrefix}{post.data.title.toLowerCase()}
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
                </a>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default SeriesNavigationReact;