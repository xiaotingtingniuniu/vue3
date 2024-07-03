import { defineStore } from "pinia";
import axios from "axios";
// export const useLoveTalkStore = defineStore('talk', {
//     actions: {
//         async getATalk() {
//             //连续解构赋值+重命名
//             const { data: { content: title } } = await axios.get("https://api.uomg.com/api/rand.qinghua?format=json");
//             const obj = {
//                 id: `00${this.list.length + 1}`,
//                 title
//             };
//             this.list.unshift(obj);
//         }
//     },
//     //真正存储数据的地方
//     state() {
//         return {
//             list: JSON.parse(localStorage.getItem('talkList')as string) || []
//         }
//     }
// })

//组合式写法
import {reactive} from 'vue'
export const useLoveTalkStore = defineStore('talk', ()=>{
    //reactive定义的list 相当于state中的数据
    const list = reactive(JSON.parse(localStorage.getItem('talkList')as string) || []);
    //getAtalk方法相 当于actions中的方法
    const getATalk = async()=> {
        //连续解构赋值+重命名
        const { data: { content: title } } = await axios.get("https://api.uomg.com/api/rand.qinghua?format=json");
        const obj = {
            id: `00${list.length + 1}`,
            title
        };
        list.unshift(obj);
    }
    return {list,getATalk}
});