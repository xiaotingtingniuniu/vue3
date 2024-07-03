import { reactive } from 'vue'

/* sort校验 */
export const sortValidator = (rule, value, callback) => {
    var reg = /^[0-9]{1,5}$/
    if (value === '' || value === undefined || value === null) {
        callback(new Error('请输入排序号'))
    }
    if (!reg.test(value)) {
        callback(new Error('请输入正确的排序号'))
    } else {
        callback()
    }
}

// 表单校验规则
export const formRule = reactive({
    title: [
        { required: true, message: '请输入banner名称', trigger: 'blur' }
    ],
    business: [
        {
            required: true,
            message: '请选择业务线',
            trigger: 'change'
        }
    ],
    displaySite: [
        {
            required: true,
            message: '请选择展示位置',
            trigger: 'change'
        }
    ],
    targetUrl: [
        {
            required: true,
            message: '请输入url',
            trigger: 'change'
        }
    ],
    imgUrl: [
        {
            required: true,
            message: '请上传图片',
            trigger: 'change'
        }
    ],
    status: [
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
