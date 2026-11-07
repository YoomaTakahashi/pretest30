<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card class="mb-3">
                    <v-card-title><h1 class="text-center">ผู้รับการประเมินผล</h1></v-card-title>
                    <v-card-text>
                        <p>ชื่อ-สกุล: {{ header.fname }} {{ header.lname }}</p>
                        <p>รอบการประเมินที่: {{ header.round_sys }} {{ header.year_sys }}</p>
                    </v-card-text>
                </v-card>
                <v-card>
                    <v-card-title>
                        <h1 class="text-center">สถานะการประเมินของกรรมการประเมิน</h1>
                    </v-card-title>
                    <v-card-text>
                        <v-table class="mt-3">
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">กรรมการประเมิน</th>
                                    <th class="border text-center">ตำแหน่ง</th>
                                    <th class="border text-center">สถานะการประเมิน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.fname}} {{ items.lname }}</td>
                                    <td class="border text-center">{{ items.level_commit }}</td>
                                    <td class="border text-center">
                                        <center>
                                            <v-btn class="text-center text-white ma-2" :color="bg(items.status_commit)" size="small">{{items.status_commit === 'y' ? 'ประเมินสำเร็จ':'รอการประเมิน'}}</v-btn>
                                        </center>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center text-red" colspan="12" v-if="result.length === 0">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { api, staff } from '~/API/base'

const error = ref<Record<string,string>>({})
const result = ref([])
const header = ref([])
const form = ref({
    id_eva:null,
    id_member:'',
    id_sys:'',
    day_eva:''
})
const reset = ()=>{
    form.value = {
        id_eva:null,
        id_member:'',
        id_sys:'',
        day_eva:''
    }
}

const id_eva = useRoute().params.id_eva
const token = import.meta.client ? localStorage.getItem('token'):null

const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/commit/header/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        header.value = res.data
        const res2 = await axios.get(`${staff}/status/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res2.data
    } catch (error) {
        console.error("error get",error);
        
    }
}

const bg = (status)=>{
    if(status === 'n')return 'error'
    if(status === 'y')return 'success'
}

onMounted(fetch)
</script>

<style scoped>

</style>