<template>
    <q-page class="row items-center justify-center">
        <div>
            <div class="q-gutter-y-md" style="max-width: 300px">
                <q-input
                    v-for="player in playerList"
                    :key="player.index"
                    v-model="player.name"
                    :label="player.label"
                    outlined
                    color="white"
                    label-color="white"
                    dark
                />
            </div>
        </div>

        <q-footer
            class="transparent column justify-center items-center q-pa-md q-mb-xl"
        >
            <q-checkbox
                class="q-mb-lg"
                v-model="random"
                dark
                label="Random Mode"
            />
            <q-btn color="secondary" full-width @click="startGame"
                >Start New Game</q-btn
            >
        </q-footer>
    </q-page>
</template>

<script>
import { useRandomStore } from "../stores/random"
import { usePlayersStore } from "../stores/player"
import { defineComponent } from "vue"

export default defineComponent({
    name: "IndexPage",
    setup() {
        const playersStore = usePlayersStore()
        const randomStore = useRandomStore()
        return { playersStore, randomStore }
    },
    data() {
        return {
            playerList: [
                { index: 1, name: "", label: "Player 1" },
                { index: 2, name: "", label: "Player 2" },
                { index: 3, name: "", label: "Player 3" },
                { index: 4, name: "", label: "Player 4" },
                { index: 5, name: "", label: "Player 5" },
                { index: 6, name: "", label: "Player 6" },
            ],
            random: false,
        }
    },
    methods: {
        startGame() {
            this.randomStore.setRandom(this.random)

            this.playerList.forEach((player, index) => {
                if (player.name) {
                    this.playersStore.addPlayer(player.name)
                }
            })
            this.$router.push("/game")
        },
    },
})
</script>
