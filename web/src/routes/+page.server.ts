import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

// TODO: landing page
export const load: PageServerLoad = async () => {
  redirect(307, '/roll')
}
