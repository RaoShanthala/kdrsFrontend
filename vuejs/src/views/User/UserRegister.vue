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
                <b-col class="col-md-5" >
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
            <b-button @click="registerUser">登録</b-button>
        </div>
    </div>
</template>

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
            message: '',
            view: {
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
              //  authorityType:'3',              
            },
           /* authorityList:[
                { value: 3, text: '一般ユーザー' },
                { value: 2, text: '管理者' },
                { value: 4, text: 'ユーザーと管理者' },
            
            ], */
        }
    },
    created() {
        //this.setRoles();
       // this.setAuthorityList();
    },
    methods: {
     
      /*  setAuthorityList() {
            let resDt= commonMethods.loadCommonArea('roleLevel');
            if (resDt) {
                for(let i in resDt) { 
                    this.roleLevels.push({'value': resDt[i].codeNumeric, 'text': resDt[i].nameShort});
                }
                this.roleLevels.push({ value: '', text: '' });
            } else {
                console.log('setRoleLevels() commonMethods.loadCommonArea(\'roleLevel\') is nothing !');
            }          
        }, */

        registerUser() {
            this.message = ''
            var authorityType = '';
            if (confirm('登録しますか？')) {
              if(this.view.password !== this.view.passwordConfirm) {
                    alert('パスワードとパスワード（確認）が一致していません。')
              }else if(this.view.userAuth == false && this.view.adminAuth == false){
                  alert('ユーザまたは管理者チェックボクス選択してください。')
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
                        companyId: this.$store.state.loginData.companyId,
                        sei: this.view.sei,
                        mei: this.view.mei,
                        seiKana: this.view.seiKana,
                        meiKana: this.view.meiKana,
                        password:  this.view.password != '' ? security.getHash(this.view.password) : '',
                        email:     this.view.email,
                        phone : this.view.phone,
                        prefacture : this.view.prefacture,
                        city : this.view.city,
                        streetNumber : this.view.streetNumber,
                        buildingName: this.view.buildingName,
                        authority: authorityType,
                    }
                }
                //画面で権限レベルが指定されている(0以外)場合、リクエストにreqDtを追加する
              /*  if(this.view.roles[0].roleLevel >  0 || this.view.roles[1].roleLevel >  0) { payload.reqDt = [] }
                if(this.view.roles[0].roleLevel >  0 && this.view.roles[1].roleLevel >  0) { payload.reqDt =  this.view.roles }
                if(this.view.roles[0].roleLevel >  0 && this.view.roles[1].roleLevel == 0) { payload.reqDt[0] = this.view.roles[0] }
                if(this.view.roles[0].roleLevel == 0 && this.view.roles[1].roleLevel >  0) { payload.reqDt[0] = this.view.roles[1] } */

                let axiosConfigObject = {
                    headers: {
                        Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                        'Content-Type': 'application/json',
                    }
                }

                
                axios.post(apiUrls.registUser, payload, axiosConfigObject)
                .then((response) => {
                    if(response.data.resultCode != '000') {
                        this.message = commonMethods.getResponseMessage(response);
                    }
                    else {
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
        }
    }
}
</script>