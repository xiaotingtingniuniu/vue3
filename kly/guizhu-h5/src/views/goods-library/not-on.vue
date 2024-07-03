<template>
    <div class="not-on-goods-box">
        <div class="search-data">
            <form action="/" class="inputBox">
                <van-search v-model="searchValue" placeholder="请输入商品名称或条形码搜索" @blur="reload" :clearable="false" shape="round">
                    <template #left-icon>
                        <div class="icon--unselect">
                            <van-icon size="1em" :name="require('@/assets/search2.png')" />
                        </div>
                    </template>
                </van-search>
                <img src="../../assets/replenishmentImg/grey@2x.png" alt="" class="sweepImg" @click.stop="sweepOne">
            </form>
        </div>
        <div class="goods-list">
            <div class="algorithm-type-box">
                <span @click="showPopup" class="algorithm-type-choose">
                    {{algorithmType}}
                    <img class="corner" src="@/assets/corner-right-bottom.png" alt="">
                </span>
            </div>
            <van-list v-model:loading="loading" :finished="finished" :finished-text="finishedText" @load="onLoad" :immediate-check="false">
                <div v-for="(item, index) in goodsLists" :key="index">
                    <div class="goods-item">
                        <img src="@/assets/small-spec-icon.png" class="small-spec-icon" v-if="item.isSmallSpec">
                        <img v-if="item.mediaUrl" :src="item.mediaUrl" alt="" class="goods-img">
                        <img v-if="!item.mediaUrl" src="@/assets/img-error.png" alt="" class="goods-img">
                        <div class="goods-info">
                            <span class="info-text info-title">{{item.goodsName}}</span>
                            <span class="info-text info-model">
                                <span v-for="(modelItem, modelIndex) in item.modelList" :key="modelIndex" :class="[{'model-type1': modelIndex%3 === 0}, {'model-type2': modelIndex%3 === 1}, {'model-type3': modelIndex%3 === 2}]">
                                    {{modelItem.modelName}}
                                </span>
                                <span class="frozen-icon" v-if="item.storageStyle === '冷冻品'">
                                    <img src="../../assets/frozen_icon.png">
                                </span>
                            </span>
                            <span class="info-text info-order">{{item.barcode}}</span>
                            <span class="info-text info-amount"><span style="font-size: 11px">￥</span>{{item.guideSalePrice}}</span>
                        </div>
                        <div class="goods-handle">
                            <span class="handle-btn edit" v-if="authorized.check('good-stock-edit')" @click="editGoods(item)">编辑</span>
                            <span class="handle-btn shelves" @click="handleUp(item)">上架</span>
                            <span class="handle-btn del" @click="handleDel(item)">删除</span>
                        </div>
                    </div>
                    <div class="divider"></div>
                </div>
            </van-list>
            <div class="empty" v-if="goodsLists.length === 0">
                <img src="../../assets/empty@2x.png">
                <span class="no-data">{{ emptyText }}</span>
                <div class="tips-box">
                    <span>温馨提示：</span>请您核对输入框中的商品条形码是否正确。如若有误，请修改或重新扫描。
                </div>
            </div>
        </div>
        <van-popup v-model:show="algorithmTypeVisiable" position="bottom" class="popup-container" :close-on-click-overlay="true">
            <span :class="['container-item', {'container-item-active' :algorithmCode === ''}]" @click="chooseAlgorithmType({modeCode: '', modeName: '全部算法'})">
                全部算法
            </span>
            <span v-for="(item, index) in containerList" :key="index" :class="['container-item', {'container-item-active' :algorithmCode === item.modeCode}]" @click="chooseAlgorithmType(item)">
                {{item.modeName}}
            </span>
        </van-popup>
        <!-- confirm弹窗 -->
        <van-dialog :show="confirmPopupVisiable" class="confirm-popup-info">
            <template v-slot:title>
                <span class="confirm-popup-info-title">提示</span>
            </template>
            <template v-slot:default>
                <span class="confirm-popup-info-content">
                    {{popupInfo.content}}
                </span>
            </template>
            <template v-slot:footer>
                <span class="confirm-popup-info-handle" @click="popupClear">{{popupInfo.clearText}}</span>
                <span class="confirm-popup-info-handle handle-active" @click="popupDel">{{popupInfo.suerText}}</span>
            </template>
        </van-dialog>
        <!-- 上架操作 -->
        <van-dialog :show="multipleHandlePopVisiable" class="multiple-handle-dialog">
            <template v-slot:default>
                <span v-if="popData?.goodsName" class="multiple-handle-dialog-content">您正在操作上架“{{ popData.goodsName }}”，是否同步添加到货柜商品库？</span>
            </template>
            <template v-slot:footer>
                <span class="multiple-handle-dialog-handle handle-active" @click="updateTogether(popData)">同步添加到货柜</span>
                <span class="multiple-handle-dialog-handle" @click="update">仅上架到我的商品库</span>
                <span class="multiple-handle-dialog-handle" @click="multipleHandleClear">取消</span>
            </template>
        </van-dialog>
    </div>
</template>
<script setup>
import { nextTick } from 'process'
import { ref, reactive, onBeforeMount } from 'vue'
import { Toast, Dialog } from 'vant'
import { appBridge, registerhandler } from '@/utils/bridge.js'
import { queryGoodsList, queryDeviceTypeList, operateGoods, delGoods } from '@/api/goods-library'
import { newPage } from '@/utils/composables'
import authorized from '@/utils/authorized'

const goodsLists = ref([])
const algorithmCode = ref('')
const algorithmType = ref('算法类型')
const emptyText = ref('暂无数据')
const finishedText = ref('') // 没有更多数据提示
const algorithmTypeVisiable = ref(false)
const confirmPopupVisiable = ref(false)
const multipleHandlePopVisiable = ref(false)
const loading = ref(false)
const finished = ref(false)
const goodsId = ref('')
const storageStyleCode = ref('')

onBeforeMount(() => {
    onLoad()
})

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
// 搜索
const searchValue = ref('')
// 算法对应的柜子类型
const containerList = ref([])
// 已上架
const notOnList = ref([])
const onLoad = async () => {
    loading.value = true
    const params = {
        goodsNameBarcode: searchValue.value,
        modelCode: algorithmCode.value,
        goodsStatus: 6,
        pageNo: pageInfo.pageNo,
        pageSize: pageInfo.pageSize
    }
    const res = await queryGoodsList(params)
    loading.value = false
    if (res.code === '200') {
        if (pageInfo.pageNo === 1) {
            notOnList.value = res.data.list
        } else {
            notOnList.value = notOnList.value.concat(res.data.list)
        }
        notOnList.value.forEach((item) => {
            item.goodsMediaList && item.goodsMediaList.forEach((mediaItem) => {
                if (mediaItem.mediaType === 6) {
                    item.mediaUrl = mediaItem.mediaUrl
                }
            })
        })
        if (notOnList.value.length > 0 && pageInfo.pageNo > 1) {
            finishedText.value = '没有更多了'
        } else {
            finishedText.value = ''
        }
        if (notOnList.value.length === 0) {
            emptyText.value = '没有查询结果，请添加商品到“我的商品库”或在“已上架”中查看'
        }
        pageInfo.pageNo++
        // 数据全部加载完成
        if (notOnList.value.length >= res.data.total) {
            finished.value = true
        }
        goodsLists.value = notOnList.value
    } else {
        finished.value = true
    }
}

// 扫一扫
const sweepOne = () => {
    registerhandler('setScanResult', res => {
        searchValue.value = res
        reload()
    })
    loading.value = true
    appBridge('openScan', 1)
}
// 展示货柜类型
const showPopup = () => {
    algorithmTypeVisiable.value = true
}
// 选择算法类型
const chooseAlgorithmType = (item) => {
    algorithmCode.value = item.modeCode
    algorithmType.value = item.modeName
    algorithmTypeVisiable.value = false
    reload()
}
// 编辑商品
const editGoods = (goods, putOn = false) => {
    const modelCodes = []
    goods.modelList.map(goods => {
        modelCodes.push(goods.modelCode)
    })
    // newPage(`/goodsToContainer?goodsName=${goods.goodsName}&goodsId=${goods.goodsId}&guideSalePrice=${goods.guideSalePrice}&modelCodes=${modelCodes}&operateGoodsTag=1`, {
    //     goodsName: goods.goodsName,
    //     goodsId: goods.goodsId,
    //     guideSalePrice: goods.guideSalePrice,
    //     modelCodes: modelCodes.join(),
    //     operateGoodsTag: 1
    // })
    newPage(`/goodsEdit?goodsId=${goods.goodsId}&putOn=${putOn}&goodsName=${goods.goodsName}&guideSalePrice=${goods.guideSalePrice}&modelCodes=${modelCodes}&operateGoodsTag=1`, {
        goodsId: goods.goodsId,
        putOn,
        goodsName: goods.goodsName,
        guideSalePrice: goods.guideSalePrice,
        modelCodes: modelCodes.join(),
        operateGoodsTag: 1
    })
}
// 删除商品-btn
const handleDel = (item) => {
    goodsId.value = item.goodsId
    popupInfo.value = {
        type: 'del',
        content: `确认删除${item.goodsName}?`,
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
    const params = {
        goodsId: goodsId.value,
        storageStyleCode: storageStyleCode.value,
        goodsStatus: 4
    }
    const res = await operateGoods(params)
    if (res.code === '200') {
        Toast(res.msg)
        reload()
    }
}
// 删除
const popupDel = async () => {
    confirmPopupVisiable.value = false
    const params = {
        goodsId: goodsId.value
    }
    const res = await delGoods(params)
    if (res.code === '200') {
        Toast(res.msg)
        reload()
    }
}

const popData = ref(null)
// 上架操作
const handleUp = (goods) => {
    if (!Number(goods.guideSalePrice)) {
        Dialog.confirm({
            message: '此商品未设置价格，请设置价格后操作添加到货柜',
            messageAlign: 'center',
            cancelButtonText: '取消',
            confirmButtonText: '设置价格',
            confirmButtonColor: '#FE7E41',
            cancelButtonColor: '#000000'
        }).then(() => {
            editGoods(goods, true)
        })
    } else {
        goodsId.value = goods.goodsId
        storageStyleCode.value = goods.storageStyleCode
        popData.value = goods
        multipleHandlePopVisiable.value = true
    }
}
// 同步添加货柜
const updateTogether = (goods) => {
    multipleHandlePopVisiable.value = false
    // popupSubmit()
    addToContainer(goods)
}
const addToContainer = (goods) => {
    const modelCodes = []
    goods.modelList.map(goods => {
        modelCodes.push(goods.modelCode)
    })
    newPage(`/goodsToContainer?goodsName=${goods.goodsName}&goodsId=${goods.goodsId}&guideSalePrice=${goods.guideSalePrice}&modelCodes=${modelCodes}&operateGoodsTag=1&storageStyle=${goods.storageStyle}&storageStyleCode=${goods.storageStyleCode}`, {
        goodsName: goods.goodsName,
        goodsId: goods.goodsId,
        guideSalePrice: goods.guideSalePrice,
        storageStyle: goods.storageStyle,
        storageStyleCode: goods.storageStyleCode,
        modelCodes: modelCodes.join(),
        operateGoodsTag: 1
    })
}
// 上架到我的商品库
const update = () => {
    multipleHandlePopVisiable.value = false
    popupSubmit()
}
// 取消
const multipleHandleClear = () => {
    multipleHandlePopVisiable.value = false
}
// 获取货柜/算法类型
const getDeviceTypeList = async () => {
    const res = await queryDeviceTypeList()
    if (res.code === '200') {
        containerList.value = res.data
    }
}

// 重新加载
const reload = () => {
    pageInfo.pageNo = 1
    finished.value = false
    onLoad()
}

getDeviceTypeList()
defineExpose({
    reload,
    loading
})
</script>
<style lang="scss" scoped>
.root{
    background: #fff;
}
.not-on-goods-box{
    background: #fff;
    min-height: calc(100vh - 92px - 88px - var(--van-status-bar-height));
    .van-field__left-icon{
        padding-top: 8px;
    }
    .search-data{
        border-bottom: 16px solid #F3F5F6;
        position: relative;
        .sweepImg{
            width: 34px;
            height: 32px;
            position: absolute;
            top: 38px;
            right: 60px;
        }
        .van-field__control{
            text-align: left;
        }
    }
    .goods-list{
        padding-top: 20px;
        .algorithm-type-box{
            padding: 0 30px 22px 30px;
            .algorithm-type-choose{
                display: inline-block;
                padding: 0 50px 0 24px;
                height: 56px;
                line-height: 56px;
                border-radius: 8px;
                border: 1px solid #F3F5F6;
                font-size: 26px;
                color: #191919;
                font-weight: 400;
                position: relative;
                .corner{
                    width: 12px;
                    height: 12px;
                    position: absolute;
                    right: 0;
                    bottom: 0;
                }
            }
        }
        .goods-item{
            position: relative;
            padding: 40px 30px;
            .goods-img{
                width: 100px;
                height: 100px;
                position: absolute;
                top: 40px;
                left: 30px;
                border-radius: 8px;
            }
            .small-spec-icon{
                width: 96px;
                height: 36px;
                position: absolute;
                top: 0;
                left: 0;
            }
            .goods-info{
                margin-left: 100px;
                margin-bottom: 14px;
                .info-text{
                    padding-left: 16px;
                    display: block;
                    margin-bottom: 10px;
                }
                .info-title{
                    font-size: 30px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #222222;
                    line-height: 36px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    padding-right: 100px;
                }
                .info-model{
                    font-size: 20px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    line-height: 24px;
                    .model-type1{
                        display: inline-block;
                        margin-right: 16px;
                        color: #328EED;
                        background: rgba($color: #328EED, $alpha: 0.1);
                        border-radius: 4px;
                        padding: 4px 8px;
                    }
                    .model-type2{
                        color: #46CD60;
                        display: inline-block;
                        margin-right: 16px;
                        background: rgba($color: #46CD60, $alpha: 0.1);
                        border-radius: 4px;
                        padding: 4px 8px;
                    }
                    .model-type3{
                        color: #F8AC3D;
                        display: inline-block;
                        margin-right: 16px;
                        background: rgba($color: #F8AC3D, $alpha: 0.1);
                        border-radius: 4px;
                        padding: 4px 8px;
                    }
                    .frozen-icon img{
                        width: 116px;
                        vertical-align: top;
                    }
                }
                .info-order{
                    font-size: 22px;
                    font-weight: 400;
                    color: #B0B0B0;
                    line-height: 30px;
                }
                .info-amount{
                    font-size: 32px;
                    font-weight: 500;
                    color: #FF1E19;
                    line-height: 34px;
                }
            }
            .goods-handle{
                text-align: right;
                .handle-btn{
                    display: inline-block;
                    width: 96px;
                    height: 48px;
                    border-radius: 8px;
                    border: 0.5px solid #FE7E41;
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 800;
                    color: #FE7E41;
                    line-height: 48px;
                    text-align: center;
                    margin-right: 16px;
                }
                .del{
                    margin-right: 0;
                }
            }
        }
        .empty{
            text-align: center;
            margin-top: 84px;
            display: flex;
            flex-direction: column;
            align-items: center;
            img{
                width: 64%;
            }
            .no-data{
                width: 560px;
                display: block;
                font-size: 30px;
                color: #888;
            }
            .tips-box{
                padding: 30px;
                background: linear-gradient(270deg, #FFFAF8 0%, #FFF4EE 100%);
                border-radius: 16px;
                margin: 120px 40px 0;
                font-size: 28px;
                font-weight: 400;
                line-height: 40px;
                color: #696461;
                text-align: left;
                span{
                    color: #FE7E41;
                }
            }
        }
    }
    .divider{
        width: 100%;
        height: 2px;
        background: #F4F5F5;
    }
    .popup-container{
        .container-item{
            display: block;
            height: 114px;
            line-height: 114px;
            border-bottom: 0.5px solid #ededed;
            font-size: 30px;
            color: #191919;
            text-align: center;
        }
        .container-item-active{
            color: #FE7E41;
        }
    }
    .confirm-popup-info{
        .confirm-popup-info-title{
            display: block;
            font-size: 36px;
            color: #000;
            text-align: center;
            padding-bottom: 24px;
        }
        .confirm-popup-info-content{
            font-size: 30px;
            padding: 0 40px 24px;
            color: #696969;
            text-align: center;
            display: block;
        }
        .confirm-popup-info-handle{
            display: inline-block;
            width: 49%;
            height: 100px;
            color: #2E2E4D;
            line-height: 100px;
            font-size: 36px;
            text-align: center;
            border-top: 1px solid #ededed;
            margin-top: 12px;
        }
        .handle-active{
            color: #FE7E41;
            border-left: 1px solid #ededed;
        }
    }
    .multiple-handle-dialog{
        .multiple-handle-dialog-content{
            display: block;
            font-size: 36px;
            color: #000;
            text-align: center;
            padding: 56px 40px;
        }
        .multiple-handle-dialog-handle{
            display: block;
            height: 100px;
            line-height: 100px;
            font-size: 36px;
            color: #191919;
            text-align: center;
            border-top: 1px solid #ededed;
        }
        .handle-active{
            color: #FE7E41;
        }
    }
}
</style>
