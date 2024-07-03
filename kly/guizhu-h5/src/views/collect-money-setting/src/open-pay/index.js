import { uploaderFile } from '@/api/common.js'

// 文件上传
export const fileUploader = async (file) => {
    const files = []
    const formData = new FormData()
    formData.append('file', file.file)
    const res = await uploaderFile(formData)
    if (res.code === '200') {
        files.push({ url: res.data.url })
    }
    return files
}

export const CORPORATE_TYPE = {
    1: '企业',
    2: '个人',
    3: '个人工商户',
    4: '事业单位'
}
