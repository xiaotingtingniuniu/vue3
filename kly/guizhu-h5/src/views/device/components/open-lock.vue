<template>
    <div class="containerDetails">
        <van-dialog v-model:show="selectDoor" show-cancel-button title="远程提锁" class="agreeDialog" confirmButtonText="确定" cancelButtonText="取消" @confirm="confirmLock('OpenLock')" @cancel="refuseCancel">
            <div class="unbind-remotelock">
                <p>请选择要操作的弹窗</p>
                <van-radio-group v-model="checked">
                    <van-radio name="1">左门</van-radio>
                    <van-radio name="2">右门</van-radio>
                </van-radio-group>
            </div>
        </van-dialog>
    </div>

</template>
<script setup>
import { defineEmits, ref } from 'vue'
const emit = defineEmits()

const props = defineProps({
    selectDoorLock: {
        type: Boolean,
        default: false
    },
    dataList: {
        type: Object,
        default: () => {}
    }
})

const init = async () => {

}

const checked = ref(false)
init()
// const jump = async () => {
//     emit('handleClick')
// }
const confirmLock = async () => {
    alert(8)
    emit('confirmLock')
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
