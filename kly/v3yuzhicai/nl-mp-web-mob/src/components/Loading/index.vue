<template>
    <van-overlay class="loading-overlay" :show="true" z-index="1000">
        <div class="wrapper" @click.stop>
            <van-loading class="block" color="#F16542" vertical size="24px">加载中...</van-loading>
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
                background-color: rgba(0, 0, 0, 0);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 10px;
            }
        }
    }
</style>
