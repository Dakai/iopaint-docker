//import type { Handle } from '@sveltejs/kit';
//import { redirect } from '@sveltejs/kit';
//
//export const handle: Handle = async ({ event, resolve }) => {
//  const { cookies } = event;
//  const userToken = cookies.get('auth')
//  event.locals = { user: userToken }
//
//  if (event.url.pathname === '/login' && userToken) {
//    throw redirect(302, '/');
//  }
//  if (!event.url.pathname.startsWith('/login') && !userToken) {
//    throw redirect(302, '/login');
//  }
//  return await resolve(event);
//}
