<template>
    <div class="equipment-on-sale">
        <van-list v-if="dataList.length" @load="getData" v-model:loading="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false">
            <div class="card-item" v-for="(item, index) in dataList" :key="index" @click="goDetail(item)">
                <div class="item-title van-hairline--bottom">
                    <div class="label">设备编号: {{ item.deviceCode }}</div>
                    <!-- 天波门店固定为在线状态 -->
                    <div class="color--68BD49" v-if="item.deviceCode === 'tb000001'">在线</div>
                    <div class="color--FF1E19" v-else-if="item.onlineState === 0">离线</div>
                    <div class="color--FE7E41" v-else-if="item.lockState === 1">锁定</div>
                    <div class="color--68BD49" v-else-if="item.onlineState === 1">在线</div>
                </div>
                <div class="item-content">
                    <van-image :src="require('@/assets/my-container.png')" />
                    <div class="info">
                        <div class="device-name">{{ item.deviceName }}</div>
                        <div class="device-type" v-if="item.secondCabinetTypeName">货柜类型：{{ item.secondCabinetTypeName }}</div>
                        <div class="device-num">货柜缺货：{{ (item.sumSnapshot || 0) - (item.goodsStock || 0) }}件（剩余{{ item.goodsStock || 0 }}件/{{ item.sumSnapshot || 0 }}件）</div>
                        <div class="device-time">上次补货时间：{{ item.lastReplenishTime || '--' }}</div>
                    </div>
                </div>
            </div>
        </van-list>
    </div>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import { setTitle, newPage } from '@/utils/composables'
import { queryDeviceList } from '@/api/goods-library'

const props = defineProps(['goodsId'])
onBeforeMount(() => {
    getData()
})

const loading = ref(false)
const finished = ref(false)
const pageNum = ref(1)
const pageSize = 10
const dataList = ref([])

const getData = async () => {
    loading.value = true
    const { code, data } = await queryDeviceList({
        pageNum: pageNum.value,
        pageSize: pageSize,
        operateType: 2,
        goodsId: props.goodsId
    })
    if (code === '200' && data) {
        dataList.value = pageNum.value === 1 ? data.list : [...dataList.value, ...data.list]
        pageNum.value++
        loading.value = false
        setTitle({ title: `在售设备(${data.total})` })
        if (data.list.length < pageSize) finished.value = true
    }
}

const goDetail = (device) => {
    newPage(`/deviceDetails?deviceCode=${device.deviceCode}&deviceType=${device.deviceType}&deviceName=${device.deviceName}&showNavbar=0`, {
        deviceCode: device.deviceCode,
        deviceName: device.deviceName,
        deviceType: device.deviceType
    })
}
</script>
<style lang="scss" scoped>
.equipment-on-sale {
    .van-list {
        .card-item {
            margin: 20px 30px 0;
            background: #ffffff;
            border-radius: 16px;
            .item-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 22px 30px;
                font-size: 26px;
                font-weight: 500;
                .label {
                    font-weight: 400;
                    color: #191919;
                }
                .color--FF1E19 {
                    color: #ff1e19;
                }
                .color--FE7E41 {
                    color: #fe7e41;
                }
                .color--68BD49 {
                    color: #68bd49;
                }
            }
            .item-content {
                padding: 28px 0px 28px 30px;
                display: flex;
                align-items: flex-start;
                .van-image {
                    width: 148px;
                    height: 148px;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .info {
                    width: 0;
                    flex: 1;
                    margin-left: 26px;
                    .device-name {
                        width: 420px;
                        font-size: 28px;
                        font-weight: 500;
                        color: #191919;
                    }
                    .device-type {
                        font-size: 24px;
                        font-weight: 400;
                        color: #999999;
                        margin-top: 12px;
                    }
                    .device-num {
                        font-size: 24px;
                        font-weight: 400;
                        color: #999999;
                        margin-top: 12px;
                    }
                    .device-time {
                        font-size: 24px;
                        font-weight: 400;
                        color: #999999;
                        line-height: 34px;
                        margin-top: 10px;
                    }
                }
            }
        }
    }
}
</style>
