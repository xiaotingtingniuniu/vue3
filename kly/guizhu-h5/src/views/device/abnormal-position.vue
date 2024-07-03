<template>
    <div class="containerDetails seat-abnormal">
        <van-nav-bar title="工单详情" fixed placeholder left-arrow  @click-left="closePage">
        </van-nav-bar>
        <!-- 工单信息 -->
        <div class="equipmentBox" v-if="list !== null">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    工单信息                </div>
            </div>
            <div class="order mt12" v-if="list.orderId">
                <div class="orderLeft">
                    工单单号
                </div>
                <div class="orderRight">
                    {{list.orderId}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    工单状态
                </div>
                <div class="orderRight">
                    {{list.orderState===0?'待处理':list.orderState===1?'已处理':'-'}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    工单类型
                </div>
                <div class="orderRight">
                    {{list.orderType==1?'设备异常':list.orderType===2?'远程拍摄':'-'}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    设备编号
                </div>
                <div class="withinRight">
                    {{list.deviceCode}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    设备名称
                </div>
                <div class="orderRight">
                    {{list.deviceName}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    设备型号
                </div>
                <div class="orderRight">
                    {{list.deviceModelName}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    创建时间
                </div>
                <div class="orderRight">
                    {{list.createTime}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    柜主
                </div>
                <div class="orderRight">
                    {{list.ownerName}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    代运营商
                </div>
                <div class="orderRight">
                    {{list.agentOperatorName}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    点位
                </div>
                <div class="orderRight deviceAdress">
                    {{list.installationLocation}}
                </div>
            </div>
        </div>
        <!-- 异常信息 -->
        <div class="equipmentBox" v-if="list !== null">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    异常信息
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    异常类型
                </div>
                <div class="orderRight">
                    {{list.abnormalityType===1?'离线异常':list.abnormalityType===2?'位置变更异常':'-'}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    点位
                </div>
                <div class="orderRight">
                    {{list.installationLocation || '-'}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    当前定位
                </div>
                <div class="orderRight">
                    {{list.latestLocationAddress}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    位置偏移
                </div>
                <div class="orderRight">
                    {{list.maxOffsetDistance}}KM
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    持续时长
                </div>
                <div class="orderRight">
                    {{list.durationMinutes}}
                </div>
            </div>
            <!-- h后续注释 -->
            <!-- <div class="bottom">
                <span class="btn" @click="jump(list.deviceCode)">变更设备安装位置</span>
            </div> -->
            <div class="bottom" v-if="list.orderState !== 1">
                <span class="btn" @click="jump(list.deviceCode)">变更设备安装位置</span>
            </div>
        </div>
    </div>
    <!-- <order-info :list="list"></order-info> -->
</template>
<script setup>

// const list = ref(null)
// list.value = {
//     abnormalityType: 1,
//     agentOperatorId: '代运营商编号',
//     agentOperatorName: '代运营商名称',
//     createTime: '2022-10-23',
//     creatorId: '11',
//     deviceCode: '11',
//     deviceModel: '22',
//     deviceName: 'deviceName',
//     durationSeconds: 0,
//     installationLocation: '安装位置',
//     orderId: '工单编号',
//     orderState: 0, // 工单状态 0-待处理 1-已处理
//     orderType: 0, // 工单类型 1-设备异常 2-远程拍摄
//     ownerId: '柜主编号',
//     ownerName: 'ownerName',
//     processingMode: 0,
//     processingResult: '处理结果',
//     processingTime: '22',
//     processorId: '',
//     processorName: '处理人名称',

//     applicantId: '',
//     applicantName: '',
//     applicationState: 0,
//     photoUrl: ''

// }

import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// import orderInfo from './components/order-info'
import {
    getPositionChange
} from '@/api/device'
import { msgIdGetDetailId } from '@/api/order'
import { closePage } from '@/utils/composables'

const router = useRouter()
const route = useRoute()
const msgId = route.query.msgId
const extField = ref(null)

const list = ref(null)

// const init = async (param, paramsObj) => {
//     const res = await getWorkOrderOffLine(...param, ...paramsObj)

//     if (res.code === '200') {
//         list.value = res.data || []
//         console.log(res.data)
//     }
// }

const getopenDoorDetail = async () => {
    console.log(extField.value.workOrderNo, '000')
    const param = {
        workOrderId: extField.value ? extField.value.workOrderNo : '',
        busiCode: 'A1001022',
        appKey: 'A1001001'
    }

    console.log(extField.value.workOrderNo, '000')

    const res = await getPositionChange(param)

    if (res.code === '200') {
        list.value = res.data || []
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
const jump = async (index) => {
    router.push({
        path: '/device/device-seat',
        name: 'device-seat',
        query: {
            index: index,
            target: 'abnormal',
            showNavbar: 0

        }
    })
}
</script>
<style lang="scss" scoped>
.seat-abnormal{
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

}
</style>

<style lang="scss" scoped>
.containerDetails{
    overflow:auto;

    .equipmentBox{
        width: 690px;
        // height: 644px;
        background: #FFFFFF;
        border-radius: 8px;
        margin-top: 20px;
        margin-left: 30px;
        position: relative;
        padding-bottom: 30px;
        .bottom{
        padding: 60px 30px 0;
        width: calc(100vw - 110px);
            .btn{
                display: inline-block;
                width: 100%;
                height: 92px;
                line-height: 92px;
                background: #FE7E41;
                border-radius: 46px;
                text-align: center;
                color: #fff;
                font-size: 30px;
            }
        }
        .withinRight{
            width: 470px;
            color: #191919;
            margin-right: 30px;
            text-align: right;
        }
    }
    .informationBox{
        display: flex;
        padding-top: 26px;
    }
    .line{
        width: 10px;
        height: 28px;
        background: #FE7E41;
        display: block;
        margin-top: 6px;
    }
    .informationTitle{
        font-size: 30px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191919;
        margin-left: 20px;
    }
    .transverse{
        width: 631px;
        height: 2px;
        margin-left: 30px;
        background: #F2F6F9;
        margin-top: 17px;
    }
    .mt12{
        margin-top: 24px;
    }
    .order{
        display: flex;
        justify-content:space-between;
        margin-top: 16px;
    }
//     .deviceAdress{
//         max-width: 320px;
//         overflow: hidden;
//         white-space: nowrap;
//         text-overflow: ellipsis;
//         // word-break: break-all;
//         // word-wrap: break-word;
//    }
      .orderBox{
        display: flex;
        justify-content:space-between;
        margin-top: 25px;
        padding-bottom: 25px;
    }
    .orderLeft{
        width: max-content;
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        padding: 0 30px;
    }
    .orderRight{
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191919;
        margin-right: 30px;
        flex: 1;
        display: flex;
        justify-content: flex-end;
        text-align: right;
    }
    .video{
            font-size: 26px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            margin-left: 30px;
            margin-top: 25px;
        }
        .videoContent{
            overflow: hidden;
            overflow-x: scroll;
            display: flex;
            .shoppingVideo{
                width: 600px;
                height: 300px;
                // border: 1px solid #000;
                margin-left: 30px;
                margin-top: 20px;
                .videxBox{
                    width: 600px;
                    height: 300px;
                    object-fit: fill;
                }
            }
        }

}

</style>
