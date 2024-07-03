<template>
    <div>
        <el-card class="box-card">
            <div class="search-area">
                <el-form
                    ref="formRef"
                    :model="formData"
                    :inline="true"
                    label-position="right"
                    label-width="120px">
                    <el-form-item
                        label="商家名称"
                        prop="merchantName"
                        style="width: 272px">
                        <el-input
                            v-model="formData.merchantName"
                            placeholder="请输入" />
                    </el-form-item>
                    <el-form-item
                        label="商户手机号"
                        prop="phoneMobile"
                        style="width: 272px">
                        <el-input
                            v-model="formData.phoneMobile"
                            placeholder="请输入" />
                    </el-form-item>
                    <el-form-item
                        label="用户名称"
                        prop="merchantSubName"
                        style="width: 272px">
                        <el-input
                            v-model="formData.merchantSubName"
                            placeholder="请输入" />
                    </el-form-item>
                    <el-form-item
                        label="子账户手机号"
                        prop="subPhoneMobile"
                        style="width: 272px">
                        <el-input
                            v-model="formData.subPhoneMobile"
                            placeholder="请输入" />
                    </el-form-item>
                    <el-form-item
                        label="设备ID"
                        prop="deviceNo"
                        style="width: 272px">
                        <el-input
                            v-model="formData.deviceNo"
                            placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="超时天数" prop="startTime" style="width: 272px">
                        <el-date-picker
                            v-model="formData.startTime"
                            placeholder="请选择开始生效时间"
                            type="datetime"
                            value-format="YYYY-MM-DD HH:mm:ss"
                        />
                    </el-form-item>
                    <el-form-item>
                        <span>至</span>
                    </el-form-item>
                    <el-form-item prop="endTime" style="width: 272px">
                        <el-date-picker
                            v-model="formData.endTime"
                            placeholder="请选择开始生效时间"
                            type="datetime"
                            value-format="YYYY-MM-DD HH:mm:ss"
                        />
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button @click="managerListFn(true)" type="primary">查询</el-button>
                        <el-button @click="resetForm" type="primary">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange">

                <template #merchantType="{row}">
                    <span v-if="Number(row.merchantType) === 1">柜主</span>
                    <span v-else-if="Number(row.merchantType) === 2">代运营商</span>
                    <span v-else>-</span>
                </template>
                <template #sbsongType>
                    <span>代运营商</span>
                </template>
                <template #applyUnbind="{row}">
                    <span v-if="Number(row.applyUnbind) === 0">未申请</span>
                    <span v-else-if="Number(row.applyUnbind) === 1">申请中</span>
                    <span v-else-if="Number(row.applyUnbind) === 2">完成</span>
                    <span v-else>-</span>
                </template>
                <template #timeoutDays="scope">
                    {{scope.row.timeoutDays}}天
                </template>
                <template #operation="{row}">
                    <span v-if="Number(row.applyUnbind) === 0">已处理</span>
                    <el-button type="text" v-else-if="Number(row.applyUnbind) === 1" @click="chuli(row)">处理</el-button>
                    <span v-else-if="Number(row.applyUnbind) === 2">已处理</span>
                    <span v-else>-</span>
                </template>
            </system-list>
        </el-card>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { getMerchantListCode, getenMerchantList } from '@/api/operate/index'
import { ElMessage, ElMessageBox } from 'element-plus'

onMounted(async () => {
    await managerListFn()
})
// 搜索
const formData = ref({
    merchantName: '',
    phoneMobile: '',
    merchantSubName: '',
    subPhoneMobile: '',
    deviceNo: '',
    startTime: '',
    endTime: ''
})
const pageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})
// 列表
const tableData = ref([])
const managerListFn = async () => {
    const params = {
        body: {
            ...formData.value,
            appKey: 'A1001001',
            busiCode: 'A1001002',
            currPage: pageInfo.value.currentPage,
            pageSize: pageInfo.value.pageSize
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC33599707812634624',
        name: '商户设备申请解绑列表',
        source: '商户中台'
    }
    const res = await getenMerchantList(params)
    console.log(res, 'res')
    pageInfo.value.total = res.total
    tableData.value = res.list
}

const tHead = [
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商户名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'merchantType', label: '商户类型', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'sbsongType', label: '用户类型', minWidth: 160, slot: true },
    { align: 'center', tooltip: true, prop: 'merchantSubName', label: '用户名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'deviceNo', label: '设备ID', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'phoneMobile', label: '柜主手机号', minWidth: 160 },
    { align: 'center', tooltip: true, prop: 'subPhoneMobile', label: '用户手机号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'applyTime', label: '申请时间', minWidth: 160 },
    { align: 'center', tooltip: true, prop: 'applyUnbind', label: '申请状态', minWidth: 160, slot: true },
    { align: 'center', tooltip: true, prop: 'timeoutDays', label: '已超时', minWidth: 160, slot: true },
    { align: 'center', tooltip: true, prop: 'operatorName', label: '处理人', minWidth: 160 },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 180, fixed: 'right', slot: true }
]
const merchantTypes = {
    1: '企业',
    2: '自然人',
    3: '个人工商户',
    4: '事业单位'
}
const statusValue = {
    1: '待审核',
    2: '已审核',
    3: '审核驳回',
    4: '停用'
}
const formRef = ref(null)
const resetForm = () => {
    if (!formRef.value) return
    formRef.value.resetFields()
    managerListFn()
}

const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    managerListFn()
}

const currentChange = (val) => {
    pageInfo.value.currentPage = val
    managerListFn()
}
const chuli = (val) => {
    ElMessageBox.confirm(
        '请确认已充分与双方沟通达成一致，完成解绑解绑后，设备将被冻结',
        {
            confirmButtonText: '完成解绑',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(async () => {
            const params = {
                body: {
                    appKey: 'A1001001',
                    busiCode: 'A1001002',
                    busiMerchantId: val.busiMerchantId,
                    deviceNo: val.deviceNo,
                    merchantSubId: val.merchantSubId,
                    merchantType: val.merchantType,
                    modifierId: JSON.parse(localStorage.getItem('userInfo'))?.account ?? '',
                    operatorld: JSON.parse(localStorage.getItem('userInfo'))?.account ?? '',
                    operatorName: JSON.parse(localStorage.getItem('userInfo'))?.name ?? ''
                },
                appKey: 'A1001001',
                busiCode: 'A1001001',
                configCode: 'UC33602359032193024',
                name: '商户设备解绑接口',
                source: '商户中台'
            }
            const { code } = await getMerchantListCode(params)
            if (Number(code) === 200) {
                ElMessage({
                    type: 'success',
                    message: '操作成功'
                })
                managerListFn()
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消'
            })
        })
}
</script>
<style lang="scss" scoped>
</style>
