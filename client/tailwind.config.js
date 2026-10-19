/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /* ── Verdeo-style brand palette ───────────────────────── */
        forest: '#1C3B2E',      // deep green — headers, hero, footer
        forestdeep: '#12261C',  // darkest green
        forestsoft: '#2C5344',  // hover green
        sage: '#D9E0A8',        // pale pistachio buttons
        sagehover: '#C8D28F',
        cream: '#FBF9F3',       // page background
        creamdeep: '#F3EEE1',   // alternate section background
        sand: '#E7E0CE',        // hairlines and borders
        ink: '#1F261D',         // primary copy
        muted: '#6E7462',       // secondary copy
        ember: '#B04A38',       // spicy / danger
        leaf: '#4E7A4A',        // veg / success

        /* legacy aliases kept so nothing renders unstyled */
        gold: '#C08A2E',        // ratings / prices
        goldlight: '#D8A63F',
        coal: '#FFFFFF',
        slate2: '#F3EEE1',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'Jost', 'system-ui', 'sans-serif'],
        script: ['"Alex Brush"', '"Great Vibes"', 'cursive'],
        price: ['"Outfit"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 22px 50px -30px rgba(28, 59, 46, 0.35)',
        lift: '0 30px 60px -34px rgba(28, 59, 46, 0.45)',
        ring: '0 0 0 3px rgba(217, 224, 168, 0.55)',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1.5deg)' },
        },
        spinslow: { to: { transform: 'rotate(360deg)' } },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        floaty: 'floaty 7s ease-in-out infinite',
        spinslow: 'spinslow 45s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
};
