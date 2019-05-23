const router = require('koa-router')()
const Mock = require('mockjs')
var data = Mock.mock({
  'list|1-10': [{
    'id|+1': 1
  }]
})

router.prefix('/mockapi')

router.get('/', async (ctx, next) => {
  await ctx.render(
    'mockapi', {
      title: 'Hello Koa 2!'
    }
  )
})

//ctx.params 路由传值
//ctx.query  参数传值

//生成min-max颗星星，min默认为1，max默认为5
router.get('/star', async (ctx, next) => {
  let min = ctx.query.min ? +ctx.query.min : 1
  let max = ctx.query.max ? +ctx.query.max : 5
  let r = Math.abs(Math.round(Math.random() * (max - min) + min))
  ctx.body = {
    "star": Array(r).fill("★").join("")
  }
})

//生成regexp
router.get('/regexp', async (ctx, next) => {
  let regstr = ctx.query['regexp']
  if (regstr === undefined) {
    await ctx.response.redirect('/mockapi/regexp?regexp=');
  } else {
    regstr = regstr.match(/^\/(.*)\/([igm]?)$/)
    ctx.body = regstr ? Mock.mock({
      'regexp': RegExp(regstr[1], regstr[2])
    }) : {
      'regexp': '请输入正确的正则表达式'
    }
  }
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router