<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { GradientButton, Input } from 'flowbite-svelte';
	import { Helper } from 'flowbite-svelte';

	export let form: any;
	const message = writable('');

	onMount(() => {
		if (!browser) return;
	});

	$: {
		if (form?.error) {
			message.set(form.error);
		}
	}
</script>

<svlete:head>
	<title>Free Ask Internet Login</title>
</svlete:head>
<div class="min-h-screen flex items-center justify-center bg-blue-400">
	<div class="bg-white p-6 rounded shadow">
		<!-- Your content here -->
		<h1 class="text-center text-3xl font-medium mb-4">Free Ask Internet</h1>
		<h2 class="text-center text-2xl font-medium mb-4">Auth</h2>
		<form method="POST" action="?/login" use:enhance>
			<div class="space-y-6 flex flex-col">
				<Input
					type="text"
					name="authcode"
					placeholder="Authcode"
					class="px-4 py-2 border rounded-md"
				/>
				<GradientButton type="submit" name="submit" class="w-full">Login</GradientButton>
				<Helper color="red" message={form?.error} />
			</div>
		</form>
	</div>
</div>
