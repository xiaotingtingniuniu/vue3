<template>
    <div class="application-settlement">
        <div class="settlement-box">
            <h5 class="title-head">变更前信息</h5>
            <el-form :model="form" label-width="150px">
                <el-row>
                    <el-col :span="6">
                        <h5>商户主体信息</h5>
                    </el-col>
                </el-row>
                <el-form-item label="商户类型">
                    <span>{{props.title}}</span>
                </el-form-item>
                <el-form-item label="企业名称">
                    <span>{{from.name}}</span>
                </el-form-item>
                <el-form-item label="统一社会信用代码">
                    <span>111</span>
                </el-form-item>
                <el-form-item label="营业执照照片上传">
                    <span>111</span>
                </el-form-item>
                <el-row>
                    <el-col :span="6">
                        <h5>法人信息</h5>
                    </el-col>
                </el-row>
                <el-form-item label="法人姓名">
                    <span>111</span>
                </el-form-item>
                <el-form-item label="证件类型">
                    <span>111</span>
                </el-form-item>
                <el-form-item label="证件号码">
                    <span>111</span>
                </el-form-item>
                <el-form-item label="身份证照片上传">
                    <div v-for="item in from.bankCert" :key="item">
                        <img @click="showimg(item)" style="height:100px;position:relative;top:20px;" :src="item" />
                    </div>

                </el-form-item>
                <el-form-item label="合作信息">
                    <span>111</span>
                </el-form-item>
            </el-form>
        </div>
        <div class="settlement-box flex-settlement">
            <div>
                <h5 class="title-head">变更后信息</h5>
                <el-form :model="endForm" label-width="150px">
                    <el-row>
                        <el-col :span="6">
                            <h5>商户主体信息</h5>
                        </el-col>
                    </el-row>
                    <el-form-item label="商户类型">
                        <span>企业</span>
                    </el-form-item>
                    <el-form-item label="企业名称" prop="batchName" >
                        <el-input v-model="endForm.batchName" placeholder="请输入企业名称，少于100字" clearable :maxlength="100"/>
                    </el-form-item>
                    <el-form-item label="统一社会信用代码"  prop="batchName">
                        <el-input v-model="endForm.batchName" placeholder="请输入统一社会信用代码" clearable :maxlength="100"/>
                    </el-form-item>
                    <el-form-item label="营业执照照片上传">
                        <span>111</span>
                    </el-form-item>
                    <el-row>
                        <el-col :span="6">
                            <h5>法人信息</h5>
                        </el-col>
                    </el-row>
                    <el-form-item label="法人姓名"  prop="batchName">
                        <el-input v-model="endForm.batchName" placeholder="请输入法人姓名" clearable :maxlength="100"/>
                    </el-form-item>
                    <el-form-item label="证件类型">
                        <el-select v-model="endForm.couponType" clearable placeholder="请选择">
                            <el-option label="身份证" value="1" />
                            <el-option label="护照" value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="证件号码">
                        <el-input v-model="endForm.batchName" placeholder="请输入证件号码" clearable :maxlength="100"/>
                    </el-form-item>
                    <el-form-item label="身份证照片上传">
                        <el-row>
                            <el-col :span="12">
                                <Upload :num="1"  @delImage = 'delImage' @handleAvatarSuccess= 'handleAvatarSuccess' dom="bankCertificate" :imgList="endForm.bankCertificate" />
                                <P style="color: #FF4D51;">身份证人像面照片</P>
                            </el-col>
                            <el-col :span="12">
                                <Upload :num="1"  @delImage = 'delImage' @handleAvatarSuccess= 'handleAvatarSuccess' dom="bankCertificate" :imgList="endForm.bankCertificate" />
                                <P style="color: #FF4D51;">身份证人背面照片</P>
                            </el-col>
                        </el-row>
                        <p>1,图片必须为彩色扫描件或彩色图片</p>
                        <p>2,图片仅支持BMP、JPG、JPEG、RNG格式，大小不超过2mb</p>

                    </el-form-item>
                    <el-form-item label="商户状态">
                        <el-radio-group v-model="endForm.storeType" >
                            <el-radio :label="1">启用</el-radio>
                            <el-radio :label="2">停用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <div class="flex-right">
                <h5 class="title-head">审核进度</h5>
                <el-steps direction="vertical" :active="1">
                    <el-step title="2022-09-09 12:12:12 提交审核"/>
                    <el-step title="审核中" />
                </el-steps>
            </div>
        </div>

        <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" style="width:100%;height:100%"/>
        </el-dialog>
    </div>
</template>

<script setup>
import { toRefs, reactive, ref } from 'vue'
import Upload from '@/components/upload'
const props = defineProps({
    title: {
        type: String
    }
})

console.log(props.title)
const dataState = reactive({
    endForm: {
        batchName: '',
        couponType: '',
        bankCertificate: '',
        storeType: 1

    },
    from: {
        bankCert: [
            'https://img1.baidu.com/it/u=1966616150,2146512490&fm=253&fmt=auto&app=138&f=JPEG?w=751&h=500',
            'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F0G020114924%2F200G0114924-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1659320761&t=699f49afd34ce3f5126426197d18e9e0'
        ],
        name: '123'
    },
    dialogImageUrl: '',
    passwordForm: {}
})
const { endForm, from, dialogImageUrl } = toRefs(dataState)

const dialogVisible = ref(false)
const showimg = (url) => {
    dialogVisible.value = true
    dataState.dialogImageUrl = url
}

// 上传成功回掉
const handleAvatarSuccess = (n, e) => {
    if (dataState.endForm[n]) {
        dataState.endForm[n] = dataState.endForm[n] + ',' + e.url
    } else {
        dataState.endForm[n] = e.url
    }
}
// 删除图片
const delImage = (n, i) => {
    const old = dataState.endForm[n]
    const arr = old.split(',')
    arr.splice(i, 1)
    const str = arr.length === 0 ? null : arr.toString()
    dataState.endForm[n] = str
}

</script>
<style lang="scss" scoped>
.application-settlement{
    display:flex;
    .settlement-box{
        flex:1;
        .title-head{
            line-height:50px;
        }
    }
    .flex-settlement{
        display:flex;
        justify-content:center;
        .flex-right{
            margin-left:5px;
            width:400px;
            height:150px;
            font-size:10px;
            :deep(.el-step__title){
                font-size:12px;
            }
            :deep(.el-step__icon){
                width: 14px;
                height: 14px;
                font-size:12px;
            }
            :deep(.el-step.is-vertical .el-step__line){
                left:6px;
            }
            :deep(.el-step.is-vertical .el-step__main){
                padding-left:0
            }
        }
    }

}
</style>
