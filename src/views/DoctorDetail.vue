<template>
    <div name="setting">
        <van-nav-bar title="医生信息" fixed placeholder left-arrow left-text="返回" @click-left="goBack"
            style="--van-nav-bar-title-font-size: 18px;" />

        <!-- 用户信息 -->
        <div class="user-info">
            <div class="name">{{ doctorData.name }}</div>
            <div class="profile">{{ doctorData.department }}</div>
        </div>

        <!-- 个人信息 -->
        <div class="FuncArea">
            <!-- 个人 -->
            <van-cell-group title="简要信息">
                <!-- 年龄 -->
                <van-cell :value="doctorData.age">
                    <template #title>
                        <div class="optionBar">
                            <img src="@/assets/setting/age.png" alt="age">
                            <span>年龄</span>
                        </div>
                    </template>
                </van-cell>

                <!-- 性别 -->
                <van-cell :value="doctorData.gender">
                    <template #title>
                        <div class="optionBar">
                            <img src="@/assets/setting/gender.png" alt="gender">
                            <span>性别</span>
                        </div>
                    </template>
                </van-cell>

                <!-- 电话 -->
                <van-cell :value="doctorData.account">
                    <template #title>
                        <div class="optionBar">
                            <img src="@/assets/setting/phone.png" alt="phone">
                            <span>电话</span>
                        </div>
                    </template>
                </van-cell>
            </van-cell-group>


        </div>

        <textarea name="" id="" cols="47" rows="4">
    {{ doctorData.title }}
</textarea>

        <textarea name="" id="" cols="47" rows="15">
    {{ doctorData.introduction }}
</textarea>
    </div>
</template>

<script>
import { get, put, post, del } from "../axios/axiosConfig.js";
import axios from "axios";
import { showConfirmDialog } from 'vant';
export default {
    data() {
        return {
            doctorData: {
                name: "",
                account: "",
                gender: "",
                age: 0,
                department: "",
                title: "",
                introduction: ""
            },
        }
    },
    // 组件创建时调用
    mounted() {
        this.getDoctorInfo();
    },
    methods: {
        // 返回
        goBack() {
            this.$router.go(-1);
        },

        // 获取医生信息
        getDoctorInfo() {
            get("/user/user/getDoctor")
                .then((res) => {
                    console.log("getDoctorInfo", res);
                    if (res.code == 200) {
                        this.doctorData = res.data;
                    } else {
                        this.$toast.fail(res.msg);
                    }
                })
                .catch((error) => {
                    console.log("getDoctorInfo", error);
                });
        },
    },
}
</script>

<style scoped>
.setting {
    background-color: #f8f8f8;
}

.user-info {
    background-color: #bbc2c26c;
    /* background-image: url("../assets/setting/top3.jpg"); */
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
    background-color: rgba(151, 174, 175, 0);
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

textarea {
  font-size: 15px;
  border: 1px solid rgb(225, 218, 218);
  border-radius: 10px;
  background-color: rgba(151, 174, 175, 0);
  width: 95%;
  margin: 3% auto; /* 水平居中 */
  padding: 10px;
  display: block; /* 确保是块级元素 */
}

</style>