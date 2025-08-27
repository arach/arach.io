import React, { useEffect, useState } from 'react';
import './TacticalAbout.css';

export default function TacticalAboutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  // Set up event listener for hero image click
  useEffect(() => {
    const heroButton = document.getElementById('hero-image-button');
    if (heroButton) {
      const handleClick = () => onOpen();
      heroButton.addEventListener('click', handleClick);
      return () => heroButton.removeEventListener('click', handleClick);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      // Restart animations when opened
      const statusFills = document.querySelectorAll('.status-fill');
      statusFills.forEach((fill) => {
        (fill as HTMLElement).style.animation = 'none';
        setTimeout(() => {
          (fill as HTMLElement).style.animation = '';
        }, 10);
      });
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isAnimating ? 'animate-fadeIn' : ''}`}
      onClick={onClose}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div 
        className="relative"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: isAnimating ? 'slideUp 0.3s ease-out' : '',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-cyan-400 transition-colors z-10"
          style={{ fontSize: '28px' }}
          aria-label="Close modal"
        >
          ✕
        </button>
        
        {/* Tactical Container */}
        <div className="tactical-about-container shadow-2xl rounded-lg overflow-hidden" 
             style={{ width: '100%', maxWidth: '1200px', height: '630px', margin: '0 auto' }}>
          <div className="tactical-about">
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
    </div>
  );
}