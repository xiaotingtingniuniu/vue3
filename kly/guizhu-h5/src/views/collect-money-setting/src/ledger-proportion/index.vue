<template>
    <div class="ledger-proportion">
        <div class="search">
            <form action="/" class="input">
                <van-search v-model="searchData" placeholder="请输入手机号或姓名" :left-icon="require('@/assets/search2.png')" @search="onSearch" />
            </form>
        </div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
                v-model:loading="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                class="so_list"
            >
                <van-cell class="listItem" v-for="(item, index) in listData" :key="index">
                    <div class="item_title">
                        <p>
                            <img :src="item.type === 0 ? require('@/assets/person.png') : require('@/assets/enterprise.png')" alt="" />
                            <template v-if="item.type === 0">{{item.name}}-{{item.mobile}}</template>
                            <template v-if="item.type === 1">{{item.name}}-{{item.accountNo}}</template>
                        </p>
                        <div class="item_statu" v-if="item.status === 1">
                            <div class="rate_text">生效中</div>
                        </div>
                        <div class="item_statu" v-if="item.status === 0">
                            <div class="delay_text">未生效</div>
                        </div>
                        <div class="item_statu" v-if="item.status === 2">
                            <div class="delay_text">己失效</div>
                        </div>
                        <!-- <div class="item_statu" v-else>
                            <div class="delay_text">待生效</div>
                        </div> -->
                    </div>
                    <div class="item_content">
                        <p>
                            <span class="content_title">分账比例</span>
                            <span class="content_value">{{item.rate}}%</span>
                        </p>
                        <p>
                            <span class="content_title">结算周期</span>
                            <span class="content_value">D+{{item.period}}</span>
                        </p>
                        <!-- <p>
                        <span class="content_title">结算方式</span>
                        <span class="content_value">系统结算</span>
                    </p>
                    <p>
                        <span class="content_title">收款账号</span>
                        <span class="content_value">131452199998888666</span>
                    </p> -->
                        <p>
                            <span class="content_title">分账开始时间</span>
                            <span class="content_value">{{item.startTime}}</span>
                        </p>
                        <p>
                            <span class="content_title">分账结束时间</span>
                            <span class="content_value">{{item.endTime}}</span>
                        </p>
                        <p>
                            <span class="content_title">货柜位置</span>
                            <span class="content_value">{{item.deviceName}} - {{item.deviceNo}}</span>
                        </p>
                        <p>
                            <span class="content_title">合作状态</span>
                            <span class="content_value" v-if="item.deviceStatus === 0">中止中</span>
                            <span class="content_value" v-if="item.deviceStatus === 1">正常中</span>
                        </p>
                    </div>
                    <div class="item_footer">
                        <!-- 已失效的不可以编辑 -->
                        <van-button v-if="item.status !== 2" @click="toEdit(item)">编辑结算</van-button>
                        <div v-if="item.state === 1">
                            <van-button>启用</van-button>
                        </div>
                    </div>
                </van-cell>
            </van-list>
        </van-pull-refresh>
        <div class="footer">
            <van-button type="primary" round :icon="require('@/assets/add2.png')" text="添加分账规则" color="#FE7E41" to="add-proportion"></van-button>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { subledgerRateList } from '@/api/collect-money-setting.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const listData = ref()
const searchData = ref('')
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const pageNum = ref(1)
const onLoad = async () => {
    const res = await subledgerRateList({ page: pageNum.value, mobileOrName: searchData.value })
    loading.value = false
    if (res.code === '200') {
        if (refreshing.value) {
            listData.value = []
            refreshing.value = false
        }
        listData.value = pageNum.value === 1 ? res.data.list : [...listData.value, ...res.data.list]
        if ((res.data.total / 10) < pageNum.value) {
            finished.value = true
            return
        }
        pageNum.value++
    } else {
        finished.value = true
    }
    console.log(res, 'res')
    console.log(res, 'res --- 1')
}
const onRefresh = () => {
    finished.value = false
    // 将 loading 设置为 true，表示处于加载状态
    loading.value = true
    pageNum.value = 1
    onLoad()
}
const onSearch = () => {
    pageNum.value = 1
    onLoad()
}
const toEdit = (item) => {
    sessionStorage.setItem('FZ_ITEM', JSON.stringify(item))
    router.push({ name: 'add-proportion', params: { configId: item.ruleConfigId } })
}
// const init = () => {
//     const data = [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292]
//     const len = data.length
//     let i = 0
//     const newArr = []
//     while (i < len) {
//         if (data[i] < data[i + 1]) {
//             newArr.push(data[i + 1] - data[i])
//         } else {
//             newArr.push('-')
//         }
//         i++
//     }
//     console.log(newArr)
// }
// init()
</script>
<style lang="scss" scope>
.ledger-proportion{
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    .search{
        width: 100%;
        height: 130px;
        .van-search{
            padding: 36px 40px 30px 40px;
            .van-search__content{
                border-radius: 100px;
            }
            .van-field__left-icon{
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 20px;
            }
        }
    }
    .so_list{
        width: 100%;
        padding: 20px 30px;
        box-sizing: border-box;
        .listItem{
            position: relative;
            width: 100%;
            // height: 465px;
            background-color: #fff;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
            .item_title{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 20px;
                box-sizing: border-box;
                border-bottom: solid 1px #F2F6F9;
                p{
                    font-size: 28px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    display: flex;
                    justify-content: center;
                    color: #2E2E4D;
                    line-height: 40px;
                    img{
                    width: 32px;
                    height: 32px;
                    margin-top: 3px;
                    margin-right: 15px;
                    }
                }
                .item_statu{
                    width: 120px;
                    height: 33px;
                    line-height: 40px;
                    font-size: 24px;
                    text-align: right;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    .rate_text{
                        color: #FE7E41;
                    }
                    .item_become{
                        color: #B0B0B0;
                    }
                    .delay_text{
                        color: #69925A;
                    }
                    .item_refuse{
                        color: #FF2442;
                    }
                }
            }
            .item_content{
                width: 100%;
                p{
                    width: 100%;
                    height: 37px;
                    display: flex;
                    justify-content: space-between;
                    margin-top: 16px;
                    font-size: 26px;
                    font-weight: 400;
                    color: #999999;
                    line-height: 37px;
                    .content_title{
                        // width: 690px;
                        background: #FFFFFF;
                        border-radius: 8px;
                        font-size: 26px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #999;
                    }
                    .content_value{
                        // width: 100%;
                        height: 37px;
                        text-align: right;
                        font-size: 26px;
                        font-weight: 400;
                        color: #191919;
                        line-height: 37px;
                    }
                }
            }
            .item_footer{
                width: 100%;
                display: flex;
                margin-top: 16px;
                justify-content: flex-end;
                .van-button{
                    padding: 0 32px;
                    height: 62px;
                    margin-left: 20px;
                    background: #FFFFFF;
                    border-radius: 34px;
                    border: 1px solid #FE7E41;
                    .van-button__content{
                        .van-button__text{
                            height: 33px;
                            font-size: 24px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #FE7E41;
                            line-height: 33px;
                        }
                    }
                }
                .presionIcon{
                    width: 160px;
                    height: 62px;
                    background: #fff;
                    margin-left: 20px;
                    border-radius: 31px;
                    border: 1px solid #E0E0E0;
                }
            }
        }
    }
    .footer{
        width: 100%;
        height: 210px;
        display: flex;
        justify-content: center;
        align-content: center;
        .van-button{
            width: 630px;
            height: 92px;
            margin-top:25px;
        }
    }
}
</style>
