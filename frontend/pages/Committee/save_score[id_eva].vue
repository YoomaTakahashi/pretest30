<template>
    <v-container>
        <v-row>
            <v-col cols=12>
                <v-form v-if="user.status_eva === 1" @submit.prevent="saveScore">
                    <h1 class="font-weight-bold">แบบประเมินตนเอง</h1>
                    <v-card class="mt-3" elevation="5" rounded>
                        <p class="ms-2">คุณ : {{ user.fname }} {{ user.lname }}</p>
                        <p class="ms-2">รอบการประเมินที่ : {{ user.round_sys }} ปี : {{ user.year_sys }}</p>
                    </v-card>
                    <v-row v-for="(topic,t) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="font-weight-bold">{{ (t+1) }}.{{ topic.name_topic }}</h1>
                            <v-card elevation="5" rounded class="py-2 pa-4">
                                <v-row v-for="(indicate,i) in topic.indicates" :key="indicate.id_indicate">
                                    <v-col cols="12" >
                                        {{ (t+1) }}.{{ (i+1) }} {{ indicate.name_indicate }} รายละเอียดตัวชี้วัด : {{ indicate.detail_indicate }} น้ำหนักคะแนน : {{ indicate.point_indicate }} คะแนนเต็ม : {{ indicate.point_indicate*4 }}
                                        <p class="mt-2">รายละเอียด: {{ indicate.detail_eva || '-' }}</p>
                                        <p class="mt-2">File: <v-btn v-if="indicate.file_eva" size="smail" color="blue" @click="viweFile(indicate.file_eva)">เปิดดู</v-btn> <v-sapn v-else>ไม่มี</v-sapn></p>
                                        <v-select v-if="indicate.check_indicate === 'y'" label="ใส่คะแนน1-4" variant="solo-filled" :items="[1,2,3,4]" v-model="indicate.score" ></v-select>
                                        <v-text-field v-else label="ใส่คะแนน1-4" variant="solo-filled" v-model="indicate.score" @input="indicate.score > 4 ? indicate.score = 4 :null" type="number" min="1"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                    <div class="pa-2">
                        <label for="ข้อเสนอแนะ">
                            <v-textarea class="mt-2" label="(ถ้ามี)" variant="solo-filled" v-model="detail_commit" rows="2"></v-textarea>
                        </label>
                    </div>
                    <div class="mt-3 text-center">
                        <v-btn color="info" type="submit">บันทึกคะแนน</v-btn>
                    </div>
                </v-form>
                <v-alert variant="tonal" type="success" color="success" v-else-if="user.status_commit === 'y'">ประเมินสำเร็จ</v-alert>
                <v-alert variant="tonal" type="error" color="error" v-else>ไม่มีแบบประเมิน </v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { commit } from '../../API/base';

const user = ref<any>({})
const topics = ref<any>([])
const detail_commit = ref('')
const id_eva = useRoute().params.id_eva

const viweFile = (filename:string) =>{
    const url = new URL (`http://localhost:3001/uploads/file_eva/${filename}`)
    window.open(url,'_blank')
}

const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${commit}/save_score/user/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    } catch (error) {
        console.error('Error get user',error)
    }
}
const fetchTopic = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${commit}/save_score/topic/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    } catch (error) {
        console.error('Error get topic',error)
    }
}

onMounted(async()=>{
    await Promise.all([fetch(),fetchTopic()])
})


const saveScore = async()=>{
    const token = localStorage.getItem('token')
    const formData = new FormData()
    const allScore = topics.value.flatMap((t:any)=>
        t.indicates.map((i:any)=>{
            return{
                id_topic:t.id_topic,
                id_indicate:i.id_indicate,
                score:i.score,
                detail_eva:i.detail_eva,
            }
        })
    )
    if(allScore.some((s:any)=> !s.score)){
        alert('กรุณากรอกคะแนนให้สมบูรณ์')
        return
    }
    formData.append('scores',JSON.stringify(allScore))
    const detail_commitTo = ref('')
    if (detail_commit.value && detail_commit.trim() ){
        detail_commitTo.value = detail_commit.value
    }else{ detail_commit.value = 'ไม่มี' }
    formData.append('detail_commit',detail_commitTo.value)
    try {
        await axios.post(`${commit}/save_score/save/${id_eva}`,formData,{headers:{Authorization:`Bearer ${token}`}})
        alert('ประเมินสำเร็จ')
        await Promise.all([fetch(),fetchTopic()])
    } catch (error) {
        console.error('ERror post score',error)
    }
}

</script>

<style scoped>

</style>