# moapi-server
>mock平台[moapi在线平台](http://moapi.yfyld.top)服务端代码

## 后端架构
  - Koa2
  - MongoDB
  - Mongoose

## 环境
* node 8.9.0+
* mongodb 3.4+
* pm2

## 安装
```bash
npm i
```

## 启动
```bash
npm run dev //开发
npm run prd //生产
```

## 目录结构

```hash
├── app.js  //入口
├── base    //基础类
├── config  //配置
├── controllers   //
├── defaultData   //默认值
├── index.js
├── logs
├── middlewares   //中间件
├── models
├── package.json
├── public  //静态资源
├── routes
├── uploads //上传资源
├── util
└── views  //ejs
```

## 功能介绍
* 项目,接口,模块,记录,备注,用户,文档等增删改查存
* 权限控制
* mock数据转markdown
* mock数据转html

## 中间件
* `check.js` 登录检查
* `koa-camelcase` 上行驼峰转中划线 下行中划线转驼峰(偷懒型中间件,勿学)
* `record.js` 记录中间件
* `validate.js` 接口参数验证
