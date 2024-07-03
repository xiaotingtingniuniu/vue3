<template>
    <el-card class="box-card">
        <el-form ref="formRef" :model="formData" label-position="right" label-width="80px" @submit.prevent>
            <el-form-item label="组织名称" prop="name" style="width: 810px">
                <el-input v-model.trim="formData.name" maxlength="50" show-word-limit placeholder="请输入组织名称, 不超过50字。" />
            </el-form-item>
            <el-form-item label="组织类型" prop="type">
                <el-radio-group v-model="formData.type" :disabled="!!props.id">
                    <el-radio :label="1">内部</el-radio>
                    <el-radio :label="2">外部</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="状态" prop="state">
                <el-radio-group v-model="formData.state">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">停用</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="operation">
            <el-button @click="verification()" type="primary">保存</el-button>
            <el-button @click="$router.back()">取消</el-button>
        </div>
    </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { organizationCreate, organizationDetail, organizationModify } from '@/api/authority'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const props = defineProps(['id', 'type'])
const oldData = ref(null)
onMounted(async () => {
    if (props.id) {
        await organizationDetailFn()
        oldData.value = {
            name: formData.value.name,
            state: formData.value.state
        }
    }
})

const formData = ref({
    name: '',
    type: 1,
    state: 1
})

// 值校验
const verification = () => {
    var reg = new RegExp('^[A-Za-z0-9\u4e00-\u9fa5]+$')
    formData.value.name = formData.value.name.trim()
    if (!formData.value.name) {
        return ElMessage({
            showClose: true,
            message: '组织名称不能为空',
            type: 'warning'
        })
    }
    if (!reg.test(formData.value.name)) {
        return ElMessage({
            showClose: true,
            message: '组织名称输入不符合规范',
            type: 'warning'
        })
    }
    if (props.id) return organizationModifyFn()
    organizationCreateFn()
}
// 操作成功 提示并返回列表
const router = useRouter()
const successTip = () => {
    ElMessage({
        showClose: true,
        message: '保存成功',
        type: 'success'
    })
    const timer = setTimeout(() => {
        clearTimeout(timer)
        router.push({ name: 'authority-organization' })
    }, 2000)
}

// 创建
const organizationCreateFn = async () => {
    const { code } = await organizationCreate({
        ...formData.value,
        appKey: 'A1001000',
        busiCode: 'A1001000'
    })
    if (code !== '200') return false
    successTip()
}

// 修改
const organizationModifyFn = async () => {
    const params = {
        id: props.id,
        ...formData.value,
        appKey: 'A1001000',
        busiCode: 'A1001000'
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
        const { code } = await organizationModify(params)
        if (code !== '200') return false
        successTip()
    } else {
        ElMessage({
            showClose: true,
            message: '本次操作未做修改，无需提交',
            type: 'warning'
        })
    }
}

// 查询
const organizationDetailFn = async () => {
    const res = await organizationDetail({
        appKey: 'A1001000',
        busiCode: 'A1001000',
        id: props.id
    })
    formData.value.name = res.name
    formData.value.type = res.type
    formData.value.state = res.state
}

</script>
<style lang="scss">
.operation{
    margin-top: 50px;
}
</style>
