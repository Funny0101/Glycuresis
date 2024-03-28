<template>
    <div>
        <!-- 饮食图表 -->
        <div class="echart" id="dietChart" :style="myChartStyle"></div>

        <!-- 时间显示器 -->
        <div class="time-selector">
            <van-row type="flex" justify="space-around" gutter="10">
                <van-col :span="12" class="time-col">
                    <!-- 开始时间选择按钮 -->
                    <div class="time-label">开始时间</div>
                    <van-button type="primary" icon="clock-o" class="time-button" @click="showStartDateTimePicker = true">
                        {{ this.startDateTimeFormatted }}
                    </van-button>
                </van-col>
                <van-col :span="12" class="time-col">
                    <!-- 结束时间选择按钮 -->
                    <div class="time-label">结束时间</div>
                    <van-button type="primary" icon="clock-o" class="time-button" @click="showEndDateTimePicker = true">
                        {{ endDateTimeFormatted }}
                    </van-button>
                </van-col>
            </van-row>
        </div>
        <!-- 开始时间选择器 -->
        <van-popup v-model:show="showStartDateTimePicker" round position="top">
            <van-datetime-picker type="datetime" title="请选择数据开始日期和时间" v-model="startDateTime" :min-date="minDate"
                :max-date="maxDate" @confirm="onStartDateTimeConfirm" @cancel="onStartDateTimeCancel" />
        </van-popup>

        <!-- 结束时间选择器 -->
        <van-popup v-model:show="showEndDateTimePicker" round position="top">
            <van-datetime-picker type="datetime" title="请选择数据结束日期和时间" v-model="endDateTime" :min-date="minDate"
                :max-date="maxDate" @confirm="onEndDateTimeConfirm" @cancel="onEndDateTimeCancel" />
        </van-popup>

        <!-- 按条给出饮食记录 -->
        <div class="records-container">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                <div class="record" v-for="record in records" :key="record.id">
                    <div class="type" :style="{ backgroundColor: getColor(record.type) }">{{ record.type }}</div>
                    <div class="details">
                        <div>记录时间: {{ record.createTime.replace('T', ' ') }}</div>
                    </div>
                    <van-button type="primary" plain size="small" @click="onRecordClick(record)">详情</van-button>
                </div>
            </van-list>
        </div>

    </div>
</template>
  
<script>
import * as echarts from "echarts";
import { ref } from "vue";
import { get, put, post, del } from "../axios/axiosConfig.js";
import { mapState, mapMutations } from "vuex";

export default {
    data() {
        return {
            dietChart: {},
            myChartStyle: { float: "left", width: "100%", height: "6rem" },
            //营养成分占比
            nutrients: [
                // { value: 17, name: '脂肪' },
                // { value: 28, name: '蛋白质' },
                // { value: 22, name: '碳水' },
                // { value: 9, name: '纤维素' },
            ],
            // 饮食记录
            records: [],
            loading: false,
            finished: false,
            allRecords: [
                //{id: 4, userId: 1, createTime: '2021-08-04T10:58:00', imgUrl: null, type: '午餐'}
            ],
            // 时间选择器
            showStartDateTimePicker: false,
            showEndDateTimePicker: false,
            startDateTime: new Date(2021, 7, 4, 7, 20, 21),
            endDateTime: new Date(2021, 7, 4, 14, 20, 21),
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(2025, 11, 31),
        };
    },
    mounted() {
        this.startDateTime = this.globalSDT;
        this.endDateTime = this.globalEDT;
        this.getDietData(this.startDateTime, this.endDateTime);
        this.initDietChart();
    },
    //计算属性
    computed: {
        ...mapState(['globalSDT', 'globalEDT']),
        //开始时间
        startDateTimeFormatted() {
            //开始时间的原始格式为Mon Dec 18 2023 17:25:00 GMT+0800 (中国标准时间)
            //将其转换成 yyyy-MM-dd hh:mm:ss 格式
            //return this.startDateTime;
            return this.formatTime(this.startDateTime);
        },
        //结束时间
        endDateTimeFormatted() {
            //结束时间的原始格式为Mon Dec 18 2023 17:25:00 GMT+0800 (中国标准时间)
            //将其转换成 yyyy-MM-dd hh:mm:ss 格式
            return this.formatTime(this.endDateTime);
        },
    },
    methods: {
        ...mapMutations(['setGlobalSDT', 'setGlobalEDT']),
        async getDietData(sdt, edt) {//从数据库中获取血糖数据
            sdt = this.toDTO(sdt);
            edt = this.toDTO(edt);
            //从数据库中获取饮食数据
            try {
                const response = await get('/food/record/getRecord', {
                    startTime: sdt,
                    endTime: edt,
                });
                const { code, msg, data, message } = response;
                this.allRecords = data;
                this.records = this.allRecords
            }
            catch (error) {
                console.log(error);
            }
            //从数据库中获取该时段营养成分占比  
            try {
                const response = await get('/food/record/statistic', {
                    startTime: sdt,
                    endTime: edt,
                });
                console.log(response);
                // TODO 等后端填充真实数据后再做展示
                //const { code, msg, data, message } = response;
                this.nutrients = [
                    { value: response.data.fatMass, name: '脂肪' },
                    { value: response.data.proteinMass, name: '蛋白质' },
                    { value: response.data.carbohydrateMass, name: '碳水' },
                    { value: response.data.celluloseMass, name: '纤维素' },
                ]
                for(let i = 0; i < this.nutrients.length; i++) {
                    if(this.nutrients[i].value == 0) {
                        this.nutrients.splice(i, 1);
                        i--;
                    }
                }
                //更新图表
                this.dietChart.setOption({
                    series: [
                        {
                            name: 'Access From',
                            type: 'pie',
                            radius: "60%",
                            center: ['50%', '50%'],
                            itemStyle: {
                                borderRadius: 4
                            },
                            data: this.nutrients,
                        }
                    ]
                });
            }
            catch (error) {
                console.log(error);
            }
        },
        //把Date类型转化为定义的DTO类型
        toDTO(date) {
            //将时间格式从Mon Dec 18 2023 17:25:00 GMT+0800 (中国标准时间)，转换为2023-12-18T17:25:00格式
            const twoDigits = (num) => num.toString().padStart(2, '0');

            const year = date.getFullYear();
            const month = twoDigits(date.getMonth() + 1); // 月份是从 0 开始的
            const day = twoDigits(date.getDate());
            const hours = twoDigits(date.getHours());
            const minutes = twoDigits(date.getMinutes());
            const seconds = twoDigits(date.getSeconds());

            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        },
        // 格式化时间显示
        formatTime(date) {
            const twoDigits = (num) => num.toString().padStart(2, '0');

            const year = date.getFullYear();
            const month = twoDigits(date.getMonth() + 1); // 月份是从 0 开始的
            const day = twoDigits(date.getDate());
            const hours = twoDigits(date.getHours());
            const minutes = twoDigits(date.getMinutes());
            const seconds = twoDigits(date.getSeconds());

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        },
        onLoad() {
            // 模拟加载数据
            setTimeout(() => {
                const moreRecords = this.allRecords.slice(this.records.length, this.records.length + 10);
                this.records.push(...moreRecords);
                this.loading = false;
                if (this.records.length >= this.allRecords.length) {
                    this.finished = true;
                }
            }, 500);
        },
        getColor(type) {
            const colors = {
                '早餐': '#FFD700', // 金色
                '午餐': '#FF4500', // 橙色
                '晚餐': '#1E90FF', // 道奇蓝
                '加餐': '#32CD32', // 酸橙绿
            };
            return colors[type] || '#000';
        },
        onRecordClick(record) {
            // 处理记录点击事件
            console.log('Clicked record:', record);
            console.log('Clicked record id:', record.id);
            console.log('Clicked record type:', record.type);
            console.log('Clicked record time:', record.createTime);
            //跳转到饮食记录详情页面
            this.$router.push({
                name: 'oneMeal',
                params: {
                    id: record.id,
                    type: record.type,
                    time: record.createTime,
                }
            });
        },
        onStartDateTimeCancel() {
            // 处理开始时间选择器的取消事件
            this.showStartDateTimePicker = false;
        },
        onEndDateTimeCancel() {
            // 处理结束时间选择器的取消事件
            this.showEndDateTimePicker = false;
        },
        // 开始时间确认
        onStartDateTimeConfirm(value) {
            //判断开始时间是否小于结束时间
            //如果小于，则更新开始时间
            //如果大于，则提示用户
            if (value > this.endDateTime) {
                this.$toast('开始时间不能大于结束时间');
                return;
            }
            else {
                this.startDateTime = value;
                this.setGlobalSDT(value);
                if (this.endDateTime - this.startDateTime > 172800000) {
                    console.log("不能超过两天")
                    this.endDateTime = this.addNHours(48, this.startDateTime);
                    this.setGlobalEDT(this.endDateTime);
                }
                console.log(this.startDateTime)
                this.showStartDateTimePicker = false;
                //从数据库中重新获取图表数据
                this.getDietData(this.startDateTime, this.endDateTime);
            }
        },
        // 结束时间确认
        onEndDateTimeConfirm(value) {
            //判断结束时间是否大于开始时间
            //如果大于，则更新结束时间
            //如果小于，则提示用户
            if (value < this.startDateTime) {
                this.$toast('结束时间不能小于开始时间');
                return;
            }
            else {
                this.endDateTime = value;
                this.setGlobalEDT(value);
                if (this.endDateTime - this.startDateTime > 172800000) {
                    console.log("不能超过两天")
                    this.startDateTime = this.subtractNHours(48, this.endDateTime);
                    this.setGlobalSDT(this.startDateTime);
                }
                this.showEndDateTimePicker = false;
                //TODO 从数据库中重新获取图表数据 
                this.getDietData(this.startDateTime, this.endDateTime);
            }
        },
        initDietChart() {
            // 饮食图表的实现逻辑
            const option = {
                title: {
                    text: '营养成分占比',
                    left: 'center'
                },
                legend: {
                    top: 'bottom'
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: { show: true }
                    }
                },
                label: {
                    formatter: '{c}g ({d}%)'
                },
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: "60%",
                        center: ['50%', '50%'],
                        itemStyle: {
                            borderRadius: 4
                        },
                        data: this.nutrients,
                    }
                ]
            };
            this.dietChart = echarts.init(document.getElementById("dietChart"));
            this.dietChart.setOption(option);
            //随着屏幕大小调节图表
            // window.addEventListener("resize", () => {
            //     this.dietChart.resize();
            // });
        }
    }
};
</script>

<style scoped>
.display-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    /* 添加此行确保文本水平居中 */
}

.time-display {
    font-size: 0.5rem;
    margin-bottom: 0.3rem;
}

/* 这个类是为了确保圆环进度条中的文本也居中 */
.van-circle__text {
    text-align: center;
    display: block;
    /* 这个可能不需要，但如果文本没有居中，可以试试添加这个属性 */
}

.warning-button {
    margin-top: 0.5rem;
}

.warning-text {
    margin-top: 0.1rem;
    /* 或者你需要的任何值 */
    color: #FF3030;
    /* 警告文字颜色 */
    text-align: center;
    /* 保证文字居中 */
    font-size: 0.3rem;
    /* 保证文字大小 */
}

.time-selector {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 0.3rem;
    /* 内部内容居中 */
    align-items: center;
}

.time-label {
    text-align: center;
    margin-bottom: 0.1rem;
    color: #0c0f12;
    font-size: 0.4rem;
}

.time-col {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.records-container {
    max-width: 100%;
    padding: 0.3rem;
    font-size: 0.4rem;
}

.record {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding: 0.5rem 0;
}

.type {
    padding: 0.2rem 0.1rem;
    border-radius: 4px;
    color: white;
    margin-right: 0.2rem;
}

.details {
    flex-grow: 1;
}
</style>  