<template>
    <van-overlay class="loading-overlay" :show="true" z-index="1000">
        <div class="wrapper" @click.stop>
            <van-loading class="block" color="#fff" vertical size="24px">正在加载</van-loading>
        </div>
    </van-overlay>
</template>
<script>
import { defineComponent } from 'vue'
import { Overlay, Loading } from 'vant'
export default defineComponent({
    name: 'loading',
    components: {
        [Overlay.name]: Overlay,
        [Loading.name]: Loading
    }
})
</script>
<style lang="scss">
    .loading-overlay{
        background-color: transparent;
        .wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            .block{
                width: 180px;
                height: 180px;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 10px;
            }
        }
    }
</style>
