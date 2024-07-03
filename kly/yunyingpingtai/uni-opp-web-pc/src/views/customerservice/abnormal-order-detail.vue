<template>
    <div class="work-order-container">
        <div class="gongdaninfo">
            <h2>设备信息</h2>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">订单编号：{{detail.orderNo}}</div></el-col>
                <el-col :span="8"><div class="height-p">OA订单号：{{detail.applyCode}}</div></el-col>
                <el-col :span="8"><div class="height-p">用户手机号：{{detail.userMobile}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">发起时间：{{detail.workStartTime}}</div></el-col>
                <el-col :span="8"><div class="height-p">完结时间：{{detail.workEndTime}}</div></el-col>
                <el-col :span="8"><div class="height-p">工单状态：{{detail.workStatus === 0?'待处理':detail.workStatus === 1?'已完成':'已取消'}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8" v-if="props.iscon === '1'"><div class="height-p">异常标签：{{detail.exceptionLabelDesc}}</div></el-col>

                <!-- <el-col :span="8"><div class="height-p">订单标签：{{detail.orderLevel}}</div></el-col> -->
                <el-col :span="8"><div class="height-p">处理人：{{detail.dealName}}</div></el-col>
                <el-col :span="8"><div class="height-p">客户端类型：{{platformzList[detail.platform]}}</div></el-col>
            </el-row>
            <!-- <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">
                        处理结果：
                        <span v-if="detail.dealResult === 2">有退款</span>
                        <span v-if="detail.dealResult === 3">用户取消退款</span>
                        <span v-if="detail.dealResult === 0">待处理</span>
                        <span v-if="detail.dealResult === 1">拒绝退款</span>
                    </div></el-col>
            </el-row> -->

        </div>
        <div class="orderinfo">
            <h2>订单详情</h2>

            <total-table :tHead="tHeadOrder"
                         :tableData="tableDataOrder" :accountData="accountData">
                <template #goodsInformation="scope">
                    <p class='p_class'>商品编号：{{scope.row.commodityNumber}}</p>
                    <p class='p_class'>商品名称：{{scope.row.commodityName}}</p>
                </template>
                <template #realPrice="scope">
                    <span>{{(scope.row.realPrice/100).toFixed(2)}}</span>
                </template>
                <template #num="scope">
                    <span>{{scope.row.num}}</span>
                </template>
                <template #skuAmount="scope">
                    <span>{{(scope.row.skuAmount/100).toFixed(2)}}</span>
                </template>
                <template #disctAmount="scope">
                    <span>{{(scope.row.totalDisctAmount/100).toFixed(2)}}</span>
                </template>
                <template #orderpayAmount="scope">
                    <span>{{(scope.row.payAmount/100).toFixed(2)}}</span>
                </template>
            </total-table>
        </div>
        <div class="orderinfo" v-if="detail.videoUrl">
            <h2>订单视频</h2>
            <el-row>
                <el-col :span="12" v-for="item in detail.videoUrl" :key='item' >
                    <video
                        controls
                        :src="item" width="400">
                    </video>
                </el-col>
            </el-row>
        </div>
        <!-- <div class="orderinfo" v-if="detail.videoUrl"> -->
        <div class="orderinfo">
            <h2>视频情况</h2>
            <el-form ref="ruleFormRef" :inline="true" :model="resultdata" :rules="rules" label-position="right" label-width="150px">
                <el-form-item label="一级视频" prop="videoinfo" style="width: 45%">
                    <el-select v-model="resultdata.videoinfo" @change="videoinfo(resultdata.videoinfo)" :rules = rules.videoinfo :disabled="detail.workStatus !== 0" class="select" placeholder="选择视频情况">
                        <el-option
                            v-for="item in options1"
                            :key="item.type"
                            :label="item.name"
                            :value="item.type"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="二级视频" prop="videoinfodesc" style="width: 45%">
                    <el-select v-model="resultdata.videoinfodesc" class="select" :rules = rules.secondvideo :disabled="detail.workStatus !== 0" placeholder="选择视频情况">
                        <el-option
                            v-for="item in options2"
                            :key="item.type"
                            :label="item.name"
                            :value="item.type"
                        />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="" prop="discernInfo" style="width: 100%">
                    <h2>补扣款单备注</h2>
                    <el-input style="width: 100%;" v-model="resultdata.discernInfo" :rules = rules.desc type="textarea" :disabled="detail.workStatus !== 0" placeholder="必须备注补扣款原因，描述商品名称、价格、数量等相关信息；" />
                </el-form-item>
                <div class="orderinfo">
                    <h3>原订单合计：<span>{{(detail.totalAmount/100).toFixed(2)}}元</span><span v-if="detail.deductDetail" style="color:red;padding-left:50px">补扣金额：{{(detail.deductDetail.deductAmount/100).toFixed(2)}}元</span></h3>
                </div>
                <div class="orderinfo makeup" v-if="detail.workStatus !== 0">
                    <div>
                        <span class="text">是否创建补扣款工单：</span>
                        <el-radio-group v-model="detail.existDeduct" :disabled="detail.workStatus !== 0" >
                            <el-radio :label="0" disabled>否</el-radio>
                            <el-radio :label="1" disabled>是</el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div class="orderinfo makeup" v-else>
                    <div v-if="resultdata.radio">需补扣：
                        <el-form-item label="" prop="price" style="width: 45%">
                            <el-input-number v-model="resultdata.price" :rules = rules.price controls-position="right" :min="0"></el-input-number>
                        </el-form-item> 元</div>
                    <div>
                        <span class="text">是否创建补扣款工单：</span>
                        <el-radio-group v-model="resultdata.radio">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </div>
                </div> -->
                <el-tabs type="border-card" class="demo-tabs" v-model="activeName">
                    <el-tab-pane label="商品看的清" name="goods">
                        <!-- <table-grid :goodList="goodList"></table-grid> -->
                        <div class="mine-container">
                            <div class="search-area">
                                <el-form ref="formRef" :model="searchData" label-position="right" label-width="100px" :inline="true">
                                    <el-form-item label="商品名称" prop="skuName">
                                        <el-input v-model="searchData.skuName" placeholder="请输入商品名称" clearable  :disabled="detail.workStatus !== 0" />
                                    </el-form-item>
                                    <el-form-item label="69码" prop="barcodes">
                                        <el-input v-model="searchData.barcodes" placeholder="请输入条形码" clearable  :disabled="detail.workStatus !== 0" />
                                    </el-form-item>
                                    <el-form-item class="button-box">
                                        <el-button type="primary" @click="searchCoupon()"  :disabled="detail.workStatus !== 0" >
                                            搜索商品
                                        </el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="tableList-area">
                                <el-checkbox-group
                                    v-model="checkedIds"
                                    @change="handlecheckedIdsChange"
                                >
                                    <el-checkbox-button v-for="item in tableData" :key="item.skuId" :label="item"  class="goods-box"  :disabled="detail.workStatus !== 0" >
                                        <div>
                                            <div class="img-box">
                                                <img :src="item.thumbnail ? item.thumbnail : './img/1.jpg'" :key="item.skuId" class="goods-img">
                                            </div>
                                            <div class="goods-title">{{item.skuName}}</div>
                                            <div class="goods-title">￥{{item.salePrice}}</div>
                                        </div>
                                    </el-checkbox-button>
                                </el-checkbox-group>

                            </div>
                            <div class="page-box">
                                <el-pagination
                                    v-if="showPage"
                                    @size-change="sizeChange"
                                    @current-change="currentChange"
                                    :current-page="pageinfo.currentPage"
                                    :page-size="pageinfo.pageSize"
                                    :page-sizes="pageinfo.pageSizes"
                                    :layout="pageinfo.layout"
                                    :total="pageinfo.total"
                                ></el-pagination>
                            </div>
                            <div v-if="shibieList.length">
                                <h2>识别明细</h2>
                                <system-list
                                    :tHead="tHead"
                                    :tableData="shibieList"
                                    :isPage="false"
                                    v-model:current-page="pageinfo.currentPage"
                                    v-model:page-size="pageinfo.pageSize"
                                    :total="shibieList.length"
                                    @size-change="sizeChange"
                                    @current-change="currentChange"
                                >
                                    <template #skuPrice="scope">
                                        ¥{{(scope.row.skuPrice / 100).toFixed(2)}}
                                    </template>
                                    <template #quantity="scope">
                                        {{scope.row.quantity}}
                                    </template>
                                    <template #opbtn="scope">
                                        <el-button type="primary" @click="add(scope.row)" text :disabled="detail.workStatus !== 0" >
                                            <el-icon><CirclePlus /></el-icon>
                                        </el-button>
                                        <el-button type="primary" @click="delate(scope.row, scope.index)" text :disabled="detail.workStatus !== 0" >
                                            <el-icon><Minus /></el-icon>
                                        </el-button>
                                    </template>
                                </system-list>
                            </div>
                            <template v-if="!showPage">
                                <el-empty description="暂无数据" />
                            </template>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="商品看不清" name="goodsReason">
                        <!-- <no-goods :info="detail" ></no-goods> -->
                        <el-form-item label="" prop="discernInfo" style="width: 100%">
                            <h2>补扣款单备注</h2>
                            <el-input style="width: 100%;" v-model="resultdata.discernInfo" :rules = rules.desc type="textarea" :disabled="detail.workStatus !== 0" placeholder="必须备注补扣款原因，描述商品名称、价格、数量等相关信息；" />
                        </el-form-item>
                        <!-- <div class="orderinfo">
                            <h3>原订单合计：<span>{{(detail.totalAmount/100).toFixed(2)}}元</span><span v-if="detail.deductDetail" style="color:red;padding-left:50px">补扣金额：{{(detail.deductDetail.deductAmount/100).toFixed(2)}}元</span></h3>
                        </div> -->
                        <div class="orderinfo makeup" v-if="detail.workStatus !== 0">
                            <!-- <div>需补扣：<el-input v-model="resultdata.price" style="width: 45%"></el-input> 元</div> -->
                            <div>
                                <span class="text">是否创建补扣款工单：</span>
                                <el-radio-group v-model="detail.existDeduct" :disabled="detail.workStatus !== 0" >
                                    <el-radio :label="0" disabled>否</el-radio>
                                    <el-radio :label="1" disabled>是</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                        <div class="orderinfo makeup" v-else>
                            <!-- <div v-if="resultdata.radio">需补扣：<el-input v-model="resultdata.price" :rules = rules.price style="width: 45%"></el-input> 元</div> -->
                            <div v-if="resultdata.radio">调整为：
                                <el-form-item label="" prop="price" style="width: 45%">
                                    <el-input-number v-model="resultdata.price" :rules = rules.price controls-position="right" :min="0"></el-input-number>
                                </el-form-item> 元</div>
                            <div>
                                <span class="text">是否创建补扣款工单：</span>
                                <el-radio-group v-model="resultdata.radio">
                                    <el-radio :label="0">否</el-radio>
                                    <el-radio :label="1">是</el-radio>
                                </el-radio-group>
                            </div>
                        </div>
                    </el-tab-pane>
                    <div v-if="accountData.workStatus===0">
                        <p>
                            <span>原订单金额：{{accountData.totalAmount?((accountData.totalAmount/100).toFixed(2)):'0'}}元；</span>
                            <span>调整后：{{activeName==='goodsReason'?resultdata.price:reviewOrder.amount}}元；</span>
                            <!-- <span>优惠券：{{}}元</span> -->
                        </p>
                        <p>
                            <span>原订单共：{{accountData.totalQuantity??'0'}}件；</span>
                            <span v-if="activeName === 'goods'">调整后共：{{reviewOrder.count}}件；</span>
                            <span v-if="activeName==='goodsReason'">
                                <span v-if="reviewOrder.nowTypeGoodsReason===1">需补扣：<span style="color:red">{{reviewOrder.differenceGoodsReason}}</span>元；</span>
                                <span v-if="reviewOrder.nowTypeGoodsReason===2">需退款：<span style="color:red">{{reviewOrder.differenceGoodsReason}}</span>元；</span>
                            </span>
                            <span v-else-if="activeName === 'goods'">
                                <span v-if="reviewOrder.nowType===1">需补扣：<span style="color:red">{{reviewOrder.difference}}</span>元；</span>
                                <span v-if="reviewOrder.nowType===2">需退款：<span style="color:red">{{reviewOrder.difference}}</span>元；</span>
                            </span>
                        </p>
                    </div>
                    <div v-else-if="accountData.workStatus===1||accountData.workStatus===2">
                        <p>
                            <span>原订单金额：{{accountData.totalAmount?((accountData.totalAmount/100).toFixed(2)):'0'}}元；</span>
                            <span>调整后：{{accountData.deductDetail?.auditAmount?(accountData.deductDetail.auditAmount/100).toFixed(2):'0'}}元；</span>
                            <!-- <span>优惠券：{{}}元</span> -->
                        </p>
                        <p>
                            <span>原订单共：{{accountData.totalQuantity??'0'}}件；</span>
                            <span>调整后共：{{accountData.auditQuantity??'0'}}件；</span>
                            <span v-if="accountData.deductDetail?.handleType===1">需补扣：<span style="color:red">{{accountData.deductDetail.deductAmount?((accountData.deductDetail.deductAmount/100).toFixed(2)):'0'}}</span>元；</span>
                            <span v-if="accountData.deductDetail?.handleType===2">需退款：<span style="color:red">{{accountData.deductDetail.refundAmount?((accountData.deductDetail.refundAmount/100).toFixed(2)):'0'}}</span>元</span>
                        </p>
                    </div>
                </el-tabs>
            </el-form>
        </div>
        <template  v-if="detail.workStatus === 0" style="display:flex;justify-content:center;margin-top:25px">
            <span class="dialog-footer">
                <el-button @click="goBack">返回</el-button>
                <el-button type="primary" @click="submit(ruleFormRef)" v-if="reasonSubmit === false" :disabled="reasonDis"
                >提交处理结果</el-button>
                <el-button type="primary" v-else  @click="submitC">提交处理结果</el-button>
            </span>
        </template>
        <!-- </el-dialog> -->
        <!-- 确认弹出框 -->
        <el-dialog
            v-model="dialogCancel"
            width="30%"
        >
            <div style="font-size: 20px">是否确认提交异常订单处理结果？</div>
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
import { ref, onMounted, watch, toRefs, reactive } from 'vue'
import TotalTable from '@/composables/TablePagination/totalTable.vue'
import SystemList from '@/composables/TablePagination/index.vue'
// import tableGrid from './comments/table.vue'
// import noGoods from './comments/noGoods.vue'
import { approvalRefund, abnormalDetail, videoList, makeupList } from '@/api/refund/index'
import { getMerchantListCode } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
const userInfo = JSON.parse(localStorage.getItem('userInfo'))
const route = useRoute()
const router = useRouter()
const tHeadOrder = [
    { tooltip: true, prop: 'goodsInformation', label: '商品信息', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'realPrice', label: '商品单价(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'num', label: '商品数量', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'skuAmount', label: '合计(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'disctAmount', label: '优惠金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'orderpayAmount', label: '支付金额(¥)', minWidth: 100, slot: true }
]
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
const activeName = ref('goods')
const goodList = ref([])
const tableDataOrder = ref([])
const tableDataAudit = ref([])
const imglist = ref([])
const dialogCancel = ref(false)
const reasonSubmit = ref(false)
const reasonDis = ref(false)
const checkAll = ref(false)
const isIndeterminate = ref(false)
const checkedIds = ref([])
const IDs = []
const showPage = ref(false)
const shibieList = ref([])
const reviewOrder = reactive({
    amount: 0,
    count: 0,
    difference: 0,
    differenceGoodsReason: 0,
    nowType: 1,
    nowTypeGoodsReason: 1
})
const resultdata = ref({
    videoinfo: '',
    videoinfodesc: '',
    discernInfo: '',
    price: 0,
    radio: 0
})
watch(
    () => shibieList.value,
    (value) => {
        reviewOrder.amount = 0
        reviewOrder.count = 0
        value.map((item) => {
            reviewOrder.amount += item.skuPrice * item.quantity
            reviewOrder.count += item.quantity
        })
        if (activeName.value === 'goodsReason') {
            reviewOrder.difference = Math.abs((accountData.value.totalAmount - resultdata.value.price).toFixed(2))
        } else if (activeName.value === 'goods') {
            reviewOrder.difference = Math.abs((accountData.value.totalAmount - reviewOrder.amount).toFixed(2))
        }
        reviewOrder.amount = Number((reviewOrder.amount / 100).toFixed(2))
        reviewOrder.difference = Number((reviewOrder.difference / 100).toFixed(2))
        const acL = Number((accountData.value.totalAmount / 100).toFixed(2))
        if (acL < reviewOrder.amount) {
            reviewOrder.nowType = 1
        } else if (acL > reviewOrder.amount) {
            reviewOrder.nowType = 2
        }
    },
    {
        deep: true
    }
)
watch(
    () => resultdata.value,
    (value) => {
        reviewOrder.differenceGoodsReason = Math.abs((accountData.value.totalAmount - resultdata.value.price * 100).toFixed(2))
        reviewOrder.differenceGoodsReason = (reviewOrder.differenceGoodsReason / 100).toFixed(2)
        const acL = Number((accountData.value.totalAmount / 100).toFixed(2))
        if (acL < Number(resultdata.value.price)) {
            reviewOrder.nowTypeGoodsReason = 1
        } else if (acL > Number(resultdata.value.price)) {
            reviewOrder.nowTypeGoodsReason = 2
        }
    },
    {
        deep: true
    }
)
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

const detail = ref({})
const cancelReason = ref('')
const accountData = ref({})
const form = ref({
    cancelReason: ''
})
const ruleForm = {
    dictType: ''
}
const deviceInfo = ref({})
const tableData = ref([])
const tHead = [
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'skuPrice', label: '单价', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'quantity', label: '数量', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'opbtn', label: '操作', minWidth: 100, slot: true }
]
const rules = {
    videoinfo: [{ required: true, message: '请选择视频情况', trigger: 'blur' }],
    videoinfodesc: [{ required: true, message: '请选择视频情况', trigger: 'blur' }],
    discernInfo: [{ required: true, message: '请填写补扣款单备注', trigger: 'blur' }],
    price: [{ required: true, message: '请填写补扣金额', trigger: 'blur' }]
}

const dataState = reactive({
    searchData: {
        skuName: '',
        barcodes: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50],
        layout: 'total, sizes, prev, pager, next, jumper'
    }
})
const { searchData, pageinfo } = toRefs(dataState)
onMounted(async () => {
    await getOrderDetail()
    await videoTitle()
    await getGoodsList()
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

const emit = defineEmits(['handleClose', 'fevent'])
const handleClose = () => {
    emit('handleClose', props.visible)
    emit('fevent')
}
// const abnormaloptions = ref([])
// const abnorLabel = async () => {
//     const { data } = await abnormalSelect({ searchType: 1 })
//     abnormaloptions.value = data
// }
// 视频联动
const options1 = ref([])
const options2 = ref([])
const videoTitle = async () => {
    const params = {
        searchType: 3,
        parentType: 0
    }
    const { data } = await videoList(params)
    options1.value = data
}
const videoinfo = async (type) => {
    const params = {
        searchType: 4,
        parentType: type
    }
    const { data } = await videoList(params)
    options2.value = data
}
// 详情
const unrealData = ref([])
const goodsList = ref([])
const getOrderDetail = async () => {
    const abnormaloptions = ref([])
    const params = {
        workNumber: props.orderNo
    }
    const { data } = await abnormalDetail(params)
    console.log(data, 'getOrderDetailgetOrderDetail')
    // activeName.value =
    deviceInfo.value = data.deviceInfo
    detail.value = data
    accountData.value = data
    unrealData.value = data.deductDetail ? data.deductDetail.goodsDetails : []
    // unrealData.value = data.deductDetail.discernInfo
    imglist.value = data.refundVoucher ? data.refundVoucher.split(',') : []
    tableDataOrder.value = data.orderGoodsVO
    resultdata.value.videoinfo = detail.value.videoFirstType
    resultdata.value.videoinfodesc = detail.value.videoSecondType
    goodsList.value = data.orderGoodsVO
    resultdata.value.discernInfo = detail.value.discernInfo ? detail.value.discernInfo : ''
    shibieList.value = detail.value.deductDetail ? detail.value.deductDetail.goodsList : []
    videoinfo(detail.value.videoFirstType)
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
                discountAmount: item.surplus * 100,
                payAmount: item.auditPayAmount * 100,
                dealResult: item.dealResult,
                freight: item.freight,
                isReturnFreight: item.isReturnFreight,
                skuOrderNo: item.skuOrderNo

            }
        }
    })
}
const submit = async (formEl) => {
    console.log(detail.value.platform, '11')
    if (activeName.value === 'goodsReason') {
        if (!formEl) return
        await formEl.validate(async (valid, fields) => {
            if (valid) {
                dialogCancel.value = true
            }
        })
    } else {
        dialogCancel.value = true
    }
}
// 乘法精度计算
const accMul = (arg1, arg2) => {
    let max = 0
    const s1 = arg1.toString()
    const s2 = arg2.toString()
    try { max += s1.split('.')[1].length } catch (e) { }
    try { max += s2.split('.')[1].length } catch (e) { }
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, max)
}
const submitC = async () => {
    // await setList(reasonlist.value)
    // emit('handleClose', props.visible)
    // emit('fevent')
    dialogCancel.value = true
    // router.go(-1)
}
const ruleFormRef = ref(null)
const submitReason = async () => {
    dialogCancel.value = false
    const goodobj = ref({
        skuName: '',
        skuCode: '',
        skuBrand: '',
        skuThirdCid: '',
        skuUrl: '',
        skuPrice: '',
        quantity: ''
    })
    if (resultdata.value.radio) {
        goodobj.value.skuName = '补扣款专用'
        goodobj.value.skuCode = '220000000000'
        goodobj.value.skuBrand = ''
        goodobj.value.skuThirdCid = ''
        goodobj.value.skuUrl = 'https://hsh-goods-prod-1309143854.cos.ap-beijing.myqcloud.com/78444488-236d-4e66-ad68-8f1c1b14ff3a_120*120.jpg'
        goodobj.value.skuPrice = resultdata.value.price * 100
        goodobj.value.quantity = 1
    }

    const params = {
        workNumber: props.orderNo,
        // createDeductFlag: resultdata.value.radio,
        totalAmount: detail.value.totalAmount,
        // deductAmount: Number(resultdata.value.price) * 100,
        dealId: userInfo.id,
        dealName: userInfo.name,
        videoFirstType: resultdata.value.videoinfo,
        videoSecondType: resultdata.value.videoinfodesc,
        discernInfo: resultdata.value.discernInfo,
        creatorId: detail.value.dealId // ,
        // platform: detail.value.platform || '21'
        // goodsInfo: resultdata.value.radio ? goodobj.value : null
    }
    if (activeName.value === 'goods') {
        params.handleType = reviewOrder.nowType
        params.auditAmount = accMul(reviewOrder.amount, 100)
        if (reviewOrder.nowType === 1) {
            params.deductAmount = accMul(reviewOrder.difference, 100)
        }
        if (reviewOrder.nowType === 2) {
            params.refundAmount = accMul(reviewOrder.difference, 100)
            if (accountData.value.payAmount < params.refundAmount) {
                ElMessage.error('退款金额不可大于实付金额')
                return
            }
        }
        params.videoVisibleFlag = 1
        params.goodsInfoList = shibieList.value.map(item => {
            item.skuPrice = accMul(item.salePrice, 100)
            item.skuCode = item.skuId
            item.skuUrl = item.thumbnail
            return {
                ...item
            }
        })
        // params.deductAmount = shibieList.value.reduce((total, item) => {
        //     return total + (item.skuPrice * item.quantity)
        // }, 0)
        console.log(params.deductAmount, 'params.deductAmount')
        params.createDeductFlag = shibieList.value.length ? 1 : 0
    }
    if (activeName.value === 'goodsReason') {
        params.handleType = reviewOrder.nowTypeGoodsReason
        params.auditAmount = accMul(resultdata.value.price, 100)
        if (reviewOrder.nowTypeGoodsReason === 1) {
            params.deductAmount = accMul(reviewOrder.differenceGoodsReason, 100)
        }
        if (reviewOrder.nowTypeGoodsReason === 2) {
            params.refundAmount = accMul(reviewOrder.differenceGoodsReason, 100)
            if (accountData.value.payAmount < params.refundAmount) {
                ElMessage.error('退款金额不可大于实付金额')
                return
            }
        }
        params.videoVisibleFlag = 0
        params.createDeductFlag = resultdata.value.radio
        params.goodsInfo = resultdata.value.radio ? goodobj.value : null
        // params.goodsInfoList = shibieList.value.map(item => {
        //     item.skuPrice = item.salePrice * 100
        //     item.skuCode = item.skuId
        //     item.skuUrl = item.thumbnail
        //     return {
        //         ...item
        //     }
        // })
    }
    await makeupList(params)
    ElMessage.success('补扣单创建成功')
    if (props.iscon === '1') {
        router.push({ name: 'abnormal-order-list' })
    } else {
        router.push({ name: 'order-search-tool' })
    }
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
const handlecheckedIdsChange = (value) => {
    let checkGoodsIds = []
    if (shibieList.value.length) {
        const checkGoods = shibieList.value.reduce((total, el) => {
            if (el.quantity > 0) {
                total.push(el)
            }
            return total
        }, [])
        checkGoodsIds = checkGoods.length ? checkGoods.map(el => el.skuId) : []
    }
    shibieList.value = checkedIds.value.map(el => {
        let quantity = 1
        if (checkGoodsIds.includes(el.skuId)) {
            const ind = checkGoodsIds.indexOf(el.skuId)
            quantity = shibieList.value[ind].quantity
        }
        return {
            skuPrice: el.salePrice * 100,
            quantity: quantity,
            ...el
        }
    })
}
// 列表数据
const getGoodsList = async () => {
    const params = {
        appKey: 'A1001001', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        configCode: 'UC15115376423575552',
        name: 'sku通用查询接口V2',
        source: '商品中台',
        body: {
            appKey: 'A1001001', // 系统编号
            busiCode: 'A1001002', // 业务线编号
            skuStatus: [4],
            channelTypes: [-1],
            searchSpuGoods: 1,
            secondChannelIds: [deviceInfo.value.deviceNo],
            skuName: dataState.searchData.skuName,
            barcodes: dataState.searchData.barcodes.split(',') || [],
            pageNo: dataState.pageinfo.currentPage,
            pageSize: dataState.pageinfo.pageSize
        }
    }
    checkAll.value = false
    const res = await getMerchantListCode(params)
    console.log(res, 'res')
    if (res.code === '200') {
        tableData.value = res.data.list
        dataState.pageinfo.total = res.data.total
        dataState.pageinfo.total > 0 ? showPage.value = true : showPage.value = false
    }
}
// 添加
const add = (row) => {
    row.quantity++
}
const delate = (row, index) => {
    if (row.quantity > 0) {
        row.quantity--
    }
    if (row.quantity === 0) {
        shibieList.value.splice(index, 1)
        checkedIds.value.splice(index, 1)
    }
}
// 查询
const searchCoupon = () => {
    dataState.pageinfo.currentPage = 1
    getGoodsList()
}
// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currentPage = val
    getGoodsList()
}
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getGoodsList()
}
const goBack = () => {
    // router.go(-1)
    window.close()
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
    .orderinfo{
        margin-top:40px;
        .videoinfo{
            display: flex;
            .leftinfo{
                :deep(.el-select){
                    width: 450px;
                }
                width: 40%;
                .select{
                    width: 450px;
                    height: 100px;
                }
            }
            .rightinfo{
                width: 60%;
                .el-row{
                    margin-bottom: 20px;
                }
                .select{
                    width: 450px;
                }
            }
        }
    }
    .makeup{
        font-size: 18px;
        font-weight: bold;
        display: flex;
        margin-bottom: 50px;
        .text{
            color: red;
        }
    }
    :deep(.el-textarea__inner){
        height: 100px;
    }
    :deep(.el-input .el-input__inner) {
        color:red;
        text-align: center
    }
    :deep(.el-table .el-table__footer-wrapper .cell){
        font-weight: 600;
        color: red;
    }
    :deep(.el-select .select-trigger){
        width: 450px;
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
    .mine-container{
    :deep(.el-checkbox-button) {
        margin: 20px 40px 0 0;
    }
    :deep(.el-checkbox-button) {
        --el-checkbox-button-checked-bg-color: #fff;
        --el-checkbox-button-checked-text-color: #409eff;
        --el-checkbox-button-checked-border-color: #409eff;
    }
    :deep(.el-checkbox-button__inner) {
        border: none;
        text-align: left;
    }
    :deep(.el-checkbox-button:first-child .el-checkbox-button__inner) {
        // border: none;
    }
    :deep(.is-checked .el-checkbox-button__inner) {
        border: 1px solid #409eff;
    }
    .tableList-area{
        display: flex;
        justify-content: flex-start;
        .goods-box{
        width: 230px;
        .img-box{
            text-align: center;
            padding-bottom: 5px;
            height: 130px;
            .goods-img{
                height: 120px;
                margin: 0 auto;
            }
        }

        .goods-title{
            width: 230px;
            font-size: 14px;
            color: #222;
            padding-bottom: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;/*内容超宽后禁止换行显示*/
            text-align: center;
        }
        .goods-code{
            font-size: 12px;
            color: #B0B0B0;
            padding-bottom: 10px;
        }
        .bottom{
            display: flex;
            .goods-price{
                font-size: 14px;
                color: #FE7E41;
                padding-bottom: 10px;
                width: 100px;
            }
            .handle{
                flex: 1;
                .handle-btn{
                    display: inline-block;
                    margin-right: 5px;
                    font-size: 12px;
                    color: #328EED;
                }
            }
        }
    }
    }

    .page-box {
        display: flex;
        margin-top: 24px;
    }
 }
}
</style>
