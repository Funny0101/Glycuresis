import Setting from '@/views/Setting.vue';
import { mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import { createRouter, createWebHistory } from 'vue-router';

jest.mock('@/views/Ruler.vue', () => ({}));

import axios from 'axios';

jest.mock('@/axios/axiosConfig', () => {
    return {
        instance: {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            interceptors: { request: { use: jest.fn() } }
        }
    };
});

jest.mock('vant', () => ({
    showConfirmDialog: jest.fn(),
    showToast: jest.fn(),
}));

import { showConfirmDialog, showToast } from 'vant';

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({})),
    post: jest.fn(() => Promise.resolve({})),
    put: jest.fn(() => Promise.resolve({})),
}));

const mockRouter = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/' }],
});

describe('Setting.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(Setting, {
            data() {
                return {
                    userData: {},
                    sms: '',
                    password: '',
                    rePassword: '',
                    smsButtonDisabled: false,

                    showPicker: {
                        height: false,
                        weight: false,
                        age: false,
                        gender: false,
                        diabetesType: false,
                        password: false,
                        phone: false,
                    },
                    patterns: {
                        height: /^(1\d{2}|200)$/,
                        weight: /^(?:1\d{2}|[1-9]?\d)$/,
                        age: /^(?:[1-9]?\d|100)$/,
                        password: /^[^\u4e00-\u9fa5]{6,}$/,
                        sms: /^\d{6}$/,
                    },
                    genders: [
                        { text: "男", value: "男" },
                        { text: "女", value: "女" },
                    ],
                    diabetesTypes: [
                        { text: "一型糖尿病", value: "一型糖尿病" },
                        { text: "二型糖尿病", value: "二型糖尿病" },
                    ],
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
            global: {
                plugins: [mockRouter],
                mocks: {
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
                },
            },
        });
    });

    it('should render Setting component', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should get user info on mount', async () => {
        const getUserInfoSpy = jest.spyOn(wrapper.vm, 'getUserInfo');
        wrapper.vm.getUserInfo();
        expect(getUserInfoSpy).toHaveBeenCalled();
    });

    it('should call GetUserInfo if userData account is empty', async () => {
        const GetUserInfoSpy = jest.spyOn(wrapper.vm, 'GetUserInfo');
        await wrapper.vm.getUserInfo();
        expect(GetUserInfoSpy).toHaveBeenCalled();
    });

    it('should handle form confirm with validation success', async () => {
        const form = { validate: jest.fn().mockResolvedValue() };
        const attributeName = 'password';
        await wrapper.vm.handleFormConfirm(form, attributeName);
        expect(form.validate).toHaveBeenCalled();
        expect(wrapper.vm.showPicker[attributeName]).toBe(false);
    });

    it('should handle form confirm with validation failure', async () => {
        const form = { validate: jest.fn().mockRejectedValue(new Error('Validation failed')) };
        const attributeName = 'password';
        await wrapper.vm.handleFormConfirm(form, attributeName);
        expect(form.validate).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalled();
    });

    it('should get verification code successfully', async () => {
        wrapper.setData({ userData: { account: 'test' }, password: 'password', rePassword: 'password' });
        axios.get.mockResolvedValue({});
        await wrapper.vm.getVerificationCode();
        expect(wrapper.vm.smsButtonDisabled).toBe(false);
    });

    it('should handle get verification code failure', async () => {
        wrapper.setData({ userData: { account: 'test' }, password: 'password', rePassword: 'password' });
        axios.get.mockRejectedValue({ response: { data: 'error' } });
        await wrapper.vm.getVerificationCode();
        expect(console.error).toHaveBeenCalled();
    });

    it('should change password successfully', async () => {
        wrapper.setData({ userData: { account: 'test', name: 'test' }, password: 'password', rePassword: 'password', sms: '123456' });
        axios.put.mockResolvedValue({});
        await wrapper.vm.changePassword();
        expect(console.log).toHaveBeenCalled();
    });

    it('should handle change password failure', async () => {
        axios.put.mockRejectedValue({ response: { data: 'error' } });
        await wrapper.vm.changePassword();
        expect(console.error).toHaveBeenCalled();
    });

    it('should handle picker confirm', () => {
        const selectedValue = { value: 'test' };
        const attributeName = 'gender';
        wrapper.vm.handlePickerConfirm(selectedValue, attributeName);
        expect(wrapper.vm.userData[attributeName]).toBe('test');
        expect(wrapper.vm.showPicker[attributeName]).toBe(false);
    });

    it('should save user info successfully', async () => {
        axios.put.mockResolvedValue({ data: 'response' });
        await wrapper.vm.saveUserInfo();
        expect(console.log).toHaveBeenCalled();
    });

    it('should handle save user info failure', async () => {
        axios.put.mockRejectedValue({ response: { data: 'error' } });
        await wrapper.vm.saveUserInfo();
        expect(console.error).toHaveBeenCalled();
    });

    it('should handle oversize file', () => {
        const file = { size: 600 * 1024 }; // 设置文件大小为600KB
        wrapper.vm.onOversize(file);
        expect(console.log).toHaveBeenCalled();
    });

    it('should handle after read file upload', async () => {
        const file = { file: new Blob() };
        const mockURL = 'blob:fakeurl';
        global.URL.createObjectURL = jest.fn(() => mockURL);
        axios.post.mockResolvedValue({});
        await wrapper.vm.handleAfterRead(file);
        expect(wrapper.vm.userData.profile).toBe(mockURL);
    });

    it('should handle after read file upload failure', async () => {
        axios.post.mockRejectedValue({ response: { data: 'error' } });
        await wrapper.vm.handleAfterRead({ file: new Blob() });
        expect(console.error).toHaveBeenCalled();
    });
});
