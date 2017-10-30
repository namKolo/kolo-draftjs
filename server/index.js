/* Server - Demo how to editor state persistent on frontend
*/
import Koa from 'koa';
import KoaBody from 'koa-body';
import KoaCORS from '@koa/cors';
import Router from 'koa-router';

const koa = new Koa();
const app = new Router();

koa.use(
  KoaBody({
    jsonLimit: '1kb',
  }),
);

koa.use(app.allowedMethods());
koa.use(KoaCORS());
/*
 in-memory storage
*/
let editorState = {};

app.get('/', async ctx => {
  ctx.body = 'It works';
});

/*
  Return current editor state  - application/json format
*/
app.get('/state', async ctx => {
  ctx.body = editorState;
});

/*
  Client will call this endpoint to update current editor state
*/
app.post('/state', async ctx => {
  const body = ctx.request.body;
  editorState = body;
  ctx.body = {
    status: 'ok',
  };
});

koa.use(app.routes());
koa.listen(4000);
