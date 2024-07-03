<template>
    <div class="addOrderBox">
        <!-- <div class="addOrderTitle">
            <van-icon name="arrow-left" class="back" @click="onClickLeft" size="20" />
            <span class="equipment">创建订单</span>
        </div> -->
        <!-- <div class="cell" @click="addGoods">
            <img src="../../../assets/addGoods.png" alt="">
            <span>添加商品</span>
        </div> -->
        <!-- <div class="goodsInfoList" v-if="list!==[]">
            <div class="orderList" v-for="(item,index) in list" :key="index">
                <img :src="item.skuImgUrl" alt="" class="orderImg">
                <div>
                    <div class="orderTitle">{{index+1}}</div>
                    <div class="orderPrice">
                        <img src="../../../assets/money.png" alt="">{{(item.salesPrice/100).toFixed(2)}}
                        <img src="../../../assets/编辑（3）.png" alt="">
                    </div>
                </div>
                <div class="stepper">
                    <van-stepper button-size="21" input-width="21"  v-model="item.quantity"/>
                </div>
            </div>
        </div>
        <div class="button" @click="showPopup">
            <span>确定</span>
        </div> -->
        <van-nav-bar fixed placeholder :title="$route.meta.title" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="$router.replace({name: 'abnormalDetails',query:{workOrderNo: props.workOrderNo}})">
                    <van-image :src="require('@/assets/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <div class="addOrderContainer">
            <div class="addOrderContent"  v-for="(item,index) in alllistData" :key="index">
                <div class="listContent">
                    <div class="numberBox">{{ (index > 8 ? '' : '0') + (index + 1) }}</div>
                    <van-image :src='item.skuImgUrl'/>
                    <div class="goodsInfo van-hairline--bottom">
                        <div class="titleContent">{{item.skuName}}</div>
                        <div class="listFoot">
                            <div class="priceBox">
                                <img src="@/assets/money.png" alt="" class="moneyBox">
                                <span class="listPrice" v-if=" !item.select">{{(item.salesPrice/100).toFixed(2)}}</span>
                                <van-field  v-if="item.select" v-model="item.price"   type="number" placeholder="请输入金额" @keyup.enter="search(item)" />
                                <span v-if="!item.select">
                                    <img src="@/assets/replenishmentImg/edit2x.png"  class="editBox" @click="modifyPrice(item)">
                                </span>
                            </div>
                            <div class="list_quantity">
                                <div>x1</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="button" @click="showPopup">
                <span>确定</span>
            </div>
        </div>
        <!-- <div v-else>
            <img :src="require('../../../assets/bag_img.png')" class="emptyImg"/>
            <p class="emptyTitle">暂无数据</p>
        </div> -->
        <van-popup v-model:show="show" position="bottom">
            <div class="popupTitle">
                <span class="cancel" @click="show =false">取消</span>
                <span class="goodsInfo">商品信息确认</span>
            </div>
            <div class="goodsInfoMiddle" v-for="(el,index) in listData" :key="index">
                <div class="orderList">
                    <div class="order-list-left">
                        <img :src="el.skuImgUrl" alt="" class="orderImg">
                    </div>
                    <div class="order-list-right">
                        <div>
                            <div class="orderTitle">{{el.skuName}}</div>
                            <div class="orderPrice">
                                <img src="../../../assets/money.png" alt="">{{el.price}}
                            </div>
                        </div>
                        <div class="orderQuantity">x1</div>
                    </div>
                </div>
                <div class="orderListFoot">
                    <div class="common">共1件</div>
                    <div class="commonOne">合计：</div>
                    <div class="totalBox">
                        <img src="@/assets/money.png" alt="" class="moneyBox">{{el.price}}
                    </div>
                </div>
            </div>
            <div class="button-container">
                <van-button class="button-boxs" @click="addGoodsResult">确定</van-button>
            </div>

        </van-popup>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import { useStore } from 'vuex'
import { createWorker, goodsList } from '@/api/order.js'
import { Toast } from 'vant'

// const route = useRoute()
const router = useRouter()
// const value = ref(1)
// const store = useStore()

const props = defineProps(['workOrderNo'])
// const list = computed(() => store.state.goodsList)
// const detailInfo = computed(() => store.state.workerDetail)

const alllistData = ref([])
const getList = async () => {
    const res = await goodsList()
    if (res.code === '200') {
        alllistData.value = res.data.map(item => {
            item.quantity = 1
            return {
                price: (item.salesPrice / 100).toFixed(2),
                ...item
            }
        })
    }
}
getList()
const show = ref(false)
const listData = ref([])
const showPopup = () => {
    listData.value = alllistData.value
    show.value = true
}
const modifyPrice = (value) => {
    value.select = !value.select
}
// 价格
// const totalNum = computed(() => {
//     return listData.value.reduce((prev, item) => {
//         let price = 0
//         if (item.checked) (price += ((item.quantity * item.salesPrice) / 100).toFixed(2))
//         var allprice = (Number(prev) + Number(price)).toFixed(2)
//         return allprice
//     }, 0)
// })
// const onClickLeft = () => history.back()
const addGoodsResult = async () => {
    const goodsList = listData.value.map(item => {
        item.salesPrice = item.price * 100
        return {
            ...item
        }
    })
    const parm = {
        workOrderNo: props.workOrderNo,
        // workOrderNo: 'WO20220923205804212A3LPR',
        totalAmount: listData.value[0].price,
        deductAmount: 1,
        goodsList: goodsList
    }
    console.log(parm, 'parm')
    const res = await createWorker(parm)
    if (res.code === '200') {
        router.push({
            path: '/addResult',
            name: 'addResult',
            params: {
                workOrderNo: props.workOrderNo,
                orderNo: res.data
            }
        })
    } else {
        Toast(res.message)
    }
}
// const addGoods = () => {
//     router.push({
//         path: '/addGoods',
//         name: 'addGoods'
//     })
// }
</script>
<style lang="scss" scoped>
.addOrderBox{
    height: 100vh;
    background: #fff;
    .van-nav-bar__placeholder{
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            background-color: #fff;
            .icon--unselect{
                .van-image{
                    width: 19px;
                    height: 31px;
                    img{
                        width: 19px;
                        height: 31px;
                    }
                }
            }
        }
        :deep(.van-nav-bar::after){
            content: initial;
        }
    }
    .addOrderContainer{
        .addOrderContent{
            .listContent{
                box-sizing:border-box;
                display: flex;
                align-items: center;
                padding: 0 30px;
                .numberBox{
                    font-size: 26px;
                    font-weight: 400;
                    color: #4F5160;
                }
                .van-image{
                    width: 144px;
                    height: 144px;
                    margin-left: 17px;
                }
                .van-hairline--bottom{
                    --van-border-color: #F4F5F5;
                }
                .goodsInfo{
                    width: 0;
                    flex: 1;
                    margin-left: 13px;
                    padding: 40px 0;
                    .titleContent{
                        color: #191919;
                        font-size: 26px;
                        font-weight: 500;
                        word-break: break-all;
                        word-wrap: break-word;
                    }
                    .orderBox{
                        font-size: 22px;
                        font-weight: 400;
                        color: #B0B0B0;
                        margin-top: 6px;
                    }
                    .listFoot{
                        margin-top: 26px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .priceBox{
                            display: flex;
                            align-items: center;
                            .moneyBox{
                                width: 12px;
                                height: 15px;
                            }
                            .van-field{
                                width: 150px;
                                height: 33px;
                                line-height: 33px;

                                padding: initial;
                                margin-left: 7px;
                                font-size: 27px;
                                .van-field__control{
                                    color: #FE7E41;
                                }
                            }
                            .listPrice{
                                color: #FE7E41;
                                font-size: 27px;
                                line-height: 33px;
                                font-weight: 500;
                                margin-left: 5px;
                            }
                            .editBox{
                                width: 22px;
                                height: 23px;
                                margin-left: 16px;
                            }
                        }
                        .list_quantity{
                            font-size: 27px;
                            font-weight: 500;
                            color: #494849;
                            margin-right: 30px;
                        }
                        .totalBox{
                            margin-right: 30px;
                        }
                        .totalList{
                            margin-right: 30px;
                        }
                        .totalarr{
                            margin-left: 332px;
                        }
                        .totalLeft{
                            margin-left: 332px;
                        }
                        .van-stepper__minus{
                            background: #FFFFFF;
                            width: 48px;
                            height: 44px;
                            border: 1px solid #E0E0E0;
                            border-right: none;
                            border-radius: 6px 0px 0 6px;
                            color: #B0B0B0;
                            font-size: 26px;
                            margin-top: 0px;
                        }
                        .van-stepper__input{
                            margin:0px !important;
                            background: #FFFFFF;
                            width: 63px;
                            height: 44px;
                            border: 1px solid #E0E0E0;
                            font-size: 26px;
                            margin-top: 3px;
                        }
                        .van-stepper__plus{
                            background: #FFFFFF;
                            width: 48px;
                            height: 44px;
                            border: 1px solid #E0E0E0;
                            border-left: none;
                            border-radius: 0px 6px 6px 0px;
                            color: #B0B0B0;
                            font-size: 26px;
                            margin-top: -0px;
                        }
                    }
                }
                .listBox{
                    float: left;
                    width: 450px;
                }
                .listData{
                    float: left;
                    width: 450px;
                }
                .bottom{
                    width: 519px;
                    height: 1px;
                    background: #F4F5F5;
                    margin-left: 231px;
                    float: left;
                }
                // .bottomNew{
                //     width: 519px;
                //     height: 1px;
                //     background: #F4F5F5;
                //     margin-left: 231px;
                //     float: left;
                //     margin-top: 15px;
                // }
                .bottomTow{
                    width: 460px;
                    height: 1px;
                    background: #F4F5F5;
                    margin-left: 292px;
                    float: left;
                }
                .bottomOne{
                    width: 460px;
                    height: 1px;
                    background: #F4F5F5;
                    margin-left: 292px;
                    float: left;
                }
                .bottomThree{
                    width: 460px;
                    height: 1px;
                    background: #F4F5F5;
                    margin-left: 292px;
                    float: left;
                    margin-top: 10px;
                }
                .bottomWidth{
                    width: 460px;
                    height: 1px;
                    background: #F4F5F5;
                    margin-left: 292px;
                    float: left;
                    margin-top: 15px;
                }

            }
        }
    }
    .goodsInfoMiddle{
        min-height: 206px;
        background: #FFFFFF;
        .orderList{
            padding: 0 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .order-list-left{
                width: 116px;
                padding: 40px 0;
                .orderImg{
                    width: 100px;
                    height: 100px;
                    margin-right: 16px;
                }

            }
            .order-list-right{
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid  #F4F5F5;
               padding: 40px 0;
                .orderTitle{
                    font-size: 26px;
                    font-weight: 500;
                    color: #191919;
                }
                .orderPrice{
                    font-size: 27px;
                    font-weight: 500;
                    color: #FE7E41;
                    line-height: 38px;
                    margin-top: 25px;
                    img{
                        width: 12px;
                        height:15.36px;
                    }
                }
                .orderQuantity{
                    font-size: 27px;
                    font-weight: 500;
                    color: #494849;

                }
            }

        }
        .orderListFoot{
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-top: 30px;
            letter-spacing: 1px;
            .moneyBox{
                width: 12px;
                height: 15px;
            }
            .common{
                font-size: 22px;
                font-weight: 400;
                color: #B0B0B0;
                margin-right: 16px;
            }
            .commonOne{
                font-size: 22px;
                font-weight: 400;
                color: #B0B0B0;
            }
            .totalBox{
                font-size: 28px;
                font-weight: 400;
                color: #FE7E41;
                margin-right: 30px;
            }
        }
    }
    .button-container{
        text-align:center;
        margin-bottom: 51px;
        .button-boxs{
            width: 630px;
            height: 92px;
            background: #FE7E41;
            border-radius: 46px;
            margin-top:35px;
            font-size: 30px;
            font-weight: 600;
            color: #FFFFFF;
            span{
                font-size: 30px;
                font-weight: 600;
                color: #FFFFFF;
            }
        }
    }
    .popupTitle{
        width:100%;
        line-height:130px;
        border-bottom: 1px solid #E7E7E7;
        .cancel{
            font-size: 30px;
            font-weight: 400;
            color: #191919;
            margin-left:51px;
        }
        .goodsInfo{
            font-size: 32px;
            font-weight: 700;
            color: #191919;
            position: absolute;
            right:279px;
        }
    }
    .addOrderTitle{
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
    .cell{
        width:690px;
        height:215px;
        background-image: url('../../../assets/background.png');
        background-size:100% 100%;
        position: absolute;
        top:148px;
        left:30px;
        display: flex;
        justify-content: center;
        align-items:center;
        img{
            width: 118px;
            height:123px;
        }
        span{
            font-size: 36px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #191919;
            line-height: 50px;
        }
    }
    .goodsInfoList{
        width: 750px;
        min-height: 206px;
        background: #FFFFFF;
        position:absolute;
        top: 384px;
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
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #191919;
                margin-left: 16px;
                margin-top: 66px;
                width: 380;
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
            .stepper{
                width: 158px;
                height: 44px;
                border-radius: 6px;
                // border: 1px solid #E0E0E0;
                margin-top:96px;
                position: absolute;
                right:31px;
            }
        }
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
