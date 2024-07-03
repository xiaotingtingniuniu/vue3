const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { VantResolver } = require('unplugin-vue-components/resolvers')
const VConsolePlugin = require('vconsole-webpack-plugin')
const path = require('path')

function resolve (dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    productionSourceMap: false,
    publicPath: '/',
    devServer: {
        compress: true,
        host: '0.0.0.0',
        port: 8097,
        https: true,
        disableHostCheck: true,
        proxy: {
            '/ws': {
                target: 'https://apis.map.qq.com'
            },
            '/api': {
                target: 'https://test-nl-mp-gateway.taohuayuan-cq.com/',
                // target: 'http://mp-gateway.k8stest.hengchang6.com/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/orderApi': {
                target: 'http://nl-mp-java-service-order.test.hcinner/',
                changeOrigin: true,
                pathRewrite: {
                    '^/orderApi': ''
                }
            },
            '/fissionApi': {
                // target: 'http://172.23.24.55:8094/',
                target: 'http://172.23.24.53:8091/',
                changeOrigin: true,
                pathRewrite: {
                    '^/fissionApi': ''
                }
            }
        }
    },
    configureWebpack: config => {
        const envType = process.env.NODE_ENV !== 'production1'
        const vConsole = new VConsolePlugin({
            filter: [],
            enable: envType
        })
        const plugin = [
            AutoImport({
                imports: ['vue', 'vuex', 'vue-router'],
                resolvers: [VantResolver()],
                eslintrc: {
                    enabled: true,
                    filepath: './.eslintrc-auto-import.json',
                    globalsPropValue: true
                }
            }),
            Components({
                dirs: ['src/components/'],
                extensions: ['vue', 'md'],
                resolvers: [VantResolver()]
            }),
            vConsole
        ]
        config.plugins = [...config.plugins, ...plugin]
    },
    chainWebpack (config) {
        const oneOfsMap = config.module.rule('scss').oneOfs.store
        oneOfsMap.forEach((item) => {
            item
                .use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    hoistUseStatements: true,
                    resources: './src/styles/variables.scss'
                })
                .end()
        })
        config.resolve.alias
            .set('@', resolve('./src'))
            .set('@assets', resolve('src/assets'))
            .set('@styles', resolve('src/styles'))
            .set('@utils', resolve('src/utils'))
            .set('@views', resolve('src/views'))
            .set('@api', resolve('src/api'))
    }
}
