<script lang="ts">
  import RollInput from '$lib/components/RollInput.svelte'
  import Scene from '$lib/components/Scene.svelte'
  import { Roll } from '$lib/model/roll.js'
  import { Canvas } from '@threlte/core'

  let { data } = $props()
  let debug = $derived(data.debug)
  let input = $state('1d20 + 2')
  let ast = $derived(Roll.parse(input))
  let showAST = $state(false)
  let result = $state(0)
  const handleSubmit = (e: Event) => {
    e.preventDefault()
    result = Roll.evaluate(ast ?? { tag: 'Constant', value: 0 })
  }
</script>

<div class="flex h-full flex-col items-center justify-center">
  <form class="flex h-90 w-90 flex-col gap-2" method="POST" onsubmit={handleSubmit}>
    Enter the dice you want to roll
    <div class="flex w-full flex-row gap-x-2">
      <RollInput bind:input />
      <button
        class="w-20 rounded-md border-2 border-white bg-transparent p-1 transition-transform duration-75 hover:border-slate-700 active:scale-105"
        type="submit"
      >
        <span> roll </span>
      </button>
    </div>
    Your roll:
    <div class=""></div>
    <div class="scrollbar-custom max-h-70 overflow-y-scroll">
      {result}
      {#if debug}
        <div class="">
          <button
            class="rounded-md border-2 border-white bg-transparent p-1"
            type="button"
            onclick={() => (showAST = !showAST)}>toggle ast</button
          >
          {#if showAST}
            <pre>{JSON.stringify(ast, null, 2)}</pre>
          {/if}
        </div>
      {/if}
    </div>
  </form>
</div>
<Canvas>
  <Scene />
</Canvas>
