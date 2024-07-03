<template>
    <div class="history-signal">
        <div class="signal-data ">
            <div class="signal-data-input">
                <van-field
                    v-model="date"
                    is-link
                    readonly
                    name="calendar"
                    placeholder="点击选择日期"
                    @click="showCalendar = true"
                />
                <img :src="slices" alt="" class="slicesImage" />
            </div>
            <van-calendar v-model:show="showCalendar" @confirm="onConfirm" :min-date="minDate" :max-date="maxDate"/>
        </div>
        <div class="signal-content">
            <div
                class="signal-title"
                v-for="(item, index) in title"
                :key="index"
            >
                {{ item.text || '' }}
            </div>

            <div
                class="signal-container"
                v-for="(item, index) in list"
                :key="index"
            >
                <template v-if="item.signalStrength">
                    <div class="signal-type">
                        <span v-if="item.networkTypeName">{{ item.networkTypeName || '' }}(</span
                        ><span>{{ item.signalStrength}})dbm</span>
                    </div>
                    <div class="signal-data" v-if="item.lastRefreshTime">
                        {{ item.lastRefreshTime || '' }}
                    </div>
                </template>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getSingle } from '@/api/device'
import { useRoute } from 'vue-router'
import slices from '@/assets/slices.png'
import * as dayjs from 'dayjs'
const route = useRoute()

// const result = ref('')
const list = ref(null)
const title = ref(null)
const showCalendar = ref(false)
// const timeFront = ref('')
// const timeEnd = ref('')
const isLess10 = (value) => {
    return value < 10 ? `0${value}` : value
}

const getTime = (num) => {
    return {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        day: new Date().getDate(),
        calcDay: dayjs().subtract(num, 'day').date()
    }
}

const { year, month, day, calcDay } = getTime(2)

const minDate = ref(new Date(year, month, calcDay))
const maxDate = ref(new Date(year, month, day))

// const formatDate = (date) => {
//     const month = isLess10(date.getMonth() + 1)
//     const day = isLess10(date.getDate())
//     const startTime = `${date.getFullYear()}-${month}-${day} 00:00:00`
//     const endTime = `${date.getFullYear()}-${month}-${day} 23:59:59`
//     const curTime = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
//     return {
//         startTime,
//         endTime,
//         curTime
//     }
// }
const formatDate = (date) => {
    const currentMonth = date.getMonth() + 1
    const month = isLess10(currentMonth)
    const day = isLess10(date.getDate())
    const startTime = `${date.getFullYear()}-${month}-${day} 00:00:00`
    const endTime = `${date.getFullYear()}-${month}-${day} 23:59:59`
    const curTime = `${date.getFullYear()}年${currentMonth}月${date.getDate()}日`
    return {
        startTime,
        endTime,
        curTime
    }
}
const date = ref(`${new Date().getFullYear()}年${new Date().getMonth() + 1}月${new Date().getDate()}日`)

title.value = [
    { text: '信号强范围：>=(-70dbm)；信号值' },
    { text: '信号较弱范围：<(-80dbm)；信号弱<(-100)dbm' }
]
// const onConfirm = (value) => {
//     console.dir(value, 'value')
//     date.value = formatDate(value).curTime
//     // console.log(value)
//     // result.value = `${date.getMonth() + 1}/${date.getDate()}`
//     init({
//         busiCode: 'A1001022',
//         appKey: 'A1001001',
//         operatorId: sessionStorage.getItem('operatorId'),
//         operatorName: sessionStorage.getItem('operatorName'),
//         deviceCode: route.query.index,
//         startTime: formatDate(value).startTime,
//         endTime: formatDate(value).endTime,
//         pageNo: 1,
//         pageSize: 10
//     })
//     showCalendar.value = false
// }
const onConfirm = (value) => {
    console.dir(value, 'value')
    date.value = formatDate(value).curTime
    init({
        busiCode: 'A1001022',
        appKey: 'A1001001',
        operatorId: sessionStorage.getItem('operatorId'),
        operatorName: sessionStorage.getItem('operatorName'),
        deviceCode: route.query.index,
        startTime: formatDate(value).startTime,
        endTime: formatDate(value).endTime,
        pageNo: 1,
        pageSize: 10
    })
    showCalendar.value = false
}
const init = async (params) => {
    const res = await getSingle(params)

    if (res.code === '200') {
        list.value = res.data.records || []
        console.log(res.data)
    }
}
init({
    busiCode: 'A1001022',
    appKey: 'A1001001',
    operatorId: sessionStorage.getItem('operatorId'),
    operatorName: sessionStorage.getItem('operatorName'),
    deviceCode: route.query.index,
    startTime: formatDate(new Date()).startTime,
    endTime: formatDate(new Date()).endTime,
    pageNo: 1,
    pageSize: 10
})

</script>
<style lang="scss" scoped>
.history-signal {
    margin-top: 20px;
    box-sizing: border-box;
    padding: 20px 30px 0;
    background: #FFFFFF;
    height: 100vh;
    .signal-content {
        padding: 32px 0;
        border-top: 1px solid #F4F5F5;
        border-bottom: 1px solid #F4F5F5;
        .signal-title {
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            font-size: 24px;
            color: #696969;
            margin-bottom: 16px;
        }
        .signal-title:last-child {
            margin-bottom: 0;
        }
        .signal-container {
            margin-top: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #191919;
            .signal-type{
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 274px;
                text-align: left;
                span {
                font-family: PingFangSC-Regular, PingFang SC;
                font-size: 28px;
                font-weight: 400;
                color: #191919;
            }
            }
            .signal-data {
                width: 400px;
                font-size: 24px;
                text-align: right;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;

            }
        }
    }
}
.signal-data-input {
    width: 260px;
    height: 56px;
    position: relative;
    margin-bottom: 20px;
    :deep(.van-cell) {
        box-sizing: border-box;
        width: 260px;
        height: 56px;
        border-radius: 4px;
        border: 1px solid #F3F5F6;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 26px;
    }
    :deep(.van-cell__right-icon) {
        display: none;
    }
    .slicesImage {
        position: absolute;
        right: 8px;
        bottom: 8px;
        width: 12px;
        height: 12px;
    }
}
</style>
