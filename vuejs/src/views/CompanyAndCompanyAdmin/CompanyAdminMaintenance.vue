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
                        <b-button v-b-modal.company_new_modal  @click="registerCompany" class="mr-1 mt-5">新規</b-button>  
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
                    :items="companyData"
                    :fields="companyFields">
                <template #cell(update)="row">
                    <b-link class="button" v-b-modal.company_new_modal v-on:click="updateDelete(row.item.companyId)">更新/削除</b-link>             
                </template>
                <template #cell(adminInfo)="row">
                    <b-link class="button" v-b-modal.company_new_modal v-on:click="getAdminInfo(row.item.companyId)">管理者情報</b-link>
                </template>     
            </b-table>       
        </div>
        <div v-if="isLoadingCompany" class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>検索中...</strong>
        </div>
        <b-alert class="mt-4 print-hide" v-if="message" show variant="danger">{{ message }}</b-alert>
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
           
          //  tableHeight: window.innerHeight - 360 + 'px',
            tableHeight:'175px',
            companyData: [],
            companyFields: [],
            message:'',
            isLoadingCompany: false,
            isShowCompanyTable:false,
            currentMenuName:'',
            searchedCompany: false,
            selectedRowCompanyId:''
        }
    },
    created: function() {
        if(!this.$store.state.loginData.accessToken) {
            this.$router.push('/')
        } 
        this.currentMenuName = commonMethods.getCurrentMenu(); 
        let selectedRowCompanyId = commonMethods.loadCommonArea(this.currentMenuName + '_selectedRowCompayId');
        if (selectedRowCompanyId != null) {
            this.selectedRowCompanyId = selectedRowCompanyId;
            commonMethods.deleteCommonArea(this.currentMenuName + "_selectedRowCompanyId");
        }

        let searchForm = commonMethods.loadCommonArea(this.currentMenuName + "_searchForm");
        // console.log('created: searchForm=' + searchForm);
        if (searchForm != null) {
            this.searchForm = searchForm;
            commonMethods.deleteCommonArea(this.currentMenuName + "_searchForm");
            this.searchCompany();
        }     
    }, 
    methods: {
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
        },

          // 工事一覧の行がクリック、または行をselectRow.scrollIntoView()で選択したときに呼び出される。
      /*  companySelect(item) {
            // console.log('projItem item=' + item);
            if(item[0]) {
                 console.log('projItem item[0]=' + item[0]);
                 console.log('projItem item[0].companyId=' + item[0].companyId);
                this.searchForm.selectedRowCompanyId = item[0].companyId;
                this.$emit('emitCompanySelect', item[0]);
             }else{
                this.$emit('emitCompanySelect', {});
            }
        },

        tableRevert() {
            this.companyFields = this.companyFieldsCopy;
            // this.revertTableContent = false;
          //  this.$parent.revertTableContent = false;
        },
        // 子画面から戻ってきたとき
        async companySearchRestore() {
            // console.log('projSearchRestore start !');
            await this.companySearch();
            // console.log('projSearchRestore end !');
        },  

        // 工事の検索ボタンがクリックされたとき
        async companySearchClick() {
            console.log('companySearchClick start !');
            this.selectedRowCompanyId = "";
            await this.companySearch();       
        }, */

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
                this.isLoadingCompany = false;
                if (this.selectedRowCompanyId) {
                    const row = this.companyData.findIndex(x => x.companyId === this.selectedRowCompanyId);
                    if ( row > -1) {
                        this.$refs.tableRefCompany.selectRow(row);
                        //scrolls down to the position of selected row
                        const tbody = this.$refs.tableRefCompany.$el.querySelector('tbody');
                        const selectRow = tbody.querySelectorAll('tr')[row];
                        // //selectRow.scrollIntoView(false);
                        selectRow.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
                    } else {
                        this.selectedRowCompanyId = "";
                    }    
                } 
           
                // 工事/製品メンテで子画面から戻ったときに子画面を呼び出す前の状態にするためにセーブする（createでloadする）。
               // commonMethods.saveCommonArea(this.currentMenuName + "_CompanySearchForm", this.searchForm); 
            })
        },

        registerCompany() {
            // this.$store.state.searchForm = this.searchForm
            this.$store.state.responseData = ''
            if (this.searchedCompany == true) {
                commonMethods.saveCommonArea(this.currentMenuName + "_searchForm", this.searchForm);
            }
            commonMethods.clickMenuForward(this.$route.path, 'companyregister');
        },

        async updateDelete(companyId) {
            this.selectedRowCompanyId = companyId;
            commonMethods.saveCommonArea(this.currentMenuName + '_selectedRowCompanyId', this.selectedRowCompanyId);
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

        createFields(obj, order) {
            let a = [];
            let b = [];
            for(let i in obj) { a.push( {'key': i, 'label': obj[i]} ); }
            a.push({'key': 'update', 'label': ''});
            a.push({'key': 'adminInfo', 'label': ''})
            if(order) {
                for(let i in order) { b.push(a[order[i]]); }
                return b;
            }
            return a;
        },
       
       
    }
}
</script>