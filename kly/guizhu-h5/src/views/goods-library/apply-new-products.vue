<template>
    <div class="apply-new-products-page">
        <div class="van-tabs-height"></div>
        <van-tabs v-model:active="active" @click-tab="clickTab" color="#FD7E41" line-width="28px" title-active-color="#FE7E41" title-inactive-color="#191919">
            <van-tab name="" title="全部"></van-tab>
            <van-tab name="2,5" title="审核中"></van-tab>
            <van-tab name="3" title="审核通过"></van-tab>
            <van-tab name="4" title="审核驳回"></van-tab>
        </van-tabs>
        <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
            <van-list v-model:loading="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="onLoad">
                <div class="card" v-for="(item, index) in list" :key="index" @click="applyFn(item.approvalCode)">
                    <van-image class="card-img" :src="item.frontPic" :loading-icon="require('@/assets/img-error.png')" :error-icon="require('@/assets/img-error.png')" />
                    <div class="content">
                        <div class="title">
                            <div class="goods-title">{{ item.spuName }}</div>
                            <div class="state" :class="'state'+item.approveStatus">{{ (item.approveStatus===2||item.approveStatus===5)?'审核中':(item.approveStatus===3?'审核通过':'审核驳回') }}</div>
                        </div>
                        <p>申请时间：{{ item.gmtCreate }}</p>
                        <p>审批时间：{{ (item.approveStatus===2||item.approveStatus===5) ? '-' : item.gmtDeal }}</p>
                        <div class="reject" v-if="item.approveStatus===4">驳回原因：{{ item.approveAdvise }}</div>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
        <van-button class="apply-button" v-if="authorized.check('new-spu-apply')" @click="applyFn('')" block color="#FE7E41">申请新增商品</van-button>
        <div class="apply-button-height"></div>
    </div>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import { appBridge } from '@/utils/bridge'
import { spuApprovalList } from '@/api/goods-library'
import { isApp } from '@/utils'
import authorized from '@/utils/authorized'

const active = ref()
const applyFn = (val) => appBridge('applyNewCommodity', { approvalCode: val })

onBeforeMount(() => {
    onLoad(true)
})

document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && isApp) {
        onLoad(true)
    }
})

const list = ref([])
const loading = ref(false)
const refreshLoading = ref(false)
const finished = ref(false)
const currPage = ref(1)
const approvalStatus = ref('')
const onLoad = async (reset = false) => {
    loading.value = true
    if (reset) {
        currPage.value = 1
        finished.value = false
    }
    const res = await spuApprovalList({
        approvalStatus: approvalStatus.value,
        currPage: currPage.value,
        pageSize: 10
    })
    list.value = currPage.value === 1 ? res.data.list : [...list.value, ...res.data.list]
    currPage.value++
    loading.value = false
    if (res.data.list.length < 10) {
        finished.value = true
    }
}

const onRefresh = async () => {
    await onLoad(true)
    refreshLoading.value = false
}

const clickTab = (event) => {
    approvalStatus.value = event.name
    onLoad(true)
}

</script>
<style lang="scss" scoped>
.apply-new-products-page{
    .van-tabs-height{
        width: 100%;
        height: 88px;
    }
    .van-tabs{
        position: fixed;
        top: calc(88px + var(--van-status-bar-height));
        left: 0;
        right: 0;
        z-index: 10;
        :deep(.van-tab){
            font-size: 28px;
        }
    }
    .van-pull-refresh{
        min-height: calc(100vh - 96px - 88px - 92px - var(--van-status-bar-height));
    }
    .van-list{
        margin-top: 20px;
        .card{
            padding: 40px 30px;
            background: #FFFFFF;
            border-bottom: 2px solid #F4F5F5;
            display: flex;
            .card-img{
                width: 100px;
                height: 100px;
                border-radius: 8px;
                overflow: hidden;
            }
            :deep(.van-image__loading){
                .van-image__loading-icon{
                    width: 100%;
                    height: auto;
                    .van-icon__image{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            :deep(.van-image__error){
                .van-image__error-icon{
                    width: 100%;
                    height: auto;
                    .van-icon__image{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .content{
                width: 0;
                flex: 1;
                margin-left: 16px;
                .title{
                    display: flex;
                    .goods-title{
                        width: 0;
                        flex: 1;
                        font-size: 30px;
                        font-weight: 500;
                        color: #222222;
                        line-height: 36px;
                    }
                    .state{
                        width: 100px;
                        margin-left: 40px;
                        font-size: 24px;
                        font-weight: 400;
                        color: #69925A;
                        line-height: 36px;
                        text-align: right;
                    }
                    .state2{
                        color: #FE7E41;
                    }
                    .state5{
                        color: #FE7E41;
                    }
                    .state4{
                        color: #FF1E19;
                    }
                }
                p{
                    font-size: 22px;
                    font-weight: 400;
                    color: #B0B0B0;
                    line-height: 30px;
                    margin-top: 10px;
                }
                .reject{
                    font-size: 22px;
                    font-weight: 400;
                    color: #FF1E19;
                    line-height: 30px;
                    margin-top: 10px;
                }
            }
        }
    }
    .apply-button{
        width: calc(100% - 120px);
        height: 92px;
        border-radius: 46px;
        position: fixed;
        left: 60px;
        font-size: 30px;
        right: 60px;
        bottom: 20px;
        bottom: calc(20px + constant(safe-area-inset-bottom));
        bottom: calc(20px + env(safe-area-inset-bottom));
    }
    .apply-button-height{
        width: 100%;
        height: 92px;
        padding-bottom: 20px;
        padding-bottom: calc(20px + constant(safe-area-inset-bottom));
        padding-bottom: calc(20px + env(safe-area-inset-bottom));
    }
}
</style>
