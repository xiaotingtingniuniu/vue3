<template>
    <div class="open-type">
        <div class="merchant card">
            <div class="card-title">结算信息</div>
            <van-cell-group class="guizhu-cell-group">
                <van-field
                    class="guizhu-field"
                    v-model="$props.merchantInfo.name"
                    mame="name"
                    label="结算方式"
                    input-align="right"
                    placeholder="法人"
                >
                    <template #input>
                        <van-radio-group v-model="$props.merchantInfo.settlementWay" @change="getBankListFn" direction="horizontal" :disabled="formDisable || $props.status === 'detail'">
                            <van-radio :name="0">对私银行卡
                                <template #icon="props">
                                    <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                                </template>
                            </van-radio>
                            <van-radio :name="1">对公银行卡
                                <template #icon="props">
                                    <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                                </template>
                            </van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field
                    class="guizhu-field"
                    label="银行卡开户名"
                    v-model="$props.merchantInfo.accountName"
                    mame="accountName"
                    input-align="right"
                    placeholder="请输入银行卡开户名"
                    :readonly="$props.status === 'detail'"
                    :rules="[{ required: true, message: '请填写银行卡开户名' }]"
                >
                </van-field>
                <van-field
                    class="guizhu-field"
                    label="银行名称"
                    v-model="$props.merchantInfo.accountBank"
                    mame="accountBank"
                    readonly
                    is-link
                    input-align="right"
                    placeholder="请选择银行名称"
                    @click="openPicker('bankListShow')"
                    :rules="[{ required: true, message: '请选择银行名称' }]"
                >
                </van-field>
                <van-popup v-model:show="bankListShow" position="bottom">
                    <van-picker
                        title="选择银行名称"
                        :columns="bankList"
                        :columns-field-names="{text: 'bank_alias'}"
                        @confirm="bankConfirm"
                        @cancel="bankListShow = false"
                    />
                </van-popup>
                <van-field
                    class="guizhu-field"
                    label="开户地址"
                    readonly
                    placeholder="请选择开户地址"
                    name="picker"
                    input-align="right"
                    v-model="$props.merchantInfo.regAddress"
                    mame="regAddress"
                    is-link
                    @click="openPicker('locationShow')"
                    :rules="[{ required: true, message: '请填写开户地址' }]"
                >
                </van-field>
                <van-popup v-model:show="locationShow" round position="bottom">
                    <van-area title="标题" :area-list="areaList" @cancel="locationShow = false" @confirm="onConfirm"/>
                </van-popup>
                <van-field
                    class="guizhu-field"
                    label="银行卡号"
                    v-model="$props.merchantInfo.accountNumber"
                    mame="accountNumber"
                    input-align="right"
                    placeholder="请输入银行卡号"
                    :readonly="$props.status === 'detail'"
                    :rules="[{ required: true, message: '请填写银行卡号' }]"
                >
                </van-field>
            </van-cell-group>
            <div class="desc-content custom-field ml0 mr0 pb0" v-if="merchantInfo.corporateType === 1">
                <div class="custom-field-row flex">
                    <div class="custom-field-label">特殊行业补充材料</div>
                </div>
                <ul class="custom-field-list">
                    <li class="custom-field-item">1. 特殊行业需要额外补充对应材料</li>
                    <li class="custom-field-item">2. 最多上传5张</li>
                    <li class="custom-field-item">4. 图片仅支持JPG、JPEG、PNG 格式，大小不超过3MB</li>
                </ul>
                <div class="uploader-content">
                    <van-uploader
                        :deletable="$props.status !== 'detail'"
                        :disabled="$props.status === 'detail'"
                        :after-read="uploadBusinessLicenseCopy"
                        v-model="$props.merchantInfo.businessAdditionDesc"
                        accept="image/*"
                        :max-count="5"
                    >
                        <div class="addPhoto-box">
                            <van-image :src="require('@/assets/addPhoto.png')"></van-image>
                        </div>
                    </van-uploader>
                </div>
            </div>
            <div class="desc-content"  v-if="$props.merchantInfo.corporateType === 2">
                <h4 class="title">补充说明：</h4>
                <p class="desc">该商户已持续从事电子商务经营活动满6个月，且期间经营收入累计超过20万元</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue'
import { fileUploader } from '../../index'
// import { selectBankAddress } from '@/api/collect-money-setting.js'
import { getBankList, getProvincesList } from '@/api/common'
import { areaList } from '@vant/area-data'
// import { Toast } from 'vant'
const props = defineProps({
    merchantInfo: Object,
    status: String
})
const formDisable = ref(false)
watch(
    () => props.merchantInfo.corporateType,
    val => {
        // corporateType: 2, // 商户类型 1 企业 2 自然人 3个人工商户 4 事业单位
        if (val === 2) {
            Object.assign(props.merchantInfo, { settlementWay: 0 })
            formDisable.value = true
        } else {
            formDisable.value = false
        }
    },
    {
        immediate: true
    })
const locationShow = ref(false)
// const cascaderValue = ref('')
const bankListShow = ref(false)
const bankList = ref([])
const activeIcon = require('@/assets/mine/icon-checked.png')
const inactiveIcon = require('@/assets/mine/icon-check.png')
const provincesList = ref([])
const onConfirm = (val) => {
    console.log(val, 'area')
    locationShow.value = false
    // eslint-disable-next-line vue/no-mutating-props
    props.merchantInfo.regAddress = val.map((option) => option.name).join('/')
    // eslint-disable-next-line vue/no-mutating-props
    props.merchantInfo.acctProvinceCode = val[2].code
    Object.assign(props.merchantInfo, { acctProvince: val.map((option) => option.name).join('/') })
}
const bankConfirm = (value) => {
    // eslint-disable-next-line vue/no-mutating-props
    props.merchantInfo.accountBank = value.bank_alias
    // eslint-disable-next-line vue/no-mutating-props
    props.merchantInfo.bank_alias_code = value.bank_alias_code
    bankListShow.value = false
    // getBranchBankFn()
}
// 商户证件照片上传
const uploadBusinessLicenseCopy = async (file) => {
    // merchantInfo.businessLicenseCopy = [{ url: '', status: 'uploading' }]
    // Object.assign(props.merchantInfo, { businessLicenseCopy: [{ url: '', status: 'uploading' }] })
    const files = await fileUploader(file)
    // eslint-disable-next-line vue/no-mutating-props
    props.merchantInfo.businessAdditionDesc[props.merchantInfo.businessAdditionDesc.length - 1] = files[0]
    // Object.assign(props.merchantInfo, { businessAdditionDesc: [...props.merchantInfo.businessAdditionDesc, ...files] }）
}
const init = async () => {
    const provincesData = await getProvincesList()
    if (provincesData.code === '200') {
        provincesList.value = provincesData.data.data.map(el => {
            return { text: el.province_name, value: el.province_code, children: [] }
        })
    }
}
init()
// 获取银行列表
const getBankListFn = async () => {
    const backList = await getBankList({ bankType: props.merchantInfo.settlementWay === 0 ? 2 : 1 }) // 1对公，2对私
    if (backList.code === '200') {
        bankList.value = backList.data.data
    }
}
getBankListFn()
// 打开选择器
const openPicker = (key) => {
    if (props.status === 'detail') return
    if (key === 'locationShow') {
        locationShow.value = true
    }
    if (key === 'bankListShow') {
        bankListShow.value = true
    }
}
</script>
