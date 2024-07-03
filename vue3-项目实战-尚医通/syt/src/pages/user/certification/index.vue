<template>
    <div class="certification">
        <el-card>
            <!-- 卡片头部结构 -->
            <template #header>
                <div class="card-header">
                    <span>实名认证</span>
                </div>
            </template>
            <!-- 实名认证的提示部分结构 -->
            <div class="tip">
                <el-icon>
                    <Warning />
                </el-icon>
                <p>完成实名认证后才能添加就诊人，正常进行挂号，为了不影响后续步骤，建议提前实名认证</p>
            </div>
            <!-- 卡片底部:认证成功的结构、认证为成功的结构 -->
            <div class="bottom">
                <!-- 验证通过的结构 -->
                <el-descriptions v-if="userInfor?.authStatus === 1" class="margin-top descriptions" :column="1" border
                    size="small">
                    <el-descriptions-item label-align="center" :width="30">
                        <template #label>
                            <div class="cell-item">
                                用户姓名
                            </div>
                        </template>
                        {{ userInfor.name }}
                    </el-descriptions-item>
                    <el-descriptions-item label-align="center" :width="30">
                        <template #label>
                            <div class="cell-item">
                                证件类型
                            </div>
                        </template>
                        {{ userInfor.certificatesType === '10' ? '身份证' : '户口本' }}
                    </el-descriptions-item>
                    <el-descriptions-item label-align="center" :width="30">
                        <template #label>
                            <div class="cell-item">
                                证件号码
                            </div>
                        </template>
                        {{ userInfor.certificatesNo }}
                    </el-descriptions-item>
                </el-descriptions>
                <!-- 未验证通过的结构 -->
                <!-- 接口有问题，新注册的用户没有认证时authStatus一直为1，正常的接口应该是没有认证时返回authStatus=0 -->
                <el-form v-if="userInfor?.authStatus === 1" class="form" label-width="80" :model="params" :rules="rules" ref="form">
                    <el-form-item label="用户姓名" prop="name">
                        <el-input placeholder="请输入用户姓名" v-model="params.name"></el-input>
                    </el-form-item>
                    <el-form-item label="证件类型" prop="certificatesType">
                        <el-select placeholder="请选择证件类型" v-model="params.certificatesType">
                            <el-option label="身份证" value="10"></el-option>
                            <el-option label="户口本" value="20"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="证件号码" prop="certificatesNo">
                        <el-input placeholder="请输入证件号码" v-model="params.certificatesNo"></el-input>
                    </el-form-item>
                    <el-form-item label="上传证件" prop="certificatesUrl">
                        <!-- action:upload组件向服务器提交图片路径
                             limit:照片墙约束图片个数
                             on-exceed:超出约束数量的钩子
                             on-success:图片上传成功的钩子
                             on-preview:点击文件列表中已上传的文件时的钩子
                        -->
                        <el-upload list-type="picture-card" :on-exceed="exceedHandler" :on-success="successHandler"
                            :on-preview="handlePictureCardPreview" :on-remove="handleRemove" ref='upload' :limit='1'
                            action="/api/oss/file/fileUpload?fileHost=userAuah">
                            <el-icon class="icon-img">
                                <img src="../../../assets/images/auth_example.png" alt="" class="img">
                            </el-icon>
                        </el-upload>
                        <el-dialog v-model="dialogVisible">
                            <img w-full alt="Preview Image" :src="params.certificatesUrl" class="dialogImage" />
                        </el-dialog>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="default" @click="submit">提交</el-button>
                        <el-button type="primary" size="default" @click="reset">重写</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script setup lang='ts'>
//引入element-plus图标
import { Warning } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import { reqGetUserInfo, reqUserCertation } from '@/api/user/index'
import { GetUserInfoResponseData, UserParam } from '@/api/user/type'
import { ElMessage } from 'element-plus';
//存储会员信息
const userInfor = ref<any>();
//收集会员表单认证的数据
let params = reactive<UserParam>({
    certificatesNo: "",
    certificatesType: "",
    certificatesUrl: "",
    name: ""
});
//控制预览照片的显示与隐藏
const dialogVisible = ref<boolean>(false);
//获取上传组件
const upload = ref();
//获取form组件
const form = ref();
onMounted(() => {
    //获取会员信息
    getUserInfor();
});
//获取会员信息
const getUserInfor = async () => {
    const result: GetUserInfoResponseData = await reqGetUserInfo();
    console.log('result', result);
    if (result.code === 200) {
        userInfor.value = result.data;
    }
    console.log('userInfor', userInfor.value);
}
//上传图片中：超出数量的钩子
const exceedHandler = () => {
    ElMessage({
        type: 'error',
        message: '只能上传一张图片'
    });
}
//上传图片成功的钩子
const successHandler = (response: any) => {
    //如果图片上传成功，则校验结果清除
    form.value.clearValidate();
    console.log('response', response);
    //收集上传图片的地址
    params.certificatesUrl = response.data;

}
//点击文件列表中已上传的文件时的钩子
const handlePictureCardPreview = (uploadFile: any) => {
    console.log('uploadFile', uploadFile);
    dialogVisible.value = true;
}
//点击文件列表移除文件时的钩子
const handleRemove = () => {
    params.certificatesUrl = '';
}
//点击重写按钮
const reset = () => {
    //清空数据
    Object.assign(params, {
        certificatesNo: "",
        certificatesType: "",
        certificatesUrl: "",
        name: ""
    });
    //清除文件上传列表
    upload.value.clearFiles();
}
//点击提交按钮
const submit = async () => {
    //对全部的form表单进行表单校验(validate是ElementUi的form中的方法 该方法返回一个Promise 如果通过所有校验则会返回true)
    //如果有一个表单校验失败返回的是一个失败的promise对象，后面的语句就不在执行了
    await form.value.validate();    
    try {
        //认证成功
        await reqUserCertation(params);
        ElMessage({
            type: 'success',
            message: '认证成功'
        });
        //认证成功以后再次获取会员信息
        getUserInfor();
    } catch (error) {
        ElMessage({
            type: 'error',
            message: '认证失败'
        });
    }
}



/*自定义校验规则姓名方法
  rule:即为当前校验字段的校验规则对象
  value:表单输入的信息 
  callBack验证成功或失败时调用
*/
const validatorName = (rule:any,value:any,callBack:any)=>{
    console.log('rule',rule);
    //中国名字的正则表达式
    const reg = /^[\u00B7\u3007\u3400-\u4DBF\u4E00-\u9FFF\uE000-\uF8FF\uD840-\uD8C0\uDC00-\uDFFF\uF900-\uFAFF]+$/;
    if(reg.test(value)){
        callBack();
    }else{
        callBack(new Error('请输入正确的中文名字'));
    }
}
/*自定义校验规则证件类型的方法
*/
const validatorType = (rule:any,value:any,callBack:any)=>{
    console.log('rule',rule);
    if(value==='10'||value==='20'){
        callBack();
    }else{
        callBack(new Error('请选择证件的类型'));
    }
}
/**
 * 自定义校验规则证件号的方法
 */
const validatorNo = (rule:any,value:any,callBack:any)=>{
    console.log('rule',rule);
    //生份证和户口本的正则表达式
    let sfz = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
    let hkb = /^\d{9}$/;
    if(sfz.test(value)||hkb.test(value)){
        //身份证后者户口本正则验证成功
        callBack()
    }else{
        //没有通过正则验证
        callBack(new Error('请输入正确的身份件或户口本号'));
    }
}
/**
 * 自定义校验规则证件照的方法
 */
 const validatorUrl = (rule:any,value:any,callBack:any)=>{
    console.log('图片校验',rule);
    if(value.length){
        callBack();
    }else{
        callBack(new Error('请上传证件照'));
    }
 }
//表单校验规则对象
 const rules = {
    //用户姓名的校验规则
    //required:true 代表当前字段务必进行校验
    //validator:validatorName  自定义校验规则姓名方法
    name:[
        {
            required:true,
            validator:validatorName
        }
    ],
    certificatesType:[
        {
            required:true,
            validator:validatorType
        }
    ],
    certificatesNo:[
        {
            required:true,
            validator:validatorNo
        }
    ],
    certificatesUrl:[
        {
            required:true,
            validator:validatorUrl
        }
    ]
 }
</script>

<style scoped lang="scss">
.certification {
    margin-left: 50px;

    .tip {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #7f7f7f;
        font-size: 12px;
    }

    .bottom {
        .descriptions {
            margin: 20px auto;
        }

        .form {
            width: 60%;
            margin: 20px auto;

            .icon-img {
                width: 100%;
                height: 100%;

                .img {
                    width: 100%;
                    height: 100%;
                }
            }

            .dialogImage {
                width: 100%;
                height: 100%;
            }
        }
    }
}</style>