// store/index.js
import { use } from 'echarts';
import { createStore } from 'vuex'

export default createStore({
    state:{
        statsTabActiveIndex: 0,
        globalSDT: new Date(2024, 0, 1, 7, 20, 21),
        globalEDT: new Date(2024, 0, 4, 14, 20, 21),
        userData:{},
    },
    mutations:{
        changeStatsTabActiveIndex(state, index){
            state.statsTabActiveIndex = index;
        },
        setGlobalSDT(state, date){
            state.globalSDT = date;
        },
        setGlobalEDT(state, date){
            state.globalEDT = date;
        },
        // 添加一个 mutation 来设置用户数据
        setUserData(state, userData) {
            state.userData = userData;
            // console.log('userData:', userData);
        },
    },
    actions:{},
    getters:{},
});
