<template>
    <div>
        <div class="order-information">
            <span class="information">订单信息</span>
            <span class="state">订单状态</span>
            <span class="is-delivery">{{detail.orderStatus===100?'待付款':detail.orderStatus===200?'备餐中':detail.orderStatus===300?'待配送':detail.orderStatus===400?'待入柜':detail.orderStatus===500?'待取货':detail.orderStatus===600?'已完成':detail.orderStatus===700?'退款成功':detail.orderStatus===701?'退款处理中':detail.orderStatus===702?'退款失败':detail.orderStatus===800?'已取消':'异常订单'}}</span>
        </div>
        <el-form :model="form" label-width="120px" :inline="true" disabled>
            <el-form-item label="订单编号">
                <el-input v-model="form.orderNoSub" />
            </el-form-item>
            <el-form-item label="支付单号">
                <el-input v-model="form.payNo" />
            </el-form-item>
            <el-form-item label="用户手机号码">
                <el-input v-model="form.userMobile" />
            </el-form-item>
            <el-form-item label="运单号">
                <el-input v-model="form.courierNumber" />
            </el-form-item>
            <el-form-item label="物流公司">
                <el-input v-model="form.courierCompany" />
            </el-form-item>
            <el-form-item label="订单创建时间">
                <el-input v-model="form.gmtCreate" />
            </el-form-item>
            <el-form-item label="订单支付时间">
                <el-input v-model="form.payTime" />
            </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%" show-summary :header-cell-style="{ 'text-align': 'center' }" border  stripe  :summary-method="getSummaries">
            <el-table-column prop="info" label="商品信息" align="center" >
                <template v-slot="scope">
                    <span>商品编号：{{scope.row.skuCode}}</span>
                    <span>商品名称：{{scope.row.skuName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="realPrice" label="商品单价（¥）" align="center" >
                <template v-slot="scope">
                    <span>{{(scope.row.realPrice/100).toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="quantity" label="商品数量" align="center" />
            <el-table-column prop="skuAmount" label="商品合计（¥）" align="center" >
                <template v-slot="scope">
                    <span>{{(scope.row.skuAmount/100).toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="disctAmount" label="优惠金额" align="center" >
                <template v-slot="scope">
                    <span>{{(scope.row.disctAmount/100).toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="freight" label="运费（¥）" align="center" >
                <template v-slot="scope">
                    <span>{{(scope.row.freight/100).toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="payAmount" label="支付金额（¥）" align="center" >
                <template v-slot="scope">
                    <span>{{(scope.row.payAmount/100).toFixed(2)}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px; margin-bottom: 20px">
            <h1 style="margin-bottom: 20px">优惠券使用详情</h1>
            <el-form :model="form" label-width="120px" :inline="true" disabled>
                <el-form-item label="券编号">
                    <el-input v-model="form.couponCode" style="width: 240px" /> </el-form-item
                ></el-form>
        </div>
        <div class="order-information">
            <div class="information">用户地址信息</div>
            <el-form :model="form" label-width="120px" :inline="true" disabled>
                <el-col :span="6">
                    <el-form-item label="用户ID">
                        <el-input v-model="form.userId" style="width: 240px" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="联系方式">
                        <el-input v-model="form.userMobile" style="width: 240px" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="配送地址">
                        <el-input v-model="form.clientAddr" style="width: 240px" />
                    </el-form-item>
                </el-col>
            </el-form>
        </div>
        <div class="order-information">
            <div class="information">退款申请详情</div>
            <el-table :data="reFundTableData" style="width: 100%" show-summary :header-cell-style="{ 'text-align': 'center' }" border  stripe  :summary-method="getSummarires">
                <el-table-column label="商品信息" align="center">
                    <template v-slot="scope">
                        <p>商品编号：{{ scope.row.skuCode }}</p>
                        <p>商品名称：{{ scope.row.skuName }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="商品单价(¥)" align="center" >
                    <template v-slot="scope">
                        <p>{{ (scope.row.price/100).toFixed(2)}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="totalAmount" label="合计(¥)" align="center" >
                    <template v-slot="scope">
                        <p>{{ (scope.row.totalAmount/100).toFixed(2)}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="disctAmount" label="优惠金额(¥)" align="center" >
                    <template v-slot="scope">
                        <p>{{ (scope.row.disctAmount/100).toFixed(2)}}</p>
                    </template></el-table-column>
                <el-table-column prop="freight" label="运费（¥）" align="center" >
                    <template v-slot="scope">
                        <span>{{scope.row.freight?(scope.row.freight/100).toFixed(2):'0.00'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="actRefundAmount" label="退款申请金额" align="center" >
                    <template v-slot="scope">
                        <span>{{scope.row.actRefundAmount?(scope.row.actRefundAmount/100).toFixed(2):'0.00'}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="actRefundAmount" label="支付金额(¥)" align="center" >
                    <template v-slot="scope">
                        <p>{{ (scope.row.actRefundAmount/100).toFixed(2)}}</p>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>
        <div class="btn">
            <el-button type="danger" @click="back">返回列表</el-button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { orderDetails } from '@/api/order'

const router = useRouter()
// 商品列表页传过来的参数
const props = defineProps(['orderNoSub'])

const form = ref({
    orderNoSub: '', // 订单编号
    payNo: '', // 支付单号
    userMobile: '', // 用户手机号
    courierNumber: '', // 运单号
    courierCompany: '', // 物流公司
    gmtCreate: '', // 订单创建时间
    payTime: '', // 订单支付时间
    couponCode: '', // 优惠券
    userId: '', // 用户ID
    clientAddr: '' // 配送地址
})
// 商品表格信息
const tableData = ref([
    {
        skuCode: '', // 商品编号
        skuName: '', // 商品信息
        realPrice: '', // 商品单价
        quantity: '', // 商品数量
        skuAmount: '', // 合计
        disctAmount: '', // 优惠金额
        payAmount: '' // 支付金额
    }
])
// 退款表格的数据
const reFundTableData = ref([
    {
        skuCode: '', // 商品编号
        skuName: '', // 商品名称
        price: '', // 退款申请详情的单价
        quantity: '', // 商品申请退款商品数
        totalAmount: '', // 商品申请退款合计
        disctAmount: '', // 优惠金额
        actRefundAmount: '' // 商品申请退款金额
    }
])

// 请求接口数据
const detail = ref({})
const getOrderDetails = async () => {
    const params = {
        body: {
            businessCode: 'A1001001',
            appKey: 'A1001001',
            busiCode: 'A1001001',
            orderNoSub: props.orderNoSub
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC1657849546935EcjZV',
        name: '订单详情',
        source: '订单中台'
    }
    const res = await orderDetails(params)
    Object.assign(detail.value, res.data)
    form.value = res.data
    tableData.value = res.data.orderSubDetailResVO
    if (res.data.refundSubResVO) {
        reFundTableData.value = res.data.refundSubResVO
    }
}
getOrderDetails()

const getSummaries = (param) => {
    const { columns, data } = param
    console.log(data, 'data')
    const sums = []
    columns.forEach((column, index) => {
        // column 是每一列，index 表示列的索引，第一列的时候不计算合计，显示自定义的文字内容
        if (index === 0) {
            sums[index] = '总计'
            return
        }
        if (index !== 2 || index !== 1) {
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
                sums[index] = (sums[index] / 100).toFixed(2) // 保留2位小数，解决小数合计列
            } else {
                sums[index] = '--' // 其余列一律不进行合计
            }
        }
        if (index === 2) {
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
            } else {
                sums[index] = '--' // 其余列一律不进行合计
            }
        }
    })
    return sums
}

const getSummarires = (param) => {
    const { columns, data } = param
    const sums = []
    columns.forEach((column, index) => {
        // column 是每一列，index 表示列的索引，第一列的时候不计算合计，显示自定义的文字内容
        if (index === 0) {
            sums[index] = '总计'
            return
        }

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
            sums[index] = (sums[index] / 100).toFixed(2) // 保留2位小数，解决小数合计列
        } else {
            sums[index] = '--' // 其余列一律不进行合计
        }
    })
    return sums
}

const back = () => {
    router.push({ name: 'order-list-list' })
}
</script>

<style lang="scss" scoped>
.order-information {
    margin-bottom: 30px;
    .information {
        font-weight: 800;
        font-size: 30px;
        margin-bottom: 20px;
    }
    .state {
        margin-left: 30px;
    }
    .is-delivery {
        margin-left: 30px;
        font-weight: 700;
        font-size: 20px;
        color: red;
    }
}
.btn {
    width: 100px;
    margin: 0 auto;
}
</style>
