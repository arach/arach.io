import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function CalBooking() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ "namespace": "chat" });
      cal("ui", { "hideEventTypeDetails": false, "layout": "month_view" });
    })();
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes quickBounce {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-2px) rotate(-5deg);
          }
          50% {
            transform: translateY(-3px) rotate(5deg);
          }
          75% {
            transform: translateY(-1px) rotate(-2deg);
          }
        }
        
        .cal-button {
          display: inline-flex;
          align-items: center;
          border-radius: 0.5rem;
          background-color: rgb(var(--color-card));
          padding: 0.625rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
          border: 1px solid rgb(var(--color-border));
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }
        
        .cal-button:hover {
          background-color: rgb(var(--color-card-muted));
          border-color: rgb(var(--color-accent));
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .cal-button-icon {
          margin-left: 0.625rem;
          height: 1rem;
          width: 1rem;
          transition: transform 0.2s ease;
        }
        
        .cal-button:hover .cal-button-icon {
          animation: quickBounce 0.4s ease-out;
        }
      `}</style>
      <button
        data-cal-namespace="chat"
        data-cal-link="arach/chat"
        data-cal-config='{"layout":"month_view"}'
        className="cal-button"
      >
        Connect With Me
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="cal-button-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 17L17 7M17 7H7M17 7V17"
          ></path>
        </svg>
      </button>
    </>
  );
}