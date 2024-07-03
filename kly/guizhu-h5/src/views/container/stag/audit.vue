<template>
    <div class="audit">
        <div class="audit-content">
            <div>
                <img :src="aduit" alt="" v-if="props.orderStatus === '11'">
                <img :src="fail" alt="" v-else>
            </div>
            <div>
                <div class="ispass" v-if="props.orderStatus === '11'">审核中</div>
                <div class="ispass" v-else>审核失败</div>
            </div>
            <div>
                <div v-if="props.orderStatus === '11'" class="described">24小时内完成审核，请耐心等待</div>
                <div v-else class="described">请联系客户经理跟进后续流程</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { auditInfo, goPayment } from '@/api/container'
import { appBridge, registerhandler } from '@/utils/bridge.js'

// 1-审核中，2-审核失败
const props = defineProps(['orderNo', 'orderStatus'])
const fail = require('@/assets/audit-nopass.png')
const aduit = require('@/assets/audit-pass.png')
const auditStatus = ref(null)
onMounted(() => {
    console.log(props)
    auditDetail()
})

const auditDetail = async () => {
    appBridge('doBrEvent', {
        event: 3
    })
    registerhandler('onBrCallback', async (val) => {
        const { gid } = val
        await goPayment({
            orderNo: props.orderNo,
            gid
        })
    })
    const res = await auditInfo({
        orderNo: props.orderNo
    })
    auditStatus.value = res.data.auditStatus.data.auditStatus
}
</script>
<style lang="scss" scoped>
    .audit{
        width: 100%;
        height: 100%;
        margin-top: 20px;
        .audit-content{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: 200px;
            img{
                width: 216px;
                height: 218px;
            }
            .ispass{
                margin-top: 20px;
                font-weight: 700;
            }
            .described{
                margin-top: 20px;
                color: #696969;
            }
        }
    }
</style>
