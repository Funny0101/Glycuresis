<template>
    <div >
      <div class="text-container container-item">
        <img :src="oopsImage" alt="OOPS"  class = "myOOPS"/>
        <img :src="notFoundImage" alt="Not Found Image"  class = "myNotFound"/>
        <div class="text">您查看的页面貌似丢失了</div>
        <van-button
                round
                type="success"
                class="custom-btn"
                @click="returnHome"
            >
            <van-icon name="arrow-left" class="btn-icon" />
            返回首页
        </van-button>
      </div>
    </div>
  </template>
  

<script>
export default {
    data() {
    return {
        oopsImage:require('@/assets/notfound/Oops.png') ,
        notFoundImage: require('@/assets/notfound/404Icon.png') ,
    };
  },
    methods: {
        returnHome() {
            this.$router.push("/home")
        }
    }
} 
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.text-container {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  align-items: center; /* 水平居中 */
  justify-content: center; /* 将内容水平居中 */
 
 
}
.text{
    padding-top:5%;
    font-size:25px;
    padding-bottom:20%;
    font-weight:bold;
}
.myOOPS{
    padding-top:30%;
    width: 150px; /* 设置图像的宽度 */
    height: auto; /* 设置高度自适应 */
 
}
.myNotFound{
    padding-top:5%;
    width: 200px; /* 设置图像的宽度 */
    height: auto; /* 设置高度自适应 */
}
.custom-btn {
  font-weight: bold; /* 设置字体加粗 */
  background-color: #16eef6; /* 更改背景色 */
  border: 2px solid #22f7c9; /* 增加双线边框 */
  color: #333; /* 设置文字颜色 */
  padding-left: 8px; /* 增加左侧内边距 */
  padding-right: 8px; /* 增加右侧内边距 */
}

/* 图标样式 */
.btn-icon {
  margin-right: 8px; /* 设置图标与文字的间距 */
}

</style>
