import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import type { RequestEvent } from "@sveltejs/kit";
import { redirect } from '@sveltejs/kit';

const formData = (formData: FormData) => {
  const obj: any = {};
  for (const [key, value] of formData) {
    obj[key] = value;
  }
  return obj;
}

export const actions = {
  login: async (request: RequestEvent) => {
    const data = await request.request.formData();
    const form = formData(data);
    if (form.authcode === env.authCode) {
      request.cookies.set('auth', 'true', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'strict',
        secure: true
      });
      throw redirect(302, '/');
    }
    return fail(400, { error: 'Invalid Auth Code' });
  }
}
