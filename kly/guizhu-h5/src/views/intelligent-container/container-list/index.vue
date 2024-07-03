<template>
    <div class="container">
        <van-pull-refresh v-model="result.loading" @refresh="onRefresh">
            <div class="container-list">
                <van-list
                    v-model:loading="listInfo.loading"
                    :finished="listInfo.finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                >
                    <div class="container-list-item" v-for="item in listInfo.list" :key="item.index" @click="todetail(item)">
                        <div class="container-list-item-image">
                            <van-image radius='4px' width="100%" height="100%" :src="item.productListPicture">
                                <template #error>
                                    <img class="error-img" :src="require('@/assets/img-error.png')" alt="">
                                </template>
                            </van-image>
                        </div>
                        <div class="container-list-item-content">
                            <h3 class="container-list-item-content-title omit">{{ item.productName }}</h3>
                            <div class="container-list-item-content-desc omit">{{ item.model }}</div>
                            <div class="container-list-item-content-price"><span>¥</span> {{ item.show_detailAmount }}</div>
                        </div>
                    </div>
                </van-list>
            </div>
        </van-pull-refresh>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import { getList } from '@/api/container'
import { setTitle } from '@/utils/composables'

setTitle({ title: '智能货柜' })

const router = useRouter()

const result = reactive({
    loading: true,
    list: []
})

// 列表信息
const listInfo = reactive({
    list: [],
    finished: false,
    loading: false
})

// 分页信息
const pages = reactive({
    pageNum: 0,
    pageSize: 10
})

// 获取货柜列表
const getLists = async (key) => {
    const param = {
        pageNum: pages.pageNum,
        pageSize: pages.pageSize
    }
    // 如果当前页大于等于总页数设为加载完毕
    if (listInfo.totalPage <= pages.pageNum) {
        listInfo.finished = true
    }
    const res = await getList(param)
    // 如果不在请求之后清空列表会触发多次请求
    if (key === 'refresh') {
        listInfo.list = []
    }
    if (res.code === '200') {
        var list = res.data.list
        list.forEach(item => {
            // console.log(item.detailAmount.split('￥')[1], 9)
            item.show_detailAmount = item.detailAmount.split('￥')[1] ? item.detailAmount.split('￥')[1] : item.detailAmount
            // console.log(item.detailAmount.split('¥')[1] ? '1' : '2')
            // console.log(item.show_detailAmount, 98765)
        })
        listInfo.list = [...listInfo.list, ...list]
        listInfo.totalPage = res.data.totalPage
    } else {
        Toast(res.msg)
    }
    listInfo.loading = false
    result.loading = false
}

// 下拉刷新
const onRefresh = () => {
    pages.pageNum = 1
    listInfo.finished = false
    getLists('refresh')
}

// 上拉加载
const onLoad = () => {
    pages.pageNum += 1
    listInfo.loading = false
    getLists()
}

const todetail = (item) => {
    router.push({ path: '/container/detail', query: { productNum: item.productNum } })
}

</script>

<style lang="scss" scoped>
.container {
    height: 100vh;
    background: #F4F5F5;
    .error-img {
        width: 100%;
        height: 100%;
    }
}
.omit {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.container-list {
    padding: 30px;
    font-family: PingFangSC-Medium, PingFang SC;
    box-sizing: border-box;
    background: #F4F5F5;
    &-item {
        display: flex;
        margin-bottom: 20px;
        padding: 20px;
        background: #fff;
        border-radius: 8px;
        &-image {
            width: 210px;
            height: 210px;
        }
        &-content {
            margin: 0 20px;
            flex: 1;
            min-width: 0;
            &-title {
                margin-top: 10px;
                width: 100%;
                height: 42px;
                font-size: 30px;
                font-weight: 500;
                color: #2E2E4D;
                line-height: 42px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            &-desc {
                margin-top: 6px;
                height: 33px;
                font-size: 24px;
                font-weight: 400;
                color: #A3A3B2;
                line-height: 33px;
            }
            &-price {
                margin-top:30px;
                height: 53px;
                font-size: 40px;
                font-weight: 400;
                color: #FE7E41;
                line-height: 37px;
                span{
                    font-size: 30px;
                }
            }
        }
    }
}
</style>
