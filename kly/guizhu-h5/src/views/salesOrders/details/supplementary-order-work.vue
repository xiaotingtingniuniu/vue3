<template>
    <div class="supplementary-order">
        <div class="card">
            <h4 class="card-title">购物视频</h4>
            <div class="videoContent">
                <template v-if="orderInfo.videoList?.length">
                    <div class="videxBox" v-for="item in orderInfo.videoList" :key="item" :src="item"  controls='controls'>
                        <div class="video-tip">
                            <span>{{orderInfo.opendoorInfo.doorTypeName === '单门' ? '' : orderInfo.opendoorInfo.doorTypeName}}</span>
                            <span>{{orderInfo.opendoorInfo.applyCode}}</span>
                        </div>
                        <video :src="item" controls='controls'></video>
                    </div>
                </template>
                <div class="videxBox default-videxBox" v-else>
                    <div class="content">
                        <van-icon :name="warningIcon"></van-icon>
                        <span class="text">视频加载失败</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="order-content">
                <div class="cell">原订单 共{{orderInfo.orderItemsInfo.skuCount || 0}}件：调整后 共{{skuCount}}件</div>
                <div class="cell">原订单金额：{{((orderInfo.workOrderDetailInfo.totalAmount || 0) / 100).toFixed(2)}}元：调整后 {{(skuPrice / 100).toFixed(2)}}元</div>
                <template v-if="active === 0">
                    <div v-for="goods in checkSkuList" :key="goods.skuCode" class="cell">{{goods.skuName}}  *  {{goods.quantity}}</div>
                </template>
            </div>
            <div class="order-coupon b-t">
                <div class="text">优惠券</div>
                <div class="number">￥{{(orderInfo.orderItemsInfo.disctAmount || 0)}}</div>
            </div>
        </div>
        <div class="card sticky-0">
            <h4 class="card-title">设备商品
                <!-- <p> 共<span class="number">{{skuList.length || 0}}</span>件商品</p> -->
            </h4>
            <van-tabs v-model:active="active" color="#FE7E41" @change="tabChange">
                <van-tab title="修改商品">
                    <div class="search-box">
                        <van-field class="cst-field" v-model="skuNameSkuId" label="" placeholder="按商品编号/名称搜索" />
                        <div class="search-btn" @click="getSkutList(true)">搜索</div>
                    </div>
                    <p class="device-goods-count">设备内商品 共<span class="number">{{skuTotal || 0}}</span>件</p>
                    <div class="device-goods-content" v-if="skuList?.length">
                        <div v-for="item in skuList" :key="item.skuId">
                            <goods-item :goods="item" :disabled="disabled" @change="handleChange"/>
                        </div>
                    </div>
                </van-tab>
                <van-tab title="调整金额">
                    <div class="input-container">
                        <van-field v-model="orderTotal" input-align="right" label="原订单金额" readonly/>
                        <van-field v-model="price" @blur="onBlur" input-align="right" :disabled="disabled" label="调整后" placeholder="输入调整的价格"/>
                        <van-field input-align="right" label="订单备注" readonly />
                        <van-field
                            class="cst-van-field"
                            v-model="message"
                            rows="2"
                            :disabled="disabled"
                            autosize
                            type="textarea"
                            maxlength="50"
                            placeholder="请输入备注内容"
                        />
                    </div>
                </van-tab>
            </van-tabs>
        </div>
        <div class="empty-120 van-safe-area-bottom"></div>
        <footer class="supplementary-order-footer van-safe-area-bottom" v-if="!disabled">
            <p class="text">{{auditText}}：<span>{{(auditPrice / 100).toFixed(2)}}元</span></p>
            <div class="btn-container">
                <!-- <span @click="notShopping">无购物</span> -->
                <span @click="confirmEdit">确认修改</span>
            </div>
        </footer>
        <a class="service" href="tel: 400-085-5858"></a>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import GoodsItem from './goods-item.vue'
import { getSaleOrderDetailV10, finishWorkOrder, getGoodsListV2 } from '@api/order.js'
import { useRoute } from 'vue-router'
import { Dialog, Toast } from 'vant'
import { closePage } from '@/utils/composables'
import { accMul } from '@/utils'
import warningIcon from '../../../assets/warning-icon1.png'

const route = useRoute()

const orderTotal = ref(0)
const orderInfo = ref({
    workOrderDetailInfo: {
        totalAmount: 0,
        workOrderStatus: '',
        buyVideoUrls: []
    },
    orderItemsInfo: {
        skuCount: 0,
        disctAmount: 0
    },
    goodsSearch: '',
    skuList: []
})

const active = ref(0)
const message = ref()
const skuPrice = ref(0)
const skuList = ref([])
const skuTotal = ref(0)
const price = ref()
const auditPrice = ref(0)
const auditText = ref('需补扣')
const skuCount = ref(0)
const skuNameSkuId = ref('')
const disabled = ref(false)
const checkSkuList = ref([])

const init = async () => {
    const param = {
        applyCode: route.params.applyCode,
        orderNoSub: route.params.orderNoSub === 'null' ? '' : route.params.orderNoSub
    }
    const res = await getSaleOrderDetailV10(param)
    console.log(res, 'res')
    if (res.code === '200') {
        // orderInfo = res.data
        Object.assign(orderInfo.value, res.data)
        orderTotal.value = '¥' + (orderInfo.value.workOrderDetailInfo.totalAmount || 0)
        getSkutList()
        disabled.value = orderInfo.value.workOrderDetailInfo.workOrderStatus === '已处理'
    }
    console.log(disabled.value, 'orderInfo.value')
}

// 获取商品列表
const getSkutList = async (flag) => {
    const param = {
        doorType: orderInfo.value.opendoorInfo.doorType,
        skuNameSkuId: skuNameSkuId.value,
        deviceCode: orderInfo.value.orderInfo.deviceDto?.deviceNo,
        timestamp: orderInfo.value.orderInfo.applyOpenTime
    }
    const res = await getGoodsListV2(param)
    console.log(checkSkuList.value, 'goodsList')
    if (res.code === '200') {
        skuList.value = []
        res.data.list.forEach(el => {
            if (el.salePrice !== null) {
                const goods = checkSkuList.value.find(item => item.skuCode === el.skuId)
                skuList.value.push({
                    storageStyleCode: el.storageStyleCode,
                    doorType: el.doorType,
                    skuCode: el.skuId,
                    realPrice: el.salePrice,
                    skuPrice: el.salePrice,
                    quantity: goods?.quantity || 0,
                    skuName: el.skuName,
                    skuUrl: el.goodsMediaList?.find(el => el.mediaType === 4)?.mediaUrl,
                    skuImg: el.goodsMediaList?.find(el => el.mediaType === 4)?.mediaUrl
                })
                // if (skuNameSkuId.value === '') checkSkuList.value = []
            }
        })
        skuTotal.value = flag ? skuTotal.value : skuList.value.length
    }
}
init()

const onBlur = () => {
    auditPrice.value = (orderInfo.value.workOrderDetailInfo.totalAmount || 0) - accMul(price.value || 0, 100)
    skuPrice.value = accMul(price.value || 0, 100)
    if (auditPrice.value > 0) {
        auditText.value = '需退款'
    } else {
        auditText.value = '需补扣'
        auditPrice.value = Math.abs(auditPrice.value)
    }
}

const tabChange = () => {
    if (active.value === 1) {
        auditPrice.value = 0
        skuCount.value = 0
        skuPrice.value = 0
        onBlur()
    } else {
        handleChange()
    }
}

// 选中商品
const handleChange = () => {
    skuPrice.value = 0
    skuCount.value = 0
    auditPrice.value = 0
    skuList.value.forEach((el, index) => {
        const ind = checkSkuList.value.findIndex(item => el.skuCode === item.skuCode)
        if (el.quantity > 0) {
            if (ind !== -1) {
                checkSkuList.value[ind].quantity = el.quantity
            } else {
                checkSkuList.value.push(el)
            }
        } else {
            if (ind !== -1) {
                checkSkuList.value.splice(ind, 1)
            }
        }
    })
    checkSkuList.value.forEach(el => {
        skuPrice.value += el.quantity * el.realPrice
        skuCount.value += el.quantity
    })
    console.log(checkSkuList.value)
    auditPrice.value = ((orderInfo.value.workOrderDetailInfo.totalAmount || 0) - skuPrice.value).toFixed(2)
    if (auditPrice.value > 0) {
        auditText.value = '需退款'
    } else {
        auditText.value = '需补扣'
        auditPrice.value = Math.abs(auditPrice.value)
    }
}

// 无购物
// const notShopping = () => {
//     Dialog.confirm({
//         title: '完成异常处理',
//         message: '是否确认处理结果？',
//         confirmButtonColor: '#FE7E41',
//         confirmButtonText: '确定',
//         cancelButtonText: '取消',
//         getContaniner: '.pirce-change'
//     }).then(async () => {
//         const res = await noShopping({ workNumber: route.params.orderNo })
//         if (res.code === '200') {
//             Toast('操作成功')
//             const timer = setTimeout(() => {
//                 clearTimeout(timer)
//                 closePage()
//             })
//         } else {
//             Toast(res.message)
//         }
//     })
// }

// 确认修改
const confirmEdit = async () => {
    Dialog.confirm({
        title: '完成异常处理',
        message: '是否确认处理结果？',
        confirmButtonColor: '#FE7E41',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        getContaniner: '.pirce-change'
    }).then(async () => {
        const param = {
            auditAmount: active.value === 0 ? skuPrice.value : accMul(price.value, 100), // 审核后订单金额，
            discAmount: orderInfo.value.orderItemsInfo.disctAmount, // 优惠券金额
            discernInfo: message.value, // 客服录入信息
            goodsInfoList: active.value === 0 ? checkSkuList.value.filter(el => el.quantity) : [],
            // goodsInfoList: [
            //     {
            //         quantity: 0, // 购买数量
            //         skuCode: 0, // 商品编码
            //         skuName: '',
            //         skuPrice: 0, // 商品价格
            //         skuUrl: '' // 商品缩略图
            //     }
            // ],
            handleAmount: auditPrice.value, // 处理金额
            handleType: auditText.value === '需补扣' ? 1 : 2, // 工单处理类型1:补扣 2:退款,默认1 是
            videoVisibleFlag: active.value === 1 ? 0 : 1, // 视频中商品是否看得清楚 0：看不清楚 1：看得清楚,默认1：看得清楚
            workNumber: orderInfo.value.orderInfo.workNumber
        }
        const res = await finishWorkOrder(param)
        console.log(res, 'res')
        if (res.code === '200') {
            Toast('操作成功')
            const timer = setTimeout(() => {
                clearTimeout(timer)
                closePage()
            })
        } else {
            Toast(res.msg)
        }
    })
}

</script>
<style lang="scss" scoped>
.supplementary-order{
    width: 100vw;
    height: 100vh;
    background: #F4F5F5;
    .empty-120 {
        min-height: 140px;
    }
    .card {
        margin: 20px auto 0;
        width: 690px;
        background: #FFFFFF;
        border-radius: 8px;
        overflow: hidden;
        &-title {
            display: flex;
            margin-top: 20px;
            position: relative;
            &::after {
                content: '';
                position: absolute;
                left: 0;
                top: 7px;
                display: block;
                width: 10px;
                height: 28px;
                background: #FE7E41;
            }
            height: 42px;
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #191919;
            line-height: 42px;
            text-indent: 30px;
            p {
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                .number {
                    color: #FD7E41;
                }
            }
        }
        .video-box {
            display: flex;
            margin: 32px 30px;
            width: 630px;
            height: 210px;
            overflow-x: scroll;
            video {
                width: 442px;
                height: 210px;
                border-radius: 6px;
                margin-right: 16px;
                object-fit: fill;
            }
        }
        .videoContent{
            margin: 32px 30px;
            overflow: hidden;
            overflow-x: scroll;
            display: flex;
        }
        .videxBox{
            position: relative;
            margin-right: 16px;
            width: 442px;
            height: 210px;
            border-radius: 8px;
            object-fit: fill;
            flex-shrink: 0;
            .video-tip {
                display: flex;
                justify-content: space-between;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                padding: 12px;
                height: 28px;
                font-size: 20px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #EBEBEB;
                line-height: 28px;
            }
            video {
                width: 100%;
                height: 100%;
                border-radius: 6px;
                object-fit: fill;
            }
        }
        .default-videxBox {
            background: #CCCCCC;
            border-radius: 8px;
            .content {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                .van-icon {
                    width: 60px;
                    height: 60px;
                    :deep(.van-icon__image) {
                        width: 100%;
                        height: 100%;
                    }
                }
                .text {
                    margin-top: 16px;
                    font-size: 28px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #FFFFFF;
                    line-height: 40px;
                }
            }
        }
        .order-content {
            padding: 32px 30px;
            .cell {
                margin-bottom: 16px;
                height: 36px;
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                line-height: 36px;
                &:last-child {
                    margin-bottom: unset;
                }
            }
        }
        .b-t {
            border-top: 2px solid #EDEDED;
        }
        .order-coupon {
            display: flex;
            justify-content: space-between;
            padding: 16px 30px;
            .text {
                height: 36px;
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                line-height: 36px;
            }
            .number {
                height: 36px;
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                line-height: 36px;
            }
        }
        .van-tabs {
            :deep(.van-tabs__wrap) {
                border-bottom: solid 2px #EDEDED;
            }
            :deep(.van-tab--active) {
                font-size: 26px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #FE7E41 !important;
            }
        }
        .search-box {
            display: flex;
            justify-content: space-between;
            padding: 32px 30px;
            .search-btn {
                width: 106px;
                height: 62px;
                line-height: 62px;
                background: #FE7E41;
                text-align: center;
                border-radius: 8px;
                font-size: 24px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
            }
        }
        .device-goods-count {
            padding: 0 30px;
            height: 34px;
            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #191919;
            line-height: 34px;
            .number {
                color: #FD7E41;
            }
        }
        .device-goods-content {
            max-height: calc(80vh - 140px);
            overflow-y: scroll;
        }
        .input-container {
            padding: 32px 30px;
        }
        // :deep(.van-nav-bar::after){
        //     content: initial;
        // }
    }
    .sticky-0 {
        position: sticky;
        top: 0;
    }
    .supplementary-order-footer {
        position: fixed;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        padding-left: 32px;
        padding-right: 32px;
        width: 750px;
        min-height: 112px;
        line-height: 112px;
        background: #FFFFFF;
        box-sizing: border-box;
        .text {
            margin-top: 36px;
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #696969;
            line-height: 40px;
        }
        .btn-container {
            span {
                margin-left: 16px;
                padding: 22px 44px;
                width: 172px;
                height: 80px;
                background: linear-gradient(90deg, #FE7E41 0%, #FF5D0F 100%, #FF5C0E 100%);
                border-radius: 46px;
                font-size: 28px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                line-height: 38px;
            }

        }
        .confirm-btn {
            width: 630px;
            text-align: center;
            margin: 20px auto;
            // margin-left: 16px;
            // padding: 22px 44px;
            height: 80px;
            text-align: center;
            background: linear-gradient(90deg, #FE7E41 0%, #FF5D0F 100%, #FF5C0E 100%);
            border-radius: 46px;
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 80px;
        }
    }
    .service {
        position: fixed;
        top: 440px;
        right: 12px;
        z-index: 9;
        width: 96px;
        height: 96px;
        background: url('~@/assets/service-icon.png') no-repeat;
        background-size: 100% 100%;
    }
}
</style>
<style lang="scss">
.supplementary-order{
    .cst-field{
        position: relative;
        padding: unset;
        width: 508px;
        height: 62px;
        line-height: 62px;
        background: #F4F6F5;
        border-radius: 8px;
        &::before {
            content: '';
            position: absolute;
            top: 18px;
            left: 14px;
            width: 26px;
            height: 24px;
            background: url("~@/assets/search.png") no-repeat;
            background-size: 100% 100%;
        }
        input {
            text-indent: 54px;
        }
    }
    .input-container {
        .van-cell {
            padding: unset;
            margin-bottom: 16px;
            &::after {
                content: unset;
            }
            :deep(.van-field__label) {
                padding: unset;
                height: 36px;
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                line-height: 36px;
            }
        }
        .cst-van-field {
            padding: 16px;
            width: 630px;
            height: 144px;
            background: #F4F5F5;
            border-radius: 8px;
        }
    }
}

</style>
