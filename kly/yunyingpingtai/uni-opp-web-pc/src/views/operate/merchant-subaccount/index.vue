<template>
    <div>
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef"
                         :model="formData"
                         :inline="true"
                         label-position="right"
                         label-width="120px">
                    <el-form-item label="商家名称"
                                  prop="merchantName"
                                  style="width: 272px">
                        <el-input v-model="formData.merchantName"
                                  placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="手机号"
                                  prop="phoneMobile"
                                  style="width: 272px">
                        <el-input v-model="formData.phoneMobile"
                                  placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="商家类型"
                                  prop="merchantType"
                                  style="width: 272px">
                        <el-select v-model="formData.merchantType"
                                   placeholder="商家类型">
                            <el-option label="企业"
                                       value="1" />
                            <el-option label="自然人"
                                       value="2" />
                            <el-option label="个人工商户"
                                       value="3" />
                            <el-option label="事业单位"
                                       value="4" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="用户类型"
                                  prop="merchantSubType"
                                  style="width: 272px">
                        <el-select v-model="formData.merchantSubType"
                                   placeholder="用户类型">
                            <el-option label="代运营柜主"
                                       value="1" />
                            <el-option label="补货员"
                                       value="2" />
                            <el-option label="分账人"
                                       value="3" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态"
                                  prop="status"
                                  style="width: 272px">
                        <el-select v-model="formData.status"
                                   placeholder="状态">
                            <el-option label="待审核"
                                       value="1" />
                            <el-option label="已审核"
                                       value="2" />
                            <el-option label="审核驳回"
                                       value="3" />
                            <el-option label="停用"
                                       value="4" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="用户姓名" prop="merchantSubName" style="width: 272px">
                        <el-input v-model="formData.merchantSubName" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="组织机构ID" prop="groupId" style="width: 272px">
                        <el-input v-model="formData.groupId" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="组织机构名称" prop="orgName" style="width: 272px">
                        <el-input v-model="formData.orgName" placeholder="请输入" />
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button @click="getListFn"
                                   type="primary">查询</el-button>
                        <el-button @click="resetForm"
                                   type="primary">重置</el-button>
                        <!-- <router-link  :to="{name: 'add-subaccount', params: {type: 'add'}}" custom v-slot="{ navigate }">
                            <el-button type="primary" @click="navigate"  >新增</el-button>
                        </router-link> -->
                    </el-form-item>
                </el-form>
            </div>
            <system-list :tHead="tHead"
                         :tableData="tableData"
                         v-model:current-page="pageInfo.currentPage"
                         v-model:page-size="pageInfo.pageSize"
                         :total="pageInfo.total"
                         @size-change="sizeChange"
                         @current-change="currentChange">
                <template #merchantType="scope">
                    {{merchantTypes[scope.row.merchantType]}}
                </template>
                <template #merchantSubType="scope">
                    <span v-if="scope.row.merchantSubType===1">代运营柜主</span>
                    <span v-if="scope.row.merchantSubType===2">补货员</span>
                    <span v-if="scope.row.merchantSubType===3">分账人</span>
                </template>
                <template #status="scope">
                    {{statusValue[scope.row.status]}}
                </template>
                <template #operation="scope">
                    <router-link :to="{name: 'add-subaccount', params: {type: 'detail', code:scope.row.busiCode,busiMerchantId: scope.row.busiMerchantId ,merchantSubId:scope.row.merchantSubId,status:scope.row.status,merchantSubType:scope.row.merchantSubType}}" custom v-slot="{ navigate }">
                        <el-button @click="navigate" type="primary" text>查看</el-button>
                    </router-link>
                    <!-- <router-link :to="{name: 'add-subaccount', params: {type: 'approval',code:scope.row.busiCode, busiMerchantId: scope.row.busiMerchantId ,merchantSubId:scope.row.merchantSubId,merchantSubType:scope.row.merchantSubType}}" custom v-slot="{ navigate }" v-if="scope.row.status===1">
                        <el-button @click="navigate" type="primary" text>审核</el-button>
                    </router-link> -->
                    <el-button v-if="scope.row.status === 4" @click="changeStatus('OPERATE_MERCHANT_SUBACCOUNT_LIST_ENABLE', scope.row, '启用')" type="primary" text>启用</el-button>
                    <el-button v-if="scope.row.status === 2" @click="changeStatus('OPERATE_MERCHANT_SUBACCOUNT_LIST_DEACTIVATE', scope.row, '停用')" type="primary" text>停用</el-button>
                </template>
            </system-list>
        </el-card>
    </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { getenMerchantList } from '@/api/operate/index'
import { publicRequest } from '@/api/common/index.js'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const store = useStore()
const userInfo = computed(() => store.state.userInfo)

onMounted(async () => {
    await managerListFn()
})
// 搜索
const formData = ref({
    merchantSubType: null,
    merchantName: null,
    phoneMobile: null,
    merchantType: null,
    status: null,
    merchantSubName: null,
    orgName: null,
    groupId: null
})
const pageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})
// 列表
const tableData = ref([])
const getListFn = () => {
    pageInfo.value.currentPage = 1
    managerListFn()
}
const managerListFn = async () => {
    // const params = {
    //     body: {
    //         ...formData.value,
    //         appKey: 'A1001001',
    //         currPage: pageInfo.value.currentPage,
    //         pageSize: pageInfo.value.pageSize
    //     },
    //     appKey: 'A1001001',
    //     busiCode: 'A1001001',
    //     configCode: 'UC13259454390706176',
    //     name: '子账号管理列表',
    //     source: '商户中台'
    // }
    const param = {
        ...formData.value,
        currPage: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    }
    const res = await publicRequest({ module: 'OPREATE', key: 'OPERATE_MERCHANT_SUBACCOUNT_LIST', body: param })
    if (res.code === '200') {
        pageInfo.value.total = res.data.total
        tableData.value = res.data.list
    }
    // const res = await getenMerchantList(params)
    console.log(res, 'res')
    // pageInfo.value.total = res.total
    // tableData.value = res.list
}

const tHead = [
    { align: 'center', tooltip: true, prop: 'merchantSubName', label: '用户名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'merchantType', label: '商户类型', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'merchantSubType', label: '用户类型', minWidth: 160, slot: true },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商家名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'phoneMobile', label: '手机号', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'status', label: '状态', minWidth: 160, slot: true },
    // { align: 'center', tooltip: true, prop: 'phone', label: '子账号角色', minWidth: 130 },
    // { align: 'center', tooltip: true, prop: 'mailbox', label: '上次登录时间', minWidth: 160 },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '创建时间', minWidth: 160 },
    { align: 'center', tooltip: true, prop: 'creatorId', label: '创建人', minWidth: 160 },
    { align: 'center', tooltip: true, prop: 'gmtModify', label: '修改时间', minWidth: 160 },
    { align: 'center', tooltip: true, prop: 'modifierId', label: '修改人', minWidth: 160 },
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
    2: '启用',
    3: '审核驳回',
    4: '停用'
}
const formRef = ref(null)
const resetForm = () => {
    if (!formRef.value) return
    formRef.value.resetFields()
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

// 启用/停用
const changeStatus = async (key, row, name) => {
    const param = {
        busiMerchantId: row.busiMerchantId,
        merchantSubId: row.merchantSubId,
        merchantSubType: row.merchantSubType,
        // 1 待运营商，2补货员 3-分账人 4-店长 5-店员
        operator: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await publicRequest({ module: 'OPREATE', key, body: param })
    console.log(res, 'res')
    if (res.code === '200') {
        ElMessage.success(name + '成功！')
        managerListFn()
    }
}
</script>
<style lang="scss" scoped>
</style>
