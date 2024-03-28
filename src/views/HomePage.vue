<template>
  <div class="home_container">
    <!-- 页面内容 -->

    <!-- 搜索框 -->
    <van-row justify="space-around" align="center">
      <van-col span="16">
        <van-search v-model="value" placeholder="搜索你想要查看的食物热量" input-align="center" @search="onSearch" />
      </van-col>
      <van-col span="2">
        <el-popconfirm title="您确定退出吗？" confirm-button-text="是" cancel-button-text="否" @confirm="logout">
          <template #reference>
            <img src="../assets/exit.png" alt="exit icon" style="max-width: 100%; max-height: 100%;">
          </template>
        </el-popconfirm>
      </van-col>
      <van-col span="2">
        <van-icon name="chart-trending-o" size="30px" @click="showChart" />
      </van-col>
    </van-row>


    <!-- 图表数据 -->
    <div class="graph">
      <div class="title">每日数据</div>
      <div class="data_chart">
        <div class="echart" id="mychart" :style="myChartStyle"></div>
      </div>
      <div class="realData">
        <div class="concreteData">
          <div class="calorie">
            <div class="category">今日还可摄入</div>
            <div class="number">{{ Math.max((standard.calories - intake.calories), 0) }}千卡</div>
          </div>
          <div class="fat">
            <div class="category">脂肪</div>
            <div class="divider"><van-progress :show-pivot="false" color="#f9d181"
                :percentage="Math.min(intake.fat / standard.fat * 100, 100)" /></div>
            <div class="number">{{ intake.fat }}/{{ standard.fat }}g</div>
          </div>
          <div class="protein">
            <div class="category">蛋白质</div>
            <div class="divider"><van-progress :show-pivot="false" color="#f17d60"
                :percentage="Math.min(intake.protein / standard.protein * 100, 100)" /></div>
            <div class="number">{{ intake.protein }}/{{ standard.protein }}g</div>
          </div>
          <div class="carbs">
            <div class="category">碳水</div>
            <div class="divider"><van-progress :show-pivot="false" color="#6bdace"
                :percentage="Math.min(intake.carbs / standard.carbs * 100, 100)" /></div>
            <div class="number">{{ intake.carbs }}/{{ standard.carbs }}g</div>
          </div>
        </div>
        <div class="divide"><el-divider /></div>
        <div class="dataIcon">
          <div class="breakfast" @click="record('breakfast')">
            <img src="../assets/breakfast.png" alt="breakfast">
            <div class="meal">
              <van-icon v-if="mealRecord.breakfast !== 0" name="checked" color="#26d39a" />
              {{ mealRecord.breakfast === 0 ? '+' : '' }}早餐
            </div>
            <div class="record">{{ mealRecord.breakfast === 0 ? '未记录' : mealRecord.breakfast + "千卡" }}</div>
          </div>
          <div class="lunch" @click="record('lunch')">
            <img src="../assets/lunch.png" alt="lunch">
            <div class="meal">
              <van-icon v-if="mealRecord.lunch !== 0" name="checked" color="#26d39a" />
              {{ mealRecord.lunch === 0 ? '+' : '' }}午餐
            </div>
            <div class="record">{{ mealRecord.lunch === 0 ? '未记录' : mealRecord.lunch + "千卡" }}</div>
          </div>
          <div class="dinner" @click="record('dinner')">
            <img src="../assets/dinner.png" alt="dinner">
            <div class="meal">
              <van-icon v-if="mealRecord.dinner !== 0" name="checked" color="#26d39a" />
              {{ mealRecord.dinner === 0 ? '+' : '' }}晚餐
            </div>
            <div class="record">{{ mealRecord.dinner === 0 ? '未记录' : mealRecord.dinner + "千卡" }}</div>
          </div>
          <div class="snack" @click="record('snack')">
            <img src="../assets/snack.png" alt="snack">
            <div class="meal">
              <van-icon v-if="mealRecord.snack !== 0" name="checked" color="#26d39a" />
              {{ mealRecord.snack === 0 ? '+' : '' }}加餐
            </div>
            <div class="record">{{ mealRecord.snack === 0 ? '未记录' : mealRecord.snack + "千卡" }}</div>
          </div>
        </div>
      </div>
    </div>


    <!-- 功能网格 -->
    <div class="grid">
      <div class="grid-item" @click="onDietRecordUpload">
        <div class="title">饮食记录上传</div>
        <div class="tips">
          <img src="../assets/healthy.png" alt="Status Icon" v-if="isDietHealthy" />
          <img src="../assets/alert.png" alt="Status Icon" v-else />
          <div class="tipText">{{ dietStatus }}</div>
        </div>
        <div class="data">{{ intake.calories }}</div>
        <div class="info" v-if="mealRecord.breakfast === 0">早餐未上传</div>
        <div class="info" v-else-if="mealRecord.lunch === 0">午餐未上传</div>
        <div class="info" v-else-if="mealRecord.dinner === 0">晚餐未上传</div>
        <div class="info" v-else>今日已上传</div>
      </div>
      <div class="grid-item" @click="onBloodSugarUpload">
        <div class="title">血糖记录上传</div>
        <div class="tips">
          <img src="../assets/healthy.png" alt="Status Icon" v-if="isBloodSugarHealthy" />
          <img src="../assets/alert.png" alt="Status Icon" v-else />
          <div class="tipText">{{ bloodSugarStatus }}</div>
        </div>
        <div class="data" v-if="glucoseValues.length > 0">最大值: {{ glucoseValues.max }}</div>
        <div class="data" v-else>无</div>
        <div class="info" v-if="glucoseValues.length === 0">未上传血糖数据</div>
        <div class="info" v-else>今日已上传</div>
      </div>
    </div>

    <!-- 血糖记录上传弹窗 -->
    <el-dialog title="血糖上传" v-model="glucoseFormVisible" center width=70% top=10vh>
      <el-form ref="glucoseForm" :model="glucoseForm" :rules="glucoseFormRules" label-position="top">
        <el-form-item label="血糖值" prop="glucose">
          <el-input v-model="glucoseForm.glucose" style="width: 10px" />
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker v-model="glucoseForm.time" type="datetime" style="width: 10px">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="glucoseFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addGlucoseRecord()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 添加按钮 -->
    <div class="icon-container">
      <el-icon class="custom-icon" @click="openDialog">
        <i class="circle-plus-icon"></i>
      </el-icon>
    </div>
    <van-overlay :show="showPlus" @click="showPlus = false">
      <div class="PlusJiemian">
        <!-- 白色背景的 div -->
        <div class="white-background">
          <!-- 三个原型按钮 -->
          <div class="circle-button" @click="gotoXuetang">
            <div class="circle">
              <van-icon name="browsing-history" size="40" />
            </div>
            <div class="button-text">查血糖</div>
          </div>
          <div class="circle-button" @click="gotoDiet">
            <div class="circle">
              <van-icon name="card" size="40" />
            </div>
            <div class="button-text">看食谱</div>
          </div>
          <div class="circle-button" @click="gotoFood">
            <div class="circle">
              <van-icon name="add-square" size="40" />
            </div>
            <div class="button-text">记饮食</div>
          </div>
        </div>
      </div>
    </van-overlay>
    <div v-if="showPicker" class="pickerContainer">
      <van-picker :columns="columns" v-model="selectedValue" class="mypicker" @confirm="gotoJiLuYinShi"
        @cancel="this.showPicker = false" />
    </div>


    <!-- 底部导航栏 -->
    <van-tabbar route>
      <!-- 导航项1 -->
      <van-tabbar-item icon="home-o" text="首页" to="/home" />

      <!-- 导航项2 -->
      <van-tabbar-item icon="search" text="搜索" to="/search" />

      <!-- 导航项3 -->
      <van-tabbar-item icon="chart-trending-o" text="朋友" to="/friends" />

      <!-- 导航项4 -->
      <van-tabbar-item icon="setting" text="设置" to="/setting" />
    </van-tabbar>
  </div>
</template>
  

<script>
import * as echarts from "echarts";
import axios from "axios";
import { dealTime } from "../global"
export default {
  data() {
    return {
      selectedValue: '', // 用于存储选择的值
      showPicker: false,
      columns: [
        { text: '早餐', value: 'breakfast' },
        { text: '午餐', value: 'lunch' },
        { text: '晚餐', value: 'dinner' },
        { text: '加餐', value: 'snack' },
      ],
      showPlus: false,
      value: '', // 搜索框内容
      standard: {
        fat: 53,
        protein: 71,
        carbs: 285,
        calories: 2075,
      },
      intake: {
        fat: 0,
        protein: 0,
        carbs: 0,
        calories: 0,
      },
      mealRecord: {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        snack: 0,
      },

      // 饮食健康与否
      isDietHealthy: true,
      // 血糖健康与否
      isBloodSugarHealthy: true,

      myChart: {},
      xData: [],
      yData: [],
      myChartStyle: { float: "left", width: "100%", height: "6rem" }, //图表样式

      // 是否展示展示血糖上传弹窗
      glucoseFormVisible: false,
      // 血糖上传表单
      glucoseForm: {
        glucose: 0.0,
        time: new Date(),
      },
      // 血糖上传表单验证规则
      glucoseFormRules: {
        glucose: [
          { required: true, message: '请输入血糖值', trigger: 'blur' },
          { min: 0, message: '血糖值必须大于0' }
        ],
        time: [
          { required: true, message: '请选择时间', trigger: 'blur' },
        ],
      },

      // 用户信息
      userInfo: {},

      // 血糖值
      glucoseValues: [],
    };
  },
  mounted() {
    // 拉取从2021-08-05 07:20:00到2021-08-05 10:30:00的血糖数据
    // 查询24小时内的饮食数据
    this.queryDietData();
    // 查询2小时内的血糖数据
    this.queryBloodSugarData();
    // // 初始化图表
    // this.initEcharts();
    // 根据BMI计算标准摄入量
    this.calculateStandardIntake();

    // console.log("current time:", dealTime(new Date()));

    // console.log('Version 1.0');

  },
  // 计算属性
  computed: {
    // 计算饮食状态
    dietStatus() {
      var status = '';
      if (this.intake.fat > this.standard.fat) {
        status += '脂肪摄入过量';
      }
      if (this.intake.protein > this.standard.protein) {
        status += '蛋白质摄入过量';
      }
      if (this.intake.carbs > this.standard.carbs) {
        status += '碳水摄入过量';
      }
      if (this.intake.calories > this.standard.calories) {
        status = '总摄入量过高';
      }
      if (this.intake.fat > this.standard.fat ||
        this.intake.protein > this.standard.protein ||
        this.intake.carbs > this.standard.carbs ||
        this.intake.calories > this.standard.calories) {
        this.isDietHealthy = false;  // 有任何一个值过高则设置为 false
      } else {
        status = '饮食状态良好';
        this.isDietHealthy = true;
      }
      return status;
    },

    // 计算血糖值高低和波动
    bloodSugarStatus() {
      // 设置阈值
      const thresholdHigh = 10.0; // 血糖值高阈值
      const thresholdLow = 3.9; // 血糖值低阈值
      const highValues = this.glucoseValues.filter(value => value.gluValue > thresholdHigh);
      const lowValues = this.glucoseValues.filter(value => value.gluValue < thresholdLow);
      // 使用 Array.reduce() 计算最大值和最小值
      const { max, min } = this.glucoseValues.reduce((acc, value) => {
        acc.max = Math.max(acc.max, value.gluValue);
        acc.min = Math.min(acc.min, value.gluValue);
        return acc;
      }, { max: Number.NEGATIVE_INFINITY, min: Number.POSITIVE_INFINITY });

      this.glucoseValues.max = max;
      // 计算差值
      const diff = max - min;
      // 判断整体情况
      if (this.glucoseValues.length === 0) {
        return '当前未上传';
      } else if (diff > 6) {
        this.isBloodSugarHealthy = false;
        return '波动明显';
      } else if (highValues.length > lowValues.length) {
        this.isBloodSugarHealthy = false;
        return '血糖偏高';
      } else if (lowValues.length > highValues.length) {
        this.isBloodSugarHealthy = false;
        return '血糖偏低';
      } else {
        this.isBloodSugarHealthy = true;
        return '血糖正常';
      }
    }
  },

  // 方法
  methods: {
    // 退出登录
    logout() {
      axios.post('/api/user/user/logout')
        .then((res) => {
          console.log(res);
          this.$router.push('/login');
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 查询24小时内的饮食数据
    queryDietData() {
      // 获取今天的日期
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 设置时间为零点零分零秒

      // 查询今天零点到当前的饮食记录时间范围
      const timeRange = {
        startTime: dealTime(today),
        endTime: dealTime(new Date()),
      };

      // console.log(timeRange);
      axios.get('/api/food/record/statistic', { params: timeRange })
        .then((res) => {
          const currIntake = res.data.data;
          // console.log("当前摄入量", currIntake);
          this.intake.fat = Math.round(currIntake.fatMass);
          this.intake.protein = Math.round(currIntake.proteinMass);
          this.intake.carbs = Math.round(currIntake.carbohydrateMass);
          this.intake.calories = Math.round(currIntake.calorieMass);
          this.mealRecord.breakfast = Math.round(currIntake.breakfastCalorieMass);
          this.mealRecord.lunch = Math.round(currIntake.lunchCalorieMass);
          this.mealRecord.dinner = Math.round(currIntake.dinnerCalorieMass);
          this.mealRecord.snack = Math.round(currIntake.snackCalorieMass);
        })
        .catch((error) => {
          console.log(error);
        })
    },
    // 查询2小时内的血糖数据
    queryBloodSugarData() {
      // 获取当前时间
      const currentTime = new Date();

      // 查询2小时内的血糖记录
      const timeRange = {
        startTime: dealTime(new Date(currentTime.getTime() - 2 * 60 * 60 * 1000)), // 当前时间减去两小时
        endTime: dealTime(currentTime),
      };
      axios.get('/api/food/glucose/getGlucose', { params: timeRange })
        .then((res) => {
          this.glucoseValues = res.data.data;
          // console.log("两小时内血糖数据", this.glucoseValues);
          // 初始化图表
          this.initEcharts();
        })
        .catch((error) => {
          console.log(error);
        })
    },
    // 根据BMI计算标准摄入量
    calculateStandardIntake() {
      axios.get('/api/user/user/getDetail')
        .then((res) => {
          const userInfo = res.data.data;
          // console.log('userInfo:', userInfo);
          this.userInfo = userInfo;
          if (userInfo.weight == null || userInfo.height == null) {
            // ElMessage('信息缺失，默认摄入量')
            ElMessage({
              dangerouslyUseHTMLString: true,
              message: '<strong>信息缺失</strong><br/>摄入量使用默认值',
              type: 'warning',
            });
            return;
          }
          const BMI = userInfo.weight / (userInfo.height * userInfo.height);
          if (BMI < 18.5) {
            this.standard.calories = Math.round(35 * userInfo.weight);
          } else if (BMI < 24) {
            this.standard.calories = Math.round(30 * userInfo.weight);
          } else {
            this.standard.calories = Math.round(25 * userInfo.weight);
          }
          this.standard.carbs = Math.round(this.standard.calories * 0.55 / 4);
          this.standard.protein = Math.round(this.standard.calories * 0.15 / 4);
          this.standard.fat = Math.round(this.standard.calories * 0.3 / 9);
          // console.log("标准摄入量", this.standard);
        })
        .catch((error) => {
          console.log(error);
        })
    },
    onSearch() {
      // 在这里处理搜索逻辑
      // console.log('搜索内容：', this.value);
    },
    onRecipeSearch() {
      // 在这里处理食谱查询的逻辑
      // console.log('食谱查询');
    },
    onBloodSugarUpload() {
      // 在这里处理血糖记录上传的逻辑
      this.glucoseFormVisible = true;
      // console.log('血糖记录上传', this.glucoseForm);
    },
    onDietRecordUpload() {
      // 在这里处理饮食记录上传的逻辑
      console.log('饮食记录上传');
      this.$router.push({
        name: 'dietRecord',
        params: {
          meal: 'breakfast',
        },
      });
    },
    openDialog() {
      // 在这里处理???的逻辑
      console.log('加号的逻辑');
      this.showPlus = true;
    },

    // 取消血糖上传
    cancel() {
      this.glucoseFormVisible = false;
    },
    // 添加血糖记录
    addGlucoseRecord() {
      this.$refs.glucoseForm.validate((valid) => {
        if (valid) {
          // 表单验证通过
          // 请求体
          const glucose = {
            gluValue: this.glucoseForm.glucose,
            time: dealTime(this.glucoseForm.time),
          };
          // console.log('待上传血糖数据：', glucose);
          axios
            .post('/api/food/glucose/addGlucose', glucose)
            .then((res) => {
              console.log(res);
              this.queryBloodSugarData(); // 更新当前的血糖值
              this.glucoseFormVisible = false;
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          // 表单验证不通过
          console.log('error submit!!');
          return false;
        }
      });
    },
    record(meal) {
      // 在这里处理记录的逻辑
      console.log('记录');
      this.$router.push({
        name: 'dietRecord',
        params: {
          meal: meal,
        },
      });
    },

    gotoFood() {
      this.showPlus = false;
      this.showPicker = true;
    },
    gotoJiLuYinShi(picker) {
      this.showPicker = false;
      this.selectedValue = picker;
      // console.log('选择的值是:', this.selectedValue);
      this.$router.push("/dietRecord/" + this.selectedValue.value);
    },
    gotoDiet() {
      this.showPlus = false;
      this.$router.push("/search")
    },
    gotoXuetang() {
      this.showPlus = false;
      this.$router.push("/friends")
    },
    showChart() {
      // 在这里处理显示图表的逻辑
      // console.log('显示图表');
      this.$router.push('/friends');
    },
    initEcharts() {
      //从this.glucoseValues中取出x轴和y轴的值
      // this.queryBloodSugarData();
      // console.log("血糖数据", this.glucoseValues);
      const x = this.glucoseValues.map(item => {
        const time = new Date(item.time);
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      });

      const y = this.glucoseValues.map(item => item.gluValue);

      const option = {
        grid: {
          hoverLayerThreshold: 5,
          left: '15%',
          right: '15%',
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          name: "时间",
          data: x,
        },
        yAxis: {
          name: "血糖值(mmol/L)"
        },
        visualMap: {
          show: false,
          top: 50,
          right: 10,
          precision: 1,//显示小数点后一位
          pieces: [
            { //蓝色
              gt: 0,
              lte: 3.9,
              color: '#00BFFF'
            },
            { //绿色
              gt: 3.9,
              lte: 10.0,
              color: '#7CFC00'
            },
            { //黄色
              gt: 10.0,
              lte: 13.9,
              color: '#FFD700'
            },
            { //橙色
              gt: 13.9,
              lte: 16.7,
              color: '#FFA500'
            },
            { //红色
              gt: 16.7,
              color: '#FF3030'
            }
          ],
          outOfRange: {
            color: '#999'
          }
        },
        series: [
          {
            data: y,
            type: "line", // 类型设置为折线图
            areaStyle: {},
            label: {
              show: true,
              position: 'top',
              formatter: function (params) {
                if (params.value > 10.0) {
                  return '{warningText|!偏高}';
                } else if (params.value < 3.9) {
                  return '{warningText|!偏低}';
                } else {
                  return '';
                }
              },
              backgroundColor: '#fff',
              borderColor: '#000',
              rich: {
                warningText: {
                  align: 'left',
                  color: '#FF3030',
                  fontSize: 12,
                  padding: [0, 0, 0, 5]
                },
              },
            },
            markLine: {
              silent: true,
              symbol: ['none', 'none'],
              lineStyle: {
                color: '#333'
              },
              label: {
                position: 'start',
              },
              data: [
                {
                  yAxis: 3.9
                },
                {
                  yAxis: 10.0
                },
                {
                  yAxis: 13.9
                },
                {
                  yAxis: 16.7
                }
              ]
            }
          }
        ]
      };
      this.myChart = echarts.init(document.getElementById("mychart"));
      this.myChart.setOption(option);
      //随着屏幕大小调节图表
      // window.addEventListener("resize", () => {
      //   this.myChart.resize();
      // });
    }
  },
};
</script>

<style scoped>
.home_container {
  font-size: medium;
}

.graph {
  width: 90%;
  height: 0;
  padding-bottom: 120%;
  position: relative;
  margin: 20px auto;
  border-radius: 5%;
  background-image: url('../assets/background.jpg');

  font-size: small;
}

.graph>.title {
  position: absolute;
  left: 4%;
  top: 4%;

  color: rgb(252, 250, 250);
  /* color: #26d39a; */
  text-decoration: underline;
}

.graph>.data_chart {
  width: 90%;
  height: 0;
  padding-bottom: 60%;
  position: absolute;
  background-color: white;
  border-radius: 5%;

  left: 5%;
  top: 10%;
}

.graph>.data_chart>#mychart {
  float: left;
  width: 100%;
  height: 200px;
}

.graph>.realData {
  width: 90%;
  height: 0;
  padding-bottom: 55%;
  position: absolute;
  background-color: white;
  border-radius: 5%;

  left: 5%;
  top: 57%;
}

.graph>.realData>.concreteData {
  width: 90%;
  height: 0;
  padding-bottom: 20%;
  position: absolute;
  left: 5%;
  top: 8%;

  display: flex;
  justify-content: space-between;
}

.graph>.realData>.concreteData>div {
  width: 20%;
  height: 0;
  padding-bottom: 22%;

  position: relative;
}

.graph>.realData>.concreteData>div>.category {
  position: absolute;
  top: 10%;
}

.graph>.realData>.concreteData>div>.divider {
  width: 80%;
  height: 3px;
  position: absolute;
  top: 40%;
}

.graph>.realData>.concreteData>div>.number {
  position: absolute;
  color: #c0bdbd;
  top: 60%;
}

.graph>.realData>.concreteData>.calorie {
  flex: 1;
}

.graph>.realData>.divide {
  width: 90%;
  height: 0;
  padding-bottom: 10%;
  position: absolute;
  left: 5%;
  top: 30%;
}

.graph>.realData>.dataIcon {
  width: 90%;
  height: 0;
  padding-bottom: 30%;
  position: absolute;
  left: 5%;
  top: 45%;

  display: flex;
  justify-content: space-around;
}

.graph>.realData>.dataIcon>div {
  width: 20%;
  height: 0;
  padding-bottom: 33%;

  /* 设置子组件布局 */
  position: relative;
  display: flex;
  justify-content: center;
  /* 水平居中 */
}

.graph>.realData>.dataIcon>div>img {
  width: 60%;
  height: auto;
  position: absolute;
  top: 10%;
}

.graph>.realData>.dataIcon>div>.meal {
  position: absolute;
  top: 60%;
}

.graph>.realData>.dataIcon>div>.record {
  position: absolute;
  color: #c0bdbd;
  top: 80%;
}



.grid {
  width: 90%;
  margin: 20px auto;
  display: flex;
  justify-content: space-between;
}

.grid-item {
  width: 45%;
  height: 0;
  padding-bottom: 45%;
  position: relative;
  border: 1px solid black;
  border-radius: 10%;
  font-size: 15px;
}

.grid-item>.title {
  position: absolute;
  left: 10%;
  top: 10%;
}

.grid-item>.tips {
  position: absolute;
  top: 30%;
  left: 10%;
  width: 30%;
  display: flex;
  align-items: center;
}

.grid-item>.tips img {
  width: 100%;
  height: auto;
}

.tipText {
  color: #cb5757;
  font-size: medium;
  max-width: 80px;
  word-wrap: break-word;
}

.grid-item>.data {
  position: absolute;
  top: 60%;
  left: 10%;
}

.grid-item>.info {
  position: absolute;
  top: 80%;
  left: 10%;
}



.icon-container {
  position: fixed;
  bottom: 6vh;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-icon {
  width: 40px;
  height: 40px;
}

.circle-plus-icon {
  display: block;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  border-radius: 50%;
  background-color: rgb(66, 189, 169);
  /* 修改圆的背景颜色为RGB(66, 189, 169) */
  position: relative;
}

.circle-plus-icon::before,
.circle-plus-icon::after {
  content: '';
  position: absolute;
  background-color: #fff;
  /* 修改加号的颜色 */
}

/* 横线 */
.circle-plus-icon::before {
  width: 50%;
  /* 修改横线的长度 */
  height: 4px;
  /* 修改横线的厚度 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 竖线 */
.circle-plus-icon::after {
  width: 4px;
  /* 修改竖线的厚度 */
  height: 50%;
  /* 修改竖线的长度 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.el-input__inner {
  width: 50vw;
}




.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}

.white-background {
  position: absolute;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  /* 这里根据你的需求设置宽度和高度 */
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  bottom: 40px;
}

.circle-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
}

.circle van-icon {
  font-size: 48px;

}

.button-text {
  font-size: 14px;
}

.pickerContainer {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.mypicker {
  position: absolute;
  bottom: 55px;
  width: 100%;
}
</style>