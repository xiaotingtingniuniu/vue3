<template>
    <div class="person" :class="isApp ? 'status-bar-height' : ''">
        <van-nav-bar v-if="isApp" fixed placeholder :title="$route.meta.title" left-arrow @click-left="$router.back()"/>
        <div v-if="!isChage">
            <div class="cell van-hairline--bottom">
                <div class="cell-label">头像</div>
                <div class="cell-content">
                    <div class="icon--select"></div>
                    <div class="icon--unselect">
                        <van-icon name="arrow" />
                    </div>
                </div>
            </div>
            <div class="cell" @click="changenick">
                <div class="cell-label">昵称</div>
                <div class="cell-content">
                    <div class="cell-content-text">{{ userInfo.nickname }}</div>
                    <div class="icon--unselect">
                        <van-icon name="arrow" />
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="nickname">
                <div class="name-text">用户名</div>
                <van-cell-group inset>
                    <van-field v-model="nickvalue" label="" placeholder="请输入用户名" clearable/>
                </van-cell-group>
                <div class="text">限制4-30个字符，一个汉字为两个字符</div>
            </div>
            <van-button @click="changeNickname" block>确认更改</van-button>
        </div>
    </div>
</template>
<script setup>
import { update } from '@/api/login'
import { Toast } from 'vant'
import { isApp } from '@/utils'

const isChage = ref(false)
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const nickvalue = ref(userInfo.value.nickname)

const changenick = () => {
    isChage.value = true
}
const changeNickname = async () => {
    if (nickvalue.value.length === 0) return Toast('请输入新昵称')
    if (nickvalue.value.length < 4 || nickvalue.value.length > 30) return Toast('请输入4-30个字符')
    const { code } = await update({
        nickname: nickvalue.value
    })
    if (code === 200) {
        Toast('修改成功')
        await store.dispatch('updateUserInfo')
        isChage.value = false
    }
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
.person{
    min-height: calc(100vh - var(--van-status-bar-height));
    background: #F7F7F7;
    .cell{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 30px;
        padding: 30px;
        color: #212034;
        font-weight: 400;
        background-color: #fff;
        .cell-label{
            font-size: 30px;
            font-weight: 400;
            color: #222222;
        }
        .cell-content{
            display: flex;
            align-items: center;
            .icon--select{
                width: 80px;
                height: 80px;
                border-radius: 40px;
                background-image: url('../../../assets/mine/headportrait.png');
                background-size: contain;
                background-repeat: no-repeat;
                margin-right: 20px;
            }
            .cell-content-text{
                font-size: 30px;
                font-weight: 400;
                color: #999999;
                line-height: 30px;
                margin-right: 20px;
            }
            .van-icon{
                color: #999999;
                font-size: 14px;
            }
        }
    }
    .nickname{
        padding: 40px 30px 30px;
        background-color: #fff;
        .name-text{
            font-size: 30px;
            font-weight: 400;
            color: #999999;
        }
        :deep(.van-cell-group){
            margin: 20px 0 0;
            border: 1px solid #FAFAFA;
            .van-cell{
                background-color: #FAFAFA;
            }
        }
        :deep(.van-cell-group):hover{
            border: 1px solid #F16542;
        }
        .text{
            font-size: 26px;
            font-weight: 400;
            color: #999999;
            margin-top: 30px;
        }
    }
    .van-button{
        width: 690px;
        height: 88px;
        margin: 80px auto 0;
        font-size: 32px;
        border-radius: 16px;
        color: #FFFFFF;
        background: linear-gradient(270deg, #F46844 0%, #E35A37 100%);
        border: initial;
    }
}
</style>
