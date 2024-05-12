import { defineStore } from 'pinia'
import { ref } from 'vue'

export const isAuthenticatedStore = defineStore('authStore', () => {
    const isAuthenticated = ref(sessionStorage.getItem('isAuthenticated'));
    const accountsExist = false;

    return {isAuthenticated, accountsExist}
});