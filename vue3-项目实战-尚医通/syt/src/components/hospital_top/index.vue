<template>
    <div class="top">
        <div class="content">
            <div class="left" @click="goHome">
                <img src="../../assets/images/logo.png" alt="">
                <p>尚医通 预约挂号统一平台</p>
            </div>
            <div class="right">
                <p class="help">帮助中心</p>
                <!-- 如果没有用户名字：显示登录注册 -->
                <p class="login" @click="showLogin" v-if="!userStore.userInfor.name">登录/注册</p>
                <!-- 否则显示下拉菜单（用户信息） -->
                <el-dropdown v-else>
                    <span class="el-dropdown-link">
                        {{ userStore.userInfor.name }}
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="goCertification('/user/certification')">实名认证</el-dropdown-item>
                            <el-dropdown-item @click="goOrder('/user/order')">挂号订单</el-dropdown-item>
                            <el-dropdown-item @click="goPatient('/user/patient')">就诊人管理</el-dropdown-item>
                            <el-dropdown-item @click="logoOut">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts' name="HospitalTop">
import { useRouter } from 'vue-router'
//引入用户信息的仓库数据
import useUserStore from '@/store/modules/user'
//引入element 图标
import { ArrowDown } from '@element-plus/icons-vue'
//引入清除本地存储用户信息的方法
import {REMOVE_USERINFOR} from '@/utils/user'
const userStore = useUserStore();
console.log('userStore', userStore);
// 创建路由实例
const $router = useRouter();
//点击 "尚医通 预约挂号统一平台"跳转首页
const goHome = () => {
    $router.push({
        path: "/home"
    })
}
//点击登录与注册按钮的时候弹出对话框
const showLogin = () => {
    console.log('登录页面');
    //点击以后使得登录的弹框弹出来
    userStore.dialogFormVisible = true;
}
//退出登录按钮
const logoOut = () => {
    console.log('退出登录');
    //通知pinia仓库清除用户相关的信息
    userStore.logOut();
    //跳转到首页
    $router.push({
        path:'/home'
    })
}
//跳转实名认证
const goCertification =(path:string)=>{
    $router.push({path:path});
}
//跳转挂号订单
const goOrder = (path:string)=>{
    $router.push({path:path});
}
//跳转就诊人管理
const goPatient = (path:string)=>{
    $router.push({path:path});
}
</script>

<style scoped lang="scss">
.top {
    width: 100%;
    height: 70px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    z-index: 999;

    .content {
        width: 1200px;
        height: 70px;
        background-color: white;
        display: flex;
        justify-content: space-between;

        .left {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            img {
                width: 50px;
                height: 50px;
                margin-right: 10px;
            }

            p {
                font-size: 20px;
                color: #55a6fe;
            }
        }

        .right {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            color: #ccc;

            .help {
                margin-right: 10px;
                cursor: pointer;
            }

            .login {
                cursor: pointer;
            }
        }
    }
}
</style>