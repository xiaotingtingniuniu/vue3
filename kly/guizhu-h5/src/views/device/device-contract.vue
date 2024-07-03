<template>
    <div class="device-contract">
        <van-nav-bar title="选择合同" fixed placeholder left-arrow right-text="提交" @click-left="closePage" @click-right="addContract" />
        <van-tabs v-model:active="pageTab" @change="changeTab" color="#FE7E41" title-active-color="#FE7E41" sticky>
            <van-tab :title="'可选(' + enableCount + ')'" />
            <van-tab :title="'不可选(' + disabledCount + ')'" />
        </van-tabs>
        <div class="device-tip" v-if="pageTab == 1">
            <img src="@/assets/warning.png" />
            <div>
                <div class="title">为什么合同不可选择？</div>
                <div class="desc-list">
                    <p>1、请检查合同审核进度是否正常。</p>
                    <p>2、请确认订单费用有无按时支付。</p>
                    <p>3、已綁定设备数量达到上限。</p>
                </div>
            </div>
        </div>
        <!-- 点位可选 -->
        <div class="contract-list">
            <van-list v-if="contractInfo.list.length" v-model:loading="contractInfo.loading" :finished="contractInfo.finished" finished-text="没有更多了" :immediate-check="false">
                <div class="cell-item" v-for="(item, index) in contractInfo.list" :key="item.applicationId">
                    <div class="item-title van-hairline--bottom">
                        <van-radio-group v-model="checked" v-if="pageTab == 0">
                            <van-radio :name="index" checked-color="#FE7E41" icon-size="16px">
                                <span class="item-title--text">合同编号：{{ item.contractNo }}</span>
                            </van-radio>
                        </van-radio-group>
                        <van-radio-group v-model="checked" v-else disabled>
                            <van-radio :name="index" checked-color="#FE7E41" icon-size="16px">
                                <template #icon="props">
                                    <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                                </template>
                                <span class="item-title--text">合同编号：{{ item.contractNo }}</span>
                            </van-radio>
                        </van-radio-group>
                        <span class="item-title--state" :class="'state' + item.status">{{ item.statusName }}</span>
                    </div>
                    <div class="item-content">
                        <div class="outside">
                            <div class="withinLeft">订单编号</div>
                            <div class="withinRight">{{ item.orderNo }}</div>
                        </div>
                        <div class="outside">
                            <div class="withinLeft">合同类型</div>
                            <div class="withinRight">
                                {{ item.contractTypeName }}
                            </div>
                        </div>
                        <div class="outside">
                            <div class="withinLeft">签约设备数</div>
                            <div class="withinRight">{{ item.deviceNum }}</div>
                        </div>
                        <div class="outside">
                            <div class="withinLeft">已绑定设备数</div>
                            <div class="withinRight">
                                {{ item.deviceBindNum }}
                            </div>
                        </div>
                        <div class="outside">
                            <div class="withinLeft">签约时间</div>
                            <div class="withinRight">{{ item.date }}</div>
                        </div>
                    </div>
                </div>
            </van-list>
            <div class="empty" v-else>
                <img src="@/assets/empty@2x.png" />
                <span class="no-data">暂无数据</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { Toast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { getContractList } from '@/api/device'
import { useStore } from 'vuex'
const activeIcon = require('@/assets/device/unchecked.png')
const inactiveIcon = require('@/assets/device/unchecked.png')
const router = useRouter()
const route = useRoute()
const pageTab = ref(0)
const checked = ref('')
const enableCount = ref(0)
const disabledCount = ref(0)
const store = useStore()
const merchantInfo = computed(() => store.state.merchantInfo)

// 合同状态
const contractInfo = ref({
    pageNum: 1,
    pageSize: 10,
    list: [],
    loading: false,
    finished: false,
    refreshLoading: false
})
onBeforeMount(() => {
    getList()
})

const closePage = () => {
    store.commit('setPointData', {})
    if (!contractInfo.value.list.length) {
        store.commit('setContractData', {})
    }
    router.go(-1)
}
const changeTab = () => {
    contractInfo.value.list = []
    getList()
    checked.value = ''
}
const addContract = async () => {
    if (checked.value === '') {
        Toast('请选择合同')
        return
    }
    if (pageTab.value === 1) {
        return
    }
    const row = contractInfo.value.list[checked.value]
    store.commit('setContractData', row)
    store.commit('setPointData', {})
    router.push({
        path: '/device/device-activation',
        name: 'device-activation'
    })
}

const getList = async () => {
    contractInfo.value.loading = true

    const res = await getContractList({
        enableFlag: pageTab.value === 0 ? 1 : 0,
        customerMobile: route.query.customerMobile || '',
        merchantSubId: merchantInfo.value.merchantSubId
    })
    const { code, data } = res
    if (code === '200') {
        contractInfo.value.list = data.contractList || []
        enableCount.value = data.enableNum
        disabledCount.value = data.disableNum
        contractInfo.value.finished = true
    }
    contractInfo.value.refreshLoading = false
    contractInfo.value.loading = false
}
</script>
<style lang="scss" scoped>
.device-contract {
    --van-nav-bar-icon-color: #000;
    --van-nav-bar-arrow-size: 35px;
    --van-nav-bar-text-color: #fe7e41;
    --van-nav-bar-title-font-size: 34px;
    .van-nav-bar__placeholder {
        :deep(.van-nav-bar) {
            padding-top: var(--van-status-bar-height);
            z-index: 9999;
        }
    }
    .device-tip {
        padding-left: 30px;
        padding-top: 30px;
        padding-right: 15px;
        display: flex;
        font-size: 24px;
        color: #696969;
        font-weight: 400;
        img {
            width: 32px;
            height: 32px;
            padding-right: 12px;
        }
        .title {
            color: #191919;
        }
        .desc-list {
            padding-top: 8px;
        }
    }
    .contract-list {
        .van-list {
            .cell-item {
                margin: 20px 30px;
                background-color: #fff;
                border-radius: 8px;
                .item-title {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 22px 30px;
                    .item-title--text {
                        font-size: 28px;
                        font-weight: 400;
                        color: #191919;
                    }
                    .item-title--state {
                        font-size: 24px;
                        font-weight: 400;
                        color: #ff2442;
                    }
                    .state0 {
                        color: #fe7e41;
                    }
                    .state1 {
                        color: #69925a;
                    }
                    .unchecked {
                        width: 36px;
                        height: 36px;
                        padding-right: 9px;
                    }
                    .img-icon {
                        width: 32px;
                        height: 32px;
                    }
                }
                .item-content {
                    padding: 8px 30px 30px;
                    .outside {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-top: 16px;
                        .withinLeft {
                            font-size: 26px;
                            font-weight: 400;
                            color: #b0b0b0;
                        }
                        .withinRight {
                            font-size: 26px;
                            font-weight: 400;
                            color: #191919;
                        }
                    }
                }
            }
        }
    }
    .empty {
        text-align: center;
        margin-top: 204px;
        img {
            width: 64%;
        }
        .no-data {
            display: block;
            font-size: 30px;
            color: #999999;
        }
    }
}
</style>
