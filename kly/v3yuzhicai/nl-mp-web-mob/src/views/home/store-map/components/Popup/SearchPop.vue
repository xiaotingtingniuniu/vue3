<template>
    <van-popup v-model:show="show" position="right" :style="{ width: '100%', height: '100%' }">
        <div class="search-page">
            <div class="search-box" :class="isApp ? 'status-bar-height' : ''">
                <div class="common-search-bar">
                    <div v-if="show" class="div-input">
                        <van-icon name="search" />
                        <van-field @keyup.enter="triggerSet()" ref="inputField" v-model="searchValue" autofocus placeholder="搜索门店" />
                    </div>
                </div>
                <div class="cancel" @click="close">取消</div>
            </div>
            <div class="history-box" v-if="list.length">
                <div class="title">
                    <div>历史记录</div>
                    <div @click="takeTrash"><van-icon name="delete-o" /></div>
                </div>
                <div class="history-list">
                    <div class="history-item" @click="takeItem(item)" v-for="(item, index) in list" :key="index">{{ item}}</div>
                </div>
            </div>
        </div>
    </van-popup>
    <result-pop :searchVal="searchValue" :visible="resultPopVisible" :currentArea="currentArea" teleport="body" @openAreaPop="openAreaPop" @close="resultPopClose" />
</template>
<script setup>
import { Dialog } from 'vant'
import ResultPop from './ResultPop.vue'
import { isApp } from '@/utils'
const props = defineProps(['visible', 'currentArea'])
const emit = defineEmits(['close', 'confirm', 'openAreaPop'])

const resultPopVisible = ref(false)
const resultPopClose = () => {
    searchValue.value = ''
    resultPopVisible.value = false
}
const show = ref(false)
const close = () => emit('close')
const currentArea = ref()
const inputField = ref()
const searchValue = ref()
const openAreaPop = () => emit('openAreaPop')

watchEffect(() => {
    show.value = props.visible
    currentArea.value = props.currentArea
    if (props.visible === true) {
        setTimeout(() => inputField.value.focus(), 500)
    }
})

const localList = ref(null)
const list = ref([])

onMounted(() => {
    localHistory()
})

const localHistory = () => {
    const local = localStorage.getItem('hc-nl-mp-web-mob-store')
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
    localStorage.setItem('hc-nl-mp-web-mob-store', JSON.stringify(localList.value))
    resultPopVisible.value = true
}

// 触发: 存
const triggerSet = () => {
    inputField.value.blur()
    const input = searchValue.value.trim()
    if (input !== '') setItem(input)
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
    localStorage.setItem('hc-nl-mp-web-mob-store', JSON.stringify([]))
    localHistory()
}

const takeItem = val => {
    searchValue.value = val
    triggerSet()
}

</script>
<style lang="scss" scoped>
.search-page{
    min-height: 100vh;
    background-color: #F7F7F7;
    .search-box.status-bar-height{
        padding-top: var(--van-status-bar-height)
    }
    .search-box{
        display: flex;
        align-items: center;
        padding: 26px 24px;
        background-color: #fff;
        .common-search-bar{
            flex: 1;
            margin-right: 22px;
            margin-top: 0;
            .div-input{
                border: initial;
            }
        }
        .cancel{
            font-size: 26px;
            color: #222222;
            letter-spacing: 0;
            font-weight: 400;
        }
    }
    .history-box{
        padding: 0 24px;
        margin-top: 30px;
        .title{
            display: flex;
            justify-content: space-between;
            font-size: 28px;
            letter-spacing: 0;
            font-weight: 400;
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
