<template>
    <div></div>
  </template>
  
  <script>
  import SlideRuler from 'slide-ruler';
  
  export default {
    mounted() {
      this._renderSlideRuler();
    },
    methods: {
      _renderSlideRuler() {
        // 获取屏幕宽度和高度
        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  
        return new SlideRuler({
          el: this.$el,
          canvasWidth: screenWidth*0.9, // 设置 canvasWidth
          canvasHeight: 200, // 设置 canvasHeight
          maxValue: 1000,
          minValue: 0,
          currentValue: 100,
          handleValue: this.handleValue,
          precision: 1,
        });
      },
      handleValue(value) {
        // console.log(value); // SlideRuler return value
        this.$emit('rulerValueChange', value);
      },
    },
  };
  </script>
  