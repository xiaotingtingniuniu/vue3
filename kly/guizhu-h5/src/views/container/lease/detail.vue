<template>
    <div class="container-lease-page">
        <div class="search-box-height" :class="startTime&&endTime ? 'pdb175' : ''"></div>
        <div class="search-box">
            <form action="/">
                <van-search v-model="searchValue" show-action placeholder="请输入设备编号" @search="onSearch" shape="round" :left-icon="require('@/assets/search-icon.png')">
                    <template #action>
                        <van-image @click="openCalendar" :src="require('@/assets/date-icon.png')" />
                    </template>
                </van-search>
            </form>
            <div class="search-date" v-if="startTime&&endTime">
                <div class="search-date--title">应付日期</div>
                <div class="search-date--text">
                    <van-button @click="openCalendar">{{ startTime }}</van-button>-<van-button @click="openCalendar">{{ endTime }}</van-button>
                </div>
            </div>
        </div>
        <van-calendar ref="refCalendar" :default-date="null" v-model:show="calendarShow" color="#FE7E41" type="range" :min-date="minDate" :max-date="maxDate" :allow-same-day="true">
            <template #title>
                <div class="title">
                    <div class="clear" @click="calendarReset">清空</div>
                    <div class="title-text">选择应付日期</div>
                </div>
            </template>
            <template #footer>
                <van-button block @click="calendarConfirm">确认</van-button>
            </template>
        </van-calendar>
        <div class="container">
            <div class="container-list" v-if="resultdata">
                <template v-if="resultdata.length">
                    <div class="container-item" v-for="(item, index) in resultdata" :key="index">
                        <div class="container-item-top">
                            <div class="container-item-top-content">设备编号：{{item.equipmentNo === '' ? '—' : item.equipmentNo}}
                                <div class="lease-title-other title-0" v-if="item.equipmentStatus === 0">未结清</div>
                                <div class="lease-title-other title-1" v-if="item.equipmentStatus === 1">已结清</div>
                                <div class="lease-title-other" v-if="item.equipmentStatus === 2">已退款</div>
                                <div class="lease-title-other" v-if="item.equipmentStatus === 3">已解约</div>
                                <div class="lease-title-other" v-if="item.equipmentStatus === 9">已取消</div>
                            </div>
                        </div>
                        <div class="container-item-main">
                            <van-image class="image" fit="cover" :src="require(('@/assets/my-container.png'))"/>
                            <div class="container-content">
                                <div class="text">货柜型号：{{item.equipmentModel}}</div>
                                <div class="text">货柜台数：{{item.equipmentNums}}</div>
                                <div class="text">当前期数：{{item.currentTerm}}</div>
                                <div class="text">当期应付：{{item.currentPayAmount}}</div>
                                <div class="text">当期状态：<span>{{item.currSquareStatus===1 ? '已结清' : '未结清'}}</span></div>
                                <div class="text">收货地址：{{item.equipmentAddress === '' ? '--' : item.equipmentAddress}}</div>
                                <div class="text text-icon" @click="payPlanShow(item.stages, index, item.equipmentStatus)">
                                    <div class="plan">
                                        <div class="plan-text">付款计划：</div>
                                        <div class="step">
                                            <div class="step-plan">
                                                <span v-for="TermIndex in item.currentTerms" :key="TermIndex">{{TermIndex}}/{{item.applyTerm}}期</span>
                                            </div>
                                        </div>
                                    </div>
                                    <van-icon color="#B0B0B0" size="18px" name="arrow" />
                                </div>
                                <div>
                                    <div class="received-button button" v-if="item.stages[0].currSquareStatus === 1 && item.receiveStatus === 0" @click="confirmReceipt(item.pointId, item.orderNo)">确认收货</div>
                                    <div v-if="item.stages[0].currSquareStatus === 0"></div>
                                    <div class="noreceived-button button" v-if="item.receiveStatus === 1">已收货</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <div class="no-data" v-else>
                    <div class="no-data--bg"></div>
                    <div class="no-data--text">暂无订单详情</div>
                </div>
                <div class="content-height"></div>
                <div class="container-pay" v-if="props.orderStatus == 0">
                    <div class="pay-text">
                        <div class="total">应付总额：<span>￥{{totalAmount}}</span></div>
                        <div class="detail" v-if="resultdata && resultdata[0]?.leaseMode === '1'">保证金￥{{Dep}}，物流费￥{{Fee}}，租金￥{{Mon}}</div>
                        <div class="detail" v-else>物流费￥{{Fee}}，租金￥{{Mon}}</div>
                    </div>
                    <div class="pay-button" v-if="totalAmount !== '0.00'">
                        <van-button class="bottom-btn" @click="goPay" round color="#FE7E41" text="30">去支付</van-button>
                    </div>
                    <div class="pay-button" v-else>
                        <van-button class="bottom-btn" round color="#FE7E41" disabled text="30">去支付</van-button>
                    </div>
                </div>
            </div>
            <van-popup v-model:show="show" position="bottom" :style="{ height: '70%' }">
                <div class="pay-plan">
                    <div class="pay-sure">
                        <div class="pay-fixed">
                            <div class="pay-title">
                                <div class="close" @click="closeBtn"></div>
                                <div class="text">付款计划</div>
                                <div class="sure" @click="sureBtn">确定</div>
                            </div>
                        </div>
                    </div>
                    <div :class="((list.currSquareStatus === 1 && list.selected === 1) || (equiStatus === 1 || equiStatus === 2 || equiStatus === 3)) ? 'nopay-content' : 'pay-content'" v-for="(list, index) in selectionData" :key="index">
                        <van-checkbox v-model="list.checked" :disabled="(list.currSquareStatus === 1 || equiStatus === 1 || equiStatus === 2 || equiStatus === 3) ? true : false" label-disabled>
                            <div class="pay-list">
                                <div class="list">
                                    <div>期数：{{list.currentTerm}}/{{list.applyTerm}}期</div>
                                    <div>状态：{{list.currSquareStatus===1 ? '已结清' : '未结清'}}</div>
                                </div>
                                <div class="list" v-if="list.currentTerm === 1">
                                    <div  v-if="resultdata[0]?.leaseMode === '1'">保证金：￥{{list.deposit}}</div>
                                    <div>物流费：￥{{list.logisticFee}}</div>
                                </div>
                                <div class="list">
                                    <div>租金：¥{{list.monthlyRent}}</div>
                                    <div>应付日期：{{list.copeTime}}</div>
                                </div>
                                <div class="list">
                                    <div>实付日期：{{list.realityTime ? list.realityTime : '—'}}</div>
                                </div>
                            </div>
                            <template #icon="props">
                                <img class="img-icon" v-if="list.selected === 1 && list.currSquareStatus === 0 && list.currentTerm === 1" :src="inactiveIcon" />
                                <img class="img-icon" v-if="(list.selected === 1 && list.currSquareStatus === 1) || (equiStatus === 1 ||equiStatus === 2 || equiStatus === 3)" :src="activeIcon" />
                                <img class="img-icon" v-if="list.selected === 1 && list.currSquareStatus === 0 && list.currentTerm !== 1 && equiStatus !== 1 && equiStatus !== 2 && equiStatus !== 3" @click.prevent.stop="checkYesClick(index, list)" :src="props.checked ? inactiveIcon : disableIcon" />
                                <img class="img-icon" v-if="list.selected === 0 && list.currSquareStatus === 0 && list.currentTerm !== 1 && equiStatus !== 1 && equiStatus !== 2 && equiStatus !== 3" @click.prevent.stop="checkYesClick(index, list)" :src="props.checked ? inactiveIcon : disableIcon" />
                            </template>
                        </van-checkbox>
                    </div>
                </div>
            </van-popup>
        </div>
    </div>
    <van-dialog v-model:show="isshow" show-cancel-button width="320px" @confirm="conFirm" confirmButtonText="确认收货" confirmButtonColor="#FE7E41">
        <div class="title-confirm">提示</div>
        <div class="content">请确认货柜型号、数量、外观无破损、无质量问题后，确认收货。</div>
    </van-dialog>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import activeIcon from '@/assets/ash-check.png'
import inactiveIcon from '@/assets/check.png'
import { containerDetail, confimReceive, leaseOrderPay } from '@/api/container'
import disableIcon from '@/assets/no-check.png'
import { appBridge } from '@/utils/bridge.js'
import { Toast } from 'vant'
import { isApp, isIos, getDate } from '@/utils'

const show = ref(false)
const resultdata = ref(null)
const props = defineProps(['orderNo', 'orderStatus'])
const isshow = ref(false)
const selectionData = ref([])
const selectionInd = ref()
const equiStatus = ref(null)
const currentTerms = ref([])

const searchValue = ref('')
const calendarShow = ref(false)
const date = new Date()
const minDate = new Date(`${date.getFullYear() - 3}/01/01`)
const maxDate = new Date(`${date.getFullYear() + 3}/12/31`)
const refCalendar = ref(null)
const startTime = ref(null)
const endTime = ref(null)
const openCalendar = () => {
    calendarShow.value = true
    if (!startTime.value) {
        refCalendar.value.scrollToDate(new Date())
    }
}
const onSearch = () => containerdetail()

const calendarReset = () => {
    refCalendar.value.reset()
}

// 自定义日期 选中日期范围
const calendarConfirm = () => {
    const val = refCalendar.value.getSelectedDate()
    if (val) {
        startTime.value = getDate(val[0])
        endTime.value = getDate(val[1] || val[0])
    } else {
        startTime.value = null
        endTime.value = null
    }
    containerdetail()
    calendarShow.value = false
}

const payPlanShow = (stages, index, equiCode) => {
    show.value = true
    equiStatus.value = equiCode
    selectionData.value = stages
    selectionInd.value = index
}
const closeBtn = () => {
    show.value = false
    for (let i = 0; i < resultdata.value.length; i++) {
        for (let j = 0; j < resultdata.value[i].stages.length; j++) {
            if (resultdata.value[i].stages[j].selected === 0) {
                resultdata.value[i].stages[j].checked = false
            } else {
                resultdata.value[i].stages[j].checked = true
            }
        }
    }
}
const totalAmount = computed(() => {
    const allresult = ref(0)
    if (resultdata.value) {
        for (let i = 0; i < resultdata.value.length; i++) {
            if (resultdata.value[i].equipmentStatus === 0) {
                const resultprice = resultdata.value[i].stages.reduce((prev, item) => {
                    let price = 0
                    if (item.checked && !item.currSquareStatus) (price += Number(item.currentPayAmount))
                    var allprice = Number(prev) + Number(price)
                    return allprice
                }, 0)
                allresult.value += resultprice
            }
        }
    }
    return allresult.value.toFixed(2)
})
// 物流保证金租金费
const Fee = computed(() => {
    const logisticFees = ref(0)
    if (resultdata.value) {
        for (let i = 0; i < resultdata.value.length; i++) {
            if (resultdata.value[i].equipmentStatus === 0) {
                const alllogisticFee = resultdata.value[i].stages.reduce((prev, item) => {
                    let price = 0
                    if (item.checked && !item.currSquareStatus) {
                        if (item.logisticFee !== '0.00') (price += Number(item.logisticFee))
                    }
                    var allprice = Number(prev) + Number(price)
                    return allprice
                }, 0)
                logisticFees.value += alllogisticFee
            }
        }
    }
    return logisticFees.value.toFixed(2)
})
const Dep = computed(() => {
    const deposits = ref(0)
    if (resultdata.value) {
        for (let i = 0; i < resultdata.value.length; i++) {
            if (resultdata.value[i].equipmentStatus === 0) {
                const alldeposit = resultdata.value[i].stages.reduce((prev, item) => {
                    let price = 0
                    if (item.checked && !item.currSquareStatus) {
                        if (item.deposit !== '0.00') (price += Number(item.deposit))
                    }
                    var allprice = Number(prev) + Number(price)
                    return allprice
                }, 0)
                deposits.value += alldeposit
            }
        }
    }
    return deposits.value.toFixed(2)
})
const Mon = computed(() => {
    const monthlyRents = ref(0)
    if (resultdata.value) {
        for (let i = 0; i < resultdata.value.length; i++) {
            if (resultdata.value[i].equipmentStatus === 0) {
                const allmonthlyRent = resultdata.value[i].stages.reduce((prev, item) => {
                    let price = 0
                    if (item.checked && !item.currSquareStatus) {
                        if (item.monthlyRent !== '0.00') (price += Number(item.monthlyRent))
                    }
                    var allprice = Number(prev) + Number(price)
                    return allprice
                }, 0)
                monthlyRents.value += allmonthlyRent
            }
        }
    }
    return monthlyRents.value.toFixed(2)
})
const sureBtn = () => {
    show.value = false
    if (selectionData.value[0].selected === 1 && selectionData.value[0].currSquareStatus === 0) {
        selectionData.value[0].checked = true
    }
}
const currentId = ref('')
const currentNo = ref('')
const confirmReceipt = async (Id, No) => {
    isshow.value = true
    currentId.value = Id
    currentNo.value = No
}
const conFirm = async () => {
    const res = await confimReceive({
        pointId: currentId.value,
        orderNo: currentNo.value
    })
    Toast(res.msg)
    window.location.reload()
}
onMounted(() => {
    containerdetail()
})
const containerdetail = async () => {
    const res = await containerDetail({
        orderNo: props.orderNo,
        equipmentNo: searchValue.value,
        copeTimeStart: startTime.value,
        copeTimeEnd: endTime.value
    })
    console.log(res)
    resultdata.value = res.data
    resultdata.value.map(el => {
        el.currentTerms = [el.currentTerm]
        el.stages.map(item => {
            if (item.selected) {
                item.checked = true
            } else {
                item.checked = false
            }
        })
    })
}
const payFnFlag = ref(false)
const goPay = async () => {
    if (payFnFlag.value) return false
    payFnFlag.value = true
    const selectData = resultdata.value.map(el => {
        const arr = el.stages.filter(item => {
            if (item.checked && item.currSquareStatus !== 1 && el.equipmentStatus === 0) {
                return item.checked
            }
        })
        return {
            pointId: el.pointId,
            currentTerms: arr.map(el => el.currentTerm)
        }
    })
    const result = selectData.filter(item => {
        if (item.currentTerms.length !== 0) {
            return item
        }
    })
    const res = await leaseOrderPay({
        orderNo: props.orderNo,
        points: result
    })
    payFnFlag.value = false
    res.businessUniqueCode = 'A1002001001111'
    const num = '0'
    if (res.prePayNo) {
        if (isApp) {
            if (isIos) {
                appBridge('checkout', { payurl: `${process.env.VUE_APP_LAYOUT_BASEURL_SYT}/${res.businessUniqueCode}/${res.prePayNo}?showNavbar=0&env=App&hideTitle=0&businessType=1&successUrl=${encodeURIComponent(location.origin + `/container/payresult/${res.prePayNo}/${props.orderNo}/${props.orderStatus}/${num}`)}&overtimeUrl=${encodeURIComponent(location.origin + `/container/lease/${props.orderNo}/${props.orderStatus}`)}` })
            } else {
                appBridge('checkout', { payurl: `${process.env.VUE_APP_LAYOUT_BASEURL_SYT}/${res.businessUniqueCode}/${res.prePayNo}?showNavbar=0&env=App&hideTitle=0&businessType=1&successUrl=${encodeURIComponent(location.origin + `/container/payresult/${res.prePayNo}/${props.orderNo}/${props.orderStatus}/${num}`)}&backUrl=${encodeURIComponent(location.origin + `/container/lease/${props.orderNo}/${props.orderStatus}`)}&overtimeUrl=${encodeURIComponent(location.origin + `/container/lease/${props.orderNo}/${props.orderStatus}`)}` })
            }
        }
    }
}
const checkYesClick = (index, status) => {
    resultdata.value[selectionInd.value].currentTerms = []
    const currentItem = selectionData.value[index]
    if (currentItem.checked === true) {
        selectionData.value.map((item, itemIndex) => {
            if (itemIndex >= index) {
                item.checked = false
            } else {
                item.checked = true
            }
            if (item.checked === true && item.currSquareStatus === 0) {
                currentTerms.value.push(item.currentTerm)
                resultdata.value[selectionInd.value].currentTerms.push(item.currentTerm)
            }
        })
    } else {
        selectionData.value.map((item, itemIndex) => {
            console.log(item, 'item')
            if (itemIndex <= index) {
                item.checked = true
            } else {
                item.checked = false
            }
            if (item.checked === true && item.currSquareStatus === 0) {
                currentTerms.value.push(item.currentTerm)
                resultdata.value[selectionInd.value].currentTerms.push(item.currentTerm)
            }
        })
    }
}
</script>
<style lang="scss" scoped>
@mixin font-color {
    margin-right: 8px;
    font-size: 22px;
}
.search-box-height{
    width: 100%;
    height: 102px;
}
.pdb175{
    padding-bottom: 175px;
}
.search-box{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    .van-search{
        :deep(.van-search__content){
            padding-left: 30px;
            .van-field__left-icon{
                margin-right: 12px;
            }
        }
        :deep(.van-search__field){
            height: 62px;
        }
        :deep(.van-search__action){
            display: flex;
            align-items: center;
            margin: 0 30px;
            padding: initial;
            .van-image{
                width: 40px;
                height: 40px;
            }
        }
    }
    .search-date{
        padding: 14px 30px 32px;
        background-color: #fff;
        .search-date--title{
            font-size: 26px;
            font-weight: 500;
            color: #191919;
        }
        .search-date--text{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 32px;
            font-size: 24px;
            font-weight: 400;
            color: #191919;
            .van-button{
                width: 320px;
                height: 60px;
                border-radius: 30px;
                border: 2px solid #EFEFEF;
                font-size: 24px;
                font-weight: 400;
                color: #191919;
            }
        }
    }
}
.container-lease-page{
    height: 100vh;
    background: #f4f5f5;
    :deep(.van-calendar__header-title){
        .title{
            display: flex;
            align-items: center;
            .clear{
                font-size: 32px;
                color: #c8c9cc;
                margin-left: 30px;
                font-weight: 400;
            }
            .title-text{
                width: 0;
                flex: 1;
                text-align: center;
                padding-right: 80px;
            }
        }
    }
    :deep(.van-calendar__footer){
        .van-button{
            height: 92px;
            background: #FE7E41;
            border-radius: 46px;
            font-size: 30px;
            font-weight: 500;
            color: #FFFFFF;
            margin: 14px 0;
        }
    }
    .container {
        background: #f4f5f5;
        .container-list{
            padding-top: 20px;
            .container-item{
                background-color: #FFFFFF;
                margin-bottom: 20px;
            }
            .no-data{
                .no-data--bg{
                    width: 216px;
                    height: 214px;
                    background-image: url('~@/assets/no-list.png');
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    margin: 218px auto 0;
                }
                .no-data--text{
                    font-size: 36px;
                    font-weight: 500;
                    color: #191919;
                    line-height: 50px;
                    margin-top: 16px;
                    text-align: center;
                }
            }
            .container-item-top{
                height: 81px;
                line-height: 81px;
                padding: 0 30px;
                font-size: 25px;
                font-weight: 700;
            }
            .container-item-top-content{
                width: 100%;
                height: 99%;
                border-bottom: 1px solid #EDEDED;
                .lease-title-other{
                    display: inline-block;
                    float: right;
                    font-weight: normal;
                }
                .title-0{
                    color: #FE7E41;
                }
                .title-1{
                    color: #3289ff;
                }
            }
            .container-item-main{
                display: flex;
                padding: 30px 30px 30px 30px;
                background-color: #FFFFFF;
                margin-bottom: 20px;
                &>.van-image{
                    width: 210px;
                    height: 210px;
                    margin-right: 24px;
                    position: initial;
                }
            }
            .container-content{
                flex: 1;
                font-size: 24px;
                color: #333333;
                .text{
                    padding-bottom: 10px;
                    span{
                        color: #FE7E41;
                    }
                }
                .text-icon{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .plan{
                        display: flex;
                        .plan-text{
                            // width: 120px;
                        }
                        .step{
                            // width: 0;
                            flex: 1;
                            // display: flex;
                            .step-plan{
                                width: 240px;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                span{
                                    color: #333333;
                                    padding-right: 10px;
                                }
                            }
                        }
                    }
                }
                .button{
                    float: right;
                    width: 152px;
                    height: 62px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 34px;
                    font-size: 24px;
                }
                .received-button{
                    border: 1px solid #FE7E41;
                    color: #FE7E41;
                    font-size: 24px;
                }
                .noreceived-button{
                    border: 1px solid #E2E2E2;
                    background-color: #F3F3F3;
                    color: #CECECE;
                }
            }
            .content-height{
                height: 130px;
                color: #f4f5f5 !important;
            }
            .container-pay{
                background: #ffffff;
                position: fixed;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                // padding: 19px 30px;
                padding: 19px 30px 30px 30px;
                justify-content: space-between;
                .pay-text{
                    .total{
                        font-size: 26px;
                        color: #191919;
                        span{
                            font-size: 32px;
                            color: #FE7E41;
                        }
                    }
                    .detail{
                        font-size: 20px;
                        color: #A3A3B2;
                    }
                }
                .pay-button{
                    .bottom-btn{
                        width: 200px;
                        height: 70px;
                    }
                }
            }
        }
        .pay-plan{
            // padding: 30px 50px 30px 50px;
            // border-bottom: 1px solid #F2F6F9;
            .pay-sure{
                height: 104px;
            }
            .pay-fixed{
                position: fixed;
                left: 0;
                right: 0;
                background-color: #FFFFFF;
                height: 104px;
                z-index: 99999;
            }
            .pay-title{
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #191919;
                font-size: 32px;
                padding: 30px 50px 30px 50px;
                border-bottom: 1px solid #F2F6F9;
                z-index: 5;
                .close{
                    width: 46px;
                    height: 46px;
                    background-image: url('../../../assets/close.png');
                    background-size: 100% auto;
                    background-repeat: no-repeat;
                }
                .text{
                    font-weight: bold;
                }
                .sure{
                    font-size: 28px;
                    color: #FE7E41;
                    font-weight: bold;
                }
            }
            .nopay-content{
                margin: 30px 58px 15px 51px;
                border-bottom: 1px solid #F2F6F9;
                display: flex;
                .van-checkbox{
                    width: 100%;
                    align-items: flex-start;
                    :deep(.van-checkbox__label){
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .img-icon{
                        width: 36px;
                        height: 36px;
                    }
                }
                .pay-list{
                    flex: 1;
                    padding-bottom: 15px;
                    .list{
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        color: #A3A3B2;
                        font-size: 26px;
                        margin-bottom: 10px;
                    }
                }
            }
            .pay-content{
                // height: 237px;
                margin: 30px 58px 15px 51px;
                border-bottom: 1px solid #F2F6F9;
                display: flex;
                .van-checkbox{
                    width: 100%;
                    align-items: flex-start;
                    :deep(.van-checkbox__label){
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .img-icon{
                        width: 36px;
                        height: 36px;
                    }
                }
                .pay-list{
                    flex: 1;
                    padding-bottom: 15px;
                    .list{
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        color: #191919;
                        font-size: 26px;
                        margin-bottom: 10px;
                    }
                }
            }
        }
    }
}
.title-confirm{
    font-size: 36px;
    color: #000000;
    text-align: center;
    padding: 40px 0px 0px 0px;
}
.content{
    font-size: 30px;
    color: #888888;
    padding: 10px 50px 40px 50px;
}
.van-dialog{
    border-radius: 18px;
}
</style>
