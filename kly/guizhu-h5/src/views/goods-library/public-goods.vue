<template>
    <div class="goods-box">
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
                <van-checkbox v-model="selectAll" @click="checkAll" class="choose-all" checked-color="#FE7E41" label-position="left">全选</van-checkbox>
            </div>
            <van-list v-model:loading="loading" :finished="finished" :finished-text="finishedText" @load="onLoad">
                <div v-for="(item, index) in goodsLists" :key="index">
                    <div class="goods-item">
                        <img src="@/assets/small-spec-icon.png" class="small-spec-icon" v-if="item.isSmallSpec">
                        <img v-if="item.mediaUrl" :src="item.mediaUrl" alt="" class="goods-img">
                        <img v-if="!item.mediaUrl" src="@/assets/img-error.png" alt="" class="goods-img">
                        <div class="goods-info">
                            <span class="info-text info-handle">
                                <span class="info-title">{{item.spuName}}</span>
                                <span class="info-status" v-if="item.havaGoods === 2">未添加</span>
                                <span class="info-status have-goods" v-if="item.havaGoods === 1">已添加</span>
                            </span>
                            <span class="info-text info-model">
                                <span
                                    v-for="(modelItem, modelIndex) in item.modelList"
                                    :key="modelIndex"
                                    :class="[{'model-type1': modelIndex%3 === 0}, {'model-type2': modelIndex%3 === 1}, {'model-type3': modelIndex%3 === 2}]"
                                >
                                    {{modelItem.modelName}}
                                </span>
                                <span class="frozen-icon" v-if="item.storageStyle === '冷冻品'">
                                    <img src="../../assets/frozen_icon.png">
                                </span>
                            </span>
                            <span class="info-text info-order">{{item.barcode}}</span>
                            <span class="info-text info-amount">
                                <span style="font-size: 11px">￥</span>{{item.guidePrice}}
                            </span>
                        </div>
                        <van-checkbox v-if="item.havaGoods === 2" v-model="item.checked" class="goods-checkbox-item" checked-color="#FE7E41" @click="choose(item.spuId)" />
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
        <div class="bottom" v-if="goodsLists.length">
            <span class="btn" @click="submit">添加到我的商品库</span>
        </div>
        <van-popup :show="algorithmTypeVisiable" position="bottom" class="popup-container">
            <span :class="['container-item', {'container-item-active' :algorithmCode === ''}]" @click="chooseAlgorithmType({modeCode: '', modeName: '全部算法'})">全部算法</span>
            <span v-for="(item, index) in containerList" :key="index" :class="['container-item', {'container-item-active' :algorithmCode === item.modeCode}]" @click="chooseAlgorithmType(item)">{{item.modeName}}</span>
        </van-popup>
        <!-- 添加到商品库 -->
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
                <span class="confirm-popup-info-handle handle-active" @click="popupSubmit">{{popupInfo.suerText}}</span>
            </template>
        </van-dialog>
    </div>
</template>
<script setup>
import { nextTick } from 'process'
import { ref, reactive, onMounted } from 'vue'
import { Toast } from 'vant'
import { appBridge, registerhandler } from '@/utils/bridge.js'
import { queryPublicGoodsList, queryDeviceTypeList, addToGoods } from '@/api/goods-library'

const goodsLists = ref([])
const algorithmCode = ref('')
const algorithmType = ref('算法类型')
const emptyText = ref('暂无数据')
const finishedText = ref('') // 没有更多数据提示
const algorithmTypeVisiable = ref(false)
const confirmPopupVisiable = ref(false)
const selectAll = ref(false)
const loading = ref(false)
const finished = ref(false)
// 获取选中的ID
const checkID = ref([])
// 获取选中小规格商品的ISD
const smallSpecId = ref([])
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
const onLoad = async () => {
    // 异步更新数据
    // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    const params = {
        spuNameBarcode: searchValue.value,
        modelCode: algorithmCode.value,
        goodsStatus: 4,
        pageNo: pageInfo.pageNo,
        pageSize: pageInfo.pageSize
    }
    const res = await queryPublicGoodsList(params)
    if (res.code === '200') {
        if (pageInfo.pageNo === 1) {
            goodsLists.value = res.data.list
        } else {
            goodsLists.value = goodsLists.value.concat(res.data.list)
        }
        goodsLists.value.forEach((item) => {
            item.spuMediaList && item.spuMediaList.forEach((mediaItem) => {
                if (mediaItem.mediaType === 6) {
                    item.mediaUrl = mediaItem.mediaUrl
                }
            })
        })
        if (goodsLists.value.length > 0 && pageInfo.pageNo > 1) {
            finishedText.value = '没有更多了'
        } else {
            finishedText.value = ''
        } if (goodsLists.value.length === 0) {
            emptyText.value = '没有查询结果，请点击“新品申请”创建商品'
        }
        loading.value = false
        pageInfo.pageNo++
        // 数据全部加载完成
        if (goodsLists.value.length >= res.data.total) {
            finished.value = true
        }
    } else {
        finished.value = true
        loading.value = false
    }
}

// 扫一扫
const sweepOne = () => {
    registerhandler('setScanResult', res => {
        searchValue.value = res
        reload()
    })
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

// 全选
const checkAll = () => {
    const status = selectAll.value
    checkID.value = []
    smallSpecId.value = []
    if (status) {
        goodsLists.value.forEach(item => {
            if (item.havaGoods === 2) {
                if (item.isSmallSpec) {
                    smallSpecId.value.push(item.spuId)
                }
                checkID.value.push(item.spuId)
                item.checked = status
            }
            return item
        })
    } else {
        goodsLists.value.forEach(item => {
            item.checked = status
            return item
        })
    }
}
// 多选框
const choose = (id) => {
    checkID.value = []
    smallSpecId.value = []
    goodsLists.value.forEach(item => {
        if (item.checked === true) {
            checkID.value.push(item.spuId)
            if (item.isSmallSpec) {
                smallSpecId.value.push(item.spuId)
            }
        }
    })
    if (checkID.value.length === goodsLists.value.length) {
        selectAll.value = true
    } else {
        selectAll.value = false
    }
}
// 提交操作
const submit = () => {
    if (checkID.value.length === 0) {
        Toast('请选择')
        return
    }
    let contentText = ''
    if (smallSpecId.value.length === 0) {
        contentText = `您将添加${checkID.value.length}件商品到“我的商品库”`
    } else {
        contentText = `您将添加${checkID.value.length}件商品到“我的商品库”,其中包含${smallSpecId.value.length}种小规格商品，小规格商品会影响货柜识别率，请谨慎添加`
    }
    popupInfo.value = {
        type: 'del',
        content: contentText,
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
    const res = await addToGoods({ spuIdList: checkID.value })
    if (res.code === '200') {
        checkID.value = []
        Toast(res.msg)
        reload()
    }
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
    // setTimeout(() => {
    //     window.document.documentElement.scrollIntoView(true)
    // })
}
onMounted(() => {
    getDeviceTypeList()
})
</script>
<style lang="scss" scoped>
.goods-box{
    background: #fff;
    min-height: calc(100vh - 96px - var(--van-status-bar-height));
    .van-field__left-icon{
        padding-top: 8px;
    }
    .van-checkbox__label{
        font-size: 26px;
    }
    .van-checkbox__icon--round .van-icon{
        width: 36px;
        height: 36px;
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
        padding: 20px 0;
        position: relative;
        padding-bottom: 120px;
        .algorithm-type-box{
            padding: 0 30px 22px;
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
        .choose-all{
            position: absolute;
            top: 30px;
            right: 30px;
            font-size: 30px;
            color: #191919;
        }
        .goods-item{
            position: relative;
            padding: 40px 30px;
            .small-spec-icon{
                width: 96px;
                height: 36px;
                position: absolute;
                top: 0;
                left: 0;
            }
            .goods-img{
                width: 100px;
                height: 100px;
                position: absolute;
                top: 40px;
                left: 30px;
                border-radius: 8px;
            }
            .goods-info{
                margin-left: 100px;
                .info-text{
                    padding-left: 16px;
                    display: block;
                    margin-bottom: 10px;
                }

                .info-handle{
                    display: flex;
                    .info-title{
                        font-size: 30px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 500;
                        color: #222222;
                        line-height: 36px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        width: 80%;
                    }
                    .info-status{
                        font-size: 24px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 400;
                        color: #FE7E41;
                        line-height: 34px;
                        margin-bottom: 0;
                        flex: 1;
                        text-align: right;
                    }
                    .have-goods{
                        color: #B0B0B0;
                    }
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
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 400;
                    color: #B0B0B0;
                    line-height: 30px;
                }
                .info-amount{
                    font-size: 28px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #FE7E41;
                    line-height: 34px;
                    margin-bottom: 0;
                    // width: 100px;
                }
            }
            .goods-checkbox-item{
                position: absolute;
                top: 115px;
                right: 30px;
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
                width: 480px;
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
     .bottom{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 20px;
        padding: 0 60px;
        width: calc(100vw - 120px);
        bottom: calc(20px + constant(safe-area-inset-bottom));
        bottom: calc(20px + env(safe-area-inset-bottom));
        .btn{
            display: inline-block;
            width: 100%;
            height: 92px;
            line-height: 92px;
            background: #FE7E41;
            border-radius: 46px;
            text-align: center;
            color: #fff;
            font-size: 30px;
        }
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
}
.van-checkbox__icon--round .van-icon{
    margin-top: 3px;
    width: 36px;
    height: 33px;
}
.van-checkbox__icon .van-icon{
    line-height:32px;
    font-size: 25px;
}
</style>
