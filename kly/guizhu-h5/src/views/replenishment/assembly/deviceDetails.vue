<template>
    <div class="device-goods-page">
        <van-nav-bar title="设备商品清单" fixed placeholder>
            <template #left>
                <van-image @click="closePage" :src="require('@/assets/back-icon.png')" />
            </template>
            <template #right><span @click="newPage(`/resembleGoods/${deviceCode}/${deviceType}`)">相似商品</span></template>
        </van-nav-bar>
        <div class="action-bar">
            <div class="action-bar--left">
                <van-image :src="require('@/assets/replenishmentImg/grouping2x.png')" />
                <div class="text van-ellipsis">{{ deviceName }}</div>
            </div>
            <div class="action-bar--right">
                <van-button class="invalid-button" v-if="invalidGoodsList.length" @click="newPage(`/invalid-goods/${deviceCode}`)">失效商品</van-button>
            </div>
        </div>
        <van-sticky :offset-top="30">
            <van-tabs v-model:active="pageTab" @change="changeTab" color="#FE7E41" title-active-color="#FE7E41" v-if="deviceType === '20'">
                <van-tab title="左门" />
                <van-tab title="右门" />
            </van-tabs>
        </van-sticky>
        <van-search v-model="searchValue" shape="round" placeholder="请输入商品名称或条形码搜索">
            <template #left-icon>
                <van-image :src="require('@/assets/replenishmentImg/search-left-icon.png')" />
            </template>
            <template #right-icon>
                <van-image @click="scanForSearch" :src="require('@/assets/replenishmentImg/scan-icon.png')" />
            </template>
        </van-search>
        <div class="list-box">
            <!-- 盘货 -->
            <div class="list-title">
                <div class="seize-a-seat"></div>
                <div class="label label-1">商品信息</div>
                <div class="label label-2">库存</div>
            </div>
            <template v-if="commodityListforPage.length">
                <div class="cell-item" v-for="(item, index) in commodityListforPage" :key="index">
                    <div class="number-box">{{ (index > 8 ? '' : '0') + (index + 1) }}</div>
                    <van-image :src="item.pictureUrl" />
                    <div class="goods-info van-hairline--bottom">
                        <div class="flex-left">
                            <div class="sku-name">{{ item.skuName }}</div>
                            <div class="frozen-icon" v-if="item.storageStyle === '冷冻品'"><img src="../../../assets/frozen_icon.png" /></div>
                            <div class="barcode">{{ item.barcode }}</div>
                            <div class="time">首次上架时间: {{ item.gmtCreate ? item.gmtCreate.replace('T', ' ') || '--' : '--' }}</div>
                            <div class="time">上次补货时间: {{ item.replenishmentTime ? item.replenishmentTime.replace('T', ' ') || '--' : '--' }}</div>
                            <div class="price-box">
                                <span class="unit">¥</span>
                                <span class="sale-price">{{ item.salePrice }}</span>
                            </div>
                        </div>
                        <div class="flex-right">
                            <span>{{ item.stock || 0 }}</span
                            >/{{ item.stockSnapshot || 0 }}
                        </div>
                    </div>
                </div>
            </template>
            <div v-else class="empty-box">
                <img :src="require('@/assets/replenishmentImg/noneDate@2x.png')" />
                <p v-if="pageLoadFlag" class="emptyTitle">暂无数据</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { useRoute } from 'vue-router'
import { equipmentGoodsList } from '@/api/scan/scan.js'
import { outskuInvalidList } from '@/api/goods-transfer'
import { useStore } from 'vuex'
import { getPicByMediaType } from '@/utils'
import { appBridge, registerhandler } from '@/utils/bridge.js'
import { newPage, closePage } from '@/utils/composables'
const pageTab = ref('')
const route = useRoute()
const deviceName = route.query.deviceName
const deviceCode = route.query.deviceCode
const deviceType = route.query?.deviceType
if (deviceType === '20') {
    pageTab.value = 0
}
const store = useStore()
const merchantId = computed(() => store.state.userInfo.merchantId)

// 搜索部分
const searchValue = ref('')
const commodityListforPage = computed(() => {
    if (searchValue.value) {
        return commodityList.value.filter((item) => item.skuName.search(searchValue.value) !== -1 || item.barcode.search(searchValue.value) !== -1)
    } else {
        return commodityList.value
    }
})
const scanForSearch = () => {
    registerhandler('setScanResult', async (barcode) => {
        searchValue.value = barcode
    })
    appBridge('openScan', 1)
}

const pageLoadFlag = ref(false)
onBeforeMount(async () => {
    await getList()
    pageLoadFlag.value = true
    outskuInvalidListFn()
})

// 刷新接口
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        getList()
        document.documentElement.scrollTo(0, 0)
    }
})

const changeTab = () => {
    // pointInfo.value.list = []
    getList()
    // checked.value = ''
}

const commodityList = ref([])
const getList = async () => {
    const { code, list } = await equipmentGoodsList({
        containerCode: deviceCode,
        doorType: pageTab.value === 0 ? 1 : pageTab.value === 1 ? 2 : '',
        pageNo: 1,
        pageSize: 100
    })
    if (code !== '200') return false
    commodityList.value = list.map((item) => {
        item.pictureUrl = getPicByMediaType(item.goodsMediaList, 6)
        return item
    })
}

// 检测是否有失效商品列表 展示失效商品按钮使用
const invalidGoodsList = ref([])
const outskuInvalidListFn = async () => {
    // 兼容低版本
    if (!merchantId.value) return false
    const res = await outskuInvalidList({
        merchantId: merchantId.value,
        secondChannelId: deviceCode
    })
    if (res.code !== '200') return false
    invalidGoodsList.value = res.list || []
}
</script>
<style lang="scss" scoped>
.device-goods-page {
    min-height: 100vh;
    background: #fff;
    .van-nav-bar__placeholder {
        // height: calc(92px + var(--van-status-bar-height)) !important;
        :deep(.van-nav-bar) {
            padding-top: var(--van-status-bar-height);
            .van-image {
                width: 44px;
                height: 44px;
            }
            .van-nav-bar__title {
                font-size: 36px;
                font-weight: 500;
                color: #191919;
            }
            .van-nav-bar__right {
                font-size: 30px;
                font-weight: 400;
                color: #fe7e41;
            }
        }
    }
    .van-search {
        padding: 20px 30px;
        border-top: 1px solid #f4f5f5;
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
    .action-bar {
        font-size: 28px;
        font-weight: 500;
        color: #696969;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 30px;
        background: #f4f5f5;
        .action-bar--left {
            display: flex;
            align-items: center;
            .van-image {
                width: 30px;
                height: 30px;
            }
            .text {
                width: 200px;
                margin-left: 10px;
                color: #696969;
            }
        }
        .action-bar--right {
            width: max-content;
            .van-button {
                width: 152px;
                height: 62px;
                border-radius: 31px;
                border: 1px solid #fe7e41;
                font-size: 24px;
                font-weight: 400;
                color: #fe7e41;
                background-color: #fff;
                word-break: keep-all;
                line-height: 62px;
            }
        }
    }
    .list-box {
        .list-title {
            padding: 20px 30px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #f4f5f5;
            color: #696969;
            .seize-a-seat {
                width: 204px;
            }
            .label {
                display: flex;
                align-items: center;
                color: #696969;
                font-size: 26px;
            }
            .label-1 {
                flex: 1;
            }
            .label-2 {
                width: 100px;
                justify-content: center;
            }
        }
        .cell-item {
            box-sizing: border-box;
            display: flex;
            align-items: flex-start;
            padding: 30px 30px 0;
            .number-box {
                width: 36px;
                text-align: center;
                line-height: 100px;
                color: #999999;
                font-size: 26px;
                font-weight: 400;
            }
            & > .van-image {
                width: 100px;
                height: 100px;
                margin-left: 16px;
                border-radius: 8px;
                overflow: hidden;
            }
            .goods-info {
                width: 0;
                flex: 1;
                margin-left: 16px;
                padding-bottom: 30px;
                display: flex;
                .flex-left {
                    width: 0;
                    flex: 1;
                    .sku-name {
                        word-break: break-all;
                        word-wrap: break-word;
                        font-size: 28px;
                        font-weight: 500;
                        color: #191919;
                        line-height: 36px;
                        margin-bottom: 8px;
                    }
                    .frozen-icon img {
                        width: 116px;
                    }
                    .barcode {
                        margin-top: 8px;
                        font-size: 22px;
                        font-weight: 400;
                        color: #999999;
                        line-height: 30px;
                    }
                    .time {
                        font-size: 22px;
                        font-weight: 400;
                        color: #999999;
                        line-height: 30px;
                        margin-top: 6px;
                    }
                    .price-box {
                        display: flex;
                        align-items: baseline;
                        margin-top: 16px;
                        .unit {
                            font-size: 22px;
                            font-weight: 500;
                            color: #ff1e19;
                        }
                        .sale-price {
                            font-size: 32px;
                            font-weight: 500;
                            color: #ff1e19;
                            margin-left: 4px;
                        }
                    }
                }
                .flex-right {
                    width: 100px;
                    text-align: center;
                    line-height: 100px;
                    font-size: 28px;
                    span {
                        color: #fe7e41;
                        font-size: 30px;
                    }
                }
            }
        }
    }
    .empty-box {
        img {
            width: 481px;
            height: 319px;
            margin-top: 200px;
            margin-left: 145px;
        }
        p {
            width: 100%;
            font-size: 30px;
            font-weight: 400;
            color: #888888;
            text-align: center;
        }
    }
}
</style>
