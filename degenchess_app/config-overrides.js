const webpack = require('webpack');
module.exports = {
  // The Webpack config to use when compiling your react app for development or production.
  webpack: function (config, env) {
    // console.log(config)
    const fallbacks = {
      resolve: {
        fallback: {
          //   fs: false,
          //   tls: false,
          //   net: false,
          //   path: false,
          //   zlib: false,
          buffer: require.resolve('buffer'),
          assert: require.resolve('assert'),
          http: require.resolve('stream-http'),
          stream: require.resolve('stream-browserify'),
          crypto: require.resolve('crypto-browserify'),
          https: require.resolve('https-browserify'),
          url: require.resolve('url/'),
          'process/browser': require.resolve('process/browser'),
          //   https: false,
          //   stream: false,
          os: require.resolve('os-browserify/browser'),
          //   url: false,
          //   crypto: false,
          //   "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify
        },
      },
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      process: 'process/browser',
      buffer: 'buffer',
    };

    config.resolve.extensions = [...config.resolve.extensions, '.ts', '.js'];
    config.plugins = [
      ...config.plugins,
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    ];
    config.resolve.fallback = fallbacks.resolve.fallback;
    return config;
  },
};
