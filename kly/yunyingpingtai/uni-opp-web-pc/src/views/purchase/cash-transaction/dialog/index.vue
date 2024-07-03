
<template>
    <div>
        <el-dialog
            v-model="dialogVisible"
            title="团队人员明细"
            width="66%"
            height="1000px"
            @close="close"
        >
            <div>
                <system-list
                    :tHead="tHead"
                    :tableData="tableData"
                    v-model:current-page="pageInfo.currentPage"
                    v-model:page-size="pageInfo.pageSize"
                    :total="pageInfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    @selection-change="handleSelectionChange"
                >
                    <template #memberCount="row">
                        <span style="color: rgb(254, 44, 85);cursor:pointer" @click="toDeatil(row.row)">{{row.row.memberCount}}</span>
                    </template>
                    <template #goodsMediaList="row">
                        <span>{{row.row.goodsMediaList[0].mediaUrl}}</span>
                    </template>
                    <template #CateName="row">
                        <span>{{row.row.CateName}}</span>
                    </template>
                    <template #spuTemplate="row">
                        {{dataState.spuTemplateList.find(el => row.row.spuTemplate === el.template).name}}
                    </template>
                    <template #isHead="row">
                        <span>{{roleList[row.row.isHead]}}</span>
                    </template>
                    <template #memberStatus="row">
                        <span>{{statusList[row.row.memberStatus.toString()]}}</span>
                    </template>
                    <template #imgUrl="scope">
                        <el-image style="width: 100px; height: 100px" preview-teleported :src="scope.row.imgUrl" :preview-src-list="[scope.row.imgUrl]" fit="cover" />
                    </template>
                </system-list>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, computed, defineProps, defineEmits, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { peopledetail } from '@/api/promocodeManagement/index'
import SystemList from '@/composables/TablePagination/index.vue'

const props = defineProps({
    type: String,
    row: {
        type: Object
    },
    visible: {
        type: Boolean
    }
})
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogVisible = ref(props.visible)
const rowdetail = ref(props.row)
// 启用、停用
const statusList = {
    1: '启用', 2: '禁用'
}
const roleList = {
    0: '团员', 1: '团长'
}
onMounted(async () => {
    await peopleDetail()
})
const close = () => {
    emits('dialogVisible', props.visible)
}
const emits = defineEmits(['dialogVisible'])
const visible = ref(false)
const dataState = reactive({
    tableData: [],
    selectList: [],
    skuNumLimitNum: ''
})
const { tableData, selectList } = toRefs(dataState)
const tHead = [
    { align: 'center', type: 'index', label: '序号', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'userId', label: '推广人id', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'isHead', label: '团队角色', minWidth: 120, slot: 'true' },
    { align: 'center', tooltip: true, prop: 'memberName', label: '推广人姓名', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'phoneMobile', label: '推广人手机号', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'promoCode', label: '推广码', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '加入时间', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'memberStatus', label: '状态', minWidth: 100, slot: 'true' }
]
const pageInfo = ref({
    total: null,
    currentPage: 1,
    pageSize: 10
})
const peopleDetail = async () => {
    const param = {
        appKey: 'A1001000',
        teamCode: rowdetail.value.teamCode,
        page: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    }
    const res = await peopledetail(param)
    dataState.tableData = res.data
    pageInfo.value.total = res.count
}
// 页数改变
const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    peopleDetail()
}
// 当前也改变
const currentChange = (val) => {
    pageInfo.value.currentPage = val
    peopleDetail()
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
