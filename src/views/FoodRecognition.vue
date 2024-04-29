<template>
    <!-- 顶部导航栏 -->
    <van-row class="top-nav" align="center">
        <van-col span="3">
            <div class="middle-wrapper">
                <van-icon name="arrow-left" @click="back" size="0.5rem" />
            </div>
        </van-col>
        <van-col span="18" style="text-align: center;">
            <p class="nav-title">查食物</p>
        </van-col>
        <van-col span="3">
        </van-col>
    </van-row>

    <!-- 食物识别 -->
    <div class="expert-suggestion">
            <h4>AI专家:</h4>
            <p>我是您的AI营养专家，请你把任何您拿不定主意是否该吃的食物拍照传给我，我会给您建议。</p>
        </div>
    <div class="food-recognition">
        <!-- 图片上传 -->
        <van-uploader :after-read="afterRead" v-model="fileList" multiple :max-count="1" :max-size="10 * 1024 * 1024"
            @oversize="onOversize" preview-size="5rem" upload-text="点击上传食物" />

        <!--加载，在识别结果没有出来的时候加载-->
        <div class="loading">
            <van-overlay :show="showOverlay">
                <div class="middle-wrapper">
                    <van-loading type="spinner" size="1.5rem" color="#1989fa" text-size="0.7rem">正在咨询AI专家</van-loading>
                </div>
            </van-overlay>
        </div>
        <div class="expert-suggestion" v-show="showAISuggestion">
            <h4>AI专家:</h4>
            <p>{{ expertSugestion }}</p>
        </div>
    </div>
</template>

<script>
import { baiduPost } from "../axios/axiosConfig.js";
import { ref } from 'vue';
import { Notify, Overlay } from 'vant'

export default {
    data() {
        return {
        };
    },
    setup() {
        const afterRead = async (file) => {//上传图片后的回调函数
            //显示加载
            showOverlay.value = true;

            //图片文件
            console.log(file);
            let imgFile = file.content;//获取图片文件
            let arr = imgFile.split(",");//将图片文件转为数组

            //1. 百度图像识别
            //百度图像识别的access_token和url
            let picRecAccessToken = "24.0ac2f5a8d478236323e9dc9cba97cf79.2592000.1716884213.282335-58582664";
            let url = '/rest/2.0/image-classify/v2/advanced_general?access_token=' + picRecAccessToken;

            //调用百度图像识别接口
            const picRecResponse = await baiduPost(url, { "image": arr[1] });
            console.log(picRecResponse)//打印返回的结果

            //获取识别出的食物名
            let foodName = picRecResponse.result[0].keyword
            console.log("识别出的食物是", foodName)//打印识别出的食物名

            //2. 调用百度大模型
            //百度大模型的access_token和url,模型的版本是ernie-3.5-8k-0205
            let llmAccessToken = "24.e33d91404e6b8d4255421d6728c47eea.2592000.1716889157.282335-64727061"
            let llmUrl = '/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-3.5-8k-0205?access_token=' + llmAccessToken

            //调用百度千帆大模型接口
            const llmResponse = await baiduPost(llmUrl, JSON.stringify({
                "messages": [
                    {
                        "role": "user",
                        "content": "你好, 请问一下" + foodName + "能不能吃？"
                    }
                ],
                ///模型人设
                "system": "你是一个糖尿病营养专家，你会回答人们关于饮食的问题，你会为他们\
                    讲解食物的基本营养信息。你充满耐心，尽管有的人会拿一些根本不能吃的东西来问你，\
                    你会耐心地告诉他们这东西不能吃。另外，你说话非常精炼，你只会用一句话说明某种\
                    东西是否能吃，并介绍它的信息。"
            }), 'application/json');
            //将返回的结果赋值给expertSugestion
            expertSugestion.value = llmResponse.result

            //隐藏加载
            showOverlay.value = false;
            //显示AI专家的建议
            showAISuggestion.value = true;
        };

        //处理超大图片
        const onOversize = async (file) => {
            Notify({ type: 'danger', message: '图片过大' });
        };

        //定义变量
        const fileList = ref([]);
        const expertSugestion = ref('');
        const showOverlay = ref(false);
        const showAISuggestion = ref(false);

        return {
            afterRead,
            onOversize,
            expertSugestion,
            fileList,
            showOverlay,
            showAISuggestion
        };
    },
    methods: {
        //返回上一页
        back() {
            this.$router.go(-1);
        },
        //上传图片
        onUploaded() {

        },
    }
};
</script>

<style scoped>
.middle-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.top-nav {
    height: 40px;
    /* 调整导航栏高度 */
}

.nav-title {
    font-size: 16px;
    /* 调整导航栏标题字体大小 */
}

.food-recognition {
  padding: 16px;
}

.expert-suggestion {
  margin-top: 16px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.expert-suggestion h4 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.expert-suggestion p {
  font-size: 14px;
  color: #666;
}
</style>