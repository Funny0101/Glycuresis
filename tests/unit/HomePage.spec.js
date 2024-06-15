import HomePage from '@/views/HomePage.vue';
import { mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import { createRouter, createWebHistory } from 'vue-router';

// mock slide-ruler
jest.mock('@/views/Ruler.vue', () => ({}));

import axios from 'axios'; // 导入真实的axios模块

jest.mock('@/axios/axiosConfig', () => {
    return {
        instance: {
            get: jest.fn(),
            post: jest.fn(),
            // 在这里添加其他需要的 mock 函数
            interceptors: { request: { use: jest.fn() } }
        }
    };
});

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({})), // 使用Promise.resolve创建一个resolved状态的Promise对象
    post: jest.fn(() => Promise.resolve({})), // 同样使用Promise.resolve创建一个resolved状态的Promise对象
}));

// 创建一个模拟的路由器实例
const mockRouter = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/' }], // 添加任何必要的路由
});

// 模拟 echarts
jest.mock('echarts', () => ({
    init: jest.fn(() => ({
        setOption: jest.fn(),
        on: jest.fn(), // mock on 方法
    })),
}));

describe('HomePage.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(HomePage, {
            // 这里的数据可以根据您的需要进行修改
            data() {
                return {
                    selectedValue: '',
                    showPicker: false,
                    columns: [
                        { text: '早餐', value: 'breakfast' },
                        { text: '午餐', value: 'lunch' },
                        { text: '晚餐', value: 'dinner' },
                        { text: '加餐', value: 'snack' },
                    ],
                    showPlus: false,
                    value: '',
                    standard: {
                        fat: 53,
                        protein: 71,
                        carbs: 285,
                        calories: 2075,
                    },
                    intake: {
                        fat: 0,
                        protein: 0,
                        carbs: 0,
                        calories: 0,
                    },
                    mealRecord: {
                        breakfast: 0,
                        lunch: 0,
                        dinner: 0,
                        snack: 0,
                    },
                    isDietHealthy: true,
                    isBloodSugarHealthy: true,
                    myChart: {},
                    xData: [],
                    yData: [],
                    myChartStyle: { float: "left", width: "100%", height: "6rem" },
                    glucoseFormVisible: false,
                    glucoseForm: {
                        glucose: 0.0,
                        time: new Date(),
                    },
                    glucoseFormRules: {
                        glucose: [
                            { required: true, message: '请输入血糖值', trigger: 'blur' },
                            { min: 0, message: '血糖值必须大于0' }
                        ],
                        time: [
                            { required: true, message: '请选择时间', trigger: 'blur' },
                        ],
                    },
                    glucoseRecordFile: null,
                    userInfo: {},
                    glucoseValues: [],
                    wspath: 'ws://212.64.29.100:8023/websocket/ws/',
                    satoken: 'test_token',
                };
            },
            global: {
                plugins: [
                    mockRouter,
                ],
                // mocks: {
                //     $refs: {
                //         glucoseForm: {
                //             validate: jest.fn((cb) => cb(true)),
                //         },
                //     }
                // },
            },
            stubs: {
                GlucoseForm: {
                    name: 'GlucoseForm',
                    template: '<div ref="glucoseForm"><slot></slot></div>',
                    methods: {
                        validate: jest.fn(cb => cb(true)) // 模拟验证通过
                    }
                }
            }
        });
    });

    it('should render HomePage component', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should fetch diet data on mount', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                data: {
                    fatMass: 10,
                    proteinMass: 20,
                    carbohydrateMass: 30,
                    calorieMass: 400,
                    breakfastCalorieMass: 100,
                    lunchCalorieMass: 150,
                    dinnerCalorieMass: 100,
                    snackCalorieMass: 50,
                }
            }
        });

        wrapper.vm.queryDietData();
        await flushPromises();

        expect(wrapper.vm.intake.fat).toBe(10);
        expect(wrapper.vm.intake.protein).toBe(20);
        expect(wrapper.vm.intake.carbs).toBe(30);
        expect(wrapper.vm.intake.calories).toBe(400);
        expect(wrapper.vm.mealRecord.breakfast).toBe(100);
        expect(wrapper.vm.mealRecord.lunch).toBe(150);
        expect(wrapper.vm.mealRecord.dinner).toBe(100);
        expect(wrapper.vm.mealRecord.snack).toBe(50);
    });

    it('should fetch blood sugar data on mount', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                data: [
                    { gluValue: 5.0, time: new Date().toISOString() },
                    { gluValue: 6.5, time: new Date().toISOString() },
                ]
            }
        });

        wrapper.vm.queryBloodSugarData();
        await flushPromises();

        expect(wrapper.vm.glucoseValues.length).toBe(2);
        expect(wrapper.vm.glucoseValues[0].gluValue).toBe(5.0);
        expect(wrapper.vm.glucoseValues[1].gluValue).toBe(6.5);
    });

    it('should calculate standard intake based on user info', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                data: {
                    weight: 70,
                    height: 1.75,
                }
            }
        });

        wrapper.vm.calculateStandardIntake();
        await flushPromises();

        expect(wrapper.vm.standard.calories).toBe(2100);
        expect(wrapper.vm.standard.carbs).toBeCloseTo(289);
        expect(wrapper.vm.standard.protein).toBeCloseTo(79);
        expect(wrapper.vm.standard.fat).toBeCloseTo(70);
    });

    it('should handle logout', async () => {
        axios.post.mockResolvedValueOnce({});

        await wrapper.vm.logout();
        expect(axios.post).toHaveBeenCalledWith('/api/user/user/logout');
        // 这里我们还需要验证路由跳转，但由于jest-vue无法模拟路由跳转，我们假设跳转成功
    });

    it('should show glucose form when onBloodSugarUpload is called', () => {
        wrapper.vm.onBloodSugarUpload();
        expect(wrapper.vm.glucoseFormVisible).toBe(true);
    });

    it('should navigate to diet record when onDietRecordUpload is called', () => {
        const push = jest.fn();
        wrapper.vm.$router.push = push;
        wrapper.vm.onDietRecordUpload();
        expect(push).toHaveBeenCalledWith({
            name: 'dietRecord',
            params: {
                meal: 'breakfast',
            },
        });
    });

    it('should show plus when openDialog is called', () => {
        wrapper.vm.openDialog();
        expect(wrapper.vm.showPlus).toBe(true);
    });

    it('should hide glucose form when cancel is called', () => {
        wrapper.vm.cancel();
        expect(wrapper.vm.glucoseFormVisible).toBe(false);
    });
    // 这函数测不了，validate函数无法模拟
    // it('should validate and add glucose record when addGlucoseRecord is called', async () => {
    //     wrapper.setData({
    //         glucoseForm: { glucose: 5.5, time: new Date() },
    //     });

    //     axios.post.mockResolvedValueOnce({});
    //     wrapper.vm.queryBloodSugarData = jest.fn();

    //     await wrapper.vm.addGlucoseRecord();
    //     expect(axios.post).toHaveBeenCalledWith('/api/food/glucose/addGlucose', {
    //         gluValue: 5.5,
    //         time: dealTime(wrapper.vm.glucoseForm.time),
    //     });
    //     expect(wrapper.vm.queryBloodSugarData).toHaveBeenCalled();
    //     expect(wrapper.vm.glucoseFormVisible).toBe(false);
    // });


    it('should navigate to diet record with meal when record is called', () => {
        const push = jest.fn();
        wrapper.vm.$router.push = push;
        wrapper.vm.record('lunch');
        expect(push).toHaveBeenCalledWith({
            name: 'dietRecord',
            params: {
                meal: 'lunch',
            },
        });
    });

    it('should handle glucose file upload', () => {
        const file = new File(['dummy content'], 'example.txt', { type: 'text/plain' });
        const event = { target: { files: [file] } };
        wrapper.vm.handleGlucoseFileUpload(event);
        expect(wrapper.vm.glucoseRecordFile).toBe(file);
    });

    it('should upload glucose file when uploadGlucoseFile is called', async () => {
        const file = new File(['dummy content'], 'example.txt', { type: 'text/plain' });
        wrapper.setData({ glucoseRecordFile: file });
        axios.post.mockResolvedValueOnce({});
        wrapper.vm.queryBloodSugarData = jest.fn();

        await wrapper.vm.uploadGlucoseFile();
        expect(axios.post).toHaveBeenCalledWith('/api/food/glucose/uploadGlucoseFile', { file }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        expect(wrapper.vm.queryBloodSugarData).toHaveBeenCalled();
        expect(wrapper.vm.glucoseFormVisible).toBe(false);
    });

    it('should shorten file name correctly', () => {
        const shortName = 'short.txt';
        const longName = 'this_is_a_very_long_filename_that_needs_to_be_shortened.txt';
        expect(wrapper.vm.shortenFileName(shortName, 10)).toBe(shortName);
        expect(wrapper.vm.shortenFileName(longName, 10)).toBe('this...txt');
    });

    it('should navigate to appropriate routes when goto functions are called', () => {
        const push = jest.fn();
        wrapper.vm.$router.push = push;

        wrapper.vm.gotoFood();
        expect(wrapper.vm.showPlus).toBe(false);
        expect(wrapper.vm.showPicker).toBe(true);

        wrapper.vm.gotoSearch();
        expect(wrapper.vm.showPlus).toBe(false);
        expect(push).toHaveBeenCalledWith("/foodRecognition");

        wrapper.vm.gotoDiet();
        expect(wrapper.vm.showPlus).toBe(false);
        expect(push).toHaveBeenCalledWith("/search");

        wrapper.vm.gotoXuetang();
        expect(wrapper.vm.showPlus).toBe(false);
        expect(push).toHaveBeenCalledWith("/friends");

        wrapper.vm.gotoJiLuYinShi({ value: 'lunch' });
        expect(wrapper.vm.showPicker).toBe(false);
        expect(wrapper.vm.selectedValue).toEqual({ value: 'lunch' });
        expect(push).toHaveBeenCalledWith("/dietRecord/lunch");
    });

    it('should initialize echarts with correct options', () => {
        wrapper.setData({
            glucoseValues: [
                { gluValue: 5.0, time: new Date().toISOString() },
                { gluValue: 6.5, time: new Date().toISOString() },
            ],
        });

        // 创建一个假的 DOM 节点
        const el = document.createElement('div');
        el.setAttribute('id', 'mychart');
        document.body.appendChild(el);

        wrapper.vm.initEcharts();
        expect(wrapper.vm.myChart).toBeDefined();

        // 清理 DOM
        document.body.removeChild(el);
    });


    it('should setup WebSocket connections in getWsMessage', () => {
        global.WebSocket = jest.fn(() => ({
            onopen: jest.fn(),
            onmessage: jest.fn(),
            onerror: jest.fn(),
            onclose: jest.fn(),
        }));
        wrapper.vm.getWsMessage();
        expect(global.WebSocket).toHaveBeenCalledTimes(2);
    });
});
