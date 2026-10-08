import React, { useCallback, useLayoutEffect, useRef, useState } from "react";

interface ImageCompareSliderProps {
  leftSrc: string;
  rightSrc: string;
  alt?: string;
}

/** 80% day / 20% night until the frame hits the top, then extra gesture wipes to full night. */
const START = 80;
const END = 0;
const SCRUB_VH = 65;
const PIN_SLACK = 36;

const ImageCompareSlider: React.FC<ImageCompareSliderProps> = ({
  leftSrc,
  rightSrc,
  alt = "Before and after comparison",
}) => {
  const [pos, setPos] = useState(START);
  const [headerH, setHeaderH] = useState(56);
  const dragging = useRef(false);
  const reduceMotionRef = useRef(false);
  const headerHRef = useRef(56);
  const posRef = useRef(START);
  const frame = useRef<HTMLDivElement>(null);
  const lastTouchY = useRef<number | null>(null);

  const commitPos = useCallback((next: number) => {
    const clamped = Math.min(100, Math.max(0, next));
    posRef.current = clamped;
    setPos(clamped);
  }, []);

  const measureHeader = useCallback(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const h = header.getBoundingClientRect().height;
    headerHRef.current = h;
    setHeaderH(h);
  }, []);

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = frame.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      commitPos(((clientX - rect.left) / rect.width) * 100);
    },
    [commitPos]
  );

  useLayoutEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      reduceMotionRef.current = motion.matches;
    };
    syncMotion();
    motion.addEventListener("change", syncMotion);
    measureHeader();

    const scrubPx = () => window.innerHeight * (SCRUB_VH / 100);

    const applyDelta = (deltaPx: number) => {
      const range = START - END;
      const next = posRef.current - (deltaPx / scrubPx()) * range;
      const clamped = Math.min(START, Math.max(END, next));
      posRef.current = clamped;
      setPos(clamped);
      return clamped;
    };

    const pinState = () => {
      const el = frame.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const header = headerHRef.current;
      const g = rect.top - header;
      return {
        g,
        hitTop: rect.top <= header + PIN_SLACK,
        visible: rect.bottom > header + 80,
      };
    };

    const alignToPin = (g: number) => {
      if (Math.abs(g) > 0.5) {
        window.scrollBy({ top: g, behavior: "instant" });
      }
    };

    const tryStall = (deltaPx: number, prevent: () => void) => {
      if (reduceMotionRef.current || dragging.current || deltaPx === 0) {
        return false;
      }
      const pin = pinState();
      if (!pin || !pin.hitTop || !pin.visible) return false;

      const down = deltaPx > 0;
      const current = posRef.current;

      if (down && current > END) {
        prevent();
        alignToPin(pin.g);
        const prev = current;
        const next = applyDelta(deltaPx);
        if (next === END && prev > END) {
          const used = ((prev - END) / (START - END)) * scrubPx();
          const leftover = deltaPx - used;
          if (leftover > 1) window.scrollBy({ top: leftover, behavior: "instant" });
        }
        return true;
      }

      if (!down && current < START) {
        prevent();
        alignToPin(pin.g);
        const prev = current;
        const next = applyDelta(deltaPx);
        if (next === START && prev < START) {
          const used = ((START - prev) / (START - END)) * scrubPx();
          const leftover = deltaPx + used;
          if (leftover < -1) window.scrollBy({ top: leftover, behavior: "instant" });
        }
        return true;
      }

      return false;
    };

    const onWheel = (e: WheelEvent) => {
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;
      if (e.deltaMode === 2) delta *= window.innerHeight;
      tryStall(delta, () => {
        if (e.cancelable) e.preventDefault();
      });
    };

    const onTouchStart = (e: TouchEvent) => {
      lastTouchY.current = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY;
      if (y == null || lastTouchY.current == null) return;
      const delta = lastTouchY.current - y;
      lastTouchY.current = y;
      tryStall(delta, () => {
        if (e.cancelable) e.preventDefault();
      });
    };
    const onTouchEnd = () => {
      lastTouchY.current = null;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const page = window.innerHeight * 0.85;
      const map: Record<string, number> = {
        PageDown: page,
        PageUp: -page,
        ArrowDown: 48,
        ArrowUp: -48,
        " ": page,
      };
      const delta = map[e.key];
      if (delta == null) return;
      tryStall(delta, () => e.preventDefault());
    };

    const onScroll = () => {
      if (dragging.current || reduceMotionRef.current) return;
      const el = frame.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const h = headerHRef.current;
      const current = posRef.current;
      const g = top - h;
      const wiping = current > END && current < START;

      if (wiping && Math.abs(g) > 1 && el.getBoundingClientRect().bottom > h + 80) {
        window.scrollBy({ top: g, behavior: "instant" });
        return;
      }

      if (top > h + PIN_SLACK) {
        if (current !== START) {
          posRef.current = START;
          setPos(START);
        }
      } else if (el.getBoundingClientRect().bottom < h) {
        if (current !== END) {
          posRef.current = END;
          setPos(END);
        }
      }
    };

    const onResize = () => {
      measureHeader();
      onScroll();
    };

    onScroll();
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      motion.removeEventListener("change", syncMotion);
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [measureHeader]);

  useLayoutEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      setFromClientX(e.clientX);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [setFromClientX]);

  return (
    <div
      ref={frame}
      id="dara-compare"
      className="relative my-12 w-full overflow-hidden rounded-sm border border-gray-300 dark:border-gray-700 select-none"
      style={{
        aspectRatio: "16 / 9",
        cursor: "col-resize",
        touchAction: "pan-y",
        scrollMarginTop: headerH,
      }}
      onPointerDown={e => {
        if (e.pointerType === "touch") return;
        dragging.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        setFromClientX(e.clientX);
      }}
    >
      <img
        src={rightSrc}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <img
        src={leftSrc}
        alt={alt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      <div
        className="absolute top-0 bottom-0 z-10"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="h-full w-px bg-white/90" />
        <div
          className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-black/40 text-[10px] text-white backdrop-blur-sm"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-label="Comparison position"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === "ArrowLeft") commitPos(posRef.current - 3);
            if (e.key === "ArrowRight") commitPos(posRef.current + 3);
          }}
        >
          ‹ ›
        </div>
      </div>
    </div>
  );
};

export default ImageCompareSlider;
