<template>
    <div class="boot-upgrade-area">
        <van-nav-bar v-if="$route.query.rName==='myGoods' || $route.query.rName==='collect-money-setting'" title="标品化升级" fixed placeholder :border="false" @click-left="closePage">
            <template #left>
                <van-image :src="require('@/assets/back-icon-order.png')"/>
            </template>
        </van-nav-bar>
        <template v-if="merchantSourceType===8">
            <div class="boot-upgrade-page">
                <div class="content">
                    <div class="content-title">尊敬的用户，您好！</div>
                    <div class="text">为提升智能货柜的算法识别准确度，减少异常订单，提升服务体验。“公共商品库”、“我的商品库”、“设备商品”将进行标品化服务。</div>
                    <div class="text">若您售卖的商品库<span>未标品化，将影响用户购物时的商品识别，造成货损。</span></div>
                    <div class="text">通过系统智能检测，您当前的“设备商品”标品化检测结果如下：</div>
                    <div class="box">
                        <div class="box-title">设备商品：</div>
                        <div class="label">标品化匹配成功：<span>{{ skuMatchCount }}</span>个商品</div>
                        <div class="label">标品化无法匹配：<span>{{ skuNoMatchCount }}</span>个商品</div>
                    </div>
                    <div class="text">请您查阅以上信息，点击【标品化升级】按钮，完成标品化匹配确认。</div>
                    <div class="text">祝您生意兴隆！</div>
                </div>
                <div class="button-box"><van-button @click="outskuMovementFn()">标品化升级</van-button></div>
                <div class="button-height"></div>
                <div class="float-icon">
                    <van-image :src="require('@/assets/guide/float-icon.png')" />
                </div>
            </div>
        </template>
        <template v-else>
            <div class="load-box">
                <van-circle v-model:current-rate="currentRate" :rate="15" size="80px" color="#FE7E41" layer-color="#EDEDED" :stroke-width="60" text="宽度定制">
                    <template #default>
                        <div class="slot">
                            <van-image :src="require('@/assets/guide/logo.png')"/>
                        </div>
                    </template>
                </van-circle>
                <div class="tip">标品化升级中…</div>
            </div>
        </template>
    </div>
</template>
<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { outskuStatistic, outskuMovement, merchantSource } from '@/api/goods-transfer'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { closePage } from '@/utils/composables'

const currentRate = ref(0)
const route = useRoute()
const router = useRouter()
const store = useStore()
const merchantId = computed(() => store.state.userInfo.merchantId)
const merchantName = computed(() => store.state.userInfo.merchantName)
const token = computed(() => store.state.token)
// 迁移状态 1：平台入驻，2：商户添加，3: 后台添加，4: 恒掌柜增量，5: 恒掌柜存量，6: 供应链迁移，7: 众包迁移，8: 619迁移状态待执行，9:619迁移状态进行中 10: 619迁移状态执行完成
const merchantSourceType = ref()
// 迁移完成跳转的页面
const rName = route.query.rName
onBeforeMount(() => {
    merchantSourceType.value = Number(route.query.merchantSource)
    if (merchantSourceType.value === 8) {
        outskuStatisticFn()
    }
})

// 查询标品化的商品数量
const skuMatchCount = ref(0)
const skuNoMatchCount = ref(0)
const outskuStatisticFn = async () => {
    const res = await outskuStatistic({
        merchantId: merchantId.value
    })
    if (res.code !== '200') return false
    skuMatchCount.value = res.skuMatchCount
    skuNoMatchCount.value = res.skuNoMatchCount
}

// 开始迁移
const outskuMovementFn = async () => {
    const res = await outskuMovement({
        merchantId: merchantId.value,
        merchantName: merchantName.value,
        token: token.value
    })
    if (res.code !== '200') return false
    merchantSourceFn()
}

const merchantSourceFn = async () => {
    const res = await merchantSource({
        appKey: 'A1001002',
        busiCode: 'A1001002',
        busiMerchantIdList: [merchantId.value]
    })
    if (res.code !== '200') return false
    merchantSourceType.value = res.list[0].merchantSource
    if (res.list[0].merchantSource === 9) {
        setTimeout(() => {
            merchantSourceFn()
        }, 3000)
    } else if (res.list[0].merchantSource === 10) {
        router.replace({
            name: rName
        })
    }
}

</script>
<style lang="scss" scoped>
.boot-upgrade-area{
    .van-nav-bar__placeholder{
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            .van-nav-bar__left{
                .van-image{
                    width: 19px;
                    height: 31px;
                }
            }
            .van-nav-bar__title{
                font-size: 36px;
            }
        }
    }
}
.boot-upgrade-page{
    min-height: calc(100vh - 38px);
    padding-top: 38px;
    background: linear-gradient(360deg, rgba(255, 181, 118, 0) 0%, #FE7E41 100%);
    position: relative;
    .float-icon{
        position: absolute;
        top: 0;
        right: 20px;
        width: 334px;
        height: 294px;
    }
    .content{
        margin: 0 20px;
        padding: 78px 40px 60px;
        background-color: #fff;
        border-radius: 24px;
        .content-title{
            font-size: 32px;
            font-weight: 500;
            color: #191919;
            background-image: url('../../assets/guide/title-bar.png');
            background-repeat: no-repeat;
            background-size: 140px 16px;
            background-position: 0 28px;
        }
        .text{
            margin-top: 20px;
            font-size: 28px;
            font-weight: 400;
            color: #191919;
            span{
                color: #FE7E41;
            }
        }
        .box{
            background: linear-gradient(270deg, #FFFAF8 0%, #FFF4EE 100%);
            border-radius: 16px;
            border: 2px solid #FFF4EE;
            padding: 24px 30px 28px;
            margin-top: 20px;
            .box-title{
                font-size: 32px;
                font-weight: 500;
                color: #191919;
            }
            .label{
                margin-top: 6px;
                font-size: 28px;
                font-weight: 400;
                color: #191919;
                span{
                    color: #FE7E41;
                }
            }
        }
    }
    .button-box{
        position: fixed;
        bottom: 20px;
        left: 60px;
        right: 60px;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
        .van-button{
            width: 100%;
            height: 92px;
            background: linear-gradient(90deg, #FE7E41 0%, #FF5D0F 100%, #FF5C0E 100%);
            box-shadow: 0px 8px 16px 0px rgba(231, 77, 9, 0.2);
            border-radius: 46px;
            font-size: 30px;
            font-weight: 500;
            color: #FFFFFF;
        }
    }
    .button-height{
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
    }
}
.load-box{
    text-align: center;
    padding-top: 320px;
    .van-circle{
        :deep(svg){
            animation: rotateAnimat 2s linear;
            animation-iteration-count: infinite;
        }
    }
    @keyframes rotateAnimat {
        0% {
            transform: rotate(0deg);
            -webkit-transform: rotate(0deg);
        }
        25% {
            transform: rotate(90deg);
            -webkit-transform: rotate(90deg);
        }
        50% {
            transform: rotate(180deg);
            -webkit-transform: rotate(180deg);
        }
        75% {
            transform: rotate(270deg);
            -webkit-transform: rotate(270deg);
        }
        100% {
            transform: rotate(360deg);
            -webkit-transform: rotate(360deg);
        }
    }
    .van-circle{
        .slot{
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            .van-image{
                width: 96px;
                height: 24px;
            }
        }
    }
    .tip{
        font-size: 32px;
        font-weight: 400;
        color: #191919;
        margin-top: 56px;
    }
}
</style>
