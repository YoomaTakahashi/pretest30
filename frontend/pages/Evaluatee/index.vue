<template>
    <v-container>
        <v-card class="round" elevation="5" rounded>
            <v-sheet elevation="5" rounded class="pa-4">
                <h1 class="font-weight-bold text-center">DashBoard - Evaluatee</h1>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="4" v-for="b in box" :key="b">
                            <v-card elevation="5" rounded class="round py-2">
                                <div class="pa-2 text-center"><h2>{{ b.title }}</h2></div>
                                <div class="pa-2 text-center"><h1>{{ b.value }}</h1></div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-sheet>
        </v-card>
        <v-card class="round mt-3" elevation="5" rounded>
            <v-sheet elevation="5" rounded class="pa-4">
                <h1 class="font-weight-bold text-center">รอบการประเมินทั้งหมด</h1>
                <v-table class="table">
                    <tr>
                        <th class="border pa-2 bg-grey" style="width: 10%;">ลำดับ</th>
                        <th class="border pa-2 bg-grey" style="width: 10%;">ชื่อ-นามสกุล</th>
                        <th class="border pa-2 bg-grey" style="width: 10%;">รอบการประเมินทั้งหมด</th>
                        <th class="border pa-2 bg-grey" style="width: 10%;">ปีการประเมินทั้งหมด</th>
                    </tr>
                    <tr v-for="(indicate) in indicates" :key="indicate">
                        <td class="border pa-2 text-center" style="width: 10%;">{{ 1 }}</td>
                        <td class="border pa-2 text-center" style="width: 10%;">{{ indicate.fname }} {{ indicate.lname }}</td>
                        <td class="border pa-2 text-center" style="width: 10%;">{{ indicate.round_sys }}</td>
                        <td class="border pa-2 text-center" style="width: 10%;">{{ indicate.year_sys }}</td>
                    </tr>
                </v-table>
            </v-sheet>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api,eva } from '~/API/base';

const box = ref([])
const indicates = ref<any>([])

const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${api}/dash/eva`,{headers:{Authorization:`Bearer ${token}`}})
        box.value = res.data.box
    } catch (error) {
        console.error('Error get box',error)
    }
}
const fetchIn = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/table`,{headers:{Authorization:`Bearer ${token}`}})
        indicates.value = res.data
    } catch (error) {
        console.error('Error get box',error)
    }
}

onMounted(async()=>{
    await Promise.all([fetch(),fetchIn()])
})
</script>

<style scoped>
.round{
    border-radius: 20px !important;
}
</style>