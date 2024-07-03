<template>
    <div class='coupon-submit-box'>
        <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="150px">
            <el-form-item label="生效城市" prop="cityRangeType" :rules="rules.selectRule">
                <el-radio-group v-model="ruleForm.cityRangeType" :disabled="canNotEdit">
                    <el-radio :label="1">全国</el-radio>
                    <el-radio :label="2">指定城市</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="" prop="effectiveCitysChecked" :rules="rules.effectiveCitysChecked" v-if="ruleForm.cityRangeType === 2">
                <!-- <el-cascader
                    class="form-action-item-50w"
                    ref="authorityRef"
                    :options="dataState.cityOption"
                    clearable
                    v-model="ruleForm.effectiveCitys"
                    :props="cascaderProps"
                    :show-all-levels="false"
                    :emitPath="false"
                    @change="authorityChange"
                    :disabled="canNotEdit"
                    collapse-tags
                /> -->
                <el-cascader
                    ref="authorityRef"
                    :props="effectiveCitysProp"
                    @change="effectiveCitysChange"
                    v-model="dataState.effectiveCitysChecked"
                    v-if="effectiveCitysVisiable"
                    width="100%"
                    clearable
                    :disabled="canNotEdit"
                />
            </el-form-item>
            <el-form-item label="选择商品" prop="goodsRangeType" :rules="rules.selectRule">
                <el-radio-group v-model="ruleForm.goodsRangeType" @change="goodsRangeTypeChange" :disabled="canNotEdit">
                    <el-radio :label="1">全部商品</el-radio>
                    <el-radio
                        :label="2"
                        v-if="ruleForm.businessCode.indexOf('5') > -1 && ruleForm.businessCode.length === 1"
                    >
                        商品维度生效 ({{googdsHasSelectList.length}})
                    </el-radio>
                    <el-radio
                        :label="3"
                        v-if="ruleForm.businessCode.indexOf('5') > -1 && ruleForm.businessCode.length === 1"
                    >
                        分类维度生效 ({{googdsClassifyList.length}})
                    </el-radio>
                </el-radio-group>
                <span
                    class="form-text-btn"
                    @click="showSubDialog('goods')"
                    v-if="!canNotEdit && ruleForm.businessCode.indexOf('5') > -1 && ruleForm.businessCode.length === 1"
                >增加</span>
                <span
                    class="form-text-btn"
                    @click="batchAddHandle()"
                    v-if="!canNotEdit && ruleForm.businessCode.indexOf('5') > -1 && ruleForm.businessCode.length === 1 && ruleForm.goodsRangeType === 2"
                >批量增加</span>
            </el-form-item>
            <div class="goods-list">
                <el-table :data="googdsHasSelectList" style="width: 100%;marginTop: 20px;" border v-if="ruleForm.goodsRangeType === 2">
                    <el-table-column prop="date" label="商品信息">
                        <template #default="scope">
                            <span>商品：{{scope.row.skuId}}-{{scope.row.skuName}}</span><br/>
                            <span>商品状态：{{skuStatusKeyValue[scope.row.skuOnshelfStatus]}}</span><br/>
                            <span>商品分类：{{scope.row.firstCateName}}-{{scope.row.secondCateName}}-{{scope.row.thirdCateName}}-{{scope.row.fourthCateName}}</span><br/>
                        </template>
                    </el-table-column>
                    <el-table-column label="价格" width="180">
                        <template #default="scope">
                            <span>原价：{{scope.row.salePrice}}</span><br/>
                        </template>
                    </el-table-column>
                    <el-table-column label="当前库存" width="180">
                        <template #default="scope">
                            <span>物理库存：{{scope.row.stock}}</span><br/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operate" label="操作" width="120" align="center" v-if="!canNotEdit" fixed="right">
                        <template #default="scope">
                            <el-button type="primary" text @click="handleGoodsRemove(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table :data="googdsClassifyList" style="width: 100%;marginTop: 20px;" border v-if="ruleForm.goodsRangeType === 3">
                    <el-table-column prop="firstCategoryId" label="一级类目编号" width="180"></el-table-column>
                    <el-table-column prop="firstCategoryName" label="一级类目名称" width="180"></el-table-column>
                    <el-table-column prop="secondCategoryId" label="二级类目编号" width="180"></el-table-column>
                    <el-table-column prop="secondCategoryName" label="二级类目名称" width="180"></el-table-column>
                    <!-- <el-table-column prop="threeCategoryId" label="三级编码" width="180"></el-table-column> -->
                    <!-- <el-table-column prop="threeCategoryName" label="三级名称" width="180"></el-table-column> -->
                    <el-table-column prop="operate" label="操作" width="120" align="center" v-if="!canNotEdit" fixed="right">
                        <template #default="scope">
                            <el-button type="primary" text @click="handleGoodsClassifyRemove(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
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
            <el-form-item label="营销工具" prop="couponType" :rules="rules.selectRule" class="coupon-type">
                <el-tabs
                    v-model="couponTypeActiveName"
                    type="card"
                    class="demo-tabs"
                    @tab-click="couponTypeHandleClick"
                >
                    <el-tab-pane :name="item.title" v-for="(item, index) in couponTypeTab" :key="index">
                        <template #label>
                            <span v-if="item.title === '立减'">{{item.title}}({{instantlyCouponsCount}})</span>
                            <span v-if="item.title === '满减'">{{item.title}}({{spendEnoughCouponsCount}})</span>
                            <span v-if="item.title === '折扣'">{{item.title}}({{discountCouponsCount}})</span>
                        </template>
                        <el-table :data="item.couponsList" border style="width: 100%">
                            <el-table-column label="券类型" align="center">
                                <template #default="scope">
                                    {{couponTypeKeyValue[scope.row.couponType]}}
                                </template>
                            </el-table-column>
                            <el-table-column label="可领券用户范围" width="130" align="center">
                                <template #default="scope">
                                    {{userRangeTypeKeyValue[scope.row.userRangeType]}}
                                </template>
                            </el-table-column>
                            <el-table-column v-if="couponTypeActiveName !== '折扣'" prop="maxMinusAmount" label="最高立减金额" width="130" align="center" />
                            <el-table-column v-if="couponTypeActiveName !== '折扣'" prop="doorsillAmount" label="门槛金额" width="100" align="center">
                                <template #default="scope">
                                    {{scope.row.doorsillAmount === '' ? '--' : scope.row.doorsillAmount}}
                                </template>
                            </el-table-column>
                            <el-table-column v-if="couponTypeActiveName === '折扣'" prop="discountRate" label="折扣比例" width="130" align="center">
                                <template #default="scope">
                                    {{scope.row.discountRate}}%
                                </template>
                            </el-table-column>
                            <el-table-column v-if="couponTypeActiveName === '折扣'" prop="maxDiscountAmount" label="最大优惠金额" width="130" align="center" />
                            <el-table-column prop="applyCount" label="券申请/领用/使用数量" width="200"  align="center">
                                <template #default="scope">
                                    {{scope.row.applyCount}}/{{scope.row.receiveCount || 0}}/{{scope.row.usedCount || 0}}
                                </template>
                            </el-table-column>
                            <el-table-column label="券有效期" width="220" align="center">
                                <template #default="scope">
                                    <span v-if="scope.row.termType === 1">领取后{{scope.row.isValidDays}}天生效，有效期{{scope.row.validDays}}天</span>
                                    <span v-if="scope.row.termType === 2">{{scope.row.useBeginDate}}</span>
                                    <br/>
                                    <span v-if="scope.row.termType === 2">{{scope.row.useEndDate}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="150" v-if="!canNotEdit">
                                <template #default="scope">
                                    <el-button link type="primary" size="small" @click="delCoupon(scope.$index)">删除</el-button>
                                    <el-button link type="primary" size="small" @click="getSignalCoupon(scope.row, scope.$index)">编辑</el-button>
                                    <el-button link type="primary" size="small" @click="showCouponBag(scope.row)">复制</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="150" v-if="canNotEdit && (ruleForm.groupStatus=== 4 || ruleForm.groupStatus === 5)">
                                <template #default="scope">
                                    <el-button link type="primary" size="small" @click="exportExcelCoupon(scope.row)">券码导出</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
                <span class="add-coupon" @click="showCouponBag" v-if="!canNotEdit">添加优惠券({{allCouponsCount}}/50)</span>
            </el-form-item>
            <el-form-item label="默认冻结金额" prop="freezeAmount" :rules="rules.numberRule">
                <el-input class="form-action-item-50w" v-model="ruleForm.freezeAmount" placeholder="默认冻结营销费用金额，优惠券失效后自动解冻" :disabled="canNotEdit"><template v-slot:suffix>元</template></el-input>
                <span>默认冻结金额用于优惠券核销，核销数量达到80%，会邮件提醒运营是否下线活动。</span>
            </el-form-item>
            <el-form-item label="单个用户领取上限" prop="singleUserMax" :rules="rules.singleUserMax">
                <el-input class="form-action-item-50w" v-model.number="ruleForm.singleUserMax" placeholder="填写数值，仅支持整数，不得为0" :disabled="canNotEdit"><template v-slot:suffix>次数</template></el-input>
            </el-form-item>
            <!-- <el-form-item label="POI范围">
                <span class="form-text">预计40个</span>
                <span class="form-text">查看列表</span>
            </el-form-item> -->
            <!-- <el-form-item label="POI类型" prop="poiRangeInfo.poiType" :rules="rules.selectRule">
                <el-radio-group v-model="ruleForm.poiRangeInfo.poiType" :disabled="canNotEdit">
                    <el-radio :label="1">智能柜</el-radio>
                    <el-radio :label="2">门店</el-radio>
                </el-radio-group>
            </el-form-item> -->
            <!-- <el-form-item label="渠道范围" prop="poiRangeInfo.channelType" :rules="rules.selectRule">
                <el-radio-group v-model="ruleForm.poiRangeInfo.channelType" :disabled="canNotEdit">
                    <el-radio :label="1">货柜</el-radio>
                    <el-radio :label="2">门店</el-radio>
                    <el-radio :label="3">到家电商</el-radio>
                </el-radio-group>
            </el-form-item> -->
            <div v-if="ruleForm.businessCode.indexOf('1') > -1 || ruleForm.businessCode.indexOf('2') > -1">
                <el-form-item label="货柜">
                    <el-form-item label="设备运营模式" prop="poiRangeInfo.operateModel" :rules="rules.selectRule">
                        <el-radio-group v-model="ruleForm.poiRangeInfo.operateModel" :disabled="canNotEdit">
                            <el-radio :label="1">全部</el-radio>
                            <el-radio :label="2">自营</el-radio>
                            <el-radio :label="3">柜主</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form-item>
            </div>
            <div v-if="ruleForm.businessCode.indexOf('1') > -1 || ruleForm.businessCode.indexOf('3') > -1">
                <el-form-item label="门店">
                    <el-form-item label="指定门店" prop="poiRangeInfo.isAssignStore" :rules="rules.selectRule">
                        <el-radio-group v-model="ruleForm.poiRangeInfo.isAssignStore" :disabled="canNotEdit">
                            <el-radio :label="1">全部</el-radio>
                            <el-radio :label="2">部门门店</el-radio>
                        </el-radio-group>
                        <span class="form-text-btn" @click="showSubDialog('shop')" v-if="ruleForm.poiRangeInfo.isAssignStore === 2 && !canNotEdit">增加</span>
                        <div class="form-text-btn" v-if="ruleForm.poiRangeInfo.isAssignStore === 2">已选择{{shopHasSelectList.length}}个门店</div>
                    </el-form-item>
                </el-form-item>
            </div>
            <div v-if="ruleForm.businessCode.indexOf('1') > -1 || ruleForm.businessCode.indexOf('5') > -1">
                <el-form-item label="到家电商">
                    <el-form-item label="指定渠道" prop="poiRangeInfo.homeChannelType" :rules="rules.selectRule">
                        <el-radio-group v-model="ruleForm.poiRangeInfo.homeChannelType" :disabled="canNotEdit">
                            <el-radio :label="1">全部</el-radio>
                            <!-- <el-radio :label="2">恒生活电商</el-radio> -->
                            <!-- <el-radio :label="3">X平台</el-radio> -->
                        </el-radio-group>
                    </el-form-item>
                </el-form-item>
            </div>
            <!-- <el-form-item label="使用说明" prop="couponDesc" :rules="rules.couponDesc">
                <el-input v-model="ruleForm.couponDesc" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="1、全品类商品通用（不能使用优惠券商品除外） 2、限定北京，上海城市智能货柜使用" :disabled="canNotEdit"/>
            </el-form-item> -->
            <el-form-item label="项目投入产出测算" prop="couponCalculate" :rules="rules.textRule">
                <el-input v-model="ruleForm.couponCalculate" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="预计投入1000元，GMV上升2000元" :disabled="canNotEdit"/>
            </el-form-item>
        </el-form>
        <div class="footer">
            <span class="dialog-footer">
                <el-button type="primary"  v-if="checkRole('marketing-5') && (props.handleType === 'add' || props.handleType === 'edit'|| props.handleType === 'copy')" @click="submitForm(ruleFormRef)">
                    提交
                </el-button>
                <el-button type="primary" v-if="checkRole('marketing-9') && props.handleType === 'approval' && ruleForm.groupStatus===1" @click="couponAudit(3)">
                    提交审批
                </el-button>
                <el-button type="primary" @click="handleClose">
                    取消
                </el-button>
            </span>
        </div>
        <com-list
            v-if="listDialogConfig"
            :listVisible ='listDialogConfig'
            :listType="dataState.subListType"
            :hasSelectList="dataState.hasSelectList"
            :businessCode="ruleForm.businessCode"
            @handleClose="listDialogConfig = false"
            @getDialogCheckedData="getDialogCheckedData"
        ></com-list>
        <coupon-bag
            v-if="couponBagConfig"
            :listVisible ='couponBagConfig'
            :handleType="couponBagType"
            :updateCouponData="signalCouponData"
            :isValidTime="ruleForm.isValidTime"
            @handleClose="couponBagConfig = false"
            @addCoupon="updateCouponsList"
            @updateCoupon="updateCouponData"
        ></coupon-bag>
        <coupon-submit v-if="dialogVisible" :visible ='dialogVisible' @handleClose="dialogVisible = false" @fevent="goCouponBatchList()" ></coupon-submit>
        <el-dialog
            v-model="goodsClassifyDialogVisiable"
            :title="dataState.goodsAddType === 'batch' ? '商品批量添加' : '商品分类选择'"
            width="30%"
            :before-close="hideGoodsClassifyDialog"
        >
            <div v-if="dataState.goodsAddType === 'classify'">
                <el-cascader
                    ref="basicLevelRef"
                    :props="basicLevel"
                    @change="basicLevelChange"
                    v-model="dataState.basicLevelChecked"
                    v-if="basicLevelRefVisiable"
                    width="100%"
                    clearable
                >
                </el-cascader>
            </div>
            <div v-if="dataState.goodsAddType === 'batch'">
                <el-input v-model="dataState.batchSkuIds" :autosize="{ minRows: 2, maxRows: 10 }" placeholder="一次最多输入200个商品，请用英文逗号分隔" type="textarea"/>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="goodsClassifyDialogVisiable = false">取消</el-button>
                    <el-button type="primary" @click="goodsSubmit">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { reactive, ref, toRefs, computed, nextTick } from 'vue'
import comList from '../marketing/coupon-batch/components/apply-coupon-comList.vue'
import couponBag from '../marketing/coupon-batch/components/apply-coupon-bag.vue'
import couponSubmit from '../marketing/coupon-batch/components/coupon-submit.vue'
import { addCouponBatch, getCouponDataSingle, updateCouponBatch, getCityList } from '@/api/marketing/coupon'
import { getMerchantList } from '@/api/operate/index'
import { getGoodsList } from '@/api/marketing/active'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { checkRole, yingyongQueryCategory, cityQueryCategory } from '@/utils'

const route = useRoute()
const router = useRouter()
// const { proxy } = getCurrentInstance()
const dialogVisible = ref(false)
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const canNotEdit = computed(() => props.handleType === 'detail' || props.handleType === 'approval')
const listDialogConfig = ref(false) // 页面子列表弹框
const goodsClassifyDialogVisiable = ref(false) // 商品分类纬度选择弹窗
// 券包 start
const couponTypeActiveName = ref('立减') // 营销工具tab选中
const signalCouponData = ref(null) // 营销券包单个优惠券项
const updateCouponIndex = ref(null) // 营销券包单个优惠券index
const couponBagConfig = ref(false) // 添加券包弹窗
const couponBagType = ref(null) // 券包弹窗类型，新增，编辑，复制
const instantlyCouponsList = ref([]) // 立减券
const spendEnoughCouponsList = ref([]) // 满减券
const discountCouponsList = ref([]) // 折扣券
const instantlyCouponsCount = computed(() => instantlyCouponsList.value.length)
const spendEnoughCouponsCount = computed(() => spendEnoughCouponsList.value.length)
const discountCouponsCount = computed(() => discountCouponsList.value.length)
const allCouponsList = computed(() => instantlyCouponsList.value.concat(spendEnoughCouponsList.value, discountCouponsList.value)) // 所有类型的券包整合
const allCouponsCount = computed(() => allCouponsList.value.length)
// 券包 end

const basicLevelRef = ref(null)
const authorityRef = ref(null)
const props = defineProps(['handleType', 'groupCode', 'subCode'])
const defaultTime = [
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59)
]
const value1 = ref([
    new Date(2000, 10, 10, 10, 10),
    new Date(2000, 10, 11, 10, 10)
])
const cascaderProps = { multiple: true } // 生效城市可多选

// 返回批次列表
const goCouponBatchList = async () => {
    router.push({ name: 'coupon-batch-list' })
}
const handleClose = () => {
    goCouponBatchList()
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
    },
    cityOption: [],
    hasSelectList: [], // 子弹窗列表已选项
    costCountHasSelectList: [], // 成本账户已选
    googdsHasSelectList: [], // 商品列表已选-商品纬度
    googdsClassifyList: [], // 商品列表已选-分类纬度
    shopHasSelectList: [], // 门店列表已选
    couponTypeTab: [
        {
            title: '立减',
            couponsList: []
        },
        {
            title: '满减',
            couponsList: []
        },
        {
            title: '折扣',
            couponsList: []
        }
    ],
    couponTypeKeyValue: {
        1: '立减',
        2: '满减',
        3: '折扣'
    },
    userRangeTypeKeyValue: {
        1: '全部用户',
        2: 'App新注册用户',
        3: '已注册未下单用户',
        4: '已下单用户'
    },
    skuStatusKeyValue: {
        1: '待审核',
        2: '已审核',
        3: '已拒绝',
        4: '已上架',
        5: '下架可上架',
        6: '下架',
        7: '待上架'
    },
    basicLevelChecked: [], // 商品分类纬度选中
    effectiveCitysChecked: [], // 生效城市纬度选中
    basicLevelRefVisiable: true, // 商品分类纬度级联下拉框
    effectiveCitysVisiable: true, // 生效城市级联下拉框
    goodsAddType: '', // 新增商品，列表选择/批次添加
    batchSkuIds: '' // 批次添加商品skuids
})
const { statusKeyValue, couponTypeTab, couponTypeKeyValue, userRangeTypeKeyValue, skuStatusKeyValue, shopHasSelectList, googdsHasSelectList, basicLevelRefVisiable, effectiveCitysVisiable, googdsClassifyList } = toRefs(dataState)
const ruleForm = reactive({
    applier: '',
    groupName: '',
    groupStatus: 1,
    subCode: '',
    businessCode: [],
    dealType: [],
    acctInfo: [{ acctName: '', acctId: '', assumeRatio: '', budgetId: '' }],
    couponType: Number(route.params.couponType),
    maxMinusAmount: '',
    doorsillAmount: '',
    discountRate: '',
    applyCount: '',
    freezeAmount: '',
    cityRangeType: '',
    effectiveCitys: [],
    provinceCityInfo: [],
    userRangeType: '',
    goodsRangeType: '',
    isValidTime: '',
    termType: null,
    isValidDays: 0,
    unValidDays: 0,
    useDate: [],
    singleUserMax: '',
    poiRangeInfo: {
        channelType: null,
        operateModel: null,
        isAssignStore: null,
        homeChannelType: null,
        storeInfo: []
    },
    couponDesc: '',
    couponCalculate: ''
})

// 营销工具change
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
            if (value > 0 && value <= 100) {
                callback()
            } else {
                callback(new Error('请输入大于0且小于等于100的数字'))
            }
        }
    }
}
// 校验规则：支持输入整数数字，可输入范围1~200000
const numberValidator = (rule, value, callback) => {
    if (canNotEdit.value) {
        return
    }
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        const reg = /^[0-9]*(\.[0-9]{0,2})?$/
        if (!isNaN(value) && reg.test(value)) {
            callback()
        } else {
            callback(new Error('仅限输入数字，支持小数点后两位'))
        }
        callback()
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
    if (canNotEdit.value) {
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
    name: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 20, message: '最长不超过20个字符长度', trigger: 'change' }
    ],
    textRule: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 200, message: '最长不超过200个字符长度', trigger: 'change' }
    ],
    effectiveCitys: [
        { required: true, message: '请选择', trigger: 'change' }
    ]
})

// 获取所有城市信息
const getCityOption = async () => {
    const res = await getCityList()
    if (res.code === '200') {
        dataState.cityOption = res.data
    }
}

// 获取优惠券批次单条数据
const getsingleData = async () => {
    const params = {
        appKey: props.subCode,
        busiCode: props.subCode,
        sceneCode: '1',
        functionCode: 'functionCode',
        groupCode: props.groupCode,
        groupStatus: 1,
        operatorId: userInfo.value.account
    }
    const res = await getCouponDataSingle(params)
    Object.assign(ruleForm, res.data)
    ruleForm.businessCode = ruleForm.businessCode.split(',')
    ruleForm.dealType = ruleForm.dealType.split(',')
    if (props.handleType !== 'copy') {
        if (ruleForm.acctInfo && ruleForm.acctInfo.length > 0) {
            ruleForm.acctInfo.map((item) => {
                item.assumeRatio = item.assumeRatio * 100
            })
        } else {
            ruleForm.acctInfo = [{ acctName: '', acctId: '', assumeRatio: '', budgetId: '' }]
        }
    } else {
        ruleForm.acctInfo = [{ acctName: '', acctId: '', assumeRatio: '', budgetId: '' }]
    }
    ruleForm.cityRangeType = Number(ruleForm.cityRangeType)
    if (ruleForm.batchList && ruleForm.batchList.length > 0) {
        ruleForm.batchList.map((item) => {
            item.maxMinusAmount = item.maxMinusAmount / 100
            item.doorsillAmount = item.doorsillAmount / 100
            item.maxDiscountAmount = item.maxDiscountAmount / 100
            item.discountRate = item.discountRate * 100
            updateCouponsList(item)
        })
    }
    ruleForm.isValidTime = [res.data.isValidBeginTime, res.data.isValidEndTime]
    ruleForm.freezeAmount = res.data.freezeAmount / 100
    // 生效城市回显
    if (res.data.provinceCityInfo) {
        res.data.provinceCityInfo.forEach(item => {
            const catesInfo = [item.provinceCode, item.cityCode]
            dataState.effectiveCitysChecked.push(catesInfo)
        })
        dataState.effectiveCitysVisiable = false
        setTimeout(() => {
            dataState.effectiveCitysVisiable = true
        }, 100)
    }
    if (res.data.goodsRangeType === 2) {
        dataState.googdsHasSelectList = res.data.goodsRangeInfo
    } else if (res.data.goodsRangeType === 3) {
        dataState.googdsClassifyList = res.data.categoryInfo
    }
    ruleForm.poiRangeInfo.operateModel = Number(ruleForm.poiRangeInfo.operateModel)
    ruleForm.poiRangeInfo.isAssignStore = Number(ruleForm.poiRangeInfo.isAssignStore)
    ruleForm.poiRangeInfo.homeChannelType = Number(ruleForm.poiRangeInfo.homeChannelType)
    if (ruleForm.poiRangeInfo.storeInfo) dataState.shopHasSelectList = ruleForm.poiRangeInfo.storeInfo
}

if (props.handleType) {
    getCityOption()
    if (props.handleType !== 'add') {
        getsingleData()
    }
}

// 提交审批
const couponAudit = async () => {
    dialogVisible.value = true
}

// 新增成本账户
const addCostCount = () => {
    ruleForm.acctInfo.push({ acctName: '', acctId: '', assumeRatio: '' })
}
// 获取已选成本账户
const getDialogCheckedData = (info, index) => {
    if (dataState.subListType === 'costAccount') {
        ruleForm.acctInfo = []
        dataState.costCountHasSelectList = []
        if (info.length === 0) {
            ruleForm.acctInfo.push({ acctName: '', acctId: '', assumeRatio: '', budgetId: '' })
        }
        info.map((item, index) => {
            dataState.costCountHasSelectList.push(item)
            item = { ...item, assumeRatio: '' }
            ruleForm.acctInfo.push(item)
        })
    } else if (dataState.subListType === 'goods') {
        dataState.googdsHasSelectList = []
        info.map((item, index) => {
            dataState.googdsHasSelectList.push(item)
        })
    } else if (dataState.subListType === 'shop') {
        dataState.shopHasSelectList = []
        info.map((item, index) => {
            dataState.shopHasSelectList.push(item)
        })
    }
}
// 展示子列表
const showSubDialog = (type) => {
    dataState.subListType = type
    if (dataState.subListType === 'costAccount') {
        dataState.hasSelectList = dataState.costCountHasSelectList
        listDialogConfig.value = true
    } else if (dataState.subListType === 'goods') {
        // if (ruleForm.goodsGroup[dataState.goodsGroupIndex].goodsList.length >= 100) {
        //     ElMessage.warning('单个商品组合最多可选100个商品')
        //     return
        // }
        if (ruleForm.goodsRangeType === 2) {
            dataState.hasSelectList = dataState.googdsHasSelectList
            listDialogConfig.value = true
        } else if (ruleForm.goodsRangeType === 3) {
            // 商品分类纬度选择-show
            showGoodsClassifyDialog()
        }
    } else if (dataState.subListType === 'shop') {
        dataState.hasSelectList = dataState.shopHasSelectList
        listDialogConfig.value = true
    }
}
// 批次添加
const batchAddHandle = () => {
    dataState.goodsAddType = 'batch'
    // dataState.hasSelectList = dataState.googdsHasSelectList
    goodsClassifyDialogVisiable.value = true
}

const showGoodsClassifyDialog = (type) => {
    dataState.goodsAddType = 'classify'
    dataState.basicLevelChecked = []
    dataState.googdsClassifyList.forEach(item => {
        const catesInfo = [item.firstCategoryId, item.secondCategoryId]
        dataState.basicLevelChecked.push(catesInfo)
    })
    goodsClassifyDialogVisiable.value = true
    dataState.basicLevelRefVisiable = false
    setTimeout(() => {
        dataState.basicLevelRefVisiable = true
    }, 100)
}
// 商品分类纬度选择-hide
const hideGoodsClassifyDialog = (type) => {
    goodsClassifyDialogVisiable.value = false
}

// 删除成本账户
const removeCostCount = (index) => {
    ruleForm.acctInfo.splice(index, 1)
    dataState.costCountHasSelectList.splice(index, 1)
}

// 商品表格-remove
const handleGoodsRemove = (index) => {
    dataState.googdsHasSelectList.splice(index, 1)
}
// 商品分类纬度表格-remove
const handleGoodsClassifyRemove = (index) => {
    dataState.googdsClassifyList.splice(index, 1)
}

// 业务线change
const businessCodeChange = (tab, event) => {
    ruleForm.dealType = []
    const channelType = []
    if (ruleForm.businessCode.indexOf('2') < 0) {
        ruleForm.poiRangeInfo.operateModel = null
    } else {
        channelType.push(1)
    }
    if (ruleForm.businessCode.indexOf('3') < 0) {
        ruleForm.poiRangeInfo.isAssignStore = null
        dataState.shopHasSelectList = []
    } else {
        channelType.push(2)
    }
    if (ruleForm.businessCode.indexOf('5') < 0) {
        ruleForm.goodsRangeType = null
        ruleForm.poiRangeInfo.homeChannelType = null
    } else {
        channelType.push(3)
    }
    ruleForm.poiRangeInfo.channelType = channelType.join()
}

// 选择商品change
const goodsRangeTypeChange = (value) => {
    console.log(value)
    dataState.googdsHasSelectList = []
    dataState.googdsClassifyList = []
}

// 营销工具change
const couponTypeHandleClick = (tab, event) => {
    console.log(tab.props, event)
}
// 添加券包
const showCouponBag = (couponData) => {
    if (allCouponsCount.value >= 50) {
        ElMessage.warning('可添加50个券，已达上限')
        return
    }
    if (couponData) {
        signalCouponData.value = couponData
    }
    couponBagConfig.value = true
    couponBagType.value = 'add'
}
// 导出券码
const exportExcelCoupon = async (row) => {
    const params = {
        body: {
            batchCode: row.batchCode,
            appKey: 'A1001001',
            busiCode: 'A1001001',
            gmtOperate: new Date().getTime(),
            operatorId: userInfo.value.account
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC8867225242206208',
        name: '营销中台-按组或批次导出兑换码',
        source: '营销中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    await getMerchantList(params)
}
// 添加券列表
const updateCouponsList = (coupon) => {
    if (coupon.couponType === 1) {
        instantlyCouponsList.value.push(coupon)
        dataState.couponTypeTab[0].couponsList = instantlyCouponsList.value
    } else if (coupon.couponType === 2) {
        spendEnoughCouponsList.value.push(coupon)
        dataState.couponTypeTab[1].couponsList = spendEnoughCouponsList.value
    } else if (coupon.couponType === 3) {
        discountCouponsList.value.push(coupon)
        dataState.couponTypeTab[2].couponsList = discountCouponsList.value
    }
}

// 删除券列表项
const delCoupon = (index) => {
    if (couponTypeActiveName.value === '立减') {
        instantlyCouponsList.value.splice(index, 1)
        dataState.couponTypeTab[0].couponsList = instantlyCouponsList.value
    } else if (couponTypeActiveName.value === '满减') {
        spendEnoughCouponsList.value.splice(index, 1)
        dataState.couponTypeTab[1].couponsList = spendEnoughCouponsList.value
    } else if (couponTypeActiveName.value === '折扣') {
        discountCouponsList.value.splice(index, 1)
        dataState.couponTypeTab[2].couponsList = discountCouponsList.value
    }
}

// 编辑券列表项
const getSignalCoupon = (row, index) => {
    signalCouponData.value = row
    updateCouponIndex.value = index
    couponBagConfig.value = true
    couponBagType.value = 'edit'
}

// 编辑券列表项
const updateCouponData = (coupon) => {
    const couponIndex = updateCouponIndex.value
    if (coupon.couponType === 1) {
        Object.assign(instantlyCouponsList.value[couponIndex], coupon)
    } else if (coupon.couponType === 2) {
        Object.assign(spendEnoughCouponsList.value[couponIndex], coupon)
    } else if (coupon.couponType === 3) {
        Object.assign(discountCouponsList.value[couponIndex], coupon)
    }
}

// 应用类目联动
const basicLevel = {
    lazy: true,
    multiple: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await yingyongQueryCategory(level + 1, data.value || '')
        console.log(res)
        const nodes = res.map(item => {
            return {
                label: item.name,
                value: item.code,
                level: item.level,
                leaf: level >= 1
            }
        })
        resolve(nodes)
        // if (res.length > 0) {
        // }
    }
}
// 应用类目change
const basicLevelChange = (value) => {
    dataState.basicLevelCheckedNodes = basicLevelRef.value.getCheckedNodes(true)
}
// 生效城市联动
const effectiveCitysProp = {
    lazy: true,
    multiple: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await cityQueryCategory(level + 1, data.value || '')
        const nodes = res.map(item => {
            return {
                label: item.addressName,
                value: item.addressCode,
                level: item.level,
                leaf: level >= 1
            }
        })
        resolve(nodes)
    }
}
// 生效城市change
const effectiveCitysChange = (value) => {
    ruleForm.provinceCityInfo = []
    dataState.effectiveCitysCheckedNodes = authorityRef.value.getCheckedNodes(true)
    dataState.effectiveCitysCheckedNodes.forEach(item => {
        ruleForm.provinceCityInfo.push({
            provinceCode: item.pathValues[0],
            provinceName: item.pathLabels[0],
            cityCode: item.pathValues[1],
            cityName: item.pathLabels[1]
        })
    })
}
// 选择商品分类纬度dialog提交
const goodsSubmit = async () => {
    if (dataState.goodsAddType === 'batch') {
        if (dataState.batchSkuIds !== '') {
            if (dataState.batchSkuIds.split(',').length < 200) {
                const param = {
                    appKey: 'A1001001',
                    busiCode: 'A1001001',
                    sceneCode: '1',
                    functionCode: 'functionCode',
                    configCode: 'UC16582257103870OxkY',
                    name: '秒杀商品列表',
                    source: '营销中台',
                    modifierId: userInfo.value.account,
                    operatorId: userInfo.value.account,
                    operatorName: userInfo.value.name,
                    body: {
                        appKey: 'A1001001',
                        busiCode: 'A1001001',
                        channels: ruleForm.businessCode.join(','),
                        skuIds: dataState.batchSkuIds,
                        currPage: 1,
                        pageSize: 999
                    }
                }
                const res = await getGoodsList(param)
                if (res.code === '200') {
                    if (res.data.list) {
                        res.data.list.map(item => {
                            // item = { ...item, skuCode: item.skuId }
                            dataState.googdsHasSelectList.push(item)
                        })
                        // 列表去重
                        nextTick(() => {
                            const obj = {}
                            const arr = dataState.googdsHasSelectList.reduce((newArr, next) => {
                                if (!obj[next.skuId]) {
                                    obj[next.skuId] = true && newArr.push(next)
                                }
                                return newArr
                            }, [])
                            dataState.googdsHasSelectList = arr
                        })
                    }
                }
            } else {
                ElMessage.warning('输入skuId超过上限200')
                return
            }
        }
    } else if (dataState.goodsAddType === 'classify') {
        dataState.googdsClassifyList = []
        dataState.basicLevelCheckedNodes.forEach((item) => {
            dataState.googdsClassifyList.push({
                firstCategoryId: item.pathValues[0],
                firstCategoryName: item.pathLabels[0],
                secondCategoryId: item.pathValues[1],
                secondCategoryName: item.pathLabels[1],
                threeCategoryId: item.pathValues[2],
                threeCategoryName: item.pathLabels[2]
            })
        })
    }
    goodsClassifyDialogVisiable.value = false
    dataState.batchSkuIds = ''
}
// 提交表单
const submitForm = async (formEl) => {
    const params = JSON.parse(JSON.stringify(ruleForm))
    const couponsList = instantlyCouponsList.value.concat(spendEnoughCouponsList.value, discountCouponsList.value)
    params.appKey = ruleForm.subCode
    params.busiCode = ruleForm.subCode
    params.businessCode = params.businessCode.join()
    params.dealType = params.dealType.join()
    params.operatorId = userInfo.value.account
    params.applier = userInfo.value.name
    params.applierId = userInfo.value.account
    params.gmtOperate = new Date().getTime()
    params.acctInfo = JSON.parse(JSON.stringify(ruleForm.acctInfo))
    params.poiRangeInfo = JSON.parse(JSON.stringify(ruleForm.poiRangeInfo))
    params.batchList = JSON.parse(JSON.stringify(couponsList))
    params.acctInfo.map((item) => {
        item.assumeRatio = item.assumeRatio / 100
    })
    params.isValidBeginTime = params.isValidTime[0] || ''
    params.isValidEndTime = params.isValidTime[1] || ''
    params.freezeAmount = params.freezeAmount * 100
    params.goodsRangeInfo = []
    if (ruleForm.goodsRangeType === 2) {
        dataState.googdsHasSelectList.forEach(item => {
            params.goodsRangeInfo.push({
                skuId: item.skuId,
                skuName: item.skuName
            })
        })
    } else if (ruleForm.goodsRangeType === 3) {
        params.categoryInfo = dataState.googdsClassifyList
    }
    params.poiRangeInfo.storeInfo = []
    dataState.shopHasSelectList.forEach(item => {
        params.poiRangeInfo.storeInfo.push(item)
    })
    if (props.handleType === 'copy') {
        params.batchList.map((item) => {
            delete item.batchName
            delete item.batchCode
            delete item.groupCode
            delete item.groupName
            delete item.freezeAmount
        })
        params.acctInfo.map((item) => {
            delete item.groupCode
            delete item.groupName
        })
        delete params.auditWorkId
        delete params.auditName
        delete params.auditStatus
        delete params.auditTime
        delete params.auditRemark
        delete params.poiRangeInfo.groupCode
        delete params.poiRangeInfo.groupName
        delete params.submitAuditTime
    }
    params.batchList.map((item) => {
        item.maxMinusAmount = parseInt(Number(item.maxMinusAmount) * 100)
        item.maxDiscountAmount = parseInt(Number(item.maxDiscountAmount) * 100)
        item.doorsillAmount = item.doorsillAmount * 100
        item.discountRate = item.discountRate / 100
        if (props.handleType === 'copy') {
            if (item.groupCode) {

            }
        }
    })
    delete params.isValidTime
    // delete params.effectiveCitys
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            if (couponsList.length === 0) {
                ElMessage.warning('请添加优惠券')
                return
            }
            if (props.handleType === 'add' || props.handleType === 'copy') {
                const res = await addCouponBatch({ ...params })
                if (res.code === '200') {
                    handleClose()
                    ElMessage({
                        message: res.message,
                        type: 'success'
                    })
                }
            } else {
                const res = await updateCouponBatch({ ...params, groupCode: props.groupCode })
                if (res.code === '200') {
                    handleClose()
                    ElMessage({
                        message: res.message,
                        type: 'success'
                    })
                }
            }
        }
    })
}
// // 选择生效城市
// const authorityChange = (value) => {
//     dataState.authorityCheckedNodes = proxy.$refs.authorityRef.getCheckedNodes(true)
// }
</script>
<style lang="scss" scoped>
    .coupon-submit-box{
        :deep(.el-dialog){
          min-width: 800px;
        }
        :deep(.el-dialog__body){
          height: 500px;
          overflow-y: scroll;
        }
        .form-action-item-50w{
            width: 50%;
        }
        .form-action-item-100w{
            width: 100%;
        }
        .coupon-type{
            .add-coupon{
                position: absolute;
                right: 50%;
                top: 0;
                color: #fe2c55;
                cursor: pointer;
                text-decoration: underline;
                z-index: 9;
            }
        }
        .goods-list{
          padding: 0;
          margin-left: 150px;
          margin-bottom: 30px;
        //   border: 1px solid #ccc;
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
        .footer{
          margin: 30px;
          text-align: center;
        }
    }
</style>
