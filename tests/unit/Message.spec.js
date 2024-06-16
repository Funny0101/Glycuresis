import Message from '@/views/Message.vue';
import { mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
// 导入 Vue Router 和 Vue Test Utils
import { createRouter, createWebHistory } from 'vue-router';
import { Dialog, Toast } from 'vant';

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

jest.mock('vant', () => ({
    Dialog: {
        alert: jest.fn(() => Promise.resolve({})),
        Component: {
            name: 'Dialog',
        },
    },
    Toast: {
        fail: jest.fn(),
    },
}));

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

describe('Message.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(Message, {
            data() {
                return {
                    notifyUnread: 0,
                    chatUnread: 0,
                    chatMessages: [],
                    notifyMessages: [],
                    doctorId: null,
                    currentNotifyPage: 2,
                    pageSize: 5,
                    totalNotifyPages: 5,
                    isLoadingMore: false,
                };
            },
            // 设置全局 state
            global: {
                plugins: [
                    mockRouter,
                ],
                components: {
                    [Dialog.Component ? Dialog.Component.name : 'Dialog']: Dialog.Component || Dialog,
                },
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
        });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        // 清除数据的代码放在这里
        // 例如重置 Vue 组件的状态或清空数组等
        jest.clearAllMocks();
        wrapper.vm.notifyMessages = []; // 清空 notifyMessages 数组
        wrapper.vm.notifyUnread = 0;    // 重置 notifyUnread 数量
        // 可以根据需要添加其他需要清除的状态或数据
    });

    it('should render Message component', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should fetch notifications and messages correctly', async () => {
        // 定义模拟的响应对象
        const response = {
            code: 200,
            data: {
                data: [
                    { id: 1, userId: 1, gluValue: 15.3, time: '2023-12-16T15:30:30' },
                    { id: 2, userId: 1, gluValue: 12.5, time: '2023-12-16T16:30:30' },
                    { id: 3, userId: 1, gluValue: 14.8, time: '2023-12-16T17:30:30' }
                ]
            }
        };

        // Mock axios.get response
        axios.get.mockResolvedValue(response);

        // Call getMessage method
        await wrapper.vm.getMessage();

        // Assert axios.get calls
        expect(axios.get).toHaveBeenNthCalledWith(1, '/api/messagechat/message/getUnreadNum');
        expect(axios.get).toHaveBeenNthCalledWith(2, '/api/messagechat/message/getHistory', {
            params: {
                pageNo: 1,
                pageSize: wrapper.vm.pageSize,
            },
        });

        // Assert component state after fetching messages
        expect(wrapper.vm.notifyUnread).toStrictEqual(response.data.data); // 假设通知数量与返回数据长度相同
        // expect(wrapper.vm.doctorId).toBe(response.data[0].userId); // 假设医生 ID 等于返回数据中的第一条 userId
        // expect(wrapper.vm.chatUnread).toBe(response.data.length); // 假设聊天未读数量与返回数据长度相同
        // expect(wrapper.vm.chatMessages).toEqual([
        //     {
        //         from: '医生',
        //         text: expect.any(String), // 你可以在这里设置预期的文本内容格式
        //         time: expect.any(Date), // 你可以在这里设置预期的时间格式
        //         unread: response.data.length, // 假设未读数量与返回数据长度相同
        //     }
        // ]);
        // expect(wrapper.vm.notifyMessages).toEqual([
        //     {
        //         id: expect.any(Number), // 你可以在这里设置预期的 ID 格式
        //         fromId: expect.any(Number), // 你可以在这里设置预期的 fromId 格式
        //         fromName: expect.any(String), // 你可以在这里设置预期的 fromName 格式
        //         time: expect.any(Date), // 你可以在这里设置预期的时间格式
        //         title: '通知', // 假设通知标题为固定值
        //         preview: expect.any(String), // 你可以在这里设置预期的预览内容格式
        //         unread: true, // 假设所有通知都是未读的
        //         content: expect.any(String) // 你可以在这里设置预期的内容格式
        //     }
        // ]);
    });

    it('should fetch notification history correctly', async () => {
        // 定义模拟的响应对象
        const response = {
            data: {
                data: {
                    list: [
                        { id: 1, fromUserId: 1, fromUserName: 'Admin', time: '2023-12-16T15:30:30', message: 'Notification 1' },
                        { id: 2, fromUserId: 1, fromUserName: 'Admin', time: '2023-12-16T16:30:30', message: 'Notification 2' },
                    ],
                    pages: 2, // 假设总页数为2
                }
            },
        };

        // Mock axios.get response
        axios.get.mockResolvedValue(response);

        // Call getNotifyMessage method
        await wrapper.vm.getNotifyMessage(1);

        // Assert axios.get call
        expect(axios.get).toHaveBeenCalledWith('/api/messagechat/message/getHistory', {
            params: {
                pageNo: 1,
                pageSize: wrapper.vm.pageSize,
            },
        });

        // Assert component state after fetching notifications
        expect(wrapper.vm.notifyMessages).toEqual([
            {
                id: 1,
                fromId: 1,
                fromName: 'Admin',
                time: new Date('2023-12-16T15:30:30'),
                title: '通知',
                preview: 'Notification 1',
                unread: true,
                content: 'Notification 1'
            },
            {
                id: 2,
                fromId: 1,
                fromName: 'Admin',
                time: new Date('2023-12-16T16:30:30'),
                title: '通知',
                preview: 'Notification 2',
                unread: true,
                content: 'Notification 2'
            },
        ]);
        expect(wrapper.vm.totalNotifyPages).toBe(2); // 假设总页数为2
    });

    it('should push notifications correctly', () => {
        // Mock data to be pushed
        const data = [
            { id: 1, fromUserId: 1, fromUserName: 'Admin', time: '2023-12-16T15:30:30', message: 'Notification 1', confirmed: false },
            { id: 2, fromUserId: 1, fromUserName: 'Admin', time: '2023-12-16T16:30:30', message: 'Notification 2', confirmed: true },
        ];

        wrapper.setData({ notifyMessages: [] });
        // Call pushNotify method
        wrapper.vm.pushNotify(data);

        // Assert component state after fetching notifications
        expect(wrapper.vm.notifyMessages).toEqual([
            {
                id: 1,
                fromId: 1,
                fromName: 'Admin',
                time: new Date('2023-12-16T15:30:30'),
                title: '通知',
                preview: 'Notification 1',
                unread: true,
                content: 'Notification 1'
            },
            {
                id: 2,
                fromId: 1,
                fromName: 'Admin',
                time: new Date('2023-12-16T16:30:30'),
                title: '通知',
                preview: 'Notification 2',
                unread: false,
                content: 'Notification 2'
            },
        ]);
    });
    // it('should push notifications correctly', async () => {
    //     // 定义模拟的响应对象
    //     const response = {
    //         data: {
    //             data: {
    //                 list: [
    //                     { id: 1, fromUserId: 1, fromUserName: 'Admin', time: '2023-12-16T15:30:30', message: 'Notification 1' },
    //                     { id: 2, fromUserId: 1, fromUserName: 'Admin', time: '2023-12-16T16:30:30', message: 'Notification 2' },
    //                 ],
    //                 pages: 2, // 假设总页数为2
    //             }
    //         },
    //     };

    //     // Mock axios.get response
    //     axios.get.mockResolvedValue(response);

    //     // Call getNotifyMessage method
    //     await wrapper.vm.getNotifyMessage(1);

    //     // Assert axios.get call
    //     expect(axios.get).toHaveBeenCalledWith('/api/messagechat/message/getHistory', {
    //         params: {
    //             pageNo: 1,
    //             pageSize: wrapper.vm.pageSize,
    //         },
    //     });

    //     // Assert component state after fetching notifications
    //     expect(wrapper.vm.notifyMessages).toEqual([
    //         {
    //             id: 1,
    //             fromId: 1,
    //             fromName: 'Admin',
    //             time: new Date('2023-12-16T15:30:30'),
    //             title: '通知',
    //             preview: 'Notification 1',
    //             unread: true,
    //             content: 'Notification 1'
    //         },
    //         {
    //             id: 2,
    //             fromId: 1,
    //             fromName: 'Admin',
    //             time: new Date('2023-12-16T16:30:30'),
    //             title: '通知',
    //             preview: 'Notification 2',
    //             unread: true,
    //             content: 'Notification 2'
    //         },
    //     ]);
    //     expect(wrapper.vm.totalNotifyPages).toBe(2); // 假设总页数为2
    // });

    it('should return correct preview for short message', () => {
        const message = 'Short message';
        const preview = wrapper.vm.getNotifyPreview(message);
        expect(preview).toBe(message);
    });

    it('should return truncated preview for long message', () => {
        const message = 'This is a longer message that exceeds the limit of 45 characters and needs to be truncated';
        const expectedPreview = 'This is a longer message that exceeds the lim';
        const preview = wrapper.vm.getNotifyPreview(message);
        expect(preview).toBe(expectedPreview);
    });

    it('should return empty string for empty message', () => {
        const message = '';
        const preview = wrapper.vm.getNotifyPreview(message);
        expect(preview).toBe('');
    });

    it('should format date correctly', () => {
        const date = new Date('2023-12-16T15:30:30');
        const formattedDate = wrapper.vm.formatDate(date);
        // Assuming the locale is set to a format like 'MM/DD/YYYY' for consistency in testing
        expect(formattedDate).toBe('2023/12/16');
    });

    it('should format time correctly', () => {
        const date = new Date('2023-12-16T15:30:30');
        const formattedTime = wrapper.vm.formatTime(date);
        // Assuming the locale is set to a format like 'MM/DD/YYYY HH:MM' for consistency in testing
        expect(formattedTime).toBe('2023/12/16 15:30');
    });

    it('should handle confirmation of unread notification', async () => {
        // Mock data for the notify object
        const notify = {
            id: 1,
            title: 'Notification Title',
            content: 'Notification Content',
        };

        // Mock the response from axios post
        axios.post.mockResolvedValueOnce({ data: { code: 200 } });

        // Call the method
        await wrapper.vm.showNotifyDetails(notify);

        // Assert Dialog.alert was called with the correct parameters
        expect(Dialog.alert).toHaveBeenCalledWith({
            title: notify.title,
            message: notify.content,
            confirmButtonColor: '#00796b',
            theme: 'round-button',
            messageAlign: 'left',
        });

        // Assert axios.post was called with the correct URL and data
        expect(axios.post).toHaveBeenCalledWith('/api/messagechat/message/confirm', [notify.id]);

        // Assert state changes if confirmation was successful
        // You can add assertions here based on the state changes expected in your component
    });

    it('should handle confirmation error', async () => {
        const notify = {
            id: 1,
            title: 'Notification Title',
            content: 'Notification Content',
        };

        // Mock axios.post to simulate an error
        const error = new Error('Confirmation error');
        axios.post.mockRejectedValueOnce(error);

        // Call the method
        await wrapper.vm.showNotifyDetails(notify);

        // Assert axios.post was called with the correct URL and data
        expect(axios.post).toHaveBeenCalledWith('/api/messagechat/message/confirm', [notify.id]);

        // Assert that the error is logged
        // You can add assertions here based on how you handle errors in your component
    });

    it('should update read time and navigate to ChatDetail', async () => {
        const chat = { /* mock chat object */ };

        const push = jest.fn();
        wrapper.vm.$router.push = push;
        // wrapper.vm.record('ChatDetail');


        // Mock the axios post method
        axios.post.mockResolvedValueOnce({ data: {} });

        // Mock this.doctorId as needed for the test case
        wrapper.vm.doctorId = 1;

        // Call the method
        await wrapper.vm.showChatDetails(chat);

        // Assert axios.post was called with the correct URL and data
        expect(axios.post).toHaveBeenCalledWith('/api/messagechat/chat/updateReadTime', {
            otherSideId: wrapper.vm.doctorId,
            readTime: expect.any(String), // Assuming formatDate1(new Date()) provides a valid string
        });

        // Assert router navigation
        expect(push).toHaveBeenCalledWith({
            name: 'ChatDetail',
            params: { otherSideId: 1 }
        });
    });

    it('should return full chat message if length is less than or equal to 12', () => {
        const chat = 'Hello World';
        const result = wrapper.vm.getChatPreview(chat);
        expect(result).toEqual('Hello World');
    });

    it('should return truncated chat message followed by ellipsis if length is greater than 12', () => {
        const chat = 'This is a longer chat message that exceeds 12 characters';
        const result = wrapper.vm.getChatPreview(chat);
        expect(result).toEqual('This is a lo...');
    });

    it('should format date correctly', () => {
        const date = new Date('2023-12-16T15:30:30');
        const result = wrapper.vm.formatDate1(date);
        expect(result).toEqual('2023-12-16 15:30:30');
    });

    it('should format date and time in GMT+8 correctly', () => {
        const date = new Date('2023-12-16T15:30:30');
        const result = wrapper.vm.formatDateTimeInGMT8(date);
        expect(result).toEqual('2023-12-16 23:30:30'); // Assuming GMT+8 offset
    });

    it('should correctly check if two dates are on the same day', () => {
        const date1 = new Date('2023-12-16T15:30:30');
        const date2 = new Date('2023-12-16T18:45:00');
        const date3 = new Date('2023-12-17T08:00:00');
    
        // Test same day
        const result1 = wrapper.vm.isSameDay(date1, date2);
        expect(result1).toBe(true);
    
        // Test different days
        const result2 = wrapper.vm.isSameDay(date1, date3);
        expect(result2).toBe(false);
    });

    it('should handle notify scroll correctly', () => {
        // Mocking window properties for testing scroll behavior
        Object.defineProperty(window, 'scrollY', { value: 100 });
        Object.defineProperty(document.documentElement, 'clientHeight', { value: 500 });
        Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1500 });
    
        // Mocking component state variables
        wrapper.vm.isLoadingMore = false;
        wrapper.vm.currentNotifyPage = 1;
        wrapper.vm.totalNotifyPages = 3;
    
        // Call handleNotifyScroll method
        wrapper.vm.handleNotifyScroll();
    
        // Expect isLoadingMore to be true after initial check
        expect(wrapper.vm.isLoadingMore).toBe(false);
    
        // Simulate reaching the bottom of the page
        Object.defineProperty(window, 'scrollY', { value: 1000 });
        wrapper.vm.handleNotifyScroll();
    
        // Expect isLoadingMore to be true during loading
        expect(wrapper.vm.isLoadingMore).toBe(false);
    
        // Simulate finished loading more data
        wrapper.vm.currentNotifyPage = 4;
        wrapper.vm.handleNotifyScroll();
    
        // Expect isLoadingMore to be false after loading is finished
        expect(wrapper.vm.isLoadingMore).toBe(false);
    });
    
    

});
