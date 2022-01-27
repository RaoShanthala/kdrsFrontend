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
            <b-button :disabled="!responseData" @click="updateCompany" class="mr-1">更新</b-button>
            <b-button :disabled="!responseData" @click="deleteCompany" class="mr-1">削除</b-button>         
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import apiUrls from '../../common/apiUrls'
import commonMethods from '../../common/commonMethods'

export default {
    data() {
        return {
           responseData: '',
            view: {
                companyId : '',
                companyCode: '',
                companyName:       '',
                companyNameKana:       '',
                phone:       '',
                prefacture:  '',
                city: '',
                streetNumber:'',
                buildingName:'',            
            },
            message: '',          
        }
    },
    created: function() {
        if(this.$store.state.responseData) {
            this.responseData = this.$store.state.responseData;
            this.view.companyId = this.responseData.resDt.companyId
            this.view.companyCode = this.responseData.resDt.companyCode
            this.view.companyName = this.responseData.resDt.companyName
            this.view.companyNameKana = this.responseData.resDt.companyNameKana
            this.view.phone = this.responseData.resDt.phone
            this.view.prefacture = this.responseData.resDt.prefacture
            this.view.city = this.responseData.resDt.city
            this.view.streetNumber = this.responseData.resDt.strretNumber
            this.view.buildingName = this.responseData.resDt.buildingName 
        }

    },
    methods: {       
        updateCompany() {
          //  let responseData = Object.assign({}, this.responseData)
            if (confirm('更新しますか？')) {
                  
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
                        companyId: this.view.companyId,
                        companyCode:this.view.companyCode,
                        companyName: this.view.companyName,
                        companyNameKana: this.view.companyNameKana,
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
                axios.put(apiUrls.modifyCompany, payload, axiosConfigObject)
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
        },

        deleteCompany() {
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
                        companyId:  this.view.companyId,
                    }
                }
                let axiosConfigObject = {
                    headers: {
                        Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                        'Content-Type': 'application/json',
                    },
                    data:    payload
                }
                axios.delete(apiUrls.removeCompany, axiosConfigObject)
                .then((response) => {
                    if(response.data.resultCode != '000') {
                        this.message = commonMethods.getResponseMessage(response);
                        this.searchUser();
                    } else {
                        alert(response.data.resultMessage)
                        this.$store.state.responseData = ''
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