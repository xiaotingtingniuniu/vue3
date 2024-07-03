<template>
    <div class="data-board-page">
        <van-nav-bar title="数据统计" fixed placeholder :border="false">
            <template #left>
                <van-image @click="closePage" :src="require('@/assets/page-back-white.png')" />
            </template>
        </van-nav-bar>
        <van-tabs v-model:active="activeTabs" @change="distributeFn" color="#fff" line-width="28px">
            <van-tab title="交易概览" />
            <van-tab title="商品排行" />
            <van-tab title="设备排行" />
            <div class="screen" :class="scrollTop > 10 ? 'shadow' : ''">
                <div class="cell">
                    <div class="label">时间</div>
                    <div class="content">
                        <van-button @click="changeTime(index)" :class="dayTime === index ? 'active' : ''" v-for="(item, index) in timeList" :key="item">{{ item }}</van-button>
                    </div>
                </div>
                <div class="cell" v-if="dayTime === 4">
                    <div class="label"></div>
                    <div class="content custom-time" @click="calendarShow = true">
                        <div class="date">{{ startTime || '开始时间' }}</div>
                        <div class="connector">至</div>
                        <div class="date">{{ endTime || '结束时间' }}</div>
                    </div>
                </div>
                <div class="cell">
                    <div class="label">货柜</div>
                    <div class="content">
                        <van-button @click="getDeviceList()" :icon="require('@/assets/arrow-down.png')" icon-position="right">{{ deviceButtontext }}</van-button>
                    </div>
                </div>
            </div>
        </van-tabs>
        <div class="page-content" v-if="activeTabs === 0" @scroll="scrollFn">
            <div class="gray-line"></div>
            <div class="data-area">
                <div class="money">
                    <div class="a-turnover">
                        <div class="num"><span>¥</span>{{ toThousands(businessStatisticsRes?.payAmt) }}</div>
                        <div class="text">
                            总交易额<van-popover v-if="businessStatisticsRes" v-model:show="showPopover" teleport=".data-board-page">
                                <div class="popover">交易额=实收款-退款额</div>
                                <template #reference>
                                    <img :src="require('@/assets/tip-icon.png')" alt="" />
                                </template>
                            </van-popover>
                        </div>
                    </div>
                    <div class="a-turnover">
                        <div class="num"><span>¥</span>{{ toThousands(businessStatisticsRes?.incomeAmt) }}</div>
                        <div class="text">
                            总到账金额<van-popover v-if="businessStatisticsRes" v-model:show="showPopover2" teleport=".data-board-page">
                                <div class="popover">用户支付完成后D+1日结算</div>
                                <template #reference>
                                    <img :src="require('@/assets/tip-icon.png')" alt="" />
                                </template>
                            </van-popover>
                        </div>
                    </div>
                </div>
                <div class="index van-hairline--top">
                    <div class="index-item">
                        <div>{{ businessStatisticsRes?.orderCnt || '0' }}</div>
                        <div>交易笔数</div>
                    </div>
                    <div class="index-item">
                        <div><span>¥</span>{{ businessStatisticsRes?.unitPrice || '0.00' }}</div>
                        <div>笔单价</div>
                    </div>
                    <div class="index-item">
                        <div>{{ businessStatisticsRes?.refundCnt || '0' }}</div>
                        <div>退款笔数</div>
                    </div>
                    <div class="index-item">
                        <div><span>¥</span>{{ businessStatisticsRes?.refundAmt || '0.00' }}</div>
                        <div>退款金额</div>
                    </div>
                </div>
            </div>
            <div class="gray-line"></div>
            <div class="echart-box" v-if="activeTabs === 0"></div>
            <div class="tip-button" v-if="lastTime">
                <div class="tip">*数据更新截止{{ lastTime }}</div>
            </div>
        </div>
        <div class="page-content" v-if="activeTabs === 1" @scroll="scrollFn">
            <template v-if="spuRankingData?.spuList?.length">
                <div class="gray-bar">售卖商品数量共计：{{ spuRankingData.spuSaleNum || '0' }}</div>
                <div class="data-list">
                    <div class="data-list-header van-hairline--bottom">
                        <div>排名</div>
                        <div>商品</div>
                        <div>售卖数量</div>
                    </div>
                    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="spuRankingFn" :immediate-check="false">
                        <div class="data-cell" v-for="(item, index) in spuRankingData?.spuList" :key="index">
                            <div class="rank">
                                <van-image v-if="index < 3" :src="images[index]" />
                                <div v-else>{{ index > 8 ? index + 1 : '0' + (index + 1) }}</div>
                            </div>
                            <van-image class="container-image" :src="item.picUrl" />
                            <div class="content van-hairline--bottom">
                                <div class="info">
                                    <div>{{ item.spuName || '--' }}</div>
                                    <div>{{ item.barcodes || '--' }}</div>
                                </div>
                                <div class="num">{{ item.saleNums || '0' }}</div>
                            </div>
                        </div>
                    </van-list>
                </div>
            </template>
            <template v-else>
                <img class="no-data" src="@/assets/empty@2x.png" />
                <p class="no-data-text">暂无数据</p>
            </template>
        </div>
        <div class="page-content" v-if="activeTabs === 2" @scroll="scrollFn">
            <div class="gray-line"></div>
            <div class="data-table">
                <div>
                    <div><span>¥</span>{{ deviceRankingData?.devicePaySum || '0.00' }}</div>
                    <div>总交易额</div>
                </div>
                <div>
                    <div><span>¥</span>{{ deviceRankingData?.averagePay || '0.00' }}</div>
                    <div>设备平均交易额</div>
                </div>
            </div>
            <div class="gray-line"></div>
            <template v-if="deviceRankingData?.deviceRankingPage?.list?.length">
                <div class="data-list">
                    <div class="data-list-header van-hairline--bottom">
                        <div>排名</div>
                        <div>设备</div>
                        <div>交易额</div>
                    </div>
                    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="deviceRankingFn" :immediate-check="false">
                        <div class="data-cell" v-for="(item, index) in deviceRankingData?.deviceRankingPage?.list" :key="index">
                            <div class="rank">
                                <van-image v-if="index < 3" :src="images[index]" />
                                <div v-else>{{ index > 8 ? index + 1 : '0' + (index + 1) }}</div>
                            </div>
                            <van-image class="container-image" :src="require('@/assets/my-container.png')" />
                            <div class="content van-hairline--bottom">
                                <div class="info">
                                    <div>{{ item.deviceName || '--' }}</div>
                                    <div>设备编号: {{ item.deviceCode || '--' }}</div>
                                </div>
                                <div class="num" @click="deviceDetail(item)">¥{{ item.payAmt || '0.00' }} <van-icon name="arrow" /></div>
                            </div>
                        </div>
                    </van-list>
                </div>
            </template>
            <template v-else>
                <img class="no-data" src="@/assets/empty@2x.png" />
                <p class="no-data-text">暂无数据</p>
            </template>
        </div>
    </div>
    <van-calendar v-model:show="calendarShow" :allow-same-day="true" @confirm="calendarConfirm" type="range" max-range="31" :min-date="minDate" :max-date="today" :show-confirm="false" />
    <van-popup v-model:show="popupShow" position="bottom" :style="{ height: '70%' }">
        <div class="popup-box">
            <div class="popup-box-header van-hairline--bottom">
                <img @click="popupShow = false" :src="require('@/assets/close.png')" alt="" />
                <div @click="changeDevice()">确定</div>
            </div>
            <div class="popup-box-content">
                <van-checkbox v-model="allChecked" @click="allCheckedChange" class="all-checked" checked-color="#FE7E41">所有货柜</van-checkbox>
                <van-checkbox-group v-model="itemChecked" ref="checkboxGroup" checked-color="#FE7E41">
                    <van-checkbox v-for="item in deviceList" class="van-hairline--top" :name="item.deviceCode" :key="item.deviceCode">
                        <div class="device-box">
                            <van-image :src="require('@/assets/my-container.png')" />
                            <div class="device-info">
                                <div class="device-name van-ellipsis">{{ item.deviceName }}</div>
                                <div class="device-code">{{ item.deviceCode }}</div>
                            </div>
                        </div>
                    </van-checkbox>
                </van-checkbox-group>
            </div>
        </div>
    </van-popup>
</template>
<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { closePage, newPage } from '@/utils/composables'
import { toThousands, getDate, getDiffDate, funDate } from '@/utils'
import { queryDeviceList } from '@/api/goods-library'
import { businessDetail, deviceRanking, spuRanking } from '@/api/data-board'
// import { useRouter } from 'vue-router'
import * as echarts from 'echarts/core'
import { TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import top1 from '@/assets/top1.png'
import top2 from '@/assets/top2.png'
import top3 from '@/assets/top3.png'
// const router = useRouter()
const images = [top1, top2, top3]
echarts.use([TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer, UniversalTransition])

const activeTabs = ref(0)
const dayTime = ref(0)
const timeList = ref(['今日', '昨日', '近7日', '本月', '自定义'])
const showPopover = ref(false)
const showPopover2 = ref(false)

// 自定义日期
const calendarShow = ref(false)
const today = new Date()
const minDate = new Date('2019/01/01')
const startTime = ref(null)
const endTime = ref(null)

// 统计相关数据
const businessStatisticsRes = ref(null)
const lastTime = ref(null)

onMounted(() => {
    distributeFn()
})

const scrollTop = ref(0)
const scrollFn = (val) => {
    scrollTop.value = val.target.scrollTop
}

const deviceDetail = (item) => {
    newPage(`/device-sale-detail?deviceName=${item.deviceName}&deviceCode=${item.deviceCode}`, {
        deviceName: item.deviceName,
        deviceCode: item.deviceCode
    })
    // router.push({
    //     path: '/device-sale-detail',
    //     name: 'device-sale-detail',
    //     query: {
    //         ...item
    //     }
    // })
}

// 分发
const distributeFn = () => {
    if (activeTabs.value !== 0) myChart = null
    if (activeTabs.value === 0) {
        getBusinessDetail()
    } else if (activeTabs.value === 1) {
        spuRankingFn(1)
    } else if (activeTabs.value === 2) {
        deviceRankingFn(1)
    }
}

// 自定义日期 选中日期范围
const calendarConfirm = (val) => {
    startTime.value = getDate(val[0])
    endTime.value = getDate(val[1])
    calendarShow.value = false
    distributeFn()
}

// 筛选时间
const changeTime = (index) => {
    dayTime.value = index
    if (index < 4) {
        startTime.value = null
        endTime.value = null
        distributeFn()
    } else {
        calendarShow.value = true
    }
}

// 选择货柜
const popupShow = ref(false)
const allChecked = ref(false)
const checkboxGroup = ref(null)
const itemChecked = ref([])
const deviceButtontext = ref('所有货柜')
const checkObj = ref([])
const changeDevice = () => {
    if (!allChecked.value) {
        let text = ''
        checkObj.value = deviceList.value.filter((item) => {
            if (itemChecked.value.indexOf(item.deviceCode) !== -1) {
                text = text ? `${text}、${item.deviceName}` : item.deviceName
                return item
            }
        })
        deviceButtontext.value = text.length > 8 ? text.slice(0, 8) + '...' : text
        if (!checkObj.value.length) {
            deviceButtontext.value = '所有货柜'
        }
    } else {
        deviceButtontext.value = '所有货柜'
    }
    distributeFn()
    popupShow.value = false
}
const allCheckedChange = () => {
    checkboxGroup.value.toggleAll(allChecked.value)
}

// 交易概览
const getBusinessDetail = async () => {
    const res = await businessDetail({
        dayTime: dayTime.value,
        startTime: startTime.value,
        endTime: endTime.value,
        deviceCodeList: deviceButtontext.value === '所有货柜' ? null : checkObj.value.map((item) => item.deviceCode)
    })
    if (res.code === '200') {
        businessListRes.value = res.data.businessListRes
        businessStatisticsRes.value = res.data.businessStatisticsRes
        lastTime.value = res.data.lastTime
        drawEchart()
    }
}

const spuRankingData = ref(null)
const spuRankingFn = async (pageNo = null) => {
    loading.value = true
    if (pageNo) {
        current.value = pageNo
        finished.value = false
    }
    const res = await spuRanking({
        dayTime: dayTime.value,
        startTime: startTime.value,
        endTime: endTime.value,
        deviceCodeList: deviceButtontext.value === '所有货柜' ? null : checkObj.value.map((item) => item.deviceCode),
        current: current.value,
        size: 10
    })
    if (current.value === 1) {
        spuRankingData.value = res.data
    } else {
        spuRankingData.value.spuList = [...spuRankingData.value.spuList, ...res.data.spuList]
    }
    if (res.data.spuList?.length < 10) {
        finished.value = true
    }
    current.value++
    loading.value = false
}

// 设备排行
const deviceRankingData = ref(null)
const current = ref(1)
const loading = ref(false)
const finished = ref(false)
const deviceRankingFn = async (pageNo = null) => {
    loading.value = true
    if (pageNo) {
        current.value = pageNo
        finished.value = false
    }
    const res = await deviceRanking({
        dayTime: dayTime.value,
        startTime: startTime.value,
        endTime: endTime.value,
        deviceCodeList: deviceButtontext.value === '所有货柜' ? null : checkObj.value.map((item) => item.deviceCode),
        current: current.value,
        size: 10
    })
    if (current.value === 1) {
        deviceRankingData.value = res.data
    } else {
        deviceRankingData.value.deviceRankingPage.list = [...deviceRankingData.value.deviceRankingPage.list, ...res.data.deviceRankingPage.list]
    }

    if (res.data.deviceRankingPage.list?.length < 10 || !res.data.deviceRankingPage.list) {
        finished.value = true
    }
    current.value++
    loading.value = false
}

const deviceList = ref([])
const getDeviceList = async () => {
    if (deviceList.value.length) {
        popupShow.value = true
    } else {
        const res = await queryDeviceList({
            pageNum: 1,
            pageSize: 1000
        })
        if (res.code === '200') {
            deviceList.value = res.data.list
            popupShow.value = true
        }
        watchEffect(() => {
            allChecked.value = !!(itemChecked.value.length === deviceList.value.length)
        })
    }
    if (deviceButtontext.value === '所有货柜') {
        itemChecked.value = deviceList.value.map((item) => item?.deviceCode)
    } else {
        itemChecked.value = checkObj.value.map((item) => item?.deviceCode)
    }
}

// 今日/昨日 数据构造
const echartData = ref([])
const constHour = () => {
    echartData.value = []
    const date = new Date()
    const times = dayTime.value === 0 ? date.getHours() : 24
    for (let i = 0; i <= times; i++) {
        let obj = {
            orderCnt: '0',
            payAmt: '0.00',
            refundAmt: '0.00',
            incomeAmt: '0.00',
            statisticsTime: i
        }
        const apiData = businessListRes.value.find((item) => item.statisticsTime === i + '')
        obj = apiData || obj
        obj.showTime = obj.statisticsTime
        echartData.value.push(obj)
    }
}

const constDay = () => {
    echartData.value = []
    let timeArr = []
    if (dayTime.value === 2) {
        timeArr = getDiffDate(funDate(-6), funDate(0))
    } else if (dayTime.value === 3) {
        const date = new Date().getDate()
        timeArr = getDiffDate(funDate(date > 1 ? -(date - 1) : 0), funDate(0))
    } else {
        timeArr = getDiffDate(startTime.value, endTime.value)
    }
    for (let i = 0; i < timeArr.length; i++) {
        let obj = {
            orderCnt: '0',
            payAmt: '0.00',
            refundAmt: '0.00',
            incomeAmt: '0.00',
            statisticsTime: timeArr[i]
        }
        const apiData = businessListRes.value.find((item) => item.statisticsTime === timeArr[i])
        obj = apiData || obj
        const pattern = /\d{4}(-|\/|.)/
        obj.showTime = obj.statisticsTime.replace(pattern, '')
        echartData.value.push(obj)
    }
}

// 画图数据
const businessListRes = ref([])
let myChart = null
const drawEchart = () => {
    myChart = echarts.init(document.querySelector('.echart-box'))
    myChart.clear()
    if (dayTime.value < 2) {
        constHour()
    } else {
        constDay()
    }
    myChart.setOption(
        {
            tooltip: {
                trigger: 'axis',
                formatter: (params) => {
                    const item = echartData.value[params[0].dataIndex]
                    return '<div><div>时间：' + item.statisticsTime + (dayTime.value < 2 ? '时' : '') + '</div><div>交易笔数：' + item.orderCnt + '笔</div><div>交易金额：' + item.payAmt + '元</div><div>到账金额：' + item.incomeAmt + '元</div><div>退款金额：' + item.refundAmt + '元</div></div>'
                },
                axisPointer: {
                    lineStyle: {
                        color: '#FFB410',
                        width: 2
                    }
                },
                confine: true,
                backgroundColor: 'rgba(255, 245, 224, 0.98)',
                borderColor: 'rgba(255, 232, 188, 1)',
                extraCssText: 'box-shadow: 0px 4px 12px 0px rgba(255,240,206,0.5);',
                borderWidth: 1,
                textStyle: {
                    color: '#9D7B35',
                    textShadowBlur: 0
                }
            },
            grid: {
                bottom: 50
            },
            legend: {
                data: ['交易金额', '退款金额']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    showMinLabel: true,
                    showMaxLabel: true,
                    interval: 'auto'
                },
                data: echartData.value.map((item) => item.showTime)
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (value) => {
                        let result = Math.floor(value * 10 ** 2) / 10 ** 2
                        if (value * 10000 > 9999999 && value * 10000 < 100000000) {
                            result = `${Math.floor((value / 1000) * 10 ** 2) / 10 ** 2}k`
                        } else if (value * 10000 > 99999999) {
                            result = `${Math.floor((value / 10000) * 10 ** 2) / 10 ** 2}w`
                        }
                        return `¥${result}`
                    }
                }
            },
            series: [
                {
                    name: '交易金额',
                    type: 'line',
                    smooth: true,
                    lineStyle: {
                        color: '#FFB410'
                    },
                    itemStyle: {
                        color: '#FFB410'
                    },
                    data: echartData.value.map((item) => item.payAmt)
                },
                {
                    name: '退款金额',
                    type: 'line',
                    smooth: true,
                    lineStyle: {
                        color: '#FF1E19'
                    },
                    itemStyle: {
                        color: '#FF1E19'
                    },
                    data: echartData.value.map((item) => item.refundAmt)
                }
            ]
        },
        true
    )
}
</script>
<style lang="scss" scoped>
.data-board-page {
    background-color: #f4f5f5;
    background-image: url('../../assets/data-board-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 360px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .van-nav-bar__placeholder {
        height: calc(92px + var(--van-status-bar-height)) !important;
        :deep(.van-nav-bar) {
            background: transparent;
            padding-top: var(--van-status-bar-height);
            .van-image {
                width: 44px;
                height: 44px;
            }
            .van-nav-bar__title {
                font-size: 36px;
                font-weight: 500;
                color: #ffffff;
            }
        }
    }
    .van-tabs {
        margin-top: 20px;
        :deep(.van-tabs__nav) {
            background: transparent;
            .van-tab__text {
                font-size: 28px;
                font-weight: 400;
                color: #ffffff;
            }
            .van-tab--active {
                .van-tab__text {
                    font-size: 32px;
                    font-weight: 600;
                }
            }
        }
        .shadow {
            box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
        }
        .screen {
            background: #ffffff;
            border-radius: 24px 24px 0px 0px;
            margin-top: 20px;
            padding: 30px;
            .cell:first-child {
                margin-top: initial;
            }
            .cell {
                display: flex;
                align-items: center;
                margin-top: 16px;
                .label {
                    width: 52px;
                    font-size: 26px;
                    font-weight: 400;
                    color: #999999;
                    margin-right: 16px;
                    word-break: keep-all;
                }
                .content {
                    display: flex;
                    align-items: center;
                    .van-button {
                        font-size: 26px;
                        font-weight: 400;
                        color: #191919;
                        padding: 6px 18px;
                        border: initial;
                        background: #f4f5f5;
                        border-radius: 24px;
                        height: initial;
                        margin-left: 16px;
                        line-height: initial;
                        :deep(.van-icon__image) {
                            width: 20px;
                            height: 12px;
                        }
                    }
                    .active {
                        color: #ffffff;
                        background: linear-gradient(90deg, #fe7e41 0%, #ff5d0f 100%, #ff5c0e 100%);
                    }
                }
                .custom-time {
                    margin-left: 16px;
                    .date {
                        font-size: 24px;
                        font-weight: 400;
                        color: #696969;
                        padding: 6px 54px;
                        background: #ffffff;
                        border-radius: 25px;
                        border: 2px solid #ededed;
                    }
                    .connector {
                        font-size: 24px;
                        font-weight: 400;
                        color: #696969;
                        margin: 0 22px;
                    }
                }
            }
        }
    }
    .page-content {
        flex: 1;
        overflow-y: scroll;
        background-color: #ffffff;
        .gray-bar {
            font-size: 28px;
            font-weight: 400;
            color: #696969;
            padding: 30px;
            background: #f4f5f5;
        }
        .no-data {
            width: 64%;
            display: block;
            margin: 30% auto 0;
        }
        .no-data-text {
            font-size: 24px;
            text-align: center;
            margin-top: 24px;
            color: #666666;
        }
        .gray-line {
            background-color: #f4f5f5;
            height: 20px;
        }
        .data-table {
            padding: 60px 0;
            display: flex;
            & > div {
                flex: 1;
                text-align: center;
                div:first-child {
                    font-size: 48px;
                    font-weight: 600;
                    color: #ff1e19;
                    line-height: 56px;
                    span {
                        font-size: 32px;
                        margin-right: 2px;
                    }
                }
                div:last-child {
                    font-size: 24px;
                    font-weight: 400;
                    color: #191919;
                    margin-top: 12px;
                    line-height: 32px;
                }
            }
        }
        .data-list {
            .data-list-header {
                display: flex;
                align-items: center;
                padding: 30px 20px;
                div {
                    font-size: 26px;
                    font-weight: 500;
                    color: #696969;
                }
                div:nth-child(1) {
                    width: 60px;
                    text-align: right;
                }
                div:nth-child(2) {
                    width: 0;
                    flex: 1;
                    padding-left: 110px;
                }
                div:nth-child(3) {
                    width: 150px;
                    text-align: center;
                }
            }
            .data-cell {
                padding: 40px 20px 0;
                display: flex;
                align-items: flex-start;
                .rank {
                    height: 100px;
                    display: flex;
                    align-items: center;
                    .van-image {
                        width: 44px;
                        height: 44px;
                    }
                    div {
                        width: 44px;
                        text-align: center;
                        font-size: 26px;
                        font-weight: 500;
                        color: #999999;
                    }
                }
                .container-image {
                    width: 100px;
                    height: 100px;
                    border-radius: 8px;
                    overflow: hidden;
                    margin-left: 16px;
                }
                .content {
                    width: 0;
                    flex: 1;
                    display: flex;
                    min-height: 100px;
                    align-items: center;
                    margin-left: 16px;
                    padding-bottom: 40px;
                    .info {
                        width: 0;
                        flex: 1;
                        div:first-child {
                            font-size: 30px;
                            font-weight: 500;
                            color: #222222;
                            line-height: 36px;
                        }
                        div:last-child {
                            font-size: 22px;
                            font-weight: 400;
                            color: #b0b0b0;
                            line-height: 30px;
                            margin-top: 16px;
                        }
                    }
                    .num {
                        width: 150px;
                        text-align: center;
                        font-size: 26px;
                        font-weight: 500;
                        color: #191919;
                    }
                }
            }
        }
        .data-area {
            background: #ffffff;
            .money {
                display: flex;
                justify-content: space-between;
                padding-left: 78px;
                padding-right: 100px;
            }
            .a-turnover {
                text-align: center;
                padding: 40px 0;
                .num {
                    font-size: 48px;
                    font-weight: 600;
                    color: #ff1e19;
                    span {
                        font-size: 32px;
                    }
                }
                .text {
                    margin-top: 12px;
                    font-size: 24px;
                    font-weight: 400;
                    color: #191919;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-indent: 12px;
                    :deep(.van-popover__wrapper) {
                        width: 24px;
                        height: 24px;
                        display: block;
                        margin-top: -4px;
                        img {
                            width: 24px;
                            height: 24px;
                            margin-left: -4px;
                        }
                    }
                }
            }
            .index {
                padding: 32px;
                display: flex;
                justify-content: space-between;
                .index-item {
                    text-align: center;
                    div:first-child {
                        font-size: 32px;
                        font-weight: 600;
                        color: #191919;
                        span {
                            font-size: 20px;
                            margin-right: 4px;
                        }
                    }
                    div:last-child {
                        font-size: 24px;
                        font-weight: 400;
                        color: #999999;
                        margin-top: 10px;
                    }
                }
            }
        }
        .echart-box {
            margin-top: 20px;
            height: 600px;
            background-color: #ffffff;
            padding: 40px 24px 0;
        }
        .tip-button {
            .tip {
                width: max-content;
                height: max-content;
                margin: 0 auto;
                font-size: 20px;
                font-weight: 400;
                color: #ff1e19;
                background: #fff5f5;
                border-radius: 24px;
                padding: 10px 28px;
            }
        }
    }
}
:deep(.van-popover__arrow) {
    color: #ffe8bc !important;
}
.popover {
    padding: 18px 28px;
    background-color: #ffe8bc;
    font-size: 26px;
    font-weight: 400;
    color: #9d7b35;
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
        div {
            font-size: 30px;
            font-weight: 500;
            color: #fe7e41;
        }
    }
    .popup-box-content {
        height: 0;
        flex: 1;
        overflow-y: scroll;
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
            .van-image {
                width: 100px;
                height: 100px;
                border-radius: 8px;
                overflow: hidden;
            }
            .device-info {
                width: 0;
                flex: 1;
                margin-left: 16px;
                .device-name {
                    font-size: 30px;
                    font-weight: 500;
                    color: #222222;
                    line-height: 36px;
                }
                .device-code {
                    font-size: 22px;
                    font-weight: 400;
                    color: #b0b0b0;
                    margin-top: 16px;
                }
            }
        }
    }
}
</style>
