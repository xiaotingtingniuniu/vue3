<template>
    <div class="stockListBox">
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item label="柜主名称" prop="ownerName">
                <el-input v-model="form.ownerName"  placeholder="根据柜主名称模糊查询"/>
            </el-form-item>
            <el-form-item label="柜主编号" prop="ownerCode">
                <el-input v-model="form.ownerCode"  placeholder="根据设备编号精确查询"/>
            </el-form-item>
            <el-form-item label="设备编号" prop="equipmentCode">
                <el-input v-model="form.equipmentCode"  placeholder="根据设备编号精确查询"/>
            </el-form-item>
            <el-form-item label="设备名称" prop="equipmentName">
                <el-input v-model="form.equipmentName"  placeholder="根据设备名称模糊查询"/>
            </el-form-item>
            <br>
            <el-form-item class="button-box">
                <el-button type="primary" @click="searchCoupon">
                    查询
                </el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="ownerCode" label="柜主编号"  />
            <el-table-column prop="ownerName" label="柜主名称"  />
            <el-table-column prop="equipmentCode" label="设备编号" />
            <el-table-column prop="equipmentName" label="设备名称" />
            <el-table-column prop="pointName" label="设备点位" />
            <el-table-column prop="ruleName" label="规则名称" />
            <el-table-column prop="wholeShortageRate" label="整柜缺货率">
                <template v-slot="scope">
                    <span>{{scope.row.wholeShortageRate}}%</span>
                </template>
            </el-table-column>
            <el-table-column prop="skuShortageRate" label="单品缺货率">
                <template v-slot="scope">
                    <span>{{scope.row.skuShortageRate}}%</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template v-slot="scope">
                    <el-button text type="primary" @click="editRule(scope.row)"> 编辑 </el-button>
                    <el-button text type="primary" @click="delRule(scope.row)"> 删除 </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="bottom">
            <div class="demo-pagination-block" style="margin:0 auto">
                <el-pagination
                    v-model:currentPage="dataState.pageinfo.currentPage"
                    v-model:page-size="dataState.pageinfo.pageSize"
                    :page-sizes="[10, 20, 30, 40]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="dataState.pageinfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                />
            </div>
        </div>
    </div>
    <edit-form v-model="visible" v-if="visible" :type="dataState.dialogType" :title="Title"  :row="dataState.row" @getList="getRefundList"></edit-form>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { repRuleDetailList, repRuleDetailQueryById, repRuleDetailDelete } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import EditForm from './form/edit-rule.vue'
// import { putAccountStatus } from '@/api/marketing/marketing-cost'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const form = reactive({
    ownerName: '',
    ownerCode: '',
    equipmentCode: '',
    equipmentName: ''
})
// 底部全选复选框
const checked = ref(false)
const checked1 = ref(false)

const tableData = ref([])

// 重置
const resetFormData = ref(null)
const resetForm = () => {
    resetFormData.value.resetFields()
    setTimeout(() => {
        dataState.pageinfo.currentPage = 1
        getRefundList()
    })
}

// 数据接口
const dataState = reactive({
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    },
    row: null

})
// 数据总数
const totals = ref(0)
const Title = ref('补货详情')
const visible = ref(false)

onMounted(async () => {
    getRefundList()
    // uslistone()
    // uslisttwo()
})

const onelist = ref([])
const twolist = ref([])
// 展示数据接口
const getRefundList = async () => {
    const params = {
        pageNo: dataState.pageinfo.currentPage,
        pageSize: dataState.pageinfo.pageSize,
        ownerName: form.ownerName,
        ownerCode: form.ownerCode,
        equipmentCode: form.equipmentCode,
        equipmentName: form.equipmentName
    }
    const { data } = await repRuleDetailList(params)
    tableData.value = data.list/*  */
    dataState.pageinfo.total = data.totalCount
}
// 编辑规则
const editRule = async (row) => {
    const params = {
        id: row.id
    }
    const { data } = await repRuleDetailQueryById(params)
    dataState.row = data
    Title.value = '设备补货规则调整'
    visible.value = true
}
// 取消规则
const delRule = async (row) => {
    const param = {
        id: row.id,
        creatorId: userInfo.value.id
    }
    ElMessageBox.confirm(
        '确定删除当前数据吗？',
        '删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            const res = await repRuleDetailDelete(param)
            if (res.code === '200') {
                ElMessage.success('删除成功')
                getRefundList()
            }
        })
}
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

// 查询
// GOODS165796715460328471 SKU165797196618369677
const searchCoupon = async () => {
    dataState.pageinfo.currentPage = 1
    await getRefundList()
}

</script>

<style lang="scss" scoped>
.stockListBox{
    .btns{
        margin: 50px 0 20px 1300px;
    }
    .date-list{
        background-color: rgba($color: black, $alpha: 0.2);
        margin-top: 10px;
        display: flex;
    span{
        flex: 1;
    }
    }
    .bottom{
        display: flex;
    }
    .el-pager li.is-active{
        color: #409EFF !important;
    }
    .primaryBox{
        color: #409EFF !important;
    }
    .demo-pagination-block{
        .is-active{
            color: #409EFF !important;
        }
    }
}

</style>
