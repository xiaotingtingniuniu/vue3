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
                    <el-button type="primary" @click="getsave">保存</el-button>
                    <el-button type="primary" @click="getsubmit">提交</el-button>
                    <!-- <el-button type="primary" @click="add('add')">上传附件</el-button> -->
                    <el-button type="primary" @click="toCertificate">凭证情况</el-button>
                    <el-button type="primary" v-if="detailData.payWays === 2" @click="queryPayOrder()">支付</el-button>
                </div>
            </el-form-item>
        </el-form>
        <div class="gongdaninfo">
            <!-- <h2>设备信息</h2> -->
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">单据日期：{{detailData.billDate}}</div></el-col>
                <el-col :span="8"><div class="height-p">单据编号：{{detailData.payBillNo}}</div></el-col>
                <el-col :span="8"><div class="height-p">业务类型：{{detailData.businessTypeDesc}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">收款单位编号：{{detailData.merchantNo}}</div></el-col>
                <el-col :span="8"><div class="height-p">收款单位：{{detailData.merchantName}}</div></el-col>
                <el-col :span="8"><div class="height-p">对方开户银行：{{detailData.merchantBankName}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">对方账号：{{detailData.merchantBankNo}}</div></el-col>
                <el-col :span="8"><div class="height-p">部门：{{detailData.dept}}</div></el-col>
                <el-col :span="8"><div class="height-p">业务员：{{detailData.operater}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">项目：{{detailData.projectName}}</div></el-col>
                <el-col :span="8"><div class="height-p">折让：{{(detailData.discount/100).toFixed(2)}}</div></el-col>
                <el-col :span="8"><div class="height-p">付款申请单号：<span style="color:rgb(254, 44, 85);cursor:pointer" @click="toDetail">{{detailData.billNo}}</span></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">申请付款总额：{{(detailData.applyTotalAmount/100).toFixed(2)}}</div></el-col>
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
        <div class="tableList-area" style="margin-top: 20px">
            <h3>结算明细</h3>
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageinfo.page"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #realTotalAmount="scope">
                    <!-- {{scope.row.realTotalAmount}} -->
                    <el-input v-model="scope.row.realTotalAmount" placeholder="请输入金额"/>
                </template>
            </system-list>
        </div>
        <div class="gongdaninfo">
            <el-row :gutter="20">
                <el-col :span="16"><div class="height-p">
                    <el-form-item label="备注：">
                        <el-input v-model="detailData.remark" placeholder="请输入付款说明" :rows="1" type="textarea"/>
                    </el-form-item></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">制单人：{{detailData.makerId}}</div></el-col>
                <el-col :span="8"><div class="height-p">付款状态：{{detailData.payStatusDesc}}</div></el-col>
                <el-col :span="8"><div class="height-p">创建时间：{{detailData.gmtCreate}}</div></el-col>
            </el-row>
        </div>
        <add-dialog  v-if="dialogVisible" :visible ='dialogVisible' @handleClose="dialogVisible = false" :title="comtitle" :id="kuid"></add-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import addDialog from '../storehouse-owner/comments/index.vue'
import { getMerchantListCode } from '@/api/operate/index'
import { ElMessage, ElLoading } from 'element-plus'
import { postUpload } from '@/api/marketing/marketing-cost'
const route = useRoute()
const router = useRouter()
const billno = route.params.billNo
const props = defineProps(['billNo', 'type'])
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
    { align: 'center', tooltip: true, prop: 'realTotalAmount', label: '付款金额', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'payWaysDesc', label: '付款方式', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'payAccount', label: '付款账号', minWidth: 200 }
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

// 接口请求数据
const getOrderList = async () => {
    const params = {
        body: {
            payBillNo: billno
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC64758917825425408',
        name: '付款单明细查询',
        source: '采销财务系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        detailData.value = res.data
        detailData.value.realTotalAmount = (res.data.realTotalAmount / 100).toFixed(2)
        tableData.value.push(res.data)
    }
}
// 付款单保存
const getsave = async () => {
    const params = {
        body: {
            ...detailData.value
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC64758664837591040',
        name: '付款单保存',
        source: '采销财务系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        detailData.value = res.data
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
            ...detailData.value
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC64758179531452416',
        name: '付款单提交',
        source: '采销财务系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        detailData.value = res.data
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
const add = (type) => {
    dialogVisible.value = true
    handleType.value = type
}
const toEdit = (id, type) => {
    dialogVisible.value = true
    handleType.value = type
    kuid.value = id
}
onMounted(async () => {
    await getOrderList()
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
// 付款凭证
const toCertificate = () => {
    router.push({ name: 'certificate', params: { billNo: billno } })
}
const toDetail = () => {
    router.push({ name: 'payment-application-detail', params: { billNo: billno } })
}
const comtitle = ref('')
const approval = () => {
    comtitle.value = '审批进度'
    dialogVisible.value = true
    kuid.value = detailData.value.billNo
}
const payment = () => {
    comtitle.value = '付款情况'
    dialogVisible.value = true
    kuid.value = detailData.value.billNo
}

// 支付
const queryPayOrder = async () => {
    const params = {
        body: {
            payBillNo: billno
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC64752994193108992',
        name: '付款单付款',
        source: '采销财务系统'
    }
    // toPay()
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        const payOrder = res.data.preNo
        const successUrl = window.location.href
        const backUrl = window.location.href
        window.location.href = `https://test-h5pay.hengshenghuo.com/pcpay/${payOrder}?successUrl=${successUrl}&backUrl=${backUrl}&hideTitle=1`
    }
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
</script>

<style lang="scss" scoped>
.button-box {
    display: flex;
    div {
        flex: 1;
    }
}
</style>
