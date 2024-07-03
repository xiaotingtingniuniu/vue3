<template>
    <div class="feedback">
        <div class="form-content">
            <h3 class="form-title">问题反馈</h3>
            <van-field
                v-model="message"
                rows="1"
                :autosize="{ minHeight: '155' }"
                type="textarea"
                placeholder="请描述您的问题或建议，我们的工作人员将于2～3个工作日与您联系。"
                maxlength="100"
                show-word-limit
            />
        </div>
        <div class="form-content">
            <h3 class="form-title">手机号（选填）</h3>
            <van-field
                v-model="phone"
                placeholder="请输入手机号，方便我们与您联系。"
                type="tel"
                maxlength="11"
            />
        </div>
        <button
            class="submit"
            :class="[btnClass]"
            :disabled="!Boolean(btnClass)"
            @click="onSubmit"
        >
            提交
        </button>
        <!-- <div class="cst-loading" v-if="loading">
            <van-loading></van-loading>
        </div> -->
    </div>
</template>
<script setup>
import { reactive, toRefs, ref, computed } from 'vue'
import { addFeedback } from '@/api/feedback'
import { verifyPhone } from '@/utils'
import { appBridge } from '@/utils/bridge'
import { goLogin, getToken } from '@/utils/composables'
import { Toast } from 'vant'
import { useStore } from 'vuex'

const store = useStore()
const result = reactive({
    message: '',
    phone: ''
})
const { message, phone } = toRefs(result)
const isSub = ref(false)
const btnClass = computed(() =>
    message.value && !isSub.value ? 'btn-disable' : ''
)
const token = ref()

const init = async () => {
    token.value = store.state.token || (await getToken())
}
init()

const onSubmit = async () => {
    if (!token.value) {
        Toast('请登录之后在提交!')
        goLogin()
        return
    }
    if (phone.value) {
        if (!verifyPhone(phone.value)) {
            Toast('请输入正确格式的手机号!')
            return
        }
    }
    isSub.value = true
    const res = await addFeedback({
        feedbackContend: message.value, // 反馈内容
        feedbackPhone: phone.value // 反馈手机号
    })
    if (res.code === '200') {
        Toast('提交成功!')
        const timer = setTimeout(() => {
            clearTimeout(timer)
            appBridge('closePage')
        }, 1800)
    } else {
        Toast(res.msg)
    }
}
</script>
<style>
/* .van-cell__value van-cell__value--alone  */
.feedback .van-field__word-limit {
    color: #bbb !important;
}
.feedback .van-field__word-num {
    color: #2e2e4d;
}
.feedback textarea {
    line-height: 33px;
}
.feedback textarea::placeholder,
.feedback input::placeholder {
    font-weight: normal;
    font-size: 24px;
}
</style>
<style lang="scss" scoped>
.feedback {
    background: #f4f5f5;
    height: 100vh;
    overflow: hidden;
    .form-content {
        margin: 20px;
        padding: 30px;
        background: #ffffff;
        border-radius: 8px;
        font-family: PingFangSC-Medium, PingFang SC;
        .form-title {
            margin-bottom: 10px;
            height: 42px;
            font-size: 30px;
            font-weight: bold;
            color: #2e2e4d;
            line-height: 42px;
        }
        .van-field {
            background: #f4f5f5;
        }
    }
    .submit {
        margin: 100px 60px 0;
        height: 92px;
        width: calc(100% - 120px);
        border-radius: 46px;
        background: #ffd6c2;
        color: #ffffff;
        font-weight: bold;
        font-size: 30px;
        border: 0;
        outline: none;
    }
    .btn-disable {
        background: #fe7e41;
    }
}
</style>
