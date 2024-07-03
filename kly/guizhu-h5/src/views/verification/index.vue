<template>
    <div class="verification">
        <van-nav-bar fixed placeholder :title="$route.meta.title" z-index="10" right-text="新增核销" @click-right="onClickRight" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="closePage" >
                    <van-image :src="require('@/assets/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <div class="search">
            <van-field left-icon="search" v-model="keys" autofocus placeholder="请输入商品名称或门店名称" :clearable='true'/>
            <div class="text" @click="search">搜索</div>
        </div>
        <div class="timebtn">
            <div class="btn" v-for="(item, index) in btntitle" :key="index" @click="timeSerch(index)" :class="active === index ? 'btncolor-index' : 'btn'">{{item.name}}</div>
        </div>
        <div class="customtime" v-if="customtime">
            <van-field
                v-model="startTime"
                readonly
                name="datePicker"
                input-align="center"
                label=""
                placeholder="开始时间"
                @click="showStartDatePicker = true"
                :rules="[{ required: true, message: '请选择开始时间' }]"
            />
            <van-popup v-model:show="showStartDatePicker" position="bottom">
                <van-datetime-picker
                    v-model="currentDate"
                    type="date"
                    title="选择年月日"
                    :min-date="minDate"
                    :max-date="maxStartTime"
                    @confirm="startDateChange"
                    @cancel="showStartDatePicker = false"
                />
            </van-popup>
            <div class="text"></div>
            <van-field
                v-model="endTime"
                readonly
                input-align="center"
                name="datePicker"
                label=""
                placeholder="结束时间"
                @click="showEndDatePicker = true"
                :rules="[{ required: true, message: '请选择结束时间' }]"
            />
            <van-popup v-model:show="showEndDatePicker" position="bottom">
                <van-datetime-picker
                    v-model="nextcurrentDate"
                    type="date"
                    title="选择年月日"
                    :min-date="endMinTime"
                    @confirm="endDateChange"
                    @cancel="showEndDatePicker = false"
                />
            </van-popup>
        </div>
        <div class="saledetail">
            <div class="salecount">
                <div>售出数量</div>
                <div class="count" style="margin-top:12px">{{dataState?.sellNum ? dataState?.sellNum : 0}}</div>
            </div>
            <div class="saleprice">
                <div>售出金额</div>
                <div class="count" style="margin-top:12px">￥{{dataState?.sellAmount ? ((dataState?.sellAmount/100).toFixed(2)) : 0}}</div>
            </div>
            <div class="verifcount">
                <div>核销数量</div>
                <div class="count" style="margin-top:12px">{{dataState?.voucherNum ? dataState?.voucherNum : 0}}</div>
            </div>
            <div class="verifprice">
                <div>核销金额</div>
                <div class="count" style="margin-top:12px">￥{{dataState?.voucherAmount ? ((dataState?.voucherAmount/100).toFixed(2)) : 0}}</div>
            </div>
        </div>
        <div class="salecontent">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list
                    v-if="orderInfo.length"
                    v-model:loading="loading"
                    :finished="searchFinished"
                    finished-text="没有更多了"
                    @load="getList"
                    :immediate-check="false"
                >
                    <div class="verification-list" v-for="item in orderInfo" :key="item" :title="item">
                        <div class="verification-title">
                            <van-icon :name="require('@/assets/verification/shop.png')" size="18"/>
                            <div class="title--name">{{item.storeName}}</div>
                            <div class="title--price">￥{{(item.specialPrice/100).toFixed(2)}}</div>
                        </div>
                        <div class="verification-content">
                            <div class="content-image">
                                <img class="img" :src="item.goodsList[0].skuPictureUrl" alt=""/>
                            </div>
                            <div class="contnet-text">
                                <div class="text">商品名称：{{item.goodsList[0].skuName}}</div>
                                <div class="text">核销人：{{item.verifyUserName}}</div>
                                <div class="text">核销时间：{{item.verifyDate}}</div>
                                <div class="text">接待日期：{{item.useTimeContent.weeks.toString()}}</div>
                                <div class="text">接待时间：{{item.useTimeContent.timeRanges.toString()}}</div>
                            </div>
                        </div>
                    </div>
                </van-list>
                <div class="nodata-img" v-else>
                    <div class="img"></div>
                    <div class="text">暂无核销数据</div>
                </div>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script setup>
import { ref, onActivated } from 'vue'
import { queryList, verificationcount } from '@/api/verification.js'
// import { abnormalList } from '@/api/order.js'
// import { Toast } from 'vant'
import { closePage, newPage } from '@/utils/composables'

const btntitle = ref([
    {
        name: '全部'
    },
    {
        name: '今天'
    },
    {
        name: '昨天'
    },
    {
        name: '过去7天'
    },
    {
        name: '过去30天'
    },
    {
        name: '自定义'
    }
])
const active = ref(0)
const keys = ref('')
const refreshing = ref(false)
const loading = ref(false)
const searchFinished = ref(false)
const pageSize = ref(10)
const pageNum = ref(1)
const orderInfo = ref([])
const startTime = ref()
const endTime = ref()
const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 10))
const maxStartTime = ref()
const currentDate = new Date()
const nextcurrentDate = new Date()
const endMinTime = new Date(new Date().setFullYear(new Date().getFullYear() - 10))
const showStartDatePicker = ref(false)
const showEndDatePicker = ref(false)
const startDateChange = (selectedValues) => {
    showStartDatePicker.value = false
    startTime.value = getTime(selectedValues)
    endMinTime.value = selectedValues
}
const time = ref('')
const getTime = (date) => {
    const _D = new Date(date)
    time.value = _D
    const H = _D.getMonth() + 1
    const D = _D.getDate()
    return `${_D.getFullYear()}-${H > 9 ? H : ('0' + H)}-${D > 9 ? D : ('0' + D)}`
}
const endDateChange = (selectedValues) => {
    showEndDatePicker.value = false
    endMinTime.value = selectedValues
    endTime.value = getTime(selectedValues)
    active.value = 5
    pageNum.value = 1
    getList(5)
    verifcount(5)
}
onActivated(async () => {
    pageNum.value = 1
    await getList(0)
    await verifcount(0)
    await timeSerch(0)
})
const onClickRight = () => {
    newPage('/verification?showNavbar=0')
}
const search = () => {
    pageNum.value = 1
    getList()
    verifcount()
}
const dataState = ref(null)
// const dataState = reactive({
//     sellNum: 0,
//     sellAmount: 0,
//     voucherNum: 0,
//     voucherAmount: 0
// })
const verifcount = async (val) => {
    const date2 = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
    const param = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        dayTime: val,
        startDate: startTime.value ? `${startTime.value} 00:00:00` : '',
        endDate: endTime.value ? `${endTime.value} ${date2.getHours() + ':' + date2.getMinutes() + ':' + date2.getSeconds()}` : '',
        keys: keys.value
    }
    const res = await verificationcount(param)
    if (res.code === '200') {
        dataState.value = res.data
        // Object.assign(dataState.value, ...res.data)
    }
}
const getList = async (val) => {
    console.log('debugger')
    const date2 = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
    loading.value = true
    searchFinished.value = false
    const param = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        dayTime: val,
        startDate: startTime.value ? `${startTime.value} 00:00:00` : '',
        endDate: endTime.value ? `${endTime.value} ${date2.getHours() + ':' + date2.getMinutes() + ':' + date2.getSeconds()}` : '',
        keys: keys.value
    }
    const res = await queryList(param)
    console.log(res, 'res--')
    if (res.code === '200') {
        formatList({
            total: res.count,
            data: res.data === null ? [] : res.data
        })
        pageNum.value++
        loading.value = false
        if (refreshing.value) refreshing.value = false
    } else {
        // 验证
        // Toast({
        //     message: res.msg,
        //     duration: 2000
        // })
    }
}
const formatList = (res) => {
    console.log(res, 'format')
    const tempList = (pageNum.value === 1) ? (res.data || []) : [...orderInfo.value, ...res.data]
    orderInfo.value = tempList
    if (tempList.length >= res.total) {
        searchFinished.value = true
    }
}
const onRefresh = () => {
    searchFinished.value = true
    pageNum.value = 1
    getList(active.value)
    verifcount(active.value)
}
// const bgcolor = ref(false)
const customtime = ref(false)
const timeSerch = (val) => {
    if (val === 5) {
        customtime.value = true
        active.value = val
    } else {
        startTime.value = ''
        endTime.value = ''
        customtime.value = false
        active.value = val
        pageNum.value = 1
        getList(val)
        verifcount(val)
    }
    // active.value = val
    // pageNum.value = 1
    // getList(val)
    // verifcount(val)
}
</script>
<style lang="scss" scoped>
@mixin flex {
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.verification{
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
        :deep(.van-nav-bar__text){
            color: #FE7E41;
        }
    }
    :deep(.van-search__content){
        border-radius: 31px;
        background-color: #F3F5F6;
    }
    .timebtn{
        padding: 32px 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #FFF;
        .btn{
            font-size: 22px;
            padding: 8px 16px;
            background-color: #F4F5F5;
            border-radius: 31px;
            color: #696969;
        }
        .btncolor-index{
            color: #FFF;
            background: linear-gradient(90deg, #FE7E41  0%, #FF5D0F  100%);
        }
    }
    .search{
        margin-top: 1px;
        padding: 20px 30px 0px 30px;
        background-color: #FFF;
        display: flex;
        align-items: center;
        justify-content: space-between;
        :deep(.van-cell){
            width: 608px;
            height: 62px;
            background-color: #F3F5F6;
            border-radius: 31px;
            margin: 0 auto;
            font-size: 26px;
            align-items: center;
        }
        .text{
            color: #696969;
            font-size: 26px;
        }
    }
    .customtime{
        display: flex;
        align-items: center;
        // padding-bottom: 32px;
        background-color: #FFF;
        :deep(.van-field__body){
            width: 290px;
            height: 52px;
            border-radius: 26px;
            background-color: #F4F5F5;
        }
        .text{
            height: 4px;
            width: 36px;
            background-color: #D8D8D8;
        }
    }
    .saledetail{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20px 0;
        padding: 22px 30px;
        font-size: 26px;
        background-color: #FFF;
        color: #191919;
        text-align: center;
        .salecount .saleprice .verifcount .verifprice{
            .count{
            }
        }
    }
    .salecontent{
        .verification-list{
            background-color: #FFF;
            padding: 24px 30px 8px 30px;
            margin-bottom: 20px;
            .verification-title{
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-bottom: 12px;
                border-bottom: 1px solid #F4F5F5 ;
                .title--name{
                    flex: 1;
                    font-size: 30px;
                    padding-left: 10px;
                }
                .title--price{
                    color: #FE7E41;
                    font-size: 28px;
                    font-weight: bold;
                }
            }
            .verification-content{
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                margin-top: 24px;
                .content-image{
                    width: 134px;
                    height: 134px;
                    // background-color: red;
                    border-radius: 8px;
                    .img{
                        width: 134px;
                        height: 134px;
                        border-radius: 8px;
                    }
                }
                .contnet-text{
                    padding-left: 32px;
                    // margin-bottom: 16px;
                    font-size: 24px;
                    color: #999999;
                    .text{
                        padding-bottom: 16px;
                    }
                }
            }
        }
        .nodata-img{
            padding-top: 222px;
            text-align: center;
            .img{
                margin: 0 auto;
                width: 216px;
                height: 216px;
                background-image: url('~@/assets/verification/veriffail.png');
                background-size: 100% 100%;
                background-repeat: no-repeat;
            }
            .text{
                margin: 0 auto;
                font-size: 36px;
                color: #191919;
                font-weight: bold;
            }
        }
    }
}
</style>
