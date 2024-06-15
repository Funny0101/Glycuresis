import { mount } from '@vue/test-utils';
import Search from '@/views/Search.vue';
import { get, post } from '@/axios/axiosConfig';
import { ElMessage } from 'element-plus';
import flushPromises from 'flush-promises';
import {Tabs,Tab} from 'vant';

jest.mock('@/axios/axiosConfig', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

jest.mock('element-plus', () => ({
    ElMessage: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({})), // 使用Promise.resolve创建一个resolved状态的Promise对象
    post: jest.fn(() => Promise.resolve({})), // 同样使用Promise.resolve创建一个resolved状态的Promise对象
    // 可以根据需要模拟其他方法并返回Promise对象
}));


describe('Search.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(Search, {
            data() {
                return {
                    iconAreaSize: '20px',
                    iconSize: '30px',

                    recipe: {
                        breakfast: [],
                        lunch: [],
                        dinner: [],
                        salt: '',
                        energy: '',
                        protein: '',
                        protein_rate: '',
                        carbon: '',
                        carbon_rate: '',
                        fat: '',
                        fat_rate: '',
                    },

                    recipeData: [],

                    value: '',
                    items: [
                        { title: '东北地区食谱', iconName: 'Jiaozi.png', area: '东北' },
                        { title: '西北地区食谱', iconName: 'Noodles.png', area: '西北' },
                        { title: '华北地区食谱', iconName: 'Kaoya.png', area: '华北' },
                        { title: '华东地区食谱', iconName: 'Zongzi.png', area: '华东' },
                        { title: '华中地区食谱', iconName: 'Baozi.png', area: '华中' },
                        { title: '西南地区食谱', iconName: 'Yuanyang.png', area: '西南' },
                        { title: '华南地区食谱', iconName: 'Tofu.png', area: '华南' },
                        // ... 
                    ],
                    activeTabSeason: 0,
                    activeTabNumber: 0,
                    showSelectArea: true,
                    selectArea: null,
                    showRecipe: false,
                    seasons: [
                        { name: '春季', index: 0 },
                        { name: '夏季', index: 1 },
                        { name: '秋季', index: 2 },
                        { name: '冬季', index: 3 },
                    ],
                    numbers: [
                        { name: '食谱1', index: 0, number: 1 },
                        { name: '食谱2', index: 1, number: 2 },
                        { name: '食谱3', index: 2, number: 3 },

                    ],
                    isLoading: false,
                    loadingText: '加载中...', // 可根据需要自定义加载中文本
                };
            },
            global: {
                components: {
                    [Tabs.name]: Tabs,
                    [Tab.name]: Tab,
                },
            },
        });
        // Mock console.error
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render Search component', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should handle onChangeTabSeason', async () => {
        const updateRecipeSpy = jest.spyOn(wrapper.vm, 'updateRecipe');
        wrapper.vm.onChangeTabSeason(1);
        await flushPromises();
        expect(wrapper.vm.activeTabSeason).toBe(1);
        expect(updateRecipeSpy).toHaveBeenCalled();
        updateRecipeSpy.mockRestore();
    });

    it('should handle onChangeTabNumber', async () => {
        const updateRecipeSpy = jest.spyOn(wrapper.vm, 'updateRecipe');
        wrapper.vm.onChangeTabNumber(1);
        await flushPromises();
        expect(wrapper.vm.activeTabNumber).toBe(1);
        expect(updateRecipeSpy).toHaveBeenCalled();
        updateRecipeSpy.mockRestore();
    });

    it('should handle showArea', async () => {
        const updateRecipeSpy = jest.spyOn(wrapper.vm, 'updateRecipe');
        wrapper.vm.showArea('东北');
        await flushPromises();
        expect(wrapper.vm.showSelectArea).toBe(false);
        expect(wrapper.vm.showRecipe).toBe(true);
        expect(wrapper.vm.selectArea).toBe('东北');
        expect(updateRecipeSpy).toHaveBeenCalled();
        updateRecipeSpy.mockRestore();
    });

    it('should handle falseShowRecipe', () => {
        wrapper.vm.falseShowRecipe();
        expect(wrapper.vm.showSelectArea).toBe(true);
        expect(wrapper.vm.showRecipe).toBe(false);
        expect(wrapper.vm.selectArea).toBe(null);
    });

    it('should handle updateRecipe successfully', async () => {
        const response = {
            data: {
                foods: [
                    { type: '早餐', note: '食物1' },
                    { type: '中餐', note: '食物2' },
                    { type: '加餐', note: '食物3' },
                    { type: '晚餐', note: '食物4' },
                ],
                energy: '2000kcal',
                carbohydrateMass: '300g',
                carbohydrateEnergyRatio: '60%',
                fatMass: '50g',
                fatEnergyRatio: '20%',
                proteinMass: '100g',
                proteinEnergyRatio: '20%',
                oilSalt: '10g',
            },
        };

        get.mockResolvedValue(response);

        await wrapper.vm.updateRecipe();
        await flushPromises();


        expect(wrapper.vm.recipe.breakfast).toEqual(['食物1']);
        expect(wrapper.vm.recipe.lunch).toEqual(['食物2', '食物3']);
        expect(wrapper.vm.recipe.dinner).toEqual(['食物4']);
        expect(wrapper.vm.recipe.energy).toBe('2000kcal');
        expect(wrapper.vm.recipe.carbon).toBe('300g');
        expect(wrapper.vm.recipe.carbon_rate).toBe('60%');
        expect(wrapper.vm.recipe.fat).toBe('50g');
        expect(wrapper.vm.recipe.fat_rate).toBe('20%');
        expect(wrapper.vm.recipe.protein).toBe('100g');
        expect(wrapper.vm.recipe.protein_rate).toBe('20%');
        expect(wrapper.vm.recipe.salt).toBe('10g');
        expect(wrapper.vm.recipeData).toEqual([
            { name: '碳水化合物', content: '300g', energyRatio: '60%' },
            { name: '蛋白质', content: '100g', energyRatio: '20%' },
            { name: '脂肪', content: '50g', energyRatio: '20%' },
        ]);
        expect(wrapper.vm.isLoading).toBe(false);
    });

    it('should handle updateRecipe failure', async () => {
        const error = new Error('error');
        get.mockRejectedValue(error);

        await wrapper.vm.updateRecipe();
        await flushPromises();

        expect(wrapper.vm.isLoading).toBe(false);
        expect(console.error).toHaveBeenCalled();
    });
});
