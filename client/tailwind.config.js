module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontSize: {
          sm: ['14px', '20px'],
          base: ['16px', '24px'],
          lg: ['20px', '28px'],
          xl: ['24px', '32px'],
          '2xl': ['45px', '47px'],
        }
      },
    },
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }