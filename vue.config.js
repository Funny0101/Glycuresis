const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    
  },
  devServer: {
    open: false,
    port:8023,
    hot: true,
    host:'0.0.0.0',
    historyApiFallback: true,
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target:'http://212.64.29.100:8023',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''  
        },
      },
      '/baidu': { 
        target: 'https://aip.baidubce.com',
        changeOrigin: true,
        pathRewrite: {
          '^/baidu': ''  
        },
      },
    },
  }
});


