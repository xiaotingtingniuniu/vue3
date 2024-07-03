<template>
    <div>
        <el-form ref="formRef" :model="formData" :inline="true" label-position="right" label-width="130px">
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="所属业务线" prop="busiCode">
                        <el-select v-model="formData.busiCode" clearable placeholder="请选择" >
                            <el-option v-for="(item, key) in businessKeyValue" :key="key" :label="item.buisName" :value="item.busiCode" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="组织名称" prop="orgName">
                        <el-input v-model="formData.orgName" placeholder="请输入组织名称" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="主体名称" prop="subjectName">
                        <el-input v-model="formData.subjectName" placeholder="请输入主体名称" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="状态" prop="orgStatus">
                        <el-select v-model="formData.orgStatus" clearable placeholder="请选择" >
                            <el-option label="全部" value="" />
                            <el-option label="启用" value="1" />
                            <el-option label="禁用" value="2" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form-item class="button-box">
                        <el-button @click="searchList" type="primary">查询</el-button>
                        <el-button @click="resetForm(formRef)" type="primary">重置</el-button>
                        <el-button @click="newBtn('new')" type="primary">新建</el-button>
                        <el-button @click="editBtn('edit')" type="primary">编辑</el-button>
                        <el-button @click="enableBtn('1')" type="primary">启用</el-button>
                        <el-button @click="disableBtn('2')" type="primary">禁用</el-button>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
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
                <template #spuId="row">
                    <span style="color: rgb(254, 44, 85);cursor:pointer">{{row.row.spuId}}</span>
                </template>
                <template #orgStatus="row">
                    <span>{{orgStatusList[row.row.orgStatus]}}</span>
                </template>
                <template #imgUrl="scope">
                    <el-image style="width: 100px; height: 100px" preview-teleported :src="scope.row.imgUrl" :preview-src-list="[scope.row.imgUrl]" fit="cover" />
                </template>
                <template #saleChannel="row">
                    <span>{{formatValue(row.row.saleChannel) }}</span>
                    <!-- <span v-if="row.row.modelList">{{modelStatusList[row.row.modelList[0]?.modelStatus]}}</span>
                    <span v-else>--</span> -->
                </template>
            </system-list>
        </div>
    </div>
    <el-dialog
        v-model="dialogCancel"
        width="40%"
    >
        <div style="font-size: 18px;width: 100%;text-align: left;margin: 0px 10px 20px 0px">是否{{typebtn === '1' ? '启' : '禁'}}用所选数据，共{{indexvalue}}条</div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogCancel = false">关闭</el-button>
                <el-button type="primary" @click="submitReason(ruleFormRef)"
                >确认</el-button
                >
            </span>
        </template>
    </el-dialog>
    <edit-detail v-if="dialogVisible" :visible="dialogVisible" :title="Title" :rowList="rowList" @clostDialog="clostDialog"></edit-detail>
</template>
<script setup>
import { ref, computed, onMounted, reactive, toRefs } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import EditDetail from './dialog/organization.vue'
import { useStore } from 'vuex'
import { organizationlist, allbusiness, eableorganization } from '@/api/promocodeManagement/index'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const spuId = route.params.spuId
const pageInfo = ref({
    total: null,
    currentPage: 1,
    pageSize: 10
})
const orgStatusList = {
    1: '启用', 2: '禁用'
}
// tab 默认值切换
const activeName = ref('fast_food')
const dataState = reactive({
    spuTemplateList: [],
    formData: {
        busiCode: '',
        orgName: '',
        subjectName: '',
        orgStatus: ''
    },
    tableData: []
})
const { formData, tableData } = toRefs(dataState)
onMounted(async () => {
    await business()
    await getTableList()
})
// 表头
const tHead = [
    { align: 'left', tooltip: true, minWidth: 60, type: 'selection' },
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'busiName', label: '所属业务线', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'orgCode', label: '组织id', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'orgName', label: '组织名称', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'showCity', label: '城市', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'subjectName', label: '主体名称', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'contactName', label: '联系人姓名', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'phoneMobile', label: '联系人手机号', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'cooperateBeginTime', label: '合作开始时间', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'cooperateEndTime', label: '合作结束时间', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'memberCount', label: '推广人员数量', minWidth: 150 },
    // { align: 'center', tooltip: true, prop: 'replaceLogNo', label: '换绑记录编号', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'orgStatus', label: '状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'modifierId', label: '更新人', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'gmtModify', label: '更新时间', minWidth: 150 }
]
const dialogVisible = ref(false)
const Title = ref('')
const newBtn = async (titledata) => {
    dialogVisible.value = true
    Title.value = titledata
}
const rowList = ref('')
const editBtn = async (titledata) => {
    if (selectlist.value.length === 1) {
        dialogVisible.value = true
        Title.value = titledata
        rowList.value = selectlist.value[0]
    } else {
        ElMessage({
            type: 'error',
            message: '请选择一条数据'
        })
    }
}
// 处理数据
const formatValue = (value) => {
    if (!value) return ''
    const reg = /B2B/gi
    const rst = value.toLowerCase().replace(reg, '进货')
    return rst
}
// 搜索数据
const searchList = () => {
    pageInfo.value.currentPage = 1
    getTableList()
}
// 全选
const selectlist = ref([])
const handleSelectionChange = (val) => {
    selectlist.value = val
    console.log(selectlist.value, ' spuIdsList.value')
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getTableList()
}
// 查询所有业务线
const businessKeyValue = ref([])
const business = async () => {
    const res = await allbusiness()
    businessKeyValue.value = res.data
}
// 获取组织列表
const getTableList = async () => {
    const param = {
        appKey: 'A1001000',
        busiCode: dataState.formData.busiCode,
        orgName: dataState.formData.orgName,
        subjectName: dataState.formData.subjectName,
        orgStatus: dataState.formData.orgStatus,
        page: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    }
    const res = await organizationlist(param)
    const resultdata = res.data
    dataState.tableData = resultdata
    pageInfo.value.total = res.count
}
const dialogCancel = ref(false)
const typebtn = ref('')
// 启用禁用
const indexvalue = ref(0)
const enableBtn = (val) => {
    if (selectlist.value.length) {
        dialogCancel.value = true
        indexvalue.value = selectlist.value.length
        typebtn.value = val
    } else {
        ElMessage({
            type: 'error',
            message: '至少选择一条数据'
        })
    }
}
// 启用禁用
const disableBtn = async (val) => {
    if (selectlist.value.length) {
        dialogCancel.value = true
        indexvalue.value = selectlist.value.length
        typebtn.value = val
    } else {
        ElMessage({
            type: 'error',
            message: '至少选择一条数据'
        })
    }
}
const submitReason = async () => {
    const arrlist = ref([])
    for (let i = 0; i < selectlist.value.length; i++) {
        arrlist.value.push(selectlist.value[i].orgCode)
    }
    if (typebtn.value === '1') {
        const param = {
            appKey: 'A1001001',
            idSet: arrlist.value,
            status: 1,
            modifierId: userInfo.value.name
        }
        await eableorganization(param)
        ElMessage({
            type: 'success',
            message: '修改成功'
        })
        dialogCancel.value = false
        getTableList()
    } else {
        const param = {
            appKey: 'A1001001',
            idSet: arrlist.value,
            status: 2,
            modifierId: userInfo.value.name
        }
        await eableorganization(param)
        dialogCancel.value = false
        ElMessage({
            type: 'success',
            message: '修改成功'
        })
        getTableList()
    }
    // const param = {
    //     appKey: 'A1001001',
    //     idSet: arrlist.value,
    //     status: 1,
    //     modifierId: userInfo.value.name
    // }
    // await productenable(param)
    // ElMessage({
    //     type: 'success',
    //     message: '修改成功'
    // })
}
const clostDialog = () => {
    dialogVisible.value = false
    getTableList()
}
// 跳转详情
const toDetail = (row) => {
    const spuId = row.spuId
    router.push({ name: 'spu-management-editor', params: { type: 'publicGoodsDetail', spuTemplate: row.spuTemplate, spuId: row.spuId } })
}
// 编辑
// const editBtn = (row) => {
//     const spuId = row.spuId
//     // router.push({ name: 'spu-management-editor', params: { type: 'edit', spuTemplate: dataState.formData.spuTemplate, spuId: row.spuId } })
//     router.push({ name: 'spu-management-editor', params: { type: 'edit', spuTemplate: row.spuTemplate, spuId: row.spuId } })
// }
// 查看详情
const checkDetail = (row) => {
    router.push({ name: 'spu-model-training-list', params: { goodsId: row.spuId } })
}
// 页数改变
const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    getTableList()
}
// 当前也改变
const currentChange = (val) => {
    pageInfo.value.currentPage = val
    getTableList()
}

</script>
<style lang="scss" scoped>
a{
    text-decoration-line: none;
}
.edit-btn{
    color: #ffffff;
    margin-right: 10px;
}
.text-btn{
    color: rgb(254, 44, 85);
    margin: auto !important;
    cursor:pointer;
}
.db{
    display: block;
}
.content{
    // border-bottom: 1px solid #999999;
    margin-bottom: 10px;
}
.content-btn{
    margin-top: 20px;
    text-align: center;
}
.height-p{
    line-height:30px;
}
.title{
    color: #000000;
    font-weight: bold;
    line-height:40px;
}
</style>
