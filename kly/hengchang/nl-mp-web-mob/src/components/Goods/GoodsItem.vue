<template>
    <div class="goods-item" :class="invalid ? 'invalid' : ''">
        <div @click="clickItemFn" class="goods-item-image tag" :class="index ? `tag${index}` : ''">
            <van-image :src="goodsInfo.logo" radius="7">
                <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                </template>
            </van-image>
        </div>
        <div class="goods-item-content">
            <div class="goods-item-main" @click="clickItemFn">
                <div class="goods-item-main--name van-ellipsis">{{ goodsInfo.name }}</div>
            </div>
            <div class="goods-item-info">
                <div class="left--discount">
                    <!-- <div class="goods-item-main--discount"></div>
                    <div class="goods-item-main--surplus">
                        <div>满5减1</div>
                    </div> -->
                </div>
                <div class="goods-item-operate" v-if="!invalid">
                    <van-button v-if="goodsInfo.quantity" @click="add(goodsInfo,-1)">
                        <div class="icon--unselect">
                            <van-icon size="1em" :name="require('@/assets/home/sub-icon.png')" />
                        </div>
                    </van-button>
                    <div class="num">{{ goodsInfo.quantity }}</div>
                    <van-button @click="add(goodsInfo, 1)">
                        <div class="icon--unselect">
                            <van-icon size="1em" :name="require('@/assets/home/add-icon.png')" />
                        </div>
                    </van-button>
                </div>
            </div>
            <div class="goods-item-main--price"><span class="unit">¥</span><span class="font-din">{{ goodsInfo.sellPrice }}</span></div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    goodsInfo: {
        deep: true,
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
    },
    indexNum: {
        type: Number || null,
        default: null
    },
    invalid: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['cliadd', 'clickItem'])
const goodsInfo = ref(props.goodsInfo)
const index = ref(props.index)
const indexNum = ref(props.indexNum)

watch(() => [props.goodsInfo], (newVal) => {
    goodsInfo.value = newVal[0]
})
const add = (goodsInfo, i) => emit('cliadd', goodsInfo.id, i, goodsInfo.quantity, indexNum.value)
const clickItemFn = () => emit('clickItem')
</script>
<style lang="scss" scoped>
.invalid{
    .goods-item-main--name{
        color: #999999 !important;
    }
    .goods-item-main--price{
        color: #999999 !important;
        .unit{
            color: #999999 !important;
        }
    }
}
.goods-item{
    display: flex;
    .tag{
        position: relative;
    }
    .tag1::after{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 66px;
        height: 31px;
        background-image: url('../../assets/home/tag1-icon.png');
        background-size: 100% 100%;
        z-index: 1;
    }
    .tag2::after{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 66px;
        height: 31px;
        background-image: url('../../assets/home/tag2-icon.png');
        background-size: 100% 100%;
        z-index: 1;
    }
    .tag3::after{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 66px;
        height: 31px;
        background-image: url('../../assets/home/tag3-icon.png');
        background-size: 100% 100%;
        z-index: 1;
    }
    .goods-item-image{
        width: 160px;
        height: 160px;
        margin-right: 28px;
        .van-image{
            width: 100%;
            height: 100%;
        }
    }
    .goods-item-content{
        flex: 1;
        .goods-item-main{
            display: flex;
            .goods-item-main--name{
                width: 0;
                flex: 1;
                font-size: 28px;
                font-weight: bold;
                color: #222222;
                padding-right: 40px;
            }
        }
        .goods-item-info{
            display: flex;
            margin-top: 11px;
            .left--discount{
                display: flex;
                align-items: center;
                flex: 1;
                .goods-item-main--surplus{
                    width: max-content;
                    padding: 3px 8px;
                    font-size: 20px;
                    font-weight: 400;
                    color: #F68033;
                    background: #FFF5F2;
                    border-radius: 6px;
                    overflow: hidden;
                }
                .goods-item-main--discount{
                    width: 22px;
                    height: 22px;
                    background-image: url('../../assets/home/coupon1.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                }
            }
            .goods-item-operate{
                display: flex;
                margin-top: 9px;
                justify-content: flex-end;
                .van-button{
                    padding: initial;
                    height: initial;
                    border: none;
                    border-radius: 20px;
                    // overflow: hidden;
                }
                .icon--unselect{
                    font-size: 40px;
                }
                .num{
                    margin: 0 12px;
                }
            }
        }
        .goods-item-main--price{
            font-size: 34px;
            font-weight: bold;
            color: #F16542;
            margin-top: 19px;
            .unit{
                font-size: 26px;
                font-weight: bold;
                color: #F16542;
            }
        }
    }
}
</style>
