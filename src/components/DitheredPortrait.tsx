import { useEffect, useRef, useState, useCallback } from "react";

type DitherAlgorithm = "floyd-steinberg" | "atkinson" | "ordered";

interface DitheredPortraitProps {
  src: string;
  width?: number;
  height?: number;
  algorithm?: DitherAlgorithm;
  pixelSize?: number;
  threshold?: number;
  colorLight?: string;
  colorDark?: string;
  showControls?: boolean;
  className?: string;
}

// Bayer 4x4 ordered dithering matrix
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function toLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function applyFloydSteinberg(
  buf: Float32Array,
  w: number,
  h: number,
  threshold: number
): Uint8Array {
  const out = new Uint8Array(w * h);
  const work = new Float32Array(buf);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const old = work[i];
      const val = old > threshold ? 255 : 0;
      out[i] = val;
      const err = old - val;

      if (x + 1 < w) work[i + 1] += err * (7 / 16);
      if (y + 1 < h) {
        if (x - 1 >= 0) work[(y + 1) * w + (x - 1)] += err * (3 / 16);
        work[(y + 1) * w + x] += err * (5 / 16);
        if (x + 1 < w) work[(y + 1) * w + (x + 1)] += err * (1 / 16);
      }
    }
  }
  return out;
}

function applyAtkinson(
  buf: Float32Array,
  w: number,
  h: number,
  threshold: number
): Uint8Array {
  const out = new Uint8Array(w * h);
  const work = new Float32Array(buf);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const old = work[i];
      const val = old > threshold ? 255 : 0;
      out[i] = val;
      // Atkinson distributes 6/8 of error (discards 1/4)
      const err = (old - val) / 8;

      if (x + 1 < w) work[i + 1] += err;
      if (x + 2 < w) work[i + 2] += err;
      if (y + 1 < h) {
        if (x - 1 >= 0) work[(y + 1) * w + (x - 1)] += err;
        work[(y + 1) * w + x] += err;
        if (x + 1 < w) work[(y + 1) * w + (x + 1)] += err;
      }
      if (y + 2 < h) {
        work[(y + 2) * w + x] += err;
      }
    }
  }
  return out;
}

function applyOrdered(
  buf: Float32Array,
  w: number,
  h: number,
  threshold: number
): Uint8Array {
  const out = new Uint8Array(w * h);
  // Scale threshold to shift the overall brightness
  const bias = (threshold - 128) / 128; // -1 to 1

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const normalized = buf[i] / 255;
      const bayerValue = BAYER_4X4[y % 4][x % 4] / 16 - 0.5;
      out[i] = normalized + bayerValue + bias * 0.5 > 0.5 ? 255 : 0;
    }
  }
  return out;
}

export default function DitheredPortrait({
  src,
  width = 200,
  height = 200,
  algorithm: initialAlgorithm = "atkinson",
  pixelSize: initialPixelSize = 2,
  threshold: initialThreshold = 128,
  colorLight = "#ECCF7C",
  colorDark = "#0E0E0D",
  showControls = false,
  className = "",
}: DitheredPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grayscaleRef = useRef<Float32Array | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [algorithm, setAlgorithm] = useState<DitherAlgorithm>(initialAlgorithm);
  const [pixelSize, setPixelSize] = useState(initialPixelSize);
  const [threshold, setThreshold] = useState(initialThreshold);
  const imgSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  // Theme-aware colors: read CSS variables, fallback to props
  const [activeLight, setActiveLight] = useState(colorLight);
  const [activeDark, setActiveDark] = useState(colorDark);

  const readThemeColors = useCallback(() => {
    const style = getComputedStyle(document.documentElement);
    const text = style.getPropertyValue("--term-text").trim();
    const bg = style.getPropertyValue("--term-bg").trim();
    if (text) setActiveLight(text);
    if (bg) setActiveDark(bg);
  }, []);

  useEffect(() => {
    readThemeColors();
    const observer = new MutationObserver(() => readThemeColors());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    window.addEventListener("theme-change", readThemeColors);
    return () => {
      observer.disconnect();
      window.removeEventListener("theme-change", readThemeColors);
    };
  }, [readThemeColors]);

  // Load image and extract grayscale
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Draw to offscreen canvas to get pixel data
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const ctx = offscreen.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Extract luminance
      const gray = new Float32Array(width * height);
      for (let i = 0; i < gray.length; i++) {
        const idx = i * 4;
        gray[i] = toLuminance(data[idx], data[idx + 1], data[idx + 2]);
        // Factor in alpha — transparent pixels become dark
        const alpha = data[idx + 3] / 255;
        gray[i] = gray[i] * alpha;
      }

      grayscaleRef.current = gray;
      imgSizeRef.current = { w: width, h: height };
      setLoaded(true);
    };
    img.src = src;
  }, [src, width, height]);

  // Dither and render
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const gray = grayscaleRef.current;
    if (!canvas || !gray) return;

    const ctx = canvas.getContext("2d")!;
    const { w: fullW, h: fullH } = imgSizeRef.current;

    // Downscale for dithering
    const dw = Math.ceil(fullW / pixelSize);
    const dh = Math.ceil(fullH / pixelSize);
    const downscaled = new Float32Array(dw * dh);

    for (let y = 0; y < dh; y++) {
      for (let x = 0; x < dw; x++) {
        // Average the pixel block
        let sum = 0;
        let count = 0;
        for (let dy = 0; dy < pixelSize; dy++) {
          for (let dx = 0; dx < pixelSize; dx++) {
            const sx = x * pixelSize + dx;
            const sy = y * pixelSize + dy;
            if (sx < fullW && sy < fullH) {
              sum += gray[sy * fullW + sx];
              count++;
            }
          }
        }
        downscaled[y * dw + x] = sum / count;
      }
    }

    // Apply dithering algorithm
    let dithered: Uint8Array;
    switch (algorithm) {
      case "floyd-steinberg":
        dithered = applyFloydSteinberg(downscaled, dw, dh, threshold);
        break;
      case "ordered":
        dithered = applyOrdered(downscaled, dw, dh, threshold);
        break;
      case "atkinson":
      default:
        dithered = applyAtkinson(downscaled, dw, dh, threshold);
        break;
    }

    // Paint to canvas
    const lightRgb = hexToRgb(activeLight);
    const darkRgb = hexToRgb(activeDark);

    canvas.width = fullW;
    canvas.height = fullH;

    ctx.fillStyle = activeDark;
    ctx.fillRect(0, 0, fullW, fullH);

    for (let y = 0; y < dh; y++) {
      for (let x = 0; x < dw; x++) {
        const val = dithered[y * dw + x];
        const rgb = val > 0 ? lightRgb : darkRgb;
        ctx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
        ctx.fillRect(
          x * pixelSize,
          y * pixelSize,
          pixelSize,
          pixelSize
        );
      }
    }
  }, [algorithm, pixelSize, threshold, activeLight, activeDark]);

  useEffect(() => {
    if (loaded) render();
  }, [loaded, render]);

  const algLabels: { key: DitherAlgorithm; label: string }[] = [
    { key: "atkinson", label: "ATK" },
    { key: "floyd-steinberg", label: "F-S" },
    { key: "ordered", label: "ORD" },
  ];

  return (
    <div
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        lineHeight: 0,
      }}
    >
      {/* Loading state */}
      {!loaded && (
        <div
          style={{
            width,
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: activeDark,
            color: activeLight,
            fontFamily: "monospace",
            fontSize: "1.5rem",
          }}
        >
          <span style={{ animation: "blink 1.2s step-end infinite" }}>█</span>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          display: loaded ? "block" : "none",
          width: `${width}px`,
          height: `${height}px`,
          imageRendering: "pixelated",
        }}
      />

      {/* Controls toggle */}
      {showControls && loaded && (
        <button
          onClick={() => setControlsOpen(!controlsOpen)}
          aria-label="Toggle dithering controls"
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            background: `${activeDark}cc`,
            border: `1px solid ${activeLight}33`,
            color: controlsOpen ? activeLight : `${activeLight}88`,
            fontFamily: "monospace",
            fontSize: "0.75rem",
            padding: "2px 5px",
            cursor: "pointer",
            lineHeight: 1,
            zIndex: 2,
          }}
        >
          ⚙
        </button>
      )}

      {/* Controls panel */}
      {showControls && controlsOpen && (
        <div
          style={{
            position: "absolute",
            top: -4,
            left: `calc(100% + 8px)`,
            background: activeDark,
            border: `1px solid ${activeLight}33`,
            padding: "0.75rem 0.875rem",
            fontFamily: "monospace",
            fontSize: "0.6875rem",
            color: activeLight,
            lineHeight: 1.8,
            zIndex: 10,
            minWidth: "180px",
            whiteSpace: "nowrap",
          }}
        >
          {/* Panel label */}
          <div
            style={{
              position: "absolute",
              top: "-0.5em",
              left: "0.75rem",
              background: activeDark,
              padding: "0 0.375rem",
              color: `${activeLight}88`,
              fontSize: "0.5625rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            ─ CONTROLS ─
          </div>

          {/* Algorithm selector */}
          <div style={{ marginBottom: "0.5rem" }}>
            <span style={{ color: `${activeLight}88` }}>algo </span>
            {algLabels.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setAlgorithm(key)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: algorithm === key ? activeLight : `${activeLight}55`,
                  fontFamily: "monospace",
                  fontSize: "0.6875rem",
                  cursor: "pointer",
                  padding: "0 0.25rem",
                }}
              >
                [{algorithm === key ? "×" : "\u00A0"}] {label}
              </button>
            ))}
          </div>

          {/* Pixel size */}
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={{ color: `${activeLight}88` }}>
              px size{" "}
              <span style={{ color: activeLight }}>{pixelSize}</span>
            </label>
            <br />
            <input
              type="range"
              min={1}
              max={6}
              value={pixelSize}
              onChange={e => setPixelSize(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: activeLight,
                cursor: "pointer",
                height: "2px",
                marginTop: "4px",
              }}
            />
          </div>

          {/* Threshold */}
          <div>
            <label style={{ color: `${activeLight}88` }}>
              thresh{" "}
              <span style={{ color: activeLight }}>{threshold}</span>
            </label>
            <br />
            <input
              type="range"
              min={0}
              max={255}
              value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: activeLight,
                cursor: "pointer",
                height: "2px",
                marginTop: "4px",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
