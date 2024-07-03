<template>
    <div class="my-container">
        <div class="height-line">我的</div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
                v-model:loading="loading"
                :finished="finished"
                :finished-text="finishedText"
                v-model:error="error"
                error-text="请求失败，点击重新加载"
                @load="onLoad"
            >
                <div
                    class="container-item"
                    v-for="item in list"
                    :key="item.index"
                >
                    <div class="container-item-image">
                        <van-image :src="require('@/assets/my-container.png')">
                        </van-image>
                    </div>
                    <div class="container-item-content">
                        <p class="title">设备名称：{{ item.deviceName }}</p>
                        <p class="item">设备编号：{{ item.venderDeviceId }}</p>
                        <p class="item">设备型号：{{ item.productModel }}</p>
                        <p class="item">设备地址：{{ item.deviceAddress }}</p>
                        <p class="item">
                            设备状态：
                            <span
                                :class="[stateClass[item.deviceStatus].class]"
                            >
                                {{ stateClass[item.deviceStatus].label }}</span
                            >（{{ item.lastHeartBeatTime }}更新）
                        </p>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { getMyContainerList } from '@/api/container'
import { Toast } from 'vant'
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const error = ref(false)
const refreshing = ref(false)
const currentPage = ref(0)

// 0正常、1异常
const stateClass = {
    0: {
        label: '正常',
        class: 'success'
    },
    1: {
        label: '异常',
        class: 'error'
    }
}

const finishedText = ref('没有更多了')

const onLoad = async () => {
    console.log(999)
    if (list.value.length) {
        currentPage.value += 1
    } else {
        currentPage.value = 1
    }
    const res = await getMyContainerList({
        currentPage: currentPage.value,
        pageSize: 10
    })
    if (res?.code === '200') {
        if (refreshing.value) {
            list.value = []
            refreshing.value = false
        }

        list.value = [...list.value, ...res.data.list]
        loading.value = false

        if (res.data.currPage >= res.data.totalPage) {
            finished.value = true
        }
    } else {
        loading.value = false
        error.value = true
        Toast(res.msg)
    }
}

const onRefresh = () => {
    currentPage.value = 0
    // 清空列表数据
    finished.value = false

    // 重新加载数据
    // 将 loading 设置为 true，表示处于加载状态
    loading.value = true
    onLoad()
}
</script>
<style lang="scss" scoped>
@mixin font-color {
    margin-right: 8px;
    font-size: 22px;
}
.my-container {
    height: 100vh;
    background: #f4f5f5;
    .height-line {
        font-size: 18px;
        overflow: hidden;
        opacity: 0;
    }
    .container-item {
        margin-top: 20px;
        padding: 30px;
        display: flex;
        background: #fff;
        &:nth-child(1) {
            margin-top: 0;
        }
        &-image {
            margin-right: 25px;
            width: 210px;
            height: 210px;
        }
        &-content {
            font-family: PingFangSC-Regular, PingFang SC;
            .title {
                font-size: 28px;
                font-weight: bold;
                color: #333333;
                line-height: 40px;
            }
            .item {
                margin-top: 11px;
                font-size: 22px;
                font-weight: 400;
                color: #a3a3b2;
                line-height: 30px;
                .success {
                    @include font-color;
                    color: #69925a;
                }
                .error {
                    @include font-color;
                    color: #ff2442;
                }
                .warn {
                    @include font-color;
                    color: #fe7e41;
                }
            }
        }
    }
}
</style>
