<template>
    <div class="bottom">
        <div class="content">
            <div class="left">
                <p>京ICP备 13018369号 电话挂号010-56253825</p>
            </div>
            <div class="right">
                <span>联系我们</span>
                <span>合作伙伴</span>
                <span>用户协议</span>
                <span>隐私协议</span>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts' name="HospitalBottom">

</script>

<style scoped lang="scss">
.bottom {
    width: 100%;
    height: 50px;
    background-color: #f0f2f5;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: center;

    .content {
        width: 1200px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size:12px;
        .right {
            span {
                margin: 0 5px;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
    }
}</style>