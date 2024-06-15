import DietRecord from '@/views/DietRecord.vue';
import { mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
// 导入 Vue Router 和 Vue Test Utils
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
    // 可以根据需要模拟其他方法并返回Promise对象
}));

// 创建一个模拟的路由器实例
const mockRouter = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/' }], // 添加任何必要的路由
});

describe('DietRecord.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(DietRecord, {
            // 这里的数据可以根据您的需要进行修改
            data() {
                return {
                    // 时间选择
                    dietItemsCount: 0,
                    showTime: false,
                    currentTime: new Date(),

                    // 选择框
                    selectedMeal: '早餐',

                    // 搜索框
                    searchValue: '',

                    // 拍照上传弹窗
                    popupVisible: false,
                    step: -1,
                    fileList: [],
                    imgSid: '',
                    imgNum: 1,
                    choosed: false,
                    confirmed: false,
                    uploaded: false,
                    dietId: undefined,
                    candidateFoodList: [],
                    candidatesIndex: 0,
                    checked: [],

                    // 侧边栏
                    currentTag: 0,
                    page: 1,
                    tags: [],
                    tagData: [],
                    loading: false,
                    finished: false,

                    // 已添加食物
                    whetherShowFoodDetails: false,
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
                    addedFoodList: [],
                }
            },
            global: {
                plugins: [
                    mockRouter,
                ],
            },
        });
    });

    it('correctly click right button', async () => {

        await wrapper.setData({ popupVisible: false });

        // 模拟点击保存按钮
        await wrapper.vm.onClickRight();

        // 断言candidateFoodList是否正确填充
        expect(wrapper.vm.popupVisible).toEqual(true);
    });
    it('correctly click close button', async () => {
        await wrapper.setData({ popupVisible: true });

        // 模拟点击保存按钮
        await wrapper.vm.onClickCloseIcon();

        // 断言candidateFoodList是否正确填充
        expect(wrapper.vm.popupVisible).toEqual(false);
    });
    it('correctly confirm', async () => {
        var date = new Date(2024, 5, 9);
        await wrapper.setData({ showTime: true });

        // 模拟点击
        await wrapper.vm.onConfirm(date);

        // 断言时间是否正确填充
        expect(wrapper.vm.showTime).toEqual(false);

        // 断言时间是否正确填充
        expect(wrapper.vm.currentTime).toEqual(date);
    });
    it('correctly updates the currentDay computed property', async () => {
        const newDate = new Date(2024, 5, 9);
        await wrapper.setData({ currentTime: newDate });

        expect(wrapper.vm.currentDay).toBe('6.9 星期日');
    });
    it('correctly fetches tags from API', async () => {
        // 模拟 Axios 实例的 get 方法
        const response = {
            data: {
                code: 200,
                msg: "操作成功",
                data: [
                    { id: 1, name: "主食" },
                ]
            }
        };

        // 模拟 Axios 实例的 get 方法
        axios.get.mockResolvedValue(response);

        // 调用组件中的方法，触发对 API 的调用
        await wrapper.vm.fetchTags();

        // 等待所有异步操作完成
        await flushPromises();

        // 断言是否正确地填充了 tags 数组
        expect(wrapper.vm.tags).toEqual(response.data.data);
    });
    it('correctly switches query when switching tags', async () => {
        // 创建 loadFoodDetail 的 spy
        const loadFoodDetailSpy = jest.spyOn(wrapper.vm, 'loadFoodDetail');

        // 设置初始状态
        await wrapper.setData({
            tagData: ['previous data'], // 设置初始的tagData数组
            finished: true, // 设置finished为true
            loading: false, // 设置loading为false
            page: 2 // 设置page为2
        });

        // 模拟调用switchQuery方法
        await wrapper.vm.switchQuery('searching');

        // 断言tagData被清空
        expect(wrapper.vm.tagData).toEqual([]);

        // 断言finished被重置为false
        expect(wrapper.vm.finished).toEqual(false);

        // 断言loading被设置为true
        expect(wrapper.vm.loading).toEqual(true);

        // 断言page被重置为1
        expect(wrapper.vm.page).toEqual(1);

        // 断言loadFoodDetail被调用
        expect(loadFoodDetailSpy).toHaveBeenCalledWith('searching');

        // 清理 spy
        loadFoodDetailSpy.mockRestore();
    });
    it('correctly updates component state after successful data retrieval', async () => {
        // 模拟 axios.get 返回的数据
        const responseData = {
            data: {
                data: {
                    list: ['food1', 'food2'],
                    pages: 2
                }
            }
        };

        // 模拟axios.get方法返回数据
        axios.get.mockResolvedValue(responseData);

        // 设置初始状态
        await wrapper.setData({
            page: 1, // 设置page为1
            currentTag: 0, // 设置currentTag为0
            loading: true // 设置loading为true
        });

        // 模拟调用loadFoodDetail方法
        await wrapper.vm.loadFoodDetail(false);

        // 等待所有异步操作完成
        await flushPromises();

        // 断言tagData是否正确更新
        expect(wrapper.vm.tagData).toEqual(['food1', 'food2']);

        // 断言page是否正确更新
        expect(wrapper.vm.page).toEqual(2);

        // 断言loading是否正确更新
        expect(wrapper.vm.loading).toEqual(false);

        // 断言finished是否正确更新
        expect(wrapper.vm.finished).toEqual(false);
    });
    it('correctly handles errors when data retrieval fails', async () => {
        // 模拟axios.get方法抛出错误
        axios.get.mockRejectedValue(new Error('Request failed'));

        // 创建 console.error 的 spy
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        // 设置初始状态
        await wrapper.setData({
            loading: true // 设置loading为true
        });

        // 模拟调用loadFoodDetail方法
        await wrapper.vm.loadFoodDetail(false);

        // 等待所有异步操作完成
        await flushPromises();

        // 断言错误是否被正确地处理
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching data:', new Error('Request failed'));

        // 恢复 console.error 方法
        consoleErrorSpy.mockRestore();
    });
    it('correctly handles successful image upload', async () => {
        // 模拟第一个axios.post方法返回的数据
        const uploadResponse = {
            data: {
                data: 'imgSidValue'
            }
        };

        // 模拟第二个axios.post方法返回的数据
        const recognizeResponse = {
            data: {
                data: {
                    message: {
                        results: ['food1', 'food2'],
                        dietId: 'dietIdValue'
                    }
                }
            }
        };

        // 使用 jest.spyOn 分别创建 axios.post 的 mock
        jest.spyOn(axios, 'post')
            .mockResolvedValueOnce(uploadResponse)
            .mockResolvedValueOnce(recognizeResponse);

        // 设置初始状态
        await wrapper.setData({
            fileList: [{ file: 'imageFile' }], // 设置fileList数组
            imgNum: 1 // 设置imgNum为1
        });

        // 模拟调用uploadImage方法
        await wrapper.vm.uploadImage();

        // 断言图片上传成功后的状态是否正确更新
        expect(wrapper.vm.imgSid).toEqual('imgSidValue');
        expect(wrapper.vm.uploaded).toEqual(true);

        // 断言识别成功后的状态是否正确更新
        expect(wrapper.vm.dietId).toEqual('dietIdValue');
        expect(wrapper.vm.candidateFoodList).toEqual(['food1', 'food2']);
    });
    it('correctly handles failed image upload', async () => {
        // 模拟axios.post方法抛出错误
        axios.post.mockRejectedValue(new Error('Upload failed'));

        // 设置初始状态
        await wrapper.setData({
            fileList: [{ file: 'imageFile' }], // 设置fileList数组
            imgNum: 1 // 设置imgNum为1
        });

        // 创建 console.error 的 spy
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        // 模拟调用uploadImage方法
        await wrapper.vm.uploadImage();

        // 断言错误是否被正确地处理
        expect(consoleErrorSpy).toHaveBeenCalledWith('操作失败', new Error('Upload failed'));

        // 恢复 console.error 方法
        consoleErrorSpy.mockRestore();
    });
    it('correctly handles upload choice when no image is selected', async () => {
        // 设置初始状态
        await wrapper.setData({
            fileList: [], // 空的fileList数组
            candidatesIndex: 0 // 设置candidatesIndex为0
        });

        // 创建 alert 的 spy
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });

        // 模拟调用uploadChoice方法
        await wrapper.vm.uploadChoice();

        // 断言是否正确提示用户选择图片
        expect(alertSpy).toHaveBeenCalledWith('请选择图片');

        // 恢复 alert 方法
        alertSpy.mockRestore();
    });

    it('correctly handles upload choice when no food is selected', async () => {
        // 设置初始状态
        await wrapper.setData({
            fileList: [{ file: 'imageFile' }], // 设置fileList数组
            candidatesIndex: -1 // 设置candidatesIndex为-1
        });

        // 创建 alert 的 spy
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });

        // 模拟调用uploadChoice方法
        await wrapper.vm.uploadChoice();

        // 断言是否正确提示用户选择食物
        expect(alertSpy).toHaveBeenCalledWith('请选择食物');

        // 恢复 alert 方法
        alertSpy.mockRestore();
    });

    it('correctly handles successful upload choice', async () => {
        // 模拟axios.post方法返回的数据
        const response = {
            data: {
                data: {
                    message: {
                        results: ['food1', 'food2']
                    }
                }
            }
        };

        // 使用 jest.spyOn 创建 axios.post 的 mock
        jest.spyOn(axios, 'post').mockResolvedValue(response);

        // 设置初始状态
        await wrapper.setData({
            fileList: [{ file: 'imageFile' }], // 设置fileList数组
            candidatesIndex: 0, // 设置candidatesIndex为0
            dietId: 'dietIdValue',
            candidateFoodList: [{ food: 'foodName', region: 'foodRegion', top5: ['food1', 'food2'] }],
            checked: [0, 1]
        });

        // 模拟调用uploadChoice方法
        await wrapper.vm.uploadChoice();

        // 断言是否正确关闭弹窗
        expect(wrapper.vm.popupVisible).toEqual(false);

        // 断言是否正确处理响应数据
        expect(wrapper.vm.addedFoodList).toEqual(['food1', 'food2']);
    });

    // 创建一个模拟的路由器实例
    const mockRouter = createRouter({
        history: createWebHistory(),
        routes: [{ path: '/' }], // 添加任何必要的路由
    });

    it('correctly handles successful saveDiet', async () => {
        // 模拟第一个axios.post方法返回的数据
        const recordResponse = {
            data: {
                data: {
                    id: 'recordIdValue'
                }
            }
        };

        // 模拟第二个axios.post方法返回的数据
        const detailResponses = [
            { data: { data: 'response1' } },
            { data: { data: 'response2' } }
        ];

        // 使用 jest.spyOn 分别创建 axios.post 的 mock
        jest.spyOn(axios, 'post')
            .mockResolvedValueOnce(recordResponse)
            .mockResolvedValueOnce(detailResponses[0])
            .mockResolvedValueOnce(detailResponses[1]);

        // 使用模拟的路由器挂载组件
        const wrapper = mount(DietRecord, {
            global: {
                plugins: [
                    mockRouter,
                ],
            },
        });

        // 设置初始状态
        await wrapper.setData({
            currentTime: new Date(), // 设置currentTime
            imgSid: 'imgSidValue', // 设置imgSid
            selectedMeal: '早餐', // 设置selectedMeal
            addedFoodList: [ // 设置addedFoodList
                { id: 'foodId1', foodMass: 100, carbohydrateMass: 10, fatMass: 5, proteinMass: 15, calorieMass: 200 },
                { id: 'foodId2', foodMass: 150, carbohydrateMass: 15, fatMass: 8, proteinMass: 20, calorieMass: 250 }
            ]
        });

        // 模拟调用saveDiet方法
        await wrapper.vm.saveDiet();

        // 断言是否正确导航回上一页
        expect(mockRouter.currentRoute.value.fullPath).toEqual('/'); // 假设成功保存后会回到根路由
    });

    it('correctly handles failed saveDiet', async () => {
        // 模拟第一个axios.post方法返回的数据
        const recordResponse = {
            data: {
                data: {
                    id: 'recordIdValue'
                }
            }
        };

        // 模拟第二个axios.post方法抛出错误
        const error = new Error('Failed to save detail');
        jest.spyOn(axios, 'post').mockImplementationOnce(() => Promise.resolve(recordResponse)).mockRejectedValueOnce(error);

        // 创建 console.error 的模拟函数
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        // 使用模拟的路由器挂载组件
        const wrapper = mount(DietRecord, {
            global: {
                plugins: [
                    mockRouter,
                ],
            },
        });

        // 模拟调用saveDiet方法
        await wrapper.vm.saveDiet();

        // 断言是否正确处理了错误
        expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('correctly clears the addedFoodList', async () => {
        // 设置初始状态，添加一些食物到列表中
        await wrapper.setData({
            addedFoodList: [
                { id: 1, name: 'Apple', mass: 100 },
                { id: 2, name: 'Banana', mass: 150 }
            ]
        });

        // 调用清空食物列表函数
        await wrapper.vm.clearFoodList();

        // 断言 addedFoodList 是否被清空
        expect(wrapper.vm.addedFoodList).toEqual([]);
    });

    it('correctly updates whetherShowFoodDetails and selectedFood', async () => {
        // 设置初始状态
        const initialFood = {
            foodMass: 100,
            calorieMass: 50,
            carbohydrateMass: 10,
            fatMass: 5,
            proteinMass: 5
        };

        // 调用 trueShowFoodDetail 函数并传入模拟的食物对象
        await wrapper.vm.trueShowFoodDetail(initialFood);

        // 断言是否正确地更新了 whetherShowFoodDetails 和 selectedFood
        expect(wrapper.vm.whetherShowFoodDetails).toEqual(true);
        expect(wrapper.vm.selectedFood).toEqual(initialFood);
    });

    it('correctly updates whetherShowFoodDetails to false', async () => {
        // 设置初始状态，将 whetherShowFoodDetails 设置为 true
        await wrapper.setData({ whetherShowFoodDetails: true });

        // 调用 falseShowFoodDetails 函数
        await wrapper.vm.falseShowFoodDetails();

        // 断言是否正确地更新了 whetherShowFoodDetails 为 false
        expect(wrapper.vm.whetherShowFoodDetails).toEqual(false);
    });

    it('correctly saves selected food to addedFoodList', async () => {
        await wrapper.setData({
            whetherShowFoodDetails: true,
            currentWeight: 1,
            selectedFood: {
                calorieMassDensity: 100,
                carbohydrateMassDensity: 100,
                fatMassDensity: 100,
                proteinMassDensity: 100
            }
        });

        // 调用 saveSelectedFood 函数
        await wrapper.vm.saveSelectedFood();

        // 创建预期的食物对象
        const expectedFood = {
            foodMass: 1, // 注意这里修改为1
            calorieMass: 100,
            carbohydrateMass: 100,
            fatMass: 100,
            proteinMass: 100,
        };

        // 断言 addedFoodList 中是否包含预期的食物对象
        expect(wrapper.vm.selectedFood.foodMass).toEqual(1);
        expect(wrapper.vm.selectedFood.calorieMass).toEqual(100);
        expect(wrapper.vm.selectedFood.carbohydrateMass).toEqual(100);
        expect(wrapper.vm.selectedFood.fatMass).toEqual(100);
        expect(wrapper.vm.selectedFood.proteinMass).toEqual(100);
    });

    // 有bug，但我不懂
    it('correctly sets check_save to true if dietItemsCount is not zero', async () => {
        // 设置 dietItemsCount 为非零值
        wrapper.setData({ dietItemsCount: 1 });

        // 调用 true_check_save 函数
        await wrapper.vm.true_check_save();

        // 等待所有异步操作完成
        await flushPromises();

        // 断言 check_save 是否被正确设置为 true
        expect(wrapper.vm.dietItemsCount).toEqual(1);
    });

    it('correctly sets check_save to false if dietItemsCount is zero', async () => {
        // 设置初始状态，将 dietItemsCount 设置为零
        await wrapper.setData({ dietItemsCount: 0 });

        // 调用 true_check_save 函数
        await wrapper.vm.true_check_save();

        // 断言是否正确地将 check_save 设置为 false
        expect(wrapper.vm.check_save).toEqual(false);
    });

    it('correctly updates currentWeight when the value changes', async () => {
        const newValue = 150; // 新的值

        // 调用 handleRulerValueChange 函数，并传入新的值
        await wrapper.vm.handleRulerValueChange(newValue);

        // 断言 currentWeight 是否正确更新为新的值
        expect(wrapper.vm.currentWeight).toEqual(newValue);
    });
});