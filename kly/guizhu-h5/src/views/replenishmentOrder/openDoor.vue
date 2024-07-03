<template>
    <div class="openDoorBox">
        <div class="openDoorContent">
            <div class="tipsBox">请按照以下示例进行拍照</div>
            <div class="instructions">扫码开门前需对货柜进行拍照，请保证照片可以清晰展示柜内商品。防止照片出现不完整、过暗或模糊的情况</div>
            <img src="@/assets/replenishmentlmOrder/tips.png" class="chartUrl" />
        </div>
        <van-button color="#FE7E41" loading-type="spinner" class="completeBox" :loading="buttonDisabled" @click="complete">开始拍照</van-button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { appBridge, registerhandler } from '@/utils/bridge.js'
import { useRoute } from 'vue-router'
import { Toast } from 'vant'
import { newPage } from '@/utils/composables' // newPage
import { opening } from '@/api/scan/scan.js'
import { getQueryVariable } from '@/utils'
import { tracker } from '@/utils/tracker'
import { getAppStorageFn } from '@/utils/storage'

const route = useRoute()

const equipmentCode = route.query.equipmentCode // 接受从传的设备编号
const orderId = route.query.id
const equipmentName = route.query.equipmentName
const billNo = route.query.billNo
const doorType = route.query?.doorType
const queryValue = ref('1')

// 开始拍照
const buttonDisabled = ref(false)
const complete = () => {
    if (buttonDisabled.value) return false
    buttonDisabled.value = true
    getAppStorageFn('trackerAct', async (val) => {
        if (!val) return false
        await tracker({
            module: 'openDoor',
            subModule: 'openDoorPage',
            event: 'takePicture_click',
            params: {
                act: val,
                click_time: new Date().valueOf(),
                functionName: '补货单',
                deviceId: equipmentCode,
                deviceName: equipmentName,
                doorType: doorType || ''
            }
        })
    })
    registerhandler('setPhotoBackToWeb', async (vla) => {
        if (vla) {
            getAppStorageFn('trackerAct', async (val) => {
                if (!val) return false
                await tracker({
                    module: 'photo',
                    subModule: 'photoPage',
                    event: 'pictureConfirm_click',
                    params: {
                        act: val,
                        click_time: new Date().valueOf(),
                        functionName: '补货单',
                        deviceId: equipmentCode,
                        deviceName: equipmentName,
                        doorType: doorType || ''
                    }
                })
            })
            Toast('照片上传成功')
            buttonDisabled.value = false
            registerhandler('setScanResult', async (val) => {
                const url = decodeURIComponent(val)
                const change = getQueryVariable('v', url)
                if (change === equipmentCode) {
                    const resOpen = await opening({
                        counterUrl: equipmentCode, // containerCode
                        doorType: doorType || ''
                    })
                    await tracker({
                        module: 'openDoor',
                        subModule: 'openDoorApi',
                        event: 'run_api',
                        params: {
                            click_time: new Date().valueOf(),
                            deviceId: equipmentCode,
                            functionName: '补货单',
                            pathname: window.location.href,
                            visibilityState: document.visibilityState,
                            doorType: doorType || ''
                        }
                    })
                    buttonDisabled.value = false
                    if (resOpen.code === 'A0421') {
                        Toast('对不起，您没有此货柜的操作权限')
                    } else {
                        if (resOpen.data.applyStatus === 6) {
                            newPage(`/replenishment-list?showNavbar=0&replenishBefore=${encodeURIComponent(vla)}&id=${orderId}&containerCode=${equipmentCode}&containerName=${equipmentName}&billNo=${billNo}&key=${queryValue.value}`, {
                                id: orderId,
                                containerCode: equipmentCode,
                                containerName: equipmentName,
                                billNo: billNo,
                                replenishBefore: encodeURIComponent(vla)
                            })
                        } else {
                            newPage('/openFailshowNavbar=1')
                        }
                    }
                } else {
                    Toast('货柜不正确，请扫描补货单对应货柜的二维码')
                }
            })
            appBridge('openScan', 2)
        }
    })
    registerhandler('takePhotoCancel', () => {
        buttonDisabled.value = false
    })
    appBridge('takePhoto')
}
</script>
<style lang="scss" scoped>
.openDoorBox {
    background: #fff;
    min-height: 100vh;
    overflow: auto;
    // padding-top: 20px;
    .openLine {
        width: 750px;
        height: 2px;
        background: #f4f5f5;
        margin-top: 20px;
    }
    .openDoorContent {
        margin-top: 30px;
        .tipsBox {
            font-size: 32px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #fe7e41;
            margin-left: 200px;
        }
        .instructions {
            width: 690px;
            font-size: 26px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #696969;
            margin-top: 16px;
            margin-left: 30px;
        }
        .chartUrl {
            width: 690px;
            height: 920px;
            margin-top: 32px;
            margin-left: 30px;
            border-radius: 24px;
        }
    }
    .completeBox {
        width: 630px;
        height: 92px;
        background: #fe7e41;
        border-radius: 46px;
        font-size: 30px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        position: fixed;
        left: 60px;
        bottom: 76px;
    }
}
</style>
