<template>
    <div class="login-page">
        <div class="content">
            <el-card class="box-card">
                <div class="title">
                    恒生活核心能力中台
                </div>
                <div class="login-form">
                    <el-form label-width="0" :model="formLabel">
                        <el-form-item>
                            <el-input v-model="formLabel.name" placeholder="用户名称" />
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="formLabel.password" show-password placeholder="登录密码" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" color="#fe2c55" @click="loginFn">
                                登录
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loginApi } from '@/api/login'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const formLabel = ref({
    name: '',
    password: ''
})

const router = useRouter()
const route = useRoute()
const store = useStore()
const loginFn = async () => {
    if (!formLabel.value.name.length || !formLabel.value.password.length) {
        ElMessage({
            showClose: true,
            message: '请输入信息',
            type: 'warning'
        })
    } else {
        const res = await loginApi({
            account: formLabel.value.name,
            pwd: formLabel.value.password,
            appKey: 'A1001000',
            busiCode: 'A1001000'
        })
        store.commit('syncToken', res.token)
        store.commit('setUserInfo', res)
        if (route.query.returnUrl) return router.push({ path: route.query.returnUrl })
        router.push({ name: 'home' })
    }
}

</script>
<style lang="scss" scoped>
.login-page{
    background-color: #f5f6fa;
    .content{
        width: 100%;
        height: 100vh;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        .box-card{
            position: relative;
            width: 418px;
            text-align: center;
            border-radius: 8px;
            background: #fff;
            box-shadow: 0 4px 16px rgb(22 24 35 / 8%);
            border: initial;
            .title{
                margin-top: 72px;
                margin-bottom: 28px;
                font-size: 18px;
                color: rgba(0,0,0,.85);
                font-weight: 500;
            }
            .login-form{
                position: relative;
                min-height: 300px;
                margin-left: 32px;
                margin-right: 32px;
                padding-top: 24px;
                .el-button{
                    width: 100%;
                    height: 46px;
                    border: initial;
                    margin: 16px 0;
                }
            }
        }
    }
}
</style>
