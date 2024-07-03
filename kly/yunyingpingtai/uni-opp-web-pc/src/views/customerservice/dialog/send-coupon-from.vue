<template>
    <div class='send-coupon-box'>
        <el-dialog v-model="dialogVisible"  :before-close="handleClose" title="指定手机号发券">
            <div>
                <el-form
                    ref="formRef"
                    :model="ruleForm"
                    :rules="rules"
                    class="demo-ruleForm"
                >
                    <el-form-item label=" " prop="textarea"  :rules="rules.textarea">
                        <!-- <el-input type="textarea" v-model="ruleForm.textarea"  @input="((val,rowNum,colNum)=>{handleTextarea(val,11,200)})" placeholder="请输入正确的用户11位手机号；若批量发送优惠券，请用回车换行输入手机号"></el-input> -->
                        <el-input  v-model="ruleForm.textarea"  placeholder="请输入正确的用户11位手机号" maxlength="11" @keydown.enter="handleClose"></el-input>
                        <p class="p-text">请输入正确的用户11位手机号</p>
                        <!-- oninput="value=value.replace(/[^\d]/g,'')"  -->
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleClose">取消 </el-button>
                    <el-button type="primary" @click="send()">发券</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { repairRecord } from '@/api/refund'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { phoneNoValidator } from '@/utils/rule.js'
const props = defineProps({
    visible: {
        type: Boolean
    },
    rowList: {
        type: Object
    }
})
const route = useRoute()
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogVisible = ref(props.visible)
const batchCode = route.params.batchCode

const validphone = (rule, value, callback) => {
    if (value === '') { return callback(new Error('请输入正确的用户11位手机号')) }
    if (!phoneNoValidator(value)) return callback(new Error('请输入正确的用户11位手机号'))
    if (value.length !== 11) return callback(new Error('请输入正确的用户11位手机号'))
    callback()
}
const rules = reactive({
    textarea: [{
        required: true,
        validator: validphone,
        trigger: 'blur'
    }
    ]

})

const ruleForm = ref({
    textarea: ''
})

const formRef = ref(null)
const send = async () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            const param = {
                appKey: 'A1001001',
                busiCode: 'A1001001',
                groupCode: props.rowList.groupCode,
                groupName: props.rowList.groupName,
                businessCode: props.rowList.orgCode,
                subCode: props.rowList.subCode,
                phoneMobiles: ruleForm.value.textarea.split(','),
                modifierId: userInfo.value.account,
                operatorId: userInfo.value.account,
                applier: props.rowList.applier,
                applierId: props.rowList.applierId,
                creatorId: userInfo.value.account,
                applierName: props.rowList.applier
            }
            const code = await repairRecord(param)
            if (code === '200') {
                ElMessage.success('成功')
                handleClose()
                emit('fevent')
            }
            if (code === '036006') {
                ElMessage.success('优惠券不存在')
                handleClose()
                emit('fevent')
            }
            if (code === '036007 ') {
                ElMessage.success('非注册用户手机号!')
            }
            if (code === '036008') {
                ElMessage.success('优惠券发放失败，请稍后重新操作!')
                handleClose()
                emit('fevent')
            }
        }
    })
}

const phoneList = ref([])

/**
 * @description    校验多行文本验证
 * @param val      输入值
 * @param name     字段名称
 * @param rowNum   每行字符个数
 * @param colNum   行数
 */

const handleTextarea = (val, rowNum, colNum) => {
    console.log(val, rowNum, colNum)
    // 正则匹配每行字数
    const reg = new RegExp('(.{' + rowNum + '})', 'g')
    // 先除回车换行符的字符串，不去除影响字符个数计算
    const result = val.replace(/[\r\n]/g, '').replace(reg, '$1\n')
    // 获取colNum行
    const arr = result.split('\n').slice(0, colNum)
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === '') {
            arr.splice(i, 1)// 去掉值为空的数组
            i = i - 1
        }
        phoneList.value = arr
    }
    console.log(arr)
}

const emit = defineEmits(['handleClose', 'fevent'])
const handleClose = () => {
    emit('handleClose', props.visible)
}

</script>
<style lang="scss" scoped>
 .coupon-submit-box{
    .p-text{
         color:red;
         font-size:12px;
     }
     .dialog-title{
        font-size:20px;
        color:red;
        font-weight:700;
     }
     .header-title{
         font-size:20px;
         color:red;
         height:50px;
         font-weight:700;
         align-items:center
     }

 }
</style>
<style>
.el-checkbox{
    white-space:break-spaces;
    height:40px
}
</style>
