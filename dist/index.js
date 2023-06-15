import http from 'http';
import https from 'https';
import { koaBody } from 'koa-body';
import Koa from 'koa';
import { router } from './routes/routes';
const HTTP_PORT = 3000;
const HTTPS_PORT = 13000;
const app = new Koa();
app.use(koaBody());
app
    .use(router.routes())
    .use(router.allowedMethods());
http.createServer(app.callback())
    .listen(HTTP_PORT, () => {
    console.log(`app http is running on port ${HTTP_PORT}.`);
});
https.createServer(app.callback())
    .listen(HTTPS_PORT, () => {
    console.log(`app http is running on port ${HTTPS_PORT}.`);
});
//# sourceMappingURL=index.js.map