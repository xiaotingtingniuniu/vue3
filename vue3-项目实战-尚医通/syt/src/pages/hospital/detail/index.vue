<template>
    <div class="detail">
        <!-- 医院名字与医院等级的结构 -->
        <div class="top">
            <div class="name">
                {{ hospitalStore.hospitalInfo.hospital?.hosname }}
            </div>
            <div class="level">
                <i class="iconfont icon-dianzan"></i>
                <span>{{ hospitalStore.hospitalInfo.hospital?.param.hostypeString }}</span>
            </div>
        </div>
        <!-- 医院的logo与路线 -->
        <div class="logo">
            <div class="left">
                <img :src="`data:image/ipeg;base64,${hospitalStore.hospitalInfo.hospital?.logoData}`" alt="">
            </div>
            <div class="right">
                <div class="address">
                    <i class="iconfont icon-Location"></i>
                    <span>具体地址：{{ hospitalStore.hospitalInfo.hospital?.param.fullAddress }}</span>
                </div>
                <div class="route">
                    规划路线：{{ hospitalStore.hospitalInfo.hospital?.route }}
                </div>
            </div>
        </div>
        <!-- 医院介绍 -->
        <div class="footer">
            <h1>医院介绍</h1>
            <p>
               {{ hospitalStore.hospitalInfo.hospital?.intro }}
            </p>
        </div>
    </div>
</template>

<script setup lang='ts'>
import '@/style/icon.scss'
// 获取医院详情的仓库数据进行展示
import useDetailStore from '@/store/modules/hospitalDetail'
const hospitalStore = useDetailStore();
console.log('hospitalStore',hospitalStore);
</script>

<style scoped lang="scss">
.detail{
    .top{
        display: flex;
        align-items: center;
        .name{
            font-size: 30px;
            font-weight: 900;
        }
        .level{
            line-height: 30px;
            margin-left:10px;
            color:#7f7f7f;
            span{
                margin-left:5px;
            }
        }
    }
    .logo{
        display: flex;
        flex-direction: row;
        margin-top:20px;
        .left{
            width: 80px;
            height:80px;
            img{
                width:100%;
                height:100%;
                border-radius: 50%;
            }
        }
        .right{
            flex:1;
            color:#7f7f7f;
            margin-left:10px;
            div{
                margin:10px 0;
            }
        }
    }
    .footer{
        color:#7f7f7f;
        margin-top:20px;
        h1{
            font-size: 20px;
        }
        p{
            line-height: 30px;
            margin-top:10px;
        }
    }
}
</style>