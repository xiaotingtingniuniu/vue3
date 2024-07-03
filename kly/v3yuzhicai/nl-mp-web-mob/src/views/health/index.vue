<template>
    <div>dasdasda</div>
    <div>dasdasda</div>
    <div>dasdasda</div>
    <button @click="pageGo">跳转</button>
    <!-- 宽: {{ testDivWidth }}
    高: {{ testDivHeight }}
    <div ref="testDiv" class="test" :style="{ 'height': testDivHeight }">{{test}}</div> -->
</template>

<script setup>
// const test = ref('测试文字啊测试文字啊')
const testDiv = ref(null)
const testDivWidth = ref('0px')
const testDivHeight = ref('0px')
const getDivSize = () => {
    testDivWidth.value = testDiv.value.clientWidth + 'px'
    testDivHeight.value = testDiv.value.clientWidth * 4 / 5 + 'px'
}
const route = useRoute()
const router = useRouter()
const pageGo = () => {
    router.push({ name: 'select-coupon' })
}
onMounted(() => {
    if (route.query.url) router.replace(route.query.url)
    watchEffect(() => {
        if (testDiv.value) getDivSize()
    })
    window.onresize = () => getDivSize()
})

</script>

<style lang="scss" scoped>
.test{
    width: 20%;
    // height: v-bind(testDivHeight);
    border: 1px solid red;
}
</style>
