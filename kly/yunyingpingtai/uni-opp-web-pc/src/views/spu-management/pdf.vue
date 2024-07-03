<template>
    <div class="pdf">
        <p @click="jump">《恒生活货柜商品建模规范》</p>
        <!-- <pdf v-for="i in numPages" :key="i" :src="src" :page="i" @page-loaded="pageLoaded($event)" /> -->
    </div>
</template>
<script>
// import pdf from 'vue-pdf'
export default {
    name: 'Pdf',
    // components: {
    //     pdf
    // },
    data () {
        return {
            loading: true,
            src: '',
            numPages: undefined,
            curPageNum: 0
        }
    },
    methods: {
        jump () {
            window.open('/Model_specification.pdf')
        },
        pageLoaded (e) {
            this.curPageNum = e
            if (this.curPageNum === this.numPages) {
                this.loading = false
            }
        }
    },
    mounted () {
        // const that = this
        // const url = '/Model_specification.pdf' // '/123.pdf'
        // that.src = pdf.createLoadingTask(url)
        // that.src.promise.then(pdf => {
        //     that.numPages = pdf.numPages
        // })
    }
}
</script>
<style lang="scss" scoped>
.pdf{
    height: 50px;
    line-height: 50px;
    width: 100%;
    text-align: right;
    padding-left: 40px;
    color: #D9001B;
    box-sizing: border-box;
    p{
        cursor:pointer;
        display: inline-block;
        user-select:none;
    }
}
</style>
