import { useEffect } from "react";

export default function CalBooking() {
  useEffect(() => {
    // Initialize Cal.com when component mounts
    if (typeof window !== 'undefined' && (window as any).Cal) {
      (window as any).Cal("init", {origin:"https://cal.com"});
      
      // Pre-load the chat namespace
      (window as any).Cal.ns.chat("preload", {
        calLink: "arach/chat"
      });
    }
  }, []);

  return (
    <button
      data-cal-link="arach/chat"
      data-cal-namespace="chat"
      data-cal-config='{"layout":"month_view"}'
      className="cal-booking-button inline-flex items-center rounded-lg bg-skin-card px-5 py-2.5 text-sm font-medium transition-all border border-skin-border shadow-sm hover:bg-skin-card-muted hover:border-skin-accent hover:-translate-y-px hover:shadow-md"
      style={{
        borderColor: 'rgb(var(--color-border))',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
      }}
    >
      Connect With Me
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