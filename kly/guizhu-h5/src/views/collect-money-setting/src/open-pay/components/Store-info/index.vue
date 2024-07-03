<template>
    <div class="open-type">
        <div class="merchant card">
            <div class="card-title">门店信息</div>
            <van-cell-group class="guizhu-cell-group">
                <van-field
                    class="guizhu-field"
                    v-model="$props.merchantInfo.storeName"
                    mame="storeName"
                    label="门店名称"
                    input-align="right"
                    placeholder="请输入门店名称"
                    :rules="[{ required: true, message: '请填写门店名称' }]"
                />
                <van-field
                    class="guizhu-field"
                    label="店铺链接地址"
                    v-model="$props.merchantInfo.storeUrl"
                    mame="storeUrl"
                    input-align="right"
                    placeholder="请输入店铺链接地址"
                    :rules="[{ required: true, message: '请填写店铺链接地址' }]"
                >
                </van-field>
                <van-field
                    class="guizhu-field"
                    label="门店省市地址"
                    v-model="$props.merchantInfo.storeAddress"
                    mame="merchantName"
                    input-align="right"
                    placeholder="请输入门店省市地址"

                >
                <!-- :rules="[{ required: true, message: '请填写门店省市地址' }]" -->
                </van-field>
            </van-cell-group>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
    merchantInfo: Object
})
console.log(props, 'store props')
</script>
