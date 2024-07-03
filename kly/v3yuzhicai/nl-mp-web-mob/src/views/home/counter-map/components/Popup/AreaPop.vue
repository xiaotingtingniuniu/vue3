<template>
    <van-popup v-model:show="show" :close-on-click-overlay="false" position="bottom" :style="{ height: '30%' }">
        <van-area :value="currentArea.code" @confirm="confirm" @cancel="close" :area-list="areaList" :columns-num="1" />
    </van-popup>
</template>
<script setup>
import { areaList } from '@vant/area-data'
const props = defineProps(['visible', 'currentArea'])
const emit = defineEmits(['close', 'confirm'])

const show = ref(false)
const close = () => emit('close')
const currentArea = ref()

watchEffect(() => {
    show.value = props.visible
    currentArea.value = props.currentArea
})

const confirm = (result) => {
    emit('confirm', result[0])
    close()
}

</script>
