<template>
    <el-form :model="ruleForm" label-width="120px">
        <el-form-item label="" v-for="(item,index) in listArr" :key="index">
            <h1>{{item.title}}</h1>
            <cst-upload :limit="4" :multiple="true" v-model:fileList="item.imglist" accept=".jpg,.png,.jpeg,.mp4" tip="次于主图位置。建议尺寸：120*120 像素，最多上传8张"></cst-upload>
            <div class="text-management">
                <p>支持上传4张图片,支持格式:png,jpg,gif</p>
                <p>文件大小:小于1M,</p>
                <p>图片尺寸:宽666px,高度自定义,不建议超过1000px</p>
            </div>
        </el-form-item>
        <!-- <el-form-item>
            <div style="margin-left: 150px; margin-right: 50px">
                <el-image
                    style="width: 300px; height: 300px"
                    :src="url"
                    :preview-src-list="srcList"
                    :initial-index="4"
                    fit="cover"
                />
            </div>
            <el-button type="primary">删除</el-button>
        </el-form-item>

        <el-form-item label="">
            <h1>商品介绍说明2</h1>
            <el-upload
                class="avatar-uploader"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
            >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon
                ></el-upload>
            <div class="text-management">
                <p>支持上传4张图片,支持格式:png,jpg,gif</p>
                <p>文件大小:小于1M,</p>
                <p>图片尺寸:宽666px,高度自定义,不建议超过1000px</p>
            </div>
        </el-form-item>
        <el-form-item>
            <div style="margin-left: 150px; margin-right: 50px">
                <el-image
                    style="width: 300px; height: 300px"
                    :src="url"
                    :preview-src-list="srcList"
                    :initial-index="4"
                    fit="cover"
                />
            </div>
            <el-button type="primary">删除</el-button>
        </el-form-item>

        <el-form-item label="">
            <h1>商品介绍说明3</h1>
            <el-upload
                class="avatar-uploader"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
            >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon
                ></el-upload>
            <div class="text-management">
                <p>支持上传4张图片,支持格式:png,jpg,gif</p>
                <p>文件大小:小于1M,</p>
                <p>图片尺寸:宽666px,高度自定义,不建议超过1000px</p>
            </div>
        </el-form-item>
        <el-form-item>
            <div style="margin-left: 150px; margin-right: 50px">
                <el-image
                    style="width: 300px; height: 300px"
                    :src="url"
                    :preview-src-list="srcList"
                    :initial-index="4"
                    fit="cover"
                />
            </div>
            <el-button type="primary">删除</el-button>
        </el-form-item> -->
    </el-form>
    <div style="width: 300px;margin: 0 auto">
        <el-button type="success">取消</el-button>
        <el-button type="" @click="goReturn">上一步</el-button>
        <el-button type="success" @click="submitForm(ruleForm)">提交</el-button>
    </div>
</template>

<script setup>
import { reactive, toRefs, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import CstUpload from '@/components/upload/upload.vue'
import { getMerchantList } from '@/api/operate/index'

const router = useRouter()

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const emit = defineEmits(['next'])
const props = defineProps({
    toRuleForm: {
        type: Object,
        default: () => {}
    }
})
const dataState = reactive({
    ruleForm: props.toRuleForm,
    listArr: []

})
const { ruleForm, listArr } = toRefs(dataState)

const goReturn = () => {
    emit('next', 2)
}
const getPicList = () => {
    const picList = dataState.ruleForm.detail.map(item => {
        return {
            title: item.title,
            imglist: Object.values(item.pics)
        }
    })
    dataState.listArr = picList
    console.log(picList)
}
getPicList()

const submitForm = async (ruleForm) => {
    const goodsExtends = {
        ...dataState.ruleForm.goodsExtends
    }
    const picsObj = {}

    const medias = []
    if (dataState.ruleForm.vidoList.length > 0) {
        dataState.ruleForm.vidoList.forEach(item => {
            medias.push(item)
        })
    }
    if (dataState.ruleForm.zhutuList.length > 0) {
        dataState.ruleForm.zhutuList.forEach(item => {
            medias.push(item)
        })
    }
    if (dataState.ruleForm.lunbolist.length > 0) {
        dataState.ruleForm.lunbolist.forEach(item => {
            medias.push(item)
        })
    }
    if (dataState.ruleForm.suolueList.length > 0) {
        dataState.ruleForm.suolueList.forEach(item => {
            medias.push(item)
        })
    }
    if (dataState.ruleForm.pubuImageList.length > 0) {
        dataState.ruleForm.pubuImageList.forEach(item => {
            medias.push(item)
        })
    }
    if (dataState.ruleForm.liebiaoImageList.length > 0) {
        dataState.ruleForm.liebiaoImageList.forEach(item => {
            medias.push(item)
        })
    }
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            goodsId: dataState.ruleForm.goodsId,
            merchantCode: dataState.ruleForm.merchantCode,
            merchantName: dataState.ruleForm.merchantName,
            spuId: '1',
            spuName: '123',
            spuType: dataState.ruleForm.spuType,
            shadow: dataState.ruleForm.shadow,
            goodsExtends: dataState.ruleForm.goodsExtends,
            medias: medias,
            goodsDetail: dataState.ruleForm.detail

        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC1657692352371NOHdF',
        name: 'Goods修改接口',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    // const data = await getMerchantList(params)
    console.log(params)
}

</script>

<style lang="scss" scoped>
.text-management {
    margin-top: 50px;
    margin-left: 20px;
    p {
        font-size: 15px;
        font-weight: 200;
    }
}

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
