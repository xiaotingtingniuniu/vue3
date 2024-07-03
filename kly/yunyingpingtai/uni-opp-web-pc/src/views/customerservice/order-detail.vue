<template>
    <div class="work-order-container">
        <!-- <el-dialog v-model="dialogDetail" width="70%" :before-close="handleClose"> -->
        <div class="gongdaninfo">
            <div class="info-detail">
                <el-row :gutter="24">
                    <el-col :span="6" v-if="iscon == '1'"><h2>货柜工单详情</h2></el-col>
                    <el-col :span="6" v-else><h2>电商工单详情</h2></el-col>
                    <el-col :span="8"><div class="height-p">工单状态：<span>{{workStatusList[detail.workStatus]}}</span></div></el-col>
                    <el-col :span="8"><div class="height-p">客诉类型：<span>{{workTypeList[detail.custAppealType]}}</span></div></el-col>
                </el-row>
            </div>
            <el-row :gutter="24">
                <el-col :span="6"><div class="height-p">订单编号：{{detail.orderNumber}}</div></el-col>
                <el-col :span="6"><div class="height-p">OA订单号：{{detail.oaNumber}}</div></el-col>
                <el-col :span="6"><div class="height-p">用户手机号：{{detail.mobile}}</div></el-col>
                <el-col :span="6" v-if="iscon == '1'"><div class="height-p">商家类型：{{merchantType[detail.merchantType]}}</div></el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="6" v-if="iscon == '1'"><div class="height-p">商家编号：{{detail.merchantCode}}</div></el-col>
                <el-col :span="6" v-if="iscon == '1'"><div class="height-p">商家名称：{{detail.merchantName}}</div></el-col>
                <el-col :span="6" v-if="iscon == '1'"><div class="height-p">设备编号：{{detail.deviceNo}}</div></el-col>
                <el-col :span="6" v-if="iscon == '1'"><div class="height-p">设备名称：{{detail.deviceName}}</div></el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="6"><div class="height-p">发起时间：{{detail.gtmCreator}}</div></el-col>
                <el-col :span="6"><div class="height-p">完结时间：{{detail.workEndTime}}</div></el-col>
                <el-col :span="6"><div class="height-p">工单类型：{{detail.workType === 0?'退款':'补款'}}</div></el-col>
                <el-col :span="6" v-if="iscon == '1'">
                    <div class="height-p">
                        处理结果：
                        <span v-if="detail.dealResult === 2">有退款</span>
                        <span v-if="detail.dealResult === 3">用户取消退款</span>
                        <span v-if="detail.dealResult === 0">待处理</span>
                        <span v-if="detail.dealResult === 1">拒绝退款</span>
                    </div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6" v-if="iscon == '0'">
                    <div class="height-p">
                        处理结果：
                        <span v-if="detail.dealResult === 2">有退款</span>
                        <span v-if="detail.dealResult === 3">用户取消退款</span>
                        <span v-if="detail.dealResult === 0">待处理</span>
                        <span v-if="detail.dealResult === 1">拒绝退款</span>
                    </div></el-col>
                <el-col :span="8"><div class="height-p">处理人：{{detail.dealName}}</div></el-col>
                <el-col :span="8"><div class="height-p">客户端类型：{{platformzList[detail.platform]}}</div></el-col>
            </el-row>
        </div>
        <div class="orderinfo">
            <h2>订单详情</h2>

            <total-table :tHead="tHeadOrder"
                         :tableData="tableDataOrder" :accountData="accountData">
                <template #goodsInformation="scope">
                    <p class='p_class'>商品编号：{{scope.row.commodityNumber}}</p>
                    <p class='p_class'>商品名称：{{scope.row.commodityName}}</p>
                </template>
                <template #orderNum="scope">
                    <span>{{scope.row.num}}</span>
                </template>
                <template #price="scope">
                    <span>{{(scope.row.price/100).toFixed(2)}}</span>
                </template>
                <template #sumAmount="scope">
                    <span>{{(scope.row.sumAmount/100).toFixed(2)}}</span>
                </template>
                <template #orderdiscountAmount="scope">
                    <span>{{(scope.row.discountAmount/100).toFixed(2)}}</span>
                </template>
                <template #orderpayAmount="scope">
                    <span>{{(scope.row.payAmount/100).toFixed(2)}}</span>
                </template>
                <template #freight="scope">
                    <span>{{(scope.row.freight/100).toFixed(2)}}</span>
                </template>
            </total-table>
        </div>
        <div class="orderinfo">
            <h2>优惠券使用详情</h2>

            <total-table :tHead="tHeadcoupon"
                         :tableData="tableCouponResultDto" :accountData="accountData">
            <!-- <template #couponCode="scope">
                    <p class='p_class'>商品编号：{{scope.row.commodityNumber}}</p>
                    <p class='p_class'>商品名称：{{scope.row.commodityName}}</p>
                </template>
                <template #orderNum="scope">
                    <span>{{scope.row.num}}</span>
                </template>
                <template #price="scope">
                    <span>{{(scope.row.price/100).toFixed(2)}}</span>
                </template>
                <template #sumAmount="scope">
                    <span>{{(scope.row.sumAmount/100).toFixed(2)}}</span>
                </template>
                <template #orderdiscountAmount="scope">
                    <span>{{(scope.row.discountAmount/100).toFixed(2)}}</span>
                </template>
                <template #orderpayAmount="scope">
                    <span>{{(scope.row.payAmount/100).toFixed(2)}}</span>
                </template>
                <template #freight="scope">
                    <span>{{(scope.row.freight/100).toFixed(2)}}</span>
                </template> -->
            </total-table>
        </div>
        <div class="orderinfo">
            <h2>退款申请详细</h2>
            <total-table :tHead="tHeadRefund"
                         :tableData="tableDataRefund" :accountData="accountData" >
                <template #goodsInformation="scope">
                    <p class='p_class'>商品编号：{{scope.row.commodityNumber}}</p>
                    <p class='p_class'>商品名称：{{scope.row.commodityName}}</p>
                </template>

                <template #refundsumAmount="scope">
                    <span>{{(scope.row.sumAmount/100).toFixed(2)}}</span>
                </template>
                <template #orderdiscountAmount="scope">
                    <span>{{(scope.row.discountAmount/100).toFixed(2)}}</span>
                </template>
                <template #refundOverdueDate="scope">
                    <span>{{(scope.row.payAmount/100).toFixed(2)}}</span>
                </template>
                <template #freight="scope">
                    <span>{{(scope.row.freight/100).toFixed(2)}}</span>
                </template>
                <template #isReturnFreight="scope">
                    <span>{{scope.row.isReturnFreight===1?'是':'否'}}</span>
                </template>

            </total-table>
        </div>
        <div class="orderinfo">
            <h2>补充凭证</h2>
            <el-row v-if="imglist.length>0">
                <el-col :span="6" v-for="item in imglist" :key="item">
                    <div class="img-box"><img :src="item" alt=""></div>
                </el-col>
            </el-row>
            <span v-else>无</span>
        </div>
        <div class="orderinfo" v-if="detail.videoList">
            <h2>订单视频</h2>
            <el-row>
                <el-col :span="12" v-for="item in detail.videoList" :key='item' >
                    <video
                        controls
                        :src="item" width="400">
                    </video>
                </el-col>
            </el-row>
        </div>
        <div class="orderinfo">
            <h2>审核处理</h2>

            <el-table :data="tableDataAudit" align="center" stripe  show-summary :summary-method="getSummaries"  :cell-style="changeCellStyle">

                <el-table-column prop="goodsInformation" label="商品信息" align="center" :show-overflow-tooltip="true">
                    <template v-slot="scope">
                        <p>商品编号：{{scope.row.commodityNumber}}</p>
                        <p class='p_class'>商品名称：{{scope.row.commodityName}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="商品单价(¥)" align="center">
                    <template v-slot="scope">
                        <span>{{(scope.row.price/100).toFixed(2)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="auditNum" label="申请商品退款数" align="center">
                    <template v-slot="scope">
                        <span>{{scope.row.num}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="approvalNumedit" label="审核后商品退款数" align="center">
                    <template v-slot="scope" class="input-approval">
                        <el-input v-model="scope.row.approvalNumedit"  placeholder="请输入～" @input="checknum(scope.row)" :disabled="detail.workStatus !== 0" style="color:red"/>
                    </template>
                </el-table-column>
                <el-table-column prop="freight" label="运费" align="center">
                    <template v-slot="scope">
                        <span>{{(scope.row.freight/100).toFixed(2)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isReturnFreight" label="是否退运费" align="center">
                    <template v-slot="scope">
                        <el-select v-model="scope.row.isReturnFreight" placeholder="请选择～" >
                            <el-option label="同意" :value="1"/>
                            <el-option label="拒绝" :value="2"/>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="surplus" label="退款优惠金额(¥)" align="center" >
                    <template v-slot="scope">
                        <span v-if="scope.row.edit === false" style="color:red">{{scope.row.surplus}}</span>
                        <el-input v-else v-model="scope.row.surplus"  :readonly="true" style="color:red"/>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="auditPayAmount" label="需退款金额(¥)" align="center" >
                    <template v-slot="scope">
                        <span v-if="scope.row.edit === false" style="color:red">{{scope.row.auditPayAmount}}</span>
                        <el-input v-else v-model="scope.row.auditPayAmount"  @change="checknumA(scope.row)" :readonly="true" style="color:red"/>
                    </template>
                </el-table-column> -->
                <el-table-column prop="payAmount" label="需退款金额(¥)" align="center" >
                    <template v-slot="scope">
                        <span v-if="scope.row.edit === false" style="color:red">{{detail.workStatus !== 0?(scope.row.payAmount/100).toFixed(2):'0.00'}}</span>
                        <el-input v-else v-model="scope.row.auditPayAmount"  @change="checknumA(scope.row)" :readonly="true" style="color:red"/>
                    </template>
                </el-table-column>
                <el-table-column prop="dealResult" label="处理结果" align="center" >
                    <!--  -->
                    <template v-slot="scope">
                        <el-select v-model="scope.row.dealResult" placeholder="请选择～" :disabled="detail.workStatus !== 0" v-if="detail.workStatus ===0">
                            <el-option label="同意" :value="2" v-if="scope.row.agree === true"/>
                            <el-option label="拒绝" :value="3" v-else/>
                        </el-select>
                        <el-select v-model="scope.row.dealResult" placeholder="请选择～" :disabled="detail.workStatus !== 0" v-else>
                            <el-option label="同意" :value="2"/>
                            <el-option label="拒绝" :value="3" />
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>

        </div>
        <template  v-if="detail.workStatus === 0" style="display:flex;justify-content:center;margin-top:25px">
            <span class="dialog-footer">
                <el-button @click="goBack">返回</el-button>
                <el-button type="primary" @click="submit" v-if="reasonSubmit === false" :disabled="reasonDis"
                >提交处理结果</el-button>
                <el-button type="primary" v-else  @click="submitC">提交处理结果</el-button>
            </span>
        </template>
        <!-- </el-dialog> -->
        <!-- 拒绝原因弹出框 -->
        <el-dialog
            v-model="dialogCancel"
            width="30%"
        >
            <el-form  ref="ruleFormRef"
                      :model="form"
                      :rules="rules"
                      class="demo-ruleForm">
                <el-form-item label="拒绝原因" prop="cancelReason">
                    <el-input v-model="form.cancelReason" autocomplete="off"  type="textarea"     maxlength="100"  show-word-limit
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogCancel = false">返回</el-button>
                    <el-button type="primary" @click="submitReason"
                    >提交</el-button
                    >
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import TotalTable from '@/composables/TablePagination/totalTable.vue'
import { refundDetail, approvalRefund } from '@/api/refund/index'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
const userInfo = JSON.parse(localStorage.getItem('userInfo'))
const route = useRoute()
const router = useRouter()
const tHeadOrder = [
    { tooltip: true, prop: 'goodsInformation', label: '商品信息', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'price', label: '商品单价(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'orderNum', label: '商品数量', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'sumAmount', label: '合计(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'orderdiscountAmount', label: '优惠金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'freight', label: '运费(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'orderpayAmount', label: '支付金额(¥)', minWidth: 100, slot: true }
]
const tHeadRefund = [
    { tooltip: true, prop: 'goodsInformation', label: '商品信息', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'refundPrice', label: '商品单价(¥)', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'num', label: '申请商品退款数', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'refundsumAmount', label: '合计(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'orderdiscountAmount', label: '优惠金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'freight', label: '运费(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'isReturnFreight', label: '是否退运费', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'refundOverdueDate', label: '申请退款金额(¥)', minWidth: 100, slot: true }

]
const tHeadcoupon = [
    { tooltip: true, prop: 'couponCode', label: '券编号', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'statusDesc', label: '状态', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'receiveTime', label: '领取时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'usedTime', label: '使用时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'isValidBeginTime', label: '生效时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'expiredTime', label: '过期时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'phoneMobile', label: '用户手机号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'couponAmount', label: '优惠金额(¥)', minWidth: 100 }

]
const tableDataOrder = ref([])
const tableCouponResultDto = ref([])
const tableDataAudit = ref([])
const tableDataRefund = ref([])
const imglist = ref([])
const dialogCancel = ref(false)
const reasonSubmit = ref(false)
const reasonDis = ref(false)

const props = defineProps({
    visible: {
        type: Boolean
    },
    orderNo: {
        type: String
    },
    iscon: {
        type: String
    }
})
// 商家类型
const merchantType = ref(
    {
        1: '柜主',
        2: '厂商',
        3: '批发商'
    }
)
// 客诉类型
const workTypeList = ref({
    1: '商品/包装破损',
    2: '商品变质',
    3: '订单金额有误',
    4: '手动补扣',
    5: '其他',
    6: '通知第三方出货消息推送失败',
    7: '第三方出货失败',
    8: '退运费',
    9: '商品质量问题',
    10: '少件（含缺少配件）',
    11: '发错货了',
    12: '发票问题',
    13: '不喜欢/不想要了',
    14: '价格问题',
    15: '未按预定时间发货',
    16: '快递一直没到',
    17: '快递没有跟踪记录',
    18: '货物破损已拒签',
    19: '商家服务态度太差'
})
const orderStatusList = ref({
    100: '待付款',
    200: '备餐中',
    300: '待配送',
    400: '待入柜',
    500: '待取货',
    600: '已完成 ',
    700: '退款成功',
    701: '退款处理中',
    702: '退款失败',
    800: '已取消',
    900: '异常订单'

})
const workStatusList = ref({
    0: '待处理',
    1: '已完成',
    2: '已取消'
})
const platformzList = {
    0: '恒生活APP',
    1: '恒生活Android',
    2: '恒生活iOS',
    3: '恒生活微信小程序',
    4: '恒生活支付宝小程序（未开通）',
    10: '恒掌柜Android',
    11: '恒掌柜IOS',
    20: '商家管理后台',
    21: '统一运营平台'
}
const detail = ref({})
const cancelReason = ref('')
const accountData = ref({})
const form = ref({
    cancelReason: ''
})
const rules = {
    cancelReason: [{ required: true, message: '请填写拒绝原因', trigger: 'blur' }]
}

onMounted(async () => {
    await getOrderDetail()
})
watch(() => tableDataAudit.value,
    (val) => {
        tableDataAudit.value.map(item => {
            if (item.dealResult === null || item.auditPayAmount === null || (item.approvalNumedit === '' && item.dealResult === null) || (Number(item.approvalNumedit) > item.num)) {
                reasonDis.value = true
            } else {
                reasonDis.value = false
            }
            if (Number(item.approvalNumedit) === 0 || item.approvalNumedit === '') {
                item.agree = false
            } else {
                item.agree = true
            }
            if (item.isReturnFreight === 1) {
                console.log(item.isReturnFreight, 'isReturnFreight')
                item.auditPayAmount = ((item.approvalNumedit * (item.price - (item.discountAmount / item.num)) / 100) + (item.freight / 100)).toFixed(2)
            } else {
                item.auditPayAmount = (item.approvalNumedit * (item.price - (item.discountAmount / item.num)) / 100).toFixed(2)
                console.log(item.auditPayAmount, 'isReturnFreight+12')
            }
        })
    },
    {
        deep: true
    })

// const dialogDetail = ref(props.visible)
const emit = defineEmits(['handleClose', 'fevent'])
const handleClose = () => {
    emit('handleClose', props.visible)
    emit('fevent')
}
// 详情
const getOrderDetail = async () => {
    const params = {
        id: props.orderNo,
        sign: '1eea6fa8-8236-4d06-bf33-7414bb02172d'
    }
    const data = await refundDetail(params)
    detail.value = data
    accountData.value = data
    imglist.value = data.refundVoucher ? data.refundVoucher.split(',') : []
    tableDataOrder.value = data.orderCommoditys
    tableCouponResultDto.value = data.userCouponResultDto ? data.userCouponResultDto : []
    tableDataRefund.value = data.refundCommoditys.map(item => {
        return {
            refundPrice: (item.price / 100).toFixed(2),
            ...item
        }
    })
    if (data.lastCommoditys.length > 0) {
        console.log(data.lastCommoditys.payAmount, 'lastCommoditys.payAmountlastCommoditys.payAmountlastCommoditys.payAmount')
        tableDataAudit.value = data.lastCommoditys.map(item => {
            return {
                auditPayAmount: (item.payAmount / 100).toFixed(2),
                edit: false,
                approvalNumedit: item.approvalNum,
                surplus: (item.discountAmount / 100).toFixed(2),
                ...item
            }
        })
    } else {
        tableDataAudit.value = data.refundCommoditys.map(item => {
            if (detail.value.workStatus !== 1) {
                return {
                    auditPayAmount: '0.00',
                    edit: false,
                    agree: false,
                    approvalNumedit: item.approvalNum ? item.approvalNum : '0',
                    surplus: '0.00',
                    ...item
                }
            } else {
                return {
                    auditPayAmount: (item.approvalNum * (item.price - (item.discountAmount / item.num)) / 100).toFixed(2),
                    edit: false,
                    agree: false,
                    approvalNumedit: item.approvalNum ? item.approvalNum : '0',
                    surplus: ((item.discountAmount / item.num) * item.approvalNum / 100).toFixed(2),
                    ...item
                }
            }
        })
    }
}

// 提交
const refundList = ref([])
// 拒绝list
const dealResultList = ref([])
const reasonlist = ref([])
// 判断拿到的list是否有拒绝
const getList = async () => {
    refundList.value = tableDataAudit.value.flat(Infinity).map((item, index) => {
        dealResultList.value.push(item.dealResult)
        if ((item.auditPayAmount === 0 && item.dealResult === 2) || (item.auditPayAmount === '' && item.dealResult === 2) || (item.approvalNumedit > item.num) || (Number(item.approvalNumedit) === 0 && item.dealResult === 2)) {
            return false
        } else {
            return {
                commodityNumber: item.commodityNumber,
                commodityName: item.commodityName,
                price: item.price,
                num: item.num,
                approvalNum: item.approvalNumedit,
                discountAmount: (item.surplus || 0) * 100,
                payAmount: (item.auditPayAmount || 0) * 100,
                dealResult: item.dealResult,
                freight: item.freight,
                isReturnFreight: item.isReturnFreight,
                skuOrderNo: item.skuOrderNo

            }
        }
    })
}
// 请求方法
const setList = async (refundList) => {
    const goodsList = refundList.map(el => {
        return {
            ...el,
            payAmount: el.payAmount || 0
        }
    })
    const params = {
        orderNumber: detail.value.orderNumber,
        workNumber: detail.value.workNumber,
        remark: cancelReason.value || null,
        sign: '1eea6fa8-8236-4d06-bf33-7414bb02172d',
        commodityList: goodsList,
        dealId: userInfo.id,
        dealName: userInfo.name
    }
    const code = await approvalRefund(params)
    if (code === 200) {
        ElMessage.success('成功')
        getOrderDetail()
    }
}
const submit = async () => {
    if (detail.value.workStatus === 2) {
        return ElMessageBox.alert('该订单已被用户取消退款，无需继续操作！', {
            confirmButtonText: '确认',
            callback: (action) => { }
        })
    } else {
        await getList()
        if (!dealResultList.value.includes(2) && !refundList.value.includes(false)) {
            dialogCancel.value = true
            reasonlist.value = refundList.value
        } else if (refundList.value.includes(false)) {
            return ElMessageBox.alert('若审核确认无需退款，处理结果请选择‘拒绝’！', {
                confirmButtonText: '确认',
                callback: (action) => { }
            })
        } else {
            setList(refundList.value)
            // emit('handleClose', props.visible)
            // emit('fevent')
            // router.go(-1)
        }
    }
}
const submitC = async () => {
    await setList(reasonlist.value)
    // emit('handleClose', props.visible)
    // emit('fevent')
    // router.go(-1)
}
const ruleFormRef = ref(null)
const submitReason = async () => {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            cancelReason.value = form.value.cancelReason
            reasonSubmit.value = true
            dialogCancel.value = false
        }
    })
}

// 校验输入最大值

const checknum = (row) => {
    // reasonDis.value = true
    row.dealResult = null
    if (Number(row.approvalNumedit) > row.num) {
        ElMessage.error('不得超过申请商品退款数量')
        row.edit = false
    } else {
        row.edit = true
        console.log(row.isReturnFreight, 'isReturnFreight，lkluys')
        if (row.isReturnFreight === 1) {
            row.auditPayAmount = ((row.approvalNumedit * (row.price - (row.discountAmount / row.num)) / 100) + (row.freight / 100)).toFixed(2)
        } else {
            row.auditPayAmount = (row.approvalNumedit * ((row.price - (row.discountAmount / row.num))) / 100).toFixed(2)
        }

        row.surplus = ((row.discountAmount / row.num) * row.approvalNumedit / 100).toFixed(2)
    }
}

const getSummaries = (param) => {
    const { columns, data } = param
    const sums = []
    columns.forEach((column, index) => {
        // column 是每一列，index 表示列的索引，第一列的时候不计算合计，显示自定义的文字内容
        if (index === 0) {
            sums[index] = '总计'
            return
        }
        if (index === 3) {
            const values = data.map(item => Number(item[column.property]))
            if (!values.every(value => isNaN(value))) {
                sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr)
                    if (!isNaN(value)) {
                        return prev + curr
                    } else {
                        return prev
                    }
                }, 0)
            }
            return
        }
        switch (column.property) {
        // 申请退款商品数量
        case 'auditNum':
            sums[index] = detail.value.refundComNum
            break

            // 不需要计算合计的列就展示‘--’
        default:
            sums[index] = '--'
            break
        }
        const editT = data.map(item => item.edit)
        if (editT.includes(true)) {
            if (index === 4 || index === 2) {
                const values = data.map(item => Number(item[column.property]))
                if (!values.every(value => isNaN(value))) {
                    const numacount = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            const num = prev + curr
                            return num
                        } else {
                            return prev
                        }
                    }, 0)
                    sums[index] = (numacount / 100).toFixed(2)
                }
            } else {
                sums[index] = '--'
            }
        } else {
            switch (column.property) {
            // 申请退款商品数量
            case 'auditNum':
                sums[index] = detail.value.refundComNum
                break
            // 实际退款商品数量总计
            case 'approvalNumedit':
                sums[index] = detail.value.realComNum
                break
            // 实际退款优惠金额总计
            case 'surplus':
                sums[index] = (detail.value.realRefundDisAmount / 100).toFixed(2)
                break
            // 实际退款支付金额总计
            case 'payAmount':
                sums[index] = (detail.value.realRefundAmount / 100).toFixed(2)
                break

            // 不需要计算合计的列就展示‘--’
            default:
                sums[index] = '--'
                break
            }
        }
    })
    return sums
}
const changeCellStyle = ({ row, column, rowIndex, columnIndex }) => {
    if (columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
        return {
            color: 'red'
        }
    } else {
        return ''
    }
}

const goBack = () => {
    router.go(-1)
    // window.close()
}
</script>
<style lang="scss" scoped>
.work-order-container{
    .height-p{
        line-height:40px;
    }
    h2{
        line-height:50px;
    }
    .info-detail{
        // display: flex;
        span{
            color: red;
        }
    }
    .orderinfo{
        margin-top:40px
    }

    :deep(.el-input .el-input__inner) {
        color:red;
        text-align: center
    }
    :deep(.el-table .el-table__footer-wrapper .cell){
        font-weight: 600;
        color: red;
    }
    .p_class{
    overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
    }

    .img-box{
        img{
            display:block;
            width:150px;
        }
    }
}
</style>
