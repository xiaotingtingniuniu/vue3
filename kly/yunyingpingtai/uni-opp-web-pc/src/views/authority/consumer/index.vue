<template>
    <el-card class="box-card">
        <div class="search-area">
            <el-form ref="formRef" :model="formData" :inline="true" label-position="right" label-width="80px">
                <el-form-item label="账号" prop="account" style="width: 272px">
                    <el-input v-model.trim="formData.account" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="姓名" prop="name" style="width: 272px">
                    <el-input v-model.trim="formData.name" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="手机号" prop="mobile" style="width: 272px">
                    <el-input v-model.trim="formData.mobile" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email" style="width: 272px">
                    <el-input v-model="formData.email" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="组织" prop="organizationName" style="width: 280px">
                    <!--<el-tree-select
                        v-model="formData.organizationIds"
                        :data="organizationLists"
                        multiple
                        :collapse-tags="true"
                        :props="{label: 'name', value: 'id'}"
                        :render-after-expand="false"
                        clearable
                    >
                    </el-tree-select>-->
                    <el-input v-model.trim="formData.organizationName" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="状态" prop="state" style="width: 272px">
                    <el-select v-model="formData.state" clearable placeholder="请选择用户状态" >
                        <el-option label="启用" value="1" />
                        <el-option label="停用" value="0" />
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item class="button-box">
                    <el-button v-if="checkRole('permission-16')" @click="managerListFn(true)" type="primary">搜索</el-button>
                    <el-button @click="resetForm" type="primary">重置</el-button>
                    <router-link v-if="checkRole('permission-17')" :to="{name: 'authority-consumer-newly', params: {type: 'add'}}" custom v-slot="{ navigate }">
                        <el-button @click="navigate" type="primary">新增</el-button>
                    </router-link>
                </el-form-item>
            </el-form>
        </div>
        <system-list
            :tHead="tHead"
            :tableData="tableData"
            v-model:current-page="pageInfo.currentPage"
            v-model:page-size="pageInfo.pageSize"
            :total="pageInfo.total"
            @size-change="sizeChange"
            @current-change="currentChange"
        >
            <template #type="scope">
                {{ scope.row.type === 1 ? '是' : '否' }}
            </template>
            <template #state="scope">
                {{ scope.row.state === 1 ? '启用' : '停用' }}
            </template>
            <template #operation="scope">
                <router-link v-if="checkRole('permission-23') && scope.row.superFlag !== 1" :to="{name: 'authority-consumer-newly', params: {type: 'detail', id: scope.row.id}}" custom v-slot="{ navigate }">
                    <el-button @click="navigate" type="primary" link>查看</el-button>
                </router-link>
                <router-link v-if="checkRole('permission-20') && scope.row.superFlag !== 1" :to="{name: 'authority-consumer-newly', params: {type: 'edit', id: scope.row.id}}" custom v-slot="{ navigate }">
                    <el-button @click="navigate" type="primary" link>编辑</el-button>
                </router-link>
                <el-button v-if="scope.row.type !== 1" @click="resetPwd(scope.row)" type="primary" link>重置密码</el-button>
            </template>
        </system-list>
        <input id="input" :value="`${resetPwdVal}`" style="opacity:0;height: 0;" />
    </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { managerList, resetPassWord } from '@/api/authority'
import { checkRole } from '@/utils'
import { organizationLists, getOrganizationTree } from '@/views/authority/role/index.js'
import { ElMessageBox, ElMessage } from 'element-plus'

getOrganizationTree()

onMounted(() => {
    managerListFn()
})

const formData = ref({
    account: null,
    name: null,
    mobile: null,
    type: null,
    state: null,
    email: null,
    organizationName: null
})
const pageInfo = ref({
    total: 1,
    currentPage: 1,
    pageSize: 10
})
const resetPwdVal = ref()
// const organizationLists = ref([])

const tableData = ref([])
const managerListFn = async (restPage = false) => {
    if (restPage) (pageInfo.value.currentPage = 1)
    const { totalCount, list } = await managerList({
        ...formData.value,
        // organizationIds: formData.value.organizationIds.join(),
        appKey: 'A1001000',
        busiCode: 'A1001000',
        curPage: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    })
    pageInfo.value.total = totalCount
    tableData.value = list
}

const tHead = [
    { align: 'center', tooltip: true, prop: 'account', label: '账号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'name', label: '用户名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'mobile', label: '手机号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'email', label: '邮箱', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'organizationName', label: '所属组织', minWidth: 160 },
    { align: 'center', tooltip: true, prop: 'latestLoginAt', label: '上次登录时间', minWidth: 160 },
    { align: 'center', tooltip: true, prop: 'createAt', label: '创建时间', minWidth: 160 },
    { align: 'center', tooltip: true, prop: 'createBy', label: '创建人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'modifyAt', label: '修改时间', minWidth: 160 },
    { align: 'center', tooltip: true, prop: 'modifyBy', label: '修改人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'state', label: '状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 200, fixed: 'right', slot: true }
]

const formRef = ref(null)
const resetForm = () => {
    if (!formRef.value) return
    formRef.value.resetFields()
}

const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    managerListFn()
}

const currentChange = (val) => {
    pageInfo.value.currentPage = val
    managerListFn()
}

// 重置密码
const resetPwd = async (val) => {
    console.log(val, 'val')
    const res = await resetPassWord({ managerId: val.id })
    if (res.code === '200') {
        ElMessage.success('密码重置成功！')
        resetPwdVal.value = res.data.pwd
        console.log(res, 'es')
        ElMessageBox.confirm('重置密码',
            {
                message: `账号已完成密码重置, 重置后密码为 ${res.data.pwd} 请用户尽快修改密码`,
                cancelButtonText: '退出',
                confirmButtonText: '复制密码'
            })
            .then(async () => {
                copyText()
            })
            .catch(() => {
            })
    }
}
const copyText = () => {
    const input = document.getElementById('input')
    input.select()
    document.execCommand('copy')
    ElMessage({
        showClose: true,
        message: '复制成功',
        type: 'success'
    })
}
</script>
<style lang="scss" scoped>

</style>
