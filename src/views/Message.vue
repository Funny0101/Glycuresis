<template>
<div>
    <van-nav-bar :title="titleText"
        fixed placeholder
        left-arrow
        left-text="返回"
        @click-left="()=>{this.$router.go(-1);}"
        style="--van-nav-bar-title-font-size: 18px;">
    </van-nav-bar>

    <van-dialog />

    <van-tabs 
        sticky offset-top="40px"
        swipeable animated
        color="green" line-height="2px" line-width="80px" 
        >
        <van-tab :title="notifyTitltText" name="notify">
            <div class="notify-container">
                <!-- <div v-if="notifyMessages.length === 0" class="empty-tip">没有通知消息</div> -->
                <div v-if="notifyMessages.length === 0" class="empty-tip">加载中...</div>
                <div v-else 
                    v-for="(notify, index) in notifyMessages" 
                    :key="notify.title" 
                    class="notify-item" 
                    @click="showNotifyDetails(notify)"
                    >
                    <!-- 只有当是第一条消息 或当前消息的日期与上一条消息不同的时候才显示时间 -->
                    <div v-if="index === 0 || (index > 0 && !isSameDay(notify.time, notifyMessages[index-1].time))" class="notify-time">
                        <span class="green-circle"></span>
                        {{ formatDate(notify.time) }}
                    </div>
                    <div class="notify-content">
                        <span v-if="notify.unread" class="unread-badge">未读</span>
                        <div class="title">{{ notify.title }}</div>
                        <div class="preview">{{ notify.preview }}</div>
                        <div class="details-btn">查看详情</div>
                        <van-icon name="arrow" class="notify-arrow"/>
                    </div>
                </div>
            </div>
        </van-tab>

        <van-tab :title="chatTitleText" name="chat">
            <div class="chat-container">
                <!-- 消息列表 -->
                <div v-if="chatMessages.length === 0" class="empty-tip">没有聊天消息</div>
                <div v-else 
                    v-for="message in chatMessages" 
                    :key="message.from" 
                    class="message-item"
                    @click="showChatDetails(message)"
                    >
                    <div class="avatar-wrapper" v-if="message.unread > 0">
                        <img class="avatar" :src="getAvatarSrc(message.from)" alt="Avatar">
                        <!-- 未读消息数 -->
                        <span class="unread-count">{{ message.unread }}</span>
                    </div>
                    <div v-else class="avatar-wrapper">
                        <img class="avatar" :src="getAvatarSrc(message.from)" alt="Avatar">
                    </div>
                    <div class="message-content">
                        <div class="from">{{ message.from }}</div>
                        <div class="text">{{ message.text }}</div>
                    </div>
                    <div class="time">{{ formatTime(message.time) }}</div>
                </div>
            </div>
        </van-tab>

      </van-tabs>

</div>
</template>

<script>
import { Dialog, Toast } from 'vant';
import axios from "axios";
import { get, put, post, del } from "../axios/axiosConfig.js";

export default {
    components: {
        [Dialog.Component.name]: Dialog.Component,
    },

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
            isLoadingMore: false, // 控制是否正在加载更多数据
        }
    },

    mounted() {
        // this.getDoctor();
        this.getMessage();

        // 添加滚动事件监听器
        window.addEventListener('scroll', this.handleNotifyScroll);

    },

    beforeDestroy() {
        // 移除滚动事件监听器
        window.removeEventListener('scroll', this.handleNotifyScroll);
    },

    computed: {
        // 计算属性, 基于 未读消息数量 更新 titleText
        titleText() {
            return this.notifyUnread + this.chatUnread === 0 ? '消息中心' : `消息中心 (${this.notifyUnread + this.chatUnread})`;
        },
        notifyTitltText() {
            return this.notifyUnread === 0 ? '通知' : `通知 (${this.notifyUnread})`;
        },
        chatTitleText() {
            return this.chatUnread === 0 ? '私信' : `私信 (${this.chatUnread})`;
        }
    },

    methods: {

        async getMessage() {

            // 未读通知数量
            axios.get('/api/messagechat/message/getUnreadNum')
                .then(res => {
                    this.notifyUnread = res.data.data;
                })
                .catch(err => {
                    console.log(err);
                });


            this.getNotifyMessage(1);
            
            // 获取医生ID
            try{
                const res = await get('/user/user/get');
                if (res.code == 200) {
                    this.doctorId = res.data.doctor;
                }
            } 
            catch(err) {
                console.log('获取医生信息失败', err)
            }

            // 获取私聊信息
            if (this.doctorId === '' || this.doctorId === null) {
                this.chatUnread = 0;
                this.chatMessages = []
            }
            else {
                try {
                    // 未读聊天数量
                    await axios.get(`/api/messagechat/chat/getUnreadNum/${this.doctorId}`)
                        .then(res => {
                            console.log('unread chat:',res)
                            this.chatUnread = res.data.data;
                        })
                        .catch(err => {
                            console.log(err);
                        });

                    // 获取与医生的最新聊天
                    axios.get(`/api/messagechat/chat/getLatest/${this.doctorId}`)
                        .then(res => {
                            // 最新的一条
                            let last = res.data.data[res.data.data.length - 1];
                            console.log('latest chat', last);
                            this.chatMessages = [{
                                from: '医生',
                                text: this.getChatPreview(last.message),
                                time: new Date(last.time),
                                unread: this.chatUnread, 
                            }];
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
                catch(err) {
                    console.log('获取私聊失败', err)
                }
            }

            // this.simulateNotifyData();
            // this.simulateChatData();
        },

        getNotifyMessage(pageNo, pageSize=this.pageSize) {
            const query = {
                pageNo: pageNo, 
                pageSize: pageSize,
            };

            axios.get('/api/messagechat/message/getHistory', {params: query})
                .then(res => {
                    console.log('message his', res.data.data);
                    this.pushNotify(res.data.data.list);
                    this.totalNotifyPages = res.data.data.pages;
                })
                .catch(err => {
                    console.log(err);
                });
        },

        pushNotify(data) {
            data.forEach(ele => {
                let item = {
                    id: ele.id,
                    fromId: ele.fromUserId,
                    fromName: ele.fromUserName,
                    time: new Date(ele.time),
                    title: this.getNotifyTitle(ele.message),
                    preview: this.getNotifyPreview(ele.message),
                    unread: !ele.confirmed,
                    content: ele.message
                }
                this.notifyMessages.push(item);
            });
            // console.log(this.notifyMessages)
        },

        getNotifyTitle(message) {
            return '通知';
        },

        getNotifyPreview(message) {
            if (message.length <= 45) {
                return message;
            } 
            else {
                return message.substring(0, 45);
            }
        },

        // 模拟向后端请求数据
        simulateNotifyData() {
            this.notifyMessages = [
                {
                    id: 1,
                    fromId: 1,
                    fromName: 'Admin',
                    time: new Date(),
                    title: '血糖过低提醒',
                    preview: '您的血糖过低, 请及时补充糖分' ,
                    unread: true,
                    content: '您的血糖过低, 请及时补充zsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbd'
                },
                {
                    id: 2,
                    fromId: 1,
                    fromName: 'Admin',
                    time: new Date(),
                    title: '血糖偏低提醒',
                    preview: '您的血糖偏低, 请及时补充糖分' ,
                    unread: true,
                    content: '您的血糖过低, 请及时补充zsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbd'
                },
                {
                    id: 3,
                    fromId: 1,
                    fromName: 'Admin',
                    time: new Date(2024, 5, 1),
                    title: '儿童节快乐',
                    preview: '糖小智祝您儿童节快乐！！！',
                    unread: false,
                    content: '糖小智祝您儿童节快乐！！！'
                },
                {
                    id: 4,
                    fromId: 1,
                    fromName: 'Admin',
                    time: new Date(2024, 0, 6),
                    title: '5月份月度统计',
                    preview: '本月您共摄入糖分114514mol, 脂肪1919810mol, 点击查看详情……',
                    unread: false,
                    content: '本月您共摄入糖分114514mol, 脂肪1919810mol, 非常的新鲜美味'
                },
                {
                    id: 5,
                    fromId: 1,
                    fromName: 'Admin',
                    time: new Date(2024, 0, 6),
                    title: '血糖过低提醒',
                    preview: '您的血糖过低, 请及时补充糖分' ,
                    unread: true,
                    content: '您的血糖过低, 请及时补充zsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbd'
                },
                {
                    id: 6,
                    fromId: 1,
                    fromName: 'Admin',
                    time: new Date(2023, 2, 2),
                    title: '欢迎使用糖小智',
                    preview: '尊敬的患者, 欢迎使用糖小智',
                    unread: false,
                    content: '尊敬的患者, 欢迎使用糖小智, 在这里您可以……'
                }
            ]
        },

        // 模拟向后端请求数据
        simulateChatData() {
            this.chatMessages = [
                {
                    from: 'Doctor101',
                    text: '记得吃💊',
                    time: new Date(),
                    unread: 0,
                },
                // {   
                //     from: 'System',
                //     text: '欢迎使用聊天功能！',
                //     time: new Date(2023, 2, 2, 12),
                //     unread: 1,
                // },
                // {
                //     from: 'AprilFool',
                //     text: 'I Luv U',
                //     time: new Date(2024, 3, 1),
                //     unread: 22,
                // },
                // {
                //     from: 'hacker',
                //     text: 'Oops!',
                //     time: new Date(2023, 2, 2, 12),
                //     unread: 0
                // },
            ]
        },

        // 格式化日期的方法, 精确到日
        formatDate(date) {
            const d = new Date(date);
            return d.toLocaleDateString();
        },

        // 格式化日期的方法, 精确到分
        formatTime(date) {
            const d = new Date(date);
            return d.toLocaleDateString() + ' ' + d.toLocaleTimeString().slice(0, -3);
        },

        // 将"yyyy-mm-dd hh:mm:ss"的String转换为Date
        formTimeFromStr(string) {

        },

        // 根据from字段的值获取头像图片路径
        getAvatarSrc(from) {
            if (from === 'System') {
                return require('@/assets/bell.png');
            } else if (from.startsWith('Doctor') || from.startsWith('医生')) {
                return require('@/assets/setting/doctor.png');
            } else {
                return require('@/assets/blankuser.png');
            }
        },

        showNotifyDetails(notify) {
            // console.log("notify detail", notify)
            Dialog.alert({
                title: notify.title,
                message: notify.content,
                confirmButtonColor: '#00796b',
                theme: 'round-button',
                messageAlign: 'left',
            }).then(() => {
                // on close
                const idList = [notify.id];
                axios.post('/api/messagechat/message/confirm', idList)
                    .then(res => {
                        console.log('confirm:', res.data);
                        if (res.data.code == 200) {
                            const msg = this.notifyMessages.find(item => item.id === notify.id);
                            if (msg && msg.unread == true) {
                                msg.unread = false;
                                this.notifyUnread -= 1;
                            }
                        }
                    })
                    .catch(error => {
                        console.error('confirm error:', error);
                    });
            });
        },

        showChatDetails(chat) {
            // console.log("chat detail", chat)
            const readTimeDTO = {
                otherSideId: this.doctorId, 
                readTime: this.formatDate1(new Date()),
            };
            axios.post('/api/messagechat/chat/updateReadTime', readTimeDTO)
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log('check chat error', err);
                });

            this.$router.push({ 
                name: 'ChatDetail', 
                params: { otherSideId: 1 } 
            });
        },

        getChatPreview(chat) {
            if (chat.length > 12) {
                return chat.slice(0, 12) + '...';
            }
            else {
                return chat;
            }
        },

        formatDate1(date) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        },

        formatDateTimeInGMT8(date) {
            const offsetHours = 8;
            const utcDate = new Date(date.getTime() + offsetHours * 60 * 60 * 1000);
            return this.formatDate1(utcDate);
        },

        // 检查两个日期是否在同一天
        isSameDay(date1, date2) {
            const d1 = new Date(date1);
            const d2 = new Date(date2);
            return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
        },

        handleNotifyScroll() {
            // 如果已经在加载更多数据，则直接返回，防止在快速滚动时多次触发
            if (this.isLoadingMore) return;

            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            let clientHeight = document.documentElement.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight;
            let bottomOfWindow = scrollTop + clientHeight >= scrollHeight-4

            // 检查是否滚动到底部
            if (scrollTop != 0 && bottomOfWindow) {
                this.isLoadingMore = true;
                console.log('load more',this.currentNotifyPage)
                // 这里可以添加一些逻辑来防止在快速滚动时多次触发
                if (this.currentNotifyPage <= this.totalNotifyPages) {
                    this.getNotifyMessage(this.currentNotifyPage);
                    this.currentNotifyPage += 1;
                    this.isLoadingMore = false;
                }
                else {
                    Toast.fail('没有更多了');
                    this.isLoadingMore = false;
                }
            }
        },

    },

}


</script>

<style scoped>
.chat-container {
    padding: 10px;
}

.message-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 8px;
    background-color: #faf8f8;
}

.message-item:hover {
    cursor: pointer;
}

.avatar {
    width: 44px;
    height: 44px;
    border-radius: 22px;
    margin-right: 10px;
    border: 1px solid #cccccc;
}

.avatar-wrapper {
    position: relative;
}

.unread-count {
    position: absolute;
    top: -5px; /* 根据需要调整位置 */
    right: 3px; /* 根据需要调整位置 */
    background-color: red;
    color: white;
    font-size: 10px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    box-sizing: border-box;
}

.message-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.from {
    font-size: 16px;
    font-weight: bold;
}

.text {
    font-size: 14px;
    color: #666;
}

.time {
    font-size: 12px;
    color: #999;
    margin-left: auto;
}

.notify-container {
    padding: 20px;
}

.notify-item {
    margin-bottom: 10px;
    /* border-bottom: 1px solid #eee; */
    padding-bottom: 10px;
}

.notify-time {
    font-size: 18px;
    color: #999;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
}

.notify-content {
    background-color: #ffffff;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 0 2px rgb(81, 79, 79);
    height: 140px;
    display: flex;
    flex-direction: column;
    position: relative;
    margin-left: 10px;
    margin-right: 10px;
    /* 确保 notify-content 有相对定位, 以便伪元素可以绝对定位到它 */
}

.notify-content::after {
    content: '';
    position: absolute;
    bottom: -2;
    right: -2;
    width: 100%; /* 伪元素宽度 */
    height: 100%; /* 伪元素高度 */
    background-image: linear-gradient(to bottom right,
                                      #e8f5e9, /* 浅绿 */
                                      #c8e6c9, /* 中绿 */
                                      #00796b); /* 深绿 */
    z-index: -1; /* 确保伪元素在 notify-content 后面 */
    border-radius: 8px; /* 与 notify-content 的圆角保持一致 */
}

.title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
}

.preview {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
}

.details-btn {
    font-size: 14px;
    color: #898989;
    margin-top: auto; /* 推至底部 */
    border-top: 1px solid #eee; /* 浅色分割线 */
    padding-top: 10px; /* 确保分割线与内容有足够的空间 */
}

.empty-tip {
    text-align: center;
    color: #999;
    padding: 20px;
    font-size: 14px;
}

.notify-arrow {
    position: absolute; /* 绝对定位相对于.notify-content */
    right: 10px; 
    top: 82%; /* 箭头图标垂直居中 */
    font-size: 16px; 
    color: #898989; 
}

.green-circle {
    display: inline-block;
    width: 12px; /* 圆环大小 */
    height: 12px;
    background-color: #fff; /* 圆环背景色 */
    border: 3px solid #4CAF50; /* 圆环边框颜色 */
    border-radius: 50%; 
    margin-right: 8px; /* 与时间文本的间隔 */
    text-align: center;
    font-weight: bold;
    vertical-align: middle;
    color: #4CAF50; /* 圆环内字符的颜色 */
}

.unread-badge {
    position: absolute;
    top: 10px; 
    right: 15px; 
    background-color: rgb(14, 165, 62);
    color: white;
    font-size: 12px;
    padding: 2px 5px;
    border-radius: 10px;
}

</style>