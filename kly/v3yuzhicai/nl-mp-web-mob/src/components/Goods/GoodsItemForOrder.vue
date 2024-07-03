<template>
    <div class="goods-item-order">
        <div class="goods-item-order-image">
            <van-image :src="goods.commodityUrl" radius="7">
                <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                </template>
            </van-image>
        </div>
        <div class="goods-item-order-content">
            <div class="title van-multi-ellipsis--l2">{{goods.commodityName}}</div>
            <div class="price">
                <div class="black">
                    <span class="unit">¥</span><span class="font-din">{{goods.commodityUnitPrice}}</span>
                </div>
                <div class="num">共{{goods.commodityQuantity}}件</div>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    goods: {
        type: Object,
        defualt: () => {}
    }
})
const goods = ref(props.goods)

</script>
<style lang="scss" scoped>
.goods-item-order{
    display: flex;
    padding: 32px 0;
    .goods-item-order-image{
        width: 154px;
        height: 154px;
        margin-right: 24px;
        .van-image{
            width: 100%;
            height: 100%;
        }
    }
    .goods-item-order-content{
        flex: 1;
        .title{
            width: 392px;
            font-size: 28px;
            font-weight: bold;
            color: #222222;
            height: 80px;
        }
        .price{
            margin-top: 20px;
            text-align: right;
            .black{
                font-size: 34px;
                font-weight: bold;
                color: #222222;
                line-height: 34px;
                .unit{
                    font-size: 26px;
                    line-height: 26px;
                }
            }
            .num{
                font-size: 22px;
                font-weight: 400;
                color: #B0B0B0;
                letter-spacing: 1px;
                margin-top: 3px;
            }
        }
    }
}
</style>
