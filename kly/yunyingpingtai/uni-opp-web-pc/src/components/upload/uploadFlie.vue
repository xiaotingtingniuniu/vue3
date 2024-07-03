<template>
    <!-- :http-request="fileRequest" -->
    <el-upload
        list-type="picture-card"
        :auto-upload="true"
        :multiple="result.multiple"
        :limit="result.limit"
        ref="uploadRef"
        :on-error="handleAvatarError"
        :before-upload="beforeUpload"
        :on-remove="handleRemove"
        v-model:file-list="result.fileList"
        :disabled="props.disabled"
        :accept="props.accept"
        :http-request="fileRequest"
    >
        <!-- :data="{ fileType: props.mediaType }" -->
        <template #default>
            <el-icon>
                <plus />
            </el-icon>
        </template>
        <template #file="{ file }">
            <!-- <img :src="file.url" /> -->
            <!-- v-if="file.response?.data" -->
            <div >
                <video v-if="getFileType(file.url) === 'video'" :src="file.url"></video>
                <img v-if="getFileType(file.url) === 'img'" class="el-upload-list__item-thumbnail" :src="file.url" alt />
                <span class="el-upload-list__item-actions" v-if="!props.disabled">
                    <span
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)"
                    >
                        <el-icon>
                            <delete />
                        </el-icon>
                    </span>
                    <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)"
                    >
                        <el-icon><zoom-in /></el-icon>
                    </span>
                </span>
            </div>
        </template>
        <template #tip v-if="result.tip">
            <div class="el-upload__tip">{{ result.tip }}</div>
        </template>
    </el-upload>
    <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" style="width: 100%; height: 100%" alt="Preview Image" />
    </el-dialog>
</template>

<script setup>
import { watch, reactive, ref } from 'vue'
// import { Plus, Delete } from '@element-plus/icons-vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { uploadFile } from '@/api/operate/index'
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
console.log(props, 'props')
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const result = reactive({
    // imgAction: '/api' + '/api/common/file',
    tip: props.tip,
    multiple: props.multiple,
    limit: props.limit,
    fileList: props.fileList
})
const handlePictureCardPreview = (file) => {
    dialogImageUrl.value = file.url
    dialogVisible.value = true
}
const fileLists = ref([])

const emit = defineEmits('update:fileList')

const imgSize = 10 * 1024 * 1024
const vedioSize = 15 * 1024 * 1024
const FILETYPES = {
    VEDIO: ['video/mp4'],
    IMG: ['image/jpg', 'image/png', 'image/jpeg']
}

const uploadRef = ref('')

watch(() => props.fileList,
    (val) => {
        fileLists.value = props.fileList
    },
    {
        deep: true
    })
// watch(() => fileLists,
//     (val) => {
//         console.log(val, 'fileLists')
//         console.log(result.fileList.filter(el => !el.name))
//         // result.fileList = result.fileList.filter(el => !el.name)
//         // emit('update:fileList', result.fileList.filter(el => !el.name))
//     },
//     {
//         immediate: true,
//         deep: true
//     })

const handleRemove = (file) => {
    const copyFileList = [...result.fileList]
    result.fileList.forEach((el, index) => {
        if (el.uid === file.uid) {
            copyFileList.splice(index, 1)
        }
    })
    result.fileList = copyFileList
    emit('update:fileList', result.fileList)
}
const handleAvatarError = (file) => {
    console.log(file, 'error')
}
const fileRequest = async (opt, info) => {
    const formData = new FormData()
    formData.append('file', opt.file)
    formData.append('appKey', 'A1001001')
    formData.append('busiCode', 'A1001001')
    formData.append('configCode', 'UC1659686930624DjRgA')
    formData.append('name', '商品中台-图片上传')
    formData.append('source', '商品中台')
    formData.append('fileType', props.mediaType)
    const res = await uploadFile(formData)
    if (res.code === '200') {
        // result.fileList.pop()
        result.fileList.push({ url: res.data })
    }
    result.fileList = result.fileList.filter(el => !el.name)
    emit('update:fileList', result.fileList)
    console.log(res, 'res')
    console.log(result.fileList, 'fileList12345')
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
            ElMessage.error('只允许上传 10M 之内的视频!')
            return false
        }
    } else {
        ElMessage.error('当前文件不符合上传文件规范!')
        return false
    }
}

// 获取文件类型
const getFileType = (url) => {
    console.log(url, 'url ---')
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
/* 推荐，实现简单 */
.el-upload-list__item.is-ready,
.el-upload-list__item.is-uploading {
  display: none !important;
}
.el-upload-list__item.is-ready {
    display: none;
}
</style>
<style lang="scss" scoped>
video {
    width: 100%;
}
</style>
