<template>
    <div class='scantling-box'>
        <el-dialog v-model="dialogVisible" title="" width="66%" @close="clostDialog">
            <div class="content">
                <span class="title">替换前SPU信息：</span>
                <el-row :gutter="24">
                    <el-col :span="12"><div class="height-p">SPU编号：{{editGoods.spuId}}</div></el-col>
                    <el-col :span="12"><div class="height-p">标品名称：{{editGoods.spuName}}</div></el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12"><div class="height-p">69码：{{editGoods.barcode}}</div></el-col>
                    <el-col :span="12"><div class="height-p">销售渠道:{{editGoods.saleChannel}}</div></el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <div class="img-content">
                            <div class="height-p">SPU主图：</div>
                            <el-image class="image" v-if="editGoods.image" style="width:100px;height:100px" preview-teleported :src="editGoods.image" :preview-src-list="[editGoods.image]" fit="cover" />
                            <el-image class="image" v-else/>
                            <!-- <el-image class="image" v-else preview-teleported :src="editGoods.image" :preview-src-list="[editGoods.image]" fit="cover" /> -->
                            <!-- <img class="image" v-if="editGoods.image" :src="editGoods.image" style="width:100px;height:100px" />
                            <img class="image" v-else/> -->
                        </div>
                    </el-col>
                    <el-col :span="12">
                    </el-col>
                </el-row>
            </div>
            <div class="content">
                <span class="title">替换后SPU信息：</span>
                <el-button v-if="!rowtype" @click="rebindDialog()" type="primary">检索标品库</el-button>
                <el-row :gutter="24">
                    <el-col :span="12"><div class="height-p">SPU编号：{{newGoods.spuId}}</div></el-col>
                    <el-col :span="12"><div class="height-p">标品名称：{{newGoods.spuName}}</div></el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12"><div class="height-p">69码：{{newGoods.barcode}}</div></el-col>
                    <el-col :span="12"><div class="height-p">销售渠道:{{newGoods.saleChannel}}</div></el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <div class="img-content">
                            <div class="height-p">SPU主图：</div>
                            <el-image class="image" v-if="newGoods.image" style="width:100px;height:100px" preview-teleported :src="newGoods.image" :preview-src-list="[newGoods.image]" fit="cover" />
                            <el-image class="image" v-else/>
                            <!-- <img class="image" v-if="newGoods.image" :src="newGoods.image" style="width:100px;height:100px" /> -->

                        </div>
                    </el-col>
                    <el-col :span="12">
                    </el-col>
                </el-row>
            </div>
            <div class="content" v-if="!rowtype">
                <span class="title">换绑原因：</span>
                <el-input class="height-p" style="width: 100%;" v-model="Reason" type="textarea" placeholder="80个字符以内；" />
            </div>
            <div class="content" v-else>
                <span class="title">换绑原因：</span>
                <el-input class="height-p" style="width: 100%;" disabled v-model="Reason" type="textarea" placeholder="80个字符以内；" />
            </div>
            <div class="content-btn" v-if="!rowtype">
                <el-button @click="clostDialog()" type="primary">关闭</el-button>
                <el-button @click="spurebind()" type="primary">确认换绑</el-button>
            </div>
        </el-dialog>
    </div>
    <standard-list v-if="dialogRebindVisible" :visible="dialogRebindVisible" @RebinddialogClose="dialogRebindVisible = false" @newGoodsList="newGoodsList"></standard-list>
</template>
<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import StandardList from './index.vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import SystemList from '@/composables/TablePagination/index.vue'
import { detaillist, spurebinding } from '@/api/operate/index'
const props = defineProps({
    visible: {
        type: Boolean
    },
    rowList: {
        type: Object
    },
    modifySource: {
        type: Number
    },
    rowType: {
        type: Number
    }
})
const modelStatusList = {
    0: '初始', 1: '训练中', 2: '训练完成', 80: '上新失败', 99: '训练失败'
}
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogSearch = ref({
    spuId: null,
    spuName: null,
    barcode: null
})
const dialogVisible = ref(props.visible)
const rowtype = ref(props.rowType)
const rowdetail = ref(props.rowList)
const Reason = ref('')
const dialogTableData = ref([])
const dialogTHead = [
    { align: 'center', tooltip: true, type: 'selection', minWidth: 60 },
    { align: 'center', tooltip: true, prop: 'spuId', label: '标品编码', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'spuName', label: '标品名称', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'barcode', label: '69码', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'saleChannel', label: '销售渠道', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'spuListPicUrl', label: '标品图片', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'mediarUrl', label: '模型训练首图', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'modelStatus', label: '模型训练状态', minWidth: 150, slot: true }
]
onMounted(async () => {
    if (props.rowType) {
        await showDatailDialog()
    } else {
        showDialog()
    }
    // await showDatailDialog()
})
const editGoods = ref('')
const newGoods = ref('')
const showDatailDialog = async () => {
    if (props.modifySource === 1) {
        const param = {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            replaceLogNo: rowdetail.value.replaceLogNo,
            spuId: rowdetail.value.spuId,
            modifySource: props.modifySource
        }
        const res = await detaillist(param)
        editGoods.value = res.data.oldSpuInfo
        newGoods.value = res.data.spuInfo
        Reason.value = res.data.replaceReason
    } else if (props.modifySource === 2) {
        const param = {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            // replaceLogNo: row.replaceLogNo,
            goodsId: rowdetail.value.goodsId,
            modifySource: props.modifySource
        }
        const res = await detaillist(param)
        editGoods.value = res.data.oldSpuInfo
        newGoods.value = res.data.spuInfo
        Reason.value = res.data.replaceReason
    } else {
        const param = {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            // replaceLogNo: row.replaceLogNo,
            skuId: rowdetail.value.skuId,
            modifySource: props.modifySource
        }
        const res = await detaillist(param)
        editGoods.value = res.data.oldSpuInfo
        newGoods.value = res.data.spuInfo
        Reason.value = res.data.replaceReason
    }
}
const showDialog = () => {
    const image = ref('')
    if (rowdetail.value.spuMediaList !== null) {
        for (let i = 0; i < rowdetail.value.spuMediaList.length; i++) {
            if (rowdetail.value.spuMediaList[i].mediaType + '' === '2') {
                image.value = rowdetail.value.spuMediaList[i].mediaUrl
            }
        }
    }
    rowdetail.value.image = image.value
    editGoods.value = rowdetail.value
}
const dialogRebindVisible = ref(false)
const rebindDialog = () => {
    dialogRebindVisible.value = true
}
const newGoodsList = (val) => {
    newGoods.value = val
}
// 确认换绑
const spurebind = async () => {
    if (Reason.value === '') {
        ElMessage({
            type: 'error',
            message: '换绑原因不能为空'
        })
        return
    }
    if (props.modifySource === 1) {
        const param = {
            appKey: 'A1001000',
            busiCode: 'A1001004',
            spuId: newGoods.value.spuId,
            oldSpuId: editGoods.value.spuId,
            modifySource: 1,
            replaceReason: Reason.value
        }
        const res = await spurebinding(param)
        ElMessage({
            type: 'success',
            message: '换绑成功'
        })
        emit('clostDialog', props.visible)
    } else if (props.modifySource === 2) {
        const param = {
            appKey: 'A1001000',
            busiCode: 'A1001004',
            spuId: newGoods.value.spuId,
            oldSpuId: editGoods.value.spuId,
            modifySource: 2,
            goodsId: editGoods.value.goodsId,
            replaceReason: Reason.value
        }
        await spurebinding(param)
        ElMessage({
            type: 'success',
            message: '换绑成功'
        })
        emit('clostDialog', props.visible)
    } else {
        const param = {
            appKey: 'A1001000',
            busiCode: 'A1001004',
            spuId: newGoods.value.spuId,
            oldSpuId: editGoods.value.spuId,
            modifySource: 3,
            skuId: editGoods.value.skuId,
            replaceReason: Reason.value
        }
        await spurebinding(param)
        ElMessage({
            type: 'success',
            message: '换绑成功'
        })
        emit('clostDialog', props.visible)
    }
}
// 关闭弹窗
const clostDialog = () => {
    // dialogVisible.value = false
    Reason.value = ''
    newGoods.value = []
    editGoods.value = []
    emit('clostDialog', props.visible)
}
const emit = defineEmits(['clostDialog'])
</script>
<style lang="scss" scoped>
 .content{
    // border-bottom: 1px solid #999999;
    margin-bottom: 10px;
}
.content-btn{
    margin-top: 20px;
    text-align: center;
}
.img-content{
    display: flex;
}
.height-p{
    line-height:30px;
}
.title{
    color: #000000;
    font-weight: bold;
    line-height:40px;
}
</style>
