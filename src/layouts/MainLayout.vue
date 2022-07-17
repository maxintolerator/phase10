<template>
    <q-layout view="lHh Lpr lFf">
        <q-header class="transparent">
            <q-toolbar>
                <q-toolbar-title class="row items-center justify-center">
                    <img
                        class="q-pa-md"
                        src="img/phase10.png"
                        style="width: 200px"
                    />
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue"

export default defineComponent({
    name: "MainLayout",
})
</script>
