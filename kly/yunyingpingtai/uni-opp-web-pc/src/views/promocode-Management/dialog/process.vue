<template>
    <div class='scantling-box'>
        <el-dialog v-model="dialogVisible" title="团队审核" width="50%" @close="clostDialog">
            <el-form ref="formDataRef" :model="formData" :rules="rules" :inline="true" label-position="right" label-width="130px">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="审核结果：" prop="auditStatus" :rules = "rules.auditStatus">
                            <el-radio-group v-model="formData.auditStatus">
                                <el-radio :label="1">通过</el-radio>
                                <el-radio :label="2">退回</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="审核原因" prop="auditRemark">
                            <el-input v-model="formData.auditRemark" type="textarea" :rows="4" maxlength="100" placeholder="请输入审核原因" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item class="button-box">
                            <el-button @click="clostDialog()" type="primary">取消</el-button>
                            <el-button @click="sureBtn(formDataRef)" type="primary">确认</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, toRefs, computed, reactive, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { allbusiness, processsubmit } from '@/api/promocodeManagement/index'
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
const producttypelist = {
    1: '商家入驻', 2: '用户拉新', 3: '货柜分期', 4: '全款货柜'
}
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogVisible = ref(props.visible)
const rowdetail = ref(props.rowList)
const detialtitle = ref(props.title)
const dialogtitle = ref('')
onMounted(async () => {
    await business()
    if (detialtitle.value === 'new') {
        dialogtitle.value = '新增推广产品'
    } else {
        dialogtitle.value = '编辑推广产品'
    }
})
const dataState = reactive({
    formData: {
        auditStatus: '',
        auditRemark: ''
    }
})
const rules = reactive({
    auditStatus: [{ required: true, message: '请选择审核结果', trigger: 'blur' }],
    auditRemark: [{ required: false, message: '请输入审核原因', trigger: 'blur' }]
})
const { formData } = toRefs(dataState)
watch(() => dataState.formData.auditStatus,
    (val) => {
        if (val === 2) {
            rules.auditRemark[0].required = true
        } else {
            rules.auditRemark[0].required = false
        }
        console.log(val + '印')
    },
    {
        deep: true
    })
// 查询所有业务线
const businessKeyValue = ref([])
const business = async () => {
    const res = await allbusiness()
    businessKeyValue.value = res.data
}
// 关闭弹窗
const clostDialog = () => {
    // dialogVisible.value = false
    emit('clostDialog', props.visible)
}
// const rules = {
//     auditStatus: [{ required: true, message: '请选泽审核结果', trigger: 'blur' }]
// }
const formDataRef = ref('')
const sureBtn = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const prolist = ref([])
            for (let i = 0; i < rowdetail.value.length; i++) {
                prolist.value.push(rowdetail.value[i].teamCode)
            }
            const param = {
                appKey: 'A1001001',
                teamCodeSet: prolist.value,
                auditName: userInfo.value.name,
                auditStatus: dataState.formData.auditStatus,
                auditRemark: dataState.formData.auditRemark,
                modifierId: userInfo.value.name
            }
            await processsubmit(param)
            ElMessage({
                type: 'success',
                message: '审核成功'
            })
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
