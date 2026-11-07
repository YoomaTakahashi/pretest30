<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-center dashboard-card-title">สถานะการประเมินของผู้รับการประเมินผล</h1>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field class="mt-3" v-model="search" prepend-inner-icon="mdi-magnify"></v-text-field>
                        <v-table class="mt-3">
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">ผู้รับการประเมินผล</th>
                                    <th class="border text-center">รอบการประเมิน</th>
                                    <th class="border text-center">วันที่ออกแบบประเมิน</th>
                                    <th class="border text-center">สถานะการประเมิน</th>
                                    <!-- <th class="border text-center">รายละเอียด</th> -->
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.fname}} {{ items.lname }}</td>
                                    <td class="border text-center">รอบการประเมินที่:{{items.round_sys}} ปี:{{ items.year_sys }}</td>
                                    <td class="border text-center">{{ formatDate(items.day_eva) }}</td>
                                    <!-- <td class="border text-center">
                                        <center><v-btn class="text-center text-white ma-2" color="success" size="small" @click="go(items.id_eva)">เพิ่มกรรมการ</v-btn></center>
                                    </td> -->
                                    <td class="border text-center">
                                        <center>
                                            <v-btn class="text-center text-white ma-2" :color="bg(items.status_eva)" size="small">{{items.status_eva === 1 ? 'รอการประเมินตนเอง':items.status_eva === 2 ? 'รอกรรมการประเมิน':'ประเมินสำเร็จ'}}</v-btn>
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
const dataResult = ref([])
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
const search = ref('')

function validate(){
    const f=  form.value
    error.value = {}

    if(!f.id_member)error.value.id_member = "กรุณาเลือกผู้รับการประเมินผล"
    if(!f.id_sys)error.value.id_sys = "กรุณาเลือกรอบการประเมิน"
    if(!f.day_eva)error.value.day_eva = "กรุณากรอกวันที่ออกแบบประเมิน"

    return Object.keys(error.value).length === 0
}

const token = import.meta.client ? localStorage.getItem('token'):null
const saveMember = async()=>{

    if(!validate())return
    const f = form.value
    try {
        f.id_eva
        ? await axios.put(`${staff}/eva/update/${f.id_eva}`,f,{headers:{Authorization:`Bearer ${token}`}})
        : await axios.post(`${staff}/eva/save`,f,{headers:{Authorization:`Bearer ${token}`}})
        alert("ดำเนินการสำเร็จ")
        await reset()
        await fetch()
    } catch (error) {
        console.error("Error save",error);
        
    }
}

const fetch = async()=>{
    try {
        const res = await axios.get(`${staff}/eva/show`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res.data
    } catch (error) {
        console.error("error get",error);
        
    }
}

const edit = (items:any)=>{
    form.value = {...items}
}

const del = async(id_eva:number)=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้ใช่หรือไม่'))return
    try {
        await axios.delete(`${staff}/eva/delete/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    } catch (error) {
        console.error("error delete",error);
        
    }
}

const formatDate = (dateStr:string)=>{
    if(!dateStr)return '-'

    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2,'0')
    const month = String(date.getMonth()).padStart(2,'0')
    const year = String(date.getFullYear())

    return `${day}/${month}/${year}`

}

const result = computed(()=>{
    if(!search.value)return dataResult.value
    const s = search.value.toLowerCase()
    return dataResult.value.filter((item:any)=>{
        return(
            item.fname.toLowerCase().includes(s) ||
            item.lname.toLowerCase().includes(s)
        )
    })
})

const bg = (status)=>{
    if(status === 1)return 'error'
    if(status === 2)return 'warning'
    if(status === 3)return 'success'
}

const go = (id_eva:number)=>{
    navigateTo({path:`/Staff/commit-eva-${id_eva}`})
}

onMounted(fetch)
</script>

<style scoped>
.dashboard-card-title {
    white-space: normal;
    overflow-wrap: anywhere;
    justify-content: center;
    text-align: center;
}

.dashboard-card-title h3 {
    font-size: clamp(1rem, 4vw, 1.4rem);
    line-height: 1.4;
}
</style>
