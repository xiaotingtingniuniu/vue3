<template>
    <div class="stockListBox">
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item label="活动页名称" prop="promoName">
                <el-input v-model="form.promoName"  placeholder="活动页名称"/>
            </el-form-item>
            <br>
            <el-form-item class="button-box">
                <el-button type="primary" @click="searchCoupon">
                    查询
                </el-button>
                <el-button type="primary" @click="add">
                    新增
                </el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="promoCode" label="活动页ID" />
            <el-table-column prop="businessCode" label="业务线" />
            <el-table-column prop="promoName" label="活动页名称" />
            <el-table-column prop="url" label="活动页URL" />
            <el-table-column prop="promoBeginDate" label="活动开始时间" />
            <el-table-column prop="promoEndDate" label="活动结束时间" />
            <el-table-column prop="gmtCreate" label="创建时间" />
            <el-table-column prop="gmtModify" label="更新时间" />
            <el-table-column label="操作" align="center">
                <template v-slot="scope">
                    <el-button text type="primary" @click="view(scope.row)"> 查看 </el-button>
                    <el-button text type="primary" @click="edit(scope.row)" v-if="scope.row.promoStatus !== 3"> 编辑 </el-button>
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
    <cst-form v-model="visible" v-if="visible" :type="dataState.dialogType" :title="Title"  :row="dataState.row" @getList="getRefundList"></cst-form>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { getManagementList, getManagementDetail } from '@/api/marketing/active'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import CstForm from './form/form.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
// 查询项
const form = reactive({
    promoName: ''
})
const tableData = ref([])
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
})
// 获取数据
const getRefundList = async () => {
    // const params = {
    //     pageNo: dataState.pageinfo.currentPage,
    //     pageSize: dataState.pageinfo.pageSize,
    //     promoName: form.promoName,
    //     appKey: 'A1001000', // 系统编号
    //     busiCode: 'A1001002' // 业务线编号
    // }
    // const { data } = await replenishmentAllList(params)
    // tableData.value = data.list/*  */
    // dataState.pageinfo.total = data.totalCount
    const param = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UCJH76318640568823808',
        name: '进货商城活动列表聚合',
        source: '运营后台',
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            promoName: form.promoName,
            pageNum: dataState.pageinfo.currentPage,
            pageSize: dataState.pageinfo.pageSize,
            promoType: 2
        }
    }
    const res = await getManagementList(param)
    if (res.code === '200') {
        tableData.value = res.data.list
        dataState.pageinfo.total = res.data.count
    }
}
// 查询
const searchCoupon = async () => {
    dataState.pageinfo.currentPage = 1
    await getRefundList()
}
// 新增
const add = async () => {
    Title.value = '新增'
    visible.value = true
}
// 查看
const view = async (row) => {
    const params = {
        promoCode: row.promoCode,
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001002' // 业务线编号
    }
    const res = await getManagementDetail(params)
    if (res.code === '200') {
        dataState.row = res.data
        Title.value = '查看'
        visible.value = true
    }
}
// 编辑
const edit = async (row) => {
    const params = {
        promoCode: row.promoCode,
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001002' // 业务线编号
    }
    const { data } = await getManagementDetail(params)
    dataState.row = data
    Title.value = '编辑'
    visible.value = true
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
