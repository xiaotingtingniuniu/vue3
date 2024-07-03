<template>
    <div class="order-list-page" :class="isApp ? 'status-bar-height' : ''">
        <van-sticky>
            <van-search v-model="searchValue" @search="onClick" shape="round" placeholder="请输入商品名称...">
                <template #left>
                    <div v-if="isApp" class="icon--unselect back-title" @click="pageBack">
                        <van-icon size="1em" :name="require('@/assets/order/back-icon-order.png')" />
                    </div>
                </template>
                <template #left-icon>
                    <div class="icon--unselect">
                        <van-icon size="1em" :name="require('@/assets/menu/搜索@2x.png')" />
                    </div>
                </template>
            </van-search>
            <van-tabs v-model:active="orderStatus" line-width="24px" title-active-color="#222222" title-inactive-color="#191919" background="#F7F7F7" @click-tab="onClick">
                <van-tab v-for="item in orderState.filter(item => item.header === true)" :title="item.label" :name="item.name" :key="item.name" />
            </van-tabs>
        </van-sticky>
        <div class="order">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list v-if="list.length" v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="getOrderList" :immediate-check="false">
                    <template v-for="item in list" :key="item.orderNumber">
                        <van-swipe-cell v-if="item.orderStatus === 600 || item.orderStatus === 700 || item.orderStatus === 800">
                            <van-cell-group :border="false">
                                <div class="card">
                                    <div class="order-item">
                                        <div class="shop van-hairline--bottom">
                                            <div class="order-shop-name">
                                                <div class="icon--unselect">
                                                    <van-icon size="1em" :name="require('@/assets/order/shop-icon.png')" />
                                                </div>
                                                <div class="text van-ellipsis">{{item.cabinetName}}</div>
                                            </div>
                                            <div class="order-state" :class="'state-' + item.orderStatus">{{ orderState.find(val => val.name === item.orderStatus).label }}</div>
                                        </div>
                                        <div class="order-information" v-for="goods in item.commodityList" :key="goods.orderNumber" @click="pageGo(`/order-detail/${item.orderNumber}`)">
                                            <div class="information-image">
                                                <van-image :src="goods.commodityUrl" radius="7"></van-image>
                                            </div>
                                            <div class="information-price">
                                                <div class="title">{{goods.commodityName}}</div>
                                                <div class="text--price"><span class="unit">¥</span><span class="font-din">{{goods.commodityUnitPrice}}</span></div>
                                                <div class="text--all">共{{goods.commodityQuantity}}件</div>
                                            </div>
                                        </div>
                                        <div class="pay-amount"><span class="text">总价</span> <span class="unit">¥</span><span class="font-din">{{ item.payAmount }}</span></div>
                                        <div class="button-box">
                                            <van-button @click="pageGo(`/order-detail/${item.orderNumber}`)" class="button--detail" v-if="item.orderStatus !== 100">查看详情</van-button>
                                            <van-button class="button--pay" v-if="item.orderStatus === 100" @click.stop="toPay(item.orderNumber)">去付款</van-button>
                                        </div>
                                    </div>
                                </div>
                            </van-cell-group>
                            <template #right>
                                <div class="delete-warp">
                                    <van-button class="delete-button" @click="deleteorder(item.orderNumber)">删除</van-button>
                                </div>
                            </template>
                        </van-swipe-cell>
                        <div class="card" v-else>
                            <div class="order-item">
                                <div>
                                    <div class="shop van-hairline--bottom">
                                        <div class="order-shop-name">
                                            <div class="icon--unselect">
                                                <van-icon size="1em" :name="require('@/assets/order/shop-icon.png')" />
                                            </div>
                                            <div class="text van-ellipsis">{{item.cabinetName}}</div>
                                        </div>
                                        <div class="pending-pay" v-if="item.orderStatus===100&&item.remainingTime>10000">
                                            <div class="order-state" :class="'state-' + item.orderStatus">{{ orderState.find(val => val.name === item.orderStatus).label }}</div>
                                            <div class="order-time">{{ item.remainingTimeText }}</div>
                                        </div>
                                        <div v-else-if="item.orderStatus===100&&item.remainingTime<=10000" class="order-state state-500">{{ item.remainingTimeText }}</div>
                                        <div v-else class="order-state" :class="'state-' + item.orderStatus">{{ orderState.find(val => val.name === item.orderStatus).label }}</div>
                                    </div>
                                    <div class="goods-group" @click="pageGo(`/order-detail/${item.orderNumber}`)">
                                        <template v-for="goods in item.commodityList" :key="goods.commodityId">
                                            <goods-item-for-order :goods='goods' :orderstatus='item.orderStatus'/>
                                        </template>
                                    </div>
                                    <div class="pay-amount"><span class="text">总价</span> <span class="unit">¥</span><span class="font-din">{{ item.payAmount }}</span></div>
                                    <div class="button-box">
                                        <van-button @click="pageGo(`/order-detail/${item.orderNumber}`)" class="button--detail" v-if="item.orderStatus !== 100">查看详情</van-button>
                                        <van-button class="button--cancel" round v-if="item.orderStatus === 100" @click.stop="cancelOrderDialog(item.orderNumber)">取消订单</van-button>
                                        <van-button class="button--pay" v-if="item.orderStatus === 100" @click.stop="toPay(item.orderNumber)">去付款</van-button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </template>
                </van-list>
                <div v-else class="no-data">
                    <div class="no-data-bg"></div>
                    <div class="no-data-tip">您还没有订单哦～</div>
                </div>
            </van-pull-refresh>
        </div>
    </div>
</template>
<script setup>
import { orderState } from '@/utils/order'
import { cancelOrder, orderList, orderDelete, orderStatus as orderStatusApi } from '@/api/order'
import GoodsItemForOrder from '@/components/Goods/GoodsItemForOrder.vue'
import { isApp, countDown } from '@/utils'
import { pageGo, pageBack } from '@/utils/composables'
import { Toast } from 'vant'

const router = useRouter()
const props = defineProps(['active'])
// 搜索弹出窗
const searchValue = ref('')
const orderStatus = ref(Number(props.active))

const store = useStore()
const token = computed(() => store.state.token)
const loading = ref(false)
const finished = ref(false)
const pageSize = ref(10)
const pageNum = ref(1)
const list = ref([])
const keepAliveId = ref(null)
const number = ref('')
const refreshing = ref(false)
const keepToken = ref(null)
const fromRoute = ref(null)

watch(() => router.currentRoute.value, (newValue, oldValue) => {
    fromRoute.value = oldValue ? oldValue.name : null
    if (fromRoute.value === 'order-detail' && newValue.name === 'order-list') {
        checkOrderStatus(oldValue.params.id)
    }
}, { immediate: true })

// 校验订单状态是否发生变化 (适用场景, 从详情页中操作取消订单, 返回列表页面更新状态)
const checkOrderStatus = async orderNumber => {
    const index = list.value.findIndex(item => item.orderNumber === orderNumber)
    const res = await orderStatusApi({ orderNumber })
    if (orderStatus.value !== 0 || res.orderStatus !== orderStatus.value) {
        onClick()
    } else {
        list.value[index].orderStatus = res.orderStatus
    }
}

onActivated(() => {
    if (token.value) {
        if (props.active) (orderStatus.value = Number(props.active))
        if (keepAliveId.value === orderStatus.value && token.value === keepToken.value && fromRoute.value === 'order-detail') return false
        keepAliveId.value = orderStatus.value
        keepToken.value = token.value
        onClick()
    }
    watch([token], () => {
        if (props.active) (orderStatus.value = Number(props.active))
        if (keepAliveId.value === orderStatus.value && token.value === keepToken.value && fromRoute.value === 'order-detail') return false
        keepAliveId.value = orderStatus.value
        keepToken.value = token.value
        onClick()
    })
})

const onRefresh = () => {
    // 清空列表数据
    finished.value = false
    // 重新加载数据
    // 将 loading 设置为 true，表示处于加载状态
    loading.value = true
    pageNum.value = 1
    getOrderList()
}

// 列表
const getOrderList = async () => {
    loading.value = true
    const param = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        orderStatus: orderStatus.value,
        keyword: searchValue.value
    }
    const data = await orderList(param)
    const tempList = (pageNum.value === 1) ? data.content : [...list.value, ...data.content]
    if (pageNum.value === 1) {
        clearInterval(timer.value)
    }
    tempList.map(item => {
        if (item.orderStatus === 100) {
            item.remainingTimeText = item.remainingTime > 10000 ? countDown(item.remainingTime) : '订单即将失效'
        }
    })
    list.value = tempList
    countDownFn()
    if (list.value.length >= data.totalElements) (finished.value = true)
    pageNum.value++
    loading.value = false
    if (refreshing.value) refreshing.value = false
}

// 倒计时
const timer = ref(null)
// 监听h5页面后台运行 再打开后刷新当前数据
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && timer.value) {
        onClick()
    }
})
const countDownFn = () => {
    timer.value = setInterval(() => {
        if (!list.value.find(item => item.orderStatus === 100)) {
            clearInterval(timer.value)
        }
        list.value.map(async (item, index) => {
            if (item.orderStatus === 100) {
                item.remainingTime -= 1000
                if (item.remainingTime <= 0) {
                    // 计时为0 确认后台状态更新
                    const res = await orderStatusApi({ orderNumber: item.orderNumber })
                    if (res.orderStatus === 100) { // 还是待支付, 更新过期时间
                        item.remainingTime = res.remainTime
                    } else {
                        item.orderStatus = res.orderStatus
                        // 如果更新了状态检测tab和当前订单的状态是否符合 不符合删除
                        if (orderStatus.value !== 0 && item.orderStatus !== orderStatus.value) {
                            list.value.splice(index, 1)
                        }
                    }
                } else {
                    item.remainingTimeText = item.remainingTime > 10000 ? countDown(item.remainingTime) : '订单即将失效'
                }
            }
        })
    }, 1000)
}

// tab 切换
const onClick = () => {
    finished.value = false
    pageNum.value = 1
    router.replace({ name: 'order-list', params: { active: orderStatus.value } })
    keepAliveId.value = orderStatus.value
    getOrderList()
}

const toPay = async (orderNumber) => {
    return pageGo(`/cashier/${orderNumber}`)
}
const deleteorder = async (Number) => {
    // dialogVisible.value = true
    number.value = Number
    store.commit('setAppDialog', {
        visible: true,
        title: '确定删除此订单？',
        content: '订单删除后将无法恢复',
        left: '取消',
        right: '删除',
        leftClick: () => {
            store.commit('setAppDialog', { visible: false })
        },
        rightClick: async () => {
            const code = await orderDelete({ orderNumber: number.value })
            if (code === 200) {
                store.commit('setAppDialog', { visible: false })
                Toast('删除成功')
                if (list.value.length > pageSize.value) {
                    list.value.map((item, index) => {
                        if (item.orderNumber === number.value) {
                            list.value.splice(index, 1)
                        }
                    })
                } else {
                    onClick()
                }
            }
        }
    })
}
// 取消订单
const cancelOrderNumber = ref(null)
const cancelOrderDialog = async (orderNumber) => {
    cancelOrderNumber.value = orderNumber
    store.commit('setAppDialog', {
        visible: true,
        title: '是否确认取消订单?',
        left: '取消',
        right: '确认',
        leftClick: () => {
            store.commit('setAppDialog', { visible: false })
        },
        rightClick: async () => {
            await cancelOrderFn(cancelOrderNumber.value)
            store.commit('setAppDialog', { visible: false })
        }
    })
}
const cancelOrderFn = async orderNumber => {
    const code = await cancelOrder({ orderNumber })
    if (code === 200) {
        const res = await orderStatusApi({ orderNumber })
        if (res.orderStatus === 800) {
            const index = list.value.findIndex(item => item.orderNumber === orderNumber)
            if (orderStatus.value !== 0 || res.orderStatus !== orderStatus.value) {
                onClick()
            } else {
                list.value[index].orderStatus = res.orderStatus
            }
        }
        Toast('操作成功')
    } else {
        onClick()
    }
}
</script>
<style lang="scss" scoped>
.status-bar-height{
    .van-search{
        padding-top: calc(12px + var(--van-status-bar-height)) !important;
    }
}
.order-list-page{
    min-height: calc(100vh - var(--van-status-bar-height));
    background-color: #F7F7F7;
    .van-cell-group{
        background-color: transparent;
    }
    .no-data{
        width: max-content;
        text-align: center;
        margin: 87px auto 0;
        .no-data-bg{
            width: 250px;
            height: 168px;
            background-color: #F7F7F7;
            background-image: url('../../assets/menu/编组 8@1.5x.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }
        .no-data-tip{
            font-size: 26px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #222222;
            margin-top: 77px;
        }
    }
    :deep(.van-sticky){
        background-color: #F7F7F7;
    }
    .back-title{
        width: 20px;
        font-size: 35px;
        margin-right: 24px;
    }
    .van-search{
        background-color: #F7F7F7;
        padding: 12px 24px;
        :deep(.van-search__content){
            background-color: #fff;
            padding-left: 36px;
            .van-field__left-icon{
                display: flex;
                align-items: center;
                margin-right: 14px;
                .icon--unselect{
                    font-size: 26px;
                }
            }
            .van-search__field{
                height: 64px;
                padding: initial;
                display: flex;
                align-items: center;
            }
        }
    }
    .van-tabs{
        :deep(.van-tabs__line){
            background: linear-gradient(90deg, #FB5A3B 0%, #FC9753 100%);
        }
    }
    .order{
        .delete-warp{
            width: 128px;
            height: 100%;
            margin-left: 8px;
            .delete-button {
                width: 100%;
                height: 100%;
                font-size: 36px;
                background: #F16542;
                border-radius: 12px 0px 0px 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                word-break: keep-all;
            }
        }
        .van-pull-refresh{
            padding-bottom: 100px;
        }
        .van-swipe-cell{
            margin: 20px 0;
            .card{
                margin: 0 24px;
            }
        }
        .card{
            margin: 20px 24px;
            background: #FFFFFF;
            border-radius: 12px;
            .order-item{
                padding-bottom: 36px;
                .shop{
                    padding: 30px 24px;
                    display: flex;
                    justify-content: space-between;
                    .order-shop-name{
                        display: flex;
                        align-items: center;
                        .icon--unselect{
                            font-size: 28px;
                            margin-right: 8px;
                        }
                        .text{
                            font-size: 30px;
                            font-weight: bold;
                            color: #222222;
                            line-height: 30px;
                            width: 380px;
                        }
                    }
                    .pending-pay{
                        display: flex;
                        height: 41px;
                        background-color: rgba(241, 101, 66, .2);
                        border-radius: 6px;
                        font-size: 26px;
                        .order-state{
                            width: 106px;
                            font-weight: 400;
                            color: #FFF;
                            line-height: 41px;
                            background-color: #F16542;
                            border-radius: 6px 6px 14px 6px;
                            text-align: center;
                        }
                        .order-time{
                            width: 80px;
                            line-height: 41px;
                            color: #F16542;
                            text-align: center;
                            padding: 0 14px;
                        }
                    }
                    .order-state{
                        font-size: 26px;
                        font-weight: 400;
                        color: #999999;
                        line-height: 26px;
                    }
                    .state-100, .state-500{
                        color: #F16542;
                    }
                    .state-100, .state-500{
                        color: #F16542;
                    }
                    .state-200, .state-300, .state-400{
                        color: #C9873E;
                    }
                    .state-600, .state-700, .state-800{
                        color: #999999;
                    }
                }
                .order-information{
                    display: flex;
                    padding: 32px 24px;
                    .information-price{
                        flex: 1;
                        // text-align: right;
                        .title{
                            font-size: 28px;
                            font-weight: bold;
                            color: #222222;
                            height: 80px;
                        }
                        .text--price{
                            margin-top: 20px;
                            text-align: right;
                            color: #222222;
                            font-weight: bold;
                            font-size: 34px;
                            .unit{
                                font-size: 26px;
                            }
                        }
                        .text--all{
                            // margin-top: 20px;
                            text-align: right;
                            color: #B0B0B0;
                            font-size: 22px;
                        }
                    }
                    .information-image{
                        width: 154px;
                        height: 154px;
                        margin-right: 24px;
                        .van-image{
                            width: 154px;
                            height: 154px;
                        }
                    }
                }
                .goods-group{
                    padding: 0 24px;
                }
                .pay-amount{
                    text-align: right;
                    font-size: 34px;
                    font-weight: bold;
                    color: #222222;
                    padding-right: 24px;
                    .text{
                        font-size: 28px;
                        font-weight: 400;
                        color: #222222;
                    }
                    .unit{
                        font-size: 26px;
                        font-weight: bold;
                        color: #222222;
                    }
                }
                .button-box{
                    display: flex;
                    padding: 0 24px;
                    justify-content: flex-end;
                    margin-top: 20px;
                    .button--detail{
                        font-size: 26px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #F16542;
                        width: 168px;
                        height: 60px;
                        border-radius: 12px;
                        word-break: keep-all;
                        border-color: #F16542 !important;
                    }
                    .button--pay{
                        font-size: 26px;
                        font-weight: 400;
                        color: #FFFFFF;
                        width: 142px;
                        height: 60px;
                        background: #F16542;
                        border-radius: 12px;
                        border: initial;
                    }
                    .button--cancel{
                        font-size: 26px;
                        font-weight: 400;
                        color: #222;
                        width: 168px;
                        height: 60px;
                        word-break: keep-all;
                        // background: #F16542;
                        border-radius: 12px;
                        margin-right: 30px;
                        // border: initial;
                    }
                }
            }
        }
    }
}
</style>
