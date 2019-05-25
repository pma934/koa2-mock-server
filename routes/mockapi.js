const router = require('koa-router')()
const Mock = require('mockjs')

router.prefix('/mockapi')

router.get('/', async (ctx, next) => {
  await ctx.render(
    'mockapi', {
      title: 'mockapi',
      location: ctx.host
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

router.get('/people', async (ctx, next) => {
  ctx.body = Mock.mock({
    'peoples|500': [{
      'id|+1': 1,
      'guid': '@guid',
      'name': '@cname',
      'age': '@integer(20, 50)',
      'birthday': '@date("MM-dd")',
      'address': '@county(true)',
      'email': '@email',
    }]
  });
})

router.get('/dataImage', async (ctx, next) => {
  let n = isNaN(Math.floor(ctx.query['amount'])) ? 20 : Math.floor(ctx.query['amount'])
  n = Math.min(Math.max(1, n), 500)
  ctx.body = {
    "list": Array(n).fill().map((_, index) => {
      return {
        'id': index + 1,
        'data': Mock.Random.dataImage()
      }
    })
  }
})

router.get('/image', async (ctx, next) => {
  let n = isNaN(Math.floor(ctx.query['amount'])) ? 2000 : Math.floor(ctx.query['amount'])
  n = Math.min(Math.max(1, n), 5000)
  ctx.body = {
    "list": Array(n).fill().map((_, index) => {
      return {
        'id': index + 1,
        'data': Mock.Random.image()
      }
    })
  }
})

router.get('/basicData', async (ctx, next) => {
  ctx.body = Mock.mock({
    'list|500': [{
      'id|+1': 1,
      'isBoolean': '@boolean(10, 0, true)', //百分之百的true
      'naturalNumber': '@natural(1, 1000)', //大于等于零的整数
      'integer': '@integer(0)', //随机整数
      'float': '@float(1, 100, 3, 6)', //随机浮点数, 
      'character': '@character("upper")', //一个随机字符
      'string': '@string("lower", 5, 20)', //一串随机字符串
      'range': '@range(1, 10, 2)', //一个整形数组，步长为2
    }]
  });
})

router.get('/complexData', async (ctx, next) => {
  ctx.body = Mock.mock({
    'countries|4-6': [{
      'id|+1': 1,
      'area': '@integer(100)',
      'country': '@ctitle(1, 3)' + '国',
      'provinces|7-9': [{
        'id|+1': 1,
        'province': '@cword(2, 3)' + '省',
        'cities|4-6': [{
          'id|+1': 1,
          'city': '@ctitle(2, 3)' + '市',
          'peoples|5-15': [{
            'id|+1': 1,
            'guid': '@guid',
            'name': '@cname',
            'age': '@integer(20, 50)',
            'birthday': '@date("MM-dd")',
            'email': '@email',
          }]
        }]
      }]
    }]
  });
})

router.post('/image', async (ctx, next) => {
  let str = ctx.header.str ? ctx.header.str : "Post"
  let hight = ctx.header.hight ? ctx.header.hight : "500"
  let width = ctx.header.width ? ctx.header.width : "500"
  let bgc = ctx.header.bgc ? ctx.header.bgc : "#eee"
  let color = ctx.header.color ? ctx.header.color : "000"
  ctx.body = {
    'data': Mock.Random.image(width + 'x' + hight, bgc,color, str)
  }
})

module.exports = router