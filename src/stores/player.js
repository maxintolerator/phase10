import { defineStore } from "pinia"
import { useStorage } from "@vueuse/core"

export const usePlayersStore = defineStore("players", {
    state: () => ({
        players: useStorage("players", []),
    }),
    actions: {
        addPlayer(name) {
            this.players.push({ name, score: 0, isDealer: false })
        },
        resetPlayers() {
            this.players = []
        },
    },
})
