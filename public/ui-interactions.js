// UI Interactions - Client-side behavior for components
// Loaded once globally and handles all interactive elements

function initCompanyLogosHover() {
  // Add hover interactions with event delegation
  const container = document.querySelector('.company-logos-container');
  
  if (container) {
    container.addEventListener('mouseover', (e) => {
      const item = e.target.closest('.company-item');
      if (item) item.classList.add('hovered');
    });
    
    container.addEventListener('mouseout', (e) => {
      const item = e.target.closest('.company-item');
      if (item) item.classList.remove('hovered');
    });
  }
}

// Initialize all interactions
function initUIInteractions() {
  initCompanyLogosHover();
  // Add other UI interactions here as needed
}

// Run on initial page load
window.addEventListener('DOMContentLoaded', initUIInteractions);

// Re-run on Astro view transitions
document.addEventListener('astro:after-swap', initUIInteractions);
