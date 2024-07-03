<template>
    <div class="work-order-container">
        <el-dialog v-model="dialogVisible"  :before-close="handleClose" title="">
            <div class="gongdaninfo">
                <el-row :gutter="20">
                    <el-col :span="8"><div class="height-p">商家名称：{{detail.merchantName}}</div></el-col>
                    <el-col :span="8"><div class="height-p">SKU编号:{{detail.skuId}}</div></el-col>
                    <el-col :span="8"><div class="height-p">sku名称:{{detail.skuName}}</div></el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8"><div class="height-p">品牌名称:{{detail.gtmCreator}}</div></el-col>
                    <el-col :span="8"><div class="height-p">基础分类：{{detail.category}}</div></el-col>
                    <el-col :span="8"><div class="height-p">商品条形码：{{detail.workStatus === 0?'待处理':detail.workStatus === 1?'已完成':'已取消'}}</div></el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8"><div class="height-p">口味：{{detail.taste}}</div></el-col>
                    <el-col :span="8"><div class="height-p">商品毛重(g):{{detail.custAppealType === 1?'商品/包装破损':detail.custAppealType === 2?'商品变质/有异味':detail.custAppealType === 3?'订单金额有误':detail.custAppealType === 4?'手动补扣':'其他'}}</div></el-col>
                    <el-col :span="8"><div class="height-p">包装规格{{detail.dealName}}</div></el-col>
                </el-row>
                <!-- <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">包装：{{detail.workType === 0?'退款':'补款'}}</div></el-col>
                <el-col :span="8"><div class="height-p">贮存方式：{{detail.custAppealType === 1?'商品/包装破损':detail.custAppealType === 2?'商品变质/有异味':detail.custAppealType === 3?'订单金额有误':detail.custAppealType === 4?'手动补扣':'其他'}}</div></el-col>
                <el-col :span="8"><div class="height-p">规格：{{detail.dealName}}</div></el-col>
            </el-row> -->
                <el-row :gutter="20">
                    <el-col :span="8"><div class="height-p">保质期天数：{{detail.workType === 0?'退款':'补款'}}</div></el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10"><div class="height-p">
                        缩略图： <img :src="detail.thumbnail" alt="" style="width: 100px" />
                    </div></el-col>
                </el-row>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleClose" v-if="props.type!=='2'">取消 </el-button>
                    <el-button type="primary" @click="cancel('3')" v-if="props.type==='2'">拒绝 </el-button>
                    <el-button type="primary" @click="send()" >确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import TotalTable from '@/composables/TablePagination/totalTable.vue'
import { refundDetail, approvalRefund } from '@/api/refund/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { skuUpDown } from '@/api/operate'
import { useRouter } from 'vue-router'
const router = useRouter()

const tableDataOrder = ref([])
const tableDataAudit = ref([])
const tableDataRefund = ref([])
const imglist = ref([])
const dialogCancel = ref(false)
const reasonSubmit = ref(false)
const reasonDis = ref(false)

const cancelReason = ref('')
const accountData = ref({})
const form = ref({
    cancelReason: ''
})
// const props = defineProps(['skuId', 'isEnable'])

const props = defineProps({
    visible: {
        type: Boolean
    },
    rowList: {
        type: Object
    },
    type: {
        type: String
    }
})
console.log(props.type, '009767')
const detail = ref(props.rowList)
const dialogVisible = ref(props.visible)
const rules = {
    cancelReason: [{ required: true, message: '请填写拒绝原因', trigger: 'blur' }]
}

onMounted(async () => {
    // await getOrderDetail()
})

const cancel = async (type) => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001004',
            skuId: detail.value.skuId,
            skuStatus: type
        },
        appKey: 'A1001001',
        busiCode: 'A1001004',
        configCode: 'UC1657692738255kIpRi',
        name: 'sku审核',
        source: '商品中台'
    }
    await skuUpDown(params)
    ElMessage.success('成功')
    handleClose()
    emit('fevent')
}
const send = async () => {
    const params = {
        body: {
            skuId: detail.value.skuId,
            skuStatus: props.type
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC1657692738255kIpRi',
        name: 'sku审核',
        source: '商品中台'
    }
    await skuUpDown(params)
    ElMessage.success('成功')
    handleClose()
    emit('fevent')
}

const emit = defineEmits(['handleClose', 'fevent'])
const handleClose = () => {
    emit('handleClose', props.visible)
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
        margin-top:40px
    }

    :deep(.el-input .el-input__inner) {
        color:red;
        text-align: center
    }
    :deep(.el-table .el-table__footer-wrapper .cell){
        font-weight: 600;
        color: red;
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
}
</style>
