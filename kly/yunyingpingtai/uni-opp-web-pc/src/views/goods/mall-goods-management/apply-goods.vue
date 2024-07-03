<template>
    <div class="work-order-container">
        <el-dialog v-model="dialogVisible"  :before-close="handleClose" >
            <div class="gongdaninfo">
                <el-row :gutter="20">
                    <el-col :span="8"><div class="height-p">商家名称：{{detail.merchantName}}</div></el-col>
                    <el-col :span="8"><div class="height-p">SPU编号:{{detail.spuId}}</div></el-col>
                    <el-col :span="8"><div class="height-p">SPU名称:{{detail.spuName}}</div></el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8"><div class="height-p">Goods编号:{{detail.goodsId}}</div></el-col>
                    <el-col :span="8"><div class="height-p">Goods名称:{{detail.goodsName}}</div></el-col>
                </el-row>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleClose">取消 </el-button>
                    <el-button type="primary" @click="send()" >通过</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import TotalTable from '@/composables/TablePagination/totalTable.vue'
import { getAllList, skuUpDown } from '@/api/operate/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

import { useStore } from 'vuex'
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const props = defineProps({
    visible: {
        type: Boolean
    },
    rowList: {
        type: Object
    },
    type: {
        type: String
    }
})
const detail = ref(props.rowList)
const dialogVisible = ref(props.visible)

onMounted(async () => {
    // await getOrderDetail()
})

const send = async () => {
    const params = {
        body: {
            goodsId: props.rowList.goodsId,
            state: Number(props.type),
            appKey: 'A1001000',
            busiCode: 'A1001001',
            sortField: 'isShadow',
            asc: 1
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC1657692299616atJ6U',
        name: 'Goods停用/启用',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getAllList(params)
    if (res.code === '200') {
        ElMessage({
            showClose: true,
            message: '成功',
            type: 'success'
        })
        emit('handleClose', props.visible)
        emit('fevent')
    }
}

const emit = defineEmits(['handleClose', 'fevent'])
const handleClose = () => {
    emit('handleClose', props.visible)
}
</script>
<style lang="scss" scoped>
.work-order-container{
    .height-p{
        line-height:40px;
    }
    h2{
        line-height:50px;
    }
    .orderinfo{
        margin-top:40px
    }

    :deep(.el-input .el-input__inner) {
        color:red;
        text-align: center
    }
    :deep(.el-table .el-table__footer-wrapper .cell){
        font-weight: 600;
        color: red;
    }
    .p_class{
    overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
    }

    .img-box{
        img{
            display:block;
            width:150px;
        }
    }
}
</style>
