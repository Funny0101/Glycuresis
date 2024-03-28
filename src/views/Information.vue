<template>
     <div class = "GuideInformation">

        <img src="../assets/BackgroundInformation.png" 
            alt="BackgroundInformation Image" 
            class ="BackgroundInformation"
            />
        

            <div class = "UserDetail_Form">
            
            <span>年龄（岁）</span>
            <van-field class = "in_put"
            name="age"
            type="number"
            v-model="this.userDetailData.age"
            >
            </van-field>

            <span>身高（cm）</span>
            <van-field class = "in_put"
            name="height"
            type="number"
            v-model="this.userDetailData.height"
            >
            </van-field>
           
            <span>体重（kg）</span>
            <van-field class = "in_put"
            name="weight"
            type="number"
            v-model="this.userDetailData.weight"
           ></van-field>
            </div>


        <div>
            <van-field
            v-model="this.userDetailData.gender"
            is-link
            readonly
            label="性别"
            placeholder="请选择您的性别"
            @click="show_gender = true"
            class =  "gender-picker"
            />
            <van-popup v-model:show="show_gender" round position="bottom" class="custom-popup">
            <van-cascader
                v-model="cascaderValue"
                title="请选择您的性别"
                :options="optionsGender"
                @close="show_gender = false"
                @finish="onFinishGender"
                class="custom-cascader"
                popup-class="custom-popup-content"
                :columns-top="['gender']"
            />
            </van-popup>
        </div>


        <div>
            <van-field
            v-model="this.userDetailData.diabetesType"
            is-link
            readonly
            label="糖尿病类型"
            placeholder="请选择您的糖尿病类型"
            @click="show_category = true"
            class =  "category-picker"
            />
            <van-popup v-model:show="show_category" round position="bottom" class="custom-popup">
            <van-cascader
                v-model="cascaderValue"
                title="请选择您的糖尿病类型"
                :options="optionsCategory"
                @close="show_category= false"
                @finish="onFinishCategory"
                class="custom-cascader"
                popup-class="custom-popup-content"
                :columns-top="['category']"
            />
            </van-popup>
        </div>


        <div>
        <van-button 
        class ="my_skipbutton" 
        @click="skip">
        跳过
        </van-button>
        </div>

        <div>
        <van-button
        class ="my_confirmbutton" 
        @click="confirm">
        确定
        </van-button>
        </div>
            
          
    </div>
  </template>
  
  <script>
  import { get, put, post, del } from "../axios/axiosConfig.js";
  import { ref } from 'vue';
  export default {
   
  
 data(){
    return {
     
      userDetailData:{
        name:'',
        account:'',
        gender: '',
        age: 0,
        height: 0,
        weight: 0,
        diabetesType: '',
      },

      optionsGender: [
        {
        text: '男',
        value: '男',
        
        },
      {
        text: '女',
        value: '女',
        
      },
     
        ],

        

      optionsCategory: [
        {
        text: '一型糖尿病',
        value: '一型糖尿病',
        
        },
      {
        text: '二型糖尿病',
        value: '二型糖尿病',
        
      },
      
        ],
      
    
    show_gender: ref(false),
    show_category: ref(false),
  
    cascaderValue:ref(''),

      

    };
  },
 
 mounted(){
 this.getUserInfo();
  },
 
  methods: {
    async getUserInfo(){
      try {
            const response = await get('/user/user/getDetail', {
            })
            .then(response => {
            console.log('Data get successfully:', response.data);
              this.userDetailData.name =  response.data.name;
              this.userDetailData.account =  response.data.account;
              this.userDetailData.gender = response.data.gender;
              this.userDetailData.age=response.data.age;
              this.userDetailData.height= response.data.height;
              this.userDetailData.weight= response.data.weight;
              this.userDetailData.diabetesType= response.data.diabetesType;
            console.log('Get_userdata',this.userDetailData);  
          })
            
              } catch (error) {
            console.error('Error gettinging data:', error);
            // 处理接受数据失败的情况
          }
    },
    onFinishGender  ( { selectedOptions } )  {
      this.show_gender = false;
      this.userDetailData.gender = selectedOptions.map((option) => option.text).join('/');
    },
    onFinishCategory  ( { selectedOptions } )  {
      this.show_category = false;
      this.userDetailData.diabetesType= selectedOptions.map((option) => option.text).join('/');
    },
    skip(){
        this.$router.push({ name: 'home' });
    },
   
    async confirm() {
  if (this.userDetailData.gender === "") {
    ElMessage.error("性别不能为空!");
    return;
  } else if (this.userDetailData.diabetesType === "") {
    ElMessage.error("糖尿病类型不能为空!");
    return;
  } else if (this.userDetailData.age <= 0) {
    ElMessage.error("年龄不能小于等于零!");
    return;
  } else if (this.userDetailData.height <= 0) {
    ElMessage.error("身高不能小于等于零!");
    return;
  } else if (this.userDetailData.weight <= 0) {
    ElMessage.error("体重不能小于等于零!");
    return;
  }

  try {
    const response = await put('/user/user/updateDetail', {
      name: this.userDetailData.name,
      account: this.userDetailData.account,
      gender: this.userDetailData.gender,
      age: this.userDetailData.age,
      height: this.userDetailData.height,
      weight: this.userDetailData.weight,
      diabetesType: this.userDetailData.diabetesType
    });

    console.log('Update_userDetailData', this.userDetailData);
    console.log('Data sent successfully:', response.data);
    // 处理成功发送数据后的逻辑

    this.$router.push({ name: 'home' });
  } catch (error) {
    console.error('Error sending data:', error);
    // 处理发送数据失败的情况
  }
},



  }

}
  </script>
  
  <style>
  .input-form {
    padding: 20px;
  }
  .GuideContainer {
    position: fixed; /* 页面固定 */
    top: 0px; /* 顶部对齐 */
    left: 0px; /* 左侧对齐 */
    width: 100%; /* 宽度100% */
    height: 100%; /* 高度100% */
    overflow: hidden; /* 禁止溢出内容显示 */
    }
.BackgroundInformation{
    position:absolute;
  
  width:160%;;
  height:140%;
  left:-80px;
  top: -250px;
  z-index:0;
}
.UserDetail_Form{
  position: absolute;
  width:240px;
  
  left:55px;
  top:180px;
  
  font-size: 17px;
  font-weight: 500;
  line-height: 33px;
  letter-spacing: -1.5%;
  color: rgba(47, 128, 237, 0.7);
}
.in_put{
  border: 1px solid rgb(255, 255, 255);
  border-radius: 7px;
  border-color:rgba(47, 128, 237, 0.7);
  width:240px;
 
}
.in_put::v-deep .van-field__control input {
  color: rgba(47, 128, 237, 0.7); /* 修改输入文字的颜色 */
}
.in_put_code{
  border: 1px solid rgb(255, 255, 255);
  border-radius: 7px;
  border-color:rgba(47, 128, 237, 0.7);
  width:140px;
}




.custom-cascader {
  width: 50%;
}

/* 自定义弹出选择框样式 */
.custom-popup {
  
  width:46vh;
  height: 90vh;
}

.custom-popup-content {
  height: 60%;
  width: 60%;
}
.gender-picker{
    position:absolute;
    width:64%;
    top:420px;
    left:55px;
    border: 1px solid rgb(255, 255, 255);
  border-radius: 7px;
  border-color:rgba(47, 128, 237, 0.7);
}
.category-picker{
    position:absolute;
    width:64%;
    top:480px;
    left:55px;
    border: 1px solid rgb(255, 255, 255);
  border-radius: 7px;
  border-color:rgba(47, 128, 237, 0.7);
}


.my_skipbutton{
  position: absolute;
  width: 120px;
  height: 40px;
  left: 230px;
  right: -240px;
  top: 580px;
  bottom: -722px;
  display: flex;
  flex-direction: row;
  align-items: center;

  box-sizing: border-box;
  border: 1px solid rgb(255, 255, 255);
  border-radius: 7px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  background: rgba(33, 33, 34, 0);

  color: rgb(255, 255, 255);
  font-family: Nunito;
  font-size: 20px;
  font-weight: 400;
  line-height: 33px;
  letter-spacing: -1.5%;
  text-align: center;
}
.my_confirmbutton{
  position: absolute;
  width: 120px;
  height: 40px;
  left: 230px;
  right: -240px;
  top: 630px;
  bottom: -722px;
  display: flex;
  flex-direction: row;
  align-items: center;

  box-sizing: border-box;
  border: 1px solid rgb(255, 255, 255);
  border-radius: 7px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  background: rgba(33, 33, 34, 0);

  color: rgb(255, 255, 255);
  font-family: Nunito;
  font-size: 20px;
  font-weight: 400;
  line-height: 33px;
  letter-spacing: -1.5%;
  text-align: center;
}
  </style>
  