<template>
    <!-- <h1>表单提交组件</h1> -->
    <div class="lz-dialog">
        <el-dialog v-model="dialogShow" :title="obj.dialogTitle" :width="obj.dialogWidth" :before-close="close" draggable>
            <slot> </slot>
            <template #footer>
                <span v-if="obj.dialogIsFooter" class="dialog-footer">
                    <el-button class="btn-mixins-clear-default" @click="close">{{ obj.dialogCloseBtnText }}</el-button>
                    <el-button class="btn-mixins dia-suc" @click="success">{{ obj.dialogSuccessBtnText }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'

const props = defineProps({
    dialogObject: {
        default () {
            return {}
        },
        type: Object
    }
})

const emit = defineEmits(['dialogClose', 'dialogSuccess'])

const dialogShow = computed({
    get () {
        // getter
        return props.dialogObject.dialogVisible
    },
    set (val) {
        // console.log(val)
        return val
    }
})
const obj = {
    dialogTitle: props.dialogObject.title, //  || '标题'
    dialogWidth: props.dialogObject.width || '30%',
    dialogCloseBtnText: props.dialogObject.closeBtnText || '取消',
    dialogSuccessBtnText: props.dialogObject.successBtnText || '成功',
    dialogIsFooter: props.dialogObject.isFooter || false
}
const close = () => {
    emit('dialogClose', false, 'close')
}
const success = () => {
    emit('dialogSuccess', false, 'success')
}

</script>
<style lang="scss" scoped>

</style>
