<template>
    <div class="stockListBox">
        <div class="big-title">虚拟发货确认</div>
        <el-form ref="resetFormData" :model="form" label-width="140px" :inline="true">
            <el-form-item label="单据类型：" prop="orderType">
                <el-select v-model="form.orderType"  placeholder="单据类型" disabled>
                    <el-option label="全款货柜" value="1" />
                    <el-option label="货柜租赁" value="2" />
                    <el-option label="货柜分期" value="3" />
                </el-select>
            </el-form-item>
            <el-form-item label="单号：" prop="orderNo">
                <el-input v-model="form.orderNo"  placeholder="单号" disabled/>
            </el-form-item>
            <br>
            <div class="small-title">发货方信息</div>
            <el-form-item label="发货方编号：" prop="senderNumber">
                <el-input v-model="form.senderNumber"  placeholder="发货方编号" disabled/>
            </el-form-item>
            <el-form-item label="发货方名称：" prop="senderName">
                <el-input v-model="form.senderName"  placeholder="发货方名称" disabled/>
            </el-form-item>
            <br>
            <el-form-item label="发货方联系人：" prop="senderContacts">
                <el-input v-model="form.senderContacts"  placeholder="发货方联系人" disabled/>
            </el-form-item>
            <el-form-item label="发货方联系方式：" prop="senderContactInformation">
                <el-input v-model="form.senderContactInformation"  placeholder="发货方联系方式" disabled/>
            </el-form-item>
            <el-form-item label="发货方地址：" prop="senderAddress">
                <el-input v-model="form.senderAddress"  placeholder="发货方地址" disabled/>
            </el-form-item>
            <br>
            <div class="small-title">收货方信息</div>
            <el-form-item label="收货方编号：" prop="receiptNumber">
                <el-input v-model="form.receiptNumber"  placeholder="发货方编号" disabled/>
            </el-form-item>
            <el-form-item label="收货方名称：" prop="receiptName">
                <el-input v-model="form.receiptName"  placeholder="发货方名称" disabled/>
            </el-form-item>
            <br>
            <el-form-item label="收货方联系人：" prop="receiptContacts">
                <el-input v-model="form.receiptContacts"  placeholder="收货方联系人" disabled/>
            </el-form-item>
            <el-form-item label="收货方联系方式：" prop="receiptContactInformation">
                <el-input v-model="form.receiptContactInformation"  placeholder="收货方联系方式" disabled/>
            </el-form-item>
            <el-form-item label="收货方地址：" prop="receiptAddress">
                <el-input v-model="form.receiptAddress"  placeholder="收货方地址" disabled/>
            </el-form-item>
            <br>
            <div class="small-title">单据信息</div>
            <el-form-item label="数量：" prop="quantity">
                <el-input v-model="form.quantity"  placeholder="数量" disabled/>
            </el-form-item>
            <el-form-item label="体积（立方米）：" prop="volumn">
                <el-input v-model="form.volumn"  placeholder="体积（立方米）" disabled/>
            </el-form-item>
            <el-form-item label="重量（千克）：" prop="weight">
                <el-input v-model="form.weight"  placeholder="重量（千克）" disabled/>
            </el-form-item>
            <br>
        </el-form>
        <div class="big-title">商品明细</div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" label="序号" />
            <el-table-column prop="standardBarCode" label="商品条码"  />
            <el-table-column prop="transGoodsNumber" label="商品编号"  />
            <el-table-column prop="transGoodsName" label="商品名称"  />
            <el-table-column prop="transGoodsQuantity" label="数量" />
            <el-table-column prop="transGoodsSize" label="规格" />
            <el-table-column prop="spuId" label="标品编号" />
            <el-table-column prop="realDate" label="实际发生日期" minWidth="140">
                <template v-slot="scope">
                    <el-date-picker
                        v-model="scope.row.realDate"
                        type="datetime"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        @change="quantityChange('realDate', scope.row)"
                        placeholder="请选择"/>
                </template>
            </el-table-column>
            <el-table-column prop="quantity" label="实际发生数量">
                <template v-slot="scope">
                    <el-input v-model.number="scope.row.quantity" @change="quantityChange('quantity', scope.row)"></el-input>
                </template>
            </el-table-column>
        </el-table>
        <!--<div class="bottom">
            <div class="demo-pagination-block" style="margin:0 auto">
                <el-pagination
                    v-model:currentPage="dataState.pageinfo.currentPage"
                    v-model:page-size="dataState.pageinfo.pageSize"
                    :page-sizes="[10, 20, 30, 40]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="dataState.pageinfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                />
            </div>
        </div>-->
        <div class="confirm-btns">
            <el-button type="primary" @click="confirm">
                确认
            </el-button>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, defineEmits } from 'vue'
import { billDetail, billConfirm } from '@/api/oms/index'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
const props = defineProps(['id'])
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const emits = defineEmits(['update:modelValue', 'getList'])
// 查询项
const form = reactive({
    orderType: '',
    orderNo: '',
    warehousingNo: '',
    senderNumber: '',
    senderName: '',
    senderContacts: '',
    senderContactInformation: '',
    senderAddress: '',
    receiptNumber: '',
    receiptName: '',
    receiptContacts: '',
    receiptContactInformation: '',
    receiptAddress: '',
    quantity: '',
    volumn: '',
    weight: ''
})
const tableData = ref([])
// 数据接口
const dataState = reactive({
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    },
    row: null
})
// 数据总数
const totals = ref(0)

onMounted(async () => {
    getDataList()
})
// 获取列表数据
const getDataList = async () => {
    const params = {
        orderNo: props.id
    }
    const { data, count } = await billDetail(params)
    form.orderType = data.orderType
    form.orderNo = data.orderNo
    form.warehousingNo = data.warehousingNo
    form.senderNumber = data.senderNumber
    form.senderName = data.senderName
    form.senderContacts = data.senderContacts
    form.senderContactInformation = data.senderContactInformation
    form.senderAddress = data.senderAddress
    form.receiptNumber = data.receiptNumber
    form.receiptName = data.receiptName
    form.receiptContacts = data.receiptContacts
    form.receiptContactInformation = data.receiptContactInformation
    form.receiptAddress = data.receiptAddress
    form.quantity = data.quantity
    form.volumn = data.volumn
    form.weight = data.weight
    tableData.value = data.childerList
    dataState.pageinfo.total = count
}
const quantityChange = (name, row) => {
    if (row.realDate === null && name === 'realDate') {
        ElMessage({
            showClose: true,
            message: '实际发生日期不能为空',
            type: 'error'
        })
    }
    if (row.quantity === '' && name === 'quantity') {
        ElMessage({
            showClose: true,
            message: '实际发生数量不能为空',
            type: 'error'
        })
    }
}
// 提交
const confirm = async () => {
    const details = []
    const arr = tableData.value
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].realDate === null) {
            ElMessage({
                showClose: true,
                message: `第 ${i + 1} 行，实际发生日期不能为空`,
                type: 'error'
            })
            return
        } else if (arr[i].quantity === '' || arr[i].quantity === null) {
            ElMessage({
                showClose: true,
                message: `第 ${i + 1} 行，实际发生数量不能为空`,
                type: 'error'
            })
            return
        } else {
            details.push({
                transGoodsNumber: arr[i].transGoodsNumber,
                quantity: arr[i].quantity,
                realDate: arr[i].realDate
            })
        }
    }
    const params = {
        userName: userInfo.value.account,
        orderNo: form.orderNo,
        childerList: details
    }
    const res = await billConfirm(params)
    if (res.code === '200') {
        successTip()
    }
}
// 操作成功 提示并返回列表
const successTip = () => {
    ElMessage({
        showClose: true,
        message: '保存成功',
        type: 'success'
    })
    const timer = setTimeout(() => {
        clearTimeout(timer)
        router.push({ name: 'sale-bill-list' })
    }, 2000)
}
// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currentPage = val
    getDataList()
}
// 当前页改变
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getDataList()
}
</script>

<style lang="scss" scoped>
.stockListBox{
    .big-title{
        font-weight: bold;
        margin-bottom: 20px;
    }
    .small-title{
        font-weight: bold;
        margin-bottom: 12px;
        font-size: 14px;
        width: 120px;
        text-align: right;
    }
    .btns{
        margin: 50px 0 20px 1300px;
    }
    .date-list{
        background-color: rgba($color: black, $alpha: 0.2);
        margin-top: 10px;
        display: flex;
        span{
            flex: 1;
        }
    }
    .bottom{
        display: flex;
    }
    .confirm-btns{
        margin: 0 auto;
        width: fit-content;
        margin-top: 20px;
    }
    .el-pager li.is-active{
        color: #409EFF !important;
    }
    .primaryBox{
        color: #409EFF !important;
    }
    .demo-pagination-block{
        .is-active{
            color: #409EFF !important;
        }
    }
}

</style>
