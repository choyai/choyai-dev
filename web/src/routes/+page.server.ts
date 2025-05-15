import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
export const actions = {
  default: async (event) => {
    const data = await event.request.formData()
    const roll = data.get('roll')?.toString() ?? ''

    if (!roll) {
      return fail(400, { roll, missing: true });
    }
  }
} satisfies Actions;
