import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import store from './store/index'
import 'animate.css'

import './axios/axiosConfig.js'
//导入Vant
import Vant, { Picker } from "vant"; //导入vant
import "vant/lib/index.css"; //导入样式

import "amfe-flexible"; //导入，用于设置rem基准值

import   "normalize.css";

//导入全局样式
import "./styles/index.css"

// 导入element-plus
import ElementPlus from 'element-plus';

// main.ts/main.js
import "element-plus/theme-chalk/el-loading.css";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-notification.css";
import "element-plus/theme-chalk/el-message-box.css";


const app = createApp(App)
app.use(ElementPlus)

app.use(store)
app.use(router)
app.use(Vant)
app.use(createPinia())
app.mount('#app')


