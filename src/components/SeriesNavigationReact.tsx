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
  const isMidWidth = viewportWidth >= 1040 && viewportWidth < 1300;
  
  const shortTitles: Record<string, string> = {
    'ladderless-path': '1',
    'ai-restored-cto-personal-leverage': '2',
    'ai-theater-vs-real-transformation': '3'
  };

  // Get the order number for each post
  const getOrderPrefix = (post: CollectionEntry<'blog'>) => {
    return post.data.series?.order ? `${post.data.series.order}/ ` : '';
  };

  // Simple left offset - just a small margin from the left edge
  const leftOffset = 0; // flush with left edge

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Super-minimized chip for mid-width band (1040–1299px)
  if (isMidWidth) {
    const current = currentPost.data.series?.order ?? currentIndex + 1;
    return (
      <a
        id="series-navigation"
        href={`#`}
        className="fixed left-0 top-1/2 -translate-y-1/2 no-underline"
        style={{
          zIndex: 30,
        }}
        aria-label="Open special series navigation"
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 5px',
            fontSize: 10,
            lineHeight: 1,
            color: 'rgb(var(--color-text-muted))',
            background: 'rgb(var(--color-card) / 0.9)',
            border: '1px solid rgb(var(--color-border) / 0.3)',
            borderLeft: 'none',
            borderTopRightRadius: 6,
            borderBottomRightRadius: 6,
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            opacity: 0.8
          }}
        >
          <span style={{ fontWeight: 600, color: 'rgb(var(--color-accent))' }}>{current}</span>
          <span style={{ opacity: 0.7, fontSize: 9 }}>/ 3</span>
        </span>
      </a>
    );
  }

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
          width: isNavHovered ? 240 : 48,
          maxHeight: '60vh',
          overflowY: 'auto',
          borderRadius: '0 8px 8px 0',
          background: 'rgb(var(--color-card) / 0.85)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'width 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: isNavHovered ? 80 : 30,
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
            fontSize: isNavHovered ? '0.5rem' : '0.45rem',
            opacity: isNavHovered ? 0.8 : 0.6,
            transition: 'all 0.15s ease'
          }}
        >
          {isNavHovered ? 'SPECIAL SERIES' : 'AI'}
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
              className="py-0.5 px-0.5 group relative"
               onMouseEnter={() => !isCurrent && setHoveredIndex(index)}
              whileHover={{ x: isNavHovered ? 2 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isCurrent ? (
                <div className="flex items-center gap-2">
                  <span 
                    className="text-skin-accent font-bold block transition-all duration-200"
                    style={{ 
                      fontSize: isNavHovered ? '0.65rem' : '0.7rem', 
                      lineHeight: 1.2, 
                      textTransform: 'lowercase', 
                      letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isNavHovered ? `${orderPrefix}${post.data.title.toLowerCase().slice(0, 25)}...` : shortTitle}
                  </span>
                  {isNavHovered && (
                    <span 
                      className="text-skin-accent opacity-50 text-xs"
                      style={{ fontSize: '0.5rem', fontWeight: 500 }}
                    >
                      ←
                    </span>
                  )}
                </div>
              ) : (
                <a
                  href={`/posts/${post.slug}/`}
                  className="text-skin-base hover:text-skin-accent transition-all duration-200 block no-underline"
                  style={{ 
                    fontSize: isNavHovered ? (isHovered ? '0.65rem' : '0.6rem') : '0.7rem', 
                    lineHeight: 1.2, 
                    opacity: isNavHovered ? (isHovered ? 0.9 : 0.6) : 0.7, 
                    textTransform: 'lowercase', 
                    letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'all 0.15s ease'
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
                        {orderPrefix}{post.data.title.toLowerCase().slice(0, 30)}...
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