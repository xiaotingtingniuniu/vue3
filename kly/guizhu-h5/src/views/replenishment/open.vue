<template>
    <div class="openBox">
        <div class="openContent">
            <p class="doorTitle">扫码开门</p>
            <div class="openList">
                <button class="theDoorBox" @click="resultBut" v-if="authorized.check('scan-open')" :disabled="isLock">
                    <img src="@/assets/replenishmentImg/open@2x.png" alt="" class="openImg" />
                    <div class="theDoorTitle">开门</div>
                </button>
                <button class="theDoorBox" @click="replenishmentBtn(1)" v-if="authorized.check('scan-good')" :disabled="isLock">
                    <img src="@/assets/replenishmentImg/administration@2x.png" alt="" class="repairImg" />
                    <div class="theDoorTitle">补货</div>
                </button>
                <button class="theDoorBox" @click="replenishmentBtn(2)" v-if="authorized.check('scan-inventory')" :disabled="isLock">
                    <img src="@/assets/replenishmentImg/Inventory@2x.png" alt="" class="openImg" />
                    <div class="theDoorTitle">盘货</div>
                </button>
                <div class="theDoorBox">
                    <img src="@/assets/replenishmentImg/expect@2x.png" alt="" class="expectImg" />
                    <div class="theDoorTitle">敬请期待</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { opening } from '@/api/scan/scan.js'
import { useRoute } from 'vue-router'
import authorized from '@/utils/authorized'
import { newPage } from '@/utils/composables'
import { tracker } from '@/utils/tracker'
import { setAppStorageFn } from '@/utils/storage'

const route = useRoute()

const deviceName = route.query.deviceName
const deviceCode = route.query.deviceCode

const deviceFirstType = route.query.deviceFirstType
const isLock = ref(false)

// 跳转开门结果
const resultBut = async () => {
    // 双开门
    if (deviceFirstType === '20') {
        newPage(`/multi-type-device/select-device-door?showNavbar=0&deviceName=${deviceName}&deviceCode=${deviceCode}&isNeedOpen=1`, {
            deviceName,
            deviceCode,
            isNeedOpen: 1
        })
        return
    }

    isLock.value = true
    const res = await opening({ counterUrl: deviceCode })
    await tracker({
        module: 'openDoor',
        subModule: 'openDoorApi',
        event: 'run_api',
        params: {
            click_time: new Date().valueOf(),
            deviceId: deviceCode,
            functionName: '开门(扫码开门)',
            pathname: window.location.href,
            visibilityState: document.visibilityState,
            deviceFirstType
        }
    })
    isLock.value = false
    if (res.msg === 'token无效或已过期') {
        newPage('/setting/identity')
    } else if (res.data.applyStatus === 6) {
        newPage('/openingResult')
    } else if (res.data.applyStatus === 3) {
        newPage('/openFail')
    }
}
// 跳转补货
const replenishmentBtn = async (pageType) => {
    // 双开门
    if (deviceFirstType === '20') {
        newPage(`/multi-type-device/select-device-door?showNavbar=0&pageType=${pageType}&deviceName=${deviceName}&deviceCode=${deviceCode}&isNeedOpen=1`, {
            pageType,
            deviceName,
            deviceCode
        })
        return
    }
    isLock.value = true
    const resOpen = await opening({ counterUrl: deviceCode })
    await tracker({
        module: 'openDoor',
        subModule: 'openDoorApi',
        event: 'run_api',
        params: {
            click_time: new Date().valueOf(),
            deviceId: deviceCode,
            functionName: `${pageType === 1 ? '补' : '盘'}货(扫码开门)`,
            pathname: window.location.href,
            visibilityState: document.visibilityState
        }
    })
    isLock.value = false
    if (resOpen.data.applyStatus === 6) {
        if (pageType === 1) {
            const act = new Date().valueOf()
            setAppStorageFn('trackerAct', act + '')
            await tracker({
                module: 'openDoor',
                subModule: 'openDoorPage',
                event: 'restoreButton_click',
                params: {
                    act,
                    click_time: act,
                    deviceId: deviceCode
                }
            })
            newPage(`/replenishmentList?showNavbar=0&pageType=${pageType}&deviceName=${deviceName}&deviceCode=${deviceCode}`, {
                pageType,
                deviceName,
                deviceCode
            })
        } else {
            newPage(`/inventoryList?showNavbar=0&pageType=${pageType}&deviceName=${deviceName}&deviceCode=${deviceCode}`, {
                pageType,
                deviceName,
                deviceCode
            })
        }
    } else if (resOpen.data.applyStatus === 3) {
        newPage('/openFail')
    }
}
</script>
<style lang="scss" scoped>
.openBox {
    height: 1481px;
    background: #fff;
    overflow: auto;
    .openTitle {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        width: 750px;
        height: 128px;
        background: #ffffff;
        font-size: 34px;
        text-align: center;
        // margin-top: 56px;
        line-height: 140px;
        .back {
            color: #000;
            float: left;
            margin-left: 20px;
            margin-top: 50px;
        }
    }
    .openContent {
        margin-top: 56px;

        padding-top: constant(safe-area-inset-top) !important;
        padding-top: env(safe-area-inset-top) !important;
        .doorTitle {
            font-size: 60px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: bold;
            color: #0d0d0d;
            margin-left: 60px;
            margin-top: 10px;
        }
        .openList {
            .theDoorBox {
                width: 290px;
                height: 320px;
                background: #ffffff;
                box-shadow: 0px 12px 24px 0px rgba(160, 148, 148, 0.23);
                border-radius: 24px;
                margin-top: 60px;
                margin-left: 60px;
                float: left;
                border: none;
            }
            .openImg {
                width: 82px;
                height: 95px;
                margin-top: 20px;
                // margin-left: 104px;
            }
            .repairImg {
                width: 92px;
                height: 92px;
                margin-top: 25px;
                // margin-left: 104px;
            }
            .expectImg {
                width: 72px;
                height: 92px;
                margin-top: 82px;
                margin-left: 104px;
            }
            .theDoorTitle {
                font-size: 30px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #0d0d0d;
                // margin-left: 114px;
                text-align: center;
                margin-top: 46px;
            }
        }
    }
}
</style>
