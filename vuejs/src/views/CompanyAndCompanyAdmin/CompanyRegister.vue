<template>
    <div>
      <div class="container-fluid">
        <b-card bg-variant="light">
            <b-row>
                <b-col class="col-md-5">
                    <b-form-group label="企業コード" label-for="input-code" label-cols-sm="3" label-align-sm="right">
                        <b-form-input id="input-code" v-model="view.companyCode" />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col class="col-md-5">
                    <b-form-group label="企業名" label-for="input-name" label-cols-sm="3" label-align-sm="right">
                        <b-form-input id="input-name" v-model="view.companyName" />
                    </b-form-group>
                </b-col>
                <b-col class="col-md-5">
                    <b-form-group label="企業名カナ" label-for="input-namekana" label-cols-sm="3" label-align-sm="right">
                        <b-form-input id="input-namekana" v-model="view.companyNameKana" />
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
            <b-button @click="registerCompany">登録</b-button>
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
import commonMethods from '../../common/commonMethods'

export default {
    data() {
        return {
            message: '',
            view: {
                companyCode: '',
                companyName:       '',
                companyNameKana:       '',
                phone:       '',
                prefacture:  '',
                city: '',
                streetNumber:'',
                buildingName:'',               
            },
         
        }
    },
  
    methods: {

        registerCompany() {
            this.message = ''
            
            if (confirm('登録しますか？')) {

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
                        companyCode: this.view.companyCode,
                        companyName: this.view.companyName,
                        companyNameKana: this.view.companyNameKana,
                        phone : this.view.phone,
                        prefacture : this.view.prefacture,
                        city : this.view.city,
                        streetNumber : this.view.streetNumber,
                        buildingName: this.view.buildingName
                    }
                }    
                let axiosConfigObject = {
                    headers: {
                        Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                        'Content-Type': 'application/json',
                    }
                }               
                axios.post(apiUrls.registerCompany, payload, axiosConfigObject)
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
</script>