<template>
    <div class = "GuideContainer">
        <!-- GuidePageA -->
        <transition name="fade">
        <div calss = "PageA"
            v-if ="ShowPageA">
            
            
            <div class="animated-content animated slideInUp faster">
            <img src="../assets/Guide/PageA/GroupA.png" 
            alt="GroupA Image" 
            class ="GroupA"
            />
            </div>
           
           
            <div class="descriptionA">
            <h2>推荐食谱</h2>
            <p>利用智能算法为糖尿病患者提供个性化营养评估和定制饮食方案，助力用户更好地控制血糖水平。</p>
            </div>
            
            <div class="animated-content animated fade faster">
            <img src="../assets/Guide/PageA/CorrectBlue.png" 
            alt="CorrectBlue Image" 
            class ="CorrectBlue"
            />
            <img src="../assets/Guide/PageA/CrossGreen.png" 
            alt="CrossGreen Image" 
            class ="CrossGreen"
            /> 
            <img src="../assets/Guide/PageA/RectangleRed.png" 
            alt="RectangleRed Image" 
            class ="RectangleRed"
            />
            
            <img src="../assets/Guide/PageA/LineA.png" 
            alt="LineA Image" 
            class ="Line"
            /> 


            <van-button
                type="primary"
                class="custom-btn"
                @click="GoNextPageFrom_A_to_B"
            >
            <van-icon name="arrow" class="btn-icon" />
            </van-button>
            </div>
            
            

        
        </div>
        </transition>
        <!-- GuidePageB -->
        <transition name="fade">
        <div calss = "PageB"
        v-if ="ShowPageB">

          
            <div class="animated-content animated slideInUp faster">
            <img src="../assets/Guide/PageB/GroupB.png" 
            alt="GroupB Image" 
            class ="GroupB"
            />
            </div>
         
            <div class="descriptionB">
            <h2>饮食管理</h2>
            <p>通过饮食管理功能，实现全方位的健康管理，帮助用户全面掌握身体状况，更好地管理糖尿病。</p>
            </div>
           
            <div class="animated-content animated fade faster">
            <img src="../assets/Guide/PageB/EllipiticA.png" 
            alt="EllipiticA Image" 
            class ="EllipiticA"
            />
            <img src="../assets/Guide/PageB/EllipiticB.png" 
            alt="EllipiticB Image" 
            class ="EllipiticB"
            />
            
            <img src="../assets/Guide/PageB/LineB.png" 
            alt="LineB Image" 
            class ="Line"
            />
            <img src="../assets/Guide/PageB/RectangleHallow.png" 
            alt="RectangleHallow Image" 
            class ="RectangleHallow"
            />
            <img src="../assets/Guide/PageB/VectorA.png" 
            alt="VectorA Image" 
            class ="VectorA"
            />
            <img src="../assets/Guide/PageB/VectorB.png" 
            alt="VectorB Image" 
            class ="VectorB"
            />

            <van-button
                type="primary"
                class="custom-btn"
                @click="GoNextPageFrom_B_to_C"
            >
            <van-icon name="arrow" class="btn-icon" />
            </van-button>

            </div>
           
            
        </div>
        </transition>
        <!-- GuidePageC -->
        
        <transition name="fade">
        <div calss = "PageC"
        v-if ="ShowPageC">

           
            <div class="animated-content animated slideInUp faster">
            <img src="../assets/Guide/PageC/GroupC.png" 
            alt="GroupC Image" 
            class ="GroupC"
            />
            </div>
          
            <div class="descriptionC">
            <h2>血糖监测</h2>
            <p>支持血糖监测及数据分析，为用户提供实时血糖趋势和反馈报告，指导调整饮食和运动计划，助力糖尿病管理。</p>
            </div>

            <div class="animated-content animated fade faster">
            <img src="../assets/Guide/PageC/LineC.png" 
            alt="LineC Image" 
            class ="Line"
            />
            <img src="../assets/Guide/PageC/VectorC.png" 
            alt="VectorC Image" 
            class ="VectorC"
            />
            <img src="../assets/Guide/PageC/Signal.png" 
            alt="Signal Image" 
            class ="Signal"
            />

            <van-button
                type="primary"
                class="custom-btnx"
                @click="GoNextPageFrom_to_Login"
            >
            立即开始
            </van-button>
            </div>
        
            

        </div>
        </transition>
        
        <!-- end -->
    </div>
</template>

<script>
    export default {
        data(){
            return{
            ShowPageA:true,
            ShowPageB:false,
            ShowPageC:false,
            
            };
        },
        methods:{
            GoNextPageFrom_A_to_B(){
                this.ShowPageA = false;
                this.ShowPageB = true;
                this.ShowPageC = false;
                console.log('展示PageB');
            },
            GoNextPageFrom_B_to_C(){
                this.ShowPageA = false;
                this.ShowPageB = false;
                this.ShowPageC = true;
                console.log('展示PageC');
            },
            GoNextPageFrom_to_Login(){
                this.ShowPageA = true;
                this.ShowPageB = false;
                this.ShowPageC = false;
                console.log('前往登录');
                this.$router.push("/login")
            }
        }
        
    }
</script>

<style  scoped>
@import "~animate.css/animate.min.css";
.GuideContainer {
position: fixed; /* 页面固定 */
top: 0; /* 顶部对齐 */
left: 0; /* 左侧对齐 */
width: 100%; /* 宽度100% */
height: 100%; /* 高度100% */
overflow: hidden; /* 禁止溢出内容显示 */
}
/* PageA引导页面 */
.PageA {
  
}
.GroupA{
  position:absolute;
  
  width:102%;;
  height:46%;
  left:0px;
  top: 460px;
}
.CorrectBlue{
  position:absolute;
  
  width:42%;;
  height:auto;
  left:10px;
  top: 330px;
}
.CrossGreen{
  position:absolute;
  
  width:32%;;
  height:auto;
  right:10px;
  top: 170px;
}
.RectangleRed{
  position:absolute;
  
  width:32%;;
  height:auto;
  left: 40px;
  top: 30px;
}





/* PageB引导页面 */
.PageB {
  
}
.GroupB{
  position:absolute;
  
  width:156%;;
  height:80%;
  left:-105px;
  top: 250px;
}
.EllipiticA{
  position:absolute;
  
  width:5%;;
  height:auto;
  right:30px;
  top: 210px;
}
.EllipiticB{
  position:absolute;
  
  width:45%;;
  height:auto;
  right:-120px;
  top: 40px;
}
.RectangleHallow{
    position:absolute;
  
  width:21%;;
  height:auto;
  left:-30px;
  top: 50px;
}
.VectorA{
    position:absolute;
  
  width:40%;;
  height:auto;
  right:-20px;
  top: 210px;
}
.VectorB{
    position:absolute;
  
  width:110%;;
  height:auto;
  left:-20px;
  top: 20px;
}
/* PageC引导页面 */
.PageC {
  
}
.GroupC{
    position:absolute;
  
  width:156%;;
  height:80%;
  left:-105px;
  top: -5px;
}
.VectorC{
    position:absolute;
  
  width:100%;;
  height:auto;
  left:0px;
  top: 320px;
}
.Signal{
    position:absolute;
  
  width:25%;;
  height:auto;
  right:0px;
  top: 550px;
}
/* 通用 */
.Line{
  position:absolute;
  
  width:15%;;
  height:auto;
  left: 35px;
  bottom: 60px;
}
.custom-btn {
  font-weight: bold; /* 设置字体加粗 */
  background-color: #16eef6; /* 更改背景色 */
  border: 2px solid #22f7c9; /* 增加双线边框 */
  color: #333; /* 设置文字颜色 */
  padding-left: 8px; /* 增加左侧内边距 */
  padding-right: 8px; /* 增加右侧内边距 */
  border-radius: 20px; /* 设置按钮的圆角 */

  position:absolute;
  right: 35px;
  bottom: 50px;
}
.custom-btnx {
  font-weight: bold; /* 设置字体加粗 */
  background-color: #16eef6; /* 更改背景色 */
  border: 2px solid #22f7c9; /* 增加双线边框 */
  color: #ffffff; /* 设置文字颜色 */
  padding-left: 8px; /* 增加左侧内边距 */
  padding-right: 8px; /* 增加右侧内边距 */
  border-radius: 20px; /* 设置按钮的圆角 */

  position:absolute;
  right: 35px;
  bottom: 50px;
}
/* 图标样式 */
.btn-icon {
    margin-right: 2px; /* 设置图标与文字的间距 */
    margin-left: 2px; /* 设置图标与文字的间距 */
  color:#ffffff;
  font-size: 24px; /* 设置图标的大小 */
}


.animated-content {
  display: inline-block;
  width: 100%;
}

/* 自定义按钮样式 */
.descriptionA {
    position: relative;
  text-align:left;
  margin-top: 450px;
  font-size: 18px;
  left:20px;
  color:#ffffff;
  z-index: 9999;
  width:300px;
}
.descriptionB {
    position: relative;
  text-align: right;
  margin-top: 380px;
  font-size: 18px;
  right:0px;
  color:#ffffff;
  z-index: 9999;
  width:300px;
}
.descriptionC {
    position: relative;
  text-align: left;
  margin-top: 90px;
  font-size: 18px;
  left:20px;
  color:#ffffff;
  z-index: 9999;
  width:300px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s; /* 定义过渡的属性和持续时间 */
}

.fade-enter,
.fade-leave-to /* .fade-leave-active 在 Vue 2.1.8+ 中可用 */ {
  opacity: 0; /* 初始状态设置为透明 */
}


</style>