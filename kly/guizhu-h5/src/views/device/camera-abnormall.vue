<template>
    <div class="containerDetails">
        <!-- 工单信息 -->
        <div class="equipmentBox">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    工单信息1
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
                    {{list.orderType==1?'设备异常':list.orderType ===2?'远程拍摄':'-'}}
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
                <div class="orderRight">
                    {{list.installationLocation}}
                </div>
            </div>
        </div>
        <!-- 异常信息 -->
        <div class="equipmentBoxTwo">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    拍摄信息
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    拍摄操作人
                </div>
                <div class="orderRight">
                    {{list.applicantName}}
                </div>
            </div>
            <!-- <div class="order">
                <div class="orderLeft">
                    摄像头照片1
                </div>
                <div class="orderRight">
                    {{list.orderType==1?'设备异常':list.orderState===2?'远程拍摄':'-'}}
                </div>
            </div> -->
            <div class="video">
                摄像头照片1
            </div>
            <div class="order" v-if="list.doorType">
                <div class="orderLeft">
                    门名称
                </div>
                <div class="orderRight">
                    {{list.doorName}}
                </div>
            </div>
            <div class="video" v-if="list.photoUrl">
                <div class="videoContent">
                    <img :src="list.photoUrl.split(',')[0]" alt="" class="img-icon">
                </div>
            </div>
            <!-- <div class="order">
                <div class="orderLeft">
                    门编号
                </div>
                <div class="orderRight">
                    {{list.doorType===0?'单门':list.doorType === 1?'左门':list.doorType === 2?'右门':''}}
                </div>
            </div> -->

            <div class="video">
                摄像头照片2
            </div>
            <div class="video">
                <div class="videoContent" v-if="list.photoUrl">
                    <van-image :src="list.photoUrl.split(',')[1]" class="img-icon" style="height: 100%;width: 100%;">
                        <template v-slot:error>
                            <div style="display: flex;flex-direction:column;justify-content: center;align-items: center;">
                                <img :src="errorImg" height="30" width="30" style="height: 30px;width: 30px">
                                <span class="err-text">照片获取失败</span>
                            </div>
                        </template>
                    </van-image>
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
    getWorkOrderShoot
} from '@/api/device'
import { msgIdGetDetailId } from '@/api/order'
const route = useRoute()
const msgId = route.query.msgId
const extField = ref(null)
const errorImg = require('@/assets/device/default_bg.png')

const list = ref(null)
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

// const init = async (param, paramsObj) => {
//     const res = await getWorkOrderShoot(...param, ...paramsObj)

//     if (res.code === '200') {
//         list.value = res.data || []
//         console.log(res.data)
//     }
// }

const getopenDoorDetail = async () => {
    const param = {
        workOrderId: extField.value ? extField.value.workOrderNo : '',
        busiCode: 'A1001022',
        appKey: 'A1001001'
    }

    const res = await getWorkOrderShoot(param)

    if (res.code === '200') {
        list.value = res.data || []
        console.log(res.data)
    }
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
    :deep(.van-image__error){
        background: none
    }
    overflow:auto;
    padding-bottom: 16px;
    padding-bottom: calc(16px + constant(safe-area-inset-bottom));
    padding-bottom: calc(16px + env(safe-area-inset-bottom));

    .equipmentBox{
        width: 690px;
        // height: 644px;
        box-sizing: border-box;
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
    .equipmentBoxTwo {
        width: 690px;
        box-sizing: border-box;
        background: #fff;

        border-radius: 8px;
        margin-top: 20px;
        margin-left: 30px;
        padding-bottom: 30px;
    }
    .informationBox{
        display: flex;
        // height: 62px;
        border-bottom: 1px solid #EDEDED ;
        // box-sizing: border-box;
        padding-top: 20px;
        padding-bottom: 22px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        font-size: 30px;

        color: #191919;

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
    .order{
        display: flex;
        justify-content:space-between;
        margin-top: 16px;

    }
    .deviceAdress{
        max-width: 320px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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
    }
    .err-text {
        margin-top: 16px;
        font-size: 28px;
        color: #fff;
        font-family: PingFangSC-Regular, PingFang SC;

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
            background: #CCCCCC;
            overflow: hidden;
            width: 630px;
                height: 316px;
            img{
                width: 100%;
                height: 100%;
                border-radius:8px;

            }

                border-radius: 4px;

        }

}

</style>
