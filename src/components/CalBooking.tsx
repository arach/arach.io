import { useEffect, useRef, useState } from "react";

export default function CalBooking() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    // Only initialize chat namespace when button is hovered or about to be clicked
    if (isHovered && typeof window !== 'undefined' && (window as any).Cal) {
      // Check if Cal has the chat namespace
      if ((window as any).Cal.ns && (window as any).Cal.ns.chat) {
        (window as any).Cal.ns.chat("preload", {
          calLink: "arach/chat"
        });
      } else {
        // If namespace doesn't exist, create it
        (window as any).Cal("init", "chat", {origin: "https://cal.com"});
        // Then try preloading after a small delay
        setTimeout(() => {
          if ((window as any).Cal.ns && (window as any).Cal.ns.chat) {
            (window as any).Cal.ns.chat("preload", {
              calLink: "arach/chat"
            });
          }
        }, 100);
      }
    }
  }, [isHovered]);

  return (
    <button
      ref={buttonRef}
      data-cal-link="arach/chat"
      data-cal-namespace="chat"
      data-cal-config='{"layout":"month_view"}'
      className="cal-booking-button inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium transition-all"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        const target = e.currentTarget;
        target.style.background = 'rgba(255, 255, 255, 0.08)';
        target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
        target.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget;
        target.style.background = 'rgba(255, 255, 255, 0.05)';
        target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
        target.style.transform = 'translateY(0)';
      }}
      onFocus={() => setIsHovered(true)}
    >
      Connect
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="ml-2.5 h-4 w-4 transition-transform hover:animate-bounce"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 17L17 7M17 7H7M17 7V17"
        />
      </svg>
    </button>
  );
}