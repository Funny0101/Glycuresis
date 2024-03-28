<template>
    <div>
        <van-nav-bar title="饮食详细记录" left-arrow @click-left="onBack"></van-nav-bar>

        <div class="record-info">
            <div><strong>类型：</strong>{{ type }}</div>
            <div><strong>记录时间：</strong>{{ time.replace('T', ' ') }}</div>
        </div>

        <div class="food-list">
            <van-cell-group>
                <van-cell v-for="food in record.foods" :key="food.foodId" :title="food.foodName"
                    :label="`${food.foodMass} 克`">
                    <template #default>
                        <div class="food-content">
                            <div class="divider"></div>
                            <div class="nutrients">
                                <div>热量: {{ food.calorieMass }}卡</div>
                                <div>蛋白质: {{ food.proteinMass }}克</div>
                                <div>脂肪: {{ food.fatMass }}克</div>
                                <div>碳水化合物: {{ food.carbohydrateMass }}克</div>
                            </div>
                        </div>
                    </template>
                </van-cell>
            </van-cell-group>
        </div>
    </div>
</template>

<script>
import { get, put, post, del } from "../axios/axiosConfig.js";

export default {
    props: ['id', 'type', 'time'],
    data() {
        return {
            // 示例记录数据，你应该从父组件或路由获取这些数据
            record: {
                foods: [
                ],
            },
        };
    },
    mounted() {
        this.fetchMealDetails();
    },
    methods: {
        onBack() {
            this.$router.go(-1);
        },
        async fetchMealDetails() {
            //使用 this.id 获取这一餐的食物
            console.log("记录id" + this.id)
            try {
                const response = await get(`/food/record-detail/getByRecordId/${this.id}`);

                const meal_code = response.code;
                const meal_msg = response.msg;
                const meal_data = response.data;
                console.log(response.data)
                if (meal_code == 200) {
                    this.record.foods = [];
                    for (let i = 0; i < meal_data.length; i++) {
                        let foodId = meal_data[i].foodId;
                        let foodMass = meal_data[i].foodMass;
                        let foodName = meal_data[i].foodName;
                        let calorieMass = meal_data[i].calorieMass;
                        let carbohydrateMass = meal_data[i].carbohydrateMass;
                        let fatMass = meal_data[i].fatMass;
                        let proteinMass = meal_data[i].proteinMass;
                        let celluloseMass = meal_data[i].celluloseMass;
                        this.record.foods.push({ foodId: foodId, foodName: foodName, foodMass: foodMass, calorieMass: calorieMass, carbohydrateMass: carbohydrateMass, fatMass: fatMass, proteinMass: proteinMass, celluloseMass: celluloseMass });
                    }
                }
            }
            catch (err) {
                console.log(err);
            }
        },
    },
};
</script>
  
<style scoped>
.record-info {
    padding: 0.7rem;
    background-color: #f8f8f8;
    font-size: 0.5rem;
}

.food-list {
    margin-top: 1rem;
}

.nutrient-info>div {
    font-size: 0.4rem;
    line-height: 1.5;
}

.food-content {
    display: flex;
    align-items: center;
}

.divider {
    background-color: #e0e0e0; /* 浅灰色分割线 */
    width: 1px;
    height: 100%;
    margin: 0 10px;
}

.nutrients {
    flex-grow: 1;
    text-align: left; /* 确保文本靠左 */
}
</style>
  