<template>
    <div>
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item label="订单编号" prop="orderNoSub">
                <el-input v-model="form.orderNoSub" placeholder="请输入订单编号" />
            </el-form-item>
            <el-form-item label="支付单号" prop="payNo">
                <el-input v-model="form.payNo" placeholder="42或43开头的支付单号" />
            </el-form-item>
            <el-form-item label="用户手机号码" prop="userMobile">
                <el-input v-model="form.userMobile" placeholder="请输入用户手机号码" />
            </el-form-item>
            <el-form-item label="运单号" prop="courierNumber">
                <el-input v-model="form.courierNumber" placeholder="请输入运单号" />
            </el-form-item>
            <el-form-item label="物流公司" prop="courierCompany">
                <el-select v-model="form.courierCompany" placeholder="请选择物流公司～">
                    <el-option v-for="el in courierCompanyList" :label="el.expressName" :value="el.expressCode" :key="el.expressCode" />
                </el-select>
            </el-form-item>
            <el-form-item label="订单金额" prop="payAmountBegin">
                <el-input v-model="form.payAmountBegin" placeholder="请输入" /></el-form-item>~
            <el-form-item label="" prop="payAmountEnd">
                <el-input v-model="form.payAmountEnd" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="订单状态" prop="orderStatus">
                <el-select v-model="form.orderStatus" placeholder="请选择订单状态">
                    <el-option label="全部" value="" />
                    <el-option label="待付款" value="100" />
                    <el-option label="备餐中" value="200" />
                    <el-option label="待配送" value="300" />
                    <el-option label="待入柜" value="400" />
                    <el-option label="待取货" value="500" />
                    <el-option label="已完成" value="600" />
                    <el-option label="退款成功 " value="700" />
                    <el-option label="退款处理中 " value="701" />
                    <el-option label="退款失败" value="702" />
                    <el-option label="已取消" value="800" />
                    <el-option label="异常订单" value="900" />
                </el-select>
            </el-form-item>
            <el-form-item label="订单创建时间" prop="gmtCreate">
                <el-col :span="11">
                    <el-date-picker v-model="querinfo.gmtCreate" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss"  @change="daterangeTime"/>
                </el-col>
            </el-form-item>
            <el-form-item label="订单支付时间" prop="payTime">
                <el-col :span="11">
                    <el-date-picker v-model="querinfo.payTime" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" @change="daterangeUTime"/>
                </el-col>
            </el-form-item>
            <el-form-item class="button-box">
                <div>
                    <!-- <el-button type="primary">导出列表</el-button> -->
                </div>
                <div>
                    <el-button type="danger" @click="resetForm">重置</el-button>
                    <el-button type="danger" @click="searchCoupon">搜索</el-button>
                </div>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="orderNoSub" label="订单编号" align="center" />
            <el-table-column prop="courierNumber" label="运单号" align="center" />
            <el-table-column prop="freight" label="运费" align="center" >
                <template v-slot="scope">
                    <span >{{(scope.row.freight/100).toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="userMobile" label="用户手机号" align="center" />
            <el-table-column prop="payNo" label="支付单号" align="center" />
            <el-table-column prop="orderStatus" label="订单状态" align="center">
                <template v-slot="scope">
                    <span v-if="scope.row.orderStatus === 100">待付款</span>
                    <span v-if="scope.row.orderStatus === 200">备餐中</span>
                    <span v-if="scope.row.orderStatus === 300">待配送</span>
                    <span v-if="scope.row.orderStatus === 400">待入柜</span>
                    <span v-if="scope.row.orderStatus === 500">待取货</span>
                    <span v-if="scope.row.orderStatus === 600">已完成</span>
                    <span v-if="scope.row.orderStatus === 700">退款成功</span>
                    <span v-if="scope.row.orderStatus === 701">退款处理中</span>
                    <span v-if="scope.row.orderStatus === 702">退款失败</span>
                    <span v-if="scope.row.orderStatus === 800">已取消</span>
                    <span v-if="scope.row.orderStatus === 900">异常订单</span>
                </template>
            </el-table-column>
            <el-table-column prop="payAmount" label="订单金额(￥)" align="center" >
                <template v-slot="scope">
                    <span >{{(scope.row.payAmount/100).toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="gmtCreate" label="订单创建时间" align="center" />
            <el-table-column prop="payTime" label="订单支付时间" align="center" />
            <el-table-column label="操作" align="center">
                <template v-slot="scope">
                    <el-button text type="primary" @click="view(scope.row)"> 查看 </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="demo-pagination-block" style="display:flex;margin-top:25px;justify-content:center">
            <el-pagination
                v-model:currentPage="pageinfo.page"
                v-model:page-size="pageinfo.pageSize"
                :page-sizes="[10, 20, 30, 40]"
                :small="small"
                :disabled="disabled"
                :background="background"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { orderList } from '@/api/order/index.js'
import { getMerchantList } from '@/api/operate/index'

const router = useRouter()

// 支付时间
const querinfo = ref({
    gmtCreate: [],
    payTime: []
})
// 表单数据
const form = ref({
    orderNoSub: '', // 订单编号
    payNo: '', // 支付单号
    userMobile: '', // 用户手机号
    courierNumber: '', // 运单号
    courierCompany: '', // 物流公司
    payAmount: '', // 订单金额
    orderStatus: '', // 订单状态
    gmtCreateBegin: '', // 订单创建时间
    gmtCreateEnd: '',
    payTimeBegin: '',
    payTimeEnd: ''
})
const pageinfo = reactive({
    page: 1,
    pageSize: 10,
    total: ''
})
// 表格数据
const tableData = ref([])

// 点击时把订单编号，商铺id传给下个页面   表格中查看点击跳转
const view = (row) => {
    const routeData = router.resolve({ name: 'form-information-list', params: { orderNoSub: row.orderNoSub } })
    window.open(routeData.href, '_blank')
    // router.push({ name: 'form-information-list', params: { orderNoSub: row.orderNoSub } })
}

// 时间选择
const daterangeTime = (val) => {
    if (val) {
        querinfo.value.gmtCreate = val
        form.value.gmtCreateBegin = val[0]
        form.value.gmtCreateEnd = val[1]
    } else {
        form.value.gmtCreateBegin = ''
        form.value.gmtCreateEnd = ''
    }
}
const daterangeUTime = (val) => {
    if (val) {
        querinfo.value.payTime = val
        form.value.payTimeBegin = val[0]
        form.value.payTimeEnd = val[1]
    } else {
        form.value.payTimeBegin = ''
        form.value.payTimeEnd = ''
    }
}
// 重置按钮功能
const resetFormData = ref(null)
const resetForm = () => {
    querinfo.value.gmtCreate = []
    querinfo.value.payTime = []
    resetFormData.value.resetFields()
    form.value.gmtCreateBegin = ''
    form.value.gmtCreateEnd = ''
    form.value.payTimeBegin = ''
    form.value.payTimeEnd = ''
}

// 搜索按钮
const searchCoupon = () => {
    pageinfo.page = 1
    getOrderList()
}

// 接口请求数据
const getOrderList = async () => {
    const params = {
        body: {
            businessCode: 'A1001001',
            busiCode: 'A1001001',
            appKey: 'A1001001', // 系统标识
            ...form.value,
            pageNum: pageinfo.page,
            pageSize: pageinfo.pageSize,
            payAmountBegin: form.value.payAmountBegin * 100 || 0,
            payAmountEnd: form.value.payAmountEnd * 100 || null

        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC1657848908895juqy6',
        name: '订单列表',
        source: '订单中台'
    }
    const res = await orderList(params)
    if (res.data) {
        tableData.value = res.data.list
        pageinfo.total = res.data.totalCount
    } else {
        tableData.value = []
        pageinfo.total = 0
    }
}

const courierCompanyList = ref([])
const getcourierCompanyList = async () => {
    const param = {
        body: {
            busiCode: 'A1001001',
            appKey: 'A1001001'

        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC1659076890688IjTN2',
        name: '查询快递公司列表',
        source: '运单中台'
    }
    const data = await getMerchantList(param)
    courierCompanyList.value = data.expressList
    courierCompanyList.value.unshift({ expressName: '全部', expressCode: '' })
    console.log(data)
}

onMounted(async () => {
    await getOrderList()
    await getcourierCompanyList()
})

// 当前页数改变
const currentChange = (val) => {
    pageinfo.page = val
    getOrderList()
}
const sizeChange = (val) => {
    pageinfo.page = 1
    pageinfo.pageSize = val
    getOrderList()
}

</script>

<style lang="scss" scoped>
.button-box {
    display: flex;
    div {
        flex: 1;
    }
}
</style>
