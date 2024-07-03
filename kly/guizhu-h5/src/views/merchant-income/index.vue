<template>
    <div class="merchant-income">
        <div class="bg-box">
            <div class="cascader-bar" @click="popupShow=true">
                <div>{{ searchNames }}</div>
                <img :src="require('@/assets/replenishmentImg/triangle@2x.png')" alt="">
            </div>
            <div class="orange-card">
                <div class="board">
                    <div>
                        <div>日收入<van-icon name="question-o" /></div>
                        <div><span>¥</span>{{ toThousands((info?.dateAmount / 100).toFixed(2)) || '0.00' }}</div>
                    </div>
                    <div>
                        <div>月收入</div>
                        <div><span>¥</span>{{ toThousands((info?.monthAmount / 100).toFixed(2)) || '0.00' }}</div>
                    </div>
                </div>
                <div class="more" :class="moreActive?'roate':''">
                    <div class="price" v-if="moreActive">
                        <div class="block">
                            <div class="item"><div>分账金额</div><div>¥{{ toThousands((info?.dateMerchantAmount / 100).toFixed(2)) || '0.00' }}</div></div>
                            <div class="item"><div>优惠券补贴</div><div>¥{{ toThousands((info?.dateDisctAmount / 100).toFixed(2)) || '0.00' }}</div></div>
                        </div>
                        <div class="block">
                            <div class="item"><div>分账金额</div><div>¥{{ toThousands((info?.monthMerchantAmount / 100).toFixed(2)) || '0.00' }}</div></div>
                            <div class="item"><div>优惠券补贴</div><div>¥{{ toThousands((info?.monthDisctAmount / 100).toFixed(2)) || '0.00' }}</div></div>
                        </div>
                    </div>
                    <img @click="moreActive=!moreActive" :src="require('@/assets/replenishmentImg/arrow-down-active2.png')" alt="">
                </div>
            </div>
        </div>
        <van-tabs v-model:active="active" @change="onLoad(1)" color="#FE7E41" title-active-color="#FE7E41" title-inactive-color="#191919">
            <van-tab title="日统计"></van-tab>
            <van-tab title="月统计"></van-tab>
        </van-tabs>
        <div class="statistics">
            <div @click="datePicker = true">
                {{ active === 0 ? getDate(currentDate) : getDate(currentDate, 'YYYY-MM') }}
                <img :src="require('@/assets/replenishmentImg/triangle@2x.png')" alt="">
            </div>
            <div class="text">共{{ info?.total || '0' }}笔，收入{{ toThousands((info?.currentTotalAmount / 100).toFixed(2)) || '0.00' }}元</div>
        </div>
        <div class="list-box">
            <van-list v-model:loading="loading" @load="onLoad" :finished="finished" :immediate-check="false" finished-text="没有更多了">
                <div class="cell-item" @click="goDetail(item)" v-for="(item, index) in list"  :key="index">
                    <div class="cell-content">
                        <div class="van-ellipsis">{{ item.deviceName || '--' }}</div>
                        <div>{{ item.time || '--' }}</div>
                    </div>
                    <div class="cell-num">{{item.amount > 0 ? '+' : ''}}{{ toThousands((item.amount / 100).toFixed(2)) }}<img src="@/assets/replenishmentImg/right@2x.png" alt=""></div>
                </div>
            </van-list>
        </div>
        <van-popup v-model:show="datePicker" position="bottom" :style="{ height: 'auto' }">
            <van-datetime-picker v-if="active===0" v-model="currentDate" @confirm="changeDate" @cancel="datePicker=false" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate" />
            <van-datetime-picker v-if="active===1" v-model="currentDate" @confirm="changeDate" @cancel="datePicker=false" type="year-month" title="选择年月" :min-date="minDate" :max-date="maxDate" />
        </van-popup>
        <van-popup v-model:show="popupShow" position="bottom" :style="{ height: '70%' }">
            <div class="popup-box">
                <div class="popup-box-header van-hairline--bottom">
                    <img @click="popupShow = false" :src="require('@/assets/close.png')" alt="" />
                    <div>选择店铺</div>
                    <div class="button" @click="changeDevice()">确定</div>
                </div>
                <div class="popup-box-content">
                    <van-checkbox v-model="allChecked" @click="allCheckedChange" class="all-checked" checked-color="#FE7E41">所有店铺
                        <template #icon="props">
                            <img class="img-icon" :src="props.checked ? checkedIcon : unCheckedIcon" />
                        </template>
                    </van-checkbox>
                    <van-checkbox-group v-model="itemChecked" ref="checkboxGroup" checked-color="#FE7E41">
                        <van-checkbox v-for="(item, index) in storeList" class="van-hairline--top" :name="item" :key="index">
                            <div class="device-box">
                                <div class="device-info">
                                    <div class="device-name van-ellipsis">{{ item.storeName }}</div>
                                    <div class="device-code">{{ item.storeCode }}</div>
                                </div>
                            </div>
                            <template #icon="props">
                                <img class="img-icon" :src="props.checked ? checkedIcon : unCheckedIcon" />
                            </template>
                        </van-checkbox>
                    </van-checkbox-group>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script setup>
import { ref, onBeforeMount } from 'vue'
import { getDate, toThousands } from '@/utils'
import { storeIncomeList, storelist } from '@/api/container.js'
import { newPage } from '@/utils/composables'

const checkedIcon = require('@/assets/Checkn.png')
const unCheckedIcon = require('@/assets/Unchecked.png')

const moreActive = ref(false)

const minDate = new Date(2020, 0, 1)
const maxDate = new Date()
const currentDate = ref(new Date())
const datePicker = ref(false)

const active = ref(0)
const popupShow = ref(false)
const allChecked = ref(false)
const itemChecked = ref([])
const checkboxGroup = ref(null)
const allCheckedChange = () => {
    checkboxGroup.value.toggleAll(allChecked.value)
}
const changeDate = () => {
    datePicker.value = false
    console.log(1)
    onLoad(1)
}

onBeforeMount(() => {
    onLoad(1)
    getStorelistFn()
})

const pageNum = ref(1)
const finished = ref(false)
const loading = ref(false)
const list = ref([])
const info = ref(null)
const deviceNos = ref([])
const onLoad = async (num) => {
    loading.value = true
    if (num) {
        finished.value = false
        pageNum.value = 1
    }
    const res = await storeIncomeList({
        month: active.value === 1 ? getDate(currentDate.value, 'YYYY-MM') : '',
        date: active.value === 0 ? getDate(currentDate.value) : '',
        page: pageNum.value,
        deviceNos: deviceNos.value
    })
    finished.value = false
    loading.value = false
    info.value = res.data || null
    if (res.code === '200' && res.data) {
        list.value = pageNum.value === 1 ? res.data.list : [...list.value, ...res.data.list]
        if ((res.data.total / 10) < pageNum.value) {
            finished.value = true
            return
        }
        pageNum.value++
    } else {
        finished.value = true
    }
}

// 获取店铺列表
const storeList = ref([])
const getStorelistFn = async () => {
    const res = await storelist()
    if (res.code === '200') {
        storeList.value = res.data
    }
}

const goDetail = ({ billNo }) => {
    newPage(`/containerDetails/${billNo}`)
}

const searchNames = ref('所有店铺')
const changeDevice = () => {
    if (allChecked.value || !itemChecked.value.length) {
        deviceNos.value = []
        searchNames.value = '所有店铺'
    } else {
        searchNames.value = ''
        deviceNos.value = itemChecked.value.map(item => item.storeCode)
        searchNames.value += itemChecked.value.map(item => item.storeName) + '、'
        searchNames.value = searchNames.value.slice(0, 15) + '...'
    }
    popupShow.value = false
    onLoad(1)
}
</script>
<style lang="scss" scoped>
.merchant-income{
    .bg-box{
        padding: 36px 30px 30px;
        background: #FFFFFF;
        .cascader-bar{
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #F3F5F6;
            border-radius: 32px;
            padding: 16px 40px 14px;
            font-size: 26px;
            font-weight: 400;
            color: #191919;
            img{
                width: 20px;
                height: 12px;
            }
        }
        .orange-card{
            background: #FE7E41;
            border-radius: 16px;
            margin-top: 20px;
            overflow: hidden;
            .board{
                display: flex;
                padding: 32px 0 18px;
                &>div{
                    flex: 1;
                    border-right: 1px solid #FF905C;
                    padding-left: 40px;
                    color: #FFFFFF;
                    div:nth-child(1){
                        font-size: 26px;
                        font-weight: 400;
                        color: #FFFFFF;
                    }
                    div:nth-child(2){
                        font-size: 46px;
                        font-weight: 500;
                        color: #FFFFFF;
                        margin-top: 4px;
                        span{
                            font-size: 30px;
                            margin-right: 4px;
                        }
                    }
                }
                &>div:last-child{
                    border-right: initial;
                }
            }
            .more{
                background: #FF702B;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 16px;
                img{
                    width: 26px;
                    height: 16px;
                    transition: all 0.3s;
                }
                .price{
                    width: 100%;
                    display: flex;
                    font-size: 24px;
                    font-weight: 400;
                    color: #FFFFFF;
                    padding-bottom: 12px;
                    .block{
                        flex: 1;
                        margin-left: 40px;
                        .item{
                            display: flex;
                            margin-top: 4px;
                            div:nth-child(1){
                                width: 136px;
                            }
                        }
                    }
                }
            }
            .roate{
                flex-direction: column;
                img{
                    transform: rotate(180deg);
                }
            }
        }
    }
    .van-tabs{
        margin-top: 20px;
    }
    .statistics{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 30px;
        div:nth-child(1){
            font-size: 24px;
            font-weight: 400;
            color: #191919;
            img{
                width: 20px;
                height: 12px;
            }
        }
        .text{
            font-size: 24px;
            font-weight: 400;
            color: #999999;
        }
    }
    .list-box{
        background: #FFFFFF;
        .cell-item:last-child{
            border-bottom: initial;
        }
        .cell-item{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 36px 0 32px;
            margin: 0 30px;
            border-bottom: 1px solid #F4F5F5;
            .cell-content{
                div:nth-child(1){
                    width: 500px;
                    font-size: 30px;
                    font-weight: 400;
                    color: #191919;
                }
                div:nth-child(2){
                    font-size: 26px;
                    font-weight: 400;
                    color: #B0B0B0;
                }
            }
            .cell-num{
                font-size: 30px;
                font-weight: 500;
                color: #191919;
            }
            img{
                width: 10px;
                height: 20px;
                margin-left: 16px;
            }
        }
    }
    .popup-box {
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #fff;
        :deep(.van-hairline--bottom:after) {
            border-bottom-color: #e7e7e7;
        }
        .popup-box-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 42px 50px;
            img {
                width: 46px;
                height: 46px;
            }
            div{
                font-size: 32px;
                font-weight: 500;
                color: #191919;
            }
            .button {
                font-size: 30px;
                font-weight: 500;
                color: #fe7e41;
            }
        }
        .popup-box-content {
            height: 0;
            flex: 1;
            overflow-y: scroll;
            .img-icon{
                width: 36px;
                height: 36px;
            }
            :deep(.van-hairline--top:after) {
                border-top-color: #f4f5f5;
            }
            .all-checked {
                display: flex;
                align-items: center;
                padding: 30px;
                :deep(.van-checkbox__label) {
                    font-size: 30px;
                    font-weight: 400;
                    color: #191919;
                    padding-top: 2px;
                }
            }
            .van-checkbox-group {
                width: calc(100% - 60px);
                .van-checkbox {
                    width: 100%;
                    padding: 40px 30px;
                    :deep(.van-checkbox__label) {
                        flex: 1;
                    }
                }
            }
            .device-box {
                display: flex;
                align-items: flex-start;
                .device-info {
                    width: 0;
                    flex: 1;
                    .device-name {
                        font-size: 30px;
                        font-weight: 400;
                        color: #191919;
                    }
                    .device-code {
                        font-size: 26px;
                        color: #B0B0B0;
                        margin-top: 12px;
                    }
                }
            }
        }
    }
}
</style>
