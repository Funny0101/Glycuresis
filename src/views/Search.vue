<template>
  <!-- 选择地区 -->
  <div  v-if="showSelectArea">
    <div class="food_container">
      <div class="fixed_top">
      <!-- 页面内容 -->
        <h1 class="page_title">推荐食谱</h1>
      </div>
    </div>

    <!-- 上下滑动的视图 -->
    <div class="block-container">
      <div class="block_wrapper">
        <!-- 方块 -->
        <div v-for="(item, index) in items" :key="index" class="block"  @click="showArea(item.area)">
          <!-- 每行两个方块 -->
          <div class="block_content">
            <div class="block_title">
              <img :src="require(`@/assets/food_icon/${item.iconName}`)" 
                class="block_icon" 
                :style="{ width: iconAreaSize, height: iconAreaSize }"/>
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>

      <!-- 底部导航栏 -->
      <van-tabbar route>
        <van-tabbar-item icon="home-o" text="首页" to="/home" />
        <van-tabbar-item icon="search" text="搜索" to="/search" />
        <van-tabbar-item icon="chart-trending-o" text="朋友" to="/friends" />
        <van-tabbar-item icon="setting" text="设置" to="/setting" />
      </van-tabbar>
    </div>
  </div>


     <div v-if="!showSelectArea">
        
      <!-- 横向滑动的tab栏(季节) -->
      <van-tabs  v-model:active="activeSeason" sticky @change="onChangeTabSeason"  swipeable class="tab-season">
        <van-tab v-for="(season, index) in seasons" :key="index" :title="season.name" >
        </van-tab>
      </van-tabs>
      <!-- 横向滑动的tab栏(数字) -->
      <van-tabs  v-model:active="activeNumber" sticky @change="onChangeTabNumber"  swipeable class="tab-number">
        <van-tab v-for="(number, index) in numbers" :key="index" :title="number.name">
        </van-tab>
      </van-tabs>

      <div v-if="isLoading" class="loading-container">
       <van-loading :size="30" :text="loadingText" />
      </div>

      <!-- 食谱描述 -->
     <div class="recipe" v-if="!isLoading" >
         <van-icon name="close" class="closeIcon" @click="falseShowRecipe" />
 
     <!-- 早餐卡片 -->
     <div class="every_meal">
         <div class="vertical-line-zao"></div>
         <span class="mytitle">早餐</span>
         <div class="card">
             <ul>
                 <li  v-for="(item, index) in recipe.breakfast" :key="index"  
                 style="font-size: 16px;">{{ item }}</li>
             </ul>
         </div>
     </div>
    <!-- 午餐卡片 -->
     <div class="every_meal">
         <div class="vertical-line-zhong"></div>
         <span class="mytitle">午餐</span>
         <div class="card">
             <ul>
                 <li  v-for="(item, index) in recipe.lunch" :key="index"  
                 style="font-size: 16px;">{{ item }}</li>
             </ul>
         </div>
     </div>
       <!-- 晚餐卡片 -->
       <div class="every_meal">
         <div class="vertical-line-wan"></div>
         <span class="mytitle">晚餐</span>
         <div class="card">
             <ul>
                 <li  v-for="(item, index) in recipe.dinner" :key="index"  
                 style="font-size: 16px;">{{ item }}</li>
             </ul>
         </div>
     </div>
      <!-- 油盐卡片 -->
      <div class="every_meal">
         <div class="vertical-line-salt"></div>
         <span class="mytitle">油盐</span>
         <div class="card_salt">
            <span style="font-size: 16px;">{{ recipe.salt}}</span>
         </div>
     </div>
 
     <div class="divider"></div>
     <span style="font-size: 25px;">营养成分</span>
     <div >
         <div>
             <span style="font-size: 20px;">能量：</span>
             <span style="font-size: 20px;">{{ recipe.energy }}</span>
         </div>
            <div class="table">
                <div class="row">
                    <div class="cell">名称</div>
                    <div class="cell">含量</div>
                    <div class="cell">供能比</div>
                </div>
                <div class="row">
                    <div class="cell">
                    <span class="square_carbon"></span>碳水化合物
                    </div>
                    <div class="cell">{{recipe.carbon}}</div>
                    <div class="cell">{{recipe.carbon_rate}}</div>
                </div>
                <div class="row">
                    <div class="cell">
                    <span class="square_protein"></span>蛋白质
                    </div>
                    <div class="cell">{{recipe.protein}}</div>
                    <div class="cell">{{recipe.protein_rate}}</div>
                </div>
                <div class="row">
                    <div class="cell">
                    <span class="square_fat"></span>脂肪
                    </div>
                    <div class="cell">{{recipe.fat}}</div>
                    <div class="cell">{{recipe.fat_rate}}</div>
                </div>
            </div>
          </div>
        </div>
      </div>
    
  


   







    <!-- 底部导航栏 -->
   
</template>

<script>

import axios from 'axios';
import { get, put, post, del } from "../axios/axiosConfig.js";
import { Tab, Tabs } from 'vant';

export default {
  components: {
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
   
  },
  data() {
    return {
      iconAreaSize : '20px',
      iconSize: '30px',
      
      recipe:{
          breakfast:[],
          lunch:[],
          dinner:[],
          salt:'',
          energy:'',
          protein:'',
          protein_rate:'',
          carbon:'',
          carbon_rate:'',
          fat:'',
          fat_rate:'',
      },
      
      value: '',
      items: [
      { title: '东北地区食谱',  iconName: 'Cake.png',area:'东北'},
      { title: '西北地区食谱',  iconName: 'Zongzi(Chinese food).png',area:'西北'},
      { title: '华北地区食谱',  iconName: 'Sandwich.png',area:'华北'},
      { title: '华东地区食谱',  iconName: 'Pizza.png',area:'华东'},
      { title: '华中地区食谱',  iconName: 'Icon_fruits.png',area:'华中'},
      { title: '西南地区食谱',  iconName: 'Pistachio.png',area:'西南'},
      { title: '华南地区食谱',  iconName: 'Icon_cheese.png',area:'华南'},           
      // ... 
      ],
      activeTabSeason: 0,
      activeTabNumber: 0,
      showSelectArea:true,
      selectArea:null,
      showRecipe:false,
      seasons: [
        { name: '春季' ,index:0},
        { name: '夏季' ,index:1},
        { name: '秋季' ,index:2},
        { name: '冬季' ,index:3},
      ],
      numbers: [
        { name: '食谱1' ,index:0,number:1},
        { name: '食谱2' ,index:1,number:2},
        { name: '食谱3' ,index:2,number:3},
       
      ],
      isLoading: false,
      loadingText: '加载中...', // 可根据需要自定义加载中文本
    };
  },
  mounted() {
   
  },
  methods: {
    
   
    onChangeTabSeason(activeTabSeason) {
      this.activeTabSeason = activeTabSeason;
      console.log('Switched to tabseason', this.activeTabSeason);
      console.log('Tabnumber', this.activeTabNumber);

      this.updateRecipe();
    },
    onChangeTabNumber( activeTabNumber){
      this.activeTabNumber = activeTabNumber;
      console.log('Switched to tabnumber:', this.activeTabNumber);
      console.log('Seasontab:', this.activeTabSeason);
      this.updateRecipe();
    },
   
    showArea(area){
      this.showSelectArea = false;
      this.showRecipe = true;
      this.selectArea = area;
      console.log('showSelectArea',this.showSelectArea);
      console.log('selectArea',this.selectArea);
      this.updateRecipe();
    },
    falseShowRecipe(){
      this.showSelectArea =  true;
      this.showRecipe = false;
      this.selectArea = null;
      console.log('showSelectArea',this.showSelectArea);
      console.log('selectArea',this.selectArea);
    },
    async updateRecipe() {
     
    try {
      
      this.isLoading = true; // 显示加载状态
      const response = await get('food/cookbook/getCookbook', {
        location: this.selectArea,
        season: this.seasons[this.activeTabSeason].name,
        number: this.numbers[this.activeTabNumber].number
      })
      .then(response => {
                // 处理成功的响应
                console.log('获取到的信息：', response.data);
                

                this.recipe.breakfast = response.data.foods
                  .filter(item => item.type === '早餐')
                  .map(item => item.note);
                this.recipe.lunch = response.data.foods
                  .filter(item => item.type === '中餐'||item.type === '加餐')
                  .map(item => item.note);
                this.recipe.dinner = response.data.foods
                  .filter(item => item.type === '晚餐')
                  .map(item => item.note);

              
                this.recipe.energy = response.data.energy;

                this.recipe.carbon = response.data.carbohydrateMass;
                this.recipe.carbon_rate = response.data.carbohydrateEnergyRatio;

                this.recipe.fat = response.data.fatMass;
                this.recipe.fat_rate = response.data.fatEnergyRatio;

                this.recipe.protein = response.data.proteinMass;
                this.recipe.protein_rate = response.data.proteinEnergyRatio;

                this.recipe.salt = response.data.oilSalt;
                console.log('recipe', this.recipe);
                this.isLoading = false; // 隐藏加载状态
          })
    } catch (error) {
      console.error('Error fetching cookbook data:', error);
      this.isLoading = false; // 隐藏加载状态（如果请求失败）
    }
  },


  },


};
</script>

<style scoped>
/* 样式内容 */
.page_title {

  text-align: center;
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 10px;
  /* 样式其他属性 */
}
/* 方块样式 */
.block_container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  
}

.block_wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;
}


.block {
  width: 49%; /* 让两个方块占据总宽度的近似一半 */
  height:80px;
  margin-bottom: 10px;
  border: 1px solid #c5fbf6;
  border-radius: 8px;
  padding:10px;
  text-align: center;
  background-image: linear-gradient(to bottom, #dad6ff 0%, #ffffff 80%, transparent 95%);
}

.block_content {
  margin-bottom: 10px;
 
}

.block_title {
  font-weight: bold;
  margin-bottom: 5px;
  font-size:20px;
}

.block_item {
  color: #333;
  font-size:20px;
}
/* 食谱样式 */

.recipe{
  
    display: flex; /* 设置为弹性容器 */
  flex-direction: column; /* 设置为纵向排列 */
    height:650px;
    
  overflow-y: auto; /* 当内容溢出时显示滚动条 */
}
.every_meal{
  display: flex; /* 设置为弹性容器 */
  /* justify-content: space-between;  *//* 在弹性容器中，将项目以最大间距分布  */
 
  align-items: center; /* 在交叉轴上垂直居中 */
  border-radius: 2px;
  margin:0 30px 0 30px;
}

 .vertical-line-zao{
    border-left: 5px solid #6fffa9; /* 设置竖线的样式 */
    height: 40px; /* 设置竖线的高度 */
  border-radius: 5px; /* 设置竖线的角为圆角 */
}

 .vertical-line-zhong{
    border-left: 5px solid #f79254; /* 设置竖线的样式 */
    height: 40px; /* 设置竖线的高度 */
  border-radius: 5px; /* 设置竖线的角为圆角 */
}

 .vertical-line-wan{
    border-left: 5px solid #00a0e4; /* 设置竖线的样式 */
    height: 40px; /* 设置竖线的高度 */
  border-radius: 5px; /* 设置竖线的角为圆角 */
}
.vertical-line-salt{
    border-left: 5px solid #b878c5; /* 设置竖线的样式 */
    height: 40px; /* 设置竖线的高度 */
  border-radius: 5px; /* 设置竖线的角为圆角 */
}
.card{
  border: 1px solid #000; /* 黑色边框 */
  border-radius: 20px; /* 圆角矩形 */
  padding: 10px;
  margin-bottom: 10px;
  width:75%;
  /* height:140px; */
}
.card_salt{
  border: 1px solid #000; /* 黑色边框 */
  border-radius: 20px; /* 圆角矩形 */
  padding: 10px;
  margin-bottom: 10px;
  width:75%;
  
}
.mytitle{
    font-size:20px;
    margin-right: 30px; /* 添加右侧间距 */
}   
.closeIcon {
    position: fixed;
    left: 10px; /* 调整至左上角 */
  top: 10px; /* 调整至左上角 */
    font-size: 0.8rem;
}
.divider {
  border-top: 2px solid #a9a6a6; /* 横向实线 */
  
  width: 100%; /* 设置宽度 */
  margin: 10px 0; /* 设置上下间距 */
}


.table {
  display: table;
  width: 93%;
  border-collapse: collapse;
  font-size:18px;
}

.row {
  display: table-row;
}

.cell {
  display: table-cell;
  padding: 8px;
  border: 1px solid #ccc;
}


.square_carbon{
    display: inline-block;
  width: 12px;
  height: 12px;
  background-color: #3cef8d;
  margin-right: 5px;
  border-radius: 2px;
}
.square_protein{
    display: inline-block;
  width: 12px;
  height: 12px;
  background-color: #ed7c3f;
  margin-right: 5px;
  border-radius: 2px;
}
.square_fat{
    display: inline-block;
  width: 12px;
  height: 12px;
  background-color: #eccf41;
  margin-right: 5px;
  border-radius: 2px;
}
.tab-season {
  margin-top: 30px; /* 向下移动 Tab */
}

.tab-number {
  margin-top: 20px; /* 向下移动 Tab */
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  z-index: 9999; /* 确保 Loading 组件在顶层 */
}
</style>
