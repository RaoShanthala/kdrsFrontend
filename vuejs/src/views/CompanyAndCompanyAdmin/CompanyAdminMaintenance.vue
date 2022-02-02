<template>
    <div>
        <b-card bg-variant="light">   
            <b-row>  
                <b-col class="col-md-11">   
                    <b-form inline class="mt-0">
                        <b-form-group  label="企業コード" class="mr-3">
                            <b-form-input id="companyCode" v-model="searchForm.companyCode"/>
                        </b-form-group>
                        <b-form-group label="企業名称" class="mr-3">
                            <b-form-input id="companyName" v-model="searchForm.companyName"/>
                        </b-form-group>        
                        <b-form-group class="mt-4 mr-1">
                            <div style="margin-top: 0.4rem;">
                                <b-button @click="searchCompany(null)" class="mr-1">検索</b-button>
                                <b-button variant="outline-primary" @click="clearForm">クリア</b-button>
                            </div>
                        </b-form-group>
                    </b-form>
                </b-col>     
                <b-col class="col-md-1">
                    <div class="text-right mt-1" >
                        <b-button  @click="registerCompany" class="mr-1 mt-5">新規</b-button>  
                    </div>
                </b-col>             
            </b-row> 
        </b-card>  
     
        <div v-if="companyData.length">
            <b-table ref="tableRefCompany"
                head-variant="light"
                class="table-sm table-bordered text-nowrap "
                :sticky-header="tableHeight"
                    no-border-collapse
                    hover
                    responsive
                    striped
                    selected-variant="info"
                    selectable
                    select-mode="single"
                    @row-selected="companySelect"
                    :items="companyData"
                    :fields="companyFields">
                <template #cell(update)="row">
                    <b-link class="button"  v-on:click="updateDelete(row.item.companyId)">更新/削除</b-link>             
                </template>
                <template #cell(adminInfo)="row">
                    <b-link class="button"  v-on:click="getAdminInfo(row.item.companyId)">管理者情報</b-link>
                </template>     
            </b-table>       
        </div>
        <div v-if="isLoadingCompany" class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>検索中...</strong>
        </div>
        <b-alert class="mt-4 print-hide" v-if="message" show variant="danger">{{ message }}</b-alert>


        <div v-if="showAdminSearch">
            <b-card bg-variant="light" >
                <b-row>
                    <b-col class="col-md-11">
                        <b-form inline class="mt-1">
                            <span class="mr-4 mt-1"><strong>コード：</strong>{{ selectedCompany.companyCode }}</span>
                            <strong>工事名称：</strong>{{ selectedCompany.companyName }}
                            <span class="mr-5"></span>
                        </b-form>
                        <b-form inline class="mt-2">
                           
                            <b-form-group label="姓" class="mr-3" >
                                <b-form-input v-model="adminSearchForm.sei"/>
                            </b-form-group>
                            <b-form-group label="名" class="mr-3">
                                <b-form-input v-model="adminSearchForm.mei"/>
                            </b-form-group>
                            <b-form-group class="mt-4 mr-1">
                                <div style="margin-top: 0.4rem;">
                                    <b-button @click="clickAdminSearch()" class="mr-1">検索</b-button>
                                    <b-button variant="outline-primary" @click="resetAdminSearchForm">クリア</b-button>
                                </div>
                            </b-form-group>
                        </b-form>
                    </b-col>
                    <b-col class="col-md-1">
                        <div class="text-right mt-1" >
                            <b-button  @click="registerAdmin" class="mr-1 mt-5">新規</b-button>  
                        </div>
                    </b-col> 
                </b-row>
                <br />
                <div v-if="showAdminTable && adminData.length" class="mt-1">
                    <b-table ref="tableRefAdmin"
                        head-variant="light"
                        sticky-header="500"
                        class="table-sm table-bordered text-nowrap prod-table" 
                        responsive
                        no-border-collapse
                        selected-variant="info"
                        selectable
                        select-mode="single"
                        @row-selected="adminSelect"
                        :items="adminData"
                        :fields="adminFields">
                        <template #cell(update)="row">
                            <b-link  class="button"  v-on:click="deleteAdmin(row.item.userId)">削除</b-link> 
                            <!--b-button size="sm" @click="updateProduct(row.item.projId, row.item.prodId)">更新/削除</b-button-->
                        </template>   
                    </b-table > 
                         
                   
                </div>
                <div v-if="isLoadingAdmin" class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>検索中...</strong>
                </div>   
            </b-card>       
        </div>        
       <b-alert class="mt-4" v-if="adminMessage" show variant="danger">{{ adminMessage }}</b-alert>

               

    </div> 
</template>


<style scoped>
    .button {
        font: 11px Arial;
        text-decoration: none;
        background-color: #7E7E7E; /* #817d7d; */
        color: #FFFFFF;
        padding: 4px 20px 4px 20px;
        border-top: 1px solid #CCCCCC;
        border-right: 1px solid #333333;
        border-bottom: 1px solid #333333;
        border-left: 1px solid #CCCCCC;
    }
    /* 印刷ボタンのマージン設定 */
    .b-table-sticky-header, .table-responsive, [class*=table-responsive-] {
        margin-bottom: 0.5rem;
    }
    .col > p {
        margin-bottom: 0.5rem;
    }
    @media print {
        .print-hide {
            display: none;
        }
        .card {
            border: none;
        }
    }
    @page {
        size:auto;
        margin-top: 1rem;
    }  
</style>

<script>
import axios from 'axios';
import apiUrls from  '../../common/apiUrls'
import commonMethods from '@/common/commonMethods';

export default {
  /*  props: ['companySettings', 'companyInput'],
    watch:{
        revertTableContent() {
            this.tableRevert();
        }
    }, */   
    data() {                                                                    
        return {
            titleCompany: '工事一覧',
            selectedCompanyId : "",
            searchForm: {
                companyCode:  '',
                companyName:  '',
              //  isShowCompanyTable: '',
              //  selectedRowCompanyId: '',
            },
            adminSearchForm: {
                sei : '',
                mei : '',
            },
           
          //  tableHeight: window.innerHeight - 360 + 'px',
            tableHeight:'175px',
            companyData: [],
            companyFields: [],
            message:'',
            isLoadingCompany: false,
            isShowCompanyTable:false,
            currentMenuName:'',
            searchedCompany: false,
            selectedRowCompanyId:'',

            selectedRow:'',
            showAdminSearch:false,
            showAdminTable: false,
            adminRestoreMode: false,
            selectedCompany:'',
            adminData :  [],
            adminFields : [],
            adminMessage: '',
            selectedRowAdminId : '',
            isLoadingAdmin: false,
        } 
    },
    created: function() {
        if(!this.$store.state.loginData.accessToken) {
            this.$router.push('/')
        } 
        this.currentMenuName = commonMethods.getCurrentMenu(); 
        let selectedRowCompanyId = commonMethods.loadCommonArea(this.currentMenuName + "_selectedRowCompanyId");

        if (selectedRowCompanyId != null) {
           // this.selectedRowCompanyId = selectedRowCompanyId;
            commonMethods.deleteCommonArea(this.currentMenuName + "_selectedRowCompanyId");
        } 

        let searchForm = commonMethods.loadCommonArea(this.currentMenuName + "_searchForm");
        // console.log('created: searchForm=' + searchForm);
        if (searchForm != null) {
            this.searchForm = searchForm;
            commonMethods.deleteCommonArea(this.currentMenuName + "_searchForm");
            
        } 
        this.isShowCompanyTable = commonMethods.loadCommonArea(this.currentMenuName + "_isShowCompanyTable");
        commonMethods.deleteCommonArea(this.currentMenuName + "_isShowCompanyTable");

        if (this.isShowCompanyTable){
            this.comapnyRefresh();
          //  alert ("Company Refreshed")
        }
        

        let selectedAdminId = commonMethods.loadCommonArea(this.currentMenuName + "_selectedRowAdminId");
        if (selectedAdminId != null){
            this.selectedRowAdminId = selectedAdminId;
            commonMethods.deleteCommonArea(this.currentMenuName + "_selectedRowAdminId");
        }

        this.showAdminSearch =  commonMethods.loadCommonArea(this.currentMenuName + "_showAdminSearch");
        this.showAdminTable = commonMethods.loadCommonArea(this.currentMenuName + "_showAdminTable");
        commonMethods.deleteCommonArea(this.currentMenuName + "_showAdminSearch");
        commonMethods.deleteCommonArea(this.currentMenuName + "_showAdminTable");

        if (this.showAdminSearch){
             let selectedCompany =  commonMethods.loadCommonArea(this.currentMenuName + "_selectedCompany");
            commonMethods.deleteCommonArea(this.currentMenuName + "_selectedCompany");
            if (selectedCompany.companyId){
                this.selectedCompany = selectedCompany;  
         //       this.selectedRowCompanyId =    this.selectedCompany.companyId           
            }  
        
            let adminSearchForm = commonMethods.loadCommonArea(this.currentMenuName + "_adminSearchForm");
            if (adminSearchForm != null) {
                this.adminSearchForm = adminSearchForm;
                commonMethods.deleteCommonArea(this.currentMenuName + "_adminSearchForm");
            }    
            if (this.showAdminTable){
                this.adminDataRefresh();  
            //    alert ("Admin refreshed");              
            }    
             
        }    
          
    }, 
    methods: {
        async comapnyRefresh(){
            await this.searchCompany();
        },

        clearForm() {
            this.searchForm =  {
                companyCode:  '',
                companyName:  '',
            },
           // this.searchForm.targetState = this.companySettings && this.companySettings.targetState ? this.companySettings.targetState : 1;
            this.companyData = [];
            this.companyFields = [];
            this.message = '';
            this.searchedCompany = false;
            this.showAdminSearch = false;
            this.showAdminTable = false;
            this.isShowCompanyTable = false;
        },

        resetAdminSearchForm(){
            this.adminSearchForm =  {
                sei:  '',
                mei:  '',
            },
            this.adminData = [];
            this.adminFields = [];
            this.adminMessage = '';
            this.showAdminTable = false;
            this.selectedRowAdminId = '';
        },

        async searchCompany() {
            //console.log(this.tableHeight)
            this.companyData = [];
            this.companyFields = [];
            this.isLoadingCompany = true;
            this.isShowCompanyTable = false;
            this.message = '';
            this.searchedCompany = false;
           
            let payload;
            
            payload = {
                superCompanyId : this.$store.state.loginData.companyId,
                ...this.searchForm.companyCode    && { companyCode:   this.searchForm.companyCode },
                ...this.searchForm.companyName    && { companyName:   this.searchForm.companyName },
              
            }
   
            let axiosConfigObject = {
                headers: {
                    Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                    'Content-Type': 'application/json',
                    },
                params:  payload}
            await axios.get(apiUrls.referCompanyMany, axiosConfigObject)
            .then(response => {
                this.companyData = response.data.resDt;              
                this.companyFields = this.createFields(response.data.resDtTitle);
                if(response.data.resultCode != '000') {
                    this.message = commonMethods.getResponseMessage(response)
                    // this.$emit('emitShowOtherData', false);
                } else {
                    this.isShowCompanyTable = true;
                }
                this.searchedCompany = true;
            })
            .catch(error => {
                this.message = commonMethods.getErrorMessage(error);
            })
            .finally(() => {
                commonMethods.wait(1000);
                
                if (this.selectedCompany.companyId) {
                    const row = this.companyData.findIndex(x => x.companyId === this.selectedCompany.companyId);
                    if ( row > -1) {
                        this.$refs.tableRefCompany.selectRow(row);
                        //scrolls down to the position of selected row
                        const tbody = this.$refs.tableRefCompany.$el.querySelector('tbody');
                        const selectRow = tbody.querySelectorAll('tr')[row];
                        selectRow.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"}); 
                    } else {
                        this.selectedCompany = "";
                    }       
                } 
                this.isLoadingCompany = false;    
           
                // 工事/製品メンテで子画面から戻ったときに子画面を呼び出す前の状態にするためにセーブする（createでloadする）。
               // commonMethods.saveCommonArea(this.currentMenuName + "_CompanySearchForm", this.searchForm); 
            })
        },

        registerCompany() {
            // this.$store.state.searchForm = this.searchForm
            this.$store.state.responseData = ''
            this.saveDataForReturn();            
            commonMethods.clickMenuForward(this.$route.path, 'companyregister');
        },

        async updateDelete(companyId) {
            this.selectedRowCompanyId = companyId;
            this.saveDataForReturn(); 
            await this.updateCompany(companyId)
        },

        async updateCompany(companyId) {
            // this.$store.state.searchForm = this.searchForm
            let payload = {
                companyId: companyId, 
            }
            let axiosConfigObject = {
                headers: {
                    Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                    'Content-Type': 'application/json',
                },
                params:  payload
            }
            await axios.get(apiUrls.referCompanyOne, axiosConfigObject)
            .then(response => {
                if(response.data.resultCode != '000') {
                    this.message = commonMethods.getResponseMessage(response);
                }
                else {
                    this.$store.state.responseData = response.data
                    if (this.searchedCompany == true) {
                        commonMethods.saveCommonArea(this.currentMenuName + "_searchForm", this.searchForm);
                    }
                    //this.$router.push('userupdate')
                    commonMethods.clickMenuForward(this.$route.path, 'companyupdate');
                }
            })
            .catch(error => {
                this.message = commonMethods.getErrorMessage(error);
            })
        },

        companySelect(value) {
            this.showAdminSearch = false;
            this.adminMessage  = '';
            // 工事一覧の行を選択したときの他、工事、製品の更新削除画面から戻ったときにも呼び出される。
            if (value[0]) {
                this.selectedCompany = value[0];
                if (this.$refs.tableRefCompany.selectedRows.length) {
                    this.selectedRow = this.$refs.tableRefCompany.selectedRows.length - 1;
                }
            }
            if (value[0].companyId && value[0].companyId != this.selectedRowCompanyId) {
                this.selectedRowCompanyId = value[0].companyId;
                this.showAdminSearch = true;  
            }
            this.showAdminTable = false;
            // console.log('emittedProjSelect() this.prodSearchForm.gotProduct=' + this.prodSearchForm.gotProduct);
            if (this.adminRestoreMode) {
                // 製品の更新/削除ボタンを押したときにtrueにしているので子画面から戻ったときに次の処理を行う。
                this.adminRestoreMode = false;
                this.getAdminData();
            } else {
                this.selectedRowCompanyId = '';
            }
        },


        async clickAdminSearch() {
            this.selectedRowAdminId = '';
            await this.getAdminData();
        },
        async getAdminData() {
            await this.getAdminList();                      
        },

        async getAdminList() {
            // console.log('getProductList() this.prodSearchForm.projId=' + this.prodSearchForm.projId);
            this.showAdminTable = false;
            // this.$store.state.searchForm = this.searchForm
            this.adminData = []; 
            this.adminFields = [];
            this.adminMessage = '';
           
            this.isLoadingAdmin = true; 
          
            let payload = {
                companyId: this.selectedCompany.companyId, 
                sei: this.adminSearchForm.sei,
                mei: this.adminSearchForm.mei,
            }
            let axiosConfigObject = {
                headers: {
                    Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                    'Content-Type': 'application/json',
                },
                params:  payload
            }

            await axios.get(apiUrls.referAdminMany, axiosConfigObject).then(response => {    
               // console.log(response.data.resDt);
                if(response.data.resultCode != '000') {
                    this.adminMessage = commonMethods.getResponseMessage(response);
                } else {
                    this.adminData = response.data.resDt;
                    this.adminFields =  this.createFields(response.data.resDtTitle);
                }
                this.showAdminTable = true;
            })
            .catch(error => {
                this.adminMessage = commonMethods.getErrorMessage(error);
            })
            .finally(() => {
                commonMethods.wait(1000);                    
               if (this.selectedRowAdminId) {
                    const row = this.adminData.findIndex(x => x.userId === this.selectedRowAdminId);
                    if ( row > -1) {
                        this.$refs.tableRefAdmin.selectRow(row);
                        //scrolls down to the position of selected row
                        const tbody = this.$refs.tableRefAdmin.$el.querySelector('tbody');
                        const selectRow = tbody.querySelectorAll('tr')[row];
                        selectRow.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"}); 
                    } else {
                        this.selectedRowAdminId = "";
                    }   
                }  
                this.isLoadingAdmin = false; 
            })         
        },

        saveDataForReturn(){
            commonMethods.saveCommonArea(this.currentMenuName + "_isShowCompanyTable", this.isShowCompanyTable);           
            if (this.searchedCompany == true) {
                commonMethods.saveCommonArea(this.currentMenuName + "_searchForm", this.searchForm);
            }
            if (this.showAdminTable == true){
                commonMethods.saveCommonArea(this.currentMenuName + "_adminSearchForm", this.adminSearchForm);
            }
            if (this.selectedCompany){
                commonMethods.saveCommonArea(this.currentMenuName + "_selectedCompany",this.selectedCompany);
            }    
            if (this.selectedCompanyId){
                commonMethods.saveCommonArea(this.currentMenuName + "_selectedCompanyId", this.selectedCompanyId);
            }
            if (this.selectedRowCompanyId){
                commonMethods.saveCommonArea(this.currentMenuName + "_selectedRowCompanyId", this.selectedRowCompanyId);
            } 
            if (this.selectedRowAdminId){
                commonMethods.saveCommonArea(this.currentMenuName + "_selectedRowAdminId", this.selectedRowAdminId);
            }
            commonMethods.saveCommonArea(this.currentMenuName + "_showAdminTable", this.showAdminTable); 
            commonMethods.saveCommonArea(this.currentMenuName + "_showAdminSearch", this.showAdminSearch); 
        },

        registerAdmin() {
            this.$store.state.responseData = ''
            this.$store.state.responseData = this.selectedCompany.companyId;
            this.saveDataForReturn();
            commonMethods.clickMenuForward(this.$route.path, 'adminregister');
        },

        adminSelect(adminVal){
          this.selectedRowAdminId = adminVal[0].userId;         
        },

        async adminDataRefresh(){
            await this.getAdminList();            
        },

        deleteAdmin(adminId) {
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
                        userId:  adminId,
                    }
                }
                let axiosConfigObject = {
                    headers: {
                        Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                        'Content-Type': 'application/json',
                    },
                    data:    payload
                }
                axios.delete(apiUrls.removeAdmin, axiosConfigObject)
                .then((response) => {
                    if(response.data.resultCode != '000') {
                        this.message = commonMethods.getResponseMessage(response);               
                    } else {
                        alert(response.data.resultMessage)
                         this.adminDataRefresh(); 
                       // this.$store.state.responseData = ''
                        //this.$router.push('users')
                       // commonMethods.clickMenuBack();
                    }
                })
                .catch(error => {
                    this.message = commonMethods.getErrorMessage(error);
                })
            }
        },





        

        createFields(obj, order) {
            let a = [];
            let b = [];
            for(let i in obj) { a.push( {'key': i, 'label': obj[i]} ); }
            a.push({'key': 'update', 'label': ''});
           /* if (company){
                a.push({'key': 'adminInfo', 'label': ''})
            } */
            if(order) {
                for(let i in order) { b.push(a[order[i]]); }
                return b;
            }
            return a;
        },
       
       
    }
}
</script>