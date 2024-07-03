<template>
    <div class="open-type">
        <div class="merchant card">
            <div class="card-title">法定代表人</div>
            <van-cell-group class="guizhu-cell-group">
                <van-field
                    class="guizhu-field"
                    v-model="$props.merchantInfo.name"
                    mame="name"
                    disabled
                    label="法定证件类型"
                    input-align="right"
                    placeholder="身份证"
                />
                <div class="custom-field">
                    <div class="custom-field-row flex">
                        <div class="custom-field-label">法人证件照片</div>
                        <div class="custom-field-a"></div>
                    </div>
                    <ul class="custom-field-list">
                        <li class="custom-field-item">1. 证件照片须为彩色扫描件或彩色图片</li>
                        <li class="custom-field-item">2. 图片仅支持BMP、JPG、JPEG、PNG 格式，大小不超过2MB</li>
                    </ul>
                    <div class="uploader-content">
                        <div class="IDimg">
                            <div class="IDimg-item">
                                <van-uploader
                                    :after-read="uploadIdCardCopy"
                                    v-model="$props.merchantInfo.idCardCopy"
                                    :max-count="1"
                                    :deletable="$props.status !== 'detail'"
                                    :disabled="$props.status === 'detail'"
                                    accept="image/*"
                                    mame="idCardCopy"
                                >
                                    <van-image class="id-img" :src="require('@/assets/IDfront.png')"></van-image>
                                </van-uploader>
                                <p>身份证正面照片</p>
                            </div>
                            <div class="IDimg-item">
                                <van-uploader
                                    :deletable="$props.status !== 'detail'"
                                    :disabled="$props.status === 'detail'"
                                    :after-read="uploadIdCardNational"
                                    v-model="$props.merchantInfo.idCardNational"
                                    mame="idCardNational"
                                    accept="image/*"
                                    :max-count="1"
                                >
                                    <van-image class="id-img" :src="require('@/assets/IDCardFan.png')"></van-image>
                                </van-uploader>
                                <p>身份证反面照片</p>
                            </div>
                        </div>
                    </div>
                </div>
                <van-field
                    class="guizhu-field"
                    label="身份证姓名"
                    v-model="$props.merchantInfo.idCardName"
                    mame="idCardName"
                    input-align="right"
                    placeholder="请输入身份证姓名"
                    :readonly="$props.status === 'detail'"
                    :rules="[{ required: true, message: '请填写身份证姓名' }]"
                >
                </van-field>
                <van-field
                    class="guizhu-field"
                    label="身份证号码"
                    v-model="$props.merchantInfo.idCardNumber"
                    mame="idCardNumber"
                    input-align="right"
                    placeholder="请输入身份证号码"
                    :readonly="$props.status === 'detail'"
                    :rules="[{ required: true, message: '请填写身份证号码' }]"
                >
                </van-field>
                <van-field
                    class="guizhu-field"
                    label="身份证居住地址"
                    v-model="$props.merchantInfo.idCardAddress"
                    mame="idCardAddress"
                    input-align="right"
                    placeholder="请输入身份证居住地址"
                    :readonly="$props.status === 'detail'"
                    :rules="[{ required: true, message: '请填写身份证居住地址' }]"
                >
                </van-field>
                <!-- :min-date="minDate" -->
                <!-- <van-popup v-model:show="showStartTime" round position="bottom"> -->
                <!-- :columns-field-names="{text: 'bank_alias'}" -->
                <!-- <van-datetime-picker
                        v-model="startTime"
                        type="date"
                        title="选择年月日"
                        :max-date="new Date()"
                    /> -->
                <!-- </van-popup> -->
                <van-field
                    class="guizhu-field"
                    label="身份证开始时间"
                    v-model="$props.merchantInfo.idCardValidTimeBegin"
                    mame="idCardValidTimeBegin"
                    input-align="right"
                    is-link
                    readonly
                    @click="openTimePicker('start')"
                    placeholder="请输入身份证开始时间"
                    :rules="[{ required: true, message: '请填写身份证开始时间' }]"
                >
                </van-field>
                <van-popup v-model:show="showStartTime" round position="bottom">
                    <van-datetime-picker
                        v-model="startTime"
                        type="date"
                        title="选择年月日"
                        :min-date="minDate"
                        @confirm="startTimeChange"
                        @cancel="showStartTime = false"
                    />
                </van-popup>
                <!-- :min-date="minDate" -->
                <van-field
                    class="guizhu-field"
                    label="身份证结束时间"
                    v-model="$props.merchantInfo.idCardValidTime"
                    mame="idCardValidTime"
                    input-align="right"
                    is-link
                    readonly
                    placeholder="请输入身份证结束时间"
                    @click="openTimePicker('end')"
                    :rules="[{ required: true, message: '请填写身份证结束时间' }]"
                >
                </van-field>
                <van-popup v-model:show="showEndTime" round position="bottom">
                    <van-datetime-picker
                        v-model="endTime"
                        type="date"
                        title="选择年月日"
                        :min-date="minDate"
                        @confirm="endTimeChange"
                        @cancel="showEndTime = false"
                    />
                </van-popup>
            </van-cell-group>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { fileUploader } from '../../index'

const props = defineProps({
    merchantInfo: Object,
    status: String
})

const emit = defineEmits(['update:modelValue'])

const showStartTime = ref(false)
const showEndTime = ref(false)
const startTime = ref(new Date())
const minDate = new Date('1950-01-01')
// const maxDate = new Date()
const endTime = ref(new Date())

watch(() => [props.merchantInfo.idCardValidTimeBegin, props.merchantInfo.idCardValidTime],
    val => {
        if (val[0]) {
            startTime.value = new Date(val[0].replaceAll('-', '/'))
        }
        if (val[1]) {
            endTime.value = new Date(val[1].replaceAll('-', '/'))
        }
    },
    {
        immediate: true
    }
)
const getTime = (_date) => {
    const _D = new Date(_date)
    const Y = _D.getFullYear()
    const M = _D.getMonth() + 1
    const D = _D.getDate()
    return `${Y}-${M > 9 ? M : ('0' + M)}-${D > 9 ? D : ('0' + D)}`
}
// 打开时间选择器
const openTimePicker = (status) => {
    if (props.status === 'detail') {
        return
    }
    if (status === 'start') {
        showStartTime.value = true
    }
    if (status === 'end') {
        showEndTime.value = true
    }
}
const startTimeChange = () => {
    Object.assign(props.merchantInfo, { idCardValidTimeBegin: getTime(startTime.value) })
    showStartTime.value = false
}
const endTimeChange = () => {
    Object.assign(props.merchantInfo, { idCardValidTime: getTime(endTime.value) })
    showEndTime.value = false
}
// 身份证正面照片上传
const uploadIdCardCopy = async (file) => {
    Object.assign(props.merchantInfo, { idCardCopy: [{ url: '', status: 'uploading' }] })
    const files = await fileUploader(file)
    Object.assign(props.merchantInfo, { idCardCopy: files })
    emit('update:modelValue', Object.assign(props.merchantInfo, { idCardCopy: files }))
}

// 身份证反面照片上传
const uploadIdCardNational = async (file) => {
    // Object.assign(props.idCardNational, { idCardNational: [{ url: '', status: 'uploading' }] })
    const files = await fileUploader(file)
    Object.assign(props.merchantInfo, { idCardNational: files })
    emit('update:modelValue', Object.assign(props.merchantInfo, { idCardNational: files }))
}
</script>
