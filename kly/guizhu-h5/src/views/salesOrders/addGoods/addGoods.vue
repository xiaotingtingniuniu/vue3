<template>
    <div class="addGoodsBox">
        <!-- <div class="addGoodsTitle">
            <van-icon name="arrow-left" class="back" @click="onClickLeft" size="20" />
            <span class="equipment">添加商品</span>
        </div> -->
        <!-- <van-nav-bar fixed placeholder :title="$route.meta.title" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="$router.replace({name: 'hesalesOrders'})">
                    <van-image :src="require('@/assets/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar> -->
        <div class="search">
            <van-search v-model="value" shape="round" placeholder="请输入搜索关键词" />
        </div>
        <div class="orderDetailsMiddle">
            <div class="transverse"></div>
            <!-- <van-checkbox-group checked-color="#FE7E41"> -->
            <div v-for="(item,index) in listData" :key="index">
                <van-checkbox   v-model="item.checked"
                                class="checkbox-item"
                                checked-color="#FE7E41"  @click="toggle">
                    <div class="orderList">
                        <div class="orderId">{{index+1}}</div>
                        <img :src="item.skuImgUrl" alt="" class="orderImg">
                        <div>
                            <div class="orderTitle">{{item.skuName}}</div>
                            <!-- <div class="orderPrice">{{(item.salesPrice/100).toFixed(2)}}</div> -->
                        </div>
                    </div>
                </van-checkbox>
            </div>

            <!-- </van-checkbox-group> -->
        </div>
        <div class="button" @click="gotoAddGoods">
            <span>确定添加</span>
        </div>

    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { goodsList } from '@/api/order.js'

import { useStore } from 'vuex'
const router = useRouter()
const store = useStore()
const value = ref('')
// const onClickLeft = () => history.back()

const listData = ref([])
const getList = async () => {
    const res = await goodsList()
    if (res.code === '200') {
        listData.value = res.data
    }
}
getList()

const toggle = () => {
    const arr = []
    const checkedGoods = listData.value.filter((item) => item.checked)
    checkedGoods.forEach(item => {
        arr.push(item)
    })
    store.commit('setGoodsList', arr)
}

const gotoAddGoods = () => {
    router.push({
        path: '/addOrder',
        name: 'addOrder'

    })
}
</script>
<style lang="scss">
.addGoodsBox{
    overflow:auto;
    .van-nav-bar__placeholder{
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            background-color: #fff;
            .icon--unselect{
                .van-image{
                    width: 19px;
                    height: 31px;
                }
            }
        }
        :deep(.van-nav-bar::after){
            content: initial;
        }
    }
    .goodsInfoMiddle{
        width: 690px;
        min-height: 206px;
        background: #FFFFFF;
        .orderList{
            width: 631px;
            height: 206px;
            border-bottom: 1px solid #F2F6F9;
            margin-left: 48px;
            display: flex;
            .orderImg{
                width: 100px;
                height: 100px;
                margin-top: 66px;
            }
            .orderTitle{
                font-size: 26px;
                font-weight: 500;
                color: #191919;
                // margin-left: 16px;
                // margin-top: 66px;
                align-items: center;
                justify-items: center;
            }
            .orderPrice{
                font-size: 27px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #FE7E41;
                line-height: 38px;
                margin-left: 16px;
                margin-top: 25px;
                img{
                    width: 12px;
                    height:15.36px;
                }
            }
            .orderQuantity{
                font-size: 27px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #494849;
                margin-top: 97px;
                position: absolute;
                right: 30px;
            }
        }
        .orderListFoot{
            display: flex;
            justify-content: flex-end;
            height: 96px;
            .common{
                font-size: 22px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #B0B0B0;
                margin-top: 31px;
                margin-right: 16px;
            }
            .commonOne{
                font-size: 22px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #B0B0B0;
                margin-top: 31px;
            }
            .totalBox{
                font-size: 20px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FE7E41;
                margin-top: 31px;
                margin-right: 30px;
            }
        }
    }
    .addGoodsTitle{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        width: 750px;
        height: 128px;
        background: #ffffff;
        font-size: 34px;
        text-align: center;
        line-height: 140px;
        .equipment{
            width: 136px;
            height: 48px;
            font-size: 34px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #000000;
            line-height: 48px;
        }
        .back{
            color: #000;
            float: left;
            margin-left:20px;
            margin-top: 50px;
        }
    }
    .search{
        margin-top:128px;
    }
    .orderDetailsMiddle{
        height: 898px;
        width: 750px;
        background: #FFFFFF;
        margin-top: 20px;
        .van-checkbox__icon{
            position: absolute;
            left: 684px;
        }
        .orderList{
            height: 180px;
            border-bottom: 1px solid #F2F6F9;
            margin-left: 30px;
            display: flex;
            .orderId{
                width: 27px;
                height: 37px;
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #4F5160;
                line-height: 37px;
                margin-top:72px;
                margin-right:12px;
            }
            .orderImg{
                width: 100px;
                height: 100px;
                margin-top: 40px;
            }
            .orderTitle{
                font-size: 26px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #191919;
                margin-left: 16px;
                margin-top: 40px;
                width: 380;
            }
            .orderPrice{
                font-size: 22px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #B0B0B0;
                margin-left: 16px;
                margin-top: 10px;
            }
            .orderQuantity{
                font-size: 27px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #494849;
                margin-left: 110px;
                margin-top: 57px;
            }
        }
        .orderListFoot{
            display: flex;
            justify-content: flex-end;
            height: 96px;
            .common{
                font-size: 22px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #B0B0B0;
                margin-top: 31px;
                margin-right: 16px;
            }
            .commonOne{
                font-size: 22px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #B0B0B0;
                margin-top: 31px;
            }
            .totalBox{
                font-size: 20px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FE7E41;
                margin-top: 31px;
                margin-right: 30px;
            }
        }
    }
    .van-field__left-icon{
        width: 24px;
        height: 24px;
        background: url('../../../assets/replenishmentImg/search2x.png');
        background-size: 24px 24px;
        margin-top: 10px;
    }
    .van-icon-search:before{
        display: none;
    }
    .button{
        width: 630px;
        height: 92px;
        background: #FE7E41;
        border-radius: 46px;
        position: absolute;
        bottom:41px;
        left:60px;
        text-align:center;
        line-height: 92px;
        span{
            font-size: 30px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
        }
    }
}
</style>
