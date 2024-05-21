// recordsStore.ts

import { writable } from 'svelte/store';
import type Record from './AddMapmarker.svelte'; // Adjust the path if needed

// Initialize an empty array as the initial value for the store
const initialRecords: Record[] = [];

// Create a writable Svelte store with the initial value
export const recordsStore = writable(initialRecords);
