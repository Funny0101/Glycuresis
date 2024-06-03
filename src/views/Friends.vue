<template>
  <div class="health-data">
    <van-nav-bar title="记录统计" 
      fixed placeholder
      left-arrow 
      @click-left="goBack()" 
      left-text="返回"
      style="--van-nav-bar-title-font-size: 18px;"
      >
    </van-nav-bar>
    <!-- 如果标签被点击则输出 -->
    <van-tabs v-model:active="active" :line-width="80" color="#1989fa" @change="handleTabChange">
      <van-tab title="血糖数据"></van-tab>
      <van-tab title="饮食摄入"></van-tab>
    </van-tabs>

    <div>
      <div>
        <blood-sugar-chart v-if="active === 0"></blood-sugar-chart>
      </div>
      <div>
        <diet-chart v-if="active === 1"></diet-chart>
      </div>
    </div>
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

<script>
import BloodSugarChart from './BloodSugarChart.vue';
import DietChart from './DietChart.vue';
import { ref } from 'vue';
import {mapState, mapMutations} from 'vuex';

export default {
  setup() {
  },
  components: {
    BloodSugarChart,
    DietChart
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['statsTabActiveIndex']),
    active: {
      get() {
        return this.statsTabActiveIndex;
      },
      set(val) {
        this.changeStatsTabActiveIndex(val);
      }
    }
  },
  mounted() {
    this.active = this.statsTabActiveIndex;
  },
  methods: {
    ...mapMutations(['changeStatsTabActiveIndex']),
    handleTabChange(activeIndex) {
      // 当用户切换选项卡时，更新状态
      this.changeStatsTabActiveIndex(activeIndex)
    },
    goBack() {
      this.$router.go(-1);
    },
  }
};
</script>

<style scoped>
.content-background {
  background-color: #e0f7fa;
  /* 这是一个浅蓝色的颜色代码 */
  margin-top: -1px;
  /* 用于消除可能的1px gap */
  border-top-left-radius: 15px;
  /* 左上圆角 */
  border-top-right-radius: 15px;
  /* 右上圆角 */
  flex-grow: 1;
  /* 如果使用 flex 布局 */
  /* 根据需要调整padding和其他样式 */
  padding: 1rem;
}</style>