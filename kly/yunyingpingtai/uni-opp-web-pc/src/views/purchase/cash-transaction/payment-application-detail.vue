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
            <el-form-item class="button-box" v-if="props.type !=='detail'">
                <div>
                    <el-button :disabled="disabledButton" type="primary" @click="getsave">保存</el-button>
                    <el-button :disabled="disabledButton" type="primary" @click="getsubmit">提交</el-button>
                    <el-button :disabled="disabledButton" type="primary" @click="examine">审核</el-button>
                    <el-button type="primary" @click="paymentDoc">生成付款单</el-button>
                    <el-button type="primary" @click="approval()">审批情况</el-button>
                    <el-button type="primary" @click="payment()">付款情况</el-button>
                    <el-button :disabled="disabledButton" type="primary" @click="add('add')">上传附件</el-button>
                </div>
            </el-form-item>
        </el-form>
        <div class="gongdaninfo">
            <!-- <h2>设备信息</h2> -->
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">单据日期：{{detailData.billDate}}</div></el-col>
                <el-col :span="8"><div class="height-p">单据编号：{{detailData.billNo}}</div></el-col>
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
                <!-- <el-col :span="8"><div class="height-p">折让：{{(detailData.discount/100).toFixed(2)}}</div></el-col> -->
                <el-col :span="8">
                    <el-form-item label="折让：">
                        <el-input v-model="modeldata.discount" placeholder="请输入折让" :max="1"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8"><div class="height-p">采购订单号：{{detailData.purchaseNo}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">申请付款总额：{{(detailData.applyTotalAmount/100).toFixed(2)}}</div></el-col>
                <el-col :span="8"><div class="height-p">累计支付金额：{{(detailData.payTotalAmount/100).toFixed(2)}}</div></el-col>
                <!-- <el-col :span="8"><div class="height-p">付款说明：{{detailData.payTotalAmount}}</div></el-col> -->
                <el-col :span="8">
                    <el-form-item label="付款说明：">
                        <el-input v-model="modeldata.payInstr" placeholder="请输入付款说明" :rows="1" type="textarea"/>
                    </el-form-item>
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
        <div class="tableList-area" style="margin-top: 20px">
            <h3>付款申请明细</h3>
            <el-table :data="tableData" align="center" stripe  :cell-style="changeCellStyle">

                <el-table-column prop="realTotalAmount" label="付款金额" align="center" :show-overflow-tooltip="true">
                    <template v-slot="scope">
                        <span>{{(scope.row.realTotalAmount/100).toFixed(2)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="payWays" label="付款方式" align="center">
                    <template v-slot="scope">
                        <el-select v-model="scope.row.payWays" placeholder="请选择～" >
                            <el-option label="线下付款" :value="1"/>
                            <el-option label="钱包支付" :value="2"/>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="payAccount" label="付款账号" align="center">
                    <template v-slot="scope">
                        <span>{{scope.row.payAccount}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageinfo.page"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
            </system-list> -->
        </div>
        <div class="gongdaninfo">
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">制单人：{{detailData.makerId}}</div></el-col>
                <el-col :span="8"><div class="height-p">付款状态：{{detailData.payStatusDesc}}</div></el-col>
                <el-col :span="8"><div class="height-p">创建时间：{{detailData.gmtCreate}}</div></el-col>
            </el-row>
        </div>
        <add-dialog  v-if="dialogVisible" :visible ='dialogVisible' @clostDialog="dialogVisible = false" :title="comtitle" :id="kuid"></add-dialog>
    </div>
    <el-dialog
        v-model="dialogCancel"
        width="40%"
        title="审批"
    >
        <div style="font-size: 18px;width: 100%;text-align: left;margin: 0px 10px 20px 0px">批语：长度限于200字以内</div>
        <el-input v-model="modeldata.reviewInfo" placeholder="请输入审批" :rows="2" type="textarea"/>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="submitReason(ruleFormRef)"
                >同意</el-button
                >
                <el-button type="primary" @click="rejectReason(ruleFormRef)">驳回制单人</el-button>
                <el-button @click="dialogCancel = false">关闭</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import AddDialog from './dialog/form.vue'
import { getMerchantListCode } from '@/api/operate/index'
import { ElMessage, ElLoading } from 'element-plus'
import { useStore } from 'vuex'
import { postUpload } from '@/api/marketing/marketing-cost'
const route = useRoute()
const router = useRouter()
const store = useStore()
const billno = route.params.billNo
const props = defineProps(['billNo', 'type'])
const userInfo = computed(() => store.state.userInfo)
// 支付时间
const querinfo = ref({
    gmtCreate: [],
    payTime: []
})
// 0：未支付；1：部分支付；2：已支付
// 1.现金，2:账户
const paytype = {
    1: '现金', 2: '账户'
}
const paystatus = {
    0: '未支付', 1: '部分支付', 2: '已支付'
}
// 表单数据
const formData = ref({
    billNo: ''

})
const modeldata = ref({
    projectName: '',
    payTotalAmount: '',
    reviewInfo: ''
})
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
watch(() => detailData.value.payWays,
    (val) => {
        if (detailData.value.payWays === 2) {
            detailData.value.payAccount = '-1'
        } else {
            detailData.value.payAccount = '622909427788992311'
        }
    },
    {
        deep: true
    })
const disabledButton = ref(false)
const dialogVisible = ref(false)
const handleType = ref('')
const kuid = ref('')
// 表格数据
const tableData = ref([])
const tHead = [
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'realTotalAmount', label: '付款金额', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'payWays', label: '付款方式', minWidth: 200, slot: true },
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
            billNo: billno
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC64757731726585856',
        name: '付款申请单详情查询',
        source: '采销财务系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        detailData.value = res.data
        if (detailData.value.billStatusDesc === '已审核' || detailData.value.billStatusDesc === '审核中') {
            disabledButton.value = true
        }
        modeldata.value.projectName = res.data.projectName
        modeldata.value.payInstr = res.data.payInstr
        modeldata.value.discount = res.data.discount
        tableData.value = []
        tableData.value.push(res.data)
    }
}
// 付款申请单保存
const getsave = async () => {
    const params = {
        body: {
            billNo: detailData.value.billNo,
            discount: modeldata.value.discount,
            payWays: detailData.value.payWays,
            payInstr: modeldata.value.payInstr,
            payAccount: detailData.value.payAccount
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC64753907737686016',
        name: '付款申请单保存',
        source: '采销财务系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        ElMessage({
            type: 'success',
            message: '保存成功'
        })
        getOrderList()
    }
}
const isshow = ref(true)
// 付款申请单提交
const getsubmit = async () => {
    const params = {
        body: {
            billNo: detailData.value.billNo,
            discount: modeldata.value.discount,
            payWays: detailData.value.payWays,
            payInstr: modeldata.value.payInstr,
            payAccount: detailData.value.payAccount
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC64755317246128128',
        name: '付款申请单提交',
        source: '采销财务系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        ElMessage({
            type: 'success',
            message: '提交成功'
        })
        isshow.value = false
    }
}
// // 付款申请单审批
// const getapply = async () => {
//     const params = {
//         body: {
//             billNo: detailData.value.billNo,
//             discount: detailData.value.discount,
//             payWays: detailData.value.payWays,
//             payInstr: detailData.value.payInstr,
//             payAccount: detailData.value.payAccount
//         },
//         appKey: 'A1001001',
//         busiCode: 'A1001006',
//         configCode: 'UC64755086928506880',
//         name: '付款申请单审核',
//         source: '采销财务系统'
//     }
//     const res = await getMerchantListCode(params)
//     if (res.code === '200') {
//         detailData.value = res.data
//         ElMessage({
//             type: 'success',
//             message: '已提交审核'
//         })
//     }
// }
// 生成付款单
const paymentDoc = async () => {
    const params = {
        body: {
            billNo: detailData.value.billNo,
            makerId: store.state.userInfo.name
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC64757959670231040',
        name: '生成付款单',
        source: '采销财务系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        // detailData.value = res.data
        ElMessage({
            type: 'success',
            message: '已生成付款单'
        })
    }
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
const dialogCancel = ref(false)
const examine = () => {
    dialogCancel.value = true
}
const submitReason = async () => {
    // // 付款申请单审批
    const params = {
        body: {
            billNo: detailData.value.billNo,
            // discount: modeldata.value.discount,
            // payWays: detailData.value.payWays,
            // payInstr: modeldata.value.payInstr,
            // payAccount: detailData.value.payAccount
            reviewInfo: modeldata.value.reviewInfo,
            billStatus: 3,
            // operationType: 3,
            reviewer: store.state.userInfo.name
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC64755086928506880',
        name: '付款申请单审核',
        source: '采销财务系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        ElMessage({
            type: 'success',
            message: '已提交审核'
        })
        dialogCancel.value = false
    }
}
const rejectReason = async () => {
    // // 付款申请单审批
    const params = {
        body: {
            billNo: detailData.value.billNo,
            // discount: modeldata.value.discount,
            // payWays: detailData.value.payWays,
            // payInstr: modeldata.value.payInstr,
            // payAccount: detailData.value.payAccount
            reviewInfo: modeldata.value.reviewInfo,
            billStatus: 2,
            // operationType: 2,
            reviewer: store.state.userInfo.name
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC64755086928506880',
        name: '付款申请单审核',
        source: '采销财务系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        ElMessage({
            type: 'success',
            message: '该审核已驳回'
        })
        dialogCancel.value = false
    }
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
