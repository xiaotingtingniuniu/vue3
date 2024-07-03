<template>
    <div class="containerDetails">
        <div class="equipmentBox" v-if="list1 !== null">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    {{ dataList.orderTitle }}
                </div>
            </div>
            <div class="order" v-if="dataList.abnormalType">
                <div class="orderLeft">
                    {{ dataList.abnormalType }}
                </div>
                <div class="orderRight">
                    {{list11?.abnormalType===1?'网络异常':list1?.abnormalType===2?'位置异常':list1?.abnormalType===3?'温度异常':list1?.abnormalType===4?'摄像头异常':list1?.abnormalType===5?'门锁异常':'-'}}
                </div>
            </div>
            <div class="order" v-if="dataList?.cameraState">
                <div class="orderLeft">
                    {{ dataList.cameraState }}
                </div>
                <div class="orderRight" :class="[list1.abnormalType === 4 ? 'normalClasss' : 'errClasss']">
                    {{list1.cameraState===4?'主辅正常':list1.cameraState===5?'辅异常':list1.cameraState===6?'主异常':list1.cameraState===7?'主辅异常':'-'}}
                </div>
            </div>

            <div class="order" v-if="dataList?.temperature">
                <div class="orderLeft">
                    {{  dataList.temperature  }}
                </div>
                <div class="orderRight" :class="[list1.abnormalType === 3 ? 'normalClasss' : 'errClasss']">
                    {{list1?.temperature}}℃
                </div>
            </div>
            <div class="order" v-if="dataList?.targetTemp">
                <div class="orderLeft">
                    {{  dataList.targetTemp  }}
                </div>
                <div class="orderRight">
                    {{list1?.targetTemp}}℃
                </div>
            </div>

            <div class="order" v-if="dataList?.doorLockState">
                <div class="orderLeft">
                    {{  dataList.doorLockState  }}
                </div>
                <div class="orderRight" :class="[list1?.abnormalType === 5 ? 'normalClasss' : 'errClasss']">
                    {{list1?.doorLockState===3?'门关锁关':list1?.doorLockState===4?'门关锁开':list1?.doorLockState===5?'门开锁关':list1?.doorLockState===6?'门开锁开':list1.doorLockState===7?'双设异常':'-'}}
                </div>
            </div>
            <!-- 异常门信息 -->
            <div class="order" v-if="list1.doorType">
                <div class="orderLeft">
                    {{  dataList.doorName }}
                </div>
                <div class="orderRight" :class="[list1?.abnormalType === 5 ? 'normalClasss' : 'errClasss']">
                    {{list1?.doorName}}
                </div>
            </div>
            <!-- 这是button按钮 -->
            <div class="bottom" v-if="dataList.buttonText" >
                <span class="btn" @click="jump">{{dataList.buttonText}}</span>
            </div>

        </div>
    </div>

</template>
<script setup>
import { defineEmits } from 'vue'
const emit = defineEmits()

const props = defineProps({
    list1: {
        type: Object,
        default: () => {}
    },
    dataList: {
        type: Object,
        default: () => {}
    }
})

const init = async () => {

}

init()
const jump = async () => {
    emit('handleClick')
}
console.log(props.list1, 'list1')
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
         .errClass {
        color: #69925a;

    }

    .normalClasss {
         color: #ff2442;
    }
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
