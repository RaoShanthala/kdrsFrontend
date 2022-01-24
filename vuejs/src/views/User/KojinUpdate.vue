<template>
    <div>
        <div class="container-fluid">

        <b-card bg-variant="light">
           <div v-if="isLoaded">
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
                        <b-form-input id="input-mei_kana" v-model="view.meiKana" autocomplete="chrome-off"/>
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
           </div>      
        </b-card>
        </div>

        <b-alert v-if="message" show variant="danger">{{ message }}</b-alert>

        <div class="text-right mt-1">
            <b-button :disabled="!responseData" @click="updateUser" class="mr-1">更新</b-button>
        </div>
    </div>
</template>
<style scoped>
    input[type="date"] {
        width: 180px;
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
           isLoaded: false,
            view: {
                userId : '',
                sei:       '',
                mei:       '',
                seiKana:       '',
                meiKana:       '',
                password:        '',
                passwordConfirm: '',
                phone:       '',
                prefacture:  '',
                city: '',
                streetNumber:'',
                buildingName:'', 
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
    mounted() {
        this.init();
    },    

    methods: {

       async init(){
         await this.getUserInfo();  
       } , 

       async getUserInfo() {
           this.isLoaded = false;
           this.responseData = '';
            // this.$store.state.searchForm = this.searchForm
            let payload = {
                companyId: this.$store.state.loginData.companyId, 
                userId: this.$store.state.loginData.id
            }
            let axiosConfigObject = {
                headers: {
                    Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                    'Content-Type': 'application/json',
                },
                params:  payload
            }

            await axios.get(apiUrls.referUserOne, axiosConfigObject)
            .then(response => {
                if(response.data.resultCode != '000') {
                    this.message = commonMethods.getResponseMessage(response);
                }
                else {   
                    this.responseData = response.data;      
                    this.view.userId = this.$store.state.loginData.id
                    this.view.sei = response.data.resHd.sei
                    this.view.mei      = response.data.resHd.mei
                    this.view.seiKana = response.data.resHd.seiKana
                    this.view.meiKana      = response.data.resHd.meiKana
                    this.view.phone = response.data.resHd.phone
                    this.view.prefacture = response.data.resHd.prefacture
                    this.view.city = response.data.resHd.city
                    this.view.streetNumber = response.data.resHd.strretNumber
                    this.view.buildingName = response.data.resHd.buildingName
                    this.isLoaded = true;
                }
            })
            .catch(error => {
                this.message = commonMethods.getErrorMessage(error);
            })
        },
       
        updateUser() {
          //  let responseData = Object.assign({}, this.responseData)
        
            if (confirm('更新しますか？')) {
                if(this.view.password !== this.view.passwordConfirm) {
                    alert('パスワードとパスワード（確認）が一致していません。')
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


    
}
</script>