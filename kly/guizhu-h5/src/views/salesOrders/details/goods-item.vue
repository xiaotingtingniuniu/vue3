<template>
    <div class="goods-item--3">
        <div class="item_content">
            <div class="goods-item-img">
                <div class="item_img">
                    <img class="img" v-if="props.goods.skuImg" :src="$props.goods.skuImg" alt=""/>
                    <img class="img" v-else src="../../../assets/default.png" alt=""  />
                </div>
            </div>
            <!-- <div class="goods-item-img" v-else>
                <img class="img" src="../../../assets/default.png" alt=""  />
            </div> -->
            <div class="middle">
                <h4 class="title">{{$props.goods.skuName}}</h4>
                <div class="goods-type" v-if="$props.goods.storageStyleCode === 'freeze'"></div>
                <div class="price">￥{{($props.goods.realPrice / 100).toFixed(2)}}</div>
            </div>
            <div class="item_count">
                <van-field name="stepper" class="cst-stepper-field">
                    <template #input>
                        <van-stepper v-model="$props.goods.quantity" :disabled="$props.disabled" integer @change="handleChange" :min="0"/>
                    </template>
                </van-field>
            </div>
        </div>
    </div>
</template>
<script setup>

// import { ref } from 'vue'
const emit = defineEmits(['change'])
const props = defineProps({
    goods: {
        type: Object,
        default: () => {}
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const handleChange = () => {
    emit('change')
}
</script>
<style lang="scss" scoped>
.goods-item--3{
    // margin: 20px 30px 0 30px;
    // padding: 30px 30px 27px 30px;
    // background: #FFFFFF;
    // border-radius: 8px;
    .item_content{
        position: relative;
        display: flex;
        justify-content: space-between;
        justify-items: center;
        align-items: center;
        padding: 32px 30px 32px 6px;
        padding-bottom: 20px;
        border-bottom: 1px solid #F4F5F5;
        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: 8px;
            display: block;
            width: 562px;
            height: 2px;
            background: #EDEDED;
        }
        .goods-item-img{
            .item-img{
                img{
                width: 100px;
                height: 100px;
            }
            }

            img{
                width: 100px;
                height: 100px;
            }
        }
        .middle {
            width: 350px;
            .title {
                width: 350px;
                height: 36px;
                font-size: 26px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #191919;
                line-height: 36px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .goods-type {
                width: 116px;
                height: 32px;
                background: url('../../../assets/freeze-icon.png') no-repeat 100% 100%;
            }
            .price {
                // margin-top: 32px;
                margin-top: 12px;
                width: 68px;
                height: 30px;
                font-size: 22px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FF6115;
                line-height: 30px;
            }
        }
        .item_count{
            font-size: 20px;
            font-weight: 400;
            color: #494849;
            letter-spacing: 1px;
        }
    }
}
</style>
<style lang="scss">
.cst-stepper-field {
    padding: unset;
}
</style>
