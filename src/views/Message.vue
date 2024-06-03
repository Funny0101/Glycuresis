<template>
<div>
    <van-nav-bar :title="titleText"
        fixed placeholder
        left-arrow
        left-text="返回"
        @click-left="()=>{this.$router.go(-1);}"
        style="--van-nav-bar-title-font-size: 18px;">
    </van-nav-bar>

    <div class="msg-container">
        <!-- 消息列表 -->
        <div v-for="message in messages" :key="message.from" class="message-item">
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
            <div class="time">{{ formatDate(message.time) }}</div>
        </div>

    </div>

</div>
</template>

<script>

export default {

    data() {
        return {
            titleText : '消息中心',
            msgUnread: 0,
            messages: [],
        }
    },

    mounted() {
        this.getMessage();
    },

    methods: {

        getMessage() {
            this.msgUnread = 3;
            this.messages = [
                {
                    from: 'Doctor101',
                    text: '记得吃💊',
                    time: new Date(2024, 0, 4, 1),
                    unread: 0,
                },
                {   
                    from: 'System',
                    text: '您的血糖偏低，记得吃饭',
                    time: new Date(),
                    unread: 1,
                },
                {
                    from: 'AprilFool',
                    text: 'I Luv U',
                    time: new Date(2024, 0, 5, 1),
                    unread: 22,
                },
                {
                    from: 'hacker',
                    text: 'Oops!',
                    time: new Date(2022, 0, 3, 2),
                    unread: 0
                },
            ]

            if (this.msgUnread == 0) {
                this.titleText = '消息中心'
            }
            else {
                this.titleText = `消息中心 (${this.msgUnread})`
            }
        },
        // 格式化日期的方法
        formatDate(date) {
            const d = new Date(date);
            return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
        },

        // 根据from字段的值获取头像图片路径
        getAvatarSrc(from) {
            if (from === 'System') {
                return require('@/assets/bell.png');
            } else if (from.startsWith('Doctor')) {
                return require('@/assets/setting/doctor.png');
            } else {
                return require('@/assets/blankuser.png');
            }
        }
    },

}


</script>

<style scoped>
.msg-container {
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
</style>