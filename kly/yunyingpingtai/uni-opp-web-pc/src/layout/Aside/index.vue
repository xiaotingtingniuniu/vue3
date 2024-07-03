<template>
    <el-aside width="initial" v-if="menu">
        <el-menu class="el-menu-vertical" :default-active="$route.meta.activeMenu" :collapse="isCollapse" :router="false" active-text-color="#fff" background-color="#2a2c42" text-color="#fff">
            <!-- 固定标题 -->
            <router-link v-slot="{ navigate }" :to="{name: 'home'}" custom>
                <div class="aside-title" @click="navigate">
                    <span><img :src="require('@/assets/images/hengchang.png')" alt=""></span>
                    <span class="title">{{ websiteName }}</span>
                </div>
            </router-link>
            <!-- 菜单 -->
            <template v-for="route in menu" :key="route.name">
                <!-- 双层菜单 -->
                <template v-if="route.asideVisible === true">
                    <el-sub-menu :index="route.path" v-if="route.meta&&checkRole(route.meta.anchors)">
                        <template #title>
                            <el-icon><component :is="route.meta.icon" /></el-icon>
                            <span>{{ route.meta.title }}</span>
                        </template>
                        <template v-for="routeChild in route.children" :key="routeChild.name">
                            <!-- 三层菜单 -->
                            <template v-if="routeChild.asideVisible === true && checkRole(routeChild.meta.anchors)">
                                <el-sub-menu :index="routeChild.path">
                                    <template #title>
                                        <el-icon><component :is="routeChild.meta.icon" /></el-icon>
                                        <span>{{ routeChild.meta.title }}</span>
                                    </template>
                                    <template v-for="routeCh in routeChild.children" :key="routeCh.name">
                                        <router-link v-if="checkRole(routeCh.meta.anchors)" v-slot="{ navigate }" :to="{name: routeCh.name}" custom>
                                            <el-menu-item :index="routeCh.path" @click="navigate" v-if="routeCh.meta">
                                                <el-icon>
                                                    <component :is="routeCh.meta.icon" />
                                                </el-icon>
                                                <span>{{ routeCh.meta.title }}</span>
                                            </el-menu-item>
                                        </router-link>
                                    </template>
                                </el-sub-menu>
                            </template>
                            <!-- 只有两层菜单 -->
                            <template v-else-if="routeChild.asideVisible === false">
                                <router-link v-if="checkRole(routeChild.meta.anchors)" v-slot="{ navigate }" :to="{name: routeChild.name}" custom>
                                    <el-menu-item v-if="routeChild.meta" :index="routeChild.path" @click="navigate">
                                        <el-icon>
                                            <component :is="routeChild.meta.icon" />
                                        </el-icon>
                                        <span>{{ routeChild.meta.title }}</span>
                                    </el-menu-item>
                                </router-link>
                            </template>
                        </template>
                    </el-sub-menu>
                </template>
                <!-- 单层菜单 -->
                <template v-else-if="route.asideVisible === false">
                    <router-link v-slot="{ navigate }" :to="{ name: route.name }" custom>
                        <el-menu-item :index="route.path" @click="navigate">
                            <el-icon>
                                <component :is="route.meta.icon" />
                            </el-icon>
                            <span>{{ route.meta.title }}</span>
                        </el-menu-item>
                    </router-link>
                </template>
            </template>
        </el-menu>
    </el-aside>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { checkRole } from '@/utils'

const store = useStore()
const websiteName = process.env.VUE_APP_WEBSITE
const isCollapse = computed(() => store.state.isCollapse)
const menu = computed(() => store.state.menuTree)

</script>
<style lang="scss" scoped>
.el-aside{
    width: var(--el-aside-width);
}
.el-menu-vertical:not(.el-menu--collapse) {
  width: 220px;
}
.el-menu{
    height: 100vh;
    overflow: auto;
    .aside-title{
        width: 100%;
        height: 60px;
        line-height: 60px;
        text-align: center;
        color: var(--el-color-white);
        background-color: #2a2c42;
        overflow: hidden;
        cursor: pointer;
        img{
            width: 32px;
            height: 32px;
            display: inline-block;
            vertical-align: middle;
        }
        .title{
            margin-left: 5px;
            overflow: hidden;
            font-size: 20px;
            line-height: 55px;
            color: #fff;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: middle;
            max-width: 206px;
        }
    }
    .el-menu-item:hover, .el-menu-item.is-active{
        color: var(--el-color-white) !important;
        background-color: #ffffff29 !important;
    }
}
</style>
