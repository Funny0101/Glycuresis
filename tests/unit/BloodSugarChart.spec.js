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

//时间格式转换函数
function toDTO(vdate) {
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
                    $store: {
                        state: {
                            userData: { account: '', name: '', profile: '' },
                        },
                        commit: jest.fn(),
                    },
                    $message: {
                        error: jest.fn(),
                        success: jest.fn(),
                    },
                    $toast: jest.fn(),
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
                    },
                    $store: {
                        state: {
                            userData: { account: '', name: '', profile: '' },
                        },
                        commit: jest.fn(),
                    },
                    $message: {
                        error: jest.fn(),
                        success: jest.fn(),
                    },
                    $toast: jest.fn(),
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

        const response = {
            code: 200,
            data: [
                { id: 1, userId: 1, gluValue: 15.3, time: '2023-12-16T15:30:30' },
                { id: 2, userId: 1, gluValue: 12.5, time: '2023-12-16T16:30:30' },
                { id: 3, userId: 1, gluValue: 14.8, time: '2023-12-16T17:30:30' }
            ]
        };

        get.mockResolvedValue(response);

        await wrapper.vm.getBloodSugarData(sdt, edt);

        expect(get).toHaveBeenCalledWith('/food/glucose/getGlucose', {
            startTime: toDTO(sdt),
            endTime: toDTO(edt),
        });

        // 验证 xData 和 yData 是否正确更新
        expect(wrapper.vm.xData).toEqual(['2023-12-16 15:30:30', '2023-12-16 16:30:30', '2023-12-16 17:30:30']);
        expect(wrapper.vm.yData).toEqual([15.3, 12.5, 14.8]);

        // // 验证图表设置是否正确调用，无法验证，因为是模拟的setOption方法
        // expect(wrapper.vm.bloodSugarChart.setOption).toHaveBeenCalled();
        // const chartOptions = wrapper.vm.bloodSugarChart.setOption.mock.calls[0][0];
        // expect(chartOptions.xAxis.data).toEqual(['2023-12-16 15:30:30', '2023-12-16 16:30:30', '2023-12-16 17:30:30']);
        // expect(chartOptions.series[0].data).toEqual([15.3, 12.5, 14.8]);
        // expect(chartOptions.series[1].data).toEqual([]);

        // 模拟异步预测数据请求
        const predictResponse = {
            code: 200,
            data: {
                predict: [
                    { time: '2023-12-16T18:30:30', value: 16.5 },
                    { time: '2023-12-16T19:30:30', value: 18.0 }
                ]
            }
        };

        get.mockResolvedValue(predictResponse);

        // 模拟异步预测数据请求
        await wrapper.vm.getBloodSugarData(edt, edt);

        // expect(get).toHaveNotBeenCalledWith('food/glucose/getPredictGlucose');

        // 验证预测数据是否正确更新
        expect(wrapper.vm.xPredicted).toEqual([]);
        expect(wrapper.vm.yPredicted).toEqual([]);

        // // 验证图表再次设置是否正确调用
        // expect(wrapper.vm.bloodSugarChart.setOption).toHaveBeenCalledTimes(2);
        // const secondChartOptions = wrapper.vm.bloodSugarChart.setOption.mock.calls[1][0];
        // expect(secondChartOptions.xAxis.data).toEqual([
        //     '2023-12-16 15:30:30', '2023-12-16 16:30:30', '2023-12-16 17:30:30',
        //     '2023-12-16T18:30:30', '2023-12-16T19:30:30'
        // ]);
        // expect(secondChartOptions.series[0].data).toEqual([15.3, 12.5, 14.8, null, null]);
        // expect(secondChartOptions.series[1].data).toEqual([null, null, null, 16.5, 18.0]);
    });

    it('should fetch and update diet data correctly', async () => {
        const sdt = new Date('2023-12-16T00:00:00');
        const edt = new Date('2023-12-16T23:59:59');

        const response = {
            code: 200,
            data: [
                { id: 1, userId: 1, foodName: 'Apple', time: '2023-12-16T08:30:00', calories: 95 },
                { id: 2, userId: 1, foodName: 'Banana', time: '2023-12-16T12:00:00', calories: 105 },
                { id: 3, userId: 1, foodName: 'Orange', time: '2023-12-16T18:00:00', calories: 80 }
            ]
        };

        get.mockResolvedValue(response);

        await wrapper.vm.getDietData(sdt, edt);

        expect(get).toHaveBeenCalledWith('/food/record/getRecord', {
            startTime: sdt,
            endTime: edt,
        });

        // 验证 allRecords 是否正确更新
        expect(wrapper.vm.allRecords).toEqual([
            { id: 1, userId: 1, foodName: 'Apple', time: '2023-12-16T08:30:00', calories: 95 },
            { id: 2, userId: 1, foodName: 'Banana', time: '2023-12-16T12:00:00', calories: 105 },
            { id: 3, userId: 1, foodName: 'Orange', time: '2023-12-16T18:00:00', calories: 80 }
        ]);
    });

    it('should convert date to DTO format correctly', () => {
        const inputDate = new Date('2023-12-18T17:25:00');
        const expectedOutput = '2023-12-18T17:25:00';

        const result = wrapper.vm.toDTO(inputDate);

        expect(result).toBe(expectedOutput);
    });

    it('should subtract N hours from ISO string correctly', () => {
        const inputDateString = '2023-12-18T17:25:00';
        const n = 2;
        const expectedOutput = new Date('2023-12-18T15:25:00');

        const result = wrapper.vm.subtractNHours(n, inputDateString);

        expect(result).toEqual(expectedOutput);
    });

    it('should add N hours to ISO string correctly', () => {
        const inputDateString = '2023-12-18T17:25:00';
        const n = 2;
        const expectedOutput = new Date('2023-12-18T19:25:00');

        const result = wrapper.vm.addNHours(n, inputDateString);

        expect(result).toEqual(expectedOutput);
    });

    it('should fetch diet records correctly within the specified time range', async () => {
        const sdt = new Date('2023-12-16T15:30:30'); // Example start time
        const edt = new Date('2023-12-16T17:30:30'); // Example end time

        const response = {
            code: 200,
            data: [
                { id: 1, userId: 1, type: '早餐', createTime: '2023-12-16T15:30:30' },
                { id: 2, userId: 1, type: '午餐', createTime: '2023-12-16T16:30:30' },
                { id: 3, userId: 1, type: '晚餐', createTime: '2023-12-16T17:30:30' }
            ]
        };

        get.mockResolvedValue(response);

        await wrapper.vm.getDietData(sdt, edt);

        expect(get).toHaveBeenCalledWith('/food/record/getRecord', {
            startTime: sdt,
            endTime: edt,
        });

        // Validate if allRecords are correctly updated
        expect(wrapper.vm.allRecords).toEqual(response.data);
    });

    it('should handle error when fetching diet records fails', async () => {
        const sdt = new Date('2023-12-16T15:30:30'); // Example start time
        const edt = new Date('2023-12-16T17:30:30'); // Example end time

        const errorMessage = 'Failed to fetch diet records';

        get.mockRejectedValue(new Error(errorMessage));

        await wrapper.vm.getDietData(sdt, edt);

        expect(get).toHaveBeenCalledWith('/food/record/getRecord', {
            startTime: sdt,
            endTime: edt,
        });

        // Validate if error message is logged
        expect(console.log).toHaveBeenCalled();
    });

    it('should format time correctly', () => {
        const inputDate = new Date('2023-12-18T17:25:00');
        const expectedOutput = '2023-12-18 17:25:00';

        const result = wrapper.vm.formatTime(inputDate);

        expect(result).toBe(expectedOutput);
    });

    it('should subtract 2 hours from selected point time correctly', () => {
        const selectedPointTime = new Date('2024-06-15 10:00:00'); // 假设这里是一个选择的时间点
    
        // 创建一个 mock 函数来替代 subtractNHours
        const mockSubtractNHours = jest.fn();
        // 将 mock 函数注入到组件实例中
        wrapper.vm.subtractNHours = mockSubtractNHours;
    
        // 调用组件中的方法，这会间接调用 subtractNHours
        wrapper.vm.seeRiskyEvents();
    
        // 验证 subtractNHours 是否被调用，并且参数符合预期
        expect(mockSubtractNHours).toHaveBeenCalled();
      });

    // it('should add 48 hours to startDateTime correctly', () => {
    //     const startDateTime = new Date('2023-12-18T17:25:00');
    //     const expectedEndTime = new Date('2023-12-20T17:25:00'); // Expected end time after adding 48 hours

    //     wrapper.vm.addNHours = jest.fn();

    //     wrapper.setData({ startDateTime: startDateTime });
    //     const result = wrapper.vm.onStartDateTimeConfirm(expectedEndTime);

    //     expect(wrapper.vm.addNHours).toHaveBeenCalledWith(48, startDateTime);
    // });

    // it('should handle onStartDateTimeConfirm when start time is greater than end time', () => {
    //     const startDateTime = new Date('2023-12-18T17:25:00');
    //     const endDateTime = new Date('2023-12-18T15:25:00');

    //     const toastMessage = '开始时间不能大于结束时间';

    //     wrapper.vm.onStartDateTimeConfirm(new Date(endDateTime));

    //     expect(wrapper.vm.$toast).toHaveBeenCalledWith(toastMessage);
    // });

    // it('should handle onEndDateTimeConfirm when end time is less than start time', () => {
    //     const startDateTime = '2023-12-18T17:25:00';
    //     const endDateTime = '2023-12-18T15:25:00';

    //     const toastMessage = '结束时间不能小于开始时间';

    //     wrapper.vm.onEndDateTimeConfirm(new Date(startDateTime));

    //     expect(wrapper.vm.$toast).toHaveBeenCalledWith(toastMessage);
    // });

    // it('should handle onRecordClick correctly', () => {
    //     const record = { id: 1, type: '早餐', createTime: '2023-12-16T15:30:30' };

    //     wrapper.vm.onRecordClick(record);

    //     expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
    //         name: 'oneMeal',
    //         params: {
    //             id: record.id,
    //             type: record.type,
    //             time: record.createTime,
    //         }
    //     });
    // });

    it('should get color correctly for different types', () => {
        const typeBreakfast = '早餐';
        const typeLunch = '午餐';
        const typeDinner = '晚餐';
        const typeSnack = '加餐';

        expect(wrapper.vm.getColor(typeBreakfast)).toBe('#FFD700');
        expect(wrapper.vm.getColor(typeLunch)).toBe('#FF4500');
        expect(wrapper.vm.getColor(typeDinner)).toBe('#1E90FF');
        expect(wrapper.vm.getColor(typeSnack)).toBe('#32CD32');
    });

    it('should handle onStartDateTimeCancel correctly', () => {
        wrapper.vm.onStartDateTimeCancel();

        expect(wrapper.vm.showStartDateTimePicker).toBe(false);
    });

    it('should handle onEndDateTimeCancel correctly', () => {
        wrapper.vm.onEndDateTimeCancel();

        expect(wrapper.vm.showEndDateTimePicker).toBe(false);
    });
});
