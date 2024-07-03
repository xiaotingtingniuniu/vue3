<template>
    <div class="setting" :class="isApp ? 'status-bar-height' : ''">
        <van-nav-bar v-if="isApp" fixed placeholder :title="$route.meta.title" left-arrow @click-left="$router.back()"/>
        <div>
            <div class="setting-change--details van-hairline--bottom" @click="changePhone">
                <div class="text">更改手机号</div>
                <div class="phone">{{phone}}</div>
                <div class="icon--unselect">
                    <van-image :src="require('@/assets/mine/形状结合备份 26@2x.png')"/>
                </div>
            </div>
            <div class="setting-change--details" @click="agreement">
                <div class="text">用户隐私协议</div>
                <div class="icon--unselect">
                    <van-image :src="require('@/assets/mine/形状结合备份 26@2x.png')"/>
                </div>
            </div>

            <router-link :to="{name: 'account-cancellation'}" custom v-slot="{ navigate }">
                <div class="setting-change--details" @click="navigate">
                    <div class="text">账号注销</div>
                    <div class="text--F16542">
                        注销后无法恢复, 请谨慎操作
                    </div>
                    <div class="icon--unselect">
                        <van-image :src="require('@/assets/mine/形状结合备份 26@2x.png')"/>
                    </div>
                </div>
            </router-link>
            <div class="signout">
                <van-button @click="siginOut" block color="linear-gradient(270deg, #F46844 0%, #E35A37 100%)" type="primary">
                    退出
                </van-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { isApp } from '@/utils'
import Dialog from '@/components/Dialog'

const router = useRouter()
const store = useStore()
const phone = ref('')
const userInfo = computed(() => store.state.userInfo)

onMounted(() => {
    phone.value = userInfo.value.mobile
})
const siginOut = () => {
    Dialog({
        title: '是否确认退出'
    }).then(async () => {
        await store.dispatch('logout')
        router.push({ name: 'home' })
    }).catch(() => {})
}
const agreement = () => {
    router.push({ name: 'agreement-privacy', query: { issetting: false } })
}
const changePhone = () => {
    router.push({ name: 'setting-phone' })
}
</script>
<style lang="scss" scoped>
.status-bar-height{
    .van-nav-bar__placeholder{
        height: calc(92px + var(--van-status-bar-height)) !important;
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            background-color: #fff;
        }
        :deep(.van-nav-bar::after){
            content: initial;
        }
    }
}
.setting{
    .setting-head{
        position: relative;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #EEEEEE;
        font-size: 34px;
        .icon--unselect{
            position: absolute;
            left: 10px;
        }
        .heaed-setting{
            flex: 1;
        }
    }
    .setting-change--details{
        display: flex;
        height: 100px;
        padding: 0 30px;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 30px;
        color: #222222;
        font-weight: 400;
        background-color: #fff;
        .text{
            flex: 1;
        }
        .phone{
            color: #999999;
        }
        .close{
            color: #999999;
        }
        .text--F16542{
            color: #F16542;
            font-size: 30px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #F16542;
        }
        .icon--unselect{
            .van-image{
                width: 9px;
                height: 15px;
                margin-left: 20px;
            }
        }
    }
    .signout {
        width: 92%;
        margin: 80px auto;
        .van-button{
            height: 88px;
            font-size: 32px;
            border-radius: 20px;
        }
    }
}
</style>
