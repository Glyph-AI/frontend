const withPWA = require('next-pwa')({
  dest: 'public'
})

const removeImports = require('next-remove-imports')();

module.exports = removeImports(withPWA({
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/conversations',
  //       permanent: true,
  //     },
  //   ]
  // },
  pwa: {
    register: true,
    skipWaiting: true
  },
  output: 'standalone',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config, context) => {
    // Enable polling based on env variable being set
    if (process.env.NEXT_WEBPACK_USEPOLLING) {
      config.watchOptions = {
        poll: 500,
        aggregateTimeout: 300
      }
    }
    return config
  },
}));
