<template>
    <div class="content">
        <div class="container-box">
            <div class="checkall-box">
                <van-checkbox v-if="containerList.length > 0" v-model="selectAll" @click="checkAll" checked-color="#FE7E41">所有货柜</van-checkbox>
            </div>
            <div
                class="container-list"
                v-if="containerList.length"
            >
                <van-list
                    v-model:loading="loading"
                    :finished="finished"
                    :finished-text="finishedText"
                    @load="onLoad"
                    :immediate-check="false"
                >
                    <div
                        v-for="(item, index) in containerList"
                        :key="index"
                        class="container-item"
                    >
                        <van-checkbox
                            v-model="item.checked"
                            :disabled="(!!item.addDeviceTag && item.deviceType!==20) || (!!item.leftAddDeviceTag && !!item.rightAddDeviceTag && item.deviceType==20)"
                            class="checkbox-item"
                            checked-color="#FE7E41"
                            @click="choose(item,'货柜')"
                        >
                            <template
                                #icon="props"
                                v-if="(item.deviceType!==20&&!!item.addDeviceTag)||(!!item.leftAddDeviceTag && !!item.rightAddDeviceTag && item.deviceType==20)"
                            >
                                <img
                                    class="img-icon"
                                    :src="props.disabled ? disabledCheckBox : ''"
                                />
                            </template>
                        </van-checkbox>
                        <img src="@/assets/shop.png" class="container-img" />
                        <div class="container-info">
                            <div class="flex-box">
                                <div class="flex-left">
                                    <div class="device-name">{{ item.deviceName }}</div>
                                    <div>
                                        <span class="model" :class="[{ 'model-type1': index % 3 === 0 }, { 'model-type2': index % 3 === 1 }, { 'model-type3': index % 3 === 2 }]">
                                            {{ arithmeticKeyValue[item.arithmetic] }}
                                        </span>
                                        <span class="model model-frozen" v-if="item.secondCabinetTypeName">
                                            {{ item.secondCabinetTypeName }}
                                        </span>
                                    </div>
                                    <div class="device-code">{{ item.deviceCode }}</div>
                                </div>
                                <div class="flex-right" :class="item.addDeviceTag ? '' : 'active'">{{ item.addDeviceTag ? '已添加' : '未添加' }}</div>
                            </div>
                        </div>
                        <div class="container-check" v-if="item.deviceType == 20">
                            <div class="container-check-box">
                                <van-checkbox v-model="item.checkedLeftDoor" :disabled="!!item.leftAddDeviceTag" class="checkbox-item" checked-color="#FE7E41" @click="choose(item, '左门')">
                                    <template #icon="props" v-if="item.leftAddDeviceTag">
                                        <img class="img-icon" :src="props.disabled ? disabledCheckBox : ''" />
                                    </template>
                                </van-checkbox>
                                <div class="text">{{ item.leftAddDeviceTag ? '左门（已添加)' : '左门' }}</div>
                            </div>
                            <div class="container-line"></div>
                            <div class="container-check-box">
                                <van-checkbox v-model="item.checkedRightDoor" :disabled="!!item.rightAddDeviceTag" class="checkbox-item" checked-color="#FE7E41" @click="choose(item, '右门')">
                                    <template #icon="props" v-if="item.rightAddDeviceTag">
                                        <img class="img-icon" :src="props.disabled ? disabledCheckBox : ''" />
                                    </template>
                                </van-checkbox>
                                <div class="text">{{ item.rightAddDeviceTag ? '右门（已添加)' : '右门' }}</div>
                            </div>
                        </div>
                    </div>
                </van-list>
            </div>
            <div class="empty" v-else>
                <img src="../../assets/empty@2x.png" />
                <span class="no-data">暂无数据</span>
            </div>
        </div>
        <div class="bottom" v-if="containerList.length > 0">
            <span class="btn" @click="hasFrozenTips">确定</span>
        </div>
        <!-- 添加到货柜 -->
        <van-dialog :show="confirmPopupVisiable" class="confirm-popup-info">
            <template v-slot:title>
                <span class="confirm-popup-info-title">提示</span>
            </template>
            <template v-slot:default>
                <span class="confirm-popup-info-content">
                    {{ popupInfo.content }}
                </span>
            </template>
            <template v-slot:footer>
                <span class="confirm-popup-info-handle" @click="popupClear">{{ popupInfo.clearText }}</span>
                <span class="confirm-popup-info-handle handle-active" @click="popupSubmit">{{ popupInfo.suerText }}</span>
            </template>
        </van-dialog>
        <van-dialog v-model:show="freezTipsDialog" title="提示" show-cancel-button @cancel="frozenSubmit" @confirm="frozenCancel" confirm-button-text="取消" cancel-button-text="继续操作">
            <div style="margin-top: 10px; text-align: center">带有“冷冻”标签的商品需在冷冻条件下存放，当前货柜非冷冻柜，不建议上架。</div>
            <div style="margin-top: 10px">
                <van-checkbox style="margin-left: 27%; margin-bottom: 15px" v-model="openfrezonTips">15天内不再提示</van-checkbox>
            </div>
        </van-dialog>
    </div>
</template>

<script setup>
import { nextTick } from 'process'
import { ref, reactive, onBeforeMount } from 'vue'
import { Toast, Dialog } from 'vant'
import { useRoute } from 'vue-router'
import { queryDeviceList, operateGoods, addGoodsV3 } from '@/api/goods-library'
import { getFreezTips, checkFreezTips } from '@/api/scan/scan.js'
import disabledCheckBox from '@/assets/disabled-check-box.png'
import { closePage, newPage } from '@/utils/composables'
import { appBridge } from '@/utils/bridge'
const route = useRoute()
const containerList = ref([])
const secondChannelList = ref([]) // 选中货柜的name，code
const checkID = ref([]) // 获取选中的ID
const finishedText = ref('') // 没有更多数据提示
const selectAll = ref(false)
const loading = ref(false)
const finished = ref(false)
const confirmPopupVisiable = ref(false)
const goodsName = route.query.goodsName
const goodsId = route.query.goodsId
const guideSalePrice = route.query.guideSalePrice
const modelCodes = route.query.modelCodes
const storageStyle = route.query.storageStyle // 是否冷冻品
const storageStyleCode = route.query.storageStyleCode // 是否冷冻品
const operateGoodsTag = route.query.operateGoodsTag // 下架商品 上架并同步到指定货柜
const hasFrozenContainer = ref(false)

// 判断是否存在未建模算法
// const hasNotModel = ref(false)
const hasnotModelText = ref([])

const arithmeticKeyValue = {
    1: '自研视觉柜',
    2: '旷视',
    3: '嗨便利视觉柜'
    // 4: '旷世视觉柜'
}
// 提示弹窗内容
const popupInfo = ref({
    type: '',
    content: '',
    clearText: '',
    suerText: ''
})

const pageInfo = reactive({
    pageNo: 1,
    pageSize: 10
})

onBeforeMount(() => {
    onLoad()
})
// 加载列表数据
const onLoad = async () => {
    loading.value = true
    const params = {
        pageNum: pageInfo.pageNo,
        pageSize: pageInfo.pageSize,
        operateType: 3,
        goodsId: goodsId
    }
    const res = await queryDeviceList(params)
    if (res.code === '200') {
        containerList.value = pageInfo.pageNo === 1 ? res.data.list : [...containerList.value, ...res.data.list]
        // 数据全部加载完成
        if (res.data.list.length < pageInfo.pageSize) finished.value = true
        if (containerList.value.length > 0 && pageInfo.pageNo > 1) {
            finishedText.value = '没有更多了'
        } else {
            finishedText.value = ''
        }
        pageInfo.pageNo++
        loading.value = false
    }
}
const filterArray = (secondChannelId, thirdChannelId, array) => {
    return array.filter(function (item) {
        return !(secondChannelId === item.secondChannelId && thirdChannelId === item.thirdChannelId)
    })
}
const filterCode = (code, array) => {
    return array.filter(function (item) {
        return !(code === item)
    })
}
// 全选
const checkAll = () => {
    const status = selectAll.value
    checkID.value = [] // 判断选中货柜数与总数是否一致，全选能否在选中状态
    secondChannelList.value = []
    hasnotModelText.value = [] // 不符合的算法集合
    hasFrozenContainer.value = true
    if (status) {
        containerList.value.forEach((item) => {
            if (item.secondCabinetTypeName.indexOf('冷藏') > -1) {
                hasFrozenContainer.value = false
            }
            if (!modelCodes || modelCodes.indexOf(item.arithmetic) < 0) {
                // Toast(`该商品未在${item.deviceName}建模，请联系运营经理建模`)
                // hasNotModel.value = true
                hasnotModelText.value.push(item.deviceName)
                item.checked = false
                // return item
            } else {
                // hasNotModel.value = false
                if (item.deviceType === 20) {
                    if (!item.leftAddDeviceTag || !item.rightAddDeviceTag) {
                        item.checked = status
                        if (!item.leftAddDeviceTag) {
                            item.checkedLeftDoor = !item.leftAddDeviceTag ? status : ''
                            secondChannelList.value.push(objParams(item, 'left'))
                        }
                        if (!item.rightAddDeviceTag) {
                            item.checkedRightDoor = !item.rightAddDeviceTag ? status : ''
                            secondChannelList.value.push(objParams(item, 'right'))
                        }
                        checkID.value.push(item.deviceCode)
                    }
                } else {
                    if (!item.addDeviceTag) {
                        secondChannelList.value.push(objParams(item, 'single'))
                        item.checked = status
                        checkID.value.push(item.deviceCode)
                    }
                }

                // return item
            }
            if (hasnotModelText.value.length !== 0) {
                Toast(`该商品未在${hasnotModelText.value}建模，请联系运营经理建模`)
            }
        })
    } else {
        containerList.value.forEach(item => {
            item.checked = !item.addDeviceTag ? status : ''
            item.checkedLeftDoor = !item.leftAddDeviceTag ? status : ''
            item.checkedRightDoor = !item.rightAddDeviceTag ? status : ''
            // return item
        })
        checkID.value = []
        secondChannelList.value = []
    }

    if (checkID.value.length === containerList.value.length) {
        selectAll.value = true
    } else {
        selectAll.value = false
    }
    console.log(secondChannelList.value)
}
const objParams = (item, type) => {
    return {
        secondChannelId: item.deviceCode,
        secondChannelName: item.deviceName,
        thirdChannelId: type === 'single' ? '0' : type === 'left' ? '1' : type === 'right' ? '2' : '',
        thirdChannelName: type === 'single' ? '单门' : type === 'left' ? '左门' : type === 'right' ? '右门' : '',
        deviceTypeName: item.deviceKindName,
        deviceTypeCode: item.deviceKindType
    }
}

// 多选框
const choose = (item, type) => {
    hasFrozenContainer.value = true
    if (item.secondCabinetTypeName.indexOf('冷藏') > -1) {
        hasFrozenContainer.value = false
    }
    if (!modelCodes || modelCodes.indexOf(item.arithmetic) < 0) {
        Toast(`该商品未在${item.deviceName}建模，请联系运营经理建模`)
        // hasNotModel.value = true
        // hasnotModelText.value.push(item.deviceName)
        item.checked = false
        item.checkedLeftDoor = false
        item.checkedRightDoor = false
    } else {
        // hasNotModel.value = false
        if (item.deviceType === 20) {
            // 先判断是否是单开门
            if (type === '货柜') {
                if (item.checked) {
                    if (!item.leftAddDeviceTag && !item.checkedLeftDoor) {
                        item.checkedLeftDoor = true
                        secondChannelList.value.push(objParams(item, 'left'))
                    }
                    if (!item.rightAddDeviceTag && !item.checkedRightDoor) {
                        item.checkedRightDoor = true
                        secondChannelList.value.push(objParams(item, 'right'))
                    }
                    if (checkID.value.indexOf(item.deviceCode) === -1) {
                        checkID.value.push(item.deviceCode)
                    }
                } else {
                    if (!item.leftAddDeviceTag) {
                        item.checkedLeftDoor = false
                        secondChannelList.value = filterArray(item.deviceCode, '1', secondChannelList.value)
                    }
                    if (!item.rightAddDeviceTag) {
                        item.checkedRightDoor = false
                        secondChannelList.value = filterArray(item.deviceCode, '2', secondChannelList.value)
                    }
                    checkID.value = filterCode(item.deviceCode, checkID.value)
                }
            } else {
                if (type === '左门' && !item.leftAddDeviceTag) {
                    if (item.checkedLeftDoor) {
                        secondChannelList.value.push(objParams(item, 'left'))
                    } else {
                        secondChannelList.value = filterArray(item.deviceCode, '1', secondChannelList.value)
                    }
                } else if (type === '右门' && !item.rightAddDeviceTag) {
                    if (item.checkedRightDoor) {
                        secondChannelList.value.push(objParams(item, 'right'))
                    } else {
                        secondChannelList.value = filterArray(item.deviceCode, '2', secondChannelList.value)
                    }
                }
                if ((!item.leftAddDeviceTag && item.checkedLeftDoor && !item.rightAddDeviceTag && item.checkedRightDoor) || (!item.leftAddDeviceTag && item.checkedLeftDoor && item.rightAddDeviceTag) || (item.leftAddDeviceTag && !item.rightAddDeviceTag && item.checkedRightDoor)) {
                    item.checked = true
                    if (checkID.value.indexOf(item.deviceCode) === -1) {
                        checkID.value.push(item.deviceCode)
                    }
                } else {
                    item.checked = false
                    checkID.value = filterCode(item.deviceCode, checkID.value)
                }
            }
        } else {
            if (item.checked) {
                checkID.value.push(item.deviceCode)
                secondChannelList.value.push(objParams(item, 'single'))
            } else {
                checkID.value = filterCode(item.deviceCode, checkID.value)
                secondChannelList.value = filterArray(item.deviceCode, '0', secondChannelList.value)
            }
        }

        // secondChannelList.value = []
        // hasnotModelText.value = []

        // containerList.value.forEach(item => {
        //     if (item.checked === true) {
        //         checkID.value.push(item.deviceCode)
        //         secondChannelList.value.push({
        //             secondChannelId: item.deviceCode,
        //             secondChannelName: item.deviceName
        //         })
        //     }
        // })

        if (checkID.value.length === containerList.value.length) {
            selectAll.value = true
        } else {
            selectAll.value = false
        }
    }
}

// 提交操作
const submit = () => {
    console.log(secondChannelList.value)
    if (secondChannelList.value.length === 0) {
        Toast('请选择')
        return
    }
    popupInfo.value = {
        type: 'confirm',
        content: `确认添加“${goodsName}”到所选货柜？`,
        clearText: '取消',
        suerText: '确定'
    }
    nextTick(() => {
        confirmPopupVisiable.value = true
    })
}

// 提示弹窗-取消
const popupClear = () => {
    confirmPopupVisiable.value = false
}

// 提示弹窗-确认
const popupSubmit = async () => {
    confirmPopupVisiable.value = false
    // if (hasNotModel.value) {
    //     Toast(`该商品未在${hasnotModelText.value}建模，请联系运营经理建模`)
    // } else
    if (operateGoodsTag) {
        const params = {
            goodsId,
            goodsStatus: 4,
            guideSalePrice,
            storageStyleCode,
            secondChannelList: secondChannelList.value
        }
        const res = await operateGoods(params)
        if (res.code === '200') {
            // setTimeout(() => {
            //     Toast(res.msg)
            // })
            checkID.value = []
            finished.value = false
            pageInfo.pageNo = 1
            selectAll.value = false
            Dialog.confirm({
                title: '提示',
                message: `已添加“${goodsName}”到所选货柜`,
                confirmButtonText: '继续上架商品',
                cancelButtonText: '回首页',
                confirmButtonColor: '#FE7E41',
                cancelButtonColor: '#000000'
            })
                .then(() => {
                    if (route.query.putOn === 'true') {
                        newPage('/myGoods/not-on?showNavbar=0')
                    } else {
                        closePage()
                    }
                })
                .catch(() => {
                    appBridge('goHome')
                })
        }
    } else {
        const params = {
            goodsId,
            guideSalePrice,
            channelList: secondChannelList.value,
            storageStyleCode
        }
        const res = await addGoodsV3(params)
        if (res.code === '200') {
            Toast(res.msg)
            checkID.value = []
            finished.value = false
            pageInfo.pageNo = 1
            selectAll.value = false
            onLoad()
        }
    }
}
// 15天内是否展示冷冻柜提示弹窗
const freezTipsValue = ref(false)
// 是否展示冷冻柜提示弹窗
const freezTipsDialog = ref(false)
const openfrezonTips = ref(false)
// 判断是否提示冷冻柜弹窗
const queryFreezTips = async () => {
    const res = await getFreezTips({ freezTipsType: 2 })
    freezTipsValue.value = res.data // true，不展示；false，展示
}
queryFreezTips()
// 点击保存，区分显示冷冻柜提示弹窗/不显示
const hasFrozenTips = () => {
    if (secondChannelList.value.length === 0) {
        console.log(secondChannelList.value)
        Toast('请选择')
        return
    }
    console.log(!freezTipsValue.value)
    console.log(storageStyle)
    if (!freezTipsValue.value && storageStyle === '冷冻品' && !hasFrozenContainer.value) {
        freezTipsDialog.value = true
    } else {
        submit()
    }
}
// 冷冻柜提示-确定
const frozenSubmit = async (type) => {
    if (openfrezonTips.value) {
        freezTipsDialog.value = false
        checkTips()
        submit()
    } else {
        submit()
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
    const res = await checkFreezTips({ freezTipsType: 2 })
    if (res.code === '200') {
        freezTipsValue.value = true
    }
}
</script>
<style lang="scss" scoped>
.root {
    //background: #fff;
}
.content {
    //background: #fff;
    padding-top: 20px;
    :deep(.van-checkbox) {
        .van-checkbox__label {
            font-size: 30px;
        }
        .van-checkbox__icon--round .van-icon {
            width: 36px;
            height: 36px;
        }
        .img-icon {
            width: 36px;
            height: 36px;
        }
    }

    .container-box {
        margin-bottom: 150px;
    }
    .checkall-box {
        padding: 32px 30px;
        background: #fff;
    }
    .container-list {
        .container-item {
            padding: 40px 30px;
            border-top: 1px solid #f4f5f5;
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
            margin-bottom: 20px;
            background: #fff;
            .checkbox-item {
                width: 40px;
                height: 100px;
            }
            .container-img {
                width: 100px;
                height: 100px;
                margin-left: 30px;
                border-radius: 8px;
            }
            .container-info {
                width: 0;
                flex: 1;
                margin-left: 16px;
                .flex-box {
                    display: flex;
                    justify-content: space-between;
                    .flex-left {
                        .device-name {
                            font-size: 30px;
                            font-weight: 500;
                            color: #222222;
                            line-height: 36px;
                            margin-bottom: 10px;
                        }
                        .model {
                            width: max-content;
                            border-radius: 4px;
                            font-size: 20px;
                            font-weight: 500;
                            padding: 4px 8px;
                        }
                        .model-type1 {
                            color: #328eed;
                            background: rgba($color: #328eed, $alpha: 0.1);
                        }
                        .model-type2 {
                            color: #46cd60;
                            background: rgba($color: #46cd60, $alpha: 0.1);
                        }
                        .model-type3 {
                            color: #f8ac3d;
                            background: rgba($color: #f8ac3d, $alpha: 0.1);
                        }
                        .model-frozen {
                            color: #d8d8d8;
                            background: rgba($color: #d8d8d8, $alpha: 0.1);
                        }
                        .device-code {
                            font-size: 22px;
                            font-weight: 400;
                            color: #b0b0b0;
                            margin-top: 10px;
                        }
                    }
                    .flex-right {
                        font-size: 24px;
                        font-weight: 400;
                        color: #b0b0b0;
                    }
                    .active {
                        color: #fe7e41;
                    }
                }
            }
            .container-check {
                margin-top: 32px;
                border-top: 1px solid #f4f5f5;
                width: 100%;
                display: flex;
                align-items: center;
                .container-line {
                    width: 1px;
                    height: 80px;
                    background: #f4f5f5;
                }
                .container-check-box {
                    display: flex;
                    align-items: center;
                    flex: 1;
                    justify-content: center;
                    .text {
                        font-size: 13px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #b0b0b0;
                        line-height: 18px;
                    }
                }
            }
        }
    }
    .empty {
        height: 100vh;
        text-align: center;
        img {
            width: 64%;
        }
        .no-data {
            display: block;
            font-size: 30px;
            color: #888;
        }
    }
    .bottom {
        position: fixed;
        bottom: 56px;
        padding: 0 60px;
        width: calc(100vw - 110px);
        .btn {
            display: inline-block;
            width: 100%;
            height: 92px;
            line-height: 92px;
            background: #fe7e41;
            border-radius: 46px;
            text-align: center;
            color: #fff;
            font-size: 30px;
        }
    }
    .confirm-popup-info {
        .confirm-popup-info-title {
            display: block;
            font-size: 36px;
            color: #000;
            text-align: center;
            padding-bottom: 24px;
        }
        .confirm-popup-info-content {
            font-size: 30px;
            padding: 0 40px 24px;
            color: #696969;
            text-align: center;
            display: block;
        }
        .confirm-popup-info-handle {
            display: inline-block;
            width: 49%;
            height: 100px;
            color: #2e2e4d;
            line-height: 100px;
            font-size: 36px;
            text-align: center;
            border-top: 1px solid #ededed;
            margin-top: 12px;
        }
        .handle-active {
            color: #fe7e41;
            border-left: 1px solid #ededed;
        }
    }
}
.van-checkbox__icon--round .van-icon {
    margin-top: 3px;
    width: 36px;
    height: 33px;
}
.van-checkbox__icon .van-icon {
    line-height: 32px;
    font-size: 25px;
}
</style>
