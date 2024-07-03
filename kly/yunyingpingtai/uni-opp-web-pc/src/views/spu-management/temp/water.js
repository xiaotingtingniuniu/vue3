const formData = {
    brandCode: '',
    spuId: '',
    productFormat: '',
    netWeight: '',
    waterSource: '',
    isGas: '',
    isMinerals: '',
    weaklyAlkaline: '',
    lowSodium: '',
    noSugar: '',
    productTaste: '',
    appearance: ''
}
const extendImportant = [
    { label: '品牌编号', name: 'brandCode', type: 'input' },
    { label: '标品编码', name: 'spuId', type: 'input', readonly: 'readonly' },
    { label: '产品标准号', name: 'productFormat', type: 'input' },
    { label: '商品净重', name: 'netWeight', type: 'input' },
    { label: '水源地', name: 'waterSource', type: 'input' },
    { label: '有气/无气', name: 'isGas', type: 'input' },
    { label: '是否含矿物质', name: 'isMinerals', type: 'input' },
    { label: '弱碱性', name: 'weaklyAlkaline', type: 'input' },
    { label: '低钠', name: 'lowSodium', type: 'input' },
    { label: '无糖', name: 'noSugar', type: 'input' },
    { label: '口味', name: 'productTaste', type: 'input' },
    { label: '外观', name: 'appearance', type: 'input' }
]
export default {
    tempFormData: formData,
    extendImportant: extendImportant
}
