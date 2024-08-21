const { defineConfig } = require('@vue/cli-service');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
  },
  chainWebpack: (config) => {
    config.module.rules.delete('svg');

    // Add your custom rule for SVGs
    config.module
      .rule('svg')
      .test(/\.svg$/)
      .use('raw-loader')
      .loader('raw-loader');
  },
});
