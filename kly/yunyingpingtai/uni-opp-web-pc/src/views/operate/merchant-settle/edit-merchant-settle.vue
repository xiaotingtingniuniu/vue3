<template>
    <div class="information-management">
        <EditSupplier v-if="addMerchant.busiCode==='A1001009'||addMerchant.busiCode==='A1001002'" :handleType="handleType"></EditSupplier>
        <EditLife v-else :handleType="handleType"></EditLife>
    </div>
</template>
<script setup>
import EditLife from './comments/edit-life.vue'
import EditSupplier from './comments/edit-supplier.vue'
// import personBusinesses from './comments/person-businesses.vue'
const addMerchant = JSON.parse(sessionStorage.getItem('addMerchant'))
const props = defineProps(['handleType', 'busiMerchantId', 'busiMerchantStatus'])
</script>
<style lang="scss" scoped>

</style>
