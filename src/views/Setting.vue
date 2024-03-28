<template>
  <div name="setting">
    <!-- 页面内容 -->
    <!-- 用户信息 -->
    <div class="user-info">
      <van-avatar size="large" src="path"></van-avatar>
      <div class="name">funny</div>
      <div class="profile">15870104851</div>
    </div>

    <!-- 设置项 -->
    <van-cell-group title="账号">
      <van-cell title="修改密码" is-link />
      <van-cell title="手机号" is-link />

      <van-button title="获取信息" @click ="GetInformation"  >个人信息</van-button>
      <van-button title="账号信息" @click ="GetAccount"  >账号信息</van-button>
    </van-cell-group>
    <van-cell-group title="通用">
      <van-cell title="语言" is-link />
      <van-cell title="主题" is-link />
    </van-cell-group>
    <van-cell-group title="关于">
      <van-cell title="版本信息" is-link />
      <van-cell title="帮助与反馈" is-link />
    </van-cell-group>

    
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

<script>
import { get, put, post, del } from "../axios/axiosConfig.js";
export default {
  data() {
    return {
      name: '',
      account: '',
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      
    },
    async  GetInformation(){
      try {
        const response = await get('/user/user/getDetail', {
       
        });
       
        console.log('userdata',response.data);
      } catch (error) {
        // 处理登录失败的逻辑
        console.error('失败', error);
        if (error.response) {
          console.error('Error Response:', error.response.data);
        }
   
      }
    },
    async  GetAccount(){
      try {
        const response = await get('/user/user/get', {
       
        });
       
        console.log('userdata',response.data);
      } catch (error) {
        // 处理登录失败的逻辑
        console.error('失败', error);
        if (error.response) {
          console.error('Error Response:', error.response.data);
        }
   
      }
    },
  },
}
</script>

<style scoped>
.setting {
  background-color: #f8f8f8;
}

.user-info {
  background-color: #409eff;
  color: white;
  padding: 20px;
  text-align: center;
}

.name {
  font-size: 35px;
  margin-top: 10px;
}

.profile {
  font-size: 20px;
  margin-top: 5px;
}

.wechat-id {
  font-size: 16px;
  margin-top: 5px;
}

.van-cell-group {
  margin-top: 20px;
}

.van-cell {
  background-color: white;
}
</style>