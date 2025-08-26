(function() {
  let calInitialized = false;
  let calScriptLoaded = false;
  
  // Create the Cal function stub
  window.Cal = window.Cal || function() {
    const args = arguments;
    window.Cal.q = window.Cal.q || [];
    window.Cal.q.push(args);
    
    // Lazy load Cal.com when first called
    if (!calScriptLoaded) {
      loadCalScript();
    }
  };
  
  // Set up namespaces
  window.Cal.ns = {};
  window.Cal.q = [];
  
  function loadCalScript() {
    if (calScriptLoaded) return;
    calScriptLoaded = true;
    
    // Use Intersection Observer or user interaction to trigger loading
    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    
    script.onload = function() {
      // Process queued calls
      if (window.Cal.q) {
        window.Cal.q.forEach(args => {
          window.Cal.apply(null, args);
        });
      }
      
      // Initialize Cal.com with settings
      window.Cal("init", { origin: "https://cal.com" });
      window.Cal("init", "chat", { origin: "https://cal.com" });
      window.Cal("ui", {
        "styles": {"branding": {"brandColor": "#000000"}},
        "hideEventTypeDetails": false,
        "layout": "month_view"
      });
      
      calInitialized = true;
    };
    
    document.head.appendChild(script);
  }
  
  // Trigger loading on user interaction or when Cal button is visible
  function initCalOnInteraction() {
    // Check if there are any Cal.com elements on the page
    const calElements = document.querySelectorAll('[data-cal-link], [data-cal-namespace], .cal-booking-button');
    
    if (calElements.length > 0) {
      // Use Intersection Observer to load when Cal element is visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !calScriptLoaded) {
            loadCalScript();
            observer.disconnect();
          }
        });
      }, {
        rootMargin: '200px' // Load when within 200px of viewport
      });
      
      calElements.forEach(el => observer.observe(el));
      
      // Also load on first user interaction
      const interactionEvents = ['mousedown', 'touchstart', 'scroll', 'keydown'];
      const loadOnInteraction = () => {
        if (!calScriptLoaded) {
          loadCalScript();
        }
        interactionEvents.forEach(event => {
          document.removeEventListener(event, loadOnInteraction);
        });
      };
      
      interactionEvents.forEach(event => {
        document.addEventListener(event, loadOnInteraction, { once: true, passive: true });
      });
      
      // Fallback: Load after 3 seconds if no interaction
      setTimeout(() => {
        if (!calScriptLoaded) {
          loadCalScript();
        }
      }, 3000);
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalOnInteraction);
  } else {
    initCalOnInteraction();
  }
})();