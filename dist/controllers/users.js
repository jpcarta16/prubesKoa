const users = [{
        name: 'pepe',
        lastName: 'pegotero',
        id: 656,
    }];
export async function getAllUsers(ctx) {
    const allUsers = String(ctx.query.user);
    console.log('Valor de allUsers:', allUsers);
    const userList = users.filter(u => u.name === allUsers);
    if (userList !== undefined) {
        console.log('tengo el control', userList);
        return userList;
    }
    else {
        ctx.status = 404;
        ctx.body = 'User not found';
        throw new Error('User not found');
    }
}
export async function getUserById(ctx) {
    const userId = Number(ctx.params.id);
    const user = users.find(u => u.id === userId);
    if (user) {
        ctx.body = user;
    }
    else {
        ctx.status = 404;
        ctx.body = 'User not found';
    }
    return null;
}
export async function getUserInfo(userInfo) {
    return null;
}
//# sourceMappingURL=users.js.map