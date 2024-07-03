<template>
    <div class="goods-item--3">
        <div class="goods-item--3-image">
            <van-image :src="goodsInfo.commodityUrl" radius="7">
                <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                </template>
            </van-image>
        </div>
        <div class="goods-item--3-content">
            <div class="title van-multi-ellipsis--l2">{{goodsInfo.commodityName}}</div>
            <div class="price">
                <div class="black">
                    <span class="unit">¥</span><span class="font-din">{{goodsInfo.commodityUnitPrice}}</span> <span><van-icon name="cross" /><span class="count">{{goodsInfo.commodityQuantity}}</span></span>
                </div>
                <div class="colour">
                    <span class="unit">¥</span><span class="font-din">{{(goodsInfo.commodityUnitPrice * goodsInfo.commodityQuantity).toFixed(2)}}</span>
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
            align-items: flex-end;
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
            .colour{
                font-size: 34px;
                font-weight: bold;
                color: #F16542;
                line-height: 34px;
                .unit{
                    font-size: 26px;
                    line-height: 26px;
                }
                .font-din{
                   color: #F16542 !important;
                }
            }
        }
    }
}
</style>
