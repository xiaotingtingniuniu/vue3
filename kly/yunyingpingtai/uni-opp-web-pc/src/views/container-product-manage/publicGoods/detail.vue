<template>
    <div class="work-order-container">
        <el-dialog v-model="dialogVisible"  :before-close="handleClose" width="70%" title="详情">
            <div class="gongdaninfo">
                <el-row :gutter="20">
                    <el-col :span="15"><div class="height-p">所属基础类目：{{detail.firstCateName + '/' + detail.secondCateName + '/' + detail.thirdCateName + '/' + detail.fourthCateName}}</div></el-col>
                </el-row>
                <h3>填写标品属性</h3>
                <el-row :gutter="20">
                    <el-col :span="8"><div class="height-p">品牌名称: &nbsp;{{detail.brandName}}</div></el-col>
                    <el-col :span="8"><div class="height-p">标品名称：&nbsp;{{detail.spuName}}</div></el-col>
                    <el-col :span="8"><div class="height-p">69码：&nbsp;{{detail.barcode}}</div></el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8"><div class="height-p">产地：&nbsp;{{detail.taste ?? '-'}}</div></el-col>
                    <el-col :span="8">
                        <div class="height-p">保质期:&nbsp;{{detail.productShelfLife ?? '-'}}{{detail.productShelfLifeUnit ?? '-'}}</div></el-col>
                    <el-col :span="8"><div class="height-p">商品规格: &nbsp;{{detail.productSpec ?? '-'}}</div></el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <div class="height-p">官方指导价(元): &nbsp;{{detail.guidePrice ?? '-'}}</div>
                        <div class="height-p">包装单位(元): &nbsp;{{detail.packagingUni ?? '-'}}</div>
                        <div class="height-p">存储条件: &nbsp;{{detail.storageStyle ?? '-'}}</div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <div class="height-p">销售渠道: {{detail.saleChannel}}</div>
                    </el-col>
                </el-row>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleClose" v-if="props.type!=='2'">关闭</el-button>
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
    console.log('detail', props.rowList)
    // await getOrderDetail()
})

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
