<template>
    <div>
        <div class="container-fluid">
            <b-card bg-variant="light">
                <b-row>
                    <b-col class="col-md-5">
                        <b-form-group label="姓" label-for="input-sei" label-cols-sm="3" label-align-sm="right">
                            <b-form-input id="input-sei" v-model="view.sei" />
                        </b-form-group>
                    </b-col>
                    <b-col class="col-md-5">
                        <b-form-group label="名" label-for="input-mei" label-cols-sm="3" label-align-sm="right">
                            <b-form-input id="input-mei" v-model="view.mei" />
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col class="col-md-5">
                        <b-form-group label="セイ" label-for="input-sei_kana" label-cols-sm="3" label-align-sm="right">
                            <b-form-input id="input-sei_kana" v-model="view.seiKana" />
                        </b-form-group>
                    </b-col>
                    <b-col class="col-md-5">
                        <b-form-group label="メイ" label-for="input-mei_kana" label-cols-sm="3" label-align-sm="right">
                            <b-form-input id="input-mei_kana" v-model="view.meiKana" />
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col class="col-md-5">
                        <b-form-group label="メールアドレス" label-for="input-email" label-cols-sm="3" label-align-sm="right">
                            <b-form-input id="input-email" type="email" v-model="view.email" />
                        </b-form-group>
                    </b-col>
                    <b-col class="col-md-5">
                        <b-form-group label="ユーザ" label-for="input-email" label-cols-sm="3" label-align-sm="right">
                            <div class="col-sm-2">
                                <input class="form-control" type="checkbox"  v-model="view.userAuth" id="chkbox">
                            </div>
                        </b-form-group>
                        <b-form-group label="管理者" label-for="input-email" label-cols-sm="3" label-align-sm="right">
                            <div class="col-sm-2">
                                <input  class="form-control" type="checkbox"  v-model="view.adminAuth" id="chkbox">
                            </div>
                        </b-form-group> 
                    </b-col>
                </b-row>
                <b-row>
                    <b-col class="col-md-5">
                        <b-form-group label="パスワード" label-for="input-password" label-cols-sm="3" label-align-sm="right">
                            <b-form-input id="input-password" type="password" v-model="view.password" />
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col class="col-md-5">
                        <b-form-group label="パスワード（確認）" label-for="inpu-password-confirm" label-cols-sm="3" label-align-sm="right">
                            <b-form-input id="input-password-confirm" type="password" v-model="view.passwordConfirm" />
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col class="col-md-5">
                        <b-form-group label="電話番号" label-for="input-phone" label-cols-sm="3" label-align-sm="right">
                            <b-form-input id="input-phone"  v-model="view.phone" />
                        </b-form-group>
                    </b-col>
                    <b-col class="col-md-5">
                        <b-form-group label="都道府県" label-for="input-prefacture" label-cols-sm="3" label-align-sm="right">
                            <b-form-input id="input-prefacture"  v-model="view.prefacture" />
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col class="col-md-5">
                        <b-form-group label="市区町村" label-for="input-city" label-cols-sm="3" label-align-sm="right">
                            <b-form-input id="input-city"  v-model="view.city" />
                        </b-form-group>
                    </b-col>
                    <b-col class="col-md-5">
                        <b-form-group label="丁番地" label-for="input-street-number" label-cols-sm="3" label-align-sm="right">
                            <b-form-input id="input-street-number"  v-model="view.streetNumber" />
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col class="col-md-5">
                        <b-form-group label="建物名" label-for="input-building-name" label-cols-sm="3" label-align-sm="right">
                            <b-form-input id="input-building-name"  v-model="view.buildingName" />
                        </b-form-group>
                    </b-col>
                    <b-col class="col-md-5">
                    </b-col>
                </b-row>       
            </b-card>
        </div>
        <b-alert v-if="message" show variant="danger">{{ message }}</b-alert>
        <div class="text-right mt-1">
            <b-button :disabled="!responseData" @click="updateUser" class="mr-1">更新</b-button>
            <span v-if="responseData.resHd.email != $store.state.loginData.username">
                <b-button :disabled="!responseData" @click="deleteUser" class="mr-1">削除</b-button>
            </span>
        </div>
    </div>
</template>
<style scoped>
    input[type="date"] {
        width: 180px;
    }
</style>

<style scoped>
 input#chkbox:focus{
  box-shadow:none;
}
input#chkbox {
    width: 40%;  
}
</style>

<script>
import axios from 'axios'
import apiUrls from '../../common/apiUrls'
import security from '../../common/security'
import commonMethods from '../../common/commonMethods'

export default {
    data() {
        return {
           responseData: '',
            view: {
                userId : '',
                sei:       '',
                mei:       '',
                seiKana:       '',
                meiKana:       '',
                password:        '',
                passwordConfirm: '',
                email:           '',
                phone:       '',
                prefacture:  '',
                city: '',
                streetNumber:'',
                buildingName:'', 
                userAuth:false,
                adminAuth:false,        
               // authorityType:'3',              
            },
           /* authorityList:[
                { value: 3, text: '一般ユーザー' },
                { value: 2, text: '管理者' },
                { value: 4, text: 'ユーザーと管理者' },
            
            ],*/
            message: '',          
        }
    },
    created: function() {  
        if(this.$store.state.responseData) {
            this.responseData = this.$store.state.responseData
            this.view.userId = this.responseData.resHd.userId
            this.view.sei = this.responseData.resHd.sei
            this.view.mei      = this.responseData.resHd.mei
            this.view.seiKana = this.responseData.resHd.seiKana
            this.view.meiKana      = this.responseData.resHd.meiKana
           // this.view.password = this.responseData.resHd.password
            this.view.email = this.responseData.resHd.email
            this.view.phone = this.responseData.resHd.phone
            this.view.prefacture = this.responseData.resHd.prefacture
            this.view.city = this.responseData.resHd.city
            this.view.streetNumber = this.responseData.resHd.strretNumber
            this.view.buildingName = this.responseData.resHd.buildingName
            if (this.responseData.resHd.authorityType == 3){
                this.view.userAuth = true;
            }else if (this.responseData.resHd.authorityType == 2){
                this.view.adminAuth = true;
            }else{
                this.view.userAuth = true;
                this.view.adminAuth = true;
            }
          //  this.view.authorityType = this.responseData.resHd.authorityType
        } 
    },
    methods: {       
        updateUser() {
          //  let responseData = Object.assign({}, this.responseData)
            var authorityType = '';
            if (confirm('更新しますか？')) {
                if(this.view.password != '' && this.view.password !== this.view.passwordConfirm) {
                    alert('パスワードとパスワード（確認）が一致していません。')
                }else if(this.view.userAuth == false && this.view.adminAuth == false){
                    alert('ユーザまたは管理者チェックボクス選んでください。')
                } else {
                    if (this.view.userAuth == true && this.view.adminAuth == true){
                        authorityType = 4;
                    }else if(this.view.userAuth == true){
                        authorityType = 3;
                    }else if (this.view.adminAuth == true){
                        authorityType = 2;
                    }    
                //基本リクエストを作成する
                    let payload = {
                        transId: '',
                        resultCode: null,
                        resultMessage: null,
                        user: null,
                        terminal: null,
                        reqDateTime: null,
                        resDateTime: null,
                        reqHd: {
                            userId : this.view.userId,
                            companyId: this.$store.state.loginData.companyId,
                            email:     this.view.email,
                            sei: this.view.sei,
                            mei: this.view.mei,
                            seiKana: this.view.seiKana,
                            meiKana: this.view.meiKana,
                            password:  this.view.password != '' ? security.getHash(this.view.password) : '',       
                            phone : this.view.phone,
                            prefacture : this.view.prefacture,
                            city : this.view.city,
                            streetNumber : this.view.streetNumber,
                            buildingName: this.view.buildingName,
                            authority: authorityType,
                        }                   
                    }          
                    let axiosConfigObject = {
                      headers: {
                        Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                        'Content-Type': 'application/json',
                      }
                    }
                    axios.put(apiUrls.modifyUser, payload, axiosConfigObject)
                    .then((response) => {
                        if(response.data.resultCode != '000') {
                            this.message = commonMethods.getResponseMessage(response);
                        } else {
                            alert(response.data.resultMessage)
                            this.$store.state.responseData = ''
                            //this.$router.push('users')
                            commonMethods.clickMenuBack();
                        }
                    })
                    .catch(error => {
                        this.message = commonMethods.getErrorMessage(error);
                    })
                }
            }
        },

        deleteUser() {
            if (confirm('削除しますか？')) {
                let payload = {
                    tranId:        '',
                    resultCode:    null,
                    resultMessage: null,
                    user:          null,
                    terminal:      null,
                    reqDateTime:   null,
                    resDateTime:   null,
                    reqHd: {
                        userId:  this.view.userId,
                    }
                }
                let axiosConfigObject = {
                    headers: {
                        Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                        'Content-Type': 'application/json',
                    },
                    data:    payload
                }
                axios.delete(apiUrls.removeUser, axiosConfigObject)
                .then((response) => {
                    if(response.data.resultCode != '000') {
                        this.message = commonMethods.getResponseMessage(response);
                        this.searchUser();
                    } else {
                        alert(response.data.resultMessage)
                        this.$store.state.responseData = ''
                        //this.$router.push('users')
                        commonMethods.clickMenuBack();
                    }
                })
                .catch(error => {
                    this.message = commonMethods.getErrorMessage(error);
                })
            }
        },

    }
}
</script>