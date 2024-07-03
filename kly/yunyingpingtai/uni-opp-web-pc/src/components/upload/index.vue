<template>
    <div class="up_load_div">
        <div v-if="uptype === 'excel'" style="display:inline-block;margin-right:20px;">
            <div v-if="arrimgList.length>0">已上传</div>
        </div>
        <div v-else>
            <div v-for="item,index in arrimgList" :key="index" class="same_img">
                <img :src="item" />
                <Close class="close" v-if="!upStatus" @click="delImage(newdom,index)" ></Close>
            </div>
        </div>
        <template v-if="!upStatus">
            <div v-if="arrimgList.length <allnum" style="display:inline-block" >
                <el-upload
                    style="margin-top:13px;"
                    name="file"
                    accept=".jpg,.png,.jpeg"
                    class="upload-demo"
                    :disabled='upStatus'
                    :action='imgAction'
                    :headers="headers"
                    :file-list="fileList"
                    :limit="1"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess.bind(this,newdom)"
                    :before-upload="beforeAvatarUpload"

                >
                    <!-- :on-progress = "handleshowfile" -->
                    <el-button size="small" type="primary" :loading="showfile">上传图片</el-button>
                </el-upload>
            </div>
        </template>

    </div>
</template>
<script setup>
import { watch, reactive, onMounted, computed, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { Close, Plus } from '@element-plus/icons'
import { useRouter } from 'vue-router'
const props = defineProps(['imgList', 'dom', 'disabled', 'uptype', 'num'])
const router = useRouter()
const headers = computed(() => ({ Authorization: localStorage.getItem('HCCM-TOKENS') }))

const emit = defineEmits(['handleAvatarSuccess', 'delImage'])
const dataState = reactive({
    imgAction: '/api' + '/api/common/file',
    newdom: props.dom,
    strimgList: props.imgList,
    arrimgList: [],
    upStatus: props.disabled,
    mytype: props.uptype ? props.uptype : 'img',
    allnum: props.num ? props.num : 3,
    showfile: false,
    fileList: []
})
const { imgAction, newdom, arrimgList, upStatus, allnum, fileList } = toRefs(dataState)
onMounted(() => {
    dataState.arrimgList = dataState.strimgList ? dataState.strimgList.split(',') : []
})
watch(() => [props.imgList, props.dom, props.disabled], (newVal, oldVal) => {
    dataState.strimgList = newVal[0]
    dataState.arrimgList = newVal[0] === '' ? [] : newVal[0].split(',')
    dataState.newdom = newVal[1]
    dataState.upStatus = newVal[2]
})
// 上传图片验证
const beforeAvatarUpload = (file) => {
    if (dataState.mytype === 'img') {
        const types = ['image/jpeg', 'image/jpg', 'image/png']
        const isJPG = types.includes(file.type)
        const isLt3M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
            ElMessage({
                message: '上传图片只能是 jpg/png 格式!',
                type: 'error'
            })
        }
        if (!isLt3M) {
            ElMessage({
                message: '上传图片大小不能超过 3MB!',
                type: 'error'
            })
        }
        return isJPG && isLt3M
    } else {
        const isXlS = file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
        console.log(isXlS)
        // const isLt3M = file.size / 1024 / 1024 < 3
        if (!isXlS) {
            ElMessage({
                message: '上传只能是 excel格式!',
                type: 'error'
            })
        }
        // if (!isLt3M) {
        //   ElMessage.error('上传excel大小不能超过 3MB!')
        // }
        return isXlS
        // return isXlS && isLt3M
    }
}
const handleAvatarSuccess = (val, dom) => {
    if (dom.code === 'A0230') {
        router.push({ path: '/login' })
    } else if (dom.code !== '200') {
        ElMessage({
            message: dom.msg || dom.message,
            type: 'error'
        })
    } else {
        emit('handleAvatarSuccess', val, dom, props.uptype)
    }
    dataState.fileList = []
}
const delImage = (dom, i) => {
    console.log(dom, i, 'delImage')
    emit('delImage', dom, i)
}
</script>
<style lang="scss" scoped>
.up_load_div{
  overflow: hidden;
    // height: 40px;
    .same_img{
      position:relative;
      width:50px;
      height:50px;
      margin:10px;
      float: left;
      img{
          width:50px;
          height:50px;
      }
      .close{
        width:15px;
        height: 15px;
        position: absolute;
        background: #fff;
        border-radius: 50%;
        right:-7px;
        top:-7px;
      }
    }
}
</style>
