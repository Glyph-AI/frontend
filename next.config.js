const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA({
  pwa: {
    register: true,
    skipWaiting: true
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
});
