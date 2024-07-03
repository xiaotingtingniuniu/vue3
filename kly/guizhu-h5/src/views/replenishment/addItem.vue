<template>
    <div class="addItemBox">
        <van-pull-refresh v-model="refreshLoading" @refresh="getList(true)">
            <div class="searchData">
                <form action="/" class="inputBox">
                    <van-search v-model="searchValue" placeholder="请输入商品名称" @search="getList(true)" />
                    <img src="../../assets/replenishmentImg/grey@2x.png" alt="" class="sweepImg" @click="sweepOne" />
                </form>
            </div>
            <div class="face"></div>
            <van-list class="addItemList" v-if="commodityList.length" @load="getList" :finished="finished" finished-text="没有更多了" v-model:loading="loading" :immediate-check="false">
                <div class="addItemData" v-for="(item, index) in commodityList" :key="index">
                    <div class="addItemNew">
                        <div class="numberBox">
                            {{ (index > 8 ? '' : '0') + (index + 1) }}
                        </div>
                        <van-image :src="item.pictureUrl" class="listUrl" />
                        <div class="listBox">
                            <div class="titleContent">{{ item.goodsName }}</div>
                            <div class="frozen-icon" v-if="item.storageStyle === '冷冻品'"><img src="../../assets/frozen_icon.png" /></div>
                            <div class="orderBox">{{ item.barcode }}</div>
                        </div>
                        <van-checkbox v-model="item.checked" class="checkedList" :name="item.barcode" checked-color="#FE7E41" @click="choose(item.barcode)"></van-checkbox>
                    </div>
                    <div :class="index === commodityList.length - 1 ? 'bottomNothing' : 'bottomHave'">
                        <div :class="item.goodsName.length < 18 ? 'bottomNew' : 'bottom'"></div>
                    </div>
                </div>
            </van-list>
            <div v-else-if="searchValue === ''">
                <img src="../../assets/replenishmentImg/noneDate@2x.png" class="emptyImg" />
                <p class="emptyTitle">暂无数据</p>
            </div>
            <van-empty v-else image="search" description="没有查询结果，请确保该商品已在“我的商品库”上架" class="nothingBox" />
        </van-pull-refresh>
        <div class="scanBox">
            <van-button color="#FE7E41" block @click="complete">确定添加</van-button>
        </div>
        <van-dialog v-model:show="freezTipsDialog" title="提示" show-cancel-button @cancel="frozenSubmit" @confirm="frozenCancel" confirm-button-text="取消" cancel-button-text="继续操作">
            <div style="margin-top: 10px; text-align: center">带有“冷冻”标签的商品需在冷冻条件下存放，当前货柜非冷冻柜，不建议上架。</div>
            <div style="margin-top: 10px">
                <van-checkbox style="margin-left: 27%" v-model="openfrezonTips">15天内不再提示</van-checkbox>
            </div>
        </van-dialog>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Toast } from 'vant'
import { appBridge, registerhandler } from '@/utils/bridge.js'
import { useRouter, useRoute } from 'vue-router'
import { myGoodsList, checkFreezTips, getFreezTips } from '@/api/scan/scan.js'
import { setAppStorageFn } from '@/utils/storage'
import { isApp, getPicByMediaType } from '@/utils'

const router = useRouter()
const route = useRoute()

// 货柜编码
const pageType = route.query.pageType
const deviceCode = route.query.deviceCode
const doorType = route.query.doorType
const modelCode = route.query.modelCode
const secondCabinetTypeName = route.query.secondCabinetTypeName

onMounted(() => {
    getList()
})

const loading = ref(false)
const refreshLoading = ref(false)
const finished = ref(false)
const pageNum = ref(1)
const pageSize = 10
const commodityList = ref([])

const getList = async (isRefresh = false) => {
    loading.value = true
    if (isRefresh) {
        pageNum.value = 1
        finished.value = false
        setTimeout(() => {
            document.documentElement.scrollIntoView(true)
        }, 0)
    }
    const num = searchValue.value.substring(0, 2)
    const params = {
        pageNo: pageNum.value,
        pageSize: pageSize,
        goodsStatus: 4,
        goodsName: num !== '69' ? searchValue.value : '',
        barcodes: searchValue.value !== '' && num === '69' ? barcodes.value : '',
        modelCode: modelCode,
        excludedSecondChannelId: deviceCode
    }
    if (doorType) {
        params.excludedThirdChannelId = doorType
    }

    const { code, data } = await myGoodsList(params)
    if (code === '200') {
        data.list.map((item) => {
            item.pictureUrl = getPicByMediaType(item.goodsMediaList, 6)
            item.checked = false
            return item
        })
        commodityList.value = pageNum.value === 1 ? data.list : [...commodityList.value, ...data.list]
        if (data.list.length < pageSize) finished.value = true
        loading.value = false
        pageNum.value++
    }
    if (refreshLoading.value === true) refreshLoading.value = false
}

// 搜索
const searchValue = ref('')
const checkID = ref([])
const choose = (value) => {
    checkID.value.push(value)
}
const barcodes = ref('')

// 是否展示冷冻柜提示弹窗
const freezTipsDialog = ref(false)
const openfrezonTips = ref(false) // 15天内是否展示冷冻柜提示弹窗
const freezTipsValue = ref(false)
// 判断是否提示冷冻柜弹窗
const queryFreezTips = async () => {
    const res = await getFreezTips({ freezTipsType: pageType === '2' ? 1 : 0 })
    freezTipsValue.value = res.data // true，不展示；false，展示
}
queryFreezTips()
// 确定添加
const complete = () => {
    const params = commodityList.value.filter((item) => item.checked)
    let hasFrozen = false
    params.map((item) => {
        if (item.storageStyle === '冷冻品') {
            hasFrozen = true
        }
    })
    console.log(secondCabinetTypeName.indexOf('冷冻柜') < 0)
    console.log(secondCabinetTypeName)
    console.log('hasFrozen：' + hasFrozen)
    if (!freezTipsValue.value && secondCabinetTypeName.indexOf('冷冻柜') < 0 && hasFrozen) {
        freezTipsDialog.value = true
    } else {
        setSelectGoods()
    }
}
// 冷冻柜提示-确定
const frozenSubmit = async () => {
    freezTipsDialog.value = false
    if (openfrezonTips.value) {
        freezTipsDialog.value = false
        checkTips()
        setSelectGoods()
    } else {
        setSelectGoods()
    }
}
// 冷冻柜提示-取消
const frozenCancel = async (type) => {
    if (openfrezonTips.value) {
        freezTipsDialog.value = false
        checkTips()
    }
}
const checkTips = async () => {
    const res = await checkFreezTips({ freezTipsType: pageType === '2' ? 1 : 0 })
    if (res.code === '200') {
        freezTipsValue.value = true
    }
}
const setSelectGoods = () => {
    const params = commodityList.value.filter((item) => item.checked)
    if (!params.length) return Toast('未添加商品')
    setAppStorageFn(
        'cartSelected',
        params.map((item) => {
            return {
                stock: 0,
                barcode: item.barcode,
                checked: false,
                goodsMediaList: item.goodsMediaList,
                salePrice: item.guideSalePrice,
                select: false,
                goodsId: item.goodsId,
                skuName: item.goodsName,
                total: 0,
                pictureUrl: item.pictureUrl,
                storageStyleCode: item.storageStyleCode,
                storageStyle: item.storageStyle
            }
        })
    )
    if (isApp) return appBridge('closePage')
    router.back()
}

// 扫一扫
const sweepOne = () => {
    if (!isApp) Toast('请在App中使用')
    registerhandler('setScanResult', async (val) => {
        barcodes.value = val
        var numRe = val.substring(0, 2)
        if (numRe === '69') {
            searchValue.value = val
            getList(true)
        } else {
            Toast('未识别到有效的商品条形码，请对准商品条形码进行扫描')
        }
    })
    appBridge('openScan', 1)
}
</script>
<style lang="scss" scoped>
.headBox {
    --van-nav-bar-icon-color: #000;
    --van-nav-bar-arrow-size: 35px;
    --van-nav-bar-text-color: #fe7e41;
    --van-nav-bar-title-font-size: 34px;
    background-size: 100% auto;
    background-repeat: no-repeat;
    .van-nav-bar__placeholder {
        :deep(.van-nav-bar) {
            padding-top: var(--van-status-bar-height);
            z-index: 9999;
        }
        .van-hairline--bottom:after {
            border-bottom-width: 0;
        }
    }
}
</style>
<style lang="scss" scoped>
.addItemBox {
    background: #fff;
    min-height: 100vh;
    .searchData {
        width: 750px;
        background: #ffffff;
        position: relative;
        height: 130px;
        .searchImg {
            width: 24px;
            height: 24px;
            position: absolute;
            top: 50px;
            left: 90px;
            z-index: 30;
        }
        .inputBox {
            padding-top: 12px;
            position: relative;
            color: #bbbbbb !important;
        }
    }
    .addItemList {
        padding-bottom: 112px;
        padding-bottom: calc(112px + constant(safe-area-inset-bottom)) !important;
        padding-bottom: calc(112px + env(safe-area-inset-bottom)) !important;
        box-sizing: border-box;
        .addItemData {
            width: 750px;
            background: #ffff;
            .numberBox {
                margin-top: 72px;
                margin-left: 30px;
                color: #4f5160;
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
            }
            .listUrl {
                width: 100px;
                height: 100px;
                margin-top: 40px;
                margin-left: 17px;
            }
            .listBox {
                width: 480px;
            }
            .titleContent {
                color: #191919;
                font-size: 26px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                margin-top: 40px;
                margin-left: 13px;
                word-break: break-all;
                word-wrap: break-word;
                margin-bottom: 6px;
            }
            .frozen-icon img {
                width: 116px;
                margin-left: 13px;
            }
            .orderBox {
                font-size: 22px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #b0b0b0;
                margin-left: 13px;
            }
            .checkedList{
                width: 46px;
                height: 46px;
                margin-top: 60px;
                .van-checkbox__icon--checked {
                    height: 36px;
                    width: 37px;
                    background: url('../../assets/replenishmentImg/choose2x.png') center no-repeat;
                    background-size: 35px 34px;
                    background-position-y: 2px;
                    margin-top: -1px;
                    .van-badge__wrapper {
                        display: none;
                    }
                }
            }
        }
    }
    .scanBox {
        height: 92px;
        position: fixed;
        left: 60px;
        right: 60px;
        bottom: 20px;
        z-index: 999;
        padding-bottom: constant(safe-area-inset-bottom) !important;
        padding-bottom: env(safe-area-inset-bottom) !important;
        .van-button {
            width: 100%;
            height: 92px;
            border-radius: 46px;
            font-size: 30px;
            font-weight: 610;
            color: #ffffff;
        }
    }
    .van-field__control {
        width: 620px;
        height: 64px;
        background: #f3f5f6;
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000;
        border-radius: 100px;
        text-indent: 5px;
    }
    input::-webkit-input-placeholder,
    textarea::-webkit-input-placeholder {
        color: #bbbbbb;
        font-size: 26px;
    }
    .van-search__content {
        border-radius: 100px;
        height: 64px;
        width: 690px;
        background: #f3f5f6;
    }
    .van-field__body {
        margin-top: -6px;
        width: 620px;
        height: 62px;
        background: #f3f5f6;
        border-radius: 100px;
    }
    .van-field__clear {
        margin-left: -35px;
        margin-top: 2px;
        display: none;
    }
    .van-dialog__content {
        min-height: 156px;
        height: 156px;
        line-height: 156px;
        font-size: 36px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000000;
        text-align: center;
        word-break: break-all;
        word-wrap: break-word;
    }
    .van-checkbox__icon--round .van-icon {
        width: 36px;
        height: 36px;
    }
    .bottom {
        width: 565px;
        height: 1px;
        background: #f4f5f5;
        margin-left: 185px;
        float: left;
        margin-top: 20px;
    }
    .bottomNothing {
        display: none;
    }
    .bottomNew {
        width: 565px;
        height: 1px;
        background: #f4f5f5;
        float: left;
        margin-top: 10px;
        margin-left: 185px;
    }
    .addItemNew {
        width: 100%;
        display: flex;
    }
    .face {
        height: 20px;
        width: 750px;
        background: #f4f5f5;
    }
    .van-field__left-icon {
        width: 24px;
        height: 24px;
        background: url('../../assets/replenishmentImg/search2x.png');
        background-size: 24px 24px;
        margin-top: -5px;
    }
    .van-icon-search {
        width: 24px;
        height: 24px;
        margin-top: 6px;
    }
    .van-icon-search:before {
        display: none;
        margin-top: 2px;
    }
    .van-icon:before {
        margin-top: 1px;
    }
    .sweepImg {
        width: 34px;
        height: 32px;
        position: absolute;
        top: 48px;
        right: 60px;
    }
    .nothingBox {
        background: #ffff;
        font-size: 34px;
        font-weight: 600;
        text-align: center;
        width: 750px;
        margin-top: 20px;
    }
    .emptyImg {
        width: 481px;
        height: 319px;
        margin-top: 200px;
        margin-left: 145px;
    }
    .emptyTitle {
        font-size: 30px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #888888;
        width: 100%;
        text-align: center;
    }
}
</style>
