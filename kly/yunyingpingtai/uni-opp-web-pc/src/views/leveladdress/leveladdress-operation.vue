<template>
    <h3>四级地址{{props.title === 'modify' ? '修改' : '增加'}}</h3>
    <el-form ref="formRef" :model="dataState" :inline="true" label-position="right" label-width="200px">
        <!-- 省 -->
        <el-form-item label="省编码" prop="">
            <el-input v-model="searchData.provinceCode" class="input-line" disabled />
        </el-form-item>
        <el-form-item label="省名称" prop="">
            <el-input v-model="searchData.provinceName" class="input-line" disabled />
        </el-form-item>
        <br />
        <!-- 市 -->
        <el-form-item label="市编码" prop="">
            <el-input v-model="searchData.cityCode" class="input-line" disabled />
        </el-form-item>
        <el-form-item label="市名称" prop="">
            <el-input v-model="searchData.cityName" class="input-line" disabled />
        </el-form-item>
        <br />
        <!-- 县 -->
        <el-form-item label="县编码" prop="">
            <el-input v-model="searchData.countyCode" class="input-line" disabled />
        </el-form-item>
        <el-form-item label="县名称" prop="">
            <!-- :disabled="props.title === 'modify' ? false : true"  -->
            <el-input v-model="searchData.countyName" class="input-line" disabled />
        </el-form-item>
        <br />
        <!-- 街道 -->
        <el-form-item label="镇/街道编码" prop="">
            <!-- :disabled="props.title === 'modify' ? true : false"  -->
            <el-input v-model="searchData.townCode" class="input-line" disabled />
        </el-form-item>
        <el-form-item label="镇/街道名称" prop="">
            <el-input v-model="searchData.townName" class="input-line" />
        </el-form-item>
        <br />
        <el-form-item class="button-box">
            <el-button @click="cancel()">
                取消
            </el-button>
            <el-button type="primary" @click="confirm()">
                确认
            </el-button>
        </el-form-item>
    </el-form>
</template>
<script setup>
import { useStore } from 'vuex'
import { computed, onMounted, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { getMerchantList, getMerchantListCode } from '@/api/operate/index'
import { ElMessage } from 'element-plus'

const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const router = useRouter()
const props = defineProps(['title', 'countyCode', 'townCode'])
const dataState = reactive({
    searchData: {
        // provinceCode: '', // 省code
        // provinceName: '', // 省名称
        // cityCode: '', // 市code
        // cityName: '', // 市名称
        // countyCode: '', // 县code
        // countyName: '', // 县名称
        // townCode: '', // 镇code
        // townName: '' // 镇名称
    },
    iswho: {
        areaId: null
    }
})
const { searchData, iswho } = toRefs(dataState)

// 是修改/新增操作
const area = ref(1)
// 确认
const confirm = () => {
    if (props.title === 'modify') {
        area.value = 2
        modifyAreaDetail()
        console.log('修改')
    } else {
        area.value = 1
        modifyAreaDetail()
        console.log('新增')
    }
    goout()
}

// 取消
const cancel = () => {
    goout()
}

onMounted(() => {
    queryAreaDetail()
})

// 查询四级地址详情
const queryAreaDetail = async () => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            // countyCode: props.countyCode, // 县code
            townCode: props.townCode // 镇code
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC11163200773705728',
        name: '查询四级地址详情',
        source: '运单中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    dataState.searchData = { ...data }
    dataState.iswho.areaId = data.id
    // dataState.searchData.provinceCode = data.provinceCode
    // dataState.searchData.provinceName = data.provinceName
    // dataState.searchData.cityCode = data.cityCode
    // dataState.searchData.cityName = data.cityName
    // dataState.searchData.countyCode = data.countyCode
    // dataState.searchData.countyName = data.countyName
    // dataState.searchData.townCode = data.townCode
    // dataState.searchData.townName = data.townName
}

// 修改/新增四级地址信息
const modifyAreaDetail = async () => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            areaId: dataState.iswho.areaId,
            operateType: area.value,
            ...dataState.searchData,
            creatorId: userInfo.value.id + '', // 创建人ID
            modifierId: userInfo.value.id + '' // 修改人ID
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC11163472380055552',
        name: '修改/新增四级地址信息',
        source: '运单中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const { code, message } = await getMerchantListCode(params)
    if (code === 200) {
        goout() // 成功跳回
        ElMessage({
            type: 'success',
            message: message
        })
    } else {
        ElMessage({
            type: 'success',
            message: message
        })
    }
}

const goout = () => {
    router.go(-1)
}
</script>
<style lang="scss" scoped>
.input-line {
    width: 220px;
}
</style>
