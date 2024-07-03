<template>
    <div>
        <el-form :model="form" label-width="120px" :inline="true">
            <el-form-item label="品牌名称">
                <el-input
                    v-model="form.brandName"
                    placeholder="支持模糊查询"
                />
            </el-form-item>
            <el-form-item>
                <!-- <el-button type="danger">创建</el-button> -->
                <el-button type="primary" @click="search">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="brandCode" label="品牌编码" align="center" />
            <el-table-column prop="brandName" label="品牌名称" align="center" />
            <el-table-column prop="brandAlias" label="品牌别名" align="center" />
            <el-table-column prop="brandEnName" label="品牌英文名称" align="center" />
            <el-table-column prop="companyName" label="公司名称" align="center" />
            <el-table-column prop="webSite" label="公司官网" align="center" />
            <el-table-column prop="companyPhoneNo" label="公司电话" align="center" />
            <el-table-column prop="mobilePhoneNo" label="移动电话" />
            <el-table-column prop="companyDesc" label="公司介绍" align="center" show-overflow-tooltip/>
            <el-table-column prop="qualificateNo" label="资质编码" align="center" />
            <el-table-column prop="gmtBrandExpire" label="品牌过期时间" align="center" />
            <el-table-column prop="isMainBrand" label="主品牌/子品牌" align="center" >
                <template  v-slot="scope">
                    <span>{{scope.row.isMainBrand===1?'子品牌':'主品牌'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="isEnable" label="启用状态" align="center" >
                <template v-slot="scope">
                    <span>{{scope.row.isEnable===1?'启用':'停用'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" align="center" />
            <!-- <el-table-column prop="name" label="操作" align="center">
                <el-button text> 删除 </el-button>
                <el-button text> 编辑 </el-button>
            </el-table-column> -->
        </el-table>
        <div class="demo-pagination-block" style="justify-content:center;display:flex;margin-top:25px;">
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
</template>

<script setup>
import { toRefs, reactive, ref, onMounted, computed } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { getMerchantList } from '@/api/operate/index'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const form = reactive({ brandName: '' })

// 表格数据
const tableData = ref([])
const dataState = reactive({
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }
})

// 搜索
const search = async () => {
    dataState.pageinfo.currentPage = 1
    await getRefundList()
}

onMounted(() => {
    getRefundList()
})

// 列表数据
const getRefundList = async () => {
    const params = {
        body: {
            brandName: form.brandName,
            currPage: dataState.pageinfo.currentPage,
            pageSize: dataState.pageinfo.pageSize,
            appKey: 'A1001000',
            busiCode: 'A1001004'
        },
        appKey: 'A1001000',
        busiCode: 'A1001004',
        configCode: 'UC1657693014433SoKeV',
        name: '品牌查询',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    dataState.pageinfo.total = data.totalCount
    tableData.value = [...data.list]
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
