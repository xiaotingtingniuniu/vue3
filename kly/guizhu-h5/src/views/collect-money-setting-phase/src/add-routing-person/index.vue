<template>
    <div class="add-routing-person mine-content" >
        <div class="ledger-title">绑定收款账户</div>
        <div class="main">
            <van-form @submit="onSubmit">
                <van-cell-group>
                    <van-field name="type" label="用户类型" input-align="right" class="guizhu-field">
                        <template #input>
                            <van-radio-group v-model="formData.type" direction="horizontal" disabled>
                                <van-radio :name="0" checked-color="#FE7E41" icon-size="16px">
                                    个人
                                    <template #icon="props">
                                        <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                                    </template>
                                </van-radio>
                                <van-radio :name="1" checked-color="#FE7E41" icon-size="16px">
                                    企业
                                    <template #icon="props">
                                        <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                                    </template>
                                </van-radio>
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
                        disabled
                    />
                    <van-field
                        v-if="formData.type === 0"
                        class="guizhu-field"
                        v-model="formData.name"
                        input-align="right"
                        name="name"
                        label="真实姓名"
                        placeholder="请输入真实姓名"
                        :rules="[{ required: true, message: '请填写真实姓名' }]"
                        disabled
                    />
                    <!-- <van-field
                        v-if="formData.type === 0"
                        class="guizhu-field"
                        v-model="formData.accountNo"
                        input-align="right"
                        name="accountNo"
                        label="身份证号"
                        placeholder="请输入身份证号"
                        :rules="[{ required: true, message: '请填写身份证号' }]"
                        disabled
                    /> -->
                    <van-field
                        v-if="formData.type === 1"
                        class="guizhu-field"
                        v-model="formData.name"
                        input-align="right"
                        type="text"
                        name="name"
                        label="企业全称"
                        placeholder="请输入公司全称"
                        :rules="[{ required: true, message: '请填写真实公司全称' }]"
                        disabled
                    />
                    <van-field
                        v-if="formData.type === 1"
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
                        添加
                    </van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>
<script setup>
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { subledgerSave, subledgerUpdate } from '@/api/collect-money-setting.js'
import { Toast } from 'vant'
import { closePage } from '@/utils/composables'

const route = useRoute()
const activeIcon = require('@/assets/mine/icon-checked.png')
const inactiveIcon = require('@/assets/mine/icon-check.png')
// 分账人信息
const mobile = route.query.mobile
const mobileScret = route.query.mobileScret
const name = route.query.name
const accountNo = route.query.accountNo
const merchantType = route.query.merchantType
const merchantSubId = route.query.merchantSubId
const type = route.query.type

const formData = reactive({
    type: merchantType === '2' ? 0 : 1,
    mobile: mobileScret,
    name: name,
    accountNo: merchantType === '2' ? accountNo : ''
})
const onSubmit = async (values) => {
    console.log(values, 'values')
    values.mobile = mobile // 展示脱敏字段，传参正常电话号码
    if (type) {
        const res = await subledgerUpdate({ ...values, functionType: 1, subLedgerId: merchantSubId, accountNo: formData.accountNo })
        if (res.code === '200') {
            Toast('操作成功！')
            closePage()
        }
    } else {
        const res = await subledgerSave({ ...values, functionType: 1, collectionUserId: merchantSubId, accountNo: formData.accountNo, collectionUserType: route.query.merchantSubType })
        if (res.code === '200') {
            Toast('操作成功！')
            setTimeout(() => {
                closePage()
            }, 1500)
        }
    }
}

// 监听滑动返回事件
const pushHistory = () => {
    const state = {
        title: 'title',
        url: '#'
    }
    window.history.pushState(state, 'title', '#')
}
if (window.history && window.history.pushState) {
    pushHistory()
    window.addEventListener('popstate', (e) => {
        closePage()
    }, false)
}
</script>
<style lang="scss" scoped>
    .mine-content{
        --van-nav-bar-icon-color: #000;
        --van-nav-bar-arrow-size: 35px;
        --van-nav-bar-text-color: #FE7E41;
        --van-nav-bar-title-font-size: 34px;
        background-size: 100% auto;
        background-repeat: no-repeat;
        .van-nav-bar__placeholder{
            :deep(.van-nav-bar){
                padding-top: var(--van-status-bar-height);
                z-index: 9999;
            }
            .van-hairline--bottom:after{
                border-bottom-width: 0;
            }
        }
    }
    // :deep(.van-nav-bar__content) {
    //     position: fixed;
    //     left: 0;
    //     right: 0;
    //     top: 0;
    //     height: 88px;
    //     background: #fff;
    //     font-weight: 600;
    //     color: #000000;
    //     line-height: 48px;
    //     border: 0;
    // }
    :deep(.van-nav-bar__title) {
        font-size: 34px;
        font-weight: bold;
    }
    :deep(.van-nav-bar .van-icon) {
        font-size: 35px;
        color: #000;
        font-weight: bold;
    }

    .top-box {
        width: 100%;
        height: 88px;
        font-size: 34px;
        font-weight: 600;
        color: #000000;
    }
    .add-routing-person{
        // width: 100%;
        // min-height: 100vh;
        // background-color: #F4F5F5;
        // display: flex;
        // flex-direction: column;
        .main{
            width: 100%;
            background-color: #fff;
            margin-top: 24px;
            flex:1
        }
        .guizhu-field {
            :deep(.van-field__label) {
                font-size: 30px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
            }
            .img-icon {
                width: 32px;
                height: 32px;
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
            :deep(.van-field__error-message) {
                text-align: right!important;
                position: absolute;
                right: 0px;
                bottom: -35px;
            }
        }
        .van-cell-group{
            margin: 0;
        }
        .save-btn{
            margin: 274px 60px 0 60px;
        }
    }
    .ledger-title {
        width: 100%;
        padding: 24px 30px 0 30px;
        box-sizing: border-box;
        font-size: 30px;
        font-weight: 500;
        color: #323340;
        line-height: 42px;
    }
</style>
