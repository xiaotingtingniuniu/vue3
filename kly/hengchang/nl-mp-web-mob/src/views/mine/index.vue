<template>
    <div class="my">
        <div class="my-content">
            <router-link :to="{ name: userInfo ? 'setting' : 'login' }" custom v-slot="{ navigate }">
                <div @click="navigate">
                    <div class="content-setting">
                        <span class="content-bg"></span>
                    </div>
                </div>
            </router-link>
            <div class="content-login">
                <router-link v-if="!userInfo" :to="{ name: 'login' }" custom v-slot="{ navigate }">
                    <div @click="navigate" class="login-bg login-bg--no"></div>
                    <div @click="navigate" class="login-btn login-no">
                        <div>立即登录</div>
                        <van-icon :name="require('@/assets/mine/login-arrow.png')" size="18px" />
                    </div>
                </router-link>
                <router-link v-else :to="{ name: 'personal' }" custom v-slot="{ navigate }">
                    <div class="login-bg login-bg--on" @click="navigate"></div>
                    <div class="login-btn" @click="navigate">{{ userInfo.nickname }}</div>
                </router-link>
            </div>
            <div class="content-order">
                <div class="my-order">
                    <router-link :to="{name: userInfo ? 'order-list' : 'login', params: { active: 0 }}" custom v-slot="{ navigate }">
                        <div @click="navigate">我的订单</div>
                        <div @click="navigate" class="allOrder">全部订单<van-icon name="arrow" /></div>
                    </router-link>
                </div>
                <div class="order-list">
                    <template v-for="(item, index) in orderObj" :key="index">
                        <router-link :to="{ name: userInfo ? 'order-list' : 'login', params: {active: item.orderStatus} }" custom v-slot="{ navigate }">
                            <div class="payment-status" @click="navigate">
                                <div class="payment-pay">
                                    <van-badge>
                                        <div class="icon--unselect">
                                            <van-icon size="1em" :name="item.url" />
                                        </div>
                                    </van-badge>
                                </div>
                                <div>{{ item.label }}</div>
                            </div>
                        </router-link>
                    </template>
                </div>
            </div>
            <div class="content-list">
                <router-link v-if="!userInfo" :to="{ name: 'login' }" custom v-slot="{ navigate }">
                    <div class="coupon" @click="navigate">
                        <div class="coupon-discount"></div>
                        <div class="text">我的优惠券</div>
                        <van-icon name="arrow" />
                    </div>
                </router-link>
                <router-link v-else :to="{ name: 'mine-coupon' }" custom v-slot="{ navigate }">
                    <div class="coupon" @click="navigate">
                        <div class="coupon-discount"></div>
                        <div class="text">我的优惠券</div>
                        <van-icon name="arrow" />
                    </div>
                </router-link>
                <router-link v-if="!userInfo" :to="{ name: 'login' }" custom v-slot="{ navigate }">
                    <div class="coupon" @click="navigate">
                        <div class="coupon-phone"></div>
                        <div class="text">联系我们</div>
                        <a class="phone" href="tel:400-085-5858">400-085-5858</a>
                    </div>
                </router-link>
                <div class="coupon" v-else>
                    <div class="coupon-phone"></div>
                    <div class="text">联系我们</div>
                    <a class="phone" href="tel:400-085-5858">400-085-5858</a>
                </div>
                <router-link v-if="!userInfo" :to="{ name: 'login' }" custom v-slot="{ navigate }">
                    <div class="coupon" @click="navigate">
                        <div class="coupon-online"></div>
                        <div class="text">在线客服</div>
                        <van-icon name="arrow" />
                    </div>
                </router-link>
                <div class="coupon" v-else>
                    <div class="coupon-online"></div>
                    <div class="text">在线客服</div>
                    <a class="phone" href="https://ccenter.hengchang6.com/webchat/app_chat?sysid=35&channel=9934"><van-icon name="arrow" /></a>
                </div>
            </div>
            <div class="content-logo"></div>
        </div>
    </div>
</template>
<script setup>
// badge 内容暂时不展示 先注释 2022/05/16 15:43:00
// import { orderCount } from '@/api/order'
import { mineOrderObj } from '@/utils/order'
import { onBeforeRouteLeave } from 'vue-router'

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const orderObj = ref(mineOrderObj)

onBeforeRouteLeave((to) => {
    // 禁止返回到注销页面
    if (to.name === 'cancellation-verification') {
        return false
    }
})

// badge 内容暂时不展示 先注释 2022/05/16 15:43:00 --start
// onMounted(() => {
//     if (userInfo.value) orderCountFn()
// })
// watchEffect(() => {
//     if (!userInfo.value) {
//         orderObj.value.map((item) => {
//             item.badgeCount = 0
//         })
//     }
// })

// const orderCountFn = async () => {
//     const { code, data } = await orderCount()
//     if (code === 200) {
//         orderObj.value.map((item) => {
//             item.badgeCount = data[item.key]
//         })
//     }
// }
// badge 内容暂时不展示 先注释 2022/05/16 15:43:00 --end

</script>
<style lang="scss" scoped>
.my{
    min-height: calc(100vh - 148px);
    background-image: url('../../assets/mine/mine-bg.png');
    background-size: contain;
    background-repeat: no-repeat;
    .my-content{
        width: 702px;
        vertical-align: auto;
        margin: 0 auto;
        .content-setting{
            padding-top: 80px;
            .content-bg{
                float: right;
                width: 48px;
                height: 48px;
                background-image: url('../../assets/mine/set.png');
                background-size: contain;
                background-repeat: no-repeat;
            }
        }
        .content-login{
            padding: 50px 0px;
            display: flex;
            align-items: center;
            .login-bg{
                width: 100px;
                height: 100px;
                border-radius: 50px;
            }
            .login-bg--on {
                background-image: url('../../assets/mine/headportrait.png');
                background-size: contain;
                background-repeat: no-repeat;
            }
            .login-bg--no {
                background-image: url('../../assets/mine/unloginpic.png');
                background-size: contain;
                background-repeat: no-repeat;
            }
            .van-image{
                width: 100px;
                height: 100px;
                border-radius: 50px;
                overflow: hidden;
            }
            .login-no{
                display: flex;
                align-items: center;
            }
            .login-btn{
                flex: 1;
                font-weight: bold;
                margin-left: 10px;
            }
            .login-btn{
                font-size: 36px;
                color: #222222;
                letter-spacing: 0;
                font-weight: bold;
            }
        }
        .content-order{
            background-color: white;
            border-radius: 16px;
            padding: 30px 28px;
            .my-order{
                font-size: 26px;
                color: #222222;
                display: flex;
                justify-content: space-between;
                font-weight: bold;
                .allOrder{
                    color: #999999;
                    font-weight: 400;
                    color: #999999;
                }
            }
            .order-list{
                display: flex;
                font-size: 26px;
                margin-top: 30px;
                color: #222222;
                justify-content: space-between;
                .payment-status{
                    width: max-content;
                    text-align: center;
                    font-size: 26px;
                    font-weight: 400;
                    color: #222222;
                    .payment-pay{
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        margin-bottom: 12px;
                        .icon--unselect{
                            font-size: 70px;
                        }
                    }
                }
            }
        }
        .content-list{
            margin-top: 20px;
            border-radius: 16px;
            background-color: white;
            .coupon{
                height: 100px;
                width: 95%;
                margin: 0 auto;
                display: flex;
                align-items: center;
                font-size: PingFangSC-Regular;
                font-size: 30px;
                color: #222222;
                font-weight: 400;
                border-bottom: 1px solid  #EEEEEE;
                .van-icon{
                    color: #999999;
                    font-size: 14px;
                }
                .text{
                    flex: 1;
                    padding-left: 20px;
                }
                .coupon-discount{
                    width: 38px;
                    height: 38px;
                    background-image: url('../../assets/mine/discount1.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                }
                .coupon-phone{
                    width: 38px;
                    height: 38px;
                    background-image: url('../../assets/mine/phoneBubble.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                }
                .coupon-online{
                    width: 38px;
                    height: 38px;
                    background-image: url('../../assets/mine/onlineservice1.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                }
                .phone{
                    font-size: 26px;
                    font-weight: 400;
                    color: #999999;
                }
            }
        }
    }
}
</style>
