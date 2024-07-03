<template>
    <div>
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="联系方式" prop="contactPhone">
                    <el-input v-model="searchData.contactPhone" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="联系人" label-width="120px" prop="contactName">
                    <el-input v-model="searchData.contactName" placeholder="请输入" clearable />
                </el-form-item>
                <!-- <el-form-item label="联系人手机号" label-width="120px" prop="contactPhone">
                    <el-input v-model="searchData.contactPhone" placeholder="请输入～" clearable />
                </el-form-item> -->
                <el-form-item label="意向类型" label-width="80px" prop="wishType">
                    <el-select v-model="searchData.wishType" clearable placeholder="请选择" >
                        <el-option v-for="(item, key) in subsidyFlagValue" :key="item" :label="item" :value="key" />
                    </el-select>
                </el-form-item>
                <el-form-item label="意向城市" label-width="80px" prop="cityName">
                    <el-input v-model="searchData.cityName" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="提交时间" prop="submitTime" class="form-item-time">
                    <el-date-picker
                        size="default"
                        v-model="searchData.submitTime"
                        type="datetimerange"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        range-separator="~"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                    />
                </el-form-item>
                <el-form-item label="推广码" label-width="80px" prop="promoCode">
                    <el-input v-model="searchData.promoCode" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="商户名称" label-width="80px" prop="merchantName">
                    <el-input v-model="searchData.merchantName" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="searchCoupon()">
                        查询
                    </el-button>
                    <el-button type="primary" @click="resetForm(formRef)">
                        重置
                    </el-button>
                    <!-- <el-button v-if="dataState.tableData.length==0" @click="open" type="primary" style="margin: 20px">导出</el-button> -->
                    <!-- <el-button type="primary" @click="exportOrder">导出</el-button> -->
                </el-form-item>
            </el-form>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageinfo.page"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #gmtCreate="scope">
                    <span>{{scope.row.gmtCreate?scope.row.gmtCreate.replace('T',' '):scope.row.gmtCreate}}</span>
                </template>
                <template #gmtModify="scope">
                    <span>{{scope.row.gmtCreate?scope.row.gmtModify.replace('T',' '):scope.row.gmtModify}}</span>
                </template>
                <template #wishType="row">
                    {{subsidyFlagValue[row.row.wishType]}}
                </template>
                <template #operation="scope">
                    <!-- <el-button text type="primary">
                        分发
                    </el-button>
                    <el-button text type="primary" @click="toDetail(scope.row.busiMerchantId,'detail')">
                        查看
                    </el-button> -->
                    <el-button text type="primary" @click="toEdit(scope.row.busiMerchantId,'edit')" v-if="scope.row.busiMerchantStatus ===1 || scope.row.busiMerchantStatus === 3">
                        编辑
                    </el-button>
                    <el-button text type="primary" @click="toApply(scope.row.busiMerchantId)"  v-if="scope.row.busiMerchantStatus ===1 || scope.row.busiMerchantStatus === 2">
                        审核
                    </el-button>
                </template>
            </system-list>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { merchantIntention, merchantIntentionExport } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { useStore } from 'vuex'
const subsidyFlagValue = ref({ 1: '柜主', 2: '商户' })
const route = useRoute()
const router = useRouter()

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogDetail = ref(false)
const radio = ref(3)
const tHead = [
    { align: 'center', tooltip: true, type: 'index', label: '序号', width: 80 },
    { align: 'center', tooltip: true, prop: 'wishType', label: '意向类型', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'contactName', label: '姓名', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'contactPhone', label: '意向手机号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'showCityName', label: '意向城市', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'phoneMobile', label: '创建手机号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '创建时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'modifierId', label: '编辑人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'gmtModify', label: '编辑时间', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商户名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'promoCode', label: '推广码', minWidth: 120 },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 120, slot: true }

]

const tableData = ref([])
const dataState = reactive({
    searchData: {
        contactName: '',
        contactPhone: '',
        cityName: '',
        wishType: '',
        submitTime: ''
    },
    pageinfo: {
        total: 0,
        page: 1,
        pageSize: 10
    },
    applyForm: {
        merchantStatus: '',
        rejectReason: ''
    },
    BusiInfoResVo: [],
    rolelist: [],
    dialogFormVisible: false

})
const { searchData, pageinfo, BusiInfoResVo, rolelist, dialogFormVisible, applyForm } = toRefs(dataState)

onMounted(async () => {
    await merchantIntentionList()
})
// 列表数据
const merchantIntentionList = async () => {
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        ...dataState.searchData,
        page: dataState.pageinfo.page,
        pageSize: dataState.pageinfo.pageSize
    }
    if (params.submitTime) {
        params.startTime = params.submitTime[0] || ''
        params.endTime = params.submitTime[1] || ''
    } else {
        params.startTime = params.startTime ? params.startTime : ''
        params.endTime = params.endTime ? params.endTime : ''
    }
    delete params.submitTime
    const res = await merchantIntention(params)
    tableData.value = res.data.list
    dataState.pageinfo.total = res.data.total
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    merchantIntentionList()
}

// 查询
const searchCoupon = () => {
    dataState.pageinfo.page = 1
    merchantIntentionList()
}

// // 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.page = val
    merchantIntentionList()
}
const sizeChange = (val) => {
    dataState.pageinfo.page = 1
    dataState.pageinfo.pageSize = val
    merchantIntentionList()
}
const open = () => {
    ElMessage({
        showClose: true,
        message: '导出列表不能为空',
        type: 'warning'
    })
}
// 导出
const exportOrder = async () => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC41591303315103744',
        name: '导出柜主合作意愿',
        source: '商户中台',
        exportType: 7,
        body: {
            ...searchData.value,
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001000' // 业务线编号
        }
    }
    if (params.submitTime) {
        params.startTime = params.submitTime[0] || ''
        params.endTime = params.submitTime[1] || ''
    } else {
        params.startTime = params.startTime ? params.startTime : ''
        params.endTime = params.endTime ? params.endTime : ''
    }
    delete params.submitTime
    const res = await merchantIntentionExport(params)
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
</script>
<style lang="scss" scoped>
 .coupon-submit-box{
     .dialog-title{
        font-size:20px;
        color:red;
        font-weight:700;
     }
     .header-title{
         font-size:20px;
         color:red;
         height:50px;
         font-weight:700;
         align-items:center
     }
 }
</style>
