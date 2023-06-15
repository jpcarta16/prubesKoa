import Router from '@koa/router';
import { getAllUsers, getUserById } from '../controllers/users';
import {Context} from 'koa'

export const router = new Router();

router.get('/', (ctx)  => {
  ctx.body = "Hello world";
});

router.get('/users', async (ctx: Context) => {
  try {
    const userList = await getAllUsers(ctx);
    ctx.response.status = 200;
    ctx.body = userList;
  } catch (err: any) {
    console.error('Error en la ruta', err.message);
    ctx.response.status = 500;
    ctx.body = 'Error al obtener los usuarios';
  }
});


router.get('/user/:id', async (ctx: Context) => {
  try {
    const userId = Number(ctx.params.id)
    const user = await getUserById(ctx)
    console.log(userId)
    
    if(userId){
      ctx.body = userId
      ctx.response.status = 200
    } else {
      ctx.response.status = 404
      ctx.body = 'User not found'
    }
  } catch (err:any) {
    console.error('error en ruta', err.message)
  }
})


