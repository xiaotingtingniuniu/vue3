<template>
    <div class="open-type">
        <div class="merchant card">
            <div class="card-title">管理员</div>
            <van-cell-group class="guizhu-cell-group">
                <van-field
                    class="guizhu-field"
                    v-model="$props.merchantInfo.name"
                    name="name"
                    label="管理员类型"
                    disabled
                    input-align="right"
                    placeholder="法人"
                />
                <van-field
                    class="guizhu-field"
                    label="管理员姓名"
                    v-model="$props.merchantInfo.contactName"
                    name="contactName"
                    input-align="right"
                    placeholder="请输入管理员姓名"
                    :readonly="$props.status === 'detail'"
                    :rules="[{ required: true, message: '请填写管理员姓名' }]"
                >
                </van-field>
                <van-field
                    class="guizhu-field"
                    label="管理员证件号"
                    v-model="$props.merchantInfo.contactIdCardNumber"
                    name="contactIdCardNumber"
                    input-align="right"
                    placeholder="请输入管理员证件号"
                    :readonly="$props.status === 'detail'"
                    :rules="[{ required: true, message: '请填写管理员证件号' }]"
                >
                </van-field>
                <van-field
                    class="guizhu-field"
                    label="手机号"
                    v-model="$props.merchantInfo.customerMobile"
                    name="customerMobile"
                    input-align="right"
                    maxlength="11"
                    placeholder="请输入手机号"
                    :readonly="$props.status === 'detail'"
                    :rules="[{ required: true, message: '请填写手机号' }]"
                >
                </van-field>
                <van-field
                    class="guizhu-field"
                    label="邮箱"
                    v-model="$props.merchantInfo.contactEmail"
                    name="contactEmail"
                    input-align="right"
                    placeholder="请输入邮箱"
                    :readonly="$props.status === 'detail'"
                    :rules="[{ required: true, message: '请填写邮箱' }]"
                >
                </van-field>
            </van-cell-group>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
// eslint-disable-next-line no-unused-vars
const props = defineProps({
    merchantInfo: Object,
    status: String
})
</script>
