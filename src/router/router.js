import { createRouter, createWebHistory } from 'vue-router'

import SignInView from '../views/SIgnInView.vue'
import CreateAccountView from '@/views/CreateAccountView.vue'
import OverView from '@/views/OverView.vue'
import AccountsView from '@/views/AccountsView.vue'
import DepositView from '@/views/DepositView.vue'
import WithdrawView from '@/views/WithdrawView.vue'
import SettingsView from '@/views/SettingsView.vue'
import TransferView from '@/views/TransferView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            component: SignInView
        },

        {
            path: '/',
            component: SignInView
        },

        {
            path: '/signup',
            component: CreateAccountView
        },

        {
            path: '/overview',
            name: 'Overview',
            component: OverView
        },

        {
            path: '/accounts',
            name: 'Accounts',
            component: AccountsView
        },

        {
            path: '/deposit',
            component: DepositView
        },

        {
            path: '/withdraw',
            component: WithdrawView
        },

        {
            path: '/transfer',
            component: TransferView
        },

        {
            path: '/settings',
            component: SettingsView
        },

    ]
})

export default router