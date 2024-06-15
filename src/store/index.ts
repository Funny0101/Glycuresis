// store/index.js
import { use } from 'echarts';
import { createStore } from 'vuex'

export default createStore({
    state:{
        statsTabActiveIndex: 0,
        globalEDT: new Date(),
        globalSDT: new Date(new Date().setDate(new Date().getDate() - 1)),
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
