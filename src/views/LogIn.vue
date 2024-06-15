
<template>
  <div class="image_container">
    <img :src="require('@/assets/background_img/Rectangle 1.png')" alt="Background Image" class="Rectangle_1">
    <img :src="require('@/assets/background_img/Rectangle 2.png')" alt="Background Image" class="Rectangle_2">
    <img :src="require('@/assets/background_img/Rectangle 3.png')" alt="Background Image" class="Rectangle_3">
  </div>


  <!-- 引导界面 -->
  <transition name="fade">
    <div class="guide" v-if="showGetStarted">
      <div>
        <img :src="require(`@/assets/Medcine.png`)" alt="Icone" class="Icon_Box">
      </div>

      <div class="Text_Box">
        <span>糖小智</span>
      </div>

      <div class="Text_Introdution">
        <span>面向糖尿病患者的</span>
        <span>饮食管理与营养评估系统</span>
      </div>
    </div>


  </transition>
  <!-- 登录界面 -->
  <transition name="fade">
    <div class="login" v-if="showLoginButton" style="text-align: center;">
      <div class="Login_Text">
        <span>登录</span>
      </div>
      <div class="Login_Form">
        <!-- 输入账号即手机号 -->
        <span>账号</span>
        <van-field class="in_put" name="account" type="tel" v-model="loginData.account">
        </van-field>
        <!-- 输入密码 -->
        <span>密码</span>
        <van-field class="in_put" name="password" type="password" v-model="loginData.password"></van-field>
      </div>

    </div>



  </transition>
  <!-- 注册界面 -->
  <transition name="fade">
    <div class="register" v-if="showRegisterButton">
      <div class="Register_Text">
        <span>注册</span>
      </div>



      <div class="Register_Form">
        <!-- 输入昵称 -->
        <span>昵称</span>
        <van-field class="in_put" v-model="registerData.name">
        </van-field>
        <!-- 输入手机号 -->
        <span>手机号</span>
        <van-field class="in_put" v-model="registerData.account" type="tel">
        </van-field>
        <!-- 输入密码 -->
        <span>密码</span>
        <van-field class="in_put" v-model="registerData.password" type="password">
        </van-field>


        <!-- 获取验证码 -->
        <span>验证码</span>
        <div class="input_with_button">
          <van-field class="in_put_code" v-model="registerData.code" type="digit">
          </van-field>
          <van-button @click="getVerificationCode" class="GetCodeButton">
            获取验证码
          </van-button>
        </div>


      </div>

    </div>


  </transition>
  <!-- 切换按钮 -->
  <div class="change">

    <span @click="ClickRegister" key="register" v-if="showLoginButton">
      没有账号?去注册
    </span>

    <span @click="ClickLogin" key="login" v-if="showRegisterButton">
      已有账号?去登录
    </span>

  </div>


  <!-- 按钮切换 -->
  <transition name="fade">
    <div>
      <van-button v-if="showGetStarted" class="my_button" @click="ClickStart">
        开始
      </van-button>
    </div>
  </transition>
  <transition name="fade">
    <div>
      <van-button v-if="showLoginButton" class="my_button" @click="login">
        登录
      </van-button>
    </div>
  </transition>
  <transition name="fade">
    <div>
      <van-button v-if="showRegisterButton" class="my_button" @click="register">
        注册
      </van-button>
    </div>
  </transition>
</template>

<script>
import { get, put, post, del } from "../axios/axiosConfig.js";
import {ElMessage} from 'element-plus';
import store from "../store/index";
import { ref } from 'vue';
export default {
  data() {
    return {
      userData: {
        name: '',
        account: '',

        gender: '',
        age: 0,
        height: 0,
        weight: 0,
        diabetesType: '',
      },
      loginData: {
        account: '',
        password: '',
      },
      registerData: {
        name: '',
        account: '',
        code: '',
        password: '',
      },

      //控制GetStarted按钮
      showGetStarted: true,
      //控制Login按钮
      showLoginButton: false,
      //控制Register按钮
      showRegisterButton: false,
    };
  },
  methods: {
    ClickStart() {
      this.showGetStarted = false;
      this.showLoginButton = true;
      console.log('Button start clicked!');
      // 在这里可以添加要执行的操作
    },
    ClickRegister() {
      this.showLoginButton = false;
      this.showRegisterButton = true;
      console.log('Span register clicked!');
      // 在这里可以添加要执行的操作
    },
    ClickLogin() {
      this.showLoginButton = true;
      this.showRegisterButton = false;
      console.log('Span login clicked!');
      // 在这里可以添加要执行的操作
    },


    async login() {
      if (this.loginData.account === "") {
        /* this.$message.error("账号不能为空！"); */
        ElMessage.error("账号不能为空!");
        return;
      }
      else if (this.loginData.password === "") {

        ElMessage.error("密码不能为空!");
        return;
      }
      try {
        const response = await post('/user/user/login', {
          account: this.loginData.account,
          password: this.loginData.password,
          // role: "PATIENT",
        });

        // 处理登录成功的逻辑
        const { code, message, data } = response;
        console.log('Code:', code);
        console.log('Message:', message);
        console.log('Data:', data);

        if (code === 200) { // 假设200表示登录成功，根据实际返回的 code 值修改条件
          // 使用 Vue Router 跳转到 HomePage
          console.log('登录成功', response.data);
          this.GetUserInformation();

          this.$message.success(message);
          // store.commit('login', data); // 更改为登录状态


        }
        else {
          this.$message.error(message);
        }


      } catch (error) {
        // 处理登录失败的逻辑
        console.error('登录失败', error);
        if (error.response) {
          console.error('Error Response:', error.response.data);
        }
        this.$message.error('登录失败', error); 
      }
    },



    //注册
    async register() {
      if (this.registerData.name === "") {

        ElMessage.error("昵称不能为空!");
        return;
      }
      else if (this.registerData.accountaccount === "") {

        ElMessage.error("账号不能为空!");
        return;
      }
      else if (this.registerData.code === "") {
        /*  this.$message.error("请填写验证码！"); */
        ElMessage.error("请填写验证码!");
        return;
      }
      else if (this.registerData.password === "") {

        ElMessage.error("密码不能为空!");
        return;
      }
      try {
        const response = await post('/user/user/register', {
          name: this.registerData.name,
          account: this.registerData.account,
          password: this.registerData.password,
          code: this.registerData.code,
        });
        // 处理注册成功的逻辑
        console.log('注册成功', response.data);
        this.$message.success('注册成功');
        const { code, message, data } = response;
        console.log('Code:', code);
        console.log('Message:', message);
        console.log('Data:', data);
        //注册成功后跳回登录界面
        this.showLoginButton = true;
        this.showRegisterButton = false;
      } catch (error) {
        // 处理注册失败的逻辑
        console.error('注册失败', error);
        if (error.response) {
          console.error('Error Response:', error.response.data);
          this.$message.error('注册失败', error);
        }
      }


    },
    async GetUserInformation() {
      try {
        const userAccountRes = await get('/user/user/get');
        const response = await get('/user/user/getDetail')
          .then(response => {
            console.log('Data get successfully:', response.data);
            if (response.data === null) {
              ElMessage({
                dangerouslyUseHTMLString: true,
                message: '<strong>详细信息缺失</strong><br/>请填写详细信息',
                type: 'error',
              });
              return;
            }
            this.userData = response.data;
            this.userData.profile = userAccountRes.data.profile;
            // this.userData.name = response.data.name;
            // this.userData.account = response.data.account;


            // this.userData.gender = response.data.gender;
            // this.userData.age = response.data.age;
            // this.userData.height = response.data.height;
            // this.userData.weight = response.data.weight;
            // this.userData.diabetesType = response.data.diabetesType;

            if (this.userData.gender === '' || this.userData.gender === null) {
              console.log('由于性别而填充信息');
              console.log('性别', this.userData.gender, 'null');

              this.$router.push({ name: 'information' });
            }
            else if (this.userData.age === 0 || this.userData.age === null) {
              console.log('由于年龄而填充信息');
              this.$router.push({ name: 'information' });
            }
            else if (this.userData.height === 0 || this.userData.height === null) {
              console.log('由于身高而填充信息');
              this.$router.push({ name: 'information' });
            }
            else if (this.userData.weight === 0 || this.userData.weight === null) {
              console.log('由于体重而填充信息');
              this.$router.push({ name: 'information' });
            }
            else if (this.userData.diabetesType === '' || this.userData.diabetesType === null) {
              console.log('由于糖尿病类型而填充信息');
              this.$router.push({ name: 'information' });
            }
            else {
              console.log('跳转主页');
              this.$router.push({ name: 'home' });
              this.$store.commit('setUserData', this.userData);
            }
            console.log('Get_userdata_after_login', this.userData);
          })

      } catch (error) {
        console.error('Error gettinging data in login:', error);
        // 处理接受数据失败的情况
      }
    },


    //获取验证码
    async getVerificationCode() {
      if (this.registerData.account == "") {
        this.$message.error("账号不能为空！");
        return;
      }

      try {
        const response = await get(`/user/user/sendCode/${this.registerData.account}`);
        // 处理获取验证码成功的逻辑
        console.log('获取验证码成功', response.data);
        ElMessage.success('已发送验证码');
        const { code, message, data } = response;
        console.log('Code:', code);
        console.log('Message:', message);
        console.log('Data:', data);
      } catch (error) {
        // 处理获取验证码失败的逻辑
        console.error('获取验证码失败', error);
        if (error.response) {
          console.error('Error Response:', error.response.data);
        }
      }
    },
  }
};
</script>

<style scoped>
/* 样式可以在这里添加 */
.image_container {
  position: fixed;
  /* 页面固定 */
  top: 0;
  /* 顶部对齐 */
  left: 0;
  /* 左侧对齐 */
  width: 100%;
  /* 宽度100% */
  height: 100%;
  /* 高度100% */
  overflow: hidden;
  /* 禁止溢出内容显示 */

}

.Rectangle_1 {
  position: absolute;

  width: 102%;
  ;
  height: 45%;
  left: 0px;
  top: -210px;


}

.Rectangle_2 {
  position: relative;
  width: 145%;
  height: 58%;
  top: -140px;
  left: -30px;

}

.Rectangle_3 {
  position: relative;
  width: 120%;
  height: 40%;
  top: 80px;
  left: -50px;
}

.my_button {
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

.Icon_Box {
  position: relative;
  width: 75px;
  height: 75px;
  left: 55px;
  top: 300px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.Text_Box {
  position: relative;
  width: 200px;
  height: 75px;
  left: 62px;
  top: 300px;

  font-family: Nunito;
  font-size: 20px;
  font-weight: 900;
  line-height: 33px;
  letter-spacing: -1.5%;

  color: rgba(47, 128, 237, 0.7);
}

.Text_Introdution {
  position: relative;
  width: 220px;
  height: 75px;
  left: 62px;
  top: 250px;

  font-family: Nunito;
  font-size: 18px;
  font-weight: 900;
  line-height: 33px;
  letter-spacing: -1.5%;

  color: rgba(47, 128, 237, 0.7);
}

.Login_Text {
  position: absolute;
  width: 100px;
  height: 75px;
  left: 55px;
  top: 290px;

  font-family: Nunito;
  font-size: 43px;
  font-weight: 1000;
  line-height: 33px;
  letter-spacing: -1.5%;
  text-align: center;

  color: rgba(47, 128, 237, 0.7);
}

.Register_Text {
  position: absolute;
  width: 100px;
  height: 75px;
  left: 55px;
  top: 200px;

  font-family: Nunito;
  font-size: 43px;
  font-weight: 1000;
  line-height: 33px;
  letter-spacing: -1.5%;

  color: rgba(47, 128, 237, 0.7);
}


.Login_Form {
  position: absolute;
  width: 240px;

  left: 55px;
  top: 350px;

  font-size: 17px;
  font-weight: 500;
  line-height: 33px;
  letter-spacing: -1.5%;
  color: rgba(47, 128, 237, 0.7);
}

.Register_Form {
  position: absolute;
  width: 240px;

  left: 55px;
  top: 250px;

  font-size: 17px;
  font-weight: 500;
  line-height: 33px;
  letter-spacing: -1.5%;
  color: rgba(47, 128, 237, 0.7);
}

.in_put {
  border: 1px solid rgb(255, 255, 255);
  border-radius: 7px;
  border-color: rgba(47, 128, 237, 0.7);
  width: 240px;
}

.in_put::v-deep .van-field__control input {
  color: rgba(47, 128, 237, 0.7);
  /* 修改输入文字的颜色 */
}

.in_put_code {
  border: 1px solid rgb(255, 255, 255);
  border-radius: 7px;
  border-color: rgba(47, 128, 237, 0.7);
  width: 140px;
}

.change {
  position: absolute;
  color: rgba(255, 255, 255, 1);
  font-size: 17px;
  font-weight: 400;
  line-height: 33px;
  letter-spacing: -1.5%;
  left: 30px;
  top: 660px;

}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
  /* 定义过渡的属性和持续时间 */
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active 在 Vue 2.1.8+ 中可用 */
  {
  opacity: 0;
  /* 初始状态设置为透明 */
}

.input_with_button {
  display: flex;
  align-items: center;
  /* 让按钮与输入框垂直居中 */

}

.GetCodeButton {
  border: 1px solid rgb(255, 255, 255);
  border-radius: 7px;
  border-color: rgba(47, 128, 237, 0.7);
  color: rgba(47, 128, 237, 0.7);
  font-size: 17px;
}
</style>