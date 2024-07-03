//引入express 模块
// const express = require('express');
import express from 'express'
import cors from 'cors'
//创建express应用
const app = express();
//使用cors中间件来允许所有来源的请求
app.use(cors());
//定义Get接口
app.get('/api/data',(req,res)=>{
    //构造响应数据
    const data = {
        message:"Hellow,World!"
    };
    //发送数据
    res.json(data);
});
//监听端口并启动服务器
const port =process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
