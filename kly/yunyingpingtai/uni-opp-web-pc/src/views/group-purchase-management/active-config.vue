<template>
    <div class='apply-active-box'>
        <div class="info-area">
            <el-table :data="tableDataInfo" border style="width: 100%">
                <el-table-column prop="merchantInfo" label="商户信息">
                    <template v-slot="{row}">
                        <div>商户编号：{{row.merchantId}}</div>
                        <div>商户名称: {{row.merchantName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="storeInfo" label="店铺信息">
                    <template v-slot="{row}">
                        <div>门店编号：{{row.shopId}}</div>
                        <div>门店名称: {{row.shopName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsInfo" label="商品信息">
                    <template v-slot="{row}">
                        <div>sku编号：{{row.skuId}}</div>
                        <div>sku名称: {{row.skuName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template v-slot="{row}">
                        {{skuStstusValue[row.skuStatus.toString()]}}
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="原价">
                    <template v-slot="{row}">
                        <div>原价：¥{{row.channelPrice}}</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            label-position="right"
            label-width="auto"
            :rules="rules"
            class="form-box"
        >
            <el-form-item label="批次有效期" prop="isValidTime" style="width: 700px" class="form-item-time" :rules="rules.isValidTimeRule">
                <el-date-picker
                    v-model="ruleForm.isValidTime"
                    type="datetimerange"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    range-separator="~"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    :disabled="canNotEdit"
                    :default-time="defaultTime"
                />
                <span>注意：仅在批次有效期内可领取优惠券</span>
            </el-form-item>
            <el-form-item label="券有效期" prop="termType" :rules="rules.selectRule">
                <el-radio-group v-model="ruleForm.termType">
                    <el-radio :label="1">领取后X~Y天内有效</el-radio>
                    <el-radio :label="2">固定时间范围</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-row v-if="ruleForm.termType === 1">
                <el-col span="3">
                    <el-form-item label="" prop="isValidDays" class="form-item-time" :rules="rules.inputRule">
                        <span class="form-text">领取</span>
                        <el-input-number v-model="ruleForm.isValidDays" :min="0" :max="360" controls-position="right" style="width:100px" @change="useDateChange"/>
                        <span class="form-text">天后开始生效</span>
                    </el-form-item>
                </el-col>
                <el-col span="3">
                    <el-form-item label="" prop="validDays" class="form-item-time" label-width="20px" :rules="rules.unValidDaysRule">
                        <span class="form-text">券有效期共</span>
                        <el-input-number v-model="ruleForm.validDays" :min="0" :max="360" controls-position="right" style="width:100px" @change="useDateChange"/>
                        <span class="form-text">天</span>
                    </el-form-item>
                </el-col>
                <span style="display: block; margin-left: 150px;" v-if="ruleForm.validDays > 0">例如领取时间是2022-2-01 14:00:00，则券有效期为{{validDateStart}}~{{validDateEnd}}</span>
            </el-row>
            <el-form-item v-if="ruleForm.termType === 2" label="" prop="useDate" :rules="rules.useDateRule">
                <el-date-picker
                    v-model="ruleForm.useDate"
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
            <el-form-item label="星期几接待" prop="weeks">
                <el-checkbox-group v-model="ruleForm.weeks">
                    <el-checkbox label="星期1" />
                    <el-checkbox label="星期2" />
                    <el-checkbox label="星期3" />
                    <el-checkbox label="星期4" />
                    <el-checkbox label="星期5" />
                    <el-checkbox label="星期6" />
                    <el-checkbox label="星期7" />
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="接待时间">
                <span>
                    时段一
                </span>
                <el-form-item label="" prop="timeRangesStart1" class="timeRange">
                    <el-time-select
                        v-model="ruleForm.timeRangesStart1"
                        :max-time="ruleForm.timeRangesEnd1"
                        class="mr-4"
                        placeholder="开始时间"
                        step="01:00"
                        start="00:00"
                        end="24:00"
                    />
                </el-form-item>
                <el-form-item prop="timeRangesEnd1" class="timeRange">
                    <el-time-select
                        v-model="ruleForm.timeRangesEnd1"
                        :min-time="ruleForm.timeRangesStart1"
                        placeholder="结束时间"
                        step="01:00"
                        start="00:00"
                        end="24:00"
                    />
                </el-form-item>
                <div style="width: 100%;height: 1px"></div>
                <span>
                    时段二
                </span>
                <el-form-item label="" prop="timeRangesStart2" class="timeRange">
                    <el-time-select
                        v-model="ruleForm.timeRangesStart2"
                        :min-time="ruleForm.timeRangesEnd1"
                        :max-time="ruleForm.timeRangesEnd2"
                        class="mr-4"
                        placeholder="开始时间"
                        step="01:00"
                        start="00:00"
                        end="24:00"
                    />
                </el-form-item>
                <el-form-item prop="timeRangesEnd2" class="timeRange">
                    <el-time-select
                        v-model="ruleForm.timeRangesEnd2"
                        :min-time="ruleForm.timeRangesStart2"
                        placeholder="结束时间"
                        step="01:00"
                        start="00:00"
                        end="24:00"
                    />
                </el-form-item>
            </el-form-item>
            <el-form-item label="券数量" prop="voucherCount">
                <el-input v-model.number="ruleForm.voucherCount" :disabled="canNotEdit" class="form-action-item-50w"></el-input>
            </el-form-item>
            <el-form-item label="单人限购数量" prop="singleUserMax">
                <el-input v-model.number="ruleForm.singleUserMax" :disabled="canNotEdit" class="form-action-item-50w"></el-input>
            </el-form-item>
            <el-form-item label="团购价" prop="specialPrice">
                <el-input
                    v-model="ruleForm.specialPrice"
                    :disabled="canNotEdit"
                    class="form-action-item-50w"
                >
                    <template v-slot:suffix>¥</template>
                </el-input>
            </el-form-item>
        </el-form>
        <div style="text-align: center;">
            <el-button type="primary"  @click="submitForm(ruleFormRef)" >
                提交
            </el-button>
            <el-button type="primary" @click="goBack()">
                关闭
            </el-button>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { commonQuery } from '@/api/group-purchase/index.js'
import { ElMessage } from 'element-plus'
import moment from 'moment'

const route = useRoute()
const router = useRouter()
const store = useStore()

const type = route.params.type
const skuId = route.params.skuId
const batchCode = route.params.batchCode
const userInfo = computed(() => store.state.userInfo)

const skuStstusValue = reactive({
    1: '待审核',
    2: '已审核',
    3: '已拒绝',
    4: '已上架',
    5: '下架可上架',
    6: '下架',
    7: '待上架'
})
// 是否可编辑
const canEdit = computed(() => {
    if (route.params.type === 'check') {
        return true
    } else {
        return false
    }
})
const ruleFormRef = ref(null)
const ruleForm = reactive({
    isValidTime: [],
    termType: '',
    isValidDays: '',
    validDays: '',
    useDate: '',
    weeks: ['星期1', '星期2', '星期3', '星期4', '星期5', '星期6', '星期7'],
    timeRangesStart1: '',
    timeRangesEnd1: '',
    timeRangesStart2: '',
    timeRangesEnd2: '',
    voucherCount: '',
    singleUserMax: '',
    specialPrice: ''
})

const tableDataInfo = ref([])
const skuInfo = ref({}) // sku详情信息

// 查询单个sku详情
const getSkuInfo = async () => {
    const params = {
        skuIds: [skuId],
        appKey: 'A1001000',
        busiCode: 'A1001003'
    }
    const val = {
        configCode: 'MS55704494929162248',
        name: 'sku通用查询本地生活',
        source: '商品中台'
    }
    const res = await commonQuery(params, val)
    if (res.code === '200') {
        tableDataInfo.value = res.data.list
        skuInfo.value = tableDataInfo.value[0]
    }
}
// 查询单个活动详情
const getActiveInfo = async () => {
    const params = {
        batchCode: batchCode,
        operateFlag: 3,
        appKey: 'A1001000',
        busiCode: 'A1001003'
    }
    const val = {
        configCode: 'MS55704494929162244',
        name: '单个活动详情',
        source: '核销中台'
    }
    const res = await commonQuery(params, val)
    if (res.code === '200') {
        const useTimeContent = JSON.parse(res.data.useTimeContent)
        const timeRanges1 = useTimeContent.timeRanges[0].split('-')
        const timeRanges2 = useTimeContent.timeRanges[1].split('-')
        ruleForm.isValidTime = [res.data.isValidBeginTime, res.data.isValidEndTime]
        ruleForm.termType = res.data.termType
        ruleForm.isValidDays = res.data.isValidDays
        ruleForm.validDays = res.data.validDays
        ruleForm.useDate = [res.data.useBeginDate, res.data.useEndDate]
        ruleForm.weeks = useTimeContent.weeks
        ruleForm.timeRangesStart1 = timeRanges1[0]
        ruleForm.timeRangesEnd1 = timeRanges1[1]
        ruleForm.timeRangesStart2 = timeRanges2[0]
        ruleForm.timeRangesEnd2 = timeRanges2[1]
        ruleForm.voucherCount = res.data.voucherCount
        ruleForm.singleUserMax = res.data.singleUserMax
        ruleForm.specialPrice = res.data.specialPrice / 100
        useDateChange()
    }
}

// 校验规则：过期失效时间大于开始时间
const unValidDaysValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        if (value >= ruleForm.isValidDays) {
            // 如果通过校验，调用无参数的 `callback()` 即可
            callback()
        } else {
            callback(new Error('过期失效时间大于开始生效时间'))
        }
        callback()
    }
}

// 校验规则：批次有效期开始时间大于当前时间
const isValidTimeValidator = (rule, value, callback) => {
    if (canEdit.value) {
        return
    }
    if (!value || value === '') {
        callback(new Error('请选择'))
    } else {
        const currTime = Date.now()
        const start1 = new Date(value[0]).getTime()
        const start2 = new Date(ruleForm.useDate[0]).getTime()
        if (start1 < currTime) {
            callback(new Error('批次有效期开始时间应大于当前时间'))
        } else if (start2 && start2 < start1) {
            callback(new Error('批次有效期开始时间应小于券使用开始时间'))
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
            callback(new Error('结束时间应大于开始时间'))
        }
        if (ruleForm.isValidTime && ruleForm.isValidTime[0]) {
            const start1 = new Date(ruleForm.isValidTime[0]).getTime()
            if (start2 < start1) {
                callback(new Error('开始时间应大于批次有效期开始时间'))
            }
        }
        callback()
    }
}
// 校验规则：数值格式，支持两位小数，最大不超过9999.99
const amountValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        const reg = /^[0-9]*(\.[0-9]{0,2})?$/
        if (!isNaN(value) && reg.test(value)) {
            callback()
        } else {
            callback(new Error('仅限输入数字，支持小数点后两位'))
        }
        if (ruleForm.checkPass !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('checkPass', () => null)
        }
        callback()
    }
}
const validDateStart = ref(null) // 券使用期开始
const validDateEnd = ref(null) // 券使用期截止
const useDateChange = () => {
    const start = moment('2022-02-01 14:00:00').add(ruleForm.isValidDays, 'days')
    validDateStart.value = moment('2022-02-01 14:00:00').add(ruleForm.isValidDays, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
    validDateEnd.value = start.add(ruleForm.validDays - 1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss')
}
// 表单项规则
const rules = reactive({
    isValidTimeRule: [{ required: true, validator: isValidTimeValidator, trigger: 'change' }],
    termType: [{ required: true, message: '请输入', trigger: 'change' }],
    weeks: [{ required: true, message: '请输入', trigger: 'change' }],
    timeRangesStart1: [{ required: true, message: '请选择', trigger: 'change' }],
    timeRangesEnd1: [{ required: true, message: '请选择', trigger: 'change' }],
    timeRangesStart2: [{ required: true, message: '请选择', trigger: 'change' }],
    timeRangesEnd2: [{ required: true, message: '请选择', trigger: 'change' }],
    unValidDaysRule: [{ required: true, validator: unValidDaysValidator, trigger: 'change' }],
    useDateRule: [{ required: true, validator: useDateValidator, trigger: 'change' }],
    voucherCount: [{ required: true, message: '请输入', trigger: 'change' }],
    singleUserMax: [{ required: true, message: '请输入', trigger: 'change' }],
    specialPrice: [{ required: true, validator: amountValidator, trigger: 'change' }]
})
// 提交表单
const submitForm = async (formEl) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            const param = {
                applierId: userInfo.value.account,
                applier: userInfo.value.name,
                operatorId: userInfo.value.account,
                batchType: '1',
                merchantName: skuInfo.value.merchantName,
                merchantCode: skuInfo.value.merchantCode,
                goodsRangeType: '3',
                goodsRangeInfo: [{
                    skuId: skuInfo.value.skuId,
                    skuName: skuInfo.value.skuName
                }],
                storeRangeType: '2',
                storeInfo: [{
                    storeId: skuInfo.value.shopId,
                    storeName: skuInfo.value.shopName
                }],
                markOffPrice: skuInfo.value.channelPrice * 100,
                isValidBeginTime: ruleForm.isValidTime[0],
                isValidEndTime: ruleForm.isValidTime[1],
                termType: ruleForm.termType,
                isValidDays: ruleForm.isValidDays,
                validDays: ruleForm.validDays,
                useBeginDate: ruleForm.useDate[0],
                useEndDate: ruleForm.useDate[1],
                useTimeContent: {
                    weeks: ruleForm.weeks,
                    timeRanges: [ruleForm.timeRangesStart1 + '-' + ruleForm.timeRangesEnd1, ruleForm.timeRangesStart2 + '-' + ruleForm.timeRangesEnd2]
                },
                voucherCount: ruleForm.voucherCount,
                singleUserMax: ruleForm.singleUserMax,
                specialPrice: ruleForm.specialPrice * 100
            }
            if (ruleForm.termType === 1) {
                delete param.useEndDate
            } else if (ruleForm.termType === 2) {
                delete param.isValidDays
                delete param.validDays
            }
            let val = {}
            if (route.params.type === 'add' || route.params.type === 'copy') {
                param.operateFlag = 0
                val = {
                    configCode: 'MS55704494929162241',
                    name: '新建团购券',
                    source: '核销中台'
                }
            } else {
                param.operateFlag = 1
                param.batchCode = batchCode
                val = {
                    configCode: 'MS55704494929162242',
                    name: '编辑团购券',
                    source: '核销中台'
                }
            }
            const res = await commonQuery(param, val)
            if (res.code === '200') {
                goBack()
                ElMessage({
                    message: res.message,
                    type: 'success'
                })
            }
        }
    })
}
const goBack = () => {
    router.go(-1)
}

onMounted(async () => {
    await getSkuInfo()
    if (type !== 'add') {
        await getActiveInfo()
    }
})
</script>
<style lang="scss" scoped>
.apply-active-box{
    .info-area{
        margin-bottom: 30px;
    }
    .form-box{
        .form-action-item-50w{
            width: 50%;
        }
        .timeRange{
            :deep(.el-form-item__label-wrap){
                width: 0;
                margin-left: 20px !important;
            }
        }
    }
}
</style>
