<template>
    <div class="chat-container">
        <van-nav-bar title="医生" 
            fixed placeholder 
            left-arrow left-text="返回" 
            @click-left="goBack" 
            style="--van-nav-bar-title-font-size: 18px;" 
        />
        <!-- 聊天内容区域 -->
        <div class="chat-content" ref="messageList">
            <!-- 消息列表 -->
            <div v-for="(msg, index) in messages" :key="index" class="message-item" :class="{ 'my-message': msg.isMine }">
                <!-- 只有当是第一条消息 或当前消息的日期与上一条消息不同的时候才显示时间 -->
                <div v-if="index === 0 || (index > 0 && !isSameDay(msg.time, messages[index-1].time))" class="chat-date">
                    {{ formatDate(msg.time) }}
                </div>

                <div class="avatar-wrapper" :class="{ 'my-avatar': msg.isMine }">
                    <img class="avatar" :src="msg.isMine ? myAvatar : docAvatar" alt="Avatar" />
                </div>
                <div class="message-box">
                    <div class="message-content">{{ msg.text }}</div>
                    <span class="message-time">{{ formatTime(msg.time) }}</span>
                </div>
            </div>
        </div>
        <!-- 输入框和发送按钮 -->
        <div class="chat-input">
            <el-input 
                type="textarea" 
                v-model="inputMessage" 
                :autosize="{ minRows: 1, maxRows: 2 }"
                placeholder="输入消息内容" 
                style="width: 78%; height:100%; margin-right:10px;"
            />
            <el-button 
                @click="sendMessage" 
                @keyup.enter="sendMessage"
                type="success" 
                size="large"
                style="width: 20%; height:100%; ;"
            >发送</el-button>
        </div>

        <!-- <div class="chat-input" @click="adjustInputHeight" @keyup.enter="sendMessage">
            <input type="text" v-model="inputMessage" placeholder="输入消息内容" />
            <button @click="sendMessage">发送</button>
        </div> -->
    </div>
</template>
    
<script>
    import axios from 'axios';
    import { format } from 'echarts';
    import Cookies from 'js-cookie';

    export default {
        data() {
            return {
                // 假设从路由参数中获取
                otherSideId: this.$route.params.otherSideId,
                messages: [],
                inputMessage: '', // 用户输入的消息

                docAvatar: require('@/assets/setting/doctor.png'),
                myAvatar: require('@/assets/blankuser.png'),

                // satoken
                satoken: Cookies.get('satoken'),
                // websocket
                wspath: 'ws://212.64.29.100:8023/websocket/ws/chat/',
                ws: null,
            };
        },

        mounted() {
            this.initWs();
            this.getAvatar();
            this.getMessages();
        },

        beforeUpdate() {
            this.scrollToBottom();
        },

        unmounted() {
            // 移除websocket
            this.ws.close()
        },

        methods: {
            goBack() {
                this.$router.go(-1);
            },
            getAvatar() {
                axios.get('/api/user/user/get')
                    .then(res => {
                        const profile = res.data.data.profile;
                        if (profile) {
                            this.myAvatar = profile;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },

            initWs() {
                this.ws = new WebSocket(this.wspath + this.satoken);

                //连接成功建立的回调方法
                this.ws.onopen = () => {
                    console.log("WebSocket for chat连接成功");
                }

                //接收到消息的回调方法
                this.ws.onmessage = (event) => {
                    const data = event.data; //event.data中是另一端发送过来的内容
                    this.receiveMessages(data)
                }

                //连接发生错误的回调方法
                this.ws.onerror = () => {
                    console.log("WebSocket for chat error");
                };

                //连接关闭的回调方法
                this.ws.onclose = (e) => {
                    console.log("WebSocket for chat close", e.code, e.reason);
                }
            },

            receiveMessages(data) {
                console.log(data)
                //将data转换为json对象
                const jsonData = JSON.parse(data);
                console.log(jsonData);

                // console.log(jsonData.fromUserId, this.otherSideId)
                // if (jsonData.fromUserId == this.otherSideId) {
                    let item = {
                        text: jsonData.message,
                        isMine: jsonData.fromUserRole == 'PATIENT',
                        time: new Date(jsonData.time.replace('T', ' '))
                    };
                    console.log(item);
                    console.log(this.messages);
                    this.messages.push(item);
                    this.scrollToBottom();
                // }

                const readTimeDTO = {
                    otherSideId: jsonData.fromUserId, 
                    readTime: this.formatDateTime(new Date()),
                };
                axios.post('/api/messagechat/chat/updateReadTime', readTimeDTO)
                    .then(res => {
                        console.log(res);
                    })
                    .catch(err => {
                        console.log('check chat error', err);
                    });
            },

            getMessages() {

                axios.get(`/api/messagechat/chat/getLatest/${this.otherSideId}`)
                    .then(res => {
                        console.log(res);
                        const list = res.data.data;
                        list.forEach(ele => {
                            let item = {
                                text: ele.message,
                                isMine: ele.fromUserRole == 'PATIENT',
                                time: new Date(ele.time),
                            };
                            this.messages.push(item);
                        });

                    })
                    .catch(err => {
                        console.log(err);
                    });

                // this.simulateData();
                // this.scrollToBottom();
            },

            sendMessage() {
                if (this.inputMessage.trim()) {
                    const stime = new Date();
                    const newMessage = {
                        text: this.inputMessage,
                        isMine: true,
                        time: stime
                    };
                    this.messages.push(newMessage);

                    // 这里添加发送消息的代码，例如调用API

                    const sendMessage = JSON.stringify({
                        toUserId: this.otherSideId,
                        message: this.inputMessage,
                        time: this.formatDateTime(stime),
                    });
                    console.log("send:", sendMessage);
                    this.ws.send(sendMessage);

                    this.inputMessage = '';
                    const readTimeDTO = {
                        otherSideId: this.otherSideId, 
                        readTime: this.formatDateTime(new Date()),
                    };
                    axios.post('/api/messagechat/chat/updateReadTime', readTimeDTO)
                        .then(res => {
                            console.log(res);
                        })
                        .catch(err => {
                            console.log('check chat error', err);
                        });

                    // 发送消息后，确保聊天内容区域滚动到底部，以便看到新消息
                    this.scrollToBottom();
                }
            },

            formatTime(time) {
                return new Date(time).toLocaleTimeString().slice(0, -3); 
            },
            formatDate(time) {
                return new Date(time).toLocaleDateString();
            },
            formatDateTime(date) {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，所以需要+1
                const day = date.getDate().toString().padStart(2, '0');
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');

                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            },


            simulateData() {
                this.messages = [
                    // 模拟数据，包含时间戳
                    { text: '你好，最近怎么样？zsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbd', isMine: false, time: new Date(2024,0,1) },
                    { text: '我很好，谢谢你。zsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbdzsbd', isMine: true, time: new Date(2024,0,1) },
                    { text: '。。', isMine: false, time: new Date(2024,0,1) },
                    { text: '？', isMine: false, time: new Date(2024,0,2) },
                    { text: '。。', isMine: false, time: new Date(2024,0,3) },
                    { text: '？', isMine: true, time: new Date(2024,0,3) },
                    { text: '。。', isMine: false, time: new Date(2024,4,2) },
                    { text: '？', isMine: true, time: new Date() },
                    { text: '。。', isMine: false, time: new Date() },
                    { text: '？', isMine: true, time: new Date() },
                    { text: '。。', isMine: false, time: new Date() },
                    { text: '？', isMine: true, time: new Date() },
                    // ...其他消息
                ];
            },

            scrollToBottom() {
                // 使用Vue.nextTick等待DOM更新
                this.$nextTick(() => {
                    const messageList = this.$refs.messageList;
                    messageList.scrollTop = messageList.scrollHeight;; 
                });
            },

            // 检查两个日期是否在同一天
            isSameDay(date1, date2) {
                const d1 = new Date(date1);
                const d2 = new Date(date2);
                return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
            },
        }
    };
</script>
    
<style scoped>
    /* ... 其他样式 ... */

    .chat-container {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        padding-bottom: 60px; /* 确保输入框有足够的空间 */
        overflow: auto; /* 允许垂直滚动 */
        -webkit-overflow-scrolling: touch; /* 优化移动设备上的滚动体验 */
    }
    
    .chat-content {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        background-color: #f4f4f4;
        padding-top: 20px;
    }
    
    .message-item {
        margin-bottom: 10px;
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
    }
    
    .avatar-wrapper {
        position: relative;
    }
    
    .my-avatar {
        order: 1; /* 将头像移动到聊天气泡的右侧 */
    }
    
    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        border: 2px solid #4CAF50;
    }
    
    .my-message .avatar-wrapper {
        margin-left: 10px;
        margin-right: 10px;
        order: 1;
    }
    
    .message-box {
        max-width: 70%;
        background-color: #fff;
        padding: 10px;
        border-radius: 5px;
        margin-left: 10px;
        margin-right: 10px;
        display: flex;
        flex-direction: column;
        word-wrap: break-word;
        white-space: normal;
    }
    
    .my-message .message-box {
        margin-left: auto;
        margin-right: 0;
        background-color: #dcf8c6;
    }

    .message-content {
        font-size: medium;
        word-break: break-word;
        hyphens: auto;
    }
    
    .message-time {
        font-size: 12px;
        color: #999;
        margin-top: 5px; /* 与聊天内容保持间隔 */
    }
    
    .chat-input {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 15px;
        display: flex;
        align-items: center;
        background-color: #fff;
        font-size: medium;
        z-index: 999;
    }
    
    .chat-input input {
        flex: 1;
        margin-right: 5px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        white-space: normal; /* 允许输入内容自动换行 */
        word-wrap: break-word; /* 确保长单词可以换行 */
    }
    
    .chat-input button {
        padding: 5px 10px;
        height: auto;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        /* 确保按钮不会太大 */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .chat-date {
        font-size: small;
        color: #999;
        padding-bottom: 15px;
        text-align: center;
        display: block;
        margin: 0 auto; /* 居中对齐 */
        width: 100%;
    }


</style>