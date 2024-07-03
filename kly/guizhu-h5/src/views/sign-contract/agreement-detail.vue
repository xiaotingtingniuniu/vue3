
<template>
    <div class="sign-contract">
        <van-nav-bar fixed placeholder :title="$route.meta.title" z-index="10" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="closePage" >
                    <van-image :src="require('@/assets/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <van-tabs v-model:active="active"  title-active-color="#FE7E41" title-inactive-color="#191919" :sticky="true" color="#FD7E41" @click-tab="onClickTab">
            <van-tab v-for="tab in tabs" :key="tab.name" :name="tab.name" :title="tab.label">
                <iframe
                    style="width:100%;height:80vh;"
                    :src="active"
                    ref="pdfViewr"
                    allowfullscreen
                    webkitallowfullscreen
                >
                </iframe>
            </van-tab>
        </van-tabs>
        <div class="distance"></div>
        <div class="button-box">
            <div class="btn disab" v-if="countDownText!==''">
                我已全部阅读并同意{{countDownText}}
            </div>
            <div class="btn" v-else @click="back">
                我已全部阅读并同意
            </div>
        </div>
        <div class="button-box-height"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { closePage } from '@/utils/composables'
import { contractTemplate } from '@/api/sign-contract'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const active = ref(0)
// tab页
// const pageSize = ref(10)
const tabs = ref(
    []
)
const countDownText = ref('(10s)')
const countDown = ref(11)
const timer = ref(null)
const countDownFn = () => {
    clearInterval(timer.value)
    timer.value = setInterval(() => {
        --countDown.value
        countDownText.value = '(' + countDown.value + 's)'
        if (countDown.value <= 0) {
            clearInterval(timer.value)
            countDownText.value = ''
            countDown.value = 11
        }
    }, 1000)
}
const getContractTemplate = async () => {
    const param = {
        busiCode: route.params.busi
    }
    const res = await contractTemplate(param)
    if (res.code === '200') {
        const list = res.data.list
        for (let i = 0; i < list.length; i++) {
            tabs.value.push({
                label: list[i].templateName,
                name: list[i].templateUrl
            })
        }
    }
}
onMounted(() => {
    countDownFn()
    getContractTemplate()
})
const back = () => {
    router.push({ name: 'merchant-msg', params: { id: route.params.id, busi: route.params.busi, flag: 1 } })
}
// tabs 切换
const onClickTab = async (val) => {}
</script>
<style lang="scss">
.signContract .van-sticky--fixed {
    top: var(--van-nav-bar-height) !important;
}
</style>
<style lang="scss" scoped>
@mixin flex {
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.sign-contract{
    width: 100%;
    .van-nav-bar__placeholder{
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            background-color: #fff;
            .icon--unselect{
                .van-image{
                    width: 19px;
                    height: 31px;
                }
            }
        }
        :deep(.van-nav-bar::after){
            content: initial;
        }
    }
    .distance{
        height: 94px;
    }
    .button-box{
        // background-color: #fff;
        // padding: 16px 0;
        height: 188px;
        background: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, #FFFFFF 100%);
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding-top: 16px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: calc(0 + constant(safe-area-inset-bottom));
        padding-bottom: calc(0 + env(safe-area-inset-bottom));
        box-sizing: border-box;
        .btn{
            width: 630px;
            height: 92px;
            background: linear-gradient(90deg, #FE7E41 0%, #FF5D0F 100%, #FF5C0E 100%);
            border-radius: 46px;
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 92px;
            text-align: center;
            margin: 26px auto 0;
        }
        .disab{
            background: linear-gradient(90deg, #FE7E41 0%, #FF5D0F 100%, #FF5C0E 100%);
            opacity: .5;
        }
    }
    .button-box-height{
        width: 100%;
        height: 112px;
        padding-bottom: 16px;
        padding-bottom: calc(16px + constant(safe-area-inset-bottom));
        padding-bottom: calc(16px + env(safe-area-inset-bottom));
    }
}
</style>
