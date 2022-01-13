<template>
    <div>
        <b-form inline id="login-form">       
            <b-input-group v-if="!this.$store.state.loginData.accessToken" class="mb-2 mr-sm-2 mb-sm-0">
                <b-input-group-prepend is-text>
                    <b-icon icon="person-fill"></b-icon>
                </b-input-group-prepend>
                <!--b-form-input placeholder="ユーザ名" v-model="username" @keyup.enter="enterLogin"></b-form-input-->
                <b-form-input placeholder="メールアドレス" v-model="email" type="email" @keyup.enter="enterLogin" @blur="validateEmail"></b-form-input>
            </b-input-group>
            <b-input-group v-if="!this.$store.state.loginData.accessToken" class="mb-2 mr-sm-2 mb-sm-0">
                <b-input-group-prepend is-text>
                    <b-icon icon="lock-fill"></b-icon>
                </b-input-group-prepend>
                <b-form-input placeholder="パスワード" v-model="password" type="password" @keyup.enter="enterLogin"></b-form-input>
            </b-input-group>
            <b-button @click="clickLogin" @keyup.ctrl.enter="ctrlEnterLogin"
                v-if="!this.$store.state.loginData.accessToken">送信</b-button>
             <!--b-button @click="ctrlEnterLogin"
                v-if="!this.$store.state.loginData.accessToken">Next</b-button-->     
            <!-- b-button @click="logout" v-else>ログアウト</b-button -->
        </b-form>

        <div v-if="this.isShowAccessToken && this.$store.state.loginData.accessToken">
            <b-button @click="logout">ログアウト</b-button>
            <b-table :items="[this.$store.state.loginData]" :fields="fields"></b-table>
            <b-button @click="clickMenu" variant="info">メニュー</b-button>
        </div>

        <div id="message" v-if="message">
            <b-alert show variant="danger">{{message}}</b-alert>
        </div>
    </div>
</template>

<style scoped>
    #message {
        margin-top: 1rem;
    }
    table {
        margin-top: 1rem;
    }
</style>

<script>
import axios from 'axios'
import apiUrls from '../common/apiUrls'
import security from '../common/security'
import commonMethods from '../common/commonMethods'

//import bcrypt from 'bcryptjs'
export default {
    data() {
        return {
           // username: '',
            email: '',
            password: '',
            fields:  [
                    { key:   'username',    label: 'ユーザ名' }, 
                    { key:   'email',       label: 'メールアドレス' }, 
                    { key:   'password',    label: 'パスワード' }, 
                    { key:   'roles',       label: 'ロール' }, 
                    { key:   'accessToken', label: 'トークン' } 
                    ],
            message: '',
            isShowAccessToken: false,
        }
    },
    methods: {
        enterLogin() {
            this.clickLogin() ;
        },
        validateEmail() {
            this.message='';
            /*if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
                this.message= 'Please enter a valid email address';
            } */
        },
        async clickLogin() {
            await this.login();
            if (this.$store.state.loginData.id != '') {
                this.createMenuInfo();
                await this.referNameCollectionMany();
                commonMethods.saveCommonArea('modeTest', false)
                this.$router.push({path: '/menu'});
            }
        },
        ctrlEnterLogin() {
            this.isShowAccessToken = true;
            this.login();
        },
        async login() {
            //let hashed_password = bcrypt.hashSync(this.password, 10)
            //let hashed_password = this.getHash(this.password)
            let hashed_password = security.getHash(this.password)
            this.message = ''
            await axios.post(apiUrls.signIn,
            {
                //username: this.username,
                email: this.email,
                password: hashed_password
            })
            .then(response => {
                response.data.password = hashed_password
                this.$store.state.loginData = response.data
                /*
                requestParams.httpRequestHeaders = {
                    Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                    'Content-Type': 'application/json',
                    //'Access-Control-Allow-Origin': '*'
                }*/
            })
            .catch(error => {
                //console.log('error.response.data.code=' + error.response.data.code);
                //console.log('error.response.data.message=' + error.response.data.message);
                // ログイン処理のエラーは、error.response.data.statusにセットされないので、次のとおり表示する。
                this.message = commonMethods.getErrorMessage(error);
            })
        },
        async clickMenu() {
            this.isShowAccessToken = false;
            this.createMenuInfo();
            await this.referNameCollectionMany();
            commonMethods.saveCommonArea('modeTest', true)
            this.$router.push({path: '/menu'});
        },
        logout() {
            this.$store.state.loginData = {
                id:          '',
                username:    '',
                email:       '',
                roles:       [],
                accessToken: ''
            }
            this.$store.rolesResDt = [];
            this.$store.rolesResDt = null;
            this.$store.roleLevelsResDt = [];
            this.$store.roleLevelsResDt = null;
        },

     async referNameCollectionMany() {
            var reqDt = [];
            reqDt.push({nameSection: 'ProgressBackColorScreen'});
            reqDt.push({nameSection: 'VisibleMenuItem'});

            //基本リクエストを作成する
            let payload = {
                transId: "",
                resultCode: null,
                resultMessage: null,
                user: null,
                terminal: null,
                reqDateTime: null,
                resDateTime: null,
                reqDt: reqDt,
            };
            let axiosConfigObject = {
                headers: {
                    Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                    'Content-Type': 'application/json',
                },
            }
            await axios.post(apiUrls.referNameCollectionByPost, payload, axiosConfigObject).then((response) => {
                if(response.data.resultCode == '000') {
                    // console.log('response.data.resultCode=' + response.data.resultCode);
                    // 画面名をキーにした製品と工程の背景色を取得
                    let progressBackColorScreen = commonMethods.convertProgressBackColorScreen('ProgressBackColorScreen', response.data.resDt);
                    // 共通領域に背景色をセーブ
                    commonMethods.saveCommonArea('progressBackColorScreen', progressBackColorScreen);
                    // 画面名をキーにしてメニュ表示の可否を取得
                    let visibleMenuItem = this.getNameSection('VisibleMenuItem', response.data.resDt);
                    let menuInfoByName = commonMethods.loadCommonArea('menuInfoByName');
                    for (let name in visibleMenuItem) {
                        if (menuInfoByName[name]) {
                            menuInfoByName[name].visible = visibleMenuItem[name].nameLong == 'true' ? true : false;
                        }
                    }
                    // メニュ表示の可否を変更したmenuInfoByNameを共通領域にセーブ
                    commonMethods.saveCommonArea('menuInfoByName', menuInfoByName);
                    return;
                } else {
                    this.message = commonMethods.getResponseMessage(response);
                }
            })
            .catch(error => {
                this.message = commonMethods.getErrorMessage(error);
            })
        },
        // メニュのpathからnameとtitle、nameからpathとtitleとvisibleが取得できる連想配列を作成し共通領域にセーブ
        createMenuInfo() {
            let menuInfoByPath = {};
            let menuInfoByName = {};
            let routes = this.$router.options.routes;
            for(let route in routes) {
                // console.log('route=' + route + ', routes[route]=' + routes[route]);
                // console.log('routes[route].path=' + routes[route].path + ', routes[route].name=' + routes[route].name + ', routes[route].meta.title=' + routes[route].meta.title);
                menuInfoByPath[routes[route].path] = {'name': routes[route].name, 'title': routes[route].meta.title}
                menuInfoByName[routes[route].name] = {'path': routes[route].path, 'title': routes[route].meta.title, 'visible': true}
            }
            commonMethods.saveCommonArea('menuInfoByPath', menuInfoByPath);
            commonMethods.saveCommonArea('menuInfoByName', menuInfoByName);
        },
        // resDt.nameSection と resDtNameSection が一致する行の resDt.nameAlpha をキーにして、resDt.nameLongを値とした連想配列を返す
        getNameSection(resDtNameSection, resDt) {
            if (resDt != null) {
                let arrayNameSection = {};
                for(let r in resDt) {
                    let row = resDt[r];
                    // console.log('getNameSection() nameSection=' + row['nameSection'] + ', nameAlpha=' + row['nameAlpha'] + ', nameShort=' + row['nameShort'] + ', nameLong=' + row['nameLong']);
                    if (row['nameSection'] == resDtNameSection) {
                        // console.log('getNameSection() nameAlpha=' + row['nameAlpha']);
                        arrayNameSection[row['nameAlpha']] = {'nameLong': row['nameLong']};
                    }
                }
                return arrayNameSection;
            }
        }        
    }
}
</script>