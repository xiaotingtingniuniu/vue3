<template>
    <!-- 应用类目层级预览 -->
    <el-card class="box-card">
        <div class="search-area">
            <el-form ref="formRef" :model="formData" :inline="true" label-position="right" label-width="130px">
                <el-form-item label="一级应用类目名称" prop="busiFirstCateName">
                    <el-input v-model.trim="formData.busiFirstCateName" placeholder="请输入～" clearable/>
                </el-form-item>
                <el-form-item label="二级应用类目名称" prop="busiSecondCateName">
                    <el-input v-model.trim="formData.busiSecondCateName" placeholder="请输入～" clearable/>
                </el-form-item>
                <el-form-item label="三级应用类目名称" prop="busiThirdCateName">
                    <el-input v-model.trim="formData.busiThirdCateName" placeholder="请输入～" clearable/>
                </el-form-item>
                <el-form-item label="使用状态" prop="isEnabled">
                    <el-select v-model="formData.isEnabled" placeholder="">
                        <el-option label="启用" :value="1" />
                        <el-option label="停用" :value="0" />
                    </el-select>
                </el-form-item>
                <br />
                <el-form-item class="button-box">
                    <el-button @click="addcatalogue('add')" type="primary">创建应用类目</el-button>
                    <el-button @click="search" type="primary">搜索</el-button>

                </el-form-item>
            </el-form>
        </div>
        <el-row>
            <el-col :span="4">
                <h3>应用类目层级预览</h3>
                <el-tree :load="loadNode" lazy :props="defaultProps" show-checkbox />
            </el-col>
            <el-col :span="20">
                <el-tabs
                    v-model="activeName"
                    type="card"
                    class="demo-tabs"
                    @tab-click="handleClick">
                    <el-tab-pane :label="item.name" :name="item.value" v-for="(item,index) in platformTab" :key='index'>
                        <system-list
                            :tHead="tHead"
                            :tableData="tableData"
                            v-model:current-page="pageinfo.currPage"
                            v-model:page-size="pageinfo.pageSize"
                            :total="pageinfo.total"
                            @size-change="sizeChange"
                            @current-change="currentChange"
                        >
                            <template #isEnabled="row">
                                <span>{{row.row.isEnabled ===1?'启用':'停用'}}</span>
                            </template>
                            <template #operation="row">
                                <!-- <el-button @click="removebtn(row)" text>删除</el-button> -->
                                <el-button text type="primary" @click="addcatalogue('edit',row.row.id)" v-if="row.row.isEnabled === 1">编辑</el-button>
                                <el-button text type="primary" @click="stopbtn(row.row.id,'0')" v-if="row.row.isEnabled === 1">停用</el-button>
                                <el-button text type="primary" @click="stopbtn(row.row.id,'0')" v-if="row.row.isEnabled !== 1">--</el-button>
                            </template>
                        </system-list>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
    </el-card>
    <BasicForm  v-if="dialogVisibleDetail" :title='dataState.tabType.label' :visible ='dialogVisibleDetail' @handleClose="dialogVisibleDetail = false" :id = "handleId" :busiCode="dataState.tabType.name" :handleType="handleType"  @fevent="fevent">
    </BasicForm>
</template>
<script setup>
import { ref, onMounted, reactive, toRefs, computed } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import BasicForm from './assembly/application-form.vue'
import { getMerchantList } from '@/api/operate/index'
import { queryCategory, yingyongQueryCategory } from '@/utils'
import { ElMessageBox, ElMessage } from 'element-plus'

import { useStore } from 'vuex'
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogVisibleDetail = ref(false)
const handleId = ref('')
const handleType = ref('')
onMounted(async () => {
    await getCateNameList()
})

const activeName = ref('A1001004')
const platformTab = [
    { name: '到家电商', value: 'A1001004' },
    { name: '进货商城', value: 'A1001005' },
    { name: '货柜', value: 'A1001002' }, // 需要和后端确定一下
    { name: '本地生活', value: 'A1001003' }, // 需要和后端确定一下
    { name: '设备供应链', value: 'A1001006' } // 需要和后端确定一下
]
// 切换tab 获取数据
const changeTabGetData = () => {
    getCateNameList()
    resetTree()
}
// 切换TAB
const handleClick = (tab, event) => {
    dataState.tabType = tab.props
    dataState.pageinfo.currPage = 1
    changeTabGetData()
}
const defaultProps = {
    label: 'name',
    children: 'zones',
    isLeaf: 'leaf'
}
// 类目层级查询懒加载
const rootNode = ref('')
const rootResolve = ref('')
const firstRootNode = ref('')
const firstRootResolve = ref('')
const loadNode = async (node, resolve) => {
    if (node.level === 0) {
        firstRootNode.value = node
        firstRootResolve.value = resolve
    }
    rootNode.value = node
    rootResolve.value = resolve
    const data = await yingyongQueryCategory(node.level + 1, node.level > 0 ? node.data.code : null, dataState.tabType.name)
    data.map(item => {
        item.leaf = node.level >= 2
        return item
    })
    resolve(data)
}

// 更新类目层级
const resetNode = async () => {
    var theChildren = rootNode.value.childNodes
    theChildren.splice(0, theChildren.length)
    await loadNode(rootNode.value, rootResolve.value)
}
// 刷新tree
const resetTree = async () => {
    firstRootNode.value.level = 0
    const root = firstRootNode.value.childNodes
    root.splice(0, root.length)
    await loadNode(firstRootNode.value, firstRootResolve.value)
}
const dataState = reactive({
    formData: {
        firstCateName: '',
        secondCateName: '',
        thirdCateName: '',
        fourthCateName: '',
        isEnabled: ''
    },
    chaildFormData: {
        busiFirstCateName: '',
        busiSecondCateName: '',
        busiThirdCateName: '',
        isEnabled: ''
    },
    pageinfo: {
        total: 0,
        currPage: 1,
        pageSize: 10
    },
    tableData: [],
    selectData: {
        firstCateName: '',
        secondCateName: '',
        thirdCateName: '',
        fourCateName: ''
    },
    // 一级类目
    firstCateNameList: [],
    secondCateNameList: [],
    thirdCateNameList: [],
    fourCateNameList: [],
    tabType: { name: 'A1001004', label: '到家电商' }
})
const { formData, pageinfo, tableData, firstCateNameList, secondCateNameList, thirdCateNameList, selectData, fourCateNameList, chaildFormData } = toRefs(dataState)

// 应用类目列表查询
const getCateNameList = async () => {
    const param = {
        body: {
            ...dataState.formData,
            ...dataState.pageinfo,
            appKey: 'A1001001',
            busiCode: dataState.tabType.name
        },
        appKey: 'A1001001',
        busiCode: dataState.tabType.name,
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC1657693292120raieD',
        name: '应用类目分页查询接口',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(param)
    dataState.tableData = res.list
    dataState.pageinfo.total = res.totalCount
}

const tHead = [
    { align: 'center', tooltip: true, prop: 'busiFirstCateCode', label: '一级应用类目编号', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'busiFirstCateName', label: '一级应用类目名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'busiSecondCateCode', label: '二级应用类目编号', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'busiSecondCateName', label: '二级应用类目名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'busiThirdCateCode', label: '三级应用类目编号', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'busiThirdCateName', label: '三级应用类目名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'isEnabled', label: '使用状态', minWidth: 100, slot: true },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 280, slot: true }
]

// 停用/启用
const stopbtn = async (id, cateStatus) => {
    const param = {
        body: {
            appKey: 'A1001001',
            busiCode: dataState.tabType.name,
            id: id,
            cateStatus: cateStatus

        },
        appKey: 'A1001001',
        busiCode: dataState.tabType.name,
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC16576933622859cCek',
        name: '停用/启用应用类目',
        source: '商品中台',
        modifierId: store.state.userInfo.account,
        operatorId: store.state.userInfo.account,
        operatorName: store.state.userInfo.name
    }
    await getMerchantList(param)
    ElMessage.success('成功')
    await getCateNameList()
}

// 重置
const formRef = ref(null)
const resetForm = () => {
    if (!formRef.value) return
    formRef.value.resetFields()
}

// 查询
const search = async () => {
    dataState.pageinfo.currPage = 1
    await getCateNameList()
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

// 删除弹框数据
const dialogObjDelDef = reactive({
    dialogVisible: false,
    title: '',
    width: '90%',
    successBtnText: '保存',
    closeBtnText: '关闭',
    isFooter: true // 是否显示按钮
})
// 关闭弹窗
const dialogCloseDef = () => {
    dialogObjDelDef.dialogVisible = false
}

// 创建基础目录
const addcatalogue = (type, id) => {
    dialogVisibleDetail.value = true
    handleId.value = id
    handleType.value = type
}
// 删除二次确认
const dialogVisible = ref(false)
const removebtn = (val) => {
    dialogVisible.value = true
}
// 上传图片
const uploadimg = ref(false)
const onuploadimg = () => {
    uploadimg.value = true
}

const fevent = async () => {
    dataState.pageinfo.currPage = 1
    await getCateNameList()
    await resetNode()
}

const tabClick = (tab) => {
    pageinfo.value.currPage = 1
    console.log(tab.paneName)
}
</script>
<style lang="scss" scoped>
.box-card {
    border: initial;
}

.button-box {
    padding-left: 80%;
}
.upload-demo {
    display: flex;
    justify-content: center;
    .el-button {
        margin: 0 20px 0 0;
    }
}
</style>
