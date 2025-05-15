<script lang="ts">
  import RollInput from '$lib/components/RollInput.svelte'
  import { Roll } from '$lib/model/roll'
  import { HTML, interactivity } from '@threlte/extras'
  import { T, useTask } from '@threlte/core'
  import { Spring } from 'svelte/motion'

  let { debug }: { debug: boolean } = $props()
  let input = $state('1d20 + 2')
  let ast = $derived(Roll.parse(input))
  let showAST = $state(false)
  let result = $state(Roll.evaluate({ tag: 'Constant', value: 0 }))
  let rotation = $state(0)
  useTask((delta) => {
    rotation += delta
  })
  const handleSubmit = (e: Event) => {
    e.preventDefault()
    result = Roll.evaluate(ast ?? { tag: 'Constant', value: 0 })
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
  position.y={1}
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
  <T.BoxGeometry args={[1, 2, 1]} />
  <T.MeshStandardMaterial color="hotpink" />
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
</HTML>
