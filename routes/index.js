const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.response.redirect('/mockapi');
})

module.exports = router