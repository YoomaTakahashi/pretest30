<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card color="#7d0c14">
                    <v-card-title>
                        <center><v-img class="mt-3" width="15%" src="/img/logo.png"></v-img></center>
                        <h1 class="text-center dashboard-card-title">เข้าสู่ระบบ</h1>
                        <h2 class="text-center dashboard-card-title">NTC Evaluation System</h2>
                        <h2 class="text-center dashboard-card-title">ระบบประเมินบบุคลากรวิทยาลัยเทคนิคน่าน</h2>
                    </v-card-title>
                    <v-card-text class="bg-white">
                        <br>
                        <v-alert variant="tonal" type="error" v-if="error">{{ error }}</v-alert>
                        <v-form @submit.prevent="login">
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-text-field label="ชื่อผู้ใช้" v-model="username" prepend-inner-icon="mdi-account"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-text-field label="รหัสผ่าน" v-model="password"  :prepend-inner-icon="show ? 'mdi-eye':'mdi-eye-off'" :type="showPw ? 'text':'password'" @click:prepend-inner="show = !show , showPw = !showPw"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-select label="ประเภทสมาชิก" v-model="role"  prepend-inner-icon="mdi-account-group" :items="typeR"></v-select>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn class="text-center ma-2" color="primary" type="submit">เข้าสู่ระบบ</v-btn>
                                        <v-btn class="text-center ma-2" color="error" type="reset">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                        <nuxt-link to="/regis" class="text-center text-blue text-decoration-none"><p>หากไม่มีบัญชี? สมัครสมาชิก</p></nuxt-link>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import auth from '~/API/auth'
import { api } from '~/API/base'

definePageMeta({
    layout:false
})
const error = ref('')
const pic_user = ref<File | null>(null)
const typeR = ['ฝ่ายบุคลากร','ผู้รับการประเมินผล','กรรมการประเมิน']
const show = ref(false)
const showPw = ref(false)


const username = ref('')
const password = ref('')
const role = ref('')


const login = async()=>{


    try {
        const res = await auth.login({
            username:username.value,
            password:password.value,
            role:role.value
        })
        console.log("login Success",res.data);
        localStorage.setItem('token',res.data.token)
        const useRole = res.data.role
        alert("ดำเนินการสำเร็จ")
        if(useRole === 'ฝ่ายบุคลากร')return useRouter().push('/Staff')
        if(useRole === 'ผู้รับการประเมินผล')return useRouter().push('/Evaluatee')
        if(useRole === 'กรรมการประเมิน')return useRouter().push('/Committee')
    } catch (err:any) {
        console.error("Error login",err);
        error.value = err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ'
        
    }
}

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
