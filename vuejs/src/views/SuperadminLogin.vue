 <template>
 <div class="container">
        
        <div class="row">
            <div class="col-lg-3 col-md-2"></div>
            
            
            <div class="col-lg-6 col-md-8 login-box">
               <div class="col-lg-12 super-admin-link">
                   <a href="#" @click="gotoLogin" class="link-primary">管理者・ユーザーログイン</a>       
                </div>
        
                <!--div class="col-lg-12 login-title">
                    管理者・ユーザー
                </div-->

                <div class="col-lg-12 login-form">
                    <div class="col-lg-12 login-form">
                        <b-form>
                            <div class="form-group">
                                <b-input-group v-if="!this.$store.state.loginData.accessToken" class="mb-2 mr-sm-2 mb-sm-0">
                                    <b-input-group-prepend is-text><b-icon icon="person-fill"></b-icon></b-input-group-prepend>
                                    <b-form-input placeholder="メールアドレス" v-model="email" type="email" @keyup.enter="enterLogin"></b-form-input>
                                </b-input-group>
                            </div>
                            <div class="form-group">
                                <b-input-group v-if="!this.$store.state.loginData.accessToken" class="mb-2 mr-sm-2 mb-sm-0">
                                    <b-input-group-prepend is-text><b-icon icon="lock-fill"></b-icon></b-input-group-prepend>
                                    <b-form-input placeholder="パスワード" v-model="password" type="password" @keyup.enter="enterLogin"></b-form-input>
                                </b-input-group>
                            </div>
              

                        </b-form>
                        <div class=" mb-2 mr-sm-2 mb-sm-0">
                            <b-button @click="clickLogin" @keyup.ctrl.enter="ctrlEnterLogin" v-if="!this.$store.state.loginData.accessToken">送信</b-button>
                        </div>
                        <br>
                        <div  class="mb-2 mr-sm-2 mb-sm-0" v-if="message">
                          <div>  
                           <b-alert show variant="danger">{{message}}</b-alert>
                          </div> 
                        </div>
                           

                        <div v-if="this.isShowAccessToken && this.$store.state.loginData.accessToken">
                            <b-button @click="logout">ログアウト</b-button>
                                <b-table :items="[this.$store.state.loginData]" :fields="fields"></b-table>
                            <b-button @click="clickMenu" variant="info">メニュー</b-button>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-2"></div>
            </div>
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

.login-box {
    margin-top: 75px;
    height: auto;
    background: #f1f4f5;
    text-align: center;
   
}

.super-admin-link {
    margin-top: 5px;
    text-align: right;
    font-size: 15px;
    letter-spacing: 2px;
    font-weight: bold;
}


.link:hover {
  color: #4808f7;
}

.login-title {
    margin-top: 15px;
    text-align: center;
    font-size: 30px;
    letter-spacing: 2px;
    margin-top: 15px;
    font-weight: bold;
    color: #0e0f0f;
}

.login-form {
    margin-top: 25px;
    text-align: left;
}

input{
    background-color: #ECF0F5;
    
    border-color:#abaeaf;
    border-top: 0px;
    border-radius: 0px;
    font-weight: bold;
    outline: 0;
    margin-bottom: 20px;
    padding-left: 0px;
    color: #ECF0F5;
}

.form-group {
    margin-bottom: 40px;
    outline: 0px;
}

label {
    margin-bottom: 0px;
}

.form-control-label {
    font-size: 10px;
    color: #6C6C6C;
    font-weight: bold;
    letter-spacing: 1px;
}

.login-btm {
    float: left;
}

.login-button {
    padding-right: 0px;
    text-align: right;
    margin-bottom: 25px;
}

.login-text {
    text-align: left;
    padding-left: 0px;
    color: #A2A4A4;
}

.loginbttm {
    padding: 0px;
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
        gotoLogin(){
            this.$router.push({path: '/'});
        },
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
                this.$router.push({path: '/superadminmenu'});
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
            this.$router.push({path: '/superadminmenu'});
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