import Vue from 'vue'
import VueRouter from 'vue-router'

import Login    from '../views/Login.vue'
import SuperadminLogin from '../views/SuperadminLogin'
import AdminMenu     from '../views/AdminMenu.vue'
import UserMenu     from '../views/UserMenu.vue'
import SuperadminMenu from '../views/SuperadminMenu.vue'
import ShowModel from '../views/Modal.vue'

import ImportPDF from '../views/ImportPDF.vue'

//ユーザメンテ画面
import Users    from '../views/User/UserMaintenance.vue'
import UserUpdate   from '../views/User/UserUpdate.vue'
import UserRegister from '../views/User/UserRegister.vue'

//工事メンテ画面
import Construction    from '../views/Construction/ConstructionMaintenance.vue'
import ConstructionMonthReport    from '../views/Construction/ConstructionMonthReport.vue'
import ConstructionMonthOrder    from '../views/Construction/ConstructionMonthOrder.vue'


Vue.use(VueRouter)

const routes = [
    {path: '/',                         name: 'Login',                      meta: {title: 'ログイン',                 prevPath: ''},      component: Login},
    {path: '/super',                    name: 'SuperAdminLogin',            meta: {title: 'ログイン',                 prevPath: ''},      component: SuperadminLogin},
    {path: '/adminmenu',                name: 'Menu',                       meta: {title: 'メニュー',                 prevPath: ''},      component: AdminMenu},
    {path: '/usermenu',                name: 'Menu',                       meta: {title: 'メニュー',                 prevPath: ''},      component: UserMenu},
    {path: '/superadminmenu',           name: 'SuperadminMenu',             meta: {title: 'メニュー',                 prevPath: ''},      component: SuperadminMenu},
    {path: '/showmodel',           name: 'Model',             meta: {title: 'Model',                 prevPath: ''},      component: ShowModel},
    {path: '/importPDF',                name: 'ImportPDF',                  meta: {title: 'PDFデータ作成',            prevPath: '/menu'}, component: ImportPDF},

    {path: '/construction',             name: 'Construction',               meta: {title: '工事メンテ',               prevPath: '/menu'}, component: Construction}, 
    {path: '/constructionreports',      name: 'ConstructionReports',        meta: {title: '工事月別日報一覧',          prevPath: '/menu'}, component: ConstructionMonthReport},
    {path: '/constructionorders',       name: 'ConstructionOrders',         meta: {title: '工事月別作業一覧',          prevPath: '//menu'}, component: ConstructionMonthOrder},    

    {path: '/users',                    name: 'Users',                      meta: {title: 'ユーザメンテ',              prevPath: '/menu'}, component: Users},
    {path: '/userupdate',               name: 'UserUpdate',                 meta: {title: 'ユーザ更新/削除画面',        prevPath: '/users'}, component: UserUpdate},
    {path: '/userregister',             name: 'UserRegister',               meta: {title: 'ユーザ新規登録画面',         prevPath: '/users'}, component: UserRegister},

    
]

const router = new VueRouter({ routes })

export default router