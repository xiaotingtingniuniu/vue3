
<template>
    <div class="salesOrders">
        <van-nav-bar fixed placeholder :title="$route.meta.title" z-index="10" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="closePage" >
                    <van-image :src="require('@/assets/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <div class="so_main">
            <div class="so_tab">
                <van-tabs v-model:active="active"  title-active-color="#FE7E41" title-inactive-color="#191919" :sticky="true" color="#FD7E41" @click-tab="onClickTab">
                    <van-tab v-for="tab in tabs" :key="tab.name" :name="tab.name" :title="tab.label">
                        <div class="searchList">
                            <div  class="div-input">
                                <van-field left-icon="search" v-model="searchNo" autofocus placeholder="请输入设备编号或订单号" @search="searchClick" :clearable='true'/>
                            </div>
                            <div class="search_date">
                                <div class="fieldClose">
                                    <van-field v-model="selectDate" :clearable='true' placeholder="选择日期" @click="showPopup" readonly />
                                    <img v-if="selectDate == '' ? timeClose = false : timeClose = true" src="@/assets/close.png"
                                         alt="" class="closeImg" @click="cancelData">
                                </div>
                                <div class="isShowData">
                                    <van-popup
                                        v-model:show="show"
                                        position="bottom"
                                        :style="{ height: '45%' }"
                                        :close-on-click-overlay="true"
                                    >
                                        <van-datetime-picker
                                            v-model="currentDate"
                                            type="date"
                                            title="选择日期"
                                            :formatter="formatter"
                                            @cancel="closeDate()"
                                            @confirm='determine()'
                                        />
                                    </van-popup>
                                </div>
                            </div>
                            <div class="search-btn">
                                <van-button class="searchTitle" @click="searchClick">搜索</van-button>
                            </div>
                        </div>
                        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                            <van-list
                                v-if="orderInfo.length"
                                v-model:loading="orderLoading"
                                :finished="orderFinished"
                                finished-text="没有更多了"
                                @load="getList"
                                :immediate-check="false"
                                class="so_list"
                            >
                                <div class="normal-list" v-for="(item,index) in orderInfo" :key="index" @click="jump(item.orderNoSub,item.applyCode,index)">
                                    <div class="item-title">
                                        <div class="item-title-left">
                                            <img src="@/assets/replenishmentImg/grouping2x.png" alt="">
                                            <p>{{item.deviceName}}</p>
                                        </div>
                                        <div class="item-title-right" >
                                            <div v-if="item.processName === ('待支付' || '退款待处理' || '开门中')" class="orang_color">{{item.processName}}</div>
                                            <div v-else-if="item.processName === ('已完成' || '退款完成' || '退款成功')" class="grancy_color">{{item.processName}}</div>
                                            <div v-else-if="item.processName === ('退款处理中')" class="green_color">{{item.processName}}</div>
                                            <div v-else-if="item.processName === ('退款拒绝' || '退款失败')" class="red_color">{{item.processName}}</div>
                                            <div v-else class="grancy_color">{{item.processName}}</div>
                                        </div>
                                    </div>
                                    <div class="item-goods-content">
                                        <div class="goods-item-img">
                                            <template v-if="item.skuUrlList?.length">
                                                <van-image
                                                    class="img"
                                                    v-for="img in item.skuUrlList"
                                                    :key="img"
                                                    fit="contain"
                                                    :src="img"
                                                    :error-icon="errorIcon"
                                                    :loading-icon="errorIcon"
                                                />
                                            </template>
                                            <img v-else class="img" :src="errorIcon" alt=""  />
                                        </div>
                                        <div class="item_count">共<span>{{item?.skuQuantity || 0}}</span>件</div>
                                    </div>
                                    <div class="item-content">
                                        <div class="item-content-time">{{item.startTime}}</div>
                                        <div class="item-content-price">合计：<span class="unit">¥</span><span class="price">{{(item.payAmount / 100).toFixed(2)}}</span></div>
                                    </div>
                                </div>
                            </van-list>
                            <div class="bg-img" v-else>
                                <div class="img"></div>
                                <div class="no_text">暂无数据</div>
                            </div>
                        </van-pull-refresh>
                    </van-tab>
                </van-tabs>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onActivated } from 'vue'
import { getSaleListV10 } from '@/api/order.js'
import { Toast } from 'vant'
import { newPage, closePage } from '@/utils/composables'
import { tabs } from './index'
import errorIcon from '../../../assets/default.png'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = ref(Number(route.params.active || 0))
// tab页
const pageSize = ref(10)
const pageNum = ref(1)
// 加载状态
const show = ref(false) // 是否显示时间弹层
// 是否显示时间取消icon
const timeClose = ref(false)
// 关键字搜索
const searchNo = ref('')
const selectDate = ref(null)
const orderInfo = ref([])
const refreshing = ref(false)

const showPopup = (val) => { // 显示弹层
    show.value = true
}
const closeDate = () => { // 关闭弹层
    show.value = false
}
// 时间弹层变量
const currentDate = ref(new Date()) // 当前时间
const formatter = (type, val) => {
    console.log(type, val, 'picker')
    if (type === 'year') {
        return `${val}`
    }
    if (type === 'month') {
        return `${val}`
    }
    if (type === 'day') {
        return `${val}`
    }
    return val
}
// 时间确定按钮
const determine = () => {
    console.log(currentDate.value, 'currentDate')
    show.value = false
    selectDate.value = timeFormat(currentDate.value)
}
const timeFormat = (tiem) => {
    const year = tiem.getFullYear()
    let month = tiem.getMonth() + 1
    let day = tiem.getDate()
    month = month < 10 ? ('0' + month) : month
    day = day < 10 ? ('0' + day) : day
    return year + '-' + month + '-' + day
}
// 点击icon取消时间
const cancelData = () => {
    selectDate.value = ''
    timeClose.value = false
}
// 搜索
const searchClick = () => {
    pageNum.value = 1
    getList()
}
// 点击按钮跳转到订单详情
const jump = (orderNoSub = null, applyCode) => {
    newPage(`/salesOrders/detail/${orderNoSub || null}/${applyCode}?showNavbar=0`)
}
// tabs 切换
const onClickTab = async (val) => {
    console.log(active.value, 'active')
    pageNum.value = 1
    orderInfo.value = []
    getList()
}

// 获取列表数据
const getList = async () => {
    orderLoading.value = true
    orderFinished.value = false
    const param = {
        pageNo: pageNum.value,
        pageSize: pageSize.value,
        processStatusList: tabs.find(el => el.name === active.value).status,
        searchKey: searchNo.value, // 设备号
        orderDate: selectDate.value || '' // 日期
    }
    const res = await getSaleListV10(param)
    if (res.code === '200') {
        formatList({ total: res.data.count, data: res.data.data })
        pageNum.value++
    } else {
        Toast({
            message: res.message,
            duration: 2000
        })
    }
    orderLoading.value = false
    if (refreshing.value) refreshing.value = false
}
const formatList = (res) => {
    console.log(res, 'format')
    const tempList = (pageNum.value === 1) ? (res.data || []) : [...orderInfo.value, ...res.data]
    orderInfo.value = tempList
    if (tempList.length >= res.total) {
        orderFinished.value = true
    }
}

const onRefresh = () => {
    orderLoading.value = true
    // 重新加载数据
    // 将 loading 设置为 true，表示处于加载状态
    pageNum.value = 1
    getList()
}
// 订单列表
const orderLoading = ref(false)
const orderFinished = ref(false)
onActivated(async () => {
    pageNum.value = 1
    getList()
})

</script>
<style lang="scss">
.salesOrders .van-sticky--fixed {
    top: var(--van-nav-bar-height) !important;
}
</style>
<style lang="scss" scoped>
@mixin flex {
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.salesOrders{
    width: 100vw;
    background: #F4F5F5;
    display: flex;
    flex-direction: column;
    .van-nav-bar__placeholder{
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            background-color: #fff;
            .icon--unselect{
                .van-image{
                    width: 19px;
                    height: 31px;
                }
            }
        }
        :deep(.van-nav-bar::after){
            content: initial;
        }
    }
    .normal-list {
        margin: 20px 30px;
        background: #FFFFFF;
        border-radius: 8px;
        padding: 0 30px;
        .item-title {
            display: flex;
            justify-content: space-between;
            padding: 30px 0;
            height: 40px;
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 40px;
            &-left {
                display: flex;
                align-items: center;
                img {
                    margin-right: 8px;
                    width: 30px;
                    height: 30px;
                }
            }
            &-right {
                font-size: 24px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999990;
            }
        }
        .item-content {
            display: flex;
            justify-content: space-between;
            padding: 30px 0;
            border-top: 2px solid #EDEDED;
            height: 40px;
            line-height: 40px;
            &-time {
                font-size: 22px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999;
            }
            &-price {
                font-size: 22px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                .unit {
                    margin-right: 6px;
                    font-size: 20px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #FE7E41;
                }
                .price {
                    font-size: 28px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 500;
                    color: #FE7E41;
                }
            }
        }
        .item-goods-content {
            display: flex;
            justify-content: space-between;
            justify-items: center;
            align-items: center;
            padding-top: 30px;
            padding-bottom: 20px;
            .goods-item-img{
                width: 500px;
                overflow-x: scroll;
                white-space: nowrap;
                .img{
                    display: inline-block;
                    margin-right: 10px;
                    width: 120px;
                    height: 120px;
                }
            }
            .van-image{
                :deep(.van-icon__image) {
                    width: 120px;
                    height: 120px;
                }
            }
            .item_count{
                font-size: 20px;
                font-weight: 400;
                color: #494849;
                letter-spacing: 1px;
            }
        }
    }
    .so_main{
        .so_tab{
            .van-tabs{
                 .so_filter{
                    :deep(.van-tabs__wrap){
                        height: 112px;
                        line-height: 112px;
                        display: flex;
                        justify-content: flex-start;
                    }
                    :deep(.van-tabs__nav){
                        border: none;
                        padding-left:10px;
                        background: #F4F5F5;
                        margin-top: 25px;
                        font-weight: 400;
                        color: #696969;
                        margin-left: 10px;
                    }
                    :deep(.van-tab--card){
                        width: 152px;
                        color: #696969;
                        border: none;
                        font-size: 24px;
                        border-radius: 8px;
                        border: 1px solid #BBBBBB;
                        margin-left: 20px;
                        box-sizing: border-box;
                    }
                    :deep(.van-tab--active){
                        background: #FFFFFF;
                        font-size: 24px;
                        font-weight: 400;
                        color: #FE7E41;
                        box-sizing: border-box;
                        border: 1px solid #FE7E41;
                    }

                }
            }
            .no-data{
                width: max-content;
                text-align: center;
                margin: 87px auto 0;
        .no-data-bg{
            width: 418px;
            height: 319px;
            background-color: #F7F7F7;
            background-image: url('~@/assets/bag_img.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }
        .no-data-tip{
            font-size: 26px;
            font-weight: 400;
            color: #222222;
        }
    }

        }
        .searchList{
            height: 102px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-right: 30px;
            padding-left: 30px;
            background: #FFFFFF;
            .div-input{
                margin-top: 20px;
                margin-bottom: 20px;
                .van-field{
                    height: 62px;
                    width: 354px;
                    padding-left: 16px;
                    background: #F4F5F5;
                    border-radius: 8px;
                    font-size: 24px;
                    font-weight: 400;
                    color: #BBBBBB;
                    align-items: center;
                }

            }
            .search_date{
                margin-top: 20px;
                margin-bottom: 20px;
                .fieldClose{
                    .van-field{
                        height: 62px;
                        width: 204px;
                        padding-left: 16px;
                        background: #F4F5F5;
                        border-radius: 8px;
                        font-size: 24px;
                        font-weight: 400;
                        color: #BBBBBB;
                        align-items: center;
                    }
                }
            }
            .search-btn{
                margin-top: 20px;
                margin-bottom: 20px;
                .van-button{
                    height: 62px;
                    background: #FE7E41;
                    border-radius: 8px;
                    font-size: 24px;
                    font-weight: 400;
                    color: #FFFFFF;
                }
            }
        }
        .bg-img{
            width: 100vw;
            height: calc(100vh - 290px);
            padding-top: 200px;
            background-color: #fff;
            text-align: center;
            .img{
                width: 418px;
                height: 319px;
                margin: 0 auto;
                background-color: #fff;
                background-image: url('~@/assets/bag_img.png');
                background-size: 100% 100%;
                background-repeat: no-repeat;
            }
            .no_text{
                font-size: 30px;
                font-weight: 400;
                color: #888888;
            }
        }
        .so_list{
            .item_become{
                color: #B0B0B0;
            }
            .green_color{
                color: #69925A;
            }
            .red_color{
                color: #FF2442;
            }
            .orang_color{
                color: #FE7E41;
            }
            .grancy_color{
                color: #B0B0B0;
            }
        }
    }
    .input{
        height: 62px;
        background: #F4F5F5;
        border-radius: 8px;
        font-size: 24px;
    }
    .van-search{
        margin-top: -10px;
        height: 78px;
        width: 365px;
    }
    .van-haptics-feedback{
        color: #FE7E41;
        font-size: 30px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
    }
    .van-picker__cancel{
        color: #000;
        font-size: 30px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
    }
    .van-ellipsis{
        font-size: 32px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191919;
    }
    .van-field__left-icon{
        width: 24px;
        height: 24px;
        background: url('~@/assets/replenishmentImg/search2x.png');
        background-size: 24px 24px;
        // margin-top: 9px;
    }
    .van-icon-search:before{
        display: none;
    }
    .fieldClose{
        width: 210px;
        position: relative;
        .closeImg{
            width: 30px;
            height: 30px;
            position: absolute;
            top: 18px;
            right: 10px;
        }
    }
    .van-badge--dot{
        margin-top: 15px;
        margin-right: -13px !important;
    }
    .van-search__content{
        padding-left: 16px;
        padding-top: -1px;
        margin-top: 2px;
        height: 62px;
        border-radius: 8px;
    }
    .van-popup--bottom{
        height: 45% !important;
    }
}
</style>
