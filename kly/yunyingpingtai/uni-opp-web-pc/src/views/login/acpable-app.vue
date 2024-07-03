<template>
    <div class="acpable-app-page">
        <el-header class="website-nav">
            <div class="left-box">
                <img class="logo" :src="hengchang" alt="">
                <span class="title">恒生活核心能力中台</span>
            </div>
            <el-dropdown>
                <span class="avatar-dropdown" v-if="userInfo">
                    <el-avatar :size="40" :src="avatar" />
                    <div class="user-name">
                        <span>{{ userInfo.name }}</span>
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </div>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item :icon="Setting" @click="logout">
                            退出登录
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </el-header>
        <el-tabs v-model="activeTab" class="tab-box">
            <el-tab-pane class="card-box" label="请选择您要登录的系统" name="first">
                <template v-for="(app, index) in appList" :key="index">
                    <div class="app-card" @click="goApp(app.link)" v-if="userInfo.authorizedSystemList.find(item => item.systemSign === app.id) || app.id === 'TUIKEPC'">
                        <div class="app-logo">
                            <svg class="icon" aria-hidden="true" v-if="index<3">
                                <use :xlink:href="`#icon-penzai${(index+1) < 10 ? ('0'+(index+1)) : (index+1)}`" />
                            </svg>
                            <img v-else-if="index===3" :src="penzai4" alt="">
                            <img v-else :src="penzai5" alt="">
                        </div>
                        <div class="app-content">
                            <div class="name">
                                {{ app.name }}
                            </div>
                            <div class="desc">
                                {{ app.desc }}
                            </div>
                        </div>
                    </div>
                </template>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script setup>
import { Setting } from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { goApp } from '@/utils'
import { useStore } from 'vuex'
import hengchang from '@/assets/images/hengchang.png'
import penzai4 from '@/assets/images/icon-penzai04.png'
import penzai5 from '@/assets/images/icon-penzai05.png'
import avatar from '@/assets/images/site-icon.png'
import { ElMessageBox } from 'element-plus'

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const activeTab = ref('first')
const token = computed(() => store.state.token)

const appList = ref([{
    name: '恒生活业务中台',
    id: 'HSHYWZTPC',
    desc: '恒生活业务中台对外能力提供, 包含用户数据管理、营销中台、客服管理、系统管理、权限配置等能力提供',
    // link: `${process.env.VUE_APP_UNI_OPP_WEB_PC}`
    link: window.origin + '/website'
}, {
    name: '恒掌柜运营平台',
    id: 'HZGPC',
    desc: '恒掌柜是一款功能非常强大的综合服务平台,集合了无人货柜柜主和供应商等多种经营模式,以全新的方式引领了无人零售新模式,用户使用手机就可以远程控制无人货柜机...',
    link: `${process.env.VUE_APP_GUIZHU_ADMIN}?code=${encodeURIComponent(token.value)}`
}, {
    name: '众包运营平台',
    id: 'TUIKEPC',
    desc: '众包运营平台入口,众包运营平台入口,众包运营平台入口,众包运营平台入口,众包运营平台入口,众包运营平台入口,众包运营平台入口,众包运营平台入口',
    link: `${process.env.VUE_APP_ZHONGBAO_PC}?code=${encodeURIComponent(token.value)}`
}])
console.log(appList.value, 'login')
// , {
//     name: '店柜协同运营平台',
//     desc: '恒生活app是一款专为用户带来的网购商城,通过这款软件来帮助用户购买到自己喜欢的生活用品,不管是什么行业的购物资源,都会在平台分享给大家,有教育,医美,网购商城,这些都会在平台分...',
//     link: `${process.env.VUE_APP_NL_SMP_WEB_PC}`
// }, {
//     name: '供应链运营后台',
//     desc: '为供应链运营后台提供入口, 为供应链运营后台提供入口, 为供应链运营后台提供入口, 为供应链运营后台提供入口, 为供应链运营后台提供入口, 为供应链运营后台提供入口',
//     link: `${process.env.VUE_APP_OMP}`
// }, {
//     name: '商户管理平台',
//     desc: '为商户管理平台提供入口, 为商户管理平台提供入口, 为商户管理平台提供入口, 为商户管理平台提供入口, 为商户管理平台提供入口, 为商户管理平台提供入口',
//     link: `${process.env.VUE_APP_BP}`
// }

const logout = () => {
    ElMessageBox.confirm('确定要退出登录吗?')
        .then(() => {
            store.dispatch('logoutFn')
        })
}

</script>

<style lang="scss" scoped>
.acpable-app-page{
    min-height: 100vh;
    background-color: #f5f6fa;
    .website-nav{
        background-color: #2a2c42;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left-box{
            display: flex;
            align-items: center;
            .logo{
                width: auto;
                height: 50px;
            }
            .title{
                color: #fff;
                margin-left: 24px;
                font-size: 18px;
            }
        }
        .avatar-dropdown {
            display: flex;
            align-items: center;
            cursor: pointer;
            .el-avatar {
                margin-left: 15px;
            }
            .user-name {
                margin-left: 6px;
                display: flex;
                align-content: center;
                align-items: center;
                color: #fff;
            }
        }
    }
    .tab-box{
        width: 980px;
        margin: 12px auto 0;
        :deep(.el-tabs__header){
            margin-bottom: 24px;
        }
        :deep(.el-tabs__item){
            font-size: 16px;
        }
        :deep(.el-tabs__item.is-active){
            color: #7f7f7f;
        }
        :deep(.el-tabs__item:hover){
            color: #7f7f7f;
        }
        :deep(.el-tabs__active-bar){
            background-color: transparent;
        }
        .card-box{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            .app-card:hover{
                .app-content{
                    .name{
                        text-decoration: underline;
                    }
                }
            }
            .app-card{
                width: 430px;
                display: flex;
                position: relative;
                border-radius: 8px;
                background: #fff;
                box-shadow: 0 4px 16px rgb(22 24 35 / 8%);
                border: initial;
                padding: 24px;
                margin-bottom: 24px;
                cursor: pointer;
                .app-logo{
                    margin-right: 20px;
                    .icon{
                        font-size: 80px;
                    }
                }
                .app-content{
                    .name{
                        font-size: 24px;
                        color: #2a2c42;
                    }
                    .desc{
                        color: #555;
                        line-height: 20px;
                        font-size: 14px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        display: -moz-box;
                        -webkit-line-clamp: 3;
                        -moz-line-clamp: 3;
                        -webkit-box-orient: vertical;
                        margin-top: 12px;
                    }
                }
            }
        }
    }
}
</style>
