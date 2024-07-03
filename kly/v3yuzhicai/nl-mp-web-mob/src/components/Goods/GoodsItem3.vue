<template>
    <div class="goods-item--3">
        <div class="goods-item--3-image">
            <van-image :src="goods.logo" radius="7">
                <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                </template>
            </van-image>
        </div>
        <div class="goods-item--3-content">
            <div class="title van-multi-ellipsis--l2">{{goods.name}}</div>
            <!-- <div class="discount">
                <div class="discount-icon"></div>
                <div class="discount-title">满20减5</div>
            </div> -->
            <div class="price">
                <div class="black">
                    <span class="unit">¥</span><span class="font-din">{{goods.sellPrice}}</span> <span class="cross"><van-icon name="cross" />{{goods.quantity}}</span>
                </div>
                <div class="colour">
                    <span class="unit">¥</span><span class="font-din">{{goods.amtSum}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    goods: {
        type: Object,
        default: () => {}
    }
})
const goods = ref(props.goods)
watch(() => [props.goods], (newVal, oldVal) => {
    goods.value = newVal[0]
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
        .title{
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #222222;
            line-height: 40px;
        }
        .discount{
            margin: 30px 0;
            height: 34px;
            display: flex;
            align-items: center;
            .discount-icon{
                width: 22px;
                height: 22px;
                background-image: url('../../assets/home/coupon1.png');
                background-size: contain;
                background-repeat: no-repeat;
            }
            .discount-title{
                // height: 34px;
                color: #F68033;
                font-size: 20px;
                background-color: #FFF5F2;
                padding: 3px 8px;
            }
        }
        .price{
            display: flex;
            margin-top: 64px;
            align-items: flex-end;
            justify-content: space-between;
            .black{
                font-size: 34px;
                font-weight: bold;
                color: #222222;
                line-height: 34px;
                .unit{
                    font-size: 26px;
                    line-height: 26px;
                }
                .van-icon{
                    font-size: 24px;
                    font-weight: bold;
                }
                .cross{
                    font-size: 28px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: bold;
                    color: #222222;
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
            }
        }
    }
}
</style>
