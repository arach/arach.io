import { SITE } from "@config";
import type { CollectionEntry } from "astro:content";

// Theme-aligned gradients using site colors
// Dark mode: #18181B (warm charcoal) with #FBB024 (warm amber) accent
// Light mode: white with black
const themeGradient = {
  // Using the dark theme colors for OG images for consistency
  from: "#18181B", // Warm charcoal
  via: "#27272A",  // Slightly lighter warm gray (from --color-card)
  to: "#343438"     // Medium warm gray (from --color-card-muted)
};

// Layout options based on title length or other criteria
type LayoutType = '40-60' | 'ultrawide' | 'ultracompact';

const getLayoutType = (post: CollectionEntry<"blog">): LayoutType => {
  // You can customize this logic
  // For now, let's use title length to determine layout
  const titleLength = post.data.title.length;
  
  if (titleLength > 60) return 'ultracompact';
  if (titleLength > 40) return '40-60';
  return 'ultrawide';
};

export default (post: CollectionEntry<"blog">, thumbnailBase64?: string, layoutOverride?: string) => {
  // Extract tags if they exist
  const tags = post.data.tags?.slice(0, 3) || [];
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
              {tags.length > 0 && (
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
                      {tag}
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
                {post.data.title}
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
                  {post.data.description}
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
                  {post.data.author || SITE.author}
                </span>
              </div>
              
              <span
                style={{
                  fontSize: "13px",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: "500",
                }}
              >
                {new Date(post.data.pubDatetime).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
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
              {tags.length > 0 && (
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
                      {tag}
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
                {post.data.title}
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
                  {post.data.description}
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
                {post.data.author || SITE.author}
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
                {new Date(post.data.pubDatetime).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
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
            {tags.length > 0 && (
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
              {post.data.title}
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
                {post.data.description}
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
                {post.data.author || SITE.author}
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
                {new Date(post.data.pubDatetime).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
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
  
  // Original layout for posts without thumbnails
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
      {/* Noise texture overlay for depth */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />
      
      {/* Geometric pattern overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='10' cy='10' r='1' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")`,
          opacity: 0.5,
        }}
      />
      
      {/* Main content container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "60px",
          height: "100%",
          position: "relative",
        }}
      >
        {/* Top section with logo and date */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "auto",
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
              src={"https://arach.io/assets/arach.jpg"}
              alt="Arach Tchoupani"
              width={44}
              height={44}
              style={{
                borderRadius: "50%",
                border: "2px solid rgba(251, 176, 36, 0.5)",
              }}
            />
            <span
              style={{
                fontSize: "20px",
                color: "rgba(255, 255, 255, 0.95)",
                fontWeight: "600",
              }}
            >
              {SITE.title}
            </span>
          </div>
          
          {/* Date if available */}
          {post.data.pubDatetime && (
            <span
              style={{
                fontSize: "18px",
                color: "rgba(255, 255, 255, 0.8)",
                fontWeight: "400",
              }}
            >
              {new Date(post.data.pubDatetime).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          )}
        </div>

        {/* Center section with title and description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            maxWidth: "100%",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          
          {/* Tags */}
          {tags.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "12px",
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
                    padding: "6px 16px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Title */}
          <h1
            style={{
              fontSize: post.data.title.length > 60 ? "48px" : "56px",
              fontWeight: "800",
              color: "white",
              lineHeight: 1.2,
              letterSpacing: "-1px",
              margin: 0,
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.data.title}
          </h1>
          
          {/* Description */}
          {post.data.description && (
            <p
              style={{
                fontSize: "20px",
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 1.5,
                margin: 0,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                maxWidth: "90%",
              }}
            >
              {post.data.description}
            </p>
          )}
        </div>

        {/* Bottom section with author */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: "auto",
          }}
        >
          <img
            src={"https://arach.io/assets/arach.jpg"}
            alt={post.data.author || SITE.author}
            width={48}
            height={48}
            style={{
              borderRadius: "50%",
              border: "3px solid rgba(255, 255, 255, 0.3)",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.7)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "500",
              }}
            >
              Written by
            </span>
            <span
              style={{
                fontSize: "18px",
                color: "white",
                fontWeight: "600",
              }}
            >
              {post.data.author || SITE.author}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};