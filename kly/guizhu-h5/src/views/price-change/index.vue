<template>
    <div class="pirce-change">
        <van-nav-bar title="改价" fixed placeholder>
            <template #left>
                <van-image @click="closePageFn" :src="require('@/assets/back-icon.png')" />
            </template>
        </van-nav-bar>
        <van-search v-model="searchValue" shape="round" placeholder="请输入商品名称或条形码搜索">
            <template #left-icon>
                <van-image :src="require('@/assets/replenishmentImg/search-left-icon.png')" />
            </template>
            <template #right-icon>
                <van-image @click="scanForSearch" :src="require('@/assets/replenishmentImg/scan-icon.png')" />
            </template>
        </van-search>
        <div class="action-bar">
            <div class="action-bar--left">
                <van-image :src="require('@/assets/replenishmentImg/grouping2x.png')" />
                <div class="text van-ellipsis">{{ deviceName }}</div>
            </div>
        </div>
        <div class="list-box">
            <div class="list-title">
                <div class="seize-a-seat"></div>
                <div class="label label-1">
                    <div class="label-text">商品信息</div>
                </div>
                <div class="label label-2">
                    <div class="label-text">修改价格</div>
                </div>
            </div>
            <template v-if="commodityListforPage.length">
                <div class="cell-item" v-for="(item, index) in commodityListforPage" :key="item.barcode">
                    <div class="number-box">{{ (index > 8 ? '' : '0') + (index + 1) }}</div>
                    <van-image :src="item.pictureUrl || ''" />
                    <div class="goods-info van-hairline--bottom">
                        <div class="flex-left">
                            <div class="sku-name">{{ item.skuName }}</div>
                            <div class="frozen-icon" v-if="item.storageStyle === '冷冻品'"><img src="../../assets/frozen_icon.png" /></div>
                            <div class="barcode">{{ item.barcode }}</div>
                            <div class="price-box">
                                <span class="unit">¥</span>
                                <span class="sale-price">{{ item.oldPrice }}</span>
                            </div>
                        </div>
                        <div class="flex-right">
                            <van-field v-model="item.price" type="number" :formatter="formatter" format-trigger="onChange">
                                <template #extra>元</template>
                            </van-field>
                        </div>
                    </div>
                </div>
            </template>
            <div v-else class="empty-box">
                <img :src="require('@/assets/replenishmentImg/noneDate@2x.png')" />
                <p class="emptyTitle">暂无数据</p>
            </div>
        </div>
        <!-- 扫码补货 -->
        <div class="scanBoxHeight"></div>
        <div class="scanBox">
            <van-button class="scan-button" @click.prevent="codeScan()" :icon="require('@/assets/replenishmentImg/scan@2x.png')">扫条形码改价</van-button>
            <van-button @click="reconfirm()" loading-type="spinner" :loading="isLock" :disabled="isLock">改价完成</van-button>
        </div>
        <van-popup v-model:show="popupShow" round position="bottom" closeable :close-icon="require('@/assets/close.png')">
            <template v-if="scanObj && popupShow">
                <div class="goods-info">
                    <van-image :src="scanObj.pictureUrl" />
                    <div class="content">
                        <div class="sku-name">{{ scanObj.skuName }}</div>
                        <div class="frozen-icon" v-if="scanObj.storageStyle === '冷冻品'"><img src="../../assets/frozen_icon.png" /></div>
                        <div class="barcode">{{ scanObj.barcode }}</div>
                        <div class="price-box">
                            <span class="unit">¥</span>
                            <span class="sale-price">{{ scanObj.oldPrice }}</span>
                        </div>
                        <div class="enter-quantity">
                            <div class="label">修改价格</div>
                            <div class="input-box">
                                <div class="flex-box colour--gray" v-if="!scanObj.price">
                                    <div class="cursor-blink"></div>
                                    <div>{{ scanObj.oldPrice }}</div>
                                </div>
                                <div class="flex-box" v-else>
                                    <div>{{ scanObj.price }}</div>
                                    <div class="cursor-blink"></div>
                                </div>
                                <span>元</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="scan-box">
                    <van-button class="scan-button" @click="saveScanObj(true)" :icon="require('@/assets/replenishmentImg/scan@2x.png')">保存并继续扫码</van-button>
                    <van-button @click="saveScanObj(false)">保存</van-button>
                </div>
                <van-number-keyboard v-model="scanObj.price" :show="true" extra-key="." />
            </template>
        </van-popup>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Toast, Dialog } from 'vant'
import { useRoute } from 'vue-router'
import { equipmentGoodsList, changePrice } from '@/api/scan/scan.js'
import { appBridge, registerhandler } from '@/utils/bridge.js'
import { isApp, getPicByMediaType, getTime } from '@/utils'
import { newPage, closePage } from '@/utils/composables'

const route = useRoute()
const deviceName = route.query.deviceName // 货柜名称
const deviceCode = route.query.deviceCode // 货柜编码
const doorType = route.query.doorType
const popupShow = ref(false)
const startTime = getTime()

onMounted(() => {
    getList()
})

const formatter = (value) => {
    if (value.indexOf('.') === 0) {
        value = '0' + value
    }
    value = value.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
    value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
    if (value.indexOf('.') < 0 && value !== '') {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        value = parseFloat(value)
    }
    return value + ''
}

// 搜索部分
const searchValue = ref('')
const commodityListforPage = computed(() => {
    if (searchValue.value) {
        return commodityList.value.filter((item) => item.skuName.search(searchValue.value) !== -1 || item.barcode?.search(searchValue.value) !== -1)
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

// 拉取的商品列表
const commodityList = ref([])
const getList = async () => {
    const { code, list } = await equipmentGoodsList({
        containerCode: deviceCode,
        operateType: '1',
        pageNo: 1,
        pageSize: 100,
        doorType
    })
    if (code !== '200') return false
    const dataList = list.map((item) => {
        item.oldPrice = item.salePrice
        item.price = ''
        item.pictureUrl = getPicByMediaType(item.goodsMediaList, 6)
        return item
    })
    commodityList.value = dataList
}

// 提交前二次确认
const reconfirm = () => {
    Dialog.confirm({
        title: '提示',
        message: '确认提交？',
        confirmButtonColor: '#FE7E41',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        getContaniner: '.pirce-change'
    }).then(() => {
        complete()
    })
}

// 补货完成跳转页面
const isLock = ref(false)
const complete = async () => {
    isLock.value = true
    const goodsList = []
    commodityList.value.forEach((item) => {
        if ((!Number(item.oldPrice) && !Number(item.price)) || item.price === '0' || item.price === '0.0' || item.price === '0.00') {
            isLock.value = false
            Dialog.alert({
                message: `商品${item.skuName}未设置价格，请设置价格后提交`,
                confirmButtonColor: '#FE7E41',
                confirmButtonText: '知道了',
                getContaniner: '.pirce-change'
            })
            throw new Error(`商品${item.skuName}未设置价格，请设置价格后提交`)
        }
        if (item.price) {
            const items = {
                barcodes: item.barcode,
                earlyPrice: item.oldPrice,
                price: item.price,
                skuCode: item.skuId,
                skuName: item.skuName
            }
            goodsList.push(items)
        }
    })
    if (!goodsList.length) return Toast('没有可提交的内容')
    changePriceFn({
        deviceNo: deviceCode,
        priceChangeList: goodsList,
        startTime,
        endTime: getTime(),
        doorType
    })
}
const changePriceFn = async (params) => {
    const res = await changePrice(params)
    isLock.value = false
    if (res.code === '200') {
        newPage(`/price-change-result?showNavbar=0&id=${res.data.orderNo}&changeNum=${res.data.changeNum}`)
    }
}

// 保存 / 保存继续扫码
const saveScanObj = async (type) => {
    const index = commodityList.value.findIndex((item) => item.barcode === scanObj.value.barcode)
    await toFirst(index)
    scanObj.value = null
    popupShow.value = false
    if (type) {
        setTimeout(() => {
            codeScan()
        }, 300)
    }
}
// 数组置顶移动
const toFirst = (index) => {
    return new Promise((resolve, reject) => {
        if (index < 0) {
            scanObj.value.total = scanObj.value.quantity
            commodityList.value.unshift(scanObj.value)
            resolve(true)
        } else {
            const obj = commodityList.value.splice(index, 1)[0]
            obj.total = obj.quantity
            commodityList.value.unshift(obj)
            resolve(true)
        }
    })
}
// 扫码对象
const scanObj = ref(null)
// 扫码改价
const codeScan = async () => {
    if (!isApp) return Toast('请在App中使用')
    searchValue.value = ''
    registerhandler('setScanResult', async (barcode) => {
        scanObj.value = commodityList.value.find((item) => item.barcode === barcode)
        if (scanObj.value) {
            popupShow.value = true
        } else {
            Dialog.alert({
                message: '对不起，此商品未添加到货柜，需添加到货柜后再操作改价',
                confirmButtonText: '知道了'
            })
        }
    })
    appBridge('openScan', 1)
}

// 返回弹窗
const closePageFn = () => {
    Dialog.confirm({
        message: '退出后录入的内容将会清空，确定退出？'
    }).then(() => closePage())
}
</script>
<style lang="scss" scoped>
.pirce-change {
    min-height: 100vh;
    background: #fff;
    .van-nav-bar__placeholder {
        height: calc(92px + var(--van-status-bar-height)) !important;
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
        }
    }
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
    }
    .list-box {
        .list-title {
            padding: 20px 30px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #f4f5f5;
            color: #696969;
            .seize-a-seat {
                width: 170px;
            }
            .label {
                display: flex;
                align-items: center;
                .label-text {
                    color: #696969;
                    font-size: 26px;
                }
            }
            .label-1 {
                flex: 1;
            }
            .label-2 {
                width: 128px;
                justify-content: center;
            }
        }
    }
    .cell-item {
        box-sizing: border-box;
        display: flex;
        align-items: flex-start;
        padding: 30px 30px 0 30px;
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
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 30px;
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
                    font-size: 22px;
                    font-weight: 400;
                    color: #999999;
                    line-height: 30px;
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
                .van-field {
                    padding: 0 16px 0 16px;
                    width: 128px;
                    height: 56px;
                    border-radius: 8px;
                    border: 2px solid #ededed;
                    font-size: 24px;
                    font-weight: 400;
                    color: #222222;
                    line-height: initial;
                    align-items: center;
                }
            }
        }
    }
    .scanBoxHeight {
        width: 100%;
        height: 132px;
        padding-bottom: constant(safe-area-inset-bottom) !important;
        padding-bottom: env(safe-area-inset-bottom) !important;
    }
    .scanBox {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        background: rgba($color: #ffffff, $alpha: 0.9);
        padding-left: 40px;
        padding-right: 40px;
        padding-top: 20px;
        padding: 20px;
        padding-bottom: calc(20px + constant(safe-area-inset-bottom)) !important;
        padding-bottom: calc(20px + env(safe-area-inset-bottom)) !important;
        .scan-button.van-button {
            width: 376px;
            height: 92px;
            background: #ffffff;
            border-radius: 46px;
            border: 2px solid #fe7e41;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            font-weight: 500;
            color: #fe7e41;
            :deep(.van-icon__image) {
                width: 28px;
                height: 28px;
            }
            :deep(.van-button__text) {
                margin-left: 16px;
            }
        }
        .van-button {
            width: 256px;
            height: 92px;
            background: linear-gradient(90deg, #fe7e41 0%, #ff5d0f 100%, #ff5c0e 100%);
            border-radius: 46px;
            font-size: 30px;
            font-weight: 500;
            color: #ffffff;
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
    :deep(.van-popup) {
        .van-popup__close-icon {
            font-size: 46px;
        }
        .goods-info {
            display: flex;
            align-items: flex-start;
            padding: 60px 100px 0 50px;
            height: max-content;
            .van-image {
                width: 144px;
                height: 144px;
                border-radius: 16px;
                overflow: hidden;
            }
            .content {
                width: 0;
                flex: 1;
                margin-left: 24px;
                .sku-name {
                    word-break: break-all;
                    word-wrap: break-word;
                    font-size: 30px;
                    font-weight: 500;
                    color: #191919;
                    line-height: 36px;
                    margin-bottom: 8px;
                }
                .frozen-icon img {
                    width: 116px;
                }
                .barcode {
                    // margin-top: 10px;
                    font-size: 24px;
                    font-weight: 400;
                    color: #999999;
                    line-height: 30px;
                }
                .stock {
                    font-size: 22px;
                    font-weight: 400;
                    color: #999999;
                    line-height: 30px;
                    margin-top: 10px;
                    span {
                        margin-right: 26px;
                    }
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
                .enter-quantity {
                    margin-top: 64px;
                    display: flex;
                    align-items: center;
                    .label {
                        font-size: 24px;
                        font-weight: 400;
                        color: #191919;
                        line-height: 30px;
                    }
                    .input-box {
                        display: flex;
                        justify-content: space-between;
                        margin-left: 20px;
                        padding: 22px 16px 22px 20px;
                        width: 244px;
                        background: #f4f5f5;
                        border-radius: 12px;
                        line-height: 36px;
                        font-size: 26px;
                        font-weight: 400;
                        color: #999999;
                        .flex-box {
                            display: flex;
                            font-size: 26px;
                            font-weight: 400;
                            color: #191919;
                        }
                        .colour--gray {
                            color: #999999;
                        }
                        .cursor-blink {
                            display: inline-block;
                            width: 1px;
                            animation: blink 1s infinite steps(1, start);
                        }
                        /*这里设置动画blink*/
                        @keyframes blink {
                            0%,
                            100% {
                                background-color: #fe7e41;
                            }
                            50% {
                                background-color: transparent; /* not #aaa because it's seem there is Google Chrome bug */
                            }
                        }
                        span {
                            color: #191919;
                        }
                    }
                }
            }
        }
        .scan-box {
            display: flex;
            justify-content: space-between;
            background: rgba($color: #ffffff, $alpha: 0.9);
            padding: 94px 40px 20px 40px;
            .scan-button.van-button {
                width: 376px;
                height: 92px;
                background: #ffffff;
                border-radius: 46px;
                border: 2px solid #fe7e41;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 30px;
                font-weight: 500;
                color: #fe7e41;
                .van-icon__image {
                    width: 28px;
                    height: 28px;
                }
                .van-button__text {
                    margin-left: 16px;
                }
            }
            .van-button {
                width: 256px;
                height: 92px;
                background: linear-gradient(90deg, #fe7e41 0%, #ff5d0f 100%, #ff5c0e 100%);
                border-radius: 46px;
                font-size: 30px;
                font-weight: 500;
                color: #ffffff;
            }
        }
        .van-number-keyboard {
            position: initial;
        }
    }
}
</style>
