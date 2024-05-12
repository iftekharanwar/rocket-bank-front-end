import { defineStore } from "pinia";

export const useAccountStore = defineStore('account', {
    state: () => {
        return {
            accountNumber: {account_number: 9000},
            showNav: false
        }
    }
})