<script lang="ts">
	import '../app.css';
	
	let { children } = $props();
</script>


<title>choyai</title>
<div class="bg-slate-900 h-screen w-screen text-cyan-50" >
{@render children()}
</div>
