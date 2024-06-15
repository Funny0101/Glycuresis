<template>
    <div>
        <!-- 时间显示器 -->
        <div class="time-selector">
            <van-row type="flex" gutter="10">
                <van-col :span="11" class="time-col">
                    <!-- 开始时间选择按钮 -->
                    <van-button type="primary" icon="clock-o" class="time-button" @click="showStartDateTimePicker = true">
                        {{ startDateTimeFormatted.slice(0,-3) }}
                    </van-button>
                    <!-- <div class="time-label">开始时间</div> -->
                </van-col>
                <van-col style="font-size:24px; text-align:center;">~</van-col>
                <van-col :span="11" class="time-col">
                    <!-- 结束时间选择按钮 -->
                    <van-button type="primary" icon="clock-o" class="time-button" @click="showEndDateTimePicker = true">
                        {{ endDateTimeFormatted.slice(0,-3) }}
                    </van-button>
                    <!-- <div class="time-label">结束时间</div> -->
                </van-col>
            </van-row>
        </div>

        <!-- 血糖图表 -->
        <div class="echart" id="bloodSugarChart" :style="bloodSugarChartStyle"></div>
        <!-- 血糖弹窗 -->
        <van-popup v-model:show="show" round closeable :style="{ padding: '0.7rem' }">
            <div class="display-container">
                <div class="time-display">{{ selectedPointTime }}</div>
                <van-circle v-model:current-rate="currentRate" :rate="100" :speed="0" stroke-width="60"
                    stroke-linecap="round" layer-color="#eeeeee" :text="bloodSugar + ' mmol/L'" :color="circleColor"
                    :size="200" />
                <div class="warning-button" v-if="bloodSugar > 10 || bloodSugar < 3.9" @click="seeRiskyEvents">
                    <van-icon name="warning-o" color="#FF3030" />
                    <div class="warning-text">点击查看过去两小时饮食</div>
                </div>
            </div>
        </van-popup>

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

        <!-- 过去两小时饮食记录展示弹窗 -->
        <van-popup v-model:show="showRiskyEvent" round closeable :style="{ padding: '0.5rem' }">
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
        </van-popup>
        <!-- 最大 最小 均值 柱状图 -->
        <div class="echart" id="bloodSugarBarChart" :style="bloodSugarBarChartStyle"></div>
        <!-- 饼状图容器 -->
        <div class="echart" id="pieChart" :style="pieChartStyle"></div>
    </div>
</template>

<script>
import * as echarts from "echarts";
import { ref } from "vue";
import { get, put, post, del } from "../axios/axiosConfig.js";
import { mapState, mapMutations } from 'vuex';

export default {
    setup() {
        const show = ref(false);
        const showPopup = () => {
            show.value = true;
        };
        const showRiskyEvent = ref(false);
        const showRiskyEventPopup = () => {
            showRiskyEvent.value = true;
        };
        const currentRate = ref(0); // 这个值可以根据实际血糖值进行动态计算
        const bloodSugar = ref('--'); // 血糖值
        const selectedPointTime = ref('12月16日 星期五 01:50');
        const circleColor = ref('#409EFF');
        const xData = ref([]);
        const yData = ref([]);
        const xPredicted = ref([]);
        const yPredicted = ref([]);
        return {
            show,
            showPopup,
            currentRate,// 这个值可以根据实际血糖值进行动态计算
            bloodSugar,// 血糖值
            selectedPointTime,
            circleColor,
            xData,
            yData,
            showRiskyEvent,
            showRiskyEventPopup,
            xPredicted,
            yPredicted,
        }
    },
    data() {
        return {
            // 图表变量
            bloodSugarChart: {},
            bloodSugarBarChart: {},
            pieChart: {},
            bloodSugarChartStyle: { float: "left", width: "100%", height: "10rem",marginBottom: "12px" },
            bloodSugarBarChartStyle: { float: "left", width: "100%", height: "4rem" },
            pieChartStyle: { float: "left", width: "100%", height: "5rem", marginBottom: "2rem" },
            // 血糖阈值
            bloodSugarThreshold: 16.7,
            // 时间选择器
            showStartDateTimePicker: false,
            showEndDateTimePicker: false,
            startDateTime: new Date(2021, 7, 4, 7, 20, 21),
            endDateTime: new Date(2021, 7, 4, 14, 20, 21),
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(2025, 11, 31),
            // 饮食记录
            records: [],
            loading: false,
            finished: false,
            // 所有饮食记录
            allRecords: [
                //{id: 4, userId: 1, createTime: '2021-08-04T10:58:00', imgUrl: null, type: '午餐'}
            ],
        };
    },
    mounted() {
        this.startDateTime = this.$store.state.globalSDT;
        this.endDateTime = this.$store.state.globalEDT;
        this.currentRate = 0;
        // 获取图表初始数据
        this.getBloodSugarData(this.startDateTime, this.endDateTime);
        // 初始化图表
        this.initBloodSugarChart();
        this.initBloodSugarBarChart();
        this.initPieChart();
    },
    beforeDestroy() {
        if (this.bloodSugarChart) {
            this.bloodSugarChart.dispose();
        }
        if (this.bloodSugarBarChart) {
            this.bloodSugarBarChart.dispose();
        }
    },
    //计算属性
    computed: {
        ...mapState(['globalSDT', 'globalEDT']),
        //开始时间
        startDateTimeFormatted() {
            //开始时间的原始格式为Mon Dec 18 2023 17:25:00 GMT+0800 (中国标准时间)
            //将其转换成 yyyy-MM-dd hh:mm:ss 格式
            return this.formatTime(this.startDateTime);
        },
        //结束时间
        endDateTimeFormatted() {
            //结束时间的原始格式为Mon Dec 18 2023 17:25:00 GMT+0800 (中国标准时间)
            //将其转换成 yyyy-MM-dd hh:mm:ss 格式
            return this.formatTime(this.endDateTime);
        },
        // 最高血糖
        maxBloodSugar() {
            return Math.max(...this.yData);
        },
        // 最低血糖
        minBloodSugar() {
            return Math.min(...this.yData);
        },
        // 平均血糖
        avgBloodSugar() {
            let sum = 0;
            for (let i = 0; i < this.yData.length; i++) {
                sum += this.yData[i];
            }
            // console.log(sum);
            return sum / this.yData.length;
        },
        //每个区间的血糖值点数统计列表
        pieChartData() {
            //初始化每个区间的血糖值点数统计列表
            const pieChartData = [
                { name: '低血糖', value: 0.00001 },
                { name: '正常', value: 0.00001 },
                { name: '有风险', value: 0.00001 },
                { name: '高风险', value: 0.00001 },
                { name: '极高风险', value: 0.00001 }
            ];
            //遍历血糖值列表，统计每个区间的血糖值点数
            for (let i = 0; i < this.yData.length; i++) {
                if (this.yData[i] < 3.9) {
                    pieChartData[0].value += 1;
                }
                else if (this.yData[i] >= 3.9 && this.yData[i] <= 10.0) {
                    pieChartData[1].value += 1;
                }
                else if (this.yData[i] > 10.0 && this.yData[i] <= 13.9) {
                    pieChartData[2].value += 1;
                }
                else if (this.yData[i] > 13.9 && this.yData[i] <= 16.7) {
                    pieChartData[3].value += 1;
                }
                else if (this.yData[i] > 16.7) {
                    pieChartData[4].value += 1;
                }
            }
            return pieChartData;
        },
    },
    methods: {
        ...mapMutations(['setGlobalSDT', 'setGlobalEDT']),
        async getBloodSugarData(sdt, edt) { //从数据库中获取血糖数据
            //将时间格式从Mon Dec 18 2023 17:25:00 GMT+0800 (中国标准时间)，转换为2023-12-18T17:25:00格式
            sdt = this.toDTO(sdt);
            edt = this.toDTO(edt);
            //发送请求
            try {
                //获取血糖数据
                const response = await get('/food/glucose/getGlucose', {
                    startTime: sdt,
                    endTime: edt,
                });
                const { code, msg, data, message } = response;
                if (code == 200) {
                    //更新数据
                    // data是一个数组，数组中的每个元素是一个对象，对象中包含了血糖值和时间等信息具体如下：
                    // {id: 85, userId: 1, gluValue: 15.3, time: '2021-07-31T13:28:00'}
                    // 遍历数组，将血糖值和时间分别存储到xData和yData中
                    const x = [];
                    const y = [];
                    for (let i = 0; i < data.length; i++) {
                        //把时间格式从2023-12-16T15:30:30转换为2023-12-16 15:30:30
                        data[i].time = data[i].time.replace('T', ' ');
                        x.push(data[i].time);
                        y.push(data[i].gluValue);
                    }
                    this.xData = x;
                    this.yData = y;
                    // console.log('Data', this.xData, this.yData);
                    const isEdtCurrentTimeAndOneDayDifference = (sdt, edt) => {
                        // 忽略秒
                        const startTime = new Date(sdt).toISOString().slice(0,-8);
                        const endTime = new Date(edt).toISOString().slice(0,-8);
                        const curTime = this.globalEDT.toISOString().slice(0,-8);
                        const isEdtCurrentTime = curTime === endTime;
                        const isOneDayDifference = new Date(endTime) - new Date(startTime) == 86400000;
                        return isEdtCurrentTime && isOneDayDifference;
                    };
                    // 当选择的终止时间为当前时间且起始时间为1天前时，获取并显示预测结果
                    if (isEdtCurrentTimeAndOneDayDifference(sdt, edt)) {
                        // 获取血糖预测数据
                        try {
                            const response = await get('food/glucose/getPredictGlucose');
                            const { code, msg, data, message } = response;
                            if (code == 200) {
                                this.xPredicted = [];
                                this.yPredicted = [];
                                data.precict.forEach(ele => {
                                    this.xPredicted.push(ele.time);
                                    this.yPredicted.push(ele.value);
                                });
                                // console.log('Predicted:', this.xPredicted, this.yPredicted);
                            }
                            else {
                                console.log('获取血糖预测结果失败');
                            }
                        } catch (error) {
                            console.log('获取血糖预测结果失败', error);
                        }
                        
                        const xRealData = this.xData.slice(); // 使用 slice() 来避免直接修改原始数组
                        const yRealData = this.yData.slice();
                        const yPredictedData = this.yPredicted.slice();
                        const n = yPredictedData.length;
                        const m = yRealData.length;
                        xRealData.push(...this.xPredicted);
                        // 在实际数据的末尾添加 n 个 null
                        yRealData.push(...new Array(n).fill(null));
                        // 在预测数据的开头添加 m 个 null
                        yPredictedData.unshift(...new Array(m).fill(null));

                        this.bloodSugarChart.setOption({
                            xAxis: {
                                data: xRealData
                            },
                            series: [
                                {
                                    // 原始血糖数据的配置
                                    name: 'Real',
                                    data: yRealData,
                                },
                                {
                                    // 预测血糖数据的配置
                                    name: 'Predicted',
                                    data: yPredictedData,
                                }
                            ]
                        });
                    }
                    else {
                        //更新血糖折线图表
                        this.bloodSugarChart.setOption({
                            xAxis: {
                                data: this.xData
                            },
                            series: [
                                {
                                    name: 'Real',
                                    data: this.yData,
                                },
                                {
                                    name: 'Predicted',
                                    data: [],
                                }
                            ]
                        });
                    }
                    
                    //更新血糖柱状图表
                    this.bloodSugarBarChart.setOption({
                        series: [
                            {
                                data: [this.maxBloodSugar.toFixed(2), this.minBloodSugar.toFixed(2), this.avgBloodSugar.toFixed(2)]
                            }
                        ]
                    });
                    //更新饼状图
                    this.pieChart.setOption({
                        series: [
                            {
                                data: this.pieChartData
                            }
                        ]
                    });
                }
                else {
                    this.$toast('获取血糖数据失败');
                }
            } catch (error) {
                console.log(error);
            }
        },
        async getDietData(sdt, edt) {
            //从数据库中获取饮食数据
            try {
                const response = await get('/food/record/getRecord', {
                    startTime: sdt,
                    endTime: edt,
                });
                const { code, msg, data, message } = response;
                // console.log(code);
                // console.log(msg);
                // console.log(data);
                // console.log(message);
                this.allRecords = data;
                this.onLoad();
            }
            catch (error) {
                console.log(error);
            }
        },
        //时间格式转换函数
        toDTO(vdate) {
            //将时间格式从Mon Dec 18 2023 17:25:00 GMT+0800 (中国标准时间)，转换为2023-12-18T17:25:00格式
            const twoDigits = (num) => num.toString().padStart(2, '0');

            const date = new Date(vdate);
            const year = date.getFullYear();
            const month = twoDigits(date.getMonth() + 1); // 月份是从 0 开始的
            const day = twoDigits(date.getDate());
            const hours = twoDigits(date.getHours());
            const minutes = twoDigits(date.getMinutes());
            const seconds = twoDigits(date.getSeconds());

            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        },
        subtractNHours(n, isoString) {
            // 将 ISO 8601 字符串转换为 Date 对象
            const date = new Date(isoString);

            // 减去两小时
            date.setHours(date.getHours() - n);
            return date;
        },
        addNHours(n, isoString) {
            // 将 ISO 8601 字符串转换为 Date 对象
            const date = new Date(isoString);

            // 减去两小时
            date.setHours(date.getHours() + n);
            return date;
        },
        seeRiskyEvents() {
            //从数据库中获取过去两小时的饮食记录
            //用selectedPointTime作为结束时间
            //用selectedPointTime - 2小时作为开始时间
            console.log(this.selectedPointTime)
            let edt = this.selectedPointTime.replace(' ', 'T');
            let sdt = this.subtractNHours(2, edt);
            sdt = this.toDTO(sdt);
            // console.log(sdt)
            // console.log(edt)
            this.getDietData(sdt, edt);
            // //弹出弹窗，展示过去两小时的饮食记录
            this.showRiskyEventPopup();

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
        // 格式化时间显示
        formatTime(vdate) {
            const twoDigits = (num) => num.toString().padStart(2, '0');

            const date = new Date(vdate);
            const year = date.getFullYear();
            const month = twoDigits(date.getMonth() + 1); // 月份是从 0 开始的
            const day = twoDigits(date.getDate());
            const hours = twoDigits(date.getHours());
            const minutes = twoDigits(date.getMinutes());
            const seconds = twoDigits(date.getSeconds());

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
                this.getBloodSugarData(this.startDateTime, this.endDateTime);
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
                //startDateTime距离endDateTime不能超过2天
                //如果超过两天，则自动将startDateTime设置为endDateTime - 2天
                if (this.endDateTime - this.startDateTime > 172800000) {
                    console.log("不能超过两天")
                    this.startDateTime = this.subtractNHours(48, this.endDateTime);
                    this.setGlobalSDT(this.startDateTime);
                }
                this.showEndDateTimePicker = false;
                //TODO 从数据库中重新获取图表数据 
                this.getBloodSugarData(this.startDateTime, this.endDateTime);
            }
        },
        initBloodSugarChart() {
            const option = {
                title: {
                    text: '血糖值变化趋势',
                },
                grid: {
                    hoverLayerThreshold: 5, // 调整此值以适应你的需求
                    left: '15%',
                    right: '15%',
                },
                tooltip: {
                    trigger: "axis"
                },
                xAxis: {
                    name: "时间",
                    data: [],
                    axisLabel: {
                        formatter: function (value) {
                            // value 是 x 轴的标签文本，即时间字符串
                            // 如将 '2024-05-15 14:44:00' 截取为 '14:44'
                            return value.replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1').slice(0,-3);
                        }
                    }
                },
                dataZoom: [ // 这个dataZoom组件，默认控制x轴。
                    {
                        type: 'slider',
                        start: 0,
                        end: 100,
                        zoomLock: true,
                    },
                    {
                        type: 'inside',
                        start: 0,
                        end: 100,
                        zoomLock: true,
                    }
                ],
                yAxis: {
                    name: "血糖值(mmol/L)",
                    min: 0
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {}
                    }
                },
                tooltip: {
                    trigger: 'axis',
                },
                visualMap: {
                    top: 50,
                    right: 10,
                    precision: 1,//显示小数点后一位
                    pieces: [
                        { //蓝色
                            gt: 0,
                            lte: 3.9,
                            color: '#00BFFF'
                        },
                        { //绿色
                            gt: 3.9,
                            lte: 10.0,
                            color: '#7CFC00'
                        },
                        { //黄色
                            gt: 10.0,
                            lte: 13.9,
                            color: '#FFD700'
                        },
                        { //橙色
                            gt: 13.9,
                            lte: 16.7,
                            color: '#FFA500'
                        },
                        { //红色
                            gt: 16.7,
                            color: '#FF3030'
                        }
                    ],
                    outOfRange: {
                        color: '#999'
                    }
                },
                series: [
                    {
                        name: 'Real',
                        data: [],
                        type: "line", // 类型设置为折线图
                        areaStyle: {},
                        label: {
                            show: true,
                            position: 'top',
                            formatter: function (params) {
                                if (params.value > 10.0) {
                                    return '{warningText|!偏高}';
                                } else if (params.value < 3.9) {
                                    return '{warningText|!偏低}';
                                } else {
                                    return '';
                                }
                            },
                            backgroundColor: '#fff',
                            borderColor: '#000',
                            rich: {
                                warningText: {
                                    align: 'left',
                                    color: '#FF3030',
                                    fontSize: 12,
                                    padding: [0, 0, 0, 5]
                                },
                            },
                        },
                        markLine: {
                            silent: true,
                            symbol: ['none', 'none'],
                            lineStyle: {
                                color: '#333'
                            },
                            label: {
                                position: 'start',
                            },
                            data: [
                                {
                                    yAxis: 3.9
                                },
                                {
                                    yAxis: 10.0
                                },
                                {
                                    yAxis: 13.9
                                },
                                {
                                    yAxis: 16.7
                                },
                            ]
                        },
                        showSymbol: false,
                    },
                    {
                        name: 'Predicted',
                        data: [],
                        type: 'line',
                        lineStyle: {
                            type: 'dashed', // 虚线
                        },
                        showSymbol: false,
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            this.bloodSugarChart = echarts.init(document.getElementById("bloodSugarChart"));
            this.bloodSugarChart.setOption(option);
            //随着屏幕大小调节图表
            // window.addEventListener("resize", () => {
            //     this.bloodSugarChart.resize();
            // });
            // 监听鼠标点击事件
            this.bloodSugarChart.on('click', (params) => {
                // 在控制台输出当前点的数据
                //根据血糖值决定弹窗中显示的内容
                // 如果小于3.9，则显示偏低
                console.log(this.currentRate)
                if (params.value < 3.9) {
                    this.currentRate = params.value / this.bloodSugarThreshold * 100;
                    this.circleColor = '#00BFFF';
                    this.bloodSugar = params.value;
                    this.selectedPointTime = params.name;
                    this.showPopup();
                } else if (params.value > 16.7) {
                    // 如果大于16.7，则显示偏高
                    this.currentRate = 100;
                    this.circleColor = '#FF3030';
                    this.bloodSugar = params.value;
                    this.selectedPointTime = params.name;
                    this.showPopup();
                }
                else {// 如果在3.9到16.7之间，则显示正常 
                    this.bloodSugar = params.value;
                    if (params.value > 10.0) {
                        this.circleColor = '#FFA500';
                    } else {
                        this.circleColor = '#7CFC00';
                    }
                    this.selectedPointTime = params.name;
                    this.currentRate = params.value / this.bloodSugarThreshold * 100;
                    this.showPopup();
                }
                console.log(this.currentRate)
            });
        },
        initBloodSugarBarChart() {
            // 最大 最小 均值 柱状图 横向
            const option = {
                title: {
                    text: '血糖值统计',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '15%',
                    right: '30%',
                    top: '20%',
                    bottom: '20%',
                },
                xAxis: {
                    type: 'value',
                    name: '血糖值(mmol/L)',
                    nameLocation: 'end',
                    nameTextStyle: {
                        fontSize: 12
                    },
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    data: ['最大值', '最小值', '平均值']
                },
                series: [
                    {
                        name: '血糖值',
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'right',
                            formatter: '{c} mmol/L'
                        },
                        data: [0, 0, 0],
                        // 柱子颜色, 三个值分别对应三个柱子
                        itemStyle: {
                            color: function (params) {
                                var colorList = ['#FF3030', '#7CFC00', '#409EFF'];
                                return colorList[params.dataIndex]
                            }
                        }
                    },
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            this.bloodSugarBarChart = echarts.init(document.getElementById("bloodSugarBarChart"));
            this.bloodSugarBarChart.setOption(option);
            //随着屏幕大小调节图表
            // window.addEventListener("resize", () => {
            //     this.bloodSugarChart.resize();
            // });
        },
        initPieChart() {
            // 饼状图数据示例
            const pieChartData = [
                { name: '低血糖', value: 30 },
                { name: '正常', value: 50 },
                { name: '有风险', value: 10 },
                { name: '高风险', value: 10 },
                { name: '极高风险', value: 10 }
            ];

            const option = {
                title: {
                    text: '血糖区间占比',
                    left: 'left',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{d}%',
                },
                legend: {
                    top: 'bottom',
                    data: pieChartData.map(item => item.name),
                },
                color: ['#00BFFF', '#7CFC00', '#FFD700', '#FFA500', '#FF3030'],
                series: [
                    {
                        name: '数据名称',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center',
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '20',
                                fontWeight: 'bold',
                            },
                        },
                        labelLine: {
                            show: false,
                        },
                        data: pieChartData,
                    },
                ],
            };
            this.pieChart = echarts.init(document.getElementById("pieChart"));
            // 设置饼状图配置
            this.pieChart.setOption(option);
        },
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
    padding: 0.2rem;
    /* 内部内容居中 */
    align-items: center;
}

.time-selector .van-button {
    border-radius: 30px;
    border-color: rgb(109, 162, 242);
    border-width: 2px;
    background-color: white;
    -webkit-text-fill-color: black;
}

.time-label {
    text-align: center;
    margin-bottom: 0.1rem;
    color: #0c0f12;
    font-size: 0.3rem;
}

.time-col {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.records-container {
    width: 9rem;
    height: 100%;
    font-size: 0.4rem;
    text-align: center;
    overflow: auto;
}

.record {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding: 0rem 0;
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