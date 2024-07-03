<template>
    <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="formLabelAlign"
        style="max-width: 460px"
    >
        <el-form-item label="商家编号">
            <el-input v-model="formLabelAlign.merchantId" />
        </el-form-item>
        <el-form-item label="Goods编号">
            <el-input v-model="formLabelAlign.goodsId" />
        </el-form-item>
        <el-form-item label="SKU编号">
            <el-input v-model="formLabelAlign.skuId" />
        </el-form-item>
        <!-- <el-form-item label="SKU名称">
            <el-input v-model="formLabelAlign.numt" />
        </el-form-item> -->
        <el-form-item label="可售数量">
            <el-input v-model="formLabelAlign.stock" />
        </el-form-item>
        <el-form-item label="一级渠道">
            <el-input v-model="formLabelAlign.firstChannel" />
        </el-form-item>
        <el-form-item label="二级渠道">
            <el-input v-model="formLabelAlign.secondChannel" />
        </el-form-item>
        <el-form-item label="价格">
            <el-input v-model="formLabelAlign.numt" />
        </el-form-item>
        <el-form-item label="预占数量">
            <el-input v-model="formLabelAlign.numt" />
        </el-form-item>
        <el-form-item label="状态">
            <el-input v-model="formLabelAlign.numt" />
        </el-form-item>
    </el-form>
    <div class="btn">
        <el-button @click="gobick">取消</el-button>
        <el-button type="success" @click="addinventory">确定</el-button>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { getMerchantList } from '@/api/operate/index'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const router = useRouter()

const store = useStore()

const userInfo = computed(() => store.state.userInfo)

const formLabelAlign = reactive({
    merchantId: '',
    skuId: '',
    goodsId: '',
    stock: '',
    firstChannel: '',
    secondChannel: '',
    numt: ''
})

const tableData = ref([])

const dataState = reactive({
    searchData: {
        orderNumber: '',
        workNumber: '',
        workStatus: '',
        workType: '',
        mobile: '',
        custAppealType: ''
    },
    dateTime: {
        workEndTimeSt: '',
        workEndTimeEn: '',
        workStartTimeSt: '',
        workStartTimeEn: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 1
    }

})

// 数据总数
const totals = ref(0)

// 跳回
const asynto = () => {
    router.go(-1)
}

// admin添加库存
const adminAdd = async () => {
    const params = {
        body: {
            businessCode: 'A1001001',
            goodsId: formLabelAlign.goodsId,
            skuId: formLabelAlign.skuId,
            spuId: 'spu1111',
            merchantId: formLabelAlign.merchantId,
            firstChannel: formLabelAlign.firstChannel,
            secondChannel: formLabelAlign.secondChannel,
            stock: 10,
            lockStock: 10,
            creatorId: 'zhang'
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC1657695146277lhizB',
        name: 'admin添加库存',
        source: '库存中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    tableData.value = data.list
    dataState.pageinfo.total = data.total
    console.log(data.list)
    tableData.value = [...data.list]
    totals.value = data.total
}

const addinventory = () => {
    adminAdd()
    asynto()
}

const gobick = () => {
    asynto()
}

</script>

<style lang="scss" scoped>
.btn{
    margin-top: 10px;
    display: flex;
}
</style>
