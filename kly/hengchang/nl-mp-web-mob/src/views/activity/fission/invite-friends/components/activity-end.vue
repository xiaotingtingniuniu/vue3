<template>
    <div class="activity-end">
        <div class="banner"></div>
        <div class="explain" @click="isDialog = true">活动说明</div>
        <explain v-model="isDialog" title="邀请方活动说明" :text="props.invitationCouponDesc"></explain>
    </div>
</template>
<script setup>
import explain from '../../components/explain'
const props = defineProps({
    invitationCouponDesc: {
        type: String
    }
})
const isDialog = ref(false)
</script>
<style lang="scss" scoped>
.activity-end {
    position: relative;
    .banner {
        height: 638px;
        background: url('~@assets/activity/fission/activity-end-banner1.png') no-repeat;
        background-size: 100% 100%;
    }
    .explain {
        position: absolute;
        top: 100px;
        right: 0;
        width: 118px;
        height: 44px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 100px 0px 0px 100px;
        font-size: 22px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FF503A;
        line-height: 44px;
        text-align: center;
    }
}
</style>
