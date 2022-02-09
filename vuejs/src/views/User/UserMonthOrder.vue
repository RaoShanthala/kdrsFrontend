<template>
    <div>
      <div>
        <comp-user-search 
            :user-settings="userSettings"
            v-on:emitUserSearchButton="emittedUserSearchButton"
            v-on:emitUserSelect="emittedUserSelect"

        />
        <div v-if="showOrderSearch">
            <b-card bg-variant="light" >
                <b-row class="mb-2">
                    <b-col class="col-md-9">
                        <b-form inline class="mt-1">
                            <span class="mr-4 mt-1"><strong>ユーザ性：</strong>{{ userInput.sei }}</span>
                            <strong>ユーザ名：</strong>{{ userInput.mei }}
                            <span class="mr-5"></span>
                         </b-form>
                         <b-form inline class="mt-2">                
                            <b-form-group label="開始年月日" class="mr-3">
                                <b-datepicker today-button reset-button close-button
                                    label-today-button="今日" label-reset-button="クリア" label-close-button="キャンセル"
                                    @input="onStartDateChange()"  placeholder="日付を選択してください" v-model="searchForm.startDate" />
                            </b-form-group>
                            <b-form-group label="終了年月日" class="mr-3">
                                <b-datepicker today-button reset-button close-button
                                    label-today-button="今日" label-reset-button="クリア" label-close-button="キャンセル"
                                    placeholder="日付を選択してください" v-model="searchForm.endDate"  />
                            </b-form-group>
                            <b-form-group label="工事コード" class="mr-3">
                                <b-form-select id="input-work" v-model="searchForm.constId" :options="constNames"/>
                            </b-form-group>
                             <div style="margin-top: 2rem; margin-right:2rem;">
                                <b-form-checkbox class="mt-2" v-model="searchForm.deleted" checked-value="booleanValue" v-on:input="searchForm.deleted = $event.target.value">削除済み</b-form-checkbox>
                            </div>
                            <b-form-group class="mt-4 mr-1">
                                <div style="margin-top: 0.4rem;">
                                    <b-button @click="getSagyoIchiranData" class="mr-1">検索</b-button>
                                    <b-button variant="outline-primary" @click="clearForm">クリア</b-button>
                                </div>
                            </b-form-group>
                           
                        </b-form>
                        
                    </b-col>     
                </b-row>

            <div v-if="ichiranData.length">  
                <b-table ref="tableRef"
                    head-variant="light"
                    class="table-sm table-bordered text-nowrap"
                    sticky-header="500"
                    no-border-collapse
                    responsive
                    striped
                    :items="ichiranData"
                    :fields="ichiranFields"> 
                </b-table> 
            </div>    

            <b-row v-if="ichiranData.length" >
                <b-col class="col-md-11"/>
                    <b-col class="col-md-1">
                        <b-button @click="csvOrderTable" class="mr-0">CSV出力</b-button>
                    </b-col>
            </b-row> 

            </b-card>   
      

       <div v-if="isLoading" class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>検索中...</strong>
        </div>
        <b-alert class="mt-4" v-if="message" show variant="danger">{{ message }}</b-alert>

          </div>        
    

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
import compUserSearch from "@/components/compUserSearch.vue";
import Encoding from '../../encoding/encoding.js';

export default {
    components: {
        compUserSearch
    },
 data() {
        return {
            userInput: {
                userId: '',
                sei: '',
                mei: '',
                status: '0',
                deleted:false,
            },
            userSettings: { maintenanceMode: false, targetState: 1},
            revertTableContent : false, 
          
            ichiranData:[],
            ichiranFields:[],
            isLoading: false,
            user:{},
            selectedRowUserId:'',
           
            //プライベート工事検索データ   
            searchForm: {
              userId:'',
              constId:0,
              startDate : '',
              endDate : '',
              deleted: 0,
            },
        
            constNames: [],
    
            message: '',
            //time: this.getTime(),
            table_height: window.innerHeight - 360 + 'px',
            userSearchButtonCount: 0,
            isLoadingProd: false,
            currentMenuName:'',
            showOrderSearch: false,

    
        }
    },
   
   created: async function() {
        if(!this.$store.state.loginData.accessToken) {
            this.$router.push('/')
        }
        this.currentMenuName = commonMethods.getCurrentMenu();
     
        if (this.$store.state.responseData) {
            this.user = this.$store.state.responseData
        } 
        let resDtConstNames = '';
        resDtConstNames = commonMethods.loadCommonArea('const');

        commonMethods.deleteCommonArea('const');
         
        if (resDtConstNames) {
            this.setConstNames(resDtConstNames);         
        } else {
            await this.referConstNamesAll();
        }
    },

    async mounted() {
        window.addEventListener('resize', () => {
            this.table_height = window.innerHeight - 360 + 'px'
        })  
      
        await this.$nextTick(); // waits for the component to load
    },
                        
    methods: {

        setConstNames(resDt) {
            this.constNames.push({ value: 0, text: 'すべて' });
            for(let i in resDt) { 
                this.constNames.push({'value': resDt[i].constId, 'text': resDt[i].constCode});
            }           
        },

        emittedUserSearchButton(value) {
          //  alert (" search button emit");
            this.userSearchButtonCount = value;
            this.message = '';
          //  this.privConstSearchForm.isShowPrivConstTable = false;
        },

        emittedUserSelect(value) {
            // alert (" user select emit");
            // alert ("userid == " + value.userId)
            // ユーザ一覧の行を選択したとき
            if (value.userId) {
                this.user = value;
                this.showOrderSearch = true;
              //  this.privConstSearchForm.isShowPrivConstTable = true;
                 if (value.userId != this.selectedRowUserId) {
                    this.searchForm.userId = value.userId;
                    this.selectedRowUserId = value.userId;
                    this.userInput.sei = value.sei;
                    this.userInput.mei = value.mei;
                    this.ichiranData=[];
                    this.ichiranFields=[];
                   // this.userInput.constCode = value.constCode;
                }                   
            } else {
                this.user = {};
                this.showOrderSearch = false;
                this.selectedRowUserId = '';
                this.searchForm.userId='';
                this.clearForm();
            }  
            this.searchForm.startDate = '';
            this.searchForm.endDate = '';
            this.searchForm.deleted = 0;         
        },

        async referConstNamesAll() {
            let payload;
            payload = {
                companyId: this.$store.state.loginData.companyId
            }
            let axiosConfigObject = {
                headers: {
                    Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                    'Content-Type': 'application/json',
                    },
                params:  payload}
            await axios.get(apiUrls.referConstList, axiosConfigObject)
            .then(response => {
                if(response.data.resultCode == '000') {
                    commonMethods.saveCommonArea('const', response.data.resDt);
                    this.setConstNames(response.data.resDt);
                } else {
                    this.message = commonMethods.getResponseMessage(response);
                }
            })
            .catch(error => {
                this.message = commonMethods.getErrorMessage(error);
            })
        },
        
        clearForm() {
            this.searchForm.startDate = '';
            this.searchForm.endDate = '';
            this.serachForm.constId = 0;
            this.searchForm.deleted = 0;
            this.ichiranData = [];
            this.ichiranFields = [];
            this.message = '';
        },

        onStartDateChange(){
           // alert (this.searchForm.startDate);
          //  alert(this.addMonths(new Date(this.searchForm.startDate),1));
            if (this.searchForm.startDate){
                this.searchForm.endDate = this.addMonths(new Date(this.searchForm.startDate),1);
            }            
        },

        addMonths(date, months) {
          //  alert(date);
            var d = date.getDate();
            date.setMonth(date.getMonth() + +months);
            if (date.getDate() != d) {
                date.setDate(0);
            }        
            return date;
        },

        async getSagyoIchiranData() {
            //  alert (this.searchForm.endDate.format("YYYY-MM-DD"));
            var dt = new Date(this.searchForm.endDate);
           // alert ("date == " + dt.toISOString());
            var month = ('0' + (dt.getMonth() + 1)).slice(-2);
            var date = ('0' + dt.getDate()).slice(-2);
            var year = dt.getFullYear();
            var endDateFormat = year + '-' + month + '-' + date;
           // alert("dateTimeNewFormat " +dateTimeNewFormat);
            if (this.searchForm.startDate){
            //console.log(this.tableHeight)   
            this.ichiranData = [];
            this.ichiranFields = [];
            this.message = '';
            this.isLoading = true;  
            
            let deleteFlag = "FALSE";
            if (this.searchForm.deleted == 1){
                deleteFlag = "TRUE";
            }
           // alert ("deleteFlag == " + deleteFlag);
            let payload;
            payload = {
                companyId: this.$store.state.loginData.companyId,
                constId:this.searchForm.constId,
                userId: this.searchForm.userId,  
                startDate:  this.searchForm.startDate,
                endDate: endDateFormat,
                deleted: deleteFlag
            }

            let axiosConfigObject = {
                headers: {
                    Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                    'Content-Type': 'application/json',
                    },
                params:  payload}
            await axios.get(apiUrls.referUserSagyoIchiranList, axiosConfigObject)
            .then(response => {
                this.ichiranData = response.data.resDt;
                
                this.ichiranFields = this.createFields(response.data.resDtTitle);
                if(response.data.resultCode != '000') {
                    this.message = commonMethods.getResponseMessage(response)
                    // this.$emit('emitShowOtherData', false);
                } else {
                  //  this.searchForm.isShowTable = true;
                }
            })
            .catch(error => {
                this.message = commonMethods.getErrorMessage(error);
            })
            .finally(() => {
                this.isLoading = false;
            /*   if (this.constSearchForm.isShowConstTable && this.constSearchForm.selectedRowConstId) {
                    const row = this.constData.findIndex(x => x.constId === this.constSearchForm.selectedRowConstId);
                    if ( row > -1) {
                        this.$refs.tableRef.selectRow(row);
                        //scrolls down to the position of selected row
                        const tbody = this.$refs.tableRef.$el.querySelector('tbody');
                        const selectRow = tbody.querySelectorAll('tr')[row];
                        selectRow.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
                     } else {
                        this.constSearchForm.selectedRowConstId = "";
                    }    
                } */
                // 工事/製品メンテで子画面から戻ったときに子画面を呼び出す前の状態にするためにセーブする（createでloadする）。
                commonMethods.saveCommonArea(this.currentMenuName + "_UserInput", this.searchForm); 
            })
            }else{
                alert ("開始日を選択してください");
            }
        },

        csvOrderTable() {
            if (confirm('CSVファイルをしますが、よろしいでしょうか？')) {
                let targetFields = ['privConstId', 'privConstName', 'userId', 'userName', 'reportNo','reportCode', 'personCode', 'reportDate', 'detail', 'constType','staff', 'numPerson','hours','earlyHours','overHours','deleted','createdAt','updatedAt' ];
                let csvHeader = ['PRIVCONSTID', 'PRIVCONSTNAME', 'USER_ID', 'USER_NAME','REPORT_NO','REPORT_CODE', 'PERSON_CODE', 'REPORT_DATE','DETAIL','CONST_TYPE','STAFF','NUM_PERSON','HOURS','EARLY_HOURS','OVER_HOURS','DELETED','CREATED_AT','UPDATED_AT'];
                let csvData = this.createCsv(targetFields, csvHeader, this.ichiranData);
            
                // キーワードを文字コードの数値の配列に変換
                const unicodeArray = [];
                for (let i = 0; i < csvData.length; i++) {
                    unicodeArray.push(csvData.charCodeAt(i));
                }

                // 変換処理の実施
                const sjisArray  = Encoding.UNICODEToSJIS(unicodeArray);
               
                var uInt8List = new Uint8Array(sjisArray);
                var blob = new Blob([uInt8List], {type: 'text/plain'});

                // 保存するCSVファイルの名前
                const fileName = `MonthlyNippo_${this.userInput.sei}${this.userInput.mei}_${this.getNowYmdHms()}.csv`;
                // HTMLのリンク要素を生成する
                const link = document.createElement("a");
                // リンク先にCSV形式の文字列データを置いておく
                link.href = window.URL.createObjectURL(blob);
                // 保存するCSVファイルの名前をリンクに設定する
                link.download = fileName;
                // ファイルを保存する
                link.click();
            }
        },

        getNowYmdHms() {
            var dt = new Date();
            var y = dt.getFullYear();
            var m = ("00" + (dt.getMonth()+1)).slice(-2);
            var d = ("00" + dt.getDate()).slice(-2);
            var hh = dt.getHours();
            var mm = dt.getMinutes();
            var ss = dt.getSeconds();
            if (hh < 10) hh = '0' + hh;
            if (mm < 10) mm = '0' + mm;
            if (ss < 10) ss = '0' + ss;
            var result = y + m + d + '_' + hh + mm + ss;
            return result;
        },

        createCsv(targetFields, csvHeader, resDt) {
            //const csvFormat = (col => `"${col}"`);
            const csvFormat = (col => `${col}`);
            let csvData = [
                csvHeader.map(csvFormat).join(','),
            ];
            csvData += '\r\n';
            resDt.forEach(element => { 
                let filedData = [];
                if (element['privConstId'] != null) {
                    for(let i in targetFields) {
                        let filedName = targetFields[i];
                        // console.log('i=' + i);
                        // console.log('filedName=' + filedName);
                        // console.log('element[filedName] =' + element[filedName]);
                        if (element[filedName] == null) {
                            filedData.push('');
                        } else {
                            filedData.push(element[filedName]);
                        }
                    }
                    csvData += [
                        filedData.map(csvFormat).join(','),
                    ];
                    csvData += '\r\n';
                }
            });
            return csvData;
        },

        createFields(obj, order) {
            let a = [];
            let b = [];
            for(let i in obj) { a.push( {'key': i, 'label': obj[i]} ); }
            if(order) {
                for(let i in order) { b.push(a[order[i]]); }
                return b;
            }
            
            return a;
        },

    
    }
}
</script>  