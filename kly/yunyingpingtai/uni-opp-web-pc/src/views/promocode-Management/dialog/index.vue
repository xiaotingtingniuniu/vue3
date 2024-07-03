<template>
    <div class='scantling-box'>
        <el-dialog v-model="dialogVisible" :title="dialogtitle" width="50%" @close="clostDialog(formRef)">
            <el-form ref="formRef" :model="formData" :rules="rules" :inline="true" label-position="right" label-width="130px">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="所属业务线" prop="busiCode" :rules = "rules.busiCode">
                            <el-select v-model="formData.busiCode" clearable placeholder="请选择" >
                                <el-option v-for="(item, key) in businessKeyValue" :key="key" :label="item.buisName" :value="item.busiCode" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="推广产品类型" prop="productType" :rules = "rules.productType">
                            <el-select v-model="formData.productType" clearable placeholder="请选择" >
                                <el-option v-for="(item, key) in producttypelist" :key="key" :label="item.producttypename" :value="item.productType" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="推广产品名称" prop="productName" :rules = "rules.productName">
                            <el-input v-model="formData.productName" placeholder="请输入推广产品名称" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="推广产品icon" :rules = "rules.productLogoUrl">
                            <cst-upload :limit="1" :multiple="false" v-model:fileList="formData.productLogoUrl" accept=".jpg,.png,.jpeg" tip="点击上传图片" :mediaType="2"></cst-upload>
                            <!-- <p style="color: #FF4D51;">点击上传图片</p> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item class="button-box">
                            <el-button @click="clostDialog(formRef)" type="primary">取消</el-button>
                            <el-button @click="sureBtn(formRef)" type="primary">确认</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, toRefs, computed, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { allbusiness, newproduct, editproduct } from '@/api/promocodeManagement/index'
import CstUpload from '@/components/upload/kupload'
// import { update } from '@/api/oprate/index'
// import { UploadProps } from 'element-plus'
const props = defineProps({
    visible: {
        type: Boolean
    },
    rowList: {
        type: Object
    },
    modifySource: {
        type: Number
    },
    title: {
        type: String
    }
})
// 商家入驻、用户拉新、货柜分期、全款货柜
// const producttypelist = {
//     1: '本地商家入驻', 2: '本地生活拉新', 3: '到家电商拉新', 4: '门店拉新', 5: '货柜分期', 6: '全款货柜'
// }
const producttypelist = [
    {
        productType: 1, producttypename: '本地商家入驻'
    },
    {
        productType: 2, producttypename: '本地生活拉新'
    },
    {
        productType: 3, producttypename: '到家电商拉新'
    },
    {
        productType: 4, producttypename: '门店拉新'
    },
    {
        productType: 5, producttypename: '货柜分期'
    },
    {
        productType: 6, producttypename: '全款货柜'
    }
]
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogVisible = ref(props.visible)
const rowdetailList = ref(props.rowList)
const detialtitle = ref(props.title)
const dialogtitle = ref('')
onMounted(async () => {
    await business()
    if (detialtitle.value === 'new') {
        dialogtitle.value = '新增推广产品'
    } else {
        dialogtitle.value = '编辑推广产品'
    }
    if (rowdetailList.value && detialtitle.value === 'edit') {
        dataState.formData.busiCode = rowdetailList.value.busiCode
        dataState.formData.busiName = rowdetailList.value.busiName
        dataState.formData.productType = rowdetailList.value.productType
        dataState.formData.productLogoUrl = [{ url: rowdetailList.value.productLogoUrl }]
        dataState.formData.productName = rowdetailList.value.productName
    }
})
const dataState = reactive({
    formData: {
        busiCode: '',
        busiName: '',
        productType: '',
        productLogoUrl: [],
        productName: '',
        modifierId: ''
    }
})
const { formData } = toRefs(dataState)
// 查询所有业务线
const businessKeyValue = ref([])
const business = async () => {
    const res = await allbusiness()
    businessKeyValue.value = res.data
}
// 关闭弹窗
const clostDialog = (formEl) => {
    // dialogVisible.value = false
    if (!formEl) return
    formEl.resetFields()
    emit('clostDialog', props.visible)
}
const rules = {
    productName: [{ required: true, message: '请输入推广名称', trigger: 'blur' }],
    productType: [{ required: true, message: '请选择推广类型', trigger: 'blur' }],
    busiCode: [{ required: true, message: '请选择业务线', trigger: 'blur' }],
    productLogoUrl: [{ required: true, message: '请上传图片', trigger: 'blur' }]
}
const formRef = ref('')
const sureBtn = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const businame = ref('')
            for (let i = 0; i < businessKeyValue.value.length; i++) {
                if (businessKeyValue.value[i].busiCode === dataState.formData.busiCode) {
                    businame.value = businessKeyValue.value[i].buisName
                }
            }
            if (detialtitle.value === 'new') {
                const param = {
                    appKey: 'A1001001',
                    busiCode: dataState.formData.busiCode,
                    busiName: businame.value,
                    productType: dataState.formData.productType,
                    productLogoUrl: dataState.formData.productLogoUrl[0].url,
                    productName: dataState.formData.productName,
                    modifierId: userInfo.value.name
                }
                await newproduct(param)
                ElMessage({
                    type: 'success',
                    message: '创建成功'
                })
            } else {
                const param = {
                    appKey: 'A1001001',
                    busiCode: dataState.formData.busiCode,
                    busiName: businame.value,
                    productType: dataState.formData.productType,
                    productLogoUrl: dataState.formData.productLogoUrl[0].url,
                    productName: dataState.formData.productName,
                    productCode: rowdetailList.value.productCode,
                    modifierId: userInfo.value.name
                }
                await editproduct(param)
                ElMessage({
                    type: 'success',
                    message: '编辑成功'
                })
            }
            emit('clostDialog', props.visible)
        }
    })
}
const emit = defineEmits(['clostDialog'])
</script>
<style lang="scss" scoped>
 .content{
    // border-bottom: 1px solid #999999;
    margin-bottom: 10px;
}
.content-btn{
    margin-top: 20px;
    text-align: center;
}
.img-content{
    display: flex;
}
.height-p{
    line-height:30px;
}
.title{
    color: #000000;
    font-weight: bold;
    line-height:40px;
}
.button-box{
    float: right;
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
  width: 128px;
  height: 138px;
  border-radius: 10px;
  border: 1px dashed #8c939d;
  text-align: center;
}
</style>
