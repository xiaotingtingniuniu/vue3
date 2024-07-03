<template>
    <div class='apply-active-box'>
        <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="auto">
            <el-form-item label="活动名称" prop="applyName" :rules="rules.name">
                <el-input class="form-action-item-50w" v-model="ruleForm.applyName" placeholder="最多输入20汉字长度" clearable :disabled="canNotEdit"/>
            </el-form-item>
            <el-form-item label="申请人">
                {{props.handleType === 'add' || handleType === 'copy' ? userInfo.name: ruleForm.applier}}
            </el-form-item>
            <el-form-item label="状态">
                {{props.handleType === 'add' || handleType === 'copy'? statusKeyValue[1]: statusKeyValue[ruleForm.promoStatus]}}
            </el-form-item>
            <!-- <el-row>
                <el-col :span="8">
                    <el-form-item label="业务线" prop="businessCode" :rules="rules.selectRule">
                        <el-select class="form-action-item-50w" v-model="ruleForm.businessCode" clearable placeholder="请选择" :disabled="canNotEdit">
                            <el-option label="恒生活" value="A1001" />
                            <el-option label="小恒数科" value="A1002" />
                            <el-option label="汇财" value="A1003" />
                            <el-option label="保险" value="A1004" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
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
                </el-col>
            </el-row> -->
            <!-- 本期不开发 -->
            <!-- <div>
                <el-row  v-for="(item, index) in ruleForm.acctInfo" :key="index">
                    <el-col :span="8">
                        <el-form-item :label="index === 0 ? '成本账户' : ''" :prop="'acctInfo.'+ index + '.acctName'" :rules="rules.selectRule">
                            <el-row>
                                <el-col :span="8"><span>账户{{index+1}}</span></el-col>
                                <el-col :span="12">
                                    <el-input  v-model="item.acctName" :disabled="canNotEdit"></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item
                            label="承担比例"
                            :prop="'acctInfo.' + index + '.assumeRatio'"
                            :rules="rules.assumeRatio"
                        >
                            <el-select v-model="item.assumeRatio" clearable placeholder="请选择" :disabled="canNotEdit">
                                <el-option  v-for="item in proportion" :key="item.value" :label="item.label +'%'" :value="item.label" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" style="margin-left:50px;" v-if="index === ruleForm.acctInfo.length - 1 ||props.handleType == 'detail'">
                        <el-button @click="deleteCurrent(index)" type="text" :disabled="ruleForm.acctInfo.length===1">删除</el-button>
                        <el-button @click="addCurrent" type="text" :disabled="canNotEdit">新增</el-button>
                    </el-col>
                </el-row>
            </div> -->
            <el-form-item label="活动有效期" prop="promoTime" class="form-item-time" :rules="rules.isValidTimeRule">
                <el-date-picker
                    class="form-action-item-50w"
                    v-model="ruleForm.promoTime"
                    type="datetimerange"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    range-separator="~"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    :disabled="canNotEdit"
                />
                <span>注意：仅在活动有效期内达成奖励条件，才能领取到奖励</span>
            </el-form-item>
            <h5 class='dividing-head'>奖励发放规则</h5>
            <el-form-item label="奖励发放条件" prop="termType" :rules="rules.termType">
                <el-radio-group v-model="ruleForm.termType" :disabled="canNotEdit">
                    <el-radio :label="1">推荐注册用户</el-radio>
                    <el-radio :label="2" :disabled='true'>推荐会员</el-radio>
                    <el-radio :label="3" :disabled='true'>推荐注册会员且首单消费成功</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- 一期不做 -->
            <!-- <el-form-item label=" " prop="isValidDays" class="form-item-time" :rules="rules.inputRule">
                <span>阶梯计算周期 </span>
                <el-input-number v-model="ruleForm.isValidDays" :min="0" :max="360" controls-position="right" :disabled="canNotEdit" style="width:100px"/>
                <span>注意：阶梯奖励的场景，被推荐人数量不会跨周期计算</span>
            </el-form-item>
            <el-row>
                <el-col :span="8">
                    <el-form-item label=" " prop="isValidDays" class="form-item-time" :rules="rules.inputRule">
                        <span>周期内总奖励人数上限 </span>
                        <el-input-number v-model="ruleForm.isValidDays" :min="0" :max="99999" controls-position="right" :disabled="canNotEdit" style="width:100px"/>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item label=" " prop="isValidDays" class="form-item-time" :rules="rules.inputRule">
                        <span>单日奖励人数上限 </span>
                        <el-input-number v-model="ruleForm.isValidDays" :min="0" :max="99999" controls-position="right" :disabled="canNotEdit" style="width:100px"/>
                        <span>注意：对应日期内，单个推荐人的奖励人数不能超过上线</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label=" " prop="isValidDays" class="form-item-time" :rules="rules.inputRule">
                <span>首单消费截止日期（注册后） </span>
                <el-input-number v-model="ruleForm.isValidDays" :min="0" :max="360" controls-position="right" :disabled="canNotEdit" style="width:100px"/>
                <span>注意：超过截止日期后，被推荐人下单无效，不能计算奖励</span>
            </el-form-item>
            <el-form-item label=" " prop="isValidDays" class="form-item-time" :rules="rules.inputRule">
                <span>首单消费门槛金额 </span>
                <el-input-number v-model="ruleForm.isValidDays" :min="0" :max="99999" controls-position="right" :disabled="canNotEdit" style="width:100px"/>
                <span>注意：订单金额低于门槛的情况，不能计算为成功消费</span>
            </el-form-item> -->
            <h5 class='dividing-head'>奖励内容和发放对象</h5>
            <div class="border-box">
                <el-form-item label="奖励对象" prop="reward" :rules="rules.reward">
                    <el-checkbox-group v-model="ruleForm.reward" :disabled="true">
                        <el-checkbox label="1" name="reward">推荐人</el-checkbox>
                        <el-checkbox label="2" name="reward">被推荐人</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="奖励内容" prop="rewardContent" :rules="rules.rewardContent" >
                    <el-checkbox-group v-model="ruleForm.rewardContent" :disabled="canNotEdit">
                        <el-checkbox label="1" name="rewardContent">优惠券</el-checkbox>
                        <el-checkbox label="2" name="rewardContent" :disabled='true'>积分</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="奖励阶梯数量" prop="stairCount" :rules="rules.stairCount">
                    <el-input-number v-model="ruleForm.stairCount" :min="0" :max="10" controls-position="right" :disabled="true" style="width:100px"/>
                </el-form-item>
                <div v-if="ruleForm.rewardContent.indexOf('1') > -1">
                    <el-form-item label=" " prop="tableData" label-width="50" :rules="rules.tableData">
                        <span>关联优惠券批次{{ruleForm.tableData.length}}/5</span>
                        <el-button type="text" @click="toCoupon(ruleForm.promoTime,ruleForm.businessCode,ruleForm.subCode)" v-if="props.handleType !== 'detail' && props.handleType !== 'approval'" :disabled="ruleForm.tableData.length ===5">关联优惠券批次</el-button>
                        <div style="width:100%">
                            <system-list
                                :border = "true"
                                :tHead="tHead"
                                :tableData="ruleForm.tableData"
                            >
                                <template #batchStatus="scope">
                                    <span v-if="scope.row.batchStatus === 1">草稿</span>
                                    <span v-if="scope.row.batchStatus === 2">待审批</span>
                                    <span v-if="scope.row.batchStatus === 3">审批驳回</span>
                                    <span v-if="scope.row.batchStatus === 4">待开始</span>
                                    <span v-if="scope.row.batchStatus === 5">在线</span>
                                    <span v-if="scope.row.batchStatus === 6">已停止</span>
                                    <span v-if="scope.row.batchStatus === 7">已结束</span>
                                </template>
                                <template #userRangeType="row">
                                    {{userRangeTypeKeyValue[row.row.userRangeType]}}
                                </template>
                                <template #couponType="row">
                                    {{couponTypeKeyValue[row.row.couponType]}}
                                </template>
                                <template #applyCountlist="row">
                                    {{row.row.applyCount }}/{{row.row.receiveCount}}/{{row.row.usedCount}}
                                </template>
                                <template #isValidTime="row">
                                    <div style="text-align: left;">
                                        {{ row.row.isValidBeginTime }} - {{ row.row.isValidEndTime }}
                                    </div>
                                </template>
                                <template #button="row">
                                    <el-button type="text" @click='deleteCoupon(row.row,row.row.index)' :disabled="canNotEdit">删除</el-button>
                                </template>
                            </system-list>
                        </div>
                    </el-form-item>
                    <el-button type="primary" @click="getShow" :disabled="ruleForm.tableData.length===0 || canNotEdit">生成阶梯奖励</el-button>
                    <el-button type="primary" :disabled="ruleForm.tableData.length===0 || canNotEdit" @click="restTable">重置</el-button>
                </div>

            </div>
            <div v-if="ruleForm.tableData.length>0">
                <h5 class='dividing-head'>奖励设置</h5>
                <div class="border-box">
                    <h6>推荐人奖励设置</h6>
                    <div>
                        <el-form-item label="门槛人数" prop="refererThreshold" :rules="rules.singleUserMax">
                            <el-input-number v-model="ruleForm.refererThreshold" :min="0" :max="999999" controls-position="right" :disabled="true" style="width:100px"/>
                            <span>数值格式，仅支持整数，最大不超过999999</span>
                        </el-form-item>
                        <el-row v-for="(item, index) in ruleForm.batchGroupList" :key="index">
                            <el-form-item
                                label-width="140px"
                                :label="index === 0?'每人奖励':''"
                                :prop="'batchGroupList.' + index + '.groupName'"
                                :rules="rules.groupName"
                            >
                                <el-row>
                                    <el-col :span="8"><span>优惠券批次</span></el-col>
                                    <el-col :span="14">
                                        <el-input v-model="item.groupName"  controls-position="right" :disabled="true"/>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item
                                :prop="'batchGroupList.' + index + '.couponCount'"
                                :rules="rules.numberRule"
                            >
                                <el-input type="text" v-model.number="item.couponCount" :disabled="canNotEdit" style="width:100px"><template v-slot:suffix>次数</template></el-input>
                                <span v-if="index===0">数值格式，仅支持0或1</span>
                            </el-form-item>
                        </el-row>
                    </div>
                    <h6>被推荐人奖励设置</h6>
                    <div>
                        <el-row v-for="(item, index) in ruleForm.batchGroupList2" :key="index">
                            <el-form-item
                                label-width="140px"
                                :label="index === 0?'一次性奖励':''"
                                :prop="'batchGroupList2.' + index + '.groupName2'"
                                :rules="rules.groupName"
                            >
                                <el-row>
                                    <el-col :span="8"><span>优惠券批次</span></el-col>
                                    <el-col :span="14">
                                        <el-input  class="form-action-item-100w" v-model="item.groupName2"  controls-position="right" :disabled="true"/>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item
                                :prop="'batchGroupList2.' + index + '.couponCount2'"
                                :rules="rules.numberRule"
                            >
                                <el-input type="text" v-model.number="item.couponCount2" :disabled="canNotEdit" style="width:100px"><template v-slot:suffix>次数</template></el-input>
                                <span v-if="index===0">数值格式，仅支持0或1</span>
                            </el-form-item>
                        </el-row>
                    </div>
                </div>
            </div>

            <el-form-item label="活动说明（推荐人）" prop="couponDesc" :rules="rules.textRule">
                <el-input v-model="ruleForm.couponDesc" :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" placeholder="支持文本输入，限制20000汉字长度，对应C端的‘规则说明’模块" :disabled="canNotEdit"/>
            </el-form-item>
            <el-form-item label="活动说明（被推荐人）" prop="beCouponDesc" :rules="rules.textRule">
                <el-input v-model="ruleForm.beCouponDesc" :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" placeholder="支持文本输入，限制20000汉字长度，对应C端的‘规则说明’模块" :disabled="canNotEdit"/>
            </el-form-item>

            <el-form-item label="项目投入产出测算" prop="couponCalculate" :rules="rules.textRulemax">
                <el-input v-model="ruleForm.couponCalculate" :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" placeholder="预计投入1000元，GMV上升2000元" :disabled="canNotEdit"/>
            </el-form-item>
            <el-form-item label="审批人" prop="approvaler" :rules="rules.approvaler" v-if="checkRole('marketing-9') && handleType === 'approval'&& ruleForm.promoStatus===1">
                <el-select class="form-action-item-50w" v-model="ruleForm.approvaler" clearable placeholder="请选择">
                    <el-option
                        v-for="(item, index) in approvalList"
                        :key="index"
                        :label="item.contentName"
                        :value="item.id"
                        @click="approvalChange(item)"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="" v-if="checkRole('marketing-9') && handleType === 'approval'&& ruleForm.promoStatus===1">
                <div style="font-size: 12px">
                    <p>
                        1）请选择审批人，提交后请审批人在EIP系统中操作审批
                    </p>
                    <p>
                        2）如果审批人不在下拉列表，请联系产品经理
                    </p>
                    <p>
                        3）提交了错误的审批人，请联系对方操作驳回，不要自己操作撤回
                    </p>
                </div>
            </el-form-item>
            <el-form-item class="dialog-footer">
                <el-button type="primary"  @click="submitForm()"  v-if="handleType === 'add' || handleType === 'edit' || handleType === 'copy'">
                    提交
                </el-button>
                <el-button type="primary"  v-if="handleType === 'add' ||handleType === 'edit' || handleType === 'copy'" @click="goBack()">
                    取消
                </el-button>
                <el-button type="primary" v-if="checkRole('marketing-9') && handleType === 'approval'&& ruleForm.promoStatus===1" @click="promoAudit(props.applyCode)">
                    提交审批
                </el-button>
                <el-button type="primary" v-if="handleType === 'detail' || handleType === 'approval'" @click="goBack()">
                    关闭
                </el-button>
            </el-form-item>
        </el-form>
        <!-- 弹框 -->
        <active-coupon-list  v-if="dialogVisible" :visible ='dialogVisible' @handleClose="dialogVisible = false" :dataTime="isValidList" :businessCode="businessCode" :subCode="subCode" @getrowList="getTable" ></active-coupon-list>
    </div>
</template>
<script setup>
import { reactive, ref, toRefs, computed } from 'vue'
import SystemList from '@/composables/TablePagination/table.vue'
import ActiveCouponList from './active-coupon-list'
import { applyPromoList, applyDetail, applyEdit, applySubmit } from '@/api/marketing/active'
import { getCouponApprovalList } from '@/api/marketing/coupon'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { checkRole } from '@/utils'

const router = useRouter()
const props = defineProps(['handleType', 'applyCode'])

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const canNotEdit = computed(() => props.handleType === 'detail' || props.handleType === 'approval')

const handleType = ref(props.handleType)
const dialogVisible = ref(false)
const ruleFormRef = ref(null)
const ladderReward = ref(false)
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
    },
    couponTypeKeyValue: {
        1: '立减',
        2: '满减',
        3: '折扣'
    },
    costAccount: [
        {
            value: '',
            label: '全部'
        },
        {
            value: '1',
            label: '待领取'
        },
        {
            value: '2',
            label: '已领取'
        },
        {
            value: '3',
            label: '已使用'
        },
        {
            value: '4',
            label: '已失效'
        }
    ],
    proportion: [
        {
            value: '1',
            label: '60'
        },
        {
            value: '2',
            label: '30'
        },
        {
            value: '3',
            label: '10'
        }
    ],
    isValidList: '',
    businessCode: '',
    subCode: ''
})
const userRangeTypeKeyValue = {
    1: '全部用户',
    2: '新用户',
    3: '会员'
}
const tHead = [
    { align: 'center', tooltip: true, prop: 'groupCode', label: '券批次编号', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'groupName', label: '券批次名称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'applier', label: '申请人', minWidth: 200 },
    // { align: 'center', tooltip: true, prop: 'batchStatus', label: '状态', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'couponName', label: '成本账户', minWidth: 200 },
    // { align: 'center', tooltip: true, prop: 'couponType', label: '优惠类型', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'userRangeType', label: '用户范围', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'applyCountlist', label: '优惠券 申请/领用/使用 数量', minWidth: 180, slot: true },
    { align: 'center', tooltip: true, prop: 'isValidTime', label: '券批次有效期', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '批次创建时间', minWidth: 150 },
    { align: 'center', fixed: 'right', prop: 'button', label: '操作', minWidth: 150, slot: true }

]
const { statusKeyValue, couponTypeKeyValue, isValidList, businessCode, subCode } = toRefs(dataState)
const ruleForm = reactive({
    applyName: '',
    batchStatus: 1,
    businessCode: '',
    subCode: '',
    promoTime: '',
    couponDesc: '',
    beCouponDesc: '',
    promoStatus: '',
    couponCalculate: '',
    // acctInfo: [{
    //     acctName: '',
    //     assumeRatio: ''
    // }],
    reward: ['1', '2'],
    stairCount: 1,
    rewardContent: [],
    refererThreshold: 1,
    tableData: [],
    batchGroupList: [{
        groupCode: '',
        groupName: '',
        couponCount: ''
    }],
    batchGroupList2: [{
        groupCode2: '',
        groupName2: '',
        couponCount2: ''
    }]
})

// 校验规则：支持输入整数数字，可输入范围0-1
const numberValidator = (rule, value, callback) => {
    if (canNotEdit.value) {
        return
    }
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        if (!Number.isInteger(value)) {
            callback(new Error('支持输入正整数数字'))
        } else {
            if (value >= 0 && value < 2) {
                callback()
            } else {
                callback(new Error('仅支持0或者1'))
            }
        }
    }
}

// 校验规则：支持输入整数数字，可输入范围1~999
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
            if (value > 0 && value < 1000) {
                callback()
            } else {
                callback(new Error('最大不能超过99999张'))
            }
        }
    }
}

// 校验规则：活动有效期开始时间大于当前时间
const isValidTimeValidator = (rule, value, callback) => {
    if (canNotEdit.value) {
        return
    }
    if (value === '') {
        callback(new Error('请选择'))
    } else {
        const start = new Date(value[0]).getTime()
        const end = new Date(value[1]).getTime()
        const currTime = Date.now()
        console.log(start, end)
        if (start > currTime && end > start) {
            callback()
        } else {
            callback(new Error('有效期开始时间应大于当前时间且结束时间大于开始时间'))
        }
        callback()
    }
}

// 校验规则：奖励对象必选
const rewardValidator = (rule, value, callback) => {
    if (value.length === 0) {
        callback(new Error('请选择'))
    } else {
        if (value.length < 2) {
            callback(new Error('奖励对象都必选'))
        } else {
            callback()
        }
    }
}
// 校验规则：关联优惠券批次
const tableValidator = (rule, value, callback) => {
    if (value.length === 0) {
        callback(new Error('请选择关联优惠券'))
    } else {
        const prostart = new Date(ruleForm.promoTime[0]).getTime()
        const proend = new Date(ruleForm.promoTime[1]).getTime()
        if (value.length > 0) {
            value.map(item => {
                if (new Date(item.isValidBeginTime).getTime() > prostart || new Date(item.isValidEndTime).getTime() < proend) {
                    callback(new Error('请重新选择在活动有效期内的优惠券'))
                } else {
                    callback()
                }
            })
        }
    }
}
// 表单项规则
const rules = reactive({
    inputRule: [{ required: true, message: '请输入', trigger: 'change' }],
    selectRule: [{ message: '请选择', trigger: 'change' }],
    numberRule: [{ required: true, validator: numberValidator, trigger: 'change' }],
    singleUserMax: [{ required: true, validator: singleUserMaxValidator, trigger: 'change' }],
    isValidTimeRule: [{ required: true, validator: isValidTimeValidator, trigger: 'change' }],
    termType: [{ required: true, message: '请选择', trigger: 'change' }],
    reward: [{ required: true, validator: rewardValidator, trigger: 'change' }],
    rewardContent: [{ required: true, message: '请选择', trigger: 'change' }],
    tableData: [{ required: true, trigger: 'change', validator: tableValidator }],
    groupName: [{ required: true, message: '关联批次必填', trigger: 'blur' }],
    stairCount: [{ required: true }],
    name: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 20, message: '最长不超过20个字符长度', trigger: 'change' }
    ],
    textRule: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 20000, message: '最长不超过20000个字符长度', trigger: 'change' }
    ],
    textRulemax: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 2000, message: '最长不超过2000个字符长度', trigger: 'change' }
    ],
    approvaler: [{ required: true, message: '请选择', trigger: 'change' }]
})

// 本期不做
// // 点击新增成本账户输入表单
// const addCurrent = () => {
//     ruleForm.acctInfo.push({
//         acctName: '',
//         assumeRatio: ''
//     })
// }
// const deleteCurrent = (index) => {
//     ruleForm.acctInfo.splice(index, 1)
// }
const getTable = (data) => {
    console.log(data.groupCode, ruleForm.tableData)
    if (ruleForm.tableData.length > 0) {
        if (JSON.stringify(ruleForm.tableData).indexOf(JSON.stringify(data)) === -1) {
            ruleForm.tableData.push(data)
        } else {
            ruleForm.tableData.map((item, index) => {
                if (item.groupCode === data.groupCode) {
                    return false
                }
            })
        }
    } else {
        ruleForm.tableData.push(data)
    }
}
// 取一次性奖励 与每人奖励
const listArr = ref([])
const firstListArr = ref([])
const getrewardList = async () => {
    listArr.value = ruleForm.tableData.map(item => {
        return {
            groupCode: item.groupCode,
            groupName: item.groupName,
            couponCount: ''
        }
    })
    firstListArr.value = ruleForm.tableData.map(item => {
        return {
            groupCode2: item.groupCode,
            groupName2: item.groupName,
            couponCount2: ''
        }
    })
}

const getShow = () => {
    getrewardList()
    ruleForm.batchGroupList = listArr.value
    ruleForm.batchGroupList2 = firstListArr.value
}
// 删除券批次
const deleteCoupon = async (row) => {
    ruleForm.tableData.map((item, index) => {
        if (item.groupCode === row.groupCode) {
            ruleForm.tableData.splice(index, 1)
        }
    })
    await getrewardList()
    ruleForm.batchGroupList = listArr.value
    ruleForm.batchGroupList2 = firstListArr.value
}
// 重置
const restTable = () => {
    ruleForm.tableData = []
    ruleForm.batchGroupList = [{
        groupCode: '',
        groupName: '',
        couponCount: ''
    }]
    ruleForm.batchGroupList2 = [{
        groupCode2: '',
        groupName2: '',
        couponCount2: ''
    }]
}

// 详情
const getsingleData = async () => {
    ladderReward.value = true
    const params = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        applyCode: props.applyCode

    }
    const res = await applyDetail(params)
    Object.assign(ruleForm, res.data)
    ruleForm.promoTime = [res.data.promoBeginDate, res.data.promoEndDate]
    ruleForm.termType = res.data.promoRule.awardCondition
    ruleForm.reward = res.data.promoDetails.awardObject.split(',')
    ruleForm.rewardContent = res.data.promoDetails.awardContent.split(',')
    ruleForm.tableData = res.data.batchGroupList
    // ruleForm.acctInfo = res.data.acctInfo ? res.data.acctInfo : [{ acctName: '', assumeRatio: '' }]
    if (res.data.promoConfig !== null) {
        res.data.promoConfig.map(item => {
            if (item.objectType === 1) {
                ruleForm.batchGroupList = item.couponConfig
            } else {
                ruleForm.batchGroupList2 = item.couponConfig.map(item => {
                    return {
                        groupCode2: item.groupCode,
                        groupName2: item.groupName,
                        couponCount2: item.couponCount
                    }
                })
            }
        })
    }
}
if (props.handleType !== 'add') {
    getsingleData()
}

// 提交表单
const submitForm = async () => {
    const params = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        operatorId: userInfo.value.account,
        applier: userInfo.value.name,
        applierId: userInfo.value.account,
        businessCode: ruleForm.businessCode || null,
        subCode: ruleForm.subCode || null,
        // acctInfo: ruleForm.acctInfo,
        // 活动类型  拉新有礼 - 2 暂无其他类型
        promoType: 2,
        // promoStatus: ruleForm.promoStatus,
        promoStatus: '1',
        applyName: ruleForm.applyName,
        couponDesc: ruleForm.couponDesc,
        beCouponDesc: ruleForm.beCouponDesc,
        couponCalculate: ruleForm.couponCalculate
    }
    params.promoBeginDate = ruleForm.promoTime[0] || ''
    params.promoEndDate = ruleForm.promoTime[1] || ''
    params.promoRule = {
        awardCondition: ruleForm.termType
    }
    params.promoDetails = {
        awardObject: ruleForm.reward.join(','),
        awardContent: ruleForm.rewardContent.join(','),
        stairCount: 1
    }
    const setbatchGroupList = ruleForm.batchGroupList2.map(item => {
        return {
            groupCode: item.groupCode2,
            groupName: item.groupName2,
            couponCount: item.couponCount2
        }
    })
    params.promoConfigList = [
        {
            objectType: 1,
            refererThreshold: ruleForm.refererThreshold,
            couponConfig: ruleForm.batchGroupList
        },
        {
            objectType: 2,
            couponConfig: setbatchGroupList
        }
    ]
    params.batchGroupList = ruleForm.batchGroupList
    if (props.handleType === 'copy') {
        delete params.applyCode
        // params.batchGroupList.map((groupItem) => {
        //     delete groupItem.groupCode
        //     delete groupItem.groupName
        // })
        // params.promoConfi && params.promoConfig.map((promoItem) => {
        //     promoItem.couponConfig && promoItem.couponConfig.forEach(couponItem => {
        //         delete couponItem.groupCode
        //         delete couponItem.groupName
        //     })
        // })
        delete params.promoDetails.applyCode
        delete params.promoDetails.id
        delete params.promoRule.applyCode
        delete params.promoRule.id
    }
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            console.log(params)
            if (props.handleType === 'add' || props.handleType === 'copy') {
                const res = await applyPromoList({ ...params })
                if (res.code === '200') {
                    ElMessage({
                        message: res.message,
                        type: 'success'
                    })
                    router.push({ name: 'active-list' })
                }
            }
            if (props.handleType === 'edit') {
                const res = await applyEdit({ ...params, applyCode: props.applyCode })
                if (res.code === '200') {
                    ElMessage({
                        message: res.message,
                        type: 'success'
                    })
                    router.go(-1)
                }
            }
        }
    })
}

// 提交审批
const promoAudit = async (row) => {
    const params = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        applyCode: row,
        gmtOperate: new Date().getTime(),
        auditUrl: location.href,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name,
        applier: userInfo.value.name,
        applierId: userInfo.value.account,
        dictRelPublishReqVOS: dictRelPublishReqVOS.value,
        auditNote: '审批注意点：\n' + '1、确认预算账户资金充足， 项目ROI测算 符合逻辑。\n' + '\n' + '2、确认 业务线、营销工具、申请数量，项目预算，商品范围、有效期，使用期限、单个用户使用数量，设备/门店 范围，优惠券说明都填写正确。\n' + '\n' + '3、确认 商品折扣力度，毛利率变化，商品库存准备 都在预期之内。'
    }
    const code = await applySubmit(params)
    if (code === '200') {
        ElMessage({
            message: '提交成功',
            type: 'success'
        })
        router.go(-1)
    }
}

const toCoupon = (time, businessCode, subCode) => {
    dialogVisible.value = true
    dataState.isValidList = time
    dataState.businessCode = businessCode
    dataState.subCode = subCode
}

const approvalList = ref([])
// 获取审批人列表
const queryApprovalList = async () => {
    const params = {
        applier: userInfo.value.name,
        applierId: userInfo.value.account
    }
    const res = await getCouponApprovalList(params)
    if (res.code === '200') {
        approvalList.value = res.data
    }
}
queryApprovalList()

const dictRelPublishReqVOS = ref([])
// 选择审批人
const approvalChange = (tab) => {
    dictRelPublishReqVOS.value = [{
        dictType: tab.dictType,
        contentId: tab.contentId,
        contentName: tab.contentName,
        contentOrder: tab.contentOrder
    }]
}
const goBack = () => {
    router.go(-1)
}
</script>
<style lang="scss" scoped>
    .apply-active-box{
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
        .dividing-head{
            margin-left:50px;
            line-height:50px;
        }
        span{
            font-size:14px;
            height: 32px;
            line-height: 32px;
            color: #606266;
            font-size: 14px;
        }
        .border-box{
            border:1px solid #ccc;
            padding:20px;
            margin-bottom:10px;
        }
        .goods-list{
          padding: 20px;
          margin-left: 150px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
        }
        .form-text-btn{
          display: inline-block;
          margin-left: 5px;
          color: #fe2c55;
          cursor: pointer;
        }
        .flex-box{
            display:flex;
            justify-content:center
            div{
                flex:1
            }
        }
    }
</style>
