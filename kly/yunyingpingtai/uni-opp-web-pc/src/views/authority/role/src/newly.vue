<template>
    <el-card class="box-card">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="120px" @submit.prevent>
            <el-form-item v-if="props.id" label="角色ID" style="width: 600px">
                {{ props.id }}
            </el-form-item>
            <el-form-item label="角色名称" prop="name" style="width: 600px">
                <el-input v-model.trim="form.name" :disabled="props.type === 'detail'" placeholder="请输入角色名称不超过20字" maxlength="20"/>
            </el-form-item>
            <el-form-item label="角色说明" prop="detail" style="width: 600px">
                <el-input v-model.trim="form.detail" :disabled="props.type === 'detail'" type="textarea" placeholder="请输入角色说明不超过100字" maxlength="100"/>
            </el-form-item>
            <el-form-item label="所属组织" prop="detail">
                <!--<el-tree v-if="props.type!=='add'" :data="organizationLists" show-checkbox node-key="id" ref="organizationTreeRef" :props="{ label: 'name', id: 'id'}"/>-->
                <el-button v-if="props.type ==='add'" type="primary" @click="getOrganizationList()">去选择</el-button>
                {{ form.allPathOrgName }}
                <!--<el-tag v-for="tag in selectionTagsName" :key="tag" class="mx-1" :disable-transitions="false" style="margin: 12px 12px 0 5px;">{{ tag.name }}</el-tag>-->
            </el-form-item>
            <el-form-item label="功能权限">
                <el-tree :data="treeData" show-checkbox node-key="resourceId" ref="treeRef" :props="{ children: 'resources', label: 'resourceName', id: 'resourceId'}"/>
            </el-form-item>
            <el-form-item label="状态">
                <el-radio-group v-model="form.state" :disabled="props.type === 'detail'">
                    <el-radio label="1">启用</el-radio>
                    <el-radio label="0">停用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button v-if="props.type === 'add'" type="primary" @click="onSubmit(formRef)">确定</el-button>
                <el-button v-if="props.type === 'edit'" type="primary" @click="onEdit(formRef)">确定</el-button>
                <el-button v-if="props.type !== 'detail'" @click="$router.back()">取消</el-button>
            </el-form-item>
        </el-form>
        <el-dialog v-model="dataState.organizationVisible" title="选择组织" width="58%" :modal="false" draggable :before-close="handleClose">
            <el-form label-width="120px" @submit.prevent>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-form-item label="组织名称">
                            <el-input v-model.trim="form.organizationName" clearable=""/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4"> <el-button type="primary" @click="getOrganizationList">查询</el-button></el-col>
                </el-row>
            </el-form>
            <system-list
                ref="tableRef"
                :tHead="organizationTHead"
                :border="true"
                :height="170"
                :tableData="organizationData"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @selection-change="handleSelectionChange"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #operation="scope">
                    <el-button v-if="dataState?.selectionTags.find(item => (item.id === scope.row.id))" type="primary" link>已添加</el-button>
                    <el-button v-else @click="roleAdd(scope.row)" type="primary" link>添加</el-button>
                </template>
            </system-list>
            <div class="border">
                <el-tag v-for="tag in selectionTags" :key="tag" class="mx-1" closable :disable-transitions="false" @close="tagClose(tag)" style="margin: 12px 12px 0 0;">{{ tag.name }}</el-tag>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="confirmOrganization">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>
<script setup>
import { onMounted, reactive, toRefs, ref, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import { resourceDetail, roleDetail, roleModify, roleCreateApi, organizationTree, roleAddOrganization } from '@/api/authority'
import { ElMessage } from 'element-plus'
import { MessageBox } from '@element-plus/icons'

const router = useRouter()
const props = defineProps(['id', 'type'])

const treeRef = ref()
const organizationTreeRef = ref()
const formRef = ref()

onMounted(async () => {
    await getOrganizationTree(props.type)
    init()
})
const dataState = reactive({
    organizationVisible: false,
    organizationData: [],
    selectionTags: [],
    selectionData: [],
    confirmSelectData: [],
    treeData: []
})

const { treeData, organizationData, selectionTags } = toRefs(dataState)

const form = reactive({
    name: '', // 角色名称
    detail: '', // 角色说明
    state: '1', // 状态
    organizationName: '',
    allPathOrgName: ''
})

const organizationTHead = [
    { align: 'center', prop: 'name', label: '组织名称', width: 180 },
    { align: 'center', prop: 'operation', label: '操作', width: 180, slot: true }
]

const rules = reactive({
    name: [
        { required: true, message: '请输入角色名称不超过20字', trigger: 'blur' }
    ],
    detail: [
        { required: true, message: '请输入角色说明不超过100字', trigger: 'blur' }
    ]
})
const getOrganizationTree = async (type) => {
    const res = await organizationTree()
    if (res.code === '200') {
        organizationLists.value = res.data
        if (type !== 'add') {
            organizationLists.value = res.data
            setTimeout(() => {
                organizationLists.value = recursionDisable(organizationLists.value, 'children')
            }, 100)
        }
    }
}
const organizationLists = ref([])
// 获取角色详情
const getRoleDetail = async () => {
    const param = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        id: props.id
    }
    const res = await roleDetail(param)
    if (res.code === '200') {
        form.name = res.data.name
        form.detail = res.data.detail
        form.allPathOrgName = res.data.allPathOrgName
        form.state = res.data.state.toString()
        let arr = []
        for (let i = 0; i < res.data.resources.selected.length; i++) {
            const element = res.data.resources.selected[i]
            arr = [...arr, ...element.resourceIds]
        }
        const getOrganizationLists = organizationLists.value.find(item => (item.id === res.data.organizationId))
        let notLeafNodes = []
        if (getOrganizationLists && getOrganizationLists.children.length) {
            notLeafNodes = getOrganizationLists.children.map(item => (item.id))
            for (let i = 0; i < getOrganizationLists.children.length; i++) {
                const element = getOrganizationLists.children[i]
                notLeafNodes = [...notLeafNodes, ...element.children.map(item => (item.id))]
            }
        //  organizationTreeRef.value.setCheckedKeys(notLeafNodes)
        }
        // else {
        //    organizationTreeRef.value.setCheckedKeys([res.data.organizationId])
        // }
        nextTick(() => {
            oldData.value.resources = arr.join()
            // 不是叶子节点需要在这维护一下resourceId渲染的时候根据叶子节点自动向上选中
            const notLeafNode = [1, 10, 11, 15, 18, 21, 25, 70, 71, 79, 82, 83, 90, 110, 101, 502, 503, 547, 548, 549, 550, 551, 552, 553, 554, 557, 558, 581, 583, 591, 593, 607, 207, 209]
            const temp = arr.filter(item => !notLeafNode.includes(item))
            treeRef.value.setCheckedKeys(temp)
        })
        dataState.confirmSelectData = [{ name: res.data.organizationName, id: '' }]
    }
}
const pageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})
const getOrganizationList = async () => {
    dataState.organizationVisible = true
    const param = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        curPage: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize,
        name: form.organizationName
    }
    const res = await roleAddOrganization(param)
    if (res.code === '200') {
        dataState.organizationData = res.data.list
        pageInfo.value.total = res.data.totalCount
    }
}

const handleClose = () => {
    dataState.organizationVisible = false
    dataState.organizationData = []
    dataState.selectionTags = []
    pageInfo.value = ({
        total: 0,
        currentPage: 1,
        pageSize: 10
    })
}
const selectionTagsName = ref('')
const confirmOrganization = () => {
    dataState.organizationVisible = false
    selectionTagsName.value = dataState.selectionTags ? dataState.selectionTags : []
}
const roleAdd = (val) => {
    dataState.selectionTags.push(val)
}
const handleSelectionChange = () => {

}
const tagClose = (tag) => {
    dataState.selectionTags.splice(dataState.selectionTags.indexOf(tag), 1)
}

const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    getOrganizationList()
}
// 下一页上一页触发
const currentChange = (val) => {
    pageInfo.value.currentPage = val
    getOrganizationList()
}

// 递归 disabled
const recursionDisable = (arr, key) => {
    return arr.map(el => {
        const obj = {
            ...el,
            disabled: true
        }
        if (el[key] !== null && el[key].length) {
            obj[key] = recursionDisable(el[key], key)
        }
        return obj
    })
}
const oldData = ref(null)
// 初始化
const init = async () => {
    if (props.type !== 'add') await getRoleDetail()
    oldData.value = {
        name: form.name,
        detail: form.detail,
        state: form.state,
        resources: []
    }
    const res = await resourceDetail({
        appKey: 'A1001000',
        busiCode: 'A1001000'
    })
    dataState.treeData = res.data.list.map(el => {
        const obj = {
            ...el,
            resourceName: el.serverName,
            disabled: props.type === 'detail',
            level: 1
        }
        if (props.type === 'detail' && el.resources !== null) {
            obj.resources = recursionDisable(el.resources, 'resources')
        }
        return obj
    })
    console.log(dataState.treeData, 'treeData')
}

// 新增
const onSubmit = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const organizationIds = []
            //  organizationTreeRef.value.getCheckedNodes(false, true).forEach(el => {
            //     if (!el.children.length) {
            dataState.selectionTags.forEach(el => {
                if (!el.children) {
                    organizationIds.push(el.id)
                }
            })
            const ids = []
            treeRef.value.getCheckedNodes(false, true).forEach(el => {
                if (el.resourceId) {
                    ids.push(el.resourceId)
                }
            })
            if (!organizationIds.length) {
                ElMessage.warning('请选择所属组织！')
                return
            }
            if (!ids.length) {
                ElMessage.warning('请选择功能权限！')
                return
            }
            const params = {
                appKey: 'A1001000',
                busiCode: 'A1001000',
                name: form.name,
                detail: form.detail,
                organizationIds: organizationIds.join(), // 组织编号
                resources: ids.join(),
                state: form.state
            }
            console.log(123, organizationIds.join(), ids.join())
            const res = await roleCreateApi(params)
            if (res.code === '200') {
                ElMessage.success(res.message)
                const timer = setTimeout(() => {
                    clearTimeout(timer)
                    router.push({ name: 'authority-role' })
                }, 800)
            } else {
                ElMessage.error(res.message)
            }
        }
    })
}

// 编辑
const onEdit = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const ids = []
            treeRef.value.getCheckedNodes(false, true).forEach(el => {
                if (el.resourceId) {
                    ids.push(el.resourceId)
                }
            })
            if (!ids.length) {
                ElMessage.warning('请选择功能权限！')
                return
            }
            const params = {
                appKey: 'A1001000',
                busiCode: 'A1001000',
                name: form.name,
                id: props.id,
                detail: form.detail,
                resources: ids.sort((a, b) => a - b).join(),
                state: form.state
            }
            // 是否更新了
            const flag = ref(false) // 没更新
            for (const key in oldData.value) {
                if (Object.hasOwnProperty.call(oldData.value, key)) {
                    if (oldData.value[key] !== params[key]) {
                        flag.value = true
                    }
                }
            }
            if (flag.value) {
                const res = await roleModify(params)
                if (res.code === '200') {
                    ElMessage.success(res.message)
                    const timer = setTimeout(() => {
                        clearTimeout(timer)
                        router.push({ name: 'authority-role' })
                    }, 800)
                } else {
                    ElMessage.error(res.message)
                }
            } else {
                ElMessage({
                    showClose: true,
                    message: '本次操作未做修改，无需提交',
                    type: 'warning'
                })
            }
        }
    })
}

</script>
<style lang="scss" scoped>
.el-dialog{
    height:58vh;
    overflow:auto;
}
</style>
