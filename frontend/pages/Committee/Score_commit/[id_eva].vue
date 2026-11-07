<template>
    <v-container>
        <v-row>
            <v-col cols=12>
                <v-form v-if="user.status_commit === 'y'">
                    <h1 class="font-weight-bold">คะแนนประเมินของกรรมการรประเมิน</h1>
                    <v-row v-for="(topic,t) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="font-weight-bold">{{ (t+1) }}.{{ topic.name_topic }}</h1>
                             <v-table class="table">
                                <tr>
                                    <th class="border pa-2 bg-grey" style="width: 10%;">ตัวชี้วัด</th>
                                    <th class="border pa-2 bg-grey" style="width: 10%;">รายละเอียดตัวชี้วัด</th>
                                    <th class="border pa-2 bg-grey" style="width: 10%;">น้ำหนักคะแนน</th>
                                    <th class="border pa-2 bg-grey" style="width: 10%;">คะแนนเต็ม</th>
                                    <th class="border pa-2 bg-grey" style="width: 10%;">รายละเอียด</th>
                                    <th class="border pa-2 bg-grey" style="width: 10%;">คะแนนที่ได้</th>
                                </tr>
                                <tr v-for="(indicate,i) in topic.indicates" :key="indicate.id_indicate">
                                    <td class="border pa-2 text-center" style="width: 10%;">{{ indicate.name_indicate }}</td>
                                    <td class="border pa-2 text-center" style="width: 10%;">{{ indicate.detail_indicate }}</td>
                                    <td class="border pa-2 text-center" style="width: 10%;">{{ indicate.point_indicate }}</td>
                                    <td class="border pa-2 text-center" style="width: 10%;">{{ indicate.point_indicate*4 }}</td>
                                    <td class="border pa-2 text-center" style="width: 10%;">{{ indicate.detail_commit }}</td>
                                    <td class="border pa-2 text-center" style="width: 10%;">{{ indicate.point_indicate*indicate.score_commit }}</td>
                                </tr>
                             </v-table>
                        </v-col>
                    </v-row>
                    <div class="mt-3 text-end">
                        <v-card color="green">คะแนนรวม : {{ user.total_commit }} คะแนน</v-card>
                    </div>
                </v-form>
                <v-alert variant="tonal" type="success" color="success" v-else-if="user.status_commit === 'n'">ยังไม่ได้ประเมิน</v-alert>
                <v-alert variant="tonal" type="error" color="error" v-else>ไม่มีแบบประเมิน </v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api, eva,commit } from '~/API/base';

const user = ref<any>({})
const topics = ref<any>([])
const id_eva =useRoute().params.id_eva


const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${commit}/score_commit/user/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    } catch (error) {
        console.error('Error get user',error)
    }
}
const fetchTopic = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${commit}/score_commit/topic/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    } catch (error) {
        console.error('Error get topic',error)
    }
}

onMounted(async()=>{
    await Promise.all([fetch(),fetchTopic()])
})

</script>

<style scoped>

</style>