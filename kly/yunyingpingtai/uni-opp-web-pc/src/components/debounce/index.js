/**
 * *****防抖****
 *
 * 在连续的操作中，无论进行了多长时间，
 * 只有某一次的操作后在指定的时间内没有再操作，这一次才被判定有效
 * @param fn
 * @param t
 * @returns {function(...[*]=)}
 * @constructor
 */
export const Debounce = function (fn, t) {
    const delay = t || 300
    let timer = null
    return function () {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments)
        }, delay)
    }
}

/**
   * ***节流****
   *
   * 一定时间内一定执行而且只执行一次。我们通常规定300ms执行一下的话，
   * 那不管你持续不断的点击，一到300ms就执行一次了。
   * 所以你持续不断的点击足够久的话，那就执行很多次了。
   * @param fn
   * @param delay
   * @returns {function(...[*]=)}
   * @constructor
   */
export const Throttle = function (fn, delay = 300) {
    let canRun = true // 通过闭包保存一个标记
    return function () {
        if (!canRun) return// 在delay时间内，直接返回，不执行fn
        canRun = false
        setTimeout(() => {
            fn.apply(this, arguments)
            canRun = true// 直到执行完fn,也就是delay时间后，打开开关，可以执行下一个fn
        }, delay)
    }
}

/**
   * @/utils/debounce
   * 函数防抖封装 **立即执行版本**
   * @param {*} fn 回调函数（事件处理逻辑）
   * @param {*} delay  延迟时间，默认1s
   */
export const debounce = (fn, delay = 1000) => {
    //  设置time为定时器，初始为 null
    let time = null
    return function () {
        // 定义一个firstClick，判断是否第一次执行，初始值为true
        const firstClick = !time
        const context = this
        const args = arguments
        // 第一次会立即执行
        if (firstClick) {
            fn.apply(context, args)
        }
        // 如果定时器存在清空定时器
        if (time) {
            clearTimeout(time)
        }
        // 设置定时器，此时firstClick会变为false，规定时间后time才会为null
        time = setTimeout(() => {
            time = null
        }, delay)
    }
}
