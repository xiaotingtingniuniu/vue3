export const CryptoJS = require('crypto-js')
const pako = require('pako')

// AES192解密 -> 区分系统进行解密
export const decrypt = (word, keyStr) => {
    const key = CryptoJS.enc.Utf8.parse(keyStr)
    const decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
    return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

export const arrayBufferToBase64 = (array) => {
    array = new Uint8Array(array)
    var length = array.byteLength
    var table = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', '0', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '+', '/']
    var base64Str = ''
    for (var i = 0; length - i >= 3; i += 3) {
        var num1 = array[i]
        var num2 = array[i + 1]
        var num3 = array[i + 2]
        base64Str += table[num1 >>> 2] +
            table[((num1 & 0b11) << 4) | (num2 >>> 4)] +
            table[((num2 & 0b1111) << 2) | (num3 >>> 6)] +
            table[num3 & 0b111111]
    }
    var lastByte = length - i
    if (lastByte === 1) {
        var lastNum1 = array[i]
        base64Str += table[lastNum1 >>> 2] + table[((lastNum1 & 0b11) << 4)] + '=='
    } else if (lastByte === 2) {
        const lastNum1 = array[i]
        var lastNum2 = array[i + 1]
        base64Str += table[lastNum1 >>> 2] +
            table[((lastNum1 & 0b11) << 4) | (lastNum2 >>> 4)] +
            table[(lastNum2 & 0b1111) << 2] +
            '='
    }
    return base64Str
}

export const gzipaes = {
    // 构建WordArray对象
    buildWordArray: function (u8arr) {
        var len = u8arr.length
        var words = []
        for (var i = 0; i < len; i++) {
            words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8)
        }
        return CryptoJS.lib.WordArray.create(words, len)
    },
    wordArrayToInt8: function (array, length = array.length * 4) {
        var bin = new Int8Array(Math.min(array.length * 4, length))
        for (var i = 0; i < array.length; i++) {
            var num = array[i]
            if (num < 0) {
                num = array[i] + 0x100000000
            }
            bin[i * 4 + 0] = (num >>> 24) & 0xFF
            bin[i * 4 + 1] = (num >>> 16) & 0xFF
            bin[i * 4 + 2] = (num >>> 8) & 0xFF
            bin[i * 4 + 3] = (num >>> 0) & 0xFF
        }
        return bin
    },
    wordArrayToUint8: function (array, length = array.length * 4) {
        var bin = new Uint8Array(Math.min(array.length * 4, length))
        for (var i = 0; i < array.length; i++) {
            var num = array[i]
            if (num < 0) {
                num = array[i] + 0x100000000
            }
            bin[i * 4 + 0] = (num >>> 24) & 0xFF
            bin[i * 4 + 1] = (num >>> 16) & 0xFF
            bin[i * 4 + 2] = (num >>> 8) & 0xFF
            bin[i * 4 + 3] = (num >>> 0) & 0xFF
        }
        return bin
    },
    base64ToArrayBuffer: function (encrypted) {
        var data = CryptoJS.enc.Base64.parse(encrypted.toString())
        data = this.wordArrayToUint8(data.words)
        return data
    },
    aesEcbPkcs7Encrypt: function (srcdata, aeskey) {
        var data = this.buildWordArray(srcdata)// 加密字符串
        const key = CryptoJS.enc.Utf8.parse(aeskey)
        // 加密
        var encrypted = CryptoJS.AES.encrypt(data, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
        var retArray = new Int8Array(this.base64ToArrayBuffer(encrypted))
        return retArray
    },
    aesEcbPkcs7Decrypt: function (aesdata, aeskey) {
        var data = this.buildWordArray(aesdata)// 加密字符串
        const key = CryptoJS.enc.Utf8.parse(aeskey)
        // 加密
        var base64Str = CryptoJS.enc.Base64.stringify(data)
        var decrypted = CryptoJS.AES.decrypt(base64Str, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
        var retArray = []
        if (decrypted.sigBytes > 0) {
            retArray = this.wordArrayToUint8(decrypted.words, decrypted.sigBytes)
        }
        return retArray
    },
    // 压缩
    gzip: function (str) {
        var binaryString = pako.gzip(str, { to: 'string' })
        return binaryString
    },
    gunzip: function (binData) {
        var data = pako.inflate(new Uint8Array(binData))
        const key = String.fromCharCode.apply(null, new Uint16Array(data))
        return key
    }
}
