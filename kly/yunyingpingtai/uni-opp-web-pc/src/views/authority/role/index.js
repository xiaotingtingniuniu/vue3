import { ref } from 'vue'
import { organizationTree } from '@/api/authority'

const organizationLists = ref([])

// 递归 disabled
const recursionDisable = (arr, key) => {
    return arr.map(el => {
        const obj = {
            ...el,
            disabled: true
        }
        if (el[key] !== null && el[key].length) {
            obj[key] = recursionDisable(el[key], key)
        }
        return obj
    })
}

// 获取组织树
const getOrganizationTree = async (type) => {
    const res = await organizationTree()
    if (res.code === '200') {
        organizationLists.value = res.data
        if (type !== 'add') {
            organizationLists.value = recursionDisable(organizationLists.value, 'children')
        }
    }
}

export {
    organizationLists,
    getOrganizationTree
}
