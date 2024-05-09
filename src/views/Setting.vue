<template>
  <div name="setting">
    <!-- 页面内容 -->
    <!-- 用户信息 -->
    <div class="user-info">
      <van-uploader :max-size="500 * 1024" @oversize="onOversize" :after-read="handleAfterRead">
        <el-avatar :src="avatarSrc" />
      </van-uploader>
      <div class="name">{{ userData.name }}</div>
      <div class="profile">{{ userData.account }}</div>
      <!-- <van-skeleton title avatar :row="3" :loading="false">
        <div>实际内容</div>
      </van-skeleton> -->
    </div>

    <!-- 两个圆角矩形， 水平排列 -->
    <!-- <div class="grid">
      <div class="grid-item">
      </div>
      <div class="grid-item">
      </div>
    </div> -->

    <!-- 设置项 -->
    <div class="FuncArea">
      <!-- 个人 -->
      <van-cell-group title="个人">
        <!-- 身高 -->
        <van-cell :value="userData.height" is-link @click="showPicker.height = true">
          <template #title>
            <div class="optionBar">
              <img src="@/assets/setting/height.png" alt="height">
              <span>身高</span>
            </div>
          </template>
        </van-cell>
        <van-dialog v-model:show="showPicker.height" title="更改身高" theme="round-button" :showConfirmButton="false">
          <van-form ref="heightForm">
            <van-field v-model="userData.height" required label="身高" autosize placeholder="请输入身高(100-200)cm"
              :rules="[{ pattern: patterns.height, message: '请输入正确内容' }]" />
          </van-form>
          <div style="margin: 10px;">
            <van-button round block type="primary" native-type="submit"
              @click="handleFormConfirm($refs.heightForm, 'height')">
              提交
            </van-button>
          </div>
        </van-dialog>

        <!-- 体重 -->
        <van-cell :value="userData.weight" is-link @click="showPicker.weight = true">
          <template #title>
            <div class="optionBar">
              <img src="@/assets/setting/weight.png" alt="weight">
              <span>体重</span>
            </div>
          </template>
        </van-cell>
        <van-dialog v-model:show="showPicker.weight" title="更改体重" theme="round-button" :showConfirmButton="false">
          <van-form ref="weightForm">
            <van-field v-model="userData.weight" required label="体重" autosize placeholder="请输入体重(0-200)kg"
              :rules="[{ pattern: patterns.weight, message: '请输入正确内容' }]" />
          </van-form>
          <div style="margin: 10px;">
            <van-button round block type="primary" native-type="submit"
              @click="handleFormConfirm($refs.weightForm, 'weight')">
              提交
            </van-button>
          </div>
        </van-dialog>

        <!-- 年龄 -->
        <van-cell :value="userData.age" is-link @click="showPicker.age = true">
          <template #title>
            <div class="optionBar">
              <img src="@/assets/setting/age.png" alt="age">
              <span>年龄</span>
            </div>
          </template>
        </van-cell>
        <van-dialog v-model:show="showPicker.age" title="更改年龄" theme="round-button" :showConfirmButton="false">
          <van-form ref="ageForm">
            <van-field v-model="userData.age" required label="体重" autosize placeholder="请输入年龄(1-100)岁"
              :rules="[{ pattern: patterns.age, message: '请输入正确内容' }]" />
          </van-form>
          <div style="margin: 10px;">
            <van-button round block type="primary" native-type="submit"
              @click="handleFormConfirm($refs.ageForm, 'age')">
              提交
            </van-button>
          </div>
        </van-dialog>

        <!-- 性别 -->
        <van-cell :value="userData.gender" is-link @click="showPicker.gender = true">
          <template #title>
            <div class="optionBar">
              <img src="@/assets/setting/gender.png" alt="gender">
              <span>性别</span>
            </div>
          </template>
        </van-cell>
        <van-popup v-model:show="showPicker.gender" round position="bottom">
          <van-picker :columns="genders" @cancel="showPicker.gender = false"
            @confirm="handlePickerConfirm($event, 'gender')" />
        </van-popup>

        <!-- 类别 -->
        <van-cell :value="userData.diabetesType" is-link @click="showPicker.diabetesType = true">
          <template #title>
            <div class="optionBar">
              <img src="@/assets/setting/type.png" alt="type">
              <span>类别</span>
            </div>
          </template>
        </van-cell>
        <van-popup v-model:show="showPicker.diabetesType" round position="bottom">
          <van-picker :columns="diabetesTypes" @cancel="showPicker.diabetesType = false"
            @confirm="handlePickerConfirm($event, 'diabetesType')" />
        </van-popup>
      </van-cell-group>

      <!-- 账号 -->
      <van-cell-group title="账号">
        <!-- 修改密码 -->
        <van-cell is-link @click="showPicker.password = true">
          <template #title>
            <div class="optionBar">
              <img src="@/assets/setting/password.png" alt="password">
              <span>修改密码</span>
            </div>
          </template>
        </van-cell>
        <van-dialog v-model:show="showPicker.password" title="更改密码" theme="round-button" :showConfirmButton="false">
          <van-form ref="passwordForm">
            <van-field v-model="userData.account" required label="账户" autosize placeholder="请输入账户"
              :rules="[{ pattern: patterns.account, message: '请输入正确内容' }]" />
            <van-field v-model="password" required label="密码" autosize placeholder="密码(不含中文,6位以上)" type="password"
              :rules="[{ pattern: patterns.password, message: '请输入正确内容' }]" />
            <van-field v-model="rePassword" required label="新密码" autosize placeholder="新密码(不含中文,6位以上)" type="password"
              :rules="[{ pattern: patterns.password, message: '请输入正确内容' }]" />
            <van-field v-model="sms" required center clearable label="短信验证码" placeholder="请输入验证码"
              :rules="[{ pattern: patterns.sms, message: '请输入正确内容' }]">
              <template #extra>
                <van-button size="small" type="primary" :disabled="smsButtonDisabled"
                  @click="getVerificationCode()">发送验证码</van-button>
              </template>
            </van-field>
          </van-form>
          <!-- <div style="margin: 10px;">
            <van-button round block type="primary" native-type="submit"
              @click="handleFormConfirm($refs.passwordForm, 'password')">
              提交
            </van-button>
          </div> -->
          <div style="display: flex; margin: 10px;">
            <van-button round type="default" @click="showPicker.password = false" style="flex: 1;">
              取消
            </van-button>
            <van-button round type="primary" native-type="submit"
              @click="handleFormConfirm($refs.passwordForm, 'password')" style="flex: 1;">
              提交
            </van-button>
          </div>

        </van-dialog>

        <!-- 绑定手机号 -->
        <van-cell is-link>
          <template #title>
            <div class="optionBar">
              <img src="@/assets/setting/phone.png" alt="phone">
              <span>绑定手机号</span>
            </div>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 关于 -->
      <van-cell-group title="关于">
        <van-cell title="版本信息" is-link />
        <van-cell title="帮助与反馈" is-link />
      </van-cell-group>
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

    <van-button round class="saveButton" v-if="userDataChanged" @click="saveUserInfo">
      保存
    </van-button>
  </div>
</template>

<script>
import { get, put, post, del } from "../axios/axiosConfig.js";
import axios from "axios";
import { showConfirmDialog } from 'vant';
export default {
  data() {
    return {
      userData: {}, // 用户信息
      sms: '', // 短信验证码
      password: '', // 密码
      rePassword: '', // 确认密码
      smsButtonDisabled: false, // 短信验证码按钮是否禁用
      avatarSrc: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",

      showPicker: {
        height: false,
        weight: false,
        age: false,
        gender: false,
        diabetesType: false,
        password: false,
        phone: false,
      },
      patterns: {
        height: /^(1\d{2}|200)$/, // 身高在 100 到 200 之间的正则表达式
        weight: /^(?:1\d{2}|[1-9]?\d)$/, // 体重在 10 到 200 之间的正则表达式
        age: /^(?:[1-9]?\d|100)$/, // 年龄在 1 到 100 之间的正则表达
        password: /^[^\u4e00-\u9fa5]{6,}$/,//密码不能包含中文，长度大于6
        sms: /^\d{6}$/,//6位数字
      },
      genders: [
        { text: "男", value: "男" },
        { text: "女", value: "女" },
      ],
      diabetesTypes: [
        { text: "一型糖尿病", value: "一型糖尿病" },
        { text: "二型糖尿病", value: "二型糖尿病" },
      ],
    }
  },
  // 组件创建时调用
  mounted() {
    this.getUserInfo();
  },
  // 组件销毁时调用
  beforeUnmount() {
  },
  // 计算属性
  computed: {
    userDataChanged() {
      for (const key in this.userData) {
        // console.log(key, this.userData[key], this.$store.state.userData[key]);
        if (this.userData[key] != this.$store.state.userData[key]) {
          // 只判断值是否变化，而不判断类型
          return true;
        }
      }
      return false;
    }
  },
  // 监听
  watch: {
    // // 监听userData的变化
    // 'userData': {
    //   handler(newValue, oldValue) {
    //     console.log('userData 发生了变化', newValue, oldValue);
    //     // this.userDataChanged = true;
    //   },
    //   deep: true,
    // }
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      console.log('userdata', this.userData);
      if (!this.userData.account) {
        this.GetUserInfo();
      }
    },
    // 异步获取用户信息
    async GetUserInfo() {
      try {
        const userDetailRes = await get('/user/user/getDetail');
        const userAccountRes = await get('/user/user/get');
        this.userData = userDetailRes.data;
        if (userAccountRes.data.profile) {
          this.avatarSrc = userAccountRes.data.profile;
          // console.log('头像', userAccountRes.data.profile);
        }
        this.$store.commit('setUserData', JSON.parse(JSON.stringify(userDetailRes.data)));
      } catch (error) {
        // 处理登录失败的逻辑
        console.error('获取用户详细信息失败', error);
      }
    },
    // 处理表单确认事件
    handleFormConfirm(form, attributeName) {
      // 手动触发表单校验
      form.validate()
        .then(() => {
          // 校验成功
          console.log('校验成功');
          this.showPicker[attributeName] = false;
          if (attributeName == 'password') {
            this.changePassword();
          }
        })
        .catch(() => {
          // 校验失败
          console.log('校验失败');
          this.$toast('请先填写正确的信息');
        });
    },
    // 获取验证码
    async getVerificationCode() {
      if (this.userData.account == "") {
        this.$message.error("请先填写账号！");
        return;
      }
      if (this.password == "") {
        this.$message.error("请先填写密码！");
        return;
      }
      if (this.rePassword == "") {
        this.$message.error("请先填写新密码！");
        return;
      }
      try {
        const response = await get(`/user/user/sendCodeUpdate/${this.userData.account}`);
        // 处理获取验证码成功的逻辑
        console.log('获取验证码成功', response);
        ElMessage('已发送验证码');
        this.smsButtonDisabled = true;
        setTimeout(() => {
          this.smsButtonDisabled = false;
        }, 60000);
      } catch (error) {
        // 处理获取验证码失败的逻辑
        console.error('获取验证码失败', error);
        if (error.response) {
          console.error('Error Response:', error.response.data);
        }
      }
    },
    // 修改密码
    async changePassword() {
      try {
        const queryData = {
          "name": this.userData.name,
          "account": this.userData.account,
          "password": this.password,
          "rePassword": this.rePassword,
          "code": this.sms,
        }
        const response = await put('/user/user/forgetPassword', queryData);
        this.$message.success('修改密码成功');
        console.log('修改密码', response);
      } catch (error) {
        // 处理登录失败的逻辑
        console.error('失败', error);
      }
    },
    // 处理选择器确认事件
    handlePickerConfirm(selectedValue, attributeName) {
      // console.log('selectedValue', selectedValue);
      this.userData[attributeName] = selectedValue.value;
      this.showPicker[attributeName] = false;
    },
    // 保存用户信息
    async saveUserInfo() {
      try {
        const response = await put('/user/user/updateDetail', this.userData);
        console.log('保存成功', response.data);
        this.$store.commit('setUserData', JSON.parse(JSON.stringify(this.userData)));
      } catch (error) {
        // 处理登录失败的逻辑
        console.error('失败', error);
        if (error.response) {
          console.error('Error Response:', error.response.data);
        }
      }
    },
    // 超出文件大小的回调
    onOversize() {
      console.log(file);
      showToast('文件大小不能超过 500kb');
    },
    // 读取文件后的回调
    async handleAfterRead(file) {  
      try {
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };
        console.log('头像文件', file.file);
        const formData = new FormData();
        formData.append('file', file.file);
        console.log('formData', formData.get('file'));
        const response = await post('/user/user/uploadProfix', {file: formData}, config);
        this.avatarSrc = URL.createObjectURL(file.file);
        console.log('上传头像', response);
      }
      catch (error) {
        console.error('上传头像失败', error);
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
  /* background-color: #97c1eb; */
  background-image: url("../assets/setting/top3.jpg");
  background-size: cover;
  /* 让背景图片自适应并覆盖整个父元素 */
  /* 设置阴影 */
  box-shadow: 0 0 10px rgb(81, 79, 79);
  color: rgb(84, 138, 116);
  padding: 20px;
  text-align: center;
  /* border: 1px solid black; */
  border-radius: 10px;
  width: 95%;
  margin: 10px auto;
}

.name {
  font-size: 35px;
  margin-top: 10px;
}

.profile {
  font-size: 20px;
  margin-top: 5px;
}

.van-cell-group {
  margin-top: 20px;
}

.van-cell {
  background-color: white;
}

.optionBar {
  position: relative;
  display: flex;
  align-items: center;
}

.optionBar>img {
  height: 90%;
  width: auto;
  position: absolute;
}

.optionBar>span {
  margin-left: 30px;
}


.grid {
  width: 95%;
  margin: 20px auto;
  display: flex;
  justify-content: space-between;
}

.grid-item {
  width: 47%;
  height: 0;
  padding-bottom: 20%;
  position: relative;
  border: 1px solid rgb(72, 56, 56);
  border-radius: 10px;
  font-size: 15px;
}


.FuncArea {
  border: 1px solid rgb(225, 218, 218);
  border-radius: 10px;
  background-color: rgba(184, 215, 216, 0.64);
  width: 95%;
  margin: 3% auto;
  padding: 10px;
}

.saveButton {
  position: absolute;
  width: 95%;
  background-color: rgb(100, 111, 107);
  color: white;
  font-size: 20px;
  left: 0;
  right: 0;
  margin: 1px auto;
}
</style>