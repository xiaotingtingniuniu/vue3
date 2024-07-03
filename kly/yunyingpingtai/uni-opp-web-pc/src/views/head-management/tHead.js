export const headManagement = [
    { align: 'center', tooltip: true, prop: 'busiUserId', label: '用户编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'nickName', label: '用户昵称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'phoneMobile', label: '用户手机号', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'role', label: '团长类型', minWidth: 130, slot: true },
    { tooltip: true, prop: 'inviterBusiUserId', label: '上级团长编号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'roleStatus', label: '用户状态', minWidth: 130, slot: true },
    { tooltip: true, prop: 'regimentsCount', label: '下级团长数量', minWidth: 130 },
    { tooltip: true, prop: 'infomation', label: '提现资料', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 100, slot: true }
]
function selectableFn (row, index) {
    if (row.status === 4) {
        return false
    } else if (row.status === 3) {
        return false
    } else {
        return true
    }
}
export const headApplication = [
    { tooltip: true, type: 'selection', minWidth: 60, selectable: selectableFn },
    { tooltip: true, prop: 'applyOrder', label: '申请单信息', minWidth: 100, slot: true },
    { tooltip: true, prop: 'applyInfo', label: '申请资料', minWidth: 100, slot: true },
    { tooltip: true, prop: 'applyPeople', label: '申请人账号信息', minWidth: 100, slot: true },
    { tooltip: true, prop: 'inviterBusi', label: '上级团长', minWidth: 100, slot: true },
    { tooltip: true, prop: 'applyStatus', label: '申请单状态', minWidth: 130, slot: true },
    { tooltip: true, prop: 'operation', label: '操作', minWidth: 100, slot: true }
]
