import { writable } from 'svelte/store';

export const coordinates = writable({
  latitude: null,
  longitude: null
});
