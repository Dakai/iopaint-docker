import { writable } from 'svelte/store';

export const output = writable('');
export const process_id = writable(0);
export const isRunning = writable(false)
