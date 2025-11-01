export default {
  plugins: {
    'postcss-import': {},
    'tailwindcss': {},
    'autoprefixer': {},
    'postcss-nesting': {},
    'postcss-preset-env': {
      features: {
        'nesting-rules': false // If using postcss-nesting
      }
    }
  }
}