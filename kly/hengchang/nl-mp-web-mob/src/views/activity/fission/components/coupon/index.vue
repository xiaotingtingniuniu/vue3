<template>
    <div class="coupon-container-com">
        <div class="fission-empty empty" v-if="list.length === 0 && props.loading">加载中。。。</div>
        <div class="fission-empty empty" v-if="list.length === 0 && !props.loading">{{ props.emptyText }}</div>
        <div class="coupon-content fx" v-if="list.length === 1">
            <div class="amount" :class="getMoneyClass(list[0].money)">{{ list[0].money }}<span class="unit">{{ list[0].unit }}</span></div>
            <div class="fx-1">
                <div class="text">优惠券</div>
                <div class="desc">{{list[0].couponDoorViewName}}</div>
            </div>
        </div>
        <ul class="coupon-list fx" :class="getListClass()" v-if="list.length >= 2">
            <li class="coupon-item" v-for="(coupon, index) in list" :key="index">
                <div class="text">优惠券</div>
                <div class="amount" :class="getMoneyClass(coupon.money)">{{ coupon.money }}<span class="unit">{{ coupon.unit }}</span></div>
                <div class="desc">{{coupon.couponDoorViewName}}</div>
            </li>
        </ul>
    </div>
</template>
<script setup>

const props = defineProps({
    couponList: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    emptyText: {
        type: String,
        default: '优惠券已发完，无可用优惠券'
    }
})

const list = computed(() => {
    const arr = []
    props.couponList.map(el => {
        if (el.couponMinusViewName) {
            el.money = el.couponMinusViewName.slice(0, el.couponMinusViewName.indexOf(el.couponType === 3 ? '折' : '元'))
            el.unit = el.couponType === 3 ? '折' : '元'
            arr.push(el)
        }
    })
    return arr
})

const getListClass = () => {
    return props.couponList.length === 2 ? ' j-c-s-a margin-unset' : ''
}

const getMoneyClass = (moneyStr) => {
    if (!moneyStr) {
        return
    }
    if (moneyStr.toString().length > 3 && moneyStr.toString().length < 7) {
        return 'font-36'
    } else if (moneyStr.toString().length >= 7) {
        return 'font-28'
    }
}

</script>

<style lang="scss" scoped>
.coupon-container-com {
    .coupon-list {
        // padding-top: 21px;
        overflow-x: scroll;
        height: 179px;
        .coupon-item {
            flex: none;
            margin-right: 34px;
            width: 172px;
            height: 179px;
            background: url('../../../../../assets/activity/fission/coupon-bg.png') no-repeat;
            background-size: 100% 100%;
            text-align: center;
            .text {
                margin-top: 6px;
                height: 30px;
                font-size: 22px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #BC8054;
                line-height: 30px;
            }
            .amount {
                margin-top: 8px;
                height: 63px;
                font-size: 54px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #FF474C;
                line-height: 63px;
                .unit {
                    position: relative;
                    top: -3px;
                    height: 42px;
                    font-size: 30px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #FF474C;
                    line-height: 42px;
                }
            }
            .font-36 {
                font-size: 36px;
            }
            .font-28 {
                font-size: 28px;
            }
            .small-text {
                font-size: 36px;
            }
            .desc {
                margin-top: 25px;
                height: 30px;
                font-size: 22px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #FFFFFF;
                line-height: 30px;
            }
            &:first-child {
                margin-left: 46px;
            }
        }
    }
    .margin-unset .coupon-item {
        margin: unset !important;
    }
    .coupon-content {
        margin-left: 50%;
        transform: translateX(-50%);
        width: 501px;
        height: 168px;
        background: url('../../../../../assets/activity/fission/coupon1-bg.png') no-repeat;
        background-size: 100% 100%;
            .text {
                margin-top: 42px;
                text-align: center;
                height: 45px;
                font-size: 32px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #FFFFFF;
                line-height: 45px;
            }
            .amount {
                width: 217px;
                height: 168px;
                text-align: center;
                line-height: 168px;
                font-size: 58px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #FF474C;
                .unit {
                    position: relative;
                    top: -3px;
                    height: 42px;
                    font-size: 30px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #FF474C;
                    line-height: 42px;
                }
            }
            .font-36 {
                font-size: 36px;
            }
            .font-28 {
                font-size: 30px;
            }
            .desc {
                margin-top: 9px;
                height: 30px;
                font-size: 22px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                line-height: 30px;
                text-align: center;
            }
    }
}
</style>
