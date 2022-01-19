import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        loginData: {
            id:           '',
            username:     '',
            companyCode:  '',
            companyId:    '',
            status : '',
            authorities:   [],
            accessToken: ''
        },
        userAdminFlag : '',
        searchForm:     '',
        updateUser:     '',
        responseData:   '',
        menuPaths:      [],
        commonArea:     {}  // 連想配列
    },

    mutations: {
        // mutations: のメソッドはactions: のcommitから呼び出される。
        pushMenuPath(state, menuPath) {
            // console.log('mutations:pushMenuPath! menuPath=' + menuPath);
            state.menuPaths.push(menuPath);
        },
        popMenuPath(state) {
            // console.log('mutations:popMenuPath!');
            return state.menuPaths.pop();
        },
        saveCommonArea(state, { commonKey, commonVal }) {
            // console.log('mutations:saveCommonArea! commonKey=' + commonKey + ', commonVal=' + commonVal);
            state.commonArea[commonKey] = commonVal;
        },
        //loadCommonArea(state, commonKey) {
        //  return state.commonArea[commonKey];
        //},
        deleteCommonArea(state, commonKey) {
            // console.log('mutations:deleteCommonArea! commonKey=' + commonKey);
            delete state.commonArea[commonKey];
        },
        resetCommonArea(state, commonKey){
            // console.log('mutations:resetCommonArea! commonKey=' + commonKey);
            for (var key in state.commonArea) {
                if (key.indexOf(commonKey) > -1){
                  delete state.commonArea[key];
                } 
            }
        },
    },

    actions: {
        // actions: のcommitでmutations: のメソッドが呼び出される。
        pushMenuPath({commit}, menuPath) {
            console.log('actions:pushMenuPath! menuPath=' + menuPath);
            commit("pushMenuPath", menuPath);
        },
        popMenuPath({commit}) {
            console.log('actions:popMenuPath!');
            return commit("popMenuPath");
        },

        // 次のpopMenuPathで値を返す方法が不明のため、getters: で取得後、上記のpopMenuPathで削除する
        // popMenuPath({commit}) {
        //     console.log('actions!:popMenuPath');
        //     return new Promise((resolve) => {
        //     //setTimeout(() => {
        //         commit('popMenuPath')
        //         resolve()
        //     //}, 1000)
        // })

        // popMenuPath({commit}) {
        //     let menuPath;
        //     commit("popMenuPath")
        //     .then((res) => {
        //         console.log('res=' + res);
        //         menuPath = res;
        //         console.log('App.clickMenuBack.popMenuPath=' + menuPath);
        //     })
        //     return menuPath;
        // },

        saveCommonArea({commit}, { commonKey, commonVal }) {
            console.log('actions:saveCommonArea! commonKey=' + commonKey + ', commonVal=' + commonVal);
            commit("saveCommonArea", { commonKey: commonKey, commonVal: commonVal });
        },
        // loadCommonArea({commit}, commonKey) {
        //     return commit("loadCommonArea", commonKey);
        // },
        deleteCommonArea({commit}, commonKey) {
            console.log('actions:deleteCommonArea! commonKey=' + commonKey);
            delete commit("deleteCommonArea", commonKey);
        },
        resetCommonArea({commit}, commonKey) {
            console.log('actions:resetCommonArea! commonKey=' + commonKey);
            delete commit("resetCommonArea", commonKey);
        },
    },

    getters : {
        getLastMenuPath: (state) => {
            let pos = state.menuPaths.length -1;
            let menuPath = state.menuPaths[pos];
            console.log('getters:getLastMenuPath! pos=' + pos + ', menuPath=' + menuPath);
            return menuPath;
        },
        loadCommonArea: (state) => {
            return (commonKey) => {
                console.log('getters:loadCommonArea! commonKey=' + commonKey);
                return state.commonArea[commonKey];
            }
        },

        //getLoginData: state => {return state.logindata},
    },
})

export default store
