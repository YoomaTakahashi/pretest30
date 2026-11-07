<template>
    <v-container>
        <v-row>
            <v-col cols=12>
                <v-form @submit.prevent="saveScore">
                    <h1 class="font-weight-bold">แบบประเมินตนเอง</h1>
                    <v-card class="mt-3" elevation="5" rounded>
                        <p>คุณ : {{ user.fname }} {{ user.lname }}</p>
                        <p>รอบการประเมินที่ : {{ user.round_sys }} ปี : {{ user.year_sys }}</p>
                    </v-card>
                    <v-row v-for="(topic,t) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="font-weight-bold">{{ t+1 }}.{{ topic.name_topic }}</h1>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>