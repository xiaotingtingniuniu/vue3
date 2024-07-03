<template>
    <el-button type="primary" @click="newLobFn">新增业务线</el-button>
    <template v-if="dataArr.length">
        <el-card v-for="(item, index) in dataArr" :key="index">
            <div class="card-box">
                <div class="card-title">
                    <div class="line-title col-1">业务线</div>
                    <div class="col-4 flex">
                        <div class="line-title col-1">商户角色</div>
                        <div class="line-title col-1">对应角色模板编码</div>
                        <div class="line-title col-1">账号角色</div>
                        <div class="line-title col-2">
                            <!-- 合作商 -->
                            <div >
                                <el-button @click="addRoleFn(index)" size="small" type="primary">新增商户角色</el-button>
                                <!-- <el-button @click="removeLobFn(index)" size="small" type="primary">删除当前业务线</el-button> -->
                                <el-button @click="submit(index)"  type="primary">保存</el-button>
                                <el-button @click="editSubmit(index)" type="primary">编辑</el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-content">
                    <div class="line-content col-1">
                        <!-- <el-input :disabled="item.edit" v-model="item.lob" placeholder="业务线"/> -->
                        <el-input v-model="item.lob" placeholder="业务线"  :disabled="item.noCan" />
                        <!-- oninput="value=value.replace(/[\W]/g,'')" -->
                    </div>
                    <div class="col-4">
                        <div class="line-content mb-20" v-for="(role, roleIndex) in item.roles" :key="roleIndex">
                            <div class="col-1">
                                <el-input v-model="role.roleName" :disabled="item.noCan" placeholder="商户角色"/>
                            </div>
                            <div class="col-1">
                                <el-input v-model="role.roleCode" :disabled="item.noCan" placeholder="编码"/>
                            </div>
                            <div class="col-1">
                                <el-select v-model="role.roleType" placeholder="" :disabled="item.noCan">
                                    <el-option label="主账号角色" :value="1" />
                                    <el-option label="子账号角色" :value="2" />
                                </el-select>
                            </div>
                            <div class="col-2 flex">
                                <!-- <el-select v-model="role.partner" :disabled="item.edit" :collapse-tags="true" :collapse-tags-tooltip="true" multiple placeholder="选择合作商" :multiple-limit="4" style="width: 100%; margin-right: 20px">
                                    <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value"/>
                                </el-select> -->

                                <el-button @click="deleteRoleFn(index, roleIndex)" type="primary">删除</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
    </template>
</template>
<script setup>
import { ref, computed } from 'vue'
import { getAllMerchantList, getMerchantList } from '@/api/operate/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'

const dataArr = ref([])

const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const newLobFn = () => {
    dataArr.value.push({
        lob: null,
        lobID: null,
        noCan: false,
        roles: [{
            roleName: '',
            roleCode: '',
            partner: null,
            roleType: null
        }]
    })
}

const addRoleFn = (index) => {
    dataArr.value[index].noCan = false
    dataArr.value[index].roles.push({
        roleName: '',
        roleCode: '',
        partner: null,
        roleType: null
    })
}

// 编辑
const editSubmit = (index) => {
    dataArr.value[index].noCan = false
}
// 保存业务线
const submit = async (index) => {
    const buslist = []
    dataArr.value[index].roles.forEach(el => {
        if (dataArr.value[index].lobID) {
            buslist.push({
                busiCode: dataArr.value[index].lobID,
                roleCode: el.roleCode,
                roleName: el.roleName,
                roleType: el.roleType,
                creatorId: userInfo.value.account
            })
        } else {
            buslist.push({
                busiCode: dataArr.value[index].lob,
                roleCode: el.roleCode,
                roleName: el.roleName,
                roleType: el.roleType,
                creatorId: userInfo.value.account
            })
        }
    })
    const params = {
        body: {
            rolePermissions: buslist,
            appKey: 'A1001001',
            busiCode: 'A1001001'
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC1657597232850LoS5U',
        name: '添加业务线和角色关系接口',
        source: '商户中台'

    }
    const res = await getAllMerchantList(params)
    if (res.code === '200') {
        ElMessage.success('成功')
        dataArr.value[index].noCan = true
    }
}

// 回显业务线
const getDetail = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            businessCode: 'A1001001',
            busiCode: 'A1001001'
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC1657884654291RUuhQ',
        name: '查询业务线列表',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(params)
    dataArr.value = res.map(item => {
        return {
            lob: item.busiName,
            lobID: item.busiCode,
            noCan: true,
            roles: item.roles
        }
    })
    // if (res.length > 0) {
    //     const buscodeList = res.map(item => item.busiCode)
    //     const listarr = ref([])
    //     const busobj = { }
    //     res.map(item => {
    //         if (Array.isArray(busobj[item.busiCode])) {
    //             busobj[item.busiCode].push({
    //                 roleName: item.roleName,
    //                 roleCode: item.roleCode
    //             })
    //         } else {
    //             busobj[item.busiCode] = [
    //                 {
    //                     roleName: item.roleName,
    //                     roleCode: item.roleCode
    //                 }
    //             ]
    //         }
    //     })
    //     for (const i in busobj) {
    //         listarr.value.push({
    //             lob: i,
    //             noCan: false,
    //             roles: busobj[i]
    //         })
    //     }
    //     dataArr.value = listarr.value
    // }
}
getDetail()
const deleteRoleFn = (index, roleIndex) => {
    if (dataArr.value[index].roles.length > 1) {
        dataArr.value[index].roles.splice(roleIndex, 1)
    }
}
const removeLobFn = (index) => {
    dataArr.value.splice(index, 1)
}

</script>
<style lang="scss" scoped>
.el-card{
    margin-top: 24px;
    .mb-20{
        margin-bottom: 20px;
    }
    .flex{
        display: flex;
        align-items: center;
    }
    .col-1{
        flex: 1;
        margin-right: 30px;
    }
    .col-2{
        flex: 2;
    }
    .col-4{
        flex: 4;
    }
    .card-box{
        .card-title{
            display: flex;
            font-weight: bold;
            margin-bottom: 24px;
            .line-title{
                margin-right: 30px;
            }
        }
        .card-content{
            width: 100%;
            display: flex;
            .el-input{
                display: initial;
            }
            .line-content{
                display: flex;
                &>div{
                    margin-right: 30px;
                }
            }
        }
    }
}
</style>
