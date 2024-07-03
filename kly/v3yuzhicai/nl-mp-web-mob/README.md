# nl-mp-web-mob
## 本地生活-会员平台-Web前端移动
> vue3 + setup sugar + vant3

### 脚本
```
# before run scripts
# copy file `.env.development.local.example` as `.env.development.local`
# configure env
```
```js
{
  "scripts": {
    "serve": "vue-cli-service serve",
    "build:test": "vue-cli-service build --mode test",
    "build:online": "vue-cli-service build --mode production",
    "lint": "vue-cli-service lint",
    "prepare": "husky install"
  }
}
```

### 目录结构
```js
├── public                  # 不需要打包的静态资源
│   └── favicon.ico
├── src
│   ├── api                 # 后台 API 接口封装
│   ├── assets              # 需要打包的静态资源
│   ├── components          # 公共组件
│   ├── composables         # 组合组件
│   ├── router              # 路由
│   ├── store               # Vuex 存储
│   ├── styles              # 样式
      └── variables.scss    # 全局 Sass 变量
      └── common.scss       # 全局公共样式
│     └── index.scss        # 组织统一导出
│   ├── utils               # 工具模块
│   ├── views               # 路由页面
│   ├── App.vue             # 根组件
│   └── main.js             # 入口模块
├── .gitignore
├── README.md
└── package.json
```

### Commit message type可选项

```js
<type>(<scope>): <subject>

# type用于说明 commit 的类别 只允许使用下面10个标识

- build:     对构建系统或者外部依赖项进行了修改
- ci:        对CI配置文件或者脚本进行了修改
- feat:      新功能（feature）
- fix:       修补bug
- docs:      文档（documentation）
- perf:      提高性能的代码更改
- style:     格式（不影响代码运行的变动 比如空格 格式化 分号）
- refactor:  重构（即不是新增功能，也不是修改bug的代码变动）
- test:      增加测试
- chore:     构建过程或辅助工具的变动
- revert:    还原
```
[ui地址](http://lanhu.hengchang6.com/url/bNzkl-cCHYK)


### app交互
```
Android jsFn

# 调用方式
window.jsHSH.showTitle()

# 设置标题内容
setTitle(String title)

# 显示 / 隐藏
showTitle() / hideTitle()

# 打开新开页
newPage(url)

# 关闭webview
closePage

# 返回
goBack

# 获取状态栏高度
getStatusBarHeight

# 支付成功通知app
paySuccess(orderNumber)

# 打开app登录页面
goLogin

# 打开app我的页面
goMine

# 从app获取token
getToken

# 通知app清除登录信息并弹出登录
tokenFailure

# 取 店铺信息 货柜信息
getStoreInfo
getCounterInfo

# 导航 路线规划
positionNavigation(addressInfo)

# 购物车数量更改了 通知app
changeCartCount

# 阅读协议点击确认 通知app
readProtocol

# 优惠券页面  去使用 按钮 -> 去首页了
useCoupon

# 获取优惠券列表
setCouponData({couponList, selectIndex} => {})

# 提交选择内容
getSelectCoupon({selectIndex, selectCoupon})


# 购物车 去逛逛 按钮
goBrowse

# 打开选择店铺
goSelectShop

# 购物车删除商品弹窗
deleteGoodsPopView
# js注册方法 => 购物车弹窗 确认删除商品
sureDeleteGoods

# 库存已达上限
stockReachedLimitPopView

# 货柜离线弹窗
containerOfflinePopView
# js注册方法 => 货柜离线点击 继续
continueContainerOffline

# 现场支付收银台回退
scenePayCashierBack

# 调用app扫码--默认无回调
scanQrcode 

# 调用app扫码--需要注册回调
scanQrcode_cb 

# js注册方法 => 扫码结果
scanQrcodeResult

# js注册方法 => app登陆成功
appLogin

# js注册方法 => 购物车页商品选中
homeCartAdd(goodsId=[])

# js注册方法 => 刷新购物车
refreshCart

# js注册方法 => h5回退页面 处理每个页面不同的回退效果
h5PageBack

# js安卓兼容 回退方案
goBack

# 检测支付渠道是否拥有
checkPayChannel('微信') return true/false


```

### 代码历史
```
1. 兼容微信环境 手机浏览器环境 安卓壳子
2. feature-20220316 兼容微信环境 手机浏览器环境  ios && Android 部分页面适配
```