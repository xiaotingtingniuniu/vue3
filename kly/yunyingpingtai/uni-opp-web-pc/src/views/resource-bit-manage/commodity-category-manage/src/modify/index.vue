<template>
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="formRule"
        label-width="120px"
        class="demo-ruleForm"
        status-icon
    >
        <el-form-item label="应用类目名称" prop="targetName">
            <el-input disabled v-model="ruleForm.targetName" placeholder="请输入banner名称"/>
        </el-form-item>
        <el-form-item label="上传ICON" prop="imgUrl">
            <el-upload
                class="avatar-uploader"
                action="#"
                :http-request="fileRequest"
                :on-remove="handleRemove"
                :show-file-list="true"
                :limit="1"
            >
                <img v-if="ruleForm.imgUrl" :src="ruleForm.imgUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                <template #tip>
                    <div class="el-upload__tip">建议尺寸:288*288PX</div>
                </template>
            </el-upload>
        </el-form-item>
        <el-form-item>
            <el-descriptions>
                <el-descriptions-item label="一级应用类目排序:">应用于金刚位排序和列表页排序</el-descriptions-item>
            </el-descriptions>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
            <el-select
                v-model="ruleForm.status"
                placeholder="请选择状态"
            >
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
            </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
            <el-input v-model="ruleForm.sort" placeholder="请输入banner排序" maxlength="5"/>
        </el-form-item>
        <el-form-item>
            <el-descriptions>
                <el-descriptions-item label="二级应用类目排序:">应用于列表页排序</el-descriptions-item>
            </el-descriptions>
        </el-form-item>
        <el-form-item>
            <ul >
                <li v-for="item in ruleForm.subCategoryList" :key="item.index">
                    <span>{{ruleForm.targetName}}  -  {{item.title}}</span>
                    <el-input class="input" v-model="item.sort" type="text" placeholder="请输入banner排序" maxlength="5"/>
                </li>
            </ul>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
            <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
    </el-form>
</template>
<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { postUpload, aggregateIndexUpdate, detailEdit, aggregateSenList, aggregateIndexAdd } from '@/api/banner'
import { Plus } from '@element-plus/icons-vue'
import { formRule } from './index.js'

const props = defineProps({})
const ruleFormRef = ref()
const route = useRoute()
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

// 表单数据
const ruleForm = reactive({
    targetName: '', // 名称
    targetId: '',
    resourceCode: '',
    imgUrl: '', // banner 图
    status: 0, // 是否启用
    sort: '', // 排序
    subCategoryList: [
        // {
        //     "title": "瓜果",
        //     "targetId": "MA1001002",
        //     "targetName": "瓜果",
        //     "sort": 1
        // }
    ] // 二级类目
})
const loadingInstance = ref(null)
const result = reactive({
    fileList: [],
    hideUpload: false,
    isLoading: false
})
const secondList = ref([])
onMounted(async () => {
    await init()
    await initTatgetId()
})

const init = async () => {
    if (!route.params?.id) return
    const params = {
        appKey: 'A1001001',
        busiCode: 'A1001',
        resourceCode: route.params.id
    }
    const res = await detailEdit(params)
    if (res.code === '200') {
        ruleForm.targetName = res.data.title
        ruleForm.resourceCode = res.data.resourceCode
        ruleForm.imgUrl = res.data.imgUrl
        ruleForm.status = res.data.status
        ruleForm.sort = res.data.sort
        ruleForm.targetId = res.data.targetId
        if (res.data?.subCategoryList?.length) {
            ruleForm.subCategoryList = res.data.subCategoryList
        }
    }
}
const submitForm = async (formEl) => {
    if (ruleForm.imgUrl === '') {
        ElMessage({
            showClose: true,
            message: '上传附件不能为空',
            type: 'warning'
        })
        return
    }
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (!valid) return
        if (route.params?.id) {
            const params = {
                targetName: ruleForm.targetName, // 名称
                imgUrl: ruleForm.imgUrl, // banner 图
                status: ruleForm.status, // 跳转url
                sort: ruleForm.sort, // 排序
                resourceCode: route.params.id,
                displaySite: 'HOME_CATEGORY',
                busiCode: 'A1001',
                sceneCode: 'A1001004',
                modifierId: userInfo.value.name,
                subCategoryList: ruleForm.subCategoryList
            }
            const res = await aggregateIndexUpdate(params)
            if (res.code === '200') {
                ElMessage.success('编辑成功')
                router.push({ name: 'commodity-category-manage' })
                sessionStorage.removeItem('GOODS_CATE')
            }
        } else {
            let goodsCate = sessionStorage.getItem('GOODS_CATE')
            if (!goodsCate) return
            goodsCate = JSON.parse(goodsCate)
            const params = {
                appKey: 'A1001001',
                busiCode: 'A1001',
                displaySite: 'HOME_CATEGORY',
                sceneCode: 'A1001004',
                imgUrl: ruleForm.imgUrl,
                creatorId: userInfo.value.name,
                sort: ruleForm.sort,
                exist: goodsCate.exist,
                modifierId: 2,
                resourceCode: '到家',
                status: goodsCate.isEnabled,
                subCategoryList: ruleForm.subCategoryList, // 二级分类
                targetId: goodsCate.busiFirstCateCode, // 分类id
                targetName: goodsCate.busiFirstCateName, // 分类名称
                title: goodsCate.busiFirstCateName,
                targetUrl: ''
            }
            const res = await aggregateIndexAdd(params)
            if (res.code === '200') {
                ElMessage.success('添加成功')
                router.replace({ name: 'commodity-category-manage' })
                sessionStorage.removeItem('GOODS_CATE')
            }
        }
    })
}

// 初始化tatgetId
const initTatgetId = async () => {
    let goodsCate = sessionStorage.getItem('GOODS_CATE')
    if (!goodsCate) return
    goodsCate = JSON.parse(goodsCate)
    ruleForm.targetId = goodsCate.busiFirstCateCode
    ruleForm.targetName = goodsCate.busiFirstCateName // 名称
    getCate2List()
    console.log(goodsCate, 'goodsCate')
}

// 获取二级分类列表
const getCate2List = async () => {
    if (route.params?.id) return
    const param = {
        level: 2,
        cateCode: route.params.targetId
    }
    const data = await aggregateSenList(param)
    if (data.code === '200') {
        ruleForm.subCategoryList = data.data.map(el => {
            return {
                sort: el.sort,
                title: el.name,
                targetId: el.code,
                targetName: el.name
            }
        })
    }
}

// 上传文件
const fileRequest = async (file) => {
    const formData = new FormData()
    formData.append('file', file.file)
    const types = ['image/jpeg', 'image/jpg', 'image/png']
    const isJPG = types.includes(file.file.type)
    if (!isJPG) {
        ElMessage({
            message: '上传图片只能是 jpg/png 格式!',
            type: 'error'
        })
        return false
    }
    if (file.size > 300 * 1024) {
        ElMessage({
            message: '建议上传图片大小不能超过 300k!',
            type: 'error'
        })
        return false
    }

    const res = await postUpload(formData)
    if (res.code === '200') {
        ruleForm.imgUrl = res.data
    } else {
        result.fileList = []
        ruleForm.imgUrl = ''
    }
}

// 删除图片
const handleRemove = () => {
    result.fileList = []
    ruleForm.value.imgUrl = ''
}

</script>
<style  lang="scss" scoped>
.demo-ruleForm .el-input {
    width: 300px;
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
.avatar-uploader img {
    width: 200px;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}

.el-input__wrapper{
    width: 200px;
    margin-left: 20px;
}

ul, li {
    list-style: none;
}
</style>
