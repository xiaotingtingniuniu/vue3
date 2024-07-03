import { ref } from 'vue'
export const inputList2 = ref([
    { label: '生产许可证', name: 'prod_license', type: 'input', required: false },
    { label: '3C认证', name: 'thrc_cert', type: 'input', required: false },
    { label: 'ISO认证', name: 'iso_cert', type: 'input', required: false },
    { label: 'CE认证', name: 'ce_cert', type: 'input', required: false },
    { label: 'Rosh检测报告', name: 'rosh_inspec_report', type: 'input', required: false },
    { label: '入网许可证', name: 'net_access_license', type: 'input', required: false },
    { label: '贴画供应类型', name: 'sticker_type', type: 'input', required: false },
    { label: '贴画供应方式', name: 'sticker_style', type: 'input', required: false },
    { label: '包装要求', name: 'package_require', type: 'input', required: false },
    { label: '支持软件', name: 'supp_software', type: 'input', required: false }
])
