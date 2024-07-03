<template>
    <div class="replenishment-order-list" v-if="afterList">
        <van-nav-bar title="补货" fixed placeholder>
            <template #left>
                <van-image @click="closePageFn" :src="require('@/assets/back-icon.png')"/>
            </template>
        </van-nav-bar>
        <van-search v-model="searchValue" shape="round" placeholder="请输入商品名称或条形码搜索">
            <template #left-icon>
                <van-image :src="require('@/assets/replenishmentImg/search-left-icon.png')"/>
            </template>
            <template #right-icon>
                <van-image @click="scanForSearch" :src="require('@/assets/replenishmentImg/scan-icon.png')"/>
            </template>
        </van-search>
        <div class="action-bar">
            <div class="action-bar--left">
                <van-image :src="require('@/assets/replenishmentImg/grouping2x.png')"/>
                <div class="text van-ellipsis">{{ deviceName }}</div>
            </div>
            <div class="action-bar--right">
                <van-button @click="commodityCilik()" v-if="authorized.check(['scan-good-add', 'scan-inventory-add-good', 'device-good-add-good'])">添加商品</van-button>
            </div>
        </div>
        <div class="list-box">
            <div class="list-title">
                <div class="seize-a-seat"></div>
                <div class="label label-1" @click="changeSort('01')">
                    <div class="label-text">库存数量</div>
                    <div class="sort-box">
                        <van-image v-show="memorySort !== 0" class="mrb6" :src="arrowUp"/>
                        <van-image v-show="memorySort === 0" class="mrb6" :src="arrowUpActive"/>
                        <van-image v-show="memorySort !== 1" :src="arrowDown"/>
                        <van-image v-show="memorySort === 1" :src="arrowDownActive"/>
                    </div>
                </div>
                <div class="label label-3">
                    <div class="label-text">应补数量</div>
                </div>
                <div class="label label-2" @click="changeSort('23')">
                    <div class="label-text">实补数量</div>
                    <div class="sort-box">
                        <van-image v-show="memorySort !== 2" class="mrb6" :src="arrowUp"/>
                        <van-image v-show="memorySort === 2" class="mrb6" :src="arrowUpActive"/>
                        <van-image v-show="memorySort !== 3" :src="arrowDown"/>
                        <van-image v-show="memorySort === 3" :src="arrowDownActive"/>
                    </div>
                </div>
            </div>
            <template v-if="commodityListforPage.length">
                <div class="cell-item" v-for="(item, index) in commodityListforPage" :key="index">
                    <div class="number-box">{{ (index > 8 ? '' : '0') + (index + 1) }}</div>
                    <van-image :src="item.thumbnail"/>
                    <div class="goods-info van-hairline--bottom">
                        <div class="sku-name">{{ item.skuName }}</div>
                        <div class="flex-box">
                            <div class="flex-left">
                                <div class="barcode">{{ item.barcode }}</div>
                                <div class="stock"><span>补前库存:{{ item.stock || '--' }}</span><div class="van-hairline--right"></div><span>补后库存:{{ !item.actualQuantity ? '--' : (Number(item.stock) + Number(item.actualQuantity)) }}</span></div>
                            </div>
                            <div class="flex-middle">{{ item.quantity }}</div>
                            <div class="flex-right">
                                <div class="pedometerBox">
                                    <button class="reduceBox" @click="commodityList[index].actualQuantity--" :disabled="!item.actualQuantity"><img src="../../assets/replenishmentImg/reduce@2x.png" alt=""></button>
                                    <input type="number" v-model="item.actualQuantity" oninput="value=value.replace(/^(0+)|[^\d]+/g,'')" class="inputBox">
                                    <button class="plusBox" @click="commodityList[index].actualQuantity++"><img src="../../assets/replenishmentImg/plus@2x.png" alt=""></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <div v-else class="empty-box">
                <img :src="require('@/assets/replenishmentImg/noneDate@2x.png')"/>
                <p class="emptyTitle">暂无数据</p>
            </div>
        </div>
        <div class="scanBoxHeight"></div>
        <div class="scanBox">
            <van-button class="scan-button" @click.prevent="codeScan()" :icon="require('@/assets/replenishmentImg/scan@2x.png')">扫条形码补货</van-button>
            <van-button  @click="reconfirm()" loading-type="spinner" :loading="buttonDisabled" :disabled='buttonDisabled'>补货完成</van-button>
        </div>
        <van-popup v-model:show="popupShow" round position="bottom" closeable :close-icon="require('@/assets/close.png')">
            <template v-if="scanObj&&popupShow">
                <div class="goods-info">
                    <van-image :src="scanObj.thumbnail"/>
                    <div class="content">
                        <div class="sku-name">{{ scanObj.skuName }}</div>
                        <div class="barcode">{{ scanObj.barcode }}</div>
                        <div class="stock"><span>补前库存：{{ scanObj.stock || '--' }}</span><span>补后库存：{{ !scanObj.actualQuantity ? '--' : (Number(scanObj.stock) + Number(scanObj.actualQuantity)) }}</span></div>
                        <div class="enter-quantity">
                            <div class="label">补货数量</div>
                            <div class="input-box">
                                <div class="flex-box colour--gray" v-if="!scanObj.actualQuantity">
                                    <div class="cursor-blink"></div><div>请输入补货数量</div>
                                </div>
                                <div class="flex-box" v-else>
                                    <div>{{ scanObj.actualQuantity }}</div><div class="cursor-blink"></div>
                                </div>
                                <span>件</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="scan-box">
                    <van-button class="scan-button" @click="saveScanObj(true)" :icon="require('@/assets/replenishmentImg/scan@2x.png')">保存并继续扫码</van-button>
                    <van-button @click="saveScanObj(false)">保存</van-button>
                </div>
                <van-number-keyboard v-model="scanObj.actualQuantity" :show="true" extra-key="00"/>
            </template>
        </van-popup>
    </div>
    <div v-if="afterList === false" class="afterBox">
        <van-nav-bar title="补货完成" fixed placeholder>
            <template #left>
                <van-image @click="closePageClick" :src="require('@/assets/back-icon.png')"/>
            </template>
        </van-nav-bar>
        <div class="openDoorContent">
            <div class="tipsBox">请按照以下示例进行拍照</div>
            <div class="instructions">补货完成后需对货柜进行再次拍照，请保证照片可以清晰展示柜内商品。防止照片出现不完整、过暗或模糊的情况</div>
            <img src="@/assets/replenishmentlmOrder/after.png" class="chartUrl"/>
        </div>
        <van-button color="#FE7E41" loading-type="spinner" class="afterComplete" :loading="buttonDisabled" @click="getPhoto">开始拍照</van-button>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Toast, Dialog } from 'vant'
import { useRoute } from 'vue-router'
import { scanning, getScanCodeInfo, queryGoodsList, equipmentGoodsList, skuDetail } from '@/api/scan/scan'
import { appBridge, registerhandler } from '@/utils/bridge.js'
import { isApp, getPicByMediaType, getTime } from '@/utils'
import { getAppStorageFn, setAppStorageFn } from '@/utils/storage'
import authorized from '@/utils/authorized'
import { newPage, closePage } from '@/utils/composables'
import { replenishmentDetail } from '@/api/scan/order'
import { tracker } from '@/utils/tracker'
import arrowUp from '@/assets/replenishmentImg/arrow-up.png'
import arrowDown from '@/assets/replenishmentImg/arrow-down.png'
import arrowUpActive from '@/assets/replenishmentImg/arrow-up-active.png'
import arrowDownActive from '@/assets/replenishmentImg/arrow-down-active.png'

const route = useRoute()
const deviceName = route.query.containerName
const deviceCode = route.query.containerCode
const orderId = route.query.id // 补货单ID
const billNo = route.query.billNo // 补货单编号
const replenishBefore = decodeURIComponent(route.query.replenishBefore) // 补货前照片
const popupShow = ref(false)
const replenishAfter = ref(null) // 补货后照片
const startTime = getTime()

onMounted(async () => {
    await getList()
    await getModelCode()
    await getEquipmentList()
    onActivatedFn()
})
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && isApp) {
        onActivatedFn()
    }
})

// 获取当前设备商品列表
const equipmentList = ref([])
const getEquipmentList = async () => {
    const res = await equipmentGoodsList({ containerCode: deviceCode })
    if (res.code !== '200') return false
    equipmentList.value = res.list.map(item => {
        commodityList.value.map(goods => {
            if (goods.barcode === item.barcode) {
                goods.stock = item.stock
            }
        })
        item.price = item.salePrice
        item.id = null
        item.thumbnail = getPicByMediaType(item.goodsMediaList, 6)
        item.actualQuantity = 0
        item.quantity = 0
        return item
    })
}

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

// 排序部分 0 => 库存升 1 => 库存降 2 => 实补升 3 => 实补降
const memorySort = ref('')
const changeSort = (payload) => {
    if (payload === '01') {
        memorySort.value = memorySort.value === 0 ? 1 : 0
    } else if (payload === '23') {
        memorySort.value = memorySort.value === 2 ? 3 : 2
    }
    sortFn(memorySort.value)
}
const sortFn = (sortMode) => {
    const field = sortMode < 2 ? 'stock' : 'actualQuantity'
    commodityList.value = qSort(JSON.parse(JSON.stringify(commodityList.value)), field, sortMode)
}
const qSort = (arr, field, sortMode) => {
    if (arr.length <= 1) { return arr }
    const mVal = arr.shift()
    const [left, right] = [[], []]
    arr.forEach(item => (sortMode % 2 === 0 ? (item[field] < mVal[field]) : (item[field] > mVal[field])) ? left.push(item) : right.push(item))
    return [...qSort(left, field, sortMode), mVal, ...qSort(right, field, sortMode)]
}

// 拉取的商品列表
const commodityList = ref([])
const getList = async () => {
    const { code, data } = await replenishmentDetail({ billNo })
    if (code !== '200') return false
    commodityList.value = data.detailList.map(item => {
        item.actualQuantity = ''
        item.stock = 0
        return item
    })
}

// 获取算法编码
const modelCode = ref(null)
const getModelCode = async () => {
    const { code, data } = await getScanCodeInfo({ deviceCode })
    if (code !== '200') return false
    modelCode.value = data.modelCode
}

const onActivatedFn = () => {
    getAppStorageFn('cartSelected', (val) => {
        if (!val) return false
        const storageList = JSON.parse(val)
        if (storageList.length < 1) return false
        const tempList = [...storageList, ...commodityList.value]
        const tempMap = new Map()
        tempList.map((item) => {
            if (!tempMap.has(item.skuId)) {
                tempMap.set(item.skuId, item)
            } else {
                const obj = tempMap.get(item.skuId)
                obj.actualQuantity = Number(obj.actualQuantity) + Number(item.actualQuantity)
                tempMap.set(item.skuId, obj)
            }
        })
        commodityList.value = Array.from(tempMap).map(item => item[1])
        setAppStorageFn('cartSelected', [])
    })
}

// 添加商品
const commodityCilik = () => {
    searchValue.value = ''
    memorySort.value = ''
    newPage(`/orderAddItem?showNavbar=1&deviceCode=${deviceCode}&modelCode=${modelCode.value}`, {
        deviceCode,
        modelCode: modelCode.value
    })
}

// 补货提交前二次确认
const reconfirm = () => {
    Dialog.confirm({
        title: '确认提交？',
        message: '提交后将同步更新商品库存',
        confirmButtonColor: '#FE7E41',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        getContaniner: '.replenishment-order-list'
    }).then(() => {
        complete()
    })
}

// 补货完成拍照
const afterList = ref(true)
const passList = ref(null)
const getPhoto = () => {
    getAppStorageFn('trackerAct', async (val) => {
        if (!val) return false
        await tracker({
            module: 'photo',
            subModule: 'completePage',
            event: 'takePicture_click',
            params: {
                act: val,
                click_time: (new Date()).valueOf(),
                functionName: '补货单',
                deviceId: deviceCode,
                deviceName: deviceName
            }
        })
    })
    registerhandler('setPhotoBackToWeb', async (vla) => {
        replenishAfter.value = vla
        buttonDisabled.value = true
        if (vla) {
            passList.value.replenishAfter = vla
            const res = await scanning(passList.value)
            if (res.code === '200') {
                buttonDisabled.value = false
                newPage(`/result?showNavbar=0&isReplenishmentOrder=1&billNo=${res.data.billNo}&skuTypeCount=${res.data.skuTypeCount}&beforeSkuCount=${res.data.beforeSkuCount}&afterSkuCount=${res.data.afterSkuCount}`, {
                    billNo: res.data.billNo,
                    skuTypeCount: res.data.skuTypeCount,
                    beforeSkuCount: res.data.beforeSkuCount,
                    afterSkuCount: res.data.afterSkuCount
                })
            }
        }
    })
    appBridge('takePhoto')
}

const closePageClick = () => {
    afterList.value = true
}

// 补货完成跳转页面
const buttonDisabled = ref(false)
const complete = async () => {
    if (buttonDisabled.value) return false
    buttonDisabled.value = true
    const goodsList = []
    commodityList.value.forEach((item, index) => {
        const items = {
            skuId: item.skuId,
            oldPrice: item.price,
            quantity: item.quantity,
            price: item.price,
            replenNumber: item.actualQuantity,
            skuName: item.skuName,
            barcode: item.barcode,
            id: item.id,
            goodsId: item.goodsId
        }
        goodsList.push(items)
    })
    const params = {
        containerCode: deviceCode,
        goodsList,
        id: Number(orderId),
        billNo: billNo,
        replenishBefore: replenishBefore,
        replenishAfter: replenishAfter.value,
        startTime
    }
    const checkActualQuantity = goodsList.some((item) => item.replenNumber === '')
    if (checkActualQuantity) {
        buttonDisabled.value = false
        return Toast.fail('实补数量不能为空，请输入')
    }
    getAppStorageFn('trackerAct', async (val) => {
        if (!val) return false
        await tracker({
            module: 'restore',
            subModule: 'restorePage',
            event: 'restoreDone_click',
            params: {
                act: val,
                click_time: (new Date()).valueOf(),
                functionName: '补货单',
                deviceId: deviceCode,
                deviceName: deviceName,
                skuList: goodsList
            }
        })
    })
    if (commodityList.value.length > 50) {
        Dialog.confirm({
            confirmButtonColor: '#FE7E41',
            message: `添加后，该货柜商品数量为${commodityList.value.length}个，大于50个商品会降低商品识别率以及识别速度，请确认是否继续添加？`,
            confirmButtonText: '取消',
            cancelButtonText: '继续添加',
            getContaniner: '.addItemBox'
        }).then(() => {
            buttonDisabled.value = false
        }).catch(async () => {
            buttonDisabled.value = false
            passList.value = params
            afterList.value = false
        })
    } else {
        buttonDisabled.value = false
        passList.value = params
        afterList.value = false
    }
}
// 保存 / 保存继续扫码
const saveScanObj = async (type) => {
    const index = commodityList.value.findIndex(item => item.barcode === scanObj.value.barcode)
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
            commodityList.value.unshift(scanObj.value)
            resolve(true)
        } else {
            const obj = commodityList.value.splice(index, 1)[0]
            obj.actualQuantity = scanObj.value.actualQuantity
            commodityList.value.unshift(obj)
            resolve(true)
        }
    })
}
// 扫码补货
const scanObj = ref(null)
const codeScan = async () => {
    if (!isApp) return Toast('请在App中使用')
    searchValue.value = ''
    memorySort.value = ''
    registerhandler('setScanResult', async (barcode) => {
        let res = { code: '200' }
        if (modelCode.value && deviceCode !== 'tb000001') {
            res = await queryGoodsList({
                goodsStatus: 4,
                barcodes: barcode,
                modelCode: modelCode.value
            })
        }
        if (barcode !== '' && res.code === '200') {
            const tempList = [...equipmentList.value, ...commodityList.value]
            const tempMap = new Map()
            tempList.map((item) => {
                if (!tempMap.has(item.barcode)) {
                    tempMap.set(item.barcode, item)
                } else {
                    const obj = tempMap.get(item.barcode)
                    obj.actualQuantity = item.actualQuantity + ''
                    obj.quantity = item.quantity
                    obj.id = item.id
                    tempMap.set(item.barcode, obj)
                }
            })
            const tempArr = Array.from(tempMap).map(item => item[1])
            scanObj.value = tempArr.find(item => {
                if (item.barcode === barcode) {
                    console.log(item)
                    return item
                }
            })
            if (!scanObj.value) {
                const { object } = await skuDetail({ barcode, modelCode: modelCode.value })
                object.thumbnail = getPicByMediaType(object.goodsMediaList, 6)
                object.skuName = object.goodsName
                object.salePrice = object.guideSalePrice
                object.quantity = 0
                object.actualQuantity = '0'
                object.stock = 0
                scanObj.value = object
            }
            popupShow.value = true
        } else if (res.code === '1001') {
            Dialog.confirm({
                confirmButtonColor: '#FE7E41',
                message: '该商品未添加到本地商品库，请添加后进行扫描',
                confirmButtonText: '我的商品库',
                cancelButtonText: '取消',
                getContaniner: '.replenishment-order-list'
            }).then(() =>
                newPage('/myGoods?showNavbar=0', {})
            )
        } else {
            Dialog.confirm({
                confirmButtonColor: '#FE7E41',
                message: res.code === '1002' ? '无此商品，请点击“新品申请”新增商品并建模后进行扫描' : '商品未建模，请点击“新品申请”建模后进行扫描',
                confirmButtonText: '新品申请',
                cancelButtonText: '取消',
                getContaniner: '.replenishment-order-list'
            }).then(() =>
                newPage('/apply-new-products?showNavbar=0', {})
            )
        }
    })
    appBridge('openScan', 1)
}

// 返回弹窗
const closePageFn = () => {
    Dialog.confirm({
        message: '退出后录入的内容将会清空，确定退出？'
    }).then(() => {
        closePage()
    })
}
</script>
<style lang="scss" scoped>
.replenishment-order-list {
    min-height: 100vh;
    background: #fff;
    .van-nav-bar__placeholder{
        height: calc(92px + var(--van-status-bar-height)) !important;
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            .van-image{
                width: 44px;
                height: 44px;
            }
            .van-nav-bar__title{
                font-size: 36px;
                font-weight: 500;
                color: #191919;
            }
        }
    }
    .van-search{
        padding: 20px 30px;
        :deep(.van-search__field){
            height: 62px;
            padding-right: 30px;
            .van-field__left-icon{
                width: 26px;
                height: 24px;
            }
            .van-field__right-icon{
                width: 32px;
                height: 32px;
                padding-left: 18px;
                border-left: 2px solid #DDDDDD;
            }
            .van-image{
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
        .action-bar--left{
            display: flex;
            align-items: center;
            .van-image{
                width: 30px;
                height: 30px;
            }
            .text{
                width: 200px;
                margin-left: 10px;
                color: #696969;
            }
        }
        .action-bar--right{
            width: max-content;
            .van-button {
                width: 168px;
                height: 62px;
                border-radius: 31px;
                border: 1px solid #fe7e41;
                box-sizing: border-box;
                font-size: 24px;
                font-weight: 500;
                color: #FE7E41;
                background: #FFFFFF;
                margin-left: 20px;
            }
        }
    }
    .list-box{
        .list-title{
            padding: 20px 30px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #F4F5F5;
            color: #696969;
            .seize-a-seat{
                width: 160px;
            }
            .label{
                display: flex;
                align-items: center;
                .label-text{
                    color: #696969;
                    font-size: 26px;
                }
                .sort-box{
                    display: flex;
                    flex-direction: column;
                    margin-left: 8px;
                    .van-image{
                        width: 12px;
                        height: 8px;
                    }
                    .mrb6{
                        margin-bottom: 6px;
                    }
                }
            }
            .label-1{
                flex: 1;
            }
            .label-2{
                width: 130px;
                justify-content: center;
            }
            .label-3{
                width: 120px;
                justify-content: center;
            }
        }
    }
    .cell-item{
        box-sizing: border-box;
        display: flex;
        align-items: flex-start;
        padding: 40px 30px 0;
        .number-box{
            width: 36px;
            text-align: center;
            line-height: 100px;
            color: #999999;
            font-size: 26px;
            font-weight: 400;
        }
        &>.van-image{
            width: 100px;
            height: 100px;
            margin-left: 16px;
            border-radius: 8px;
            overflow: hidden;
        }
        .goods-info{
            width: 0;
            flex: 1;
            margin-left: 16px;
            padding-bottom: 40px;
            .sku-name{
                word-break: break-all;
                word-wrap: break-word;
                font-size: 28px;
                font-weight: 500;
                color: #191919;
                line-height: 36px;
            }
            .flex-box{
                display: flex;
                align-items: center;
                justify-content: space-between;
                .flex-left{
                    width: 0;
                    flex: 1;
                    .barcode{
                        margin-top: 8px;
                        font-size: 22px;
                        font-weight: 400;
                        color: #999999;
                        line-height: 30px;
                    }
                    .stock{
                        font-size: 22px;
                        font-weight: 400;
                        color: #999999;
                        line-height: 30px;
                        margin-top: 6px;
                        display: flex;
                        align-items: center;
                        span{
                            margin-right: 12px;
                        }
                        div{
                            height: 22px;
                            margin-right: 12px;
                        }
                    }
                }
                .flex-middle{
                    width: 120px;
                    text-align: center;
                    font-size: 26px;
                    font-weight: 400;
                    color: #191919;
                }
                .flex-right{
                    .pedometerBox{
                        display: flex;
                        .reduceBox{
                            width: 44px;
                            height: 44px;
                            border-radius: 6px 0px 0px 6px;
                            background: #fff;
                            border: 1px solid #E0E0E0;
                            img{
                                width: 15px;
                                height: 6px;
                                margin-bottom:8px;
                                margin-left: 5px;
                            }
                        }
                        .inputBox{
                            width: 44px;
                            height: 44px;
                            border-left: none;
                            border-right: none;
                            border-top: 1px solid #E0E0E0;
                            font-size: 26px;
                            font-weight: 400;
                            color: #0D0D0D;
                            border-bottom: 1px solid #E0E0E0;
                            text-align: center;
                            border-radius: initial;
                            box-sizing: border-box;
                        }
                        .plusBox{
                            width: 44px;
                            height: 44px;
                            border-radius: 0px 6px 6px 0px;
                            background: #fff;
                            border: 1px solid #E0E0E0;
                            img{
                                width: 15px;
                                height: 15px;
                                margin-bottom:3px;
                            }
                        }
                    }
                }
            }
        }
    }
    .scanBoxHeight{
        width: 100%;
        height: 132px;
        padding-bottom: constant(safe-area-inset-bottom) !important;
        padding-bottom: env(safe-area-inset-bottom) !important;
    }
    .scanBox{
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
        padding-bottom: 20px;
        padding-bottom: calc(20px + constant(safe-area-inset-bottom)) !important;
        padding-bottom: calc(20px + env(safe-area-inset-bottom)) !important;
        .scan-button.van-button{
            width: 376px;
            height: 92px;
            background: #FFFFFF;
            border-radius: 46px;
            border: 2px solid #FE7E41;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            font-weight: 500;
            color: #FE7E41;
            :deep(.van-icon__image){
                width: 28px;
                height: 28px;
            }
            :deep(.van-button__text){
                margin-left: 16px;
            }
        }
        .van-button{
            width: 256px;
            height: 92px;
            background: linear-gradient(90deg, #FE7E41 0%, #FF5D0F 100%, #FF5C0E 100%);
            border-radius: 46px;
            font-size: 30px;
            font-weight: 500;
            color: #FFFFFF;
        }
    }
    .empty-box{
        img{
            width: 481px;
            height: 319px;
            margin-top: 200px;
            margin-left: 145px;
        }
        p{
            width: 100%;
            font-size: 30px;
            font-weight: 400;
            color: #888888;
            text-align: center;
        }
    }
    :deep(.van-checkbox__icon){
        .van-icon{
            line-height:32px;
            font-size: 25px;
        }
    }
    :deep(.van-popup){
        .van-popup__close-icon{
            font-size: 46px;
        }
        .goods-info{
            display: flex;
            align-items: flex-start;
            padding: 60px 100px 0 50px;
            height: max-content;
            .van-image{
                width: 144px;
                height: 144px;
                border-radius: 16px;
                overflow: hidden;
            }
            .content{
                width: 0;
                flex: 1;
                margin-left: 24px;
                .sku-name{
                    word-break: break-all;
                    word-wrap: break-word;
                    font-size: 30px;
                    font-weight: 500;
                    color: #191919;
                    line-height: 36px;
                }
                .barcode{
                    margin-top: 10px;
                    font-size: 24px;
                    font-weight: 400;
                    color: #999999;
                    line-height: 30px;
                }
                .stock{
                    font-size: 22px;
                    font-weight: 400;
                    color: #999999;
                    line-height: 30px;
                    margin-top: 10px;
                    span{
                        margin-right: 26px;
                    }
                }
                .enter-quantity{
                    margin-top: 64px;
                    display: flex;
                    align-items: center;
                    .label{
                        font-size: 24px;
                        font-weight: 400;
                        color: #191919;
                        line-height: 30px;
                    }
                    .input-box{
                        display: flex;
                        justify-content: space-between;
                        margin-left: 20px;
                        padding: 22px 16px 22px 20px;
                        width: 244px;
                        background: #F4F5F5;
                        border-radius: 12px;
                        line-height: 36px;
                        font-size: 26px;
                        font-weight: 400;
                        color: #999999;
                        .flex-box{
                            display: flex;
                            font-size: 26px;
                            font-weight: 400;
                            color: #191919;
                        }
                        .colour--gray{
                            color: #999999;
                        }
                        .cursor-blink {
                            display: inline-block;
                            width: 1px;
                            animation: blink 1s infinite steps(1, start);
                        }
                        /*这里设置动画blink*/
                        @keyframes blink {
                            0%, 100% {
                                background-color: #FE7E41;
                            }
                            50% {
                                background-color: transparent; /* not #aaa because it's seem there is Google Chrome bug */
                            }
                        }
                        span{
                            color: #191919;
                        }
                    }
                }
            }
        }
        .scan-box{
            display: flex;
            justify-content: space-between;
            background: rgba($color: #ffffff, $alpha: 0.9);
            padding: 94px 40px 20px 40px;
            .scan-button.van-button{
                width: 376px;
                height: 92px;
                background: #FFFFFF;
                border-radius: 46px;
                border: 2px solid #FE7E41;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 30px;
                font-weight: 500;
                color: #FE7E41;
                .van-icon__image{
                    width: 28px;
                    height: 28px;
                }
                .van-button__text{
                    margin-left: 16px;
                }
            }
            .van-button{
                width: 256px;
                height: 92px;
                background: linear-gradient(90deg, #FE7E41 0%, #FF5D0F 100%, #FF5C0E 100%);
                border-radius: 46px;
                font-size: 30px;
                font-weight: 500;
                color: #FFFFFF;
            }
        }
        .van-number-keyboard{
            position: initial;
        }
    }
}
.afterBox{
    background: #fff;
    min-height: 100vh;
    .van-nav-bar__placeholder{
        height: calc(92px + var(--van-status-bar-height)) !important;
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            .van-image{
                width: 44px;
                height: 44px;
            }
            .van-nav-bar__title{
                font-size: 36px;
                font-weight: 500;
                color: #191919;
            }
        }
    }
    .openDoorContent{
        margin-top: 30px;
        .tipsBox{
            font-size: 32px;
            font-weight: 600;
            color: #FE7E41;
            margin-left: 200px;
        }
        .instructions{
            width: 690px;
            font-size: 26px;
            font-weight: 400;
            color: #696969;
            margin-top: 16px;
            margin-left: 30px;
        }
        .chartUrl{
            width: 690px;
            height: 920px;
            margin-top: 32px;
            margin-left: 30px;
            border-radius: 24px;
        }
    }
    .afterComplete{
        width: 630px;
        height: 92px;
        background: #FE7E41;
        border-radius: 46px;
        font-size: 30px;
        font-weight: 600;
        color: #FFFFFF;
        position: fixed;
        left: 60px;
        bottom: 76px;
    }
}
</style>
