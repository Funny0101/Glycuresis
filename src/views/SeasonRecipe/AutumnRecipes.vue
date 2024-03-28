<template>
    <div v-if = "selectRecipe === null" >
          <!-- 上下滑动的视图 -->
             <div class="block-container">
             <div class="block_wrapper">
                 <!-- 方块 -->
                 <div v-for="(item, index) in items" :key="index" class="block" @click="showRecipe(item.area,item.number)">
                 <!-- 每行两个方块 -->
                 <div class="block_content">
                     
                     <div class="block_title">
                     <img :src="require(`@/assets/food_icon/${item.iconName}`)" 
                     class="block_icon" 
                     :style="{ width: iconSize, height: iconSize }"/>
                     {{ item.title }}
                     </div>
                     
                 </div>
                 </div>
             </div>
             </div>
     </div>
     <!-- 食谱描述 -->
     <div class  = "recipe" v-if = "selectRecipe !== null" >
         <van-icon name="close" class="closeIcon" @click="falseShowRecipe" />
 
     <!-- 早餐卡片 -->
     <div class = "every_meal">
         <div class="vertical-line-zao"></div>
         <span class = "mytitle">早餐</span>
         <div class="card">
             <ul>
                 <li  v-for="(item, index) in recipe.breakfast" :key="index"  
                 style="font-size: 16px;">{{ item }}</li>
             </ul>
         </div>
     </div>
    <!-- 午餐卡片 -->
     <div class = "every_meal">
         <div class="vertical-line-zhong"></div>
         <span class = "mytitle">午餐</span>
         <div class="card">
             <ul>
                 <li  v-for="(item, index) in recipe.lunch" :key="index"  
                 style="font-size: 16px;">{{ item }}</li>
             </ul>
         </div>
     </div>
       <!-- 晚餐卡片 -->
       <div class = "every_meal">
         <div class="vertical-line-wan"></div>
         <span class = "mytitle">晚餐</span>
         <div class="card">
             <ul>
                 <li  v-for="(item, index) in recipe.dinner" :key="index"  
                 style="font-size: 16px;">{{ item }}</li>
             </ul>
         </div>
     </div>
      <!-- 油盐卡片 -->
      <div class = "every_meal">
         <div class="vertical-line-salt"></div>
         <span class = "mytitle">油盐</span>
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
 </template>

 <script>
 import { get } from "../../axios/axiosConfig.js";
    export default {
        data(){
            return {
                    page_season:'秋季',
                    items: [
                    { title: '东北食谱1',  iconName: 'Cake.png',number:1,area:'东北'},
                    { title: '东北食谱2',  iconName: 'Beer.png',number:2,area:'东北'},
                    { title: '东北食谱3',  iconName: 'Baozi.png',number:3,area:'东北'},
                    
                   

                    { title: '西北食谱1',  iconName: 'Zongzi(Chinese food).png',number:1,area:'西北'},
                    { title: '西北食谱2',  iconName: 'Sushi.png',number:2,area:'西北'},
                    { title: '西北食谱3',  iconName: 'Walnut.png',number:3,area:'西北'},
                    

                    { title: '华北食谱1',  iconName: 'Sandwich.png',number:1,number:1,area:'华北'},
                    { title: '华北食谱2',  iconName: 'Pineapple.png',number:2,area:'华北'},
                    { title: '华北食谱3',  iconName: 'Strawberry.png',number:3,area:'华北'},
                   

                    { title: '华东食谱1',  iconName: 'Pizza.png',number:1,area:'华东'},
                    { title: '华东食谱2',  iconName: 'Icon_taco.png',number:2,area:'华东'},
                    { title: '华东食谱3',  iconName: 'Icon_bread.png',number:3,area:'华东'},
                

                    { title: '华中食谱1',  iconName: 'Icon_fruits.png',number:1,area:'华中'},
                    { title: '华中食谱2',  iconName: 'Toast.png',number:2,area:'华中'},
                    { title: '华中食谱3',  iconName: 'Red jujube.png',number:3,area:'华中'},
                   

                    { title: '西南食谱1',  iconName: 'Pistachio.png',number:1,area:'西南'},
                    { title: '西南食谱2',  iconName: 'Icon_french hot dog.png',number:2,area:'西南'},
                    { title: '西南食谱3',  iconName: 'Mango.png',number:3,area:'西南'},
                    

                    { title: '华南食谱1',  iconName: 'Icon_cheese.png',number:1,area:'华南'},
                    { title: '华南食谱2',  iconName: 'Icon_vegetables.png',number:2,area:'华南'},
                    { title: '华南食谱3',  iconName: 'Milk.png',number:3,area:'华南'},
                    // 添加更多项目
                    ],
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
                    iconSize: '30px',
                    selectRecipe:null,
                    
                    

            }
        },
        methods:{
          
          async showRecipe(area,recipe_number){
                
                try {
              const response = await get('food/cookbook/getCookbook', { 
              location: area,
              season:this.page_season,
              number: recipe_number,
             })
            .then(response => {
                // 处理成功的响应
                console.log('获取到的信息：', response.data);
                this.selectRecipe = this.page_season+recipe_number;

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
              })
              }
                catch (error) {
                // 处理获取验证码失败的逻辑
                console.error('获取食谱失败', error);
                if (error.response) {
                console.error('Error Response:', error.response.data);
                }
                }
            },
            falseShowRecipe(){
                this.selectRecipe = null;
            }
        }
    }
</script>

<style scoped>
.fixed_top {
  position: fixed; /* 固定在顶部 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 100; /* 使其显示在内容上方 */
  background-color: #fff; /* 顶部背景颜色 */
  padding: 10px; /* 适当的内边距 */
}

.food_container {
  padding-top:30%;
  width: 90%;
  height: 300%;
  padding-bottom: 100%;
  position: relative;
  margin: 20px auto; 
  border-radius: 5%;
  /* background-image: linear-gradient(to right, #ffffff 0%, #ece4e6 50%, #ffffff 100%); */
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
  width: 42%; /* 让两个方块占据总宽度的近似一半 */
  height:70px;
  margin-bottom: 10px;
  border: 1px solid #c5fbf6;
  border-radius: 8px;
  padding:10px;
  text-align: center;
  background-image: linear-gradient(to bottom, #a8fff6 0%, #ffffff 40%, transparent 55%);
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

/* 下面为食谱相关样式 */

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
   right:49%;
   top:90%;
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
</style>