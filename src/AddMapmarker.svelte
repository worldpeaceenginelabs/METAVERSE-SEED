<script lang="ts">
  import { joinRoom } from 'trystero';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { coordinates } from './store.js';

  // Define for rate limiting
  let isFormDisabled = writable(false);

  // Define the IndexedDB database
  let indexeddb: IDBDatabase;
  let appid: string; // Variable to store the appid

  // Function to initialize the IndexedDB database
  async function initializeIndexedDB() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('indexeddbstore', 1);

      // Create object stores if they don't exist
      request.onupgradeneeded = function(event) {
        const db = request.result;
        if (!db.objectStoreNames.contains('locationpins')) {
          db.createObjectStore('locationpins', { keyPath: 'mapid' });
        }
        if (!db.objectStoreNames.contains('client')) {
          db.createObjectStore('client', { keyPath: 'appid' });
        }
      };

      // On success, assign the result to the indexeddb variable
      request.onsuccess = function(event) {
        indexeddb = request.result;
        resolve();
      };

      // On error, reject the promise
      request.onerror = function(event) {
        reject(request.error);
      };
    });
  }

  

  // Function to delete old records from the locationpins object store
  function deleteOldRecords() {
    const transaction = indexeddb.transaction(['locationpins'], 'readwrite');
    const store = transaction.objectStore('locationpins');
    const recordsAge = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Open a cursor to iterate over the records
    const request = store.openCursor();

    request.onsuccess = function(event) {
      const cursor = event.target.result;
      if (cursor) {
        // If the record is older than 30 days, delete it
        const recordTimestamp = new Date(cursor.value.timestamp);
        if (recordTimestamp < recordsAge) {
          store.delete(cursor.primaryKey);
          console.log(`Deleted record with primaryKey ${cursor.primaryKey}`);
        }
        cursor.continue();
      }
    };
  }

  // Function to store a record in the locationpins object store
  async function storeRecord(record: Record) {
    const transaction = indexeddb.transaction(['locationpins'], 'readwrite');
    const store = transaction.objectStore('locationpins');
    store.add(record).onsuccess = function() {
      console.log('Stored record in IndexedDB');
    };
  }

  // Function to load records from the locationpins object store
  async function loadRecordsFromIndexedDB() {
    const transaction = indexeddb.transaction(['locationpins'], 'readonly');
    const store = transaction.objectStore('locationpins');
    const records: Record[] = [];

    // Open a cursor to iterate over the records
    const request = store.openCursor();

    return new Promise<Record[]>((resolve, reject) => {
      request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
          // Add the record to the records array
          records.push(cursor.value);
          cursor.continue();
        } else {
          // When there are no more records, resolve the promise
          resolve(records);
        }
      };

      request.onerror = function(event) {
        reject(request.error);
      };
    });
  }

  // Function to initialize the app
  async function initializeApp() {
    await initializeIndexedDB();
    await deleteOldRecords();
    const storedRecords = await loadRecordsFromIndexedDB();
    records.set(storedRecords);
    recordCache.push(...storedRecords);
    console.log('Loaded records from IndexedDB');
  }

  // Initialize the app
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

  // Set a maximum size for the cache
  const MAX_CACHE_SIZE = 10000;

  // Receive records from other peers
  getRecord(async (data: Record, peerId: string) => {
    if (!recordCache.some(rec => rec.mapid === data.mapid)) {
      records.update(recs => [...recs, data]);
      recordCache.push(data); // Add record to cache

      // Maintain cache size limit
      if (recordCache.length > MAX_CACHE_SIZE) {
        recordCache.shift(); // Remove the oldest record
      }

      // Store received record in IndexedDB "locationpins" object store
      await storeRecord(data);
      console.log(`Received record from peer ${peerId} and stored in IndexedDB`);
    }
  });

  // Send and receive records
  const send = async () => {
    // Check if coordinates are present
    if ($coordinates.latitude && $coordinates.longitude && recordIsValid(record)) {
      sendRecordAction(record);

      // Immediately process the record as if it was received from another peer
      records.update(recs => [...recs, record]);
      recordCache.push(record);

        // Maintain cache size limit
      if (recordCache.length > MAX_CACHE_SIZE) {
        recordCache.shift(); // Remove the oldest record
      }

      await storeRecord(record);
      console.log('Self-processed the sent record and stored in IndexedDB');

      record = createEmptyRecord(); // Reset record
      $coordinates.latitude = '';
      $coordinates.longitude = '';
    } else {
      console.log('Please click on the map to fetch coordinates');
    }
  };

  // Subscribe to coordinates from click/touch in store
  coordinates.subscribe(value => {
    record.latitude = value.latitude;
    record.longitude = value.longitude;
  });

  // New peers receive all previous records
  const [sendCache, getCache] = room.makeAction('cache');

  getCache(async (data: Record[]) => {
    const receivedRecords = data.filter(rec => !recordCache.some(rc => rc.mapid === rec.mapid));
    records.update(recs => [...recs, ...receivedRecords]);
    recordCache.push(...receivedRecords); // Add records to cache

    // Maintain cache size limit
    if (recordCache.length > MAX_CACHE_SIZE) {
      recordCache.splice(0, recordCache.length - MAX_CACHE_SIZE); // Keep only the latest records
    }

    // Store received records in IndexedDB "locationpins" object store
    for (const record of receivedRecords) {
      await storeRecord(record);
      console.log('Stored received record in IndexedDB');
    }
  });

  

  // Define an async function to fetch and set form disabled status
    async function updateFormDisabledStatus() {
    const result = await checkRecordCount();
    isFormDisabled.set(result);
    }

  onMount(async () => {
    await initializeApp();

    // Rate limiting
    // updateFormDisabledStatus();
    // Set interval to continuously update form disabled status
    // const intervalId = setInterval(async () => {
    //    updateFormDisabledStatus();
    // }, 5000); // Update every 5 seconds (adjust interval as needed)

    room.onPeerJoin(peerId => {
      // Send record cache to the new peer, but only the records the peer doesn't have yet
      sendCache(recordCache);
      console.log(`Peer ${peerId} joined`);
    });

    room.onPeerLeave(peerId => console.log(`Peer ${peerId} left`));
  });

  // Implement a rate-limiting function to verify if there are more than 5 records in 'locationpins' indexedDB with the same appid suffix as in 'clients' indexedDB.
  async function checkRecordCount() {
    const transaction = indexeddb.transaction(['locationpins'], 'readonly');
    const store = transaction.objectStore('locationpins');
    let count = 0;

    return new Promise<boolean>((resolve, reject) => {
      const request = store.openCursor();

      request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.mapid.endsWith(appid)) {
            count++;
          }
          cursor.continue();
        } else {
          resolve(count >= 5); // Resolve true if there are 5 or more records with the appid
        }
      };

      request.onerror = function(event) {
        reject(request.error);
      };
    });
  }

  // Function to check if a record is valid
  function recordIsValid(rec: Record): boolean {
    const isTitleValid = rec.title.trim() !== '';
    // Regular expression to check if the link starts with the specified patterns
    const linkPattern = /.*(?=zoom\.us\/)/;
    const isLinkValid = linkPattern.test(rec.link.trim());
    
    return isTitleValid && isLinkValid;
  }

  // Function to validate latitude and longitude with max 6 decimal places
  function isValidCoordinate(coord) {
    const coordPattern = /^[-+]?([1-8]?\d(\.\d{1,6})?|90(\.0{1,6})?)$/;
    return coordPattern.test(coord);
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

  // Record interface
  interface Record {
    mapid: string;
    timestamp: string;
    title: string;
    text: string;
    link: string;
    longitude: string;
    latitude: string;
  }

  // Function to create an empty record
  function createEmptyRecord(): Record {
    return {
      mapid: crypto.randomUUID() + appid, // Append the appid as a suffix to the mapid
      timestamp: new Date().toISOString(),
      title: '',
      text: '',
      link: '',
      longitude: '',
      latitude: ''
    };
  }
  
</script>

<main>
  <h4>
    Welcome to Cloud Atlas, your gateway to a new decentralized world!<br><br>
    <span class="highlight"> 🔥 Posts cannot be edited or deleted, and they will automatically disappear after 30 days.<br>
      🔥 You can only have up to 5 posts at a time. Choose wisely!<br>
      🔥 The first app focuses on brainstorming private and public matters, local and global issues and creating solutions.<br>
      🔥 Want more apps? Reach out to me and our community anytime on GitHub, Gitter.im, or during our upcoming weekly Zoom brainstorming sessions on YouTube.<br>
      🔥 Stream your Zoom meetings to YouTube for permanent storage. 🔥</span><br><br>

      ⚠️ Please note our one essential guideline:⚠️<br>In our unique gathering, let’s embrace our unique backgrounds and perspectives. We strive for a space where everyone feels comfortable, so please leave discussions of politics, religion, nationality, gender, age, and profession at the door.<br><br>
      Our meeting thrives on collective participation, no one person orchestrates our time together. If someone becomes too prominent, we trust in our collective wisdom to guide the conversation back to balance. Remember, those who help to moderate or remind others of our guidelines are not assuming leadership; they are simply helping to preserve our shared space. Stepping in to guide or moderate does not make one the leader; there are no leaders here.<br><br>
      

      If a member seeks help, we champion a culture where everyone pitches in to assist.<br><br>
      

      Together, we’ll create a space that’s collaborative, respectful, and leaderless. Thank you for contributing to our collective journey.<br><br>
      

      This introduction reinforces the idea that even those who help ensure the meeting runs smoothly are not taking on a leadership role, but rather contributing to the group’s collective operation.⚠️
      <br><br>
    
      ||||||||||<br><br>
    
    Cloud Atlas is an independent, community-owned Google Earth, free from centralized servers and overpowered entities, owned solely by you and the public!<br><br>
    No back-end! Syncs via public tracker networks. Now BitTorrent, fallback to Nostr coming...<br><br>

    What's stopping you from creating right now? Make the world work!<br>
    <a target="_blank" href="https://github.com/worldpeaceenginelabs/METAVERSE-SEED">Check out our GitHub and Collaboration Hub</a><br>
    UI and apps thrive solely on your feedback. We've developed Crowd Engineering into an application.<br><br>
</h4>
  
  {#if $isFormDisabled}
  <p style="color: red;">The form is not available due to the record limit.</p>
{:else}
  <form>
    <label>Title:</label><br>
    <input type="text" placeholder="The issue in one sentence - max 100 chars (ChatGPT)" maxlength="100" bind:value={record.title} required><br>

    <label>Text:</label><br>
    <textarea placeholder="Describe positive outcome in 10 #hashtags - max 150 chars (ChatGPT)" maxlength="150" bind:value={record.text} required></textarea><br>

    <label>Link:</label><br>
    <input type="text" placeholder="zoom.us/... no https etc." maxlength="100" bind:value={record.link} required><br>

    <input type="hidden" bind:value={record.latitude} required>
    <input type="hidden" bind:value={record.longitude} required>

    {#if $coordinates.latitude && $coordinates.longitude}
      <p style="color: green;">Coordinates: {$coordinates.latitude}, {$coordinates.longitude}</p>
    {:else}
      <p style="color: red;">Click on the map to fetch coordinates</p>
    {/if}

    <button on:click|preventDefault={send}>Send Record</button>
  </form>
  {/if}

</main>

<style>
  main {
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 0rem;
    font-size: small;
  }

  #records {
    border: 1px solid #ccc;
    padding: 0.5rem;
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
    padding: 0rem;
    margin-bottom: 0rem;
  }

  button {
    padding: 0.5rem 1rem;
  }

  h4 {
    text-align: right;
    height: 100px;  /* Set the height to make the content scrollable */
    overflow: auto; /* Enable scrolling when content overflows */
    border: 1px solid #ccc; /* Optional: Add a border for better visibility */
    padding: 10px; /* Optional: Add padding for better appearance */
  }

  .highlight {
  color: red; /* Change 'red' to the desired color */
  }

</style>
