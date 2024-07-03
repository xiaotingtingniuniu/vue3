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
                    <el-form-item label="所属组织" prop="orgName">
                        <el-input v-model="formData.orgName" placeholder="请输入所属组织" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="所属城市" prop="cityName">
                        <el-input v-model="formData.cityName" placeholder="请输入所属城市" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="团队id" prop="teamCode">
                        <el-input v-model="formData.teamCode" placeholder="请输入团队id" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="团长推广码" prop="promoCode">
                        <el-input v-model="formData.promoCode" placeholder="请输入团长推广码" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="团队状态" prop="teamStatus">
                        <el-select v-model="formData.teamStatus" clearable placeholder="请选择" >
                            <el-option label="全部" value="" />
                            <el-option label="启用" value="1" />
                            <el-option label="禁用" value="2" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="创建时间" prop="creatTime">
                        <el-date-picker v-model="querinfo.creatTime" type="datetimerange" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间"  @change="daterangeTime"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form-item class="button-box">
                        <el-button @click="searchList" type="primary">查询</el-button>
                        <el-button @click="resetForm(formRef)" type="primary">重置</el-button>
                        <el-button @click="enableBtn('1')" type="primary">启用</el-button>
                        <el-button @click="disableBtn('2')" type="primary">禁用</el-button>
                        <el-button @click="exportnInfo(formRef)" type="primary">导出</el-button>
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
                <template #goodsReplaceFlag="row">
                    <span>{{rebindingList[row.row.goodsReplaceFlag]}}</span>
                </template>
                <template #goodsStatus="row">
                    <span>{{goodsStatusList[row.row.goodsStatus]}}</span>
                </template>
                <template #imgUrl="scope">
                    <el-image style="width: 100px; height: 100px" preview-teleported :src="scope.row.imgUrl" :preview-src-list="[scope.row.imgUrl]" fit="cover" />
                </template>
            </system-list>
        </div>
    </div>
    <cst-form v-if="dialogVisible" :visible="dialogVisible" :row="rowdata" @dialogVisible="closedialogVisible"></cst-form>
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
</template>
<script setup>
import { ref, computed, onMounted, reactive, toRefs } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { useStore } from 'vuex'
import { allbusiness, teamlist, teameable, teamlistexport } from '@/api/promocodeManagement/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import CstForm from '../dialog/form.vue'
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
const statusList = {
    0: '未推送',
    1: '已推送',
    2: '训练失败',
    3: '训练成功'
}
// 启用、停用
const rebindingList = {
    0: '启用', 1: '停用'
}
const modelStatusList = {
    0: '初始', 1: '训练中', 2: '训练完成', 80: '上新失败', 99: '训练失败'
}
// 1.初始核、2.已审核、3.已拒绝、4.启用、5.停用、6.暂时停用
const goodsStatusList = {
    1: '初始核', 2: '已审核', 3: '已拒绝', 4: '启用', 5: '停用', 6: '暂时停用'
}
// tab 默认值切换
const activeName = ref('fast_food')
const dataState = reactive({
    spuTemplateList: [],
    formData: {
        busiCode: '',
        orgName: '',
        cityName: '',
        promoCode: '',
        teamStatus: '',
        teamCode: '',
        creatTime: ''
    },
    tableData: [],
    dateTime: {
        processTimeSt: '',
        processTimeEn: ''
    }
})
const querinfo = ref({
    creatTime: []
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
    { align: 'center', tooltip: true, prop: 'orgName', label: '所属组织', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'cityName', label: '所属城市', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'teamCode', label: '团队id', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'teamName', label: '团队名称', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'contactName', label: '团长姓名', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'phoneMobile', label: '团长手机号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'promoCode', label: '团长推广码', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '创建时间', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'teamStatusName', label: '团队状态', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'memberCount', label: '团队人员数量', minWidth: 150, slot: true }
]
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
    querinfo.value.creatTime = []
    dataState.dateTime.processTimeSt = ''
    dataState.dateTime.processTimeEn = ''
    getTableList()
}
const daterangeTime = (val) => {
    if (val) {
        querinfo.value.creatTime = val
        dataState.dateTime.processTimeSt = val[0]
        dataState.dateTime.processTimeEn = val[1]
    } else {
        querinfo.value.creatTime = ''
        dataState.dateTime.processTimeSt = ''
        dataState.dateTime.processTimeEn = ''
    }
}
// 查询所有业务线
const businessKeyValue = ref([])
const business = async () => {
    const res = await allbusiness()
    businessKeyValue.value = res.data
}
// 获取SPU列表
const getTableList = async () => {
    const param = {
        appKey: 'A1001000',
        busiCode: dataState.formData.busiCode,
        orgName: dataState.formData.orgName,
        cityName: dataState.formData.cityName,
        promoCode: dataState.formData.promoCode,
        teamStatus: dataState.formData.teamStatus,
        gmtCreateStart: dataState.dateTime.processTimeSt,
        gmtCreateEnd: dataState.dateTime.processTimeEn,
        teamCode: dataState.formData.teamCode,
        page: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    }
    const res = await teamlist(param)
    const resultdata = res.data
    dataState.tableData = resultdata
    pageInfo.value.total = res.count
}
// 启用禁用
const dialogCancel = ref(false)
const indexvalue = ref(0)
const typebtn = ref('')
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
        arrlist.value.push(selectlist.value[i].teamCode)
    }

    if (typebtn.value === '1') {
        const param = {
            appKey: 'A1001001',
            idSet: arrlist.value,
            status: 1,
            modifierId: userInfo.value.name
        }
        await teameable(param)
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
        await teameable(param)
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
const exportnInfo = async () => {
    const params = {
        appKey: 'A1001001', // 系统编号
        busiCode: 'A1001001', // 业务线编号
        configCode: 'UCJH57093671302811648',
        name: '团队列表-人员维度导出',
        source: '运营后台',
        exportType: 7,
        body: {
            ...formData.value
        }
    }
    // await teamlistexport(param)
    const res = await teamlistexport(params)
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })// 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
    let fileName = decodeURI(res.headers['content-disposition'])// 设置文件名称,decodeURI：可以对后端使用encodeURI() 函数编码过的 URI 进行解码。encodeURI() 是后端为了解决中文乱码问题
    if (fileName) { // 根据后端返回的数据处理文件名称
        fileName = fileName.substring(fileName.indexOf('=') + 1)
    }
    const link = document.createElement('a')// 创建一个a标签
    link.download = fileName// 设置a标签的下载属性
    link.style.display = 'none'// 将a标签设置为隐藏
    link.href = URL.createObjectURL(blob)// 把之前处理好的地址赋给a标签的href
    document.body.appendChild(link)// 将a标签添加到body中
    link.click()// 执行a标签的点击方法
    URL.revokeObjectURL(link.href) // 下载完成释放URL 对象
    document.body.removeChild(link)// 移除a标签
}
const dialogVisible = ref(false)
const rowdata = ref('')
const toDeatil = (val) => {
    dialogVisible.value = true
    rowdata.value = val
}
const closedialogVisible = () => {
    dialogVisible.value = false
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
