<template>
    <div class="sign-contract">
        <van-nav-bar fixed placeholder :title="$route.meta.title" z-index="10" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="closePage">
                    <van-image :src="require('@/assets/back-icon-order.png')" />
                </div>
            </template>
        </van-nav-bar>
        <van-tabs v-model:active="active" title-active-color="#FE7E41" title-inactive-color="#191919" :sticky="true" color="#FD7E41" @click-tab="onClickTab">
            <van-tab v-for="tab in tabs" :key="tab.name" :name="tab.name" :title="tab.label">
                <van-collapse v-model="subject" v-if="active === 0 && dataState.acoType === 2">
                    <van-collapse-item title="主体信息" class="con-block" name="1" :is-link="false">
                        <div class="detail-text">
                            <p class="tit">主体类型</p>
                            <p class="con">{{ dataState.merchantType[dataState.data.merchantCertInfo.merchantType] }}</p>
                        </div>
                        <div class="detail-img">
                            <p class="tit">身份证正反照片</p>
                            <div class="con">
                                <div class="con-item">
                                    <van-uploader v-model="IDCode" :disabled="false" :deletable="false" multiple accept="image/*" :max-count="1" />
                                    <p>重新扫描身份证正面</p>
                                </div>
                                <div class="con-item">
                                    <van-uploader v-model="IDCodeBack" :disabled="false" :deletable="false" multiple accept="image/*" :max-count="1" />
                                    <p>重新扫描身份证正面</p>
                                </div>
                            </div>
                        </div>
                        <div class="detail-text">
                            <p class="tit">姓名</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.legalName }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">手机号</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.merchantMobile }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">证件类型</p>
                            <p class="con">{{ dataState.certificateType[dataState.data.merchantCertInfo.certificateType] }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">证件号码</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.certificateNo }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">证件有效起始时间</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.validBeginTime }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">证件有效截止时间</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.validEndTime }}</p>
                        </div>
                    </van-collapse-item>
                </van-collapse>
                <van-collapse v-model="account" v-if="active === 0 && dataState.acoType === 2">
                    <van-collapse-item title="账户信息" class="con-block" name="1" :is-link="false">
                        <div class="detail-text">
                            <p class="tit">账户姓名</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.bankAcctName }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">银行账户</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.bankNumber }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">开户银行</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.openBank }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">银行预留手机号</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.bankPhone }}</p>
                        </div>
                    </van-collapse-item>
                </van-collapse>
                <van-collapse v-model="account" v-if="active === 0 && (dataState.acoType === 3 || dataState.acoType === 1)">
                    <van-collapse-item title="账户信息" class="con-block" name="1" :is-link="false">
                        <div class="detail-text">
                            <p class="tit">主体类型</p>
                            <p class="con">{{ dataState.merchantType[dataState.data.merchantCertInfo.merchantType] }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">营业执照类型</p>
                            <p class="con">{{ dataState.businessLicenseType[dataState.data.merchantCertInfo.businessLicenseType] }}</p>
                        </div>
                        <div class="detail-img">
                            <p class="tit">营业执照<span>支持OCR识别</span></p>
                            <div class="con">
                                <div class="con-item">
                                    <van-uploader v-model="license" :disabled="false" :deletable="false" multiple accept="image/*" :max-count="1" />
                                    <span>支持扩展名：jpg、jpeg、png，文件最大不超过2M</span>
                                </div>
                            </div>
                        </div>
                        <div class="detail-text">
                            <p class="tit">企业名称</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.merchantName }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">统一社会信用代码</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.uniqueCode }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">企业注册时间</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.regDate }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">企业经营地区</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.countyName }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">详细地址</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.merchAddress }}</p>
                        </div>
                    </van-collapse-item>
                </van-collapse>
                <van-collapse v-model="account" v-if="active === 0 && (dataState.acoType === 3 || dataState.acoType === 1)">
                    <van-collapse-item title="账户信息" class="con-block" name="1" :is-link="false">
                        <div class="detail-img">
                            <p class="tit">身份证正反照片<span>支持OCR识别</span></p>
                            <div class="con">
                                <div class="con-item">
                                    <van-uploader v-model="IDCode" :disabled="false" :deletable="false" multiple accept="image/*" :max-count="1" />
                                    <p>重新扫描身份证正面</p>
                                </div>
                                <div class="con-item">
                                    <van-uploader v-model="IDCodeBack" :disabled="false" :deletable="false" multiple accept="image/*" :max-count="1" />
                                    <p>重新扫描身份证正面</p>
                                </div>
                            </div>
                        </div>
                        <div class="detail-text">
                            <p class="tit">姓名</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.merchantName }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">手机号</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.phoneMobile }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">证件类型</p>
                            <p class="con">{{ dataState.certificateType[dataState.data.merchantCertInfo.certificateType] }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">证件号码</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.certificateNo }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">证件有效起始时间</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.validBeginTime }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">证件有效截止时间</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.validEndTime }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit"></p>
                            <p class="con">
                                <van-checkbox class="agm-checkbox" v-model="dataState.isLongTime" :disabled="true" checked-color="#FE7E41">长期有效</van-checkbox>
                            </p>
                        </div>
                    </van-collapse-item>
                </van-collapse>
                <van-collapse v-model="account" v-if="active === 0 && (dataState.acoType === 3 || dataState.acoType === 1)">
                    <van-collapse-item title="结算信息" class="con-block" name="1" :is-link="false">
                        <div class="detail-text">
                            <p class="tit">银行卡类型</p>
                            <p class="con">
                                <van-radio-group v-model="dataState.bankCardType" :disabled="true" direction="horizontal" checked-color="#FE7E41">
                                    <van-radio name="1">对公</van-radio>
                                    <van-radio name="2" v-if="dataState.acoType === 3">对私(法人银行卡)</van-radio>
                                </van-radio-group>
                            </p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">账户姓名</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.bankAcctName }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">银行账户</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.bankNumber }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">开户银行</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.openBank }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">银行预留手机号</p>
                            <p class="con">{{ dataState.data.merchantCertInfo.bankPhone }}</p>
                            <!-- <p class="selected">点击查询</p> -->
                        </div>
                    </van-collapse-item>
                </van-collapse>
                <van-collapse v-model="account" v-if="active === 1">
                    <van-collapse-item title="业务信息" class="con-block" name="1" :is-link="false">
                        <div class="detail-text">
                            <p class="tit">业务线</p>
                            <p class="con">{{ dataState.busiType[dataState.data.merchantBusiInfo.busiCode] }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">销售人员推广码</p>
                            <p class="con">{{ dataState.data.merchantBusiInfo.promoCode }}</p>
                        </div>
                    </van-collapse-item>
                </van-collapse>
                <van-collapse v-model="account" v-if="active === 1">
                    <van-collapse-item title="联系人信息" class="con-block" name="1" :is-link="false">
                        <div class="detail-text">
                            <p class="tit">姓名</p>
                            <p class="con">{{ dataState.data.merchantBusiInfo.contactName }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">手机号</p>
                            <p class="con">{{ dataState.data.merchantBusiInfo.contactMobile }}</p>
                        </div>
                    </van-collapse-item>
                </van-collapse>
                <van-collapse v-model="account" v-if="active === 1">
                    <van-collapse-item title="主体标签" class="con-block" name="1" :is-link="false">
                        <div class="detail-text">
                            <p class="tit">主体标签</p>
                            <p class="con">
                                <Tag :show="show" v-for="item in dataState.data.merchantBusiInfo.labelList" :key="item" closeable size="medium" type="warning" @close="close(item)">
                                    {{ item.labelName }}
                                </Tag>
                            </p>
                        </div>
                    </van-collapse-item>
                </van-collapse>
                <van-collapse v-model="account" v-if="active === 2">
                    <van-collapse-item title="经营信息" class="con-block" name="1" :is-link="false">
                        <div class="detail-text">
                            <p class="tit">商户类型</p>
                            <p class="con">{{ dataState.merchantClassify[dataState.data.merchantDatumInfo.merchantClassify] }}</p>
                        </div>
                        <div class="detail-text" v-if="dataState.busiLine !== 'A1001002'">
                            <p class="tit">商户经营类目</p>
                            <p class="con">{{ dataState.merchantBusiCateList }}</p>
                        </div>
                    </van-collapse-item>
                </van-collapse>
                <van-collapse v-model="account" v-if="active === 2">
                    <van-collapse-item title="平台服务费信息" class="con-block" name="1" :is-link="false">
                        <div class="detail-text autoHeight">
                            <div v-for="item in dataState.rate" :key="item">
                                <p>
                                    {{ item.cost }}
                                </p>
                                <p>
                                    <span v-for="litem in item.rate" :key="litem">{{ litem.text + ' :  ' + litem.value }}</span>
                                </p>
                            </div>
                        </div>
                    </van-collapse-item>
                </van-collapse>
                <van-collapse v-model="account" v-if="active === 2 && dataState.busiLine !== 'A1001002'">
                    <van-collapse-item title="税务信息" class="con-block" name="1" :is-link="false">
                        <div class="detail-text">
                            <p class="tit">发票类型</p>
                            <p class="con">{{ dataState.invoiceType[dataState.data.merchantDatumInfo.invoiceType] }}</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">税点</p>
                            <p class="con">{{ dataState.data.merchantDatumInfo.taxRate }}%</p>
                        </div>
                        <div class="detail-text">
                            <p class="tit">纳税类型</p>
                            <p class="con">{{ dataState.taxType[dataState.data.merchantDatumInfo.taxType] }}</p>
                        </div>
                    </van-collapse-item>
                </van-collapse>
                <van-collapse v-model="account" v-if="active === 2 && dataState.busiLine !== 'A1001002'">
                    <van-collapse-item title="经营资质" class="con-block" name="1" :is-link="false">
                        <div class="detail-tips">
                            <p>说明：需要提供有效证件，或监管部门认可的具有同等法律效力的其他证件。</p>
                            <p>1、支持扩展名：jpg、jpeg、png，文件最大不超过2M；</p>
                            <p>2、最多不超过3张图片；</p>
                        </div>
                        <div class="detail-img" v-for="item of merchantCertUrlList" :key="item">
                            <p class="tit">{{ item[1].list.certName }}</p>
                            <div class="con">
                                <div class="con-item">
                                    <van-uploader v-model="item[0]" :disabled="false" :deletable="false" multiple accept="image/*" :max-count="3" />
                                </div>
                            </div>
                        </div>
                    </van-collapse-item>
                </van-collapse>
            </van-tab>
        </van-tabs>
        <div class="distance"></div>
        <div class="button-box">
            <div class="agm" @click="gotoAfreement" v-if="dataState.template.length">
                <van-checkbox class="agm-checkbox" v-model="dataState.checked" checked-color="#FE7E41">
                    已阅读并同意<span v-for="item in dataState.template" :key="item">《{{ item }}》</span>
                </van-checkbox>
            </div>
            <div class="btn" @click="confirm">立即提交</div>
        </div>
        <div class="button-box-height"></div>
        <van-dialog v-model:show="dataState.show" title="发送验证码" show-cancel-button @confirm="getBindBank">
            <p class="phone">请填写手机号{{ dataState.mobile }}收到的验证码</p>
            <!-- <p class="phone">请填写手机号123123123123收到的验证码</p> -->
            <div class="code_btn">
                <input maxlength="6" placeholder="请输入验证码" class="code" v-model="dataState.codeVal" />
                <p class="get_code" v-if="countDownText === ''" @click="reSendSms">获取验证码</p>
                <p class="reget_code" v-if="countDownText !== ''">{{ countDownText }}后重试</p>
            </div>
        </van-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { closePage } from '@/utils/composables'
import { getDetail, contractTemplate, accountFlow, sendSms, bindBank, queryPlatFee, applyAuditCommit } from '@/api/sign-contract'
import { useRoute, useRouter } from 'vue-router'
import { Toast, Tag } from 'vant'
const route = useRoute()
const router = useRouter()
const active = ref(0)
// tab页
// const pageSize = ref(10)
const tabs = ref([
    { label: '基本信息', name: 0 },
    { label: '业务信息', name: 1 },
    { label: '经营信息', name: 2 }
])
const subject = ref(['1'])
const account = ref(['1'])
const countDown = ref(60)
const countDownText = ref('(60s)')
const timer = ref(null)
const dataState = ref({
    checked: false,
    isLongTime: false,
    acoType: '企业',
    bankCardType: '1',
    busiLine: '',
    data: '',
    merchantType: {
        1: '企业',
        2: '个人',
        3: '个体工商户'
    },
    certificateType: {
        1: '身份证',
        2: '户口本'
    },
    businessLicenseType: {
        1: '普通营业执照',
        2: '多证合一营业执照'
    },
    busiType: {
        A1001001: '到家电商/平台商家',
        A1001002: '智能货柜',
        A1001005: 'B2B商城',
        A1001009: '供应商',
        A1001003: '本地生活',
        A1001011: '推广公司'
    },
    merchantClassify: {
        1: '柜主',
        2: '厂商',
        3: '批发商',
        4: '平台商家',
        5: '品牌加盟商',
        6: '全国直营连锁',
        7: '本地直营连锁',
        8: '品牌单店',
        9: '个体小店',
        10: '推广公司',
        11: '供应商',
        12: '经销商'
    },
    invoiceType: {
        1: '普通发票',
        2: '增值税普通发票',
        3: '增值税专用发'
    },
    taxType: {
        1: '一般纳税人',
        2: '小规模纳税人'
    },
    merchantBusiCateList: [],
    template: [],
    show: false,
    bandId: '',
    codeVal: '',
    bankNo: '',
    rate: [],
    mobile: ''
})
// tabs 切换
const onClickTab = async (val) => {}
// 验证码弹窗
const verPop = () => {
    dataState.value.show = !dataState.value.show
}
const confirm = async () => {
    if (dataState.value.checked) {
        // verPop()
        getCode()
    } else {
        Toast.fail('请先确认协议！')
    }
}
const applyAuditCommitFn = async () => {
    const param = {
        busiCode: route.params.busi,
        busiMerchantId: route.params.id,
        modifierId: dataState.value.data.merchantCertInfo.phoneMobile,
        modifierName: dataState.value.data.merchantCertInfo.phoneMobile
    }
    const res = await applyAuditCommit(param)
    if (res.code === '200') {
        Toast.success('提交成功！')
    }
}
const queryPlatFeeFn = async (catesList) => {
    const param = {
        merchantId: dataState.value.data.merchantCertInfo?.merchantId,
        busiCode: route.params.busi,
        merchantBusiCatesList: catesList
    }
    const res = await queryPlatFee(param)
    console.log(res, 'queryPlatFeequeryPlatFeequeryPlatFeequeryPlatFee')
    if (res.code === '200') {
        const list = res.data.list
        dataState.value.rate = []
        list.map((item) => {
            item.feeCateValue.map((lItem) => {
                dataState.value.rate.push({
                    cost: '费率',
                    rate: [
                        {
                            text: [lItem.firstCateName, lItem.secondCateName, lItem.thirdCateName].join('/'),
                            value: lItem.value
                        }
                    ]
                })
            })
        })
    }
}
// 账户详情
const getMaDatail = async () => {
    const param = {
        busiCode: route.params.busi,
        appKey: 'A1001001',
        busiMerchantId: route.params.id
    }
    const res = await getDetail(param)
    if (res.code === '200') {
        console.log(res)
        const data = res.object
        dataState.value.data = data
        dataState.value.acoType = data.merchantCertInfo.merchantType
        dataState.value.busiLine = data.merchantCertInfo.busiCode
        dataState.value.isLongTime = data.merchantCertInfo.isLongTime
        dataState.value.bankCardType = data.merchantCertInfo.bindType
        IDCode.value = [
            {
                url: data.merchantCertInfo.idCardFrontUrl
            }
        ]
        IDCodeBack.value = [
            {
                url: data.merchantCertInfo.idCardReverseUrl
            }
        ]
        license.value = [
            {
                url: data.merchantCertInfo.businessLicenseUrl
            }
        ]
        for (let i = 0; i < data.merchantDatumInfo.merchantCertUrlList.length; i++) {
            const list = data.merchantDatumInfo.merchantCertUrlList[i]
            merchantCertUrlList.value.push([[{ url: list.certUrlList }], { list }])
        }
        dataState.value.merchantBusiCateList = getCateListData(data.merchantDatumInfo.merchantBusiCateList)
        queryPlatFeeFn(data.merchantDatumInfo.merchantBusiCateList)
    }
}

const getCateListData = (data) => {
    const re = []
    data = data[0]
    data.secondCateList.map((item, index) => {
        re[index] = []
        re[index].push(data.firstCateName)
        re[index].push(item.secondCateName)
        item.thirdCateList.map((tItem) => {
            re[index].push(tItem.thirdCateName)
        })
    })
    return re[0].join('/')
}
const getContractTemplate = async () => {
    const param = {
        busiCode: route.params.busi,
        busiMerchantId: route.params.id
    }

    const res = await contractTemplate(param)
    if (res.code === '200') {
        const list = res.data.list
        for (let i = 0; i < list.length; i++) {
            dataState.value.template.push(list[i].templateName)
        }
        if (!list.length) {
            dataState.value.checked = true
        }
    }
}
onMounted(() => {
    getMaDatail()
    getContractTemplate()
    if (route.params.flag) {
        dataState.value.checked = true
    }
})
const countDownFn = () => {
    clearInterval(timer.value)
    timer.value = setInterval(() => {
        --countDown.value
        countDownText.value = '(' + countDown.value + 's)'
        if (countDown.value <= 0) {
            clearInterval(timer.value)
            countDownText.value = ''
            countDown.value = 60
        }
    }, 1000)
}
const getBindBank = async () => {
    const param = {
        mainUserId: dataState.value.data.merchantCertInfo?.merchantId,
        bankNo: dataState.value.bankNo,
        sendSms: dataState.value.codeVal
    }
    const res = await bindBank(param)
    if (res.code === '200') {
        applyAuditCommitFn()
    }
}
const getCode = async () => {
    const param = {
        busiCode: route.params.busi,
        merchantId: dataState.value.data.merchantCertInfo?.merchantId,
        busiMerchantId: dataState.value.data.merchantBusiInfo?.busiMerchantId
    }
    const res = await accountFlow(param)
    if (res.code === '200') {
        const data = res.data
        if (data.flow) {
            verPop()
            countDownFn()
            // dataState.value.bandId = res.data.bandId
            dataState.value.bankNo = res.data.bankNo
            dataState.value.mobile = res.data.mobile
        } else {
            applyAuditCommitFn()
        }
    } else {
        Toast.fail(res.msg || '绑卡失败！')
    }
}
const reSendSms = async () => {
    const param = {
        busiCode: route.params.busi,
        merchantId: dataState.value.data.merchantCertInfo?.merchantId,
        busiMerchantId: dataState.value.data.merchantBusiInfo?.busiMerchantId // ,
        // bindId: dataState.value.bandId
    }
    const res = await sendSms(param)
    if (res.code === '200') {
        countDownFn()
    }
}
const gotoAfreement = () => {
    router.push({ name: 'agreement-detail', params: { id: route.params.id, busi: route.params.busi } })
}
const close = (code) => {
    const list = dataState.value.data.merchantBusiInfo.labelList
    for (let a = 0; a < list.length; a++) {
        if (list[a].labelId === code.labelId) {
            list.splice(a, 1)
        }
    }
}
const merchantCertUrlList = ref([])
const IDCode = ref([])
const IDCodeBack = ref([])
const license = ref([])
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
.sign-contract {
    width: 100%;
    .van-nav-bar__placeholder {
        :deep(.van-nav-bar) {
            padding-top: var(--van-status-bar-height);
            background-color: #fff;
            .icon--unselect {
                .van-image {
                    width: 19px;
                    height: 31px;
                }
            }
        }
        :deep(.van-nav-bar::after) {
            content: initial;
        }
    }
    :deep(.van-collapse-item__content) {
        padding: 0;
    }
    :deep(.van-cell) {
        &::after {
            border: none;
        }
    }
    :deep(.van-cell__title) {
        span {
            width: 144px;
            height: 48px;
            font-size: 36px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #191919;
            line-height: 48px;
        }
    }
    .con-block {
        margin: 20px 0;
    }
    .detail-tips {
        background: linear-gradient(270deg, #fff9f6 0%, #fff1ea 100%);
        padding: 20px 30px;
        box-sizing: border-box;
        p {
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 32px;
        }
    }
    .detail-text {
        height: 114px;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 56px 0 30px;
        box-sizing: border-box;
        position: relative;
        &::after {
            position: absolute;
            box-sizing: border-box;
            content: ' ';
            pointer-events: none;
            right: var(--van-padding-md);
            left: var(--van-padding-md);
            border-bottom: 1px solid var(--van-cell-border-color);
            transform: scaleY(0.5);
            bottom: 0;
        }
        .tit {
            font-size: 30px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #191919;
            line-height: 42px;
        }
        .con {
            font-size: 30px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 42px;
        }
        .selected {
            font-size: 30px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #fe7e41;
            line-height: 42px;
        }
    }
    .autoHeight {
        height: auto;
        display: block;
        padding-bottom: 36px;
    }
    .detail-img {
        background: #ffffff;
        padding: 36px 56px 0 30px;
        box-sizing: border-box;
        position: relative;
        &::after {
            position: absolute;
            box-sizing: border-box;
            content: ' ';
            pointer-events: none;
            right: var(--van-padding-md);
            left: var(--van-padding-md);
            border-bottom: 1px solid var(--van-cell-border-color);
            transform: scaleY(0.5);
            bottom: 0;
        }
        .tit {
            font-size: 30px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #191919;
            line-height: 42px;
            span {
                font-size: 24px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                line-height: 34px;
                margin-left: 8px;
            }
        }
        .con {
            font-size: 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            display: flex;
            .con-item {
                flex: 1;
                margin-top: 32px;
                display: flex;
                flex-direction: column;
                img {
                    margin: auto;
                }
                p {
                    height: 34px;
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #696969;
                    line-height: 34px;
                    margin-top: 16px;
                    margin-bottom: 36px;
                    text-align: center;
                }
                span {
                    font-size: 20px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #999999;
                    line-height: 28px;
                    margin-top: 20px;
                    margin-bottom: 36px;
                    display: block;
                }
            }
        }
    }
    .distance {
        height: 132px;
    }
    .button-box {
        // background-color: #fff;
        // padding: 16px 0;
        height: 264px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, #ffffff 100%);
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
        // display: flex;
        .agm {
            margin: 0 10px 0 0;
            .agm-checkbox {
                transform: scale(0.8);
                transform-origin: left;
                span {
                    color: #fe7e41;
                }
            }
        }
        .van-button {
            height: 98px;
            // border-radius: 40px;
            font-size: 30px;
            font-weight: 400;
            color: #ffffff;
        }
        .btn-delete {
            color: #e74d09;
        }
        .btn {
            width: 630px;
            height: 92px;
            background: linear-gradient(90deg, #fe7e41 0%, #ff5d0f 100%, #ff5c0e 100%);
            border-radius: 46px;
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
            line-height: 92px;
            text-align: center;
            margin: 26px auto 0;
        }
    }
    .button-box-height {
        width: 100%;
        height: 112px;
        padding-bottom: 16px;
        padding-bottom: calc(16px + constant(safe-area-inset-bottom));
        padding-bottom: calc(16px + env(safe-area-inset-bottom));
    }
    .phone {
        width: 480px;
        height: 96px;
        background: #ffffff;
        border-radius: 16px;
        font-size: 32px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #696969;
        background-size: 28px 36px;
        box-sizing: border-box;
        margin: auto;
    }
    .code_btn {
        padding-left: 82px;
        width: 480px;
        height: 96px;
        display: flex;
        align-items: center;
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid #cccccc;
        background: url('~@/assets/verCode.png') 32px center no-repeat;
        background-size: 28px 36px;
        box-sizing: border-box;
        margin: 40px auto 40px;
        .code {
            width: 200px;
            height: 90px;
            font-size: 32px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #cccccc;
            border: none;
        }
        .code::-webkit-input-placeholder {
            /*WebKit browsers*/
            font-size: 30px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #c9c9c9;
            line-height: 42px;
        }
        .code::-moz-input-placeholder {
            /*Mozilla Firefox*/
            font-size: 30px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #c9c9c9;
            line-height: 42px;
        }

        .code::-ms-input-placeholder {
            /*Internet Explorer*/
            font-size: 30px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #c9c9c9;
            line-height: 42px;
        }
        .get_code {
            width: 180px;
            height: 64px;
            background: #f8cebb;
            border-radius: 8px;
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #fe7e41;
            line-height: 64px;
            text-align: center;
        }
        .reget_code {
            width: 180px;
            height: 64px;
            background: #f0f0f0;
            border-radius: 8px;
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 64px;
            text-align: center;
        }
    }
}
</style>
