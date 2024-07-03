<template>
    <div class="device-point">
        <van-nav-bar title="选择合同货柜编号" fixed placeholder left-arrow right-text="提交" @click-left="closePage" @click-right="addPoint" />
        <van-tabs v-model:active="pageTab" @change="changeTab" color="#FE7E41" title-active-color="#FE7E41">
            <van-tab :title="'可选(' + enableCount + ')'" />
            <van-tab :title="'不可选(' + disabledCount + ')'" />
        </van-tabs>
        <div class="device-tip" v-if="pageTab == 1">
            <img src="@/assets/warning.png" />
            <div>
                <div class="title">为什么合同货柜编号不可选择？</div>
                <div class="desc-list">
                    <p>1、请在恒掌柜APP-我的-订单，检查是否按时缴纳费用。</p>
                    <p>2、已绑定设备的点位不可选择，需要先解除绑定</p>
                    <p>3、非柜主角色激活设备，需要柜主先做授权，分配合同和合同货柜范围。</p>
                </div>
            </div>
        </div>
        <!-- 选择合同货柜编号 -->
        <div class="point-list">
            <van-list v-if="pointInfo.list.length" v-model:loading="pointInfo.loading" :finished="pointInfo.finished" finished-text="没有更多了" :immediate-check="false">
                <div class="cell-item" v-for="(item, index) in pointInfo.list" :key="item.applicationId">
                    <div class="item-title van-hairline--bottom">
                        <van-radio-group v-model="checked" v-if="pageTab == 0">
                            <van-radio :name="index" checked-color="#FE7E41" icon-size="16px">
                                <span class="item-title--text">{{ item.pointId }} </span>
                            </van-radio>
                        </van-radio-group>
                        <van-radio-group v-model="checked" v-else disabled>
                            <van-radio :name="index" checked-color="#FE7E41" icon-size="16px">
                                <template #icon="props">
                                    <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                                </template>
                                <span class="item-title--text">{{ item.pointId }}</span>
                            </van-radio>
                        </van-radio-group>
                        <span class="item-title--state" :class="'state' + item.status">{{ item.statusName }}</span>
                    </div>
                    <div class="item-content">
                        <div class="outside">
                            <div class="withinLeft">已绑定设备</div>
                            <div class="withinRight">
                                {{ item.deviceNo || '无' }}
                            </div>
                        </div>
                        <div class="outside">
                            <div class="withinLeft">点位名称</div>
                            <div class="withinRight">{{ item.locationName }}</div>
                        </div>
                        <div class="outside">
                            <div class="withinLeft">点位详细地址</div>
                            <div class="withinRight">{{ item.address }}</div>
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
import { getPointListNew } from '@/api/device'
import { useStore } from 'vuex'
const activeIcon = require('@/assets/device/unchecked.png')
const inactiveIcon = require('@/assets/device/unchecked.png')
const router = useRouter()
const route = useRoute()
const pageTab = ref(0)
const checked = ref('')
const store = useStore()
const enableCount = ref(0)
const disabledCount = ref(0)
const merchantInfo = computed(() => store.state.merchantInfo)

// 点位状态
const pointInfo = ref({
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
    if (!pointInfo.value.list.length) {
        store.commit('setPointData', {})
    }
    router.go(-1)
}
const changeTab = () => {
    pointInfo.value.list = []
    getList()
    checked.value = ''
}
const addPoint = async () => {
    if (checked.value === '') {
        Toast('请选择合同货柜编号')
        return
    }
    const row = pointInfo.value.list[checked.value]
    console.log(row, '---row--')

    store.commit('setPointData', row)
    router.push({
        path: '/device/device-activation',
        name: 'device-activation'
    })
}
const getList = async () => {
    pointInfo.value.loading = true
    const res = await getPointListNew({
        contractCode: route.query.contractNo,
        orderNo: route.query.orderNo,
        operationModel: route.query.operationModel,
        customerMobile: route.query.customerMobile,
        enableFlag: pageTab.value === 0 ? 1 : 0,
        merchantSubId: merchantInfo.value.merchantSubId

    })
    const { code, data } = res
    if (code === '200') {
        pointInfo.value.list = data.pointList || []
        enableCount.value = data.enableNum || 0
        disabledCount.value = data.disableNum || 0
        pointInfo.value.finished = true
    }
    pointInfo.value.refreshLoading = false
    pointInfo.value.loading = false
}
</script>
<style lang="scss" scoped>
.device-point {
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
    .point-list {
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
                        white-space: nowrap;
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
