<template>
    <div class="my-address-page mine-content">
        <van-nav-bar
            title="用户详情"
            fixed
            placeholder
            left-arrow
            @click-left="goBackN"
        >
        </van-nav-bar>
        <div class="successBox">
            <van-form @submit="onSubmit">
                <van-cell-group inset>
                    <van-field
                        label-width=max-content
                        v-model="formList.replenishmenttype"
                        name="子账号类型"
                        label="子账号类型"
                        input-align="right"
                        disabled
                    />
                    <!-- <van-field
                        label-width=max-content
                        v-model="formList.realRight"
                        name="是否拥有设备内物权"
                        label="是否拥有设备内物权"
                        input-align="right"
                        disabled
                    /> -->
                    <van-field
                        label-width=max-content
                        v-model="formList.name"
                        name="用户名"
                        label="用户名"
                        input-align="right"
                        disabled
                    />
                    <van-field
                        label-width=max-content
                        v-model="formList.phone"
                        name="手机号"
                        label="手机号"
                        input-align="right"
                        disabled
                    />
                    <van-field
                        label-width=max-content
                        v-model="formList.idnumber"
                        name="身份证号"
                        label="身份证号"
                        input-align="right"
                        disabled
                    />
                    <van-field
                        v-if="[1].includes(state.formList.merchantSubType)"
                        label-width=max-content
                        v-model="formList.gender"
                        name="性别"
                        label="性别"
                        input-align="right"
                        disabled
                    />
                    <van-field
                        v-if="[1].includes(state.formList.merchantSubType)"
                        label-width=max-content
                        v-model="formList.age"
                        name="年龄"
                        label="年龄"
                        input-align="right"
                        disabled
                    />
                    <van-field
                        v-if="[1].includes(state.formList.merchantSubType)"
                        label-width=max-content
                        v-model="formList.occupation"
                        name="职业"
                        label="职业"
                        input-align="right"
                        disabled
                    />
                    <van-field
                        v-if="[1, 2].includes(state.formList.merchantSubType)"
                        label-width=max-content
                        v-model="formList.education"
                        name="学历"
                        label="学历"
                        input-align="right"
                        disabled
                    />
                    <van-field
                        v-if="[1, 2].includes(state.formList.merchantSubType)"
                        label-width=max-content
                        v-model="formList.experience"
                        name="有无货运经验"
                        label="有无货运经验"
                        input-align="right"
                        disabled
                    />
                    <van-field
                        v-if="[1, 2].includes(state.formList.merchantSubType)"
                        label-width=max-content
                        v-model="formList.operate"
                        name="货柜运营"
                        label="货柜运营"
                        input-align="right"
                        disabled
                    />
                    <div class="upload-img" v-if="[1].includes(state.formList.merchantSubType)">
                        <van-field name="uploader" label="授权协议照片上传" label-width=max-content>
                            <template #input>
                                <van-uploader v-model="imgvalue" :deletable="false" :show-upload="false" />
                            </template>
                        </van-field>
                    </div>
                </van-cell-group>
            </van-form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, toRefs } from '@vue/reactivity'
import { computed, onMounted } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import { subLevelListDetails } from '@/api/subaccountnumber.js'
import { useStore } from 'vuex'

const store = useStore()
// const userInfoV = computed(() => store.state.userInfo)
const accountName = computed(() => store.state.accountName)
const props = defineProps(['operator', 'busiMerchantId', 'merchantSubId', 'merchantSubType'])
const router = useRouter()
const state = reactive({
    formList: {
        replenishmenttype: '',
        replenishmenttypecode: '类型', // code
        // realRight: '',
        name: '',
        phone: '',
        idnumber: '',
        gender: '',
        age: '',
        occupation: '',
        education: '',
        experience: '',
        operate: '',
        scene: ''
    }
})
const { formList } = toRefs(state)
const imgvalue = ref([])
const onSubmit = (values) => {
    console.log('submit', values)
}

console.log(state.formList.phone)

onMounted(() => {
    getsubLevelListDetailst()
    newphone()
})

const replenishmentState = {
    1: '代运营商',
    2: '补货员',
    3: '分账人'
}

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
    if (Number(code) === 200) {
        state.formList.merchantSubType = data.merchantSubType
        // state.formList.replenishmenttype = Number(data.merchantSubType) === 1 ? '代运营商' : '补货员 '
        state.formList.replenishmenttype = replenishmentState[Number(data.merchantSubType)]
        // state.formList.realRight = Number(data.realRight) === 0 ? '否' : '有'
        state.formList.name = data.merchantSubName
        state.formList.phone = data.phoneMobile
        state.formList.idnumber = data.idCard
        state.formList.gender = Number(data.sex) === 1 ? '男' : '女'
        state.formList.age = data.age
        state.formList.occupation = data.profession
        state.formList.education = data.education
        state.formList.experience = Number(data.isExperience) === 0 ? '无' : '有'
        state.formList.operate = Number(data.containerOperate) === 1 ? '全职' : '兼职'
        const arrt = data.licenseAgreementUrl.split(',')
        arrt.map(el => {
            imgvalue.value.push({ url: el })
        })
        geTel()
    }
}

const newphone = () => {
    if (state.formList.phone.length >= 13) {
        this.phone = this.phone.slice(0, 13)
        //  return
    }
    state.formList.phone = state.formList.phone.replace(/\s+/g, '')
    if (state.formList.phone.length > 3 && state.formList.phone.length < 8) {
        state.formList.phone = state.formList.phone.replace(/^(\d{3})/g, '$1 ')
    } else if (state.formList.phone.length >= 8 && state.formList.phone.length < 12) {
        state.formList.phone = state.formList.phone.replace(/^(\d{3})(\d{4})/g, '$1 $2 ')
    }

    return state.formList.phone
}

const geTel = () => {
    state.formList.phone = state.formList.phone.replace(/(\d{3})(\d*)/, ($, $1, $2) => $1 + ' ' + $2.replace(/\d{4}|\d+/g, $ => $ + ' ').trim()).trim()
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
    .my-address-page{
        // min-height: 100vh;
        background: #F7F7F7;
    }
    .successBox {
        position: absolute;
        // top: 101px;
        left: 30px;
        right: 30px;
        margin: 23px auto 0;
        background: #FFFFFF;
        border-radius: 8px;
        overflow: hidden;
        padding: 14px 0 15px 0;
        :deep(.van-field) {
            padding: 5px 30px;
            font-size: 26px;
            font-weight: 400;
        }
        :deep(.van-cell-group--inset) {
            margin: 0;
        }
        :deep(.van-field__label) {
            height: 37px;
            font-size: 26px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 37px;
        }
        :deep(.van-field__body) {
            font-size: 26px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #191919;
            line-height: 37px;
        }
        :deep(.van-field__control--right)[disabled] {
            font-size: 26px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #191919;
            line-height: 37px;
            opacity: 1;
            -webkit-text-fill-color: #000; // ios 和 安卓9.0 必须添加此属性，才会生效
            -webkit-opacity: 1;
        }
        :deep(.van-cell:after) {
            border-bottom: 0;
        }
        .agreement-box {
            display: flex;
            width: 100%;
            justify-content: right;
            margin: 30px 0;
            .agreement-link {
                width: max-content;
                height: 37px;
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FE7E41;
                line-height: 37px;
            }
        }
    }
    :deep(.van-badge__wrapper) {
        color: #000000!important;
    }
    .top-box {
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
    :deep(.van-icon-arrow-left:before) {
        font-size: 35px;
    }

    .upload-img :deep(.van-cell) {
    flex-direction: column;
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
:deep(.van-uploader__preview:nth-child(3)) {
    margin: 15px 0 0 0;
}
:deep(.van-uploader__preview-delete--shadow) {
    border-radius: 0 8px 0 24px;
}
:deep(.van-uploader__upload) {
    margin: 15px 15px 0 0;
    width: 190px;
    height: 190px;
    background: #F7F7F7;
    border-radius: 8px;
}
:deep(.van-cell__value:last-child) {
    margin: 11px 0 0 0;
}
</style>
