<script lang="ts">
  import '../app.css'
  import CanvasPortalTarget from '$lib/components/CanvasPortalTarget.svelte'
  import { Canvas } from '@threlte/core'
  import type { Snippet } from 'svelte'
  import { NoToneMapping } from 'three'

  let { children }: { children: Snippet } = $props()
</script>

<title>choyai</title>
<div class="h-screen w-screen bg-slate-900 text-cyan-50">
  <Canvas toneMapping={NoToneMapping}>
    <CanvasPortalTarget />
  </Canvas>
</div>

<div class="text-cyan-50">
  {@render children()}
</div>

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
