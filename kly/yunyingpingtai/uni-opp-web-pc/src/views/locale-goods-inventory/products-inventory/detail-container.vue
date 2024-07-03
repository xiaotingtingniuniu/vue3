<template>
    <div class='product-examine-manage' v-loading="loading">
        <el-form label-position="right" label-width="auto">
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="审批编号">
                        <el-input v-model="$route.params.approvalCode" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="审核状态">
                        <el-select v-model="detailInfo.approveStatus" :disabled="disabled" controls-position="right" class="form-action-item-50w">
                            <el-option label="未提交" :value="1" />
                            <el-option label="待审核" :value="2" />
                            <el-option label="审核通过" :value="3" />
                            <el-option label="驳回" :value="4" />
                            <el-option label="建模审核中" :value="5" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请时间">
                        <el-input v-model="detailInfo.gmtCreate" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="审批时间">
                        <el-input v-model="detailInfo.gmtDeal" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="审批人">
                        <el-input v-model="detailInfo.modifierId" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="品牌名称">
                        <el-input v-model="detailInfo.brandName"  :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商品名称">
                        <el-input v-model="detailInfo.spuName" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="69码">
                        <el-input v-model="detailInfo.barcode" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="净含量">
                        <el-input v-model="detailInfo.netRatio" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商品规格">
                        <el-input v-model="detailInfo.productSpec" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="保质期">
                        <el-input v-model="detailInfo.productShelfLife" :disabled="disabled" controls-position="right" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否小规格">
                        <el-radio-group v-model="detailInfo.isSmallSpec" :disabled="disabled">
                            <el-radio :label="1" >是</el-radio>
                            <el-radio :label="0" >否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form-item label="补存信息">
                        <el-input v-model="detailInfo.addition" :disabled="disabled" controls-position="right" class="form-action-item-50w" type="textarea"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="12">
                    <el-form-item label="背标图">
                        <img v-for="img in detailInfo.backscript" :key="img" :src="img" class="detail-img">
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="条形码图">
                        <img v-for="img in detailInfo.barcodeImgs" :key="img" :src="img" class="detail-img">
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="12">
                    <el-form-item label="模型训练图片">
                        <img v-for="img in detailInfo.modelImgs" :key="img" :src="img" class="detail-img">
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-card style="margin-top: 40px;">
            <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="auto">
                <div>
                    <h4>审批</h4>
                    <el-form-item label="审批结果" prop="state" :rules="rules.state">
                        <el-radio-group v-model="ruleForm.state" :disabled="!($route.params?.examine === 'examine')">
                            <el-radio :label="3" >通过</el-radio>
                            <el-radio :label="4" >驳回</el-radio>
                        </el-radio-group>
                        <el-button type="primary" style="margin-left: 30px" @click="productDialogShow()" v-if="$route.params?.examine === 'examine'">
                            检索标品库
                        </el-button>
                    </el-form-item>
                    <el-form-item label="审批意见" :rules="rules.approveAdvise">
                        <el-input
                            v-model="ruleForm.approveAdvise"
                            :disabled="!($route.params?.examine === 'examine')"
                            placeholder="请输入审批意见"
                            show-word-limit
                            type="textarea"
                            maxlength="80"
                        />
                    </el-form-item>
                    <el-form-item label="是否创建新品" prop="creatProduct" :rules="rules.creatProduct">
                        <el-radio-group v-model="ruleForm.creatProduct" @change="creatProductChange()" :disabled="!($route.params?.examine === 'examine')">
                            <el-radio :label="1" >创建新标品</el-radio>
                            <el-radio :label="0" @click="productDialogShow()" v-if="$route.params?.examine === 'examine'">关联现有标品</el-radio>
                            <el-radio :label="0" v-else>关联现有标品</el-radio>
                        </el-radio-group>
                        <span v-if="ruleForm.creatProduct === 0 && relationSpu">
                            (标品编码：{{relationSpu.spuId}}&nbsp;&nbsp;&nbsp;标品名称：{{relationSpu.spuName}})
                        </span>
                    </el-form-item>
                    <el-form-item label="销售渠道" prop="saleChannel" :rules="rules.saleChannel">
                        <el-checkbox-group v-model="ruleForm.saleChannel" :disabled="!($route.params?.examine === 'examine')">
                            <el-checkbox label="货柜">货柜</el-checkbox>
                            <el-checkbox label="B2B商城">进货商城</el-checkbox>
                            <el-checkbox label="门店">门店</el-checkbox>
                            <el-checkbox label="电商">电商</el-checkbox>
                            <!-- <el-checkbox v-for="(item, index) in CheckArray" :key="index" :label="item.label">{{ item.name }}</el-checkbox> -->
                        </el-checkbox-group>
                    </el-form-item>
                    <div class="mt-20">
                        <el-button type="primary" @click="goBack()">
                            关闭
                        </el-button>
                        <el-button v-if="$route.params?.examine === 'examine'" type="primary" @click="productCheckDialogShow()" >
                            提交审批结果
                        </el-button>
                    </div>
                </div>
            </el-form>
        </el-card>
        <el-dialog v-model="dialogVisible"  width="50%"  :before-close="productCheckDialogHide" title="标品核查">
            <el-form
                ref="productCheckFormRef"
                :model="productCheckForm"
                label-width="120px"
                :rules="productFormRules"
            >
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="品牌名称" prop="brandName">
                            <el-input v-model="productCheckForm.brandName" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="标品名称" prop="spuName">
                            <el-input v-model="productCheckForm.spuName" placeholder="品牌名+商品名称+口味+ 净含量+净含量单位"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="69码" prop="barcode">
                            <el-input v-model="productCheckForm.barcode" placeholder="请按照商品包装上的条形码填写"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品规格" prop="productSpec">
                            <el-select v-model="productCheckForm.productSpec">
                                <el-option label="瓶" :value="'瓶'" />
                                <el-option label="罐" :value="'罐'" />
                                <el-option label="包" :value="'包'" />
                                <el-option label="袋" :value="'袋'" />
                                <el-option label="个" :value="'个'" />
                                <el-option label="盒" :value="'盒'" />
                                <el-option label="桶" :value="'桶'" />
                                <el-option label="箱" :value="'箱'" />
                                <el-option label="条" :value="'条'" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="净含量" prop="netRatio">
                            <el-input v-model="productCheckForm.netRatio"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="净含量单位" prop="netRatioUnit">
                            <el-select v-model="productCheckForm.netRatioUnit">
                                <el-option label="g" :value="'g'" />
                                <el-option label="kg" :value="'kg'" />
                                <el-option label="ml" :value="'ml'" />
                                <el-option label="L" :value="'L'" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="保质期" prop="productShelfLife">
                            <el-input v-model="productCheckForm.productShelfLife"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="保质期单位" prop="productShelfLifeUnit">
                            <el-select v-model="productCheckForm.productShelfLifeUnit">
                                <el-option label="小时" :value="'小时'" />
                                <el-option label="日" :value="'日'" />
                                <el-option label="月" :value="'月'" />
                                <el-option label="年" :value="'年'" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否小规格" prop="isSmallSpec">
                            <el-radio-group v-model="productCheckForm.isSmallSpec">
                                <el-radio :label="1" >是</el-radio>
                                <el-radio :label="0" >否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="属性模块" prop="spuTemplate">
                            <el-select v-model="productCheckForm.spuTemplate" placeholder="请选择" clearable>
                                <el-option v-for="item in spuTemplateList" :label="item.name" :value="item.template" :key="item.template" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="基础类目" prop="basicLevelChecked">
                            <el-cascader
                                ref="basicLevelRef"
                                :props="basicLevel"
                                @change="basicLevelChange"
                                v-model="productCheckForm.basicLevelChecked"
                                remote
                                clearable
                                v-if="basicLevelRefVisiable"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="APP扫码商品图" prop="appPicUrl">
                            <cst-upload
                                :limit="1"
                                :multiple="false"
                                v-model:fileList="productCheckForm.appPicUrl"
                                accept=".jpg,.png,.jpeg"
                                tip="尺寸：200*200,格式：png，大小：不大于50K，仅限一张"
                                :mediaType="10"
                            >
                            </cst-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="SPU列表图" prop="listPicUrl">
                            <cst-upload
                                :limit="1"
                                :multiple="false"
                                v-model:fileList="productCheckForm.listPicUrl"
                                accept=".jpg,.png,.jpeg"
                                tip="应用类目展示图片。大小： 140*140，仅限一张"
                                :mediaType="6"
                            >
                            </cst-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">关闭</el-button>
                    <el-button type="primary" @click="productCheckSubmit(productCheckFormRef)">保存</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog v-model="productDialogVisible" title="关联标品-公共商品库" width="950px" @close="dialogClose">
            <el-form ref="dialogFormRef" :model="dialogSearch" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="标品编码" prop="spuIds" label-width="75px">
                    <el-input v-model="dialogSearch.spuIds" placeholder="精确匹配" clearable />
                </el-form-item>
                <el-form-item label="标品名称" prop="spuName" label-width="75px">
                    <el-input v-model="dialogSearch.spuName" placeholder="请输入标品名称" clearable />
                </el-form-item>
                <el-form-item label="标品69码" prop="barcodes" label-width="75px">
                    <el-input v-model="dialogSearch.barcodes" placeholder="精确匹配" clearable />
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="dialogSearchList" :disabled="(dialogSearch.spuIds || dialogSearch.spuName || dialogSearch.barcodes) ? false : true">搜索</el-button>
                    <el-button type="primary" @click="dialogResetForm(dialogFormRef)" :disabled="(dialogSearch.spuIds || dialogSearch.spuName || dialogSearch.barcodes) ? false : true">重置</el-button>
                    <el-button type="primary" @click="bindSpu()" :disabled="dialogSelection ? false : true">关联所选标品</el-button>
                </el-form-item>
            </el-form>
            <system-list
                class="dialogTable"
                :height="300"
                ref="dialogTableListRef"
                :tHead="dialogTHead"
                :tableData="dialogTableData"
                v-model:current-page="dialogCurrentPage"
                @select="dialogSelectable"
                @selectAll="dialogSelectableAll"
                v-model:page-size="dialogPageSize"
                :total="dialogTotal"
                @size-change="dialogSizeChange"
                @current-change="dialogCurrentChange"
            >
                <template #spuListPicUrl="scope">
                    <el-image style="width: 100px; height: 100px" preview-teleported :src="scope.row.imgUrl" :preview-src-list="[scope.row.imgUrl]" fit="cover" />
                </template>
            </system-list>
        </el-dialog>
    </div>
</template>
<script setup>
import { reactive, ref, toRefs, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import CstUpload from '@/components/upload/upload.vue'
import { ElMessage } from 'element-plus'
import { publicRequest } from '@/api/common/index.js'
import { queryCategory } from '@/utils'
import { getMerchantList } from '@/api/operate/index'
import { Flag } from '@element-plus/icons'

const route = useRoute()
const router = useRouter()
const disabled = ref(true)
const dialogVisible = ref(false) // 标品内容核查页面
const productDialogVisible = ref(false) // 关联标品库弹窗
const ruleFormRef = ref(null)
const productCheckFormRef = ref('')
const checkList = ref([])
const loading = ref(false)
const ruleForm = reactive({
    state: null, // 审批状态 3、审核通过 4、驳回
    approveAdvise: null, // 审批意见
    creatProduct: null, // 是否创建新标品
    saleChannel: [] // 销售渠道

})

const productCheckForm = reactive({
    appPicUrl: [],
    listPicUrl: []
})

const detailInfo = ref({
    // 审批编号
    approveStatus: '', // 审核状态
    gmtApply: '', // 申请时间
    gmtDeal: '', // 审批时间
    modifierId: '', // 审批人
    brandName: '', // 品牌名称
    spuName: '', // 商品名称
    barcode: '', // 69码
    productShelfLife: '', // 保质期
    productSpec: '', // 商品规格
    isSmallSpec: '', // 是否小规格 1是 0 否
    netRatio: '', // 净含量
    productTaste: '', // 口味
    addition: '', // 补充信息
    overlook: '', // 俯拍图
    frontage: [], // 正面朝上
    opposite: [], // 反面朝上
    backscript: [], // 背标图
    barcodeImgs: [], // 条形码
    modelImgs: [], // 训练模型图
    vedio: '' // 视频
})
// 表单项规则
const rules = reactive({
    state: [{ required: true, message: '请选择审批意见', trigger: 'change' }],
    creatProduct: [{ required: true, message: '请选择', trigger: 'change' }],
    saleChannel: [{ type: 'array', required: true, message: '请选择', trigger: 'change' }]

})
// 新建标品表单项规则
const productFormRules = reactive({
    brandName: [{ required: true, message: '请输入', trigger: 'change' }],
    spuName: [{ required: true, message: '请输入', trigger: 'change' }],
    barcode: [{ required: true, message: '请输入', trigger: 'change' }],
    productSpec: [{ required: true, message: '请选择', trigger: 'change' }],
    netRatio: [{ required: true, message: '请输入', trigger: 'change' }],
    netRatioUnit: [{ required: true, message: '请选择', trigger: 'change' }],
    productShelfLife: [{ required: true, message: '请输入', trigger: 'change' }],
    productShelfLifeUnit: [{ required: true, message: '请选择', trigger: 'change' }],
    isSmallSpec: [{ required: true, message: '请选择', trigger: 'change' }],
    spuTemplate: [{ required: true, message: '请选择', trigger: 'change' }],
    basicLevelChecked: [{ required: true, message: '请选择', trigger: 'change' }],
    appPicUrl: [{ required: true, message: '请上传', trigger: 'change' }],
    listPicUrl: [{ required: true, message: '请上传', trigger: 'change' }]
})

const getDetail = async () => {
    const params = { approvalCode: route.params.approvalCode }
    loading.value = true
    const res = await publicRequest({ key: 'PRODUCT_EXAMINE_MANAGE_DETAIL', body: params })
    if (res.code === '200') {
        Object.assign(detailInfo.value, res.data)
        ruleForm.approveAdvise = res.data.approveAdvise
        ruleForm.state = (res.data.approveStatus === 3 || res.data.approveStatus === 5) ? 3 : res.data.approveStatus === 4 ? 4 : null
        ruleForm.creatProduct = res.data.newSpu
        ruleForm.saleChannel = res.data.saleChannel ? res.data.saleChannel.split(',') : []

        detailInfo.value.productShelfLife = res.data.productShelfLife
        detailInfo.value.netRatio = res.data.netRatio
        res.data.spuApprovalMedias.length && res.data.spuApprovalMedias.map(el => {
            // 俯拍
            if (el.mediaType === 1) {
                detailInfo.value.overlook = el.mediaUrl
            }
            // 正面朝上
            if (el.mediaType === 2) {
                detailInfo.value.frontage.push(el.mediaUrl)
            }
            // 反面朝上
            if (el.mediaType === 3) {
                detailInfo.value.opposite.push(el.mediaUrl)
            }
            // 条形码
            if (el.mediaType === 5) {
                detailInfo.value.barcodeImgs.push(el.mediaUrl)
            }
            // 背标图
            if (el.mediaType === 6) {
                detailInfo.value.backscript.push(el.mediaUrl)
            }
            // 视频
            if (el.mediaType === 4) {
                detailInfo.value.vedio = el.mediaUrl
            }
            // 模型训练图片
            if (el.mediaType !== 4) {
                detailInfo.value.modelImgs.push(el.mediaUrl)
            }
        })
        setTimeout(() => {
            ruleFormRef.value.clearValidate()
            loading.value = false
        }, 60)
    }
}
getDetail()
const basicLevelRef = ref(null)
const productDataState = reactive({
    basicLevelRefVisiable: true,
    basicLevelCheckedInfo: {},
    firstCateNameList: [],
    secondCateNameList: [],
    thirdCateNameList: [],
    fourCateNameList: [],
    cateList: []
})
const { basicLevelRefVisiable } = toRefs(productDataState)

// 基础类目联动
const basicLevel = {
    lazy: true,
    multiple: false,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await queryCategory(level + 1, data.value || '')
        const nodes = res.map(item => {
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
    const basicLevelChecked = basicLevelRef.value.getCheckedNodes(true)[0]
    productDataState.cateList = []
    productDataState.basicLevelCheckedInfo.thirdCateName = basicLevelChecked.pathLabels[2]
    productDataState.basicLevelCheckedInfo.thirdCateCode = basicLevelChecked.pathValues[2]
    productDataState.basicLevelCheckedInfo.fourthCateName = basicLevelChecked.pathLabels[3]
    productDataState.basicLevelCheckedInfo.fourthCateCode = basicLevelChecked.pathValues[3]
    console.log(productDataState.basicLevelCheckedInfo)
}
// 是否创建新品
const creatProductChange = () => {
    if (ruleForm.creatProduct === 1) {
        dialogSelection.value = null
        relationSpu.value = null
    } else {
        productDialogShow()
    }
}
// 关联标品库弹窗show
const productDialogShow = () => {
    productDialogVisible.value = true
    getDialogData()
}
// 关闭时的回调 清空筛选项
const dialogClose = () => {
    productDialogVisible.value = false
    dialogTableData.value = []
    dialogTotal.value = 0
    dialogCurrentPage.value = 1
    dialogSearch.value = {
        spuIds: null,
        spuName: null,
        barcodes: null
    }
}
// 关联标品库搜索项
const dialogSearch = ref({
    spuIds: null,
    spuName: null,
    barcodes: null
})
const dialogTableListRef = ref()
const dialogTableData = ref([])
const dialogTotal = ref(0)
const dialogCurrentPage = ref(1)
const dialogPageSize = ref(10)
const dialogFormRef = ref(null)
const dialogSelection = ref(null)
const relationSpu = ref(null) // 选择关联标品后展示信息
const dialogResetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    dialogSelection.value = null
    dialogTableData.value = []
    dialogTotal.value = 0
    dialogCurrentPage.value = 1
}
const dialogSizeChange = (val) => {
    dialogCurrentPage.value = 1
    dialogPageSize.value = val
    dialogSelection.value = null
    getDialogData()
}
const dialogCurrentChange = (val) => {
    dialogCurrentPage.value = val
    dialogSelection.value = null
    getDialogData()
}
const dialogSearchList = async () => {
    dialogCurrentPage.value = 1
    getDialogData()
}
const dialogTHead = [
    { align: 'center', tooltip: true, type: 'selection', minWidth: 60 },
    { align: 'center', tooltip: true, prop: 'spuId', label: '标品编码', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'spuName', label: '标品名称', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'barcode', label: '69码', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'spuListPicUrl', label: '标品图片', minWidth: 150, slot: true }
]
// 标品库全选操作
const dialogSelectableAll = (selection, row) => {
    dialogTableListRef.value.tableRef.clearSelection()
    dialogSelection.value = null
    ElMessage.warning('仅可选一条标品')
}
const dialogSelectable = (selection, row) => {
    if (dialogSelection.value?.spuId === row.spuId) {
        dialogSelection.value = null
        dialogTableListRef.value.tableRef.clearSelection()
    } else {
        dialogSelection.value = row
        dialogTableListRef.value.tableRef.clearSelection()
        dialogTableListRef.value.tableRef.toggleRowSelection(row, true)
    }
}
// 关联标品库-标品库列表
const getDialogData = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            spuIds: [dialogSearch.value.spuIds],
            spuName: dialogSearch.value.spuName,
            barcodes: [dialogSearch.value.barcodes],
            pageNo: dialogCurrentPage.value,
            pageSize: dialogPageSize.value
        },
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UC15115376448741376',
        name: 'spu通用搜索接口V2',
        source: '商品中台'
    }
    const res = await getMerchantList(params)
    dialogTableData.value = res.list
    dialogTableData.value.forEach(row => {
        if (row.modelMediaList) {
            row.modelMediaList.map(arrItem => {
                if (arrItem.mediaType + '' === '1') {
                    row.imgUrl = arrItem.mediaUrl
                }
            })
        } else {
            row.imgUrl = null
        }
        if (relationSpu.value) {
            if (relationSpu.value.spuId === row.spuId) {
                dialogSelection.value = row
                nextTick(() => {
                    dialogTableListRef.value.tableRef.toggleRowSelection(row, true)
                })
            }
        }
    })
    dialogTotal.value = res.total
}
// 绑定所选标品
const bindSpu = async () => {
    ruleForm.creatProduct = 0
    relationSpu.value = dialogSelection.value
    dialogSelection.value = null
    dialogClose()
}
const spuTemplateList = ref([])
// 获取属性模版列表
const getTemplateList = async () => {
    const res = await publicRequest({ key: 'SPU_TEMPLATE_LIST_V3' })
    if (res.code === '200') {
        spuTemplateList.value = res.data
    }
}
// 提交审批，审批结果为通过且可创建新标品时，show标品核查弹窗，否则直接提交
const productCheckDialogShow = () => {
    if (!ruleFormRef.value) return
    ruleFormRef.value.validate(async (validate) => {
        if (!validate) return
        if (ruleForm.state === 3 && ruleForm.creatProduct === 1) {
            dialogVisible.value = true
            productCheckForm.brandName = detailInfo.value.brandName
            productCheckForm.spuName = detailInfo.value.spuName
            productCheckForm.barcode = detailInfo.value.barcode
            productCheckForm.productSpec = detailInfo.value.productSpec
            productCheckForm.netRatio = detailInfo.value.netRatio
            productCheckForm.netRatioUnit = detailInfo.value.netRatioUnit
            productCheckForm.productShelfLife = detailInfo.value.productShelfLife
            productCheckForm.productShelfLifeUnit = detailInfo.value.productShelfLifeUnit
            productCheckForm.isSmallSpec = detailInfo.value.isSmallSpec
            productCheckForm.spuTemplate = detailInfo.value.spuTemplate
            getTemplateList()
        } else if (ruleForm.state === 3 && ruleForm.creatProduct === 0) {
            if (relationSpu.value) {
                submitForm()
            } else {
                ElMessage.warning('请选择关联标品')
            }
        } else {
            // 直接调用提交接口
            submitForm()
        }
    })
}
// hide标品核查弹窗
const productCheckDialogHide = () => {
    dialogVisible.value = false
}
// 标品审核提交
const productCheckSubmit = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (!valid) return
        submitForm()
    })
}
// 提交审核
const submitForm = async () => {
    const spuInfo = {
        ...productCheckForm,
        appPicUrl: productCheckForm.appPicUrl[0]?.url || '',
        listPicUrl: productCheckForm.listPicUrl[0]?.url || '',
        thirdCateName: productDataState.basicLevelCheckedInfo.thirdCateName,
        thirdCateCode: productDataState.basicLevelCheckedInfo.thirdCateCode,
        fourthCateName: productDataState.basicLevelCheckedInfo.fourthCateName,
        fourthCateCode: productDataState.basicLevelCheckedInfo.fourthCateCode
    }
    console.log(relationSpu.value, '---------relationSpu------------------')
    const params = {
        approvalCode: route.params.approvalCode,
        ...ruleForm,
        spuId: ruleForm.creatProduct === 1 ? null : relationSpu.value.spuId,
        spuInfo: ruleForm.creatProduct ? spuInfo : null,
        saleChannel: ruleForm.saleChannel + ''
    }
    const res = await publicRequest({ key: 'PRODUCT_EXAMINE_MANAGE_EXAMINE_V4', body: params })
    if (res.code === '200') {
        ElMessage.success('审核成功')
        setTimeout(async () => {
            await goBack()
        }, 500)
    }
}

const goBack = () => {
    router.go(-1)
}
</script>
<style lang="scss" scoped>
    .mt-20 {
        margin-top: 20px;
    }
    .mb-20 {
        margin-bottom: 20px;
    }
    .product-examine-manage{
        padding: 20px 40px;
        :deep(.el-dialog__body){
          max-height: 600px;
          overflow-y: scroll;
        }
        .img-box {
            img {
                width: 148px;
                height: 148px;
            }
        }
        .form-action-item-50w{
            width: 50%;
        }
        .form-action-item-100w{
            width: 100%;
        }
        .dividing-head{
            margin-left:50px;
            line-height:50px;
        }
        span{
            font-size:14px;
            height: 32px;
            line-height: 32px;
            color: #606266;
            font-size: 14px;
        }
        .border-box{
            border:1px solid #ccc;
            padding:20px;
            margin-bottom:10px;
        }
        .goods-list{
          padding: 20px;
          margin-left: 150px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
        }
        .form-text-btn{
          display: inline-block;
          margin-left: 5px;
          color: #fe2c55;
          cursor: pointer;
        }
        .flex-box{
            display:flex;
            justify-content:center
            div{
                flex:1
            }
        }
        .detail-img{
            width: 100px;
            margin-left: 10px;
            margin-bottom: 10px;
        }
    }
</style>
