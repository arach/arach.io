import { useEffect, useRef, useState, useCallback } from "react";
import {
  toLuminance,
  applyAtkinson,
  applyFloydSteinberg,
  applyOrdered,
  type DitherAlgorithm,
} from "./DitheredPortrait";

interface BraillePortraitProps {
  src: string;
}

// Braille dot positions in a 2x4 grid mapped to Unicode offset bits:
//   (0,0)=0x01  (1,0)=0x08
//   (0,1)=0x02  (1,1)=0x10
//   (0,2)=0x04  (1,2)=0x20
//   (0,3)=0x40  (1,3)=0x80
const BRAILLE_BASE = 0x2800;
const DOT_MAP = [
  [0x01, 0x08],
  [0x02, 0x10],
  [0x04, 0x20],
  [0x40, 0x80],
];

// Built-in charset presets (dark → light density)
const CHARSET_PRESETS: Record<string, string> = {
  braille: "", // special: uses 2×4 dot encoding
  ascii: " .:-=+*%#@",
  blocks: " ░▒▓█",
  dots: " ⠁⠃⠇⡇⣇⣧⣷⣿",
  minimal: " .+#",
};

function toBraille(
  dithered: Uint8Array,
  w: number,
  h: number,
  invert: boolean
): string {
  const cols = Math.floor(w / 2);
  const rows = Math.floor(h / 4);
  const lines: string[] = [];

  for (let row = 0; row < rows; row++) {
    let line = "";
    for (let col = 0; col < cols; col++) {
      let code = 0;
      for (let dy = 0; dy < 4; dy++) {
        for (let dx = 0; dx < 2; dx++) {
          const px = col * 2 + dx;
          const py = row * 4 + dy;
          if (px < w && py < h) {
            const val = dithered[py * w + px];
            const on = invert ? val === 0 : val > 0;
            if (on) code |= DOT_MAP[dy][dx];
          }
        }
      }
      line += String.fromCharCode(BRAILLE_BASE + code);
    }
    lines.push(line);
  }
  return lines.join("\n");
}

// Convert grayscale to ASCII art using a character density ramp
// Each pixel maps to one character (no 2×4 grouping like braille)
function toAsciiArt(
  gray: Float32Array,
  w: number,
  h: number,
  chars: string,
  invert: boolean
): string {
  const ramp = invert ? chars.split("").reverse().join("") : chars;
  const lines: string[] = [];
  for (let y = 0; y < h; y++) {
    let line = "";
    for (let x = 0; x < w; x++) {
      const val = gray[y * w + x] / 255;
      const idx = Math.min(Math.floor(val * ramp.length), ramp.length - 1);
      line += ramp[idx];
    }
    lines.push(line);
  }
  return lines.join("\n");
}

function bilinearDownscale(
  gray: Float32Array,
  fullW: number,
  fullH: number,
  targetW: number,
  targetH: number
): Float32Array {
  const downscaled = new Float32Array(targetW * targetH);
  for (let y = 0; y < targetH; y++) {
    for (let x = 0; x < targetW; x++) {
      const sx = (x / targetW) * fullW;
      const sy = (y / targetH) * fullH;
      const x0 = Math.floor(sx);
      const y0 = Math.floor(sy);
      const x1 = Math.min(x0 + 1, fullW - 1);
      const y1 = Math.min(y0 + 1, fullH - 1);
      const fx = sx - x0;
      const fy = sy - y0;

      const v00 = gray[y0 * fullW + x0];
      const v10 = gray[y0 * fullW + x1];
      const v01 = gray[y1 * fullW + x0];
      const v11 = gray[y1 * fullW + x1];

      downscaled[y * targetW + x] =
        v00 * (1 - fx) * (1 - fy) +
        v10 * fx * (1 - fy) +
        v01 * (1 - fx) * fy +
        v11 * fx * fy;
    }
  }
  return downscaled;
}

function getParam(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const params = new URLSearchParams(window.location.search);
  return params.get(key) ?? fallback;
}

function hasParam(key: string): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has(key);
}

export default function BraillePortrait({ src }: BraillePortraitProps) {
  const [cols, setCols] = useState(() => parseInt(getParam("cols", "40"), 10));
  const [threshold, setThreshold] = useState(() =>
    parseInt(getParam("threshold", "100"), 10)
  );
  const [algorithm, setAlgorithm] = useState<DitherAlgorithm>(
    () => getParam("algorithm", "atkinson") as DitherAlgorithm
  );
  const [invert, setInvert] = useState(() => hasParam("invert"));
  // Vertical stretch compensates for monospace char cell aspect ratio
  // A braille char is 2×4 dots but the cell is ~0.6:1, so vertical needs ~1.2× boost
  const [vStretch, setVStretch] = useState(() =>
    parseFloat(getParam("vstretch", "1.35"))
  );
  const [charset, setCharset] = useState(() => getParam("chars", "braille"));
  const [brailleText, setBrailleText] = useState("");
  const [copied, setCopied] = useState(false);
  const [textColor, setTextColor] = useState("#ECCF7C");
  const [bgColor, setBgColor] = useState("#0E0E0D");

  const grayscaleRef = useRef<Float32Array | null>(null);
  const imgDimsRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const [loaded, setLoaded] = useState(false);

  // Read template-aware colors
  const readColors = useCallback(() => {
    const style = getComputedStyle(document.documentElement);
    const template =
      document.documentElement.getAttribute("data-template") || "classic";
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";

    let text = "";
    let bg = "";

    if (template === "terminal") {
      text = style.getPropertyValue("--term-text").trim();
      bg = style.getPropertyValue("--term-bg").trim();
    } else if (template === "industrial") {
      text = style.getPropertyValue("--ind-text").trim();
      bg = style.getPropertyValue("--ind-bg").trim();
    } else {
      // classic fallback
      text = isDark ? "#e4e4e7" : "#18181b";
      bg = isDark ? "#18181b" : "#fafafa";
    }

    if (text) setTextColor(text);
    if (bg) setBgColor(bg);
  }, []);

  useEffect(() => {
    readColors();
    const observer = new MutationObserver(() => readColors());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-template"],
    });
    window.addEventListener("theme-change", readColors);
    return () => {
      observer.disconnect();
      window.removeEventListener("theme-change", readColors);
    };
  }, [readColors]);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const offscreen = document.createElement("canvas");
      offscreen.width = img.naturalWidth;
      offscreen.height = img.naturalHeight;
      const ctx = offscreen.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(
        0,
        0,
        img.naturalWidth,
        img.naturalHeight
      );
      const data = imageData.data;

      const gray = new Float32Array(img.naturalWidth * img.naturalHeight);
      for (let i = 0; i < gray.length; i++) {
        const idx = i * 4;
        gray[i] = toLuminance(data[idx], data[idx + 1], data[idx + 2]);
        const alpha = data[idx + 3] / 255;
        gray[i] = gray[i] * alpha;
      }

      grayscaleRef.current = gray;
      imgDimsRef.current = { w: img.naturalWidth, h: img.naturalHeight };
      setLoaded(true);
    };
    img.src = src;
  }, [src]);

  // Resolve active character set
  const activeChars = CHARSET_PRESETS[charset] !== undefined ? charset : "custom";
  const ramp = activeChars === "braille" ? "" : (CHARSET_PRESETS[charset] ?? charset);
  const isBrailleMode = activeChars === "braille";

  // Render whenever params change
  useEffect(() => {
    if (!loaded || !grayscaleRef.current) return;

    const { w: fullW, h: fullH } = imgDimsRef.current;
    const gray = grayscaleRef.current;

    if (isBrailleMode) {
      // Braille: 2 dots wide × 4 dots tall per char
      const targetW = cols * 2;
      const scale = targetW / fullW;
      const targetH = Math.round(fullH * scale * vStretch);

      const downscaled = bilinearDownscale(gray, fullW, fullH, targetW, targetH);

      let dithered: Uint8Array;
      switch (algorithm) {
        case "floyd-steinberg":
          dithered = applyFloydSteinberg(downscaled, targetW, targetH, threshold);
          break;
        case "ordered":
          dithered = applyOrdered(downscaled, targetW, targetH, threshold);
          break;
        case "atkinson":
        default:
          dithered = applyAtkinson(downscaled, targetW, targetH, threshold);
          break;
      }

      setBrailleText(toBraille(dithered, targetW, targetH, invert));
    } else {
      // ASCII mode: 1 char per pixel, cols = output width
      const targetW = cols;
      const scale = targetW / fullW;
      // Halve vertical for char cell aspect ratio (~2:1 h:w in monospace)
      const targetH = Math.round(fullH * scale * vStretch * 0.5);

      const downscaled = bilinearDownscale(gray, fullW, fullH, targetW, targetH);
      setBrailleText(toAsciiArt(downscaled, targetW, targetH, ramp, invert));
    }
  }, [loaded, cols, threshold, algorithm, invert, vStretch, charset, isBrailleMode, ramp]);

  // Update URL params on change
  useEffect(() => {
    if (!loaded) return;
    const params = new URLSearchParams(window.location.search);
    params.set("cols", String(cols));
    params.set("threshold", String(threshold));
    params.set("algorithm", algorithm);
    params.set("vstretch", vStretch.toFixed(2));
    params.set("chars", charset);
    if (invert) {
      params.set("invert", "");
    } else {
      params.delete("invert");
    }
    const newUrl =
      window.location.pathname + "?" + params.toString().replace(/=(?=&|$)/g, "");
    history.replaceState(null, "", newUrl);
  }, [loaded, cols, threshold, algorithm, invert, vStretch, charset]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(brailleText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const algLabels: { key: DitherAlgorithm; label: string }[] = [
    { key: "atkinson", label: "ATK" },
    { key: "floyd-steinberg", label: "F-S" },
    { key: "ordered", label: "ORD" },
  ];

  const controlStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    opacity: 0.9,
  };

  const sliderLabel: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
  };

  return (
    <div
      style={{
        fontFamily: '"Berkeley Mono", "Fira Code", "JetBrains Mono", monospace',
        color: textColor,
        display: "inline-block",
        maxWidth: "100%",
      }}
    >
      {/* Row 1: sliders + copy */}
      <div
        style={{
          ...controlStyle,
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <label style={sliderLabel}>
          <span style={{ opacity: 0.6 }}>cols</span>
          <input
            type="range"
            min={16}
            max={80}
            value={cols}
            onChange={e => setCols(Number(e.target.value))}
            style={{ width: "60px", accentColor: textColor, cursor: "pointer" }}
          />
          <span>{cols}</span>
        </label>

        <label style={sliderLabel}>
          <span style={{ opacity: 0.6 }}>thresh</span>
          <input
            type="range"
            min={0}
            max={255}
            value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
            style={{ width: "60px", accentColor: textColor, cursor: "pointer" }}
          />
          <span>{threshold}</span>
        </label>

        <label style={sliderLabel}>
          <span style={{ opacity: 0.6 }}>stretch</span>
          <input
            type="range"
            min={80}
            max={200}
            value={Math.round(vStretch * 100)}
            onChange={e => setVStretch(Number(e.target.value) / 100)}
            style={{ width: "50px", accentColor: textColor, cursor: "pointer" }}
          />
          <span>{vStretch.toFixed(2)}</span>
        </label>

      </div>

      {/* Row 2: algo + invert */}
      <div
        style={{
          ...controlStyle,
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <span style={{ opacity: 0.6 }}>algo</span>
        {algLabels.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setAlgorithm(key)}
            style={{
              background: "transparent",
              border: "none",
              color: algorithm === key ? textColor : `${textColor}55`,
              fontFamily: "inherit",
              fontSize: "0.75rem",
              cursor: "pointer",
              padding: "0 0.125rem",
            }}
          >
            [{algorithm === key ? "\u00d7" : "\u00A0"}] {label}
          </button>
        ))}

        <button
          onClick={() => setInvert(!invert)}
          style={{
            background: "transparent",
            border: "none",
            color: invert ? textColor : `${textColor}55`,
            fontFamily: "inherit",
            fontSize: "0.75rem",
            cursor: "pointer",
            padding: "0 0.125rem",
          }}
        >
          [{invert ? "\u00d7" : "\u00A0"}] INV
        </button>
      </div>

      {/* Row 3: charset */}
      <div
        style={{
          ...controlStyle,
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          alignItems: "center",
          marginBottom: "0.75rem",
        }}
      >
        <span style={{ opacity: 0.6 }}>chars</span>
        {Object.keys(CHARSET_PRESETS).map(key => (
          <button
            key={key}
            onClick={() => setCharset(key)}
            style={{
              background: "transparent",
              border: "none",
              color: charset === key ? textColor : `${textColor}55`,
              fontFamily: "inherit",
              fontSize: "0.75rem",
              cursor: "pointer",
              padding: "0 0.125rem",
            }}
          >
            [{charset === key ? "\u00d7" : "\u00A0"}] {key}
          </button>
        ))}
      </div>

      {/* Portrait output */}
      {!loaded ? (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            opacity: 0.5,
          }}
        >
          <span style={{ animation: "blink 1.2s step-end infinite" }}>
            loading...
          </span>
        </div>
      ) : (
        <div style={{ position: "relative", display: "inline-block" }}>
          <button
            onClick={handleCopy}
            style={{
              position: "absolute",
              top: "0.4rem",
              right: "0.4rem",
              background: `${bgColor}cc`,
              border: `1px solid ${textColor}33`,
              color: textColor,
              fontFamily: "inherit",
              fontSize: "0.6875rem",
              cursor: "pointer",
              padding: "0.15rem 0.4rem",
              zIndex: 1,
              opacity: copied ? 1 : 0.6,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={e => (e.currentTarget.style.opacity = copied ? "1" : "0.6")}
          >
            {copied ? "copied!" : "copy"}
          </button>
          <pre
            style={{
              fontFamily: "inherit",
              fontSize: "0.625rem",
              lineHeight: 0.85,
              letterSpacing: "0.05em",
              whiteSpace: "pre",
              overflowX: "auto",
              display: "inline-block",
              margin: 0,
              padding: "1rem",
              background: bgColor,
              border: `1px solid ${textColor}22`,
              userSelect: "all",
            }}
          >
            {brailleText}
          </pre>
        </div>
      )}
    </div>
  );
}
