<template>
    <div class="college_list">
        <!-- <div id="head">
            <img src="../../assets/return.png">
            <span>{{title}}</span>
        </div> -->
        <van-pull-refresh v-model="loading" @refresh="onRefresh">
            <div class="top_nav">
                <div class="same_nav" v-for="(item,index) in nav" :key="index" @click="goList(item)">
                    <img :src="item.url">
                    <p>{{item.name}}</p>
                </div>
            </div>
            <div class="select">
                <p class="title">
                    <span>精选课程</span>
                </p>
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
            </div>
        </van-pull-refresh>
    </div>
</template>

<script setup>
import store from '@/store'
import { onMounted, reactive, toRefs, watch } from 'vue'
import { appBridge } from '@/utils/bridge'
import { useRoute } from 'vue-router'
import { collegeRecommend } from '@/api/college'
const route = useRoute()
// import store from '@/store'
// import goodsCard from '@/components/GoodsCard'
const dataState = reactive({
    nav: [
        { id: 1, name: '点位选择', url: require('@/assets/college1.png') },
        { id: 2, name: '商品管理', url: require('@/assets/college2.png') },
        { id: 3, name: '设备运维', url: require('@/assets/college3.png') },
        { id: 4, name: '系统操作', url: require('@/assets/college4.png') },
        { id: 5, name: '订单管理', url: require('@/assets/college5.png') },
        { id: 6, name: '常见问题', url: require('@/assets/college6.png') },
        { id: 7, name: '行业资讯', url: require('@/assets/college7.png') },
        { id: 8, name: '经验分享', url: require('@/assets/college8.png') }
    ],
    list: [],
    loading: false,
    finished: false,
    title: route.meta.title,
    currentPage: 1,
    pageSize: 10

})
const { list, nav, loading, finished } = toRefs(dataState)

onMounted(() => {
    getcollegeRecommend()
})

watch(() => [route.meta.title], (newVal, oldVal) => {
    console.log(newVal)
    dataState.title = newVal[0]
})
const goList = (item) => {
    console.log(item)
    const url = `${store.state.locationOrigin}/college/list?category=${item.name}&id=${item.id}`
    // if (item.id === 8) {
    //     url += '/feedback'
    // } else {
    //     url += '/college/list?category=' + item.name + '&id=' + item.id
    // }
    var json = {
        url: url,
        login: '0'
    }
    appBridge('openNewPage', json)
}
const goDetail = (item) => {
    const url = store.state.locationOrigin + '/college/detail?id=' + item.id
    var json = {
        url: url,
        login: '0'
    }
    appBridge('openNewPage', json)
}
const onRefresh = async () => {
    dataState.loading = false
    dataState.finished = false
    dataState.currentPage = 1
    getcollegeRecommend()
}
const getcollegeRecommend = async () => {
    const { data } = await collegeRecommend({
        currentPage: dataState.currentPage,
        pageSize: dataState.pageSize
    })
    if (data.list) {
        var list = data.list
        list.forEach((item) => {
            item.showcreateTime = item.createTime
            // item.showcreateTime = item.createTime.split('T')[0] + ' ' + item.createTime.split('T')[1] ? item.createTime.split('T')[1] : ''
        })
        if (dataState.currentPage === 1) {
            dataState.list = []
        }
        dataState.list = [...dataState.list, ...list]
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

    // console.log(object.list)
}
const getGoodsList = async () => {
    if (dataState.currentPage !== 1) {
        dataState.finished = false
        getcollegeRecommend()
    }
}
</script>
<style lang="scss" scoped>
.college_list{
    // margin-top:10px;
    .top_nav{
        padding:10px 5px;
        overflow: hidden;
        padding-bottom:50px;
        border-bottom:20px solid #F4F5F5;
        background: #fff;
        .same_nav{
            width:25%;
            float: left;
            text-align: center;
            margin-top:40px;
            img{
                width:80px;
                height:80px;
                display: block;
                margin:0 auto;
            }
            p{
                margin-top:12px;
                height: 33px;
                font-size: 24px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #242024;
                line-height: 33px;
                text-align: center;
            }
        }
    }
    .select{
        background: #fff;
        .title{
            padding-top:40px;
            margin-left: 32px;
            height: 42px;
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #0D0D0D;
            line-height: 42px;
            letter-spacing: 1px;
            position: relative;
            z-index: 1;
            span{
                display: block;
                position: absolute;
                z-index: 99;
            }
        }
        .title::after{
            position:absolute;
            bottom:5px;
            left:0;
            content: "";
            z-index:-1;
            width: 130px;
            height: 12px;
            background: linear-gradient(270deg, #FC9753 0%, #FB5A3B 100%);
            box-shadow: 0px 2px 10px 0px rgba(252, 148, 82, 0.32);
            border-radius: 8px;
        }
        .all_list{
            padding-top:15px;
            .same{
                height:260px;
                margin:30px;
                position: relative;
                // margin-bottom:40px;
                img{
                    width: 200px;
                    height: 226px;
                    border-radius: 8px;
                    float: left;
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
                    overflow:hidden;
                    text-overflow:ellipsis;
                    display:-webkit-box;
                    -webkit-box-orient:vertical;
                    -webkit-line-clamp:2;
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
                    padding-bottom:120px;
                    // border-bottom:1px solid #EFEFEF;
                }
                .line{
                    position: absolute;
                    right:0px;
                    bottom:0;
                    width:463px;
                    height: 1px;
                    background: #EFEFEF;
                }
            }
            .goods-list .same:nth-child(1){
                margin-top:0px;
            }
        }
    }
}
</style>
