<template>
    <q-page class="row justify-center">
        <div class="text-white text-h5 q-mt-lg">Round: {{ round }}</div>

        <div style="width: 100%">
            <q-table
                hide-bottom
                class="transparent no-box-shadow"
                dense
                card-class="text-white text-h3"
                :rows="rows"
                :columns="columns"
                row-key="name"
                style="min-height: 500px"
                :rows-per-page-options="[6]"
            >
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="dealer" :props="props">
                            <q-badge v-if="props.row.isDealer" color="red"
                                >D</q-badge
                            >
                            <q-badge v-if="props.row.isStarting" color="green"
                                >S</q-badge
                            >
                        </q-td>
                        <q-td
                            key="name"
                            :props="props"
                            :class="
                                isLeadingPlayer(props.row) ? 'text-green' : ''
                            "
                        >
                            <div
                                class="text-weight-bold"
                                style="font-size: 1rem"
                            >
                                {{ props.row.name }}
                            </div>
                        </q-td>
                        <q-td
                            key="phase"
                            :props="props"
                            style="min-width: 150px"
                        >
                            <div class="row justify-between items-center">
                                <div
                                    class="text-subtitle1"
                                    clickable
                                    v-if="props.row.phase > 0"
                                    @click="decreasePhase(props.row)"
                                >
                                    -
                                </div>
                                <div>
                                    <div
                                        class="text-subtitle1 text-weight-bold"
                                    >
                                        {{ props.row.phase }}
                                    </div>
                                    <div class="text-subtitle2">
                                        {{
                                            props.row.phases[
                                                props.row.phase - 1
                                            ]
                                        }}
                                    </div>
                                </div>

                                <div
                                    class="text-subtitle1"
                                    clickable
                                    @click="increasePhase(props.row)"
                                >
                                    +
                                </div>
                            </div>
                        </q-td>
                        <q-td key="score" :props="props">
                            <div
                                clickable
                                @click="changeScore(props.row)"
                                class="text-subtitle1"
                            >
                                {{ props.row.score }}
                            </div>
                        </q-td>
                    </q-tr>
                </template>
            </q-table>
        </div>
        <q-footer
            class="transparent row justify-center items-center q-pa-md q-mb-xl q-gutter-x-md"
            ><q-btn color="green" full-width @click="nextRound"
                >Next Round</q-btn
            >
            <q-btn color="secondary" full-width @click="endGame"
                >End Game</q-btn
            >
        </q-footer>
    </q-page>
</template>

<script>
import { ref } from "vue"
import { useQuasar } from "quasar"
import { usePlayersStore } from "../stores/player"
import { useRandomStore } from "../stores/random"
export default {
    setup() {
        const quasar = useQuasar()
        const store = usePlayersStore()
        const randomStore = useRandomStore()
        const random = ref(randomStore.random)
        const rows = ref([])
        store.players.forEach((player, index) => {
            const newPlayer = {
                index: index,
                name: player.name,
                phase: 1,
                score: 0,
                isDealer: index == 0 ? true : false,
                isStarting: index == 1 ? true : false,
                phases: [],
            }
            rows.value.push(newPlayer)
        })
        return {
            store,
            quasar,
            rows,
            random,
        }
    },
    data() {
        return {
            phases: [
                "2 Sets of 3",
                "Set of 3, Run of 4",
                "Set of 4, Run of 4",
                "Run of 7",
                "Run of 8",
                "Run of 9",
                "2 Sets of 4",
                "7 Cards of 1 Color",
                "Set of 5, Set of 2",
                "Set of 5, Set of 3",
            ],
            round: 1,
            columns: [
                {
                    name: "dealer",
                    label: "Dealer/Starter",
                    align: "center",
                    field: "isDealer",
                },
                {
                    name: "name",
                    required: true,
                    label: "Name",
                    align: "left",
                    field: (row) => row.name,
                    format: (val) => `${val}`,
                },
                {
                    name: "phase",
                    align: "center",
                    label: "Phase",
                    field: "phase",
                },
                {
                    name: "score",
                    align: "center",
                    label: "Score",
                    field: "score",
                },
            ],
        }
    },
    methods: {
        isLeadingPlayer(row) {
            const phases = this.rows.map((row) => row.phase)
            const numberOfPlayersInMaxPhase = new Map(
                [...new Set(phases)].map((x) => [
                    x,
                    phases.filter((y) => y === x).length,
                ])
            )
            const maxPhase = Math.max(...phases)
            if (numberOfPlayersInMaxPhase.get(maxPhase) > 1) {
                const maxPhaseRows = this.rows.filter(
                    (row) => row.phase === maxPhase
                )
                const minValue = Math.min(
                    ...maxPhaseRows.map((row) => row.score)
                )
                return row.score === minValue && maxPhaseRows.includes(row)
            }
            return row.phase === maxPhase
        },
        decreasePhase(row) {
            row.phase--
        },
        increasePhase(row) {
            row.phase++
        },
        changeScore(row) {
            this.quasar
                .dialog({
                    title: "Change Score",
                    message: "Enter the new score",
                    prompt: {
                        model: "",
                        isValid: (val) => !isNaN(val), // << here is the magic
                        type: "number", // optional
                    },
                    cancel: true,
                    persistent: true,
                })
                .onOk((data) => {
                    row.score = row.score + parseInt(data)
                })
        },
        endGame() {
            this.quasar
                .dialog({
                    title: "End Game",
                    message: "Would you like to end this game?",
                    cancel: true,
                    persistent: true,
                })
                .onOk(() => {
                    this.store.resetPlayers()
                    this.$router.push("/")
                })
                .onOk(() => {
                    this.store.resetPlayers()
                    this.$router.push("/")
                })
                .onCancel(() => {
                    // console.log('>>>> Cancel')
                })
                .onDismiss(() => {
                    // console.log('I am triggered on both OK and Cancel')
                })
        },
        nextRound() {
            this.round++

            const dealerIndex = this.rows.findIndex((row) => row.isDealer)
            const nextDealerIndex = (dealerIndex + 1) % this.rows.length
            this.rows[nextDealerIndex].isDealer = true
            this.rows[dealerIndex].isDealer = false

            const starterIndex = this.rows.findIndex((row) => row.isStarting)
            const nextStarterIndex = (starterIndex + 1) % this.rows.length
            this.rows[nextStarterIndex].isStarting = true
            this.rows[starterIndex].isStarting = false
        },
        shuffle(array) {
            var currentIndex = array.length,
                temporaryValue,
                randomIndex

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex)
                currentIndex -= 1

                // And swap it with the current element.
                temporaryValue = array[currentIndex]
                array[currentIndex] = array[randomIndex]
                array[randomIndex] = temporaryValue
            }

            return array
        },
    },
    watch: {
        random: {
            handler(val) {
                if (val) {
                    this.rows.forEach((row) => {
                        row.phases = this.shuffle([
                            "2 Sets of 3",
                            "Set of 3, Run of 4",
                            "Set of 4, Run of 4",
                            "Run of 7",
                            "Run of 8",
                            "Run of 9",
                            "2 Sets of 4",
                            "7 Cards of 1 Color",
                            "Set of 5, Set of 2",
                            "Set of 5, Set of 3",
                        ])
                    })
                } else {
                    this.rows.forEach((row) => {
                        row.phases = this.phases
                    })
                }
            },
            immediate: true,
        },
    },
}
</script>
