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
                {{props.handleType === 'add' ? statusKeyValue[1]: statusKeyValue[ruleForm.promoStatus]}}
            </el-form-item>
            <el-form-item label="业务线" prop="businessCode" :rules="rules.selectRule">
                <el-select class="form-action-item-50w" v-model="ruleForm.businessCode" clearable placeholder="请选择" :disabled="canNotEdit" @change="businessCodeChange">
                    <!-- <el-option label="全部" value="1" /> -->
                    <el-option label="智能货柜" value="2" />
                    <el-option label="门店" value="3" />
                    <!-- <el-option label="生活充值" value="4" /> -->
                    <el-option label="电商到家" value="5" />
                </el-select>
            </el-form-item>
            <el-form-item label="交易订单类型" prop="dealType" :rules="rules.selectRule">
                <el-select class="form-action-item-50w" v-model="ruleForm.dealType" clearable placeholder="请选择" :disabled="canNotEdit" multiple>
                    <el-option label="全部" value="1" v-if="ruleForm.businessCode.indexOf('1') > -1"/>
                    <el-option label="预约到柜" value="2" v-if="ruleForm.businessCode.indexOf('1') > -1 || ruleForm.businessCode.indexOf('2') > -1"/>
                    <el-option label="即时到柜" value="3" v-if="ruleForm.businessCode.indexOf('1') > -1 || ruleForm.businessCode.indexOf('2') > -1"/>
                    <el-option label="即时到店" value="4" v-if="ruleForm.businessCode.indexOf('1') > -1 || ruleForm.businessCode.indexOf('3') > -1"/>
                    <el-option label="预约到店" value="5" v-if="ruleForm.businessCode.indexOf('1') > -1 || ruleForm.businessCode.indexOf('3') > -1"/>
                    <el-option label="生活充值" value="6" v-if="ruleForm.businessCode.indexOf('1') > -1 || ruleForm.businessCode.indexOf('4') > -1"/>
                    <el-option label="电商到家" value="7" v-if="ruleForm.businessCode.indexOf('1') > -1 || ruleForm.businessCode.indexOf('5') > -1"/>
                </el-select>
            </el-form-item>
            <!-- <el-row v-for="(item, index) in ruleForm.acctInfo" :key="index" >
                <el-col :span="8">
                    <el-form-item :label="index === 0 ? '成本账户' : ''" :prop="'acctInfo.'+ index + '.acctId'" :rules="rules.selectRule">
                        <el-row>
                            <el-col :span="8"><span class="form-text form-text-btn" @click="showSubDialog('costAccount')" v-if="!canNotEdit">选择账户</span></el-col>
                            <el-col :span="12"><el-input v-model="item.acctName" disabled ></el-input></el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="承担比例" :prop="'acctInfo.'+ index + '.assumeRatio'" :rules="rules.discountRateRule" label-width="80px">
                        <el-input v-model.number="item.assumeRatio" :disabled="canNotEdit"><template v-slot:suffix>%</template></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="3" v-if="index === ruleForm.acctInfo.length - 1">
                    <span class="form-text form-text-btn" v-if="!canNotEdit && ruleForm.acctInfo.length < 3" @click="addCostCount">新增</span>
                    <span class="form-text form-text-btn" v-if="!canNotEdit && index > 0" @click.prevent="removeCostCount(index)">删除</span>
                </el-col>
            </el-row> -->
            <el-form-item label="活动有效期" prop="promoTime" class="form-item-time" :rules="rules.isValidTimeRule">
                <el-date-picker
                    style="form-action-item-50w"
                    v-model="ruleForm.promoTime"
                    type="datetimerange"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    range-separator="~"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    :disabled="canNotEdit"
                    :default-time="defaultTime"
                />
                <span>注意：仅在活动有效期 + 售卖时间范围内交易才能命中优惠</span>
            </el-form-item>
            <el-form-item label="活动" prop="promoTime" class="form-item-time">
                <el-tabs
                    v-model="editableTabsValue"
                    type="card"
                    style="padding-top: 40px; width: 100%"
                    @tab-change="handleTabschange"
                >
                    <el-tab-pane
                        v-for="(item,index) in ruleForm.goodsGroup"
                        :key="item.name"
                        :label="item.title"
                        :name="item.name"
                    >
                        <template #label>
                            <span class="tab-edit" @click="handleTabsUpdate(index)" v-if="!canNotEdit">
                                <el-icon :size="20">
                                    <Edit />
                                </el-icon>
                            </span>
                            <span class="custom-tabs-label">{{item.seckillBeginTime}}</span>
                            <span class="custom-tabs-label">{{item.seckillEndTime}}</span>
                            <span class="custom-tabs-label custom-tabs-label-count">({{item.goodsList.length}}sku)</span>
                        </template>
                        <el-form-item label="优惠类型" prop="discType" :rules="rules.selectRule" label-width="85px">
                            <el-radio-group v-model="ruleForm.discType" @change="discTypeChange">
                                <el-radio :label="1">一口价 ({{goodsList1.length}})</el-radio>
                                <el-radio :label="2">折扣 ({{goodsList2.length}})</el-radio>
                            </el-radio-group>
                            <span class="add-goods" @click="showSubDialog('goodsSku')" v-if="!canNotEdit">新增商品</span>
                        </el-form-item>
                        <el-table :data="googdsHasSelectList" style="width: 100%;marginTop: 20px;" border>
                            <el-table-column label="排序权重（权重高的排序在前）" width="120">
                                <template #default="scope">
                                    <el-input
                                        v-model.number="scope.row.goodsOrder"
                                        @input="value => handleGoodsOrderAmountChange(value, scope.$index)"
                                        @blur="value => handleGoodsOrderAmountBlur(scope.row.goodsOrder, scope.$index)"
                                        :disabled="canNotEdit"
                                    ></el-input>
                                    <div v-if="!scope.row.goodsOrderVerifyPass" class="errTips">请输入正整数</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" label="商品信息">
                                <template #default="scope">
                                    <span>商品：{{scope.row.skuId}}-{{scope.row.skuName}}</span><br/>
                                    <span>商品状态：{{skuStatusKeyValue[scope.row.skuStatus]}}</span><br/>
                                    <span>商品分类：{{scope.row.firstCategoryName}}-{{scope.row.secondCategoryName}}-{{scope.row.threeCategoryName}}-{{scope.row.fourCategoryName}}</span><br/>
                                </template>
                            </el-table-column>
                            <el-table-column label="一口价价格" width="100" v-if="ruleForm.discType === 1">
                                <template #default="scope">
                                    <el-input :model-value="scope.row.fixedAmount" @input="value => handleGoodsFixedAmountChange(value, scope.$index, scope.row.origAmount)" :disabled="canNotEdit"></el-input>
                                    <div v-if="!scope.row.fixedAmountVerifyPass" class="errTips">低于原价，可保留两位小数</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="价格" width="180" v-if="ruleForm.discType === 1">
                                <template #default="scope">
                                    <span>原价：{{scope.row.origAmount}}</span><br/>
                                    <span>
                                        折扣率：{{scope.row.fixedAmount ? Math.round((scope.row.fixedAmount - scope.row.origAmount)/scope.row.origAmount * 10000) / 100 : 0}}%
                                    </span>
                                    <br/>
                                    <span style="color: #fe2c55">
                                        优惠后价格：{{scope.row.fixedAmount ? scope.row.fixedAmount : ''}}
                                    </span>
                                    <br/>
                                    <span>
                                        优惠金额：{{scope.row.fixedAmount ? Math.round((scope.row.fixedAmount - scope.row.origAmount) * 100) / 100 : ''}}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="折扣率" width="80" v-if="ruleForm.discType === 2">
                                <template #default="scope">
                                    <el-input v-model.number="scope.row.discRatio" @input="value => handleDisDcRatioChange(value, scope.$index)" :disabled="canNotEdit"><template v-slot:suffix>%</template></el-input>
                                    <div v-if="!scope.row.discRatioVerifyPass" class="errTips">请输入1-99正整数</div>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column label="最大优惠金额" width="80" v-if="ruleForm.discType === '2'">
                                <template #default="scope">
                                    <el-input :model-value="scope.row.discAmount" @input="value => handleDiscAmountChange(value, scope.$index)" :disabled="canNotEdit"></el-input>
                                </template>
                            </el-table-column> -->
                            <el-table-column label="价格" width="180" v-if="ruleForm.discType === 2">
                                <template #default="scope">
                                    <span>原价：{{scope.row.origAmount}}</span><br/>
                                    <span>折扣率：{{scope.row.discRatio}}%</span><br/>
                                    <span style="color: #fe2c55">
                                        优惠后价格：{{scope.row.discRatio ? (Math.round(scope.row.origAmount * (100 - scope.row.discRatio)) / 100) : ''}}
                                    </span>
                                    <br/>
                                    <span>优惠金额：-{{scope.row.discRatio ? Math.round(scope.row.origAmount * scope.row.discRatio) / 100: 0}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="当前库存" width="150">
                                <template #default="scope">
                                    <span>物理库存：{{scope.row.stock}}</span><br/>
                                    <!-- <span>可售库存：{{scope.row.lockStock}}</span> -->
                                </template>
                            </el-table-column>
                            <el-table-column label="活动库存" width="120">
                                <template #default="scope">
                                    <el-input v-model.number="scope.row.skuStock" @input="value => handleSkuStockChange(value, scope.$index)" :disabled="canNotEdit"></el-input>
                                    <div v-if="!scope.row.skuStockVerifyPass" class="errTips">请输入非0正整数,上限999999999</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="每人限购数量" width="120">
                                <template #default="scope">
                                    <el-input v-model.number="scope.row.singleUserMax" @input="value => handleSingleUserMaxChange(value, scope.$index)" :disabled="canNotEdit"></el-input>
                                    <div v-if="!scope.row.singleUserMaxVerifyPass" class="errTips">请输入非0正整数,上限99999</div>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column prop="name" label="当前库存" width="180" />
                            <el-table-column prop="name" label="活动库存" width="180" /> -->
                            <el-table-column prop="operate" label="操作" width="80" align="center" v-if="!canNotEdit" fixed="right">
                                <template #default="scope">
                                    <span class="goods-table-remove" @click="handleGoodsRemove(scope.$index)">删除</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
                <span class="add-coupon" @click="showAvtivetab" v-if="!canNotEdit">添加活动商品组合</span>
            </el-form-item>
            <!-- <el-form-item label="默认补贴（冻结）金额" prop="budgetAmount" :rules="rules.budgetAmountRule">
                <el-input class="form-action-item-50w" v-model="ruleForm.budgetAmount" placeholder="请输入" :disabled="canNotEdit"><template v-slot:suffix>元</template></el-input>
                <span>默认冻结金额用于活动优惠，当核销金额超过冻结部分的80%，会提醒申请人是否下线活动，超出则会下线活动。</span>
            </el-form-item> -->
            <el-form-item label="可参与活动用户范围" prop="userRangeType" :rules="rules.selectRule">
                <el-radio-group v-model="ruleForm.userRangeType" :disabled="canNotEdit">
                    <el-radio :label="1">全部用户</el-radio>
                    <el-radio :label="3">已注册未下单用户</el-radio>
                    <el-radio :label="4">已下单用户</el-radio>
                    &nbsp;&nbsp;&nbsp;<span>下单判断：本活动配置的交易订单类型"是否有支付成功订单"</span>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否可以同时使用优惠券" prop="isUseCoupon" :rules="rules.selectRule">
                <el-radio-group v-model="ruleForm.isUseCoupon" :disabled="canNotEdit">
                    <el-radio :label="1">叠加：参与活动同时可以叠加使用优惠券</el-radio>
                    <el-radio :label="0">互斥：只能参加营销活动，不能使用优惠券</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="活动说明" prop="couponDesc" :rules="rules.textRule">
                <el-input v-model="ruleForm.couponDesc" :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" placeholder="支持文本输入，限制200汉字长度" :disabled="canNotEdit"/>
            </el-form-item>
            <el-form-item label="审批备注" prop="approveRemark" :rules="rules.textRule">
                <el-input v-model="ruleForm.approveRemark" :autosize="{ minRows: 2, maxRows: 6 }" type="textarea" placeholder="预计投入1000元，GMV上升2000元" :disabled="canNotEdit"/>
            </el-form-item>
            <el-form-item label="审批人" prop="approvaler" :rules="rules.selectRule" v-if="checkRole('marketing-9') && handleType === 'approval'&& ruleForm.promoStatus===1">
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
                <el-button type="primary"  @click="submitForm()"  v-if="handleType === 'add' ||handleType === 'edit'|| handleType === 'copy'">
                    提交
                </el-button>
                <el-button type="primary"  v-if="handleType === 'add' || handleType === 'edit'|| handleType === 'copy'" @click="goBack()">
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
        <el-dialog
            v-model="activeTabDialogVisible"
            title="活动商品组合"
            width="30%"
            :before-close="closeAvtivetab"
        >
            <el-form ref="activeFormRef" :model="activeForm" label-position="right" label-width="auto">
                <el-form-item label="每日开始售卖时间" prop="seckillBeginTime" :rules="[{ required: true, message: '请选择', trigger: 'change' }]">
                    <el-time-picker
                        class="form-action-item-50w"
                        v-model="activeForm.seckillBeginTime"
                        placeholder="请选择"
                        value-format="HH:mm:ss"
                        :default-value="new Date(2016, 9, 10, 0, 0)"
                    />
                </el-form-item>
                <el-form-item label="每日结束售卖时间" prop="seckillEndTime" :rules="[{ required: true, trigger: 'change', validator: seckillTimeValidator }]">
                    <el-time-picker
                        class="form-action-item-50w"
                        v-model="activeForm.seckillEndTime"
                        placeholder="请选择"
                        value-format="HH:mm:ss"
                        :default-value="new Date(2016, 9, 10, 0, 0)"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeAvtivetab">取消</el-button>
                    <el-button type="primary" @click="addActive">确认</el-button>
                    <el-button type="primary" @click="handleTabsRemove" v-if="dataState.activeFormHandleType === 'edit'">删除</el-button>
                </span>
            </template>
        </el-dialog>
        <com-list
            v-if="listDialogConfig"
            :listVisible ='listDialogConfig'
            :listType="dataState.subListType"
            :hasSelectList="dataState.hasSelectList"
            :businessCode="ruleForm.businessCode"
            @handleClose="listDialogConfig = false"
            @getDialogCheckedData="getDialogCheckedData"
        ></com-list>
        <!-- 弹框 -->
        <!-- <active-coupon-list  v-if="dialogVisible" :visible ='dialogVisible' @handleClose="dialogVisible = false" :dataTime="isValidList" :businessCode="businessCode" :subCode="subCode" @getrowList="getTable" ></active-coupon-list> -->
    </div>
</template>
<script setup>
import { reactive, ref, toRefs, computed, watch } from 'vue'
import { Edit } from '@element-plus/icons-vue'
import comList from '../coupon-batch/components/apply-coupon-comList.vue'
import ActiveCouponList from './active-coupon-list'
import { applyPromoList, applyDetail, applyEdit, applySubmit } from '@/api/marketing/active'
import { getCouponApprovalList } from '@/api/marketing/coupon'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { checkRole } from '@/utils'
import moment from 'moment'
import { CURRENT_CHANGE } from 'element-plus/es/components/tree-v2/src/virtual-tree'
import { nextTick } from 'process'

const router = useRouter()
const props = defineProps(['handleType', 'applyCode'])

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const canNotEdit = computed(() => props.handleType === 'detail' || props.handleType === 'approval')

const handleType = ref(props.handleType)
const dialogVisible = ref(false)
const listDialogConfig = ref(false) // 页面子列表弹框
const activeTabDialogVisible = ref(false) // 商品活动组合弹窗
const ruleFormRef = ref(null)
const activeFormRef = ref(null) // 活动商品组合表单
const editableTabsValue = ref('0')
console.log(editableTabsValue.value)
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
    isValidList: '',
    hasSelectList: [], // 已选中数据
    costCountHasSelectList: [], // 成本账户已选
    googdsHasSelectList: [], // 商品列表已选
    currentGoodsList: [], // 添加活动，当前展示列表
    goodsList1: [], // 添加活动，优惠类型为一口价时列表
    goodsList2: [], // 添加活动，优惠类型为折扣时列表
    goodsGroupIndex: 0, // tab切换inndex
    activeFormHandleType: '', // 商品组合弹窗操作类型
    skuStatusKeyValue: {
        1: '待审核',
        2: '已审核',
        3: '已拒绝',
        4: '已上架',
        5: '下架可上架',
        6: '下架',
        7: '待上架'
    }
})
const { statusKeyValue, couponTypeKeyValue, isValidList, googdsHasSelectList, goodsList1, goodsList2, skuStatusKeyValue } = toRefs(dataState)
const ruleForm = reactive({
    applyName: '',
    batchStatus: 1,
    businessCode: '',
    dealType: [],
    promoTime: '',
    couponDesc: '',
    approveRemark: '',
    promoStatus: '',
    couponCalculate: '',
    // acctInfo: [{
    //     acctName: '',
    //     assumeRatio: ''
    // }],
    // budgetAmount: null,
    userRangeType: '',
    isUseCoupon: '',
    tableData: [],
    goodsGroup: []
})
const defaultTime = [
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59)
]
// 活动商品tab信息
const activeForm = reactive({
    seckillBeginTime: '',
    seckillEndTime: ''
})
// 优惠类型-一口价商品列表变化
watch(() => dataState.goodsList1,
    (val, oldValue) => {
        if (ruleForm.goodsGroup.length > 0) {
            ruleForm.goodsGroup[dataState.goodsGroupIndex].goodsList = dataState.goodsList1.concat(dataState.goodsList2)
        }
    },
    {
        deep: true
    })
// 优惠类型-折扣商品列表变化
watch(() => dataState.goodsList2,
    (val) => {
        if (ruleForm.goodsGroup.length > 0) {
            ruleForm.goodsGroup[dataState.goodsGroupIndex].goodsList = dataState.goodsList1.concat(dataState.goodsList2)
        }
    },
    {
        deep: true
    })
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
// 校验规则：结束售卖时间晚于开始售卖时间
const seckillTimeValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        const start = activeForm.seckillBeginTime.replace(/:/g, '')
        const end = activeForm.seckillEndTime.replace(/:/g, '')
        if (start >= end) {
            callback(new Error('开始售卖时间应早于结束售卖时间'))
        } else {
            callback()
        }
    }
}
// 校验规则：数值格式，支持两位小数,最低预算
const budgetAmountValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        const reg = /^[0-9]*(\.[0-9]{0,2})?$/
        if (!isNaN(value) && reg.test(value)) {
            callback()
        } else {
            callback(new Error('仅限输入数字，支持小数点后两位'))
        }
    }
}
// 商品表格校验规则：数值格式，支持两位小数
const goodsTableValidator = (value) => {
    if (!value || value <= 0) return false
    const reg = /^[0-9]*(\.[0-9]{0,2})?$/
    return !!reg.test(value)
}
// 商品表格校验规则：数值格式
const goodsTableValidator2 = (value) => {
    if (!value || value <= 0 || value > 99) return false
    return !!Number.isInteger(value - 0)
}
// 商品表格校验规则：数值格式0-999999999
const goodsTableValidatorSkustock = (value) => {
    if (!value || value <= 0 || value > 999999999) return false
    return !!Number.isInteger(value - 0)
}
// 商品表格校验规则：数值格式0-999999999
const goodsTableValidatorSingalmax = (value) => {
    if (!value || value <= 0 || value > 99999) return false
    return !!Number.isInteger(value - 0)
}
// 商品表格校验规则：数值格式, 大于等于0
const goodsTableValidator3 = (value) => {
    if (!value || value < 0) return false
    return !!Number.isInteger(value - 0)
}
// 表单项规则
const rules = reactive({
    inputRule: [{ required: true, message: '请输入', trigger: 'change' }],
    selectRule: [{ required: true, message: '请选择', trigger: 'change' }],
    isValidTimeRule: [{ required: true, validator: isValidTimeValidator, trigger: 'change' }],
    termType: [{ required: true, message: '请选择~', trigger: 'change' }],
    name: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 20, message: '最长不超过20个字符长度', trigger: 'change' }
    ],
    textRule: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 200, message: '最长不超过200个字符长度', trigger: 'change' }
    ],
    textRulemax: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 200, message: '最长不超过200个字符长度', trigger: 'change' }
    ],
    budgetAmountRule: [{ required: true, validator: budgetAmountValidator, trigger: 'change' }]
})

// 详情
const getsingleData = async () => {
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
    // ruleForm.businessCode = ruleForm.businessCode.split(',')
    // ruleForm.budgetAmount = ruleForm.budgetAmount / 100
    ruleForm.dealType = ruleForm.dealType.split(',')
    ruleForm.discType = res.data.goodsGroup[0].goodsList[0].discType
    ruleForm.goodsGroup[0].goodsList.map(item => {
        if (item.discType === 1) {
            dataState.goodsList1.push(item)
        } else if (item.discType === 2) {
            dataState.goodsList2.push(item)
        }
    })
    ruleForm.goodsGroup.map((item, index) => {
        item.name = index.toString()
        item.goodsList.map(goodsItem => {
            goodsItem.salePrice = goodsItem.salePrice / 100
            goodsItem.fixedAmount = goodsItem.fixedAmount / 100
            goodsItem.origAmount = goodsItem.origAmount / 100
            goodsItem.discRatio = goodsItem.discRatio * 100
            goodsItem.fixedAmountVerifyPass = !!goodsItem.fixedAmount && goodsItem.fixedAmount > 0
            goodsItem.skuStockVerifyPass = !!goodsItem.skuStock && goodsItem.skuStock > 0
            goodsItem.singleUserMaxVerifyPass = !!goodsItem.singleUserMax && goodsItem.singleUserMax > 0
            goodsItem.discRatioVerifyPass = !!goodsItem.discRatio && goodsItem.discRatio > 0
            goodsItem.goodsOrderVerifyPass = goodsItem.goodsOrder >= 0
            delete goodsItem.seckillBeginTime
            delete goodsItem.seckillEndTime
        })
    })
    // if (ruleForm.acctInfo && ruleForm.acctInfo.length > 0) {
    //     ruleForm.acctInfo.map((item) => {
    //         item.assumeRatio = item.assumeRatio * 100
    //     })
    // } else {
    //     ruleForm.acctInfo = ({ acctName: '', acctId: '', assumeRatio: '', budgetId: '' })
    // }
    nextTick(() => {
        if (ruleForm.discType === 1) {
            dataState.googdsHasSelectList = dataState.goodsList1
        } else if (ruleForm.discType === 2) {
            dataState.googdsHasSelectList = dataState.goodsList2
        }
    })
}
if (props.handleType !== 'add') {
    getsingleData()
}

// 业务线change
const businessCodeChange = (tab, event) => {
    ruleForm.dealType = []
}

// // 新增成本账户
// const addCostCount = () => {
//     ruleForm.acctInfo.push({ acctName: '', acctId: '', assumeRatio: '' })
// }
// 删除成本账户
// const removeCostCount = (index) => {
//     ruleForm.acctInfo.splice(index, 1)
// }

// 展示子列表(选择成本账户/商品)
const showSubDialog = (type) => {
    dataState.subListType = type
    if (dataState.subListType === 'costAccount') {
        dataState.hasSelectList = dataState.costCountHasSelectList
    } else if (dataState.subListType === 'goodsSku') {
        if (!ruleForm.discType) {
            ElMessage.warning('请选择优惠类型')
            return
        }
        if (ruleForm.goodsGroup[dataState.goodsGroupIndex].goodsList.length >= 100) {
            ElMessage.warning('单个商品组合最多可选100个商品')
            return
        }
        dataState.hasSelectList = dataState.googdsHasSelectList
    }
    listDialogConfig.value = true
}

// 获取弹窗已选数据
const getDialogCheckedData = (info, index) => {
    if (dataState.subListType === 'costAccount') {
        // ruleForm.acctInfo = []
        // dataState.costCountHasSelectList = []
        // if (info.length === 0) {
        //     ruleForm.acctInfo.push({ acctName: '', acctId: '', assumeRatio: '', budgetId: '' })
        // }
        // info.map((item, index) => {
        //     dataState.costCountHasSelectList.push(item)
        //     item = { ...item, assumeRatio: '' }
        //     ruleForm.acctInfo.push(item)
        // })
    } else if (dataState.subListType === 'goodsSku') {
        dataState.googdsHasSelectList = []
        if (ruleForm.discType === 1) {
            dataState.goodsList1 = []
        } else if (ruleForm.discType === 2) {
            dataState.goodsList2 = []
        }
        info.map((item, index) => {
            item = {
                ...item,
                skuCode: item.skuId,
                discType: ruleForm.discType,
                skuStatus: item.skuOnshelfStatus || item.skuStatus,
                origAmount: item.salePrice || item.origAmount,
                firstCategoryName: item.firstCateName || item.firstCategoryName,
                firstCategoryId: item.firstCateCode || item.firstCategoryId,
                secondCategoryName: item.secondCateName || item.secondCategoryName,
                secondCategoryId: item.secondCateCode || item.secondCategoryId,
                threeCategoryName: item.thirdCateName || item.threeCategoryName,
                threeCategoryId: item.thirdCateCode || item.threeCategoryId,
                fourCategoryName: item.fourthCateName || item.fourCategoryName,
                fourCategoryId: item.fourthCateCode || item.fourCategoryId,
                goodsOrder: item.goodsOrder || 0,
                fixedAmountVerifyPass: !!item.fixedAmount,
                skuStockVerifyPass: !!item.skuStock,
                singleUserMaxVerifyPass: !!item.singleUserMax,
                discRatioVerifyPass: !!item.discRatio,
                goodsOrderVerifyPass: true
            }
            dataState.googdsHasSelectList.push(item)
            if (ruleForm.discType === 1) {
                dataState.goodsList1.push(item)
            } else if (ruleForm.discType === 2) {
                dataState.goodsList2.push(item)
            }
        })
    }
}

// 展示添加商品活动组合dialog
const showAvtivetab = () => {
    if (ruleForm.goodsGroup.length >= 24) {
        ElMessage.warning('最多添加24组活动商品')
        return
    }
    activeTabDialogVisible.value = true
    dataState.activeFormHandleType = 'add'
}
// 重置活动商品组合
const resetActiveForm = formEl => {
    if (!formEl) return
    activeFormRef.value.resetFields()
    // activeForm.seckillBeginTime = ''
    // activeForm.seckillEndTime = ''
}
// 关闭添加活动弹窗
const closeAvtivetab = () => {
    activeTabDialogVisible.value = false
    resetActiveForm(activeFormRef)
}

// tab change
const handleTabschange = (index) => {
    if (ruleForm.goodsGroup.length > 0) {
        dataState.goodsGroupIndex = index
        dataState.goodsList1 = []
        dataState.goodsList2 = []
        ruleForm.goodsGroup[index].goodsList.map(item => {
            if (item.discType === 1) {
                dataState.goodsList1.push(item)
            } else if (item.discType === 2) {
                dataState.goodsList2.push(item)
            }
        })
        nextTick(() => {
            if (ruleForm.discType === 1) {
                dataState.googdsHasSelectList = dataState.goodsList1
            } else if (ruleForm.discType === 2) {
                dataState.googdsHasSelectList = dataState.goodsList2
            }
        })
    } else {
        dataState.goodsList1 = []
        dataState.goodsList2 = []
        dataState.googdsHasSelectList = []
    }
}

// 提交保存活动tab
const addActive = () => {
    activeFormRef.value.validate(async (valid) => {
        if (valid) {
            const start = Number(activeForm.seckillBeginTime.replace(/:/g, ''))
            const end = Number(activeForm.seckillEndTime.replace(/:/g, ''))
            if (dataState.activeFormHandleType === 'add') {
                for (let i = 0; i < ruleForm.goodsGroup.length; i++) {
                    const itemStart = Number(ruleForm.goodsGroup[i].seckillBeginTime.replace(/:/g, ''))
                    const itemEnd = Number(ruleForm.goodsGroup[i].seckillEndTime.replace(/:/g, ''))
                    if (start > itemStart && start < itemEnd) {
                        ElMessage.warning('活动商品组合时间重复')
                        return
                    } else if (end > itemStart && end < itemEnd) {
                        ElMessage.warning('活动商品组合时间重复')
                        return
                    } else if (start < itemStart && end > itemEnd) {
                        ElMessage.warning('活动商品组合时间重复')
                        return
                    } else if (start === itemStart) {
                        ElMessage.warning('活动商品组合时间重复')
                        return
                    }
                }
            } else {
                for (let j = 0; j < ruleForm.goodsGroup.length; j++) {
                    if (j !== Number(dataState.goodsGroupIndex)) {
                        const itemStartEdit = Number(ruleForm.goodsGroup[j].seckillBeginTime.replace(/:/g, ''))
                        const itemEndEdit = Number(ruleForm.goodsGroup[j].seckillEndTime.replace(/:/g, ''))
                        if (start > itemStartEdit && start < itemEndEdit) {
                            ElMessage.warning('活动商品组合时间重复')
                            return
                        } else if (end > itemStartEdit && end < itemEndEdit) {
                            ElMessage.warning('活动商品组合时间重复')
                            return
                        } else if (start < itemStartEdit && end > itemEndEdit) {
                            ElMessage.warning('活动商品组合时间重复')
                            return
                        } else if (start === itemStartEdit) {
                            ElMessage.warning('活动商品组合时间重复')
                            return
                        }
                    }
                }
            }
            if (dataState.activeFormHandleType === 'add') {
                ruleForm.goodsGroup.push({
                    seckillBeginTime: activeForm.seckillBeginTime,
                    seckillEndTime: activeForm.seckillEndTime,
                    goodsList: [],
                    name: ruleForm.goodsGroup.length.toString()
                })
                editableTabsValue.value = (ruleForm.goodsGroup.length - 1).toString()
                dataState.goodsGroupIndex = ruleForm.goodsGroup.length - 1 // 更新dataState.goodsGroupIndex，同步商品列表
                dataState.goodsList1 = []
                dataState.goodsList2 = []
            } else if (dataState.activeFormHandleType === 'edit') {
                ruleForm.goodsGroup[dataState.goodsGroupIndex].seckillBeginTime = activeForm.seckillBeginTime
                ruleForm.goodsGroup[dataState.goodsGroupIndex].seckillEndTime = activeForm.seckillEndTime
            }
            activeTabDialogVisible.value = false
            resetActiveForm(activeFormRef)
        }
    })
}

// tab remove
const handleTabsRemove = () => {
    const groupIndex = dataState.goodsGroupIndex
    ruleForm.goodsGroup.splice(groupIndex, 1)
    ruleForm.goodsGroup.map((item, index) => {
        item.name = index
    })
    nextTick(() => {
        dataState.goodsGroupIndex = 0
        editableTabsValue.value = '0'
        handleTabschange(0)
    })
    activeTabDialogVisible.value = false
    resetActiveForm(activeFormRef)
}
// tab update
const handleTabsUpdate = (targetName) => {
    dataState.activeFormHandleType = 'edit'
    handleTabschange(targetName)
    dataState.goodsGroupIndex = targetName
    editableTabsValue.value = targetName.toString()
    Object.assign(activeForm, ruleForm.goodsGroup[targetName])
    activeTabDialogVisible.value = true
}

// 优惠类型change
const discTypeChange = (value) => {
    if (value === 1) {
        dataState.googdsHasSelectList = dataState.goodsList1
    } else if (value === 2) {
        dataState.googdsHasSelectList = dataState.goodsList2
    }
}
// 排序
const orderRest = (property) => {
    return function (a, b) {
        const value1 = a[property]
        const value2 = b[property]
        return value2 - value1
    }
}
// 商品表格权重比例change
const handleGoodsOrderAmountChange = (value, index) => {
    dataState.googdsHasSelectList[index].goodsOrder = value
    dataState.googdsHasSelectList[index].goodsOrderVerifyPass = goodsTableValidator3(value)
}
// 商品表格权重比例失去焦点
const handleGoodsOrderAmountBlur = (value, currentIndex) => {
    if (ruleForm.discType === 1) {
        dataState.goodsList1.sort(orderRest('goodsOrder'))
        dataState.googdsHasSelectList = dataState.goodsList1
    } else if (ruleForm.discType === 2) {
        dataState.goodsList2.sort(orderRest('goodsOrder'))
        dataState.googdsHasSelectList = dataState.goodsList2
    }
}
// 商品表格一口价change
const handleGoodsFixedAmountChange = (value, index, origAmount) => {
    dataState.googdsHasSelectList[index].fixedAmount = value
    if (Number(value) > Number(origAmount)) {
        dataState.googdsHasSelectList[index].fixedAmountVerifyPass = false
        return
    }
    dataState.googdsHasSelectList[index].fixedAmountVerifyPass = goodsTableValidator(value)
}
// 商品表格折扣率change
const handleDisDcRatioChange = (value, index) => {
    dataState.googdsHasSelectList[index].discRatio = Number(value)
    dataState.googdsHasSelectList[index].discRatioVerifyPass = goodsTableValidator2(value)
}
// 商品表格活动库存最大数量change
const handleSkuStockChange = (value, index) => {
    dataState.googdsHasSelectList[index].skuStock = value
    dataState.googdsHasSelectList[index].skuStockVerifyPass = goodsTableValidatorSkustock(value)
}
// 商品表格每人限购最大数量change
const handleSingleUserMaxChange = (value, index) => {
    dataState.googdsHasSelectList[index].singleUserMax = value
    dataState.googdsHasSelectList[index].singleUserMaxVerifyPass = goodsTableValidatorSingalmax(value)
}
// 商品表格-remove
const handleGoodsRemove = (index) => {
    if (ruleForm.discType === 1) {
        dataState.goodsList1.splice(index, 1)
        dataState.googdsHasSelectList = dataState.goodsList1
    } else if (ruleForm.discType === 2) {
        dataState.goodsList2.splice(index, 1)
        dataState.googdsHasSelectList = dataState.goodsList2
    }
    // ruleForm.goodsGroup[dataState.goodsGroupIndex].goodsList = dataState.goodsList1.concat(dataState.goodsList2)
}

// 提交表单
const submitForm = async () => {
    const params = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        promoType: 3, // 活动类型  秒杀 - 3
        promoStatus: '1',
        operatorId: userInfo.value.account,
        applier: userInfo.value.name,
        applierId: userInfo.value.account,
        applyName: ruleForm.applyName,
        businessCode: ruleForm.businessCode,
        dealType: ruleForm.dealType.join(),
        // acctInfo: JSON.parse(JSON.stringify(ruleForm.acctInfo)),
        promoBeginDate: ruleForm.promoTime[0] || '',
        promoEndDate: ruleForm.promoTime[1] || '',
        goodsGroup: JSON.parse(JSON.stringify(ruleForm.goodsGroup)),
        // budgetAmount: ruleForm.budgetAmount * 100,
        userRangeType: ruleForm.userRangeType,
        isUseCoupon: ruleForm.isUseCoupon,
        couponDesc: ruleForm.couponDesc,
        approveRemark: ruleForm.approveRemark
    }
    // params.acctInfo.map((item) => {
    //     item.assumeRatio = item.assumeRatio / 100
    //     delete item.gmtCreate
    //     delete item.gmtModify
    // })
    let oiStatusClose
    if (params.goodsGroup.length < 1) {
        ElMessage.warning('请添加商品活动组合')
        return
    }
    params.goodsGroup.map((item) => {
        if (!(item.goodsList?.length > 0)) {
            ElMessage.warning('请选择商品')
            oiStatusClose = true
            return
        }
        item.goodsList.forEach(goodsItem => {
            const passLabelList = ['goodsOrderVerifyPass', 'fixedAmountVerifyPass', 'skuStockVerifyPass', 'singleUserMaxVerifyPass']
            const discPassLabelList = ['goodsOrderVerifyPass', 'discRatioVerifyPass']
            if ((goodsItem.discType === 1 ? passLabelList : discPassLabelList).filter(i => !goodsItem[i])?.length > 0) oiStatusClose = true
            goodsItem.salePrice = Math.round(goodsItem.salePrice * 100)
            goodsItem.fixedAmount = Math.round(goodsItem.fixedAmount * 100)
            goodsItem.origAmount = Math.round(goodsItem.origAmount * 100)
            goodsItem.discRatio = goodsItem.discRatio / 100
        })
    })
    if (oiStatusClose) return
    params.promoBeginDate = ruleForm.promoTime[0] || ''
    params.promoEndDate = ruleForm.promoTime[1] || ''
    if (props.handleType === 'copy') {
        delete params.applyCode
        params.goodsGroup.map((groupItem) => {
            delete groupItem.applyCode
            delete groupItem.applyName
            delete groupItem.id
            delete groupItem.gmtModify
            delete groupItem.gmtCreate
            groupItem.goodsList.forEach(goodsItem => {
                delete goodsItem.applyCode
                delete goodsItem.applyName
                delete goodsItem.groupCode
                delete goodsItem.groupName
                delete goodsItem.gmtModify
                delete goodsItem.gmtCreate
            })
        })
        // params.acctInfo.map((item) => {
        //     delete item.gmtCreate
        //     delete item.gmtModify
        //     delete item.applyCode
        // })
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
        :deep(.el-tabs--card > .el-tabs__header){
            height: auto;
        }
        :deep(.el-tabs__item){
            height: auto;
            width: 120px;
            text-align: center;
            font-weight: 400;
        }
        :deep(.el-tabs__item > .is-icon-close){
            position: absolute;
        }
        :deep(.el-tabs__nav > .is-active){
            color: #fe2c55 !important;
            font-weight: 600;
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
        .add-goods {
            display: inline-block;margin-left: 30px;
            cursor: pointer;
            text-decoration: underline;
            color: #fe2c55;
        }
        .add-coupon {
            cursor: pointer;
            position: absolute;
            top: 0px;
            left: 0;
            text-decoration: underline;
            color: #fe2c55;
        }
        .custom-tabs-label{
            display: block;
            // height: 20px;
            // line-height: 20px;
        }
        .custom-tabs-label-count{
            text-align: center;
        }
        .goods-table-remove{
            color: #fe2c55;
            cursor: pointer;
        }
        .tab-edit{
            position: absolute;
            top: -3px;
            right: -3px;
        }
        .errTips {
            color: red;
            font-size: 12px;
        }
    }
</style>
