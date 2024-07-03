const formData = {
    brandCode: '',
    spuId: '',
    productFormat: '',
    netWeight: '',
    puffedStyle: '',
    productTaste: ''
}
const extendImportant = [
    { label: '品牌编号', name: 'brandCode', type: 'input' },
    { label: '标品编码', name: 'spuId', type: 'input', readonly: 'readonly' },
    { label: '产品标准号', name: 'productFormat', type: 'input' },
    { label: '商品净重', name: 'netWeight', type: 'input' },
    { label: '膨化类型', name: 'puffedStyle', type: 'input' },
    { label: '口味', name: 'productTaste', type: 'input' }
]
export default {
    tempFormData: formData,
    extendImportant: extendImportant
}
