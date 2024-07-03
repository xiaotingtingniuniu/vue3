<template>
    <div class="work-order-container">
        <div class="orderinfo" v-if="videoList">
            <h2>订单视频</h2>
            <el-row>
                <el-col :span="12" v-for="item in videoList" :key="item">
                    <video controls :src="item" width="400"></video>
                </el-col>
            </el-row>
        </div>
        <div class="orderinfo">
            <el-form ref="ruleFormRef" :inline="true" :model="resultdata" :rules="rules" label-position="right" label-width="150px">
                <el-tabs type="border-card" class="demo-tabs" v-model="activeName">
                    <el-tab-pane label="商品看的清" name="goods">
                        <div class="mine-container">
                            <div class="search-area">
                                <el-form ref="formRef" :model="searchData" label-position="right" label-width="100px" :inline="true">
                                    <el-form-item label="商品名称" prop="skuNameSkuId">
                                        <el-input v-model="searchData.skuNameSkuId" placeholder="请输入商品名称或条形码" clearable />
                                    </el-form-item>
                                    <el-form-item class="button-box">
                                        <el-button type="primary" @click="searchCoupon()"> 搜索商品 </el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="tableList-area">
                                <el-checkbox-group v-model="checkedIds" @change="handlecheckedIdsChange">
                                    <el-checkbox-button v-for="item in tableData" :key="item.skuId" :label="item" class="goods-box">
                                        <div>
                                            <div class="img-box">
                                                <img :src="item.thumbnail ? item.thumbnail : './img/1.jpg'" :key="item.skuId" class="goods-img" />
                                            </div>
                                            <div class="type-style" v-if="item.storageStyleCode === 'freeze' || item.storageStyleCode === 'preserve'">{{ item.storageStyle }}</div>
                                            <div class="goods-title">{{ item.skuName }}</div>
                                            <div class="goods-title">￥{{ (item.salePrice / 100).toFixed(2) }}</div>
                                        </div>
                                    </el-checkbox-button>
                                </el-checkbox-group>
                            </div>
                            <!-- <div class="page-box">
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
                            </div> -->
                            <div>
                                <h2>识别明细</h2>
                                <system-list :tHead="tHead" :tableData="shibieList" :isPage="false">
                                    <template #skuPrice="scope"> ¥{{ (scope.row.skuPrice / 100).toFixed(2) }} </template>
                                    <template #quantity="scope">
                                        {{ scope.row.quantity }}
                                    </template>
                                    <template #opbtn="scope">
                                        <el-button type="primary" @click="add(scope.row)" text>
                                            <el-icon><CirclePlus /></el-icon>
                                        </el-button>
                                        <el-button type="primary" @click="delate(scope.row, scope.index)" text>
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
                        <div>
                            <el-form-item label="消费总金额" prop="price" style="width: 45%">
                                <el-input-number v-model="resultdata.price" :rules="rules.price" controls-position="right" :min="0" @change="updatePrice"></el-input-number>元
                            </el-form-item>
                        </div>
                        <el-form-item label="订单留言" prop="discernInfo" style="width: 100%">
                            <el-input v-model="resultdata.discernInfo" :rules="rules.desc" style="width: 100%" type="textarea" placeholder="必须备注补扣款原因，描述商品名称、价格、数量等相关信息；" />
                        </el-form-item>
                    </el-tab-pane>
                    <div>
                        <span>原订单合计：{{ accountData.totalAmount ? (accountData.totalAmount / 100).toFixed(2) : '0' }}元；</span>
                        <span>调整后合计：{{ activeName === 'goodsReason' ? resultdata?.price || 0 : reviewOrder.amount }}元；</span>
                        <template v-if="activeName === 'goodsReason'">
                            <span v-if="reviewOrder.nowTypeGoodsReason === 1">
                                需补扣：<span style="color: red">
                                    {{ reviewOrder.differenceGoodsReason }}
                                </span>
                                元；
                            </span>
                            <span v-if="reviewOrder.nowTypeGoodsReason === 2">
                                需退款：<span style="color: red" v-if="resultdata?.price">{{ reviewOrder.differenceGoodsReason || 0 }} </span>
                                <span style="color: red" v-else>{{ accountData.totalAmount ? (accountData.totalAmount / 100).toFixed(2) : '0' }} </span>元；
                            </span>
                        </template>
                        <template v-else-if="activeName === 'goods'">
                            <span v-if="reviewOrder.nowType === 1">
                                需补扣：<span style="color: red">{{ reviewOrder.difference }} </span>元；
                            </span>
                            <span v-if="reviewOrder.nowType === 2">
                                需退款：<span style="color: red" v-if="shibieList.length">{{ reviewOrder.difference || 0 }} </span>
                                <span style="color: red" v-else>{{ accountData.totalAmount ? (accountData.totalAmount / 100).toFixed(2) : '0' }} </span>元；
                            </span>
                        </template>
                        <!--<p>
                            <span>原订单共：{{ accountData.totalQuantity ?? '0' }}件；</span>
                            <span v-if="activeName === 'goods'">调整后共：{{ reviewOrder.count }}件；</span>
                        </p> -->
                    </div>
                </el-tabs>
                <template style="display: flex; justify-content: center; margin-top: 25px">
                    <span class="dialog-footer">
                        <el-button type="primary" @click="submit(ruleFormRef)" :disabled="reasonDis">确认订单</el-button>
                    </span>
                </template>
            </el-form>
        </div>
        <!-- 确认弹出框 -->
        <el-dialog v-model="dialogCancel" width="30%">
            <div style="font-size: 20px">是否确认提交异常订单处理结果？</div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogCancel = false">返回</el-button>
                    <el-button type="primary" @click="submitReason">提交</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, toRefs, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import SystemList from '@/composables/TablePagination/index.vue'
import { publicRequest } from '@/api/operate/index'
const router = useRouter()
const route = useRoute()
// const resultdata = ref({})
const videoList = ref([])
const showPage = ref(false)
const ruleFormRef = ref()
const pageinfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 30, 50],
    layout: 'total, sizes, prev, pager, next, jumper'
})
const tableData = ref([])
const shibieList = ref([])
const checkedIds = ref([])
const activeName = ref('goods')
const IDs = []
const searchData = ref({
    skuNameSkuId: ''
})
const resultdata = ref({
    videoinfo: '',
    videoinfodesc: '',
    discernInfo: '',
    price: 0,
    radio: 0
})

const getDetail = async () => {
    const params = {
        configCode: 'UCJH67293524137889792',
        appKey: 'A1001000',
        busiCode: 'A1001002',
        name: '查询开门时间的柜内商品及价格',
        source: '运营后台',
        body: {
            appKey: 'A1001000',
            globalNumber: route.query.globalNumber,
            pageNo: pageinfo.value.currentPage,
            pageSize: pageinfo.value.pageSize,
            skuNameSkuId: searchData.value.skuNameSkuId,
            busiCode: 'A1001002'
        }
    }
    const res = await publicRequest(params)
    if (res.code === '200') {
        resultdata.value = res.data.list
        videoList.value = res.data.videoList || []
        console.log('res===', res)
        accountData.value = res.data
        tableData.value = res.data.list
        pageinfo.value.total = res.data.total
        pageinfo.value.total > 0 ? (showPage.value = true) : (showPage.value = false)
    }
}

getDetail()

const handlecheckedIdsChange = (value) => {
    let checkGoodsIds = []
    if (shibieList.value.length) {
        const checkGoods = shibieList.value.reduce((total, el) => {
            if (el.quantity > 0) {
                total.push(el)
            }
            return total
        }, [])
        checkGoodsIds = checkGoods.length ? checkGoods.map((el) => el.skuId) : []
    }
    shibieList.value = checkedIds.value.map((el) => {
        let quantity = 1
        if (checkGoodsIds.includes(el.skuId)) {
            const ind = checkGoodsIds.indexOf(el.skuId)
            quantity = shibieList.value[ind].quantity
        }
        return {
            skuPrice: el.salePrice,
            quantity: quantity,
            ...el
        }
    })

    console.log('*********', shibieList.value)
}
const dialogCancel = ref(false)
const reviewOrder = reactive({
    amount: 0,
    count: 0,
    difference: 0,
    differenceGoodsReason: 0,
    nowType: 2,
    nowTypeGoodsReason: 2
})
watch(
    () => shibieList.value,
    (value) => {
        reviewOrder.amount = 0
        reviewOrder.count = 0
        console.log('****shibieList*****', shibieList.value)
        value.map((item) => {
            reviewOrder.amount += item.skuPrice * item.quantity
            reviewOrder.count += item.quantity
        })

        console.log('****reviewOrder.amount****', reviewOrder.amount)
        if (activeName.value === 'goodsReason') {
            reviewOrder.difference = Math.abs((accountData.value?.totalAmount - resultdata.value.price).toFixed(2))
        } else if (activeName.value === 'goods') {
            console.log('accountData.value?.totalAmount==', accountData.value?.totalAmount, reviewOrder.amount)
            reviewOrder.difference = Math.abs((accountData.value?.totalAmount - reviewOrder.amount).toFixed(2))
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
        reviewOrder.differenceGoodsReason = Math.abs(((accountData.value?.totalAmount || 0) - (resultdata?.value?.price || 0) * 100).toFixed(2))
        if (resultdata.value?.price) {
            reviewOrder.differenceGoodsReason = (reviewOrder.differenceGoodsReason / 100).toFixed(2)
        } else {
            reviewOrder.differenceGoodsReason = 0
        }
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

const updatePrice = () => {
    resultdata.value.price = resultdata?.value?.price.toFixed(2)
    reviewOrder.differenceGoodsReason = Math.abs(((accountData.value?.totalAmount || 0) - (resultdata?.value?.price || 0) * 100).toFixed(2))
    console.log('reviewOrder.differenceGoodsReason===', reviewOrder.differenceGoodsReason)
    reviewOrder.differenceGoodsReason = (reviewOrder.differenceGoodsReason / 100).toFixed(2)
    console.log('reviewOrder.differenceGoodsReason==', reviewOrder.differenceGoodsReason)
    const acL = Number((accountData.value.totalAmount / 100).toFixed(2))
    console.log('acL.ac==', acL, Number(resultdata.value.price))
    if (acL < Number(resultdata.value.price)) {
        reviewOrder.nowTypeGoodsReason = 1
    } else if (acL > Number(resultdata.value.price)) {
        reviewOrder.nowTypeGoodsReason = 2
    }
}

const accountData = ref({})
const tHead = [
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'skuPrice', label: '单价', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'quantity', label: '数量', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'opbtn', label: '操作', minWidth: 100, slot: true }
]
const rules = {
    videoinfo: [{ required: true, message: '请选择视频情况', trigger: 'blur' }],
    videoinfodesc: [{ required: true, message: '请选择视频情况', trigger: 'blur' }],
    discernInfo: [{ required: true, message: '请填写订单留言', trigger: 'blur' }],
    price: [{ required: true, message: '请填写消费总金额', trigger: 'blur' }]
}

const submit = async (formEl) => {
    // 先验证如果没有选中商品的话 就提示
    if (activeName.value === 'goods' && !shibieList.value.length) {
        ElMessage.warning('请选择商品')
        return
    }

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
    // dialogCancel.value = true
}
// // 乘法精度计算
const accMul = (arg1, arg2) => {
    let max = 0
    const s1 = arg1.toString()
    const s2 = arg2.toString()
    try {
        max += s1.split('.')[1].length
    } catch (e) {}
    try {
        max += s2.split('.')[1].length
    } catch (e) {}
    return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, max)
}

const submitReason = async () => {
    console.log('accountData.value.storageStyleCode==', accountData.value)
    if (route.query.processStatus === '45') {
        expOrder()
        return
    }
    dialogCancel.value = false
    const params = {
        configCode: 'UCJH67300170905964544',
        appKey: 'A1001000',
        busiCode: 'A1001002',
        name: '生成工单及补扣订单',
        source: '运营后台',
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            globalNumber: route.query.globalNumber, // globalNumber,orderNoSub,applyCode三者至少传一个
            orderNoSub: '', // globalNumber,orderNoSub,applyCode三者至少传一个
            applyCode: accountData.value.applyCode,
            auditAmount: 0, // 审核后订单金额（调整后订单金额）
            workGoodsList: [
                // 补扣单商品信息
                {
                    quantity: 0, // 购买商品数量
                    skuCode: '', // 商品编码
                    skuName: '', // 商品名称
                    skuPrice: 0, // 商品价格
                    skuUrl: '' // 商品缩略图
                }
            ],
            srcGoodsList: accountData.value.goodsList,
            payAmount: accountData.value.payAmount,
            totalAmount: accountData.value.totalAmount,
            discernInfo: '', // 客服/柜主录入识别的商品信息（订单备注）
            handleAmount: 0, // 处理金额
            handleType: 0, // 处理类型 1:补扣 2:退款
            videoVisibleFlag: 1 // 视频中商品是否看得清楚 0：看不清楚 1：看得清楚
        }
    }
    if (activeName.value === 'goods') {
        params.body.handleType = reviewOrder.nowType
        params.body.videoVisibleFlag = 1
        params.body.auditAmount = accMul(reviewOrder.amount, 100)
        params.body.handleAmount = Math.abs(Number(params.body.auditAmount) - Number(accountData.value?.totalAmount))
        if (reviewOrder.nowType === 1) {
            params.body.deductAmount = accMul(reviewOrder.difference, 100)
        }
        params.body.workGoodsList = shibieList.value.map((item) => {
            return {
                skuPrice: item.salePrice,
                skuCode: item.skuId,
                skuUrl: item.thumbnail,
                quantity: item.quantity,
                skuName: item.skuName,
                storageStyleCode: item.storageStyleCode,
                doorType: item.doorType
            }
        })
        console.log(params, 'params.deductAmount')
    }
    if (activeName.value === 'goodsReason') {
        params.body.applyCode = accountData.value.applyCode
        params.body.handleType = reviewOrder.nowTypeGoodsReason
        params.body.auditAmount = accMul(resultdata.value.price, 100)
        params.body.handleAmount = Math.abs(Number(params.body.auditAmount) - Number(accountData.value?.totalAmount))
        params.body.discernInfo = resultdata.value.discernInfo
        params.body.videoVisibleFlag = 0
        params.body.workGoodsList = []
        params.body.payAmount = accountData.value.payAmount
        params.body.totalAmount = accountData.value.totalAmount
    }
    const res = await publicRequest(params)
    console.log('res==', res)
    if (res.code === '200') {
        router.push({ name: 'salesOrder' })
        ElMessage.success('订单创建成功')
    }
}

// 异常工单
const expOrder = async () => {
    dialogCancel.value = false
    const params = {
        configCode: 'UCJH67344510384209920',
        appKey: 'A1001000',
        busiCode: 'A1001002',
        name: '异常订单创建补扣单并完成工单',
        source: '运营后台',
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            globalNumber: route.query.globalNumber, // globalNumber,orderNoSub,applyCode三者至少传一个
            orderNoSub: '', // globalNumber,orderNoSub,applyCode三者至少传一个
            applyCode: accountData.value.applyCode, // globalNumber,orderNoSub,applyCode三者至少传一个
            workNumber: accountData.value.workNumber,
            auditAmount: 0, // 审核后订单金额（调整后订单金额）
            workGoodsList: [
                // 补扣单商品信息
                {
                    quantity: 0, // 购买商品数量
                    skuCode: '', // 商品编码
                    skuName: '', // 商品名称
                    skuPrice: 0, // 商品价格
                    skuUrl: '' // 商品缩略图
                }
            ],
            srcGoodsList: accountData.value.goodsList,
            payAmount: accountData.value.payAmount,
            totalAmount: accountData.value.totalAmount,
            discernInfo: '', // 客服/柜主录入识别的商品信息（订单备注）
            handleAmount: 0, // 处理金额
            handleType: 0, // 处理类型 1:补扣 2:退款
            videoVisibleFlag: 1 // 视频中商品是否看得清楚 0：看不清楚 1：看得清楚
        }
    }

    if (activeName.value === 'goods') {
        params.body.handleType = reviewOrder.nowType
        params.body.videoVisibleFlag = 1
        params.body.auditAmount = accMul(reviewOrder.amount, 100)
        params.body.handleAmount = Math.abs(Number(params.body.auditAmount) - Number(accountData.value?.totalAmount))
        if (reviewOrder.nowType === 1) {
            params.body.deductAmount = accMul(reviewOrder.difference, 100)
        }
        params.body.workGoodsList = shibieList.value.map((item) => {
            return {
                skuPrice: item.salePrice,
                skuCode: item.skuId,
                skuUrl: item.thumbnail,
                quantity: item.quantity,
                skuName: item.skuName,
                storageStyleCode: item.storageStyleCode,
                doorType: item.doorType
            }
        })
        console.log(params, 'params.deductAmount')
    }
    if (activeName.value === 'goodsReason') {
        params.body.applyCode = accountData.value.applyCode
        params.body.handleType = reviewOrder.nowTypeGoodsReason
        params.body.auditAmount = accMul(resultdata.value.price, 100)
        params.body.handleAmount = Math.abs(Number(params.body.auditAmount) - Number(accountData.value?.totalAmount))
        params.body.discernInfo = resultdata.value.discernInfo
        params.body.videoVisibleFlag = 0
        params.body.workGoodsList = []
        params.body.payAmount = accountData.value.payAmount
        params.body.totalAmount = accountData.value.totalAmount
    }
    const res = await publicRequest(params)
    if (res.code === '200') {
        ElMessage.success('操作成功')
        router.push({ name: 'salesOrder' })
    }
}

// 工单试算接口
const calculationWorkOrder = async () => {
    const deductGoodsList = shibieList.value.map((item) => {
        return {
            realPrice: item.salePrice * 100,
            skuCode: item.skuId,
            quantity: item.quantity
        }
    })
    const goodsList = tableData.value.map((item, index) => {
        return item.skuId === shibieList.value[index].skuCode
    })

    console.log('deductGoodsList===', deductGoodsList, 'goodsList===', goodsList)

    const params = {
        configCode: 'MS67271428797759488',
        appKey: 'A1001000',
        busiCode: 'A1001002',
        name: '工单试算',
        source: '工单中台',
        body: {
            applyCode: '',
            totalAmount: '',
            payAmount: '',
            goodsList: [
                {
                    skuCode: '',
                    realPrice: '',
                    quantity: ''
                }
            ],
            deductGoodsList
        }
    }
}

// 添加
const add = (row) => {
    row.quantity++
    calculationWorkOrder()
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
// // 查询
const searchCoupon = () => {
    pageinfo.value.currentPage = 1
    getDetail()
}
// 当前页数改变
const currentChange = (val) => {
    pageinfo.value.currentPage = val
    getDetail()
}
const sizeChange = (val) => {
    pageinfo.value.currentPage = 1
    pageinfo.value.pageSize = val
    getDetail()
}
const goBack = () => {
    // router.go(-1)
    window.close()
}
</script>
<style lang="scss" scoped>
.work-order-container {
    .height-p {
        line-height: 40px;
    }
    h2 {
        line-height: 50px;
    }
    .orderinfo {
        margin-top: 40px;
        .videoinfo {
            display: flex;
            .leftinfo {
                :deep(.el-select) {
                    width: 450px;
                }
                width: 40%;
                .select {
                    width: 450px;
                    height: 100px;
                }
            }
            .rightinfo {
                width: 60%;
                .el-row {
                    margin-bottom: 20px;
                }
                .select {
                    width: 450px;
                }
            }
        }
    }
    .makeup {
        font-size: 18px;
        font-weight: bold;
        display: flex;
        margin-bottom: 50px;
        .text {
            color: red;
        }
    }
    :deep(.el-textarea__inner) {
        height: 100px;
    }
    :deep(.el-input .el-input__inner) {
        color: red;
        text-align: center;
    }
    :deep(.el-table .el-table__footer-wrapper .cell) {
        font-weight: 600;
        color: red;
    }
    :deep(.el-select .select-trigger) {
        width: 450px;
    }
    .p_class {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .img-box {
        text-align: center;
        img {
            display: block;
            width: 150px;
        }
    }
    .type-style {
        text-align: center;
        margin-left: 90px;
        position: relative;
        margin-top: -10px;
        border: 1px solid #409eff;
        width: 40px;
        border-radius: 5px;
        color: #409eff;
    }
    .mine-container {
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
        .tableList-area {
            max-height: 600px;
            overflow-y: scroll;
            display: flex;
            justify-content: flex-start;
            .goods-box {
                width: 230px;
                .img-box {
                    text-align: center;
                    padding-bottom: 5px;
                    height: 130px;
                    .goods-img {
                        height: 120px;
                        margin: 0 auto;
                    }
                }

                .goods-title {
                    width: 230px;
                    font-size: 14px;
                    color: #222;
                    padding-bottom: 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap; /*内容超宽后禁止换行显示*/
                    text-align: center;
                }
                .goods-code {
                    font-size: 12px;
                    color: #b0b0b0;
                    padding-bottom: 10px;
                }
                .bottom {
                    display: flex;
                    .goods-price {
                        font-size: 14px;
                        color: #fe7e41;
                        padding-bottom: 10px;
                        width: 100px;
                    }
                    .handle {
                        flex: 1;
                        .handle-btn {
                            display: inline-block;
                            margin-right: 5px;
                            font-size: 12px;
                            color: #328eed;
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
