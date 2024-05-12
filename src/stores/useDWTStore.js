import { defineStore } from "pinia";

export const useDWTStore = defineStore('dwt', {
    state: () => {
        return {
            transaction: []
        }
    }
})