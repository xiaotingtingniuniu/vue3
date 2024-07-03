<template>
    <el-card class="box-card">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="120px" @submit.prevent>
            <el-form-item v-if="props.id" label="角色ID" style="width: 600px">
                {{ props.id }}
            </el-form-item>
            <el-form-item label="角色模版名称" prop="name" style="width: 600px">
                <el-input v-model="form.name" :disabled="props.type === 'detail'" placeholder="请输入角色名称不超过20字" maxlength="20"/>
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
    </el-card>
</template>
<script setup>
import { onMounted, reactive, toRefs, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import { organizationList, resourceDetail, roleCreate, roleTemplateDetail, roleModify, roleTemplateCreate, roleTemplateModify } from '@/api/authority'
import { ElMessage } from 'element-plus'

const router = useRouter()

const props = defineProps(['id', 'type'])

const treeRef = ref()
const formRef = ref()
const tableRef = ref()

onMounted(() => {
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

const { selectionTags, organizationData, treeData, confirmSelectData } = toRefs(dataState)

const form = reactive({
    name: '', // 角色名称
    detail: '', // 角色说明
    state: '1', // 状态
    organizationName: ''
})

const rules = reactive({
    name: [
        { required: true, message: '请输入角色名称不超过20字', trigger: 'blur' }
    ],
    detail: [
        { required: true, message: '请输入角色说明不超过100字', trigger: 'blur' }
    ]
})

// 获取角色模版详情
const getRoleDetail = async () => {
    const param = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        id: props.id
    }
    const res = await roleTemplateDetail(param)
    if (res.code === '200') {
        form.name = res.data.name
        form.state = res.data.state.toString()
        let arr = []
        for (let i = 0; i < res.data.resourcesList.selected.length; i++) {
            const element = res.data.resourcesList.selected[i]
            arr = [...arr, ...element.resourceIds]
        }
        nextTick(() => {
            oldData.value.resources = arr.join()
            // 不是叶子节点需要在这维护一下resourceId渲染的时候根据叶子节点自动向上选中
            const notLeafNode = [1, 10, 11, 15, 18, 21, 25, 70, 71, 79, 82, 83, 90, 110, 101, 502, 503, 547, 548, 549, 550, 551, 552, 553, 554, 557, 558, 581, 583, 591, 593, 207, 209]
            const temp = arr.filter(item => !notLeafNode.includes(item))
            treeRef.value.setCheckedKeys(temp)
        })
        dataState.confirmSelectData = [{ name: res.data.organizationName, id: '' }]
    }
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
}

// 18,19,20,21,22,23,24,25,26,27,28
// 新增
const onSubmit = async (formEl) => {
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
                resources: ids.join(),
                state: form.state
            }
            const res = await roleTemplateCreate(params)
            if (res.code === '200') {
                ElMessage.success(res.message)
                const timer = setTimeout(() => {
                    clearTimeout(timer)
                    router.push({ name: 'authority-role-template' })
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
                resources: ids.join(),
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
                const res = await roleTemplateModify(params)
                if (res.code === '200') {
                    ElMessage.success(res.message)
                    const timer = setTimeout(() => {
                        clearTimeout(timer)
                        router.push({ name: 'authority-role-template' })
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
<style lang="scss"></style>
