<template>
    <div class="setting" :class="isApp ? 'status-bar-height' : ''">
        <van-nav-bar v-if="isApp" fixed placeholder :title="$route.meta.title" left-arrow @click-left="$router.back()"/>
        <div class="setting-phone">
            <div class="phone-change">
                <div class="text">原手机号</div>
                <van-cell-group inset>
                    <van-field v-model="oldphone" label="" type="number" maxlength="11" placeholder="请输入原手机号" />
                </van-cell-group>
                <div class="text">新手机号</div>
                <van-cell-group inset>
                    <van-field v-model="newphone" label="" type="number" maxlength="11" placeholder="请输入新手机号" />
                </van-cell-group>
            </div>
            <div class="code-verification">
                <div class="text">验证码</div>
                <div class="code-obtain">
                    <div class="code-input">
                        <van-cell-group inset>
                            <van-field v-model="msgcode" label="" type="number" maxlength="6" placeholder="请输入验证码" />
                        </van-cell-group>
                    </div>
                    <div class="code-btn code-btn--obtain" v-if="!isSuccess || data <= 0" @click="codeBtn">获取验证码</div>
                    <div class="code-btn code-btn--success" v-else >{{data}}s后获取</div>
                </div>
            </div>
        </div>
        <div class="signout">
            <van-button @click="surePhone" block color="linear-gradient(270deg, #F46844 0%, #E35A37 100%)" type="primary">
                确认更改
            </van-button>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { updateMobile, sendSms } from '@/api/login'
import { isApp } from '@/utils'

const router = useRouter()
const phone = ref('')
const oldphone = ref('')
const newphone = ref('')
const msgcode = ref('')
const pattern = /^1[3-9]\d{9}$/
const data = ref(60)
const resultdata = ref(60)
const isSuccess = ref(false)
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

watchEffect(() => {
    if (!newphone.value || !oldphone.value || !msgcode.value) return
    newphone.value = newphone.value.replace(/[^\d]/g, '')
    oldphone.value = oldphone.value.replace(/[^\d]/g, '')
    msgcode.value = msgcode.value.replace(/[^\d]/g, '')
})
onMounted(() => {
    phone.value = sessionStorage.getItem('phone')
    oldphone.value = userInfo.value.mobile
})
const settime = () => {
    const myTime = setInterval(() => {
        resultdata.value = data
        data.value--
        if (data.value < 1) {
            clearInterval(myTime)
        }
    }, 1000)
}
const codeBtn = async () => {
    if (newphone.value === '') {
        Toast('请输入手机号')
    } else if (!pattern.test(newphone.value)) {
        Toast('请输入正确手机号')
    } else {
        const { code, msg } = await sendSms({
            mobile: newphone.value,
            userType: '1'
        })
        if (code === 200) {
            Toast('验证码发送成功')
            isSuccess.value = true
            settime()
            msgcode.value = ''
            data.value = 60
            resultdata.value = 60
        } else {
            Toast(msg)
        }
    }
}
const surePhone = async () => {
    if (oldphone.value === '' || newphone.value === '') return Toast('请输入手机号')
    if (!pattern.test(oldphone.value) || !pattern.test(newphone.value)) return Toast('请输入正确手机号')
    if (oldphone.value !== userInfo.value.mobile) return Toast('原手机号错误')
    if (msgcode.value === '') return Toast('请输入验证码')
    const params = {
        userType: 1,
        mobile: newphone.value,
        code: msgcode.value
    }
    const { code, msg, data } = await updateMobile(params)
    if (code === 200) {
        if (!data) return Toast(msg)
        Toast(msg)
        sessionStorage.setItem('phone', newphone.value)
        router.push({ name: 'setting' })
    } else if (code === 500) {
        Toast(msg)
    } else {
        Toast('手机号更改失败')
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
.setting{
    min-height: calc(100vh - var(--van-status-bar-height));
    background: #F7F7F7;
    .setting-phone{
        background-color: #fff;
        .phone-change{
            width: 690px;
            background-color: white;
            margin: 0 auto;
            .text{
                font-size: 30px;
                color: #999999;
                margin: 20px 0px;
            }
            :deep(.van-cell-group){
                margin: 0 auto;
                border: 1px solid #FAFAFA;
                .van-cell{
                    background-color: #FAFAFA;
                }
            }
            :deep(.van-cell-group):hover{
                border: 1px solid #F16542;
            }
        }
        .code-verification{
            width: 690px;
            margin: 0 auto;
            .text{
                font-size: 30px;
                color: #999999;
                margin: 20px 0px;
            }
            .code-obtain{
                display: flex;
                justify-content: space-between;
                padding-bottom: 40px;
                .code-btn{
                    width: 240px;
                    height: 88px;
                    line-height: 88px;
                    text-align: center;
                    border-radius: 16px;
                }
                .code-btn--obtain{
                    background-color: #F16542;
                    color: white;
                }
                .code-btn--success{
                    background-color: #F4F4F4;
                    color: #999999;
                }
                :deep(.van-cell-group){
                    width: 410px;
                    margin: 0 auto;
                    border: 1px solid #FAFAFA;
                    .van-cell{
                        background-color: #FAFAFA;
                    }
                }
                :deep(.van-cell-group):hover{
                    border: 1px solid #F16542;
                }
            }
        }
    }
    .signout {
        width: 690px;
        margin: 80px auto;
        .van-button{
            height: 88px;
            font-size: 32px;
            border-radius: 20px;
        }
    }
}
</style>
