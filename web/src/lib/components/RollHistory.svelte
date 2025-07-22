<script lang="ts">
  import type { RollResult } from '$lib/model/roll'

  let { history, onClear }: { history: RollResult[]; onClear?: () => void } = $props()

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-SG', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatRolls = (rolls: number[] | undefined): string => {
    if (!rolls || rolls.length === 0) return ''
    if (rolls.length === 1) return `(${rolls[0]})`
    return `(${rolls.join(', ')})`
  }
</script>

<div class="flex flex-col gap-2">
  <div class="flex items-center justify-between gap-2">
    <h3 class="text-lg font-semibold">Roll History</h3>
    {#if history.length > 0 && onClear}
      <button
        class="rounded-md border border-white bg-transparent px-2 py-1 text-sm hover:bg-white hover:text-black"
        onclick={onClear}
      >
        Clear
      </button>
    {/if}
  </div>

  {#if history.length === 0}
    <div class="h-20 space-y-2">
      <p class="h-full w-full text-sm text-gray-400">No rolls yet</p>
    </div>
  {:else}
    <div class="h-20 space-y-2 overflow-y-scroll">
      {#each history as roll (roll.id)}
        <div class="rounded-md border border-gray-600 bg-gray-800 p-2">
          <div class="flex items-center justify-between">
            <span class="font-mono text-sm">{roll.expression}</span>
            <span class="text-xs text-gray-400">{formatTime(roll.timestamp)}</span>
          </div>
          <div class="mt-1 flex items-center gap-2">
            <span class="text-lg font-bold">{roll.result}</span>
            {#if roll.individualRolls && roll.individualRolls.length > 0}
              <span class="text-sm text-gray-300">{formatRolls(roll.individualRolls)}</span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
