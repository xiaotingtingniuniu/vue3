<template>
    <div class="register-payee">
        <div class="main">
            <!-- <van-tabs v-model:active="payeeInfo.type" color="#FE7E41">
                <van-tab title="个人"> -->
            <van-form @submit="onSubmit">
                <van-cell-group>
                    <van-field
                        class="guizhu-field"
                        input-align="right"
                        v-model="payeeInfo.mobile"
                        name="mobile"
                        readonly
                        label="手机号码"
                        placeholder="请输入用户手机号"
                        :rules="[{ required: true, message: '请填写手机号' }]"
                    />
                    <van-field
                        v-if="payeeInfo.type === 0"
                        class="guizhu-field"
                        input-align="right"
                        v-model="payeeInfo.name"
                        type="text"
                        name="name"
                        readonly
                        label="真实姓名"
                        placeholder="请输入真实姓名"
                        :rules="[{ required: true, message: '请填写真真实姓名' }]"
                    />
                    <van-field
                        v-if="payeeInfo.type === 0"
                        class="guizhu-field"
                        input-align="right"
                        v-model="payeeInfo.accountNo"
                        type="text"
                        readonly
                        name="身份证号"
                        label="身份证号"
                        placeholder="请输入收款商户号"
                        :rules="[{ required: true, message: '请填写身份证号' }]"
                    />
                </van-cell-group>
                <van-cell-group>
                    <van-field
                        v-if="payeeInfo.type === 1"
                        class="guizhu-field"
                        input-align="right"
                        v-model="payeeInfo.name"
                        type="text"
                        name="name"
                        readonly
                        label="企业全称"
                        placeholder="请输入企业全称"
                        :rules="[{ required: true, message: '请填写企业全称' }]"
                    />
                    <van-field
                        v-if="payeeInfo.type === 1"
                        class="guizhu-field"
                        input-align="right"
                        v-model="payeeInfo.accountNo"
                        type="text"
                        readonly
                        name="商户号"
                        label="商户号"
                        placeholder="请输入收款商户号"
                        :rules="[{ required: true, message: '请填写商户号' }]"
                    />
                </van-cell-group>
                <div class="save-btn">
                    <van-button round block color="#FE7E41" type="primary" native-type="submit" >
                        保存
                    </van-button>
                </div>
            </van-form>
            <!-- </van-tab>
                <van-tab title="企业">
                    <van-form @submit="onSubmit">
                        <van-cell-group>
                            <van-field
                                class="guizhu-field"
                                input-align="right"
                                v-model="payeeInfo.name"
                                type="text"
                                name="name"
                                readonly
                                label="企业全称"
                                placeholder="请输入企业全称"
                                :rules="[{ required: true, message: '请填写企业全称' }]"
                            />
                            <van-field
                                class="guizhu-field"
                                input-align="right"
                                v-model="payeeInfo.accountNo"
                                type="text"
                                readonly
                                name="商户号"
                                label="商户号"
                                placeholder="请输入收款商户号"
                                :rules="[{ required: true, message: '请填写商户号' }]"
                            />
                        </van-cell-group>
                        <div class="save-btn">
                            <van-button round block color="#FE7E41" type="primary" native-type="submit" >
                                保存
                            </van-button>
                        </div>
                    </van-form>
                </van-tab>
            </van-tabs> -->
        </div>
    </div>
</template>
<script setup>
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { getWxOpenid } from '@/api/wx'
import { querySubledgerPayee, querySubledgerUserInfo } from '@/api/collect-money-setting'
import { useRoute } from 'vue-router'
import { Toast } from 'vant'
// querySubledgerUserInfo
const route = useRoute()
const store = useStore()
const init = async () => {
    console.log(store.state.wxCode, 'store')
    console.log(route.params, 'route')
    const info = await querySubledgerUserInfo({ subLedgerId: route.params.subLedgerId, functionType: 1 })
    if (info.code === '200') {
        Object.assign(payeeInfo, info.data)
    }
    console.log(info, 'info')
    payeeInfo.subLedgerId = route.params.subLedgerId
    const res = await getWxOpenid(store.state.wxCode)
    if (res.openid) {
        payeeInfo.openId = res.openid
    }
    console.log(res, 'wx')
}

const payeeInfo = reactive({
    openId: 1,
    // merchantId: '',
    type: '',
    mobile: '',
    accountNo: '',
    name: '',
    bankCard: '',
    bankName: ''
})
init()
const onSubmit = async (values, a) => {
    const res = await querySubledgerPayee({ ...payeeInfo, functionType: 1 })
    if (res.code === '200') {
        Toast('操作成功！')
    }
}
</script>
<style scoped lang="scss">
    .register-payee{
        padding-top: 20px;
        width: 100%;
        height: 100%;
        background-color: #F4F5F5;
        display: flex;
        flex-direction: column;
        .main{
            width: 100%;
            background-color: #F4F5F5 ;
            // margin-top: 20px;
            flex:1
        }
        .footer{
            width: 100%;
            background-color: #fff;

        }
    }
    .van-tabs{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        :deep(.van-tabs__wrap){
            margin-bottom: 15px;
        }
        :deep(.van-tabs__content){
            flex: 1;
            height: 100%;
            background: #fff;
        }
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
            text-align: right;
        }
    }
    .save-btn{
        margin: 150px 30px 0 30px;
    }
    .van-cell{
        height: 120px;
    }
</style>
