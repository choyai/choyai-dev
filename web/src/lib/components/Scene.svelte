<script lang="ts">
  import RollInput from '$lib/components/RollInput.svelte'
  import RollHistory from '$lib/components/RollHistory.svelte'
  import { Roll, type RollResult } from '$lib/model/roll'
  import { HTML, interactivity, Outlines, Edges } from '@threlte/extras'
  import { T, useTask } from '@threlte/core'
  import { Spring } from 'svelte/motion'

  let { debug }: { debug: boolean } = $props()
  let input = $state('1d20 + 2')
  let ast = $derived(Roll.parse(input))
  let showAST = $state(false)
  let result = $state<number | null>(null)
  let rollHistory = $state(new Roll.History())
  let history = $state<RollResult[]>([])
  let rotation = $state(0)

  useTask((delta) => {
    rotation += delta
  })

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    const rollResult = rollHistory.roll(input)
    if (rollResult) {
      result = rollResult.result
      history = rollHistory.getHistory()
    }
  }

  const clearHistory = () => {
    rollHistory.clear()
    history = []
    result = null
  }

  const scale = new Spring(1)

  // threlte
  interactivity()
</script>

<T.PerspectiveCamera
  makeDefault
  position={[10, 10, 10]}
  oncreate={(ref) => {
    ref.lookAt(0, 1, 0)
  }}
/>
<T.DirectionalLight position={[0, 10, 10]} castShadow />
<T.Mesh
  position.y={1.03}
  rotation.y={rotation}
  scale={scale.current}
  onpointerenter={() => {
    scale.target = 1.5
  }}
  onpointerleave={() => {
    scale.target = 1
  }}
  castShadow
>
  <T.BoxGeometry args={[1, 1, 1]} />
  <T.MeshStandardMaterial color="#8888ff" />
  <Edges color="white" scale={1.02} />
  <Outlines color="white" />
</T.Mesh>

<T.Mesh rotation.x={-Math.PI / 2} receiveShadow>
  <T.CircleGeometry args={[4, 40]} />
  <T.MeshStandardMaterial color="white" />
</T.Mesh>

<HTML
  position={[0, 1, 0]}
  transform
  oncreate={(ref) => {
    ref.lookAt(10, 10, 10)
  }}
  autoRender
>
  <div class="flex h-full flex-col items-center justify-center">
    <div class="flex h-90 w-90 gap-4">
      <form class="flex flex-1 flex-col gap-2" method="POST" onsubmit={handleSubmit}>
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
        {#if result !== null}
          <div class="mt-2">
            <span class="text-sm">Latest roll:</span>
            <div class="text-2xl font-bold">{result}</div>
          </div>
        {/if}
        {#if debug}
          <div class="mt-2">
            <button
              class="rounded-md border-2 border-white bg-transparent p-1"
              type="button"
              onclick={() => (showAST = !showAST)}>toggle ast</button
            >
            {#if showAST}
              <pre class="max-h-32 overflow-auto text-xs">{JSON.stringify(ast, null, 2)}</pre>
            {/if}
          </div>
        {/if}
      </form>
    </div>
    <div class="flex-1">
      <RollHistory {history} onClear={clearHistory} />
    </div>
  </div>
</HTML>
