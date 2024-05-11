<script lang="ts">
	import { Select, GradientButton } from 'flowbite-svelte';
	import { writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	import { output, process_id } from '$lib/stores';

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

<div class="h-screen bg-black flex items-center">
	<div class="flex flex-col justify-items-center gap-y-6 w-full">
		<form
			use:enhance
			method="POST"
			action="?/run"
			class="container mx-auto text-center flex flex-col gap-y-6"
		>
			<h1 class="text-white font-bold text-lg">IO Paint Wrapper</h1>
			<Select class="w-1/4 mx-auto" items={models} bind:value={selected} defaultValue="lama" />
			<GradientButton
				class="w-1/4 mx-auto"
				type="submit"
				disabled={!selected}
				name="model"
				value={selected}>Run with {$displayName}</GradientButton
			>
			<GradientButton
				class="w-1/4 mx-auto"
				color="tealToLime"
				href="/iopaint"
				disabled={$process_id === 0}>Enter IO Paint</GradientButton
			>
		</form>
		<form use:enhance method="POST" action="?/stop" class="container mx-auto text-center">
			<GradientButton
				class="w-1/4 mx-auto"
				color="pinkToOrange"
				type="submit"
				disabled={$process_id === 0}>End Process</GradientButton
			>
		</form>
		<div
			class="text-gray599 text-sm rounded-xl border-2 border-white w-1/2 mx-auto whitespace-pre-wrap"
		>
			{$output}
		</div>
	</div>
</div>
