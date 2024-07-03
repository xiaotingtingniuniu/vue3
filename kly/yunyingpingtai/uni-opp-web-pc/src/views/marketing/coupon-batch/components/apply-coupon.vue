<template>
    <div class='coupon-submit-box'>
        <el-dialog v-model="dialogVisible"  :before-close="handleClose" width="60%">
            <template #title>
                <div class='dialog-title'>
                    申请优惠券批次
                </div>
            </template>
            <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="150px">
                <el-form-item label="券批次名称" prop="batchName" :rules="rules.name">
                    <el-input class="form-action-item-50w" v-model="ruleForm.batchName" placeholder="最多输入20汉字长度" clearable :disabled="canNotEdit"/>
                </el-form-item>
                <el-form-item label="申请人">
                    {{userInfo.account}}
                </el-form-item>
                <el-form-item label="状态">
                    {{statusKeyValue[ruleForm.batchStatus]}}
                </el-form-item>
                <el-form-item label="业务线" prop="businessCode" :rules="rules.selectRule">
                    <el-select class="form-action-item-50w" v-model="ruleForm.businessCode" clearable placeholder="请选择" :disabled="canNotEdit">
                        <el-option label="恒生活" value="A1001" />
                        <el-option label="小恒数科" value="A1002" />
                        <el-option label="汇财" value="A1003" />
                        <el-option label="保险" value="A1004" />
                    </el-select>
                </el-form-item>
                <el-form-item label="子系统" prop="subCode" :rules="rules.selectRule" v-if="ruleForm.businessCode === 'A1001'">
                    <el-select class="form-action-item-50w" v-model="ruleForm.subCode" clearable placeholder="请选择" :disabled="canNotEdit">
                        <el-option label="恒生活App" value="A1001001" />
                        <el-option label="智能货柜" value="A1001002" />
                        <el-option label="恒生活众包" value="A1001003" />
                        <el-option label="恒掌柜" value="A1001004" />
                        <el-option label="供应链" value="A1001005" />
                        <el-option label="交付" value="A1001006" />
                    </el-select>
                </el-form-item>
                <el-form-item label="交易场景" prop="dealScene" :rules="rules.selectRule" v-if="ruleForm.businessCode === 'A1001'">
                    <el-select class="form-action-item-50w" v-model="ruleForm.dealScene" clearable placeholder="请选择" :disabled="canNotEdit" multiple>
                        <el-option label="预约柜" value="1" />
                        <el-option label="到店支付" value="2" />
                        <el-option label="扫码开门" value="3" />
                    </el-select>
                </el-form-item>
                <!-- 本期不做，暂定下期 -->
                <!-- <el-row v-for="(item, index) in ruleForm.chengbenzhanghu" :key="index" >
                    <el-col :span="15">
                        <el-form-item :label="index === 0 ? '成本账户' : ''" :prop="'chengbenzhanghu.'+ index + '.code'" :rules="rules.selectRule">
                            <span class="form-text form-text-btn" @click="showSubDialog('costAccount')">选择账户</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="承担比例" :prop="'chengbenzhanghu.'+ index + '.percent'" :rules="rules.amountRule" label-width="80px">
                            <el-input v-model="item.percent"><template v-slot:suffix>%</template></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3" v-if="index === ruleForm.chengbenzhanghu.length - 1">
                        <span class="form-text form-text-btn" v-if="ruleForm.chengbenzhanghu.length < 3" @click="addCostCount">新增</span>
                        <span class="form-text form-text-btn" v-if="index > 0" @click.prevent="removeCostCount(index)">删除</span>
                    </el-col>
                </el-row> -->
                <el-row>
                </el-row>
                <el-form-item label="营销工具" prop="couponType" :rules="rules.selectRule">
                    <el-radio-group v-model="ruleForm.couponType" :disabled="canNotEdit" @change="couponTypeChange">
                        <el-radio :label="1">立减券</el-radio>
                        <el-radio :label="2">满减券</el-radio>
                        <el-radio :label="3">折扣券</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="ruleForm.couponType === 1 || ruleForm.couponType === 2" label="最高立减金额" prop="maxMinusAmount" :rules="rules.amountRule" @change="getFreezeAmount">
                    <el-input class="form-action-item-50w" v-model="ruleForm.maxMinusAmount" placeholder="填写数值，支持2位小数，不得为0" :disabled="canNotEdit"><template v-slot:suffix>元</template></el-input>
                </el-form-item>
                <el-form-item  v-if="ruleForm.couponType === 2" label="门槛金额" prop="doorsillAmount" :rules="rules.doorsillAmountRule">
                    <el-input class="form-action-item-50w" v-model="ruleForm.doorsillAmount" placeholder="填写数值，支持2位小数，不得为0，必须大于最高立减金额" :disabled="canNotEdit"><template v-slot:suffix>元</template></el-input>
                </el-form-item>
                <el-form-item  v-if="ruleForm.couponType === 3" label="折扣比例" prop="discountRate" :rules="rules.discountRateRule" @change="getFreezeAmount">
                    <el-input class="form-action-item-50w" v-model.number="ruleForm.discountRate" placeholder="支付价格 = 原价 ×（1-折扣比例）" :disabled="canNotEdit"><template v-slot:suffix>%</template></el-input>
                </el-form-item>
                <el-form-item label="申请数量" prop="applyCount" :rules="rules.numberRule" @change="getFreezeAmount">
                    <el-input class="form-action-item-50w" v-model.number="ruleForm.applyCount" placeholder="填写数值，仅支持整数，不得为0" :disabled="canNotEdit"><template v-slot:suffix>张</template></el-input>
                </el-form-item>
                <el-form-item label="项目预算" prop="freezeAmount" :rules="rules.freezeAmountRule">
                    <el-input class="form-action-item-50w" v-model="ruleForm.freezeAmount" placeholder="默认冻结营销费用金额，优惠券失效后自动解冻。" :disabled="ruleForm.couponType !== 3 || canNotEdit"><template v-slot:suffix>元</template></el-input>
                </el-form-item>
                <el-form-item label="可领券用户范围" prop="userRangeType" :rules="rules.selectRule">
                    <el-radio-group v-model="ruleForm.userRangeType" :disabled="canNotEdit">
                        <el-radio :label="1">全部用户</el-radio>
                        <el-radio :label="2">新用户</el-radio>
                        <el-radio :label="3">仅限会员</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择商品" prop="goodsRangeType" :rules="rules.selectRule">
                    <el-radio-group v-model="ruleForm.goodsRangeType" :disabled="canNotEdit">
                        <el-radio :label="1">全部商品</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 本期不做，暂定下期 -->
                <!-- <el-form-item label="生效城市" prop="item12" :rules="rules.selectRule">
                    <el-cascader class="form-action-item-50w" ref="authorityRef" :options="dataState.cityOption" clearable v-model="ruleForm.item12" :props="cascaderProps" :show-all-levels="false" @change="authorityChange"/>
                </el-form-item> -->
                <!-- <el-form-item label="选择商品" prop="goodsRangeType" :rules="rules.selectRule">
                    <el-radio-group v-model="ruleForm.goodsRangeType">
                        <el-radio :label="1">全部商品</el-radio>
                        <el-radio :label="2">部分商品</el-radio>
                    </el-radio-group>
                    <span class="form-text-btn" @click="showSubDialog('goods')">增加</span>
                </el-form-item>
                <div class="goods-list">
                    <system-list
                        :tHead="tHead"
                        :tableData="tableData"
                        v-model:current-page="pageinfo.currentPage"
                        v-model:page-size="pageinfo.pageSize"
                        :total="pageinfo.total"
                        @size-change="sizeChange"
                        @current-change="currentChange"
                    >
                        <template #regType="row">
                            {{regTypeKeyValue[row.row.regType]}}
                        </template>
                        <template #userStatus="row">
                            {{userStatusKeyValue[row.row.userStatus]}}
                        </template>
                    </system-list>
                </div> -->
                <el-form-item label="批次有效期" prop="isValidTime" class="form-item-time" :rules="rules.isValidTimeRule">
                    <el-date-picker
                        class="form-action-item-50w"
                        v-model="ruleForm.isValidTime"
                        type="datetimerange"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        range-separator="~"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        :disabled="canNotEdit"
                    />
                    <span>注意：仅在批次有效期内可领取优惠券</span>
                </el-form-item>
                <el-form-item label="券使用期限" prop="termType" :rules="rules.selectRule">
                    <el-radio-group v-model="ruleForm.termType" :disabled="canNotEdit">
                        <el-radio :label="1">领取后X~Y天内有效</el-radio>
                        <el-radio :label="2">固定时间范围</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-row v-if="ruleForm.termType === 1">
                    <el-col span="3">
                        <el-form-item label="" prop="isValidDays" class="form-item-time" :rules="rules.inputRule">
                            <span class="form-text">领取</span>
                            <el-input-number v-model="ruleForm.isValidDays" :min="0" :max="360" controls-position="right" :disabled="canNotEdit" style="width:100px"/>
                            <span class="form-text">天后开始生效</span>
                        </el-form-item>
                    </el-col>
                    <el-col span="3">
                        <el-form-item label="" prop="unValidDays" class="form-item-time" label-width="20px" :rules="rules.unValidDaysRule">
                            <el-input-number v-model="ruleForm.unValidDays" :min="0" :max="360" controls-position="right" :disabled="canNotEdit" style="width:100px"/>
                            <span class="form-text">天后过期失效</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item v-if="ruleForm.termType === 2" label="" prop="useDate" class="form-item-time" :rules="rules.useDateRule">
                    <el-date-picker
                        v-model="ruleForm.useDate"
                        type="daterange"
                        value-format="YYYY-MM-DD"
                        range-separator="~"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        :disabled="canNotEdit"
                    />
                    <span>注意：开始日期需要晚于批次开始日期</span>
                </el-form-item>
                <el-form-item label="单个用户领取上限" prop="singleUserMax" :rules="rules.singleUserMax">
                    <el-input class="form-action-item-50w" v-model.number="ruleForm.singleUserMax" placeholder="填写数值，仅支持整数，不得为0" :disabled="canNotEdit"><template v-slot:suffix>张</template></el-input>
                </el-form-item>
                <!-- <el-form-item label="POI范围">
                    <span class="form-text">预计40个</span>
                    <span class="form-text">查看列表</span>
                </el-form-item> -->
                <el-form-item label="POI类型" prop="deviceRangeInfo.poiType" :rules="rules.selectRule">
                    <el-radio-group v-model="ruleForm.deviceRangeInfo.poiType" :disabled="canNotEdit">
                        <!-- <el-radio :label="1">智能柜</el-radio> -->
                        <el-radio :label="2">门店</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div v-if="ruleForm.deviceRangeInfo.poiType === 1">
                    <el-form-item label="设备运营模式" prop="deviceRangeInfo.operateModel" :rules="rules.selectRule">
                        <el-radio-group v-model="ruleForm.deviceRangeInfo.operateModel" :disabled="canNotEdit">
                            <el-radio :label="1">全部</el-radio>
                            <el-radio :label="2">自营</el-radio>
                            <el-radio :label="3">代运营</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="在线状态" prop="deviceRangeInfo.onlineStatus" :rules="rules.selectRule">
                        <el-radio-group v-model="ruleForm.deviceRangeInfo.onlineStatus" :disabled="canNotEdit">
                            <el-radio :label="1">全部</el-radio>
                            <el-radio :label="2">在线</el-radio>
                            <el-radio :label="3">离线</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="指定设备" prop="deviceRangeInfo.isAssignDevice" :rules="rules.selectRule">
                        <el-radio-group v-model="ruleForm.deviceRangeInfo.isAssignDevice" :disabled="canNotEdit">
                            <el-radio :label="1">全部</el-radio>
                            <el-radio :label="2">部分设备</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <div v-if="ruleForm.deviceRangeInfo.poiType === 2">
                    <el-form-item label="店铺类别" prop="deviceRangeInfo.storeType" :rules="rules.selectRule">
                        <el-radio-group v-model="ruleForm.deviceRangeInfo.storeType" :disabled="canNotEdit">
                            <el-radio :label="1">全部</el-radio>
                            <el-radio :label="2">直营</el-radio>
                            <el-radio :label="3">加盟</el-radio>
                            <el-radio :label="4">合作</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="店铺状态" prop="deviceRangeInfo.storeStatus" :rules="rules.selectRule">
                        <el-radio-group v-model="ruleForm.deviceRangeInfo.storeStatus" :disabled="canNotEdit">
                            <el-radio :label="1">全部</el-radio>
                            <el-radio :label="2">开启</el-radio>
                            <el-radio :label="3">关闭</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="指定门店" prop="deviceRangeInfo.isAssignStore" :rules="rules.selectRule">
                        <el-radio-group v-model="ruleForm.deviceRangeInfo.isAssignStore" :disabled="canNotEdit">
                            <el-radio :label="1">全部</el-radio>
                            <!-- <el-radio :label="2">部分门店</el-radio> -->
                        </el-radio-group>
                    </el-form-item>
                    <!-- <el-form-item label="" :rules="rules.selectRule">
                         <span class="form-text">以选择X个门店</span>
                    </el-form-item> -->
                </div>
                <el-form-item label="使用说明" prop="couponDesc" :rules="rules.textRule">
                    <el-input v-model="ruleForm.couponDesc" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="1、全品类商品通用（不能使用优惠券商品除外） 2、限定北京，上海城市智能货柜使用" :disabled="canNotEdit"/>
                </el-form-item>
                <el-form-item label="项目投入产出测算" prop="couponCalculate" :rules="rules.textRule">
                    <el-input v-model="ruleForm.couponCalculate" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="预计投入1000元，GMV上升2000元" :disabled="canNotEdit"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary"  v-if="handleType === 'add' || handleType === 'edit'" @click="submitForm(ruleFormRef)">
                        提交
                    </el-button>
                    <el-button type="primary" v-if="handleType === 'approval'" @click="approvalHandle(2)">
                        审批通过
                    </el-button>
                    <el-button type="primary" v-if="handleType === 'approval'" @click="approvalHandle(3)">
                        审批拒绝
                    </el-button>
                    <el-button type="primary" @click="handleClose">
                        取消
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <com-List v-if="listDialogConfig" :listVisible ='listDialogConfig' :listType="dataState.subListType" @handleClose="listDialogConfig = false"></com-List>
    </div>
</template>
<script setup>
import { reactive, ref, toRefs, computed } from 'vue'
import comList from './apply-coupon-comList.vue'
import { addCouponBatch, getCouponDataSingle, updateCouponBatch, approvalCouponBatch } from '@/api/marketing/coupon'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'

// const { proxy } = getCurrentInstance()
// const cascaderProps = { multiple: true } // 生效城市可多选
const props = defineProps({
    visible: {
        type: Boolean
    },
    batchCode: {
        type: String
    },
    subCode: {
        type: String
    },
    handleType: {
        type: String
    },
    handleAuditId: {
        type: Number
    }
})

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const canNotEdit = computed(() => props.handleType === 'detail' || props.handleType === 'approval')
const listDialogConfig = ref(false) // 页面子列表弹框

const handleType = ref(props.handleType)
const dialogVisible = ref(props.visible)
const emit = defineEmits(['handleClose', 'fevent'])
const handleClose = () => {
    emit('handleClose', props.visible)
}
const ruleFormRef = ref('')
const dataState = reactive({
    authorityCheckedNodes: [],
    subListType: '', // 子弹框列表
    statusKeyValue: {
        1: '草稿',
        2: '待审批',
        3: '审批驳回',
        4: '待开始',
        5: '在线',
        6: '已停止',
        7: '已结束'
    }
})
const { statusKeyValue } = toRefs(dataState)
const ruleForm = reactive({
    batchName: '',
    batchStatus: 1,
    businessCode: '',
    subCode: '',
    dealScene: '',
    couponType: '',
    maxMinusAmount: '',
    doorsillAmount: '',
    discountRate: '',
    applyCount: '',
    freezeAmount: '',
    userRangeType: '',
    goodsRangeType: '',
    isValidTime: '',
    termType: '',
    isValidDays: '',
    useDate: '',
    singleUserMax: '',
    deviceRangeInfo: {
        poiType: '',
        storeType: '',
        storeStatus: '',
        isAssignStore: ''
    },
    couponDesc: '',
    couponCalculate: ''
})
// // 商品列表头部
// const tHead = [
//     { align: 'center', tooltip: true, type: 'selection', width: '60' },
//     { align: 'center', tooltip: true, prop: 'userId', label: 'sku', width: 250 },
//     { align: 'center', tooltip: true, prop: 'subUserId', label: '当前价格', width: 250 },
//     { align: 'center', tooltip: true, prop: 'nickName', label: '最高折扣率', width: 100 },
//     { align: 'center', tooltip: true, prop: 'phoneMobile', label: '优惠后价格', width: 100 },
//     { align: 'center', prop: 'button', label: '操作', minWidth: 200, slot: true }
// ]
// 获取项目预算金额
const getFreezeAmount = () => {
    if (ruleForm.couponType === 3) {
        if (ruleForm.discountRate !== '' && ruleForm.applyCount !== '') {
            ruleForm.freezeAmount = 10 * ruleForm.discountRate * ruleForm.applyCount / 100
        }
    } else {
        if (ruleForm.maxMinusAmount !== '' && ruleForm.applyCount !== '') {
            ruleForm.freezeAmount = Number(ruleForm.maxMinusAmount) * 100 * ruleForm.applyCount / 100
        }
    }
}
const couponTypeChange = () => {
    ruleForm.discountRate = ''
    ruleForm.maxMinusAmount = ''
    ruleForm.doorsillAmount = ''
    ruleForm.freezeAmount = ''
}

// 校验规则：支持输入整数数字，可输入范围0~100
const discountRateValidator = (rule, value, callback) => {
    if (canNotEdit.value) {
        return
    }
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        if (!Number.isInteger(value)) {
            callback(new Error('支持输入整数数字'))
        } else {
            if (value > 0 && value < 100) {
                callback()
            } else {
                callback(new Error('折扣比例应小于100%'))
            }
        }
    }
}
// 校验规则：支持输入整数数字，可输入范围1~999999999
const numberValidator = (rule, value, callback) => {
    if (canNotEdit.value) {
        return
    }
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        if (!Number.isInteger(value)) {
            callback(new Error('支持输入整数数字'))
        } else {
            if (value > 0 && value <= 100000) {
                callback()
            } else {
                callback(new Error('限定数量100000张'))
            }
        }
    }
}

// 校验规则：支持输入整数数字，可输入范围1~99999
const singleUserMaxValidator = (rule, value, callback) => {
    if (canNotEdit.value) {
        return
    }
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        if (!Number.isInteger(value)) {
            callback(new Error('支持输入整数数字'))
        } else {
            if (value > 0 && value < 100000) {
                callback()
            } else {
                callback(new Error('限定数量99999张'))
            }
        }
    }
}

// 校验规则：数值格式，支持两位小数,最低预算
const freezeAmountValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        const reg = /^[0-9]*(\.[0-9]{0,2})?$/
        if (!isNaN(value) && reg.test(value)) {
            if (ruleForm.couponType === 3) {
                const minValue = 10 * ruleForm.discountRate * ruleForm.applyCount / 100
                if (value >= minValue) {
                    // 如果通过校验，调用无参数的 `callback()` 即可
                    callback()
                } else {
                    callback(new Error('不得低于' + minValue + '(10*折扣比例*申请数量)'))
                }
            }
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
        if (ruleForm.checkPass !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('checkPass', () => null)
        }
        callback()
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
                if (Number(value) > Number(ruleForm.maxMinusAmount)) {
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

// 校验规则：过期失效时间大于开始时间
const unValidDaysValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        if (value > ruleForm.isValidDays) {
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
    if (canNotEdit.value) {
        return
    }
    if (value === '') {
        callback(new Error('请选择'))
    } else {
        const start = new Date(value[0]).getTime()
        const currTime = Date.now()
        if (start > currTime) {
            callback()
        } else {
            callback(new Error('批次有效期开始时间应大于当前时间'))
        }
        callback()
    }
}

// 校验规则：券使用期限固定范围在批次有效期内
const useDateValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请选择'))
    } else {
        const start1 = new Date(ruleForm.isValidTime[0]).getTime()
        const start2 = new Date(value[0]).getTime()
        if (start2 < start1) {
            callback(new Error('开始时间应大于批次有效期开始时间'))
        } else {
            callback()
        }
        callback()
    }
}

// 校验规则：到店支付场景不能与其他场景共同选择
const dealSceneValidator = (rule, value, callback) => {
    if (value.length === 0) {
        callback(new Error('请选择'))
    } else {
        if (value.length > 1 && value.indexOf('2') > -1) {
            callback(new Error('到店支付场景不能与其他场景共同选择'))
        } else {
            callback()
        }
        callback()
    }
}
// 表单项规则
const rules = reactive({
    inputRule: [{ required: true, message: '请输入', trigger: 'change' }],
    selectRule: [{ required: true, message: '请选择', trigger: 'change' }],
    dataAuthority: [{ required: true, message: '请选择', trigger: 'change' }],
    numberRule: [{ required: true, validator: numberValidator, trigger: 'change' }],
    singleUserMax: [{ required: true, validator: singleUserMaxValidator, trigger: 'change' }],
    amountRule: [{ required: true, validator: amountValidator, trigger: 'change' }],
    freezeAmountRule: [{ required: true, validator: freezeAmountValidator, trigger: 'change' }],
    discountRateRule: [{ required: true, validator: discountRateValidator, trigger: 'change' }],
    doorsillAmountRule: [{ required: true, validator: doorsillAmountValidator, trigger: 'change' }],
    unValidDaysRule: [{ required: true, validator: unValidDaysValidator, trigger: 'change' }],
    isValidTimeRule: [{ required: true, validator: isValidTimeValidator, trigger: 'change' }],
    useDateRule: [{ required: true, validator: useDateValidator, trigger: 'change' }],
    dealSceneRule: [{ required: true, validator: dealSceneValidator, trigger: 'change' }],
    name: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 20, message: '最长不超过20个字符长度', trigger: 'change' }
    ],
    textRule: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 200, message: '最长不超过200个字符长度', trigger: 'change' }
    ]
})

// 获取优惠券批次单条数据
const getsingleData = async () => {
    const params = {
        appKey: props.subCode,
        busiCode: props.subCode,
        sceneCode: '1',
        functionCode: 'functionCode',
        batchCode: props.batchCode,
        batchStatus: 1,
        operatorId: userInfo.value.account
    }
    const res = await getCouponDataSingle(params)
    Object.assign(ruleForm, res.data)
    ruleForm.isValidTime = [res.data.isValidBeginTime, res.data.isValidEndTime]
    ruleForm.useDate = [res.data.useBeginDate, res.data.useEndDate]
    ruleForm.maxMinusAmount = res.data.maxMinusAmount / 100
    ruleForm.doorsillAmount = res.data.doorsillAmount / 100
    ruleForm.freezeAmount = res.data.freezeAmount / 100
    ruleForm.discountRate = res.data.discountRate * 100
    ruleForm.dealScene = res.data.dealScene.split(',')
}
if (props.handleType !== 'add') {
    getsingleData()
}

// 审批操作
const approvalHandle = async (type) => {
    const params = {
        appKey: props.subCode,
        busiCode: props.subCode,
        sceneCode: '1',
        functionCode: 'functionCode',
        batchCode: props.batchCode,
        auditStatus: type,
        operatorId: userInfo.value.account,
        auditorId: userInfo.value.account,
        auditorName: userInfo.value.account,
        id: props.handleAuditId,
        gmtOperate: new Date().getTime()
    }
    const res = await approvalCouponBatch(params)
    if (res.code === '200') {
        handleClose()
        ElMessage({
            message: res.message,
            type: 'success'
        })
        emit('fevent')
    }
}

// 提交表单
const submitForm = async (formEl) => {
    const params = {
        ...ruleForm,
        appKey: ruleForm.subCode,
        busiCode: ruleForm.subCode,
        operatorId: userInfo.value.account,
        applier: userInfo.value.name,
        applierId: userInfo.value.account,
        gmtOperate: new Date().getTime()
    }
    params.isValidBeginTime = params.isValidTime[0] || ''
    params.isValidEndTime = params.isValidTime[1] || ''
    params.useBeginDate = params.useDate[0] || ''
    params.useEndDate = params.useDate[1] || ''
    params.maxMinusAmount = params.maxMinusAmount * 100
    params.doorsillAmount = params.doorsillAmount * 100
    params.freezeAmount = params.freezeAmount * 100
    params.discountRate = params.discountRate / 100
    params.dealScene = params.dealScene.length !== 0 ? params.dealScene.join() : ''
    delete params.isValidTime
    delete params.useDate
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            if (props.handleType === 'add') {
                const res = await addCouponBatch({ ...params })
                if (res.code === '200') {
                    handleClose()
                    ElMessage({
                        message: res.message,
                        type: 'success'
                    })
                    emit('fevent')
                }
            } else {
                const res = await updateCouponBatch({ ...params, batchCode: props.batchCode })
                if (res.code === '200') {
                    handleClose()
                    ElMessage({
                        message: res.message,
                        type: 'success'
                    })
                    emit('fevent')
                }
            }
        }
    })
}

//  *******本期不做*********
// // 新增成本账户
// const addCostCount = () => {
//     ruleForm.chengbenzhanghu.push({ name: '', code: '', percent: '' })
// }
// // 展示子列表
// const showSubDialog = (type) => {
//     dataState.subListType = type
//     listDialogConfig.value = true
// }
// // 删除成本账户
// const removeCosCount = (index) => {
//     ruleForm.chengbenzhanghu.splice(index, 1)
// }
// // 选择生效城市
// const authorityChange = (value) => {
//     dataState.authorityCheckedNodes = proxy.$refs.authorityRef.getCheckedNodes(true)
// }
</script>
<style lang="scss" scoped>
    .coupon-submit-box{
        :deep(.el-dialog__body){
          max-height: 600px;
          overflow-y: scroll;
        }
        .form-action-item-50w{
            width: 50%;
        }
        .form-action-item-100w{
            width: 100%;
        }
        .goods-list{
          padding: 20px;
          margin-left: 150px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
        }
        .form-text{
          display: inline-block;
          height: 32px;
          line-height: 32px;
          color: #606266;
          font-size: 14px;
        }
        .form-text-btn{
          display: inline-block;
          margin-left: 5px;
          color: #fe2c55;
          cursor: pointer;
        }
    }
</style>
