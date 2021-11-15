<template>
    <div>
        <b-card bg-variant="light">
            <b-row>
                <b-col class="col-md-10">
                    <b-form inline>
                        <b-form-group label="ログインユーザ" class="mr-2">
                        <b-form-input id="input-user" v-model="searchForm.loginUser"/>
                        </b-form-group>
                        <b-form-group label="氏名" class="mr-2">
                        <b-form-input id="input-name" v-model="searchForm.name"/>
                        </b-form-group>
                        <b-form-group label="業務" class="mr-2">
                        <b-form-select id="input-work" v-model="searchForm.role" :options="roles"/>
                        </b-form-group>
                        <b-form-group label="役割" class="mr-2">
                        <b-form-select id="input-role" v-model="searchForm.roleLevel" :options="roleLevels"/>
                        </b-form-group>
                        <b-form-group label="基準日">
                            <b-datepicker
                                today-button
                                reset-button
                                close-button
                                label-today-button="今日"
                                label-reset-button="クリア"
                                label-close-button="キャンセル"
                                placeholder="日付を選択してください"
                                v-model="searchForm.date"/>
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
                        <!-- <b-button size="sm" @click="clickUpdateUser(row.item.userId)">更新/削除</b-button> -->
                        <b-link  class="button"  v-on:click="clickUpdateUser(row.item.userId)">更新/削除</b-link> 
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
                loginUser: '',
                name: '',
                //work: '',
                role: '',
                roleLevel: '',
                date: ''
            },
            roles: [],
            roleLevels: [],
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
        let resDtRole = commonMethods.loadCommonArea('role');
        if (!resDtRole) {
            // console.log('this.referRoleAll(\'Role start !\');')
            await this.referRoleAll();
            // console.log('this.referRoleAll(\'Role end !\');')
        } else {
            this.setRoles(resDtRole);
        }

        let resDtRoleLevel = commonMethods.loadCommonArea('roleLevel');
        if (!resDtRoleLevel) {
            // console.log('this.referNameCollectionMany(\'RoleLevel start !\');')
            await this.referNameCollectionMany('RoleLevel');
            // console.log('this.referNameCollectionMany(\'RoleLevel end !\');')
        } else {
            this.setRoleLevels(resDtRoleLevel);
        }

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
        setRoles(resDt) {
            for(let i in resDt) { 
                    this.roles.push({'value': resDt[i].roleId, 'text': resDt[i].roleName});
            }
            this.roles.push({ value: 0, text: '無し' });
            this.roles.push({ value: '', text: '' });
        },

        setRoleLevels(resDt) {
            for(let i in resDt) { 
                this.roleLevels.push({'value': resDt[i].codeNumeric, 'text': resDt[i].nameShort});
            }
            this.roleLevels.push({ value: '', text: '' });
        },

        async referRoleAll() {
            let axiosConfigObject = {
                headers: {
                Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                'Content-Type': 'application/json',
                }
            }
            await axios.get(apiUrls.referRoleAll, axiosConfigObject)
            .then(response => {
                if(response.data.resultCode == '000') {
                    commonMethods.saveCommonArea('role', response.data.resDt);
                    this.setRoles(response.data.resDt);
                } else {
                    this.message = commonMethods.getResponseMessage(response);
                }
            })
            .catch(error => {
                this.message = commonMethods.getErrorMessage(error);
            })
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
            // console.log('this.searchForm.role=\'' + this.searchForm.role + '\'');
            let payload = {
                ...this.searchForm.loginUser && {loginUser: this.searchForm.loginUser},
                ...this.searchForm.name && {name: this.searchForm.name},
                ...this.searchForm.role !== '' && {roleId: this.searchForm.role},
                ...this.searchForm.roleLevel && {roleLevel: this.searchForm.roleLevel},
                ...this.searchForm.date && {targetDate: this.searchForm.date.replaceAll('-','/')}
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
                this.users = response.data.resDt
                this.fields = this.createFields(response.data.resDtTitle);//, [0,1,2,3,4,5,6,7,8,9,10,11]);
                if (response.data.resultCode != '000') {
                    this.message = commonMethods.getResponseMessage(response);
                } else {
                    this.isShowUserTable = true;
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
        // userSelected(item) {
        //     if (item) {
        //         console.log('userSelected item.length=' +  item.length);
        //         if(item[0]) {
        //             console.log('userSelected item[0].userId=' +  item[0].userId);
        //             this.selectedRowUserId = item[0].userId;
        //         } 
        //     }
        //     if(this.$refs.tableRefUser.selectedRows.length) {
        //         this.selectedRowIndex = this.$refs.tableRefUser.selectedRows.length - 1;
        //         console.log('userSelected this.selectedRowIndex=' +  this.selectedRowIndex);
        //     }
        // },

        registerUser() {
            // this.$store.state.searchForm = this.searchForm
            this.$store.state.responseData = ''
            if (this.searchedUser == true) {
                commonMethods.saveCommonArea(this.currentMenuName + "_searchForm", this.searchForm);
            }
            //this.$router.push('userregister')
            commonMethods.clickMenuForward(this.$route.path, 'userregister');
        },

        async clickUpdateUser(item) {
            this.selectedRowUserId = item;
            commonMethods.saveCommonArea(this.currentMenuName + '_selectedRowUserId', this.selectedRowUserId);
            await this.updateUser(item)
        },

        async updateUser(item) {
            // this.$store.state.searchForm = this.searchForm
            let payload = {
                userId: item
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
                    response.data.resHd.userId = item
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
                loginUser: '',
                name: '',
                work: '',
                role: '',
                date: ''
            }
            this.searchedUser = false;
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