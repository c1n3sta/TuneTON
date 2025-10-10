// This utility ensures fonts are loaded only once
let fontsLoaded = false;

export function loadMontserratFont() {
  if (typeof document !== 'undefined' && !fontsLoaded) {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@600&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    fontsLoaded = true;
  }

  return {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontWeight: 600,
  };
}
