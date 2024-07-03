<template>
    <div class="my-address-page mine-content">
        <van-nav-bar
            :title="(props.busiMerchantId && props.merchantSubId && props.merchantSubType) ? '编辑用户' : '创建用户'"
            fixed
            placeholder
            left-arrow
            @click-left="goBackN"
        >
        </van-nav-bar>
        <van-form ref='form' inset @submit="saveUserAddress">
            <div class="address-box">
                <div v-if="formData.reject" class="reason-for-rejection"><van-icon name="warning" class="icon-img" />驳回原因: {{formData.reject}}</div>
                <div class="address-card">

                    <van-field
                        class="guizhu-field"
                        label-width=max-content
                        v-model="formData.replenishmenttype"
                        is-link
                        readonly
                        name="replenishmenttype"
                        label="用户类型"
                        input-align="right"
                        @click="showPicker4 = true"
                    />
                    <van-popup v-model:show="showPicker4" position="bottom">
                        <van-picker
                            item-height="35px"
                            title="用户类型"
                            default-index="1"
                            :columns="replenishmenttype"
                            @confirm="onScene"
                            @cancel="showPicker4 = false"
                        />
                    </van-popup>
                    <van-field
                        v-if="[1, 2, 3].includes(state.formData.replenishmenttypecode)"
                        label="姓名"
                        label-width=max-content
                        v-model='formData.merchantSubName'
                        maxlength="50"
                        placeholder="请输入真实姓名保存后不可修改"
                        name="merchantSubName"
                        :rules="[{validator: validatorNameReg}]"
                    />
                    <van-field
                        v-if="[1, 2, 3].includes(state.formData.replenishmenttypecode)"
                        label="手机号"
                        label-width=max-content
                        v-model='formData.phoneMobile'
                        maxlength="11"
                        placeholder="请输入手机号"
                        type="digit"
                        name="phoneMobile"
                        :rules="[{validator: validatorPhone}]"
                    />
                    <van-field
                        v-if="[1, 2, 3].includes(state.formData.replenishmenttypecode)"
                        label="身份证号"
                        label-width=max-content
                        v-model='formData.idCard'
                        maxlength="18"
                        placeholder="请输入真实身份证号保存后不能修改"
                        type="text"
                        name="idCard"
                        :rules="[{validator: validatorIdNumber}]"
                    />
                    <van-field name="sex" label="性别" input-align="right" v-if="[1].includes(state.formData.replenishmenttypecode)">
                        <template #input>
                            <van-radio-group v-model="formData.sex" class="cst-radio-group" direction="horizontal">
                                <van-radio :name="1">
                                    <template #icon="props">
                                        <div v-if="props.checked" class="active">男</div>
                                        <div v-else>男</div>
                                    </template>
                                </van-radio>
                                <van-radio :name="2">
                                    <template #icon="props">
                                        <div v-if="!props.checked">女</div>
                                        <div v-else class="active">女</div>
                                    </template>
                                </van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>
                    <van-field
                        v-if="[1].includes(state.formData.replenishmenttypecode)"
                        label="年龄"
                        label-width=max-content
                        v-model='formData.age'
                        maxlength="3"
                        placeholder="请输入年龄"
                        type="digit"
                        name="age"
                        :rules="[{validator: validatorAgeReg}]"
                    />
                    <van-field v-if="[1].includes(state.formData.replenishmenttypecode)" label="职业" :rules="[{validator: validatorOccupationReg}]" label-width=max-content v-model='formData.profession' maxlength="50" placeholder="请输入职业" name="profession"/>
                    <van-field v-if="[1, 2].includes(state.formData.replenishmenttypecode)" label="学历" label-width=max-content v-model='formData.education' maxlength="50" placeholder="请输入学历" :rules="[{validator: validatorEducationReg}]"
                               name="education"/>
                    <van-field name="isExperience" label="有无货运经营" input-align="right" v-if="[1, 2].includes(state.formData.replenishmenttypecode)">
                        <template #input>
                            <van-radio-group v-model="formData.isExperience" class="cst-radio-group" direction="horizontal">
                                <van-radio :name="1">
                                    <template #icon="props">
                                        <div v-if="props.checked" class="active">有</div>
                                        <div v-else>有</div>
                                    </template>
                                </van-radio>
                                <van-radio :name="0">
                                    <template #icon="props">
                                        <div v-if="!props.checked">无</div>
                                        <div v-else class="active">无</div>
                                    </template>
                                </van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>
                    <van-field name="containerOperate" label="货柜运营" input-align="right" v-if="[1, 2].includes(state.formData.replenishmenttypecode)">
                        <template #input>
                            <van-radio-group v-model="formData.containerOperate" class="cst-radio-group" direction="horizontal">
                                <van-radio :name="1">
                                    <template #icon="props">
                                        <div v-if="props.checked" class="active">兼职</div>
                                        <div v-else>兼职</div>
                                    </template>
                                </van-radio>
                                <van-radio :name="2">
                                    <template #icon="props">
                                        <div v-if="!props.checked">全职</div>
                                        <div v-else class="active">全职</div>
                                    </template>
                                </van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>
                    <div class="upload-img" v-if="[1].includes(state.formData.replenishmenttypecode)">
                        <van-field name="uploader" label="授权书照片" label-width=max-content>
                            <template #input>
                                <van-uploader :upload-icon="uploadIcon" v-model="imgvalue" max-count="5" :after-read="afterRead" :before-delete="deleteImage" accept="image/*" />
                            </template>
                        </van-field>
                    </div>

                </div>
            </div>
            <div class="button-box" v-show="state.hideshow">
                <div v-if="state.formData.replenishmenttypecode === 3" class="agreement-container">
                    <van-checkbox v-model="readCheck" checked-color="#FE7E41"></van-checkbox>我已阅读并同意
                    <!-- <router-link to="/agreement/ledger">《创建分账人协议》</router-link> -->
                    <span @click="newPage('/agreement/ledger')">《创建分账人协议》</span>
                </div>
                <van-button color="#FE7E41" block v-if="!isUpdateModel" native-type="submit">{{(props.busiMerchantId && props.merchantSubId && props.merchantSubType) ? '编辑' : '创建'}}</van-button>
            </div>
            <div class="button-box-height"></div>
        </van-form>
    </div>
</template>
<script setup>
import { onMounted, reactive, toRefs, ref, watch, computed } from 'vue'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import { uploadImage, addSubLevel, subLevelListDetails, editSubLevel } from '@/api/subaccountnumber.js'
import { useStore } from 'vuex'
import uploadIcon from '@/assets/addPhoto.png'
import { newPage } from '@/utils/composables'

const store = useStore()
const userInfoV = computed(() => store.state.token)
const accountName = computed(() => store.state.accountName)
const router = useRouter()
// const props = defineProps(['sonType'])
const props = defineProps(['operator', 'busiMerchantId', 'merchantSubId', 'merchantSubType'])

const state = reactive({
    formData: {
        id: '',
        replenishmenttype: '补货员',
        replenishmenttypecode: 2, // code
        merchantSubName: '', // 姓名
        phoneMobile: '', // 手机号
        idCard: '', // 身份证
        sex: 1,
        gendercode: '1', // code
        age: '', // 年龄
        profession: '', // 职业
        education: '', // 学历
        isExperience: 1, // 有无货运经营
        experiencecode: '1', // code
        containerOperate: 1,
        operatecode: '1' // code
    },
    showArea: false,
    // detailAddress: '',
    isUpdateModel: false,
    editData: {},
    oldHeight: document.documentElement.clientHeight,
    docmHeight: document.documentElement.clientHeight,
    hideshow: true
})
const { formData, isUpdateModel } = toRefs(state)
const readCheck = ref(false)
// 过滤
// const formatter = (value) => value.replace(/[^\u4E00-\u9FA5]/g, '')
window.onresize = () => {
    return (() => {
        state.docmHeight = document.body.clientHeight
    })()
}

watch(() => state.docmHeight, (newValue) => {
    if (newValue < state.oldHeight) {
        state.hideshow = false
    } else {
        state.hideshow = true
    }
}, { deep: true })
// 上传
const imgvalue = ref([])
const imgUrl = []
const urlList = ref('')
// 上传图片
const afterRead = async (file) => {
    const fileUrl = file.file
    file.status = 'uploading'
    file.message = '上传中...'
    const formData = new FormData()
    formData.append('file', fileUrl)
    const { data, code } = await uploadImage(formData)
    if (Number(code) === 200) {
        imgUrl.push(data.url)
        urlList.value = imgUrl.join(',')
        // imgvalue.value.push({ url: data.url })
        file.status = 'done'
        file.message = '上传成功'
    } else {
        file.status = 'failed'
        file.message = '上传失败'
    }
}
const deleteImage = (url, index) => {
    imgUrl.splice(index.index, 1)
    urlList.value = imgUrl.join(',')
    return true
}
const showPicker4 = ref(false)
// 类型
const replenishmenttype = [
    { text: '代运营商', code: 1 },
    { text: '补货员', code: 2 },
    { text: '分账人', code: 3 }
]
onMounted(() => {
    if (props.busiMerchantId && props.merchantSubId && props.merchantSubType) {
        getsubLevelListDetailst()
    }
})

const getsubLevelListDetailst = async () => {
    const params = {
        busiCode: 'A1001002',
        appKey: 'A10010043',
        busiMerchantId: props.busiMerchantId,
        operator: accountName.value,
        merchantSubId: props.merchantSubId,
        merchantSubType: props.merchantSubType
    }
    const { data, code } = await subLevelListDetails(params)
    console.log(data, code)
    if (Number(code) === 200) {
        state.formData.id = data.id
        state.formData.reject = data.remark
        state.formData.replenishmenttype = Number(data.merchantSubType) === 1 ? '代运营商' : '补货员 '
        state.formData.replenishmenttypecode = Number(data.merchantSubType)
        state.formData.merchantSubName = data.merchantSubName // 姓名
        state.formData.phoneMobile = data.phoneMobile
        state.formData.idCard = data.idCard
        state.formData.sex = data.sex
        state.formData.age = data.age
        state.formData.profession = data.profession
        state.formData.education = data.education
        state.formData.isExperience = data.isExperience
        state.formData.containerOperate = data.containerOperate
        const arrt = data.licenseAgreementUrl.split(',')
        arrt.map(el => {
            imgUrl.push(el)
        })
        urlList.value = imgUrl.join(',')
        arrt.map(el => {
            imgvalue.value.push({ url: el })
        })
    }
}

const getAddSubLevel = async () => {
    const params = {
        busiCode: 'A1001002',
        appKey: 'A10010043',
        token: userInfoV.value ?? '',
        operator: accountName.value,
        merchantSubType: state.formData.replenishmenttypecode,
        // realRight: state.formData.haveRightscode, // 是否物权
        merchantSubName: state.formData.merchantSubName,
        phoneMobile: state.formData.phoneMobile,
        idCard: state.formData.idCard,
        sex: state.formData.gendercode,
        age: state.formData.age,
        profession: state.formData.profession,
        education: state.formData.education,
        isExperience: state.formData.experiencecode,
        containerOperate: state.formData.operatecode,
        licenseAgreementUrl: urlList.value
    }
    const { code } = await addSubLevel(params)
    if (Number(code) === 200) {
        router.back()
    }
}

// 姓名
const validatorNameReg = (val) => {
    const reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/gi
    if (!reg.test(val)) {
        return '请按照规范，完成姓名填写'
    }
}

// 身份证号
const validatorIdNumber = (val) => {
    const reg = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/gi
    if (!reg.test(val)) {
        return '请按照规范，完成身份证内容填写'
    }
}

// 手机号
const validatorPhone = (val) => {
    const reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/gi
    if (!reg.test(val)) {
        return '请按照规范，完成手机号填写'
    }
}
// 学历
const validatorEducationReg = (val) => {
    const reg = /^([\u4e00-\u9fa5]{2,10})$/gi
    if (!reg.test(val)) {
        return '请按照规范，完成学历信息填写'
    }
}
// 职业
const validatorOccupationReg = (val) => {
    const reg = /^[a-zA-Z\u4e00-\u9fa5]+$/gi
    if (!reg.test(val)) {
        return '请按照规范，完成职业信息填写'
    }
}

const validatorAgeReg = val => {
    const reg = /\d/gi
    if (!reg.test(val)) {
        return '请按照规范，完成年龄填写'
    }
}
// 新增保存用户地址
const saveUserAddress = async (val) => {
    console.log(val, '11')
    if (state.formData.replenishmenttypecode === 1 && urlList.value === '') {
        Toast('请按照规范，完成授权协议照片上传')
        return false
    }
    if (state.formData.replenishmenttypecode === 3 && !readCheck.value) {
        Toast('请阅读并同意创建分账人协议')
        return false
    }
    if (props.busiMerchantId && props.merchantSubId && props.merchantSubType) {
        const params = {
            busiCode: 'A1001002',
            appKey: 'A10010043',
            token: userInfoV.value ?? '',
            operator: accountName.value,
            id: state.formData.id,
            busiMerchantId: props.busiMerchantId,
            merchantSubId: props.merchantSubId,
            merchantSubType: state.formData.replenishmenttypecode,
            ...val,
            licenseAgreementUrl: urlList.value
        }
        const { code } = await editSubLevel(params)
        if (Number(code) === 200) {
            router.back()
        }
    } else {
        // getAddSubLevel()
        console.log(getAddSubLevel)
        const params = {
            busiCode: 'A1001002',
            appKey: 'A10010043',
            token: userInfoV.value ?? '',
            operator: accountName.value,
            merchantSubType: state.formData.replenishmenttypecode,
            ...val,
            licenseAgreementUrl: urlList.value
        }
        const { code } = await addSubLevel(params)
        if (Number(code) === 200) {
            router.back()
        }
    }
}
// 补货员类型
const onScene = (val) => {
    state.formData.replenishmenttype = val.text
    state.formData.replenishmenttypecode = val.code
    showPicker4.value = false
}
const goBackN = () => {
    router.back()
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

::v-deep(.van-nav-bar .van-icon) {
    font-size: 35px;
    color: #000;
    font-weight: bold;
}
::v-deep(.van-nav-bar__text) {
    font-size: 30px;
    color: #FE7E41;
    font-weight: 400;
}
.van-field__control::input-placeholder {
    font-size: 30px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #BBBBBB;
}
.my-address-page{
    // min-height: 100vh;
    background: #F7F7F7;
    .address-box{
        ::v-deep(.van-nav-bar .van-icon) {
            color: #000!important;
        }
        ::v-deep(.van-nav-bar__content) {
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            height: 88px;
            background: #fff;
            font-weight: 600;
            color: #000000;
            line-height: 48px;
        }
        .reason-for-rejection {
            margin-top: 25px;
            font-size: 24px;
            font-weight: 400;
            color: #FE7E41;
            padding: 0 16px;
            // text-align: center;
            .icon-img {
                font-size: 26px;
                margin-right: 8px;
            }
        }
        .top-box {
            width: 100%;
            height: 88px;
            font-size: 34px;
            font-weight: 600;
            color: #000000;
        }
        .address-card{
            background: #FFFFFF;
            // padding: 0 0 21px 0;
            margin: 20px 0;
            ::v-deep(.van-field) {
                padding: 36px 30px;
                font-size: 30px;
                font-weight: 400;
                align-items: center;
            }
            ::v-deep(.van-cell__value) {
                margin-top: 0;
            }
            van-form{
                width: 100%!important;
                .van-switch--on{
                    :deep(.van-switch__node){
                        background: #E74D09;
                    }
                }
                :deep(.van-cell__title){
                    font-size: 28px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #222222;
                    line-height: 40px;
                }
                :deep(.van-cell__value){
                    font-size: 28px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    line-height: 40px;
                }
            }
            .address-card-left{
                width: 90%;
                .address-card-top{
                    .address-card-text{
                        font-size: 28px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 800;
                        color: #222222;
                        line-height: 40px;
                        .address-mr{
                            font-size: 20px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 800;
                            color: #E74D09;
                            padding: 4px 8px;
                            line-height: 20px;
                            border-radius: 4px;
                            border: 2px solid #E74D09;
                        }
                    }
                }
                .address-card-bottom{
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 800;
                    color: #666666;
                    line-height: 34px;
                }
            }
            .address-card-right{
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                display: flex;
                align-items: center;
                padding: 0 var(--van-padding-md);
                font-size: var(--van-font-size-md);
            }
            .guizhu-childen:after {
                display: none;
            }
        }
    }
    .button-box{
        // background-color: #fff;
        height: 92px;
        // border-radius: 46px;
        padding: 16px 60px;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding-bottom: calc(16px + constant(safe-area-inset-bottom));
        padding-bottom: calc(16px + env(safe-area-inset-bottom));
        background: #F7F7F7;
        .van-button{
            height: 92px;
            border-radius: 46px;
            font-size: 32px;
            font-weight: 500;
            color: #FFFFFF;
        }
        .agreement-container {
            width: 630px;
            box-sizing: border-box;
            position: absolute;
            top: -80px;
            display: flex;
            height: 36px;
            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            justify-content: center;
            .van-checkbox {
                margin-right: 6px;
            }
            span {
                color: #FE7E41;
            }
        }
    }
    .button-box-height{
        width: 100%;
        height: 112px;
        padding-bottom: 16px;
        padding-bottom: calc(16px + constant(safe-area-inset-bottom));
        padding-bottom: calc(16px + env(safe-area-inset-bottom));
    }
}
:deep(.van-field__body){
    input{
        text-align: right;
    }
}
::v-deep(.van-picker__toolbar) {
    height: 131px;
    border-bottom: 1px solid #E7E7E7;
}
::v-deep(.van-picker__confirm) {
    color: #E74D09;
    font-size: 30px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
}
::v-deep(.van-picker-column__item) {
    font-size: 34px;
}
::v-deep(.van-picker-column__item--selected) {
    color: #E74D09;
}
::v-deep(.van-picker__title) {
    font-size: 32px;
    font-weight: 700;
    font-family: PingFangSC-Medium, PingFang SC;
    color: #191919;
}
::v-deep(.van-field__body) {
    height: 100%;
}
::v-deep(.van-nav-bar__title) {
    font-size: 34px;
    font-weight: 600;
    color: #000000;
    height: 88px;
    line-height: 88px;
}
::v-deep(.van-icon-arrow-left:before) {
    font-size: 35px;
}
::v-deep(.van-field__label) {
    display: flex;
    align-items: center;
    color: #000000!important;
}
.upload-img ::v-deep(.van-cell) {
    flex-direction: column;
}
.upload-img ::v-deep(.van-field) {
    align-items: flex-start!important;
}
::v-deep(.van-uploader__wrapper) {
    justify-content: left;
    flex-wrap: wrap;
}
::v-deep(.van-uploader__preview) {
    margin: 15px 15px 0 0;
}
::v-deep(.van-uploader__preview-image) {
    width: 190px;
    height: 190px;
    background: #F7F7F7;
    border-radius: 8px;
}
// ::v-deep(.van-uploader__preview:nth-child(2)) {
//     margin: 15px 0 0 0;
// }
::v-deep(.van-uploader__preview-delete--shadow) {
    border-radius: 0 8px 0 24px;
}
::v-deep(.van-uploader__upload) {
    margin: 15px 15px 0 0;
    width: 190px;
    height: 190px;
    background: #F7F7F7;
    border-radius: 8px;
    order:-1;
}
::v-deep(.van-cell__value:last-child) {
    margin: 11px 0 0 0;
}
// 字体大小
::v-deep(.van-field__label) {
    height: 37px;
    font-size: 26px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 37px;
}
</style>

<style lang="scss">
// 自定义单选框
.cst-radio-group {
    text-align: center;
    height: 48px;
    line-height: 48px;
    border-radius: 12px;
    box-sizing: border-box;
    border: 1px solid #FE7E41;
    .van-radio {
        position: relative;
        // top: -1px;
        left: -1px;
        margin-right: unset;
        border-radius: 12px 0 0 12px;
        &:last-child {
            position: relative;
            left: unset;
            // top: -1px;
            right: -2px;
            margin-right: unset;
            border-radius: 0 12px 12px 0;
        }
        .van-radio__icon {
            padding: 10px 20px;
            font-size: 26px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
        }
        .van-radio__icon--checked {
            background: #FE7E41;
            color: #fff;
        }
    }
}
</style>
