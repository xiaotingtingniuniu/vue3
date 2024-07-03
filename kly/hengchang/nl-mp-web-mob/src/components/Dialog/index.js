import { h, render } from 'vue'
import HshDialog from '@/components/Dialog/Dialog.vue'

const container = document.querySelector('body')
const close = () => render(null, container)

const Dialog = (options) => {
    return new Promise((resolve, reject) => {
        const callback = (action) => (action === 'right' ? resolve : reject)(action)
        const vnode = h(HshDialog, { ...options, onClose: close, callback })
        render(vnode, container)
    })
}
Dialog.close = () => render(null, container)

export default Dialog
