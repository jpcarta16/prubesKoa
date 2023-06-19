import { Context } from "koa";

interface User {
  id: number;
  name: string;
  lastName?: string;
}

const users: User[] = [{
  name: 'pepe',
  lastName: 'pegotero',
  id: 656,
}];

export async function getAllUsers(ctx: Context): Promise<User[]> {
  const allUsers = String(ctx.query.user as string);
  console.log('Valor de allUsers:', allUsers);
  const userList = users.filter(u => u.name === allUsers);
  if (userList !== undefined) {
    console.log('tengo el control', userList);
    return userList;
  } else {
    ctx.status = 404;
    ctx.body = 'User not found';
    throw new Error('User not found');
  }
}

export async function getUserById(ctx: Context): Promise<User | null> {
  const userId = Number(ctx.params.id);
  const user = users.find(u => u.id === userId);
  if (user) {
    ctx.body = user;
  } else {
    ctx.status = 404;
    ctx.body = 'User not found';
  }
  return null;
}

export async function getUserInfo(userInfo: string) {
  return null;
}

