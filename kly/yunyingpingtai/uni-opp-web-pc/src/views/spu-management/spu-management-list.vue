<template>
    <div>
        <pdf></pdf>
        <el-form ref="formRef" :model="formData" :inline="true" label-position="right" label-width="130px">
            <el-form-item label="SPU编号" prop="spuId">
                <!--<el-select v-model="formData.state" placeholder="精确匹配">
                    <el-option label="A1" :value="1" />
                    <el-option label="A2" :value="0" />
                </el-select>-->
                <el-input v-model="formData.spuId" placeholder="精确匹配" clearable />
            </el-form-item>
            <el-form-item label="品牌名称" prop="brandName">
                <el-select v-model="formData.brandName" clearable placeholder="请选择">
                    <el-option v-for="el in brandNameList" :label="el.brandName" :value="el.brandName" :key="el.brandName" />
                </el-select>
            </el-form-item>
            <el-form-item label="标品名称" prop="spuName">
                <el-input v-model="formData.spuName" placeholder="请选择标品名称" clearable />
            </el-form-item>
            <el-form-item label="69码" prop="barcodes">
                <el-input v-model="formData.barcodes" placeholder="请输入完整的69码" clearable />
            </el-form-item>
            <el-form-item label="基础类目" prop="basicLevelChecked">
                <el-cascader
                    ref="basicLevelRef"
                    :props="basicLevel"
                    @change="basicLevelChange"
                    v-model="formData.basicLevelChecked"
                    remote
                    clearable
                />
            </el-form-item>
            <el-form-item label="模型训练状态" prop="modelStatuss">
                <el-select v-model="formData.modelStatuss" placeholder="请选择">
                    <el-option label="全部" value="" />
                    <el-option label="初始" :value="0" />
                    <el-option label="训练中" :value="1" />
                    <el-option label="训练完成" :value="2" />
                    <el-option label="上新失败" :value="80" />
                    <el-option label="训练失败" :value="99" />
                </el-select>
            </el-form-item>
            <el-form-item label="属性模版" prop="spuTemplates">
                <el-select v-model="formData.spuTemplates" placeholder="请选择" clearable>
                    <el-option v-for="item in dataState.spuTemplateList" :label="item.name" :value="item.template" :key="item.template" />
                </el-select>
            </el-form-item>
            <el-form-item label="标品状态" prop="spuStatus">
                <el-select v-model="formData.spuStatus" placeholder="请选择">
                    <el-option label="全部" :value="0" />
                    <el-option label="启用" :value="10" />
                    <el-option label="停用" :value="20" />
                    <el-option label="停用可启用" :value="30" />
                </el-select>
            </el-form-item>
            <el-form-item label="销售渠道" prop="saleChannels">
                <el-select v-model="formData.saleChannels" multiple placeholder="支持多选">
                    <el-option label="货柜" value="货柜" />
                    <el-option label="进货商城" value="进货商城" />
                    <el-option label="电商" value="电商" />
                    <el-option label="设备供应链" value="设备供应链" />
                    <el-option label="众包App" value="众包APP" />
                    <el-option label="其他" value="其他" />
                </el-select>
            </el-form-item>
            <el-form-item style="width: 100%">
                <div class="button-box">
                    <el-button @click="syncToProductLibrary" type="primary">同步至货柜标品库</el-button>

                    <div>
                        <el-upload
                            :disabled="authenStatus==0?true:false"
                            :http-request="updateSpu"
                            :on-change="handleChange"
                            :file-list="fileList"
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            :limit="1"
                            show-file-list
                            class="el-upload"
                        >
                            <!-- <el-button type="primary" slot='tip' disabled @click="templateUpdata" v-show="Allbtn">批量更新SPU</el-button> -->
                            <el-button type="primary" @click="templateUpdata">批量更新SPU</el-button>
                        </el-upload>
                        <el-upload
                            :disabled="authenStatus==0?true:false"
                            :http-request="fileRequest"
                            :on-change="handleChange"
                            :file-list="fileListCre"
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            :limit="1"
                            show-file-list
                            class="el-upload"
                        >
                            <el-button type="primary" @click="templateUpdata"> 批量创建SPU </el-button>
                        </el-upload>
                        <el-button @click="createSpu" type="primary">创建SPU</el-button>
                        <!-- <el-button type="primary" @click="templateUpdata">批量更新SPU</el-button> -->

                        <el-button @click="searchList" type="primary">搜 索</el-button>
                        <el-button @click="resetForm(formRef)" type="primary">重置</el-button>
                    </div>
                    <!-- <router-link  :to="{name: 'spu-management-editor', params: {type: 'add', spuTemplate: formData.spuTemplate}}" custom v-slot="{ navigate }">
                        <el-button @click="navigate" type="primary">创建SPU</el-button>
                    </router-link> -->
                </div>

            </el-form-item>
        </el-form>
        <div>
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
                @selection-change="handleSelectionChange"
            >
                <template #spuId="row">
                    <span style="color: rgb(254, 44, 85);cursor:pointer" @click="toDetail(row.row)">{{row.row.spuId}}</span>
                </template>
                <template #spuListPicUrl="row">
                    <el-image style="width: 100px;" preview-teleported :src="row.row.spuListPicUrl" :preview-src-list="[row.row.spuListPicUrl]" fit="cover" />
                </template>

                <!-- <template #supplierType="scope">
                    <span type="text" v-if="scope.row.supplierType === 1" >一件代发</span>
                    <span type="text" v-if="scope.row.supplierType === 2" >入库</span>
                    <span type="text" v-if="scope.row.supplierType === 3" >一件代发+入库</span>
                </template> -->
                <!-- <template #isEnabled="isEnabled">
                    <span type="text" v-if="isEnabled.row.isEnabled === 1" >启用</span>
                    <span type="text" v-if="isEnabled.row.isEnabled === 0" >停用</span>
                </template> -->
                <template #isEnabled="row">
                    <span type="text" v-if="row.row.spuStatus === 10" style="color: green">启用</span>
                    <span type="text" v-if="row.row.spuStatus === 20" >停用</span>
                    <span type="text" v-if="row.row.spuStatus === 30" >停用可启用</span>
                </template>
                <template #modelStatus="row">
                    <span v-if="row.row.modelList&&row.row.modelList.length">{{modelStatusList[row.row.modelList[0]?.modelStatus]}}</span>
                    <span v-else>--</span>
                </template>
                <template #spuTemplate="row">
                    {{dataState.spuTemplateList.find(el => row.row.spuTemplate === el.template).name}}
                </template>
                <template #saleChannel="row">
                    <span>{{formatValue(row.row.saleChannel) }}</span>
                    <!-- <span v-if="row.row.modelList">{{modelStatusList[row.row.modelList[0]?.modelStatus]}}</span>
                    <span v-else>--</span> -->
                </template>
                <template #firstCateName="scope">
                    <span>{{scope.row.firstCateName}}-{{scope.row.secondCateName}}-{{scope.row.thirdCateName}}-{{scope.row.fourthCateName}}</span>
                </template>

                <template #peopel="row">
                    <span>{{row.row.modifier? row.row.modifier:row.row.creator}}</span>
                </template>
                <template #createTime="row">
                    <span>{{row.row.gmtModify? row.row.gmtModify.replace('T',' '):row.row.gmtCreate.replace('T',' ')}}</span>
                </template>
                <template #operation="row">
                    <!--<router-link  :to="{name: 'spu-management-editor', params: {type:'edit',spuTemplate:formData.spuTemplate}}">-->
                    <el-button  class="edit-btn" @click="editBtn(row.row)" type="primary" v-if="row.row.spuStatus === 10">编辑</el-button>
                    <!--</router-link>-->
                    <el-button v-if="row.row.spuStatus === 10" @click="stopBtn(row)" type="primary">停用</el-button>
                    <el-button v-if="row.row.spuStatus === 30" @click="stopOpen(10, row)" type="primary">启用</el-button>
                </template>
                <template #isMaterial="row">
                    <el-button  class="text-btn db" @click="checkMaterial(row.row)" type="primary" text>商品素材媒体文件</el-button>
                    <el-button v-if="row.row.spuTemplate !== 'freezer'" class="text-btn db" @click="checkModel(row.row)" type="primary" text>模型训练媒体文件</el-button>
                </template>

                <template #isModel="row">
                    <div v-if="row.row.spuTemplate !== 'freezer'">
                        <el-button class="text-btn db" @click="checkDetail(row.row)" type="primary" text>查看详情</el-button>
                        <el-button class="text-btn db" @click="pushSpu(row)" type="primary" text>推送图片</el-button>
                    </div>
                    <span v-else>-</span>
                </template>
                <template #status="row">
                    {{statusList[row.row.status]}}
                </template>
            </system-list>
        </div>
        <el-dialog v-model="dialogVisible" title="【重点提示】">
            <div>
                SPU停用后，所有SPU关联的Goods、SKU将全部下架！请确认所选SPU仅停用，还是停用且下架！
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">关闭 </el-button>
                    <el-button type="primary" @click="stopBtnting(20)">停用且下架 </el-button>
                    <el-button type="primary" @click="stopBtnting(30)">停用不下架</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="errorDialogVisible" title="导入失败文件下载：" >
            <div>
                <system-list  :tHead="excelTHead"
                              :tableData="excelTableData"
                              total="0"
                >
                    <template #operation="row">
                        <el-button  class="text-btn db" @click="exports(row.row.url)" type="primary" text>下载</el-button>
                    </template>
                </system-list>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, computed, onMounted, reactive, toRefs } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { useStore } from 'vuex'
import { getMerchantList, getupdate } from '@/api/operate/index'
import { publicRequest } from '@/api/common/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { queryCategory } from '@/utils'

import pdf from './pdf.vue'
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

// 禁止弹出框
const authenStatus = ref(0)
const pageInfo = ref({
    total: null,
    currentPage: 1,
    pageSize: 10
})
const statusList = {
    0: '未推送',
    1: '已推送',
    2: '训练失败',
    3: '训练成功'
}

const modelStatusList = {
    0: '初始', 1: '训练中', 2: '训练完成', 80: '上新失败', 99: '训练失败'
}
// tab 默认值切换
const activeName = ref('fast_food')
const dialogVisible = ref(false)
const errorDialogVisible = ref(false)
const excelTableData = ref([])
const dataState = reactive({
    spuTemplateList: [],
    formData: {
        spuId: '',
        spuName: '',
        brandName: '',
        barcodes: '', // 69码
        modelStatuss: '',
        spuTemplates: '',
        spuTemplate: 'fast_food',
        spuStatus: [], // 标品状态
        saleChannels: [] // 销售渠道
    },
    tablist: [
        {
            tabname: '方便速食',
            spuTemplate: 'fast_food'
        },
        {
            tabname: '主食面点',
            spuTemplate: 'pastry'
        },
        {
            tabname: '卤味熟食',
            spuTemplate: 'cooked_food'
        },
        {
            tabname: '调味酱汁',
            spuTemplate: 'sauces'
        },
        {
            tabname: '水饮',
            spuTemplate: 'water'
        },
        {
            tabname: '果汁饮料',
            spuTemplate: 'drink'
        },
        {
            tabname: '乳饮咖啡',
            spuTemplate: 'coffee'
        },
        {
            tabname: '膨化食品',
            spuTemplate: 'puffed_food'
        },
        {
            tabname: '乳制品',
            spuTemplate: 'dairy'
        },
        {
            tabname: '个人护理',
            spuTemplate: 'nursing'
        },
        {
            tabname: '海鲜水产',
            spuTemplate: 'seafood'
        },
        {
            tabname: '肉禽类',
            spuTemplate: 'meat'
        },
        {
            tabname: '果蔬类',
            spuTemplate: 'fruits_veg'
        }
    ],
    tableData: []
})
const { formData, tablist, tableData } = toRefs(dataState)

const fileList = ref([])
const fileListCre = ref([])

const basicLevelRef = ref(null)

// 基础类目联动
const basicLevel = {
    lazy: true,
    multiple: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await queryCategory(level + 1, data.value || '')
        const nodes = res.map((item) => {
            return {
                label: item.name,
                value: item.code,
                level: item.level,
                leaf: level >= 3
            }
        })
        resolve(nodes)
    }
}

// 基础类目change
const basicLevelChange = (value) => {
    const first = []
    const second = []
    const three = []
    const fourth = []
    dataState.basicLevelCheckedNodes = basicLevelRef.value.getCheckedNodes(true)
    dataState.basicLevelCheckedNodes.forEach((item) => {
        first.push(item.pathLabels[0])
        second.push(item.pathLabels[1])
        three.push(item.pathLabels[2])
        fourth.push(item.pathLabels[3])
    })
    dataState.formData.firstCateName = new Set(first)
    dataState.formData.secondCateName = new Set(second)
    dataState.formData.thirdCateName = new Set(three)
    dataState.formData.fourthCateName = new Set(fourth)
}

onMounted(async () => {
    await getPinpaiList()
    await getTableList()
})
// 表头
const tHead = [
    { align: 'center', tooltip: true, minWidth: 76, type: 'selection' },
    { align: 'center', tooltip: true, prop: 'spuId', label: 'SPU编号', minWidth: 300, slot: true },
    { align: 'center', tooltip: true, prop: 'spuName', label: '标品名称', minWidth: 140 },
    { align: 'center', prop: 'spuListPicUrl', label: '商品图片', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'brandName', label: '品牌名称', minWidth: 80 },
    // { align: 'center', tooltip: true, prop: 'productType', label: '商品类别', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'spuTemplate', label: '属性模板', minWidth: 140, slot: true },
    { align: 'center', tooltip: true, prop: 'barcode', label: '69码', minWidth: 140 },
    { align: 'center', tooltip: false, prop: 'firstCateName', label: '基础类目', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'saleChannel', label: '销售渠道', minWidth: 240, slot: true },
    { align: 'center', tooltip: true, prop: 'guidePrice', label: '官方指导价（¥）', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'isEnabled', label: '状态', minWidth: 80, slot: true },
    { align: 'center', tooltip: true, prop: 'modelStatus', label: '模型训练状态', minWidth: 110, slot: true },
    { align: 'center', tooltip: true, prop: 'isMaterial', label: '多媒体素材管理', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'isModel', label: '模型训练详情', minWidth: 110, slot: true },
    { align: 'center', tooltip: true, prop: 'createTime', label: '最新操作时间', minWidth: 140, slot: true },
    { align: 'center', tooltip: true, prop: 'peopel', label: '最后操作人', minWidth: 140, slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 200, slot: true }
]
const excelTHead = [
    { align: 'center', tooltip: true, prop: 'fileName', label: '文件名', minWidth: 300 },
    { align: 'center', tooltip: true, prop: 'operateTime', label: '导入失败时间', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 200, slot: true }
]
// 处理数据
// const formatValue = (value) => {
//     if (!value) return ''
//     const reg = /B2B/gi
//     const rst = value.toLowerCase().replace(reg, '进货')
//     return rst
// }
// 处理数据
const formatValue = (value) => {
    if (!value) return ''
    const reg = /B2B/gi
    if (!value.match(reg)) return value
    const rst = value.replace(reg, '进货')
    return rst
}
// 切换TAB
const handleClick = (tab, event) => {
    dataState.formData.spuTemplate = tab.props.name
    pageInfo.value.currentPage = 1
    getTableList()
}
// 搜索数据
const searchList = () => {
    pageInfo.value.currentPage = 1
    getTableList()
}
// 全选
const spuIdsList = ref([])
const handleSelectionChange = (val) => {
    spuIdsList.value = val.map(item => item.spuId)
    console.log(spuIdsList.value, ' spuIdsList.value')
}
// 同步至货柜标品库
const syncToProductLibrary = async () => {
    if (spuIdsList.value.length > 0) {
        const params = {
            spuIds: spuIdsList.value
        }
        const res = await publicRequest({ key: 'SYNC_PRODUCT_LIBRARY', body: params })
        if (res.code === '200') {
            ElMessage.success(res.message)
            searchList()
        } else {
            ElMessage.error(res.message)
        }
    } else {
        ElMessage.error('请勾选列表！')
    }
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}
const createSpu = () => {
    if (!dataState.formData.spuTemplates) return ElMessage.error('请选择属性模版！')
    router.push({
        name: 'spu-management-editor',
        params: {
            type: 'add',
            spuTemplate: dataState.formData.spuTemplates
        }
    })
}
// 品牌搜索
const brandNameList = ref([])
const getPinpaiList = async () => {
    const parm = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001004',
            currPage: 1,
            pageSize: 999
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
    const res = await getMerchantList(parm)
    brandNameList.value = res.list
}
// 获取SPU列表
const getTableList = async () => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001004',
            spuIds: dataState.formData.spuId ? [dataState.formData.spuId] : [],
            spuName: dataState.formData.spuName,
            brandNames: dataState.formData.brandName.split(','),
            // spuTemplate: dataState.formData.spuTemplate,
            barcodes: dataState.formData.barcodes.split(','),
            spuTemplates: dataState.formData.spuTemplates ? [dataState.formData.spuTemplates] : [],
            modelStatuss: dataState.formData.modelStatuss !== '' ? [dataState.formData.modelStatuss] : [],
            spuStatus: dataState.formData.spuStatus ? [dataState.formData.spuStatus] : [],
            saleChannels: dataState.formData.saleChannels,
            firstCateNames: dataState.formData.firstCateName ? dataState.formData.firstCateName : [],
            secondCateNames: dataState.formData.secondCateName ? dataState.formData.secondCateName : [],
            thirdCateNames: dataState.formData.thirdCateName ? dataState.formData.thirdCateName : [],
            fourthCateNames: dataState.formData.fourthCateName ? dataState.formData.fourthCateName : [],
            pageNo: pageInfo.value.currentPage,
            pageSize: pageInfo.value.pageSize
        },
        appKey: 'A1001000',
        busiCode: 'A1001004',
        // configCode: 'UC1657692903781wCdeA',
        // name: 'SPU分页列表',
        configCode: 'UC15115376448741376',
        name: 'spu通用搜索接口V2',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(param)
    tableData.value = res.list.map(item => {
        if (item.spuMediaList) {
            item.spuMediaList.map(el => {
                if (el.mediaType + '' === '2') {
                    item.spuListPicUrl = el.mediaUrl
                }
            })
        } else {
            item.spuListPicUrl = null
        }
        return {
            ...item
        }
    })
    pageInfo.value.total = res.total
}
// 跳转详情
const toDetail = (row) => {
    const spuId = row.spuId
    router.push({ name: 'spu-management-editor', params: { type: 'publicGoodsDetail', spuTemplate: row.spuTemplate, spuId: row.spuId } })
}
// 编辑
const editBtn = (row) => {
    const spuId = row.spuId
    // router.push({ name: 'spu-management-editor', params: { type: 'edit', spuTemplate: dataState.formData.spuTemplate, spuId: row.spuId } })
    router.push({ name: 'spu-management-editor', params: { type: 'edit', spuTemplate: row.spuTemplate, spuId: row.spuId } })
}
// 停用/启用
const stopOpen = async (num, row) => {
    console.log(row.row, '属性模版')
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001004',
            spuId: row.row.spuId,
            spuStatus: num
        },
        appKey: 'A1001000',
        busiCode: 'A1001004',
        configCode: 'UC48371465046585344',
        name: 'SPU状态变更',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    ElMessageBox.confirm(
        '确定要启用吗？',
        '确认框',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            const res = await getMerchantList(param)
            ElMessage.success('启用成功')
            await getTableList()
        })
}

const rowList = ref({})
const stopBtn = async (row) => {
    console.log(row.row, '属性模版')
    dialogVisible.value = true
    rowList.value = row.row
}

const stopBtnting = async (num) => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001004',
            spuId: rowList.value.spuId,
            spuStatus: num
        },
        appKey: 'A1001000',
        busiCode: 'A1001004',
        configCode: 'UC48371465046585344',
        name: 'SPU状态变更',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    ElMessageBox.confirm(
        ' 若已确定停用当前“SPU”，点击“确认”按钮完成操作。',
        '',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            const res = await getMerchantList(param)
            dialogVisible.value = false
            ElMessage.success('成功')
            await getTableList()
        })
}
// 查看素材媒体文件跳转
const checkMaterial = (row) => {
    router.push({ name: 'apply-detail', params: { goodsId: row.spuId } })
}
// 查看媒体素材
const checkModel = (row) => {
    router.push({ name: 'model-detail', params: { goodsId: row.spuId } })
}
// 查看详情
const checkDetail = (row) => {
    router.push({ name: 'spu-model-training-list', params: { goodsId: row.spuId } })
}
const pushSpu = async (row) => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            spuId: row.row.spuId // ,
            // modelCodeList: [row.row.modelCode]
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        name: 'SPU训练推送',
        url: '/goods/spu/model/send/v1',
        source: '商品中台'
    }
    const res = await getMerchantList(param)
}
// 页数改变
const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    getTableList()
}
// 当前也改变
const currentChange = (val) => {
    pageInfo.value.currentPage = val
    getTableList()
}

const Allbtn = ref(false)
// 获取属性模版列表
const getTemplateList = async () => {
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001004'
    }
    const res = await publicRequest({ key: 'SPU_TEMPLATE_LIST_V3', body: params })
    if (res.code === '200') {
        dataState.spuTemplateList = res.data
    }
    console.log(res, ' res')
}
getTemplateList()

const fileName = ref('')

const handleChange = async (file, fileList) => {
    if (file.name !== fileList[0].name) {
        fileList.shift()
    }
    fileList.splice(0, 1)
    fileName.value = file.name
    excelTableData.value = []
}
const handleChangec = async (file, fileListCre) => {
    if (file.name !== fileListCre[0].name) {
        fileListCre.shift()
    }
    fileListCre.splice(0, 1)
    fileName.value = file.name
    excelTableData.value = []
}

const templateUpdata = async () => {
    if (dataState.formData.spuTemplates) { authenStatus.value = 1 } else {
        authenStatus.value = 0
    }
    if (!dataState.formData.spuTemplates) return ElMessage.error('请选择属性模版！')
}
const beforehange = async (file, fileList) => {
    if (!dataState.formData.spuTemplates) return ElMessage.error('请选择属性模版！')
    if (dataState.formData.spuTemplates) { authenStatus.value = 1 }
    return false
}
// 创建
const fileRequest = async (file) => {
    let goodsName = ''
    if (dataState.formData.spuTemplates === 'fast_food') {
        goodsName = '方便速食'
    } else if (dataState.formData.spuTemplates === 'pastry') {
        goodsName = '主食面点'
    } else if (dataState.formData.spuTemplates === 'cooked_food') {
        goodsName = '卤味熟食'
    } else if (dataState.formData.spuTemplates === 'sauces') {
        goodsName = '调味酱汁'
    } else if (dataState.formData.spuTemplates === 'dairy') {
        goodsName = '乳制品'
    } else if (dataState.formData.spuTemplates === 'water') {
        goodsName = '水饮'
    } else if (dataState.formData.spuTemplates === 'drink') {
        goodsName = '果汁饮料'
    } else if (dataState.formData.spuTemplates === 'coffee') {
        goodsName = '乳饮咖啡'
    } else if (dataState.formData.spuTemplates === 'nursing') {
        goodsName = '个人护理'
    } else if (dataState.formData.spuTemplates === 'puffed_food') {
        goodsName = '膨化食品'
    } else if (dataState.formData.spuTemplates === 'seafood') {
        goodsName = '海鲜水产'
    } else if (dataState.formData.spuTemplates === 'meat') {
        goodsName = '肉禽类'
    } else if (dataState.formData.spuTemplates === 'fruits_veg') {
        goodsName = '果蔬类'
    } else if (dataState.formData.spuTemplates === 'freezer') {
        goodsName = '智能货柜'
    }
    const formData = new FormData()
    formData.append('file', file.file)
    formData.append('appKey', 'A1001001')
    formData.append('busiCode', 'A1001001')
    formData.append('goodsName', goodsName)
    formData.append('creatorName', userInfo.value.name)
    formData.append('configCode', 'UC16588040604786UChg')
    formData.append('creatorId', userInfo.value.account)
    const res = await getupdate(formData)
    if (res.code === '200' && (res.data === '' || res.data === null)) {
        ElMessage.success('成功')
    }
    if (res.code === '200' && res.data.success === false) {
        errorDialogVisible.value = true
        excelTableData.value.push({
            fileName: res.data.fileName,
            operateTime: res.data.operateTime,
            url: res.data.url
        })
    }
}
// 更新
const updateSpu = async (file) => {
    if (dataState.formData.spuTemplates === '') return ElMessage.error('请选择属性模版！')
    let goodsName = ''
    if (dataState.formData.spuTemplates === 'fast_food') {
        goodsName = '方便速食'
    } else if (dataState.formData.spuTemplates === 'pastry') {
        goodsName = '主食面点'
    } else if (dataState.formData.spuTemplates === 'cooked_food') {
        goodsName = '卤味熟食'
    } else if (dataState.formData.spuTemplates === 'sauces') {
        goodsName = '调味酱汁'
    } else if (dataState.formData.spuTemplates === 'dairy') {
        goodsName = '乳制品'
    } else if (dataState.formData.spuTemplates === 'water') {
        goodsName = '水饮'
    } else if (dataState.formData.spuTemplates === 'drink') {
        goodsName = '果汁饮料'
    } else if (dataState.formData.spuTemplates === 'coffee') {
        goodsName = '乳饮咖啡'
    } else if (dataState.formData.spuTemplates === 'nursing') {
        goodsName = '个人护理'
    } else if (dataState.formData.spuTemplates === 'puffed_food') {
        goodsName = '膨化食品'
    } else if (dataState.formData.spuTemplates === 'seafood') {
        goodsName = '海鲜水产'
    } else if (dataState.formData.spuTemplates === 'meat') {
        goodsName = '肉禽类'
    } else if (dataState.formData.spuTemplates === 'fruits_veg') {
        goodsName = '果蔬类'
    } else if (dataState.formData.spuTemplates === 'freezer') {
        goodsName = '智能货柜'
    }
    const formData = new FormData()
    formData.append('file', file.file)
    formData.append('appKey', 'A1001001')
    formData.append('busiCode', 'A1001001')
    formData.append('goodsName', goodsName)
    formData.append('creatorName', userInfo.value.name)
    formData.append('configCode', 'UC51691368734109696')
    formData.append('creatorId', userInfo.value.account)
    const res = await getupdate(formData)
    if (res.code === '200' && (res.data === '' || res.data === null)) {
        ElMessage.success('成功')
    }
    if (res.code === '200' && res.data.success === false) {
        errorDialogVisible.value = true
        excelTableData.value.push({
            fileName: res.data.fileName,
            operateTime: res.data.operateTime,
            url: res.data.url
        })
    }
}
// 下载链接
const exports = (url) => {
    window.location.href = url
}
</script>
<style lang="scss" scoped>
.button-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.el-upload{
    margin: 0 5px;
}
a{
    text-decoration-line: none;
}
.edit-btn{
    color: #ffffff;
    margin-right: 10px;
}
.text-btn{
    color: rgb(254, 44, 85);
    margin: auto !important;
    cursor:pointer;
}
.descStyle {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 3; //行数
  -webkit-box-orient: vertical;
}
.db{
    display: block;
}
</style>
