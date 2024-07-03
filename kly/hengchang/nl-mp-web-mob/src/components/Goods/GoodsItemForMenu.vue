<template>
    <div class="goods-item--2">
        <div class="goods-item--2-image" @click="pageGo(`/shops-goods/goods-detail/${goodsInfo.id}`)">
            <van-image :src="goodsInfo.logo" radius="7">
                <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                </template>
            </van-image>
        </div>
        <div class="goods-item--2-content" @click="pageGo(`/shops-goods/goods-detail/${goodsInfo.id}`)">
            <div class="title van-multi-ellipsis--l2">{{goodsInfo.name}}</div>
            <div class="price">
                <div class="price-item">
                    <div class="colour">
                        <span>¥</span>{{goodsInfo.sellPrice}}
                    </div>
                </div>
                <van-button>
                    <div class="icon--unselect" @click.stop="add">
                        <van-icon size="1em" :name="require('@/assets/goods/cart-icon1.png')" />
                    </div>
                </van-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { pageGo } from '@/utils/composables'

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
const emit = defineEmits(['addToCart'])
const goodsInfo = ref(props.goodsInfo)
watch(() => [props.goodsInfo], (newVal, oldVal) => {
    goodsInfo.value = newVal[0]
})

const add = () => {
    emit('addToCart', goodsInfo.value.id, goodsInfo.value.quantity)
}

</script>
<style lang="scss" scoped>
.goods-item--2{
    display: flex;
    padding: 28px 0;
    .goods-item--2-image{
        width: 154px;
        height: 154px;
        margin-right: 24px;
        .van-image{
            width: 100%;
            height: 100%;
        }
    }
    .goods-item--2-content{
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title{
            font-size: 28px;
            color: #222222;
            font-weight: bold;
        }
        .price{
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            .price-item{
                display: flex;
                align-items: flex-end;
                .colour{
                    font-size: 36px;
                    font-weight: bold;
                    color: #F16542;
                    margin-right: 12px;
                    line-height: 36px;
                    font-family: 'DIN Alternate Bold';
                    span{
                        font-size: 26px;
                        line-height: 26px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        margin-right: 2px;
                    }
                }
            }
            .van-button{
                width: 66px;
                height: 66px;
                border: initial;
                border-radius: 33px;
                .icon--unselect{
                    font-size: 66px;
                }
            }
        }
    }
}
</style>
