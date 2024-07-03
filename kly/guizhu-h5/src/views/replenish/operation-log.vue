<template>
    <div class="replensih-box">
        <div class="container">
            <van-tabs v-model:active="activeTabs" @change="changeTabs" line-width="29px" title-active-color="#FE7E41" title-inactive-color="#191919" background="#FFFFFF" animated>
                <van-tab v-for="item in orderState" :title="item" :key="item" />
            </van-tabs>
            <div class="van-tabs-height" />
            <div class="list-box" v-if="dataList[activeTabs]?.length">
                <van-list v-model:loading="loading" :finished="finished" @load="getData" finished-text="没有更多了" :immediate-check="false">
                    <div class="list-item" @click="goDetailPage(item)" v-for="(item, index) in dataList[activeTabs]" :key="index">
                        <div class="item-title">
                            <div class="title-box">
                                <img src="@/assets/icon-order.png" alt="" />
                                <div class="title">{{ item.orderNo || item.billNo || '--' }}</div>
                            </div>
                            <div class="list-item-line">
                                <div class="list-left">设备编号</div>
                                <div class="list-right">{{ item.deviceNo || item.equipmentCode || '--' }}</div>
                            </div>
                            <div class="list-item-line" v-if="item.doorType === '1' || item.doorType === '2'">
                                <div class="list-left">门名称</div>
                                <div class="list-right">{{ item.doorType === '1' ? '左门' : item.doorType === '2' ? '右门' : '' }}</div>
                            </div>
                            <div class="list-item-line">
                                <div class="list-left">操作人员</div>
                                <div class="list-right">{{ item.operatorName || item.replenisher || '--' }}</div>
                            </div>
                            <!-- 补货 -->
                            <template v-if="activeTabs === 0">
                                <div class="list-item-line">
                                    <div class="list-left">补货商品种类</div>
                                    <div class="list-right">{{ item.skuTypeCount || 0 }}</div>
                                </div>
                                <div class="list-item-line">
                                    <div class="list-left">补货商品数量</div>
                                    <div class="list-right">{{ item.skuCount || 0 }}</div>
                                </div>
                                <div class="list-item-line">
                                    <div class="list-left">补货开始时间</div>
                                    <div class="list-right">{{ item.createTime || '--' }}</div>
                                </div>
                                <div class="list-item-line">
                                    <div class="list-left">补货完成时间</div>
                                    <div class="list-right">{{ item.replenishmentTime || '--' }}</div>
                                </div>
                            </template>
                            <!-- 盘货 -->
                            <template v-if="activeTabs === 1">
                                <div class="list-item-line">
                                    <div class="list-left">盘货商品种类</div>
                                    <div class="list-right">{{ item.skuTypeCount || 0 }}</div>
                                </div>
                                <div class="list-item-line">
                                    <div class="list-left">盘前库存</div>
                                    <div class="list-right">{{ item.beforeSkuCount || 0 }}</div>
                                </div>
                                <div class="list-item-line">
                                    <div class="list-left">盘后库存</div>
                                    <div class="list-right">{{ item.afterSkuCount || 0 }}</div>
                                </div>
                                <div class="list-item-line">
                                    <div class="list-left">盘货开始时间</div>
                                    <div class="list-right">{{ item.createTime || '--' }}</div>
                                </div>
                                <div class="list-item-line">
                                    <div class="list-left">盘货完成时间</div>
                                    <div class="list-right">{{ item.replenishmentTime || '--' }}</div>
                                </div>
                            </template>
                            <!-- 改价 -->
                            <template v-if="activeTabs === 2">
                                <div class="list-item-line">
                                    <div class="list-left">改价开始时间</div>
                                    <div class="list-right">{{ item.startTime }}</div>
                                </div>
                                <div class="list-item-line">
                                    <div class="list-left">改价完成时间</div>
                                    <div class="list-right">{{ item.endTime }}</div>
                                </div>
                            </template>
                        </div>
                    </div>
                </van-list>
            </div>
            <div class="empty-tip" v-else>
                <img src="@/assets/empty@2x.png" />
                <span class="no-data">暂无记录</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { priceRecordList, replenishmentList, tallybillList } from '@/api/scan/scan'
import { newPage } from '@/utils/composables'
import { useStore } from 'vuex'

const orderState = ['补货记录', '盘货记录', '改价记录']
const activeTabs = ref(0)
const props = defineProps(['deviceId'])
const store = useStore()

const merchantInfo = computed(() => store.state.merchantInfo)

onBeforeMount(() => {
    getData()
})

const getData = () => {
    if (activeTabs.value === 0) {
        getReplenishmentList()
    } else if (activeTabs.value === 1) {
        getTallybillList()
    } else if (activeTabs.value === 2) {
        getPriceList()
    }
}

const dataList = ref([])

const loading = ref(false)
const finished = ref(true)
const pageNo = ref(1)
// 补货
const getReplenishmentList = async () => {
    loading.value = true
    const res = await replenishmentList({
        pageSize: 10,
        pageNo: pageNo.value,
        busiMerchantId: merchantInfo.value.busiMerchantId,
        merchantSubId: merchantInfo.value.merchantSubId,
        roleType: merchantInfo.value.roleType,
        merchantSubType: merchantInfo.value.merchantSubType,
        operateType: 1,
        deviceCodeList: [props.deviceId]
    })
    if (res.code === '200' && res.data) {
        dataList.value[0] = pageNo.value === 1 ? res.data.dataList : [...dataList.value[0], ...res.data.dataList]
        if (res.data.dataList.length < 10) finished.value = true
        pageNo.value++
    }
    loading.value = false
}

// 盘货
const getTallybillList = async () => {
    loading.value = true
    const res = await tallybillList({
        pageSize: 10,
        pageNo: pageNo.value,
        busiMerchantId: merchantInfo.value.busiMerchantId,
        merchantSubId: merchantInfo.value.merchantSubId,
        roleType: merchantInfo.value.roleType,
        merchantSubType: merchantInfo.value.merchantSubType,
        operateType: 1,
        deviceCodeList: [props.deviceId]
    })
    if (res.code === '200' && res.data) {
        dataList.value[1] = pageNo.value === 1 ? res.data.dataList : [...dataList.value[1], ...res.data.dataList]
        if (res.data.dataList.length < 10) finished.value = true
        pageNo.value++
    }
    loading.value = false
}

// 改价
const getPriceList = async () => {
    loading.value = true
    const res = await priceRecordList({
        pageSize: 10,
        pageNo: pageNo.value,
        deviceNo: props.deviceId
    })
    if (res.code === '200' && res.list) {
        dataList.value[2] = pageNo.value === 1 ? res.list : [...dataList.value[2], ...res.list]
        if (res.list.length < 10) finished.value = true
        pageNo.value++
    }
    loading.value = false
}

const changeTabs = () => {
    loading.value = false
    finished.value = false
    pageNo.value = 1
    getData()
}

const goDetailPage = (item) => {
    if (activeTabs.value === 0) {
        newPage(`/replenish-detail/${item.billNo}?changeDate=${item.replenishmentTime}&skuTypeCount=${item.skuTypeCount}&skuCount=${item.skuCount}&afterSkuCount=${item.afterSkuCount}`, {
            changeDate: item.replenishmentTime,
            skuTypeCount: item.skuTypeCount,
            skuCount: item.skuCount,
            afterSkuCount: item.afterSkuCount
        })
    } else if (activeTabs.value === 1) {
        newPage(`/inventory-detail/${item.billNo}?changeDate=${item.replenishmentTime}&skuTypeCount=${item.skuTypeCount}&beforeSkuCount=${item.beforeSkuCount}&afterSkuCount=${item.afterSkuCount}`, {
            changeDate: item.replenishmentTime,
            skuTypeCount: item.skuTypeCount,
            beforeSkuCount: item.beforeSkuCount,
            afterSkuCount: item.afterSkuCount
        })
    } else if (activeTabs.value === 2) {
        newPage(`/price-change-detail/${item.orderNo}?changeDate=${item.changeDate}`, {
            changeDate: item.changeDate
        })
    }
}
</script>
<style lang="scss" scoped>
.replensih-box {
    min-height: 100vh;
    .van-tabs-height {
        width: 100%;
        height: 88px;
    }
    .van-tabs {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        :deep(.van-tabs__line) {
            background: #fd7e41;
        }
    }
    .list-box {
        .list-item {
            background: #ffffff;
            border-radius: 8px;
            margin: 20px 30px 0;
            .item-title {
                padding: 22px 30px 30px 30px;
                .title-box {
                    display: flex;
                    font-size: 28px;
                    font-weight: 500;
                    color: #191919;
                    align-items: center;
                    padding: 22px 0;
                    border-bottom: 1px solid #ededed;
                    .title {
                        margin-left: 12px;
                    }
                }
            }
            .list-item-line {
                margin-top: 16px;
                display: flex;
                justify-content: space-between;
                font-size: 26px;
                font-weight: 400;
                color: #999999;
                .list-right {
                    color: #191919;
                }
            }
        }
    }
    .empty-tip {
        text-align: center;
        height: calc(100vh - 88px);
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #fff;
        img {
            margin-top: 30%;
            width: 64%;
        }
        .no-data {
            width: 560px;
            display: block;
            font-size: 30px;
            color: #888;
        }
    }
}
</style>
