<script lang="ts">
  import '../app.css'
  let { children } = $props()
</script>

<title>choyai</title>
<div class="h-screen w-screen bg-slate-900 text-cyan-50">
  {@render children()}
</div>
