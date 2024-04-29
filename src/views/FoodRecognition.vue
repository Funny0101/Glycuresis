<template>
    <!-- 顶部导航栏 -->
    <van-row justify="space-around" align="center">
        <van-col span="2">
            <van-icon name="arrow-left" @click="back" />
        </van-col>
        <van-col span="16" style="text-align: center;">
            <p>查食物</p>
        </van-col>
        <van-col span="2">
        </van-col>
    </van-row>

    <!-- 食物识别 -->
    <div>
        <!-- html原生的图片上传和展示 -->
        <input type="file" id="id" name="image" class="getImgUrl_file" @change="shangc_old($event)"
            accept="image/jpg, image/jpeg, image/png" />
        <br />
        <img :src="picPath" alt="">
        <!-- 利用vant组件重新写一个图片上传-->
        <van-uploader :after-read="afterRead" v-model="fileList" 
        multiple :max-count="1" :max-size="10 * 1024 * 1024" 
        @oversize="onOversize"/>

        <!--加载，在识别结果没有出来的时候加载-->

        <!-- 识别结果展示 -->
        <h4>识别结果:</h4>
        <table>
            <tr>
                <th>物品名称</th>
                <th>所属类目</th>
                <th>识别度</th>
            </tr>
            <tr v-if="possibleObj" v-for="item in possibleObj">
                <td>{{ item.keyword }}</td>
                <td>{{ item.root }}</td>
                <td>{{ item.score }}</td>
            </tr>
        </table>
        <!-- 进一步调用大模型来判断这个东西能不能吃 -->
        <h4>专家建议:</h4>
        <p>{{ expertSugestion }}</p>
    </div>
</template>

<script>
import { baiduPost } from "../axios/axiosConfig.js";
import { ref } from 'vue';

export default {
    data() {
        return {
            possibleObj: [],
            picPath: '',
            expertSugestion: ''
        };
    },
    setup() {
        const afterRead = (file) => {
            // 此时可以自行将文件上传至服务器
            console.log(file);
        };

        const fileList = ref([

        ]);

        const onOversize = (file) => {
            console.log('oversize', file);
        };

        return {
            afterRead,
            fileList,
            onOversize
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
        shangc_old(e) {
            let files = document.getElementById("id").files[0];
            let name = document.getElementById("id").files[0].name;
            // this.picPath=document.getElementById("id").value

            let arr = name.split(".");
            let fileSize = 0;
            let fileMaxSize = 10240; //1M
            if (files) {
                fileSize = files.size;
                if (fileSize > 10 * 1024 * 1024) {
                    alert("文件大小不能大于10M！");
                    file.value = "";
                    return false;
                } else if (fileSize <= 0) {
                    alert("文件大小不能为0M！");
                    file.value = "";
                    return false;
                }
            } else {
                return false;
            }
            //转码base64
            let reader = new FileReader();
            let imgFile;
            // let that = this
            reader.readAsDataURL(files);
            reader.onload = async e => {
                console.log("start send")
                imgFile = e.target.result;
                let arr = imgFile.split(",");
                this.faceBase64 = arr[1];
                this.picPath = 'data:image/jpg;base64,' + arr[1]
                // console.log(imgFile)
                //准备开始发送图像识别请求
                let picRecAccessToken = "24.0ac2f5a8d478236323e9dc9cba97cf79.2592000.1716884213.282335-58582664";
                var qs = require('qs');
                var data = qs.stringify({
                    'image': arr[1]
                });

                console.log(arr)

                let url = '/rest/2.0/image-classify/v2/advanced_general?access_token=' + picRecAccessToken
                const picRecResponse = await baiduPost(url, { "image": arr[1] });
                console.log(picRecResponse)
                this.possibleObj = picRecResponse.result

                let foodName = picRecResponse.result[0].keyword

                console.log(foodName)

                //百度千帆大模型的调用，判断这个东西能不能吃
                let llmAccessToken = "24.e33d91404e6b8d4255421d6728c47eea.2592000.1716889157.282335-64727061"
                let llmUrl = '/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-3.5-8k-0205?access_token=' + llmAccessToken

                const llmResponse = await baiduPost(llmUrl, JSON.stringify({
                    "messages": [
                        {
                            "role": "user",
                            "content": "你好, 请问一下" + foodName + "能不能吃？"
                        }
                    ],
                    ///模型人设，主要用于人设设定
                    "system": "你是一个糖尿病营养专家，你会回答人们关于饮食的问题，你会为他们\
                    讲解食物的基本营养信息。你充满耐心，尽管有的人会拿一些根本不能吃的东西来问你，\
                    你会耐心地告诉他们这东西不能吃。另外，你说话非常精炼，你只会用一句话说明某种\
                    东西是否能吃，并介绍它的信息。"
                }), 'application/json');
                this.expertSugestion = llmResponse.result
                //console.log(llmResponse)
            };
        }
    }
};
</script>

<style scoped>
table,
th,
td {
    border: 1px solid orangered;

}

img {
    width: 400px;
    height: 400px;
    border: 1px solid red;
}
</style>