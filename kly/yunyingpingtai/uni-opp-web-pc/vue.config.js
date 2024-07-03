module.exports = {
    productionSourceMap: false,
    publicPath: '/',
    devServer: {
        hotOnly: false,
        compress: true,
        host: '0.0.0.0',
        port: 3000,
        https: true,
        disableHostCheck: true,
        proxy: {
            '/hsh-guizhu-merchant-api': {
                target: 'https://test-customer.hengshenghuo.com/ben-api',
                changeOrigin: true,
                pathRewrite: { '^/hsh-guizhu-merchant-api': '' }
            },
            '/zt-upload': {
                target: 'https://test-goods-domain-inner.hengshenghuo.com/',
                changeOrigin: true,
                pathRewrite: { '^/zt-upload': '' }
            },
            '/api': {
                target: 'https://uo-uw-test.hengshenghuo.com/',
                changeOrigin: true,
                pathRewrite: { '^/api': '' }
            },
            '/yzc-api': {
                target: 'https://test-nl-smp-wp.taohuayuan-cq.com/api',
                changeOrigin: true,
                pathRewrite: { '^/yzc-api': '' }
            },
            '/GJ': {
                target: 'http://172.23.44.109:8080/',
                changeOrigin: true,
                pathRewrite: { '^/GJ': '' }
            },
            '/ws': {
                target: 'https://apis.map.qq.com',
                changeOrigin: true
            }
        }
    },
    chainWebpack (config) {
        config.plugins.delete('prefetch')
        config.entry('main').add('babel-polyfill')
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
        config.optimization.splitChunks({
            cacheGroups: {
                vendor: {
                    chunks: 'all',
                    test: /node_modules/,
                    name: 'vendor',
                    minChunks: 1,
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 100
                },
                common: {
                    name: 'chunk-common', // 打包后的文件名
                    chunks: 'initial', //
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 1,
                    reuseExistingChunk: true
                },
                vendors: {
                    name: 'chunk-vendors',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    priority: 2,
                    reuseExistingChunk: true,
                    enforce: true
                },
                axios: {
                    name: 'axios',
                    test: /[\\/]node_modules[\\/]axios[\\/]/,
                    chunks: 'initial',
                    priority: 3,
                    reuseExistingChunk: true,
                    enforce: true
                },
                babel: {
                    name: 'babel',
                    test: /[\\/]node_modules[\\/]@*babel[\\/]/,
                    chunks: 'initial',
                    priority: 3,
                    reuseExistingChunk: true,
                    enforce: true
                },
                vue: {
                    name: 'vue',
                    test: /[\\/]node_modules[\\/]@*vue[\\/]/,
                    chunks: 'initial',
                    priority: 3,
                    reuseExistingChunk: true,
                    enforce: true
                },
                vueRouter: {
                    name: 'vue-router',
                    test: /[\\/]node_modules[\\/]vue-router[\\/]/,
                    chunks: 'initial',
                    priority: 3,
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        })
    }
}
