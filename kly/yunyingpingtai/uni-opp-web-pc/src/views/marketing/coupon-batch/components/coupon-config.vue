<template>
    <div class='coupon-submit-box'>
        <!-- <el-dialog v-model="dialogConfig" width="70%" :before-close="handleClose"> -->
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="券编号" prop="couponCode">
                    <el-input v-model="searchData.couponCode" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="用户手机号" prop="phoneMobile">
                    <el-input v-model="searchData.phoneMobile" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="状态" prop="userCouponStatus">
                    <el-select v-model="searchData.userCouponStatus" clearable placeholder="请选择" >
                        <el-option  v-for="item in setBatchStatus" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="领取时间" prop="receiveTime" class="form-item-time">
                    <el-date-picker v-model="searchData.receiveTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间"  @change="daterangeTime" />
                </el-form-item>
                <el-form-item label="交易订单号" prop="orderNo">
                    <el-input v-model="searchData.orderNo" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="使用时间" prop="useTime" class="form-item-time">
                    <el-date-picker v-model="searchData.useTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" @change="daterangeUTime" :editable="false"/>
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="searchCoupon()">
                        查询
                    </el-button>
                    <el-button type="primary" @click="resetForm(formRef)">
                        重置
                    </el-button>
                    <!-- <el-button v-if="checkRole('marketing-10')" type="primary" @click="exportExcel()">
                        导出
                    </el-button> -->
                    <el-button v-if="checkRole('marketing-10') && groupStatus === '5'" type="primary" @click="exportExcelCoupon()">
                        券包码导出
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageinfo.currentPage"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #userCouponStatus="scope">
                    <span v-if="scope.row.userCouponStatus === 1">待领取</span>
                    <span v-if="scope.row.userCouponStatus === 2">已领取</span>
                    <span v-if="scope.row.userCouponStatus === 3">已使用</span>
                    <span v-if="scope.row.userCouponStatus === 4">已失效</span>
                    <span v-if="scope.row.userCouponStatus === 5">已退还</span>
                </template>
            </system-list>
        </div>
        <!-- </el-dialog> -->
    </div>
</template>
<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { couponDetails, exportDetails } from '@/api/marketing/coupon'
import { getMerchantList, exportCommon } from '@/api/operate/index'
import { useRoute } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import { checkRole } from '@/utils'

const route = useRoute()

const groupCode = route.query.groupCode
const groupStatus = route.query.groupStatus
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const subCode = route.query.subCode
const tHead = [
    { align: 'center', tooltip: true, prop: 'couponCode', label: '券编号', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'userCouponStatus', label: '状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'receivedDate', label: '领取时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'useDate', label: '使用时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'effectDate', label: '生效时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'overdueDate', label: '过期时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'phoneMobile', label: '用户手机号', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'orderNo', label: '交易订单号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'price', label: '优惠金额(元)', minWidth: 130 }

]

const tableData = ref([])
const searchData = ref({
    userId: '',
    phoneMobile: '',
    couponCode: '',
    userCouponStatus: '2',
    orderNo: '',
    receiveTime: [],
    useTime: []
})
const dateTime = ref({
    receivedBeginDate: '',
    receivedEndDate: '',
    useBeginDate: '',
    useEndDate: ''
})
const pageinfo = ref(
    {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }
)

const setBatchStatus =
    [
        // {
        //     value: '',
        //     label: '全部'
        // },
        // {
        //     value: '1',
        //     label: '待领取'
        // },
        {
            value: '2',
            label: '已领取'
        },
        {
            value: '3',
            label: '已使用'
        },
        {
            value: '4',
            label: '已失效'
        }
    ]
onMounted(() => {
    // getDateTime()
    getCouponList()
})

const daterangeTime = (val) => {
    if (val) {
        searchData.value.receiveTime = val
        dateTime.value.receivedBeginDate = new Date(val[0]).getTime()
        dateTime.value.receivedEndDate = new Date(val[1]).getTime()
    } else {
        searchData.value.receiveTime = ''
        dateTime.value.receivedBeginDate = ''
        dateTime.value.receivedEndDate = ''
    }
}

const daterangeUTime = (val) => {
    if (val) {
        searchData.value.useTime = val
        dateTime.value.useBeginDate = new Date(val[0]).getTime()
        dateTime.value.useEndDate = new Date(val[1]).getTime()
    } else {
        searchData.value.useTime = ''
        dateTime.value.useBeginDate = ''
        dateTime.value.useEndDate = ''
    }
    // searchData.value.useTime = val
}

// 列表数据
const getCouponList = async () => {
    const params = {
        appKey: subCode,
        busiCode: subCode,
        sceneCode: '1',
        functionCode: 'functionCode',
        groupCode: groupCode,
        currPage: pageinfo.value.currentPage,
        pageSize: pageinfo.value.pageSize,
        couponCode: searchData.value.couponCode || null,
        phoneMobile: searchData.value.phoneMobile || null,
        userCouponStatus: searchData.value.userCouponStatus || null,
        orderNo: searchData.value.orderNo || null,
        ...dateTime.value
    }
    const res = await couponDetails(params)
    if (res.code === '200') {
        tableData.value = res.data.records.map(item => {
            return {
                price: item.couponAmount / 100,
                ...item
            }
        })
        pageinfo.value.total = res.data.totalSize
    }
}

// 默认时间一周
// const getDateTime = () => {
//     const starttime = new Date().getTime() - 3600 * 1000 * 24 * 7
//     const endtime = new Date().getTime()
//     const arr = []
//     arr.push(getTime(starttime))
//     arr.push(getTime(endtime))
//     searchData.value.receiveTime = searchData.value.useTime = arr
//     dateTime.value.receivedBeginDate = starttime
//     dateTime.value.receivedEndDate = endtime
//     dateTime.value.useBeginDate = starttime
//     dateTime.value.useEndDate = endtime
// }

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    dateTime.value.receivedBeginDate = ''
    dateTime.value.receivedEndDate = ''
    dateTime.value.useBeginDate = ''
    dateTime.value.useEndDate = ''
}

// 查询
const searchCoupon = () => {
    pageinfo.value.currentPage = 1
    getCouponList()
}

// 导出
const exportExcel = async () => {
    const params = {
        appKey: subCode,
        busiCode: subCode,
        sceneCode: '1',
        functionCode: 'functionCode',
        groupCode: groupCode,
        currPage: pageinfo.value.currentPage,
        pageSize: pageinfo.value.pageSize,
        couponCode: searchData.value.couponCode || null,
        phoneMobile: searchData.value.phoneMobile || null,
        userCouponStatus: searchData.value.userCouponStatus || null,
        orderNo: searchData.value.orderNo || null,
        ...dateTime.value
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

// 导出券包码
const exportExcelCoupon = async () => {
    const params = {
        body: {
            groupCode: groupCode,
            appKey: 'A1001001',
            busiCode: 'A1001001',
            gmtOperate: new Date().getTime(),
            operatorId: userInfo.value.account
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC8867225242206208',
        name: '营销中台-按组或批次导出兑换码',
        source: '营销中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    await getMerchantList(params)
}

// 当前页数改变
const currentChange = (val) => {
    pageinfo.value.currentPage = val
    getCouponList()
}
const sizeChange = (val) => {
    pageinfo.value.currentPage = 1
    pageinfo.value.pageSize = val
    getCouponList()
}
// const emit = defineEmits(['handleClose', 'fevent'])
// const handleClose = () => {
//     emit('handleClose', props.visible)
//     emit('fevent')
// }

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
