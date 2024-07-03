<template>
    <div class="coupon-box" :class="isApp ? 'status-bar-height' : ''">
        <van-nav-bar v-if="isApp" fixed placeholder :title="$route.meta.title" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="pageBack">
                    <van-image :src="require('@/assets/order/back-icon-order.png')"/>
                </div>
            </template>
            <template #right>
                <div class="redeemcoupon" @click="couponclick">
                    <div>兑换优惠券</div>
                </div>
            </template>
        </van-nav-bar>
        <div class="coupon-container">
            <van-tabs v-model:active="active" title-inactive-color="#999999" title-active-color="#222222" background="#f7f7f7" class="tabs-title">
                <van-tab title="未使用">
                    <template v-if="availablelist.length">
                        <div class="coupomn" v-for="(item, index) in availablelist" :key="index">
                            <div class="coupomn-type" v-if="item.goodsRangeType === 1">全品类通用</div>
                            <div class="coupomn-type part" v-else-if="item.goodsRangeType === 2">限部分品类可用</div>
                            <div class="coupomn-type part" v-else>部分商品</div>
                            <div class="coupomn-box">
                                <div class="coupon-box-canleft">
                                    <div>
                                        <div class="price" v-if="item.couponType === 3">{{ item.couponMinusViewName.slice(0, item.couponMinusViewName.indexOf('折')) }}<span>折</span></div>
                                        <div class="price" v-else><span>¥</span>{{ item.couponMinusViewName.slice(0, item.couponMinusViewName.indexOf('元')) }}</div>
                                        <div class="name" v-if="item.couponType === 2">{{ item.couponViewName.slice(0, item.couponViewName.indexOf('减') + 1) }}</div>
                                        <div class="name" v-else>无门槛</div>
                                    </div>
                                </div>
                                <div class="coupon-box-canright">
                                    <div class="flex-bar">
                                        <div class="title" v-if="item.couponType === 1">立减券</div>
                                        <div class="title" v-else-if="item.couponType === 2">满减券</div>
                                        <div class="title" v-else>折扣券</div>
                                        <van-button @click="availableBtn(item)">去使用</van-button>
                                    </div>
                                    <div class="coupon-data">有效期： {{item.useBeginDate}} 至 {{item.useEndDate}}</div>
                                    <div class="coupon-data coupon-rule" @click="ruleShow(index)">使用规则
                                        <van-icon name="arrow-up" v-if="isruleshow  && isindex === index" />
                                        <van-icon name="arrow-down" v-else/>
                                    </div>
                                    <div v-if="isruleshow  && isindex === index">
                                        <ul v-for="(itm, idx) in item.couponDesc" :key="idx">
                                            <li>{{itm}}</li>
                                        </ul>
                                    </div>
                                    <!-- <ul v-if="isruleshow  && isindex === index" v-for="(itm, idx) in item.couponDesc" :key="idx">
                                        <li>{{item.couponDesc}}</li>
                                    </ul> -->
                                </div>
                            </div>
                        </div>
                    </template>
                </van-tab>
                <van-tab title="已使用">
                    <template v-if="usedlist.length">
                        <div class="no-coupomn-box" v-for="item in usedlist" :key="item">
                            <div class="coupomn-type" v-if="item.goodsRangeType === 1">全品类通用</div>
                            <div class="coupomn-type part" v-else-if="item.goodsRangeType === 2">限部分品类可用</div>
                            <div class="coupomn-type part" v-else>部分商品</div>
                            <div class="coupomn-box-context">
                                <div class="coupon-box-nocanleft">
                                    <div>
                                        <div class="price" v-if="item.couponType === 3">{{ item.couponMinusViewName.slice(0, item.couponMinusViewName.indexOf('折')) }}<span>折</span></div>
                                        <div class="price" v-else><span>¥</span>{{ item.couponMinusViewName.slice(0, item.couponMinusViewName.indexOf('元')) }}</div>
                                        <div class="name" v-if="item.couponType === 2">{{ item.couponViewName.slice(0, item.couponViewName.indexOf('减') + 1) }}</div>
                                        <div class="name" v-else>无门槛</div>
                                    </div>
                                </div>
                                <div class="coupon-box-nocanright">
                                    <div class="flex-bar">
                                        <div class="title" v-if="item.couponType === 1">立减券</div>
                                        <div class="title" v-else-if="item.couponType === 2">满减券</div>
                                        <div class="title" v-else>折扣券</div>
                                        <div class="img-box">
                                            <img src="../../assets/images/used.png"/>
                                        </div>
                                    </div>
                                    <div class="coupon-data">有效期： {{item.useBeginDate}} 至 {{item.useEndDate}}</div>
                                    <div class="coupon-data coupon-rule">使用规则
                                        <van-icon name="arrow-up" />
                                    </div>
                                    <ul v-for="(itm, idx) in item.couponDesc" :key="idx">
                                        <li>{{itm}}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </template>
                </van-tab>
                <van-tab title="已失效">
                    <template v-if="invalidlist.length">
                        <div class="no-coupomn-box" v-for="(item,index) in invalidlist" :key="index">
                            <div class="coupomn-type" v-if="item.goodsRangeType === 1">全品类通用</div>
                            <div class="coupomn-type part" v-else-if="item.goodsRangeType === 2">限部分品类可用</div>
                            <div class="coupomn-type part" v-else>部分商品</div>
                            <div class="coupomn-box-context">
                                <div class="coupon-box-nocanleft">
                                    <div>
                                        <div class="price" v-if="item.couponType === 3">{{ item.couponMinusViewName.slice(0, item.couponMinusViewName.indexOf('折')) }}<span>折</span></div>
                                        <div class="price" v-else><span>¥</span>{{ item.couponMinusViewName.slice(0, item.couponMinusViewName.indexOf('元')) }}</div>
                                        <div class="name" v-if="item.couponType === 2">{{ item.couponViewName.slice(0, item.couponViewName.indexOf('减') + 1) }}</div>
                                        <div class="name" v-else>无门槛</div>
                                    </div>
                                </div>
                                <div class="coupon-box-nocanright">
                                    <div class="flex-bar">
                                        <div class="title" v-if="item.couponType === 1">立减券</div>
                                        <div class="title" v-else-if="item.couponType === 2">满减券</div>
                                        <div class="title" v-else>折扣券</div>
                                        <div class="img-box">
                                            <img src="../../assets/images/invalid.png"/>
                                        </div>
                                    </div>
                                    <div class="coupon-data">有效期： {{item.useBeginDate}} 至 {{item.useEndDate}}</div>
                                    <div class="coupon-data coupon-rule">使用规则
                                        <van-icon name="arrow-up" />
                                    </div>
                                    <ul v-for="(itm, idx) in item.couponDesc" :key="idx">
                                        <li>{{itm}}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </template>
                </van-tab>
                <van-tab title="兑换" v-if="!isApp">
                    <div class="exchange">
                        <van-cell-group inset>
                            <van-field v-model="exchangeCodde" label="" placeholder="请输入兑换码" left-icon="scan" @click-left-icon="couponCdkeyeFn" clearable/>
                        </van-cell-group>
                    </div>
                    <div class="button">
                        <van-button round color="#F16642" @click="exChangeFn">兑换</van-button>
                    </div>
                </van-tab>
            </van-tabs>
        </div>

    </div>
</template>
<script setup>
import { drawoneCoupon, receivedCoupon, usedCoupon, invalidCoupon } from '../../api/coupon/index'
import { isApp } from '@/utils'
import { appBridge } from '@/utils/bridge'
import { pageBack, couponCdkeyeFn, pageGo } from '@/utils/composables'
import { Toast } from 'vant'
import Dialog from '@/components/Dialog'

const router = useRouter()
const active = ref('')
const availablelist = ref([])
const usedlist = ref([])
const invalidlist = ref([])
const store = useStore()
const token = computed(() => store.state.token)
const exchangeCodde = ref('')

onMounted(() => {
    watch([token, active], () => {
        if (token.value) {
            if (active.value === 0) return receivedCouponList()
            if (active.value === 1) return userdCouponList()
            if (active.value === 2) return invalidCouponList()
        }
    })
    if (token.value) {
        receivedCouponList()
    }
})

const receivedCouponList = async () => {
    const data = await receivedCoupon()
    if (data) {
        data.map(item => {
            item.couponDesc = item.couponDesc.split('\n')
        })
    }
    availablelist.value = data || []
}
const userdCouponList = async () => {
    const data = await usedCoupon()
    if (data) {
        data.map(item => {
            item.couponDesc = item.couponDesc.split('\n')
        })
    }
    usedlist.value = data || []
}
const invalidCouponList = async () => {
    const params = {
        busiCode: '',
        orderNo: ''
    }
    const data = await invalidCoupon(params)
    if (data.length !== 0) {
        data.map(item => {
            item.couponDesc = item.couponDesc.split('\n')
        })
    }
    invalidlist.value = data || []
}
const availableBtn = val => {
    if (isApp) return appBridge('useCoupon')
    router.push({ name: 'home' })
}
const exChangeFn = async () => {
    if (exchangeCodde.value === '') return Toast('请输入兑换码')
    const params = {
        shopCode: JSON.parse(sessionStorage.getItem('optimalStore')) ? JSON.parse(sessionStorage.getItem('optimalStore')).id : '',
        cdkey: exchangeCodde.value
    }
    const { code, msg } = await drawoneCoupon(params)
    if (code === 200) {
        Dialog({
            title: '兑换优惠券成功',
            right: '查看优惠券',
            showLeftButton: false
        }).then(async () => {
            await receivedCouponList()
            active.value = 0
        })
    } else {
        Dialog({
            title: '兑换优惠券失败',
            message: msg,
            showLeftButton: false
        })
    }
}
const isruleshow = ref(false)
const isindex = ref(0)
const ruleShow = (index) => {
    console.log(index)
    isruleshow.value = !isruleshow.value
    isindex.value = index
}
const couponclick = () => {
    pageGo('/coupon/redeem-coupon')
}
</script>
<style lang="scss" scoped>
.status-bar-height{
    .van-nav-bar__placeholder{
        height: calc(92px + var(--van-status-bar-height)) !important;
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            background-color: #fff;
            z-index: 1000;
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
}
.coupon-box{
    min-height: calc(100vh - 30px - var(--van-status-bar-height));
    background: #F7F7F7;
    padding-bottom: 30px;
    .redeemcoupon{
        color: #222;
        font-size: 30px;
    }
    .coupon-container{
        .tabs-title{
            :deep(.van-tab){
                font-size: 34px;
                font-weight: 400;
                color: #999999;
            }
            :deep(.van-tab--active){
                font-weight: bold !important;
            }
            :deep(.van-tabs__line){
                width: 50px;
                height: 6px;
                background: linear-gradient(90deg, #FB5A3B 0%, #FC9753 100%);
            }
        }
        .coupomn{
            background-image: url('../../assets/images/coupon-bg.png');
            background-size: 100% 100%;
            margin: 24px 24px 0;
            position: relative;
            .coupomn-type{
                padding: 0px 10px;
                height: 36px;
                line-height: 36px;
                text-align: center;
                font-size: 20px;
                color: #fff;
                background-color: #F16542;
                border-radius: 16px 0px;
                position: absolute;
                top: 0;
                left: 0;
            }
            .part{
                background-color: #F19E42;
            }
        }
        .coupomn-box{
            // background-image: url('../../assets/images/coupon-bg.png');
            // background-size: 100% 100%;
            display: flex;
            padding: 30px 30px 30px 0;
            // margin: 24px 24px 0;
            .coupon-box-canleft{
                width: 190px;
                color: #F16542;
                flex-wrap: wrap;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                .price{
                    font-size: 58px;
                    line-height: 58px;
                    font-weight: bold;
                    color: #F16542;
                    text-align: center;
                    span{
                        font-size: 28px;
                    }
                }
                .name{
                    font-size: 26px;
                    font-weight: 400;
                    color: #F16542;
                    line-height: 26px;
                    margin-top: 3px;
                    text-align: center;
                }
            }

            .coupon-box-canright{
                flex: 1;
                margin-left: 36px;
                .flex-bar{
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    .title{
                        font-size: 30px;
                        font-weight: bold;
                        color: #222222;
                        line-height: 30px;
                    }
                    .van-button{
                        width: 110px;
                        height: 60px;
                        background: #F16542;
                        border-radius: 16px;
                        font-size: 24px;
                        font-weight: bold;
                        border: initial;
                        word-break: keep-all;
                        color: #FFFFFF;
                    }
                    .img-box{
                            width: 92px;
                            height: 92px;
                            display: block;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
                ul{
                    li{
                        font-size: 24px;
                        font-weight: 400;
                        color: #999999;
                        line-height: 24px;
                        margin-bottom: 10px;
                    }
                }
                .coupon-data{
                    font-size: 20px;
                    color: #999999;
                    margin-top: 12px;
                }
                .coupon-rule{
                    // margin-top: 40px;
                    font-size: 24px;
                    margin: 41px 0px 14px 0px;
                }
            }

        }

        .no-coupomn-box{
            background-image: url('../../assets/images/coupon-bg.png');
            background-size: 100% 100%;
            display: flex;
            padding: 30px 30px 30px 0;
            margin: 24px 24px 0;
            position: relative;
            .coupomn-type{
                padding: 0px 10px;
                height: 36px;
                line-height: 36px;
                text-align: center;
                font-size: 20px;
                color: #fff;
                background-color: #CCCCCC;
                border-radius: 16px 0px;
                position: absolute;
                top: 0;
                left: 0;
            }
            // .part{
            //     background-color: #F19E42;
            // }
            .coupomn-box-context{
                display: flex;
            }
             .coupon-box-nocanleft{
                width: 190px;
                color: #CCCCCC;
                flex-wrap: wrap;
                display: flex;
                align-items: center;
                justify-content: center;
                .price{
                    font-size: 58px;
                    line-height: 58px;
                    font-weight: bold;
                    text-align: center;
                    span{
                        font-size: 28px;
                    }
                }
                .name{
                    font-size: 26px;
                    font-weight: 400;
                    line-height: 26px;
                    margin-top: 3px;
                    text-align: center;
                }

            }
            .coupon-box-nocanright{
                flex: 1;
                margin-left: 36px;
                color: #ccc;
                 .flex-bar{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .title{
                        font-size: 30px;
                        font-weight: bold;
                        line-height: 30px;
                    }
                    .img-box{
                            width: 92px;
                            height: 92px;
                            position: absolute;
                            top: 16px;
                            right: 28px;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
                ul{
                    li{
                        font-size: 24px;
                        font-weight: 400;
                        line-height: 24px;
                        margin-bottom: 10px;
                    }
                }
                .coupon-data{
                    font-size: 20px;
                    margin-top: 12px;
                }
                .coupon-rule{
                    // margin-top: 40px;
                    font-size: 24px;
                    margin: 41px 0px 14px 0px;
                }
            }
        }
    }
    .exchange{
        margin: 30px 24px;
        height: 118px;
        border-radius: 16px;
        background-color: #fff;
        font-size: 30px;
        padding-top: 30px;
        :deep(.van-cell-group){
            width: 626px;
            margin: 0 auto;
            border: 1px solid #FAFAFA;
            // padding-top: 30px;
            .van-cell{
                background-color: #FAFAFA;
            }
        }
        :deep(.van-cell-group):hover{
            border: 1px solid #F16542;
        }
        :deep(.van-field__body){
            margin-left: 30px;
        }
        :deep(.van-field__left-icon){
            margin-right: 30px;
        }
        :deep(.van-field__left-icon .van-icon){
            font-size: 40px;
        }
        :deep(.van-field__body)::after{
            border-left-width: 1px !important;
            position: absolute;
            box-sizing: border-box;
            content: " ";
            pointer-events: none;
            top: -50%;
            right: -50%;
            bottom: -50%;
            left: -50%;
            border: 0 solid #979797;
            transform: scale(.5);
        }
    }
    .button{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 66px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.333333vw 3.2vw;
        box-shadow: 0px 1px 0px 0px #f5f5f5;
        .van-button{
            width: 100%;
            height: 88px;
            background: #F16642;
            border-radius: 16px;
            font-size: 32px;
            font-weight: bold;
            color: #FFFFFF;
        }
    }
}
</style>
