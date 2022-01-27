<template>
    <div>
        <b-row>
            <b-col>
                <div class="text-left mt-1 "><h1>PDF 作成</h1></div>
            </b-col>
            <b-col>
                <b-button @click="importPdf">Import PDF</b-button>  
            </b-col>
        </b-row>
    </div>
</template>  

<script>
import axios from 'axios';
import apiUrls from '../common/apiUrls';
import commonMethods from '../common/commonMethods'

export default {
    data() {
        return {      
            message:''
        }
    },
  
    methods: {
        async importPdf() {
            alert ("Entered");
            this.message = '';
            let axiosConfigObject = {
                headers: {
                    Authorization:  'Bearer ' +  this.$store.state.loginData.accessToken,
                    'Content-Type': 'application/json',
                },
            }
            await axios.get(apiUrls.referPDFDownload, axiosConfigObject)
            .then(response => {            
                if(response.data.resultCode != '000') {
                    this.message = response.data.resultMessage;
                    alert('エラーが発生しました。');
                }else{
                    this.message = "Downloaded file";
                    alert('Downloaded file。');
                }        
            })
            .catch(error => {
                this.message = commonMethods.getErrorMessage(error);
            })           
        },
       
    }
}
</script>