<template>
    <van-card>
        <van-image :src="doctor.avatar" width="100" height="100" />
        <div class="doctor-info">
            <h2>{{ doctor.name }}</h2>
            <p>性别: {{ doctor.gender }}</p>
            <p>年龄: {{ doctor.age }}</p>
            <p>科室: {{ doctor.department }}</p>
            <p>职称: {{ doctor.title }}</p>
            <van-divider />
            <p>简介: {{ doctor.description }}</p>
        </div>
    </van-card>
</template>

<script>
Vue.use(vant);

new Vue({
    el: '#app',
    data() {
        return {
            doctor: {
                gender: '男',
                age: 45,
                name: '张医生',
                avatar: 'https://example.com/avatar.jpg',
                department: '心内科',
                title: '主任医师',
                description: '张医生有超过20年的临床经验，擅长心血管疾病的诊断与治疗。'
            }
        };
    }
});
</script>

<style>
.doctor-info {
    padding: 10px;
}

.doctor-info h2 {
    margin: 0;
    font-size: 20px;
}

.doctor-info p {
    margin: 5px 0;
    font-size: 16px;
}
</style>
</body>