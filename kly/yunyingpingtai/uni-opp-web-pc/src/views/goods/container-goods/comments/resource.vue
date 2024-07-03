<template>
    <el-form :model="ruleForm" label-width="120px">
        <el-form-item label="Goods短视频" >
            <cst-upload :limit="1" :multiple="true" :disabled="dataState.disabled" v-model:fileList="dataState.ruleForm.vidoList" accept=".jpg,.png,.jpeg,.mp4"></cst-upload>
        </el-form-item>
        <el-form-item label="Goods主图" >
            <cst-upload :limit="1" :multiple="false" v-model:fileList="dataState.ruleForm.zhutuList" accept=".jpg,.png,.jpeg"></cst-upload>
            <!-- <Upload :num="1"  @delImage = 'delImage' @handleAvatarSuccess= 'handleAvatarSuccess' dom="businessLicenseUrl" :imgList="form.businessLicenseUrl"  :disabled='noCan'/> -->
        </el-form-item>
        <el-form-item label="缩略图：" prop="name">
            <cst-upload :limit="1" :multiple="false" :disabled="dataState.disabled" v-model:fileList="dataState.ruleForm.lunbolist" :mediaType="4" accept=".jpg,.png,.jpeg"></cst-upload>
        </el-form-item>
        <el-form-item label="轮播图：" prop="name">
            <cst-upload :limit="8" :multiple="true" :disabled="dataState.disabled" v-model:fileList="dataState.ruleForm.suolueList" accept=".jpg,.png,.jpeg" tip="次于主图位置。建议尺寸：120*120 像素，最多上传8张"></cst-upload>
        </el-form-item>
        <el-form-item label="瀑布图：" prop="name">
            <cst-upload :limit="1" :multiple="true" :disabled="dataState.disabled" v-model:fileList="dataState.ruleForm.pubuImageList" accept=".jpg,.png,.jpeg" tip="首页。建议尺寸：334*334 像素，最多上传1张"></cst-upload>
        </el-form-item>
        <el-form-item label="列表图：" prop="name">
            <cst-upload :limit="1" :multiple="true" :disabled="dataState.disabled" v-model:fileList="dataState.ruleForm.liebiaoImageList" accept=".jpg,.png,.jpeg,.mp4" tip="应用类目展示图片。建议尺寸：140*140 像素，最多上传1张"></cst-upload>
        </el-form-item>
    </el-form>
    <!-- <div style="width: 300px;margin: 0 auto">
        <el-button type="primary">取消</el-button>
        <el-button type="success">确认</el-button>
        <el-button type="success" @click="jump">下一页</el-button>
    </div> -->
    <div class="margin_bottom_20" style="text-align:center">
        <el-button @click="goReturn" type="primary">上一步</el-button>
        <el-button @click="submitForm('ruleForm')" type="primary">下一步</el-button>
    </div>

</template>

<script setup>
import { reactive, toRefs, computed } from 'vue'
import { getMerchantList } from '@/api/operate/index'
import CstUpload from '@/components/upload/upload.vue'
import Upload from '@/components/upload'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
const store = useStore()
const headers = computed(() => ({ Authorization: localStorage.getItem('HCCM-TOKENS') }))
const userInfo = computed(() => store.state.userInfo)
const router = useRouter()
const emit = defineEmits(['next'])
const props = defineProps({
    toRuleForm: {
        type: Object,
        default: () => {}
    }
})
const dataState = reactive({
    ruleForm: props.toRuleForm,
    form: {
        vidoList: [],
        zhutuList: [],
        suolueList: [],
        lunbolist: [],
        pubuImageList: [],
        liebiaoImageList: []

    }

})
const { ruleForm, form } = toRefs(dataState)

const onSubmit = () => {
    console.log('submit!')
}

// 提交表单
const submitForm = (formName) => {
    console.log(ruleForm, 'ruleform')
    emit('next', 3, ruleForm)
}
const goReturn = () => {
    emit('next', 1)
}
const jump = () => {
    router.push({ name: 'details-page' })
}
// 上传成功回掉
const handleAvatarSuccess = (n, e) => {
    if (dataState.form[n]) {
        dataState.form[n] = dataState.form[n] + ',' + e.data
    } else {
        dataState.form[n] = e.data
    }
}
// 删除图片
const delImage = (n, i) => {
    const old = dataState.form[n]
    const arr = old.split(',')
    arr.splice(i, 1)
    const str = arr.length === 0 ? null : arr.toString()
    dataState.form[n] = str
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
    width: 43px;
    height: 40px;
    background: inherit;
    background-color: rgba(255, 255, 255, 1);
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(121, 121, 121, 1);
    border-radius: 0px;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
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
</style>
