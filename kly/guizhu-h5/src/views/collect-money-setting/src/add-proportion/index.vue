<template>
    <div class="add-proportion">
        <!-- <van-nav-bar title="分账规则" fixed placeholder left-arrow  @click-left="closePage" /> -->
        <div class="main">
            <van-form @submit="onSubmit">
                <van-cell-group inset>
                    <van-field
                        v-model="formData.mobile"
                        label="用户手机号"
                        name="mobile"
                        type="tel"
                        maxlength="11"
                        input-align="right"
                        placeholder="请输入分账人手机号"
                        @focus="checkUserInfo"
                        :rules="[{ required: true, message: '请填写真实的手机号' }]"
                        disabled
                    />
                    <van-field
                        v-model="formData.name"
                        type="text"
                        label="真实姓名"
                        name="name"
                        readonly
                        input-align="right"
                        placeholder="真实姓名"
                        disabled
                    />
                    <!-- <van-popup v-model:show="showPickerName" position="bottom">
                        <van-picker
                            title="标题"
                            :columns="pickerNameList"
                            @confirm="onConfirm"
                            @cancel="showPickerName = false"
                        />
                    </van-popup> -->
                    <div class="relate-box">
                        <van-field
                            v-model="result"
                            is-link
                            readonly
                            name="picker"
                            label="关联设备"
                            placeholder="点位信息+货柜编号"
                            @click="showPickerPopup"
                        >
                        </van-field>
                        <ul>
                            <li v-for="(item, index) in checkeds" :key="index">{{item.deviceName}} + {{item.deviceCode}} <img :src="require('@/assets/close.png')" alt="" @click="delContainer(index)"></li>
                        </ul>
                        <van-popup v-model:show="showPicker" position="bottom">
                            <van-nav-bar title="关联设备" @click-left="showPicker = false">
                                <template #left>
                                    <van-icon :name="require('@/assets/close.png')" size="18"/>
                                </template>
                                <template #right>
                                    <!-- <van-icon :name="require('@/assets/close.png')" size="18"/> -->
                                    <span style="color: #FE7E41;font-size: 14px;" @click="checkourAdd">确定</span>
                                </template>
                            </van-nav-bar>
                            <van-checkbox-group v-model="checkeds" :max="999">
                                <van-checkbox v-for="(item,index) in containerLists" :name="item" :key="index" checked-color="#FE7E41">
                                    <div class="checkout_style">
                                        {{item.deviceName}} + {{item.deviceCode}}
                                    </div>
                                </van-checkbox>
                            </van-checkbox-group>
                            <div class="checkout_add">
                                <!-- <van-button type="primary" block round color="#FE7E41" @click="checkourAdd">添加</van-button> -->
                            </div>
                        </van-popup>
                    </div>
                    <!-- <van-field name="radio" label="结算周期" readonly >
                        <template #input>
                            <van-radio-group v-model="checked2" direction="horizontal" @change="redaoChange">
                                <van-radio name="1" checked-color="#FE7E41" icon-size="16px" class="radio_text">实时</van-radio>
                                <van-radio name="2" checked-color="#FE7E41" icon-size="16px" class="radio_text">线下结算</van-radio>
                            </van-radio-group>
                        </template>
                        <template #extra>
                            <div class="editBox">
                                <span>D+</span>
                                <van-field v-model="period" type="number" class="edit_value" placeholder="请输入"/>
                            </div>
                        </template>
                    </van-field> -->
                    <van-field v-model="formData.rate" input-align="right" name="分账比例" type="number" label="分账比例12" placeholder="0~100,  最高100" :rules="[{ validator: validatorRatio }]">
                        <template #label>
                            <span class="custom-title">分账比例</span>
                            <span style="vertical-align: text-top">
                                <img src="@/assets/question2.png" class="question-icon" @click="rateDialog">
                            </span>
                        </template>
                        <template #extra>
                            <span>%</span>
                        </template>
                    </van-field>
                    <van-field name="switch" label="平台优惠补贴分账">
                        <template #label>
                            <span class="custom-title">平台优惠补贴分账</span>
                            <span style="vertical-align: text-top">
                                <img src="@/assets/question2.png" class="question-icon" @click="couponDialog">
                            </span>
                        </template>
                        <template #input>
                            <van-switch v-model="formData.subsidyFlagCheck" active-color="#FE7E41" size="20" />
                        </template>
                    </van-field>
                    <!-- <van-field
                        v-model="formData.startTime"
                        is-link
                        readonly
                        name="picker"
                        input-align="right"
                        label="分账开始时间"
                        placeholder="分账开始时间"
                        @click="showStartDatePicker = true"
                        :rules="[{ required: true, message: '请选择分账开始时间' }]"
                    /> -->
                    <!-- <van-popup v-model:show="showStartDatePicker" position="bottom">
                        <van-datetime-picker
                            v-model="currentDate"
                            type="datetime"
                            title="选择年月日"
                            :min-date="minDate"
                            :max-date="maxStartTime"
                            @confirm="startDateChange"
                            @cancel="showStartDatePicker = false"
                        />
                    </van-popup> -->
                    <!-- <van-field
                        v-model="formData.endTime"
                        is-link
                        readonly
                        input-align="right"
                        name="picker"
                        label="分账结束时间"
                        placeholder="分账结束时间"
                        @click="showEndDatePicker = true"
                        :rules="[{ required: true, message: '请选择分账结束时间' }]"
                    /> -->
                    <!-- <van-popup v-model:show="showEndDatePicker" position="bottom">
                        <van-datetime-picker
                            v-model="endtDate"
                            type="datetime"
                            title="选择年月日"
                            :min-date="endMinTime"
                            @confirm="endDateChange"
                            @cancel="showEndDatePicker = false"
                        />
                    </van-popup> -->
                </van-cell-group>
                <div class="submit">
                    <van-button round block color="#FE7E41" type="primary" native-type="submit" >
                        保存
                    </van-button>
                </div>
            </van-form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { subledgerList, subledgerCreateRate, subledgerEditRate } from '@/api/collect-money-setting.js'
import { containerList2 } from '@/api/container.js'
import { isMobile } from '@/utils'
import { Toast, Dialog } from 'vant'
import { validatorRatio } from '@/utils/vantFormValidator.js'
import { closePage } from '@/utils/composables'
import { getAppStorageFn, deleteAppStorageFn } from '@/utils/storage'

const route = useRoute()
// const router = useRouter()

/** 关联设备相关状态 */
const period = ref('')
const formData = ref({
    mobile: '',
    name: '',
    subLedgerId: '',
    period: '', // 结算周期
    rate: '', // 分账比例
    subsidyFlag: '' // 补贴是否参与分账
})
const result = ref('')
const checkeds = ref([]) // 选中设备列表
const deviceList = ref([])
const showPicker = ref(false)
const containerLists = ref([])
const checkourAdd = () => {
    showPicker.value = false
}
// const showPickerName = ref(false)
const pickerNameList = ref([])
/** 分账开始时间 */
// const showStartDatePicker = ref(false)
// const currentDate = ref() // 当前时间
// const startDate = ref() // 当前时间
// const minDate = new Date()
// const maxStartTime = ref()
// const maxDate = new Date(2025, 10, 1)

// const endMinTime = ref(new Date())
// const startDateChange = (value) => {
//     startDate.value = value
//     endMinTime.value = value
//     formData.value.startTime = getTime(value)
//     showStartDatePicker.value = false
// }
// const getTime = (date) => {
//     const _D = new Date(date)
//     const H = _D.getMonth() + 1
//     const D = _D.getDate()
//     return `${_D.getFullYear()}-${H > 9 ? H : ('0' + H)}-${D > 9 ? D : ('0' + D)} ${_D.toLocaleTimeString()}`
// }
/** 分账结束时间 */
// const showEndDatePicker = ref(false)
// const endtDate = ref() // 结束时间
// const endDateChange = (value) => {
//     // endtDate.value = value
//     formData.value.endTime = getTime(value)
//     // maxStartTime.value = new Date(value)
//     showEndDatePicker.value = false
// }
/** 表单提交 */
const onSubmit = (values) => {
    const params = {
        rate: Number(formData.value.rate), // 结算比例
        subLedgerId: route.query.subLedgerId ? route.query.subLedgerId : formData.value.subLedgerId,
        subsidyFlag: formData.value.subsidyFlagCheck ? 1 : 2,
        channel: 1
    }
    const deviceInfo = checkeds.value.map(el => {
        return { deviceNo: el.deviceCode, deviceName: el.deviceName, address: el.pointPosition }
    })
    route.params?.configId ? editRate({ ...params, deviceInfo: deviceInfo }) : addRate({ ...params, deviceInfo: deviceInfo })
}

const checkUserInfo = async () => {
    if (!formData.value.mobile) return
    if (!isMobile(formData.value.mobile)) {
        formData.value.mobile = ''
        return Toast('请输入正确的手机号！')
    }
    const res = await subledgerList({ mobileOrName: formData.value.mobile, status: 1 })
    if (res.code === '200') {
        if (res.data.list.length) {
            formData.value.name = res.data.list[0].name
            formData.value.subLedgerId = res.data.list[0].subLedgerId
            pickerNameList.value = res.data.list.map(el => {
                return { text: el.name, subLedgerId: el.subLedgerId }
            })
        } else {
            Toast('当前手机号没有查到分账信息，请核对手机号！')
            formData.value.mobile = ''
        }
    }
}
const delContainer = (ind) => {
    deviceList.value.splice(ind, 1)
}
const init = async () => {
    const res = await containerList2({ subLedgerId: route.params.subLedgerId ? route.params.subLedgerId : route.query.subLedgerId })
    if (res.code === '200') {
        containerLists.value = res.object.list
    }
    if (route.params?.configId) {
        getAppStorageFn('FZ_ITEM', (val) => {
            const info = JSON.parse(val)
            deleteAppStorageFn('FZ_ITEM')
            Object.assign(formData.value, info)
            period.value = info.period
            if (formData.value.subsidyFlag === 1) {
                formData.value.subsidyFlagCheck = true
            } else {
                formData.value.subsidyFlagCheck = false
            }
            checkeds.value = [{
                deviceCode: info.deviceNo,
                deviceName: info.deviceName,
                address: info.pointPosition
            }]
        })
    } else {
        formData.value.name = route.query.name
        formData.value.mobile = route.query.mobile
    }
}
init()
const addRate = async (params) => {
    const res = await subledgerCreateRate(params)
    if (res.code === '200') {
        const timer = setTimeout(() => {
            clearTimeout(timer)
            Toast('操作成功！')
            // router.back()
            closePage()
        }, 300)
    }
}
const editRate = async (params) => {
    params.ruleConfigId = route.params.configId
    const res = await subledgerEditRate(params)
    if (res.code === '200') {
        const timer = setTimeout(() => {
            clearTimeout(timer)
            Toast('操作成功！')
            // router.back()
            closePage()
        }, 300)
    }
}
const showPickerPopup = val => {
    if (route.params.configId) return
    if (containerLists.value.length === 0) {
        Toast('无设备可关联')
        return
    }
    showPicker.value = true
}
const rateDialog = () => {
    Dialog.alert({
        message: '订单总分账比例需≤100%',
        cancelButtonText: '我知道了',
        confirmButtonColor: '#FE7E41'
    })
}
const couponDialog = () => {
    Dialog.alert({
        message: '分账人是否参与平台优惠券补贴分账，如开启，分账人会接收到平台补贴分账收入款',
        cancelButtonText: '我知道了',
        confirmButtonColor: '#FE7E41'
    })
}
</script>

<style scoped lang="scss">
    .add-proportion{
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
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #F4F5F5;
        .main{
            width: 100%;
            flex: 1;
            // margin-top: 20px;
            padding-top: 10px;
            box-sizing: border-box;
            background-color: #fff;
            .submit{
                width: 100%;
                margin-top: 80px;
                padding: 50px;
                box-sizing: border-box;
            }
        }

        .editBox{
            width: 200px;
            height: 44px;
            line-height: 44px;
            display: flex;
            justify-content: center;
            align-items: center;
            .editBox-edit{
                display:inline-block;
                color:#FE7E41;
                margin-left: 3px;
            }
        }
        .van-cell-group{
            margin: 0px;
        }
        .van-cell{
            padding: 30px;
        }
        .van-field{
            :deep .van-field__control{
                justify-content: flex-end
            }
            :deep .van-field__control::-webkit-input-placeholder {
                text-align: right;
                padding-right: 20px;
                box-sizing: border-box;
             }
        }
        .radio_text{
            font-size: 24px;
            color: #4F5160;
        }
        .van-checkbox{
            padding: 20px 51px;
            // :deep .van-checkbox__label{
            //     border-bottom: solid 1px #F2F6F9;
            //     padding-bottom: 40px;
            //     padding-top: 20px;
            //     box-sizing: border-box;
            // }
        }
        .checkout_style{
            width: 600px;
            border-bottom: #F2F6F9 solid 1px;
            padding: 20px 0;
            box-sizing: border-box;
        }
        .checkout_add{
            width: 100%;
            height: 92px;
            box-sizing: border-box;
            padding: 0 40px;
            margin-bottom: 50px;
        }
        ul{
            width: 90%;
            font-weight: 400;
            color: #FE7E41;
            // line-height: 28px;
            font-size: 20px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            border-bottom: solid 1px #F2F6F9;
            box-sizing: border-box;
            // background-color: red;
            li{
                height: 42px;
                text-align: center;
                background: #FFF5F0;
                border-radius: 2px;
                border: 1px solid #FE7E41;
                overflow: hidden;
                font-weight: 400;
                color: #FE7E41;
                line-height: 28px;
                padding: 5px;
                box-sizing: border-box;
                margin: 0 10px 30px 0;
                display: flex;
                img{
                    width: 18px;
                    height: 18px;
                    margin: 0 10px;
                }
            }
        }
        .relate-box{
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .van-cell{
                position: static;
            }
        }
        .question-icon{
            width: 32px;
            margin-left: 10px;
        }
        :deep(.van-field__label){
            width: 300px;
        }
        :deep(.van-popup){
            min-height: 536px;
            max-height: 70%;
        }
    }
</style>
