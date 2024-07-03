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
        v-model:file-list="fileLists"
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
            <div v-if="file.response?.data">
                <video v-if="getFileType(file.response.data) === 'video'" :src="file.response.data"></video>
                <img v-if="getFileType(file.response.data) === 'img'" class="el-upload-list__item-thumbnail" :src="file.response.data" alt />
                <span class="el-upload-list__item-actions" v-if="!props.disabled">
                    <span
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)"
                    >
                        <el-icon>
                            <delete />
                        </el-icon>
                    </span>
                </span>
            </div>
        </template>
        <template #tip v-if="result.tip">
            <div class="el-upload__tip">{{ result.tip }}</div>
        </template>
    </el-upload>
</template>

<script setup>
import { watch, reactive, ref, onMounted } from 'vue'
// import { Plus, Delete } from '@element-plus/icons-vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { update } from '@/api/operate/index'
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
const result = reactive({
    // imgAction: '/api' + '/api/common/file',
    tip: props.tip,
    multiple: props.multiple,
    limit: props.limit,
    fileList: props.fileList
})

const fileLists = ref([])

const emit = defineEmits(['handleAvatarSuccess', 'update:fileList'])

const fileSize = 0.8 * 1024 * 1024

const uploadRef = ref('')

watch(() => props.fileList,
    (val) => {
        fileLists.value = props.fileList
    },
    {
        deep: true
    })

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
    // console.log(file, 'error')
}
onMounted(() => {
    fileLists.value = props.fileList
})
const fileRequest = async (file, mediaType) => {
    const formData = new FormData()
    formData.append('file', file.file)
    // formData.append('appKey', 'A1001001')
    // formData.append('busiCode', 'A1001004')
    // formData.append('configCode', 'UC1659686930624DjRgA')
    // formData.append('name', '商品中台-图片上传')
    // formData.append('source', '商品中台')
    // formData.append('fileType', props.mediaType)
    const res = await update(formData)
    if (res) {
        const lRes = res.replace('blob:', '')
        result.fileList.pop()
        result.fileList.push({ url: lRes })
        emit('handleAvatarSuccess', lRes)
    }
}
// 上传文件拦截
const beforeUpload = (files, fileList) => {
    if (files.size > fileSize) {
        ElMessage.error('只允许上传 10M 之内的文件!')
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
</style>
