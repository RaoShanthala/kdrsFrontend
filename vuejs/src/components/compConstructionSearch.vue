<template>
    <div>
     <b-card bg-variant="light">   
      <b-row>  
        <b-col class="col-md-11">   
            <b-form inline class="mt-0">
                <b-form-group  label="工事コード" class="mr-3">
                    <b-form-input id="constCode" v-model="constSearchForm.constCode"/>
                </b-form-group>
                <b-form-group label="工事名称" class="mr-3">
                    <b-form-input id="constName" v-model="constSearchForm.constName"/>
                </b-form-group>
                <b-form-group class="mt-5 mb-4 mr-3">
                    <b-form-radio-group v-model="constSearchForm.targetState" :options="targetStateOptions"/>
                </b-form-group>

                <b-form-group v-if="constSearchForm.targetState==2" label="工事着手日From" class="mr-3">
                    <b-datepicker today-button reset-button close-button
                        label-today-button="今日" label-reset-button="クリア" label-close-button="キャンセル"
                        placeholder="日付を選択してください" v-model="constSearchForm.startDateBegin" />
                </b-form-group>
                <b-form-group v-if="constSearchForm.targetState==2" label="工事着手日To" class="mr-3">
                    <b-datepicker today-button reset-button close-button
                        label-today-button="今日" label-reset-button="クリア" label-close-button="キャンセル"
                        placeholder="日付を選択してください" v-model="constSearchForm.startDateEnd" locale="en-US"/>
                </b-form-group>
                <b-form-group  v-if="constSearchForm.targetState==3" label="工事完了日From" class="mr-3">
                    <b-datepicker today-button reset-button close-button
                        label-today-button="今日" label-reset-button="クリア" label-close-button="キャンセル"
                        placeholder="日付を選択してください" v-model="constSearchForm.endDateBegin" />
                </b-form-group>
                <b-form-group v-if="constSearchForm.targetState==3" label="工事完了日To" class="mr-3">
                    <b-datepicker today-button reset-button close-button
                        label-today-button="今日" label-reset-button="クリア" label-close-button="キャンセル"
                        placeholder="日付を選択してください" v-model="constSearchForm.endDateEnd" locale="en-US" />
                </b-form-group>
                <b-form-group class="mt-4 mr-1">
                    <div style="margin-top: 0.4rem;">
                        <b-button @click="constSearchClick(null)" class="mr-1">検索</b-button>
                        <b-button variant="outline-primary" @click="clearForm">クリア</b-button>
                      </div>
                </b-form-group>
            </b-form>
        </b-col> 
       
         <b-col v-if="maintenanceMode" class="col-md-1">
                <div class="text-right mt-1" >
                    <b-button v-b-modal.construction_new_modal  @click="showAddConstructionModal" class="mr-1 mt-5">新規</b-button>  
                 </div>
            </b-col>    
         
      </b-row> 
     </b-card>  

      <div v-if="maintenanceMode"> 
        <div v-if="constData.length">
         <b-table ref="tableRef"
            head-variant="light"
            class="table-sm table-bordered text-nowrap proj-table"
            :sticky-header="tableHeight"
             no-border-collapse
                    responsive
                    striped
                    selected-variant="info"
                    selectable
                    select-mode="single"
                    @row-selected="constSelect"
                    :items="constData"
                    :fields="constFields">
            <template #cell(update)="row">
                <b-link class="button" v-b-modal.construction_new_modal v-on:click="showUpdateConstructionModal(row.item.constId,row.item.constCode, row.item.constName, row.item.startDate, row.item.endDate)">更新/削除</b-link> 
            </template> 
          </b-table>       
       </div>
      </div> 
       <div v-else>
         <div v-if="constData.length">  
           <b-table ref="tableRef"
            head-variant="light"
            class="table-sm table-bordered text-nowrap proj-table"
            :sticky-header="tableHeight"
             no-border-collapse
                    responsive
                    striped
                    selected-variant="info"
                    selectable
                    select-mode="single"
                    @row-selected="constSelect"
                    :items="constData"
                    :fields="constFields">
          </b-table> 
         </div>  
       </div>    

        <div v-if="this.modalShow">
            <b-modal id="construction_new_modal" v-bind:title= "this.titleModalConst" hide-footer>    
                <b-form>
                    <label for="newConstCode">工事コード</label>
                    <b-form-input id="newConstCode" v-model="newConstCode" />
                    <div><p style="color: #ff0000" id="newConstCodeError"></p></div>
                    <label for="newConstName">工事名称</label>
                    <b-form-input id="newConstName" v-model="newConstName" />
                    <div><p style="color: #ff0000" id="newConstNameError"></p></div>
                    <label for="newStartDate">着手日</label>
                    <b-datepicker today-button reset-button close-button
                        label-today-button="今日"
                        placeholder="日付を選択してください" v-model="newStartDate"/>
                    <label for="newEndDate">完了日</label>
                    <b-datepicker today-button reset-button close-button
                        label-today-button="今日"
                        placeholder="日付を選択してください" v-model="newEndDate"/>
                    <div>
                        <b-alert class="mt-4" v-if="messageReg" show variant="danger">{{messageReg}}</b-alert>
                    </div>
                    <br />
                    <div v-if="constRegister"  style="float: right;">
                        <b-button class="mr-1" @click="addNewConstruction">登録 </b-button>
                        <b-button class="mr-1" @click="closeTypeModal">取消</b-button>
                    </div>
                    <div v-else  style="float: right;">      
                        <b-button  @click="updateConstruction" class="mr-1">更新</b-button>
                        <b-button  @click="deleteConstruction" class="mr-1">削除</b-button>
                        <b-button class="mr-1" @click="closeTypeModal">取消</b-button>
                    </div> 
                   
                    </b-form>
                </b-modal>
        </div>
       <div v-if="isLoadingConst" class="text-center text-danger my-2">
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
import apiUrls from '../common/apiUrls';
import commonMethods from '@/common/commonMethods';

export default {
    props: ['constSettings', 'constInput'],
    watch:{
        revertTableContent() {
            this.tableRevert();
        }
    },    
    data() {                                                                    
        return {
            titleConst: '工事一覧',
            selectedConstId : "",
            constSearchForm: {
                constCode:  '',
                constName:  '',
                targetState: this.constSettings && this.constSettings.targetState || 1,
                startDateBegin: '',
                endDateBegin: '',
                startDateComplete: '',
                endDateComplete: '',
                isShowConstTable: '',
                selectedRowConstId: '',
                selectedRowConstName: '',
                selectedRowConstCode: '',
            },
            targetStateOptions: [
                { value: 1, text: '工事すべて' },
                { value: 2, text: '工事着手' },
                { value: 3, text: '工事完了' }
            ],
          //  tableHeight: window.innerHeight - 360 + 'px',
            tableHeight:'175px',
            maintenanceMode: this.constSettings?.maintenanceMode || false,
            constData: [],
            constFields: [],
            isLoadingConst: false,
            clickCount: 1,
            showShinkiButton: true,
            currentMenuName:'',
            message:'',
            revertTableContent : false,
            modalShow: false,
            newConstCode:'',
            newConstName:'',
            newStartDate:'',
            newEndDate:'',
            text1: "",
            text2:"",
            newConstCodePresent:false,
            newConstNamePresent:false,
            messageReg:"",
            constRegister : false,
            titleModalConst:"",
        }
    },
    created: function() {
        if(!this.$store.state.loginData.accessToken) {
            this.$router.push('/')
        } 
        this.currentMenuName = commonMethods.getCurrentMenu();
        // 子画面から戻ったときに子画面を呼び出す前の状態にするためにprojSearch()でセーブした情報をloadする。
   /*     let constSearchForm = commonMethods.loadCommonArea(this.currentMenuName + "_ConstSearchForm");
        // console.log('comp projSearchForm=' + projSearchForm);
        // console.log('comp this.projInput=' + this.projInput);
        if (constSearchForm) {
            // 子画面から戻ったとき
            for (let item in this.constSearchForm) {
                this.constSearchForm[item] = constSearchForm[item];
                // console.log('comp 1 this.projSearchForm[' + item + ']=' + this.projSearchForm[item]);
            }
        } else if (this.constInput) {
            // 初回の呼び出しのとき
            for (let item in this.constSearchForm) {
                this.constSearchForm[item] = this.constInput[item];
                // console.log('comp 2 this.projSearchForm[' + item + ']=' + this.projSearchForm[item]);
            }
        }
          if (this.constSearchForm.selectedRowConstId) {
            // 工事/製品メンテで、工事、または製品の更新/削除ボタンで子画面に遷移後、戻ってきたときの工事一覧の再表示。
            // 集計単位関係メンテで、登録/更新画面の子画面に遷移後、戻ってきたときの工事一覧の再表示。
            this.constSearchRestore(null);    
        } */
    }, 
    methods: {
         clearForm() {
            console.log ("clearForm  11");
            for (let item in this.constSearchForm) {
                this.constSearchForm[item] = '';
            }
            this.constSearchForm.targetState = this.constSettings && this.constSettings.targetState ? this.constSettings.targetState : 1;
            this.constData = [];
            this.constFields = [];
            this.message = '';
            // this.projSelect()を呼び出して、this.$emit('emitProjSelect', {});を実行し、工事一覧の行選択を解除する。
            let constData = [];
            constData.push(null);
            this.constSelect(constData);
            console.log ("clearedForm  11");
        },

          // 工事一覧の行がクリック、または行をselectRow.scrollIntoView()で選択したときに呼び出される。
        constSelect(item) {
            // console.log('projItem item=' + item);
            if(item[0]) {
                 console.log('projItem item[0]=' + item[0]);
                 console.log('projItem item[0].constId=' + item[0].constId);
                this.constSearchForm.selectedRowConstId = item[0].constId;
                this.$emit('emitConstSelect', item[0]);
             }  else {
                this.$emit('emitConstSelect', {});
            }
        },


        tableRevert() {
            this.constFields = this.constFieldsCopy;
            // this.revertTableContent = false;
          //  this.$parent.revertTableContent = false;
        },
        // 子画面から戻ってきたとき
        async constSearchRestore() {
            // console.log('projSearchRestore start !');
            await this.constSearch();
            // console.log('projSearchRestore end !');
        },

        // 工事の検索ボタンがクリックされたとき
        async constSearchClick() {
            console.log('constSearchClick start !');
            this.constSearchForm.selectedRowConstId = "";
            await this.constSearch();

            if (this.constSearchForm.isShowConstTable != true) {
                this.$emit('emitConstSearchButton', 0);
                return;
            }
            this.$emit('emitConstSearchButton', 1);         
        },

        async constSearch() {
            //console.log(this.tableHeight)
            this.constData = [];
            this.constFields = [];
            this.isLoadingConst = true;
            this.constSearchForm.isShowConstTable = false;
            this.message = '';

            let startDate, endDate;
            if (this.constSearchForm.targetState == 2) {
                startDate = this.constSearchForm.startDateBegin;
                endDate = this.constSearchForm.endDateBegin;
            } else if (this.constSearchForm.targetState == 3) {
                startDate = this.constSearchForm.startDateComplete;
                endDate = this.constSearchForm.endDateComplete;
            } else {
                startDate = '';
                endDate = '';
            }

            let payload;
            
            payload = {
                ...this.constSearchForm.constCode    && { constCode:   this.constSearchForm.constCode },
                ...this.constSearchForm.constName    && { constName:   this.constSearchForm.constName },
                ...this.constSearchForm.targetState && {targetState: + this.constSearchForm.targetState},
                ...startDate && {targetStartDate: startDate},
                ...endDate && {targetEndDate:   endDate}
            }
   
            let axiosConfigObject = {
                headers: {
                    Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                    'Content-Type': 'application/json',
                    },
                params:  payload}
            await axios.get(apiUrls.referConstructionList, axiosConfigObject)
            .then(response => {
                this.constData = response.data.resDt;
                
                this.constFields = this.createFields(response.data.resDtTitle);
                if(response.data.resultCode != '000') {
                    this.message = commonMethods.getResponseMessage(response)
                    // this.$emit('emitShowOtherData', false);
                } else {
                    this.constSearchForm.isShowConstTable = true;
                }
            })
            .catch(error => {
                this.message = commonMethods.getErrorMessage(error);
            })
            .finally(() => {
                this.isLoadingConst = false;
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
                commonMethods.saveCommonArea(this.currentMenuName + "_ConstSearchForm", this.constSearchForm); 
            })
        },

        showAddConstructionModal() {
            this.constRegister = true;
            this.messageReg = "";
            this.titleModalConst = '工事登録';
            this.modalShow = true;
            this.newConstCode = "";
            this.newConstName = "";
            this.newStartDate = "";
            this.newEndDate = "";
            
        },

        showUpdateConstructionModal(id,code, name, startDate, endDate){
            this.constRegister = false;
            this.messageReg = '';
            this.titleModalConst = '工事更新・削除';
            this.modalShow = true;
            this.selectedConstId = id;
            this.newConstCode = code;
            this.newConstName = name;
            this.newStartDate = startDate;
            this.newEndDate = endDate;
        },

        closeTypeModal() {
            this.modalShow = false;
        },

        addNewConstruction(bvModalEvt) {
            this.messageReg = '';
            this.checkInput();   
            if (this.newConstCodePresent == true && this.newConstNamePresent == true) {
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
                            constCode: this.newConstCode,
                            constName: this.newConstName,
                            startDate: this.newStartDate,
                            endDate: this.newEndDate,
                            userId: this.$store.state.loginData.id
                        },
                    };
                    let axiosConfigObject = {
                        headers: {
                            Authorization: "Bearer " + this.$store.state.loginData.accessToken,
                            "Content-Type": "application/json",
                        },
                    };
                    axios
                    .post(apiUrls.registerConstruction, payload, axiosConfigObject).then((response) => {
                        console.log(response.data);
                        if (response.data.resultCode != "000") {
                            this.messageReg = commonMethods.getResponseMessage(response);
                             bvModalEvt.preventDefault();
                        } else {
                            alert(response.data.resultMessage);
                            this.modalShow = false;
                            // update project ichiran 
                            this.constSearch();             
                        }
                    })
                    .catch((error) => {
                       this.messageReg = commonMethods.getErrorMessage(error);
                       bvModalEvt.preventDefault();
                    });
                } 
            } else{
                bvModalEvt.preventDefault();
            }
        },

        updateConstruction(bvModalEvt){
            this.messageReg = "";
            this.checkInput();  
            if (this.newConstCodePresent == true && this.newConstNamePresent == true) {
              if (confirm("更新しますか？")) {
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
                        constId: this.selectedConstId,
                        constCode: this.newConstCode,
                        constName: this.newConstName,
                        startDate: this.newStartDate,
                        endDate: this.newEndDate,
                    },
                };

                let axiosConfigObject = {
                    headers: {
                        Authorization: "Bearer " + this.$store.state.loginData.accessToken,
                        "Content-Type": "application/json",
                    },
                };
                axios
                .post(apiUrls.updateConstruction, payload, axiosConfigObject)
                .then((response) => {
                    console.log(response.data);
                    if (response.data.resultCode != "000") {
                        this.messageReg = commonMethods.getResponseMessage(response);
                        bvModalEvt.preventDefault();
                    } else {
                        alert(response.data.resultMessage)
                        this.selectedConstId = "";
                        this.modalShow = false;
                        // update project ichiran 
                        this.constSearch();
                    }
                })
                .catch((error) => {
                    this.messageReg = commonMethods.getErrorMessage(error);
                    bvModalEvt.preventDefault();
                });
              } else{
                 bvModalEvt.preventDefault();
              }
            } 
        },
    

        deleteConstruction(bvModalEvt) {
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
                        constId:      this.selectedConstId
                    }
                }
                let axiosConfigObject = {
                    headers: {
                        Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                        'Content-Type': 'application/json',
                    },
                    data:    payload
                }

                axios.delete(apiUrls.deleteConstruction, axiosConfigObject)
                .then((response) => {
                    if(response.data.resultCode != '000') {
                        this.messageReg = commonMethods.getResponseMessage(response);
                        bvModalEvt.preventDefault();
                    } else {
                        alert(response.data.resultMessage)
                        this.modalShow = false;
                        this.selectedConstId = "";
                        // update project ichiran 
                        this.constSearch(); 
                    }
                })
                .catch(error => {
                    this.messageReg = commonMethods.getErrorMessage(error);
                    bvModalEvt.preventDefault();
                })
            }else{
                bvModalEvt.preventDefault();
            }
        },

      /*  nippoIchiran(id,code, name){
            this.constSearchForm.selectedRowConstId = id;
            this.constSearchForm.selectedRowConstName = name;
            this.constSearchForm.selectedRowConstCode = code;
            commonMethods.saveCommonArea(this.currentMenuName + "_ConstSearchForm", this.constSearchForm);
            this.$store.state.responseData =  this.constSearchForm;
            commonMethods.clickMenuForward(this.$route.path, 'nippoIchiran');
           
          //  alert ("Nippo " + id + code + name );
          
            
        },

        sagyoIchiran(id,code, name){
            this.constSearchForm.selectedRowCosntCode = id;
            this.constSearchForm.selectedRowConstName = name;
            this.constSearchForm.selectedRowConstCode = code;
            commonMethods.saveCommonArea(this.currentMenuName + "_ConstSearchForm", this.constSearchForm);

            alert ("Sayou " + id + code + name );
            this.selectedConstId = id;
            this.newConstCode = code;
            this.newConstName = name;
           
        }, */

        checkInput() {
            this.text1 = "";
            if (!this.newConstCode) {
                this.text1 = "工事コードを入力してください";
                this.newConstCodePresent = false;
            } else{
                this.text1 = "";
                this.newConstCodePresent = true; 
            }
             document.getElementById("newConstCodeError").innerHTML = this.text1;

            this.text2 = "";
            if (!this.newConstName) {
                this.text2 = "工事名称を入力してください";
                this.newConstNamePresent = false;
            } else {
                this.text2 = "";
                this.newConstNamePresent = true; 
            } 
            document.getElementById("newConstNameError").innerHTML = this.text2;     
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