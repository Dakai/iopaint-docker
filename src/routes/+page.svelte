<script lang="ts">
	import { Select, GradientButton } from 'flowbite-svelte';
</script>

<svelte:head>
	<title>IO Paint</title>
</svelte:head>

<div class="h-svh w-svw bg-black flex items-center">
	<div class="container mx-auto text-center flex flex-col gap-y-6">
		<h1 class="text-white font-bold text-lg mb-2">IO Paint Wrapper</h1>
		<Select class="w-1/4 mx-auto"></Select>
		<GradientButton class="w-1/4 mx-auto" href="/iopaint">Start</GradientButton>
	</div>
</div>
