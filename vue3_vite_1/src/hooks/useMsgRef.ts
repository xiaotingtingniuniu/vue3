import { customRef } from "vue";
export default (initValue:string,delay:number) => {
    let timer:number
    // track(跟踪)、trigger(触发)
    const msg = customRef((track, tragger) => {
        return {
            //每当读取msg时都会调用
            get() {
                console.log('get');
                track();//告诉Vue数据msg很重要，你要对msg进行持续关注，一旦msg变化就去更新
                return initValue
            },
            //每当修改msg时都会调用
            set(value) {
                clearTimeout(timer);//防抖
                timer = setTimeout(() => {
                    initValue = value;
                    tragger();//通知Vue一下数据msg变化了
                }, delay)
            }
        }
    });
    return {msg}
}