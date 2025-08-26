import { SITE } from "@config";

export default () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#000000",
      }}
    >
      {/* Glass overlay effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)",
        }}
      />
      
      {/* Main content container */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "60px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left side - Text content with glass card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            flex: 1,
            paddingRight: "60px",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(40px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "48px",
            boxShadow: "0 0 40px rgba(255,255,255,0.02)",
          }}
        >
          
          {/* Name with Space Mono font - UPPERCASE */}
          <h1
            style={{
              fontSize: "64px",
              fontFamily: "'Space Mono', 'Courier New', monospace",
              fontWeight: 700,
              margin: 0,
              marginBottom: "20px",
              color: "#FFFFFF",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            {SITE.author}
          </h1>
          
          {/* Title - UPPERCASE */}
          <p
            style={{
              fontSize: "14px",
              fontFamily: "'Space Mono', monospace",
              fontWeight: 400,
              color: "rgba(255,255,255,0.6)",
              margin: 0,
              marginBottom: "36px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            ENTREPRENEUR & SOFTWARE ENGINEER
          </p>
          
          {/* Tags - Glass style with UPPERCASE */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {["AI/ML", "FULL STACK", "PRODUCT"].map((tag) => (
              <div
                key={tag}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  color: "rgba(255,255,255,0.8)",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 500,
                  border: "1px solid rgba(255,255,255,0.1)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          
          {/* Website URL - Glass badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "40px",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
              padding: "12px 20px",
              borderRadius: "100px",
              border: "1px solid rgba(255,255,255,0.1)",
              alignSelf: "flex-start",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#FFFFFF",
                opacity: 0.8,
              }}
            />
            <span
              style={{
                fontSize: "14px",
                fontFamily: "'Space Mono', monospace",
                fontWeight: 400,
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              ARACH.IO
            </span>
          </div>
        </div>
        
        {/* Right side - Polaroid with photo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Polaroid frame */}
          <div
            style={{
              background: "white",
              padding: "10px 8px 0 8px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.4), inset 2px 2px 3px rgba(255,255,255,0.9), inset -2px -2px 3px rgba(0,0,0,0.1)",
              position: "relative",
            }}
          >
            {/* Color photo */}
            <img
              src={"https://arach.io/assets/arach.jpg"}
              alt={SITE.author}
              width={380}
              height={380}
              style={{
                display: "block",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            />
            
            {/* Military spec sheet caption */}
            <div
              style={{
                height: "160px",
                padding: "12px 12px 8px 12px",
                background: "white",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                fontFamily: "'Space Mono', monospace",
                fontSize: "8px",
                color: "#333",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #e0e0e0",
                  paddingBottom: "6px",
                  marginBottom: "12px",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "10px", letterSpacing: "0.05em" }}>
                  ARACH_TCHOUPANI
                </span>
                <span style={{ fontSize: "8px", color: "#666", letterSpacing: "0.1em" }}>
                  CLASS_MILLENNIAL
                </span>
              </div>
              
              {/* Specs grid */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px 16px",
                  fontSize: "9px",
                }}
              >
                {[
                  ["TYPE:", "FOUNDER"],
                  ["STACK:", "FULL"],
                  ["AI/ML:", "RLHF"],
                  ["EST:", "2010"],
                  ["LOC:", "SF_BAY"],
                  ["STATUS:", "VERY_ONLINE"]
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      gap: "4px",
                      flex: "0 0 45%",
                    }}
                  >
                    <span style={{ color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {label}
                    </span>
                    <span style={{ fontWeight: 600, color: "#333" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative lines - top right */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          right: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          opacity: 0.05,
        }}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              width: i === 2 ? "80px" : "60px",
              height: "2px",
              background: "#ffffff",
            }}
          />
        ))}
      </div>
      
      {/* Decorative lines - bottom left */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "40px",
          display: "flex",
          gap: "8px",
          opacity: 0.05,
        }}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              width: "2px",
              height: i === 2 ? "80px" : "60px",
              background: "#ffffff",
            }}
          />
        ))}
      </div>
    </div>
  );
};