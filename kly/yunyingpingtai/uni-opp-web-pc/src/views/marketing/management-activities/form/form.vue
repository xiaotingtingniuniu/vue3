
<template>
    <div>
        <el-dialog
            v-model="$props.modelValue"
            :title="title"
            width="900px"
            height="1000px"
            @close="close"
            draggable
        >
            <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="150px">
                <el-form-item label="业务线：" prop="businessCode" :rules="rules.selectRule">
                    <el-select class="form-action-item-50w" v-model="ruleForm.businessCode" clearable placeholder="请选择" disabled>
                        <!--<el-option label="恒生活" value="A1001" />
                        <el-option label="小恒数科" value="A1002" />
                        <el-option label="汇财" value="A1003" />
                        <el-option label="保险" value="A1004" />-->
                        <el-option label="进货商城" value="A1001005" />
                    </el-select>
                </el-form-item>
                <el-form-item label="活动页名称：" prop="promoName" :rules="rules.promoName">
                    <el-input class="form-action-item-50w" v-model="ruleForm.promoName" :disabled="canNotEdit"/>
                </el-form-item>
                <el-form-item label="活动页图片：" prop="bannerUrl" class="upload-item">
                    <el-upload class="avatar-uploader" :show-file-list="false" :on-success="handleAvatarSuccess" :http-request="beforeAvatarUploada">
                        <el-image v-if="coverImg" style="width: 100px; height: 100px" :src="coverImg" />
                        <div v-else class="addImage">
                            <el-icon><Plus /></el-icon>
                            <p style="color: #666; margin-top: 6px; margin-bottom: 12px">点击添加</p>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="活动页背景色：" prop="backgroundColor" :rules="rules.backgroundColor">
                    <el-color-picker v-model="ruleForm.backgroundColor" :disabled="canNotEdit"/>
                </el-form-item>
                <el-form-item label="活动有效期：" prop="promoDate" style="width: 700px" class="form-item-time" :rules="rules.promoDateRule">
                    <el-date-picker
                        v-model="ruleForm.promoDate"
                        type="datetimerange"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        range-separator="~"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        :disabled="canNotEdit"
                        :default-time="defaultTime"
                    />
                    <!--<span>注意：仅在批次有效期内可领取优惠券</span>-->
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="addSku" v-if="title === '新增' || title === '编辑'">添加</el-button>
            <el-table v-if="title === '新增' || title === '编辑'" :data="tableData" style="width: 100%">
                <el-table-column label="操作" align="center">
                    <template v-slot="scope">
                        <el-button text type="primary" @click="delSku(scope.row)"> 删除 </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="indexCode" label="排序">
                    <template v-slot="scope">
                        <el-input v-model.number="scope.row.indexCode"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="shopName" label="店铺名称"  />
                <el-table-column prop="skuName" label="sku名称"  />
                <el-table-column prop="salePrice" label="sku价格" />
                <el-table-column prop="stock" label="sku库存" />
                <el-table-column prop="skuStatus" label="sku状态">
                    <template #default="scope">
                        <div>
                            <span v-if="scope.row.skuStatus === 1">待审核</span>
                            <span v-else-if="scope.row.skuStatus === 2">已审核</span>
                            <span v-else-if="scope.row.skuStatus === 3">审核不通过</span>
                            <span v-else-if="scope.row.skuStatus === 4">已上架</span>
                            <span v-else-if="scope.row.skuStatus === 5">下架可上架</span>
                            <span v-else-if="scope.row.skuStatus === 6">下架不可再上架</span>
                            <span v-else-if="scope.row.skuStatus === 7">待上架</span>
                            <span v-else>-</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-else :data="tableData" style="width: 100%">
                <el-table-column prop="indexCode" label="排序" />
                <el-table-column prop="shopName" label="店铺名称"  />
                <el-table-column prop="skuName" label="sku名称"  />
                <el-table-column prop="salePrice" label="sku价格" />
                <el-table-column prop="stock" label="sku库存" />
                <el-table-column prop="skuStatus" label="sku状态">
                    <template #default="scope">
                        <div>
                            <span v-if="scope.row.skuStatus === 1">待审核</span>
                            <span v-else-if="scope.row.skuStatus === 2">已审核</span>
                            <span v-else-if="scope.row.skuStatus === 3">审核不通过</span>
                            <span v-else-if="scope.row.skuStatus === 4">已上架</span>
                            <span v-else-if="scope.row.skuStatus === 5">下架可上架</span>
                            <span v-else-if="scope.row.skuStatus === 6">下架不可再上架</span>
                            <span v-else-if="scope.row.skuStatus === 7">待上架</span>
                            <span v-else>-</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <span>排序：0开始的整数，越小优先级越高</span>
            <div class="sku-btns">
                <el-button @click="cancelSku">
                    取消
                </el-button>
                <el-button type="primary" @click="confirmSku()" v-if="title === '新增' || title === '编辑'">
                    确认
                </el-button>
            </div>
        </el-dialog>
    </div>
    <add-form v-model="visible" v-if="visible" :type="add" @getDialogCheckedData="getDialogCheckedData"></add-form>
</template>
<script setup>
import { toRefs, reactive, ref, computed, defineProps, defineEmits, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { update, replenishmentConfirm } from '@/api/operate/index'
import { addManagementList, editManagementList } from '@/api/marketing/active'
import AddForm from './add-sku.vue'

const props = defineProps({
    type: String,
    currentVal: {
        type: Object,
        default: () => {}
    },
    modelValue: {
        type: Boolean,
        default: false
    },
    row: {
        type: Object,
        default: () => {}
    },
    title: {
        type: String
    }
})
const store = useStore()
const myCmnType = ref(2)
const canNotEdit = computed(() => props.title === '查看')
const userInfo = computed(() => store.state.userInfo)
const emits = defineEmits(['update:modelValue', 'gitList'])
const ruleFormRef = ref()
const defaultTime = [
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59)
]
// const tableData = ref([])
const close = () => {
    emits('update:modelValue', false)
    emits('getList')
}
const visible = ref(false)
const dataState = reactive({
    tableData: [],
    selectList: [],
    skuNumLimitNum: ''
})
const ruleForm = reactive({
    id: '',
    promoCode: '',
    businessCode: 'A1001005',
    promoName: '',
    bannerUrl: '',
    backgroundColor: '#FF934B',
    promoDate: ''
})
const bannerUrlValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请选择图片'))
    } else {
        callback()
    }
}
// 校验规则：批次有效期开始时间大于当前时间
const promoDateValidator = (rule, value, callback) => {
    if (canNotEdit.value) {
        return
    }
    if (!value || value === '') {
        callback(new Error('请选择'))
    } else {
        const currTime = Date.now()
        const start1 = new Date(value[0]).getTime()
        const start2 = new Date(ruleForm.promoDate[0]).getTime()
        if (start1 < currTime) {
            callback(new Error('有效期开始时间应大于当前时间'))
        } else if (start2 && start2 < start1) {
            callback(new Error('有效期开始时间应小于券使用开始时间'))
        }
        callback()
    }
}
const rules = reactive({
    selectRule: [{ required: true, message: '请选择', trigger: 'change' }],
    promoName: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 40, message: '最长不超过40个字符长度', trigger: 'change' }
    ],
    bannerUrl: [{ required: true, validator: bannerUrlValidator, trigger: 'change' }],
    backgroundColor: [{ required: true, message: '请选择', trigger: 'change' }],
    promoDateRule: [{ required: true, validator: promoDateValidator, trigger: 'change' }]
})
const { tableData, selectList } = toRefs(dataState)

onMounted(async () => {
    if (props.title === '查看' || props.title === '编辑') {
        ruleForm.id = props.row.id
        ruleForm.businessCode = props.row.businessCode
        ruleForm.promoName = props.row.promoName
        coverImg.value = props.row.bannerUrl
        ruleForm.backgroundColor = props.row.backgroundColor
        ruleForm.promoDate = [props.row.promoBeginDate, props.row.promoEndDate]
        dataState.tableData = props.row.skuList || []
        dataState.skuNumLimitNum = props.row.skuNumLimitNum
        if (props.title === '编辑') {
            ruleForm.promoCode = props.row.promoCode
        }
    }
})
// init()

// 新增商品
const addSku = async () => {
    visible.value = true
}
// 删除商品
const delSku = async (row) => {
    dataState.tableData.forEach((item, index) => {
        if (item.skuId === row.skuId) {
            dataState.tableData.splice(index, 1)
        }
    })
}
// 取消
const cancelSku = async () => {
    emits('update:modelValue', false)
    emits('getList')
}
// 获取选择商品
const getDialogCheckedData = async (info) => {
    if (info.length > 0) {
        // 去重
        let isShowDialog = false
        const arr1 = info
        const arr2 = dataState.tableData
        const arr3 = []
        for (let i = 0; i < arr1.length; i++) {
            let isAdd = true
            for (let j = 0; j < arr2.length; j++) {
                if (arr1[i].skuId === arr2[j].skuId) {
                    isAdd = false
                    isShowDialog = true
                }
            }
            if (isAdd) {
                arr3.push(arr1[i])
            }
        }
        if (arr3.length > 0) {
            arr3.forEach((item) => {
                dataState.tableData.push({
                    originQuantity: 0,
                    price: item.salePrice,
                    quantity: 0,
                    skuId: item.skuId,
                    indexCode: 0,
                    shopName: item.shopName,
                    skuName: item.skuName,
                    salePrice: item.salePrice,
                    stock: item.stock,
                    skuStatus: item.skuStatus
                })
            })
        }
        if (isShowDialog) {
            ElMessage.success('添加成功，部分商品已存在，无需重复添加!')
            isShowDialog = false
        }
    }
}
// 提交前SKU数据去重校验
const confirmSku = async () => {
    if (dataState.skuNumLimitNum && dataState.tableData.length > dataState.skuNumLimitNum) {
        const arr = dataState.tableData
        for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i].skuId === arr[j].skuId) {
                    arr.splice(j, 1)
                    j--
                }
            }
        }
        if (arr.length > dataState.skuNumLimitNum) {
            ElMessageBox.confirm(
                `您的补货单商品数为${arr.length}个，超过${dataState.skuNumLimitNum}个会降低商品的识别率和识别速度，请确认是否继续添加！`,
                '特别提醒',
                {
                    confirmButtonText: '继续添加',
                    cancelButtonText: '取消'
                }
            )
                .then(async () => {
                    confirm()
                })
        }
    } else {
        confirm()
    }
}
// 提交
const confirm = async () => {
    if (props.title === '新增') {
        addConfirm()
    }
    if (props.title === '编辑') {
        editConfirm()
    }
}
// 新增
const addConfirm = async () => {
    const arr2 = dataState.tableData
    const skuList = []
    arr2.forEach((item) => {
        skuList.push({
            skuId: item.skuId,
            indexCode: item.indexCode
        })
    })
    const param = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC76310026214993920',
        name: '进货商城活动创建',
        source: '营销中台',
        body: {
            id: ruleForm.id,
            appKey: 'A1001001',
            busiCode: 'A1001002',
            businessCode: ruleForm.businessCode,
            promoType: 2,
            promoName: ruleForm.promoName,
            bannerUrl: coverImg.value || '',
            backgroundColor: ruleForm.backgroundColor,
            promoBeginDate: ruleForm.promoDate[0] || '',
            promoEndDate: ruleForm.promoDate[1] || '',
            skuList: dataState.tableData,
            creatorId: store.state.userInfo.id.toString()
        }
    }
    const res = await addManagementList(param)
    if (res.code === '200') {
        ElMessage.success('成功')
        emits('update:modelValue', false)
        emits('getList')
    }
}
// 编辑
const editConfirm = async () => {
    const arr2 = dataState.tableData
    const skuList = []
    arr2.forEach((item) => {
        skuList.push({
            skuId: item.skuId,
            indexCode: item.indexCode
        })
    })
    const param = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC76310277822902272',
        name: '进货商城活动编辑',
        source: '营销中台',
        body: {
            id: ruleForm.id,
            promoCode: ruleForm.promoCode,
            appKey: 'A1001001',
            busiCode: 'A1001002',
            businessCode: ruleForm.businessCode,
            promoType: 2,
            promoName: ruleForm.promoName,
            bannerUrl: coverImg.value || '',
            backgroundColor: ruleForm.backgroundColor,
            promoBeginDate: ruleForm.promoDate[0] || '',
            promoEndDate: ruleForm.promoDate[1] || '',
            skuList: dataState.tableData,
            modifierId: store.state.userInfo.id.toString()
        }
    }
    const res = await editManagementList(param)
    if (res.code === '200') {
        ElMessage.success('成功')
        emits('update:modelValue', false)
        emits('getList')
    }
}
// 上传图片
const coverImg = ref('')
const loadingstates = ref(false)
const handleAvatarSuccess = (response, file, fileList) => {
    loadingstates.value = false
}
// 文件格式验证
const beforeAvatarUploada = async (file) => {
    loadingstates.value = true
    const index = file.file.name.lastIndexOf('.')
    const extension = file.file.name.substr(index + 1)
    const extensionList = ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'bmp', 'BMP']
    const isLt2M = file.file.size / 1024 / 1024 < 10
    if (!isLt2M) {
        ElMessage({
            message: '店铺LOGO不可超出10M',
            type: 'warning',
            center: true
        })

        return false
    } else if (extensionList.indexOf(extension) < 0) {
        ElMessage({
            message: '当前文件格式不支持',
            type: 'error',
            center: true
        })
        return false
    } else {
        const obj = new FormData()
        // 上传文件
        obj.append('file', file.file)
        // 上传文件接口
        const data = await update(obj)
        coverImg.value = data
        ruleForm.value.bannerUrl = coverImg.value
        ruleFormRef.value.validate('bannerUrl', async (valid, fields) => {})
    }
}
</script>
<style lang="scss" scoped>
.upload-item :deep(.el-form-item__label:before){
    content: "*";
    color: var(--el-color-danger);
    margin-right: 4px
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
.avatar-uploader .el-upload{
    width: 200px;
    height: 200px;
}

.avatar-uploader{
    width: 300px;
    height: 300px;
}
.el-form-item{
    display: flex;
}
.sku-btns{
    margin: 0 auto;
    width: fit-content;
    margin-top: 20px;
}
img{
    width: 120px;
}
.addImage {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
