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
        padding: "32px 48px",
      }}
    >
      {/* Corner brackets */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          width: "40px",
          height: "40px",
          borderTop: "2px solid rgba(255,255,255,0.4)",
          borderLeft: "2px solid rgba(255,255,255,0.4)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "40px",
          height: "40px",
          borderTop: "2px solid rgba(255,255,255,0.4)",
          borderRight: "2px solid rgba(255,255,255,0.4)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          width: "40px",
          height: "40px",
          borderBottom: "2px solid rgba(255,255,255,0.4)",
          borderLeft: "2px solid rgba(255,255,255,0.4)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          width: "40px",
          height: "40px",
          borderBottom: "2px solid rgba(255,255,255,0.4)",
          borderRight: "2px solid rgba(255,255,255,0.4)",
        }}
      />
      
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
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.1em",
        }}
      >
        <span>SECTOR: ALPHA-7 | GRID: 37.7749°N, 122.4194°W | AUTH: VERIFIED</span>
        <span>CLEARANCE: LEVEL_5</span>
      </div>
      
      {/* Main content */}
      <div
        style={{
          display: "flex",
          width: "100%",
          marginTop: "48px",
          gap: "60px",
        }}
      >
        {/* Left side - Tactical UI */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          {/* Callsign and name */}
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
                color: "rgba(0,255,209,0.7)",
                marginBottom: "8px",
                letterSpacing: "0.15em",
              }}
            >
              CALLSIGN: FOUNDER-1
            </div>
            <h1
              style={{
                fontSize: "48px",
                fontFamily: "'Space Mono', 'Courier New', monospace",
                fontWeight: 700,
                margin: 0,
                color: "#FFFFFF",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              ARACH TCHOUPANI
            </h1>
            <div
              style={{
                fontSize: "11px",
                fontFamily: "'Space Mono', monospace",
                color: "rgba(255,255,255,0.5)",
                marginTop: "8px",
                letterSpacing: "0.1em",
              }}
            >
              UNIT: ENGINEERING_CORPS | SPECIALIZATION: FULL_STACK_OPS
            </div>
          </div>
          
          {/* Mission parameters */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "rgba(0,255,209,0.05)",
              border: "1px solid rgba(0,255,209,0.2)",
              padding: "16px 20px",
              marginBottom: "32px",
              marginLeft: "0",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontFamily: "'Space Mono', monospace",
                color: "rgba(0,255,209,0.8)",
                marginBottom: "12px",
                letterSpacing: "0.1em",
                fontWeight: 700,
              }}
            >
              ◆ MISSION PARAMETERS
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "12px",
                fontFamily: "'Space Mono', monospace",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>OBJECTIVE:</span>
                <span style={{ color: "rgba(0,255,209,0.8)" }}>BUILD_AND_SCALE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>PRIORITY:</span>
                <span style={{ color: "rgba(255,184,0,0.8)" }}>CRITICAL</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>STATUS:</span>
                <span style={{ color: "rgba(0,255,209,0.8)" }}>ACTIVE</span>
              </div>
            </div>
          </div>
          
          {/* System status */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontFamily: "'Space Mono', monospace",
                color: "rgba(0,255,209,0.8)",
                marginBottom: "12px",
                letterSpacing: "0.1em",
                fontWeight: 700,
              }}
            >
              ◆ SYSTEMS STATUS
            </div>
            {[
              ["AI/ML:", "RLHF", "▓▓▓▓▓▓▓▓░░"],
              ["STACK:", "FULL_OPERATIONAL", "▓▓▓▓▓▓▓▓▓▓"],
              ["PRODUCT:", "SHIPPING", "▓▓▓▓▓▓▓▓▓░"],
            ].map(([system, status, bars]) => (
              <div
                key={system}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "11px",
                  fontFamily: "'Space Mono', monospace",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "6px",
                }}
              >
                <span style={{ width: "60px", fontSize: "11px", fontWeight: 600 }}>{system}</span>
                <span style={{ color: "rgba(0,255,209,0.7)", fontSize: "13px", letterSpacing: "-0.05em" }}>{bars}</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px", fontWeight: 500 }}>{status}</span>
              </div>
            ))}
          </div>
          
          {/* Command interface */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 18px",
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(0,255,209,0.3)",
              borderLeft: "3px solid rgba(0,255,209,0.8)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  background: "rgba(0,255,209,0.8)",
                  boxShadow: "0 0 10px rgba(0,255,209,0.6)",
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: "'Space Mono', monospace",
                  color: "rgba(0,255,209,0.9)",
                  letterSpacing: "0.05em",
                }}
              >
                [CONNECT]
              </span>
            </div>
            <span
              style={{
                fontSize: "12px",
                fontFamily: "'Space Mono', monospace",
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.05em",
              }}
            >
              ► ARACH.IO
            </span>
          </div>
        </div>
        
        {/* Right side - Polaroid with photo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {/* Polaroid frame */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "white",
              padding: "10px 10px 0 10px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
              width: "380px",
            }}
          >
            {/* Color photo */}
            <img
              src={"https://arach.io/assets/arach.jpg"}
              alt={SITE.author}
              width={360}
              height={360}
              style={{
                display: "block",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            />
            
            {/* Military spec sheet caption */}
            <div
              style={{
                width: "360px",
                height: "140px",
                padding: "14px 14px 10px 14px",
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
                  marginBottom: "10px",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "11px", letterSpacing: "0.05em" }}>
                  ARACH_TCHOUPANI
                </span>
                <span style={{ fontSize: "9px", color: "#666", letterSpacing: "0.1em" }}>
                  CLASS_MILLENNIAL
                </span>
              </div>
              
              {/* Specs grid */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px 0",
                  fontSize: "10px",
                  width: "100%",
                }}
              >
                {[
                  ["TYPE:", "FOUNDER"],
                  ["STACK:", "FULL"],
                  ["AI/ML:", "RLHF"],
                  ["EST:", "2010"],
                  ["LOC:", "SF_BAY"],
                  ["STATUS:", "VERY_ONLINE"]
                ].map(([label, value], index) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flex: index % 2 === 0 ? "0 0 48%" : "0 0 52%",
                      paddingRight: index % 2 === 0 ? "8px" : "0",
                    }}
                  >
                    <span style={{ 
                      color: "#999", 
                      textTransform: "uppercase", 
                      letterSpacing: "0.05em", 
                      fontSize: "9px",
                      textAlign: "left",
                    }}>
                      {label}
                    </span>
                    <span style={{ 
                      fontWeight: 600, 
                      color: "#333", 
                      fontSize: "10px",
                      textAlign: "right",
                    }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};