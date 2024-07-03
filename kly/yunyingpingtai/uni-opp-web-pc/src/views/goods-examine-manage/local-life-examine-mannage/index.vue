<template>
    <div class="local-life-examine-mannage">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="申请编号" prop="approvalCode">
                        <el-input v-model="searchData.approvalCode" placeholder="请输入申请编号" clearable />
                    </el-form-item>
                    <el-form-item label="商户ID" prop="merchantId">
                        <el-input v-model="searchData.merchantId" placeholder="请输入商户ID" clearable />
                    </el-form-item>
                    <el-form-item label="商户名称" prop="merchantName">
                        <el-input v-model="searchData.merchantName" placeholder="请输入商户名称" clearable />
                    </el-form-item>
                    <el-form-item label="审核状态" prop="approveStatus">
                        <el-select v-model="searchData.approveStatus" clearable placeholder="请选择" >
                            <el-option label="全部" value="" />
                            <el-option label="待审核" :value="2" />
                            <el-option label="审核通过" :value="3" />
                            <el-option label="驳回" :value="4" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品编码" prop="skuId">
                        <el-input v-model="searchData.skuId" placeholder="请输入商品编码" clearable />
                    </el-form-item>
                    <el-form-item label="商品名称" prop="skuName">
                        <el-input v-model="searchData.skuName" placeholder="请输入商品名称" clearable />
                    </el-form-item>
                    <el-form-item label="提交时间" prop="date">
                        <el-date-picker
                            v-model="searchData.date"
                            type="daterange"
                            range-separator="-"
                            value-format="YYYY-MM-DD"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            @change="dateChange"
                        />

                    </el-form-item>

                    <el-form-item class="button-box">

                        <el-button type="primary" @click="okAudit(3)">
                            审核通过
                        </el-button>
                        <el-button type="primary" @click="searchList(true)">
                            搜索
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>

                    </el-form-item>
                </el-form>
            </div>
        </el-card>

        <el-card class="box-card" style="margin-top: 20px">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageInfo.currPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
                @selection-change="tableSelection"
            >
                <template #approvalCode="scope">
                    <span style="color: rgb(254, 44, 85);cursor: pointer" v-if="scope.row.approvalCode"  @click="toDetail(scope.row, 'cat')" type="primary" text>{{ scope.row.approvalCode }}</span>
                    <span v-if="!scope.row.approvalCode">--</span>
                </template>
                <template #approveStatus="scope">
                    <span v-if="scope.row.approveStatus === 2">待审核</span>
                    <span v-if="scope.row.approveStatus === 3">审核通过</span>
                    <span v-if="scope.row.approveStatus === 4">驳回</span>
                </template>
                <!-- <template #categoryList="scope">
                    <template v-if="scope?.row?.categoryList && scope?.row?.categoryList?.length">
                        {{scope.row.categoryList.map(el => {
                            return `${el.busiFirstCateName}-${el.busiSecondCateName}-${el.busiThirdCateName}`
                        }).join(',')}}
                        {{scope.row.categoryList[0].busiFirstCateName}}
                    </template>

                </template> -->
                <template #categoryList="{row}">
                    <template v-if="row.categoryList && row.categoryList.length">
                        {{row.categoryList.map(el => {
                            return `${el.busiFirstCateName}-${el.busiSecondCateName}`
                        }).join(',')}}
                    </template>
                </template>
                <template #image="scope">
                    <img :src="scope.row.image" alt="" style="width: 100px" @click="handlePicturePreview(scope.row.image)">
                </template>
                <template #approveAdvise="scope">
                    <span v-if="scope.row.approveStatus === 3">通过</span>
                    <span v-if="scope.row.approveStatus === 4">驳回</span>
                </template>
                <template #operation="scope">
                    <el-button type="primary" v-if="scope.row.approveStatus === 3 || scope.row.approveStatus === 4"  @click="toDetail(scope.row, 'cat')">查看详情</el-button>
                    <el-button type="primary" v-else @click="toDetail(scope.row, 'examine')">审核</el-button>
                </template>
            </system-list>
        </el-card>
        <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" style="width: 100%; height: 100%" alt="Preview Image" />
        </el-dialog>
        <el-dialog
            v-if="auditDialog"
            v-model="auditDialog"
            title="提示"
            width="30%"
            :before-close="handleClose"
        >
            <h3>请确认是否提交审批结果？</h3>
            <h3>若确认无误，请点击“确定”按钮完成审核。</h3>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="auditDialog = false">关闭</el-button>
                    <el-button type="primary" @click="onSubmit(3)">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, onMounted, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import { publicRequest } from '@/api/common/index.js'

import { ElMessage } from 'element-plus'
import { tHead, dataState } from './userConfig.js'
const { tableData, pageInfo } = toRefs(dataState)

const router = useRouter()
const formEl = ref(null)
const formRef = ref()
const searchData = ref({
    approvalCode: '', // 申请编号
    merchantId: '', // 商户ID
    merchantName: '', // 商户名称
    approveStatus: '', // 审核状态 2 审批中、3 审批通过、4审批拒绝
    skuId: '', // 商品编码
    skuName: '', // 商品名称
    gmtApplyStart: '', // 提交开始时间
    gmtApplyEnd: '', //	提交结束时间
    date: []
})
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const auditDialog = ref(false)

const selectionData = ref([])

// table 全选
const tableSelection = val => {
    selectionData.value = val
}

const handleClose = () => {
    auditDialog.value = false
}
// 重置搜索条件
const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()

    searchData.value.gmtApplyStart = '' // 	审核开始时间
    searchData.value.gmtApplyEnd = '' //	审核结束时间
    getList()
}
// 审核通过
const okAudit = async (state) => {
    if (!selectionData.value.length) {
        return ElMessage.error('请选择要审核的商品')
    }
    const list = selectionData.value.filter((item) => item.approveStatus === 3 || item.approveStatus === 4)
    if (list.length > 0) {
        return ElMessage.error('请勾选未审核的数据')
    }
    auditDialog.value = true
}

const onSubmit = async (state) => {
    const approvalCodeList = []
    selectionData.value.forEach(el => {
        approvalCodeList.push(el.approvalCode)
    })
    const params = {
        body: {
            approvalCodeList,
            approveStatus: state // 审批状态为通过
        }
    }
    const res = await publicRequest({ key: 'LOCAL_LIFE_EXAMINE_MANNAGE_AUDIT', body: params.body })

    if (res.code === '200') {
        ElMessage.success('操作成功')
        getList()
        auditDialog.value = false
    }
    // if (res.code === '200') {
    //     ElMessage.success('操作成功')
    //     searchList()
    //     auditDialog.value = false
    // }
}
onMounted(() => {
    getList()
    resetForm()
})
// 查询
const searchList = async () => {
    pageInfo.value.currPage = 1
    getList('search')
}
// 搜索列表
const getList = async (key) => {
    const params = {
        ...searchData.value,
        currPage: pageInfo.value.currPage,
        pageSize: pageInfo.value.pageSize
    }
    if (searchData.value.date) {
        delete params.date
    }

    // if (key === 'search') {
    //     params = {
    //         ...params,
    //         ...searchData.value
    //     }
    //     if (params.date) {
    //         delete params.date
    //     }
    // }
    const res = await publicRequest({ key: 'LOCAL_LIFE_EXAMINE_MANNAGE_V5', body: params })
    if (res.code === '200') {
        dataState.tableData = res?.data?.list || []
        pageInfo.value.total = res?.data?.total
    }
}

// 日期数据变化
const dateChange = (val) => {
    searchData.value.gmtApplyStart = val === null ? '' : val[0] // 	审核开始时间
    searchData.value.gmtApplyEnd = val === null ? '' : val[1] //	审核结束时间
}

const allSelection = () => {
    if (!formRef.value) return
    formRef.value.tableRef.toggleAllSelection()
}
// 预览
const handlePicturePreview = (file) => {
    dialogImageUrl.value = file
    dialogVisible.value = true
}
//
const toDetail = async (val, type) => {
    // 跳转到查看详情
    router.push({
        name: 'local-life-examine-mannage-detail',
        query: {
            id: val.approvalCode,
            type
        }
    })
}
const sizeChange = (val) => {
    dataState.pageInfo.currPage = 1
    dataState.pageInfo.pageSize = val
    getList({ ...searchData.value })
}

const currentChange = val => {
    dataState.pageInfo.currPage = val
    getList({ ...searchData.value })
}
</script>
<style lang="scss">
.local-life-examine-mannage {
    .search-area {
        .el-form-item__content {
            width: 240px !important;
        }
    }
}
</style>
