<template>
    <div class="replenishmentOrderBox">
        <div class="equipmentContent">
            <!-- 补货单列表tab -->
            <van-tabs v-model:active="activeName" class="equipmentTabs" @click-tab="refreshData">
                <div class="equipmentInput">
                    <van-search v-model="searchVal" @search="refreshData" placeholder="请输入设备编号或名称" />
                </div>
                <van-tab title="待补货" name="1"></van-tab>
                <van-tab title="已完成" name="3"></van-tab>
                <van-tab title="已取消" name="5"></van-tab>
            </van-tabs>
        </div>
        <van-pull-refresh v-model="refreshLoading" @refresh="refreshData">
            <!-- 补货单列表 -->
            <van-list v-if="dataList" v-model:loading="loading" @load="getList" :finished="finished" finished-text="没有更多了" :immediate-check="false">
                <div class="allDataList" v-for="(item, index) in dataList" :key="index" @click="details(item)">
                    <div class="outsideBox">
                        <div class="outsideAbove">
                            <div class="pictureBox">
                                <img src="@/assets/replenishmentlmOrder/iconOrder2x.png" alt="" class="iconOrderBox" />
                                <div class="aboveTitle">{{ item.equipmentName }}</div>
                            </div>
                            <div class="statusText" :class="activeName === '1' || activeName === '3' ? 'aboveRigth' : 'aboveAsh'">{{ activeName === '1' ? '待补货' : activeName === '3' ? '已完成' : item.billStatusDesc }}</div>
                        </div>
                        <div class="outsideContent">
                            <div class="numberBox">设备编号</div>
                            <div class="last">{{ item.equipmentCode }}</div>
                        </div>
                        <div class="outsideContent" v-if="item.doorType === '1' || item.doorType === '2'">
                            <div class="numberBox">门名称</div>
                            <div class="last">{{ item.doorType === '1' ? '左门' : item.doorType === '2' ? '右门' : '' }}</div>
                        </div>
                        <div class="outsideContentBox">
                            <div class="numberBox">设备地址</div>
                            <div class="last">{{ item.equipmentAddress }}</div>
                        </div>
                        <div class="outsideContentBox">
                            <div class="numberBox">补货单生成时间</div>
                            <div class="last">{{ item.createTime }}</div>
                        </div>
                        <div class="outsideContentBox" v-if="activeName === '3'">
                            <div class="numberBox">补货单完成时间</div>
                            <div class="last">{{ item.replenishmentTime }}</div>
                        </div>
                        <div class="outsideContentBox" v-if="activeName === '5'">
                            <div class="numberBox">补货单取消时间</div>
                            <div class="last">{{ item.updateTime }}</div>
                        </div>
                    </div>
                </div>
            </van-list>
            <!-- 没有数据显示 -->
            <div v-if="!dataList" class="noneDataBox">
                <img :src="require('../../assets/replenishmentImg/noneDate@2x.png')" class="emptyImg" />
                <p class="emptyTitle">暂无数据</p>
            </div>
        </van-pull-refresh>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { replenishmentList } from '@/api/scan/order.js'
import { newPage } from '@/utils/composables'
import { tracker } from '@/utils/tracker'
import { setAppStorageFn } from '@/utils/storage'

onBeforeMount(() => {
    getList()
})

// 搜索标识
const activeName = ref('1')
const searchVal = ref('')

// 数据加载标识
const loading = ref(false)
const refreshLoading = ref(false)
const finished = ref(false)
const pageNum = ref(1)
const pageSize = 10

// 数据
const dataList = ref([])
const outsideId = ref(null)
// 数据加载方法 (加载/重置)
const getList = async (reload = false) => {
    loading.value = true
    if (reload) {
        pageNum.value = 1
        finished.value = false
    }
    const { code, data } = await replenishmentList({
        pageNo: pageNum.value,
        pageSize: pageSize,
        equipmentCodeOrName: searchVal.value,
        bullStatus: activeName.value
    })
    if (code !== '200' || !data) return (finished.value = true) // 请求失败 直接抛出加载结束
    outsideId.value = data.id
    dataList.value = pageNum.value === 1 ? data.list : [...dataList.value, ...data.list]
    pageNum.value++
    loading.value = false
    if (pageSize > data.list?.length) return (finished.value = true) // 返回条数小于请求条数 代表加载完成
}

// 切换tab/下拉刷新/手动搜索 需要重置list数据
const refreshData = async () => {
    await getList(true)
    refreshLoading.value = false
}

// 跳转补货单详情
const details = async (item) => {
    if (activeName.value === '1') {
        const act = new Date().valueOf()
        setAppStorageFn('trackerAct', act + '')
        await tracker({
            module: 'restore',
            subModule: 'restoreOderPage',
            event: 'restoreList_click',
            params: {
                act,
                click_time: act,
                functionName: '设备商品',
                deviceId: item.equipmentCode,
                deviceName: item.equipmentName
            }
        })
    }
    const obj = { 1: 'replenished', 3: 'completed', 5: 'canceled' }
    newPage(`/replenishment-order-detail?showNavbar=0&id=${item.id}&goodsId=${item.id}&equipmentCode=${item.equipmentCode}&val=${obj[activeName.value]}&equipmentName=${item.equipmentName}&billNo=${item.billNo}`, {
        id: item.id,
        equipmentCode: item.equipmentCode,
        goodsId: item.id,
        val: obj[activeName.value],
        equipmentName: item.equipmentName,
        billNo: item.billNo
    })
}
</script>
<style lang="scss">
.replenishmentOrderBox {
    .equipmentContent {
        .equipmentTabs {
            border-top: 1px solid #f4f5f5;
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #191919;
        }
        .equipmentInput {
            width: 750px;
            height: 90px;
            background: #ffffff;
            padding-top: 20px;
            position: relative;
            .van-search {
                width: 690px;
                height: 64px;
                border-radius: 100px;
                margin-left: 30px;
                padding: 0px;
            }
            .van-search__content {
                width: 100%;
                height: 64px;
                background: #f3f5f6;
                border-radius: 100px;
            }
            .van-icon-search {
                margin-left: -15px;
                display: none;
            }
            .van-field__clear {
                margin-top: -2px;
                // display: none;
            }
        }
        .van-tab--active {
            color: #fe7e41;
        }
        .van-tabs__line {
            background: #fe7e41;
        }
    }
    .van-field__left-icon {
        width: 24px;
        height: 24px;
        background: url('../../assets/replenishmentImg/search2x.png');
        background-size: 24px 24px;
        margin-top: -2px;
        // margin-left: -5px;
    }
    .allDataList {
        // margin-top: -18px;
        .outsideBox {
            width: 690px;
            // height: 280px;
            background: #ffffff;
            border-radius: 8px;
            margin-left: 30px;
            margin-top: 30px;
            padding-bottom: 30px;
            .outsideAbove {
                display: flex;
                height: 80px;
                width: 630px;
                border-bottom: 0.5px solid #ededed;
                margin-left: 30px;
                justify-content: space-between;
                .iconOrderBox {
                    width: 32px;
                    height: 36px;
                    margin-top: 26px;
                }
                .pictureBox {
                    display: flex;
                }
                .aboveTitle {
                    font-size: 28px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #191919;
                    margin-top: 26px;
                    // margin-left: -360px;
                    margin-left: 10px;
                    width: 490px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .aboveRigth {
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #fe7e41;
                    margin-top: 26px;
                    // margin-left: 282px;
                    // margin-right: 30px;
                }
                .aboveAsh {
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #cccccc;
                    margin-top: 26px;
                }
                .overtime {
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #cccccc;
                    margin-top: 18px;
                    margin-left: 262px;
                }
                .statusText {
                    white-space: nowrap;
                }
            }
            .outsideContent {
                display: flex;
                justify-content: space-between;
                margin-top: 24px;
                margin-left: 30px;
                margin-right: 30px;
                .numberBox {
                    font-size: 26px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #999999;
                }
                .last {
                    font-size: 26px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #191919;
                }
            }
            .outsideContentBox {
                display: flex;
                justify-content: space-between;
                margin-top: 16px;
                margin-left: 30px;
                margin-right: 30px;
                .numberBox {
                    font-size: 26px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #999999;
                }
                .last {
                    font-size: 26px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #191919;
                }
            }
        }
    }
    .noneDataBox {
        background: #fff;
        height: 1100px;
    }
    .emptyImg {
        width: 481px;
        height: 319px;
        margin-top: 200px;
        margin-left: 145px;
    }
    .emptyTitle {
        font-size: 30px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #888888;
        // margin-left: 315px;
        width: 100%;
        text-align: center;
    }
}
</style>
