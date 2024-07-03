<template>
    <div class="notice">
        <h1 class="hosname">{{ hospitalStore.hospitalInfo.hospital?.hosname }}预约挂号须知</h1>
        <div class="top">
            为方便您早日就医康复，请您认真阅读预约挂号须知：
        </div>
        <div class="info">
            <div class="tip">
                一、预约实名制：
            </div>
            <div class="text">
                统一平台电话预约和网上预约挂号均采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效证件号（身份证）统一平台电话预约和网上预约挂号均采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效证件号（身份证）统一平台电话预约和网上预约挂号均采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效证件号（身份证）
            </div>
        </div>
        <div class="info">
            <div class="tip">
                二、预约实名制：
            </div>
            <div class="text">
                统一平台电话预约和网上预约挂号均采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效证件号（身份证）统一平台电话预约和网上预约挂号均采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效证件号（身份证）统一平台电话预约和网上预约挂号均采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效证件号（身份证）
            </div>
        </div>
        <div class="info">
            <div class="tip">
                三、预约实名制：
            </div>
            <div class="text">
                统一平台电话预约和网上预约挂号均采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效证件号（身份证）统一平台电话预约和网上预约挂号均采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效证件号（身份证）统一平台电话预约和网上预约挂号均采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效证件号（身份证）
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
//引入医院详情的仓库数据进行展示
import useDetailStore from '@/store/modules/hospitalDetail'
const hospitalStore = useDetailStore();
console.log('hospitalStore', hospitalStore);
</script>

<style scoped lang="scss">
.notice {
    .hosname {
        font-size: 30px;
        text-align: center;
    }

    .top {
        margin: 10px 0;
        color: #7f7f7f;
    }
    .info{
        .tip{
            color:red;
            font-weight: 900;
        }
        .text{
            color:#7f7f7f;
            margin:10px 0;
            line-height: 23px;
        }
    }
}
</style>