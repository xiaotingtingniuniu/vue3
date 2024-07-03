<template>
    <div class="equipment-page">
        <van-tabs v-model:active="activeName" @click-tab="getList(true)" color="#FE7E41" title-active-color="#FE7E41" title-inactive-color="#191919">
            <form action="/">
                <van-search v-model="searchVal" @search="getList(true)" shape="round" placeholder="请输入设备编号或名称">
                    <template #left-icon>
                        <van-image :src="require('@/assets/replenishmentImg/search-left-icon.png')" />
                    </template>
                </van-search>
            </form>
            <van-tab :title="deviceNum?.allQty ? `全部(${deviceNum.allQty})` : '全部'" name=""></van-tab>
            <van-tab :title="deviceNum?.onlineQty ? `在线(${deviceNum.onlineQty})` : '在线'" :name="1"></van-tab>
            <van-tab :title="deviceNum?.offlineQty ? `离线(${deviceNum.offlineQty})` : '离线'" :name="0"></van-tab>
            <van-tab :title="deviceNum?.lockedQty ? `锁定(${deviceNum.lockedQty})` : '锁定'" :name="2"></van-tab>
        </van-tabs>
        <div class="van-tabs-heigh"></div>
        <van-pull-refresh v-model="refreshLoading" @refresh="getList(true)">
            <van-list v-if="dataList.length && authorized.check('device-good-detail')" @load="getList" v-model:loading="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false">
                <div class="card-item" v-for="(item, index) in dataList" :key="index" @click="distributeJump(item, 0)">
                    <div class="item-title van-hairline--bottom">
                        <div class="label">设备编号: {{ item.deviceCode }}</div>
                        <!-- 天波门店固定为在线状态 -->
                        <div class="color--68BD49" v-if="item.deviceCode === 'tb000001'">在线</div>
                        <div class="color--FF1E19" v-else-if="item.onlineState === 0">离线</div>
                        <div class="color--FE7E41" v-else-if="item.lockState === 1">锁定</div>
                        <div class="color--68BD49" v-else-if="item.onlineState === 1">在线</div>
                    </div>
                    <div class="item-content">
                        <van-image :src="require('@/assets/my-container.png')" />
                        <div class="info">
                            <div class="device-name">{{ item.deviceName }}</div>
                            <div class="device-num" v-if="item.secondCabinetTypeName">货柜类型：{{ item.secondCabinetTypeName }}</div>
                            <div class="device-num">
                                <div>货柜缺货：{{ (item.sumSnapshot || 0) - (item.goodsStock || 0) }}件（剩余{{ item.goodsStock || 0 }}件/{{ item.sumSnapshot || 0 }}件）</div>
                                <div v-if="item.deviceType === 20">
                                    <img :src="tipImg" class="tip-img" @click.stop="showTipPop(index)" />
                                    <!-- <img :src="toolTip" /> -->
                                    <div class="goods-last-list" v-show="item.showTipPop">
                                        <img :src="toolTip" class="tooltip-img" />
                                        <div class="tooltip-text">
                                            <div class="text">左门缺货: {{ (item.leftSumSnapshot || 0) - (item.leftGoodsStock || 0) }}件 (剩余{{ item.leftGoodsStock || 0 }}件/{{ item.leftSumSnapshot || 0 }}件)</div>
                                            <div class="text">右门缺货: {{ (item.rightSumSnapshot || 0) - (item.rightGoodsStock || 0) }}件 (剩余{{ item.rightGoodsStock || 0 }}件/{{ item.rightSumSnapshot || 0 }}件)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="device-time">上次补货时间：{{ item.lastReplenishTime || '--' }}</div>
                            <div class="button-box">
                                <van-button v-if="authorized.check('device-good-inventory')" @click.stop="distributeJump(item, 1)" hairline>补货</van-button>
                                <van-button v-if="authorized.check('device-good-taking-stock')" @click.stop="distributeJump(item, 2)" hairline>盘货</van-button>
                                <van-button v-if="authorized.check('device-good-edit-price')" @click.stop="distributeJump(item, 3)" hairline>改价</van-button>
                                <van-button class="last-button" @click.stop="distributeJump(item, 4)" hairline>操作记录</van-button>
                            </div>
                        </div>
                    </div>
                </div>
            </van-list>
            <div v-else class="empty-tip">
                <img :src="require('../../assets/replenishmentImg/noneDate@2x.png')" />
                <p>暂无数据</p>
            </div>
        </van-pull-refresh>
    </div>
</template>
<script setup>
import { ref, onBeforeMount, computed, onMounted } from 'vue'
import { deviceListList } from '@/api/scan/scan.js'
import { useRoute, useRouter } from 'vue-router'
import { newPage } from '@/utils/composables'
import authorized from '@/utils/authorized'
import { useStore } from 'vuex'
import { merchantSource } from '@/api/goods-transfer'
import { tracker } from '@/utils/tracker'
const store = useStore()
const route = useRoute()
const router = useRouter()
const merchantId = computed(() => store.state.userInfo.merchantId)
const tipImg = require('@/assets/multi-type-device/tip.png')
const toolTip = require('@/assets/multi-type-device/tooltip.png')
const refreshLoading = ref(false)

const activeName = ref('')

onBeforeMount(async () => {
    checkUpdata()
    getList()
})

onMounted(() => {
    document.body.addEventListener('click', (e) => {
        dataList.value.forEach((item) => {
            item.showTipPop = false
        })
    })
})

const searchVal = ref('')
const loading = ref(false)
const finished = ref(false)
const pageNum = ref(1)
const pageSize = 10
const dataList = ref([])
const deviceNum = ref(null)
const getList = async (reset = false) => {
    loading.value = true
    if (reset) {
        pageNum.value = 1
        finished.value = false
    }
    const param = {
        pageNum: pageNum.value,
        pageSize: pageSize,
        condition: searchVal.value,
        onlineState: activeName.value !== '' && activeName.value < 2 ? activeName.value : '',
        lockState: activeName.value !== '' && activeName.value === 2 ? 1 : '',
        queryDeviceNum: 1,
        operateType: 1
    }
    const { code, data } = await deviceListList(param)
    if (code === '200') {
        if (data.deviceNum) deviceNum.value = data.deviceNum
        dataList.value = pageNum.value === 1 ? data.list : [...dataList.value, ...data.list]

        dataList.value.forEach((item) => {
            item.showTipPop = false
        })

        pageNum.value++
        loading.value = false
        refreshLoading.value = false
        if (data.list.length < pageSize) finished.value = true
    }
}

const checkUpdata = async () => {
    if (merchantId.value) {
        const res = await merchantSource({
            appKey: 'A1001002',
            busiCode: 'A1001002',
            busiMerchantIdList: [merchantId.value]
        })
        if (res.code !== '200') return false
        if (res.list[0].merchantSource === 8 || res.list[0].merchantSource === 9) {
            router.replace({
                path: '/boot-upgrade',
                query: {
                    merchantSource: res.list[0].merchantSource,
                    rName: route.name
                }
            })
        }
    }
}

// 点击 补货/盘货/改价/卡片 进行校验&分发处理
const distributeJump = async (device, type) => {
    jumpFn(device, type)
}

const showTipPop = (index) => {
    // dataList.value.forEach((item) => {
    //     item.showTipPop = false
    // })
    dataList.value[index].showTipPop = !dataList.value[index].showTipPop
}

const jumpFn = async (device, type) => {
    await tracker({ module: 'device', subModule: 'devicePage', event: 'deviceList_click', params: { click_time: new Date().valueOf(), functionName: '设备商品', deviceId: device.deviceCode, deviceName: device.deviceName } })
    console.log('device.deviceType===', device.deviceType === 20)

    if (device.deviceType === 20 && (type === 1 || type === 2 || type === 3)) {
        newPage(`/multi-type-device/select-device-door?showNavbar=0&isNeedOpen=0&pageType=${type}&deviceType=${device.deviceType}&deviceCode=${device.deviceCode}&deviceName=${device.deviceName}`, {
            deviceType: device.deviceType,
            deviceCode: device.deviceCode,
            deviceName: device.deviceName,
            pageType: type,
            isNeedOpen: 0
            // secondCabinetTypeName: device.secondCabinetTypeName, // 区分柜子是否为冷冻柜
            // secondCabinetTypeCode: device.secondCabinetTypeCode // 区分柜子是否为冷冻柜
        })
        return
    }

    if (type === 1) {
        newPage(`/replenishmentList?showNavbar=0&pageType=1&deviceCode=${device.deviceCode}&deviceName=${device.deviceName}`, {
            showNavbar: 0,
            pageType: 1,
            deviceCode: device.deviceCode,
            deviceName: device.deviceName
            // secondCabinetTypeName: device.secondCabinetTypeName, // 区分柜子是否为冷冻柜
            // secondCabinetTypeCode: device.secondCabinetTypeCode // 区分柜子是否为冷冻柜
        })
    } else if (type === 2) {
        newPage(`/inventoryList?showNavbar=0&pageType=2&deviceCode=${device.deviceCode}&deviceName=${device.deviceName}`, {
            showNavbar: 0,
            pageType: 2,
            deviceCode: device.deviceCode,
            deviceName: device.deviceName
            // secondCabinetTypeName: device.secondCabinetTypeName, // 区分柜子是否为冷冻柜
            // secondCabinetTypeCode: device.secondCabinetTypeCode // 区分柜子是否为冷冻柜
        })
    } else if (type === 3) {
        newPage(`/price-change?showNavbar=0&deviceCode=${device.deviceCode}&deviceName=${device.deviceName}`, {
            showNavbar: 0,
            deviceCode: device.deviceCode,
            deviceName: device.deviceName
        })
    } else if (type === 4) {
        newPage(`/operation-log/${device.deviceCode}?showNavbar=1`)
    } else {
        newPage(`/deviceDetails?deviceCode=${device.deviceCode}&deviceName=${device.deviceName}&deviceType=${device.deviceType}&showNavbar=0`, {
            deviceCode: device.deviceCode,
            deviceType: device.deviceType,
            deviceName: device.deviceName
        })
    }
}
</script>
<style lang="scss" scoped>
.equipment-page {
    min-height: 100vh;
    .van-tabs-heigh {
        width: 100%;
        height: 192px;
    }
    .van-tabs {
        font-size: 28px;
        font-weight: 400;
        color: #191919;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
        .van-search {
            padding: 20px 30px;
            :deep(.van-search__field) {
                height: 62px;
                padding-right: 30px;
                .van-field__left-icon {
                    width: 26px;
                    height: 24px;
                }
                .van-field__right-icon {
                    width: 32px;
                    height: 32px;
                    padding-left: 18px;
                    border-left: 2px solid #dddddd;
                }
                .van-image {
                    width: 100%;
                    height: 100%;
                    display: block;
                }
            }
        }
    }
    .van-pull-refresh {
        min-height: calc(100vh - 192px);
        .van-list {
            .card-item {
                margin: 20px 30px 0;
                background: #ffffff;
                border-radius: 16px;
                .item-title {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 22px 30px;
                    font-size: 26px;
                    font-weight: 500;
                    .label {
                        font-weight: 400;
                        color: #191919;
                    }
                    .color--FF1E19 {
                        color: #ff1e19;
                    }
                    .color--FE7E41 {
                        color: #fe7e41;
                    }
                    .color--68BD49 {
                        color: #68bd49;
                    }
                }
                .item-content {
                    padding: 28px 0px 28px 30px;
                    display: flex;
                    align-items: flex-start;
                    .van-image {
                        width: 148px;
                        height: 148px;
                        border-radius: 8px;
                        overflow: hidden;
                    }
                    .info {
                        width: 0;
                        flex: 1;
                        margin-left: 26px;
                        .device-name {
                            width: 420px;
                            font-size: 28px;
                            font-weight: 500;
                            color: #191919;
                        }
                        .device-num {
                            display: flex;
                            font-size: 24px;
                            font-weight: 400;
                            color: #999999;
                            margin-top: 12px;
                            position: relative;
                            .tip-img {
                                position: relative;
                                top: 4px;
                                width: 24px;
                                height: 26px;
                            }
                            .goods-last-list {
                                position: absolute;
                                top: 30px;
                                left: 70px;
                                // background: url('../../assets/multi-type-device/tooltip.png') center no-repeat;
                                z-index: 10;
                                .tooltip-img {
                                    position: relative;
                                    width: 412px;
                                    height: 154px;
                                }
                                .tooltip-text {
                                    position: absolute;
                                    top: 40px;
                                    width: calc(100% - 22px);
                                    text-align: left;
                                    font-size: 22px;
                                    padding-left: 8px;
                                }
                                .text {
                                    margin-top: 10px;
                                    margin-left: 18px;
                                }
                            }
                        }
                        .device-time {
                            font-size: 24px;
                            font-weight: 400;
                            color: #999999;
                            line-height: 34px;
                            margin-top: 10px;
                        }
                        .button-box {
                            margin-top: 36px;
                            .van-button {
                                height: 48px;
                                font-size: 24px;
                                font-weight: 400;
                                color: #fe7e41;
                                padding: 0 22px;
                                margin-right: 16px;
                                border-radius: 8px;
                                border-color: #fe7e41;
                            }
                            .last-button {
                                margin-right: 0;
                                padding: 0 12px;
                            }
                        }
                    }
                }
            }
        }
    }
    .empty-tip {
        background: #fff;
        height: calc(100vh - 122px - 88px);
        margin-top: 20px;
        img {
            width: 481px;
            height: 319px;
            margin-top: 200px;
            margin-left: 145px;
        }
        p {
            font-size: 30px;
            font-weight: 400;
            color: #888888;
            width: 100%;
            text-align: center;
        }
    }
}
</style>
