<template>
    <div class="menu-search-page">
        <form action="/">
            <van-search :class="isApp ? 'status-bar-height' : ''" ref="inputField" v-model="searchValue" show-action shape="round" autofocus placeholder="请输入关键词" @search="triggerSet()" @cancel="pageBack">
                <template #left>
                    <div class="icon--unselect back-icon" @click="pageBack">
                        <van-icon size="1em" :name="require('@/assets/menu/路径 7@2x.png')" />
                    </div>
                </template>
                <template #left-icon>
                    <div class="icon--unselect">
                        <van-icon size="1em" :name="require('@/assets/menu/搜索@2x.png')" />
                    </div>
                </template>
            </van-search>
        </form>
        <div class="history-box" v-if="list.length">
            <div class="title">
                <div>历史记录</div>
                <div @click="takeTrash"><van-icon name="delete-o" /></div>
            </div>
            <div class="history-list">
                <template v-for="(item, index) in list" :key="index">
                    <div class="history-item" @click="takeItem(item)">{{ item }}</div>
                </template>
            </div>
        </div>
    </div>
</template>
<script setup>
import { Dialog, Toast } from 'vant'
import { isApp } from '@/utils'
import { pageBack } from '@/utils/composables'
const router = useRouter()
const store = useStore()

const searchValue = ref('')

const inputField = ref()
onMounted(() => {
    localHistory()
    setTimeout(() => inputField.value.focus(), 300)
})

const localList = ref(null)
const list = ref([])
const localHistory = () => {
    const local = localStorage.getItem('hc-nl-mp-web-mob-menu')
    if (local !== null) {
        localList.value = JSON.parse(local)
        list.value = localList.value
    } else {
        list.value = []
    }
}

// 实例: 存
const setItem = val => {
    if (localList.value) {
        const info = localList.value
        if (info) {
            const index = info.findIndex(item => item === val)
            if (index > -1) info.splice(index, 1)
            info.unshift(val)
            if (info.length > 10) info.pop()
        } else {
            localList.value = [...localList.value, val]
        }
    } else {
        localList.value = [val]
    }
    localStorage.setItem('hc-nl-mp-web-mob-menu', JSON.stringify(localList.value))
    store.commit('setMenuSearchVal', val)
    localHistory()
    router.push({ name: 'menu-result' })
}

// 触发: 存
const triggerSet = () => {
    const input = searchValue.value.trim()
    if (input !== '') return setItem(input)
    Toast('请输入关键字')
}

const takeTrash = () => {
    Dialog.confirm({
        message: '确认删除全部历史记录?'
    }).then(() => {
        cleanHistory()
    })
}

// 清空当前记录
const cleanHistory = () => {
    localStorage.setItem('hc-nl-mp-web-mob-menu', JSON.stringify([]))
    localHistory()
}

const takeItem = val => {
    searchValue.value = val
    triggerSet()
}

</script>
<style lang="scss" scoped>
.menu-search-page{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background-color: #F7F7F7;
    :deep(.van-icon-clear){
        padding-right: 38px;
    }
    .van-search.status-bar-height{
        padding-top: calc(14px + var(--van-status-bar-height));
    }
    .back-icon{
        font-size: 28px;
        height: 28px;
        margin-right: 16px;
    }
    :deep(.van-search){
        padding: 14px 24px;
        .van-search__action{
            font-size: 26px;
            font-weight: 400;
            color: #222222;
            padding: initial;
            margin-left: 22px;
        }
        .van-field__control{
            font-size: 26px;
            font-weight: 400;
        }
        .van-search__content{
            .van-search__field{
                height: 60px;
                padding: initial;
                display: flex;
                align-items: center;
            }
            .van-field__left-icon{
                display: flex;
                align-items: center;
                margin-right: 14px;
                .icon--unselect{
                    font-size: 26px;
                }
            }
        }
    }
    .history-box{
        padding: 0 24px;
        margin-top: 30px;
        .title{
            display: flex;
            justify-content: space-between;
            font-size: 28px;
            font-weight: 500;
            color: #222222;
        }
        .history-list{
            margin-top: 30px;
            display: flex;
            flex-wrap: wrap;
            .history-item{
                font-size: 24px;
                font-weight: 400;
                color: #222222;
                padding: 13px 28px;
                background: #FFFFFF;
                border-radius: 30px;
                margin-right: 16px;
                margin-bottom: 20px;
            }
        }
    }
    .van-field{
        font-size: 26px;
        font-weight: 400;
        background-color: transparent;
        padding: initial;
        :deep(.van-field__control){
            height: 32px !important;
            line-height: 32px !important;
        }
    }
}
</style>
