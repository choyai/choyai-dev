<script lang="ts">
  import { addSnippet, removeSnippet } from '$lib/components/CanvasPortalTarget.svelte'
  import { onDestroy, type Snippet } from 'svelte'

  let { children }: { children: Snippet } = $props()

  addSnippet(children)

  onDestroy(() => {
    removeSnippet(children)
  })
</script>
