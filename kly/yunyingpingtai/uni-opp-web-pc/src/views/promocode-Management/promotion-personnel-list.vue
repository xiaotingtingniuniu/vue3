<template>
    <div>
        <el-form ref="formRef" :model="formData" :inline="true" label-position="right" label-width="130px">

            <el-form-item label="所属业务线" prop="busiCode">
                <el-select v-model="formData.busiCode" clearable placeholder="请选择" >
                    <el-option
                        v-for="item in selectList"
                        :key="item.busiCode"
                        :label="item.buisName"
                        :value="item.busiCode"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="所属组织" prop="orgName">
                <el-input v-model="formData.orgName" @keyup.enter="searchList" placeholder="请输入组织名称" clearable />
            </el-form-item>
            <el-form-item label="推广人员姓名" prop="memberName">
                <el-input v-model="formData.memberName" @keyup.enter="searchList" placeholder="请输入推广人员姓名" clearable />
            </el-form-item>
            <el-form-item label="推广人手机号" prop="phoneMobile">
                <el-input v-model="formData.phoneMobile" @keyup.enter="searchList" placeholder="请输入推广人手机号" clearable />
            </el-form-item>
            <el-form-item label="推广码" prop="promoCode">
                <el-input v-model="formData.promoCode" placeholder="请输入推广码" clearable />
            </el-form-item>
            <el-form-item label="是否为内部员工" prop="isEmployee">
                <el-select v-model="formData.isEmployee" clearable placeholder="请选择" >
                    <el-option label="请选择" value="" />
                    <el-option label="是" :value="1" />
                    <el-option label="否" :value="0" />

                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="memberStatus">
                <el-select v-model="formData.memberStatus" clearable placeholder="请选择" >
                    <el-option label="请选择" value="" />
                    <el-option label="启用" :value="1" />
                    <el-option label="禁用" :value="2" />
                </el-select>
            </el-form-item>
            <el-form-item label="加入时间" prop="regTime" class="form-item-time">
                <el-date-picker size="default" v-model="formData.regTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" />
            </el-form-item>
            <br>
            <el-form-item class="button-box">
                <el-button @click="searchList" type="primary">查询</el-button>
                <el-button @click="resetForm(formRef)" type="primary">重置</el-button>
                <el-button @click="disabledData(1)" type="primary">启用</el-button>
                <el-button @click="disabledData(2)" type="primary">禁用</el-button>
                <el-button @click="exportTable" type="primary">导出</el-button>
            </el-form-item>

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
                <template #promoLevel="row">
                    {{ row.row.promoLevel === 1 ? '一级' : row.row.promoLevel === 0 ? '二级' : '-' }}
                </template>
                <template #isEmployee="row">
                    {{ row.row.isEmployee === 1 ? '是' : row.row.isEmployee === 0 ? '否' : '-' }}
                </template>
                <template #memberStatus="row">
                    {{ row.row.memberStatus === 1 ? '启用' : row.row.memberStatus === 2 ? '禁用' : '-' }}
                </template>

            </system-list>

        </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted, reactive, toRefs } from 'vue'
import { getMerchantListCode, goodsrebindinglist, detaillist } from '@/api/operate/index'
import { exportDetails } from '@/api/accountManagement/index'

import SystemList from '@/composables/TablePagination/index.vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
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

// tab 默认值切换
const activeName = ref('fast_food')
// const dialogVisible = ref(false)

const dataState = reactive({
    spuTemplateList: [],
    formData: {
        busiCode: '',
        orgName: '',
        memberName: '', // 推广人姓名
        phoneMobile: '', // 推广人手机号码
        promoCode: '', // 推广码
        isEmployee: '', // 是否为内部员工 0-否 1-是
        memberStatus: '', // 状态1-启用 2-停用
        gmtCreateStart: '', // 加入开始日期
        gmtCreateEnd: '', // 加入截止日期
        regTime: [] // 加入时间
    },
    tableData: [],
    selectList: [
        // // 业务线
    ]
})
const { formData, tableData, selectList } = toRefs(dataState)
onMounted(async () => {
    await getTableList()
    await getAllbusi()
})
// 表头
const tHead = [
    { align: 'left', tooltip: true, minWidth: 60, type: 'selection' },
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'busiName', label: '所属业务线', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'orgName', label: '所属组织', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'cityName', label: '所属城市', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'userId', label: '推广人id', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'memberName', label: '推广人姓名', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'phoneMobile', label: '推广人手机号', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'promoCode', label: '推广码', minWidth: 250 },
    { align: 'center', tooltip: true, prop: 'promoLevel', label: '推广码级别', minWidth: 104, slot: true },
    { align: 'center', tooltip: true, prop: 'isEmployee', label: '是否为内部员工', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'firstDepartment', label: '一级部门', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'secondDepartment', label: '二级部门', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'thirdDepartment', label: '三级部门', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'fourthDepartment', label: '四级部门', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '加入时间', minWidth: 250 },
    { align: 'center', tooltip: true, prop: 'memberStatus', label: '状态', minWidth: 150, slot: true }

]

const dialogTableVisible = ref(false)
const total = ref(100)
const editGoods = ref([])
const newGoods = ref([])
const Reason = ref('')
const showDialog = async (row) => {
    const image = ref('')
    if (row.spuMediaList !== null) {
        for (let i = 0; i < row.spuMediaList.length; i++) {
            if (row.spuMediaList[i].mediaType + '' === '2') {
                image.value = row.spuMediaList[i].mediaUrl
            }
        }
    }
    row.image = image.value
    dialogTableVisible.value = true
    editGoods.value = row
}

// 搜索数据
const searchList = () => {
    pageInfo.value.currentPage = 1
    getTableList()
}

// 禁用
const disabledData = (val) => {
    console.log('-------------', spuIdsList.value)
    if (!spuIdsList.value.length) {
        return ElMessage({
            type: 'error',
            message: '请至少选择一条数据'
        })
    }
    if (spuIdsList.value.length) {
        const params = {
            body: {
                appKey: 'A1001001',
                idSet: spuIdsList.value,
                status: val,
                modifierId: userInfo.value.account

            },
            appKey: 'A1001001',
            busiCode: 'A1001002',
            configCode: 'UC54146017352249344',
            name: '推广人员管理启用/禁用',
            source: '推广系统'
        }
        ElMessageBox.confirm(
            `是否${val === 1 ? '启用' : '禁用'}所选数据，共${spuIdsList.value.length}条`,

            {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }
        )
            .then(async () => {
                const res = await getMerchantListCode(params)
                if (res.code === '200') {
                    ElMessage.success('操作成功')
                    await getTableList()
                } else {
                    ElMessage.error('操作失败')
                }
            })
        // dialogVisible.value = true
    }
}
// 启用/禁用
const enableHandle = async (params) => {
    const res = await getMerchantListCode(params)
}
const exportTable = async () => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            page: pageInfo.value.currentPage,
            pageSize: pageInfo.value.pageSize,
            ...formData.value,
            gmtCreateStart: dataState?.formData?.regTime?.length ? dataState?.formData?.regTime[0] : '', // 开始时间
            gmtCreateEnd: dataState?.formData?.regTime?.length ? dataState?.formData?.regTime[1] : '' // 结束时间
        },
        exportType: 7,
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC53141927994757120',
        name: '推广人员管理-列表查询',
        source: '推广系统'

    }
    delete param.body.regTime
    if (formData.value.memberStatus === '') {
        delete param.body.memberStatus
    }
    if (formData.value.isEmployee === '') {
        delete param.body.isEmployee
    }

    const res = await exportDetails(param)
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
// 全选
const spuIdsList = ref([])
const handleSelectionChange = (val) => {
    console.log(val, ' =======val=====')

    spuIdsList.value = val.map(item => item.userId)
    console.log(spuIdsList.value, ' spuIdsList.value')
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getTableList()
}
// 获取列表数据
const getTableList = async (obj, val) => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            page: pageInfo.value.currentPage,
            pageSize: pageInfo.value.pageSize,
            ...formData.value,
            gmtCreateStart: dataState?.formData?.regTime?.length ? dataState?.formData?.regTime[0] : '', // 开始时间
            gmtCreateEnd: dataState?.formData?.regTime?.length ? dataState?.formData?.regTime[1] : '' // 结束时间
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC53141927994757120',
        name: '推广人员管理-列表查询',
        url: '/api/dandelion/v1/member/list',
        source: '推广系统'

    }
    delete param.body.regTime
    if (formData.value.memberStatus === '') {
        delete param.body.memberStatus
    }
    if (formData.value.isEmployee === '') {
        delete param.body.isEmployee
    }
    // // 启用停用
    console.log(param, '----------param--')

    const res = await getMerchantListCode(param)

    if (res.code === '200') {
        dataState.tableData = res.data

        // dataState.tableData = res.data.list
        pageInfo.value.total = res.count
    }
}

// 查询所有业务线
const getAllbusi = async () => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002'
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC53772472084463616',
        name: '查询所有业务线',
        url: '/api/merchant/v1/all/busi',
        source: '商户中台'

    }

    const res = await getMerchantListCode(param)

    if (res.code === '200') {
        dataState.selectList = res.data || []
    }
}

// 跳转详情
const toDetail = (row) => {
    const spuId = row.spuId
    router.push({ name: 'spu-management-editor', params: { type: 'publicGoodsDetail', spuTemplate: row.spuTemplate, spuId: row.spuId } })
}
// 编辑
const editBtn = (row) => {
    const spuId = row.spuId
    // router.push({ name: 'spu-management-editor', params: { type: 'edit', spuTemplate: dataState.formData.spuTemplate, spuId: row.spuId } })
    router.push({ name: 'spu-management-editor', params: { type: 'edit', spuTemplate: row.spuTemplate, spuId: row.spuId } })
}
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
