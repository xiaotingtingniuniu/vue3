<template>
    <div class="my-address-page mine-content">
        <van-nav-bar
            title="创建用户"
            fixed
            placeholder
            left-arrow
            @click-left="goBackN"
        >
        </van-nav-bar>
        <van-form ref='form' inset @submit="saveUserAddress">
            <div class="address-box">
                <div class="address-card">

                    <van-field
                        class="guizhu-field"
                        label-width=max-content
                        v-model="formData.replenishmenttype"
                        is-link
                        readonly
                        name="picker"
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
                        v-model='formData.name'
                        maxlength="50"
                        placeholder="请输入姓名"
                        name="name"
                        :rules="[{validator: validatorNameReg}]"
                    />
                    <van-field
                        v-if="[1, 2, 3].includes(state.formData.replenishmenttypecode)"
                        label="手机号"
                        label-width=max-content
                        v-model='formData.phone'
                        maxlength="11"
                        placeholder="请输入手机号"
                        type="digit"
                        name="phone"
                        :rules="[{validator: validatorPhone}]"
                    />
                    <van-field
                        v-if="[1, 2, 3].includes(state.formData.replenishmenttypecode)"
                        label="身份证号"
                        label-width=max-content
                        v-model='formData.idnumber'
                        maxlength="18"
                        placeholder="请输入身份证号"
                        type="text"
                        name="idnumber"
                        :rules="[{validator: validatorIdNumber}]"
                    />
                    <!-- <van-field
                        v-if="[1].includes(state.formData.replenishmenttypecode)"
                        class="guizhu-field"
                        label-width=max-content
                        v-model="formData.gender"
                        is-link
                        readonly
                        name="picker"
                        label="性别"
                        input-align="right"
                        @click="showPicker1 = true"
                    /> -->
                    <van-field name="gender" label="性别" input-align="right" v-if="[1].includes(state.formData.replenishmenttypecode)">
                        <template #input>
                            <van-radio-group v-model="formData.gender" class="cst-radio-group" direction="horizontal">
                                <van-radio name="1">
                                    <template #icon="props">
                                        <div v-if="props.checked" class="active">男</div>
                                        <div v-else>男</div>
                                    </template>
                                </van-radio>
                                <van-radio name="2">
                                    <template #icon="props">
                                        <div v-if="!props.checked">女</div>
                                        <div v-else class="active">女</div>
                                    </template>
                                </van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>
                    <van-popup v-model:show="showPicker1" position="bottom">
                        <van-picker
                            item-height="35px"
                            title="性别"
                            :columns="gender"
                            @confirm="onGender"
                            @cancel="showPicker1 = false"
                        />
                    </van-popup>
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
                    <van-field v-if="[1].includes(state.formData.replenishmenttypecode)" label="职业" :rules="[{validator: validatorOccupationReg}]" label-width=max-content v-model='formData.occupation' maxlength="50" placeholder="请输入职业" name="occupation"/>
                    <van-field v-if="[1, 2].includes(state.formData.replenishmenttypecode)" label="学历" label-width=max-content v-model='formData.education' maxlength="50" placeholder="请输入学历" :rules="[{validator: validatorEducationReg}]"
                               name="education"/>
                    <van-field name="radio" label="有无货运经营" input-align="right" v-if="[1, 2].includes(state.formData.replenishmenttypecode)">
                        <template #input>
                            <van-radio-group v-model="formData.experience" class="cst-radio-group" direction="horizontal">
                                <van-radio name="1">
                                    <template #icon="props">
                                        <div v-if="props.checked" class="active">有</div>
                                        <div v-else>有</div>
                                    </template>
                                </van-radio>
                                <van-radio name="0">
                                    <template #icon="props">
                                        <div v-if="!props.checked">无</div>
                                        <div v-else class="active">无</div>
                                    </template>
                                </van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>
                    <van-field name="radio" label="货柜运营" input-align="right" v-if="[1, 2].includes(state.formData.replenishmenttypecode)">
                        <template #input>
                            <van-radio-group v-model="formData.operate" class="cst-radio-group" direction="horizontal">
                                <van-radio name="1">
                                    <template #icon="props">
                                        <div v-if="props.checked" class="active">兼职</div>
                                        <div v-else>兼职</div>
                                    </template>
                                </van-radio>
                                <van-radio name="2">
                                    <template #icon="props">
                                        <div v-if="!props.checked">全职</div>
                                        <div v-else class="active">全职</div>
                                    </template>
                                </van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>
                    <!-- <van-field
                        v-if="[2].includes(state.formData.replenishmenttypecode)"
                        class="guizhu-field"
                        label-width=max-content
                        v-model="formData.experience"
                        is-link
                        readonly
                        name="picker"
                        label="有无货运经验"
                        input-align="right"
                        @click="showPicker2 = true"
                    /> -->
                    <van-popup v-model:show="showPicker2" position="bottom">
                        <van-picker
                            item-height="35px"
                            title="有无货运经验"
                            :columns="experience"
                            @confirm="onExperience"
                            @cancel="showPicker2 = false"
                        />
                    </van-popup>
                    <!-- <van-field
                        v-if="[2].includes(state.formData.replenishmenttypecode)"
                        class="guizhu-field"
                        label-width=max-content
                        v-model="formData.operate"
                        is-link
                        readonly
                        name="picker"
                        label="货柜运营"
                        input-align="right"
                        @click="showPicker3 = true"
                    /> -->
                    <van-popup v-model:show="showPicker3" position="bottom">
                        <van-picker
                            item-height="35px"
                            title="货柜运营"
                            :columns="operate"
                            @confirm="onOperate"
                            @cancel="showPicker3 = false"
                        />
                    </van-popup>
                    <div class="upload-img" v-if="[1].includes(state.formData.replenishmenttypecode)">
                        <van-field name="uploader" label="授权书照片" label-width=max-content>
                            <template #input>
                                <van-uploader :upload-icon="uploadIcon" v-model="imgvalue" max-count="5" :after-read="afterRead" :before-delete="deleteImage" accept="image/*" />
                            </template>
                        </van-field>
                    </div>

                </div>
            </div>
            <!-- v-if="!showArea" @click="saveUserAddress" -->
            <div class="button-box" v-show="state.hideshow">
                <van-button color="#FE7E41" block v-if="!isUpdateModel" native-type="submit">创建</van-button>
            </div>
            <div class="button-box-height"></div>
        </van-form>
    </div>
</template>
<script setup>
import { onMounted, reactive, toRefs, ref, watch, computed } from 'vue'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import { uploadImage, addSubLevel } from '@/api/subaccountnumber.js'
import { useStore } from 'vuex'
import uploadIcon from '@/assets/addPhoto.png'

const store = useStore()
const userInfoV = computed(() => store.state.token)
const accountName = computed(() => store.state.accountName)
const router = useRouter()
const props = defineProps(['sonType'])
const state = reactive({
    formData: {
        replenishmenttype: '补货员',
        replenishmenttypecode: 2, // code
        // realRight: '',
        // haveRightscode: null, // 是否设备内物权
        name: '',
        phone: '',
        idnumber: '',
        gender: '1',
        gendercode: '1', // code
        age: '',
        occupation: '',
        education: '',
        experience: '1',
        experiencecode: '1', // code
        operate: '1',
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

const showPicker1 = ref(false)
const showPicker2 = ref(false)
const showPicker3 = ref(false)
const showPicker4 = ref(false)
// const showPickerHv = ref(false)
// 类型
const replenishmenttype = [
    { text: '代运营商', code: 1 },
    { text: '补货员', code: 2 },
    { text: '分账人', code: 3 }
]
// 是否物权
// const realRight = [
//     { text: '有', code: 1 },
//     { text: '否', code: 0 }
// ]
// 性别
const gender = [
    { text: '男', code: 1 },
    { text: '女', code: 2 }
]
// 经验
const experience = [
    { text: '无', code: 0 },
    { text: '有', code: 1 }
]
// 运营
const operate = [
    { text: '全职', code: 1 },
    { text: '兼职', code: 2 }
]
onMounted(() => {
    if (Number(props.sonType) === 1) {
        state.formData.replenishmenttype = '代理运营商'
        state.formData.replenishmenttypecode = 1
    }
})

const getAddSubLevel = async () => {
    const params = {
        busiCode: 'A1001002',
        appKey: 'A10010043',
        token: userInfoV.value ?? '',
        operator: accountName.value,
        merchantSubType: state.formData.replenishmenttypecode,
        // realRight: state.formData.haveRightscode, // 是否物权
        merchantSubName: state.formData.name,
        phoneMobile: state.formData.phone,
        idCard: state.formData.idnumber,
        sex: state.formData.gendercode,
        age: state.formData.age,
        profession: state.formData.occupation,
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
// const dataRules = () => {
//     // 姓名
//     const nameN = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/gi.test(state.formData.name)
//     // 手机号
//     const phoneN = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/gi.test(state.formData.phone)
//     // 身份证
//     const idnumberN = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/gi.test(state.formData.idnumber)
//     // 职业
//     const occupationN = /^[a-zA-Z\u4e00-\u9fa5]+$/gi.test(state.formData.occupation)
//     // 正则学历
//     const educationN = /^([\u4e00-\u9fa5]{2,10})$/gi.test(state.formData.education)

//     if (!state.formData.name || !state.formData.phone || !state.formData.idnumber || !state.formData.gender || !state.formData.age || !state.formData.occupation || !state.formData.education || !state.formData.replenishmenttype || !state.formData.experience || !state.formData.operate) {
//         Toast('请按照规范，完成内容填写')
//         return false
//     }
//     if (!nameN) {
//         Toast('请按照规范，完成姓名填写')
//         return false
//     }
//     if (!phoneN) {
//         Toast('请按照规范，完成手机号填写')
//         return false
//     }
//     if (!idnumberN) {
//         Toast('请按照规范，完成身份证内容填写')
//         return false
//     }
//     if (!occupationN) {
//         Toast('请按照规范，完成职业信息填写')
//         return false
//     }
//     if (!educationN) {
//         Toast('请按照规范，完成学历信息填写')
//         return false
//     }
//     if (urlList.value === '') {
//         Toast('请按照规范，完成授权协议照片上传')
//         return false
//     }
//     return true
// }
// 新增保存用户地址
const saveUserAddress = async (val) => {
    console.log(state.formData, '11')
    if (state.formData.replenishmenttypecode === 1 && urlList.value === '') {
        Toast('请按照规范，完成授权协议照片上传')
        return false
    }
    getAddSubLevel()
}
// 补货员类型
const onScene = (val) => {
    state.formData.replenishmenttype = val.text
    state.formData.replenishmenttypecode = val.code
    showPicker4.value = false
}
// 是否物权
// const onHave = (val) => {
//     state.formData.realRight = val.text
//     state.formData.haveRightscode = val.code
//     showPickerHv.value = false
// }
// 性别选择
const onGender = (val) => {
    state.formData.gender = val.text
    state.formData.gendercode = val.code
    showPicker1.value = false
}
// 货柜经验
const onExperience = (val) => {
    state.formData.experience = val.text
    state.formData.experiencecode = val.code
    showPicker2.value = false
}
// 货柜运营
const onOperate = (val) => {
    state.formData.operate = val.text
    state.formData.operatecode = val.code
    showPicker3.value = false
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

:deep(.van-nav-bar .van-icon) {
    font-size: 35px;
    color: #000;
    font-weight: bold;
}
:deep(.van-nav-bar__text) {
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
        :deep(.van-nav-bar .van-icon) {
            color: #000!important;
        }
        :deep(.van-nav-bar__content) {
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
                font-weight: 400;/*  */
                align-items: center;
            }
            :deep(.van-cell__value) {
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
:deep(.van-picker__toolbar) {
    height: 131px;
    border-bottom: 1px solid #E7E7E7;
}
:deep(.van-picker__confirm) {
    color: #E74D09;
    font-size: 30px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
}
:deep(.van-picker-column__item) {
    font-size: 34px;
}
:deep(.van-picker-column__item--selected) {
    color: #E74D09;
}
:deep(.van-picker__title) {
    font-size: 32px;
    font-weight: 700;
    font-family: PingFangSC-Medium, PingFang SC;
    color: #191919;
}
:deep(.van-field__body) {
    height: 100%;
}
:deep(.van-nav-bar__title) {
    font-size: 34px;
    font-weight: 600;
    color: #000000;
    height: 88px;
    line-height: 88px;
}
:deep(.van-icon-arrow-left:before) {
    font-size: 35px;
}
:deep(.van-field__label) {
    display: flex;
    align-items: center;
    color: #000000!important;
}
.upload-img :deep(.van-cell) {
    flex-direction: column;
}
.upload-img :deep(.van-field) {
    align-items: flex-start!important;
}
:deep(.van-uploader__wrapper) {
    justify-content: left;
    flex-wrap: wrap;
}
:deep(.van-uploader__preview) {
    margin: 15px 15px 0 0;
}
:deep(.van-uploader__preview-image) {
    width: 190px;
    height: 190px;
    background: #F7F7F7;
    border-radius: 8px;
}
// :deep(.van-uploader__preview:nth-child(2)) {
//     margin: 15px 0 0 0;
// }
:deep(.van-uploader__preview-delete--shadow) {
    border-radius: 0 8px 0 24px;
}
:deep(.van-uploader__upload) {
    margin: 15px 15px 0 0;
    width: 190px;
    height: 190px;
    background: #F7F7F7;
    border-radius: 8px;
    order:-1;
}
:deep(.van-cell__value:last-child) {
    margin: 11px 0 0 0;
}
// 字体大小
:deep(.van-field__label) {
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
