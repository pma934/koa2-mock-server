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
  ctx.body = ctx.query['id']?mockPeople['peoples'][ctx.query['id']-1]:mockPeople['peoples']
})
router.get('/people/:id', async (ctx, next) => {
  ctx.body = mockPeople['peoples'][ctx.params['id']-1]
})

//image
const mockImage =  Mock.mock({
  "images|5000": [{
    'id|+1': 1,
    'title': '@title',
    'color': '@color',
    'cga': '@image(cga,@color,eeeeee,@title)',
    'vga': '@image(vga,@color,eeeeee,@title)',
    'svga': '@image(svga,@color,eeeeee,@title)',
    'wsvga': '@image(wsvga,@color,eeeeee,@title)',
    'xga': '@image(xga,@color,eeeeee,@title)',
    'wsxga': '@image(wsxga,@color,eeeeee,@title)',
    'wuxga': '@image(wuxga,@color,eeeeee,@title)',
  }]
});

router.get('/image', async (ctx, next) => {
  ctx.body = ctx.query['id']?mockImage['images'][ctx.query['id']-1]:mockImage['images']
})
router.get('/image/:id', async (ctx, next) => {
  ctx.body = mockImage['images'][ctx.params['id']-1]
})

//BasicData
const mockBasicData = Mock.mock({
  'list|5000': [{
    'id|+1': 1,
    'isBoolean': '@boolean(10, 0, true)',
    'naturalNumber': '@natural(1, 1000)',
    'integer': '@integer(0)',
    'float': '@float(1, 100, 3, 6)',
    'character': '@character("upper")',
    'string': '@string("lower", 5, 20)',
    'range': '@range(1, 10, 2)',
  }]
});
router.get('/basicData', async (ctx, next) => {
  ctx.body = mockBasicData['list']
})
router.get('/basicData/:id', async (ctx, next) => {
  ctx.body = mockBasicData['list'][ctx.params['id']-1]
})

const mockComplexData = Mock.mock({
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
router.get('/complexData', async (ctx, next) => {
  ctx.body = mockComplexData
})

router.post('/customImage', async (ctx, next) => {
  let postData = ctx.request.body
  let str = postData.str ? postData.str : "content"
  let height = postData.height ? postData.height : "500"
  let width = postData.width ? postData.width : "500"
  let bgc = postData.bgc ? postData.bgc : "#eee"
  let color = postData.color ? postData.color : "000"
  ctx.body = {
    'data': Mock.Random.image(width + 'x' + height, bgc, color, str)
  }
})

module.exports = router