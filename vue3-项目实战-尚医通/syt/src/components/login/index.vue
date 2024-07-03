<template>
    <div class="login_container">
        <!-- v-model:控制对话框的显示情况，title：对话框的标题 -->
        <el-dialog v-model="userStore.dialogFormVisible" title="用户登录">
            <!-- 对话框身体部分的结构 -->
            <div class="content">
                <div class="left">
                    <div v-if="!iswechat">
                        <el-form :model="userData" :rules="rules" ref="form">
                            <el-form-item label="" prop="phone">
                                <el-input v-model="userData.phone" placeholder="请输入手机号码" :prefix-icon="User" />
                            </el-form-item>
                            <el-form-item label="" prop="code">
                                <el-input v-model="userData.code" placeholder="请输入手机验证码" :prefix-icon="Lock" />
                            </el-form-item>
                            <el-form-item label="">
                                <el-button @click="getPhoneCode" :disabled='!isPhone || flag'>
                                    <span v-if="!flag">获取验证码</span>
                                    <CountDown v-else :flag="flag" @getFlag="getFlag" />
                                </el-button>
                            </el-form-item>
                            <div class="bottom">
                                <el-button style="width:90%" type="primary" size="default" color="red"
                                    :disabled="!isPhone || userData.code.length < 6" @click="goLogin">用户登录</el-button>
                                <div class="wechat" @click="changeIsWechat">
                                    <p>微信扫码登录</p>
                                    <i class="iconfont icon-weixin"></i>
                                </div>

                            </div>
                        </el-form>
                    </div>
                    <div v-else>
                        <div id="login_container">
                        </div>
                        <div class="login-phone" @click="changeIsPhone">
                            <p class="phone">手机验证码登录</p>
                            <i class="iconfont icon-shouji"></i>
                        </div>
                    </div>

                </div>
                <div class="right">
                    <div class="top">
                        <div class="left_box">
                            <img src="@/assets/images/code_login_wechat.png" alt="">
                            <i class="iconfont icon-weixin"></i>
                            <p>微信扫一扫关注</p>
                            <p>“快速预约挂号”</p>
                        </div>
                        <div class="right_box">
                            <img src="@/assets/images/code_app.png" alt="">
                            <i class="iconfont icon-shouji"></i>
                            <p>扫一扫下载</p>
                            <p>“预约挂号”App</p>
                        </div>
                    </div>
                    <div class="bottom">
                        <p>尚医通官方指定平台</p>
                        <p>快速挂号 安全放心</p>
                    </div>
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" size="default" class="close-btn" @click="closeDialog">
                        关闭窗口
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang='ts' name="Login">
import CountDown from '../../components/countdown/index.vue'
//获取用户的仓库数据
import useUserStore from '@/store/modules/user'
//引入搜索的element图标
import { User, Lock } from '@element-plus/icons-vue'
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
//引入微信扫码登录参数请求接口
import {reqWeLogin} from '@/api/login/index'
//引入微信扫码登录返回数据的ts数据类型
import type {WxLoginResponseData} from '@/api/login/type'
import {useRouter,useRoute} from 'vue-router'
//获取路由器对象
const $router = useRouter();
//获取路由对象
const $route = useRoute();
const userStore = useUserStore();
const iswechat = ref<boolean>(false);// 0:选择手机号验证码 1:选择微信扫码
//收集表单信息
const userData = reactive({
    phone: '',//手机号
    code: ''//验证码
});
//控制是否显示倒计时
const flag = ref<boolean>(false);//如果为true代表开启倒计时
//计算当前表单元素收集的内容是否为手机号码
let isPhone = computed(() => {
    //手机号码的正则表达式
    const reg = /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/;
    //返回布尔值:true代表为手机号，false代表不是手机号
    return reg.test(userData.phone);
});
//修改是否显示微信登录
const changeIsWechat = async() => {
    iswechat.value = true
    //发送请求获取微信扫码登录需要的参数
    let redirect_Url = encodeURIComponent(window.location.origin+'/wxlogin');
    console.log('redirect_Url',redirect_Url);
    const result:WxLoginResponseData = await reqWeLogin(redirect_Url);
    const {appid,redirectUri,scope,state} = result.data;
    console.log('appid',appid,);
    console.log('redirectUri',redirectUri,);
    console.log('scope',scope,);
    console.log('state',state,);

    //生成微信扫码登录的二维码页面
    //@ts-ignore （忽略ts）
    const obj = new WxLogin({
        self_redirect: true,//true：手机点击确认登录后可以在 iframe 内跳转到 redirect_uri
        id: "login_container",//显示二维码容器的设置
        appid: appid,//应用的唯一标识appid
        scope: scope,//当前微信扫码登录页面已经授权了
        redirect_uri: redirectUri,//填写授权回调域路径，就是用户授权成功以后，微信服务器向公司后台推送code地址
        state: state,//公司服务器重定向的地址（携带用户信息）
        style: "black",
        href: ""
    });
}
//修改是否显示手机登录
const changeIsPhone = ()=>{
    iswechat.value = false;
}
//用户点击 获取验证码
const getPhoneCode = async () => {
    //解决element-plus按钮禁用还能点击的问题（当不是电话号码或者显示了倒计时则）
    if (!isPhone.value || flag.value) return
    //获取验证码(通知pinia去获取验证码并存储)
    //开启倒计时组件
    flag.value = true;
    try {
        //获取验证码成功
        await userStore.getCode(userData.phone);
        userData.code = userStore.code;
    } catch (error) {
        //获取验证码失败
        ElMessage({
            message: (error as Error).message,
            type: 'error',
            plain: true,
        })
    }

}
//给倒计时子组件绑定自定义事件
const getFlag = (val: boolean) => {
    flag.value = val;
}
//用户点击 登录
const goLogin = async () => {
    console.log('登录');
    //form.value.validate()对整个表单的内容进行验证，接收一个回调函数，或返回Promise
    // console.log('form',form.value.validate());
    await form.value.validate();//表单校验（两条手机号和验证码）通过以后才能继续下面的登录操作
    //发起登录请求
    //登录请求成功：对话框关闭且顶部组件需要展示用户名字
    //登录请求失败：弹出对应登录失败的错误信息
    try {
        await userStore.userLogin({ phone: userData.phone, code: userData.code });
        //关闭对话框
        userStore.dialogFormVisible = false;
        //获取url的query参数
        let redirect = $route.query.redirect;
        if(redirect){
            //去想去没有去成的地方
            $router.push(redirect as string);
        }else{
            //如果之前没有想去的地方则登录后跳转到
            $router.push({path:'/home'});
        }
    } catch (error) {
        ElMessage({
            message: (error as Error).message,
            type: 'error',
            plain: true,
        })
    }

}

//手机号码的自定义校验规则
const validatorPhone = (rules: any, value: any, callBack: any) => {
    //rules:即为表单校验规则对象
    //value:即为当前文本输入的内容
    //callBack:回调函数
    console.log('rules', rules);
    console.log('value', value);
    console.log('callBack', callBack);
    //手机号码的正则表达式
    const reg = /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/;
    if (reg.test(value)) {
        callBack();
    } else {
        callBack(new Error("请输入正确的手机号码格式"));
    }
}
//验证码的自定义校验规则
const validatorCode = (rules: any, value: any, callBack: any) => {
    //如果验证码是6位的
    if (/^\d{6}$/.test(value)) {
        callBack();
    } else {
        callBack(new Error("请输入正确的验证码格式"));
    }
}
//获取form表单的组件实例
const form = ref<any>();
console.log('form', form);
//表单校验的规则对象
const rules = {
    /*普通的表单校验规则不是很实用*/
    //手机号码校验规则
    //required:代表当前字段务必进行校验
    //message:代表的校验错误的提示信息
    //trigger:代表表单校验触发的时机  change:文本发生变化的时候进行校验，blur:失去焦点的时候出发校验
    //min:代表的是最小的位数
    //max:代表的是最大的位数
    // phone: [
    //     { required: true, message: '手机号码应是11位', trigger: 'change', min: 11, max:11 },
    // ],
    // code: [
    //     { required: true, message: '验证码应是6位', trigger: 'blur', min:6, max:6 }
    // ]

    /* 自定义表单校验规则 */
    phone: [{ trigger: 'change', validator: validatorPhone }],
    code: [{ trigger: 'blur', validator: validatorCode }]
}
//关闭窗口按钮
const closeDialog = () => {
    //将dialog关闭
    userStore.dialogFormVisible = false;
}
//监听是微信登录还是手机号码登录
watch(()=>iswechat.value,(newValue)=>{
    if(newValue){
        //true微信登录 （false手机号码登录）
        //查询pinia库中的状态
        userStore.queryState();
    }
});
</script>


<style scoped lang="scss">
.login_container {
    ::v-deep(.el-dialog) {
        padding-left: 0;
        padding-right: 0;
    }

    ::v-deep(.el-dialog__title) {
        margin-left: 20px;
    }

    ::v-deep(.el-dialog__body) {
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
    }

    .content {
        display: flex;
        box-sizing: border-box;
        padding: 20px 20px;

        .left {
            width: 50%;
            border: 1px solid #ccc;
            box-sizing: border-box;
            padding: 20px 20px;
            .bottom {
                display: flex;
                flex-direction: column;
                align-items: center;

                .wechat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                p {
                    margin: 10px 0;
                }

                .icon-weixin {
                    width: 100px;
                    color: #05dd14;
                }

                .iconfont {
                    font-size: 30px;
                    display: flex;
                    justify-content: center;
                }
            }
            .login-phone{
                display: flex;
                flex-direction: column;
                align-items: center;
                .phone{
                    margin:10px 0;
                }
            }
        }

        .right {
            flex: 1;

            .top {
                display: flex;
                justify-content: space-around;

                .left_box {
                    width: 120px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    img {
                        width: 100%;
                    }

                    i {
                        margin: 5px 0;
                    }

                    p {
                        margin: 5px 0;
                    }
                }

                .right_box {
                    width: 120px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    img {
                        width: 100%;
                    }

                    i {
                        margin: 5px 0;
                    }

                    p {
                        margin: 5px 0;
                    }
                }
            }

            .bottom {
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 18px;

                p {
                    margin: 10px 0;
                }
            }
        }
    }

    ::v-deep(.dialog-footer .el-button) {
        margin-right: 10px;
    }
}
</style>