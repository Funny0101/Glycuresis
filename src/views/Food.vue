<template>
    <div>
      <!-- 页面内容 -->
    
        <div class="core-container">
        <div class="scroll-wrapper" ref="scroll">
        <div class="scroll-content">
        <div class="scroll-item" v-for="(item, index) in emojis" :key="index" @click="clickHandler(item)">{{item}}</div>
        </div>
        </div>
        </div>
  















      <!-- 底部导航栏 -->
      <van-tabbar route>
        <!-- 导航项1 -->
        <van-tabbar-item icon="home-o" text="首页" to="/home" />
  
        <!-- 导航项2 -->
        <van-tabbar-item icon="search" text="搜索" to="/search" />
  
        <!-- 导航项3 -->
        <van-tabbar-item icon="chart-trending-o" text="朋友" to="/friends" />
  
        <!-- 导航项4 -->
        <van-tabbar-item icon="setting" text="设置" to="/setting" />
      </van-tabbar>
    </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from '@better-scroll/core'

  export default {
    data () {
      return {
        emojis: [
          '😀 😁 😂 🤣 😃',
          
        ]
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.bs.destroy()
    },
    methods: {
      init() {
        this.bs = new BScroll(this.$refs.scroll, {
          probeType: 3,
          click: true
        })
        this.bs.on('scrollStart', () => {
          console.log('scrollStart-')
        })
        this.bs.on('scroll', ({ y }) => {
          console.log('scrolling-')
        })
        this.bs.on('scrollEnd', (pos) => {
          console.log(pos)
        })
      },
      clickHandler (item) {
        window.alert(item)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

.core-container
  .scroll-wrapper
    height 400px
    position relative
    overflow hidden
    .scroll-item
      height 50px
      line-height 50px
      font-size 24px
      font-weight bold
      border-bottom 1px solid #eee
      text-align center
      &:nth-child(2n)
        background-color #f3f5f7
      &:nth-child(2n+1)
        background-color #42b983
</style>