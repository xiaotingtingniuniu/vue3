<template>
    <div class="orderDetailsBox">
        <div class="chartBox">
            <van-nav-bar fixed placeholder :border="false" :class="opacity ? 'colour' : ''" @click-left="closePage">
                <template #left>
                    <van-image :src="require('@/assets/replenishmentlmOrder/icon-back.png')" />
                </template>
                <template #title>
                    <div class="nav-title" v-if="detailInfo.billStatus">
                        <van-image :src="require(`@/assets/replenishmentlmOrder/title-icon${detailInfo.billStatus === '4' ? '5' : detailInfo.billStatus}.png`)" />
                        <div>{{ pageState[detailInfo.billStatus] }}</div>
                    </div>
                </template>
            </van-nav-bar>
            <div class="contentBox">
                <div class="numberBox">补货单编号：{{ detailInfo.billNo }}</div>
                <div class="generation">补货单生成时间：{{ detailInfo.createTime }}</div>
                <div class="generation" v-if="detailInfo.billStatus === '3'">补货单完成时间：{{ detailInfo.replenishmentTime }}</div>
                <div class="generation" v-if="detailInfo.billStatus === '5' || detailInfo.billStatus === '4'">补货单取消时间：{{ detailInfo.updateTime }}</div>
            </div>
            <div class="information">
                <div class="title van-hairline--bottom">设备信息</div>
                <div class="cell">
                    <div class="label">设备名称</div>
                    <div class="content">{{ detailInfo.equipmentName }}</div>
                </div>
                <div class="cell">
                    <div class="label">设备编号</div>
                    <div class="content">{{ detailInfo.equipmentCode }}</div>
                </div>
                <div class="cell" v-if="detailInfo.doorType === 1 || detailInfo.doorType === 2">
                    <div class="label">门名称</div>
                    <div class="content">{{ detailInfo.doorType === 1 ? '左门' : detailInfo.doorType === 2 ? '右门' : '' }}</div>
                </div>
                <div class="cell">
                    <div class="label">设备地址</div>
                    <div class="content">{{ detailInfo.equipmentAddress }}</div>
                </div>
            </div>
            <div class="listBox">
                <div class="listHead van-hairline--bottom">
                    <div class="product">商品信息</div>
                    <div class="substantial">应补数量</div>
                    <div class="substantial" v-if="detailInfo.billStatus === '3'">实补数量</div>
                </div>
                <div v-for="(item, index) in commodityList" :key="index">
                    <div class="listContent">
                        <div class="numberBox">{{ (index > 8 ? '' : '0') + (index + 1) }}</div>
                        <van-image :src="item.thumbnail" class="chartUrl" />
                        <!-- van-hairline--bottom -->
                        <div class="left-content van-hairline--bottom">
                            <div class="content">
                                <div :class="detailInfo.billStatus === '3' ? 'titleBox van-ellipsis' : 'titleList'">{{ item.skuName }}</div>
                                <div class="frozen-icon" v-if="item.storageStyle === '冷冻品'"><img src="../../assets/frozen_icon.png" /></div>
                                <div class="barCode">{{ item.barcode }}</div>
                            </div>
                            <div class="num">{{ item.quantity }}</div>
                            <div class="num numColour" v-if="detailInfo.billStatus === '3'">{{ item.actualQuantity }}</div>
                        </div>
                    </div>
                    <div class="lineBox"></div>
                </div>
            </div>
        </div>
        <div class="scanBox-height"></div>
        <div class="scanBox" v-if="detailInfo.billStatus === '1'">
            <van-button block @click="complete" color="#FE7E41" loading-type="spinner">扫码开门</van-button>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { closePage, newPage } from '@/utils/composables'
import { replenishmentDetail } from '@/api/scan/order.js'
import { msgIdGetDetailId } from '@/api/order.js'
import { useRoute } from 'vue-router'
import { tracker } from '@/utils/tracker'
import { getAppStorageFn } from '@/utils/storage'

const route = useRoute()
const pageState = ref({
    0: '待补货',
    1: '待补货',
    3: '已完成',
    4: '已取消',
    5: '已取消'
})

const opacity = ref(0)
window.addEventListener('scroll', function (e) {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    if (scrollTop < 0.1) return (opacity.value = 0)
    opacity.value = 1
})

// 消息id / 详情id
const msgId = route.query.msgId
const billNo = ref(route.query.billNo)
const billId = ref(null)
const equipmentCode = ref(null)
const orderId = ref(null)
const equipmentName = ref(null)

// 页面数据 & 商品数据
const detailInfo = ref({})
const commodityList = ref([])

// 有消息id 和 无消息id
onBeforeMount(() => {
    if (route.query.msgId) return getDetailId()
    queryDetail()
})

// 通过消息id获取详情id
const getDetailId = async () => {
    const res = await msgIdGetDetailId({
        msgId: msgId,
        busiCode: 'A1001002'
    })
    if (res.code !== '200' || !res.data.extField) return false
    const temp = JSON.parse(res.data.extField)
    billNo.value = temp.orderID
    queryDetail()
}

// 获取详情信息
const queryDetail = async () => {
    const { code, data } = await replenishmentDetail({
        billNo: billNo.value
    })
    if (code !== '200') return false
    detailInfo.value = data
    equipmentCode.value = data.equipmentCode
    orderId.value = data.id
    equipmentName.value = data.equipmentName
    billId.value = data.billNo
    commodityList.value = data.detailList
}

// 扫码补货
const complete = () => {
    getAppStorageFn('trackerAct', async (val) => {
        if (!val) return false
        await tracker({
            module: 'restore',
            subModule: 'pendingRestorePage',
            event: 'scanOpenDoor_click',
            params: {
                act: val,
                orderId: orderId.value,
                click_time: new Date().valueOf(),
                functionName: '设备商品',
                deviceId: equipmentCode.value,
                deviceName: equipmentName.value,
                skuList: commodityList.value,
                doorType: detailInfo.value.doorType || 0
            }
        })
    })
    newPage(`/open-door?showNavbar=1&id=${orderId.value}&doorType=${detailInfo.value.doorType || 0}&equipmentCode=${equipmentCode.value}&equipmentName=${equipmentName.value}&billNo=${billId.value}`, {
        id: orderId.value,
        equipmentCode: equipmentCode.value,
        equipmentName: equipmentName.value,
        billNo: billId.value,
        doorType: detailInfo.value.doorType || 0
    })
}
</script>
<style lang="scss" scoped>
.orderDetailsBox {
    min-height: 100vh;
    .chartBox {
        width: 100%;
        background: url('../../assets/replenishmentlmOrder/detail-bg.png') no-repeat;
        background-size: 100% auto;
        .van-nav-bar__placeholder.colour {
            :deep(.van-nav-bar) {
                background-color: #ff5d0f !important;
            }
        }
        .van-nav-bar__placeholder {
            :deep(.van-nav-bar) {
                background-color: transparent;
                padding-top: var(--van-status-bar-height);
                .van-nav-bar__left {
                    .van-image {
                        width: 20px;
                        height: 34px;
                    }
                }
                .nav-title {
                    display: flex;
                    align-items: center;
                    .van-image {
                        width: 50px;
                        height: 50px;
                        margin-right: 16px;
                    }
                    div {
                        font-size: 36px;
                        font-weight: 500;
                        color: #ffffff;
                    }
                }
            }
        }
        .contentBox {
            background: #ffffff;
            border-radius: 8px;
            margin: 20px 30px 0;
            padding: 30px;
            .numberBox {
                font-size: 30px;
                font-weight: 600;
                color: #191919;
            }
            .generation {
                font-size: 26px;
                font-weight: 400;
                color: #999999;
                margin-top: 10px;
            }
        }
        .information {
            background: #ffffff;
            border-radius: 8px;
            margin: 20px 30px 0;
            padding: 20px 30px 30px;
            .title {
                font-size: 30px;
                font-weight: 500;
                color: #191919;
                position: relative;
                padding-bottom: 22px;
            }
            .title::before {
                content: '';
                width: 10px;
                height: 28px;
                background: #fe7e41;
                position: absolute;
                left: -30px;
                top: 7px;
            }
            .cell {
                display: flex;
                justify-content: space-between;
                margin-top: 24px;
                .label {
                    font-size: 26px;
                    font-weight: 400;
                    color: #999999;
                }
                .content {
                    font-size: 26px;
                    font-weight: 400;
                    color: #191919;
                    max-width: 446px;
                }
            }
        }
    }
    .listBox {
        background: #fff;
        margin-top: 20px;
        .listHead {
            display: flex;
            align-items: center;
            padding: 20px 23px 20px 15px;
            .product {
                width: 0;
                flex: 1;
                font-size: 26px;
                font-weight: 500;
                color: #696969;
                margin-left: 230px;
            }
            .substantial {
                width: 118px;
                text-align: center;
                font-size: 26px;
                font-weight: 500;
                color: #696969;
            }
        }
    }
    .listContent {
        display: flex;
        align-items: flex-start;
        padding: 40px 23px 0px 30px;
        .numberBox {
            font-size: 26px;
            font-weight: 400;
            color: #191919;
            line-height: 100px;
        }
        .van-image {
            width: 100px;
            height: 100px;
            margin-left: 16px;
            border-radius: 8px;
            overflow: hidden;
        }
        .left-content {
            margin-left: 16px;
            width: 0;
            flex: 1;
            display: flex;
            align-items: center;
            padding-bottom: 40px;
            min-height: 80px;
            .content {
                width: 0;
                flex: 1;
                .titleBox {
                    width: 280px;
                    font-size: 26px;
                    font-weight: 500;
                    color: #191919;
                }
                .titleList {
                    width: 430px;
                    font-size: 26px;
                    font-weight: 500;
                    color: #191919;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    margin-bottom: 6px;
                }
                .frozen-icon img {
                    width: 116px;
                }
                .barCode {
                    font-size: 22px;
                    font-weight: 400;
                    color: #b0b0b0;
                    padding-bottom: 24px;
                }
            }
            .num {
                width: 118px;
                text-align: center;
                font-size: 26px;
                font-weight: 400;
                color: #191919;
            }
            .numColour {
                color: #fe7e41 !important;
            }
        }
    }
    .scanBox-height {
        width: 100%;
        height: 112px;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
    }
    .scanBox {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 0 60px 20px;
        padding-bottom: calc(20px + constant(safe-area-inset-bottom));
        padding-bottom: calc(20px + env(safe-area-inset-bottom));
        .van-button {
            height: 92px;
            background: #fe7e41;
            border-radius: 46px;
            font-size: 30px;
            font-weight: 600;
            color: #ffffff;
        }
    }
}
</style>
