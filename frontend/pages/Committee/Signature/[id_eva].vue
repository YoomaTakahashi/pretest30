<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-center">ยืนยันการประเมิน</h1>
                    </v-card-title>
                    <v-card-text>
                        <br>
                        <v-form v-if="!result.signature" @submit.prevent="saveMember">
                            <v-row>
                                <!-- <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อเอกสาร" v-model="name_doc" :error-messages="error.name_doc" prepend-inner-icon="mdi-file-edit"></v-text-field>
                                </v-col> -->
                                <v-col cols="12" md="12">
                                    <v-file-input label="เอกสาร" v-model="file" :error-messages="error.file" prepend-inner-icon="mdi-file" accept=".png,.jpg" hint="รองรับเฉพาะไฟล์ png jpg ขนาดไม่เกิน 10MB" persistent-hint></v-file-input>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn class="text-center ma-2" color="primary" type="submit">บันทึก</v-btn>
                                        <v-btn class="text-center ma-2" color="error" @click="reset()">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                        <v-table v-else class="mt-3">
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">เอกสาร</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <td class="border text-center">{{ 1 }}</td>
                                    <td class="border text-center">{{ result.signature}}</td>
                                    <td class="border text-center">
                                        <v-btn class="text-center text-white ma-2" color="info" size="small" prepend-icon="mdi-eye" @click="view(result.signature)">เปิดดู</v-btn>
                                        <v-btn class="text-center text-white ma-2" color="error" size="small" @click="del(result.id_eva)">ลบ</v-btn>
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
import { api, commit, staff } from '~/API/base'

const error = ref<Record<string,string>>({})
const file = ref<File | null>(null)
const reset = ()=>{
    file.value = null
}
const id_eva = useRoute().params.id_eva

function validate(){
    error.value = {}
    const maxSize = 10*1024*1024

    if(!file.value)error.value.file = "กรุณาเลือกไฟล์เอกสาร"

    if(file.value?.size > maxSize)error.value.file = 'ไฟล์มีขนาดเกิน 10MB'


    return Object.keys(error.value).length === 0
}

const token = import.meta.client ? localStorage.getItem('token'):null
const saveMember = async()=>{

    if(!validate())return
    const formdata = new FormData
    formdata.append('file',file.value!)
    try {
        await axios.post(`${commit}/signature/${id_eva}`,formdata,{headers:{Authorization:`Bearer ${token}`}})
        alert("ดำเนินการสำเร็จ")
        await reset()
        await fetch()
    } catch (error) {
        console.error("Error save",error);
        
    }
}

const fetch = async()=>{
    try {
        const res = await axios.get(`${commit}/signature/show/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    } catch (error) {
        console.error("error get",error);
        
    }
}


const del = async(id_eva:number)=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้ใช่หรือไม่'))return
    try {
        await axios.delete(`${commit}/signature/delete/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    } catch (error) {
        console.error("error delete",error);
        
    }
}



const result = ref([])

const view = (file:string)=>{
    const url = new URL(`/uploads/signature/${file}`,api).href
    window.open(url,'_blank')
}

onMounted(fetch)
</script>

<style scoped>

</style>