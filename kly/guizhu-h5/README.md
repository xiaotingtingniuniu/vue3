## 柜主平台

> 2021.12.18-2021.12.24

[商城登录接口](http://wiki.hengchang6.com/pages/viewpage.action?pageId=65871007)

[商品、店铺接口](http://wiki.hengchang6.com/pages/viewpage.action?pageId=65871002)

[收货地址](http://wiki.hengchang6.com/pages/viewpage.action?pageId=65867521)

[订单列表](http://wiki.hengchang6.com/pages/viewpage.action?pageId=65867427)

[进货车相关](http://wiki.hengchang6.com/pages/viewpage.action?pageId=65867916)

[ui地址](http://lanhu.hengchang6.com/web/#/item/project/stage?pid=cb5dcadf-4a9c-4150-9518-2e77a21fc044&image_id=88ec06a0-5a9a-460e-80df-f3374919204b)

[ui参考地址](http://lanhu.hengchang6.com/web/#/item/project/stage?type=share_mark&pid=a7fafc23-21ef-4d7b-a7fe-15007d3722ad&activeSectionId=&toRouteName=ItemProjectEditor&teamId=f735d86f-3669-4a39-b209-f470c25a9dac&param=none)

[需求地址](http://wiki.hengchang6.com/pages/viewpage.action?pageId=65865560)

[选品类目](http://hsh-goods-api.test.hcinner/hsh-goods-api/category/listAll)

[测试用例地址](http://wiki.hengchang6.com/pages/viewpage.action?pageId=61841760)

[恒小花-0518H5收银台对接](http://wiki.hengchang6.com/pages/viewpage.action?pageId=37073575)

```js
# 需要用到的 host 配置
10.150.23.51 	        hsh-goods-api.test.hcinner
10.150.23.51 			hsh-omp-admin.test.hcinner
10.150.23.51 			hsh-cm-api.test.hcinner
10.150.23.51            hsh-guizhu-api.test.hcinner



# 开发本地运行项目 将 .env.development.local.example 文件拷贝为 .env.development.local 文件 修改相关变量即可
```

### vant按需引入
```
需要在`src/plugins/vant`目录中新增需要使用的组件
```

[线上访问地址](http://hsh-guizhu-h5.test.hcinner)
[测试访问地址](http://hsh-guizhu-h5.test.hcinner)

```
js -> 原生
getStatusBarHeight    回调高度给h5
bindAlipay            拉起支付宝授权

原生 -> js
setAlipayAuthCode     authCode给到h5
```