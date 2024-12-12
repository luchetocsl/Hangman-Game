import openProps from 'open-props'

/** @type {import('postcss').Config} */
export default {
  plugins: {
    'postcss-jit-props': {
      files: [
        'node_modules/open-props/src/colors.red.props.css',
        'node_modules/open-props/src/colors.gray.props.css',
        'node_modules/open-props/src/colors.indigo.props.css',
        'node_modules/open-props/src/colors.grass.props.css',
        'node_modules/open-props/src/fonts.props.css'
      ]
    },
    tailwindcss: {},
    autoprefixer: {},
  },
}
