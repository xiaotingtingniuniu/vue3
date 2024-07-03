import { reactive } from 'vue'

/* sort校验 */
const sortValidator = (rule, value, callback) => {
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
    time: [
        {
            required: true,
            message: '请选择生效时间',
            trigger: 'blur'
        }
    ],
    // targetUrl: [
    //     {
    //         required: true,
    //         message: '请输入url',
    //         trigger: 'change'
    //     }
    // ],
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
    ],
    'appletInfo.appletId': [
        {
            required: true,
            message: '请输入小程序原始ID',
            trigger: 'blur'
        }
    ],
    'appletInfo.path': [
        {
            required: true,
            message: '请输入小程序页面地址参数',
            trigger: 'blur'
        }
    ],
    targetUrl: [
        {
            required: true,
            message: '请输入URL地址',
            trigger: 'blur'
        }
    ],
    targetId: [
        {
            required: true,
            message: '请输入广告位ID',
            trigger: 'blur'
        }
    ]
})

// 业务线
export const busiCodeList = [
    { label: '恒生活APP', value: 'A1001', sceneCode: 'A1001004' },
    { label: '恒生活智能货柜小程序', value: 'A1001006', sceneCode: 'A1001006' },
    { label: '进货商城', value: 'A1001005', sceneCode: 'A1001005' }
]
// 展示位置 (到家首页banner:HOME_BANNER; 完成页面banner:ORDER_FINISH_BANNER; 到家首页分类金刚位:HOME_CATEGORY; 搜索分类:SEARCH_CATEGORY; 恒生活微信小程序首页插屏:HSH_MINI_WX_HOME_PLAQUE; 恒生活微信小程序首页banner:HSH_MINI_WX_HOME_BANNER; 恒生活微信小程序结算页插屏:HSH_MINI_WX_SETTLE_PLAQUE; 恒生活微信小程序结算页banner:HSH_MINI_WX_SETTLE_BANNER; 恒生活微信小程序结算页banner2:HSH_MINI_WX_SETTLE_BANNER2; 恒生活微信小程序我的页面banner:HSH_MINI_WX_ME)
// 展示位置
export const displaySiteAll = [
    { label: '首页', value: 'HOME_BANNER' },
    { label: '支付完成页', value: 'ORDER_FINISH_BANNER' },
    { label: '恒生活APP首页分类金刚位', value: 'HOME_CATEGORY' },
    { label: '搜索分类', value: 'SEARCH_CATEGORY' },
    { label: '恒生活微信小程序首页插屏', value: 'HSH_MINI_WX_HOME_PLAQUE' },
    { label: '恒生活微信小程序首页banner', value: 'HSH_MINI_WX_HOME_BANNER' },
    { label: '恒生活微信小程序结算页插屏', value: 'HSH_MINI_WX_SETTLE_PLAQUE' },
    { label: '恒生活微信小程序结算页banner1', value: 'HSH_MINI_WX_SETTLE_BANNER' },
    { label: '恒生活微信小程序结算页banner2', value: 'HSH_MINI_WX_SETTLE_BANNER2' },
    { label: '恒生活微信小程序我的页面banner', value: 'HSH_MINI_WX_ME' }
]

export const AppDisplaySite = [
    { label: '首页', value: 'HOME_BANNER' },
    { label: '支付完成页', value: 'ORDER_FINISH_BANNER' }
    // { label: '恒生活APP首页分类金刚位', value: 'HOME_CATEGORY' }
]

export const wxAppDisplaySite = [
    { label: '恒生活微信小程序首页插屏', value: 'HSH_MINI_WX_HOME_PLAQUE' },
    { label: '恒生活微信小程序首页banner', value: 'HSH_MINI_WX_HOME_BANNER' },
    { label: '恒生活微信小程序结算页插屏', value: 'HSH_MINI_WX_SETTLE_PLAQUE' },
    { label: '恒生活微信小程序结算页banner1', value: 'HSH_MINI_WX_SETTLE_BANNER' },
    { label: '恒生活微信小程序结算页banner2', value: 'HSH_MINI_WX_SETTLE_BANNER2' },
    { label: '恒生活微信小程序我的页面banner', value: 'HSH_MINI_WX_ME' }
]

export const shopH5DisplaySite = [
    { label: '首页', value: 'HOME_BANNER' }
]
