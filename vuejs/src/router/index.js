import Vue from 'vue'
import VueRouter from 'vue-router'

import Login    from '../views/Login.vue'
//import SuperadminLogin from '../views/SuperadminLogin'
import AdminMenu     from '../views/AdminMenu.vue'
import UserMenu     from '../views/UserMenu.vue'
import SuperadminMenu from '../views/SuperadminMenu.vue'
//import ShowModel from '../views/Modal.vue'

import ImportPDF from '../views/ImportPDF.vue'

//ユーザメンテ画面
import Users    from '../views/User/UserMaintenance.vue'
import UserUpdate   from '../views/User/UserUpdate.vue'
import UserRegister from '../views/User/UserRegister.vue'

//工事メンテ画面
import Construction    from '../views/Construction/ConstructionMaintenance.vue'
import ConstructionMonthReport    from '../views/Construction/ConstructionMonthReport.vue'
import ConstructionMonthOrder    from '../views/Construction/ConstructionMonthOrder.vue'

//企業と企業管理者メンテ
import CompanyAndAdmin from '../views/CompanyAndCompanyAdmin/CompanyAdminMaintenance.vue'
import CompanyRegister from '../views/CompanyAndCompanyAdmin/CompanyRegister.vue'
import CompanyUpdate from '../views/CompanyAndCompanyAdmin/CompanyUpdate.vue'

//個人情報メンテ
import KojinUpdate from '../views/User/KojinUpdate.vue'

//
import ConstructionHistory from '../views/History/ConstructionHistoryData.vue'
import ReportHistory from '../views/History/ReportHistoryData.vue'
import WorkHistory from '../views/History/WorkHistoryData.vue'

Vue.use(VueRouter)

const routes = [
    {path: '/',                         name: 'Login',                      meta: {title: 'ログイン',                 prevPath: ''},      component: Login},
    {path: '/adminmenu',                name: 'Menu',                       meta: {title: 'メニュー',                 prevPath: ''},      component: AdminMenu},
    {path: '/usermenu',                name: 'Menu',                       meta: {title: 'メニュー',                 prevPath: ''},      component: UserMenu},
    {path: '/superadminmenu',           name: 'SuperadminMenu',             meta: {title: 'メニュー',                 prevPath: ''},      component: SuperadminMenu},
    {path: '/importPDF',                name: 'ImportPDF',                  meta: {title: 'PDFデータ作成',            prevPath: '/menu'}, component: ImportPDF},

    {path: '/construction',             name: 'Construction',               meta: {title: '工事メンテ',               prevPath: '/menu'}, component: Construction}, 
    {path: '/constructionreports',      name: 'ConstructionReports',        meta: {title: '工事月別日報一覧',          prevPath: '/menu'}, component: ConstructionMonthReport},
    {path: '/constructionorders',       name: 'ConstructionOrders',         meta: {title: '工事月別作業一覧',          prevPath: '//menu'}, component: ConstructionMonthOrder}, 
    

    {path: '/companyandadmin',          name: 'CompanyAndAdmin',            meta: {title: '企業と企業管理者メンテ',     prevPath: '/menu'}, component: CompanyAndAdmin},
    {path: '/companyregister',          name: 'CompanyRegister',            meta: {title: '企業新規登録画面',         prevPath: '/companyandadmin'}, component: CompanyRegister},
    {path: '/companyupdate',            name: 'CompanyUpdate',              meta: {title: '企業更新/削除画面',        prevPath: '/companyandadmin'}, component: CompanyUpdate},

    {path: '/users',                    name: 'Users',                      meta: {title: 'ユーザメンテ',              prevPath: '/menu'}, component: Users},
    {path: '/userupdate',               name: 'UserUpdate',                 meta: {title: 'ユーザ更新/削除画面',        prevPath: '/users'}, component: UserUpdate},
    {path: '/userregister',             name: 'UserRegister',               meta: {title: 'ユーザ新規登録画面',         prevPath: '/users'}, component: UserRegister},

    {path: '/kojinupdate',              name: 'SelfInfoUpdate',             meta: {title: '個人情報メンテ',        prevPath: '/menu'}, component: KojinUpdate},

    {path: '/constructiondatahistory',   name: 'ConstructionDataHistory',   meta: {title: '工事データ履歴',        prevPath: '/menu'}, component: ConstructionHistory},
    {path: '/reportdatahistory',         name: 'ReportDataHistory',         meta: {title: '日報データ履歴',        prevPath: '/menu'}, component: ReportHistory},
    {path: '/workdatahistory',           name: 'WorkDataHistory',           meta: {title: '変更作業データ履歴',     prevPath: '/menu'}, component: WorkHistory}
    
]

const router = new VueRouter({ routes })

export default router