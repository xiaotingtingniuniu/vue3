<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="用户手机号" prop="phoneMobile">
                    <el-input v-model.trim="searchData.phoneMobile" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="交易订单编号" prop="orderNo">
                    <el-input v-model.trim="searchData.orderNo" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="优惠券状态" prop="userCouponStatus">
                    <el-select v-model="searchData.userCouponStatus" clearable placeholder="请选择" >
                        <el-option label="已领取" value="2" />
                        <el-option label="已使用" value="3" />
                        <el-option label="已失效" value="4" />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="订单创建时间" prop="workOrderStart" class="form-item-time">
                    <el-date-picker v-model="querinfo.workOrderStart" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间"  @change="daterangeTime"/>
                </el-form-item> -->
                <el-form-item label="优惠券类型" prop="couponType">
                    <el-select v-model="searchData.couponType" clearable placeholder="请选择" >
                        <el-option label="全部" value="" />
                        <el-option label="立减" value="1" />
                        <el-option label="满减" value="2" />
                        <el-option label="折扣" value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item label="业务线" prop="businessCode">
                    <el-select v-model="searchData.businessCode" clearable placeholder="请选择" >
                        <el-option label="全部" value="1" />
                        <el-option label="智能货柜" value="2" />
                        <el-option label="门店" value="3" />
                        <el-option label="生活充值" value="4" />
                        <el-option label="电商到家" value="5" />
                    </el-select>
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="getRefundList()">
                        查询
                    </el-button>
                    <el-button type="primary" @click="resetForm(formRef)">
                        重置
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
                <template #couponType="scope">
                    <span v-if="scope.row.couponType === 1">立减</span>
                    <span v-if="scope.row.couponType === 2">满减</span>
                    <span v-if="scope.row.couponType === 3">折扣</span>
                </template>
                <template #userCouponStatus="scope">
                    <span v-if="scope.row.userCouponStatus === 2">已领取</span>
                    <span v-if="scope.row.userCouponStatus === 3">已使用</span>
                    <span v-if="scope.row.userCouponStatus === 4">已失效</span>
                </template>
                <template #businessCode="scope">
                    <span v-if="scope.row.businessCode === '2'">智能货柜</span>
                    <span v-if="scope.row.businessCode === '3'">门店</span>
                    <span v-if="scope.row.businessCode === '4'">生活充值</span>
                    <span v-if="scope.row.businessCode === '5'">电商到家</span>
                </template>
                <template #operation="scope">
                    <el-button type="primary" v-if="scope.row.userCouponStatus === 2" @click="usedcoupon(scope.row)" text>
                        核销
                    </el-button>
                    <el-button type="primary" @click="toDetail('detail', scope.row)" text>
                        查看批次详情
                    </el-button>
                </template>
            </system-list>
        </div>
        <el-dialog
            v-model="dialogCancel"
            width="40%"
        >
            <div style="font-size: 18px;width: 100%;text-align: center;margin: 0px 10px 20px 0px">请输入要关联的订单号，涉及财务对账，务必保证订单编号正确</div>
            <el-form  ref="ruleFormRef"
                      :model="resultForm"
                      :rules="rules"
                      class="demo-ruleForm">
                <el-form-item label="订单号" prop="orderNo">
                    <!-- <el-input v-model="form.orderNo" :rules = rules.orderNo  type="input" maxlength="24" show-word-limit
                    /> -->
                    <el-input v-model="resultForm.orderNo" placeholder="请输入SO开头的订单号" :rules = rules.orderNo maxlength="24" clearable />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogCancel = false">关闭</el-button>
                    <el-button type="primary" @click="submitReason(ruleFormRef)"
                    >确认</el-button
                    >
                </span>
            </template>
        </el-dialog>
        <!-- <work-order-detail v-if="dialogDetail" :visible ='dialogDetail' @fevent="init" @handleClose="dialogDetail = false" :orderNo = "orderNo"  ></work-order-detail> -->
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import workOrderDetail from './work-order-detail.vue'
import { refundList, couponList, usedCoupon } from '@/api/refund/index'
import { couponDetails, exportDetails } from '@/api/marketing/coupon'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
const userInfo = JSON.parse(localStorage.getItem('userInfo'))
const route = useRoute()
const router = useRouter()

const dialogDetail = ref(false)
const radio = ref(3)
const tHead = [
    { align: 'center', tooltip: true, prop: 'userId', label: '用户ID', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'phoneMobile', label: '用户手机号', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'groupCode', label: '券批次编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'groupName', label: '券批次名称', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'couponCode', label: '券编号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'userCouponStatus', label: '优惠券状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'orderNo', label: '订单号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'businessCode', label: '业务线', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'dealName', label: '子系统', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'couponType', label: '优惠类型', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 230, slot: true }

]
const dialogCancel = ref(false)
const tableData = ref([])
const dataState = reactive({
    searchData: {
        orderNo: '',
        workNumber: '',
        userCouponStatus: '',
        couponType: '',
        phoneMobile: '',
        businessCode: ''
    },
    dateTime: {
        workEndTimeSt: '',
        workEndTimeEn: '',
        workStartTimeSt: '',
        workStartTimeEn: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }

})
const { searchData, pageinfo } = toRefs(dataState)

const resultForm = ref({
    orderNo: ''
})
const querinfo = ref({
    workOrderStart: [],
    workOrderEnd: []
})
// const orderNumber = (rule, value, callback) => {
//     if (!value) {
//         return callback(new Error('请输入SO开头的订单号'))
//     }
//     setTimeout(() => {
//         if (value.length < 24) {
//             callback(new Error('请输入SO开头的24位订单号'))
//         } else if (value.slice(0, 1) !== 'SO') {
//             callback(new Error('请输入SO开头的24位订单号'))
//             // if (value < 18) {
//             //     callback(new Error('Age must be greater than 18'))
//             // } else {
//             //     callback()
//             // }
//         } else {
//             callback()
//         }
//     }, 1000)
// }
const rules = {
    orderNo: [{ required: true, message: '请输入SO开头的订单号', trigger: 'blur' }]
}
onMounted(async () => {
    // await getRefundList()
})

const daterangeTime = (val) => {
    if (val) {
        querinfo.value.workOrderStart = val
        dataState.dateTime.workStartTimeSt = val[0]
        dataState.dateTime.workStartTimeEn = val[1]
    } else {
        querinfo.value.workOrderStart = ''
        dataState.dateTime.workStartTimeSt = ''
        dataState.dateTime.workStartTimeEn = ''
    }
}

const daterangeUTime = (val) => {
    if (val) {
        querinfo.value.workOrderEnd = val
        dataState.dateTime.workEndTimeSt = val[0]
        dataState.dateTime.workEndTimeEn = val[1]
    } else {
        querinfo.value.workOrderEnd = ''
        dataState.dateTime.workEndTimeSt = ''
        dataState.dateTime.workEndTimeEn = ''
    }
}
// businessCode
// const businessCode = ref({
//     2: '智能货柜',
//     3: '门店',
//     4: '生活充值',
//     5: '电商到家'
// })
// const orderNo = ref('')
// const toDetail = (row) => {
//     router.push({ name: 'coupon-detail', params: { orderNo } })
// }
const toDetail = async (handleType, info) => {
    const routeData = router.resolve({ name: 'coupon-details', params: { handleType, groupCode: info && info.groupCode, subCode: info && info.businessCode === '1' ? 'A10010002' : info.businessCode === '2' ? 'A10010001' : info.businessCode === '3' ? 'A10010003' : 'A10010004', auditId: info && info.auditId } })
    window.open(routeData.href, '_blank')
}

const dateTime = ref({
    receivedBeginDate: '',
    receivedEndDate: '',
    useBeginDate: '',
    useEndDate: ''
})
// 列表数据
const getRefundList = async () => {
    const params = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        orderNo: dataState.searchData.orderNo,
        workNumber: dataState.searchData.workNumber,
        userCouponStatus: dataState.searchData.userCouponStatus,
        couponType: dataState.searchData.couponType,
        phoneMobile: dataState.searchData.phoneMobile,
        businessCode: dataState.searchData.businessCode,
        currPage: pageinfo.value.currentPage,
        pageSize: pageinfo.value.pageSize
    }
    const res = await couponList(params)
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
// 优惠券核销
const info = ref([])
const usedcoupon = async (row) => {
    dialogCancel.value = true
    info.value = row
    // const params = {
    //     appKey: 'A1001001',
    //     busiCode: 'A1001001',
    //     orderNo: id,
    //     phoneMobile: phone,
    //     userId: userid
    // }
    // await usedCoupon(params)
}
const ruleFormRef = ref(null)
const submitReason = async () => {
    await ruleFormRef.value.validate(async (valid, fields) => {
        if (valid) {
            dialogCancel.value = false
            const params = {
                appKey: 'A1001001',
                busiCode: 'A1001001',
                orderNo: resultForm.value.orderNo,
                phoneMobile: info.value.phoneMobile,
                userId: info.value.userId,
                // couponBatchCode: info.value.groupCode,
                sceneCode: 5,
                couponList: [info.value.couponCode],
                creatorId: userInfo.id,
                orderVO: {
                    orderNo: resultForm.value.orderNo,
                    // orderConponAmount: '9999',
                    orderAmount: '999999'
                }
            }
            await usedCoupon(params)
            ElMessage.success('优惠券核销成功')
            resultForm.value.orderNo = ''
            await getRefundList()
        }
    })
    // dialogCancel.value = false
    // const params = {
    //     appKey: 'A1001001',
    //     busiCode: 'A1001001',
    //     orderNo: resultForm.value.orderNo,
    //     phoneMobile: info.value.phoneMobile,
    //     userId: info.value.userId,
    //     // couponBatchCode: info.value.groupCode,
    //     sceneCode: 5,
    //     couponList: [info.value.couponCode],
    //     creatorId: userInfo.id,
    //     orderVO: {
    //         orderNo: resultForm.value.orderNo,
    //         // orderConponAmount: '9999',
    //         orderAmount: '999999'
    //     }
    // }
    // await usedCoupon(params)
    // ElMessage.success('优惠券核销成功')
    // await getRefundList()
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    querinfo.value.workOrderStart = []
    querinfo.value.workOrderEnd = []
    dataState.dateTime.workStartTimeSt = ''
    dataState.dateTime.workStartTimeEn = ''
    dataState.dateTime.workEndTimeSt = ''
    dataState.dateTime.workEndTimeEn = ''
    getRefundList()
}

// 查询
// const searchCoupon = () => {
//     dataState.pageinfo.currentPage = 1
//     getRefundList()
// }

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currentPage = val
    getRefundList()
}
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getRefundList()
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
