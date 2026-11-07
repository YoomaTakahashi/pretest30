<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title><h1 class="text-center dashboard-card-title">รายงาน</h1></v-card-title>
                    <v-card-text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">รายงาน</th>
                                    <th class="border text-center">รายละเอียด</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="border text-center">1</td>
                                    <td class="border text-center">รายงาน</td>
                                    <td class="border text-center"><v-btn class="text-center text-white" size="small" color="info" to="/Staff/re_eva">รายละเอียด</v-btn></td>
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
