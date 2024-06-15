import { mount } from '@vue/test-utils';
import BloodSugarChart from '@/views/BloodSugarChart.vue';
import { get, post } from '@/axios/axiosConfig';
import { ElMessage } from 'element-plus';
import flushPromises from 'flush-promises';

// 模拟 axiosConfig 中的 get 和 post 方法
jest.mock('@/axios/axiosConfig', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

// 模拟 element-plus 中的 ElMessage
jest.mock('element-plus', () => ({
    ElMessage: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));
// 格式化时间显示
function formatTime(vdate) {
    const twoDigits = (num) => num.toString().padStart(2, '0');

    const date = new Date(vdate);
    const year = date.getFullYear();
    const month = twoDigits(date.getMonth() + 1); // 月份是从 0 开始的
    const day = twoDigits(date.getDate());
    const hours = twoDigits(date.getHours());
    const minutes = twoDigits(date.getMinutes());
    const seconds = twoDigits(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 模拟 echarts
jest.mock('echarts', () => ({
    init: jest.fn(() => ({
        setOption: jest.fn(),
        on: jest.fn(), // mock on 方法
    })),
}));

describe('BloodSugarChart.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(BloodSugarChart, {
            data() {
                return {
                    // 图表变量
                    bloodSugarChart: null,
                    bloodSugarBarChart: {},
                    pieChart: {},
                    bloodSugarChartStyle: { float: "left", width: "100%", height: "10rem", marginBottom: "12px" },
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
                    allRecords: [],
                    yData: [4.5, 9.0, 12.5, 15.0, 18.0],
                };
            },
            // 设置全局 state
            global: {
                mocks: {
                    $store: {
                        state: {
                            statsTabActiveIndex: 0,
                            globalEDT: new Date(),
                            globalSDT: new Date(new Date().setDate(new Date().getDate() - 1)),
                            userData: {},
                        },
                        mutations: {
                            changeStatsTabActiveIndex(state, index) {
                                state.statsTabActiveIndex = index;
                            },
                            setGlobalSDT(state, date) {
                                state.globalSDT = date;
                            },
                            setGlobalEDT(state, date) {
                                state.globalEDT = date;
                            },
                            setUserData(state, userData) {
                                state.userData = userData;
                            },
                        },
                        actions: {},
                        getters: {},
                    }
                }
            },
            methods: {
                // Mock API 请求函数
                async get(endpoint, params) {
                    if (endpoint === '/food/glucose/getGlucose') {
                        // 模拟返回的数据
                        return Promise.resolve({
                            code: 200,
                            data: [
                                { id: 1, userId: 1, gluValue: 15.3, time: '2023-12-16T15:30:30' },
                                { id: 2, userId: 1, gluValue: 12.5, time: '2023-12-16T16:30:30' },
                                { id: 3, userId: 1, gluValue: 14.8, time: '2023-12-16T17:30:30' }
                            ]
                        });
                    } else if (endpoint === 'food/glucose/getPredictGlucose') {
                        // 模拟返回的预测数据
                        return Promise.resolve({
                            code: 200,
                            data: {
                                predict: [
                                    { time: '2023-12-16T18:30:30', value: 16.5 },
                                    { time: '2023-12-16T19:30:30', value: 18.0 }
                                ]
                            }
                        });
                    }
                }
            }
        });

        // Mock console.error
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render BloodSugarChart component', async () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should fetch records when mounted', async () => {
        // 模拟生命周期钩子触发
        wrapper.vm.$options.mounted?.call(wrapper.vm);

        // 等待异步操作完成
        await flushPromises();

        // 断言数据是否成功加载
        expect(wrapper.vm.records).toEqual(expect.any(Array));
    });

    it('should format startDateTime correctly', async () => {
        expect(wrapper.vm.startDateTimeFormatted).toBe(formatTime(wrapper.vm.startDateTime));
    });

    it('should format endDateTime correctly', async () => {
        expect(wrapper.vm.endDateTimeFormatted).toBe(formatTime(wrapper.vm.endDateTime));
    });

    it('should fetch and update blood sugar data correctly', async () => {
        const sdt = new Date('2023-12-16T00:00:00');
        const edt = new Date('2023-12-16T23:59:59');

        await wrapper.vm.getBloodSugarData(sdt, edt);

        // 验证 xData 和 yData 是否正确更新
        expect(wrapper.vm.xData).toEqual(['2023-12-16 15:30:30', '2023-12-16 16:30:30', '2023-12-16 17:30:30']);
        expect(wrapper.vm.yData).toEqual([15.3, 12.5, 14.8]);

        // 验证图表设置是否正确调用
        expect(wrapper.vm.bloodSugarChart.setOption).toHaveBeenCalled();
        const chartOptions = wrapper.vm.bloodSugarChart.setOption.mock.calls[0][0];
        expect(chartOptions.xAxis.data).toEqual(['2023-12-16 15:30:30', '2023-12-16 16:30:30', '2023-12-16 17:30:30']);
        expect(chartOptions.series[0].data).toEqual([15.3, 12.5, 14.8]);
        expect(chartOptions.series[1].data).toEqual([]);

        // 模拟异步预测数据请求
        await wrapper.vm.getBloodSugarData(edt, edt);

        // 验证预测数据是否正确更新
        expect(wrapper.vm.xPredicted).toEqual(['2023-12-16T18:30:30', '2023-12-16T19:30:30']);
        expect(wrapper.vm.yPredicted).toEqual([16.5, 18.0]);

        // 验证图表再次设置是否正确调用
        expect(wrapper.vm.bloodSugarChart.setOption).toHaveBeenCalledTimes(2);
        const secondChartOptions = wrapper.vm.bloodSugarChart.setOption.mock.calls[1][0];
        expect(secondChartOptions.xAxis.data).toEqual([
            '2023-12-16 15:30:30', '2023-12-16 16:30:30', '2023-12-16 17:30:30',
            '2023-12-16T18:30:30', '2023-12-16T19:30:30'
        ]);
        expect(secondChartOptions.series[0].data).toEqual([15.3, 12.5, 14.8, null, null]);
        expect(secondChartOptions.series[1].data).toEqual([null, null, null, 16.5, 18.0]);
    });
});
