<template>
    <div>
        <b-card bg-variant="light">
            <b-row>                    
            </b-row>    
            <b-row>
                <b-col class="col-md-10">
                    <b-form inline class="mt-1">
                        <span class="mr-4 mt-1"><strong>企業コード：</strong>{{this.$store.state.loginData.companyCode}}</span>
                        <!--strong>企業名称：</strong>{{this.$store.state.loginData.companyId}} -->
                        <span class="mr-5"></span>
                        <!-- <b-form-radio-group plain @change="prodFlagChange" v-model="prodSearchForm.prodFlag" :options="prodFlagOptions"/> -->
                        <!-- <b-form-radio-group class="mr-4" @change="prodFlagChange" v-model="prodSearchForm.prodFlag" :options="prodFlagOptions"/> -->
                    </b-form>
                    <b-form inline>
                        <b-form-group label="姓" class="mr-2">
                            <b-form-input id="input-sei" v-model="searchForm.sei"/>
                        </b-form-group>
                        <b-form-group label="名" class="mr-2">
                            <b-form-input id="input-mei" v-model="searchForm.mei"/>
                        </b-form-group>
                        <!--b-form-group label="状態" class="mr-4">
                            <b-form-select id="input-status" v-model="searchForm.status" :options="statusList"/>
                        </b-form-group-->
                        <b-form-group label="削除済" class="mr-2">
                            <b-form-checkbox v-model="searchForm.deleted"/>
                        </b-form-group>                       
                        <div id="flexButton">
                            <b-button @click="userSearchClick" class="mr-1">検索</b-button>
                            <b-button  variant="outline-primary" @click="resetSearchForm">クリア</b-button>
                        </div>
                    </b-form>
                </b-col>
                
            </b-row>
            <div v-show="isShowUserTable">
                <b-table ref="tableRef"
                    head-variant="light"
                    class="table-sm table-bordered text-nowrap"
                    :sticky-header="tableHeight"
                    no-border-collapse
                    responsive
                    striped
                    selected-variant="info"
                    selectable
                    select-mode="single"
                    @row-selected="userSelect"
                    :items="users"
                    :fields="fields">
                </b-table>  
            </div>
        </b-card>
        <div v-if="isLoadingUsers" class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>検索中...</strong>
        </div>
        <b-alert class="mt-4 print-hide" v-if="message" show variant="danger">{{ message }}</b-alert> 
  

    </div>
</template> 

<style scoped>
    .form-inline {
        margin-bottom: 1rem;
    }
    .form-inline div {
        margin-right: 5px;
    }
    .form-inline label {
        justify-content: left;
    }
    .text-right {
    margin-bottom: 1rem;
    }

    #flexButton {
        margin-bottom: -2rem;
    }
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
</style>


<script>
import axios from 'axios';
import apiUrls from '../common/apiUrls';
import commonMethods from '@/common/commonMethods';

export default {
    props: ['userSettings', 'userInput'],
    watch:{
        revertTableContent() {
            this.tableRevert();
        }
    },    
    data() {                                                                    
        return {
            striped: true,
            noCollapse: true,
            searchForm: {      
                sei: '',
                mei: '',
                status: '0',
                deleted:false,
            },
          //  tableHeight: window.innerHeight - 360 + 'px',
            users: [],
            fields: [],
            message: '',
            isLoadingUsers: false,
            table_height: '600px',
            isShowUserTable: false,
            currentMenuName: '',
            searchedUser: false,
            selectedRowUserId:'',
            maintenanceMode: false,
        }
    },
    created: function() {
        if(!this.$store.state.loginData.accessToken) {
            this.$router.push('/')
        } 
        this.currentMenuName = commonMethods.getCurrentMenu();
  
    }, 
    methods: {
         clearForm() {
             this.searchForm = {      
                sei: '',
                mei: '',
                status: '0',
                deleted:false,
            }        
            this.searchedUser = false;
            this.users = [];
            this.fields = [];
        },

          // ユーザ一覧の行がクリック、または行をselectRow.scrollIntoView()で選択したときに呼び出される。
        userSelect(item) {
            if(item[0]) {
               // alert('user item[0].userId=' + item[0].userId);
                this.selectedRowUserId = item[0].userId;
                this.$emit('emitUserSelect', item[0]);
             }  else {
                this.$emit('emitUserSelect', {});
            }
        },


       /* tableRevert() {
            this.fields = this.fieldsCopy;
            // this.revertTableContent = false;
          //  this.$parent.revertTableContent = false;
        },*/
        // 子画面から戻ってきたとき
        async userSearchRestore() {
            // console.log('projSearchRestore start !');
            await this.searchUser();
            // console.log('projSearchRestore end !');
        },

        // 工事の検索ボタンがクリックされたとき
        async userSearchClick() {
           // alert('emitUserSearchButton start !');
            this.selectedRowUserId = '';
            await this.searchUser();

            if (this.isShowUserTable != true) {
                this.$emit('emitUserSearchButton', 0);
                return;
            }
            this.$emit('emitUserSearchButton', 1);         
        },

        async searchUser() {
            this.isLoadingUsers = true;
            this.message = '';
            this.users = [];
            this.fields =[];
            this.searchedUser = false;
            this.isShowUserTable = false;
            
            if (this.searchForm.deleted == true){ 
                this.searchForm.deleted = '1';
            }else{
                this.searchForm.deleted = '0'; 
            }
    
            // console.log('this.searchForm.role=\'' + this.searchForm.role + '\'');
            let payload = {
                companyId: this.$store.state.loginData.companyId,
                ...this.searchForm.sei && {sei: this.searchForm.sei},
                ...this.searchForm.mei && {mei: this.searchForm.mei},
                ...this.searchForm.deleted !== '' && {deleted: this.searchForm.deleted},
             }
            let axiosConfigObject = {
                headers: {
                    Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                    'Content-Type': 'application/json',
                },
                params:  payload
            }

            axios.get(apiUrls.referIppanUserMany, axiosConfigObject)
            .then(response => {
                if (this.searchForm.deleted == '1'){ 
                    this.searchForm.deleted = true;
                }else{
                    this.searchForm.deleted = false;
                }
                this.users = response.data.resDt
                this.fields = this.createFields(response.data.resDtTitle);//, [0,1,2,3,4,5,6,7,8,9,10,11]);
                if (response.data.resultCode != '000') {
                    this.message = commonMethods.getResponseMessage(response);
                } else {
                    if (this.users.length > 0){
                        this.isShowUserTable = true;
                    }            
                    this.searchedUser = true;
                }
            })
            .catch(error => {
                this.message = commonMethods.getErrorMessage(error);
            })
            .finally(() => {
                this.isLoadingUsers = false;
                if (this.selectedRowUserId) {
                    const row = this.users.findIndex(x => x.userId === this.selectedRowUserId);
                    if ( row > -1) {
                        this.$refs.tableRefUser.selectRow(row);
                        //scrolls down to the position of selected row
                        const tbody = this.$refs.tableRefUser.$el.querySelector('tbody');
                        const selectRow = tbody.querySelectorAll('tr')[row];
                        // //selectRow.scrollIntoView(false);
                        selectRow.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
                    } else {
                        this.selectedRowUserId = "";
                    }    
                } 
            })
            // this.$store.state.searchForm = this.searchForm;
        },
      

       createFields(obj, order) {
            let a = [];
            let b = [];
            for(let i in obj) { a.push( {'key': i, 'label': obj[i]} ); }
            if(order) {
                for(let i in order) { b.push(a[order[i]]); }
                return b;
            }
            if(this.maintenanceMode) {
                // a.push( {'key': 'update', 'label': ''} );
                a.push( {'key': 'update', 'label': '', 'required': 'true' } )
            }
            return a;
        }
    }
}
</script>