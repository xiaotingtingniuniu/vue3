<template>
    <div class="college_list">
        <van-pull-refresh v-model="loading" @refresh="onRefresh">
            <div class="select">
                <van-list class="all_list" v-if="list.length" v-model:loading="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false" @load="getGoodsList">
                    <div class="goods-list">
                        <template v-for="(item,index) in list" :key="index">
                            <div class="same" @click="goDetail(item)">
                                <img :src="item.mainGraph"/>
                                <p class="name">{{item.contentTitle}}</p>
                                <p class="time">{{item.showcreateTime}}</p>
                                <p class="line"></p>
                            </div>
                        </template>
                    </div>
                </van-list>
                <div class="no-data" v-else>
                    <img :src="require('@/assets/no_data.png')"/>
                    <p class="prompt">暂无数据</p>
                </div>
            </div>
        </van-pull-refresh>

    </div>
</template>

<script setup>
import { collegeCategory } from '@/api/college'
import { onMounted, reactive, toRefs, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { setTitle } from '@/utils/composables'
const router = useRouter()
const route = useRoute()
console.log(route)
console.log(router)
// import store from '@/store'
// import goodsCard from '@/components/GoodsCard'
const dataState = reactive({
    list: [],
    loading: false,
    finished: false,
    currentPage: 1,
    pageSize: 10,
    title: route.query.category,
    id: route.query.id
})
const { list, loading, finished } = toRefs(dataState)

onMounted(() => {
    getcollegeCategory()
})
const goDetail = (item) => {
    // window.location.href = store.state.locationOrigin + '/college/detail?id=' + item.id
    router.push({
        path: '/college/detail',
        query: {
            id: item.id
        }
    })
}
const onRefresh = async () => {
    console.log(1)
    dataState.loading = false
    dataState.finished = false
    dataState.currentPage = 1
    getcollegeCategory()
}
const getcollegeCategory = async () => {
    const { data } = await collegeCategory({
        currentPage: dataState.currentPage,
        pageSize: dataState.pageSize,
        category: dataState.id
    })
    if (data.list) {
        var list = data.list
        list.forEach((item) => {
            item.showcreateTime = item.createTime
            // item.showcreateTime = item.createTime.split('T')[0] + ' ' + item.createTime.split('T')[1]
        })
        if (dataState.currentPage === 1) {
            dataState.list = []
        }
        dataState.list = [...dataState.list, ...list]
        console.log(dataState.list)
        dataState.loading = false
        if (list.length < 10) {
            dataState.finished = true
            // dataState.loading = true
        }
        dataState.currentPage++
    } else {
        if (dataState.currentPage === 1) {
            dataState.list = []
        }
        dataState.loading = false
        dataState.finished = true
        // dataState.loading = true
    }
}
const getGoodsList = async () => {
    console.log(2)
    if (dataState.currentPage !== 1) {
        dataState.finished = false
        getcollegeCategory()
    }
}

nextTick(() => {
    setTitle({ title: dataState.title })
    document.title = dataState.title
})
</script>
<style lang="scss" scoped>
.college_list{
    // margin-top:10px;

    .select{
        .all_list{
            padding-top:15px;
            .same{
                // overflow: hidden;
                height:260px;
                margin:30px;
                position: relative;
                // margin-bottom:40px;
                img{
                    width: 200px;
                    height: 226px;
                    float: left;
                    border-radius: 8px;
                }
                .name{
                    float: left;
                    margin-left: 26px;
                    margin-top:8px;
                    width: 463px;
                    max-height: 80px;
                    font-size: 28px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #242024;
                    line-height: 40px;
                    word-break: break-all;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                .time{
                    float: left;
                    margin-left: 26px;
                    margin-top:32px;
                     width: 463px;
                    height: 33px;
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #BBBBBB;
                    line-height: 33px;
                    padding-bottom:109px;
                    // border-bottom:1px solid #E6E6E6;
                }
                .line{
                    position: absolute;
                    right:0;
                    bottom:0px;
                    width:465px;
                    height:1px;
                    background: #EFEFEF;
                }
            }
        }
    }
}
.no-data{
    min-height: 100vh;
    text-align: center;
    background: #F4F5F5;
    img{
        width:162px;
        margin-top:300px;
    }
    .prompt{
        width:100%;
        margin-top:60px;
        text-align: center;
        font-size: 26px;
        font-weight: 400;
        color: #B0B0B0;
        letter-spacing: 1px;
    }
}
</style>
