<template>
    <div class="dietRecord">
        <!-- 导航栏 -->
        <van-nav-bar title="记饮食" left-arrow @click-left="onClickLeft" @click-right="onClickRight">
            <template #right>
                <van-icon name="photograph" class="photoIcon" />
            </template>
        </van-nav-bar>

        <!-- 时间选择 -->
        <div class="timeSelect">
            <div @click="showTime = true" class="time">
                {{ currentDay }}
                <van-icon v-if="showTime" name="arrow-up" style="color:aqua;font-size: 0.4rem;" />
                <van-icon v-else name="arrow-down" style="color:aqua;font-size: 0.4rem;" />
            </div>
            <van-calendar :min-date="lastMonth" v-model:show="showTime" v-model="currentTime" :show-confirm="false"
                @confirm="onConfirm" />
        </div>

        <!-- 选择框 -->
        <el-radio-group v-model="selectedMeal" class="horizontal-radio-group" border>
            <el-radio-button label="早餐" />
            <el-radio-button label="午餐" />
            <el-radio-button label="晚餐" />
            <el-radio-button label="加餐" />
        </el-radio-group>

        <!-- 搜索框 -->
        <van-search v-model="searchValue" shape="round" placeholder="搜索你想要添加的食物" @search="switchQuery(true)" />

        <!-- 拍照上传弹窗 -->
        <van-overlay :show="popupVisible" class="overlay">
            <div class="wrapper">
                <van-icon name="close" class="closeIcon" @click="onClickCloseIcon" />
                <div class="title">
                    <h3>快捷记录图片</h3>
                </div>
                <div class="upload">
                    <h4>上传图片</h4>
                    <div class="parent">
                        <div class="child">
                            <van-uploader v-model="fileList" multiple :max-count="1" />
                            <van-stepper v-model="imgNum" button-size="20" disable-input @change="choosed = true" />
                            <van-button @click="uploadImage" plain hairline type="primary">上传</van-button>
                        </div>
                        <van-steps :active="currentStep" active-icon="success" direction="vertical"
                            active-color="#07c160">
                            <van-step>图片上传</van-step>
                            <van-step>选择食物种类数量</van-step>
                            <van-step>确认上传</van-step>
                            <van-step>识别成功</van-step>
                        </van-steps>
                    </div>
                </div>
                <div class="select">
                    <h4>选择食物</h4>
                    <div>
                        <van-sidebar v-model="candidatesIndex" van-sidebar-width="20px"
                            @change="console.log(checked[candidatesIndex])">
                            <van-sidebar-item v-for="(candidates, index) in candidateFoodList" :key="index"
                                :title="'食物' + (index + 1)" class="custom-sidebar-item" />
                        </van-sidebar>
                        <van-radio-group v-model="currentChecked">
                            <van-radio v-if="candidateFoodList.length > 0"
                                v-for="(foodName, index) in candidateFoodList[candidatesIndex].top5" :name="index">
                                {{ foodName }}
                            </van-radio>
                        </van-radio-group>
                    </div>
                </div>
                <van-button @click="uploadChoice" class="center-bottom">确定</van-button>
            </div>
        </van-overlay>

        <!-- 页面内容 -->
        <div class="container">
            <van-sidebar v-model="currentTag" class="sidebar" @change="switchQuery(false)">
                <van-sidebar-item v-for="tag in tags" :key="tag.id" :title="tag.name"
                    @click="currentTag = tag.id - 1" />
            </van-sidebar>
            <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" class="list-container"
                @load="loadFoodDetail(false)">
                <van-cell v-for="tag in tagData" :key="tag.id" :title="tag.name" @click="trueShowFoodDetail(tag)">
                    <template #right-icon>
                        <span>{{ Math.round(tag.calorieMassDensity * 100) }} 千卡/100克</span>
                    </template>
                </van-cell>
            </van-list>
        </div>

        <!-- 当前已添加 -->
        <div class="rooter" @click="true_check_save">
            <van-badge :content="dietItemsCount > 0 ? dietItemsCount : null" color="#1989fa">
                <van-icon name="fire" size="2em" />
            </van-badge>
            <span class="diet-items">{{ dietItemsCount > 0 ? `已添加 ${dietItemsCount} 项食物` : '还没有添加任何食物哦' }}</span>
            <van-button @click="saveDiet" class="savebutton">保存</van-button>
        </div>

        <!-- 已添加食物 -->
        <van-overlay :show="check_save" class="overlay" @click="check_save = false">
            <div class="save-food">
                <div class="recordSummary">
                    <div class="summary_row_1">
                        <span class="vertical-line"></span>
                        <span class="number">本次记录</span>
                        <span><span style="font-size: 1.5em;">{{ totalData.totalCalorie }}</span>千卡</span>
                    </div>
                    <div class="summary_row_2">
                        <div>
                            <span class="number">脂肪</span>
                            <span>{{ totalData.totalFat }}克</span>
                        </div>
                        <div>|</div>
                        <div>
                            <span class="number">蛋白质</span>
                            <span>{{ totalData.totalProtein }}克</span>
                        </div>
                        <div>|</div>
                        <div>
                            <span class="number">碳水</span>
                            <span>{{ totalData.totalCarbs }}克</span>
                        </div>
                    </div>
                </div>
                <div class="recordDetail">
                    <div v-for="food in addedFoodList" :key="food.id" class="food_item">
                        <div>
                            <div>{{ food.name }}</div>
                            <div class="number">{{ food.foodMass }}克</div>
                        </div>
                        <div class="number">{{ Math.round(food.calorieMass) }}千卡</div>
                    </div>
                </div>
                <div class="recordButton">
                    <div>
                        <van-icon name="delete" />
                        <span class="number" @click="clearFoodList">清空列表</span>
                    </div>
                    <van-button @click="saveDiet" class="savebutton">保存</van-button>
                </div>
            </div>
        </van-overlay>

        <!-- 食物详情弹窗 -->
        <van-overlay :show="whetherShowFoodDetails" class="overlay">
            <div class="food-details-popup">
                <!-- 在这里放置食物的具体信息 -->
                <van-icon name="close" class="closeIcon" @click="falseShowFoodDetails" />
                <!-- 以您需要的方式显示食物的具体信息 -->
                <div style="text-align: center;">
                    <h2>添加食物</h2>
                </div>

                <div v-if="selectedFood">
                    <div class="hengxiang">
                        <div class="vertical-line"></div>
                        <h2>{{ selectedFood.name }}</h2> <!-- 食物名称 -->
                    </div>
                    <p class="number">{{ Math.round(selectedFood.calorieMassDensity * 100) }} 千卡/100克</p> <!-- 能量信息 -->
                    <!-- 显示物质含量 -->
                    <div class="energy">
                        <div class="info-row">
                            <p class="info-title carbs">碳水化合物</p>
                            <p class="number">{{ (selectedFood.carbohydrateMassDensity * currentWeight).toFixed(1) }} 克
                            </p>
                        </div>
                        <div class="info-row">
                            <p class="info-title protein">蛋白质</p>
                            <p class="number">{{ (selectedFood.proteinMassDensity * currentWeight).toFixed(1) }} 克</p>
                        </div>
                        <div class="info-row">
                            <p class="info-title fat">脂肪</p>
                            <p class="number">{{ (selectedFood.fatMassDensity * currentWeight).toFixed(1) }} 克</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="weightBar">
                        <div>
                            <span style="font-size: 2em;">{{ Math.round(selectedFood.calorieMassDensity * currentWeight)
                                }}</span>
                            <span class="number">千卡</span>
                        </div>
                        <van-icon name="diamond" id="diamondIcon" />
                        <div>
                            <span style="font-size: 2em;">{{ currentWeight }}</span>
                            <span class="number">克</span>
                        </div>
                    </div>
                    <Ruler @rulerValueChange="handleRulerValueChange" />
                </div>
                <!-- 确定按钮 -->
                <div class="confirm-button" @click="saveSelectedFood">确定</div>
            </div>
        </van-overlay>

    </div>
</template>

<script>
import axios from 'axios';
import Ruler from "./Ruler.vue";
import { dealTime } from "../global"
import { get } from "../axios/axiosConfig.js";
import { ElLoading } from 'element-plus'
export default {
    name: 'dietRecord',
    props: ['meal'],
    components: {
        Ruler,
    },
    data() {
        return {
            // 时间选择
            showTime: false,
            currentTime: new Date(),

            // 选择框
            selectedMeal: '早餐',

            // 搜索框
            searchValue: '',

            // 拍照上传弹窗
            popupVisible: false, // 控制弹窗显示
            step: -1, // 步骤条的步数
            fileList: [], // 上传图片的文件列表
            imgSid: '', // 上传图片的地址
            imgNum: 1, // 上传图片的数量
            choosed: false, // 是否选择了图片数量
            confirmed: false, // 是否确认上传
            uploaded: false, // 是否上传图片成功
            dietId: undefined,
            candidateFoodList: [
                // { food: 38, region: "58inuv5551", top5: ["海参", "紫菜包饭", "玉米棒", "青椒", "皮蛋"] },
                // { food: 135, region: "58inuv5551", top5: ["荞麦馒头", "馒头", "芝麻糊", "菜包", "南瓜紫薯馒头"] },
                // { food: 203, region: "58inuv5551", top5: ["鸡蛋", "牛奶", "双皮奶", "豆浆", "汤圆"] },
            ], // 识别出的食物列表
            candidatesIndex: 0, // 识别出的食物列表的索引
            checked: [], // 选择的食物

            // 侧边栏
            currentTag: 0,
            page: 1, // 分页查询参数
            tags: [],      // 存储从后端获取的标签数据
            tagData: [],   // 存储从后端获取的展开数据
            loading: false,
            finished: false,

            // 已添加食物
            whetherShowFoodDetails: false, // 控制食物详情弹窗显示
            selectedFood: {
                foodMass: 0, // 食物的重量
                calorieMassDensity: 0, // 食物的能量密度
                calorieMass: 0, // 食物的能量
                carbohydrateMassDensity: 0, // 食物的碳水化合物密度
                carbohydrateMass: 0, // 食物的碳水化合物
                fatMassDensity: 0, // 食物的脂肪密度
                fatMass: 0, // 食物的脂肪
                proteinMassDensity: 0, // 食物的蛋白质密度
                proteinMass: 0, // 食物的蛋白质
            }, // 选中的食物
            check_save: false,
            currentWeight: 100,
            addedFoodList: [], // 已添加食物列表
        }
    },
    mounted() {
        console.log('Component mounted');
        // 类型转换
        const mealTypeMap = {
            breakfast: '早餐',
            lunch: '午餐',
            dinner: '晚餐',
            snack: '加餐',
        };
        this.selectedMeal = mealTypeMap[this.meal];
        this.fetchTags();

        // this.checked = Array(this.candidateFoodList.length).fill(0);

        // console.log(ElLoading);
    },

    // 计算属性
    computed: {
        currentDay() {
            const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            const weekdayIndex = this.currentTime.getDay();
            return (this.currentTime.getMonth() + 1) + '.' + this.currentTime.getDate() + ' ' + weekdays[weekdayIndex];
        },
        // 前一个月
        lastMonth() {
            const currentYear = this.currentTime.getFullYear();
            const currentMonth = this.currentTime.getMonth();

            // 处理当月为1月的情况
            const lastMonth = new Date(
                currentMonth === 0 ? currentYear - 1 : currentYear,
                currentMonth === 0 ? 11 : currentMonth - 1,
                this.currentTime.getDate()
            );

            return lastMonth;
        },
        // 根据当前 candidatesIndex 返回对应的选中的食物
        currentChecked: {
            get() {
                return this.checked[this.candidatesIndex] || 0;
            },
            set(value) {
                this.checked[this.candidatesIndex] = value;
            }
        },
        // 当前步骤
        currentStep() {
            if (this.fileList.length === 0) {
                this.step = -1;
                this.choosed = false;
                this.confirmed = false;
                this.uploaded = false;
            }
            else if (this.choosed === false) {
                this.step = 0;
            }
            else if (this.confirmed === false) {
                this.step = 1;
            }
            else if (this.uploaded === false) {
                this.step = 2;
            }
            else {
                this.step = 3;
            }
            return this.step;
        },
        dietItemsCount() {
            return this.addedFoodList.length;
        },
        totalData() {
            let totalCalorie = 0;
            let totalFat = 0;
            let totalProtein = 0;
            let totalCarbs = 0;

            for (let i = 0; i < this.addedFoodList.length; i++) {
                if (this.addedFoodList[i].foodMass > 0) {
                    totalCalorie += this.addedFoodList[i].calorieMass;
                    totalFat += this.addedFoodList[i].fatMass;
                    totalProtein += this.addedFoodList[i].proteinMass;
                    totalCarbs += this.addedFoodList[i].carbohydrateMass;
                }
            }
            return {
                totalCalorie: totalCalorie.toFixed(1),
                totalFat: totalFat.toFixed(1),
                totalProtein: totalProtein.toFixed(1),
                totalCarbs: totalCarbs.toFixed(1),
            };
        },
    },

    // 监听
    watch: {

    },

    //  方法
    methods: {
        onClickLeft() {
            this.$router.go(-1);
        },
        onClickRight() {
            this.popupVisible = true;
            // console.log(this.candidateFoodList);
        },
        onClickCloseIcon() {
            this.popupVisible = false;
        },
        onConfirm(date) {
            this.showTime = false;
            this.currentTime = date;
        },
        // 获取食物标签
        fetchTags() {
            axios.get('/api/food/food-category/getall')
                .then((response) => {
                    const data = response.data.data;
                    this.tags = data;
                    // this.tags = [{ id: 0, name: "全部" }].concat(data);
                    // this.tags = [{ id: 1, name: "全部" }, ...data];
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);// 处理错误
                })
        },
        // 切换标签时，重新获取数据
        switchQuery(searching) {
            console.log('switchQuery started');
            this.tagData = [];
            this.finished = false;
            this.loading = true;
            this.page = 1;
            this.loadFoodDetail(searching);
        },
        // 获取食物详细信息
        loadFoodDetail(searching) {
            console.log('loadFoodDetail started');
            // 分页查询参数
            const foodQuery = {
                pageNo: this.page,
                pageSize: 14,
                categoryId: this.currentTag + 1,
            };
            if (searching) {
                foodQuery.name = this.searchValue;
            }
            axios.get('/api/food/food/page', { params: foodQuery })
                .then((response) => {
                    const data = response.data.data.list;
                    console.log(data);
                    this.tagData.push(...data);
                    this.page++;
                    this.loading = false;
                    if (this.page > response.data.data.pages) {
                        this.finished = true;
                    }
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);// 处理错误
                })
        },
        // 上传图片
        async uploadImage() {
            // 检查是否有图片
            if (this.fileList.length === 0) {
                alert('请选择图片');
                return;
            }
            this.confirmed = true;
            const loading = ElLoading.service({
                lock: true,
                text: 'Loading',
                background: 'rgba(0, 0, 0, 0.7)',
            });

            try {
                const config = {
                    headers: {
                        'Content-Type': 'image/jpeg'
                    }
                };
                const uploadResponse = await axios.post('/api/user/common/uploadToGo', this.fileList[0].file, config);

                // 处理上传成功的逻辑
                console.log('上传成功', uploadResponse);
                // return;

                this.imgSid = uploadResponse.data.data;
                const recognizeData = {
                    sid: this.imgSid,
                    num: this.imgNum,
                };
                // 发送 GET 请求
                const recognizeResponse = await axios.post('/api/food/record/segrec', recognizeData);
                // 处理识别成功的逻辑
                console.log('识别成功', recognizeResponse);
                if (recognizeResponse.data.data.message.results == null) {
                    ElMessage({
                        dangerouslyUseHTMLString: true,
                        message: '<strong>图片识别失败</strong><br/>请稍后重试',
                        type: 'error',
                    });
                    return;
                }
                this.dietId = recognizeResponse.data.data.message.dietId;
                this.candidateFoodList = recognizeResponse.data.data.message.results;
                this.checked = Array(this.candidateFoodList.length).fill(0);
                this.uploaded = true;
                console.log(this.candidateFoodList);
            } catch (error) {
                console.error('操作失败', error);
                ElMessage({
                    dangerouslyUseHTMLString: true,
                    message: '<strong>图片识别失败</strong><br/>请稍后重试',
                    type: 'error',
                });
            } finally {
                loading.close();
            }
        },
        // 上传选择
        async uploadChoice() {
            // 检查是否有图片
            if (this.fileList.length === 0) {
                alert('请选择图片');
                return;
            }
            // 检查是否有选择
            if (this.candidatesIndex === -1) {
                alert('请选择食物');
                return;
            }

            // 创建请求体
            const foods = [];
            for (var i = 0; i < this.candidateFoodList.length; i++) {
                foods.push({
                    food: this.candidateFoodList[i].food,
                    region: this.candidateFoodList[i].region,
                    name: this.candidateFoodList[i].top5[this.checked[i]]
                })
            }
            const nutritionData = {
                dietId: this.dietId,
                foods: foods,
            };
            console.log("营养分析请求体", nutritionData);
            // 调用loading服务
            const loading = ElLoading.service({
                lock: true,
                text: 'Loading',
                background: 'rgba(0, 0, 0, 0.7)',
            });

            try {
                // 发送 POST 请求
                const response = await axios.post('/api/food/record/nutrition', nutritionData);
                console.log('营养分析成功', response.data);
                this.popupVisible = false;
                this.addedFoodList = [...this.addedFoodList, ...response.data.data.message.results];
            } catch (error) {
                console.error('上传失败', error);
            } finally {
                loading.close();
            }
        },
        // 保存饮食记录
        saveDiet() {
            const recordData = {
                createTime: dealTime(this.currentTime),
                imgUrl: this.imgSid,
                type: this.selectedMeal
            };
            // 发送第一个POST请求
            axios.post('/api/food/record/addRecord', recordData)
                .then((response) => {
                    console.log('饮食记录上传成功，开始上传详细信息', response.data.data);
                    // 获取返回的recordID
                    const recordId = response.data.data.id;
                    // 构建并发送多个第二个请求
                    const detailRequests = this.addedFoodList.map((addedFood) => {
                        const recordDetailData = {
                            recordId: recordId,
                            foodId: addedFood.id,
                            foodMass: addedFood.foodMass,
                            carbohydrateMass: addedFood.carbohydrateMass,
                            fatMass: addedFood.fatMass,
                            proteinMass: addedFood.proteinMass,
                            calorieMass: addedFood.calorieMass
                        };
                        // 返回axios请求，用于Promise.all
                        console.log(recordDetailData);
                        return axios.post('/api/food/record-detail/addRecordDetail', recordDetailData);
                    });
                    // 并行发送所有第二个请求
                    return Promise.all(detailRequests);
                })
                .then((responses) => {
                    console.log('所有第二个请求成功', responses);
                    this.$router.go(-1);
                })
                .catch((error) => {
                    console.error('保存失败', error);
                });
        },
        // 清空食物列表
        clearFoodList() {
            console.log('清空当前选择食物');
            this.addedFoodList = [];
        },
        trueShowFoodDetail(food) {
            this.whetherShowFoodDetails = true;
            this.selectedFood = food; // 更新所选食物的详细信息
        },
        falseShowFoodDetails() {
            this.whetherShowFoodDetails = false;
        },
        saveSelectedFood() {
            this.whetherShowFoodDetails = false; // 隐藏食物详情弹窗
            this.selectedFood.foodMass = this.currentWeight; // 保存食物的重量
            this.selectedFood.calorieMass = this.selectedFood.calorieMassDensity * this.selectedFood.foodMass; // 保存食物的能量
            this.selectedFood.carbohydrateMass = this.selectedFood.carbohydrateMassDensity * this.selectedFood.foodMass; // 保存食物的碳水化合物
            this.selectedFood.fatMass = this.selectedFood.fatMassDensity * this.selectedFood.foodMass; // 保存食物的脂肪
            this.selectedFood.proteinMass = this.selectedFood.proteinMassDensity * this.selectedFood.foodMass; // 保存食物的蛋白质
            this.addedFoodList.push(this.selectedFood);
        },
        true_check_save() {
            if (this.dietItemsCount === 0) {
                this.check_save = false;
            }
            else {
                this.check_save = true;
                console.log("scheck_save", this.check_save);
            }
        },
        handleRulerValueChange(value) {
            this.currentWeight = value;
            // console.log('Ruler value changed:', value);
        },
    }
}
</script>

<style scoped>
.dietRecord {
    font-size: medium;
    display: flex;
    flex-direction: column;
}

.photoIcon {
    font-size: 0.8rem;
}

.timeSelect {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 5vh;
    background-color: #ffffff;
    border-bottom: 1px solid #f0f0f0;
}

.time {
    width: 30%;
    /* 设置时间宽度为父容器的百分之40 */
    margin: 0 auto;
    /* 水平居中显示 */
    padding: 10px;
    /* 可选的内边距 */
    box-sizing: border-box;
    /* 包含内边距和边框在内的元素的总宽度和高度 */
    text-align: center;
    /* 居中文本 */
    font-size: small;
    color: #838383;
}

/* 主页面 展示数据 */
.container {
    display: flex;
    height: 75vh;
    /* 使用视口高度的百分比 */
    overflow: hidden;
    /* 防止内容溢出 */
}

.container>.sidebar {
    width: 20%;
    /* 设置侧边栏宽度为父容器的百分之20 */
    overflow-y: auto;
}

.container>.list-container {
    flex: 1;
    /* 使用 flex 属性，占据剩余空间 */
    overflow-y: auto;
}


/* 拍照上传弹窗 */
.overlay {
    background-color: rgba(147, 146, 146, 0.5);
    font-size: medium;
}

.wrapper {
    position: relative;
    width: 80%;
    height: 65%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    border-radius: 0.2rem;
    border: 1px solid black;
    /* 设置黑色边框 */
    box-shadow: 0 0 8px #838383;
    /* 设置黑色边框的阴影 */
    overflow: visible;
    /* 显示溢出的内容 */
}

.closeIcon {
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
    font-size: 0.8rem;
}

.wrapper>.title {
    position: absolute;
    top: 5%;
    left: 10%;
    font-size: large;
}

.wrapper>.upload {
    position: absolute;
    top: 15%;
    left: 10%;
}

.wrapper>.select {
    position: absolute;
    top: 55%;
    left: 10%;
}

.wrapper>.select>div {
    display: flex;
    flex-direction: row;
    --van-sidebar-padding: 5px var(--van-padding-sm);
}

.wrapper>.select>div>.van-sidebar {
    height: 15vh;
    overflow: hidden;
    overflow-y: auto;
}

.dietRecord>.rooter {
    height: 8vh;
    display: flex;
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
    background-color: #6dbdd3;
    text-align: center;
    /* 如果还需要文字水平居中，可以保留这行样式 */
}

/* 当弹窗显示时的样式 */
.rooter {
    position: absolute;
    left: 0;
    top: 92%;
    width: 100%;
    height: 20%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    /* 添加适当的内边距 */
}


.food-details-popup {
    position: absolute;
    top: 40%;
    /* 初始位置设置在屏幕下方 */
    left: 0;
    width: 100%;
    height: 60%;
    /* 弹窗占据页面70%的高度 */
    background-color: rgb(255, 255, 255);
    transition: transform 0.5s ease;
    /* 添加过渡效果 */
    overflow: hidden;
    /* 隐藏溢出的内容 */
    border: 1px solid rgb(99, 96, 96);
    /* 添加灰色边框 */
    z-index: 999;
    /* 确保元素位于最顶层 */
    border-top-left-radius: 15px;
    /* 左上角圆角 */
    border-top-right-radius: 15px;
    /* 右上角圆角 */
    border-bottom: 1px solid rgb(99, 96, 96);
    /* 底部边框为单线 */
    border-left: 1px solid rgb(99, 96, 96);
    /* 左侧边框为单线 */
    border-right: 1px solid rgb(99, 96, 96);
    /* 右侧边框为单线 */
    border-top: 2px solid rgb(99, 96, 96);
    /* 上边框为双线 */
    padding: 5%;
}

.slide-up-enter-active {
    transition: transform 0.5s ease;
}

.slide-up-leave-active {
    transition: transform 0.5s ease;
}

/* 元素进入时的初始状态 */

.slide-up-enter {
    transform: translateY(100%);
}

.slide-up-enter-to {
    transform: translateY(0%);
}

.slide-up-leave-to {
    transform: translateY(100%);
}

.hengxiang {
    display: flex;
    /* 使用 Flexbox */
    align-items: center;
    /* 垂直居中 */
}

.vertical-line {
    border-left: 5px solid #00a0e4;
    /* 设置竖线的样式 */
    height: 25px;
    /* 设置竖线的高度 */
    border-radius: 5px;
    /* 设置竖线的角为圆角 */
}

.confirm-button {
    position: absolute;
    bottom: 20px;
    width: 90%;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    background-color: transparent;
    color: #6dbdd3;
    border: 2px solid #6dbdd3;
    border-radius: 20px;
    /* 调整圆角矩形的幅度，可以根据需要调整值 */
    cursor: pointer;
    text-align: center;
    /* 居中文本 */
    display: flex;
    align-items: center;
    justify-content: center;
}

.already_save-enter-active {
    transition: transform 0.5s ease;
}

.already_save-leave-active {
    transition: transform 0.5s ease;
}

/* 元素进入时的初始状态 */

.already_save-enter {
    transform: translateY(100%);
}

.already_save-enter-to {
    transform: translateY(0%);
}

.already_save-leave-to {
    transform: translateY(100%);
}

.diet-items {
    flex: 1;
    /* 让文本占据剩余空间 */
    text-align: center;
    /* 文本居中对齐 */
    margin: 0 10px;
    /* 左右留出一定的间距 */
}

.savebutton {
    background-color: #444343;
    /* 棕黑色 */
    color: #fff;
    /* 字体颜色为白色 */
    font-weight: bold;
    /* 字体加粗 */
    border: none;
    /* 无边框 */
    border-radius: 20px;
    /* 圆角矩形角度很大 */
    width: 40vw;
}

.info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.info-row p {
    margin: 0;
}

.info-row p::before {
    content: "";
    display: inline-block;
    width: 1em;
    /* 调整正方形的大小 */
    height: 1em;
    /* 调整正方形的大小 */
    border-radius: 2px;
    /* 调整圆角矩形的圆角大小 */
    margin-right: 8px;
    /* 调整正方形和文字之间的距离 */
}

.info-row .carbs::before {
    background-color: #18916f;
    /* 碳水化合物的颜色 */
}

.info-row .protein::before {
    background-color: #fba119;
    /* 蛋白质的颜色 */
}

.info-row .fat::before {
    background-color: #f8e0a3;
    /* 脂肪的颜色 */
}

.weightBar {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    position: relative;
}

#diamondIcon {
    font-size: 2em;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}

.save-food {
    position: relative;
    top: 60vh;
    /* 初始位置设置在屏幕下方 */
    width: 100vw;
    height: 40vh;
    /* 默认高度为40vh */
    background-color: rgb(255, 255, 255);
    overflow: hidden;
    /* 隐藏溢出的内容 */
    border: 1px solid rgb(99, 96, 96);
    /* 添加灰色边框 */
    border-top-left-radius: 15px;
    /* 左上角圆角 */
    border-top-right-radius: 15px;
    /* 右上角圆角 */
    padding: 5%;
    /* 设置内边距 */
}

.recordSummary {
    position: absolute;
    width: 90vw;
    height: 10vh;
    background-color: #fff;
    border: 2px solid #000;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.recordSummary>.summary_row_1 {
    width: 60vw;
    /* 视口宽度的40% */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
}

.recordSummary>.summary_row_2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
}

.recordDetail {
    position: absolute;
    width: 90vw;
    top: 13vh;
    height: 20vh;
    overflow: hidden;
    overflow-y: auto;
    /* 添加这一行 */
}

.recordDetail .food_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* 垂直居中 */
    height: 7vh;
    position: relative;
}

.recordDetail .food_item::after {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    background-color: #000000a3;
    /* 设置横线颜色 */
    position: absolute;
    bottom: 0;
}

.recordButton {
    position: absolute;
    width: 90vw;
    top: 33vh;
    height: 7vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
}

.recordButton .number {
    color: #adabab;
}


.number {
    color: #6f6d6d;
}

.center-bottom {
    background-color: #444343;
    /* 棕黑色 */
    color: #fff;
    /* 字体颜色为白色 */
    font-weight: bold;
    /* 字体加粗 */
    border: none;
    /* 无边框 */
    border-radius: 20px;
    /* 圆角矩形角度很大 */
    width: 80%;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}

.parent {
    position: absolute;
    width: 80%;
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}

.parent>.child {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.horizontal-radio-group {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 5px 0;
}
</style>