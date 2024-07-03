<template>
   <div class="news">
    <!-- 导航区 -->
     <ul>
        <li v-for="item in newsList" :key="item.id">
            <button @click="showDetail(item)">查看详情</button>
            <RouterLink 
              :to="{
                name:'xiang',//这里不能是parth路径
                params:{
                    id:item.id,
                    title:item.title,
                    content:item.content
                }
              }" 
              active-class="active"
              >{{ item.title }}</RouterLink>
        </li>
     </ul>
     <!-- 展示区 -->
     <div class="news-content">
        <RouterView></RouterView>
     </div>
   </div>
</template>
<script setup lang="ts" name="News">
import {reactive,onMounted} from 'vue'
import { RouterView,useRouter } from 'vue-router';
const newsList = reactive([
    {id:"asdf001",title:"如何学习",content:"通过网站"},
    {id:"asdf002",title:"如何上学",content:"父母接送"},
    {id:"asdf003",title:"最好吃的食物",content:"包子"},
    {id:"asdf004",title:"最不喜欢的事",content:"别人骂你"},
    {id:"asdf005",title:"你的最爱",content:"好吃的，好玩的，好看的"},
]);
const router = useRouter();
interface NewsInter{
    id:string,
    title:string,
    content:string
}
const showDetail = (item:NewsInter)=>{
    console.log('item',item);
    router.push({
        name:"xiang",
        params:{
            id:item.id,
            title:item.title,
            content:item.content
        }
    });
}
onMounted(()=>{
    showDetail(newsList[0]);
})
</script>
<style scoped lang="scss">
.news{
    display: flex;
    flex-wrap: wrap;
    justify-content:flex-start;
    ul{
        width: 30%;
        .active{
            color: red;
        }
    }
    .news-content{
        width: 70%;
    }
}
</style>