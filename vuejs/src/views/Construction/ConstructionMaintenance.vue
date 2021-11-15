<template>
    <div>
      <div>
        <comp-construction-search 
            :const-settings="constSettings"
            v-on:emitConstSearchButton="emittedConstSearchButton"
            v-on:emitConstSelect="emittedConstSelect"

        />
            <!--  :class-print-hide-const="classPrintHideConst"
            :revertTableContent="revertTableContent"
            
            v-on:emitConstSelect="emittedConstSelect"
            v-on:emitUpdateConst="emittedUpdateConst"
            v-on:emitConstPrintButton="emittedConstPrintButtonEvent" -->  
            <!-- v-on:searchData="searchData" -->
            <!-- v-on:emitSelctedconstId = "emittedSelctedconstId" -->
            <!-- v-on:emitShowOtherData="emittedShowOtherData" -->
      </div>

      <div v-if="this.privConstSearchForm.isShowPrivConstTable">
          <b-card bg-variant="light">
              <b-form>
                  <b-container>
                     <b-row class="justify-content-md-center">
                        <b-col class="col-md-1"></b-col>

                        <b-col class="col-md-4">
                            <div > <!--v-if="isAggregateUnitPresent"-->
                                <table style="width: 100%">
                                    <div>
                                       
                                         <tr>
                                            <td style="text-align: left; vertical-align: left">
                                            <b-form inline class="mt-3"> 
                                              <b-form-group  label="工事名称:" class="mr-3 space">
                                                  <label >{{this.constInput.constName}}</label>    
                                               </b-form-group>
                                               <b-form-group label="工事コード:" class="mr-3 spaceMore">
                                                  <label >{{this.constInput.constCode}}</label>
                                               </b-form-group>
                                            </b-form>   
                                            </td>
                                        </tr>
                                        <tr class="blank_row">
                                            <td colspan="2"></td>
                                        </tr>
                                        <br>
                                        <tr>
                                            <td style="text-align: left; vertical-align: left">
                                                <label>プライベート工事一覧</label>
                                            </td>
                                        </tr>
                                        <tr v-if="this.constOptions.length">
                                            <td style="width: 900px; ">
                                                <div id="table-scroll">
                                                    <table class="table-sm table-bordered text-nowrap"  style="width: 100%; table-layout: fixed">
                                                        <tr>
                                                            <th class="highlight" style="width: 5%"></th>
                                                            <th class="highlight" style="width: 45%">プライベート工事名称</th>
                                                            <th class="highlight" style="width: 45%">ユーザー名称</th>
                                                        </tr>
                                                        <tr v-for="option in constOptions" v-bind:key="option.privConstId">
                                                            <td><label><input type="checkbox" :value="option.privConstId" v-model="deleteConstIdList"/></label></td>
                                                            <td>{{ option.privConstName }} </td>
                                                            <td>{{ option.userName }} </td>
                                                        </tr> 
                                                                                                          
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>            
                                    </div>
                                    <div v-if="this.constOptions.length"  style="float: right; margin-top: 0.4rem;">
                                       <b-button class="mr-1" @click="deleteConstructionId">削除</b-button>
                                    </div>   
                                </table>
                            </div>
                            <b-alert class="mt-4" v-if="constMessage" show variant="danger">{{ constMessage }}</b-alert> 
                        </b-col>


                        <b-col class="col-md-1"></b-col>
                        <!--b-col class="col-md-1"></b-col-->
                                
                        <b-col class="col-md-5">
                            <div > <!--v-if="isAggregateUnitPresent"-->
                                <table style="width: 100%">
                                    <div>
                                         <tr>
                                            <td style="text-align: left; vertical-align: left">
                                            <b-form  inline class="mt-0"> 
                                              <b-form-group  label="プライベート工事名称" class="mr-3">
                                                <b-form-input id="constNameSearch" v-model="constNameSearch"/>
                                               </b-form-group>
                                               <b-form-group label="ユーザー名称" class="mr-3">
                                                <b-form-input id="userNameSearch" v-model="userNameSearch"/>
                                               </b-form-group>
                                               <b-form-group class="mt-4 mr-1">
                                                    <div style="margin-top: 0.4rem;">
                                                        <b-button @click="searchConstruction" class="mr-1">検索</b-button>
                                                        <b-button variant="outline-primary" @click="clearSearchForm">クリア</b-button>
                                                    </div>
                                                </b-form-group>        
                                            </b-form>
                                            </td>
                                        </tr>
                        
                                        <br>
                                        <div v-if="isPrivConstructionPresent">
                                        <tr>
                                            <td style="text-align: left; vertical-align: left">
                                                <label>プライベート工事一覧</label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="width: 900px">
                                                <div id="table-scroll">
                                                    <table class="table-sm table-bordered text-nowrap"  style="width: 100%; table-layout: fixed">
                                                        <tr>
                                                            <th class="highlight" style="width: 5%"></th>
                                                            <th class="highlight" style="width: 45%">プライベート工事名称</th>
                                                            <th class="highlight" style="width: 45%">ユーザー名称</th>
                                                        </tr>      
                                                        <tr v-for="option in constAllOptions" v-bind:key="option.privConstId">
                                                            <td><label><input type="checkbox" :value="option.privConstId" v-model="addConstIdList"/></label></td>
                                                            <td>{{ option.privConstName }} </td>
                                                            <td>{{ option.userName }} </td>
                                                        </tr>                                                             
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>  
                                        </div>
                                        <b-alert class="mt-4" v-if="constAllMessage" show variant="danger">{{ constAllMessage }}</b-alert>                                         
                                    </div>

                                    <div v-if="this.constAllOptions.length"  style="float: right; margin-top: 0.4rem;">
                                       <b-button class="mr-1" @click="addConstructionId">登録</b-button>
                                    </div>
                                   
                                </table>
                            </div>
                        </b-col>

                        <b-col class="col-md-1"></b-col>
                    </b-row>
                  
                 </b-container>
              </b-form>          
          </b-card>    
      </div>        
    </div>  
</template>

<style scoped>
    .space{
        padding-left: 30px ;
    }
    .blank_row {
        height: 6px !important; /* overwrites any other rules */
        /* background-color: #FFFFFF;*/
    }
    .spaceMore{
        padding-left: 110px ;
    }
    .highlight {
        background-color: darkgray;
    }
    /* 印刷ボタンのマージン設定 */
    .b-table-sticky-header, .table-responsive, [class*=table-responsive-] {
        margin-bottom: 0.5rem;
    }
    .col > p {
        margin-bottom: 0.5rem;
    }
    #table-scroll {
        height: 300px;
        overflow: auto;
        margin-top: 0px;
        border: 1px solid black;      
    }
    th {
      position: sticky;
      top: 0; /* Don't forget this, required for the stickiness */
      box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
}
    
</style>

<script>
import axios from 'axios'
import apiUrls from '../../common/apiUrls'
import commonMethods from '../../common/commonMethods'
import compConstructionSearch from "@/components/compConstructionSearch.vue";

export default {
    components: {
        compConstructionSearch
    },
 data() {
        return {
            constInput: {
                constCode: '',
                constName: '',
                targetState: '1',
                startDateBegin: '',
                endDateBegin: '',
                startDateComplete: '',
                endDateComplete: '',
                selectedRowConstId: '',
            },
            constSettings: { maintenanceMode: true, targetState: 1},
            revertTableContent : false,
           
            //プライベート工事検索データ   
            privConstSearchForm: {
                constId:'',
                privConstName:'',
                userName:'',
                isShowPrivConstSearch:false,
                isShowPrivConstTable: '',
            },
    
            constOptions:[{     
                        privConstId: '',
                        privConstName:'',
                        userName:''
                    }],
            constAllOptions: [{     
                        privConstId: '',
                        privConstName:'',
                        userName:''
                    }], 
         
            construction: {},
    
            message: '',
            time: this.getTime(),
            table_height: window.innerHeight - 360 + 'px',
            constSearchButtonCount: 0,
            isLoadingProd: false,
            currentMenuName:'',

            constNameSearch:'',
            userNameSearch: '',
            isPrivConstructionPresent: false,
            constMessage : '',
            constAllMessage : '',

            addConstIdList:[],
            deleteConstIdList:[],
    
        }
    },
   
   created: function() {
      
        if(!this.$store.state.loginData.accessToken) {
            this.$router.push('/')
        }
        this.currentMenuName = commonMethods.getCurrentMenu();
     
        if (this.$store.state.responseData) {
            this.construction = this.$store.state.responseData
        } 
    },

    async mounted() {
        window.addEventListener('resize', () => {
            this.table_height = window.innerHeight - 360 + 'px'
        })  
      
        await this.$nextTick(); // waits for the component to load
       //  alert(this.constSettings.maintenanceMode);
    },
                        
    methods: {
        emittedConstSearchButton(value) {
             this.constSearchButtonCount = value;
          //   this.privConstSearchForm.isShowPrivConstSearch = false;
          //   this.privConstData = [];
             this.message = '';
            this.privConstSearchForm.isShowPrivConstTable = false;
        },

        emittedConstSelect(value) {
            // 工事一覧の行を選択したときの他、工事、製品の更新削除画面から戻ったときにも呼び出される。
            if (value.constId) {
                this.construction = value;
             //   this.privConstSearchForm.isShowPrivConstSearch = true;
                this.privConstSearchForm.isShowPrivConstTable = true;
                 if (value.constId != this.constInput.selectedRowConstId) {
                    this.privConstSearchForm.constId = value.constId;
                    this.constInput.selectedRowConstId = value.constId;
                    this.reset();
                    this.constInput.constName = value.constName;
                    this.constInput.constCode = value.constCode;
                }            
               this.getConstIdPrivConstData();
            } else {
                this.construction = {};
                this.privConstSearchForm.isShowPrivConstTable = false;
                this.constInput.selectedRowConstId = '';
                this.reset();
            }           
        },

        reset(){
         
            this.isPrivConstructionPresent = false;
            this.constAllOptions = [];
            this.addConstIdList=[];
            this.constAllMessage = '';
            this.constNameSearch = '';
            this.userNameSearch = '';
        },

        async getConstIdPrivConstData(){
             await this.getConstIdPrivConstList(1); 

            if (this.privConstSearchForm.isShowPrivConstTable != true) {
                return;
            }
                      
        },

        async searchConstruction(){
            await this.getConstIdPrivConstList(2); 
        },

        async getConstIdPrivConstList(searchType) {
            if (searchType == 1){
              this.isLoadingPrivConst = true;
              this.constMessage = '';
              this.constOptions = [];
              this.deleteConstIdList = [];
            }else{
              this.isPrivConstructionPresent = false;
              this.constAllOptions = [];
              this.addConstIdList = [];
              this.constAllMessage = '';
            } 

            let payload;
            
            if (searchType == 1){
              payload = {
                constId: this.privConstSearchForm.constId,
                searchType: searchType
             }
            }else{
               payload = {
                privConstName: this.constNameSearch,  
                userName:  this.userNameSearch,
                searchType: searchType
             }
            }
            let axiosConfigObject = {
                headers: {
                    Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                    'Content-Type': 'application/json',
                },
                params:  payload
            }
            await axios.get(apiUrls.referPrivConstList, axiosConfigObject).then(response => {    
                if(response.data.resultCode != '000') {
                    if (searchType == 1){
                        this.constMessage = commonMethods.getResponseMessage(response);
                    }else{
                        this.constAllMessage = commonMethods.getResponseMessage(response);
                    }    
                    
                } else {
                    var data = [];
                    data = response.data.resDt;
                    if (data.length > 0) {
                        if (searchType == 1){
                             this.constOptions = data;
                           /* for (var i = 0; i < data.length; i++) {           
                                this.deleteConstIdList.push(data[i].privConstId);
                            } */   
                        }else{
                                this.isPrivConstructionPresent = true;
                                this.constAllOptions = data;
                              //  this.constAllOptions.push({text: data[i].privConstName, value: data[i].userName});  
                        } 
                    }
                          
                
                }        
            })
            .catch(error => {
                this.message = commonMethods.getErrorMessage(error);
            })       
        },

        async deleteConstructionId(){
            this.constAllMessage = "";
            if (this.deleteConstIdList.length == 0){
                alert ("プライベート工事を選択してください");
            }else{
            if (confirm("削除しますか？")) {
                //基本リクエストを作成する
                let payload = {
                    transId: "",
                    resultCode: null,
                    resultMessage: null,
                    user: null,
                    terminal: null,
                    reqDateTime: null,
                    resDateTime: null,
                    reqHd: {
                        constId: this.privConstSearchForm.constId, 
                        action: 2,       
                    },
                    reqDt: {
                        privConstId: this.deleteConstIdList
                    } 
                };
                
                let axiosConfigObject = {
                    headers: {
                        Authorization: "Bearer " + this.$store.state.loginData.accessToken,
                        "Content-Type": "application/json",
                    },
                };
                axios.post(apiUrls.deleteConstIds, payload, axiosConfigObject)
                .then((response) => {
                    if (response.data.resultCode != "000") {
                        this.constAllMessage = commonMethods.getResponseMessage(response);
                    } else {
                        alert(response.data.resultMessage);
                        this.getConstIdPrivConstList(1); 
                        this.getConstIdPrivConstList(2); 
                     }
                })
                .catch((error) => {
                    this.message = commonMethods.getErrorMessage(error);
                });
            }
            } 
        },

        async addConstructionId() {
            this.constAllMessage = "";
            if (this.addConstIdList.length == 0){
                alert ("プライベート工事を選択してください");
            }else{
            if (confirm("登録しますか？")) {
                //基本リクエストを作成する
                let payload = {
                    transId: "",
                    resultCode: null,
                    resultMessage: null,
                    user: null,
                    terminal: null,
                    reqDateTime: null,
                    resDateTime: null,
                    reqHd: {
                        constId: this.privConstSearchForm.constId, 
                        action: 1,       
                    },
                    reqDt: {
                        privConstId: this.addConstIdList
                    } 
                };
                
                let axiosConfigObject = {
                    headers: {
                        Authorization: "Bearer " + this.$store.state.loginData.accessToken,
                        "Content-Type": "application/json",
                    },
                };
                axios.post(apiUrls.addConstIds, payload, axiosConfigObject)
                .then((response) => {
                    if (response.data.resultCode != "000") {
                        this.constAllMessage = commonMethods.getResponseMessage(response);
                    } else {
                        alert(response.data.resultMessage);
                        this.getConstIdPrivConstList(1); 
                        this.getConstIdPrivConstList(2); 
                     }
                })
                .catch((error) => {
                    this.message = commonMethods.getErrorMessage(error);
                });
            }
            }
        },
   
        clearSearchForm(){
           console.log ("clearForm  11");
            this.constNameSearch = '';
            this.userNameSearch = '';
            this.constAllOptions=[];
            this.addConstIdList=[];
            this.isPrivConstructionPresent=false;
            console.log ("clearedForm  11");
        },

        getNow() {
            let today = new Date(Date.now())
            //return today.toISOString().slice(0, 10);
            let diff = today.getTimezoneOffset() * 60 * 1000;    // -540 * 60 * 1000 = -32400000 (ミリ秒)
            let localToday = new Date(today - diff);
            return localToday.toISOString().slice(0, 10)
        },

        getTime() {
            let today = new Date(Date.now())
            return today.toTimeString().slice(0,8)
        },     

        //カラム作成・並べ替え関数
        createFields(obj, order) {
            let a = [];
            let b = [];
            for(let i in obj) { a.push( {'key': i, 'label': obj[i]} ); }
            if(order) {
                for(let i in order) { b.push(a[order[i]]); }
                return b;
            }
            a.push( {'key': 'update', 'label': '', 'required': 'true' } )
            return a;
        },

        // resetProjForm() {
        //     this.prodSearchForm.prodCode = '';
        //     this.prodSearchForm.prodName = '';
        // },  
    }
}
</script>
          