<template>
    <div>
        <el-form ref="resetFormData" :model="formData" label-width="120px" :inline="true">
            <!-- <el-form-item label="单据日期" prop="regTime" class="form-item-time">
                <el-date-picker size="default" v-model="formData.regTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" />
            </el-form-item>
            <el-form-item label="单据编号" prop="warehouseCode">
                <el-input v-model="formData.warehouseCode" placeholder="请输入单据编号" />
            </el-form-item>
            <el-form-item label="业务类型" prop="warehouseName">
                <el-select v-model="formData.warehouseName" clearable placeholder="请选择" >
                    <el-option label="全部" value="" />
                    <el-option label="启用" value="1" />
                    <el-option label="禁用" value="2" />
                </el-select>
            </el-form-item>
            <el-form-item label="收款单位" prop="warehouseCode">
                <el-input v-model="formData.warehouseCode" placeholder="请输入单据编号" />
            </el-form-item>
            <el-form-item label="付款状态" prop="warehouseName">
                <el-select v-model="formData.warehouseName" clearable placeholder="请选择" >
                    <el-option label="全部" value="" />
                    <el-option label="启用" value="1" />
                    <el-option label="禁用" value="2" />
                </el-select>
            </el-form-item>
            <el-form-item label="单据状态" prop="warehouseName">
                <el-select v-model="formData.warehouseName" clearable placeholder="请选择" >
                    <el-option label="全部" value="" />
                    <el-option label="启用" value="1" />
                    <el-option label="禁用" value="2" />
                </el-select>
            </el-form-item> -->
            <el-form-item class="button-box">
                <div>
                    <el-button type="primary" v-if="!props.taxNo" @click="getadd">新增</el-button>
                    <el-button type="primary" @click="selectsubmit">选单</el-button>
                    <el-button type="primary" @click="getsave">保存</el-button>
                    <el-button type="primary" @click="getsubmit">提交</el-button>
                    <el-button type="primary" @click="payment">付款情况</el-button>
                    <el-button type="primary" @click="toCertificate">审批情况</el-button>
                    <!-- <el-button type="primary" @click="toCertificate">上传附件</el-button> -->
                </div>
            </el-form-item>
        </el-form>
        <div class="gongdaninfo">
            <!-- <h2>设备信息</h2> -->
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">单据日期：{{taxmsg.taxBillDate}}</div></el-col>
                <el-col :span="8"><div class="height-p">单据编号：{{taxmsg.taxNo}}</div></el-col>
                <!-- <el-col :span="8">
                    <div class="height-p">
                        <el-form-item label="单据编号：">
                            <el-input v-model="detailData.taxNo" placeholder="请输入单据编号" type="input"/>
                        </el-form-item>
                    </div>
                </el-col> -->
                <!-- <el-col :span="8"><div class="height-p">发票类型：{{detailData.taxType}}</div></el-col> -->
                <el-col :span="8">
                    <div class="height-p">
                        <el-form-item label="发票类型：">
                            <el-select v-model="detailData.taxType" placeholder="请选择～" >
                                <el-option label="普通发票" :value="1"/>
                                <el-option label="专用发票" :value="2"/>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <!-- <el-col :span="8"><div class="height-p">发票号：{{detailData.merchantNo}}</div></el-col> -->
                <el-col :span="8">
                    <div class="height-p">
                        <el-form-item label="发票号：">
                            <el-input v-model="detailData.merchantNo" placeholder="请输入发票号" type="input"/>
                        </el-form-item>
                    </div>
                </el-col>
                <!-- <el-col :span="8"><div class="height-p">供应商：{{detailData.merchantName}}</div></el-col> -->
                <el-col :span="8">
                    <div class="height-p">
                        <el-form-item label="供应商：">
                            <el-input v-model="detailData.merchantName" placeholder="请输入供应商" type="input"/>
                        </el-form-item>
                    </div>
                </el-col>
                <!-- <el-col :span="8"><div class="height-p">业务员：{{detailData.merchantBankName}}</div></el-col> -->
                <el-col :span="8">
                    <div class="height-p">
                        <el-form-item label="业务员：">
                            <el-input v-model="detailData.merchantBankName" placeholder="请输入业务员" type="input"/>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <!-- <el-col :span="8"><div class="height-p">使用预付：{{detailData.merchantBankNo}}</div></el-col> -->
                <el-col :span="8">
                    <div class="height-p">
                        <el-form-item label="使用预付：">
                            <el-input v-model="detailData.merchantBankNo" placeholder="请输入使用预付" type="input"/>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-upload
                        class="multiple"
                        action="#"
                        multiple
                        :limit="1"
                        :http-request="fileRequest"
                        :file-list="result.fileList"
                        :on-remove="handleRemove"
                    >
                        <el-button type="primary">上传附件</el-button>
                        <!-- <template #tip>
                            <div class="el-upload__tip">
                                只允许上传一个文件；文件名长度应为3~50之间
                            </div>
                        </template> -->
                    </el-upload>
                </el-col>
            </el-row>
        </div>
        <div class="tableList-area">
            <h2></h2>
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageinfo.page"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #operation="scope">
                    <el-button text @click="toEdit(scope.row.id,'detail')" type="primary">
                        查看详情
                    </el-button>
                </template>
                <template #unitPrice="scope">
                    {{(scope.row.unitPrice/100).toFixed(2)}}元
                </template>
                <template #taxPrice="scope">
                    {{(scope.row.taxPrice/100).toFixed(2)}}元
                </template>
                <template #totalAmount="scope">
                    {{(scope.row.totalAmount/100).toFixed(2)}}元
                </template>
                <template #totalTaxAmount="scope">
                    {{(scope.row.totalTaxAmount/100).toFixed(2)}}元
                </template>
            </system-list>
        </div>
        <div class="gongdaninfo">
            <el-row :gutter="20">
                <el-col :span="16"><div class="height-p">合计：{{detailData.remark}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">制单人：{{taxmsg.makerId}}</div></el-col>
                <el-col :span="8"><div class="height-p">审核时间：{{detailData.payStatusDesc}}</div></el-col>
                <el-col :span="8"><div class="height-p">创建时间：{{detailData.gmtCreate}}</div></el-col>
            </el-row>
        </div>
        <add-dialog  v-if="dialogVisible" :visible ='dialogVisible' :title="comtitle" @clostDialog="clostDialog"></add-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import addDialog from './dialog/invoice.vue'
import { getMerchantListCode } from '@/api/operate/index'
import { ElMessage, ElLoading } from 'element-plus'
import { postUpload } from '@/api/marketing/marketing-cost'
import { useStore } from 'vuex'
const route = useRoute()
const router = useRouter()
const taxno = route.params.taxNo
const store = useStore()
const myCmnType = ref(2)
const userInfo = computed(() => store.state.userInfo)
const props = defineProps(['taxNo', 'num'])
// 支付时间
const querinfo = ref({
    gmtCreate: [],
    payTime: []
})
const formData = ref({})
// 表单数据
const detailData = ref({
    billDate: '',
    payBillNo: '',
    billNo: '',
    businessType: '',
    merchantNo: '',
    merchantName: '',
    merchantBankName: '',
    merchantBankNo: '',
    dept: '',
    operater: '',
    projectName: '',
    discount: '',
    purchaseNo: '',
    applyTotalAmount: '',
    payTotalAmount: '',
    payInstr: '',
    realTotalAmount: '',
    payWays: '',
    payAccount: '',
    remark: '',
    billMakerId: '',
    payStatus: '',
    enclosure: [],
    attachUrl: '',
    fileList: []

})
const pageinfo = reactive({
    page: 1,
    pageSize: 10,
    total: ''
})
const dialogVisible = ref(false)
const handleType = ref('')
const kuid = ref('')
// 表格数据
// const detailData = ref({})
const tableData = ref([])
const tHead = [
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuCode', label: '商品编码', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'unit', label: '采购单位', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'quantity', label: '数量', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'unitPrice', label: '单价', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'taxRate', label: '税率', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'taxPrice', label: '含税单价', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'totalAmount', label: '金额', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'totalTaxAmount', label: '含税金额', minWidth: 100, slot: true }
]
// 重置按钮功能
const resetFormData = ref(null)
const resetForm = () => {
    resetFormData.value.resetFields()
}

// 搜索按钮
const search = () => {
    pageinfo.page = 1
    getOrderList()
}
onMounted(async () => {
    if (props.taxNo) {
        await getOrderList()
    }
    // await getOrderList()
})
// 接口请求数据
const getOrderList = async () => {
    if (taxno !== '') {
        const params = {
            body: {
                taxNo: taxno
            },
            appKey: 'A1001001',
            busiCode: 'A1001006',
            configCode: 'UC66526299290357760',
            name: '发票详情',
            source: '采销财务系统'
        }
        const res = await getMerchantListCode(params)
        if (res.code === '200') {
            detailData.value = res.data
            taxmsg.value.taxBillDate = res.data.taxBillDate
            taxmsg.value.taxNo = res.data.taxNo
            // detailData.value.billNo = res.data.taxNo
            // tableData.value = res.data.purchaseInfos
        }
    }
    // const params = {
    //     body: {
    //         taxNo: taxno
    //     },
    //     appKey: 'A1001001',
    //     busiCode: 'A1001006',
    //     configCode: 'UC66526299290357760',
    //     name: '发票详情',
    //     source: '采销财务系统'
    // }
    // const res = await getMerchantListCode(params)
    // if (res.code === '200') {
    //     detailData.value = res.data
    //     // detailData.value.billNo = res.data.taxNo
    //     // tableData.value = res.data.purchaseInfos
    // }
}
const tax = ref('')
const taxmsg = ref({
    taxNo: '',
    taxBillDate: '',
    makerId: ''
})
watch(() => tax.value,
    (val) => {
        taxmsg.value.taxNo = val.taxNo
        taxmsg.value.taxBillDate = val.taxBillDate
        taxmsg.value.makerId = val.makerId
    },
    {
        deep: true
    })
// 接口请求数据
// const taxno = ref('')
const getadd = async () => {
    const params = {
        body: {
            makerId: store.state.userInfo.name
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC64752719814324224',
        name: '发票新增',
        source: '采销财务系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        ElMessage({
            type: 'success',
            message: '新增成功'
        })
        tax.value = res.data
    }
}
// 付款单保存
const getsave = async () => {
    const params = {
        body: {
            ...detailData.value,
            ...taxmsg.value
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC64751167804403712',
        name: '发票保存',
        source: '采销财务系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        ElMessage({
            type: 'success',
            message: '保存成功'
        })
    }
}
// 付款单提交
const getsubmit = async () => {
    const params = {
        body: {
            ...detailData.value,
            ...taxmsg.value
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC64752462401499136',
        name: '发票提交',
        source: '采销财务系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        ElMessage({
            type: 'success',
            message: '提交成功'
        })
    }
}
// 付款单凭证
const getupload = async () => {
    const params = {
        body: {
            approvalBillNo: '',
            approvalType: ''
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC64759820322205696',
        name: '审批情况',
        source: '采销财务系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        detailData.value = res.data
    }
}
// const add = (type) => {
//     dialogVisible.value = true
//     handleType.value = type
// }
const toEdit = (id, type) => {
    dialogVisible.value = true
    handleType.value = type
    kuid.value = id
}
// onMounted(async () => {
//     // await getOrderList()
// })

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
// 付款凭证
const toCertificate = () => {
    // router.push({ name: 'certificate', params: { billNo: billno } })
}
const comtitle = ref('采购入库单')
const selectsubmit = () => {
    comtitle.value = '采购入库单'
    dialogVisible.value = true
}
const payment = () => {
}
// 上传文件
const result = reactive({
    fileList: [],
    hideUpload: false,
    isLoading: false
})
const loadingInstance = ref(null)
const fileRequest = async (file) => {
    const formData = new FormData()
    formData.append('file', file.file)
    if (!props.watermark) {
        loadingInstance.value = ElLoading.service({
            lock: true,
            text: '附件上传中...',
            background: 'rgba(0, 0, 0, 0.3)'
        })
        result.isLoading = true
        const res = await postUpload(formData)
        if (res.code === '200') {
            detailData.value.attachUrl = res.data
            loadingInstance.value.close()
            result.isLoading = false
        } else {
            result.fileList = []
            detailData.value.attachUrl = ''
            loadingInstance.value.close()
            result.isLoading = false
        }
    }
}
// 删除图片
const handleRemove = () => {
    result.fileList = []
    detailData.value.attachUrl = ''
}
const clostDialog = (val, data) => {
    dialogVisible.value = false
    if (data) {
        tableData.value = data[0].productList
        // data[0].productList.totalAmount = data[0].productList.unitPrice * data[0].productList.quantity
        // data[0].productList.totalTaxAmount = data[0].productList.taxPrice * data[0].productList.quantity
        // debugger
        detailData.value = data[0]
    }
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
