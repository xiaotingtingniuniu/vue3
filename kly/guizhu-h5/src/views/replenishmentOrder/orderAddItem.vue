<template>
    <div class="addItemBox">
        <van-pull-refresh v-model="refreshLoading" @refresh="getList(true)">
            <div class="searchData">
                <form action="/" class="inputBox">
                    <van-search v-model="searchValue" placeholder="请输入商品名称" @search="getList(true)"/>
                    <img src="../../assets/replenishmentImg/grey@2x.png" alt="" class="sweepImg" @click="sweepOne">
                </form>
            </div>
            <div class="face"></div>
            <van-list class="addItemList" v-if="commodityList.length" v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="getList" :immediate-check="false">
                <div class="addItemData" v-for="(item,index) in commodityList" :key="index">
                    <div class="addItemNew">
                        <div class="numberBox">{{ (index>8?'':'0') + (index + 1) }}</div>
                        <van-image :src="item.pictureUrl" class="listUrl"/>
                        <div class="listBox">
                            <div class="titleContent">{{ item.goodsName }}</div>
                            <div class="frozen-icon" v-if="item.storageStyle === '冷冻品'"><img src="../../assets/frozen_icon.png"></div>
                            <div class="orderBox">{{ item.barcode }}</div>
                        </div>
                        <van-checkbox v-model="item.checked" class="checkedList" :name="item.barcode" checked-color="#FE7E41" @click="choose(item.barcode)" />
                    </div>
                    <div :class="index===commodityList.length-1?'bottomNothing':'bottomHave'">
                        <div :class="item.goodsName.length<18?'bottomNew':'bottom'"></div>
                    </div>
                </div>
            </van-list>
            <div v-else-if="searchValue === ''">
                <img src="../../assets/replenishmentImg/noneDate@2x.png" class="emptyImg"/>
                <p class="emptyTitle">暂无数据</p>
            </div>
            <van-empty v-else image="search" description="没有查询结果，请确保该商品已在“我的商品库”上架" class="nothingBox" />
        </van-pull-refresh>
        <div class="scanBox">
            <van-button color="#FE7E41" @click="setSelectGoods">确定添加</van-button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Toast } from 'vant'
import { appBridge, registerhandler } from '@/utils/bridge.js'
import { useRouter, useRoute } from 'vue-router'
import { myGoodsList, equipmentGoodsList } from '@/api/scan/scan.js'
import { setAppStorageFn } from '@/utils/storage'
import { isApp, getPicByMediaType } from '@/utils'

const router = useRouter()
const route = useRoute()

const deviceCode = route.query.deviceCode
const modelCode = route.query.modelCode

onMounted(async () => {
    await getList()
    getEquipmentList()
})

// 获取当前设备商品列表
const equipmentList = ref(null)
const getEquipmentList = async () => {
    const res = await equipmentGoodsList({ containerCode: deviceCode })
    if (res.code !== '200') return false
    equipmentList.value = res.list
}

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
    }
    const num = searchValue.value.substring(0, 2)
    const params = {
        pageNo: pageNum.value,
        pageSize: pageSize,
        goodsStatus: 4,
        goodsName: num !== '69' ? searchValue.value : '',
        modelCode: modelCode,
        barcodes: (searchValue.value !== '' && num === '69') ? barcodes.value : ''
    }
    const { code, data } = await myGoodsList(params)
    if (code === '200') {
        data.list.map(item => {
            item.pictureUrl = getPicByMediaType(item.goodsMediaList, 6)
            item.checked = false
            return item
        })
        commodityList.value = pageNum.value === 1 ? data.list : [...commodityList.value, ...data.list]
        if (data.list.length < pageSize) (finished.value = true)
        loading.value = false
        pageNum.value++
    } else {
        loading.value = false
        finished.value = true
    }
    if (refreshLoading.value === true) (refreshLoading.value = false)
}

const barcodes = ref('')
const searchValue = ref('')
const checkID = ref([])
const choose = (value) => {
    checkID.value.push(value)
}

// 确定添加
const setSelectGoods = () => {
    const params = commodityList.value.filter(item => item.checked)
    if (!params.length) return Toast('未添加商品')
    params.map((father) => equipmentList.value.map((child) => {
        if (father.barcode === child.barcode) {
            father.skuId = child.skuId
            father.stock = child.stock
        }
    }))
    setAppStorageFn('cartSelected', params.map(item => {
        return {
            barcode: item.barcode,
            checked: false,
            goodsMediaList: item.goodsMediaList,
            salePrice: item.guideSalePrice,
            select: false,
            goodsId: item.goodsId,
            skuName: item.goodsName,
            actualQuantity: 0,
            thumbnail: item.pictureUrl,
            quantity: 0,
            skuId: item.skuId || null,
            stock: item.stock || 0
        }
    }))
    if (isApp) return appBridge('closePage')
    router.back()
}
// 扫一扫
const sweepOne = () => {
    if (!isApp) Toast('请在App中使用')
    registerhandler('setScanResult', async (val) => {
        barcodes.value = val
        searchValue.value = val
        getList(true)
    })
    appBridge('openScan', 1)
}
</script>
<style lang="scss" scoped>
.headBox{
 --van-nav-bar-icon-color: #000;
    --van-nav-bar-arrow-size: 35px;
    --van-nav-bar-text-color: #FE7E41;
    --van-nav-bar-title-font-size: 34px;
    background-size: 100% auto;
    background-repeat: no-repeat;
    .van-nav-bar__placeholder{
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            z-index: 9999;
        }
        .van-hairline--bottom:after{
            border-bottom-width: 0;
        }
    }
}
</style>
<style lang="scss">
.addItemBox{
    min-height: 100vh;
    background: #fff;
    .searchData{
        width: 750px;
        background: #FFFFFF;
        position: relative;
        height: 130px;
        .searchImg{
            width: 24px;
            height: 24px;
            position: absolute;
            top: 50px;
            left: 90px;
            z-index: 30;
        }
        .inputBox{
            padding-top: 12px;
            position: relative;
            color: #BBBBBB !important;
        }
    }
    .addItemList{
        padding-bottom: 112px;
        padding-bottom: calc(112px + constant(safe-area-inset-bottom)) !important;
        padding-bottom: calc(112px + env(safe-area-inset-bottom)) !important;
        box-sizing: border-box;
        .addItemData{
            width: 750px;
            background: #ffff;
            .numberBox{
                margin-top: 72px;
                margin-left: 30px;
                color: #4F5160;
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
            }
            .listUrl{
                width: 100px;
                height: 100px;
                margin-top: 40px;
                margin-left: 17px;
            }
            .listBox{
                width: 480px;
            }
            .titleContent{
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
            .frozen-icon img{
                width: 116px;
            }
            .orderBox{
                font-size: 22px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #B0B0B0;
                margin-left: 13px;
            }
            .checkedList{
                width: 36px;
                height: 46px;
                margin-top:60px;
                .van-checkbox__icon--checked{
                    height: 36px;
                    width: 37px;
                    background: url('../../assets/replenishmentImg/choose2x.png') center no-repeat;
                    background-size: 35px 34px;
                    background-position-y: 2px;
                    margin-top: -1px;
                    .van-badge__wrapper{
                        display: none;
                    }
                }
            }
        }
    }
    .scanBox{
        height: 92px;
        position: fixed;
        left: 60px;
        right: 60px;
        bottom: 20px;
        z-index: 999;
        padding-bottom: constant(safe-area-inset-bottom) !important;
        padding-bottom: env(safe-area-inset-bottom) !important;
        .van-button{
            width: 100%;
            height: 92px;
            border-radius: 46px;
            font-size: 30px;
            font-weight: 610;
            color: #FFFFFF;
        }
    }
    .van-field__control{
        width: 620px;
        height: 64px;
        background: #F3F5F6;
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000;
        border-radius: 100px;
        text-indent: 5px;
    }
    input::-webkit-input-placeholder,textarea::-webkit-input-placeholder{
        color:#BBBBBB;;
        font-size: 26px;
    }
    .van-search__content{
        border-radius: 100px;
        height: 64px;
        width: 690px;
        background: #F3F5F6;
    }
    .van-field__body{
        margin-top: -6px;
        width: 620px;
        height: 62px;
        background: #F3F5F6;
        border-radius: 100px;
    }
    .van-field__clear{
        margin-left: -35px;
        margin-top: 2px;
        display: none;
    }
    .van-dialog__content{
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
    .van-checkbox__icon--round .van-icon{
        width: 36px;
        height: 36px;
    }
    .bottom{
        width: 565px;
        height: 1px;
        background: #F4F5F5;
        margin-left: 185px;
        float: left;
        margin-top: 20px;
    }
    .bottomNothing{
        display: none;
    }
    .bottomNew{
        width: 565px;
        height: 1px;
        background: #F4F5F5;
        float: left;
        margin-top: 10px;
        margin-left: 185px;
    }
    .addItemNew{
        width: 100%;
        display: flex;
    }
    .face{
        height: 20px;
        width: 750px;
        background: #F4F5F5;
    }
    .van-field__left-icon{
        width: 24px;
        height: 24px;
        background: url('../../assets/replenishmentImg/search2x.png');
        background-size: 24px 24px;
        margin-top: -5px;
    }
    .van-icon-search{
        width: 24px;
        height: 24px;
        margin-top: 6px;
    }
    .van-icon-search:before{
        display: none;
        margin-top: 2px;
    }
    .van-icon:before{
        margin-top: 1px;
    }
    .sweepImg{
        width: 34px;
        height: 32px;
        position: absolute;
        top: 48px;
        right: 60px;
    }
    .lineBox{
        position: absolute;
        top: 48px;
        right: 88px;
        width: 1px;
        height: 30px;
        background: #000;
    }
    .nothingBox{
        background: #ffff;
        font-size: 34px;
        font-weight: 600;
        text-align: center;
        width: 750px;
        margin-top: 20px;
    }
    .emptyImg{
        width: 481px;
        height: 319px;
        margin-top: 200px;
        margin-left: 145px;
    }
    .emptyTitle{
        font-size: 30px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #888888;
        width: 100%;
        text-align: center;
    }
}
</style>
