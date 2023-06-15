import Router from '@koa/router';
import { getAllUsers, getUserById } from '../controllers/users';
export const router = new Router();
router.get('/', (ctx) => {
    ctx.body = "Hello world";
});
router.get('/users', async (ctx) => {
    try {
        const userList = await getAllUsers(ctx);
        ctx.response.status = 200;
        ctx.body = userList;
        throw new Error('no se puede');
    }
    catch (err) {
        console.error('error en ruta', err.message);
    }
});
router.get('/user/:id', async (ctx) => {
    try {
        const userId = Number(ctx.params.id);
        const user = await getUserById(ctx);
        console.log(userId);
        if (userId) {
            ctx.body = userId;
            ctx.response.status = 200;
        }
        else {
            ctx.response.status = 404;
            ctx.body = 'User not found';
        }
    }
    catch (err) {
        console.error('error en ruta', err.message);
    }
});
//# sourceMappingURL=index.js.map