<!-- 盘货/补货页面 -->
<template>
    <div class="replenishment-list">
        <van-nav-bar :title="pageType === '2' ? '盘货' : '补货'" fixed placeholder>
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
        <div class="action-bar" v-if="!editFlag">
            <div class="action-bar--left">
                <van-image :src="require('@/assets/replenishmentImg/grouping2x.png')" />
                <div class="text van-ellipsis">{{ deviceName }}</div>
            </div>
            <div class="action-bar--right">
                <van-button @click="commodityCilik()" v-if="authorized.check(['scan-good-add', 'scan-inventory-add-good', 'device-good-add-good'])">添加商品</van-button>
                <van-button @click="editFlag = true" v-if="authorized.check('scan-good-batch-m', 'scan-inventory-batch-m', 'device-good-batch-m')">删除商品</van-button>
            </div>
        </div>
        <div class="action-bar" v-if="editFlag">
            <van-checkbox v-model="selectAll" @click="checkAll" checked-color="#FE7E41">全选</van-checkbox>
            <div class="action-bar--right">
                <van-button @click="deleteFn()">删除</van-button>
                <van-button @click="signOut">退出管理</van-button>
            </div>
        </div>
        <div class="list-box">
            <!-- 盘货 -->
            <div class="list-title" v-if="pageType === '2'">
                <div class="seize-a-seat"></div>
                <div class="label label-1">
                    <div class="label-text">商品信息</div>
                </div>
                <div class="label label-2" @click="changeSort('45')">
                    <div class="label-text">盘后库存</div>
                    <div class="sort-box">
                        <van-image v-show="memorySort !== 4" class="mrb6" :src="arrowUp" />
                        <van-image v-show="memorySort === 4" class="mrb6" :src="arrowUpActive" />
                        <van-image v-show="memorySort !== 5" :src="arrowDown" />
                        <van-image v-show="memorySort === 5" :src="arrowDownActive" />
                    </div>
                </div>
            </div>
            <!-- 补货 -->
            <div class="list-title" v-else>
                <div class="seize-a-seat"></div>
                <div class="label label-1" @click="changeSort('01')">
                    <div class="label-text">库存数量</div>
                    <div class="sort-box">
                        <van-image v-show="memorySort !== 0" class="mrb6" :src="arrowUp" />
                        <van-image v-show="memorySort === 0" class="mrb6" :src="arrowUpActive" />
                        <van-image v-show="memorySort !== 1" :src="arrowDown" />
                        <van-image v-show="memorySort === 1" :src="arrowDownActive" />
                    </div>
                </div>
                <div class="label label-2" @click="changeSort('23')">
                    <div class="label-text">实补数量</div>
                    <div class="sort-box">
                        <van-image v-show="memorySort !== 2" class="mrb6" :src="arrowUp" />
                        <van-image v-show="memorySort === 2" class="mrb6" :src="arrowUpActive" />
                        <van-image v-show="memorySort !== 3" :src="arrowDown" />
                        <van-image v-show="memorySort === 3" :src="arrowDownActive" />
                    </div>
                </div>
            </div>
            <template v-if="commodityListforPage.length">
                <van-swipe-cell v-for="(item, index) in commodityListforPage" :key="item.barcode + item.skuName + index" right-width="80" :disabled="editFlag">
                    <div class="cell-item">
                        <van-checkbox v-model="item.checked" v-if="editFlag" @click="choose()" checked-color="#FE7E41" />
                        <div class="number-box" v-if="!editFlag">{{ (index > 8 ? '' : '0') + (index + 1) }}</div>
                        <van-image :src="item.pictureUrl || ''" />
                        <!-- 补货 -->
                        <div class="goods-info van-hairline--bottom" v-if="pageType !== '2'">
                            <div class="flex-left">
                                <div class="sku-name">{{ item.skuName }}</div>
                                <div class="frozen-icon" v-if="item.storageStyle === '冷冻品'"><img src="../../assets/frozen_icon.png" /></div>
                                <div class="barcode">{{ item.barcode }}</div>
                                <div class="stock">
                                    <span>补前库存:{{ item.stock || '--' }}</span>
                                    <div class="van-hairline--right"></div>
                                    <span>补后库存:{{ Number(item.total) === 0 ? '--' : Number(item.stock) + Number(item.total) }}</span>
                                </div>
                                <div class="price-box">
                                    <span class="unit">¥</span>
                                    <span class="sale-price" v-if="!item.select">{{ item.salePrice }}</span>
                                    <van-field
                                        :ref="
                                            (el) => {
                                                fieldRef[index] = el
                                            }
                                        "
                                        v-if="item.select"
                                        v-model="item.tempPrice"
                                        @blur="checkPriceFn(item)"
                                        type="number"
                                        :placeholder="item.salePrice ? item.salePrice + '' : '请输入金额'" />
                                    <span v-if="authorized.check('scan-good-price-edit') || authorized.check('device-good-edit-price')">
                                        <img v-if="!item.select" @click="modifyPrice(item, index)" class="editBox" src="@/assets/replenishmentImg/edit2x.png" />
                                    </span>
                                </div>
                            </div>
                            <div class="flex-right">
                                <div v-if="authorized.check('scan-good-count') || authorized.check('device-good-edit-count')">
                                    <van-stepper v-model="item.total" :allow-empty="!!item.totalFlag" @focus="stepperFocus(item)" @blur="stepperBlur(item)" integer min="" />
                                </div>
                            </div>
                        </div>
                        <!-- 盘货 -->
                        <div class="goods-info van-hairline--bottom" v-if="pageType === '2'">
                            <div class="flex-left">
                                <div class="sku-name">{{ item.skuName }}</div>
                                <div class="frozen-icon" v-if="item.storageStyle === '冷冻品'"><img src="../../assets/frozen_icon.png" /></div>
                                <div class="barcode">{{ item.barcode }}</div>
                                <div class="stock">
                                    <template v-if="authorized.check('scan-inventory-show-stock')">
                                        <span>盘前库存:{{ item.stock || '--' }}</span>
                                        <div class="van-hairline--right"></div>
                                    </template>
                                    <span>盘后库存:{{ item.total === '' ? '--' : Number(item.total) }}</span>
                                </div>
                            </div>
                            <div class="flex-right">
                                <div class="pedometerBox">
                                    <button class="reduceBox" @click="item.total--" :disabled="!item.total"><img src="../../assets/replenishmentImg/reduce@2x.png" alt="" /></button>
                                    <input type="number" v-model="item.total" oninput="value=value.replace(/^(-1+)|[^\d]+/g,'')" class="inputBox" />
                                    <button class="plusBox" @click="item.total++"><img src="../../assets/replenishmentImg/plus@2x.png" alt="" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <template #right>
                        <van-button @click="deleteFn(item)" block :icon="require('@/assets/replenishmentImg/delete-fff.png')" />
                    </template>
                </van-swipe-cell>
            </template>
            <div v-else class="empty-box">
                <img :src="require('@/assets/replenishmentImg/noneDate@2x.png')" />
                <p class="emptyTitle">暂无数据</p>
            </div>
        </div>
        <!-- 扫码补货 -->
        <div class="scanBoxHeight" v-if="!editFlag"></div>
        <div class="scanBox" v-if="!editFlag">
            <van-button class="scan-button" @click.prevent="codeScan()" :icon="require('@/assets/replenishmentImg/scan@2x.png')">{{ pageType === '2' ? '扫条形码盘货' : '扫条形码补货' }}</van-button>
            <van-button @click="reconfirm(pageType)" loading-type="spinner" :loading="isLock" :disabled="isLock">{{ pageType === '2' ? '盘货完成' : '补货完成' }}</van-button>
        </div>
        <van-popup v-model:show="popupShow" round position="bottom" closeable :close-icon="require('@/assets/close.png')">
            <template v-if="scanObj && popupShow">
                <div class="goods-info">
                    <van-image :src="scanObj.pictureUrl" />
                    <div class="content">
                        <div class="sku-name">{{ scanObj.skuName }}</div>
                        <div class="frozen-icon" v-if="scanObj.storageStyle === '冷冻品'"><img src="../../assets/frozen_icon.png" /></div>
                        <div class="barcode">{{ scanObj.barcode }}</div>
                        <div v-if="pageType === '2'" class="stock">
                            <span v-if="authorized.check('scan-inventory-show-stock')">盘前库存:{{ scanObj.stock || '--' }}</span
                            ><span>盘后库存:{{ !scanObj.quantity ? '--' : Number(scanObj.quantity) }}</span>
                        </div>
                        <div v-else class="stock">
                            <span>补前库存：{{ scanObj.stock || '--' }}</span
                            ><span>补后库存：{{ !scanObj.quantity ? '--' : Number(scanObj.stock) + Number(scanObj.quantity) }}</span>
                        </div>
                        <div class="price-box">
                            <span class="unit">¥</span>
                            <span class="sale-price">{{ scanObj.salePrice }}</span>
                        </div>
                        <div class="enter-quantity">
                            <div class="label">{{ pageType === '2' ? '盘货数量' : '补货数量' }}</div>
                            <div class="input-box">
                                <div class="flex-box" v-if="scanObj.quantity">
                                    <div>{{ scanObj.quantity }}</div>
                                    <div class="cursor-blink"></div>
                                </div>
                                <div class="flex-box colour--gray" v-else>
                                    <div class="cursor-blink"></div>
                                    <div>{{ pageType === '2' ? '请输入盘货数量' : '请输入补货数量' }}</div>
                                </div>
                                <span>件</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="scan-box">
                    <van-button class="scan-button" @click="hasFrozenTips(true)" :icon="require('@/assets/replenishmentImg/scan@2x.png')">保存并继续扫码</van-button>
                    <van-button @click="hasFrozenTips(false)">保存</van-button>
                </div>
                <van-number-keyboard v-model="scanObj.quantity" :show="true" extra-key="00" />
            </template>
        </van-popup>
        <van-dialog v-model:show="freezTipsDialog" title="提示" show-cancel-button @cancel="frozenSubmit" @confirm="frozenCancel" confirm-button-text="取消" cancel-button-text="继续操作">
            <div style="margin-top: 10px; text-align: center">带有“冷冻”标签的商品需在冷冻条件下存放，当前货柜非冷冻柜，不建议上架。</div>
            <div style="margin-top: 10px">
                <van-checkbox style="margin-left: 27%" v-model="openfrezonTips">15天内不再提示</van-checkbox>
            </div>
        </van-dialog>
    </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onActivated, computed } from 'vue'
import { Toast, Dialog } from 'vant'
import { useRoute } from 'vue-router'
import { skuDetail, equipmentGoodsList, scanning, inventory, getScanCodeInfo, queryGoodsList, opening, getFreezTips, checkFreezTips } from '@/api/scan/scan.js'
import { appBridge, registerhandler } from '@/utils/bridge.js'
import { isApp, getPicByMediaType, getTime } from '@/utils'
import { getAppStorageFn, setAppStorageFn } from '@/utils/storage'
import authorized from '@/utils/authorized'
import { newPage, closePage } from '@/utils/composables'
import { tracker } from '@/utils/tracker'
import arrowUp from '@/assets/replenishmentImg/arrow-up.png'
import arrowDown from '@/assets/replenishmentImg/arrow-down.png'
import arrowUpActive from '@/assets/replenishmentImg/arrow-up-active.png'
import arrowDownActive from '@/assets/replenishmentImg/arrow-down-active.png'

const route = useRoute()
// 页面级别参数
const deviceName = route.query.deviceName // 货柜名称
const deviceCode = route.query.deviceCode // 货柜编码
const pageType = route.query.pageType // 当前页面展示类型 1:补货 2：盘货 3：设备
const handleTag = route.query.handleTag
// const door_type = route.query.doorType
// const secondCabinetTypeName = route.query.secondCabinetTypeName // 区分是否为冷冻柜
// const secondCabinetTypeCode = route.query.secondCabinetTypeCode // 区分是否为冷冻柜
const popupShow = ref(false)
const startTime = getTime()

onMounted(async () => {
    await getList()
    await getModelCode()
    onActivatedFn()
})

onActivated(() => {
    if (!isApp) return onActivatedFn()
})

document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && isApp) {
        onActivatedFn()
    }
})

const stepperFocus = (item) => {
    if (item.total === 0) {
        item.totalFlag = item.total + ''
        item.total = ''
    }
}
const stepperBlur = (item) => {
    if (!item.total) {
        item.total = Number(item.totalFlag)
        item.totalFlag = null
    }
}

// 根据url参数看是否需要开门
const openDoor = async () => {
    const res = await opening({ counterUrl: deviceCode })
    await tracker({
        module: 'openDoor',
        subModule: 'openDoorApi',
        event: 'run_api',
        params: {
            click_time: new Date().valueOf(),
            deviceId: deviceCode,
            functionName: `${pageType === '2' ? '盘' : '补'}货(金刚位)`,
            pathname: window.location.href,
            visibilityState: document.visibilityState
        }
    })
    if (res.data.applyStatus === 3) newPage('/openFail')
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

// 排序部分 0 => 库存升 1 => 库存降 2 => 实补升 3 => 实补降 4 => 盘后升 5 => 盘后降
const memorySort = ref('')
const changeSort = (payload) => {
    if (payload === '01') {
        memorySort.value = memorySort.value === 0 ? 1 : 0
    } else if (payload === '23') {
        memorySort.value = memorySort.value === 2 ? 3 : 2
    } else if (payload === '45') {
        memorySort.value = memorySort.value === 4 ? 5 : 4
    }
    sortFn(memorySort.value)
}
const sortFn = (sortMode) => {
    const field = sortMode < 2 ? 'stock' : 'total'
    commodityList.value = qSort(JSON.parse(JSON.stringify(commodityList.value)), field, sortMode)
}
const qSort = (arr, field, sortMode) => {
    if (arr.length <= 1) {
        return arr
    }
    const mVal = arr.shift()
    const [left, right] = [[], []]
    arr.forEach((item) => ((sortMode % 2 === 0 ? item[field] < mVal[field] : item[field] > mVal[field]) ? left.push(item) : right.push(item)))
    return [...qSort(left, field, sortMode), mVal, ...qSort(right, field, sortMode)]
}

const editFlag = ref(false)
const isLock = ref(false)
// 拉取的商品列表
const commodityList = ref([])
const getList = async () => {
    const { code, list } = await equipmentGoodsList({
        containerCode: deviceCode,
        operateType: pageType === '3' ? '1' : pageType,
        pageNo: 1,
        pageSize: 100,
        doorType: route.query.doorType
    })
    if (code !== '200') return false
    if (handleTag && document.visibilityState === 'visible') openDoor()
    const dataList = list.map((item) => {
        item.total = ''
        item.oldTotal = ''
        item.oldSalePrice = item.salePrice
        item.goodsId = null
        item.pictureUrl = getPicByMediaType(item.goodsMediaList, 6)
        return item
    })
    commodityList.value = dataList
}

// 获取算法编码
const modelCode = ref(null)
// 门类型
const doorType = ref(null)
// 货柜类型
const secondCabinetTypeName = ref(null)
const secondCabinetTypeCode = ref(null)
const deviceKindType = ref(null)
// 温度带类型
const temperatureCode = ref(null)
const getModelCode = async () => {
    const { code, data } = await getScanCodeInfo({ deviceCode })
    if (code !== '200') return false
    modelCode.value = data.modelCode
    doorType.value = data.cabinetDoorList ? data.cabinetDoorList[0].doorType : null
    // temperatureType.value = data.cabinetAttr ? data.cabinetAttr.temperatureType : null
    temperatureCode.value = data.cabinetAttr ? data.cabinetAttr.temperatureCode : null
    secondCabinetTypeName.value = data.secondCabinetTypeName
    secondCabinetTypeCode.value = data.secondCabinetTypeCode
    deviceKindType.value = data.deviceKindType
}

const onActivatedFn = () => {
    editFlag.value = false
    getAppStorageFn('cartSelected', (val) => {
        if (!val) return false
        const storageList = JSON.parse(val)
        if (storageList.length < 1) return false
        const tempList = [...storageList, ...commodityList.value]
        const tempMap = new Map()
        tempList.map((item) => {
            if (!tempMap.has(item.barcode)) {
                tempMap.set(item.barcode, item)
            } else {
                const obj = tempMap.get(item.barcode)
                obj.total = pageType !== '2' ? Number(obj.total) + Number(item.total) : obj.total
                obj.salePrice = item.salePrice
                tempMap.set(item.barcode, obj)
            }
        })
        commodityList.value = Array.from(tempMap).map((item) => item[1])
        setAppStorageFn('cartSelected', [])
    })
}

// 全选
const selectAll = ref(false)

// 添加商品
const commodityCilik = () => {
    searchValue.value = ''
    memorySort.value = ''
    newPage(`/addItem?showNavbar=1&pageType=${pageType}&deviceCode=${deviceCode}&deviceName=${deviceName}&containerCodeData=${deviceCode}&modelCode=${modelCode.value}&secondCabinetTypeName=${secondCabinetTypeName.value}&doorType=${route.query.doorType}`, {
        pageType,
        deviceCode,
        deviceName,
        containerName: deviceName,
        containerCodeData: deviceCode,
        modelCode: modelCode.value,
        secondCabinetTypeName: secondCabinetTypeName.value,
        doorType: route.query.doorType
    })
}

// 修改
const fieldRef = ref([])
const modifyPrice = (value, index) => {
    value.select = !value.select
    nextTick(() => {
        fieldRef.value[index].focus()
    })
}
const checkPriceFn = (value, e) => {
    if (value.tempPrice) {
        e = value.tempPrice.match(/^\d*(\.?\d{0,2})/g)[0] || value.salePrice
        nextTick(() => {
            value.salePrice = e
            value.tempPrice = ''
        })
    }
    value.select = !value.select
}
// 退出管理
const signOut = () => {
    editFlag.value = false
    selectAll.value = false
    commodityList.value.forEach((item) => {
        item.checked = false
    })
}

// 盘货/补货提交前二次确认
const reconfirm = (type) => {
    Dialog.confirm({
        title: '确认提交？',
        message: '提交后将同步更新商品库存',
        confirmButtonColor: '#FE7E41',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        getContaniner: '.replenishment-list'
    }).then(() => {
        if (type === '2') return inventoryResults()
        complete()
    })
}
// 补货完成跳转页面
const complete = async () => {
    isLock.value = true
    const goodsList = []
    commodityList.value.forEach((item, index) => {
        if (!Number(item.salePrice)) {
            isLock.value = false
            Dialog.alert({
                message: `商品${item.skuName}未设置价格，请设置价格后提交`,
                confirmButtonColor: '#FE7E41',
                confirmButtonText: '知道了',
                getContaniner: '.replenishment-list'
            })
            throw new Error(`商品${item.skuName}未设置价格，请设置价格后提交`)
        }
        if (item.salePrice !== item.oldSalePrice || item.total !== 0) {
            const items = {
                skuId: item.skuId || null,
                oldPrice: item.oldSalePrice,
                price: item.salePrice,
                replenNumber: item.total,
                skuName: item.skuName,
                barcode: item.barcode,
                storageStyleCode: item.storageStyleCode,
                goodsId: item.goodsId
            }
            goodsList.push(items)
        }
    })
    if (goodsList.find((item) => item.price === '')) return Toast.fail('价格不能为空，请输入')
    // 兼容 如果删除的商品和后添加的商品为同一个 则移除删除列表
    const removeSkuids = JSON.parse(JSON.stringify(updataDeleteList.value))
    const deleteLength = removeSkuids.length
    if (deleteLength) {
        for (let i = deleteLength - 1; i >= 0; i--) {
            goodsList.map((item) => {
                if (item.barcode === removeSkuids[i]?.barcode) {
                    item.skuId = removeSkuids[i].skuId
                    removeSkuids.splice(i, 1)
                }
                return item
            })
        }
    }
    const params = {
        containerCode: deviceCode,
        goodsList,
        removeSkuids,
        startTime,
        temperatureType: temperatureCode.value,
        doorType: route.query.doorType || doorType.value,
        deviceKindType: deviceKindType.value,
        secondCabinetTypeCode: secondCabinetTypeCode.value,
        secondCabinetTypeName: secondCabinetTypeName.value
    }
    if (commodityList.value.length > 50) {
        Dialog.confirm({
            confirmButtonColor: '#FE7E41',
            message: `添加后，该货柜商品数量为${commodityList.value.length}个，大于50个商品会降低商品识别率以及识别速度，请确认是否继续添加？`,
            confirmButtonText: '取消',
            cancelButtonText: '继续添加',
            getContaniner: '.replenishment-list'
        })
            .then(() => {
                isLock.value = false
            })
            .catch(() => {
                scanningFn(params)
            })
    } else {
        scanningFn(params)
    }
}
const scanningFn = async (params) => {
    getAppStorageFn('trackerAct', async (val) => {
        if (!val) return false
        await tracker({
            module: 'restore',
            subModule: 'goodsPage',
            event: 'restoreDone_click',
            params: {
                act: val,
                click_time: new Date().valueOf(),
                functionName: '设备商品',
                deviceId: deviceCode,
                deviceName: deviceName,
                skuList: params.goodsList
            }
        })
    })
    const res = await scanning(params)
    isLock.value = false
    if (res.code === '200') {
        newPage(`/result?showNavbar=0&billNo=${res.data.billNo}&skuCount=${res.data.skuCount}&skuTypeCount=${res.data.skuTypeCount}&beforeSkuCount=${res.data.beforeSkuCount}&afterSkuCount=${res.data.afterSkuCount}`, {
            billNo: res.data.billNo,
            skuCount: res.data.skuCount,
            skuTypeCount: res.data.skuTypeCount,
            beforeSkuCount: res.data.beforeSkuCount,
            afterSkuCount: res.data.afterSkuCount
        })
    }
}

// 盘货完成
const inventoryResults = async () => {
    isLock.value = true
    const goodsList = []
    commodityList.value.forEach((item) => {
        if (item.salePrice !== item.oldSalePrice || item.total !== item.oldTotal || item.new) {
            const items = {
                skuId: item.skuId || null,
                replenNumber: item.total,
                skuName: item.skuName,
                barcode: item.barcode,
                storageStyleCode: item.storageStyleCode,
                price: item.salePrice,
                goodsId: item.goodsId
            }
            goodsList.push(items)
        }
    })
    if (goodsList.find((item) => item.oldTotal === 0)) return Toast.fail('实际库存不能为空，请输入')
    // 兼容 如果删除的商品和后添加的商品为同一个 则移除删除列表
    const removeSkuids = JSON.parse(JSON.stringify(updataDeleteList.value))
    const deleteLength = removeSkuids.length
    if (deleteLength) {
        for (let i = deleteLength - 1; i >= 0; i--) {
            goodsList.map((item) => {
                if (item.barcode === removeSkuids[i]?.barcode) {
                    item.skuId = removeSkuids[i].skuId
                    removeSkuids.splice(i, 1)
                }
                return item
            })
        }
    }
    const params = {
        containerCode: deviceCode,
        goodsList,
        removeSkuids,
        startTime,
        temperatureType: temperatureCode.value,
        doorType: route.query.doorType || doorType.value,
        deviceKindType: deviceKindType.value,
        secondCabinetTypeCode: secondCabinetTypeCode.value,
        secondCabinetTypeName: secondCabinetTypeName.value
    }
    if (commodityList.value.length > 50) {
        Dialog.confirm({
            confirmButtonColor: '#FE7E41',
            message: `添加后，该货柜商品数量为${commodityList.value.length}个，大于50个商品会降低商品识别率以及识别速度，请确认是否继续添加？`,
            confirmButtonText: '取消',
            cancelButtonText: '继续添加',
            getContaniner: '.replenishment-list'
        })
            .then(() => {
                isLock.value = false
            })
            .catch(() => {
                inventoryFn(params)
            })
    } else {
        inventoryFn(params)
    }
}

const inventoryFn = async (params) => {
    const res = await inventory(params)
    isLock.value = false
    if (res.code === '200') {
        const { billNo, skuTypeCount, beforeSkuCount, afterSkuCount } = res.data
        newPage(`/inventoryResults?showNavbar=0&billNo=${billNo}&skuTypeCount=${skuTypeCount}&beforeSkuCount=${beforeSkuCount}&afterSkuCount=${afterSkuCount}`, {
            billNo,
            skuTypeCount,
            beforeSkuCount,
            afterSkuCount
        })
    }
}
// 15天内是否展示冷冻柜提示弹窗
const freezTipsValue = ref(false)
// 是否展示冷冻柜提示弹窗
const freezTipsDialog = ref(false)
const openfrezonTips = ref(false)
// 判断是否提示冷冻柜弹窗
const queryFreezTips = async () => {
    const res = await getFreezTips({ freezTipsType: pageType === '2' ? 1 : 0 })
    freezTipsValue.value = res.data // true，不展示；false，展示
}
queryFreezTips()
// 点击保存，区分显示冷冻柜提示弹窗/不显示
const hasFrozenTips = (type) => {
    console.log('!freezTipsValue.value：' + !freezTipsValue.value)
    console.log(secondCabinetTypeName.value)
    console.log(secondCabinetTypeName.value.indexOf('冷冻柜') < 0)
    console.log(scanObj.value.storageStyle)
    console.log(scanObj.value.storageStyle === '冷冻品')
    if (!freezTipsValue.value && secondCabinetTypeName.value.indexOf('冷冻柜') < 0 && scanObj.value.storageStyle === '冷冻品') {
        freezTipsDialog.value = true
    } else {
        saveScanObj(type)
    }
}
// 冷冻柜提示-确定
const frozenSubmit = async (type) => {
    if (openfrezonTips.value) {
        freezTipsDialog.value = false
        checkTips()
        saveScanObj(type)
    } else {
        saveScanObj(type)
    }
}
// 冷冻柜提示-取消
const frozenCancel = async (type) => {
    console.log(openfrezonTips.value)
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
// 扫码补货/盘货
const codeScan = async () => {
    if (!isApp) return Toast('请在App中使用')
    searchValue.value = ''
    memorySort.value = ''
    // 扫商品补货码补货 埋点
    if (pageType !== '2') {
        getAppStorageFn('trackerAct', async (val) => {
            if (!val) return false
            await tracker({
                module: 'restore',
                subModule: 'goodsPage',
                event: 'scanCode_click',
                params: {
                    act: val,
                    click_time: new Date().valueOf(),
                    functionName: '设备商品',
                    deviceId: deviceCode,
                    deviceName: deviceName
                }
            })
        })
    }
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
            scanObj.value = commodityList.value.find((item) => {
                if (item.barcode === barcode) {
                    item.quantity = item.total + '' || ''
                    return item
                }
            })
            if (!scanObj.value) {
                const { object } = await skuDetail({ barcode, modelCode: modelCode.value })
                object.pictureUrl = getPicByMediaType(object.goodsMediaList, 6)
                object.skuName = object.goodsName
                object.salePrice = object.marketGuidePrice
                object.total = null
                object.stock = null
                object.quantity = ''
                console.log('新添加商品信息：')
                console.log(object)
                scanObj.value = object
            }
            popupShow.value = true
        } else if (res.code === '1001') {
            Dialog.confirm({
                confirmButtonColor: '#FE7E41',
                message: '该商品未添加到本地商品库，请添加后进行扫描',
                confirmButtonText: '我的商品库',
                cancelButtonText: '取消',
                getContaniner: '.replenishment-list'
            }).then(() => newPage('/myGoods?showNavbar=0', {}))
        } else {
            Dialog.confirm({
                confirmButtonColor: '#FE7E41',
                message: res.code === '1002' ? '无此商品，请点击“新品申请”新增商品并建模后进行扫描' : '商品未建模，请点击“新品申请”建模后进行扫描',
                confirmButtonText: '新品申请',
                cancelButtonText: '取消',
                getContaniner: '.replenishment-list'
            }).then(() => newPage('/apply-new-products?showNavbar=0', {}))
        }
    })
    appBridge('openScan', 1)
}

// 需要上报删除的skuId list
const updataDeleteList = ref([])
const deleteFn = (item) => {
    Dialog.confirm({
        confirmButtonColor: '#FE7E41',
        message: '确定删除所选商品？',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        getContaniner: '.replenishment-list'
    }).then(async () => {
        if (item) {
            item.checked = true
        }
        refuseConfirmn()
    })
}
// 确定删除
const refuseConfirmn = () => {
    commodityList.value.forEach((item) => {
        if (item.checked) {
            if (item.skuId) {
                updataDeleteList.value.push({
                    skuId: item.skuId,
                    skuName: item.skuName,
                    barcode: item.barcode
                })
                commodityList.value = commodityList.value.filter((goods) => goods.skuId !== item.skuId)
            } else {
                commodityList.value = commodityList.value.filter((goods) => goods.goodsId !== item.goodsId)
            }
        }
        item.checked = false
    })
    editFlag.value = false
}

// 多选框
const choose = () => {
    selectAll.value = !commodityListforPage.value.find((item) => !item.checked)
}
// 全选
const selectAllBox = ref('')
const checkAll = () => {
    selectAllBox.value = selectAll.value
    commodityListforPage.value.map((item) => (item.checked = selectAllBox.value))
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
.replenishment-list {
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
        .action-bar--right {
            width: max-content;
            .van-button {
                width: 168px;
                height: 62px;
                border-radius: 31px;
                border: 1px solid #fe7e41;
                box-sizing: border-box;
                font-size: 24px;
                font-weight: 500;
                color: #fe7e41;
                background: #ffffff;
                margin-left: 20px;
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
                .sort-box {
                    display: flex;
                    flex-direction: column;
                    margin-left: 8px;
                    .van-image {
                        width: 12px;
                        height: 8px;
                    }
                    .mrb6 {
                        margin-bottom: 6px;
                    }
                }
            }
            .label-1 {
                flex: 1;
            }
            .label-2 {
                width: 160px;
                justify-content: center;
            }
        }
    }
    .van-swipe-cell {
        :deep(.van-swipe-cell__right) {
            width: 160px;
            .van-button {
                height: 100%;
                border: initial;
                border-radius: initial;
                background: linear-gradient(180deg, #ff4f31 0%, #ff1e19 100%);
                .van-icon__image {
                    width: 40px;
                    height: 44px;
                }
            }
        }
        .cell-item {
            box-sizing: border-box;
            display: flex;
            align-items: flex-start;
            padding: 30px 30px 0 30px;
            .van-checkbox {
                width: 36px;
                height: 100px;
            }
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
                        // margin-top: 4px;
                        font-size: 22px;
                        font-weight: 400;
                        color: #999999;
                        line-height: 30px;
                    }
                    .stock {
                        font-size: 22px;
                        font-weight: 400;
                        color: #999999;
                        line-height: 30px;
                        margin-top: 6px;
                        display: flex;
                        align-items: center;
                        span {
                            margin-right: 12px;
                        }
                        div {
                            height: 22px;
                            margin-right: 12px;
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
                        .van-field {
                            padding: initial;
                            margin-left: 7px;
                            font-size: 32px;
                            font-weight: 500;
                            color: #191919;
                        }
                        :deep(.van-cell:after) {
                            left: 0;
                            right: 0;
                        }
                        .editBox {
                            width: 26px;
                            height: 26px;
                            margin-left: 14px;
                        }
                    }
                }
                .flex-right {
                    :deep(.van-stepper) {
                        .van-stepper__plus:before {
                            display: none;
                        }
                        .van-stepper__plus:after {
                            display: none;
                        }
                        .van-stepper__minus:before {
                            display: none;
                        }
                        .van-stepper__minus {
                            background: #ffffff;
                            width: 44px;
                            height: 44px;
                            border: 1px solid #f7f7f7;
                            border-right: none;
                            border-radius: 6px 0px 0 6px;
                            color: #222222;
                            font-size: 26px;
                            margin-top: 0px;
                            background: url('../../assets/replenishmentImg/reduce@2x.png') center no-repeat;
                            background-size: 17px 7px;
                            padding-left: 10px;
                        }
                        .van-stepper__input {
                            margin: 0px !important;
                            background: #ffffff;
                            width: 44px;
                            height: 44px;
                            border: 1px solid #f7f7f7;
                            margin-top: 3px;
                            font-size: 25px;
                            font-weight: 400;
                            color: #222222;
                        }
                        .van-stepper__plus {
                            background: #ffffff;
                            width: 44px;
                            height: 44px;
                            border: 1px solid #f7f7f7;
                            border-left: none;
                            border-radius: 0px 6px 6px 0px;
                            color: #222222;
                            font-size: 26px;
                            margin-top: -0px;
                            background: url('../../assets/replenishmentImg/plus@2x.png') center no-repeat;
                            background-size: 17px 17px;
                        }
                    }
                    .pedometerBox {
                        display: flex;
                        .reduceBox {
                            width: 48px;
                            height: 44px;
                            border-radius: 6px 0px 0px 6px;
                            background: #fff;
                            border: 1px solid #e0e0e0;
                            img {
                                width: 15px;
                                height: 6px;
                                margin-bottom: 8px;
                                margin-left: 5px;
                            }
                        }
                        .inputBox {
                            width: 63px;
                            height: 44px;
                            border-left: none;
                            border-right: none;
                            border-top: 1px solid #e0e0e0;
                            font-size: 26px;
                            font-weight: 400;
                            color: #0d0d0d;
                            border-bottom: 1px solid #e0e0e0;
                            text-align: center;
                            border-radius: initial;
                            box-sizing: border-box;
                        }
                        .plusBox {
                            width: 48px;
                            height: 44px;
                            border-radius: 0px 6px 6px 0px;
                            background: #fff;
                            border: 1px solid #e0e0e0;
                            img {
                                width: 15px;
                                height: 15px;
                                margin-bottom: 3px;
                            }
                        }
                    }
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
        padding-bottom: 20px;
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
    :deep(.van-checkbox__icon) {
        .van-icon {
            line-height: 32px;
            font-size: 25px;
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
