<script lang="ts">
  import { onMount } from 'svelte';

  let title = '';
  let text = '';
  let link = '';
  let longitude = '';
  let latitude = '';

  let ws: WebSocket;

  // Handle for form submission
  const handleSubmit = async () => {
      const record = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          title,
          text,
          link,
          longitude,
          latitude
      };

      // Add the new record to IndexedDB without checking for existing ID
      const db = await openDB();
      const writeTransaction = db.transaction(['mapmarkers'], 'readwrite');
      const writeStore = writeTransaction.objectStore('mapmarkers');
      writeStore.add(record);

      console.log('Record added to IndexedDB:', record);
  };

  // Svelte Lifecycle onmount: start functions on initialization
  onMount(async () => {
      // Start WebSocket cycle
      const connectWebSocket = () => {
          // Connect to WebSocket server
          ws = new WebSocket('ws://your_websocket_server_url');

          // Listen for connection open event
          ws.onopen = async () => {
              console.log('WebSocket connected');

              // Subscribe to topic1
              ws.send(JSON.stringify({ action: 'subscribe', topic: 'topic1' }));

              // Onmessage
              ws.onmessage = async (event) => {
                  const message = JSON.parse(event.data);
                  console.log('Message received from WebSocket:', message);

                  // Store the incoming message in IndexedDB without checking for existing ID
                  const db = await openDB();
                  const writeTransaction = db.transaction(['mapmarkers'], 'readwrite');
                  const writeStore = writeTransaction.objectStore('mapmarkers');

                  const record = {
                      id: message.id,
                      timestamp: message.timestamp,
                      title: message.title,
                      text: message.text,
                      link: message.link,
                      longitude: message.longitude,
                      latitude: message.latitude
                  };

                  writeStore.add(record);

                  console.log('Record added to IndexedDB:', record);
              };

              // Check for new records in IndexedDB and send to WebSocket
              const db = await openDB();
              const transaction = db.transaction(['mapmarkers'], 'readonly');
              const objectStore = transaction.objectStore('mapmarkers');

              const request = objectStore.openCursor(null, 'prev'); // Use 'prev' to iterate in reverse order
              request.onsuccess = (event) => {
                  // In the request.onsuccess event handler
                  const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

                  if (cursor) {
                      const record = cursor.value;
                      console.log('New record in IndexedDB:', record);

                      // Send record to WebSocket
                      ws.send(JSON.stringify({ topic: 'topic1', message: record }));
                      cursor.continue();
                  }
              };
          };

          // Listen for close event
          ws.onclose = () => {
              console.log('WebSocket connection closed');

              // Schedule a reconnection attempt after a random time between 10 and 30 minutes
              const randomReconnectTime = getRandomFloat(10, 30) * 60 * 1000; // Convert minutes to milliseconds
              setTimeout(connectWebSocket, randomReconnectTime); // Reconnect after random time
          };

          // Set maintenance timeout for 5 minutes
          maintenanceTimeout();
      };

      // Connect to WebSocket
      connectWebSocket();

      // Periodically check and delete outdated records
      setInterval(async () => {
          const db = await openDB();
          const transaction = db.transaction(['mapmarkers'], 'readwrite');
          const store = transaction.objectStore('mapmarkers');
          const now = Date.now();
          const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

          const request = store.index('timestamp').openCursor(IDBKeyRange.upperBound(oneWeekAgo));
          request.onsuccess = async (event) => {
              // In the request.onsuccess event handler
              const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

              if (cursor) {
                  const record = cursor.value;
                  console.log('Deleting outdated record from IndexedDB:', record);
                  cursor.delete();
                  cursor.continue();
              }
          };
      }, 24 * 60 * 60 * 1000); // Check every 24 hours
  });

// Helping Functions

    // Function to open IndexedDB database
async function openDB() {
    const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    const request = indexedDB.open('recordsDB', 1) as IDBOpenDBRequest; // Type assertion here
    
   // Set up IndexedDB schema
request.onupgradeneeded = (event) => {
    const db = (event.target as IDBOpenDBRequest).result as IDBDatabase; // Type assertion here
    if (db) {
        const objectStore = db.createObjectStore('mapmarkers', { keyPath: 'id' });
        objectStore.createIndex('id', 'id', { unique: true }); // Specify options object explicitly
    }
};
    
    // Resolve promise with database instance
    return new Promise<IDBDatabase>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result as IDBDatabase); // Type assertion here
        request.onerror = () => reject(request.error);
    });
}


  // closes WebSocket connection 5 minutes after connectWebSocket(); started
  function maintenanceTimeout() {
      const maintenanceTime = 5 * 60 * 1000; // 5 minutes in milliseconds
      setTimeout(() => {
          console.log("Maintenance timeout expired after 5 minutes.");
          ws.close(); // Close WebSocket connection after 5 minutes for maintenance
      }, maintenanceTime);
  }

  // gets us a random number with 2 digits after the decimal point, inside a specified range
  function getRandomFloat(min: number, max: number): number {
      return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <label for="title">Title:</label>
  <input type="text" id="title" bind:value={title}>

  <label for="text">Text:</label>
  <input type="text" id="text" bind:value={text}>

  <label for="link">Link:</label>
  <input type="text" id="link" bind:value={link}>

  <label for="longitude">Longitude:</label>
  <input type="text" id="longitude" bind:value={longitude}>

  <label for="latitude">Latitude:</label>
  <input type="text" id="latitude" bind:value={latitude}>

  <button type="submit">Send</button>
</form>
