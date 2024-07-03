
<template>
    <div>
        <el-dialog
            v-model="dialogVisible"
            :title="title"
            width="900px"
            height="1000px"
            @close="clostDialog"
            draggable
        >
            <div style="display:flex">
                <el-input v-model="purchaseNo" placeholder="请输入采购单据编号" clearable/>
                <el-button @click="getseach()" type="primary">查询</el-button>
                <!-- <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="联系人姓名" prop="contactName" :rules = "rules.contactName">
                            <el-input v-model="formData.contactName" :rules = "rules.contactName" placeholder="请输入联系人姓名" clearable />
                        </el-form-item>
                    </el-col>
                </el-row> -->
            </div>
            <!-- <div class="list-title">
                <h3>采购入库单表头</h3>
                <el-table :data="detailData" style="width: 100%">
                    <el-table-column prop="approvalDate" label="单据日期"  />
                    <el-table-column prop="approvalUser" label="采购单据编号"  />
                    <el-table-column prop="approvalStatusDesc" label="采购入库单据编号" />
                    <el-table-column prop="approvalInfo" label="供应商名称"/>
                    <el-table-column prop="approvalInfo" label="详情"/>
                    <template #approvalInfo="scope">
                        <el-button text @click="toEdit(scope.row.id,'detail')" type="primary">
                            查看详情
                        </el-button>
                    </template>
                </el-table>
            </div> -->
            <div class="tableList-area">
                <h3>采购入库单表头</h3>
                <system-list
                    :tHead="tHead"
                    :tableData="tableData"
                    v-model:current-page="pageinfo.page"
                    v-model:page-size="pageinfo.pageSize"
                    :total="pageinfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    @selection-change="handleSelectionChange"
                >
                    <template #operation="scope">
                        <el-button type="primary" @click="toDetail(scope.row.warehousingNo)">
                            查看详情
                        </el-button>
                    </template>
                </system-list>
            </div>
            <div class="list-title">
                <h3>采购入库单明细</h3>
                <el-table :data="detailData" style="width: 100%">
                    <el-table-column prop="skuId" label="仓库" />
                    <el-table-column prop="skuName" label="名称" />
                    <el-table-column prop="skuId" label="商品名称" />
                    <el-table-column prop="unit" label="采购单位" />
                    <el-table-column prop="quantity" label="数量" />
                    <el-table-column prop="skuName" label="含税单价" />
                    <el-table-column prop="skuName" label="含税金额" />
                </el-table>
            </div>
            <div style="margin: 20px auto">
                <el-button @click="clostDialog()" type="primary">取消</el-button>
                <el-button @click="sureBtn(formRef)" type="primary">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, computed, defineProps, defineEmits, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMerchantListCode } from '@/api/operate/index'
import SystemList from '@/composables/TablePagination/index.vue'

const props = defineProps({
    type: String,
    currentVal: {
        type: Object,
        default: () => {}
    },
    visible: {
        type: Boolean,
        default: false
    },
    title: {
        type: String
    },
    id: {
        type: String
    }
})
const pageinfo = reactive({
    page: 1,
    pageSize: 10,
    total: ''
})
// const contitle = ref('')
const store = useStore()
const myCmnType = ref(2)
const userInfo = computed(() => store.state.userInfo)
const dialogVisible = ref(props.visible)
const tableData = ref([])
const tHead = [
    { align: 'center', tooltip: true, type: 'selection', minWidth: 60 },
    { align: 'center', tooltip: true, prop: 'approvalDate', label: '单据日期', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'purchaseNo', label: '采购单据编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'warehousingNo', label: '采购入库单据编号', minWidth: 150 },
    // { align: 'center', tooltip: true, prop: 'approvalInfo', label: '供应商名称', minWidth: 200, slot: true },
    // { align: 'center', tooltip: true, prop: 'warehousingNo', label: '详情', minWidth: 100 }
    { align: 'center', tooltip: true, prop: 'operation', label: '详情', minWidth: 130, slot: true }

]
// const visible = ref(false)
const dataState = reactive({
    selectList: [],
    skuNumLimitNum: ''
})
const { selectList } = toRefs(dataState)
onMounted(async () => {
    // await getupload()
})
const detailData = ref([])
const purchaseNo = ref('')
const getseach = async () => {
    const params = {
        body: {
            purchaseNo: purchaseNo.value
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UCJH65492882638503936',
        name: '根据采购单查询采购入库单聚合',
        source: '运营后台'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        tableData.value = res.data
    }
}
const toDetail = async (val) => {
    const params = {
        body: {
            warehousingNo: val
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UCJH65492882638503936',
        name: '根据采购单查询采购入库单聚合',
        source: '运营后台'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        detailData.value = res.data[0].productList
    }
}
// 付款申请单审批
const getupload = async () => {
    const params = {
        body: {
            approvalBillNo: props.id,
            approvalType: 1
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
// 审批情况
const getapply = async () => {
    const params = {
        body: {
            billNo: props.id
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC64758429075763200',
        name: '付款单列表查询',
        source: '采销财务系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        detailData.value = res.data
    }
}
// 全选
const selectlist = ref([])
const handleSelectionChange = (val) => {
    selectlist.value = val
    console.log(selectlist.value, ' spuIdsList.value')
}
const sureBtn = async () => {
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
        detailData.value = res.data
        emit('clostDialog', props.visible, selectlist.value)
    }
}
// 关闭弹窗
const clostDialog = () => {
    // dialogVisible.value = false
    emit('clostDialog', props.visible)
}
const emit = defineEmits(['clostDialog'])
// 当前页数改变
const currentChange = (val) => {
    pageinfo.page = val
    getseach()
}
const sizeChange = (val) => {
    pageinfo.page = 1
    pageinfo.pageSize = val
    getseach()
}
</script>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
.avatar-uploader .el-upload{
    width: 200px;
    height: 200px;
}

.avatar-uploader{
    width: 300px;
    height: 300px;
}
.el-form-item{
    display: flex;
}
.sku-btns{
    margin: 0 auto;
    width: fit-content;
    margin-top: 20px;
}
img{
    width: 120px;
}
.list-title{
    margin-top: 20px;
}
</style>
