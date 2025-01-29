/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				'hacker': {
					'primary': '#00ff00',  // Classic terminal green
					'secondary': '#0f0',    // Bright neon green
					'dark': '#001100',      // Dark green background
					'darker': '#000800',    // Darker background
					'accent': '#ff00ff',    // Cyberpunk accent
					'terminal': '#0C0C0C',  // Terminal black
				}
			},
			fontFamily: {
				'terminal': ['VT323', 'Courier New', 'monospace'],
				'cyber': ['Share Tech Mono', 'monospace']
			},
			animation: {
				'terminal-blink': 'blink 1s step-end infinite',
				'scan-line': 'scan 2s linear infinite',
				'glitch': 'glitch 1s linear infinite',
				'matrix': 'matrix 20s linear infinite',
				'retrowave': 'retrowave 3s linear infinite',
				'glow': 'glow 2s ease-in-out infinite alternate'
			},
			keyframes: {
				blink: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0' }
				},
				scan: {
					'from': { transform: 'translateY(-100%)' },
					'to': { transform: 'translateY(100%)' }
				},
				glitch: {
					'0%, 100%': { transform: 'translate(0)' },
					'20%': { transform: 'translate(-2px, 2px)' },
					'40%': { transform: 'translate(-2px, -2px)' },
					'60%': { transform: 'translate(2px, 2px)' },
					'80%': { transform: 'translate(2px, -2px)' }
				},
				matrix: {
					'0%': { backgroundPosition: '0% -100%' },
					'100%': { backgroundPosition: '0% 100%' }
				},
				retrowave: {
					'0%': { 
						backgroundPosition: '0% 0%'
					},
					'100%': { 
						backgroundPosition: '200% 0%'
					}
				},
				glow: {
					'from': {
						boxShadow: '0 0 20px rgba(255,45,149,0.5)',
						borderColor: 'rgba(255,45,149,1)'
					},
					'to': {
						boxShadow: '0 0 30px rgba(255,45,149,0.8)',
						borderColor: 'rgba(255,45,149,0.8)'
					}
				}
			},
			backgroundImage: {
				'matrix-rain': 'linear-gradient(180deg, rgba(0,255,0,0.15) 0%, rgba(0,255,0,0) 100%)'
			}
		},
	},
	plugins: [],
} 