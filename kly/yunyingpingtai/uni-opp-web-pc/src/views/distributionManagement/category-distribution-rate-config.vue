<template>
    <div class='role-page'>
        <el-card class='box-card'>
            <div class='search-area'>
                <el-affix :offset="50">
                    <el-form ref='formRef' :model='searchData' :inline='true' label-position='right' label-width='140px'>
                        <el-form-item label='一级应用类目编号' prop='firstCateCode'>
                            <el-input v-model.trim='searchData.firstCateCode' placeholder='请输入' />
                        </el-form-item>
                        <el-form-item label='一级应用类目名称' prop='firstCateName'>
                            <el-input v-model.trim='searchData.firstCateName' placeholder='请输入' />
                        </el-form-item>
                        <el-form-item label='二级应用类目编号' prop='secondCateCode'>
                            <el-input v-model.trim='searchData.secondCateCode' placeholder='请输入' />
                        </el-form-item>
                        <el-form-item label='二级应用类目名称' prop='secondCateName'>
                            <el-input v-model.trim='searchData.secondCateName' placeholder='请输入' />
                        </el-form-item>
                        <el-form-item label='状态' prop='status'>
                            <el-select v-model='searchData.status' clearable placeholder='请选择'>
                                <el-option label='初始' value='0' />
                                <el-option label='未生效' value='1' />
                                <el-option label='生效中' value='2' />
                                <el-option label='已失效' value='3' />
                            </el-select>
                        </el-form-item>
                        <br>
                        <el-form-item class='button-box'>
                            <el-button type='primary' v-if="checkRole('distri-cate-rate-query')" @click='getList(true)'>
                                查询
                            </el-button>
                            <el-button type='primary' @click='resetForm(formRef)'>
                                重置
                            </el-button>
                            <el-button type='primary' v-if="checkRole('distri-cate-rate-export')" @click='exportTable'>
                                导出
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-affix>
            </div>
            <div class='tableList-area'>
                <system-list :tHead='tHead' :tableData='tableData' v-model:current-page='pageInfo.page' v-model:page-size='pageInfo.pageSize' :total='pageInfo.total' @size-change='sizeChange' @current-change='currentChange'>
                    <template #status="scope">
                        <span v-show="scope.row.status === 0">初始</span>
                        <span v-show="scope.row.status === 1">未生效</span>
                        <span v-show="scope.row.status === 2" style='color: rgb(68, 187, 131)'>生效中</span>
                        <span v-show="scope.row.status === 3" style='color: #ccc'>已失效</span>
                    </template>
                    <template #cateRate="scope">
                        {{scope.row.cateRate ? scope.row.cateRate + '%' : ''}}
                    </template>
                    <template #operation='scope'>
                        <el-button v-if="checkRole('distri-cate-rate-edit')&&scope.row.status !== 3" @click='onEdit(scope.row)' type='primary' link>修改</el-button>
                        <el-button v-if="checkRole('distri-cate-rate-edit')&&scope.row.status === 3"  @click='onEdit(scope.row)' type='primary' link disabled style="color:#ccc">修改</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
        <cst-form v-model='visible' v-if="visible" :resourceCode='dataState.resourceCode' :row="dataState.row" @getList='getList'></cst-form>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { onMounted, reactive, ref, toRefs } from 'vue'
import { distributionRatioList, exportDetails } from '@/api/distributionManagement'
import CstForm from './src/form2.vue'
import { checkRole } from '@/utils'
const tHead = [
    { align: 'center', prop: 'firstCateCode', label: '一级应用类目编号', minWidth: 150 },
    { align: 'center', prop: 'firstCateName', label: '一级应用类目名称', width: 80 },
    { align: 'center', prop: 'secondCateCode', label: '二级应用类目编号', minWidth: 120 },
    { align: 'center', prop: 'secondCateName', label: '二级应用类目名称', minWidth: 120 },
    { align: 'center', prop: 'status', label: '状态', minWidth: 120, slot: true },
    { align: 'center', prop: 'cateRate', label: '分销费率(%)', minWidth: 150, slot: true },
    { align: 'center', prop: 'startTime', label: '开始生效时间', minWidth: 150 },
    { align: 'center', prop: 'endTime', label: '失效时间', minWidth: 150 },
    { align: 'center', prop: 'modifierId', label: '操作员', minWidth: 120 },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 150, fixed: 'right', slot: true }
]

const dataState = reactive({
    tableData: [],
    resourceCode: null,
    row: null,
    currentVal: null,
    visible: false,
    dialogType: null,
    searchData: {
        firstCateCode: null, // 一级应用类目编号
        firstCateName: null, // 一级应用类目名称
        secondCateCode: null, // 二级应用类目编号
        secondCateName: null, // 二级应用类目名称
        status: null // 状态
    }
})

const pageInfo = ref({
    total: 0,
    page: 1,
    pageSize: 10
})
const { tableData, searchData, visible, dialogType, currentVal } = toRefs(dataState)

onMounted(async () => {
    await getList()
})

// 获取列表
const getList = async (reset = false) => {
    if (reset) (pageInfo.value.page = 1)
    const params = {
        ...searchData.value,
        page: pageInfo.value.page,
        pageSize: pageInfo.value.pageSize
    }
    const res = await distributionRatioList(params)
    console.log(res)
    if (res.code === '200') {
        dataState.tableData = res.data.list
        pageInfo.value.total = res.data.total
    }
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getList()
}

// 页数改变
const sizeChange = (val) => {
    pageInfo.value.page = 1
    pageInfo.value.pageSize = val
    getList()
}

// 当前页改变
const currentChange = (val) => {
    pageInfo.value.page = val
    getList()
}
// 弹出编辑页
const onEdit = (row) => {
    dataState.row = row
    dataState.resourceCode = row.resourceCode
    dataState.currentVal = row
    dataState.visible = true
}

const exportTable = async () => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC10018126434619392',
        exportType: 4,
        body: {
            ...searchData.value
        }

    }
    const res = await exportDetails(params)
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })// 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
    let fileName = decodeURI(res.headers['content-disposition'])// 设置文件名称,decodeURI：可以对后端使用encodeURI() 函数编码过的 URI 进行解码。encodeURI() 是后端为了解决中文乱码问题
    // console.log(fileName)
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
</script>
<style lang='scss' scoped>
.role-page{
    .el-table tr{
        height: 50px;
    }
    .el-select{
        :deep(.el-select__tags-text){
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            justify-content: flex-start;
        }
    }
    .box-card{
        border: initial;
        .search-area{
            .el-form{
                .el-form-item{
                    width: 280px;
                }
                // .form-item-time{
                //     width: 535px;
                //     :deep(.el-date-editor){
                //         flex: 1;
                //     }
                //     :deep(.el-form-item__content){
                //         .el-range-editor.el-input__inner{
                //             padding: 0 10px;
                //         }
                //     }
                // }
                .button-box{
                    width: 100%;
                    .el-button{
                        border: initial;
                    }
                }
            }
        }
        .page-area{
            display: flex;
            justify-content: center;
        }
        .el-form-item{
            :deep .el-form-item__label{
                width: 200px;
            }
        }
    }
}
</style>
