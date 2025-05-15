<script lang="ts">
  import { enhance } from '$app/forms'
  import RollInput from '$lib/component/RollInput.svelte'
  import { Roll } from '$lib/model/roll'

  let input = $state('1d20 + 2')
  let ast = $derived(Roll.parse(input))
  let tokens = $derived(Roll.tokenize(input))
</script>

<div class="flex h-full flex-col items-center justify-center gap-2">
  <form class="" method="POST" use:enhance>
    <div class="">Enter the dice you want to roll</div>
    <RollInput bind:input />
    Your roll:
    <div class="max-h-70 scrollbar-custom overflow-y-scroll">
      <pre>{JSON.stringify(ast, null, 2)}</pre>
      <pre>{JSON.stringify(tokens, null, 2)}</pre>
    </div>
  </form>
</div>
