import { redirect } from "@sveltejs/kit"
import type { RequestHandler } from "@sveltejs/kit"

export const POST: RequestHandler = async ({ cookies }) => {
  cookies.delete('auth', {
    path: '/'
  })
  throw redirect(302, '/login')
}

