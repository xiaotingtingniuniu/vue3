import { reactive } from 'vue'

/* sort校验 */
const sortValidator = (rule, value, callback) => {
    var reg = /^[1-9]{1,5}$/
    if (value === '' || value === undefined || value === null) {
        callback(new Error('请输入排序号'))
    }
    if (value.length > 5 || value < 0) {
        callback(new Error('请输入1-99999之间的序号'))
    }
    if (!reg.test(value)) {
        callback(new Error('请输入正确的排序号'))
    } else {
        callback()
    }
}

// 表单校验规则
export const formRule = reactive({
    name: [
        { required: true, message: '请输入banner名称', trigger: 'blur' }
    ],
    business: [
        {
            required: true,
            message: '请选择业务线',
            trigger: 'change'
        }
    ],
    position: [
        {
            required: true,
            message: '请选择展示位置',
            trigger: 'change'
        }
    ],
    bannerUrl: [
        {
            required: true,
            message: '请上传banner图',
            trigger: 'blur'
        }
    ],
    url: [
        {
            required: true,
            message: '请输入url',
            trigger: 'blur'
        }
    ],
    state: [
        {
            required: true,
            message: '请选择状态',
            trigger: 'change'
        }
    ],
    sort: [
        { required: true, validator: sortValidator, trigger: 'blur' }
    ]
})
