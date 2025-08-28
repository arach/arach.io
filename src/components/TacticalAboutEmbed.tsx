import React, { useEffect, useState } from 'react';
import './TacticalAbout.css';

interface TacticalAboutEmbedProps {
  triggerElementId?: string;
  placement?: 'after-hero' | 'inline' | 'fixed';
  className?: string;
}

export default function TacticalAboutEmbed({ 
  triggerElementId = 'hero-image-button',
  placement = 'after-hero',
  className = ''
}: TacticalAboutEmbedProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Set up event listener for trigger element click
  useEffect(() => {
    const triggerElement = document.getElementById(triggerElementId);
    if (triggerElement) {
      const handleClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        setIsVisible(true);
        setIsAnimating(true);
      };
      triggerElement.addEventListener('click', handleClick);
      return () => triggerElement.removeEventListener('click', handleClick);
    }
  }, [triggerElementId]);
  
  // Handle escape key and click outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      const container = document.querySelector('.tactical-about-container');
      if (container && !container.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };
    
    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      // Position the tactical container and draw connection line
      setTimeout(() => {
        const trigger = document.getElementById(triggerElementId);
        const container = document.querySelector('.tactical-floating') as HTMLElement;
        const line = document.getElementById('connection-line') as SVGLineElement;
        
        if (trigger && container && line) {
          const triggerRect = trigger.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          
          // Only set initial position if not already positioned
          // CSS handles centering below 1200px
          if (position.x === 0 && position.y === 0 && viewportWidth >= 1200) {
            const containerWidth = 1200;
            const containerHeight = 630;
            
            // Position as floating element next to trigger
            let containerX = triggerRect.right + 50;
            let containerY = triggerRect.top - 100;
            
            // Adjust if container would go off screen
            if (containerX + containerWidth > viewportWidth - 50) {
              containerX = viewportWidth - containerWidth - 50;
            }
            
            if (containerY < 50) {
              containerY = 50;
            }
            
            if (containerY + containerHeight > viewportHeight - 50) {
              containerY = viewportHeight - containerHeight - 50;
            }
            
            setPosition({ x: containerX, y: containerY });
          }
          
          // Only set position on large screens (CSS handles centering below 1200px)
          if (viewportWidth >= 1200) {
            container.style.left = `${position.x}px`;
            container.style.top = `${position.y}px`;
            
            // Draw connection line
            const triggerCenterX = triggerRect.left + triggerRect.width / 2;
            const triggerCenterY = triggerRect.top + triggerRect.height / 2;
            
            line.setAttribute('x1', String(triggerCenterX));
            line.setAttribute('y1', String(triggerCenterY));
            line.setAttribute('x2', String(position.x));
            line.setAttribute('y2', String(position.y + 315)); // Half of container height
            line.style.display = 'block';
          } else {
            // For smaller screens, let CSS handle positioning
            container.style.left = '';
            container.style.top = '';
          }
        }
      }, 10);
      
      // Restart animations when shown
      setTimeout(() => {
        const statusFills = document.querySelectorAll('.status-fill');
        statusFills.forEach((fill) => {
          (fill as HTMLElement).style.animation = 'none';
          setTimeout(() => {
            (fill as HTMLElement).style.animation = '';
          }, 10);
        });
      }, 100);
    }
    
    return () => {
      // Clean up
    };
  }, [isVisible, triggerElementId, position]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start drag if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.tagName === 'IMG') {
      return;
    }
    
    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    e.preventDefault(); // Prevent text selection
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay background - CSS will handle visibility based on screen size */}
      <div 
        className="tactical-overlay-backdrop"
        onClick={() => setIsVisible(false)}
        style={{
          display: isVisible ? 'block' : 'none',
        }}
      />
      
      {/* Connection line */}
      <svg 
        className="tactical-connection-line"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 49,
          display: isVisible ? 'block' : 'none',
        }}
      >
        <line
          id="connection-line"
          stroke="rgba(0, 255, 209, 0.3)"
          strokeWidth="1"
          strokeDasharray="2,4"
          style={{ display: 'none' }}
        />
      </svg>
      
      {/* Tactical container */}
      <div 
        className={`tactical-floating ${isAnimating ? 'animate-in' : ''} ${isDragging ? 'dragging' : ''}`}
        style={{
          display: isVisible ? 'block' : 'none',
        }}
      >
        <div 
          className="tactical-about-container shadow-2xl rounded-lg"
          onMouseDown={handleMouseDown}>
          <div className="tactical-about">
          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 z-20 text-white hover:text-cyan-400 transition-colors"
            style={{ 
              fontSize: '20px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(0, 255, 209, 0.3)',
              borderRadius: '4px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Close tactical view"
          >
            ✕
          </button>

          {/* Thin border */}
          <div className="tactical-border"></div>
          
          {/* Corner crosses */}
          <div className="corner-cross top-left">
            <div className="cross-h"></div>
            <div className="cross-v"></div>
          </div>
          <div className="corner-cross top-right">
            <div className="cross-h"></div>
            <div className="cross-v"></div>
          </div>
          <div className="corner-cross bottom-left">
            <div className="cross-h"></div>
            <div className="cross-v"></div>
          </div>
          <div className="corner-cross bottom-right">
            <div className="cross-h"></div>
            <div className="cross-v"></div>
          </div>
          
          {/* Header bar */}
          <div className="tactical-header">
            <span>SECTOR: ALPHA-7 | GRID: 37.7749°N, 122.4194°W | AUTH: VERIFIED</span>
            <span>CLEARANCE: LEVEL_5</span>
          </div>
          
          {/* Main content */}
          <div className="main-content">
            {/* Left side - Tactical UI */}
            <div className="tactical-ui">
              {/* Callsign and name */}
              <div className="identity-section">
                <div className="callsign">CALLSIGN: PERSIAN_EAGLE</div>
                <h1 className="name">ARACH_TCHOUPANI</h1>
                <div className="unit">UNIT: ENGINEERING_CORPS | SPECIALIZATION: FULL_STACK_SPEC_OPS</div>
              </div>
              
              {/* Mission parameters */}
              <div className="mission-parameters">
                <div className="section-header">◆ MISSION PARAMETERS</div>
                <div className="parameters-grid">
                  <div className="param-row">
                    <span>OBJECTIVE:</span>
                    <span className="param-value">BUILD_AND_SCALE</span>
                  </div>
                  <div className="param-row">
                    <span>PRIORITY:</span>
                    <span className="param-value priority">CRITICAL</span>
                  </div>
                  <div className="param-row">
                    <span>STATUS:</span>
                    <span className="param-value">ACTIVE</span>
                  </div>
                </div>
              </div>
              
              {/* Systems status */}
              <div className="systems-status">
                <div className="section-header">◆ SYSTEMS STATUS</div>
                <div className="status-grid">
                  <div className="status-row">
                    <span className="status-label">AI/ML:</span>
                    <div className="status-bar">
                      <div className="status-fill" style={{ '--fill-width': '88%', '--delay': '0.1s' } as React.CSSProperties}></div>
                    </div>
                    <span className="status-text" style={{ '--delay': '0.1s' } as React.CSSProperties}>RLHF</span>
                  </div>
                  <div className="status-row">
                    <span className="status-label">STACK:</span>
                    <div className="status-bar">
                      <div className="status-fill" style={{ '--fill-width': '100%', '--delay': '0.3s' } as React.CSSProperties}></div>
                    </div>
                    <span className="status-text" style={{ '--delay': '0.3s' } as React.CSSProperties}>FULL_OPERATIONAL</span>
                  </div>
                  <div className="status-row">
                    <span className="status-label">PRODUCT:</span>
                    <div className="status-bar">
                      <div className="status-fill" style={{ '--fill-width': '94%', '--delay': '0.5s' } as React.CSSProperties}></div>
                    </div>
                    <span className="status-text" style={{ '--delay': '0.5s' } as React.CSSProperties}>SHIPPING</span>
                  </div>
                </div>
              </div>
              
              {/* Command interface */}
              <div className="command-interface">
                <div className="command-indicator"></div>
                <span className="command-text">[CONNECT] ► ARACH.IO</span>
              </div>
            </div>
            
            {/* Right side - Polaroid */}
            <div className="polaroid-container">
              <div className="polaroid">
                <img
                  src="/assets/arach.jpg"
                  alt="Arach Tchoupani"
                  className="polaroid-image"
                />
                <div className="polaroid-caption">
                  <div className="spec-sheet">
                    <div className="spec-header">
                      <span className="spec-id">ARACH_TCHOUPANI</span>
                      <span className="spec-classification">CLASS_MILLENNIAL</span>
                    </div>
                    <div className="spec-grid">
                      <div className="spec-item">
                        <span className="spec-label">TYPE:</span>
                        <span className="spec-value">FOUNDER</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">STACK:</span>
                        <span className="spec-value">FULL</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">AI/ML:</span>
                        <span className="spec-value">RLHF</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">EST:</span>
                        <span className="spec-value">2010</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">LOC:</span>
                        <span className="spec-value">SF_BAY</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">STATUS:</span>
                        <span className="spec-value">VERY_ONLINE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}