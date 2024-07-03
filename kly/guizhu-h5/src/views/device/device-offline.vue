<template>
    <div class="containerDetails">
        <!-- 工单信息 -->
        <div class="equipmentBox">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    工单信息
                </div>
            </div>
            <div class="order mt12">
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
                    安装位置
                </div>
                <div class="orderRight" style="">
                    {{list.installationLocation}}
                </div>
            </div>
        </div>
        <!-- 异常信息 -->
        <div class="information">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    异常信息
                </div>

            </div>
            <div class="transverse"></div>
            <div class="order">

                <div class="orderLeft">
                    异常类型
                </div>
                <div class="orderRight">
                    {{list.abnormalityType==1?'离线异常':list.abnormalityType===2?'位置变更异常':'-'}}
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
            <div class="order">
                <div class="orderLeft">
                    处理方式
                </div>
                <div class="orderRight">
                    {{list.processingMode===1?'自动处理':list.processingMode===2?'手动处理':'-'}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    处理结果
                </div>
                <div class="orderRight">
                    {{list.processingResult || '-'}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    处理人
                </div>
                <div class="orderRight">
                    {{list.processorName}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    处理时间
                </div>
                <div class="orderRight">
                    {{list.processingTime}}
                </div>
            </div>
        </div>
    </div>
    <!-- <order-info :list="list"></order-info> -->
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
// import orderInfo from './components/order-info'
import {
    getWorkOrderOffLine
} from '@/api/device'
import { msgIdGetDetailId } from '@/api/order'
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

    const res = await getWorkOrderOffLine(param)

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

</script>
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
        padding-bottom: 30px;
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

.deviceAdress{
    max-width: 320px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
}    .order{
        display: flex;
        justify-content:space-between;
        margin-top: 16px;
    }
    .orderBox{
        display: flex;
        justify-content:space-between;
        margin-top: 25px;
        padding-bottom: 25px;
    }
    .mt12{
        margin-top: 24px;
    }
    .orderLeft{
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        margin: 0 30px;
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
    }
}
.information{
        width: 690px;
        height: 476px;
        background: #FFFFFF;
        border-radius: 8px;
        margin-top: 20px;
        margin-left: 30px;

    }
</style>
