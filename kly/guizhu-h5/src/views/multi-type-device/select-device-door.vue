<template>
    <div class="device-management">
        <van-nav-bar title="选择货柜门" fixed placeholder left-arrow @click-left="goBack" />
        <div class="img-wrap">
            <img :src="img" class="double-door" />
        </div>
        <div class="footer-btn">
            <button @click="openDoor(1)" :disabled="isLock">{{ isNeedOpen === '1' ? '开左门' : '选左门' }}</button>
            <button @click="openDoor(2)" :disabled="isLock">{{ isNeedOpen === '1' ? '开右门' : '选右门' }}</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
// import { appBridge } from '@/utils/bridge'
import { useRoute } from 'vue-router'
import { opening } from '@/api/scan/scan.js'
import { tracker } from '@/utils/tracker'
import { newPage, closePage } from '@/utils/composables'
import { setAppStorageFn } from '@/utils/storage'
const img = require('@/assets/multi-type-device/double-door.png')
const isLock = ref(false)
const route = useRoute()
const deviceCode = route.query.deviceCode
const deviceName = route.query.deviceName
const pageType = route.query.pageType
const isNeedOpen = route.query.isNeedOpen
// 跳转开门结果
const openDoor = async (doorType) => {
    // 双开门
    if (isNeedOpen === '1') {
        if (pageType === '1' || pageType === '2') {
            replenishmentBtn(pageType, doorType)
        } else {
            resultBut(doorType)
        }
    } else {
        if (pageType === '1') {
            newPage(`/replenishmentList?showNavbar=0&pageType=${pageType}&deviceName=${deviceName}&deviceCode=${deviceCode}&doorType=${doorType}`, {
                pageType,
                deviceName,
                deviceCode,
                doorType
            })
        } else if (pageType === '2') {
            newPage(`/inventoryList?showNavbar=0&pageType=${pageType}&deviceName=${deviceName}&deviceCode=${deviceCode}&doorType=${doorType}`, {
                pageType,
                deviceName,
                deviceCode,
                doorType
            })
        } else if (pageType === '3') {
            newPage(`/price-change?showNavbar=0&pageType=${pageType}&deviceCode=${deviceCode}&deviceName=${deviceName}&doorType=${doorType}`, {
                pageType,
                deviceCode,
                deviceName,
                doorType
            })
        } else {
            resultBut(doorType)
        }

        // if (pageType === '3') {
        //     newPage(`/price-change?showNavbar=0&pageType=${pageType}&deviceCode=${deviceCode}&deviceName=${deviceName}&doorType=${doorType}`, {
        //         pageType,
        //         deviceCode,
        //         deviceName,
        //         doorType
        //     })
        // } else if (pageType === '1' || pageType === '2') {
        //     if (isNeedOpen === '1') {
        //         replenishmentBtn(pageType, doorType)
        //     } else {
        //         if (pageType === '1') {
        //             newPage(`/replenishmentList?showNavbar=0&pageType=${pageType}&deviceName=${deviceName}&deviceCode=${deviceCode}&doorType=${doorType}`, {
        //                 pageType,
        //                 deviceName,
        //                 deviceCode,
        //                 doorType
        //             })
        //         } else {
        //             newPage(`/inventoryList?showNavbar=0&pageType=${pageType}&deviceName=${deviceName}&deviceCode=${deviceCode}&doorType=${doorType}`, {
        //                 pageType,
        //                 deviceName,
        //                 deviceCode,
        //                 doorType
        //             })
        //         }
        //     }
    }
}

// appBridge('showTitle')

const goBack = () => {
    closePage()
}

// 跳转开门结果
const resultBut = async (doorType) => {
    isLock.value = true
    const res = await opening({ counterUrl: deviceCode, doorType })
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
            doorType
        }
    })
    isLock.value = false
    console.log('***', res.data.applyStatus === 6)
    if (res.msg === 'token无效或已过期') {
        newPage('/setting/identity')
    } else if (res.data.applyStatus === 6) {
        newPage('/openingResult')
    } else if (res.data.applyStatus === 3) {
        newPage('/openFail')
    }
}
// 跳转补货
const replenishmentBtn = async (pageType, doorType) => {
    // 双开门
    isLock.value = true
    const resOpen = await opening({ counterUrl: deviceCode, doorType })
    await tracker({
        module: 'openDoor',
        subModule: 'openDoorApi',
        event: 'run_api',
        params: {
            click_time: new Date().valueOf(),
            deviceId: deviceCode,
            functionName: `${pageType === 1 ? '补' : '盘'}货(扫码开门)`,
            pathname: window.location.href,
            visibilityState: document.visibilityState,
            doorType
        }
    })
    isLock.value = false
    if (resOpen.data.applyStatus === 6) {
        if (pageType === '1') {
            const act = new Date().valueOf()
            setAppStorageFn('trackerAct', act + '')
            await tracker({
                module: 'openDoor',
                subModule: 'openDoorPage',
                event: 'restoreButton_click',
                params: {
                    act,
                    click_time: act,
                    deviceId: deviceCode,
                    doorType
                }
            })
            newPage(`/replenishmentList?showNavbar=0&pageType=${pageType}&deviceName=${deviceName}&deviceCode=${deviceCode}&doorType=${doorType}`, {
                pageType,
                deviceName,
                deviceCode,
                doorType
            })
        } else if (pageType === '2') {
            newPage(`/inventoryList?showNavbar=0&pageType=${pageType}&deviceName=${deviceName}&deviceCode=${deviceCode}&doorType=${doorType}`, {
                pageType,
                deviceName,
                deviceCode,
                doorType
            })
        }
    } else if (resOpen.data.applyStatus === '3') {
        newPage('/openFail')
    }
}
</script>
<style lang="scss" scoped>
.device-management {
    --van-nav-bar-icon-color: #000;
    --van-nav-bar-arrow-size: 35px;
    --van-nav-bar-text-color: #fe7e41;
    --van-nav-bar-title-font-size: 34px;
    .van-nav-bar__placeholder {
        :deep(.van-nav-bar) {
            padding-top: var(--van-status-bar-height);
            z-index: 9999;
        }
    }
    .img-wrap {
        text-align: center;
        margin-top: 218px;
        .double-door {
            width: 682px;
            height: 682px;
        }
    }
    .footer-btn {
        display: flex;
        justify-content: center;
        margin-top: 194px;
        button {
            width: 320px;
            height: 92px;
            background: linear-gradient(90deg, #fe7e41 0%, #ff5d0f 100%, #ff5c0e 100%);
            border-radius: 46px;
            border: 0;
            color: #fff;
            font-size: 30px;
            font-weight: 500;
            margin: 0px 10px;
        }
    }
    .empty {
        text-align: center;
        margin-top: 204px;
        img {
            width: 64%;
        }
        .no-data {
            display: block;
            font-size: 30px;
            color: #999999;
        }
    }
}
</style>
