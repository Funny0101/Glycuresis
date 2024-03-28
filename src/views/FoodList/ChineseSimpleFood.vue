<template>
  <!-- 食物详情标题 -->
  <div class = "food_title">
    <van-icon name="arrow-left" 
    @click = "GoBack"
    size="30"/>
    <span class = "title_text">
      食物详情
    </span>


    <div class = "zongxiang">
     <div  class = "energy">
        <div class="vertical-line"></div>
        <span class="energy_title">黑大麦</span>
      </div>

      <div class = "EnergyNumber" v-if="showQianKa">
          <span class = number_1>328</span>
          <span class = number_2>千卡/100g</span>
      </div>
      <div class = "EnergyNumber" v-if="showQianJiao">
          <span class = number_1>38</span>
          <span class = number_2>千焦/100g</span>
      </div>
    </div>

    <div class = "Change_Button">
    <van-switch
     v-model="switchValue" 
     @change="SwitchShowWay"
    />
    </div>
   
    <van-divider class = "fenge"></van-divider>
  </div>

  
</template>

<script>
  export default {
    data(){
      return{
        showQianKa : false,
        showQianJiao: true,
        switchValue: true // 新增一个开关状态的变量
      };
    },
    methods:{
      GoBack(){
        this.$router.go(-1); 
      },
      
      SwitchShowWay() {
      this.switchValue = !this.switchValue; // 切换开关状态
        console.log('切换逻辑');
        this.$nextTick(() => {
      if (this.switchValue) {
        this.showQianKa = false;
        this.showQianJiao = true;
        console.log('switchValue',this.switchValue);
        console.log('showQianKa',this.showQianKa);
        console.log('showQianJiao',this.showQianJiao);
      } else {
        this.showQianJiao = false;
        this.showQianKa = true;
        console.log('switchValue',this.switchValue);
        console.log('showQianKa',this.showQianKa);
        console.log('showQianJiao',this.showQianJiao);
      }
    });
    }


    }
  }
</script>

<style  scoped>
.food_title{
  position:absolute;
  left: 20px;
  top:30px;
  display: flex;
  align-items: center; /* 让按钮与输入框垂直居中 */
  font-size:20px;
  position: fixed;
}
.title_text{
  position:absolute;
  left: 130px;
  top:0px;
  width:150px;
}
.energy{
  position:absolute;
  display: flex;
  align-items: center; /* 让按钮与输入框垂直居中 */
}
.vertical-line {
  border-left: 5px solid #00a0e4; /* 设置竖线的样式 */
  height: 25px; /* 设置竖线的高度 */
  border-radius: 5px; /* 设置竖线的角为圆角 */

  position:absolute;
  top:40px;
}
.energy_title{
  position:absolute;
  top:40px;
  width:100px;
  left:10px;
}
.zongxiang{
  display: grid;
  grid-template-columns: 1fr; /* 设置单列 */
  grid-gap: 10px; /* 设置元素之间的间距 */
}
.EnergyNumber{
  position:absolute;
  top:90px;
  left:25px;
  width:200px;
}
.number_1{
  font-size:30px;
  color:rgba(47, 128, 237, 0.7);
}
.number_2{
  font-size:20px;
  color:rgba(136, 146, 161, 0.7);
}
.Change_Button{
  position:absolute;
  top:65px;
  left:225px;
  width:90px;
  /* border: 1px solid rgb(255, 255, 255);
  border-radius: 7px;
  border-color:rgba(47, 128, 237, 0.7); */
}
.fenge{
  position:absolute;
  top:120px;
  border: 2px solid rgb(244, 240, 240);
  left:-20px;
  width:380px;
}



</style>