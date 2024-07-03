<template>
    <div class="register-user-list-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">

                    <el-form-item label="所属业务线" prop="busiCode">
                        <el-select v-model="searchData.busiCode" clearable placeholder="请选择" >
                            <el-option
                                v-for="item in selectList"
                                :key="item.busiCode"
                                :label="item.buisName"
                                :value="item.busiCode"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属组织" prop="orgName">
                        <el-input v-model="searchData.orgName" @keyup.enter="searchList" placeholder="请输入组织名称" clearable />
                    </el-form-item>

                    <el-form-item label="所属城市" prop="cityName">
                        <el-input v-model="searchData.cityName" @keyup.enter="searchList" placeholder="请输入城市名称" clearable />
                    </el-form-item>

                    <el-form-item label="推广人姓名" prop="userName">
                        <el-input v-model="searchData.userName" @keyup.enter="searchList" placeholder="请输入推广人姓名" clearable />
                    </el-form-item>
                    <el-form-item label="推广码" prop="userPromoCode">
                        <el-input v-model="searchData.userPromoCode" @keyup.enter="searchList" placeholder="请输入推广码" clearable />
                    </el-form-item>
                    <!-- 一下字段需要和后端再对一下 orderStatus的字段-->
                    <el-form-item label="分期订单编号" prop="orderCode">
                        <el-input v-model="searchData.orderCode" @keyup.enter="searchList" placeholder="请输入分期订单编号" clearable />
                    </el-form-item>
                    <el-form-item label="首金支付状态" prop="downPayStatus">
                        <el-select v-model="searchData.downPayStatus" clearable placeholder="请选择" >
                            <el-option label="请选择" value=" " />
                            <el-option label="未支付" :value="1" />
                            <el-option label="已支付" :value="2" />

                        </el-select>                    </el-form-item>

                    <el-form-item label="首金支付时间" prop="regTime" class="form-item-time">
                        <el-date-picker size="default" v-model="searchData.regTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" />
                    </el-form-item>

                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="searchList">搜索</el-button>
                        <el-button type="primary" @click="resetForm(formRef)">重置</el-button>
                        <el-button type="primary" @click="exportTable">导出</el-button>

                    </el-form-item>
                </el-form>
            </div>
            <div class="tableList-area">
                <system-list
                    :tHead="zbfqTheads"
                    :tableData="tableData"
                    v-model:current-page="pageInfo.currentPage"
                    v-model:page-size="pageInfo.pageSize"
                    :total="pageInfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                >
                    <template #orderAmount="row">
                        {{row.row.orderAmount ? (conversion(row.row.orderAmount)) +' 元 ' : '' }}

                    </template>

                </system-list>
            </div>
        </el-card>

    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { zbfqTheads } from './tHead.js'
import { exportDetails } from '@/api/accountManagement/index'

import { reactive, ref, onMounted, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import router from '@/router'
import { conversion } from '@/utils/util.js'

import { ElMessage, ElMessageBox } from 'element-plus'
// import { getLevelList } from '@/api/product-level-management/product-level'
import { getMerchantListCode } from '@/api/operate/index'

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dataState = reactive({
    tableData: [],
    searchData: {
        busiCode: '', // 所属业务线
        orgName: '', // 所属组织
        cityName: '', // 所属城市
        userName: '', // 推广人姓名
        userPromoCode: '', // 推广码
        orderCode: '', // 分期订单号
        downPayTimeStart: '', // 改首金支付时间
        downPayTimeEnd: '',
        regTime: [],
        downPayStatus: '' // 改首金支付状态
    },
    pageInfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    },
    selectList: [

    ],
    addDialogVisible: false
})
const { searchData, tableData, selectList, pageInfo } = toRefs(dataState)
onMounted(async () => {
    await getAllbusi()
    await getTableList()
})
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
// 获取列表数据
const getTableList = async (obj, val) => {
    const param = {
        body: {
            appKey: 'A1001000',
            pageNum: pageInfo.value.currentPage,
            pageSize: pageInfo.value.pageSize,
            ...searchData.value,
            downPayTimeStart: dataState?.searchData?.regTime?.length ? dataState?.searchData.regTime[0] : '', // 开始时间
            downPayTimeEnd: dataState?.searchData?.regTime?.length ? dataState?.searchData.regTime[1] : '' // 结束时间
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC54628854395211776',
        name: '推广数据管理-货柜分期推广数据-列表',
        source: '推广系统'

    }
    if (searchData.value.downPayStatus === '') delete param.body.downPayStatus
    if (!dataState?.searchData?.regTime.length) delete param.body.downPayTimeStart
    if (!dataState?.searchData?.regTime.length) delete param.body.downPayTimeEnd
    delete param.body.regTime

    const res = await getMerchantListCode(param)
    if (res.code === '200') {
        dataState.tableData = res.data
        // dataState.tableData = res.data.list
        pageInfo.value.total = res.count
    }
}
const exportTable = async () => {
    const param = {
        body: {
            appKey: 'A1001000',
            pageNum: pageInfo.value.currentPage,
            pageSize: pageInfo.value.pageSize,
            ...searchData.value,
            downPayTimeStart: dataState?.searchData?.regTime?.length ? dataState?.searchData.regTime[0] : '', // 开始时间
            downPayTimeEnd: dataState?.searchData?.regTime?.length ? dataState?.searchData.regTime[1] : '' // 结束时间
        },
        exportType: 7,
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC54628854395211776',
        name: '推广数据管理-货柜分期推广数据-列表',
        source: '推广系统'

    }
    delete param.body.regTime
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
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getTableList()
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
// 搜索数据
const searchList = () => {
    pageInfo.value.currentPage = 1
    getTableList()
}
</script>
<style lang="scss" scoped>
.register-user-list-page{
    .dialog-wrap{
        .title{
            font-size: 18px;
            color: #303133;
        }
        .mrt20{
            margin-top: 20px;
        }
        .block-card{
            .check-line{
                display: flex;
                margin-top: 10px;
                .el-checkbox-group{
                    margin-left: 30px;
                }
            }
            .el-button{
                margin-top: 10px;
            }
        }
    }
    .gray{
        color: #9b9b9b;
    }
    .box-card{
        border: initial;
        .search-area{
            .el-form{
                .el-form-item{
                    width: 250px;
                }
                .form-item-time{
                    width: 535px;
                    :deep(.el-date-editor){
                        flex: 1;
                    }
                    :deep(.el-form-item__content){
                        .el-range-editor.el-input__inner{
                            padding: 0 10px;
                        }
                    }
                }
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
    }
    .box-cards{
        height:400px;
        overflow:hidden;
        overflow-y:scroll;
        margin-top: 12px;
        background-color: #fff;
        .address-item{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-bottom: 12px;
            box-shadow: initial;
            .address-item-title{
                display: flex;
                justify-content: space-between;
                .colour{
                    color: #fe2c55;
                }
            }
        }
    }
}
</style>
