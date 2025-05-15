import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
  const debug: boolean = url.searchParams.get('debug') !== null

  return {
    debug
  }
}

export const actions = {
  default: async (event) => {
    const data = await event.request.formData()
    const roll = data.get('roll')?.toString() ?? ''

    if (!roll) {
      return fail(400, { roll, missing: true });
    }
  }
} satisfies Actions;
