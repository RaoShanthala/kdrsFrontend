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
                        <b-form-group label="状態" class="mr-4">
                            <b-form-select id="input-status" v-model="searchForm.status" :options="statusList"/>
                        </b-form-group>
                        <b-form-group label="削除済" class="mr-2">
                            <b-form-checkbox v-model="searchForm.deleted"/>
                        </b-form-group>                       
                        <div id="flexButton">
                            <b-button @click="searchUser" class="mr-1">検索</b-button>
                            <b-button  variant="outline-primary" @click="resetSearchForm">クリア</b-button>
                        </div>
                    </b-form>
                </b-col>
                <b-col class="col-md-2">
                    <div class="text-right mt-4">
                        <b-button @click="registerUser" class="mr-1">新規</b-button>
                    </div>
                </b-col>
            </b-row>

            <!-- @row-selected="userSelected" -->
            <div v-show="isShowUserTable">
                <b-table ref="tableRefUser"
                    head-variant="light"
                    class="table-sm table-bordered text-nowrap" 
                    :sticky-header="table_height"
                    hover
                    responsive
                    selected-variant="info"
                    selectable
                    select-mode="single"
                    :striped="striped"
                    :no-border-collapse="noCollapse"
                    :items="users"
                    :fields="fields">
                    <template #cell(update)="row">
                        <!--span v-if="row.item.deleted == 0 ">
                            <span v-if="row.item.email == $store.state.loginData.username">
                                <b-link  class="button"  v-on:click="clickUpdateUser(row.item.userId)">更新</b-link>                 
                            </span>
                            <span v-else>
                                <b-link  class="button"  v-on:click="clickUpdateUser(row.item.userId)">更新/削除</b-link>
                            </span>
                        </span-->
                        <span v-if="row.item.deleted == 0 && row.item.email != $store.state.loginData.username">           
                            <b-link  class="button"  v-on:click="clickUpdateUser(row.item.userId)">更新/削除</b-link>                           
                        </span>
                    </template>
                </b-table>
            </div>
        </b-card>

        <div v-if="isLoadingUsers" class="text-center text-danger my-2">
        <b-spinner class="align-middle"></b-spinner>
        <strong>検索中...</strong>
        </div>

        <b-alert v-if="message" show variant="danger">{{ message }}</b-alert>

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
import axios from 'axios'
import apiUrls from '../../common/apiUrls'
import commonMethods from '../../common/commonMethods'

export default {
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
            statusList: [],
           //S roleLevels: [],
            users: [],
            fields: [],
            message: '',
            isLoadingUsers: false,
            // table_height: window.innerHeight - 240 + 'px'
            // table_height: '700px',
            table_height: '600px',
            isShowUserTable: false,
            currentMenuName: '',
            searchedUser: false,
            selectedRowUserId:'',
            // selectedRowIndex: -1,
        }
    },
    // mounted() {
    //     window.addEventListener('resize', () => {
    //         this.table_height = window.innerHeight - 240 + 'px'
    //     })
    // },
    created: async function() {

       //await this.referStatusAll(); using below method instead to set status list (hardcoding)
        this.setStatus();

        this.currentMenuName = commonMethods.getCurrentMenu();
        // console.log('created: currentMenuName=' + this.currentMenuName);

        let selectedRowUserId = commonMethods.loadCommonArea(this.currentMenuName + '_selectedRowUserId');
        if (selectedRowUserId != null) {
            this.selectedRowUserId = selectedRowUserId;
            commonMethods.deleteCommonArea(this.currentMenuName + "_selectedRowUserId");
        }

        let searchForm = commonMethods.loadCommonArea(this.currentMenuName + "_searchForm");
        // console.log('created: searchForm=' + searchForm);
        if (searchForm != null) {
            this.searchForm = searchForm;
            commonMethods.deleteCommonArea(this.currentMenuName + "_searchForm");
            this.searchUser();
        }
    },
    methods: {
        setStatus(){
            this.statusList.push({'value': '0', 'text': 'すべて'});
            this.statusList.push({'value': '1', 'text': '申請（iphone）'});
            this.statusList.push({'value': '2', 'text': '承認（管理者）'});
            this.statusList.push({'value': '3', 'text': '承諾（iphone）'});
            this.statusList.push({'value': '7', 'text': '承認拒否（管理者）'});
            this.statusList.push({'value': '8', 'text': '承諾拒否（iphone）'});
            this.statusList.push({'value': '9', 'text': '削除（管理者）'});

        },
     
       async referNameCollectionMany(nameSectionValue) {
            let axiosConfigObject = {
                headers: {
                    Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                    'Content-Type': 'application/json',
                },
                //params:  payload
                params: { nameSection:  nameSectionValue }
            }
            await axios.get(apiUrls.referNameCollectionMany, axiosConfigObject)
            .then(response => {
                if(response.data.resultCode == '000') {
                    if (nameSectionValue == 'RoleLevel') {
                        commonMethods.saveCommonArea('roleLevel', response.data.resDt);
                        this.setRoleLevels(response.data.resDt);
                    }
                } else {
                    this.message = commonMethods.getResponseMessage(response);
                }
            })
            .catch(error => {
                this.message = commonMethods.getErrorMessage(error);
            })
        },
        searchUser() {
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
                ...this.searchForm.status !== '' && {status: this.searchForm.status},
                ...this.searchForm.deleted !== '' && {deleted: this.searchForm.deleted},
             }
            let axiosConfigObject = {
                headers: {
                    Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                    'Content-Type': 'application/json',
                },
                params:  payload
            }

            axios.get(apiUrls.referUserMany, axiosConfigObject)
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
      

     /*   clickDeleteUser(userId){
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
                        companyId: this.$store.state.loginData.companyId, 
                        userId:  userId
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
                        //commonMethods.clickMenuBack();
                    }
                })
                .catch(error => {
                    this.message = commonMethods.getErrorMessage(error);
                })
            }
        }, */

        registerUser() {
            // this.$store.state.searchForm = this.searchForm
            this.$store.state.responseData = ''
            if (this.searchedUser == true) {
                commonMethods.saveCommonArea(this.currentMenuName + "_searchForm", this.searchForm);
            }
            //this.$router.push('userregister')
            commonMethods.clickMenuForward(this.$route.path, 'userregister');
        },

        async clickUpdateUser(userId) {
            this.selectedRowUserId = userId;
            commonMethods.saveCommonArea(this.currentMenuName + '_selectedRowUserId', this.selectedRowUserId);
            await this.updateUser(userId)
        },

        async updateUser(userId) {
            // this.$store.state.searchForm = this.searchForm
            let payload = {
                companyId: this.$store.state.loginData.companyId, 
                userId: userId
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
                    response.data.resHd.userId = userId
                    this.$store.state.responseData = response.data
                    if (this.searchedUser == true) {
                        commonMethods.saveCommonArea(this.currentMenuName + "_searchForm", this.searchForm);
                    }
                    //this.$router.push('userupdate')
                    commonMethods.clickMenuForward(this.$route.path, 'userupdate');
                }
            })
            .catch(error => {
                this.message = commonMethods.getErrorMessage(error);
            })
        },

        resetSearchForm() {
            this.searchForm = {      
                sei: '',
                mei: '',
                status: '0',
                deleted:false,
            }        
            this.searchedUser = false;
            this.users = [];
            this.fields = [];
            // this.$store.state.searchForm = this.searchForm
        },

        //カラム作成・並べ替え関数
        createFields(obj, order) {
            let a = [];
            let b = [];
            for(let i in obj) { a.push( {'key': i, 'label': obj[i]} ); }
            a.push({'key': 'update', 'label': ''});
            if(order) {
                for(let i in order) { b.push(a[order[i]]); }
                return b;
            }
            return a;
        },
    }
}
</script>