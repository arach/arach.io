import { SITE } from "@config";
import type { CollectionEntry } from "astro:content";

// Tactical defense-tech theme colors
const tacticalTheme = {
  background: "#000000",
  cyan: "rgba(0,255,209,1)",
  cyanMuted: "rgba(0,255,209,0.8)",
  cyanLight: "rgba(0,255,209,0.05)",
  cyanBorder: "rgba(0,255,209,0.2)",
  white: "rgba(255,255,255,1)",
  whiteMuted: "rgba(255,255,255,0.7)",
  whiteLight: "rgba(255,255,255,0.5)",
  borderLight: "rgba(255,255,255,0.15)",
  orange: "rgba(255,184,0,0.8)",
};

// Legacy gradient theme for fallback
const themeGradient = {
  from: "#18181B",
  via: "#27272A", 
  to: "#343438"
};

// Layout options based on title length or other criteria
type LayoutType = '40-60' | 'ultrawide' | 'ultracompact';

// Sanitize text to remove problematic Unicode characters
const sanitizeText = (text: any): string => {
  if (!text) return '';
  const str = String(text);
  // Replace curly quotes and other problematic Unicode characters
  return str
    .replace(/[\u2018\u2019]/g, "'") // Replace curly single quotes with straight quotes
    .replace(/[\u201C\u201D]/g, '"') // Replace curly double quotes with straight quotes
    .replace(/[\u2013\u2014]/g, '-') // Replace en/em dashes with hyphens
    .replace(/\u2026/g, '...') // Replace ellipsis with three dots
    .replace(/[\u200B-\u200D\uFEFF]/g, ''); // Remove zero-width spaces
};

const getLayoutType = (post: CollectionEntry<"blog">): LayoutType => {
  // You can customize this logic
  // For now, let's use title length to determine layout
  const titleLength = post.data.title.length;
  
  if (titleLength > 60) return 'ultracompact';
  if (titleLength > 40) return '40-60';
  return 'ultrawide';
};

export default (post: CollectionEntry<"blog">, thumbnailBase64?: string, layoutOverride?: string) => {
  // Temporary workaround for Plaid post Satori rendering issue
  if (post.data.title === "The Lasting Impact of Plaid's Innovation") {
    return (
      <div style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #18181B 0%, #27272A 50%, #343438 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "24px",
        padding: "60px",
        fontFamily: "Geist"
      }}>
        <h1 style={{ color: "white", fontSize: "48px", textAlign: "center", fontWeight: "800" }}>
          The Lasting Impact of Plaid's Innovation
        </h1>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "20px", textAlign: "center" }}>
          arach.io
        </p>
      </div>
    );
  }
  
  // Extract tags if they exist - ensure it's always an array of strings
  const rawTags = post.data.tags;
  const tags = Array.isArray(rawTags) 
    ? rawTags.filter(tag => typeof tag === 'string' && tag.length > 0).slice(0, 3) 
    : [];
  const layoutType = (layoutOverride as LayoutType) || getLayoutType(post);
  
  // If we have a thumbnail, use the selected layout
  if (thumbnailBase64) {
    // ULTRAWIDE LAYOUT - Full width image on top
    if (layoutType === 'ultrawide') {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: `linear-gradient(135deg, ${themeGradient.from} 0%, ${themeGradient.via} 50%, ${themeGradient.to} 100%)`,
            fontFamily: "Geist",
            position: "relative",
          }}
        >
          {/* Top - Full width image (60% of height) */}
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "378px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={thumbnailBase64}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, transparent 0%, rgba(24,24,27,0.8) 100%)",
              }}
            />
          </div>

          {/* Bottom - Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "32px 48px",
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            {/* Title and description */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {tags && tags.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  {tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        background: "rgba(251, 176, 36, 0.15)",
                        color: "#FBB024",
                        padding: "4px 12px",
                        borderRadius: "16px",
                        fontSize: "11px",
                        fontWeight: "600",
                        border: "1px solid rgba(251, 176, 36, 0.3)",
                      }}
                    >
                      {sanitizeText(tag)}
                    </span>
                  ))}
                </div>
              )}
              
              <h1
                style={{
                  fontSize: "44px",
                  fontWeight: "800",
                  color: "white",
                  lineHeight: 1.1,
                  letterSpacing: "-1px",
                  margin: 0,
                }}
              >
                {sanitizeText(post.data.title)}
              </h1>
              
              {post.data.description && (
                <p
                  style={{
                    fontSize: "16px",
                    color: "rgba(255, 255, 255, 0.8)",
                    lineHeight: 1.4,
                    margin: 0,
                  }}
                >
                  {sanitizeText(post.data.description)}
                </p>
              )}
            </div>

            {/* Bottom - Author with larger photo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <img
                  src={"https://arach.io/assets/arach-circle.png"}
                  alt="Arach Tchoupani"
                  width={52}
                  height={52}
                  style={{
                    borderRadius: "50%",
                    border: "2.5px solid rgba(251, 176, 36, 0.6)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                  }}
                />
                <span
                  style={{
                    fontSize: "16px",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {sanitizeText(post.data.author || SITE.author)}
                </span>
              </div>
              
              <span
                style={{
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: "500",
                }}
              >
                {String(new Date(post.data.pubDatetime).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                }))}
              </span>
            </div>
          </div>
        </div>
      );
    }
    
    // ULTRACOMPACT LAYOUT - Small image, more text space
    if (layoutType === 'ultracompact') {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100%",
            background: `linear-gradient(135deg, ${themeGradient.from} 0%, ${themeGradient.via} 50%, ${themeGradient.to} 100%)`,
            fontFamily: "Geist",
            position: "relative",
          }}
        >
          {/* Left side - Text content (70%) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "70%",
              padding: "40px",
              justifyContent: "space-between",
            }}
          >
            {/* Title and description - moved to top */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {tags && tags.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                  }}
                >
                  {tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        background: "rgba(251, 176, 36, 0.15)",
                        color: "#FBB024",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "10px",
                        fontWeight: "600",
                        border: "1px solid rgba(251, 176, 36, 0.3)",
                      }}
                    >
                      {sanitizeText(tag)}
                    </span>
                  ))}
                </div>
              )}
              
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "white",
                  lineHeight: 1.1,
                  letterSpacing: "-0.5px",
                  margin: 0,
                }}
              >
                {sanitizeText(post.data.title)}
              </h1>
              
              {post.data.description && (
                <p
                  style={{
                    fontSize: "14px",
                    color: "rgba(255, 255, 255, 0.8)",
                    lineHeight: 1.4,
                    margin: 0,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {sanitizeText(post.data.description)}
                </p>
              )}
            </div>

            {/* Bottom - Author and date */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: "500",
                }}
              >
                {sanitizeText(post.data.author || SITE.author)}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.6)",
                }}
              >
                •
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                {String(new Date(post.data.pubDatetime).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                }))}
              </span>
            </div>
          </div>

          {/* Right side - Compact thumbnail (30%) */}
          <div
            style={{
              display: "flex",
              width: "30%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src={thumbnailBase64}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, rgba(24,24,27,0.4) 0%, transparent 50%)",
              }}
            />
          </div>
        </div>
      );
    }
    
    // Default 40/60 layout
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${themeGradient.from} 0%, ${themeGradient.via} 50%, ${themeGradient.to} 100%)`,
          fontFamily: "Geist",
          position: "relative",
        }}
      >
        {/* Left side - Text content (40%) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "40%",
            padding: "44px 36px",
            justifyContent: "space-between",
          }}
        >
          {/* Title and description - moved to top */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {tags && tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      background: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(10px)",
                      color: "rgba(255, 255, 255, 0.95)",
                      padding: "4px 12px",
                      borderRadius: "16px",
                      fontSize: "12px",
                      fontWeight: "500",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <h1
              style={{
                fontSize: post.data.title.length > 50 ? "36px" : "42px",
                fontWeight: "800",
                color: "white",
                lineHeight: 1.1,
                letterSpacing: "-1px",
                margin: 0,
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              {sanitizeText(post.data.title)}
            </h1>
            
            {post.data.description && (
              <p
                style={{
                  fontSize: "16px",
                  color: "rgba(255, 255, 255, 0.9)",
                  lineHeight: 1.4,
                  margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {sanitizeText(post.data.description)}
              </p>
            )}
          </div>

          {/* Bottom - Author and date */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <img
                src={"https://arach.io/assets/arach-circle.png"}
                alt={post.data.author || SITE.author}
                width={56}
                height={56}
                style={{
                  borderRadius: "50%",
                  border: "2.5px solid rgba(251, 176, 36, 0.6)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                }}
              />
              <span
                style={{
                  fontSize: "16px",
                  color: "white",
                  fontWeight: "600",
                }}
              >
                {sanitizeText(post.data.author || SITE.author)}
              </span>
            </div>
            
            {post.data.pubDatetime && (
              <span
                style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: "400",
                }}
              >
                {String(new Date(post.data.pubDatetime).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                }))}
              </span>
            )}
          </div>
        </div>

        {/* Right side - Large thumbnail image (60%) */}
        <div
          style={{
            display: "flex",
            width: "60%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <img
            src={thumbnailBase64}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          {/* Gradient overlay for better text contrast if needed */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, rgba(0,0,0,0.2) 0%, transparent 30%)",
            }}
          />
        </div>
      </div>
    );
  }
  
  // Tactical defense-tech layout for posts without thumbnails
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        position: "relative",
        background: tacticalTheme.background,
        padding: "32px 48px",
        fontFamily: "'Space Mono', monospace",
      }}
    >
      {/* Thin border around entire content */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          right: "20px",
          bottom: "20px",
          border: `1px solid ${tacticalTheme.borderLight}`,
        }}
      />
      
      {/* Corner crosses - Top Left */}
      <div style={{ position: "absolute", top: "20px", left: "20px", width: "30px", height: "2px", background: tacticalTheme.whiteLight }} />
      <div style={{ position: "absolute", top: "20px", left: "20px", width: "2px", height: "30px", background: tacticalTheme.whiteLight }} />
      
      {/* Corner crosses - Top Right */}
      <div style={{ position: "absolute", top: "20px", right: "20px", width: "30px", height: "2px", background: tacticalTheme.whiteLight }} />
      <div style={{ position: "absolute", top: "20px", right: "20px", width: "2px", height: "30px", background: tacticalTheme.whiteLight }} />
      
      {/* Corner crosses - Bottom Left */}
      <div style={{ position: "absolute", bottom: "20px", left: "20px", width: "30px", height: "2px", background: tacticalTheme.whiteLight }} />
      <div style={{ position: "absolute", bottom: "20px", left: "20px", width: "2px", height: "30px", background: tacticalTheme.whiteLight }} />
      
      {/* Corner crosses - Bottom Right */}
      <div style={{ position: "absolute", bottom: "20px", right: "20px", width: "30px", height: "2px", background: tacticalTheme.whiteLight }} />
      <div style={{ position: "absolute", bottom: "20px", right: "20px", width: "2px", height: "30px", background: tacticalTheme.whiteLight }} />
      
      {/* Header bar */}
      <div
        style={{
          position: "absolute",
          top: "32px",
          left: "48px",
          right: "48px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "10px",
          fontFamily: "'Space Mono', monospace",
          color: tacticalTheme.whiteLight,
          fontWeight: 600,
          letterSpacing: "0.1em",
        }}
      >
        <span>ARTICLE: BRIEFING | TYPE: {tags && tags.length > 0 ? sanitizeText(tags[0]).toUpperCase() : "TECHNICAL"} | STATUS: PUBLISHED</span>
        <span>ACCESS: PUBLIC</span>
      </div>
      
      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          marginTop: "60px",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        {/* Article classification */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontFamily: "'Space Mono', monospace",
              color: tacticalTheme.cyanMuted,
              marginBottom: "8px",
              letterSpacing: "0.15em",
            }}
          >
            CLASSIFICATION: ARTICLE_{post.data.pubDatetime ? new Date(post.data.pubDatetime).getFullYear() : new Date().getFullYear()}_{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}
          </div>
          
          {/* Title */}
          <h1
            style={{
              fontSize: post.data.title.length > 50 ? "42px" : "48px",
              fontWeight: "700",
              color: tacticalTheme.white,
              lineHeight: 1.1,
              letterSpacing: "-0.5px",
              margin: 0,
              textTransform: "uppercase",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            {sanitizeText(post.data.title)}
          </h1>
          
          {/* Mission brief box */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: tacticalTheme.cyanLight,
              border: `1px solid ${tacticalTheme.cyanBorder}`,
              padding: "20px 24px",
              marginTop: "24px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontFamily: "'Space Mono', monospace",
                color: tacticalTheme.cyanMuted,
                marginBottom: "16px",
                letterSpacing: "0.1em",
                fontWeight: 700,
              }}
            >
              ◆ MISSION BRIEF
            </div>
            {post.data.description && (
              <p
                style={{
                  fontSize: "14px",
                  color: tacticalTheme.whiteMuted,
                  lineHeight: 1.6,
                  margin: 0,
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {sanitizeText(post.data.description)}
              </p>
            )}
          </div>
          
          {/* Meta information */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {/* Tags */}
              {tags && tags.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  {tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        color: tacticalTheme.cyanMuted,
                        fontSize: "11px",
                        fontWeight: "600",
                        fontFamily: "'Space Mono', monospace",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      [{sanitizeText(tag)}]
                    </span>
                  ))}
                </div>
              )}
              
              {/* Author and date */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: tacticalTheme.whiteLight,
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  AUTHOR: {sanitizeText(post.data.author || SITE.author).toUpperCase()}
                </span>
                {post.data.pubDatetime && (
                  <span
                    style={{
                      fontSize: "12px",
                      color: tacticalTheme.whiteLight,
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    DATE: {new Date(post.data.pubDatetime).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            
            {/* Command interface */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                background: "rgba(0,0,0,0.5)",
                border: `1px solid ${tacticalTheme.cyanBorder}`,
                borderLeft: `3px solid ${tacticalTheme.cyanMuted}`,
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  background: tacticalTheme.cyanMuted,
                  boxShadow: `0 0 10px ${tacticalTheme.cyanMuted}`,
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: "'Space Mono', monospace",
                  color: tacticalTheme.cyanMuted,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                [READ] ► ARACH.IO
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};