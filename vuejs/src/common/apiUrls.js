let host = 'http://localhost:8080'
//let host = 'https://localhost:8443'

const urls = {

        signIn:            host + '/api/auth/signin',
        referUserMany:     host + '/UserMaintenance/ReferUserMany',
        referUserOne:      host + '/UserMaintenance/ReferUserOne',
        registUser:        host + '/UserMaintenance/RegistUer',
        modifyUser:        host + '/UserMaintenance/ModifyUer',
        removeUser:        host + '/UserMaintenance/RemoveUer',
        referRoleAll:      host + '/UserMaintenance/ReferRoleAll',
        referNameCollectionMany:        host + '/NameCollection/ReferMany',

        referPDFDownload:  host + '/PDF/CreatePdf',

        referConstructionList:  host + '/Construction/ReferConstructionList',
        registerConstruction:   host + '/Construction/RegisterConstruction',
        updateConstruction:     host + '/Construction/UpdateConstruction',
        deleteConstruction:     host + '/Construction/DeleteConstruction',
        addConstIds:            host + '/Construction/AddConstIds',
        deleteConstIds:         host + '/Construction/DeleteConstIds',

        referNippoIchiranList:  host + '/Construction/ReferConstructionMonthReportMany' ,
        referSagyoIchiranList:  host + '/Construction/ReferConstructionMonthOrderMany' ,

        referPrivConstList:     host + '/Construction/ReferPrivConstructionList',
}

export default urls 