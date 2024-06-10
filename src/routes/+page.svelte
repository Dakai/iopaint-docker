<script lang="ts">
	import { Select, GradientButton } from 'flowbite-svelte';
	import { writable } from 'svelte/store';
	import { enhance } from '$app/forms';
	import { output, process_id } from '$lib/stores';
	import { onMount, afterUpdate } from 'svelte';

	export let data: any;
	const { models } = data;
	let ws: WebSocket;
	let responseData: Array<{ output?: string; error?: string; message?: string }> = [];
	let outputFrame: HTMLDivElement;

	onMount(() => {
		ws = new WebSocket('ws://localhost:9880');

		ws.onmessage = (event: MessageEvent) => {
			const data = JSON.parse(event.data);
			responseData = [...responseData, data];
			console.log('data', data);
		};

		ws.onclose = () => {
			console.log('Connection closed');
		};

		return () => {
			if (ws) {
				ws.close();
			}
		};
	});
	//	let ws = new WebSocket('ws://localhost:9880');
	afterUpdate(() => {
		// Scroll to the bottom of the output frame when new data is added
		if (outputFrame) {
			outputFrame.scrollTop = outputFrame.scrollHeight;
		}
	});

	let selected: string = 'lama';

	const displayName = writable('');

	$: $displayName = selected
		? models.find((m: any) => m.value === selected)?.name
		: 'Selected Model';

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		const formData = new FormData();
		formData.append('model', selected);

		try {
			//const response = await fetch('?/run', {
			const response = await fetch('?/test', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			const data = await response.json();
			console.log('data', data);
			//if (response.ok) {
			//	$output = data.output;
			//	console.log('output', $output);
			//	$process_id = data.id;
			//} else {
			//	$output = data.error;
			//}

			//const { id } = await response.json();
			//$process_id = id;
		} catch (error) {
			//$output = error;
			console.error(error);
		}
	};
</script>

<svelte:head>
	<title>IO Paint</title>
</svelte:head>

<div class=" flex items-center justify-center gradient-background min-h-screen">
	<div class="flex flex-col justify-items-center gap-y-6 w-full">
		<form on:submit={handleSubmit} class="container mx-auto text-center flex flex-col gap-y-6 mb-6">
			<h1 class="text-white font-bold text-lg">IO Paint Wrapper</h1>
			<Select class="w-1/4 mx-auto" items={models} bind:value={selected} defaultValue="Lama" />
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
				disabled={$process_id === 0}>End Process {$process_id}</GradientButton
			>
		</form>
		{#if responseData.length > 0}
			<div
				bind:this={outputFrame}
				class="terminal-gradient-background max-h-64 overflow-y-auto text-sm rounded-xl border-2 border-gray-600 w-2/3 mx-auto whitespace-pre-wrap p-4 text-white"
			>
				{#each responseData as response}
					<p>{response.output || response.error || response.message}</p>
				{/each}
			</div>{/if}
	</div>
</div>

<style>
	.gradient-background {
		background: linear-gradient(135deg, #6b21a8, #f97316);
	}
	.terminal-gradient-background {
		background: linear-gradient(135deg, #111827, #233876);
	}
</style>
