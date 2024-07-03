<template>
    <div class="abnormal-container">
        <!-- 摄像头异常 -->
        <!-- <van-nav-bar title="工单详情" fixed placeholder left-arrow  @click-left="closePage">
        </van-nav-bar> -->
        <orderInfo :fileList="fileList" :list="list"></orderInfo>
        <orderButton :dataList="dataList" :list1="list" @handleClick="obHandleClick"></orderButton>
        <van-dialog v-model:show="equststus" @confirm="equstatuscancel" @cancel="equstatusrefuse()" show-cancel-button title="确定获取设备最新状态" class="agreeDialog shootingShow" confirmButtonText="确定" cancelButtonText="关闭">
            <div class="unbind-tips">
                <!-- <p class="unbind-tips-desc">操作解除设备绑定后，系统会创建工单由管理员审批</p>-->
                <h4 class="unremot-tips-title">提示：</h4>
                <ul class="unremot-tips-title-content">
                    <li> 1、单个设备每10秒最多只能下发1个更新指令，请勿频繁操作。</li>
                    <li> 2、下发更新指令后，设备返回结果需要一定时间，请耐心等待。</li>
                </ul>

            </div>
        </van-dialog>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
    getCameraWorkOrderStatus, getRefreshEquipmentStatus
} from '@/api/device'
import { msgIdGetDetailId } from '@/api/order'
// import { closePage } from '@/utils/composables'
import orderInfo from '../components/order-info.vue'
import orderButton from '../components/order-button.vue'

const route = useRoute()
const msgId = route.query.msgId
const extField = ref(null)

const list = ref(null)
const deviceCode = ref(null)

// const list1 = ref(null)

const fileList = {
    orderTitle: '工单信息',
    orderNumber: '工单编号',
    orderType: '工单类型',
    orderState: '工单状态',
    deviceName: '设备名称',
    deviceCode: '设备编号',
    deviceModelName: '设备型号',
    orderCreateTime: '工单创建时间',
    ownerName: '柜主名称',
    AgentName: '代运营商名称',
    devicePosition: '点位'

}
const dataList = {
    orderTitle: '异常信息',
    buttonText: '更新摄像头状态',
    abnormalType: '异常类型',
    cameraState: '摄像头状态',
    doorName: '门信息'

}
// const list1 = {
//     orderTitle: '异常信息',
//     temperature: 5,
//     targetTemp: 4,
//     buttonText: '更新当前温度',
//     abnormalType: 4,
//     cameraState: 4,
//     doorLockState: 1
// }
const getopenDoorDetail = async () => {
    console.log(extField.value.workOrderNo, '000')
    const param = {
        workOrderId: extField.value ? extField.value.workOrderNo : '',
        busiCode: 'A1001022',
        appKey: 'A1001001'
    }

    const res = await getCameraWorkOrderStatus(param)

    if (res.code === '200') {
        list.value = res.data || {}
        deviceCode.value = res.data.deviceCode
    }

    // init(param, paramsObj)
}

const queryDetailId = async () => {
    const param = {
        msgId: msgId,
        busiCode: 'A1001002'
    }
    const res = await msgIdGetDetailId(param)
    console.log(res)
    if (res.code === '200') {
        extField.value = JSON.parse(res.data.extField)
        getopenDoorDetail()
    }
}
if (msgId) {
    console.log('消息中台跳转')
    queryDetailId()
}

const getRefreshStatus = async () => {
    const param = {
        deviceCode: deviceCode.value,
        abnormalTypeList: [list.value.abnormalType + ''],
        busiCode: 'A1001022',
        appKey: 'A1001001'
    }

    const res = await getRefreshEquipmentStatus(param)

    if (res.code === '200') {
        // 需要和产品确认
    }

    // init(param, paramsObj)
}
// const obHandleClick = () => {
//     getRefreshStatus()
// }
const equststus = ref(false)

const obHandleClick = () => {
    // 需要二次弹窗
    equststus.value = true
    // getRefreshStatus()
}
const equstatusrefuse = async (values) => {
    equststus.value = false
}
const equstatuscancel = async (values) => {
    getRefreshStatus()
}
</script>
<style lang="scss" scoped>
.abnormal-container{
    --van-nav-bar-icon-color: #000;
    --van-nav-bar-arrow-size: 35px;
    --van-nav-bar-text-color: #FE7E41;
    --van-nav-bar-title-font-size: 36px;
    --van-base-font-family:'PingFangSC-Medium, PingFang SC' ;
    --van-nav-bar-text-size: 30px;

    .van-nav-bar__placeholder{
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            z-index: 9999;
        }
        .van-hairline--bottom:after{
            border-bottom-width: 0;
        }
    }
    :deep(.van-nav-bar__title ){
        font-size: 32px;
        font-weight: 500;
        color: #191919;
    }
    :deep(.nav-right-icon){
        font-size: 30px;
        font-weight: 500;
        color: #FE7E41
    }
    .van-cell-group {
        :deep(.van-cell){
        border-bottom: 1px solid #F4F5F5;
        height: 101px;
        box-sizing: border-box;
        font-size: 30px;
    }
    }
    :deep(.van-cell::after){
    border-bottom: none;

}
    .unremot-tips-title {
        padding-left: 64px;
        font-size: 30px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #696969;
        margin-top: 30px;
    }
    .device-seat-span {
        width: 420px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
    }
    .unbind-tips-title-content {
        margin-top: 10px;
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #696969;
        padding-left: 64px;

        line-height: 42px;
        margin-bottom: 40px;
    }
    .unremot-tips-title-content {
        margin-top: 10px;
        // height: 136px;
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #696969;
        padding-left: 64px;
        padding-right: 64px;
        line-height: 42px;
        margin-bottom: 40px;
    }

    .unbind-tips-title {
        width: 584px;
        padding-left: 64px;
        font-weight: 400;
        color: #000000;
        height: 20px;

        font-size: 28px;
        margin: 0 auto;
    }

}
</style>
