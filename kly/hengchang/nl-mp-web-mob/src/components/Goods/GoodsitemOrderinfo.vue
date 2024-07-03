<template>
    <div class="goods-item--3">
        <div class="goods-item--3-image">
            <van-image :src="goodsInfo.skuUrl" radius="7">
                <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                </template>
            </van-image>
        </div>
        <div class="goods-item--3-content">
            <div class="title van-multi-ellipsis--l2">{{goodsInfo.skuName}}</div>
            <div class="price">
                <div class="black">
                    <span class="unit">¥</span><span class="font-din">{{ goodsInfo.realPrice ? (goodsInfo.realPrice / 100).toFixed(2) :  (goodsInfo.price / 100).toFixed(2)}}</span> <span><van-icon name="cross" /><span class="count">{{goodsInfo.quantity ? goodsInfo.quantity : goodsInfo.actQuantity}}</span></span>
                </div>
                <div class="result" v-if="goodsInfo.skuRefundStatus && goodsInfo.skuRefundStatus !== 1"><div :class="goodsInfo.skuRefundStatus === 3 ? 'result-success' : 'result-fail'">{{goodsInfo.skuRefundStatus === 3 ? '已同意' : goodsInfo.skuRefundStatus === 2 ? '待退款' : '已拒绝' }}</div></div>
                <div class="colour">
                    <div class="unit">¥</div>
                    <div class="font-din">{{goodsInfo.realPrice ? ((goodsInfo.realPrice / 100).toFixed(2) * goodsInfo.quantity).toFixed(2) : ((goodsInfo.price / 100).toFixed(2) * goodsInfo.actQuantity).toFixed(2)}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    goodsInfo: {
        type: Object,
        default: () => {}
    },
    index: {
        type: Number || null,
        default: null
    },
    sales: {
        type: Boolean,
        default: false
    }
})
const goodsInfo = ref(props.goodsInfo)
watch(() => [props.goodsInfo], (newVal, oldVal) => {
    goodsInfo.value = newVal[0]
})

</script>
<style lang="scss" scoped>
.goods-item--3{
    display: flex;
    padding: 32px 0;
    .goods-item--3-image{
        width: 154px;
        height: 154px;
        margin-right: 24px;
        .van-image{
            width: 100%;
            height: 100%;
        }
    }
    .goods-item--3-content{
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title{
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #222222;
            line-height: 40px;
        }
        .price{
            display: flex;
            margin-top: 40px;
            align-items: center;
            justify-content: space-between;
            .black{
                font-size: 34px;
                font-weight: bold;
                color: #222222;
                line-height: 34px;
                .count{
                    font-size: 28px;
                }
                .unit{
                    font-size: 26px;
                    line-height: 26px;
                }
                .van-icon{
                    font-size: 24px;
                    font-weight: bold;
                }
            }
            .result{
                flex: 1;
                .result-success{
                    width: 76px;
                    height: 34px;
                    line-height: 34px;
                    padding: 0px 8px;
                    border-radius: 6px;
                    margin-left: 20px;
                    text-align: center;
                    background-color: rgba(153, 153, 153, 0.08);
                    color: #999999;
                    font-size: 20px;
                }
                .result-fail{
                    width: 76px;
                    height: 34px;
                    line-height: 34px;
                    padding: 0px 8px;
                    border-radius: 6px;
                    margin-left: 20px;
                    text-align: center;
                    background-color: #FFF5F2;
                    color: #F68033;
                    font-size: 20px;
                }
            }
            .colour{
                font-size: 34px;
                font-weight: bold;
                color: #F16542;
                line-height: 34px;
                display: flex;
                align-items: baseline;
                .unit{
                    font-size: 26px;
                    line-height: 26px;
                }
            }
        }
    }
}
</style>
