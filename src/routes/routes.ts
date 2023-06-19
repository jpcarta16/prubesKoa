import Router from '@koa/router';
import {Context} from 'koa'

import { getAllUsers, getUserById } from '../controllers/users';

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

export function calculateBytheRange(
  rangeHeader: string,
  totalBytes: string
): { start: number; 
  end: number; 
  totalBytes: number, 
  calculatedTotalBytes: number } 
  {
  const strRangeArray = rangeHeader.replace(/bytes=/, '').split('-');
  const ranges: number[][] = [];

  let [start, end] = [parseInt(strRangeArray[0]), parseInt(strRangeArray[1])];

  if (isNaN(start)) {
    start = 0;
  }
  if (isNaN(end)) {
    end = parseInt(totalBytes) - 1;
  }

  if (end <= start) {
    throw new Error('invalid range: start should be less than or equal to end');
  }

  ranges.push([start, end]);

  if (end < parseInt(totalBytes) - 1) {
    ranges.push([end + 1, parseInt(totalBytes) - 1]);
  }

  return {
    start,
    end,
    totalBytes: parseInt(totalBytes),
    calculatedTotalBytes: parseInt(totalBytes)
  };
}

router.get('/calculate', async (ctx: Context) => {
  try {
    const rangeHeader = ctx.headers['range'];
    const totalBytes = '875';

    if (rangeHeader === undefined) {
      ctx.response.status = 400;
      ctx.body = 'Range header is missing';
      return;
    } else {
      const {start, end, totalBytes: calculatedTotalBytes} = calculateBytheRange(rangeHeader, totalBytes);
      console.log('tengo a ', { start, end, calculatedTotalBytes });      
    }
  } catch (error) {
    console.error(error);
  }

});
