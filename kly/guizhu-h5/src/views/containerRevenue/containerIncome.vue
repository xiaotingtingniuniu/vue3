<template>
    <div class="incomeList">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <div class="amountBox">
                <van-field class="van-ellipsis" v-model="screenText" readonly @click="screenFn" :right-icon="require('@/assets/replenishmentImg/screen-icon.png')"/>
                <div class="money">
                    <div class="volume">
                        <div class="volumeTitle">日收入</div>
                        <div class="volumeNumber">
                            <span class="amounBox">￥</span>
                            <span class="amountMoney">{{toMoney((info.dateAmount / 100))}}</span>
                        </div>
                    </div>
                    <div class="middle"></div>
                    <div class="profit">
                        <div class="volumeTitle">月收入</div>
                        <div class="volumeNumber">
                            <span class="amounBox">￥</span>
                            <span class="amountMoney">{{toMoney((info.monthAmount / 100).toFixed(2))}}</span>
                        </div>
                    </div>
                </div>
                <div class="moneyDetail" v-if="cardFlag">
                    <div class="volume">
                        <div class="volumeNumber">
                            <span class="detailInfo">
                                <span class="name">分账金额</span>
                                <span class="num">¥{{toMoney((info.dateMerchantAmount / 100).toFixed(2))}}</span>
                            </span>
                            <span class="detailInfo">
                                <span class="name">优惠券补贴</span>
                                <span class="num">¥{{toMoney((info.dateDisctAmount / 100).toFixed(2))}}</span>
                            </span>
                            <span class="detailInfo" v-if="info.kaType">
                                <span class="name">{{ info.kaShortName || '' }}积分兑换</span>
                                <span class="num">¥{{toMoney((info.dateIntegralAmount / 100).toFixed(2))}}</span>
                            </span>
                        </div>
                    </div>
                    <div class="profit">
                        <div class="volumeNumber">
                            <span class="detailInfo">
                                <span class="name">分账金额</span>
                                <span class="num">¥{{toMoney((info.monthMerchantAmount / 100).toFixed(2))}}</span>
                            </span>
                            <span class="detailInfo">
                                <span class="name">优惠券补贴</span>
                                <span class="num">¥{{toMoney((info.monthDisctAmount / 100).toFixed(2))}}</span>
                            </span>
                            <span class="detailInfo" v-if="info.kaType">
                                <span class="name">{{ info.kaShortName || '' }}积分兑换</span>
                                <span class="num">¥{{toMoney((info.monthIntegralAmount / 100).toFixed(2))}}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="moneyDetailShowHide" @click="cardFlag=!cardFlag">
                    <img src="@/assets/replenishmentImg/arrow-up-active2.png" class="arrowImg" v-if="cardFlag">
                    <img src="@/assets/replenishmentImg/arrow-down-active2.png" class="arrowImg" v-if="!cardFlag">
                </div>
            </div>
            <van-tabs v-model:activeName="activeName" class='equipmentTabs' @click-tab="onClickTab">
                <van-tab title="日统计" name="yearStatistics">
                    <div class="choiceBox">
                        <van-field v-model="dateSelectDate.text" :clearable='true' readonly @click="yearShow = true"/>
                        <img src="@/assets/replenishmentImg/triangle@2x.png" alt="" class="chooseUrl">
                        <div class="penRight">共{{info.total}}笔，收入{{toMoney((info.currentTotalAmount / 100).toFixed(2))}}元</div>
                    </div>
                    <van-popup v-model:show="yearShow" position="bottom" :style="{ height: '40%' }">
                        <van-datetime-picker v-model="currentDay" type="date" title="选择日期" :show-toolbar="true" :min-date="minDate" :max-date="maxDate" :formatter="formatter" @cancel="yearShow = false" @confirm="yearDetermine"/>
                    </van-popup>
                    <div class="moneyList" v-if="activeName === 'yearStatistics'">
                        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad" offset="50">
                            <div class="each" v-for="(item,index) in list" :key="index">
                                <div class="eachContent" @click="newPage(`/containerDetails/${item.billNo}`)">
                                    <div>
                                        <div class="eachOrder">
                                            {{item.subOrderNo || '--'}}
                                            <template v-if="item?.tags?.length">
                                                <div class="label" v-for="(tag, index) in item.tags" :key="index">{{ tag }}</div>
                                            </template>
                                        </div>
                                        <div class="eachTitle">{{item.deviceName}}</div>
                                        <div class="eachTitle">{{item.time}}</div>
                                    </div>
                                    <div class="eachNument-box">
                                        <div class="eachNument">
                                            {{item.amount > 0 ? '+' : ''}}<span>{{toMoney(item.amount / 100)}}</span>
                                            <img src="@/assets/replenishmentImg/right@2x.png" alt="" class="rightBox">
                                        </div>
                                        <div class="identification" v-if="item.entryCode===2">(不入账)</div>
                                    </div>
                                </div>
                            </div>
                        </van-list>
                    </div>
                </van-tab>
                <van-tab title="月统计" name="monthStatistics">
                    <div class="choiceBox">
                        <van-field v-model="selectDate" :clearable='true' readonly @click="monthShow = true"/>
                        <img src="@/assets/replenishmentImg/triangle@2x.png" alt="" class="chooseImg">
                        <div class="penRight">共{{info.total}}笔，收入{{(info.currentTotalAmount / 100).toFixed(2)}}元</div>
                    </div>
                    <van-popup v-model:show="monthShow" position="bottom">
                        <van-datetime-picker v-model="currentMonth" type="year-month" title="选择日期" :show-toolbar="true" :min-date="minDate" :max-date="maxDate" :formatter="formatter" @cancel="monthShow = false" @confirm='determine()'/>
                    </van-popup>
                    <div class="moneyList" v-if="activeName === 'monthStatistics'">
                        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad" offset="50">
                            <div class="each" v-for="(item,index) in list" :key="index">
                                <div class="eachContent" @click="newPage(`/containerDetails/${item.billNo}`)">
                                    <div>
                                        <div class="eachOrder">
                                            {{item.subOrderNo || '--'}}
                                            <template v-if="item?.tags?.length">
                                                <div class="label" v-for="(tag, index) in item.tags" :key="index">{{ tag }}</div>
                                            </template>
                                        </div>
                                        <div class="eachTitle">{{item.deviceName}}</div>
                                        <div class="eachTitle">{{item.time}}</div>
                                    </div>
                                    <div class="eachNument-box">
                                        <div class="eachNument">
                                            {{item.amount > 0 ? '+' : ''}}<span>{{toMoney(item.amount / 100)}}</span>
                                            <img src="@/assets/replenishmentImg/right@2x.png" alt="" class="rightBox">
                                        </div>
                                        <div class="identification" v-if="item.entryCode===2">(不入账)</div>
                                    </div>
                                </div>
                            </div>
                        </van-list>
                    </div>
                </van-tab>
            </van-tabs>
        </van-pull-refresh>
        <van-popup v-model:show="chooseShow" position="bottom" :style="{ height: '88%' }" :close-on-click-overlay="false">
            <div class="popup-title van-hairline--bottom">
                <div class="title-text">全部筛选</div>
                <van-image :src="require('@/assets/close.png')" @click="closePopup" />
            </div>
            <div class="popup-content">
                <div class="content-cell van-hairline--bottom">
                    <div class="content-title">订单号</div>
                    <van-field v-model="subOrderNo" placeholder="请输入SO订单号" />
                </div>
                <div class="content-cell van-hairline--bottom">
                    <div class="content-title">
                        货柜选择
                        <div class="open" @click="containerOpenFlag=!containerOpenFlag" v-if="containerList.length > 3">
                            {{containerOpenFlag ? '收起' : '展开'}}
                            <van-image v-show="!containerOpenFlag" :src="require('@/assets/down-icon2.png')" />
                            <van-image v-show="containerOpenFlag" :src="require('@/assets/up-icon2.png')" />
                        </div>
                    </div>
                    <div class="option-box">
                        <template v-for="(item, index) in containerList.slice(0, containerOpenFlag ? 1000 : 3)" :key="index">
                            <div class="option-item" :class="containerCheck.find(val => val.deviceCode === item.deviceCode) ? 'active' : ''" @click="containerCheckFn(item)">
                                <div class="text--black van-ellipsis">{{ item.deviceName }}</div>
                                <div class="text--gray" v-if="item.deviceCode&&item.deviceCode!=='000000'">{{ item.deviceCode }}</div>
                            </div>
                        </template>
                        <div class="seat" v-if="containerList.length % 3 === 2"></div>
                    </div>
                </div>
                <div class="content-cell van-hairline--bottom">
                    <div class="content-title">
                        点位地址
                        <div class="open" @click="pointAddressOpenFlag=!pointAddressOpenFlag" v-if="pointAddressList.length > 3">
                            {{pointAddressOpenFlag ? '收起' : '展开'}}
                            <van-image v-show="!pointAddressOpenFlag" :src="require('@/assets/down-icon2.png')" />
                            <van-image v-show="pointAddressOpenFlag" :src="require('@/assets/up-icon2.png')" />
                        </div>
                    </div>
                    <div class="option-box">
                        <template v-for="(item, index) in pointAddressList.slice(0, pointAddressOpenFlag ? 1000 : 3)" :key="index">
                            <div class="option-item" :class="pointAddressCheck.value === item.value ? 'active' : ''" @click="pointAddressCheck = item">
                                <div class="text--black van-ellipsis">{{ `${item.desc}${item.qty > 1 ? '(' + item.qty + ')' : ''}` }}</div>
                            </div>
                        </template>
                        <div class="seat" v-if="pointAddressList.length % 3 === 2"></div>
                    </div>
                </div>
                <div class="content-cell van-hairline--bottom">
                    <div class="content-title">
                        点位场景
                        <div class="open" @click="pointSceneOpenFlag=!pointSceneOpenFlag" v-if="pointSceneList.length > 3">
                            {{pointSceneOpenFlag ? '收起' : '展开'}}
                            <van-image v-show="!pointSceneOpenFlag" :src="require('@/assets/down-icon2.png')" />
                            <van-image v-show="pointSceneOpenFlag" :src="require('@/assets/up-icon2.png')" />
                        </div>
                    </div>
                    <div class="option-box">
                        <template v-for="(item, index) in pointSceneList.slice(0, pointSceneOpenFlag ? 1000 : 3)" :key="index">
                            <div class="option-item" :class="pointSceneCheck.value === item.value ? 'active' : ''" @click="pointSceneCheck = item">
                                <div class="text--black van-ellipsis">{{ `${item.desc}${item.qty > 1 ? '(' + item.qty + ')' : ''}` }}</div>
                            </div>
                        </template>
                        <div class="seat" v-if="pointSceneList.length % 3 === 2"></div>
                    </div>
                </div>
                <div class="content-cell van-hairline--bottom">
                    <div class="content-title">
                        货柜类型
                        <div class="open" @click="cabinetTypeOpenFlag=!cabinetTypeOpenFlag" v-if="cabinetTypeList.length > 3">
                            {{cabinetTypeOpenFlag ? '收起' : '展开'}}
                            <van-image v-show="!cabinetTypeOpenFlag" :src="require('@/assets/down-icon2.png')" />
                            <van-image v-show="cabinetTypeOpenFlag" :src="require('@/assets/up-icon2.png')" />
                        </div>
                    </div>
                    <div class="option-box">
                        <template v-for="(item, index) in cabinetTypeList.slice(0, cabinetTypeOpenFlag ? 1000 : 3)" :key="index">
                            <div class="option-item" :class="(cabinetTypeCheck.firstCabinetType === item.firstCabinetType && (cabinetTypeCheck.firstCabinetType === '000000' || cabinetTypeCheck.secondCabinetType === item.secondCabinetType)) ? 'active' : ''" @click="cabinetTypeCheck = item">
                                <div class="text--black">{{ `${item.secondDesc}${item.qty > 1 ? '(' + item.qty + ')' : ''}` }}</div>
                                <div class="text--gray van-ellipsis">{{ item.desc }}</div>
                            </div>
                        </template>
                        <div class="seat" v-if="cabinetTypeList.length % 3 === 2"></div>
                    </div>
                </div>
                <div class="content-cell van-hairline--bottom" v-if="info.kaType">
                    <div class="content-title">
                        订单来源
                        <div class="open" @click="orderSourceOpenFlag=!orderSourceOpenFlag" v-if="orderSourceList.length > 3">
                            {{orderSourceOpenFlag ? '收起' : '展开'}}
                            <van-image v-show="!orderSourceOpenFlag" :src="require('@/assets/down-icon2.png')" />
                            <van-image v-show="orderSourceOpenFlag" :src="require('@/assets/up-icon2.png')" />
                        </div>
                    </div>
                    <div class="option-box">
                        <template v-for="(item, index) in orderSourceList.slice(0, orderSourceOpenFlag ? 1000 : 3)" :key="index">
                            <div class="option-item" :class="orderSourceCheck?.code === item.code ? 'active' : ''" @click="orderSourceCheck = item">
                                <div class="text--black van-ellipsis">{{ item.value }}</div>
                            </div>
                        </template>
                        <div class="seat" v-if="orderSourceList.length % 3 === 2"></div>
                    </div>
                </div>
            </div>
            <div class="button-box">
                <van-button block class="reset" @click="resetPopup">重置</van-button>
                <van-button block class="confirm" @click="exactly">确定</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { incomeList, incomeQueryCriteria } from '@/api/container.js'
import { newPage } from '@/utils/composables'

// tab
const activeName = ref('yearStatistics')
const currentDay = ref(new Date())
const currentMonth = ref(new Date())

// 收入卡片
const cardFlag = ref(false)

// 进入页面加载
const _D = new Date()
onMounted(() => {
    years.value = initYear()
    dateSelectDate.value = {
        text: _D.getFullYear() + '年',
        value: _D.getFullYear()
    }
    selectDate.value = `${_D.getFullYear()}年${_D.getMonth() + 1}月`
    const month = _D.getMonth() + 1
    dateSelectDate.value = {
        text: _D.getFullYear() + '年' + month + '月' + _D.getDate() + '日',
        value: _D.getFullYear() + '-' + month + '-' + _D.getDate()
    }
    onLoad()
})

// 筛选弹窗
const chooseShow = ref(false)
const screenText = ref('筛选')

// 订单号
const subOrderNo = ref('')

// 货柜
const containerCheck = ref([{
    deviceName: '所有货柜',
    deviceCode: '000000'
}])
const containerList = ref([])
const containerOpenFlag = ref(false)
const containerCheckFn = (item) => {
    if (item.deviceCode === '000000') {
        containerCheck.value = [item]
    } else {
        const index = containerCheck.value.findIndex(val => val.deviceCode === '000000')
        if (index > -1) containerCheck.value.splice(index, 1)
        const idx = containerCheck.value.findIndex(val => val.deviceCode === item.deviceCode)
        if (idx > -1) {
            containerCheck.value.splice(idx, 1)
        } else {
            containerCheck.value.push(item)
        }
        if (containerCheck.value.length === 0) {
            containerCheck.value = [{
                deviceName: '所有货柜',
                deviceCode: '000000'
            }]
        }
    }
}

// 点位地址
const pointAddressCheck = ref({ value: '000000' })
const pointAddressList = ref([])
const pointAddressOpenFlag = ref(false)

// 点位场景
const pointSceneCheck = ref({ value: '000000' })
const pointSceneList = ref([])
const pointSceneOpenFlag = ref(false)

// 货柜类型
const cabinetTypeCheck = ref({ firstCabinetType: '000000' })
const cabinetTypeList = ref([])
const cabinetTypeOpenFlag = ref(false)

// 订单来源
const orderSourceCheck = ref(null)
const orderSourceList = ref([])
const orderSourceOpenFlag = ref(false)

const screenFn = async () => {
    if (!containerList.value.length) {
        await getIncomeQueryCriteria()
    }
    updateScreenObj(true)
    chooseShow.value = true
}

const screenObj = ref()
const updateScreenObj = (flag) => {
    if (flag) {
        screenObj.value = {
            subOrderNo: subOrderNo.value,
            containerCheck: containerCheck.value,
            pointAddressCheck: pointAddressCheck.value,
            pointSceneCheck: pointSceneCheck.value,
            cabinetTypeCheck: cabinetTypeCheck.value,
            orderSourceCheck: orderSourceCheck.value
        }
    } else {
        subOrderNo.value = screenObj.value.subOrderNo
        containerCheck.value = screenObj.value.containerCheck
        pointAddressCheck.value = screenObj.value.pointAddressCheck
        pointSceneCheck.value = screenObj.value.pointSceneCheck
        cabinetTypeCheck.value = screenObj.value.cabinetTypeCheck
        orderSourceCheck.value = screenObj.value.orderSourceCheck
    }
}

const getIncomeQueryCriteria = async () => {
    const res = await incomeQueryCriteria({})
    // 点位地址
    let pointAddressListQty = 0
    res.data.deviceGroupCriteria.pointAddressStatsNodes.map(item => {
        pointAddressListQty += item.qty
        pointAddressList.value.push({
            desc: item.desc,
            qty: item.qty,
            value: item.value
        })
        return item
    })
    pointAddressList.value.unshift({
        desc: '全国',
        qty: pointAddressListQty,
        value: '000000'
    })
    // 点位场景
    let pointSceneListQty = 0
    res.data.deviceGroupCriteria.pointSceneStatsNodes.map(item => {
        pointSceneListQty += item.qty
        pointSceneList.value.push({
            desc: item.desc,
            qty: item.qty,
            value: item.value
        })
        return item
    })
    pointSceneList.value.unshift({
        desc: '全部',
        qty: pointSceneListQty,
        value: '000000'
    })
    // 货柜类型
    let cabinetTypeListQty = 0
    res.data.deviceGroupCriteria.cabinetTypeStatsNodes.map(item => {
        cabinetTypeListQty += item.qty
        if (item.childNodes && item.childNodes.length) {
            item.childNodes.map(val => {
                cabinetTypeList.value.push({
                    desc: item.desc,
                    secondDesc: val.desc,
                    qty: val.qty,
                    firstCabinetType: item.value,
                    secondCabinetType: val.value
                })
                return val
            })
        } else {
            cabinetTypeList.value.push({
                desc: item.desc,
                secondDesc: '',
                qty: item.qty,
                firstCabinetType: item.value,
                secondCabinetType: ''
            })
        }
        return item
    })
    cabinetTypeList.value.unshift({
        desc: '',
        secondDesc: '全部',
        qty: cabinetTypeListQty,
        firstCabinetType: '000000',
        secondCabinetType: ''
    })
    // 订单来源
    orderSourceList.value = res.data.platformList
    // 货柜选择
    containerList.value = res.data.deviceList.list
    containerList.value.unshift({
        deviceName: '所有货柜',
        deviceCode: '000000'
    })
}

const info = ref({
    dateAmount: 0,
    monthAmount: 0,
    yearAmount: 0,
    total: 0,
    currentTotalAmount: 0
})

const years = ref([])
const monthShow = ref(false)
const yearShow = ref(false)
const selectDate = ref('')
const dateSelectDate = ref({
    text: _D.getFullYear() + '年' + _D.getMonth() + 1 + '月' + _D.getDate() + '日',
    value: _D.getFullYear() + '-' + _D.getMonth() + 1 + '-' + _D.getDate()
})

const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const pageNum = ref(1)

const onLoad = async () => {
    const D = new Date(currentMonth.value)
    const deviceNos = containerCheck.value.map(item => item.deviceCode)
    const res = await incomeList({
        month: activeName.value === 'monthStatistics' ? `${D.getFullYear()}-${(D.getMonth() + 1) > 9 ? (D.getMonth() + 1) : '0' + (D.getMonth() + 1)}` : '',
        date: activeName.value === 'yearStatistics' ? dateSelectDate.value.value : '',
        page: pageNum.value,
        deviceNos: deviceNos[0] === '000000' ? [] : deviceNos,
        subOrderNo: subOrderNo.value,
        platformList: orderSourceCheck.value?.code ? [orderSourceCheck.value.code] : [],
        firstCabinetType: cabinetTypeCheck.value.firstCabinetType === '000000' ? '' : cabinetTypeCheck.value.firstCabinetType,
        secondCabinetType: cabinetTypeCheck.value.firstCabinetType === '000000' ? '' : cabinetTypeCheck.value.secondCabinetType,
        provinceCode: pointAddressCheck.value.value === '000000' ? '' : pointAddressCheck.value.value,
        firstScenesCode: pointSceneCheck.value.value === '000000' ? '' : pointSceneCheck.value.value
    })
    finished.value = false
    if (res.code === '200') {
        info.value = res.data
        if (refreshing.value) {
            refreshing.value = false
        }
        list.value = pageNum.value === 1 ? res.data.list : [...list.value, ...res.data.list]
        if ((res.data.total / 10) < pageNum.value) {
            finished.value = true
        }
        pageNum.value++
    } else {
        finished.value = true
    }
    loading.value = false
}

const onRefresh = () => {
    finished.value = false
    pageNum.value = 1
    onLoad()
}

const initYear = (startYear = 2022) => {
    const Y = _D.getFullYear()
    const yearArr = []
    for (let i = startYear; i <= Y; i++) {
        yearArr.push({ text: i + '年', value: i })
    }
    return yearArr
}

const closePopup = () => {
    chooseShow.value = false
    updateScreenObj(false)
}
const exactly = () => {
    const containerName = containerCheck.value.map(item => item.deviceName).join(',')
    const text = [subOrderNo.value, containerName, pointAddressCheck.value.desc, pointSceneCheck.value.desc, cabinetTypeCheck.value.desc, orderSourceCheck.value?.value]
    screenText.value = text.filter(item => item).join('-')
    if (screenText.value === '所有货柜') {
        screenText.value = '筛选'
    }
    chooseShow.value = false
    pageNum.value = 1
    onLoad()
}
const resetPopup = () => {
    subOrderNo.value = ''
    containerCheck.value = [{
        deviceName: '所有货柜',
        deviceCode: '000000'
    }]
    pointAddressCheck.value = { value: '000000' }
    pointSceneCheck.value = { value: '000000' }
    cabinetTypeCheck.value = { firstCabinetType: '000000' }
    orderSourceCheck.value = null
}

const onClickTab = ({ name }) => {
    if (name === 'yearStatistics') {
        const month = _D.getMonth() + 1
        dateSelectDate.value = {
            text: _D.getFullYear() + '年' + month + '月' + _D.getDate() + '日',
            value: _D.getFullYear() + '-' + month + '-' + _D.getDate()
        }
    } else {
        selectDate.value = `${_D.getFullYear()}年${_D.getMonth() + 1}月`
    }
    currentMonth.value = new Date()
    activeName.value = name
    pageNum.value = 1
    finished.value = false
    onLoad()
}

const minDate = new Date(2022, 0, 1)
const maxDate = new Date()
const formatter = (type, val) => {
    if (type === 'year') return `${val}年`
    if (type === 'month') return `${val}月`
    return val
}

//  年确定按钮
const yearDetermine = (val) => {
    yearShow.value = false
    dateSelectDate.value.text = dateFormat(val)
    dateSelectDate.value.value = dateFormat2(val)
    pageNum.value = 1
    onLoad()
}

// 时间确定按钮
const determine = () => {
    monthShow.value = false
    pageNum.value = 1
    selectDate.value = timeFormat(currentMonth.value)
    onLoad()
}

const timeFormat = (tiem) => {
    const year = tiem.getFullYear()
    const month = tiem.getMonth() + 1
    return year + '年' + month + '月'
}

const dateFormat = (time) => {
    const year = time.getFullYear()
    const month = time.getMonth() + 1
    const date = time.getDate()
    return year + '年' + month + '月' + date + '日'
}

const dateFormat2 = (time) => {
    const year = time.getFullYear()
    const month = time.getMonth() + 1
    const date = time.getDate()
    return year + '-' + month + '-' + date
}

// 将数字转换成金额显示
const toMoney = (num) => {
    if (num) {
        if (isNaN(num)) return '0.00'
        num = typeof num === 'string' ? parseFloat(num) : num // 判断是否是字符串如果是字符串转成数字
        num = num.toFixed(2) // 保留两位
        num = parseFloat(num) // 转成数字
        num = num.toLocaleString() // 转成金额显示模式
        // 判断是否有小数
        if (num.indexOf('.') === -1) {
            num = num + '.00'
        } else {
            num = num.split('.')[1].length < 2 ? num + '0' : num
        }
        return num // 返回的是具有千分位格式并保留2位小数的字符串
    } else {
        return (num = '0.00')
    }
}
</script>
<style lang="scss" scoped>
.incomeList{
    .amountBox{
        width: 750px;
        background: #FFFFFF;
        padding-bottom: 10px;
        padding-top: 30px;
        position: relative;
        :deep(.van-field){
            width: 690px;
            height: 64px;
            background: #F3F5F6;
            border-radius: 100px;
            margin-left: 30px;
            .van-field__control{
                text-indent: 10px;
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
            }
            .van-field__body{
                margin-top: -10px;
                .van-icon__image{
                    width: 24px;
                    height: 28px;
                }
            }
            .van-field__control{
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .chooseImg{
            position: absolute;
            width: 20px;
            height: 13px;
            top: 58px;
            right: 70px;
        }
        .money{
            width: 690px;
            height: 180px;
            background: #FE7E41;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            margin-top: 25px;
            margin-left: 30px;
            display: flex;
            .volume{
                flex: 1;
                margin-left: 40px;
                .volumeTitle{
                    font-size: 26px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #FFFFFF;
                    margin-top: 52px;
                }
                .volumeNumber{
                    color: #FFFFFF;
                    .amounBox{
                        font-size: 30px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                    }
                    .amountMoney{
                        font-size: 46px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 500;
                    }
                }
            }
            .middle{
                width: 1px;
                height: 79px;
                background: #FF905C;
                margin-top: 80px;
            }
            .profit{
                flex: 1;
                margin-left: 40px;
                .volumeTitle{
                    font-size: 26px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #FFFFFF;
                    margin-top: 52px;
                }
                .volumeNumber{
                    color: #FFFFFF;
                    .amounBox{
                        font-size: 30px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                    }
                    .amountMoney{
                        font-size: 46px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 500;
                    }
                }
            }
        }
        .moneyDetail{
            width: 690px;
            // height: 230px;
            background: #FF702B;
            margin-left: 30px;
            display: flex;
            padding-top: 12px;
            .volume{
                flex: 1;
                margin-left: 40px;
                .volumeNumber{
                    color: #FFFFFF;
                    .detailInfo{
                        display: block;
                        font-size: 24px;
                        margin-top: 4px;
                        span{
                            display: inline-block;
                        }
                        .name{
                            width: 60%;
                        }
                    }
                }
            }
            .profit{
                flex: 1;
                margin-left: 40px;
                .volumeNumber{
                    color: #FFFFFF;
                    .detailInfo{
                        display: block;
                        font-size: 24px;
                        margin-top: 4px;
                        span{
                            display: inline-block;
                        }
                        .name{
                            width: 60%;
                        }
                    }
                }
            }
        }
        .moneyDetailShowHide{
            height: 44px;
            width: 690px;
            border: none;
            border-bottom-left-radius: 20px;
            border-bottom-right-radius: 20px;
            background: #FF702B;
            margin-left: 30px;
            margin-bottom: 30px;
            text-align: center;
            .arrowImg{
                width: 26px;
            }
        }
    }
    .equipmentTabs{
        margin-top: 20px;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191919;
        :deep(.van-tab--active){
            font-size: 28px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #FE7E41;
        }
        :deep(.van-tabs__line){
            background: #FE7E41;
        }
        .choiceBox{
            background: #F7F7F7;
            position: relative;
            display: flex;
            justify-content:space-between;
            .van-cell{
                width: 400px;
                background: #F7F7F7;
                margin-left: 10px;
            }
            .chooseImg{
                position: absolute;
                width: 20px;
                height: 13px;
                top:35px;
                left: 215px;
            }
            .chooseUrl{
                position: absolute;
                width: 20px;
                height: 13px;
                top:35px;
                left: 270px;
            }
            .penRight{
                font-size: 24px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #B0B0B0;
                margin-top: 25px;
                margin-right: 30px;
            }
        }
        .moneyList{
            background: #fff;
            :deep(.van-list__finished-text){
                background: #F4F5F5 !important;
            }
            .each{
                background: #fff;
                .eachContent{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 36px 30px;
                    border-bottom: 2px solid #F4F5F5;
                    .eachTitle{
                        font-size: 26px;
                        font-weight: 400;
                        color: #B0B0B0;
                        margin-top: 8px;
                    }
                    .eachOrder{
                        font-size: 30px;
                        font-weight: 400;
                        color: #191919;
                        display: flex;
                        align-items: center;
                        .label{
                            font-size: 20px;
                            font-weight: 400;
                            padding: 2px 10px;
                            color: #FE7E41;
                            background: #FFE8DD;
                            border-radius: 17px;
                            margin-left: 16px;
                        }
                    }
                    .eachNument{
                        font-size: 30px;
                        font-weight: 500;
                        color: #191919;
                        display: flex;
                        .rightBox{
                            width: 12px;
                            height: 22px;
                            margin-left: 16px;
                            margin-top: 9px;
                        }
                    }
                    .identification{
                        font-size: 22px;
                        font-weight: 400;
                        color: #999999;
                    }
                }
            }
        }
        :deep(.van-picker__confirm){
            color: #FE7E41;
        }
    }
    :deep(.van-popup){
        border-radius: 24px 24px 0px 0px;
        display: flex;
        flex-direction: column;
        .popup-title{
            display: flex;
            align-items: center;
            padding: 40px 50px 40px 96px;
            .title-text{
                width: 0;
                flex: 1;
                text-align: center;
                font-size: 32px;
                font-weight: 500;
                color: #191919;
            }
            .van-image{
                width: 46px;
                height: 46px;
            }
        }
        .popup-content{
            height: 0;
            flex: 1;
            overflow-y: scroll;
            padding: 0 50px;
            .content-cell{
                padding: 30px 0;
                .content-title{
                    font-size: 28px;
                    font-weight: 500;
                    color: #191919;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .open{
                        font-size: 20px;
                        font-weight: 400;
                        color: #191919;
                        display: flex;
                        align-items: center;
                        .van-image{
                            width: 22px;
                            height: 10px;
                            margin-left: 10px;
                        }
                    }
                }
                .option-box{
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    .active{
                        position: relative;
                        border: 2px solid #FE7E41 !important;
                        background: rgba(254,126,65,0.08) !important;
                    }
                    .active::after{
                        content: '';
                        width: 40px;
                        height: 40px;
                        background-image: url('~@/assets/check-mark2.png');
                        background-size: 100% 100%;
                        position: absolute;
                        right: 0;
                        bottom: 0;
                    }
                    .seat{
                        width: 200px;
                    }
                    .option-item{
                        width: 200px;
                        background: #F4F5F5;
                        border-radius: 8px;
                        padding: 16px;
                        text-align: center;
                        margin-top: 24px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        box-sizing: border-box;
                        border: 2px solid #F4F5F5;
                        .text--black{
                            font-size: 24px;
                            font-weight: 500;
                            color: #191919;
                        }
                        .text--gray{
                            font-size: 20px;
                            font-weight: 400;
                            color: #999999;
                            margin-top: 4px;
                        }
                    }
                }
                .van-field{
                    background: #F4F5F5;
                    border-radius: 8px;
                    height: 64px;
                    line-height: 64px;
                    padding: initial;
                    padding-left: 24px;
                    margin-top: 24px;
                    font-size: 26px;
                    font-weight: 400;
                    color: #999999;
                }
            }
        }
        .button-box{
            padding: 10px 40px;
            display: flex;
            background-color: #fff;
            padding-bottom: calc(10px + constant(safe-area-inset-bottom));
            padding-bottom: calc(10px + env(safe-area-inset-bottom));
            .reset{
                height: 92px;
                background: #FFFFFF;
                border-radius: 46px;
                border: 2px solid #FE7E41;
                font-size: 30px;
                font-weight: 500;
                color: #FE7E41;
                margin-right: 38px;
            }
            .confirm{
                height: 92px;
                background: linear-gradient(90deg, #FE7E41 0%, #FF5D0F 100%, #FF5C0E 100%);
                border-radius: 46px;
                font-size: 30px;
                font-weight: 500;
                color: #FFFFFF;
            }
        }
    }
}
</style>
