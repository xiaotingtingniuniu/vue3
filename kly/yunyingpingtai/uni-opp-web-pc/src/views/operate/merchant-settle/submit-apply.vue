<template>
    <div class="information-management">
        <el-steps :active="3" align-center>
            <el-step title="填写认证信息"></el-step>
            <el-step title="选择经营业务"></el-step>
            <el-step title="提交申请资料"></el-step>
            <el-step title="平台审核"></el-step>
        </el-steps>
        <div>
            <!-- <SubmitLife v-if="addMerchant.busiCode==='A1001010'"></SubmitLife> -->
            <!-- <SubmitSuppliers v-if="addMerchant.busiCode==='A1001009'" :handleType="handleType"></SubmitSuppliers> -->
            <SubmitContainer v-if="addMerchant.busiCode==='A1001002'" :handleType="handleType"></SubmitContainer>
            <SubmitB2B v-else-if="addMerchant.busiCode==='A1001006'||addMerchant.busiCode==='A1001005'||addMerchant.busiCode==='A1001001'||addMerchant.busiCode==='A1001011'" :handleType="handleType"></SubmitB2B>
            <SubmitLife :handleType="handleType" v-else></SubmitLife>
        </div>
    </div>
</template>
<script setup>
import SubmitLife from './comments/submit-life.vue'
import SubmitSuppliers from './comments/submit-suppliers.vue'
import SubmitContainer from './comments/submit-container.vue'
import SubmitB2B from './comments/submit-b2b.vue'
// import personBusinesses from './comments/person-businesses.vue'
const addMerchant = JSON.parse(sessionStorage.getItem('addMerchant'))
const props = defineProps(['handleType', 'busiMerchantId', 'busiMerchantStatus'])
</script>
<style lang="scss" scoped>

</style>
