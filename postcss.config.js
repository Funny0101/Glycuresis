// PostCss配置文件
module.exports = {
    // 配置所需要的插件
  plugins: {
    //   配置使用postcss-pxtorem插件
    //作用把px转成rem
    "postcss-pxtorem": {
        
        rootValue: 37.5,
   
      propList: ["*"],


        selectorBlackList: ['vant', 'mu'],
        exclude: /node_modules/,
        replace: true,
        mediaQuery: false,
        minPixelValue: 0,


    },
  },
};

