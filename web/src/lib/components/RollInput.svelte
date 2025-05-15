<script lang="ts">
  let { input = $bindable() }: { input: string } = $props()
</script>

<div class="flex items-center">
  <input
    class="w-70 rounded-md bg-white p-2 text-black"
    type="text"
    name="roll"
    placeholder="1d20"
    bind:value={input}
  />
</div>
