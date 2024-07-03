<template>
    <div class="role-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right">
                    <el-form-item label="角色" prop="userRoleType">
                        <el-select v-model="searchData.userRoleType" clearable placeholder="请选择">
                            <el-option label="大团长" value="1" />
                            <el-option label="小团长" value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="团长ID" prop="userId">
                        <el-input v-model.trim="searchData.userId" />
                    </el-form-item>
                    <el-form-item label="购买人ID" prop="buyerUserId">
                        <el-input v-model.trim="searchData.buyerUserId"/>
                    </el-form-item>
                    <el-form-item label="业务订单号" prop="outerOrderNo">
                        <el-input v-model.trim="searchData.outerOrderNo"/>
                    </el-form-item>
                    <el-form-item label="团长/小团长手机号" prop="userMobile">
                        <el-input v-model.trim="searchData.userMobile"/>
                    </el-form-item>
                    <el-form-item label="状态" prop="cmnStatus">
                        <el-select v-model="searchData.cmnStatus" clearable placeholder="请选择">
                            <el-option label="待分佣" value="0" />
                            <el-option label="分佣中" value="1" />
                            <el-option label="分佣成功" value="2" />
                            <el-option label="已退款" value="3" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="实际分佣日期" prop="startTime" class="form-item-time">
                        <el-date-picker v-model="searchData.startTime" type="date" value-format="YYYY-MM-DD"  placeholder="开始时间" :editable="false"/>
                    </el-form-item>
                    <el-form-item label prop="endTime" class="form-item-time">
                        <el-date-picker v-model="searchData.endTime" type="date" value-format="YYYY-MM-DD"  placeholder="结束时间" :editable="false"/>
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" v-if="checkRole('settle-detail-export')" @click="exportTable">
                            导出明细
                        </el-button>
                        <el-button type="primary" v-if="checkRole('settle-detail-query')" @click="getList(true)">
                            查询
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tableList-area">
                <system-list :tHead="tHead" :tableData="tableData" v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.pageSize" :total="pageInfo.total" @size-change="sizeChange" @current-change="currentChange">
                    <template #userRoleType="scope">
                        {{ scope.row.userRoleType === 1 ? '大团长' : '小团长'}}
                    </template>
                    <template #cmnStatus="scope">
                        <span v-show="scope.row.cmnStatus === 0">待分佣</span>
                        <span v-show="scope.row.cmnStatus === 1" style="color:">分佣中</span>
                        <span v-show="scope.row.cmnStatus === 2" style="color:orange">分佣成功</span>
                        <span v-show="scope.row.cmnStatus === 3" style="color:red">已退款</span>
                    </template>
                    <template #cateRatio="scope">
                        {{scope.row.cateRatio ? scope.row.cateRatio +' % ' : '-' }}
                    </template>
                    <template #totalOrderRealAmount="scope">
                        {{scope.row.totalOrderRealAmount ? (conversion(scope.row.totalOrderRealAmount)) +' 元 ' : '' }}
                    </template>
                    <template #realAmount="scope">
                        {{scope.row.realAmount ? conversion(scope.row.realAmount) +' 元 ' : '' }}
                    </template>
                    <template #refundAmount="scope">
                        <span v-show="scope.row.refundAmount === 0 || scope.row.refundAmount">{{conversion(scope.row.refundAmount)}} 元</span>
                    </template>
                    <template #preCmnAmount="scope">
                        <span v-show="scope.row.preCmnAmount === 0 || scope.row.preCmnAmount">{{conversion(scope.row.preCmnAmount)}} 元</span>
                    </template>
                    <template #cmnAmount="scope">
                        <span v-show="scope.row.cmnAmount === 0 || scope.row.cmnAmount">{{conversion(scope.row.cmnAmount)}} 元</span>
                    </template>
                    <template #cmnStartTime="scope">
                        {{scope.row.cmnStartTime ? scope.row.cmnStartTime.replace('T',' ') : ' - '}}
                    </template>
                    <template #cmnDate="scope">
                        <span v-if="scope.row.cmnDate">{{scope.row.cmnDate.replace('T',' ')}}</span>
                        <span v-else> - </span>
                    </template>
                    <template #deliveredTime="scope">
                        {{scope.row.deliveredTime ? scope.row.deliveredTime.replace('T',' '):' - '}}
                    </template>
                    <template #tradeTime="scope">
                        {{scope.row.tradeTime ? scope.row.tradeTime.replace('T',' ') : ' - '}}
                    </template>
                    <template #operation="scope">
                        <el-button @click="onEdit(scope.row)" type="primary" link>编辑</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { onMounted, reactive, ref, toRefs } from 'vue'
import { exportDetails, brokerageList } from '@/api/settlementManagement/index'
import { checkRole } from '@/utils'
const tHead = [
    { align: 'center', prop: 'userId', label: '用户ID', minWidth: 150, fixed: 'left' },
    { align: 'center', prop: 'remark', label: '用户名称', width: 80, fixed: 'left' },
    { align: 'center', prop: 'userMobile', label: '用户手机号', minWidth: 120 },
    { align: 'center', prop: 'userRoleType', label: '角色', minWidth: 120, slot: true },
    { align: 'center', prop: 'buyerUserId', label: '购买人ID', minWidth: 150 },
    { align: 'center', prop: 'outerOrderNo', label: '业务订单号', minWidth: 180 },
    { align: 'center', prop: 'skuId', label: '商品ID', minWidth: 150 },
    { align: 'center', prop: 'skuName', label: '商品名称', minWidth: 150 },
    { align: 'center', prop: 'totalOrderRealAmount', sortable: true, label: '订单金额(元)', minWidth: 150, slot: true },
    { align: 'center', prop: 'realAmount', label: '用户实付金额(元)', minWidth: 150, slot: true },
    { align: 'center', prop: 'refundAmount', label: '退款金额(元)', minWidth: 150, slot: true },
    { align: 'center', prop: 'freight', label: '运费(元)' },
    { align: 'center', prop: 'cateRatio', label: '类目分销比例', slot: true },
    { align: 'center', prop: 'cmnTypeDesc', label: '分销模式', minWidth: 120 },
    { align: 'center', prop: 'preCmnAmount', label: '预估分佣金额(元)', minWidth: 120, slot: true },
    { align: 'center', prop: 'cmnAmount', label: '实际分佣金额(元)', minWidth: 120, slot: true },
    { align: 'center', prop: 'cmnStatus', label: '分佣状态', minWidth: 120, slot: true },
    { align: 'center', prop: 'tradeTime', label: '用户支付成功时间', minWidth: 170, slot: true },
    { align: 'center', prop: 'deliveredTime', label: '物流妥投时间', minWidth: 170, slot: true },
    { align: 'center', prop: 'cmnDate', label: '预计分佣日期', minWidth: 170, slot: true },
    { align: 'center', prop: 'cmnStartTime', label: '实际分佣日期', minWidth: 170, slot: true }
]
const dataState = reactive({
    tableData: [],
    resourceCode: null,
    currentVal: null,
    searchData: {
        userRoleType: null,
        userMobile: null,
        userName: null,
        status: null,
        startTime: null,
        endTime: null,
        userId: null,
        buyerUserId: null,
        outerOrderNo: null,
        cmnStatus: null,
        cmnStartTime: null
    }
})

const pageInfo = ref({
    total: 0,
    page: 1,
    pageSize: 10
})
const { tableData, searchData, currentVal } = toRefs(dataState)

onMounted(async () => {
    await getList()
})

// 获取分佣明细列表
const getList = async (reset = false) => {
    if (reset) (pageInfo.value.page = 1)
    const params = {
        ...searchData.value,
        page: pageInfo.value.page,
        pageSize: pageInfo.value.pageSize
    }
    const res = await brokerageList(params)
    if (res.code === '200') {
        dataState.tableData = res.data.list
        pageInfo.value.total = res.data.total
    }
}

// 导出分佣明细列表
const exportTable = async () => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC10018126497533952',
        exportType: 6,
        body: {
            ...searchData.value
        }
    }
    const res = await exportDetails(params)
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

// 金额转化
const conversion = (num) => {
    const str = (num / 100).toFixed(2) + ''
    const intSum = str.substring(0, str.indexOf('.')).replace(/\B(?=(?:\d{3})+$)/g, ',') // 取到整数部分
    const dot = str.substring(str.length, str.indexOf('.')) // 取到小数部分搜索
    const ret = intSum + dot
    return ret
}

</script>
<style lang="scss" scoped>
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
                //     width: 400px;
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
        .el-form-item {
            margin-right: 20px !important;
        }
        .el-form-item__label {
        position: absolute;
        }
        .el-form-item__content {
        width: 100%;
        padding-left: 80px;
        }
        .el-select,
        .el-input_inner {
        width: 100%;
    }
    }
}
</style>
