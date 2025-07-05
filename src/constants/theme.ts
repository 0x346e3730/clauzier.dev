export const THEME_COLORS = {
  PRIMARY: '#00ff00',
  SECONDARY: '#0f0',
  ACCENT: '#ff00ff',
  DARK: '#001100',
  DARKER: '#000800',
  TERMINAL: '#0C0C0C',
  BACKGROUND: '#000000',
} as const;

export const FONT_FAMILIES = {
  NEON: 'Monaspace Neon',
  RADON: 'Monaspace Radon',
  ARGON: 'Monaspace Argon',
  TERMINAL: 'VT323',
  CYBER: 'Share Tech Mono',
} as const;

export const ANIMATIONS = {
  TERMINAL_BLINK: 'blink 1s step-end infinite',
  SCAN_LINE: 'scan 2s linear infinite',
  GLITCH: 'glitch 1s linear infinite',
  MATRIX: 'matrix 20s linear infinite',
  RETROWAVE: 'retrowave 3s linear infinite',
  GLOW: 'glow 2s ease-in-out infinite alternate',
} as const;

export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;

export const Z_INDEX = {
  BACKGROUND: -1,
  BASE: 0,
  OVERLAY: 10,
  MODAL: 20,
  TOOLTIP: 30,
} as const;