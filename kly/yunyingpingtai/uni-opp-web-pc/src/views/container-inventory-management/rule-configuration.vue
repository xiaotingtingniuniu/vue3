<template>
    <div class="stockListBox">
        <el-button type="primary" @click="addRule">
            新增规则
        </el-button>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="ruleName" label="规则名称"  />
            <el-table-column prop="ruleType" label="规则类型">
                <template #default="scope">
                    <div>
                        <span v-if="scope.row.ruleType === 1">城市适用</span>
                        <span v-if="scope.row.ruleType === 2">柜主适用</span>
                        <span v-if="scope.row.ruleType === 3">设备适用</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="ruleDetails" label="规则对象">
                <template #default="scope">
                    <div>
                        <span v-if="scope.row.ruleType === 1">{{scope.row.ruleDetailsCount}}个城市适用</span>
                        <span v-if="scope.row.ruleType === 2">{{scope.row.ruleDetailsCount}}个柜主适用</span>
                        <span v-if="scope.row.ruleType === 3">{{scope.row.ruleDetailsCount}}个设备适用</span>
                    </div>
                </template>
            </el-table-column>
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
            <el-table-column prop="ruleStatus" label="规则状态">
                <template #default="scope">
                    <div>
                        <span v-if="scope.row.ruleStatus === 0">待生效</span>
                        <span v-if="scope.row.ruleStatus === 1">已生效</span>
                        <span v-if="scope.row.ruleStatus === 2">作废</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template v-slot="scope">
                    <el-button text type="primary" v-if="scope.row.ruleStatus === 0" @click="editRule(scope.row)"> 编辑 </el-button>
                    <el-button text type="primary" v-if="scope.row.ruleStatus === 0" @click="delRule(scope.row)"> 删除 </el-button>
                    <el-button text type="primary" v-if="scope.row.ruleStatus === 0" @click="view(1, scope.row)"> 生效 </el-button>
                    <el-button text type="primary" v-if="scope.row.ruleStatus === 1" @click="view(0, scope.row)"> 作废 </el-button>
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
    <add-form v-model="addVisible" v-if="addVisible" :type="dataState.dialogType" :title="Title"  :row="dataState.row" @getList="getRefundList"></add-form>
    <edit-form v-model="editVisible" v-if="editVisible" :type="dataState.dialogType" :title="Title"  :row="dataState.row" @getList="getRefundList"></edit-form>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { repRuleList, replenishmentkDetail, replenishmentExport, repRuleValid, repRuleDelete, repRuleQueryById } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import AddForm from './form/add-rule-config.vue'
import EditForm from './form/edit-rule-config.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const form = reactive({
    equipmentCode: '',
    equipmentName: '',
    startTime: '',
    endTime: '',
    pointName: '',
    ownerName: ''
})
// 底部全选复选框
const checked = ref(false)
const checked1 = ref(false)
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
const Title = ref('补货规则')
const addVisible = ref(false)
const editVisible = ref(false)

onMounted(async () => {
    getRefundList()
})
// 展示数据接口
const getRefundList = async () => {
    const params = {
        pageNo: dataState.pageinfo.currentPage,
        pageSize: dataState.pageinfo.pageSize
    }
    const { data } = await repRuleList(params)
    tableData.value = data.list/*  */
    dataState.pageinfo.total = data.totalCount
}
// 新增规则配置
const addRule = async () => {
    addVisible.value = true
    Title.value = '新增补货规则'
}
// 编辑规则配置
const editRule = async (row) => {
    const params = {
        id: row.id
    }
    const res = await repRuleQueryById(params)
    if (res.code === '200') {
        dataState.row = res.data
        Title.value = '编辑补货规则'
        editVisible.value = true
    }
}
// 删除规则配置
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
            const res = await repRuleDelete(param)
            if (res.code === '200') {
                ElMessage.success('删除成功')
                getRefundList()
            }
        })
}
// 生效/作废规则配置
const view = async (num, row) => {
    const param = {
        id: row.id,
        valid: num,
        creatorId: userInfo.value.id
    }
    let codeName = '生效'
    if (num === 1) {
        codeName = '生效'
    } else if (num === 0) {
        codeName = '作废'
    }
    ElMessageBox.confirm(
        `确定要${codeName}吗？`,
        `${codeName}确认框`,
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            const res = await repRuleValid(param)
            if (res.code === '200') {
                ElMessage.success(codeName + '成功')
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
