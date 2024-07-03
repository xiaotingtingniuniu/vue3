# 恒生活业务中台

[点击访问接口地址](http://wiki.hengchang6.com/pages/viewpage.action?pageId=70350696)

### 用户数据管理: 
[点击访问产品文档](https://www.yuque.com/docs/share/91dc1e85-82ad-4d9b-9b82-bffeb8f39216#pl61O)
密码: xtg9

### 优惠券系统:
[点击访问产品文档](http://wiki.hengchang6.com/pages/viewpage.action?pageId=68283632)

# 恒生活业务中台
## 营销中台
> -优惠券批次列表 api/marketing/v1/coupon/batch/list (get)


```
优惠券批次详情(btn) /api/marketing/v1/coupon/batch (get)
券详情(btn) /api/marketing/v1/coupon/details/list (get)
新增(btn) /api/marketing/v1/coupon/batch (post)
编辑(btn) /api/marketing/v1/coupon/batch (put) /api/marketing/v1/coupon/batch (get)
提交审批*撤回申请*停止(btn) /api/api/marketing/v1/coupon/batch/status (put)
删除(btn) /api/marketing/v1/coupon/batch (delete)
审批(btn) /api/marketing/v1/coupon/batch/status (put)
导出(btn) /api/marketing/v1/coupon/details/export (post)
```
> -营销成本账户

> --账户列表 /api/marketing/v1/budget/list (get)
```
新建(btn) /api/marketing/v1/acct (post)
调整预算金额(btn) /api/marketing/v1/budget(post)
状态修改(关闭/启用)(btn) /api/marketing/v1/acct/status (put)
```

> --充值记录查询 /api/marketing/v1/budget/charge/list (get)
```
审核(通过/拒绝) /api/marketing/v1/budget/audit (put)
```
> --流水查询 /api/marketing/v1/acct/detail/list (get)

## 权限配置

> -组织管理 /permission/organization/list (get)  /permission/organization/detail (get)
```
新增 /permission/organization/create (post)
编辑 /permission/organization/modify (post)
```

> -角色管理 /permission/role/list (get)
```
新增 /permission/role/create (post) /permission/resource/detail (get) /permission/organization/list (get)
编辑 /permission/role/detail (get) /permission/role/modify (post) /permission/resource/detail (get)
详情 /permission/role/detail (get)
```

> -用户管理





## 用户数据管理

> -注册用户列表 /user/reg/user/list (get)

## 系统管理

> -字典配置 /api/marketing/v1/data/dict/list (get)
```
新增 /api/marketing/v1/data/dict (post)
编辑 /api/marketing/v1/data/dict (put)
发布 /api/marketing/v1/data/dict/release (put)
删除 /api/marketing/v1/data/dict (delete)
```

## 客服管理

> 工单列表 /admin/hshrefundorderinfo/queryList (get) -> 预制菜项目接口
```
查看详情 /admin/hshrefundorderinfo/queryInfo (post) -> 预制菜项目接口
```