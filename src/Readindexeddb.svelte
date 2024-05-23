<script>
    import { onMount } from 'svelte';
    
    let pins = [];
  
    onMount(async () => {
      // Open IndexedDB database
      const db = await openDB();
  
      // Read data from object store
      const transaction = db.transaction('locationpins', 'readonly');
      const objectStore = transaction.objectStore('locationpins');
      const cursor = objectStore.openCursor();
  
      cursor.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          // Add each pin to the array
          pins = [...pins, cursor.value];
          cursor.continue();
        }
      };
    });
  
    async function openDB() {
      // Open the database
      const dbName = 'indexeddbstore';
      const dbVersion = 1;
      const request = indexedDB.open(dbName, dbVersion);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains('locationpins')) {
          db.createObjectStore('locationpins', { keyPath: 'mapid' });
        }
      };
  
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  </script>
  
  <div>
    <h1>Location Pins</h1>
    <ul>
      {#each pins as pin}
        <li>
          <strong>Map ID:</strong> {pin.mapid}<br>
          <strong>Timestamp:</strong> {pin.timestamp}<br>
          <strong>Title:</strong> {pin.title}<br>
          <strong>Link:</strong> {pin.link}<br>
          <strong>Text:</strong> {pin.text}<br>
          <strong>Longitude:</strong> {pin.longitude}<br>
          <strong>Latitude:</strong> {pin.latitude}
        </li>
      {/each}
    </ul>
  </div>
  