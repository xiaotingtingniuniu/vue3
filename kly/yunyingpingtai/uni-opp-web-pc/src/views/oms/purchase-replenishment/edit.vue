<template>
    <div class="stockListBox">
        <div class="big-title">虚拟出入库确认</div>
        <el-form ref="resetFormData" :model="form" label-width="140px" :inline="true">
            <el-form-item label="单据类型：" prop="billType">
                <el-select v-model="form.billType"  placeholder="单据类型" disabled>
                    <el-option label="采购入库单(仓)" :value="0" />
                    <el-option label="采购入库单(店)" :value="1" />
                </el-select>
            </el-form-item>
            <el-form-item label="单号：" prop="purchaseBillNo">
                <el-input v-model="form.purchaseBillNo"  placeholder="单号" disabled/>
            </el-form-item>
            <br>
            <div class="small-title">发货方信息</div>
            <el-form-item label="发货方编号：" prop="senderNo">
                <el-input v-model="form.senderNo"  placeholder="发货方编号" disabled/>
            </el-form-item>
            <el-form-item label="发货方名称：" prop="senderName">
                <el-input v-model="form.senderName"  placeholder="发货方名称" disabled/>
            </el-form-item>
            <br>
            <el-form-item label="发货方联系人：" prop="senderContacts">
                <el-input v-model="form.senderContacts"  placeholder="发货方联系人" disabled/>
            </el-form-item>
            <el-form-item label="发货方联系方式：" prop="senderContactInformation">
                <el-input v-model="form.senderContactInformation"  placeholder="单号" disabled/>
            </el-form-item>
            <el-form-item label="发货方地址：" prop="senderAddress">
                <el-input v-model="form.senderAddress"  placeholder="相关单号" disabled/>
            </el-form-item>
            <br>
            <div class="small-title">收货方信息</div>
            <el-form-item label="收货方编号：" prop="receiverNo">
                <el-input v-model="form.receiverNo"  placeholder="发货方编号" disabled/>
            </el-form-item>
            <el-form-item label="收货方名称：" prop="receiverName">
                <el-input v-model="form.receiverName"  placeholder="发货方名称" disabled/>
            </el-form-item>
            <br>
            <el-form-item label="收货方联系人：" prop="receiverContacts">
                <el-input v-model="form.receiverContacts"  placeholder="仓/门店编号" disabled/>
            </el-form-item>
            <el-form-item label="收货方联系方式：" prop="receiverContactInformation">
                <el-input v-model="form.receiverContactInformation"  placeholder="仓/门店名称" disabled/>
            </el-form-item>
            <el-form-item label="收货方地址：" prop="receiverAddress">
                <el-input v-model="form.receiverAddress"  placeholder="采购主体" disabled/>
            </el-form-item>
            <br>
            <div class="small-title">单据信息</div>
            <el-form-item label="数量：" prop="sumCount">
                <el-input v-model="form.sumCount"  placeholder="仓/门店编号" disabled/>
            </el-form-item>
            <el-form-item label="体积（立方米）：" prop="sumVolume">
                <el-input v-model="form.sumVolume"  placeholder="仓/门店名称" disabled/>
            </el-form-item>
            <el-form-item label="重量（千克）：" prop="sumWeight">
                <el-input v-model="form.sumWeight"  placeholder="采购主体" disabled/>
            </el-form-item>
            <br>
        </el-form>
        <div class="big-title">商品明细</div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" label="序号" />
            <el-table-column prop="standardBarCode" label="商品条码"  />
            <el-table-column prop="goodsNo" label="商品编号"  />
            <el-table-column prop="goodsName" label="商品名称"  />
            <el-table-column prop="goodsSpecs" label="商品规格" />
            <el-table-column prop="goodsCount" label="数量" />
            <el-table-column prop="goodsVolume" label="体积" />
            <el-table-column prop="goodsWeight" label="重量" />
            <el-table-column prop="33333" label="实际发生日期" />
            <el-table-column prop="realCount" label="实际发生数量">
                <template v-slot="scope">
                    <el-input v-model.number="scope.row.realCount"></el-input>
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
import { replenishmentkDetail, replenishmentkConfirm } from '@/api/oms/index'
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
    billType: '',
    purchaseBillNo: '',
    warehousingNo: '',
    senderNo: '',
    senderName: '',
    senderContacts: '',
    senderContactInformation: '',
    senderAddress: '',
    receiverNo: '',
    receiverName: '',
    receiverContacts: '',
    receiverContactInformation: '',
    receiverAddress: '',
    sumCount: '',
    sumVolume: '',
    sumWeight: ''
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
        billNo: props.id,
        appKey: '', // 系统编号
        busiCode: '' // 业务线编号
    }
    const { data, count } = await replenishmentkDetail(params)
    form.billType = data.billType
    form.purchaseBillNo = data.purchaseBillNo
    form.warehousingNo = data.warehousingNo
    form.senderNo = data.senderNo
    form.senderName = data.senderName
    form.senderContacts = data.senderContacts
    form.senderContactInformation = data.senderContactInformation
    form.senderAddress = data.senderAddress
    form.receiverNo = data.receiverNo
    form.receiverName = data.receiverName
    form.receiverContacts = data.receiverContacts
    form.receiverContactInformation = data.receiverContactInformation
    form.receiverAddress = data.receiverAddress
    form.sumCount = data.sumCount
    form.sumVolume = data.sumVolume
    form.sumWeight = data.sumWeight
    tableData.value = data.details
    dataState.pageinfo.total = count
}
// 提交
const confirm = async () => {
    const details = []
    const arr = tableData.value
    for (let i = 0; i < arr.length; i++) {
        details.push({
            goodsNo: arr[i].goodsNo,
            realCount: arr[i].realCount
        })
    }
    const params = {
        billNo: form.purchaseBillNo,
        realDatetime: new Date().getTime(),
        details: details,
        appKey: '', // 系统编号
        busiCode: '' // 业务线编号
    }
    const res = await replenishmentkConfirm(params)
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
        router.push({ name: 'purchase-replenishment-list' })
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
