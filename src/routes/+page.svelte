<script lang="ts">
	import { Select, GradientButton } from 'flowbite-svelte';
	import { writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	export let data: any;
	const { models } = data;
	console.log(models);

	let selected: string;

	const displayName = writable('');

	$: $displayName = selected
		? models.find((m: any) => m.value === selected)?.name
		: 'Selected Model';
</script>

<svelte:head>
	<title>IO Paint</title>
</svelte:head>

<div class="h-svh w-svw bg-black flex items-center">
	<form
		use:enhance
		method="POST"
		action="?/run"
		class="container mx-auto text-center flex flex-col gap-y-6"
	>
		<h1 class="text-white font-bold text-lg mb-2">IO Paint Wrapper</h1>
		<Select class="w-1/4 mx-auto" items={models} bind:value={selected}></Select>
		<GradientButton
			class="w-1/4 mx-auto"
			type="submit"
			disabled={!selected}
			name="model"
			value={selected}>Run with {$displayName}</GradientButton
		>
		<GradientButton class="w-1/4 mx-auto" color="pinkToOrange" href="/iopaint"
			>Enter IO Paint</GradientButton
		>
	</form>
</div>
