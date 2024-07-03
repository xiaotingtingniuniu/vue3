<template>
    <div class="ledger-manage">
        <div class="search">
            <form action="/" class="input">
                <van-search v-model="searchData" placeholder="请输入手机号或姓名" :left-icon="require('@/assets/search2.png')" @search="onRefresh" />
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
                <van-cell class="listItem" v-for="(item, index) in list" :key="index">
                    <div class="item_title">
                        <div>
                            <div class="title">{{item.name}}
                                <span class="item_statu item_paid" v-if="item.status === 0">待生效
                                </span>
                                <span class="item_statu item_become" v-if="item.status === 1">已生效
                                </span>
                            </div>
                            <div v-if="item.mobile">{{item.mobile}}</div>
                            <div v-if="item.accountNo">{{item.accountNo}}</div>
                        </div>
                        <div><van-button v-if="item.status === 0" @click="showPopup(item)">微信收款人</van-button></div>
                    </div>
                </van-cell>
            </van-list>
        </van-pull-refresh>
        <van-popup v-model:show="show" class="wx-box-popup" teleport="body" round>
            <div class="or-code-box">
                <div class="or-code-img">
                    <!-- <img class="" src="https://mp.weixin.qq.com/mp/qrcode?scene=10000004&size=102&__biz=MzAxODE4MTEzMA==&mid=2650101504&idx=1&sn=d07e50826624c871d3c728ace2619f7f&send_time=" alt=""> -->
                    <qrcode-vue class="qrcode" :value="qrCodeUri" level="H" />
                </div>
                <p>请用微信"扫一扫"绑定收款人</p>
            </div>
        </van-popup>
        <div class="footer">
            <van-button type="primary" round :icon="require('@/assets/add2.png')" text="添加" to="add-routing-person" color="#FE7E41"></van-button>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { subledgerList } from '@/api/collect-money-setting.js'
import QrcodeVue from 'qrcode.vue'
const list = ref([])
const searchData = ref('')
const loading = ref(false)
const finished = ref(false)
const show = ref(false)
const refreshing = ref(false)
const qrCodeUri = ref('')
const pageNum = ref(1)
const showPopup = (item) => {
    show.value = true
    // qrCodeUri.value = `${window.origin}/mine/register-payee/${item.subLedgerId}`
    qrCodeUri.value = 'http://hsh-guizhu-h5.k8stest.hengchang6.com/mine/register-payee/' + item.subLedgerId
}
const onRefresh = () => {
    finished.value = false
    // 将 loading 设置为 true，表示处于加载状态
    loading.value = true
    pageNum.value = 1
    onLoad()
}
const onLoad = async () => {
    const res = await subledgerList({
        page: pageNum.value,
        mobileOrName: searchData.value
    })
    loading.value = false
    if (res.code === '200') {
        if (refreshing.value) {
            list.value = []
            refreshing.value = false
        }
        list.value = pageNum.value === 1 ? res.data.list : [...list.value, ...res.data.list]
        if ((res.data.total / 10) < pageNum.value) {
            finished.value = true
            return
        }
        pageNum.value++
    } else {
        finished.value = true
    }
    console.log(res, 'res')
}
// init()
</script>
<style lang="scss" scope>
    .qrcode {
        width: 288px !important;
        height: 288px !important;
    }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
    .van-field__error-message {
        text-align: right !important;
    }
  .block {
    width: 120px;
    height: 120px;
    background-color: #fff;
  }
.or-code-box{
    margin-top: 60px;
    // width: 100%;
    // height: 100%;
    border-radius: 8px;
    display:flex ;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .or-code-img{
        width: 328px;
        height: 328px;
        background-color: #fff;
        border-radius: 8px;
        border: 1px solid #D2D2D2;
        display:flex ;
        justify-content: center;
        align-items: center;
        img{
            width: 288px;
            height: 288px;
            background-color: #ccc;
        }
    }
    p{
        margin-top: 30px;
        font-size: 30px;
        text-align: center;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000;
        line-height: 45px;
    }
}
.wx-box-popup {
    width: 548px;
    height: 523px;
}
.ledger-manage{
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
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
            padding: 34px 30px;
            position: relative;
            width: 690px;
            background-color: #fff;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
            .item_title{
                display: flex;
                justify-content: space-between;
                align-items: center;
                // padding: 20px 0;
                box-sizing: border-box;
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

                .title {
                    font-size: 28px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #191919;
                    line-height: 40px;
                    .item_statu{
                        display: inline-block;
                        margin-left: 12px;
                        text-align: center;
                        width: 83px;
                        height: 34px;
                        line-height: 34px;
                        text-align: center;
                        border-radius: 19px;
                        font-size: 20px;
                        font-family: PingFangSC-Regular, PingFang SC;
                    }
                    .item_paid{
                        color: #FE7E41;
                        background: #FFE8DD;
                    }
                    .item_become{
                        color: #69925A;
                        background: #E5F7DF;
                    }
                }
                .van-button{
                    width: 200px;
                    height: 62px;
                    margin-left: 20px;
                    margin-bottom: 20px;
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
            }
            .item_content{
                width: 100%;
                .content_item{
                    display: flex;
                    justify-content:space-between ;
                    align-items: center;
                    margin-top: 10px;
                    .content_title{
                        color: #999999;
                        padding: 10px 0;
                        box-sizing: border-box;
                    }
                }

            }
        }
    }
    .footer{
        width: 100%;
        height: 210px;
        display: flex;
        margin-top: 80px;
        justify-content: center;
        align-content: center;
        .van-button{
            width: 630px;
            height: 92px;
            margin-top:75px;
        }
    }
    .van-popup{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    :deep .or-code-box{
        width: 100%;
        height: 100%;
        .or-code-img{
            width: 328px;
            height: 328px;
        }
    }
}
</style>
