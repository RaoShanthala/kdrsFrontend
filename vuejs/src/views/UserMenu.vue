<template>
  <div>
    <div class="text-right" style="height: 5px">
        <b-form-checkbox v-model="enabledTooltip">説明</b-form-checkbox>
        <div v-if="this.$store.userAdminFlag == 'userAdmin'" >
            <span style="text-decoration:underline; font-weight:bold;"> 
                <a class="btn-primary" @click="gotoAdminMenu"> 管理者メニュー </a>
            </span>
        </div>    
    </div>   
    <div class="menu-container">
        <b-row>    
            <b-col class="col-md-3">
                <b-button-group vertical>
                    <!-- 製品工程進捗登録 -->
                    <!--b-button @click="clickMenuForward('/process')" class="mb-3">{{findRouteTitle('/process')}}</b-button-->
                    <b-button id="selfUpdate" @click="clickMenuForward('/kojinupdate')" class="mb-3">{{findRouteTitle('/kojinupdate')}}</b-button>
                </b-button-group>
            </b-col>
            <b-col class="col-md-3">
                <b-button-group vertical>
                    <!-- 工事データ履歴 -->
                    <b-button id="constructionHistory" @click="clickMenuForward('/constructiondatahistory')" class="mb-3">{{findRouteTitle('/constructiondatahistory')}}</b-button>
                    <!-- 日報データ履歴 -->
                    <b-button id="reportHistory" @click="clickMenuForward('/reportdatahistory')" class="mb-3">{{findRouteTitle('/reportdatahistory')}}</b-button>
                    <b-button id="workHistory" @click="clickMenuForward('/workdatahistory')" class="mb-3">{{findRouteTitle('/workdatahistory')}}</b-button>
                    <!--b-button @click="clickMenuForward('/products')" class="mb-3">{{findRouteTitle('/products')}}</b-button-->
                </b-button-group>
            </b-col>
            <b-tooltip :disabled.sync="disabledTooltip" target="selfUpdate" triggers="hover" placement="bottom" variant="primary">
                <div class="text-left">
                    <font size=5>
                        個人情報を更新します。
                    </font>
                </div>
            </b-tooltip>
            <b-tooltip :disabled.sync="disabledTooltip" target="constructionHistory" triggers="hover" placement="bottom" variant="primary">
                <div class="text-left">
                    <font size=5>
                        ログインユーザにより工事情報履歴<br>
                        データが表示されます。
                    </font>
                </div>
            </b-tooltip>
            <b-tooltip :disabled.sync="disabledTooltip" target="reportHistory" triggers="hover" placement="bottom" variant="primary">
                <div class="text-left">
                    <font size=5>
                        ログインユーザにより日報情報履歴<br>
                        データが表示されます。
                    </font>
                </div>
            </b-tooltip>
            <b-tooltip :disabled.sync="disabledTooltip" target="workHistory" triggers="hover" placement="bottom" variant="primary">
                <div class="text-left">
                    <font size=5>
                        ログインユーザにより変更作業情報履歴<br>
                        データが表示されます。
                    </font>
                </div>
            </b-tooltip>
        </b-row>
        <b-row>
            <b-col class="col-md-3">
                <b-button-group vertical>
                    <!-- Tekla用工程完了データ作成 -->
                    <!--b-button @click="clickMenuForward('/exporttekla')" class="mb-3">{{findRouteTitle('/exporttekla')}}</b-button-->
                </b-button-group>
            </b-col>
            <b-col class="col-md-3">
                <b-button-group vertical>
                    <!-- 製品工程予定登録 -->
                    <!--b-button @click="clickMenuForward('/prodprocplanregister')" class="mb-3">{{findRouteTitle('/prodprocplanregister')}}</b-button-->
                </b-button-group>
            </b-col>
            <b-col class="col-md-3">
                <b-button-group vertical>
                    <!-- 進捗予実表示 -->
                    <!--b-button @click="clickMenuForward('/projectstatusplanactual')" class="mb-3">{{findRouteTitle('/projectstatusplanactual')}}</b-button-->
                </b-button-group>
            </b-col>
            <b-col class="col-md-3">
                <b-button-group vertical>
                    <!-- 標準製品工程メンテ -->
                    <!--b-button v-show="showStdProduct" @click="clickMenuForward('/stdproduct')" class="mb-3">{{findRouteTitle('/stdproduct')}}</b-button-->
                    <!-- 標準集計名称メンテ -->
                    <!--b-button v-show="showStdAggregate" @click="clickMenuForward('/stdaggregate')" class="mb-3">{{findRouteTitle('/stdaggregate')}}</b-button-->
                </b-button-group>
            </b-col>
        </b-row>
        <!--b-card v-show = "isShowTest" class="mt-4">
            <b-row>
                <br>
            </b-row>
            <b-row>
                <b-col>   
                    <b-button-group vertical>  
                        <b-button @click="clickMenuForward('/test')" variant="primary" class="mb-3">{{findRouteTitle('/test')}}</b-button>  
                        <b-button @click="clickMenuForward('/servertest')" class="mb-3">{{findRouteTitle('/servertest')}}</b-button>            
                    </b-button-group>                  
                </b-col>
                <b-col> 
                    <b-button-group vertical>     
                        <b-button @click="clickMenuForward('/prodproc')" class="mb-3">{{findRouteTitle('/prodproc')}}</b-button>
                    </b-button-group>
                </b-col>    
                <b-col>
                </b-col>
            </b-row>
        </b-card-->
    </div>  
  </div>
</template>

<style scoped>
.menu-container {
    margin: 24px 10% 0;
}
h1, .btn {
    font-size: 2rem;
}
.btn-group, .btn-group-vertical {
    display: block;
}
.row {
    justify-content: center;
} 
</style>

<script>
//import axios from 'axios'
//import apiUrls from '../common/apiUrls'
import commonMethods from '../common/commonMethods'

export default {
    data() {
        return {
            enabledTooltip: false,
            disabledTooltip: true,
            menuInfoByName: {},
        }
    },
    watch: {
        enabledTooltip: function() {
            this.disabledTooltip = !this.enabledTooltip;
        }
    },
    created: async function() {
        this.menuInfoByName = commonMethods.loadCommonArea('menuInfoByName');
        let enabledTooltip = commonMethods.loadCommonArea('enabledTooltip');
        if (enabledTooltip != null) {
            this.enabledTooltip = enabledTooltip;
        }
    },
    destroyed: function() {
        console.log('destroyed 1');
        commonMethods.saveCommonArea('enabledTooltip', this.enabledTooltip);
    },
    methods: {
        window:onload = function() {  
            //console.log('location.href=' + location.href);
            history.pushState(null, null, location.href);   //location.href=http://localhost:81/menu#/ ->現在のURL=window.location
            //history.pushState(null, null, null);
            window.addEventListener('popstate', () => {
                history.go(1);
                //if (!event.originalEvent.state) return; // 初回アクセス時対策
                /*
                if (event) {
                    console.log('event=' + event);
                    if (event.originalEvent) {
                        console.log('event.originalEvent=' + event.originalEvent);
                        if (event.originalEvent.state) {
                            var state = event.originalEvent.state;  // stateオブジェクト
                            console.log('state=' + state);
                            if (!state) return; // 初回アクセス時対策
                        }
                    }
                    if (event.PopStateEvent) {
                        console.log('event.PopStateEvent=' + event.PopStateEvent);
                    }
                }
                */
                //console.log('popstate!');
                // TypeError: Cannot read property 'state' of undefined
                //let menuPath = this.$store.state.menuPaths.pop();
                //console.log('popstate.menuPath=' + menuPath);

                // TypeError: Cannot read property 'getters' of undefined
                //let menuPath = this.$store.getters.getLastMenuPath;
                //console.log('popstate.menuPath=' + menuPath);

                //if(menuPath == '/userupdate') {
                //    //ユーザ更新画面で戻るボタンを押した時に必要
                //    this.$store.state.responseData = '';
                //}

                // TypeError: Cannot read property 'dispatch' of undefined
                //console.log('popstate.popMenuPath start !');
                //this.$store.dispatch('popMenuPath');
                //console.log('popstate.popMenuPath end !');

                // 次の処理は不要
                //this.$router.push({path: menuPath});
            });
        },
        findRouteTitle(path) {
            return this.$router.options.routes.find(e => e.path === path).meta.title;
        },
        clickMenuForward(menuForwardPath) {
            //console.log('Menu.clickForwardMenu! menuForwardPath=' + menuForwardPath);
            //this.$store.dispatch('pushMenuPath', this.$route.path);
            ////window.history.pushState(null, null, '/menu');
            //this.$router.push({path: menuForwardPath});
            commonMethods.clickMenuForward(this.$route.path, menuForwardPath);
        },

        gotoAdminMenu(){
           this.$router.push({path: '/adminmenu'});
        },

       /* async referNameCollectionMany(nameSectionValue) {
            let axiosConfigObject = {
                headers: {
                    Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                    'Content-Type': 'application/json',
                },
                //params:  payload
                params: { nameSection:  nameSectionValue }
            }
            await axios.get(apiUrls.referNameCollectionMany, axiosConfigObject)
            .then(response => {
                if(response.data.resultCode == '000') {
                    // console.log('response.data.resultCode=' + response.data.resultCode);
                    if (nameSectionValue == 'ProgressBackColorScreen') {
                        // 画面名をキーにした製品と工程の背景色を取得
                        let progressBackColorScreen = commonMethods.convertProgressBackColorScreen(response.data.resDt);
                        // 共通領域に背景色をセーブ
                        commonMethods.saveCommonArea('progressBackColorScreen', progressBackColorScreen);
                    }
                    return;
                } else {
                    this.message = commonMethods.getResponseMessage(response);
                }
            })
            .catch(error => {
                this.message = commonMethods.getErrorMessage(error);
            })
        },*/
    } 
}
</script>