<template>
    <div class="tip">
        <!-- 常见科室的结构 -->
        <div class="deparment">
            <div class="header">
                <div class="left">
                    <i class="iconfont icon-icon"></i>
                    <span>常见科室</span>
                </div>
                <div class="right">
                    <span>全部</span>
                    <i class="iconfont icon-jiantou"></i>
                </div>
            </div>
            <div class="content">
                <ul>
                    <li>神经内科</li>
                    <li>消化内科</li>
                    <li>呼吸内科</li>
                    <li>内科</li>
                    <li>神经外科</li>
                    <li>妇科</li>
                    <li>产科</li>
                    <li>儿科</li>
                </ul>
            </div>
        </div>
        <!-- 平台公告 -->
        <div class="notice">
            <div class="header">
                <div class="left">
                    <i class="iconfont icon-yunpingtai"></i>
                    <span>平台公告</span>
                </div>
                <div class="right">
                    <span>全部</span>
                    <i class="iconfont icon-jiantou"></i>
                </div>
            </div>
            <div class="content">
                <ul>
                    <li>关于延长北京大学国际医院放假的通知</li>
                    <li>北京中医药大学东方医院部分科室医生门诊</li>
                    <li>武警总医院号源暂停更新通知</li>
                </ul>
            </div>
        </div>
        <!-- 停诊公告 -->
        <div class="notice">
            <div class="header">
                <div class="left">
                    <i class="iconfont icon-tingzhenxinxi"></i>
                    <span>停诊公告</span>
                </div>
                <div class="right">
                    <span>全部</span>
                    <i class="iconfont icon-jiantou"></i>
                </div>
            </div>
            <div class="content">
                <ul>
                    <li>中国人民解放军总医院第六医学中心(原海军总医院)呼吸内科门诊停诊公告</li>
                    <li>首都医科大学附属北京潞河医院老年医学科门诊停诊公告</li>
                    <li>中日友好医院中西医结合心内科门诊停诊公告</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import './icon.scss'
</script>

<style scoped lang="scss">
.icon-icon{
    color: #13227a;
}
.icon-yunpingtai{
   color:red;
}
.icon-tingzhenxinxi{
    color:#d81e06;
}

.tip {
    color: #7f7f7f;

    .deparment {
        .header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .left {
                span {
                    margin-left: 5px;
                }
            }
        }

        .content {
            ul {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                li{
                    width:40%;
                    margin-top:20px;
                }
            }

        }
    }
    .notice{
        margin-top:20px;
        .header{
            display: flex;
            justify-content: space-between;
        }
        .content{
            margin-top:20px;
            ul{
                list-style-type: disc;
                li{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-top:10px;
                }
            }
        }
    }

}
</style>