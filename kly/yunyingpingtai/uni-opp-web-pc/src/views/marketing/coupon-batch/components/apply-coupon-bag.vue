<template>
    <div class='coupon-submit-box'>
        <el-dialog v-model="couponBagConfig" :before-close="handleClose" title="添加优惠券">
            <div class="search-area">
                <el-form ref="couponDataRef" :model="couponData" label-position="right" label-width="150px">
                    <el-form-item label="营销工具" prop="couponType" :rules="rules.selectRule">
                        <el-radio-group v-model="couponData.couponType" @change="couponTypeChange" :disabled="props.handleType === 'edit'">
                            <el-radio :label="1">立减券</el-radio>
                            <el-radio :label="2">满减券</el-radio>
                            <el-radio :label="3">折扣券</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="couponData.couponType === 1 || couponData.couponType === 2" label="最高立减金额" prop="maxMinusAmount" :rules="rules.amountRule">
                        <el-input v-model="couponData.maxMinusAmount" placeholder="填写数值，支持2位小数，不得为0"><template v-slot:suffix>元</template></el-input>
                    </el-form-item>
                    <el-form-item  v-if="couponData.couponType === 2" label="门槛金额" prop="doorsillAmount" :rules="rules.doorsillAmountRule">
                        <el-input v-model="couponData.doorsillAmount" placeholder="填写数值，支持2位小数，不得为0，必须大于最高立减金额"><template v-slot:suffix>元</template></el-input>
                    </el-form-item>
                    <el-form-item  v-if="couponData.couponType === 3" label="折扣比例" prop="discountRate" :rules="rules.discountRateRule">
                        <el-input v-model.number="couponData.discountRate" placeholder="支付价格 = 原价 ×（1-折扣比例）"><template v-slot:suffix>%</template></el-input>
                    </el-form-item>
                    <el-form-item  v-if="couponData.couponType === 3" label="最大优惠金额" prop="maxDiscountAmount" :rules="rules.doorsillAmountRule">
                        <el-input v-model="couponData.maxDiscountAmount" placeholder="填写数值，支持2位小数，不得为0，必须大于最高立减金额"><template v-slot:suffix>元</template></el-input>
                        <span>用户通过折扣能享受的优惠金额不得大于{{couponData.maxDiscountAmount}}元</span>
                    </el-form-item>
                    <el-form-item label="申请数量" prop="applyCount" :rules="rules.numberRule">
                        <el-input v-model.number="couponData.applyCount" placeholder="填写数值，仅支持整数，不得为0"><template v-slot:suffix>张</template></el-input>
                    </el-form-item>
                    <el-form-item label="可领券用户范围" prop="userRangeType" :rules="rules.selectRule">
                        <el-radio-group v-model="couponData.userRangeType">
                            <el-radio :label="1">全部用户</el-radio>
                            <el-radio :label="2">App新注册用户</el-radio>
                            <el-radio :label="3">已注册未下单用户</el-radio>
                            <el-radio :label="4">已下单用户</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="券使用期限" prop="termType" :rules="rules.selectRule">
                        <el-radio-group v-model="couponData.termType">
                            <el-radio :label="1">领取后X~Y天内有效</el-radio>
                            <el-radio :label="2">固定时间范围</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-row v-if="couponData.termType === 1">
                        <el-col span="3">
                            <el-form-item label="" prop="isValidDays" class="form-item-time" :rules="rules.inputRule">
                                <span class="form-text">领取</span>
                                <el-input-number v-model="couponData.isValidDays" :min="0" :max="360" controls-position="right" style="width:100px" @change="useDateChange"/>
                                <span class="form-text">天后开始生效</span>
                            </el-form-item>
                        </el-col>
                        <el-col span="3">
                            <el-form-item label="" prop="validDays" class="form-item-time" label-width="20px" :rules="rules.unValidDaysRule">
                                <span class="form-text">券有效期共</span>
                                <el-input-number v-model="couponData.validDays" :min="0" :max="360" controls-position="right" style="width:100px" @change="useDateChange"/>
                                <span class="form-text">天</span>
                            </el-form-item>
                            <!-- <el-form-item label="" class="form-item-time">
                                </el-form-item> -->
                        </el-col>
                        <span style="display: block; margin-left: 150px;" v-if="couponData.validDays > 0">例如领取时间是2022-2-01 14:00:00，则券有效期为{{validDateStart}}~{{validDateEnd}}</span>
                        <!-- <el-col span="24">
                        </el-col> -->
                    </el-row>
                    <el-form-item v-if="couponData.termType === 2" label="" prop="useDate" :rules="rules.useDateRule">
                        <el-date-picker
                            v-model="couponData.useDate"
                            type="datetimerange"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            range-separator="~"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            :default-time="defaultTime"
                            :teleported = "false"
                        />
                        <span> 注意：开始日期需要晚于批次开始日期</span>
                    </el-form-item>
                    <el-form-item label="使用说明" prop="couponDesc" :rules="rules.couponDesc">
                        <el-input v-model="couponData.couponDesc" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="1、全品类商品通用（不能使用优惠券商品除外） 2、限定北京，上海城市智能货柜使用" :disabled="canNotEdit"/>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="submit(couponDataRef)">提交</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, computed, onMounted, nextTick } from 'vue'
import moment from 'moment'
import { getAccList } from '@/api/marketing/coupon'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['handleClose', 'updateCoupon', 'addCoupon'])
const props = defineProps({
    listVisible: {
        type: Boolean
    },
    handleType: {
        type: String
    },
    updateCouponData: {
        type: Object
    },
    isValidTime: {
        type: String
    }
})
const couponBagConfig = ref(props.listVisible)
const validDateStart = ref(null) // 券使用期开始
const validDateEnd = ref(null) // 券使用期截止
// const dataState = reactive({})
// const {} = toRefs(dataState)
const couponData = reactive({
    couponType: '',
    maxMinusAmount: '',
    doorsillAmount: '',
    maxDiscountAmount: '',
    discountRate: '',
    applyCount: '',
    userRangeType: '',
    termType: '',
    isValidDays: '0',
    validDays: '0',
    useDate: '',
    couponDesc: ''
})

const defaultTime = [
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59)
]
// 校验规则：支持输入整数数字，可输入范围1~200000
const numberValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        if (!Number.isInteger(value)) {
            callback(new Error('支持输入整数数字'))
        } else {
            if (value > 0 && value <= 2000000) {
                callback()
            } else {
                callback(new Error('限定数量2000000张'))
            }
        }
    }
}
// 校验规则：门槛金额需大于立减金额；数值格式，支持两位小数，最大不超过9999.99
const doorsillAmountValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        const reg = /^[0-9]*(\.[0-9]{0,2})?$/
        if (!isNaN(value) && reg.test(value)) {
            if (value > 0 && value < 10000) {
                if (Number(value) > Number(couponData.maxMinusAmount)) {
                    // 如果通过校验，调用无参数的 `callback()` 即可
                    callback()
                } else {
                    callback(new Error('门槛金额需大于"最高立减金额"'))
                }
            } else {
                callback(new Error('可输入范围0~9999.99'))
            }
        } else {
            callback(new Error('仅限输入数字，支持小数点后两位'))
        }
        callback()
    }
}
// 校验规则：支持输入整数数字，可输入范围0~100
const discountRateValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        if (!Number.isInteger(value)) {
            callback(new Error('支持输入整数数字'))
        } else {
            if (value > 0 && value <= 100) {
                callback()
            } else {
                callback(new Error('请输入大于0且小于等于100的数字'))
            }
        }
    }
}
// 校验规则：数值格式，支持两位小数，最大不超过9999.99
const amountValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        const reg = /^[0-9]*(\.[0-9]{0,2})?$/
        if (!isNaN(value) && reg.test(value)) {
            if (value > 0 && value < 10000) {
                // 如果通过校验，调用无参数的 `callback()` 即可
                callback()
            } else {
                callback(new Error('可输入范围0~9999.99'))
            }
        } else {
            callback(new Error('仅限输入数字，支持小数点后两位'))
        }
        if (couponData.checkPass !== '') {
            if (!couponDataRef.value) return
            couponDataRef.value.validateField('checkPass', () => null)
        }
        callback()
    }
}

// 校验规则：过期失效时间大于开始时间
const unValidDaysValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        if (value !== 0) {
            // 如果通过校验，调用无参数的 `callback()` 即可
            callback()
        } else {
            callback(new Error('券有效期大于0'))
        }
        callback()
    }
}

// 校验规则：券使用期限固定范围在批次有效期内
const useDateValidator = (rule, value, callback) => {
    if (!value || value === '') {
        callback(new Error('请选择'))
    } else {
        const start2 = new Date(value[0]).getTime()
        const end2 = new Date(value[1]).getTime()
        if (end2 <= start2) {
            callback(new Error('结束时间应晚于开始时间'))
        }
        if (props.isValidTime && props.isValidTime[0]) {
            const start1 = new Date(props.isValidTime[0]).getTime()
            if (start2 < start1) {
                callback(new Error('开始时间应晚于批次有效期开始时间'))
            }
        }
        callback()
    }
}
// 表单项规则
const rules = reactive({
    selectRule: [{ required: true, message: '请选择', trigger: 'change' }],
    numberRule: [{ required: true, validator: numberValidator, trigger: 'change' }],
    amountRule: [{ required: true, validator: amountValidator, trigger: 'change' }],
    // freezeAmountRule: [{ required: true, validator: freezeAmountValidator, trigger: 'change' }],
    discountRateRule: [{ required: true, validator: discountRateValidator, trigger: 'change' }],
    doorsillAmountRule: [{ required: true, validator: doorsillAmountValidator, trigger: 'change' }],
    unValidDaysRule: [{ required: true, validator: unValidDaysValidator, trigger: 'change' }],
    useDateRule: [{ required: true, validator: useDateValidator, trigger: 'change' }],
    couponDesc: [{ required: true, message: '请输入', trigger: 'change' },
        { max: 200, message: '最长不超过200个字符长度', trigger: 'change' }
    ]
})

const couponDataRef = ref(null)

const handleClose = () => {
    emit('handleClose', props.visible)
}

// 营销工具change
const couponTypeChange = () => {
    couponData.discountRate = ''
    couponData.maxMinusAmount = ''
    couponData.doorsillAmount = ''
}

onMounted(() => {
    if (props.updateCouponData) {
        couponData.batchCode = props.updateCouponData.batchCode || ''
        couponData.couponType = props.updateCouponData.couponType
        couponData.maxMinusAmount = props.updateCouponData.maxMinusAmount
        couponData.doorsillAmount = props.updateCouponData.doorsillAmount
        couponData.maxDiscountAmount = props.updateCouponData.maxDiscountAmount
        couponData.discountRate = props.updateCouponData.discountRate
        couponData.applyCount = props.updateCouponData.applyCount
        couponData.userRangeType = props.updateCouponData.userRangeType
        couponData.termType = props.updateCouponData.termType
        couponData.isValidDays = props.updateCouponData.isValidDays
        couponData.validDays = props.updateCouponData.validDays
        couponData.useDate = [props.updateCouponData.useBeginDate, props.updateCouponData.useEndDate]
        couponData.couponDesc = props.updateCouponData.couponDesc
        useDateChange()
    }
})

const useDateChange = () => {
    const start = moment('2022-02-01 14:00:00').add(couponData.isValidDays, 'days')
    validDateStart.value = moment('2022-02-01 14:00:00').add(couponData.isValidDays, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
    validDateEnd.value = start.add(couponData.validDays - 1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss')
}
const submit = async (formEl) => {
    const params = {
        ...couponData
    }
    params.useBeginDate = params.useDate[0]
    params.useEndDate = params.useDate[1]
    if (couponData.termType === 1) {
        params.useBeginDate = null
        params.useEndDate = null
    } else {
        params.isValidDays = null
        params.validDays = null
    }
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            if (props.handleType === 'edit') {
                emit('updateCoupon', params)
            } else {
                emit('addCoupon', params)
            }
            handleClose()
        }
    })
}
</script>
<style lang="scss" scoped>
</style>
