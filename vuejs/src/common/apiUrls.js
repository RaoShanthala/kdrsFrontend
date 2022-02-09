//let host = 'http://ec2-18-223-106-146.us-east-2.compute.amazonaws.com:8080'
let host = 'http://localhost:8080'


const urls = {

        signIn:            host + '/api/auth/signin',
        referUserMany:     host + '/UserMaintenance/ReferUserMany',
        referUserOne:      host + '/UserMaintenance/ReferUserOne',
        referIppanUserMany: host + '/UserMaintenance/ReferIppanUserMany',
        registUser:        host + '/UserMaintenance/RegistUer',
        modifyUser:        host + '/UserMaintenance/ModifyUer',
        removeUser:        host + '/UserMaintenance/RemoveUer',
        referRoleAll:      host + '/UserMaintenance/ReferRoleAll',
        referNameCollectionMany:        host + '/NameCollection/ReferMany',

        referPDFDownload:  host + '/PDF/CreatePdf',

        referCompanyMany:  host + '/Company/ReferCompanyMany',
        referCompanyOne:   host + '/Company/ReferCompanyOne',
        registerCompany:   host + '/Company/RegisterCompany',
        modifyCompany:     host + '/Company/ModifyCompany',
        removeCompany:     host + '/Company/RemoveCompany',

        referAdminMany:    host + '/Admin/ReferAdminMany',
        registerAdmin:     host + '/Admin/RegisterAdmin',
        removeAdmin:       host + '/Admin/RemoveAdmin',

        referConstructionList:  host + '/Construction/ReferConstructionList',
        registerConstruction:   host + '/Construction/RegisterConstruction',
        updateConstruction:     host + '/Construction/UpdateConstruction',
        deleteConstruction:     host + '/Construction/DeleteConstruction',
        addConstIds:            host + '/Construction/AddConstIds',
        deleteConstIds:         host + '/Construction/DeleteConstIds',
        referConstList:         host + '/Construction/GetConstList',

        referConstNippoIchiranList:  host + '/Construction/ReferConstructionMonthReportMany' ,
        referConstSagyoIchiranList:  host + '/Construction/ReferConstructionMonthOrderMany' ,

        referUserNippoIchiranList:  host + '/User/ReferUserMonthReportMany' ,
        referUserSagyoIchiranList:  host + '/User/ReferUserMonthOrderMany' ,

        referPrivConstList:     host + '/Construction/ReferPrivConstructionList',
}

export default urls 