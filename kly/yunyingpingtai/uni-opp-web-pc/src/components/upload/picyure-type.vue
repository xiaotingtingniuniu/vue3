<template>
    <div class="component-upload-image">
        <el-upload
            v-loading="loading"
            class="upload-demo avatar-uploader"
            accept=".jpg,.png,.jpeg"
            name="file"
            :show-file-list="showFileList"
            :file-list="fileList"
            :data="dataObj"
            :action='imgAction'
            :headers="headers"
            :disabled='upStatus'
            :limit="limit"
            :list-type = "listType"
            :on-success="handleSuccess"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :on-exceed = "handleExceed"
            :on-preview="hanlePreview"
            :before-upload="beforeUpload"
        >

            <div v-if="!avatar">
                <el-icon  class="avatar-uploader-icon"><Plus /></el-icon>
            </div>
            <div v-else>
                <img v-if="imageUrl" :src="imageUrl" alt="" class="avatar" style="width:100px;height:100px; ">
                <el-icon  v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </div>
        </el-upload>
        <el-dialog
            :visible="dialogVisible"
            title="预览"
            width="800"
            append-to-body
        >
            <img
                :src="dialogImageUrl"
                style="display: block; max-width: 100%; margin: 0 auto"
            />
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Close, Plus } from '@element-plus/icons'

const props = defineProps({
    value: {},
    // 图片数量限制
    limit: {
        type: Number,
        default: 8
    },
    // 是否要采用头像上传
    avatar: {
        type: Boolean,
        default: false
    },
    // 大小限制(MB)
    fileSize: {
        type: Number,
        default: 5
    },
    // 判断返回父组建的是字符串还是数组
    isString: {
        type: Boolean,
        default: false
    },
    // 是否显示已上传列表
    showFileList: {
        type: Boolean,
        default: true
    },
    dataObj: {
        type: Object
    },
    // 上传类型   text/picture/picture-card
    listType: {
        type: String,
        default: 'picture-card'
    }

})

const headers = computed(() => ({ Authorization: localStorage.getItem('HCCM-TOKENS') }))
const dataState = reactive({
    changeFlag: true,
    emitList: [],
    fileList: [], // 回显的图片list
    imageUrl: '',
    dialogVisible: false,
    dialogImageUrl: '',
    loading: false,
    imgAction: '/api' + '/api/common/file'

})
const { changeFlag, emitList, fileList, imageUrl, dialogVisible, loading, imgAction } = toRefs(dataState)

onMounted(() => {
    console.log('1900')
})
const value = ref('')
watch(value.value, (newValue, oldValue) => {
    console.log(newValue, oldValue)
    if (dataState.changeFlag) {
        console.log(newValue, oldValue)
        if (props.avatar && newValue) {
            if (props.isString) {
                newValue = newValue.split('.')
            }
            dataState.emitList = [...newValue]
            newValue.forEach(item => {
                const obi = {
                    uid: item.uid,
                    url: item.url
                }
                dataState.fileList.push(obi)
            })
        } else {
            dataState.imageUrl = newValue
        }
    }
},
{
    immediate: true
})

// 上传前校验图大小
const beforeUpload = (file) => {
    const isLtsize = file.size / 1024 / 1024 < props.fileSize
    if (!isLtsize) {
        ElMessage({
            message: '文件大小不能超过' + props.fileSize + 'M',
            type: 'error'
        })
    }
    return isLtsize
}
const emit = defineEmits(['imput', 'change'])
// 文件上传成功
const handleSuccess = (file, filezInfo) => {
    console.log(file, filezInfo, 'q0088')
    dataState.changeFlag = false
    dataState.loading = true
    const item = file.data
    if (props.avatar) {
        dataState.imageUrl = item
        emit('imput', item)
        console.log(dataState.imageUrl, '0109876')
    } else {
        // 多图
        dataState.emitList.push(item)
        let val = [...dataState.emitList]
        if (props.isString) {
            val = val.join(',')
        }
        console.log(dataState.emitList, 'q008')
        emit('imput', val)
    }
    dataState.loading = false
}

const imput = (val) => {
    dataState.fileList = val
}
// 文件状态改变
const handleChange = () => {
    if (dataState.loading) {
        emit('change', true)
    }
}

// 文件移除
const handleRemove = (file, fileList) => {
    dataState.changeFlag = false
    const url = file.response ? file.response.data[0] : file.url
    dataState.emitList.forEach((item, index) => {
        if (item.indeOf(url) > -1) {
            emitList.splice(index, 1)
            let val = [...dataState.emitList]
            if (props.isString) {
                val = val.join(',')
            }
            emit('input', val)
        }
    })
}

// 点击上传文件
const hanlePreview = (file) => {
    if (dataState.showFileList && props.listType === 'picture-card') {
        dataState.dialogImageUrl = file.url
        dataState.dialogVisible = true
    }
}

// 文件超出限制
const handleExceed = (files, fileList) => {
    ElMessage.error('最多上传' + props.limit + '个图片')
}
</script>
<style scoped lang="scss">
// .el-upload--picture-card 控制加号部分
// :deep(.hide .el-upload--picture-card) {
//     display: none;
// }
// 去掉动画效果
:deep(.el-list-enter-active),
:deep(.el-list-leave-active) {
    transition: all 0s;
}

:deep(.el-list-enter, .el-list-leave-active) {
  opacity: 0;
  transform: translateY(0);
}
</style>
