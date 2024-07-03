
<template>
    <div>
        <el-dialog
            v-model="dialogVisible"
            :title="title"
            width="900px"
            height="1000px"
            @close="close"
            draggable
        >
            <el-table v-if="title === '审批进度'" :data="detailData" style="width: 100%">
                <el-table-column prop="approvalDate" label="日期"  />
                <el-table-column prop="approvalUser" label="审批人"  />
                <el-table-column prop="approvalStatusDesc" label="审批情况" />
                <el-table-column prop="approvalInfo" label="批语"/>
            </el-table>
            <el-table v-else :data="detailData" style="width: 100%">
                <el-table-column prop="payBillNo" label="单据编号" />
                <el-table-column prop="payBillDate" label="单据日期" />
                <el-table-column prop="gmtCreate" label="审批日期" />
                <el-table-column prop="realTotalAmount" label="付款金额" />
                <el-table-column prop="discount" label="折让" />
            </el-table>
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, computed, defineProps, defineEmits, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMerchantListCode } from '@/api/operate/index'

const props = defineProps({
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
const store = useStore()
const myCmnType = ref(2)
const userInfo = computed(() => store.state.userInfo)
const dialogVisible = ref(props.visible)
// const ruleFormRef = ref()
// const tableData = ref([])
const close = () => {
    emits('clostDialog', props.visible)
}
const emits = defineEmits(['clostDialog'])
const visible = ref(false)
const dataState = reactive({
    tableData: [],
    selectList: [],
    skuNumLimitNum: ''
})
const { tableData, selectList } = toRefs(dataState)
onMounted(async () => {
    if (props.title === '审批进度') {
        await getupload()
    } else {
        await getapply()
    }
})
const detailData = ref([])
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
        // console.log(res.data)
        res.data.list.map(item => {
            item.discount = (item.discount / 100).toFixed(2)
            item.realTotalAmount = (item.realTotalAmount / 100).toFixed(2)
            return item
        })
        detailData.value = res.data.list
    }
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
</style>
