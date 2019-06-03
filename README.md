> ### 为什么要搭建mock server？

1.与线上环境一致的接口地址，每次构建前端代码时不需要修改调用接口的代码

2.不同于使用mock直接拦截ajax请求，使用mock server能更好的模拟 POST、GET 请求（在控制台的Network选项页能看到真实的ajax请求信息）

3.mock 数据可以由工具生成不需要自己手动写，同时可以灵活的修改接口数据来适应开发

> ### 1.创建koa2项目

1. 安装 koa-generator脚手架

`npm install koa-generator -g`

2. 一键生成koa2项目

`koa2 xxx` 

3. 安装依赖

`npm install`

生成的koa2项目目录如下

```
xxx/
|
+——bin/
|   |
|   +—— www     程序入口
|
+——public/      静态资源
|   |
|   +—— image/   
|   +—— javascripts/
|   +—— stylesheets/
|
+——routes/      路由配置
|   |
|   +—— index.js
|   +—— users.js
|
+——views/       页面模板引擎
|   |
|   +—— error.pug
|   +—— index.pug
|   +—— 
|
+——app.js       使用koa的js
|
+——package.json
```
**bin/www** 是入口文件，打开端口监听(默认3000)，启动koa服务

**app.js** 是使用koa的js，里面已经配置好了，解析http请求、使用静态资源、log埋点、使用路由等中间件。

> ### 2.搭建mock server

1. 安装mockjs

`npm install mockjs --save`

2. 在routes中创建一个mockapi.js文件 (mockapi是名字，可以自己随便起)
```
const router = require('koa-router')()
const Mock = require('mockjs')

router.prefix('/mockapi')   //路由路径

//ctx.params 路由传值
//ctx.query  参数传值
//ctx.request.body Post参数

//people
const mockPeople = Mock.mock({
  'peoples|5000': [{
    'id|+1': 1,
    'guid': '@guid',
    'name': '@cname',
    'age': '@integer(20, 50)',
    'birthday': '@date("MM-dd")',
    'address': '@county(true)',
    'email': '@email',
  }]
});
router.get('/people', async (ctx, next) => {
  ctx.body = ctx.query['id'] ? mockPeople['peoples'][ctx.query['id'] - 1] : mockPeople['peoples']
})

router.get('/people/:id', async (ctx, next) => {
  ctx.body = mockPeople['peoples'][ctx.params['id'] - 1]
})

router.post('/people', async (ctx, next) => {
  let postData = ctx.request.body
  let id = postData.id ? postData.id : 1
  ctx.body = mockPeople['peoples'][id - 1]
})

module.exports = router
```
3. 在app.js里使用上面创建的路由
```
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
const mockapi = require('./routes/mockapi')         //<--引用模块

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(mockapi.routes(), mockapi.allowedMethods()) //<--配置路由

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
```

完成上述步骤之后，你就成功搭建了一个mock server了。

使用`npm start`启动程序后，可以使用postman测试一下效果

#### **get 请求**
![MK$F~WBEC XD6OOO$00{XH0](https://user-images.githubusercontent.com/44082279/58771584-99748280-85e7-11e9-9631-c2b95b8bf965.png)
![B@{{(Q{8WD $O3Q%G}CYRM4](https://user-images.githubusercontent.com/44082279/58771586-9b3e4600-85e7-11e9-8f02-357aef2b2cba.png)
#### **post 请求**
![{LOQPE~F$A2}}4R@2J7 {K](https://user-images.githubusercontent.com/44082279/58771587-9da0a000-85e7-11e9-9e19-3cd25d3c8117.png)

> ### 3.more
虽然到上面mock server的搭建就结束了，但是你还可以做一些事情。
比如:

- 编写更多的mock数据接口，和一下常用接口
- 编写pug模板，让你的mock server有一个好看的首页
- 安装nodemon，使用nodemon启动mock server,使拥有热更新的能力
- 使用pm2将其部署到服务器上


> 我的mockApi：http://www.coolan.win:3333/mockapi

> 项目github：https://github.com/pma934/koa2-mock-server
