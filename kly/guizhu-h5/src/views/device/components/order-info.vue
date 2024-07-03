<template>
    <div class="containerDetails">
        <!-- 工单信息 -->
        <div class="equipmentBox">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    {{fileList.orderTitle}}
                </div>
            </div>
            <div class="order mt12">
                <div class="orderLeft">
                    {{fileList.orderNumber}}
                </div>
                <div class="orderRight">
                    {{list?.orderId}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    {{fileList.orderType}}
                </div>
                <div class="orderRight">
                    {{list?.orderType===2?'远程拍摄':list?.orderType===1?'设备异常':'-'}}

                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    {{fileList.orderState}}
                </div>
                <div class="orderRight">
                    {{list?.orderState===0?'待处理':list?.orderState===1?'已处理':'-'}}

                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    {{fileList.deviceCode}}
                </div>
                <div class="withinRight">
                    {{list?.deviceCode}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    {{fileList.deviceName}}
                </div>
                <div class="orderRight">
                    {{list?.deviceName}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    {{fileList.deviceModelName}}
                </div>
                <div class="orderRight">
                    {{list?.deviceModelName}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    {{fileList.orderCreateTime}}
                </div>
                <div class="orderRight">
                    {{list?.createTime}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    {{fileList.ownerName}}
                </div>
                <div class="orderRight">
                    {{list?.ownerName}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    {{fileList.AgentName}}
                </div>
                <div class="orderRight">
                    {{list?.agentOperatorName}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    {{fileList.devicePosition}}
                </div>
                <div class="orderRight" style="">
                    {{list?.installationLocation}}
                </div>
            </div>
        </div>
    </div>

</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
    list: {
        type: Object,
        default: () => {}
    },
    fileList: {
        type: Object,
        default: () => {}
    }
})

const dataList = ref([])
const init = async () => {
    dataList.value.push({})
}
init()

console.log(props.list, 'list')
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
