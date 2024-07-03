<template>
    <div class="lz-dialog">
        <el-dialog v-model="dialogVisible"  :before-close="handleClose" title="" width="80%">
            <div v-if="dataList.length>0">
                <div v-for="(item,index) in dataList" :key="index">
                    <div class="">状态:{{item.statusName}}</div>
                    <div v-for="(el,index) in item.trailList" :key="index" class="flex-box">
                        <div>
                            {{el.trailContext}}
                        </div>
                        <div>
                            {{el.trailTime}}
                        </div>

                    </div>
                </div>
            </div>
            <div v-else class="text-style">
                暂无数据
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleClose">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive, toRefs, computed } from 'vue'
import { getMerchantList } from '@/api/operate/index'
import { useStore } from 'vuex'
const store = useStore()
const formRef = ref(null)
const userInfo = computed(() => store.state.userInfo)
const props = defineProps({
    visible: {
        type: Boolean
    },
    channelType: {
        type: String
    },
    subOrderNo: {
        type: String
    }
})
const dataList = ref([])
const dialogVisible = ref(props.visible)
const getDetail = async () => {
    const parm = {
        body: {
            subOrderNo: props.subOrderNo,
            channelType: props.channelType,
            waybillType: 1,
            appKey: 'A1001001',
            busiCode: 'A1001001'
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC18075630475800576',
        name: '查询运单轨迹信息',
        source: '运单中台'
    }
    const res = await getMerchantList(parm)
    dataList.value = res.dataList
}
getDetail()
const emit = defineEmits(['handleClose', 'fevent'])
const handleClose = () => {
    emit('handleClose', props.visible)
    emit('fevent')
}

</script>
<style lang="scss" scoped>
.text-style{
    font-size: 30px;
    text-align: center;
}
</style>
