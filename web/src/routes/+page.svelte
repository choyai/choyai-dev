<script lang="ts">
  import { enhance } from '$app/forms'
  import RollInput from '$lib/component/RollInput.svelte'
  import { Roll } from '$lib/model/roll'

  let input = $state('')
  let ast = $derived(Roll.parse(input))
  let tokens = $derived(Roll.tokenize(input))
</script>

<div class="flex h-screen flex-col items-center justify-center gap-2">
  <form method="POST" use:enhance>
    <div class="">Enter the dice you want to roll</div>
    <RollInput bind:input />
    Your roll:
    <pre>{JSON.stringify(ast)}</pre>
    <pre>{JSON.stringify(tokens)}</pre>
  </form>
</div>
