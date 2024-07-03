<template>
    <el-upload
        :action="result.imgAction"
        list-type="picture-card"
        :auto-upload="true"
        :multiple="result.multiple"
        :limit="result.limit"
        ref="uploadRef"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeUpload"
        :on-remove="handleRemove"
        v-model:file-list="fileLists"
        :disabled="props.disabled"
        :accept="props.accept"
        :data="{ fileType: props.mediaType }"
        :headers="uploadHeaders"
    >
        <template #default>
            <el-icon>
                <plus />
            </el-icon>
        </template>
        <template #file="{ file }">
            <div v-if="file.response?.data">
                <video v-if="getFileType(file.response.data) === 'video'" :src="file.response.data"></video>
                <img v-if="getFileType(file.response.data) === 'img'" class="el-upload-list__item-thumbnail" :src="file.response.data" alt />
                <span class="el-upload-list__item-actions" v-if="!props.disabled">
                    <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                        <el-icon>
                            <delete />
                        </el-icon>
                    </span>
                </span>
            </div>
        </template>
        <template #tip v-if="result.tip">
            <div class="el-upload__tip">{{ result.tip }}</div>
            <span v-if="result.ocr" class="el-upload__tip ocr">支持OCR 识别</span>
        </template>
    </el-upload>
</template>

<script setup>
import { watch, reactive, ref } from 'vue'
// import { Plus, Delete } from '@element-plus/icons-vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
// import { fileUpload } from '@/api/goods.js'

const props = defineProps({
    tip: String,
    multiple: {
        type: Boolean,
        default: false
    },
    limit: {
        type: Number,
        default: 1
    },
    ocr: {
        type: Boolean,
        default: false
    },
    fileList: {
        type: Array,
        default: () => []
    },
    disabled: {
        type: Boolean,
        default: false
    },
    accept: {
        type: String,
        default: '.jpg,.png,.jpeg'
    },
    mediaType: {
        type: Number,
        default: 1
    }
})
const result = reactive({
    imgAction: '/ben-api/api/common/file',
    tip: props.tip,
    multiple: props.multiple,
    limit: props.limit,
    fileList: props.fileList,
    ocr: props.ocr
})

const uploadHeaders = ref({
    Authorization: localStorage.getItem('HSH-UNIFY-TOKEN')
})

const fileLists = ref([])

const emit = defineEmits(['update:fileList', 'delete'])

const imgSize = 2 * 1024 * 1024
const vedioSize = 15 * 1024 * 1024
const FILETYPES = {
    VEDIO: ['video/mp4'],
    IMG: ['image/jpg', 'image/png', 'image/jpeg']
}

const uploadRef = ref('')

watch(
    () => props.fileList,
    (val) => {
        fileLists.value = props.fileList
    },
    {
        deep: true,
        immediate: true
    }
)

const handleRemove = (file) => {
    const copyFileList = [...fileLists.value]
    fileLists.value.forEach((el, index) => {
        if (el.uid === file.uid) {
            copyFileList.splice(index, 1)
        }
    })
    fileLists.value = copyFileList
    emit('delete', file)
    emit('update:fileList', fileLists.value)
}
const handleAvatarSuccess = async (file, fileList) => {
    if (file.code !== '200') {
        fileLists.value.splice(fileLists.value.length - 1, 1)
        ElMessage.error(file.message)
    }
    emit('update:fileList', fileLists.value)
    emit('handleAvatarSuccess', fileLists.value)
    console.log(fileLists.value, 'fileLists.value')
}

// 上传文件拦截
const beforeUpload = (files, fileList) => {
    if (FILETYPES.VEDIO.includes(files.type)) {
        if (files.size > vedioSize) {
            ElMessage.error('只允许上传 15M 之内的视频!')
            return false
        }
    } else if (FILETYPES.IMG.includes(files.type)) {
        if (files.size > imgSize) {
            ElMessage.error('只允许上传 2M 之内的照片!')
            return false
        }
    } else {
        ElMessage.error('当前文件不符合上传文件规范!')
        return false
    }
}

// 获取文件类型
const getFileType = (url) => {
    const files = url.split('.')
    const type = files[files.length - 1]
    if (['mp4'].includes(type)) {
        return 'video'
    } else if (['png', 'jpg', 'jpeg'].includes(type)) {
        return 'img'
    } else {
        return null
    }
}
</script>
<style>
.el-upload-list__item.is-ready {
    display: none;
}
</style>
<style lang="scss" scoped>
video {
    width: 100%;
}
.ocr {
    color: red;
}
</style>
