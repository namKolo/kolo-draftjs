/* Server - Demo how to editor state persistent on frontend
*/
import Koa from 'koa';
import KoaBody from 'koa-body';
import KoaCORS from '@koa/cors';
import Router from 'koa-router';
const serve = require('koa-static');
const multer = require('koa-multer');

const koa = new Koa();
const router = new Router();
const upload = multer({ dest: './uploads/' });
koa.use(
  KoaBody({
    jsonLimit: '1kb'
  })
);

koa.use(serve('.'));

koa.use(router.allowedMethods());
koa.use(KoaCORS());
/*
 in-memory storage
*/
let editorState = {};

router.get('/', async ctx => {
  ctx.body = 'It works';
});

/*
  Return current editor state  - routerlication/json format
*/
router.get('/state', async ctx => {
  ctx.body = editorState;
});

/*
  Client will call this endpoint to update current editor state
*/
router.post('/state', async ctx => {
  const body = ctx.request.body;
  editorState = body;
  ctx.body = {
    status: 'ok'
  };
});

router.post('/images', upload.single('image'), (ctx, next) => {
  ctx.status = 200;
  ctx.body = {
    id: ctx.req.file.filename
  };
});

koa.use(router.routes());
koa.listen(4000);
