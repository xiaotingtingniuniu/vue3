<template>
    <van-overlay :show="visible" @click="close">
        <div class="wrapper">
            <div class="coupon-tip" @click.stop>
                <div class="coupon-tip--fs56">领取成功</div>
                <div class="coupon-tip--fs30">优惠券领取成功，</div>
                <div class="coupon-tip--fs30">立即下单，即享优惠</div>
                <router-link :to="{ name: 'menu' }" custom v-slot="{ navigate }">
                    <van-button @click="navigate" class="coupon-tip--button" type="primary">
                        <div class="button-content">
                            <div class="text">去下单</div>
                        </div>
                    </van-button>
                </router-link>
                <div class="icon--unselect close-button" @click="close">
                    <van-icon size="1em" :name="require('@/assets/home/coupon-tip-close.png')" />
                </div>
            </div>
        </div>
    </van-overlay>
</template>
<script setup>
const props = defineProps(['visible'])
const emit = defineEmits(['close'])
const visible = ref()

watchEffect(() => {
    visible.value = props.visible
})
const close = () => emit('close')

</script>
<style lang="scss" scoped>
.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .coupon-tip {
        width: 672px;
        height: 739px;
        background-image: url('../../../../assets/home/coupon-tip.png');
        background-size: 100% 100%;
        margin-left: -60px;
        text-align: center;
        position: relative;
        .coupon-tip--fs56{
            font-size: 56px;
            font-weight: bold;
            color: #FFFFFF;
            line-height: 78px;
            margin-top: 298px;
            margin-left: 60px;
            margin-bottom: 15px;
        }
        .coupon-tip--fs30{
            font-size: 30px;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 42px;
            margin-left: 60px;
            margin-bottom: 15px;
        }
        .coupon-tip--button{
            width: 326px;
            height: 80px;
            background: linear-gradient(90deg, #FEF48D 0%, #FCD83A 100%);
            border-radius: 16px;
            font-size: 36px;
            font-weight: bold;
            color: #E61840;
            line-height: 50px;
            margin-left: 60px;
            margin-top: 11px;
        }
        .close-button{
            font-size: 60px;
            position: absolute;
            top: 13px;
            right: 54px;
        }
    }
  }

</style>
