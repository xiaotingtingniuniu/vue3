<template>
    <el-header class="website-nav">
        <div class="left-panel">
            <el-icon @click="collapseTrigger">
                <Fold v-if="!isCollapse" />
                <Expand v-else />
            </el-icon>
            <el-breadcrumb>
                <template v-for="(breadcrumbItem,index) in breadcrumbList" :key="breadcrumbItem.path">
                    <el-breadcrumb-item :to="breadcrumbItem.meta.cannotClick ? '' : { path: breadcrumbItem.path }">
                        <el-icon>
                            <component :is="breadcrumbItem.meta.icon" />
                        </el-icon>
                        <span v-if="index === breadcrumbList.length - 1" @click.stop>{{ $route.name===breadcrumbItem.name ? $route.meta.title : breadcrumbItem.meta.title }}</span>
                        <span v-else class="breadcrumb-item">{{ $route.name===breadcrumbItem.name ? $route.meta.title : breadcrumbItem.meta.title }}</span>
                    </el-breadcrumb-item>
                </template>
            </el-breadcrumb>
        </div>
        <div class="right-panel">
            <div class="selection-box">
                <el-row :gutter="20">
                    <el-col :span="12" v-if="isSelect">
                        <!-- <el-select v-model="organizationId" class="m-2" placeholder="请选择组织" @change="organizationChange">
                            <el-option
                                v-for="item in organizationList"
                                :key="item.organizationId"
                                :label="item.organizationName"
                                :value="item.organizationId"
                            />
                        </el-select> -->
                        <el-cascader :options="organizationTreeList" v-model="organizationId" class="m-2" :props="organizationProps" placeholder="请选择组织" @change="organizationChange1"/>
                    </el-col>
                    <el-col :span="12" v-if="isSelect">
                        <el-select v-model="roleId" class="m-2" placeholder="请选择角色" @change="roleChange">
                            <el-option
                                v-for="item in roleList"
                                :key="item.roleId"
                                :label="item.roleName"
                                :value="item.roleId"
                            />
                        </el-select>
                    </el-col>
                </el-row>
            </div>
            <div class="app-list">
                <div v-for="(item, index) in appList" :key="index" :title="item.title" @click="goApp(item.link)">
                    {{ item.name }}
                </div>
            </div>
            <el-dropdown>
                <span class="avatar-dropdown">
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
        </div>
    </el-header>
</template>
<script setup>
import { Expand, Fold, Setting, ArrowDown } from '@element-plus/icons-vue'
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import avatar from '@/assets/images/site-icon.png'
import { goApp } from '@/utils'
import { ElMessageBox } from 'element-plus'

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const organizationList = computed(() => store.state.organizationList)
const organizationTreeList = computed(() => store.state.organizationTreeList)

const roleList = computed(() => store.state.roleList)
const route = useRoute()
// const token = computed(() => store.state.token)
// {
//     name: '恒掌柜',
//     title: '恒掌柜运营平台',
//     link: `${process.env.VUE_APP_GUIZHU_ADMIN}?coreCode=${token.value}`
// }, {
//     name: '店柜协同',
//     title: '店柜协同运营平台',
//     link: `${process.env.VUE_APP_NL_SMP_WEB_PC}?coreCode=${token.value}`
// }
const organizationProps = {
    children: 'orgList',
    value: 'orgId',
    label: 'orgName',
    checkStrictly: true
}
// const organizationId = ref(null)
const organizationId = ref([])
const roleId = ref(null)

const appList = ref([])

const isSelect = computed(() => store.state.curOrganization)
watch(() => store.state.curOrganization,
    (val) => {
        organizationId.value = store.state.curOrganization
        roleId.value = store.state.curRole
    }
)

const logout = () => {
    ElMessageBox.confirm('确定要退出登录吗?')
        .then(() => {
            store.dispatch('logoutFn')
        })
}

// 菜单栏功能按钮
const isCollapse = computed(() => store.state.isCollapse)
const collapseTrigger = () => store.commit('collapseTrigger')

// 面包屑
const breadcrumbList = computed(() => {
    return route.matched.filter((item) => item.meta && item.meta.title)
})

const organizationChange = () => {
    store.commit('setCurOrganization', organizationId.value)
    store.state.organizationList.forEach(item => {
        if (item.organizationId === organizationId.value) {
            store.commit('setCurRole', item.roleList[0].roleId)
        }
    })
    store.dispatch('userResourceFn')
    roleId.value = ''
    window.location.reload()
}

const organizationChange1 = (val) => {
    roleId.value = findCurRole(organizationTreeList.value, val)
    store.commit('setCurRole', roleId.value)
    store.commit('setCurOrganization', val)
    window.location.reload()
}

const findCurRole = (arr, cur) => {
    let roleId = ''
    const len = cur.length
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].orgId === cur[0]) {
            if (len === 1) return arr[i].roleList && arr[i].roleList[0].roleId
            cur.shift()
            roleId = findCurRole(arr[i].orgList, cur)
        }
    }
    return roleId
}

const roleChange = () => {
    store.commit('setCurRole', roleId.value)
    store.dispatch('userResourceFn')
    window.location.reload()
}

</script>
<style lang="scss" scoped>
.website-nav {
    display: flex;
    justify-content: space-between;
    background-color: #f5f6fa;
    height: initial;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    .left-panel {
        height: 60px;
        display: flex;
        align-items: center;
        .el-icon {
            color: #515a6e;
            font-size: 16px;
            cursor: pointer;
        }
        .el-breadcrumb {
            margin-left: 20px;
            .el-icon {
                vertical-align: middle;
            }
            .breadcrumb-item {
                line-height: 16px;
                vertical-align: middle;
                margin-left: 3px;
            }
             .no-redirect{
                pointer-events:none;
                color:red
            }
        }

    }
    .right-panel {
        height: 60px;
        display: flex;
        align-items: center;
        .selection-box {
            margin-right: 30px;
            // width: 300px;
        }
        .app-list{
            display: flex;
            justify-content: flex-end;
            flex-wrap: nowrap;
            align-items: center;
            div{
                margin-right: 24px;
                font-size: 16px;
                font-weight: 500;
                color: #2a2c42;
                cursor: pointer;
            }
            div:hover{
                text-decoration: underline;
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
            }
        }
    }
}
</style>
