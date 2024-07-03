<template>
    <div class="information-management">
        <el-steps :active="1" align-center v-if="props.handleType==='add'||props.handleType==='editnew'">
            <el-step title="填写认证信息" description="" />
            <el-step title="选择经营业务" description="" />
            <el-step title="提交申请资料" description="" />
            <el-step title="平台审核" description="" />
        </el-steps>
        <div>
            <!-- <person-info v-if="merchantType == 2" ref="person"></person-info> -->
            <personBusinesses v-if="addMerchant.merchantType==1" :handleType="props.handleType"></personBusinesses>
            <personInfo v-if="addMerchant.merchantType==2" :handleType="props.handleType"></personInfo>
            <personMerchant v-if="addMerchant.merchantType==3" :handleType="props.handleType"></personMerchant>
        </div>
        <!-- <div class="btn"><el-button>上一步</el-button><el-button @click="save">保存</el-button><el-button type="primary">下一步</el-button></div> -->
    </div>
</template>
<script setup>
import { ref } from 'vue'
import personBusinesses from './comments/person-businesses.vue'
import personInfo from './comments/person-info.vue'
import personMerchant from './comments/person-merchant.vue'
const props = defineProps(['handleType'])
const addMerchant = JSON.parse(sessionStorage.getItem('addMerchant'))
</script>

<style scoped lang="scss">
.information-management {
    .title {
        font-size: 40px;
        font-weight: bold;
        padding-bottom: 40px;
    }
    .choose {
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        padding-top: 40px;
    }
    .role {
        text-align: center;
        padding-top: 40px;
    }
    .btn {
        padding-top: 40px;
        text-align: center;
    }
}
</style>
