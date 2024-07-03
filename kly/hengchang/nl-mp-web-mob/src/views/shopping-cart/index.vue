<template>
    <div class="shopping-cart-page" :class="isApp ? 'app-class' : ''">
        <van-nav-bar v-if="isApp" title="购物车" fixed :left-arrow="route.query.hasback === '1'" z-index="10000" :border="false">
            <template #left v-if="route.query.hasback === '1'">
                <div class="icon--unselect back" @click="pageBack">
                    <van-icon size="1em" :name="require('@/assets/goods/back-icon2.png')" />
                </div>
            </template>
            <template #right>
                <template v-if="skuList.length || notSaleList.length">
                    <div class="nav-right" v-if="!notSaleListType" @click="editCart">管理</div>
                    <div class="nav-right" v-else @click="editNoCart">完成</div>
                </template>
            </template>
        </van-nav-bar>
        <div class="effective-box-top">
            <div class="left">全部商品</div>
            <template v-if="(skuList.length || notSaleList.length) && !isApp">
                <div class="right" v-if="!notSaleListType" @click="editCart">管理</div>
                <div class="right" v-else @click="editNoCart">完成</div>
            </template>
        </div>
        <!-- 有效 -->
        <div class="effective-box" v-if="storeInfo" >

            <div class="goods-cart">
                <van-checkbox v-model="checkyesAll" label-disabled v-if="skuList.length">
                    <div class="shop-info" @click="pageGo(`/shops-goods/shops-detail/${storeInfo.id}`)">
                        <div class="shop-info-name">
                            <div class="icon--unselect shop-icon">
                                <van-icon size="1em" :name="require('@/assets/shopping-cart/shop-icon.png')" />
                            </div>
                            <div class="text">{{ storeInfo.storeName }}</div>
                            <div class="icon--unselect arrow">
                                <van-image width="5" height="8" :src="require('@/assets/shopping-cart/形状结合@2x.png')"/>
                            </div>
                        </div>
                    </div>
                    <template #icon="props">
                        <img @click="checkYesClick" class="img-icon" :src="props.checked ? activeIcon : (props.disabled ? disableIcon : inactiveIcon)" />
                    </template>
                </van-checkbox>
                <van-swipe-cell  v-for="(item, index) in skuList" :key="index">
                    <van-cell-group :border="false">
                        <div class="van-hairline--top">
                            <van-checkbox v-model="item.checked" label-disabled @click="setChoose()">
                                <goods-item @clickItem="pageGo(`/shops-goods/goods-detail/${item.id}`)" :indexNum="index" :goodsInfo="item" @cliadd="add" />
                                <template #icon="props">
                                    <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                                </template>
                            </van-checkbox>
                        </div>
                    </van-cell-group>
                    <template #right>
                        <div class="delete-warp">
                            <van-button class="delete-button" @click="deleteorder(item.cartId)">删除</van-button>
                        </div>
                    </template>
                </van-swipe-cell>
                <div v-if="!skuList.length && firstLoad" class="empty">
                    <div class="empty-bg"></div>
                    <div class="empty-tip">购物车是空的，去选购吧</div>
                    <van-button @click="goBrowse" class="empty-button" type="primary">去逛逛</van-button>
                </div>
            </div>
        </div>
        <!-- 失效 -->
        <div class="invalid-box" v-if="notSaleList.length && storeInfo">
            <div class="effective-box-top">
                <div class="left invalid-color">失效商品</div>
            </div>
            <div class="shop-cart" v-for="(item, index) in notSaleList" :key="index">
                <div class="goods-cart">
                    <van-checkbox v-model="checkNoAll" :disabled="!notSaleListType" label-disabled >
                        <div class="shop-info" @click="pageGo(`/shops-goods/shops-detail/${item.id}`)" v-if="item.skuList.length">
                            <div class="shop-info-name">
                                <div class="icon--unselect shop-icon">
                                    <van-icon size="1em" :name="require('@/assets/shopping-cart/shop-icon.png')" />
                                </div>
                                <div class="text">{{ item.storeName }}</div>
                                <div class="icon--unselect arrow">
                                    <van-image width="5" height="8" :src="require('@/assets/shopping-cart/形状结合@2x.png')"/>
                                </div>
                            </div>
                        </div>
                        <template #icon="props">
                            <img @click="checkAllNoClick" class="img-icon" :src="props.checked ? activeIcon : (props.disabled ? disableIcon : inactiveIcon)" />
                        </template>
                    </van-checkbox>
                    <van-swipe-cell  v-for="(item, index) in item.skuList" :key="index">
                        <van-cell-group :border="false">
                            <div class="van-hairline--top">
                                <van-checkbox v-model="item.checked" :disabled="!notSaleListType" label-disabled @click="chengeNoitem">
                                    <goods-item :invalid="true" :goodsInfo="item" :indexNum="index" />
                                    <template #icon="props" >
                                        <img class="img-icon" :src="props.checked ? activeIcon : (props.disabled ? disableIcon : inactiveIcon)" />
                                    </template>
                                </van-checkbox>
                            </div>
                        </van-cell-group>
                        <template #right>
                            <div class="delete-warp">
                                <van-button class="delete-button" @click="deleteorder(item.cartId)">删除</van-button>
                            </div>
                        </template>
                    </van-swipe-cell>
                </div>
            </div>
        </div>
        <div class="settlement" :class="route.query.hasback === '1' ? 'van-safe-area-bottom' : ''" v-if="skuList.length || notSaleList.length">
            <van-checkbox v-model="checkAll" label-disabled>
                <div class="left">全选</div>
                <div class="right">
                    <div class="price" v-if="!notSaleListType"><span class="unit">¥</span><span class="font-din">{{totalAmount}}</span></div>
                    <van-button @click="checkCounterOnlineFn(totalAmount)" v-if="!notSaleListType" :class="totalAmount > 0 ? '' : 'opacity'">结算</van-button>
                    <van-button @click='del' v-if="notSaleListType" :class="deleteGoodsChecked ? '' : 'opacity'">删除</van-button>
                </div>
                <template #icon="props">
                    <img @click="checkAllClick" class="img-icon" :src="props.checked ? activeIcon : (props.disabled ? disableIcon : inactiveIcon)" />
                </template>
            </van-checkbox>
        </div>
        <div class="settlement-height" :class="route.query.hasback === '1' ? 'van-safe-area-bottom' : ''"></div>
    </div>
</template>
<script setup>
import GoodsItem from '@/components/Goods/GoodsItem.vue'
import activeIcon from '@/assets/shopping-cart/activeIcon.png'
import inactiveIcon from '@/assets/shopping-cart/inactiveIcon.png'
import disableIcon from '@/assets/shopping-cart/disableIcon.png'
import { cartList, cartAdd, cartSettleCart, cartRemove, checkCounterOnline } from '@/api/shopping-cart'
import { Toast } from 'vant'
import { isApp } from '@/utils'
import { pageBack, pageGo } from '@/utils/composables'
import { registerhandler, appBridge } from '@/utils/bridge'
import Dialog from '@/components/Dialog'

const route = useRoute()
const store = useStore()
const storeInfo = computed(() => store.state.storeInfo)
const carChoose = computed(() => store.state.carChoose)
const counterInfo = computed(() => store.state.counterInfo)
const token = computed(() => store.state.token)
const firstLoad = ref(0)
const skuList = ref([])
const notSaleList = ref([])

const goBrowse = () => {
    if (isApp) return appBridge('goBrowse')
    pageGo('/menu')
}

const getCartList = async () => {
    const res = await cartList({ storeId: storeInfo.value.id })
    firstLoad.value++
    if (!res) {
        skuList.value = []
        notSaleList.value = []
    } else {
        firstLoad.value++
        var saleList = res.saleList && res.saleList.length > 0 ? res.saleList[0].skuList : []
        if (!notSaleListType.value) {
            store.commit('syncCarChoose')
            saleList.forEach(item => {
                if (carChoose.value && carChoose.value.includes(item.id)) { item.checked = true }
            })
        }
        skuList.value = saleList || []
        notSaleList.value = res.notSaleList || []
    }
    store.dispatch('updateCartNum')
}

onMounted(() => {
    watch([storeInfo, token], () => {
        if (storeInfo.value && token.value) getCartList()
    })
    if (storeInfo.value && token.value) {
        if (!skuList.value.length) getCartList()
        store.commit('setCurrentActiveCoupon', null)
    }
    if (isApp) {
        registerhandler('refreshCart', () => {
            if (notSaleListType.value === true) (notSaleListType.value = false)
            appBridge('getStoreInfo', {}, (payload) => {
                store.commit('updateStoreInfo', payload)
            })
            store.commit('setCurrentActiveCoupon', null)
            if (storeInfo.value && token.value) getCartList()
        })
    }
})

// 组建点击判断
const caraddId = ref()
const caraddI = ref()
const caraddIndex = ref()
const caraddNum = ref()
const add = (id, i, num, index) => {
    caraddIndex.value = index
    caraddI.value = i
    caraddNum.value = num
    if (num === 1 && i === -1) {
        caraddId.value = id
        if (isApp) {
            appBridge('deleteGoodsPopView')
            registerhandler('sureDeleteGoods', () => {
                getcartAdd(caraddId.value, caraddI.value)
            })
        } else {
            Dialog({
                title: '是否要删除该商品'
            }).then(() => {
                getcartAdd(caraddId.value, caraddI.value)
            }).catch(() => {})
        }
    } else if (num === 99 && i === 1) {
        Toast('已经是最大可购买数量了')
    } else {
        getcartAdd(id, i)
    }
}
// 请求购物车数量
const getcartAdd = async (skuId, i) => {
    const code = await cartAdd({
        storeId: storeInfo.value.id,
        skuId: skuId,
        quantity: i
    })
    if (code === 200) {
        if (i === 1) {
            skuList.value[caraddIndex.value].quantity = Number(caraddNum.value) + 1
        } else {
            skuList.value[caraddIndex.value].quantity = Number(caraddNum.value) - 1
            if (Number(caraddNum.value) - 1 === 0) {
                skuList.value.splice(caraddIndex.value, 1)
            }
        }
    } else if (code === 509) {
        Toast('已经是最大可购买数量了')
    }
}

const checkAll = ref(false)
const checkNoAll = ref(false)
const checkyesAll = ref(false)

// 价格
const totalAmount = computed(() => {
    return skuList.value.reduce((prev, item) => {
        let price = 0
        if (item.checked) (price += (item.quantity * item.sellPrice).toFixed(2))
        var allprice = (Number(prev) + Number(price)).toFixed(2)
        return allprice
    }, 0)
})
const notSaleListType = ref(false)
// 全选
const checkAllClick = () => {
    setTimeout(function () {
        skuList.value.map((item) => {
            item.checked = checkAll.value
        })
        checkyesAll.value = checkAll.value
    }, 0)

    if (notSaleListType.value) {
        setTimeout(function () {
            notSaleList.value.map((item) => {
                item.skuList.map(ite => {
                    ite.checked = checkAll.value
                })
            })
            checkNoAll.value = checkAll.value
        }, 0)
    } else {
        setTimeout(function () {
            var arr = []
            const checkedGoods = skuList.value.filter((item) => item.checked)
            checkedGoods.forEach(item => {
                arr.push(item.id)
            })
            store.commit('setcarChoose', arr)
        }, 1)
    }
}
// 可购买商品全选
const checkYesClick = () => {
    setTimeout(function () {
        skuList.value.map((item) => {
            item.checked = checkyesAll.value
        })
    }, 0)
    setChoose()
}
const checkAllNoClick = () => {
    setTimeout(function () {
        notSaleList.value.map((item) => {
            item.skuList.map(ite => {
                ite.checked = checkNoAll.value
            })
        })
    }, 0)
}
const chengeNoitem = () => {
    let goodsLength1 = 0
    const checkedNum1 = notSaleList.value.reduce((prev, cur) => {
        const sum = cur.skuList.reduce((p, c) => {
            goodsLength1++
            return p + Number(c.checked)
        }, 0)
        return prev + sum
    }, 0)
    checkNoAll.value = notSaleList.value.length > 0 ? checkedNum1 === goodsLength1 : false
}

const checkCounterOnlineFn = async (totalAmount) => {
    if (!Number(totalAmount)) return false
    const checkedGoods = skuList.value.filter((item) => item.checked)
    if (!checkedGoods.length) return Toast('请选择商品')
    if (!notSaleListType.value) {
        setTimeout(function () {
            var arr = []
            const checkedGoods = skuList.value.filter((item) => item.checked)
            checkedGoods.forEach(item => {
                arr.push(item.id)
            })
            store.commit('setcarChoose', arr)
        }, 1)
    }
    const state = await checkCounterOnline({ counterId: counterInfo.value.id })
    if (state) return settlement()
    if (isApp) {
        appBridge('containerOfflinePopView')
        registerhandler('continueContainerOffline', () => {
            settlement()
        })
    } else {
        Dialog({
            title: '当前选择的货柜已离线</br>可能会无法取货</br>是否继续下单?',
            right: '继续'
        }).then(() => {
            settlement()
        }).catch(() => {})
    }
}

// 结算
const settlement = async () => {
    const checkedGoods = skuList.value.filter((item) => item.checked)
    const { code, data } = await cartSettleCart({
        containerId: counterInfo.value.id,
        cartList: checkedGoods
    })
    if (code === 200) {
        store.commit('settlementSave', data)
        pageGo('/order-confirm?position=1')
    } else if (code === 506 || code === 507 || code === 508 || code === 509) {
        getCartList()
    }
}

const deleteGoodsChecked = computed(() => {
    const checkedGoods = skuList.value.filter(item => item.checked)
    const checkedGoods1 = notSaleList.value.map((item) => item.skuList.filter(val => val.checked))
    const notSaleArr = [].concat.apply([], checkedGoods1)
    return (checkedGoods.length + notSaleArr.length) > 0
})
// 删除
const del = () => {
    const checkedGoods = skuList.value.filter((item) => item.checked)
    var arr = []
    // 可购买
    checkedGoods.forEach(item => {
        arr.push(item.cartId)
    })
    // 失效
    const checkedGoods1 = notSaleList.value.map((item) => {
        return item.skuList.filter(val => val.checked)
    })
    checkedGoods1.forEach(item => {
        item.forEach(child => {
            arr.push(child.cartId)
        })
    })
    if (!arr.length) return false
    getcartRemove(arr)
}

// 删除
const getcartRemove = async (arr) => {
    const res = await cartRemove({
        ids: arr
    })
    if (res === 200) {
        Toast('删除成功')
        getCartList()
    }
}
// 购物车删除商品
const tempId = ref(null)
const deleteorder = async (cartId) => {
    tempId.value = cartId
    Dialog({
        title: '是否要删除该商品'
    }).then(() => {
        getcartRemove([tempId.value])
    }).catch(() => {})
}
// 完成/编辑切换
const editCart = async () => {
    notSaleListType.value = true
    skuList.value.map((item) => {
        item.checked = false
    })
    notSaleList.value.map((item) => {
        item.skuList.map(ite => {
            ite.checked = false
        })
    })
    checkNoAll.value = false
    checkyesAll.value = false
    checkAll.value = false
}
const editNoCart = async () => {
    notSaleListType.value = true
    skuList.value.map((item) => {
        item.checked = false
    })
    notSaleList.value.map((item) => {
        item.skuList.map(ite => {
            ite.checked = false
        })
    })
    checkNoAll.value = false
    checkyesAll.value = false
    checkAll.value = false
    notSaleListType.value = false
    var saleList = skuList.value
    if (saleList) {
        saleList.forEach(item => {
            if (carChoose.value.includes(item.id)) { item.checked = true }
        })
        skuList.value = saleList
    }
}
const setChoose = async () => {
    setTimeout(function () {
        var goodsLength = 0
        const checkedNum = skuList.value.reduce((prev, cur) => {
            goodsLength++
            return prev + Number(cur.checked)
        }, 0)
        checkyesAll.value = skuList.value.length > 0 ? checkedNum === goodsLength : false
    }, 100)

    if (!notSaleListType.value) {
        setTimeout(function () {
            var arr = []
            const checkedGoods = skuList.value.filter((item) => item.checked)
            checkedGoods.forEach(item => {
                arr.push(item.id)
            })
            store.commit('setcarChoose', arr)
        }, 1)
    }
}
watchEffect(() => {
    if (notSaleListType.value) {
        checkAll.value = checkNoAll.value && checkyesAll.value
    } else {
        var goodsLength = 0
        const checkedNum = skuList.value.reduce((prev, cur) => {
            goodsLength++
            return prev + Number(cur.checked)
        }, 0)
        checkAll.value = skuList.value.length > 0 ? checkedNum === goodsLength : false
        checkyesAll.value = skuList.value.length > 0 ? checkedNum === goodsLength : false
    }
})
</script>
<style lang="scss" scoped>
.app-class{
    height: calc(100vh - 30px - var(--van-status-bar-height) - 92px) !important;
    padding-top: calc(var(--van-status-bar-height) + 92px) !important;
    .van-nav-bar{
        background-color: #F7F7F7;
        padding-top: var(--van-status-bar-height);
        :deep(.van-nav-bar__title){
            font-size: 34px;
        }
        .nav-right{
            font-size: 30px;
            font-weight: bold;
            color: #212034;
        }
        .back{
            font-size: 34px;
            height: 100%;
            display: flex;
            justify-content: center;
            .van-icon{
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
    .settlement{
        bottom: 0px !important;
    }
}
.effective-box{
    margin-bottom: 26px;
}
.effective-box-top{
    display: flex;
    padding: 24px;
    justify-content: space-between;
    align-items: center;
    div{
        font-size: 30px;
        font-weight: bold;
        line-height: 30px;
    }
    .left{
        color: #191919;
    }
    .right{
        color: #212034;
    }
    .invalid-color{
        color: #555555;
    }
}
.shopping-cart-page{
    height: calc(100vh - 128px);
    overflow-y: scroll;
    background-color: #F7F7F7;
    padding-bottom: 30px;
    .van-hairline--top:after{
        left: calc(-50% + 28px);
        right: calc(-50% + 28px);
    }
    .shop-info{
        display: flex;
        justify-content: space-between;
        .shop-info-name{
            display: flex;
            align-items: center;
            height: 28px;
            .shop-icon{
                font-size: 30px;
                height: 28px;
                margin-right: 8px;
            }
            .text{
                font-size: 24px;
                font-weight: bold;
                color: #555555;
                margin-right: 8px;
            }
        }
    }
    .empty{
        text-align: center;
        padding-top: 52px;
        padding-bottom: 48px;
        .empty-bg{
            width: 301px;
            height: 202px;
            margin: 0 auto;
            background-image: url('../../assets/menu/menu-search-nodata.png');
            background-size: 100% 100%;
        }
        .empty-tip{
            font-size: 26px;
            font-weight: 400;
            color: #222222;
            margin-top: 77px;
        }
        .van-button{
            margin-top: 40px;
            width: 312px;
            height: 88px;
            background: linear-gradient(270deg, #F16542 0%, #E35A37 100%);
            border-radius: 12px;
        }
    }
    .invalid-box{
        .title{
            margin-bottom:24px;
            font-size: 30px;
            font-weight: bold;
            color: #191919;
            margin-left: 24px;
        }
        .shop-cart{
            margin-bottom: 20px;
        }
    }
    .goods-cart{
        margin: 2px 24px 0;
        background-color: #fff;
        border-radius: 16px;
    }
    :deep(.van-swipe-cell__wrapper){
        position: relative;
    }
    :deep(.van-swipe-cell__right){
        width: 126px;
        height: 160px;
        margin-left: 8px;
        position: absolute;
        top: 50%;
        margin-top: -80px;
    }
    .delete-warp{
        width: 126px;
        height: 160px;
        margin-left: 8px;
        .delete-button {
            width: 100%;
            height: 100%;
            font-size: 36px;
            background: #F16542;
            border-radius: 12px 0px 0px 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            word-break: keep-all;
        }
    }
    .van-checkbox{
        padding: 28px;
        :deep(.van-checkbox__label){
            width: calc(100% - 54px);
        }
        .img-icon{
            width: 38px;
            height: auto;
        }
    }
    .settlement-height{
        width: 100%;
        height: 108px;
        padding-bottom: 36px;
    }
    .settlement{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 96px;
        height: 108px;
        background: #FFFFFF;
        box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        z-index: 5;
        padding-bottom: 36px;
        .van-checkbox{
            padding: 0 24px;
            flex: 1;
        }
        :deep(.van-checkbox__label){
            display: flex;
            align-items: center;
            justify-content: space-between;
            .left{
                font-size: 24px;
                font-weight: 400;
                color: #999999;
                line-height: 24px;
            }
            .right{
                display: flex;
                align-items: center;
                .price{
                    font-size: 40px;
                    font-weight: bold;
                    color: #F16542;
                    margin-right: 30px;
                    .unit{
                        font-size: 26px;
                    }
                }
                .opacity{
                    opacity: 0.5;
                }
                .van-button{
                    border: initial;
                    font-size: 32px;
                    font-weight: bold;
                    color: #FFFFFF;
                    width: 210px;
                    height: 88px;
                    background: #F16642;
                    border-radius: 16px;
                }
            }
        }
    }
}
</style>
