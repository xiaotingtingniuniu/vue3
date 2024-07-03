require('events').EventEmitter.defaultMaxListeners = 0
const VConsolePlugin = require('vconsole-webpack-plugin')
const path = require('path')

function resolve (dir) {
    return path.join(__dirname, dir)
}
// port: 8060,
module.exports = {
    productionSourceMap: false,
    publicPath: '/',
    devServer: {
        compress: true,
        host: '0.0.0.0',
        port: 8060,
        disableHostCheck: true,
        proxy: {
            '/hshpdf': {
                target: 'https://hsh-native-life-test-1309143854.cos.ap-beijing.myqcloud.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/hshpdf': ''
                }
            },
            '/hcpdf': {
                target: process.env.VUE_APP_LAYOUT_BASEURL_PDF,
                changeOrigin: true,
                pathRewrite: {
                    '^/hcpdf': ''
                }
            },
            '/fsApi': {
                target: process.env.VUE_APP_FSAPI_PDF,
                changeOrigin: true,
                pathRewrite: {
                    '^/fsApi': ''
                }
            },
            '/hzgApi': {
                target: 'http://hsh-guizhu-api.test.hcinner/hsh-guizhu-api/',
                // target: 'http://hsh-guizhu-api.pbsk8s.hcinner/hsh-guizhu-api/', // 线上
                // target: 'http://172.23.24.148:8080/hsh-guizhu-api/',
                changeOrigin: true,
                pathRewrite: {
                    '^/hzgApi': ''
                }
            },
            '/v1': {
                target: process.env.VUE_APP_LAYOUT_BASEURL_V1,
                changeOrigin: true,
                pathRewrite: {
                    '^/v1': ''
                }
            },
            '/wx-api': {
                target: 'https://api.weixin.qq.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/wx-api': ''
                }
            },
            '/trackingApi': {
                target: 'http://test-tracking.hengshenghuo.com/',
                changeOrigin: true,
                pathRewrite: {
                    '^/trackingApi': ''
                }
            },
            // '/LD': {
            //     target: 'http://172.23.40.17:8080/hsh-guizhu-api/',
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '^/LD': ''
            //     }
            // },
            // 刘丹本地
            '/LDApi': {
                target: 'http://172.23.40.17:8080/hsh-guizhu-api/',
                changeOrigin: true,
                pathRewrite: {
                    '^/LDApi': ''
                }
            },
            // 东阳本地
            '/WDYApi': {
                target: 'http://172.23.44.40:8080/hsh-guizhu-api/',
                changeOrigin: true,
                pathRewrite: {
                    '^/WDYApi': ''
                }
            },
            // mock地址
            '/mockApi': {
                target: 'https://console-mock.apipost.cn/mock/f9b5b73f-dcec-4086-ae2f-91f1573cb726/hsh-guizhu-api/',
                changeOrigin: true,
                pathRewrite: {
                    '^/mockApi': ''
                }
            }
        }
    },
    configureWebpack: config => {
        config.output.libraryExport = 'default'
        const envType = process.env.NODE_ENV !== 'production'
        const vConsole = new VConsolePlugin({
            filter: [],
            enable: envType
        })
        const pluginsDev = [vConsole]
        config.plugins = [...config.plugins, ...pluginsDev]
    },
    chainWebpack (config) {
        // const oneOfsMap = config.module.rule('scss').oneOfs.store
        // oneOfsMap.forEach((item) => {
        //     item
        //         .use('sass-resources-loader')
        //         .loader('sass-resources-loader')
        //         .options({
        //             hoistUseStatements: true,
        //             resources: './src/styles/variables.scss'
        //         })
        //         .end()
        // })
        config.resolve.alias
            .set('@', resolve('./src'))
            .set('@assets', resolve('src/assets'))
            .set('@styles', resolve('src/styles'))
            .set('@utils', resolve('src/utils'))
            .set('@views', resolve('src/views'))
            .set('@api', resolve('src/api'))
    }
}
