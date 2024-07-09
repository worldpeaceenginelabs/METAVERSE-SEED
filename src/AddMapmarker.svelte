<script lang="ts">
  import { joinRoom } from 'trystero';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let indexeddb: IDBDatabase;

  async function initializeIndexedDB() {
    return new Promise<void>((resolve, reject) => {
      const request = window.indexedDB.open('indexeddbstore', 1);

      request.onupgradeneeded = function(event) {
        indexeddb = request.result;
        indexeddb.createObjectStore('locationpins', { keyPath: 'mapid' });
        indexeddb.createObjectStore('client', { keyPath: 'appid' });
      };

      request.onsuccess = function(event) {
        indexeddb = request.result;
        resolve();
      };

      request.onerror = function(event) {
        reject(request.error);
      };
    });
  }

  async function authorizeUser() {
    const transaction = indexeddb.transaction(['client'], 'readwrite');
    const store = transaction.objectStore('client');

    const getUsername = store.get('username');
    const getAppId = store.get('appid');

    const [username, appid] = await Promise.all([getUsername, getAppId]);

    if (!username || !appid) {
      const randomUUID = crypto.randomUUID();
      const salt = 'salt1234';
      const hashedUsername = await hashData(randomUUID + salt);

      store.put({ appid: hashedUsername, username: randomUUID });
    } else {
      const salt = 'salt1234';
      const hashedUsername = await hashData(username + salt);

      if (hashedUsername !== appid) {
        authorizeUser();
      } else {
        console.log(`${username} with ${appid} authorized`);
      }
    }
  }

  function deleteOldRecords() {
    const transaction = indexeddb.transaction(['locationpins'], 'readwrite');
    const store = transaction.objectStore('locationpins');
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const request = store.openCursor();

    request.onsuccess = function(event) {
      const cursor = event.target.result;
      if (cursor) {
        const recordTimestamp = new Date(cursor.value.timestamp);
        if (recordTimestamp < oneWeekAgo) {
          store.delete(cursor.primaryKey);
          console.log(`Deleted record with primaryKey ${cursor.primaryKey}`);
        }
        cursor.continue();
      }
    };
  }

  async function storeRecord(record: Record) {
    const transaction = indexeddb.transaction(['locationpins'], 'readwrite');
    const store = transaction.objectStore('locationpins');
    await store.add(record);
    console.log(`Stored record in IndexedDB`);
  }

  async function loadRecordsFromIndexedDB() {
    const transaction = indexeddb.transaction(['locationpins'], 'readonly');
    const store = transaction.objectStore('locationpins');
    const records: Record[] = [];

    return new Promise<Record[]>((resolve, reject) => {
      const request = store.openCursor();

      request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
          records.push(cursor.value);
          cursor.continue();
        } else {
          resolve(records);
        }
      };

      request.onerror = function(event) {
        reject(request.error);
      };
    });
  }

  async function initializeApp() {
    await initializeIndexedDB();
    await authorizeUser();
    const storedRecords = await loadRecordsFromIndexedDB();
    records.set(storedRecords);
    recordCache.push(...storedRecords);
    console.log('Loaded records from IndexedDB');
  }

  initializeApp();

  // Trystero logic
  const config = { appId: 'hashOfRandomuuidPlusSecretsalt' };
  const room = joinRoom(config, 'chat-room');

  // Create writable store for records
  const records = writable<Record[]>([]);
  let record: Record = createEmptyRecord();

  // Create action to send record
  const [sendRecordAction, getRecord] = room.makeAction('record');

  // Record cache to send records to new peers
  let recordCache: Record[] = [];

  // Receive records from other peers
  getRecord(async (data: Record, peerId: string) => {
    if (!recordCache.some(rec => rec.mapid === data.mapid)) {
      records.update(recs => [...recs, data]);
      recordCache.push(data); // Add record to cache

      // Store received record in IndexedDB "locationpins" object store
      await storeRecord(data);
      console.log(`Received record from peer ${peerId} and stored in IndexedDB`);
    }
  });

  // Send and receive records
  const send = async () => {
    if (recordIsValid(record)) {
      sendRecordAction(record);

      // Immediately process the record as if it was received from another peer
      if (!recordCache.some(rec => rec.mapid === record.mapid)) {
        records.update(recs => [...recs, record]);
        recordCache.push(record);
        await storeRecord(record);
        console.log('Self-processed the sent record and stored in IndexedDB');
      }

      record = createEmptyRecord(); // Reset record

      // Delete old records after sending a new record
      deleteOldRecords();
      console.log('Sent record and deleted old records');
    }
  };

  // New peers receive all previous records
  const [sendCache, getCache] = room.makeAction('cache');

  getCache(async (data: Record[]) => {
    const receivedRecords = data.filter(rec => !recordCache.some(rc => rc.mapid === rec.mapid));
    records.update(recs => [...recs, ...receivedRecords]);
    recordCache.push(...receivedRecords); // Add records to cache

    // Store received records in IndexedDB "locationpins" object store
    for (const record of receivedRecords) {
      await storeRecord(record);
      console.log(`Stored received record in IndexedDB`);
    }
  });

  onMount(() => {
    room.onPeerJoin(peerId => {
      // Send record cache to the new peer, but only the records the peer doesn't have yet
      sendCache(recordCache);
      console.log(`Peer ${peerId} joined`);
    });
    room.onPeerLeave(peerId => console.log(`Peer ${peerId} left`));
  });

  // Function to create an empty record
  function createEmptyRecord(): Record {
    return {
      mapid: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      title: '',
      text: '',
      link: '',
      longitude: '',
      latitude: ''
    };
  }

  // Function to check if a record is valid
  function recordIsValid(rec: Record): boolean {
    // Add your validation logic here
    // For simplicity, let's just check if the title is not empty
    return rec.title.trim() !== '';
  }

  // Function to hash data using SHA-256
  async function hashData(data: string): Promise<string> {
    // Convert the string data to an array buffer
    const encoder = new TextEncoder();
    const buffer = encoder.encode(data);

    // Calculate the SHA-256 hash of the array buffer
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);

    // Convert the hash buffer to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  }

  // Define the Record type
  type Record = {
    mapid: string;
    timestamp: string;
    title: string;
    text: string;
    link: string;
    longitude: string;
    latitude: string;
  };
</script>

<main>
  <h3>P2P WebRTC without signal server but the public Bittorrent tracker network instead.<br>Testing out the implementations with this basic UI!</h3>
  
  <div id="records"  style="height: 100px; overflow-y: scroll;">
    {#each $records as rec}
      <div class="record">
        <p>MapID: {rec.mapid}</p>
        <p>Timestamp: {rec.timestamp}</p>
        <p>Title: {rec.title}</p>
        <p>Text: {rec.text}</p>
        <p>Link: {rec.link}</p>
        <p>Longitude: {rec.longitude}</p>
        <p>Latitude: {rec.latitude}</p>
      </div>
    {/each}
  </div>

  <form>
    <label>Title:</label><br>
    <input type="text" bind:value={record.title}><br>

    <label>Text:</label><br>
    <textarea bind:value={record.text}></textarea><br>

    <label>Link:</label><br>
    <input type="text" bind:value={record.link}><br>

    <label>Longitude:</label><br>
    <input type="text" bind:value={record.longitude}><br>

    <label>Latitude:</label><br>
    <input type="text" bind:value={record.latitude}><br>

    <button on:click|preventDefault={send}>Send Record</button>
  </form>
</main>

<style>
  main {
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
    font-size: small;
  }

  #records {
    border: 1px solid #ccc;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .record {
    margin-bottom: 1rem;
    border: 1px solid #eee;
    padding: 0.5rem;
  }

  form {
    border: 1px solid #ccc;
    padding: 1rem;
  }

  label {
    font-weight: bold;
  }

  input, textarea {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
  }
</style>
