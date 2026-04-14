/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        mobile: '400px',
        '1440px': '1440px',
        sm2: '500px',
        md2: '900px',
        laptop: '1440px',
        xs2: '375px',
        xs: '320px',
      },
      fontFamily: {
        besley: ['Besley', 'sans-serif'],
      },
      colors: {
        'prm-red': '#E4572E',
        'prm-black': '#00070C',
      },

      backgroundImage: {
        navGradientBg: 'radial-gradient(100% 100% at 0% 0%, #FFFFFF 0%, #FFFFFF 100%)',
        navRadialGradient:
          'radial-gradient(100% 100% at 0% 0%, #FFF8EF 0%, rgba(255, 248, 239, 0) 100%)',
        servicesGradient: 'linear-gradient(180deg, #F8F3F0 0%, #FFFAF3 48.97%, #FFFEFC 100%)',
        cardBg: "url('/man-swift.png')",
        descriptionGradient: 'linear-gradient(180deg, #F8F3F0 0%, #FFFAF3 48.97%, #FFFEFC 100%)',
        cartOverlay:
          'radial-gradient(100% 337.36% at 0% 0%, rgba(38, 50, 56, 0.5) 0%, rgba(38, 50, 56, 0.4) 100%)',

        modalOverlay:
          'radial-gradient(100% 337.36% at 0% 0%, rgba(0, 21, 38, 0.4) 0%, rgba(0, 21, 38, 0.3) 100%)',

        mobileNavOverlay:
          'radial-gradient(100% 337.36% at 0% 0%, rgba(0, 21, 38, 0.4) 0%, rgba(0, 21, 38, 0.3) 100%)',

        reviewGradient:
          'radial-gradient(100% 337.36% at 0% 0%, rgba(0, 21, 38, 0.4) 0%, rgba(0, 21, 38, 0.3) 100%)',

        transactionGradient:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.8) 100%)',
      },
    },
  },
  plugins: [],
};
