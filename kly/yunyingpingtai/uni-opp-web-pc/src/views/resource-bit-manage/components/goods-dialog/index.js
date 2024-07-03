import { reactive } from 'vue'

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
        { required: true, message: '请输入banner排序', trigger: 'blur' }
    ]
})
