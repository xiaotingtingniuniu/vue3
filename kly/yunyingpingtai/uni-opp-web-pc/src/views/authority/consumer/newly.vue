<template>
    <el-card class="box-card consumer-newly-page">
        <el-form ref="formRef" :model="formData" label-position="right" label-width="140px" :rules="rules">
            <el-form-item label="是否为恒生活员工" prop="type">
                <el-radio-group v-model="formData.type" :disabled="props.type !== 'add'">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="员工账号" prop="account" style="width: 500px" class="flex-box">
                <div class="flex flex-wrap gap-2 my-2">
                    <el-input v-if="formData.account || formData.type===2" v-model="formData.account" style="width: 290px;margin-right: 10px;" :disabled="(formData.type===1&&formData.account || props.type==='detail') ? true : false" placeholder="员工账号"/>
                    <el-button @click="accountVisible=true" v-if="formData.type === 1&&props.type==='add'" type="primary" size="small">选择</el-button>
                    <el-button @click="updateEhrFn" v-if="formData.type === 1&&props.type==='edit'" type="primary" size="small">更新</el-button>
                </div>
            </el-form-item>
            <el-form-item label="姓名" prop="name" style="width: 400px" >
                <el-input v-model="formData.name" :disabled="formData.type===1||props.type==='detail'" placeholder="员工姓名" maxlength="10"/>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile" style="width: 400px">
                <el-input v-model="formData.mobile" :disabled="formData.type===1||props.type==='detail'" maxlength="11" placeholder="员工手机号" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email" style="width: 400px">
                <el-input v-model="formData.email" :disabled="formData.type===1||props.type==='detail'" placeholder="员工邮箱" />
            </el-form-item>
            <el-form-item label="分配角色" prop="roles" style="width: 400px">
                <el-button v-if="props.type==='edit'" @click="roleDialogFn()" type="primary" size="small">选择</el-button>
                <el-button v-if="props.type==='add'" @click="getUserAddOrganization()" type="primary" size="small">选择</el-button>
                <div v-if="props.type!=='add'" class="flex flex-wrap gap-2 my-2">
                    <el-tag class="mx-1" v-for="tag in roleArr" :key="tag" :disable-transitions="false">{{ tag.organizationName || tag.orgName }}-{{ tag.name || tag.roleName }}</el-tag>
                </div>
                <div v-else class="flex flex-wrap gap-2 my-2">
                    <el-tag class="mx-1" v-for="tag in selectionTags" :key="tag" :disable-transitions="false">{{ tag.orgName }}-{{ tag.name }}</el-tag>
                </div>
            </el-form-item>
            <!-- <el-form-item label="所属组织" prop="organizationIds" style="width: 400px">
                <div class="flex flex-wrap gap-2 my-2">
                    <el-tag class="mx-1" v-for="tag in organizationArr" :key="tag" :disable-transitions="false">{{ tag.name }}</el-tag>
                </div>
                <el-button v-if="!organizationArr.length&&props.type==='add'" @click="organizationCheckFn(false) " type="primary" size="small">选择</el-button>
                <el-button v-else-if="props.type==='add'" @click="organizationCheckFn(true)" type="primary" size="small">重新选择</el-button>
            </el-form-item>
            <el-form-item label="分配角色" prop="roles" style="width: 400px">
                <div class="flex flex-wrap gap-2 my-2">
                    <el-tag class="mx-1" v-for="tag in roleArr" :key="tag" :disable-transitions="false">{{ tag.name }}</el-tag>
                </div>
                <el-button v-if="props.type!=='detail'" @click="roleDialogFn()" type="primary" size="small">选择</el-button>
            </el-form-item> -->

            <el-form-item label="状态" prop="state">
                <el-radio-group v-model="formData.state" :disabled="props.type === 'detail'">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">停用</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="operation" v-if="props.type !== 'detail'">
            <el-button @click="save()" type="primary">保存</el-button>
            <el-button @click="$router.back()">取消</el-button>
        </div>
    </el-card>
    <input id="input" :value="`商户账号: ${user.account}; 初始密码: ${user.pwd}`" style="opacity:0;position:absolute" />
    <choise-account v-if="accountVisible" @selectionData="accountDataFn" @close="accountVisible=false" />
    <choise-organization v-if="organizationVisible" v-model:selectionData="organizationArr" @close="organizationVisible=false" />
    <!--<choise-role v-if="roleVisible1" v-model:organizationArr="organizationArr" v-model:selectionData="roleArr" @close="roleVisible1=false" />-->
    <choise-role1 v-if="roleVisible" v-model:organizationArr="organizationArr" v-model:selectionData="roleArr" @close="roleVisible=false" ></choise-role1>
    <el-dialog v-model="userOrganizationDialog" title="选择角色">
        <el-form ref="formRef" :model="searchData" :inline="true" label-width="100px" label-position="right">
            <div class="search-input">
                <el-form-item label="组织名称" prop="orgName">
                    <el-input v-model="searchData.orgName" clearable placeholder="请输入～" />
                </el-form-item>
                <el-form-item label="角色" prop="roleName">
                    <el-input v-model="searchData.roleName" clearable placeholder="请输入～" />
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="getUserAddOrganization(true)">
                        查询
                    </el-button>
                </el-form-item>
            </div>
            <system-list
                :tHead="userAddThead"
                :tableData="userOrganization"
                :border="true"
                :height="170"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #operation="scope">
                    <el-button v-if="selectionTags.find(item => (item.roleId === scope.row.roleId)) && selectionTags.find(item => (item.orgId === scope.row.orgId))" type="primary" link>已添加</el-button>
                    <el-button v-else @click="userAdd(scope.row)" type="primary" link>添加</el-button>
                </template>
            </system-list>
        </el-form>
        <div class="border">
            <el-tag v-for="tag in selectionTags" :key="tag" class="mx-1" closable :disable-transitions="false" @close="tagClose(tag)" style="margin: 12px 12px 0 0;">{{ tag.orgName }}/{{ tag.roleName }}</el-tag>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="confirmOrganization">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import choiseRole from './components/choiseRole.vue'
import choiseRole1 from './components/choiseRoleC.vue'
import choiseAccount from './components/choiseAccount.vue'
import choiseOrganization from './components/choiseOrganization.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { managerCreate, managerDetail, ehrManagerList, managerModify, userAddOrganization } from '@/api/authority'
import { useRouter } from 'vue-router'

const props = defineProps(['id', 'type'])
const oldData = ref(null)
onMounted(async () => {
    if (props.type !== 'add') {
        await managerDetailFn()
        oldData.value = {
            account: formData.value.account,
            name: formData.value.name,
            email: formData.value.email,
            mobile: formData.value.mobile,
            state: formData.value.state,
            roles: roleArr.value.map(item => item.id).join(',')
        }
    }
})

const formRef = ref()

const save = () => {
    if (!formRef.value) return
    formRef.value.validate((valid) => {
        if (valid) {
            if (props.type === 'add') return managerCreateFn()
            if (props.type === 'edit') {
                managerModifyFn()
            }
        }
    })
}

const formData = ref({
    type: 1,
    account: '',
    name: '',
    mobile: '',
    organizationIds: '',
    roles: '',
    state: 1
})

const user = ref({
    account: '',
    pwd: ''
})

// 是否有内容修改
const checkFormData = (newData, oldData) => {
    const flag = ref(false) // 默认无修改
    for (const key in newData) {
        if (Object.hasOwnProperty.call(newData, key)) {
            if (newData[key] !== oldData[key]) {
                flag.value = true
                break
            }
        }
    }
    return flag.value
}

/* 手机号校验 */
const isMobile = (rule, value, callback) => {
    const regMobile = /^1[3-9]\d{9}$/
    if (value === '' || value === undefined || value === null) {
        callback()
    }
    if (!regMobile.test(value)) {
        callback(new Error('请输入正确的手机号'))
    } else {
        callback()
    }
}

/* 账号名校验 */
const consumerValidator = (rule, value, callback) => {
    var reg = /^[\w\s]{5,15}$/
    if (value === '' || value === undefined || value === null) {
        callback()
    }
    if (!reg.test(value)) {
        callback(new Error('请输入5-15位数字字母组合'))
    } else {
        callback()
    }
}
/* 邮箱验证 */
const checkEmail = (rule, value, callback) => {
    const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (regEmail.test(value)) {
        return callback()
    }
    callback(new Error('请输入合法的邮箱'))
}
// 表单项规则
const rules = reactive({
    account: [{ required: true, validator: consumerValidator, trigger: 'blur' }],
    name: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 20, message: '最长不超过20个字符长度', trigger: 'blur' }
    ],
    mobile: [{ required: true, validator: isMobile, trigger: 'blur' }
    ]
    // email: [{ required: true, validator: checkEmail, trigger: 'blur' }]
})
const updateEhrFn = async () => {
    const { list } = await ehrManagerList({
        appKey: 'A1001000',
        busiCode: 'A1001000',
        emplid: formData.value.account
    })
    if (list.length) {
        const tempObj = {
            name: list[0].name,
            mobile: list[0].mobile,
            state: list[0].hrStatus === 'I' ? 0 : formData.value.state
        }
        if (checkFormData(tempObj, oldData.value)) {
            Object.assign(formData.value, tempObj)
            await managerModifyFn(false)
            ElMessage({
                showClose: true,
                message: '更新完成',
                type: 'success'
            })
            Object.assign(oldData.value, tempObj)
        } else {
            ElMessage({
                showClose: true,
                message: '已经是最新数据了',
                type: 'success'
            })
        }
    }
}
// 权限优化开始
const searchData = ref({
    orgName: '',
    roleName: ''
})
const pageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})
const userAddThead = [
    { align: 'center', prop: 'orgName', label: '组织名称', width: 180 },
    { align: 'center', prop: 'roleName', label: '角色名称', width: 180 },
    { align: 'center', prop: 'operation', label: '操作', width: 180, slot: true }
]
const userOrganization = ref([])
const selectionTags = ref([])
const userOrganizationDialog = ref(false)
const getUserAddOrganization = async (val) => {
    userOrganizationDialog.value = true
    if (val)(pageInfo.value.currentPage = 1)
    const param = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        curPage: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize,
        name: searchData.value.orgName,
        roleName: searchData.value.roleName
    }
    const res = await userAddOrganization(param)
    if (res.code === '200') {
        userOrganization.value = res.data.list
        pageInfo.value.total = res.data.totalCount
    }
}
const tagClose = (tag) => {
    selectionTags.value.splice(selectionTags.value.indexOf(tag), 1)
}
const userAdd = (val) => {
    selectionTags.value.push(val)
}
const handleClose = () => {
    userOrganizationDialog.value = false
    userOrganization.value = []
    selectionTags.value = []
    pageInfo.value = ({
        total: 0,
        currentPage: 1,
        pageSize: 10
    })
}
const confirmOrganization = () => {
    userOrganizationDialog.value = false
    roleArr.value = selectionTags.value ? selectionTags.value : []
}
const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    getUserAddOrganization()
}
// 下一页上一页触发
const currentChange = (val) => {
    pageInfo.value.currentPage = val
    getUserAddOrganization()
}
const managerModifyFn = async (isTip = true) => {
    const params = Object.assign({
        appKey: 'A1001000',
        busiCode: 'A1001000',
        ...formData.value,
        id: props.id
    }, {
        organizationIds: null,
        roles: roleArr.value.map(item => item.id || item.roleId).join(',')
    })
    // 是否有内容修改
    const flag = ref(false) // 默认无修改
    for (const key in oldData.value) {
        if (Object.hasOwnProperty.call(oldData.value, key)) {
            if (oldData.value[key] !== params[key]) {
                flag.value = true
            }
        }
    }
    if (flag.value) {
        const { code } = await managerModify(params)
        if (code !== '200' || !isTip) return false
        successTip()
    } else {
        ElMessage({
            showClose: true,
            message: '本次操作未做修改，无需提交',
            type: 'warning'
        })
    }
}

// 选择弹窗
const accountVisible = ref(false)
const roleVisible = ref(false)
// const roleVisible1 = ref(false)
const organizationVisible = ref(false)

const roleDialogFn = () => {
    roleVisible.value = true
    // if (organizationArr.value.length) {
    //     roleVisible.value = true
    // } else {
    //     ElMessage({
    //         showClose: true,
    //         message: '请先选择组织',
    //         type: 'warning'
    //     })
    // }
}

// 临时使用随机手机号生成
const randomNumber = (n) => {
    let rn = ''
    for (let i = 0; i < n; i++) {
        rn += Math.floor(Math.random() * 10)
    }
    return rn
}

// 选中的员工
const accountDataFn = (val) => {
    formData.value.account = val.emplid
    formData.value.name = val.name
    formData.value.mobile = val.mobile
    formData.value.email = val.email
}
// 选中的组织
const organizationArr = ref([])
// 选中的角色
const roleArr = ref([])
const organizationCheckFn = (reset = false) => {
    if (reset) {
        ElMessageBox.confirm('重新选择组织已选中组织和角色会被重置',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }
        ).then(() => {
            organizationArr.value = []
            roleArr.value = []
            organizationVisible.value = true
        }).catch(() => {})
    } else {
        organizationArr.value = []
        organizationVisible.value = true
    }
}

const managerDetailFn = async () => {
    const res = await managerDetail({
        appKey: 'A1001000',
        busiCode: 'A1001000',
        id: props.id
    })
    Object.assign(formData.value, res)
    roleArr.value = res.roles.map(item => {
        return {
            id: item.roleId,
            organizationName: item.organizationName,
            name: item.roleName
        }
    })
    // organizationArr.value = res.organizations.map(item => {
    //     return {
    //         id: item.organizationId,
    //         name: item.organizationName
    //     }
    // })
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

const managerCreateFn = async () => {
    const { code, data } = await managerCreate(Object.assign({
        appKey: 'A1001000',
        busiCode: 'A1001000',
        ...formData.value
    }, {
        organizationIds: selectionTags.value.map(item => item.orgId).join(','),
        roles: selectionTags.value.map(item => item.roleId).join(',')
    }))
    if (code !== '200') return false
    if (formData.value.type === 1) {
        ElMessageBox.confirm('',
            {
                message: '内部员工权限已开通, 请让用户使用EHR账号密码登录',
                confirmButtonText: '好的',
                showCancelButton: false,
                center: true,
                draggable: true
            }).then(() => {
            router.push({ name: 'authority-consumer' })
        }).catch(() => {
            router.push({ name: 'authority-consumer' })
        })
    } else {
        user.value.account = data.account
        user.value.pwd = data.password
        ElMessageBox.confirm('',
            {
                title: '商户权限已开通',
                message: `<p>商户账号: ${data.account}</p><p>初始密码: ${data.password}</p>`,
                confirmButtonText: '复制账号密码',
                showCancelButton: false,
                center: true,
                draggable: true,
                dangerouslyUseHTMLString: true
            }).then(() => {
            copyText()
            router.push({ name: 'authority-consumer' })
        }).catch(() => {
            router.push({ name: 'authority-consumer' })
        })
    }
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
        router.push({ name: 'authority-consumer' })
    }, 2000)
}

</script>
<style lang="scss" scoped>
.consumer-newly-page{
    .flex-wrap {
        flex-wrap: wrap;
    }
    .operation{
        margin-top: 50px;
    }
    :deep(.el-tag){
        max-width: 150px;
        margin-right: 6px;
    }
    :deep(.el-tag__content){
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        justify-content: flex-start;
    }
}
.el-dialog{
    height:58vh;
    overflow:auto;
}
</style>
