<script lang="ts">
  import Scene from '$lib/components/Scene.svelte'
  import { Canvas } from '@threlte/core'

  let { data } = $props()
  let debug = $derived(data.debug)
</script>

<Canvas>
  <Scene {debug} />
</Canvas>
