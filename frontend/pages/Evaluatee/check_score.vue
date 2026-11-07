<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="font-weight-bold">ตรวจสอบผลการประเมิน</h1>
            </v-col>
            <v-col cols="12">
                <v-card  class="pa-2 py-4 rounded">
                    <center>
                        <nuxt-link to="/Evaluatee/Score_member"><v-btn color="blue">ผลการประเมินของผู้รับการประเมิน</v-btn></nuxt-link>&nbsp;&nbsp;
                        <nuxt-link to="/Evaluatee/Score_commit"><v-btn color="green">ผลการประเมินของกรรมการประเมิน</v-btn></nuxt-link>
                    </center>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

</script>

<style scoped>
.rounded{
    border-radius: 20px !important;
}
</style>