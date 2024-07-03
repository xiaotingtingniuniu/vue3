
<template>
    <div>
        <el-dialog
            v-model="$props.modelValue"
            :title="title"
            width="900px"
            height="1000px"
            @close="close"
            draggable
        >
            <div v-if="ruleForm.ruleType === 3 || ruleForm.ruleType === 4">
                <template v-for="(item, index) in ruleForm.cabinetUserList" :key="index">
                    <div class="del-city-user">
                        <div class="user-title">运营人员{{index + 1}}</div>
                        <el-button text type="primary" @click="delUserCity(item)">删除</el-button>
                    </div>
                    <el-form label-width="140px" class="demo-ruleForm">
                        <el-form-item label="所选城市：" prop="organizationName">
                            <el-input v-model="item.organizationName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="运营人员类型：" prop="groupStatus">
                            <el-select v-model="item.cabinetUserType" clearable placeholder="请选择" >
                                <el-option label="运维经理" :value='3' />
                                <el-option label="运营经理" :value='4' />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择运营人员：">
                            <template #default>
                                <el-button text @click="selUserCity(item)" type="primary">选择</el-button>
                            </template>
                        </el-form-item>
                        <el-form-item label="" prop="selOwner" v-if="item.isSelEhr">
                            <el-form ref="formRef" :model="formData" :inline="true" label-position="right" label-width="80px">
                                <el-form-item label="姓名" prop="name" style="width: 200px">
                                    <el-input v-model.trim="formData.name" placeholder="员工姓名" />
                                </el-form-item>
                                <el-form-item label="员工账号" prop="emplid" style="width: 200px">
                                    <el-input v-model.trim="formData.emplid" placeholder="员工账号" />
                                </el-form-item>
                                <el-form-item label="手机号" prop="mobile" style="width: 200px">
                                    <el-input v-model.trim="formData.mobile" placeholder="员工手机号" />
                                </el-form-item>
                                <el-form-item class="button-box">
                                    <el-button @click="selectOwner(true)" type="primary">搜索</el-button>
                                </el-form-item>
                            </el-form>
                            <div class="sel-box">
                                <el-table :data="ownerTabData" style="width: 100%">
                                    <el-table-column prop="name" label="姓名"  />
                                    <el-table-column prop="emplid" label="员工号" />
                                    <el-table-column prop="mobile" label="手机号"  />
                                    <el-table-column prop="email" label="邮箱" />
                                    <el-table-column label="操作" align="center">
                                        <template v-slot="scope">
                                            <el-button v-if="scope.row.isSel === 0" text type="primary" @click="selOwnerCity(scope.row)"> 选择 </el-button>
                                            <el-button v-if="scope.row.isSel === 1" text type="primary" @click="cancelOwnerCity(scope.row)"> 取消 </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div class="bottom">
                                    <div class="demo-pagination-block" style="margin:0 auto">
                                        <el-pagination
                                            v-model:currentPage="dataState.pageinfo.currentPage"
                                            v-model:page-size="dataState.pageinfo.pageSize"
                                            :page-sizes="[10, 20, 30, 40]"
                                            layout="total, sizes, prev, pager, next, jumper"
                                            :total="dataState.pageinfo.total"
                                            @size-change="sizeChange"
                                            @current-change="currentChange"
                                        />
                                    </div>
                                    <el-button @click="noAddOwnerCity(item)">取消</el-button>
                                    <el-button type="primary" @click="addOwnerCity(item)">确定</el-button>
                                </div>
                            </div>
                        </el-form-item>
                        <div v-if="!item.isSelEhr">
                            <el-form-item label="姓名：" prop="userName">
                                <el-input v-model="item.userName" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="工号：" prop="account">
                                <el-input v-model="item.account" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱：" prop="email">
                                <el-input v-model="item.email" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="联系方式：" prop="mobile">
                                <el-input v-model="item.mobile" disabled></el-input>
                            </el-form-item>
                        </div>
                    </el-form>
                    <div class='br-bottom'></div>
                </template>
                <div class="add-city-user">
                    <el-button text type="primary" @click="addUserCity">+添加人员</el-button>
                </div>
            </div>
            <div v-if="ruleForm.ruleType === 1 || ruleForm.ruleType === 2">
                <el-form ref="operFormRef" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="所选城市：" prop="organizationName">
                        <el-input v-model="ruleForm.organizationName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="选择城市经理：">
                        <template #default>
                            <el-button text v-if="isShowEditBtn" @click="selUser" type="primary">选择</el-button>
                            <el-button text v-else type="primary" @click="delUser">删除</el-button>
                        </template>
                    </el-form-item>
                    <el-form-item label="" prop="selOwner" v-if="isSelEhr">
                        <el-form ref="formRef" :model="formData" :inline="true" label-position="right" label-width="80px">
                            <el-form-item label="姓名" prop="name" style="width: 200px">
                                <el-input v-model.trim="formData.name" placeholder="员工姓名" />
                            </el-form-item>
                            <el-form-item label="员工账号" prop="emplid" style="width: 200px">
                                <el-input v-model.trim="formData.emplid" placeholder="员工账号" />
                            </el-form-item>
                            <el-form-item label="手机号" prop="mobile" style="width: 200px">
                                <el-input v-model.trim="formData.mobile" placeholder="员工手机号" />
                            </el-form-item>
                            <el-form-item class="button-box">
                                <el-button @click="selectOwner(true)" type="primary">搜索</el-button>
                            </el-form-item>
                        </el-form>
                        <div class="sel-box">
                            <el-table :data="ownerTabData" style="width: 100%">
                                <el-table-column prop="name" label="姓名"  />
                                <el-table-column prop="emplid" label="员工号" />
                                <el-table-column prop="mobile" label="手机号"  />
                                <el-table-column prop="email" label="邮箱" />
                                <el-table-column label="操作" align="center">
                                    <template v-slot="scope">
                                        <el-button v-if="scope.row.isSel === 0" text type="primary" @click="selOwner(scope.row)"> 选择 </el-button>
                                        <el-button v-if="scope.row.isSel === 1" text type="primary" @click="cancelOwner(scope.row)"> 取消 </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="bottom">
                                <div class="demo-pagination-block" style="margin:0 auto">
                                    <el-pagination
                                        v-model:currentPage="dataState.pageinfo.currentPage"
                                        v-model:page-size="dataState.pageinfo.pageSize"
                                        :page-sizes="[10, 20, 30, 40]"
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="dataState.pageinfo.total"
                                        @size-change="sizeChange"
                                        @current-change="currentChange"
                                    />
                                </div>
                                <el-button @click="noAddOwner">取消</el-button>
                                <el-button type="primary" @click="addOwner">确定</el-button>
                            </div>
                        </div>
                    </el-form-item>
                    <div v-if="!isSelEhr">
                        <el-form-item label="姓名：" prop="userName">
                            <el-input v-model="ruleForm.userName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="工号：" prop="account">
                            <el-input v-model="ruleForm.account" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱：" prop="email">
                            <el-input v-model="ruleForm.email" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式：" prop="mobile">
                            <el-input v-model="ruleForm.mobile" disabled></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <div class="sku-btns">
                <el-button @click="cancelRule">取消</el-button>
                <el-button type="primary" v-if="isAdd" @click="submitAddRule">新增保存</el-button>
                <el-button type="primary" v-if="!isAdd" @click="submitEditRule">编辑保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, computed, defineProps, defineEmits, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cityQueryCategory } from '@/utils'
import { getEhrList, operationAdd, operationEdit, operationQueryById, operationDetele } from '@/api/platformOperation/index'

const props = defineProps({
    type: String,
    currentVal: {
        type: Object,
        default: () => {}
    },
    modelValue: {
        type: Boolean,
        default: false
    },
    row: {
        type: Object,
        default: () => {}
    },
    title: {
        type: String
    }
})
const dataState = reactive({
    ruleForm: {
        organizationName: '',
        userName: '',
        account: '',
        email: '',
        mobile: '',
        ruleType: '',
        cabinetUserList: []
    },
    // 账户类型
    ruleTypeStatus: [
        {
            value: 1,
            label: '城市'
        },
        {
            value: 2,
            label: '柜主'
        },
        {
            value: 3,
            label: '设备'
        }
    ],
    selCitysChecked: '', // 选择城市选中
    ownerTabData: [],
    ownerTabChecked: [],
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    },
    isSelEhr: false, // 是否显示EHR现在框
    isShowEditBtn: false, // 是否显示EHE“选择”按钮
    isAdd: false, // 是否为新增数据(使用大区和城市)
    cityDelUserList: []
})
const { ruleForm, ruleTypeStatus, ownerTabData, ownerTabChecked, isSelEhr, isShowEditBtn, isAdd } = toRefs(dataState)
// EHR搜索项
const formData = ref({
    name: null,
    emplid: null,
    mobile: null
})
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const emits = defineEmits(['update:modelValue', 'gitList'])
const operFormRef = ref()
// 关闭弹出框
const close = () => {
    emits('update:modelValue', false)
    emits('getList')
}
// 校验规则：支持输入整数数字，可输入范围0~100
const numValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        if (!Number.isInteger(value)) {
            callback(new Error('支持输入整数数字'))
        } else {
            if (value > 0 && value <= 100) {
                callback()
            } else {
                callback(new Error('请输入大于0且小于等于100的数字'))
            }
        }
    }
}
// 表单项规则
const rules = reactive({
    ruleTypeRule: [{ required: true, message: '适用对象不能为空', trigger: 'change' }],
    repRateMax: [{ required: true, validator: numValidator, trigger: 'change' }]
})
const initData = async () => {
    dataState.ruleForm = props.row
    if (props.row.account && (dataState.ruleForm.ruleType === 1 || dataState.ruleForm.ruleType === 2)) {
        dataState.isShowEditBtn = false
        dataState.isAdd = false
    } else if (dataState.ruleForm.ruleType === 3 || dataState.ruleForm.ruleType === 4) {
        dataState.isAdd = false
    } else {
        dataState.isShowEditBtn = true
        dataState.isAdd = true
    }
    if (dataState.ruleForm.ruleType === 1 || dataState.ruleForm.ruleType === 2) {
        dataState.ruleForm.cabinetUserList = []
        dataState.ruleForm.cabinetUserList[0] = {
            userId: dataState.ruleForm.userId,
            organizationId: dataState.ruleForm.organizationId,
            account: dataState.ruleForm.account,
            mobile: dataState.ruleForm.mobile,
            userName: dataState.ruleForm.userName,
            cabinetUserType: dataState.ruleForm.ruleType,
            email: dataState.ruleForm.email
        }
    } else if (dataState.ruleForm.ruleType === 3 || dataState.ruleForm.ruleType === 4) {
        dataState.deviceTabChecked = dataState.ruleForm
        operationDetail()
    }
}
onMounted(async () => {
    await initData()
})
// 选择EHR信息（大区和城市）
const selUser = async () => {
    dataState.isSelEhr = true
}
// 删除EHR信息（大区和城市）
const delUser = async () => {
    dataState.isSelEhr = true
    dataState.isShowEditBtn = true
    dataState.ruleForm.userName = ''
    dataState.ruleForm.account = ''
    dataState.ruleForm.email = ''
    dataState.ruleForm.mobile = ''
    dataState.ownerTabData = []
    formData.value.name = null
    formData.value.emplid = null
    formData.value.mobile = null
}
// 选择员工 （大区和城市）
const selOwner = async (row) => {
    dataState.ownerTabData.forEach((item) => {
        if (item.emplid === row.emplid) {
            item.isSel = 1
        } else {
            item.isSel = 0
        }
    })
    dataState.ownerTabChecked = []
    dataState.ownerTabChecked.push(row)
}
// 取消员工 （大区和城市）
const cancelOwner = async (row) => {
    dataState.ownerTabData.forEach((item, index) => {
        if (item.emplid === row.emplid) {
            item.isSel = 0
        }
    })
    dataState.ownerTabChecked.forEach((item, index) => {
        if (item.emplid === row.emplid) {
            dataState.ownerTabChecked.splice(index, 1)
        }
    })
}
// 取消添加提交员工 （大区和城市）
const noAddOwner = async () => {
    dataState.ownerTabChecked = []
    dataState.isSelEhr = false
}
// 添加提交员工 （大区和城市）
const addOwner = async (row) => {
    if (dataState.ownerTabChecked.length > 0) {
        dataState.ruleForm.cabinetUserList[0].userName = dataState.ownerTabChecked[0].name
        dataState.ruleForm.cabinetUserList[0].account = dataState.ownerTabChecked[0].emplid
        dataState.ruleForm.cabinetUserList[0].email = dataState.ownerTabChecked[0].email
        dataState.ruleForm.cabinetUserList[0].mobile = dataState.ownerTabChecked[0].mobile
        dataState.ruleForm.userName = dataState.ownerTabChecked[0].name
        dataState.ruleForm.account = dataState.ownerTabChecked[0].emplid
        dataState.ruleForm.email = dataState.ownerTabChecked[0].email
        dataState.ruleForm.mobile = dataState.ownerTabChecked[0].mobile
        dataState.isShowEditBtn = false
    }
    dataState.isSelEhr = false
}
// 获取城市运维人员（城市运营）
const operationDetail = async () => {
    const param = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        organizationId: dataState.ruleForm.organizationId,
        cabinetUserType: dataState.ruleForm.ruleType
    }
    const res = await operationQueryById(param)
    if (res.code === '200') {
        dataState.ruleForm.cabinetUserList = []
        res.data.forEach(item => {
            item.cabinetUserType = item.businessType
            item.isSelEhr = false
            dataState.ruleForm.cabinetUserList.push(item)
        })
    }
}
// 添加EHR信息list（城市运营）
const addUserCity = async () => {
    dataState.ruleForm.cabinetUserList.push({
        organizationName: dataState.ruleForm.organizationName,
        userId: '',
        organizationId: dataState.ruleForm.organizationId,
        account: '',
        mobile: '',
        userName: '',
        cabinetUserType: dataState.ruleForm.ruleType,
        email: '',
        isSelEhr: false
    })
}
// 选择EHR信息（城市运营）
const selUserCity = async (row) => {
    dataState.ruleForm.cabinetUserList.forEach((item) => {
        if (item === row) {
            item.isSelEhr = true
        } else {
            item.isSelEhr = false
        }
    })
    dataState.ownerTabData = []
    formData.value.name = null
    formData.value.emplid = null
    formData.value.mobile = null
}
// 删除EHR信息（城市运营）
const delUserCity = async (row) => {
    dataState.ruleForm.cabinetUserList.forEach((item, index) => {
        if (item.account === row.account && item.cabinetUserType === row.cabinetUserType) {
            dataState.ruleForm.cabinetUserList.splice(index, 1)
        }
    })
    if (row.userId) {
        dataState.cityDelUserList.push(row)
    }
    dataState.ownerTabData = []
    formData.value.name = null
    formData.value.emplid = null
    formData.value.mobile = null
}
// 删除EHR信息（城市运营）
const cityDelUserListFn = async (row) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        userId: row.userId,
        organizationId: row.organizationId,
        cabinetUserType: row.cabinetUserType
    }
    const res = await operationDetele(params)
    if (res.code === '200') {
        console.log('修改成功')
    }
}
// 数据提交前删除EHR（城市运营）
const submitCityDel = () => {
    dataState.cityDelUserList.forEach(item => {
        cityDelUserListFn(item)
    })
}
// 选择员工 （城市运营）
const selOwnerCity = async (row) => {
    dataState.ownerTabData.forEach((item) => {
        if (item.emplid === row.emplid) {
            item.isSel = 1
        } else {
            item.isSel = 0
        }
    })
    dataState.ownerTabChecked = []
    dataState.ownerTabChecked.push(row)
}
// 取消员工 （城市运营）
const cancelOwnerCity = async (row) => {
    dataState.ownerTabData.forEach((item, index) => {
        if (item.emplid === row.emplid) {
            item.isSel = 0
        }
    })
    dataState.ownerTabChecked.forEach((item, index) => {
        if (item.emplid === row.emplid) {
            dataState.ownerTabChecked.splice(index, 1)
        }
    })
}
// 取消添加提交员工 （城市运营）
const noAddOwnerCity = async (row) => {
    dataState.ruleForm.cabinetUserList.forEach((item) => {
        if (item === row) {
            item.isSelEhr = false
        }
    })
    dataState.ownerTabChecked = []
}
// 添加提交员工 （城市运营）
const addOwnerCity = async (row) => {
    dataState.ruleForm.cabinetUserList.forEach((item) => {
        if (item === row) {
            item.isSelEhr = false
            item.userName = dataState.ownerTabChecked[0].name
            item.account = dataState.ownerTabChecked[0].emplid
            item.email = dataState.ownerTabChecked[0].email
            item.mobile = dataState.ownerTabChecked[0].mobile
        }
    })
    dataState.ownerTabChecked = []
}
// 搜索员工
const selectOwner = async () => {
    dataState.isSelEhr = true
    const params = {
        ...formData.value,
        appKey: 'A1001000',
        busiCode: 'A1001000',
        curPage: dataState.pageinfo.currentPage,
        pageSize: dataState.pageinfo.pageSize
    }
    const res = await getEhrList(params)
    if (res.code === '200') {
        dataState.ownerTabData = []
        if (res.data.list) {
            res.data.list.map(item => {
                item.isSel = 0
                dataState.ownerTabData.push(item)
            })
        }
        dataState.pageinfo.total = res.data.totalCount
    } else {
        dataState.ownerTabData = []
    }
}
// 提交前检验
const submitBefore = async () => {
    dataState.ruleForm.cabinetUserList = []
    dataState.ownerTabChecked.forEach(item => {
        dataState.ruleForm.cabinetUserList.push({
            userId: item.userId,
            organizationId: item.organizationId,
            account: item.account,
            mobile: item.mobile,
            userName: item.userName,
            cabinetUserType: item.cabinetUserType,
            email: item.email
        })
    })
}
// 新增员工表单
const submitAddRule = async () => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        cabinetUserList: dataState.ruleForm.cabinetUserList
    }
    const res = await operationAdd(params)
    if (res.code === '200') {
        let name = '大区总'
        if (dataState.ruleForm.ruleType === 1) {
            name = '大区总'
        } else if (dataState.ruleForm.ruleType === 2) {
            name = '用户'
        }
        ElMessageBox.confirm(
            `${name}创建成功，请用户使用EHR账号密码登录`,
            '',
            {
                confirmButtonText: '确认',
                cancelButtonText: '',
                center: true,
                showCancelButton: false,
                showClose: false,
                closeOnClickModal: false
            }
        )
            .then(() => {
                emits('update:modelValue', false)
                emits('getList')
            })
    }
}
// 编辑员工表单
const submitEditRule = async () => {
    if ((dataState.ruleForm.ruleType === 1 || dataState.ruleForm.ruleType === 2) && dataState.ruleForm.account === '') {
        let name = '该大区将无大区总'
        if (dataState.ruleForm.ruleType === 1) {
            name = '该大区将无大区总'
        } else if (dataState.ruleForm.ruleType === 2) {
            name = '该城市将无城市经理'
        }
        ElMessageBox.confirm(
            `${name}，是否继续保存`,
            '',
            {
                confirmButtonText: '确认',
                cancelButtonText: '',
                center: true,
                showCancelButton: true,
                showClose: false,
                closeOnClickModal: false
            }
        )
            .then(async () => {
                const params = {
                    appKey: 'A1001000', // 系统编号
                    busiCode: 'A1001000', // 业务线编号
                    userId: dataState.ruleForm.cabinetUserList[0].userId,
                    organizationId: dataState.ruleForm.cabinetUserList[0].organizationId,
                    cabinetUserType: dataState.ruleForm.cabinetUserList[0].cabinetUserType
                }
                const res = await operationDetele(params)
                if (res.code === '200') {
                    ElMessage.success('修改成功')
                    emits('update:modelValue', false)
                    emits('getList')
                }
            })
    } else {
        let isSubmit = true
        dataState.ruleForm.cabinetUserList.forEach(item => {
            if (item.account === '' || item.userName === '' || item.mobile === '') {
                ElMessage.warning('运营人员信息不能为空,姓名、工号、手机号为必填项！')
                isSubmit = false
            }
        })
        if (dataState.ruleForm.ruleType === 3 || dataState.ruleForm.ruleType === 4 || dataState.cityDelUserList.length > 0) {
            submitCityDel()
        }
        if (isSubmit) {
            const params = {
                appKey: 'A1001000', // 系统编号
                busiCode: 'A1001000', // 业务线编号
                cabinetUserList: dataState.ruleForm.cabinetUserList
            }
            const res = await operationEdit(params)
            if (res.code === '200') {
                ElMessage.success('修改成功')
                emits('update:modelValue', false)
                emits('getList')
            }
        }
    }
}
// 取消
const cancelRule = async () => {
    emits('update:modelValue', false)
    emits('getList')
}
// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currentPage = val
    selectOwner()
}
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    selectOwner()
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
.avatar-uploader .el-upload{
    width: 200px;
    height: 200px;
}

.avatar-uploader{
    width: 300px;
    height: 300px;
}
.el-form-item{
    display: flex;
}
.sku-btns{
    margin: 0 auto;
    width: fit-content;
    margin-top: 20px;
}
.sel-box{
    width: 100%;
    border: 1px solid #dcdcdc;
    margin-top: 10px;
    border-radius: 4px;
}
.bottom{
    padding: 6px;
}
.tab-title{
    padding: 6px 10px;
    border-bottom: 1px solid #dcdcdc;
}
.br-bottom{
    height: 1px;
    width: 100%;
    margin: 30px 0px;
    background: #d2d2d2;
}
.add-city-user{
    width: 140px;
    text-align: right;
}
.del-city-user{
    width: 140px;
    text-align: right;
    margin-bottom: 10px;
}
.user-title{
    display: inline-block;
    font-size: 16px;
    font-weight: bold;
}
</style>
