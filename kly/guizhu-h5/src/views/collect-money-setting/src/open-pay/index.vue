<template>
    <div class="open-type">
        <van-form @submit="onSubmit">
            <div class="merchant card">
                <cst-merchant v-model:merchantInfo="merchantInfo" :status="status"></cst-merchant>
                <cst-representative v-model:merchantInfo="merchantInfo" :status="status"></cst-representative>
                <!-- <cst-store-info v-model:merchantInfo="merchantInfo"></cst-store-info> -->
                <cst-admin v-model:merchantInfo="merchantInfo" :status="status"></cst-admin>
                <cst-settlement v-model:merchantInfo="merchantInfo" :status="status"></cst-settlement>
                <div class="sub-btn" v-if="status !== 'detail'">
                    <van-button block color="#FE7E41" plain  type="primary"
                                @click="onSave">
                        保存
                    </van-button>
                    <van-button block color="#FE7E41" type="primary" native-type="submit" @click="merchantInfo.operateType = 2" >
                        提交
                    </van-button>
                </div>
            </div>
        </van-form>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CstMerchant from './components/Merchant'
import CstRepresentative from './components/Representative'
// import CstStoreInfo from './components/Store-info'
import { CORPORATE_TYPE } from './index'
import CstAdmin from './components/Admin'
import CstSettlement from './components/Settlement'
import { merchantSave, merchantSettlementInfo } from '@/api/collect-money-setting'
import { Toast } from 'vant'

const route = useRoute()
const router = useRouter()
const status = ref(route.params?.status)
const merchantInfo = reactive({
    payChannelCode: '1', // 1，微信2支付宝
    operateType: 1,
    pname: '',
    pstypeName: '',
    pfileType: '',
    // 商户信息
    corporateType: 2, // 商户类型 1 企业 2 自然人 3个人工商户 4 事业单位
    corporateName: '个人',
    industry: '', // 所属行业
    merchantShortName: '', // 商户简称
    businessLicenseCopy: [], // 商户证件照片
    // merchantId: '', // 营业执照号
    businessLicenseNumber: '', // 营业执照号
    merchantName: '', // 商户名称
    legalPerson: '', // 法定代表人名称
    companyAddress: '', // 注册地址
    // 法定代表人
    idCardCopy: [], // 法人证件照片正面
    idCardNational: [], // 法人证件照片背面
    idCardName: '', // 身份证姓名
    idCardNumber: '', // 身份证号码
    idCardAddress: '', // 身份证居住地址
    idCardValidTimeBegin: '', // 身份证开始时间
    idCardValidTime: '', // 身份证结束时间
    // 门店信息
    // storeName: '', // 店铺名称
    // storeUrl: '', // 店铺链接
    // storeAddress: '', // 门店省市地址
    // 管理员
    legalCertType: '', // 法人证件类型
    contactName: '', // 管理员姓名
    contactIdCardNumber: '', // 管理员证件号
    customerMobile: '', // 手机号
    contactEmail: '', // 邮箱
    // 结算信息
    settlementWay: 0, // 结算方式 0对私银行卡 1对公银行卡
    accountName: '', // 银行开户名
    accountBank: '', // 银行名称
    regAddress: '', // 开户行地址
    acctSubBankName: '', // 开户支行
    acctSubBankValue: '', // 开户支行
    acctProvince: '', // 开户地址（回写）
    acctProvinceCode: '', // 开户行省市编码
    accountNumber: '', // 银行卡号
    checked: false,
    businessAdditionDesc: []

})

const init = async () => {
    const res = await merchantSettlementInfo()
    if (res.code === '200') {
        Object.assign(merchantInfo, res.data)
        merchantInfo.businessLicenseCopy = res.data.businessLicenseCopy ? [{ url: res.data.businessLicenseCopy }] : []
        merchantInfo.idCardCopy = res.data.idCardCopy ? [{ url: res.data.idCardCopy }] : []
        merchantInfo.idCardNational = res.data.idCardNational ? [{ url: res.data.idCardNational }] : []
        merchantInfo.businessAdditionDesc = res.data.businessAdditionDesc ? res.data.businessAdditionDesc.split(',').map(el => {
            return { url: el }
        }) : []
        merchantInfo.corporateName = CORPORATE_TYPE[res.data.corporateType]
        merchantInfo.customerMobile = res.data.mobilePhone
        // merchantInfo.bank_alias_code = res.data.acctProvinceCode
        merchantInfo.payChannelCode = '1'
        delete merchantInfo.storeUrl
    }
}
init()

const onSubmit = async (values, a) => {
    // history.back()
    const param = Object.assign({
        ...merchantInfo,
        businessLicenseCopy: merchantInfo.businessLicenseCopy.map(el => el.url).join(''),
        idCardCopy: merchantInfo.idCardCopy.map(el => el.url).join(''),
        idCardNational: merchantInfo.idCardNational.map(el => el.url).join(''),
        businessAdditionDesc: merchantInfo.businessAdditionDesc.map(el => el.url).join(',')
    })
    const res = await merchantSave(param)
    if (res.code === '200') {
        if (merchantInfo.operateType === 1) {
            Toast('保存成功')
        } else {
            Toast('提交成功')
        }
        router.back()
    }
}
const onSave = () => {
    merchantInfo.operateType = 1
    onSubmit()
}
</script>

<style lang="scss">
.open-type {
    background: #F4F5F5;
    .flex {
        display: flex;
    }
    .img-icon {
        width: 32px;
        height: 32px;
    }
    .van-nav-bar__text{
        color:#FE7E41
    }
    .van-uploader__preview .van-image{
        width: 200px;
        height: 200px;
    }
    .van-uploader__preview .id-img {
        width: 313px;
        height: 201px;
    }
    .addPhoto-box{
        width: 200px;
        height: 200px;
        background-color: #F7F7F7;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .card {
        .card-title {
            padding: 0 30px;
            line-height: 90px;
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: bold;
            color: #323340;
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
                width: 220px;
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
        .custom-field {
            margin: 0 30px;
            border-bottom: 1px solid #F2F6F9;
            &-row {
                margin-top: 36px;
                justify-content: space-between;
                font-size: 30px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                line-height: 42px;
                .custom-field-a {
                    height: 37px;
                    font-size: 26px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #FE7E41;
                    line-height: 37px;
                    text-decoration: underline;
                }
                .example{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 20px 10px 10px;
                    box-sizing: border-box;
                    .example_item{
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        p{
                            padding: 20px;
                            box-sizing: border-box;
                            font-size: 28px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #494849;
                            line-height: 40px;
                            span {
                                font-size: 28px;
                                font-family: PingFangSC-Regular, PingFang SC;
                                font-weight: 400;
                                color: #191919;
                            }
                        }
                        img {
                            width: 414px;
                        }
                    }
                }
            }
            &-list {
                margin-top: 20px;
                font-size: 24px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #BBBBBB;
            }
            &-item {
                line-height: 33px;
            }
            .uploader-content {
                width: 100%;
                margin: 26px 0 36px;
                // height: 250px;
                .IDimg{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    .IDimg-item{
                        width: 314.82px;
                        // height: 202.46px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        position: relative;
                        .van-image {
                            width: 314.82px;
                            height: 202.46px;
                        }
                        p{
                            font-size: 24px;
                            margin-top: 15px;
                            box-sizing: border-box;
                        }
                    }
                }
            }
        }
        .desc-content {
            margin-top: 20px;
            padding: 37px 30px;
            background: #fff;
            .title {
                height: 42px;
                font-size: 30px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                line-height: 42px;
            }
            .desc {
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #BBBBBB;
                line-height: 37px;
            }
        }
        .agreement-container {
            padding: 36px 30px 25px ;
            font-size: 24px;
            .agreement-box{
                margin-left: 10px;
                .agreement{
                    color: #FE7E41;
                }
            }

        }
        .sub-btn{
            margin-top: 20px;
            width: 100%;
            display: flex;
            .van-button{
                border: none;
            }
        }
    }
    .mt20 {
        margin-top: 20px;
    }
    .ml0 {
        margin-left: 0 !important;
    }
    .mr0 {
        margin-right: 0 !important;
    }
    .pb0 {
        padding-bottom: 0 !important;
    }
}
</style>
