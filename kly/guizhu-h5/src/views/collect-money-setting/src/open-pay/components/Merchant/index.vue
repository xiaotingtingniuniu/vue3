<template>
    <div class="open-type">
        <div class="merchant card">
            <div class="card-title">商户信息</div>
            <div class="cell-group"></div>
            <van-cell-group class="guizhu-cell-group">
                <van-field
                    class="guizhu-field"
                    v-model="$props.merchantInfo.corporateName"
                    is-link
                    readonly
                    name="corporateName"
                    label="商户类型"
                    input-align="right"
                    placeholder="点击选择商户类型"
                    @click="openPicker"
                />
                <!-- 商户选择 -->
                <van-popup v-model:show="showPicker" position="bottom">
                    <van-picker
                        :columns="columns"
                        @confirm="onConfirm"
                        @cancel="showPicker = false"
                    />
                </van-popup>
                <!-- <van-field
                    class="guizhu-field"
                    v-if="$props.merchantInfo.corporateType === 1"
                    v-model="$props.merchantInfo.industry"
                    mame="industry"
                    label="所属行业"
                    input-align="right"
                    placeholder="请输入行业"
                    :rules="[{ required: true, message: '请填写行业' }]"
                /> -->
                <van-field
                    class="guizhu-field"
                    v-model="$props.merchantInfo.merchantShortName"
                    label="商户简称"
                    name="merchantShortName"
                    input-align="right"
                    placeholder="请输入商户简称"
                    :readonly="$props.status === 'detail'"
                    :rules="[{ required: true, message: '请填写商户简称' }]"
                />
                <van-field
                    v-if="$props.merchantInfo.corporateType === 1"
                    class="guizhu-field"
                    v-model="$props.merchantInfo.fileType"
                    mame="fileType"
                    label="商户证件类型"
                    input-align="right"
                    placeholder="营业执照"
                    readonly
                />
                <van-field
                    v-else
                    class="guizhu-field"
                    v-model="$props.merchantInfo.fileType"
                    mame="fileType"
                    label="商户证件类型"
                    input-align="right"
                    placeholder="个人身份证"
                    readonly
                />
                <div class="custom-field">
                    <div class="custom-field-row flex">
                        <div class="custom-field-label">商户证件照片</div>
                        <div class="custom-field-a" @click="showPopup">查看示例</div>
                        <van-popup v-model:show="show" position="bottom">
                            <van-nav-bar
                                title="查看示例"
                                right-text="知道了"
                                @click-right="show = false"
                            />
                            <div class="example">
                                <div class="example_item">
                                    <p><span>个人/小微：</span>上传法人身份证正面</p>
                                    <div>
                                        <img :src="require('@/assets/idCard.png')" alt="">
                                    </div>
                                </div>
                                <div class="example_item">
                                    <p>有营业执照的个体户，证件示例如下:</p>
                                    <div>
                                        <img :src="require('@/assets/ying.png')" alt="">
                                    </div>
                                </div>
                                <div class="example_item">
                                    <p>有营业执照的企业及分支机构，证件示例如下:</p>
                                    <div>
                                        <img :src="require('@/assets/yingyezhi.png')" alt="">
                                    </div>
                                </div>
                            </div>
                        </van-popup>
                    </div>
                    <ul class="custom-field-list">
                        <li class="custom-field-item">1. 商户类型不同，上传的证件照片不同，查看示例详情</li>
                        <li class="custom-field-item">2. 证件照片须为彩色扫描件或彩色图片</li>
                        <li class="custom-field-item">3. 个人或小微商户须上传身份证人像面；</li>
                        <li class="custom-field-item">4. 图片仅支持BMP、JPG、JPEG、PNG 格式，大小不超过2MB</li>
                    </ul>
                    <div class="uploader-content">
                        <van-uploader
                            :after-read="uploadBusinessLicenseCopy"
                            v-model="$props.merchantInfo.businessLicenseCopy"
                            name="businessLicenseCopy"
                            :deletable="$props.status !== 'detail'"
                            :disabled="$props.status === 'detail'"
                            accept="image/*"
                            :max-count="1">
                            <div class="addPhoto-box">
                                <van-image :src="require('@/assets/addPhoto.png')"></van-image>
                            </div>
                        </van-uploader>
                    </div>
                </div>
                <van-field
                    v-if="merchantInfo.corporateType === 1"
                    class="guizhu-field"
                    label="营业执照号"
                    v-model="$props.merchantInfo.businessLicenseNumber"
                    name="businessLicenseNumber"
                    input-align="right"
                    placeholder="请输入营业执照号"
                    :readonly="$props.status === 'detail'"
                    :rules="[{ required: true, message: '请填写营业执照号' }]"
                >
                </van-field>
                <van-field
                    v-if="merchantInfo.corporateType === 1"
                    class="guizhu-field"
                    label="商户名称"
                    v-model="$props.merchantInfo.merchantName"
                    name="merchantName"
                    input-align="right"
                    placeholder="请输入商户名称"
                    :readonly="$props.status === 'detail'"
                    :rules="[{ required: true, message: '请填写商户名称' }]"
                >
                </van-field>
                <van-field
                    v-if="merchantInfo.corporateType === 1"
                    class="guizhu-field"
                    label="法定代表人名称"
                    v-model="$props.merchantInfo.legalPerson"
                    name="legalPerson"
                    input-align="right"
                    :readonly="$props.status === 'detail'"
                    placeholder="请输入法定代表人名称"
                    :rules="[{ required: true, message: '请填写法定代表人名称' }]"
                >
                </van-field>
                <van-field
                    v-if="merchantInfo.corporateType === 1"
                    class="guizhu-field"
                    label="注册地址"
                    v-model="$props.merchantInfo.companyAddress"
                    name="companyAddress"
                    input-align="right"
                    placeholder="请输入注册地址"
                    :readonly="$props.status === 'detail'"
                    :rules="[{ required: true, message: '请填写注册地址' }]"
                >
                </van-field>
            </van-cell-group>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { fileUploader } from '../../index'

const props = defineProps({
    merchantInfo: Object,
    status: String
})

const emit = defineEmits(['update:modelValue'])
const show = ref(false) // 显示示例弹层
const showPopup = () => {
    show.value = true
}
// 商户证件照片上传
const uploadBusinessLicenseCopy = async (file) => {
    Object.assign(props.merchantInfo, { businessLicenseCopy: [{ url: '', status: 'uploading' }] })
    const files = await fileUploader(file)
    Object.assign(props.merchantInfo, { businessLicenseCopy: files })
}

const showPicker = ref(false)
const columns = [
    { text: '个人', value: 2 },
    { text: '企业', value: 1 }
]
// 打开商户类型选择
const openPicker = () => {
    if (props.status !== 'detail') {
        showPicker.value = true
    }
}

// 商户类型选择
const onConfirm = val => {
    Object.assign(props.merchantInfo, { corporateName: val.text, corporateType: val.value })
    emit('update:modelValue', { ...props.merchantInfo.corporateName, corporateName: val.text, corporateType: val.value })
    showPicker.value = false
}
</script>
