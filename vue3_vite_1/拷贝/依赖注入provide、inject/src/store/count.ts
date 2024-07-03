import { defineStore } from "pinia";
// export const useCountStore = defineStore('count',{
//     //actions里面放置的是一个一个的方法，用于响应组件中的“动作”
//     actions:{
//         //加法方法
//         increment(value:number){
//             //this是当前的store
//             console.log(this.sum);
//             this.sum +=value;
//         }
//     },
//     //真正存储数据的地方
//     state(){
//         return {
//             sum:6
//         }
//     },
//     //对数据不满意，处理数据
//     getters:{
//         bigSum:state=>state.sum*10,
//     }
// })


//组合式写法
import {ref,computed} from 'vue'
export const useCountStore = defineStore('count',()=>{
    //相当于state
    const sum = ref(6);
    //相当于actions
    const increment=(value:number)=>{
        //this是当前的store
        console.log(sum.value);
        sum.value +=value;
    };
    //使用computed来代替getters
    const bigSum=computed(()=>{
        return (sum.value)*10
    })
    return{sum,increment,bigSum}
})
