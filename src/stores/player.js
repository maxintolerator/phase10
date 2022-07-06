import { defineStore } from "pinia"

export const usePlayersStore = defineStore("players", {
    state: () => ({
        players: [],
    }),
    actions: {
        addPlayer(name) {
            this.players.push({ name, score: 0, isDealer: false })
        },
    },
})
