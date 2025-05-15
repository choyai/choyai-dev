<script lang="ts">
  import RollInput from '$lib/component/RollInput.svelte'
  import { Roll } from '$lib/model/roll'

  let input = $state('1d20 + 2')
  let ast = $derived(Roll.parse(input))
  let tokens = $derived(Roll.tokenize(input))
  let result = $state(Roll.evaluate({ tag: 'Constant', value: 0 }))
  const handleSubmit = (e: Event) => {
    e.preventDefault()
    result = Roll.evaluate(ast ?? { tag: 'Constant', value: 0 })
  }
</script>

<div class="flex h-full flex-col items-center justify-center gap-2">
  <form class="" method="POST" onsubmit={handleSubmit}>
    <div class="">Enter the dice you want to roll</div>
    <RollInput bind:input />
    Your roll:
    <div class="scrollbar-custom max-h-70 overflow-y-scroll">
      {result}
      <pre>{JSON.stringify(ast, null, 2)}</pre>
      <pre>{JSON.stringify(tokens, null, 2)}</pre>
    </div>
  </form>
</div>
