
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
                <van-tabs v-model:active="active"  title-active-color="#FE7E41" title-inactive-color="#191919" @click-tab="onClickTab">
                    <van-tab title="订单列表" name="orderList" :dot="orderNum>0">
                        <van-tabs v-model:active="activeName" class="so_filter" type="card"  title-active-color="#FE7E41" title-inactive-color="#696969"  @click-tab="onClick">
                            <van-tab title="全部" name=""></van-tab>
                            <van-tab title="待支付" name="100"></van-tab>
                            <van-tab title="已完成" name="600"></van-tab>
                            <van-tab title="退款/售后" name="700" :badge="orderNum>99?'99+':orderNum===0?null:orderNum"></van-tab>
                        </van-tabs>
                        <div class="searchList">
                            <div  class="div-input">
                                <van-field left-icon="search" v-model="searchNo" autofocus placeholder="请输入设备编号或订单号" @search="onSearch" :clearable='true'/>
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
                                            type="year-month"
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
                                @load="getOrderList"
                                :immediate-check="false"
                                class="so_list"
                            >
                                <div class="listItem" v-for="(item,index) in orderInfo" :key="index" @click="jump(item.orderNoSub,item.orderStatus,index)">
                                    <div class="item_title">
                                        <div class="titleBox">
                                            <div class="titleImg">
                                                <img src="@/assets/replenishmentImg/grouping2x.png" alt="">
                                            </div>
                                            <p>{{item.equipmentAddr}}</p>
                                        </div>
                                        <div class="item_statu" >
                                            <div  :class="{
                                                orang_color: item.orderStatus === '待支付'|| item.orderStatus === '退款待处理',
                                                grancy_color: item.orderStatus === '已完成'|| item.orderStatus === '退款完成'|| item.orderStatus === '退款成功',
                                                green_color: item.orderStatus === '退款处理中',
                                                red_color: item.orderStatus === '退款拒绝' || item.orderStatus === '退款失败'
                                            }">{{item.orderStatus}}</div>
                                        </div>
                                    </div>
                                    <div class="item_content">
                                        <div class="slide">
                                            <div class="item_img" v-for="(subItem,index) in item.goodsList" :key="index">
                                                <img class="img" :src="subItem.skuImgUrl" alt="">
                                            </div>
                                        </div>
                                        <div class="item_count">共<span>{{item.skuCount}}</span>件</div>
                                    </div>
                                    <div class="item_footer">
                                        <p>{{item.createOrderTime}}</p>
                                        <div>合计:
                                            <img src="@/assets/replenishmentImg/Group@2x.png" alt="" class="moneyBox">
                                            <span  class="total-price">{{(item.totalAmount/100).toFixed(2)}}</span>
                                        </div>
                                    </div>
                                </div>
                            </van-list>
                            <div class="bg-img" v-else>
                                <div class="img"></div>
                                <div class="no_text">暂无数据</div>
                            </div>
                        </van-pull-refresh>

                        <!-- <div v-else class="no-data">
                            <div class="no-data-bg"></div>
                            <div class="no-data-tip">暂无数据</div>
                        </div> -->
                    </van-tab>
                    <van-tab title="开门记录" name="openBehavior" :dot="abnormalNum>0">
                        <van-tabs v-model:active="behaviorName" class="so_filter" type="card" title-active-color="#FE7E41" title-inactive-color="#696969"  @click-tab="onClickopen">
                            <van-tab title="识别中" name="5" class="tabs-wight"></van-tab>
                            <van-tab title="已完成" name="12" class="tabs-wight"></van-tab>
                            <van-tab title="异常" name="8" :badge="abnormalNum>99?'99+':abnormalNum === 0?null:abnormalNum" class="tabs-wight"></van-tab>
                            <div class="searchList">
                                <div  class="div-input">
                                    <van-field   left-icon="search" v-model="searchkey" :clearable='true'  autofocus placeholder="请输入设备编号或订单号" @search="onSearch"/>
                                </div>
                                <div class="search_date">
                                    <div class="fieldClose">
                                        <van-field v-model="selectDates" :clearable='true' placeholder="选择日期" @click="showPopups" readonly />
                                        <img v-if="selectDates == '' ? timeClose = false : timeClose = true" src="@/assets/close.png"
                                             alt="" class="closeImg" @click="cancelDatas">
                                    </div>
                                    <div class="isShowData">
                                        <van-popup
                                            v-model:show="showP"
                                            position="bottom"
                                            :style="{ height: '45%' }"
                                            :close-on-click-overlay="true"
                                        >
                                            <van-datetime-picker
                                                v-model="currentDates"
                                                type="year-month"
                                                title="选择日期"
                                                :min-date="minDate"
                                                :max-date="maxDate"
                                                :formatter="formatter"
                                                @cancel="closeDates()"
                                                @confirm='determines()'
                                            />
                                        </van-popup>
                                    </div>
                                </div>
                                <div class="search-btn">
                                    <van-button class="searchTitle" @click="searchClicks">搜索</van-button>
                                </div>

                            </div>
                            <van-pull-refresh v-model="refreshingWork" @refresh="onRefreshWork">
                                <van-list
                                    v-if="behaviorName !== '8' &&openDoorInfo.length"
                                    v-model:loading="loading"
                                    :finished="finished"
                                    finished-text="没有更多了"
                                    @load="getOpenDoorList"
                                    :immediate-check="false"
                                    class="so_list">
                                    <div class="listItems" v-for="(item,index) in openDoorInfo" :key="index" @click="gotoDetail(item.deviceInfo.deviceCode,item.consumerId,item)">
                                        <div class="item_title">
                                            <div class="titleBox">
                                                <div class="titleImg">
                                                    <img src="@/assets/replenishmentImg/grouping2x.png" alt="">
                                                </div>
                                                <p>{{item.deviceInfo.deviceName?item.deviceInfo.deviceName:''}}</p>
                                            </div>
                                            <div class="item_statu">
                                                <div class="item_paid">{{item.openDoorStatus}}</div>
                                            </div>
                                        </div>
                                        <div class="item_content" >
                                            <div class="slideBox" v-if="item.goodsLis">
                                                <div class="item_imgs"  v-for="(el,index) in item.goodsList" :key="index">
                                                    <img class="img" :src="el.skuImgUrl" alt="" v-if="el.skuImgUrl">

                                                </div>
                                            </div>
                                            <div class="slideBox" v-else>
                                                <div class="item_imgs"  >
                                                    <img class="img" src="../../assets/default.png" alt="">
                                                </div>
                                            </div>

                                        <!-- <div class="slideBox" v-for="(el,index) in item.goodsList" :key="index">
                                            <div class="item_imgs" >
                                                <img class="img" :src="el.skuImgUrl" alt="" v-if="el.skuImgUrl">
                                                <img class="img" src="@/assets/default.png" alt="" v-else>
                                            </div>
                                            <img class="img" src="../../assets/default.png" alt="" >
                                        </div> -->
                                        <!-- <div class="item_count">共<span>{{item.totalQuantity}}</span>件</div> -->
                                        </div>
                                        <div class="item_footer">
                                            <p>{{item.openDoorTime}}</p>
                                        <!-- <div>合计:
                                            <img src="@/assets/replenishmentImg/Group@2x.png" alt="" class="moneyBox">
                                            <span  class="total-price">{{item.orderCost}}</span>
                                        </div> -->
                                        </div>
                                    </div>
                                </van-list>
                                <van-list  v-if="behaviorName === '8' &&workOrderList.length"
                                           v-model:loading="erroeLoading"
                                           :finished="errorFinished"
                                           finished-text="没有更多了"
                                           @load="getabnormalList"
                                           :immediate-check="false"
                                           class="goods-list">
                                    <div  v-for="(item, index) in workOrderList" :key="index">
                                        <goods-item :goods="item" :class="index === 0 ? '' : 'van-hairline--top'" @click="gotoWorkDetail(item.workOrderNo)"/>
                                    </div>
                                </van-list>
                                <!-- v-if="(behaviorName !== '8' && openDoorInfo.length === 0) || (behaviorName === '8' && workOrderList.length === 0)" -->
                                <div class="bg-img" v-if="(behaviorName !== '8' && openDoorInfo.length === 0) || (behaviorName === '8' && workOrderList.length === 0)">
                                    <div class="img"></div>
                                    <div class="no_text">暂无数据</div>
                                </div>
                            </van-pull-refresh>

                        </van-tabs>
                    </van-tab>
                </van-tabs>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onActivated } from 'vue'
import GoodsItem from './details/listItem.vue'
import { orderList, openDoorList, saleOrderCount, abnormalList, workOrderCount } from '@/api/order.js'
import { Toast } from 'vant'
import { closePage, newPage } from '@/utils/composables'
import { setAppStorageFn } from '@/utils/storage'

const active = ref('orderList')
// tab页
const activeName = ref('')
const behaviorName = ref(5)
const pageSize = ref(10)
const pageNum = ref(1)
// 加载状态
const loading = ref(false)
const finished = ref(false)
const show = ref(false) // 是否显示时间弹层
const showP = ref(false) // 是否显示时间弹层
// 是否显示时间取消icon
const timeClose = ref(false)
// 关键字搜索
const searchNo = ref('')
const searchkey = ref(null)
const selectDate = ref(null)
const selectDates = ref('')
const orderInfo = ref([])
const openDoorInfo = ref([])
const orderNum = ref('')
const refreshing = ref(false)
const refreshingWork = ref(false)
const erroeLoading = ref(false)
const errorFinished = ref(false)

const showPopups = () => { // 显示弹层
    console.log(selectDate.value, 'selectDate.value')
    showP.value = true
}
const showPopup = (val) => { // 显示弹层
    show.value = true
}
const closeDate = () => { // 关闭弹层
    show.value = false
}
const closeDates = () => { // 关闭弹层
    showP.value = false
}
const onSearch = () => {

}
// 时间弹层变量
const currentDate = ref(new Date()) // 当前时间
const currentDates = ref(new Date()) // 当前时间
const formatter = (type, val) => {
    if (type === 'year') {
        return `${val}`
    }
    if (type === 'month') {
        return `${val}`
    }
    return val
}
// 时间确定按钮
const determine = () => {
    show.value = false
    selectDate.value = timeFormat(currentDate.value)
}
const determines = () => {
    showP.value = false
    selectDates.value = timeFormat(currentDates.value)
}
const timeFormat = (tiem) => {
    const year = tiem.getFullYear()
    let month = tiem.getMonth() + 1
    month = month < 10 ? ('0' + month) : month
    return year + '-' + month
}
// 点击icon取消时间
const cancelData = () => {
    selectDate.value = ''
    timeClose.value = false
}
const cancelDatas = () => {
    selectDates.value = ''
    timeClose.value = false
}
// 搜索
const searchClick = () => {
    pageNum.value = 1
    getOrderList()
}
const searchClicks = async () => {
    pageNum.value = 1
    if (behaviorName.value !== '8') {
        await getOpenDoorList()
    } else {
        await getabnormalList()
    }
}
const abnormalNum = ref(null)

// const abnormalNum = ref(100)
// 点击按钮跳转到订单详情
const jump = (val, orderStatus) => {
    newPage(`/details/${val}/${orderStatus}?showNavbar=${0}`)
}
const gotoDetail = (deviceCode, consumerId, item) => {
    setAppStorageFn('openDetails', item)
    newPage(`/openDetails/${deviceCode}/${consumerId}?showNavbar=${0}`)
}
const gotoWorkDetail = (workOrderNo) => {
    const params = {
        workOrderNo: workOrderNo,
        showNavbar: 0
    }
    newPage(`/abnormalDetails?workOrderNo=${workOrderNo}&showNavbar=${0}`, params)
}
// tabs 切换
const onClickTab = async () => {
    pageNum.value = 1
    if (active.value === 'orderList') {
        orderInfo.value = []
        await getOrderList()
        await getsaleOrderCount()
    }
    if (active.value === 'openBehavior') {
        if (behaviorName.value !== '8') {
            openDoorInfo.value = []
            finished.value = false
            loading.value = true
            await getOpenDoorList()
        }
        if (behaviorName.value === '8') {
            workOrderList.value = []
            errorFinished.value = false
            erroeLoading.value = true
            await getabnormalList()
        }
    }
}
const onClick = () => {
    orderInfo.value = []
    pageNum.value = 1
    orderLoading.value = true
    orderFinished.value = false
    getOrderList()
}
const onClickopen = async () => {
    pageNum.value = 1
    if (behaviorName.value !== '8') {
        openDoorInfo.value = []
        finished.value = false
        loading.value = true
        await getOpenDoorList()
    }
    if (behaviorName.value === '8') {
        workOrderList.value = []
        errorFinished.value = false
        erroeLoading.value = true
        await getabnormalList()
    }
}

const onRefresh = () => {
    orderFinished.value = false
    orderLoading.value = true
    // 重新加载数据
    // 将 loading 设置为 true，表示处于加载状态
    pageNum.value = 1
    getOrderList()
}
const onRefreshWork = () => {
    pageNum.value = 1
    if (behaviorName.value !== '8') {
        getOpenDoorList()
    }
    if (behaviorName.value === '8') {
        errorFinished.value = false
        erroeLoading.value = true
        getabnormalList()
    }
}
// 订单列表
const orderLoading = ref(false)
const orderFinished = ref(false)
const getOrderList = async () => {
    orderLoading.value = true
    const param = {
        currentPage: pageNum.value,
        pageSize: pageSize.value,
        orderStatus: activeName.value,
        searchNo: searchNo.value,
        orderDate: selectDate.value

    }
    const res = await orderList(param)
    if (res.code === '200') {
        const tempList = (pageNum.value === 1) ? res.data.orderListInfos : [...orderInfo.value, ...res.data.orderListInfos]
        orderInfo.value = tempList
        if (tempList.length >= res.data.totalCount) {
            orderFinished.value = true
        }
        pageNum.value++
        orderLoading.value = false
        if (refreshing.value) refreshing.value = false
    } else {
        Toast({
            message: res.msg,
            duration: 2000
        })
    }
}
// 订单列表异常数量
const getsaleOrderCount = async () => {
    const res = await saleOrderCount({ orderStatus: 700 })
    if (res.code === '200') {
        orderNum.value = res.data.count
    } else {
        Toast({
            message: res.msg,
            duration: 2000
        })
    }
}
// 开门行为异常数量
const getWorkOrderrCount = async () => {
    const res = await workOrderCount({ workStatus: 0 })
    if (res.code === '200') {
        abnormalNum.value = res.data.count
    } else {
        Toast({
            message: res.msg,
            duration: 2000
        })
    }
}
// 开门记录
const getOpenDoorList = async () => {
    const param = {
        applyStatus: behaviorName.value,
        searchNo: searchkey.value,
        openDate: selectDates.value,
        currentPage: pageNum.value,
        pageSize: pageSize.value
    }
    const res = await openDoorList(param)
    if (res.code === '200') {
        const tempList = (pageNum.value === 1) ? res.data.openDoorInfos : [...openDoorInfo.value, ...res.data.openDoorInfos]
        pageNum.value++
        loading.value = false
        if (tempList.length >= res.data.totalCount) {
            finished.value = true
        }
        openDoorInfo.value = tempList
        if (refreshingWork.value) refreshingWork.value = false
    } else {
        Toast({
            message: res.msg,
            duration: 2000
        })
    }
}

const workOrderList = ref([])

const getabnormalList = async () => {
    const param = {
        currentPage: pageNum.value,
        pageSize: pageSize.value,
        orderStatus: activeName.value,
        searchNo: searchkey.value,
        createWorkDate: selectDates.value
    }
    const res = await abnormalList(param)
    if (res.code === '200') {
        const tempList = (pageNum.value === 1) ? res.data.workOrderInfos : [...workOrderList.value, ...res.data.workOrderInfos]
        workOrderList.value = tempList
        erroeLoading.value = false
        if (workOrderList.value.length >= res.data.totalCount) {
            errorFinished.value = true
        }
        pageNum.value++
        if (refreshingWork.value) refreshingWork.value = false
    } else {
        Toast({
            message: res.msg,
            duration: 2000
        })
    }
}
onActivated(async () => {
    await getsaleOrderCount()
    await getWorkOrderrCount()
    pageNum.value = 1
    if (active.value === 'orderList') {
        await getOrderList()
    }
    if (active.value === 'openBehavior') {
        if (behaviorName.value !== '8') {
            await getOpenDoorList()
        } else {
            await getabnormalList()
        }
    }
})

</script>
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
    .so_head{
        width: 100%;
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
            background-image: url('../../assets/bag_img.png');
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
        .so_filter{
            width: 100%;
            // position: relative;
            .badgeBox{
                position: absolute;
                top: 20px;
                right: 30px;
            }
            .van-badge--top-right{
                min-width: 45px;
                height: 30px;
                transform:none;
                border-radius: 10px;
                top: -25px;
                right: -40px;
                line-height: 24px;
            }
        }
        .so_filters{
            width: 100%;
            .van-badge--top-right{
                width: 50px;
                height: 30px;
                transform:none;
                border-radius: 10px;
                top: -25px;
                right: -60px;
            }
            .van-tab--active{
                width: 152px;
                height: 62px;
                background: #FFFFFF;
                border-radius: 8px;
                border: 1px solid #FE7E41 !important;
                color: #FE7E41 !important;
            }
            .van-tabs__wrap{
                margin:auto;
                height: 112px;
                line-height: 112px;
                 display: flex;
                justify-content: flex-start;
            }
            .van-tabs__nav{
                border: none;
                background: #F4F5F5;
                margin-top: 25px;
                font-size: 24px;
                font-weight: 400;
                color: #696969;
                margin-left: 10px;

            }
            .van-tab--card{
                color: #696969;
                border: none;
                width: 152px;
                height: 62px;
                border-radius: 8px;
                border: 1px solid #BBBBBB;
                margin-left: 20px;
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
        .so_search{
            width: 100%;
            height: 102px;
            background-color: #fff;
            display: flex;
            // justify-content: space-around;
            align-items: center;
           .van-search{
              font-size: 24px;
           }
            .search_date{
                border-radius: 8px;
                // margin-left: -20px;
                box-sizing: border-box;
                font-size: 24px;
                color: #BBBBBB;
                text-indent: 20px;
                width: 210px;
                .van-field{
                    background: #F4F5F5;
                    width: 210px;
                    height: 62px;
                    line-height: 59px;
                    border-radius: 8px;
                }
                .van-field__control{
                    margin-top: -15px;
                }
                .van-field__clear{
                    margin-top: -23px;
                }
            }
            .searchTitle{
                height: 62px;
                background: #FE7E41;
                font-size: 13px;
                color:#fff;
                border-radius: 8px;
                border: 1px solid #FE7E41;
                line-height: 62px;
                font-size: 24px;
                font-weight: 400;
                margin-right: 30px;
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
                background-image: url('../../assets/bag_img.png');
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
            width: 100%;
            flex: 1;
            // padding: 20px 30px;
            box-sizing: border-box;
            .listItems{
                background-color: #fff;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                margin: 20px 30px 0 30px;
                .item_title{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-sizing: border-box;
                    margin-top: 30px;
                    padding-left: 45px;
                    padding-right: 30px;
                    .titleBox{
                        flex: 1;
                        .titleImg{
                            display: flex;
                            img{
                                width: 30px;
                                height: 30px;
                                margin-left: -15px;
                                margin-top: 5px;
                            }
                        }
                        p{
                            font-size: 28px;
                            font-weight: 500;
                            color: #696969;
                            line-height: 33px;
                            margin-left: 25px;
                            margin-top: -29px;
                            width: 400px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                    .item_statu{
                        width: 150px;
                        font-size: 24px;
                        font-weight: 500;
                        text-align: right;
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
                .item_content{
                    overflow:hidden;
                    font-size: 20px;
                    font-weight: 400;
                    color: #494849;
                    line-height: 28px;
                    letter-spacing: 1px;
                    box-sizing: border-box;
                    flex: 1;
                    display: flex;
                    padding-right: 110px;
                    margin-left: 30px;
                    padding-top: 30px;
                padding-bottom: 20px;

                    .slideBox{
                        .item_img{
                        display: flex;
                        align-content: space-around;
                        align-items: center;
                        .img{
                            width: 120px;
                            height: 120px;
                            padding: 5px;
                            margin-right: 10px;
                            display:inline-block;
                        }
                    }
                    .item_imgs{
                        display: flex;
                        align-content: space-around;
                        align-items: center;
                        .img{
                            width: 124px;
                            height: 124px;
                            padding: 5px;
                            margin-right: 10px;
                            display:inline-block;
                        }
                    }
                    }

                    .item_count{
                        position: absolute;
                        right: 0;
                        width: 110px;
                        height: 136px;
                        line-height: 136px;
                        text-align: center;
                        // background: rgba(255, 255, 255, 0.5);
                        background: #fff;
                        color: #000;
                    }
                }
                .item_footer{
                    display: flex;
                    font-size: 22px;
                    font-weight: 400;
                    color: #B0B0B0;
                    // line-height: 30px;
                    justify-content: space-between;
                    align-items: center;
                    // padding: 20px;
                    box-sizing: border-box;
                    border-top: solid 1px #F4F5F5;
                    padding: 27px 26px;
                    span{
                        width: 94px;
                        // height: 40px;
                        font-size: 24px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 600;
                        color: #FE7E41;
                        line-height: 28px;
                    }
                    .total-price{
                        font-size: 28px;
                        font-weight: 400;
                        color: #FE7E41;
                    }
                }
            }
            .listItem{
                position: relative;
                background-color: #fff;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                // margin-bottom: 20px;
                padding: 0px;
                margin: 20px 30px 0 30px;
                .item_title{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    // padding: 20px;
                    box-sizing: border-box;
                    margin-top: 30px;
                    .titleBox{
                        flex: 1;
                        margin-left: 32px;
                        padding-left: 20px;
                        .titleImg{
                            display: flex;
                            img{
                                width: 30px;
                                height: 28px;
                                margin-left: -20px;
                                // margin-top: 10px;
                            }
                        }
                        p{
                            font-size: 28px;
                            font-family: PingFangSC-Medium, PingFang SC;
                            font-weight: 700;
                            color: #696969;
                            line-height: 33px;
                            margin-left: 20px;
                            margin-top: -30px;
                            width: 400px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                    .item_statu{
                        width: 150px;
                        height: 33px;
                        font-size: 24px;
                        font-weight: 500;
                        text-align: right;
                        margin-right: 30px;
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
                .slide{
                    overflow-x: scroll;
                    display: flex;
                }
                .slideBox{
                    overflow-x: scroll;
                    display: flex;
                }
                .item_content{
                    position: relative;
                    overflow:hidden;
                    // width: 100%;
                    font-size: 20px;
                    font-weight: 400;
                    color: #494849;
                    line-height: 28px;
                    letter-spacing: 1px;
                    box-sizing: border-box;
                    flex: 1;
                    display: flex;
                    padding-right: 110px;
                    margin-top: 30px;
                    margin-left: 30px;
                    .item_img{
                        display: flex;
                        align-content: space-around;
                        align-items: center;
                        .img{
                            width: 120px;
                            height: 120px;
                            padding: 5px;
                            margin-right: 10px;
                            display:inline-block;
                        }
                    }
                    .item_imgs{
                        display: flex;
                        align-content: space-around;
                        align-items: center;
                        .img{
                            width: 124px;
                            height: 124px;
                            padding: 5px;
                            margin-right: 10px;
                            display:inline-block;
                        }
                    }
                    .item_count{
                        position: absolute;
                        right: 0;
                        width: 110px;
                        height: 136px;
                        line-height: 136px;
                        text-align: center;
                        // background: rgba(255, 255, 255, 0.5);
                        background: #fff;
                        color: #000;
                    }
                }
                .item_footer{
                    display: flex;
                    font-size: 22px;
                    font-weight: 400;
                    color: #B0B0B0;
                    justify-content: space-between;
                    align-items: center;
                    box-sizing: border-box;
                    border-top: solid 1px #F4F5F5;
                    margin-top: 10px;
                    padding: 27px 26px;
                    span{
                        width: 94px;
                        font-size: 24px;
                        font-weight: 610;
                        color: #FE7E41;
                        margin-top: 27px;
                    }
                    .total-price{
                        font-size: 28px;
                        font-weight: 400;
                        color: #FE7E41;
                    }
                }
            }
        }
    }
    // .van_tab_line{
    //     color:#FE7E41
    // }
    .input{
        // width: 365px;
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
    // .-van-tab-active{
    //     color: #FE7E41;
    // }
    .moneyBox{
        width: 12px;
        height: 14px;
        margin-right: 5px;
        margin-top: 5px;
    }
    .van-field__left-icon{
        width: 24px;
        height: 24px;
        background: url('../../assets/replenishmentImg/search2x.png');
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
