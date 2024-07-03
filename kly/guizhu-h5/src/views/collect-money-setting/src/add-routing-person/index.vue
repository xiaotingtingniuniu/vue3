<template>
    <div class="add-routing-person">
        <div class="main">
            <van-form @submit="onSubmit">
                <van-cell-group>
                    <van-field name="type" label="用户类型" input-align="right" class="guizhu-field">
                        <template #input>
                            <van-radio-group v-model="formData.type" direction="horizontal" >
                                <van-radio :name="0" checked-color="#FE7E41" icon-size="16px">个人</van-radio>
                                <van-radio :name="1" checked-color="#FE7E41" icon-size="16px">企业</van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>
                    <van-field
                        class="guizhu-field"
                        v-model="formData.mobile"
                        input-align="right"
                        type="tel"
                        maxlength="11"
                        name="mobile"
                        label="用户手机号"
                        placeholder="请输入用户手机号"
                        :rules="[{ required: true, message: '请填写用户名手机号' }]"
                    />
                    <van-field
                        v-show="formData.type === 0"
                        class="guizhu-field"
                        v-model="formData.name"
                        input-align="right"
                        name="name"
                        label="真实姓名"
                        placeholder="请输入真实姓名"
                        :rules="[{ required: true, message: '请填写真实姓名' }]"
                    />
                    <van-field
                        v-show="formData.type === 0"
                        class="guizhu-field"
                        v-model="formData.accountNo"
                        input-align="right"
                        name="accountNo"
                        label="身份证号"
                        placeholder="请输入身份证号"
                        :rules="[{ required: true, message: '请填写身份证号' }]"
                    />
                    <van-field
                        v-show="formData.type === 1"
                        class="guizhu-field"
                        v-model="formData.name"
                        input-align="right"
                        type="text"
                        name="name"
                        label="企业全称"
                        placeholder="请输入公司全称"
                        :rules="[{ required: true, message: '请填写真实公司全称' }]"
                    />
                    <van-field
                        v-show="formData.type === 1"
                        class="guizhu-field"
                        v-model="formData.accountNo"
                        input-align="right"
                        type="text"
                        name="accountNo"
                        label="商户号"
                        placeholder="请输入收款商户号"
                        :rules="[{ required: true, message: '请填写真实商户号' }]"
                    />
                </van-cell-group>
                <div class="save-btn">
                    <van-button round block color="#FE7E41" type="primary" native-type="submit" >
                        保存
                    </van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>
<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { subledgerSave } from '@/api/collect-money-setting.js'
import { Toast } from 'vant'

const router = useRouter()
const formData = reactive({
    type: 0,
    mobile: '',
    name: null,
    accountNo: null
})
const onSubmit = async (values) => {
    console.log(values, 'values')
    const res = await subledgerSave(values)
    if (res.code === '200') {
        Toast('操作成功！')
        router.back()
    }
    console.log(res, 'res')
}
</script>
<style scoped lang="scss">
    .add-routing-person{
        width: 100%;
        min-height: 100vh;
        background-color: #F4F5F5;
        display: flex;
        flex-direction: column;
        .main{
            width: 100%;
            background-color: #fff;
            margin-top: 20px;
            flex:1
        }
        .guizhu-field {
            :deep(.van-field__label) {
                font-size: 30px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
            }
        }
        .guizhu-field {
            padding: 36px 30px;
            align-items: center;
            label {
                line-height: 42px;
                display: inline-block;
                width: 210px;
                font-size: 30px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
            }
            input {
                line-height: 42px;
                font-size: 30px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                &::-webkit-input-placeholder {
                    font-size: 30px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #BBBBBB;
                    line-height: 42px;
                }
            }
            .van-field__error-message {
                text-align: right !important;
            }
        }
        .van-cell-group{
            margin: 0;
        }
        .save-btn{
            margin: 150px 30px 0 30px;

        }
    }
</style>
