import { mount } from '@vue/test-utils';
import LogIn from '@/views/LogIn.vue';
import { get, post } from '@/axios/axiosConfig';
import { ElMessage } from 'element-plus';
import flushPromises from 'flush-promises';

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

describe('LogIn.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(LogIn, {
            data() {
                return {
                    userData: {
                        name: '',
                        account: '',

                        gender: '',
                        age: 0,
                        height: 0,
                        weight: 0,
                        diabetesType: '',
                    },
                    loginData: {
                        account: '',
                        password: '',
                    },
                    registerData: {
                        name: '',
                        account: '',
                        code: '',
                        password: '',
                    },

                    //控制GetStarted按钮
                    showGetStarted: true,
                    //控制Login按钮
                    showLoginButton: false,
                    //控制Register按钮
                    showRegisterButton: false,
                };
            },
            global: {
                mocks: {
                    $router: {
                        push: jest.fn(),
                    },
                    $store: {
                        commit: jest.fn(),
                    },
                    $message: {
                        error: jest.fn(),
                        success: jest.fn(),
                    },
                },
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render LogIn component', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should handle ClickStart', () => {
        wrapper.vm.ClickStart();
        expect(wrapper.vm.showGetStarted).toBe(false);
        expect(wrapper.vm.showLoginButton).toBe(true);
    });

    it('should handle ClickRegister', () => {
        wrapper.vm.ClickRegister();
        expect(wrapper.vm.showLoginButton).toBe(false);
        expect(wrapper.vm.showRegisterButton).toBe(true);
    });

    it('should handle ClickLogin', () => {
        wrapper.vm.ClickLogin();
        expect(wrapper.vm.showLoginButton).toBe(true);
        expect(wrapper.vm.showRegisterButton).toBe(false);
    });

    it('should handle login with empty account', async () => {
        wrapper.setData({ loginData: { account: '', password: 'password' } });
        await wrapper.vm.login();
        expect(ElMessage.error).toHaveBeenCalledWith('账号不能为空!');
    });

    it('should handle login with empty password', async () => {
        wrapper.setData({ loginData: { account: 'account', password: '' } });
        await wrapper.vm.login();
        expect(ElMessage.error).toHaveBeenCalledWith('密码不能为空!');
    });

    it('should handle login successfully', async () => {
        wrapper.setData({ loginData: { account: 'account', password: 'password' } });
        post.mockResolvedValue({ code: 200, message: '成功', data: {} });
        const getUserInformationSpy = jest.spyOn(wrapper.vm, 'GetUserInformation');
        await wrapper.vm.login();
        await flushPromises();
        expect(post).toHaveBeenCalledWith('/user/user/login', { account: 'account', password: 'password' });
        expect(getUserInformationSpy).toHaveBeenCalled();
        expect(wrapper.vm.$message.success).toHaveBeenCalledWith('成功');
    });

    it('should handle login failure', async () => {
        wrapper.setData({ loginData: { account: 'account', password: 'password' } });
        post.mockRejectedValue({ response: { data: 'error' } });
        await wrapper.vm.login();
        await flushPromises();
        expect(post).toHaveBeenCalledWith('/user/user/login', { account: 'account', password: 'password' });
        expect(wrapper.vm.$message.error).toHaveBeenCalledWith('登录失败', { response: { data: 'error' } });
    });

    it('should handle register with empty name', async () => {
        wrapper.setData({ registerData: { name: '', account: 'account', code: '123456', password: 'password' } });
        await wrapper.vm.register();
        expect(ElMessage.error).toHaveBeenCalledWith('昵称不能为空!');
    });

    it('should handle register with empty account', async () => {
        wrapper.setData({ registerData: { name: 'name', account: '', code: '123456', password: 'password' } });
        await wrapper.vm.register();
        const error = new Error('注册失败',{response: { data: 'error' }} );
        expect(wrapper.vm.$message.error).toHaveBeenCalled();
    });

    it('should handle register with empty code', async () => {
        wrapper.setData({ registerData: { name: 'name', account: 'account', code: '', password: 'password' } });
        await wrapper.vm.register();
        expect(ElMessage.error).toHaveBeenCalledWith('请填写验证码!');
    });

    it('should handle register with empty password', async () => {
        wrapper.setData({ registerData: { name: 'name', account: 'account', code: '123456', password: '' } });
        await wrapper.vm.register();
        expect(ElMessage.error).toHaveBeenCalledWith('密码不能为空!');
    });

    it('should handle register successfully', async () => {
        wrapper.setData({ registerData: { name: 'name', account: 'account', code: '123456', password: 'password' } });
        post.mockResolvedValue({ data: {} });
        await wrapper.vm.register();
        await flushPromises();
        expect(post).toHaveBeenCalledWith('/user/user/register', { name: 'name', account: 'account', password: 'password', code: '123456' });
        expect(wrapper.vm.$message.success).toHaveBeenCalledWith('注册成功');
        expect(wrapper.vm.showLoginButton).toBe(true);
        expect(wrapper.vm.showRegisterButton).toBe(false);
    });

    it('should handle register failure', async () => {
        wrapper.setData({ registerData: { name: 'name', account: 'account', code: '123456', password: 'password' } });
        post.mockRejectedValue({ response: { data: 'error' } });
        await wrapper.vm.register();
        await flushPromises();
        expect(post).toHaveBeenCalledWith('/user/user/register', { name: 'name', account: 'account', password: 'password', code: '123456' });
        expect(wrapper.vm.$message.error).toHaveBeenCalledWith('注册失败', { response: { data: 'error' } });
    });

    it('should handle GetUserInformation successfully', async () => {
        get.mockResolvedValueOnce({ data: { profile: 'profile_url' } });
        get.mockResolvedValueOnce({ data: { gender: 'male', age: 30, height: 180, weight: 70, diabetesType: 'type1' } });
        await wrapper.vm.GetUserInformation();
        await flushPromises();
        expect(get).toHaveBeenCalledTimes(2);
        expect(wrapper.vm.userData.profile).toBe('profile_url');
        expect(wrapper.vm.userData.gender).toBe('male');
        expect(wrapper.vm.userData.age).toBe(30);
        expect(wrapper.vm.userData.height).toBe(180);
        expect(wrapper.vm.userData.weight).toBe(70);
        expect(wrapper.vm.userData.diabetesType).toBe('type1');
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith({ name: 'home' });
        expect(wrapper.vm.$store.commit).toHaveBeenCalledWith('setUserData', wrapper.vm.userData);
    });

    it('should handle GetUserInformation failure', async () => {
        get.mockRejectedValueOnce({ response: { data: 'error' } });
        await wrapper.vm.GetUserInformation();
        await flushPromises();
        expect(get).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith('Error gettinging data in login:', { response: { data: 'error' } });
    });

    it('should handle getVerificationCode with empty account', async () => {
        wrapper.setData({ registerData: { account: '' } });
        await wrapper.vm.getVerificationCode();
        expect(wrapper.vm.$message.error).toHaveBeenCalledWith('账号不能为空！');
    });

    it('should handle getVerificationCode successfully', async () => {
        wrapper.setData({ registerData: { account: 'account' } });
        get.mockResolvedValue({ data: {} });
        await wrapper.vm.getVerificationCode();
        await flushPromises();
        expect(get).toHaveBeenCalledWith('/user/user/sendCode/account');
        expect(ElMessage.success).toHaveBeenCalledWith('已发送验证码');
    });

    it('should handle getVerificationCode failure', async () => {
        wrapper.setData({ registerData: { account: 'account' } });
        get.mockRejectedValue({ response: { data: 'error' } });
        await wrapper.vm.getVerificationCode();
        await flushPromises();
        expect(get).toHaveBeenCalledWith('/user/user/sendCode/account');
        expect(console.error).toHaveBeenCalledWith('获取验证码失败', { response: { data: 'error' } });
    });
});
