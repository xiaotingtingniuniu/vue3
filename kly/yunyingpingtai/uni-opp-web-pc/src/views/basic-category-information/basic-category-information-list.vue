<!-- 基础类目信息列表 -->
<template>
    <div>
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="formData" :inline="true" label-position="right" label-width="130px">
                    <el-form-item label="一级基础类目名称" prop="firstCateName">
                        <el-input v-model.trim="formData.firstCateName" placeholder="请输入～" clearable/>
                    </el-form-item>
                    <el-form-item label="二级基础类目名称" prop="secondCateName">
                        <el-input v-model.trim="formData.secondCateName" placeholder="请输入～" clearable/>
                    </el-form-item>
                    <el-form-item label="三级基础类目名称" prop="thirdCateName">
                        <el-input v-model.trim="formData.thirdCateName" placeholder="请输入～" clearable/>
                    </el-form-item>
                    <el-form-item label="四级基础类目名称" prop="fourthCateName">
                        <el-input v-model.trim="formData.fourthCateName" placeholder="请输入～" clearable/>
                    </el-form-item>
                    <el-form-item label="使用状态" prop="isEnabled">
                        <el-select v-model="formData.isEnabled" placeholder="">
                            <el-option label="停用" :value="0" />
                            <el-option label="启用" :value="1" />
                        </el-select>
                    </el-form-item>
                    <br />
                    <el-form-item class="button-box">
                        <el-button @click="search" type="primary">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-row>
                <el-col :span="4">
                    <h3>基础类目层级预览</h3>
                    <el-tree :load="loadNode" lazy :props="defaultProps" show-checkbox />
                </el-col>
                <el-col :span="20">
                    <system-list
                        :tHead="tHead"
                        :tableData="tableData"
                        v-model:current-page="pageinfo.currPage"
                        v-model:page-size="pageinfo.pageSize"
                        v-model:border="boderls"
                        v-model:stripe="lines"
                        :total="pageinfo.total"
                        @size-change="sizeChange"
                        @current-change="currentChange"
                    >
                        <template #enabled="row">
                            <span>{{row.row.enabled===1?'启用':'停用'}}</span>
                        </template>
                        <template #operation="row">
                            <el-button @click="removebtn(row)" text>删除</el-button>
                            <el-button @click="editbtn(row)" text>编辑</el-button>
                            <el-button @click="stopbtn" text>停用</el-button>
                            <!-- </router-link> -->
                        </template>
                    </system-list>
                </el-col>
            </el-row>
        </el-card>
        <BasicForm :dialog-object="dialogObjDelDef" @dialogClose="dialogCloseDef" @dialogSuccess="dialogSuccessDef">
            <el-form class="dia-form" ref="formRef" :model="formData" :inline="true" label-position="right" label-width="130px" style="margin: 0 auto">
                <template v-if="elastic">
                    <el-form-item label="一级基础类目名称" prop="basicsnameone">
                        <el-input placeholder="主食面点" />
                    </el-form-item>
                    <el-form-item label="二级基础类目名称" prop="basicsnameone">
                        <el-input placeholder="水饺/馄饨" />
                    </el-form-item>
                    <el-form-item label="三级基础类目名称" prop="basicsnameonetwo">
                        <el-input placeholder="煎饺" />
                    </el-form-item>
                    <el-form-item label="四级基础类目名称" prop="basicsnameonetwo">
                        <el-input placeholder="煎饺" />
                    </el-form-item>
                    <el-form-item label="实物｜服务" prop="basicsnamethree">
                        <el-input placeholder="" />
                    </el-form-item>
                    <el-form-item label="商品税收" prop="basicsnamefours">
                        <el-select v-model="formData.state" placeholder="A1A1A1A1A1A1">
                            <el-option label="A1A1A1A1A1A1" :value="1" />
                            <el-option label="B1B1B1B1B1B1" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="使用状态" prop="state">
                        <el-select v-model="formData.state" placeholder="A1A1A1A1A1A1">
                            <el-option label="state" :value="1" />
                            <el-option label="state" :value="0" />
                        </el-select>
                    </el-form-item>
                </template>
                <template v-else>
                    <!-- 修改弹框 -->
                    <el-form-item label="一级基础类目名称" prop="basicsnameone">
                        <el-input placeholder="主食面点" />
                    </el-form-item>
                    <el-form-item label="一级基础类目编号" prop="basicsnameone">
                        <text>1</text>
                    </el-form-item>
                    <el-form-item label="二级基础类目名称" prop="basicsnameone">
                        <el-input placeholder="水饺/馄饨" />
                    </el-form-item>
                    <el-form-item label="二级基础类目编号" prop="basicsnameone">
                        <text>1</text>
                    </el-form-item>
                    <el-form-item label="三级基础类目名称" prop="basicsnameonetwo">
                        <el-input placeholder="煎饺" />
                    </el-form-item>
                    <el-form-item label="三级基础类目编号" prop="basicsnameone">
                        <text>1</text>
                    </el-form-item>
                    <el-form-item label="四级基础类目名称" prop="basicsnameonetwo">
                        <el-input placeholder="煎饺" />
                    </el-form-item>
                    <el-form-item label="四级基础类目编号" prop="basicsnameone">
                        <text>1</text>
                    </el-form-item>
                    <el-form-item label="商品税收" prop="basicsnamefours">
                        <el-select v-model="formData.state" placeholder="A1A1A1A1A1A1">
                            <el-option label="A1A1A1A1A1A1" :value="1" />
                            <el-option label="B1B1B1B1B1B1" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="使用状态" prop="name">
                        <el-select v-model="formData.state" placeholder="A1A1A1A1A1A1">
                            <el-option label="A1A1A1A1A1A1" :value="1" />
                            <el-option label="B1B1B1B1B1B1" :value="0" />
                        </el-select>
                    </el-form-item>
                </template>
            </el-form>
        </BasicForm>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive, computed, toRefs, nextTick } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import BasicForm from './assembly/basic-form.vue'
import { getMerchantList } from '@/api/operate/index'
import { queryCategory } from '@/utils'
import { useStore } from 'vuex'

// 拿到 vuex 中数据
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const aName = computed(() => store.state.token)

onMounted(async () => {
    await getCateNameList()
})

const defaultProps = {
    label: 'name',
    children: 'zones',
    isLeaf: 'leaf'
}

// 类目层级查询懒加载
const loadNode = async (node, resolve) => {
    const res = await queryCategory(node.level + 1, node.level > 0 ? node.data.code : null)
    res.map(item => {
        item.leaf = node.level >= 3
        return {
            value: item.code,
            label: item.name
        }
    })
    resolve(res)
}

// 控制弹框
const dialogVisible = ref(false)
const dataState = reactive({
    formData: {
        firstCateName: '',
        secondCateName: '',
        thirdCateName: '',
        fourthCateName: '',
        isEnabled: ''
    },
    pageinfo: {
        total: 0,
        currPage: 1,
        pageSize: 10
    },
    applyForm: {
        merchantStatus: '',
        rejectReason: ''
    },
    tableData: []
})
const { formData, pageinfo, tableData } = toRefs(dataState)

const getCateNameList = async () => {
    const param = {
        body: {
            businessCode: 'A1001001',
            appKey: 'A1001001',
            busiCode: 'A1001001',
            ...dataState.formData,
            ...dataState.pageinfo
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC1657693176250KjcYR',
        name: '基础类目列表查询接口',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(param)
    dataState.tableData = res.list
    dataState.pageinfo.total = res.totalCount
    console.log(res)
}
const tHead = [
    { align: 'center', tooltip: true, prop: 'firstCateCode', label: '一级基础类目编号', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'firstCateName', label: '一级基础类目名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'secondCateCode', label: '二级基础类目编号', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'secondCateName', label: '二级基础类目名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'thirdCateCode', label: '三级基础类目编号', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'thirdCateName', label: '三级基础类目名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'fourthCateCode', label: '四级基础类目编号', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'fourthCateName', label: '四级基础类目名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'type', label: '实物服务', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'tax', label: '税率', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'enabled', label: '使用状态', minWidth: 100, slot: 'rtue' }
    // { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 280, slot: true }
]

const formRef = ref(null)
const resetForm = () => {
    if (!formRef.value) return
    formRef.value.resetFields()
}

// 查询
const search = () => {
    dataState.pageinfo.currPage = 1
    getCateNameList()
}
const sizeChange = (val) => {
    dataState.pageinfo.currPage = 1
    dataState.pageinfo.pageSize = val
    getCateNameList()
}

const currentChange = (val) => {
    dataState.pageinfo.currPage = val
    getCateNameList()
}
// 弹出框判断
const elastic = ref(true)
// 删除弹框数据
const dialogObjDelDef = reactive({
    dialogVisible: false,
    title: '',
    width: '30%',
    successBtnText: '保存',
    closeBtnText: '关闭',
    isFooter: true // 是否显示按钮
})
// 关闭弹窗
const dialogCloseDef = () => {
    dialogObjDelDef.dialogVisible = false
}
// 确定
const dialogSuccessDef = () => {
    dialogObjDelDef.dialogVisible = false
}

// 编辑表格数据
const editbtn = (val) => {
    dialogObjDelDef.dialogVisible = true
    elastic.value = false
}

// 创建基础目录
const addcatalogue = () => {
    dialogObjDelDef.dialogVisible = true
    elastic.value = true
}

</script>
<style lang="scss" scoped>
.box-card {
    border: initial;
}

.button-box {
    padding-left: 80%;
}

</style>
