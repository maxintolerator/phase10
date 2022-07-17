import { defineStore } from "pinia"
import { useStorage } from "@vueuse/core"

export const useRandomStore = defineStore("random", {
    state: () => ({
        random: useStorage("random", false),
    }),
    actions: {
        setRandom(val) {
            this.random = val
        },
    },
})
