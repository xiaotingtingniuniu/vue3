<template>
    <div>
        <el-form :model="form" label-width="120px" :inline="true">
            <el-form-item label="商品类型">
                <el-select v-model="form.firstCateName" class="m-2" placeholder="请选择" >
                    <el-option v-for="item in firstCateNameList" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="备注">
                <el-input v-model="form.name"  />
            </el-form-item> -->
            <div style="margin-left: 1000px; margin-bottom: 50px;">
                <!-- <el-button type="danger" @click="jump">创建</el-button> -->
                <el-button type="primary" @click="searchCoupon()">
                    查询
                </el-button>
            </div>
        </el-form>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="编号" align="center" />
            <el-table-column prop="name" label="商品类别" align="center" />
            <el-table-column prop="fenlei" label="商品分类-子级" align="center" />
            <el-table-column prop="tax" label="税率" align="center" />
            <el-table-column prop="remark" label="备注" align="center" />
        </el-table>
        <div class="demo-pagination-block" style="margin: 0 auto;width:50%">
            <el-pagination
                v-model:currentPage="pageinfo.currPage"
                v-model:page-size="pageinfo.pageSize"
                :page-sizes="[10, 20, 30, 40]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            />
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, toRefs, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMerchantList } from '@/api/operate/index'
import { queryCategory } from '@/utils'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const jump = () => {
    router.push({ name: 'spu-management-editor' })
}

// 表格数据
const tableData = []
const dataState = reactive({
    form: {
        firstCateName: ''
    },
    pageinfo: {
        total: 0,
        currPage: 1,
        pageSize: 10
    },
    firstCateNameList: []

})
const { form, pageinfo, firstCateNameList } = toRefs(dataState)

const getfirstCateNameList = async () => {
    const res = await queryCategory(1)
    dataState.firstCateNameList = res
}

const getTableList = async () => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            ...dataState.form,
            ...dataState.pageinfo
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC1657693271184prydj',
        name: '税率查询接口',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    tableData.value = data
    console.log(data)
}

onMounted(async () => {
    await getfirstCateNameList()
    await getTableList()
})

// 查询
const searchCoupon = () => {
    dataState.pageinfo.currPage = 1
    getTableList()
}

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currPage = val
    getTableList()
}
const sizeChange = (val) => {
    dataState.pageinfo.currPage = 1
    dataState.pageinfo.pageSize = val
    getTableList()
}
</script>
