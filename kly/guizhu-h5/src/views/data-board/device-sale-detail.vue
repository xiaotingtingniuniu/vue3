<template>
    <div class="data-board-page">
        <!-- <van-nav-bar title="设备销售详情" left-arrow fixed placeholder :border="false" @click-left="closePage"> </van-nav-bar> -->
        <div>
            <div class="shop-title list-money-title">
                <img :src="shopIcon" /><span>{{ deviceName }}</span>
            </div>
        </div>
        <van-sticky :offset-top="-5">
            <div class="screen" :class="scrollTopVal > 51 ? 'shadow' : ''">
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
            </div>
        </van-sticky>
        <div class="page-content">
            <div class="gray-line"></div>
            <div class="echart-box"></div>
            <div class="tip-button" v-if="lastTime">
                <div class="tip">*数据更新截止{{ lastTime }}</div>
            </div>
        </div>
        <div class="page-content">
            <div class="gray-line"></div>
            <van-tabs v-model:active="activeTabs" @change="distributeFn" color="#FE7E41" title-active-color="#FE7E41">
                <van-tab title="交易商品" />
                <van-tab title="交易额" />
            </van-tabs>
        </div>
        <div class="page-content flex1" v-if="activeTabs == 0">
            <template v-if="spuRankingData?.list?.length">
                <div class="data-list">
                    <div class="data-list-header van-hairline--bottom">
                        <div>商品</div>
                        <div>交易数量</div>
                        <div>交易额</div>
                    </div>
                    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="spuRankingFn" :immediate-check="false">
                        <div class="data-cell" v-for="(item, index) in spuRankingData?.list" :key="index">
                            <van-image class="container-image" :src="item.spuListPicUrl" />
                            <div class="content van-hairline--bottom">
                                <div class="info">
                                    <div>{{ item.spuName || '--' }}</div>
                                </div>
                                <div class="num">{{ item.salesCnt }}</div>
                                <div class="num">¥{{ item.payAmt }}</div>
                            </div>
                        </div>
                    </van-list>
                </div>
            </template>
            <template v-else>
                <div style="height: 100%; background: #ffff">
                    <img class="no-data" src="@/assets/empty@2x.png" />
                    <p class="no-data-text">暂无数据</p>
                </div>
            </template>
        </div>
        <div class="page-content flex1" v-if="activeTabs == 1">
            <template v-if="moneyData?.list?.length">
                <div class="data-list">
                    <div class="data-list-header list-money-tab van-hairline--bottom">
                        <div>日期</div>
                        <div>交易额</div>
                    </div>
                    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="moneyFn" :immediate-check="false">
                        <div class="data-cell list-money" v-for="(item, index) in moneyData?.list" :key="index">
                            <div class="content list-money-content">
                                <span class="num">{{ handleDate(item.statisticsTime) || '0' }}</span>
                                <span class="num">¥{{ item.payAmt || '0' }}</span>
                            </div>
                        </div>
                    </van-list>
                </div>
            </template>
            <template v-else>
                <div style="height: 100%; background: #ffff">
                    <img class="no-data" src="@/assets/empty@2x.png" />
                    <p class="no-data-text">暂无数据</p>
                </div>
            </template>
        </div>
    </div>
    <van-calendar v-model:show="calendarShow" :allow-same-day="true" @confirm="calendarConfirm" type="range" max-range="31" :min-date="minDate" :max-date="today" :show-confirm="false" />
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
// import { closePage } from '@/utils/composables'
import { getDate, getDiffDate, funDate } from '@/utils'
import { deviceSaleDetail } from '@/api/data-board'
import { useRoute } from 'vue-router'
import * as echarts from 'echarts/core'
import { TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import shopIcon from '@/assets/device/shop.png'
const route = useRoute()
// const router = useRouter()
echarts.use([TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer, UniversalTransition])

const activeTabs = ref(0)
const dayTime = ref(0)
const timeList = ref(['今日', '昨日', '近7日', '本月', '自定义'])

// 自定义日期
const calendarShow = ref(false)
const today = new Date()
const minDate = new Date('2019/01/01')
const startTime = ref(null)
const endTime = ref(null)

// 统计相关数据
const lastTime = ref(null)

const handleDate = (val) => {
    if (dayTime.value === 0) {
        return `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${val}:00`
    } else if (dayTime.value === 1) {
        var date = new Date()
        date.setDate(date.getDate() - 1)
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${val}:00`
    }
    return val
}

const { deviceCode, deviceName } = route.query
const scrollTopVal = ref(0)
onMounted(() => {
    window.addEventListener('scroll', scrollFn)
    distributeFn()
})

onUnmounted(() => {
    window.removeEventListener('scroll', scrollFn)
})

const scrollFn = () => {
    scrollTopVal.value = document.documentElement.scrollTop
}

// 分发
const distributeFn = () => {
    if (activeTabs.value !== 0) myChart = null
    getBusinessDetail()
    if (activeTabs.value === 0) {
        spuRankingFn(1)
    } else if (activeTabs.value === 1) {
        moneyFn(1)
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

const spuRankingData = ref(null)
const current = ref(1)
const loading = ref(false)
const finished = ref(false)

// 交易概览
const getBusinessDetail = async () => {
    const res = await deviceSaleDetail({
        dayTime: dayTime.value,
        startTime: startTime.value,
        endTime: endTime.value,
        deviceCodeList: [deviceCode],
        queryType: 0
    })
    if (res.code === '200') {
        businessListRes.value = res.data.businessList || { list: [] }
        lastTime.value = res.data.lastTime
        spuRankingData.value = res.data.businessGoods || { list: [] }
        drawEchart()
    }
}

// 商品数据
const spuRankingFn = async (pageNo = null) => {
    loading.value = true
    if (pageNo) {
        current.value = pageNo
        finished.value = false
    }
    const res = await deviceSaleDetail({
        dayTime: dayTime.value,
        startTime: startTime.value,
        endTime: endTime.value,
        deviceCodeList: [deviceCode],
        current: current.value,
        queryType: 2,
        size: 10
    })
    if (current.value === 1) {
        spuRankingData.value = res.data.businessGoods || { list: [] }
        // spuRankingData.value = {
        //     list: [
        //         { spuName: 'xx', salesCnt: 20, payAmt: 30 },
        //         { spuName: 'xx', salesCnt: 20, payAmt: 30 },
        //         { spuName: 'xx', salesCnt: 20, payAmt: 30 },
        //         { spuName: 'xx', salesCnt: 20, payAmt: 30 },
        //         { spuName: 'xx', salesCnt: 20, payAmt: 30 },
        //         { spuName: 'xx', salesCnt: 20, payAmt: 30 },
        //         { spuName: 'xx', salesCnt: 20, payAmt: 30 },
        //         { spuName: 'xx', salesCnt: 20, payAmt: 30 },
        //         { spuName: 'xx', salesCnt: 20, payAmt: 30 },
        //         { spuName: 'xx', salesCnt: 20, payAmt: 30 }
        //     ]
        // }
    } else {
        spuRankingData.value.list = [...spuRankingData.value.list, ...res.data.businessGoods.list]
    }
    if (res.data.businessGoods?.list?.length < 10) {
        finished.value = true
    }
    current.value++
    loading.value = false
}

// 交易数据
const moneyData = ref(null)
const moneyFn = async (pageNo = null) => {
    if (loading.value) return false
    loading.value = true
    if (pageNo) {
        current.value = 1
        finished.value = false
    }
    const res = await deviceSaleDetail({
        dayTime: dayTime.value,
        startTime: startTime.value,
        endTime: endTime.value,
        deviceCodeList: [deviceCode],
        current: current.value,
        queryType: 3,
        size: 10
    })
    if (current.value === 1) {
        moneyData.value = res.data.businessMoney || { list: [] }
        // moneyData.value = {
        //     list: [
        //         { statisticsTime: 'xx', payAmt: 0 },
        //         { statisticsTime: 'xx', payAmt: 0 },
        //         { statisticsTime: 'xx', payAmt: 0 },
        //         { statisticsTime: 'xx', payAmt: 0 },
        //         { statisticsTime: 'xx', payAmt: 0 },
        //         { statisticsTime: 'xx', payAmt: 0 },
        //         { statisticsTime: 'xx', payAmt: 0 },
        //         { statisticsTime: 'xx', payAmt: 0 }
        //     ]
        // }
    } else {
        moneyData.value.list = [...moneyData.value.list, ...res.data.businessMoney.list]
    }
    if (res.data.businessMoney?.list?.length < 10) {
        finished.value = true
    }
    current.value++
    loading.value = false
}

// const changeTab = () => {
//     current.value = 1
//     loading.value = false
//     finished.value = false
//     if (activeTabs.value === 1) {
//         moneyFn()
//     } else if (activeTabs.value === 0) {
//         spuRankingFn()
//     }
// }

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

    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                const item = echartData.value[params[0].dataIndex]
                return '<div><div>时间：' + item.statisticsTime + (dayTime.value < 2 ? '时' : '') + '</div><div>交易金额：' + item.payAmt + '元</div><div>交易笔数：' + item.orderCnt + '笔</div><div>退款金额：' + item.refundAmt + '元</div></div>'
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
            icon: 'stack',
            data: ['交易金额', '交易笔数'],
            selectMode: 'single',
            selected: {
                交易金额: true,
                交易笔数: false
            }
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
                    return `${result}`
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
                name: '交易笔数',
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: '#FF1E19'
                },
                itemStyle: {
                    color: '#FF1E19'
                },
                // data: echartData.value.map((item) => item.orderCnt)
                data: []
            }
        ]
    }
    myChart.on('legendselectchanged', (obj) => {
        const options = myChart.getOption()
        if (obj.name === '交易金额') {
            options.series[0].data = echartData.value.map((item) => item.payAmt)
            options.series[1].data = []
            options.legend[0].selected = {
                交易金额: true,
                交易笔数: false
            }
        } else {
            options.series[0].data = []
            options.series[1].data = echartData.value.map((item) => item.orderCnt)
            options.legend[0].selected = {
                交易金额: false,
                交易笔数: true
            }
        }
        myChart.setOption(options, true)
    })
    myChart.setOption(option, true)
}
// const goBackN = () => {
//     router.back()
// }
</script>
<style lang="scss" scoped>
.data-board-page {
    --van-nav-bar-icon-color: #000;
    background-color: #f4f5f5;
    // background-image: url('../../assets/data-board-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 360px;
    min-height: 100vh;
    // display: flex;
    // flex-direction: column;
    // .van-nav-bar__placeholder {
    //     background: #fff;
    //     height: calc(92px + var(--van-status-bar-height)) !important;
    //     :deep(.van-nav-bar) {
    //         padding-top: var(--van-status-bar-height);
    //         z-index: 9999;
    //         .van-image {
    //             width: 44px;
    //             height: 44px;
    //         }
    //         .van-nav-bar__title {
    //             font-size: 36px;
    //             font-weight: 500;
    //             color: #191919;
    //         }
    //     }
    // }
    .shop-title {
        // padding-top: var(--van-status-bar-height);
        padding-left: 30px;
        height: 92px;
        line-height: 92px;
        img {
            width: 30px;
            height: 30px;
            padding-right: 6px;
            vertical-align: middle;
        }
        span {
            color: #696969;
            font-size: 28px;
        }
    }
    .list-money-title {
        margin-top: 0;
    }
    .shadow {
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
        border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
    .no-top {
        padding-top: 0;
    }
    .van-tabs {
        margin-top: 20px;
        :deep(.van-tabs__nav) {
            .van-tab__text {
                font-size: 28px;
                font-weight: 400;
                color: #191919;
            }
            .van-tab--active {
                .van-tab__text {
                    font-size: 28px;
                    font-weight: 500;
                    color: #fe7e41;
                }
            }
        }
    }
    .shadow {
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
    }
    .screen {
        background: #ffffff;
        margin-top: 0px;
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
    .flex1 {
        height: 0;
        flex: 1;
    }
    // }
    .page-content {
        // flex: 1;
        // overflow-y: scroll;
        background-color: #ffffff;
        :deep(.van-tabs .van-tabs__wrap) {
            border-bottom: 1px solid #ededed;
        }
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
            background-color: #fff;
            .data-list-header {
                display: flex;
                align-items: center;
                padding: 30px 20px;
                div {
                    font-size: 26px;
                    font-weight: 500;
                    color: #696969;
                    white-space: nowrap;
                }
                div:nth-child(0) {
                    padding-left: 160px;
                }
                div:nth-child(1) {
                    padding-left: 160px;
                }
                div:nth-child(2) {
                    padding-left: 235px;
                    text-align: center;
                }
                div:nth-child(3) {
                    padding-left: 45px;
                    text-align: center;
                }
            }

            .list-money-tab {
                display: flex;
                justify-content: space-between;
                div:nth-child(1) {
                    padding-left: 0px;
                }
                div:nth-child(2) {
                    padding-right: 38px;
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
                .list-money-content {
                    display: flex;
                    justify-content: space-between;
                    min-height: 100px;
                    padding-bottom: 0;
                    margin-left: 0;
                    border-bottom: 2px solid #f4f5f5;
                    .num {
                        width: auto;
                    }
                    .num:last-child {
                        padding-right: 55px;
                    }
                }
            }

            .list-money {
                justify-content: space-between;
                display: flex;
                padding-left: 30px;
                padding-right: 30px;
                padding-top: 0;
                div:nth-child(1) {
                    width: auto;
                }
                div:nth-child(2) {
                    width: auto;
                    flex: none;
                }
            }
        }
        .data-area {
            background: #ffffff;
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
            padding-bottom: 24px;
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
