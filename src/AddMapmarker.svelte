<script lang="ts">
  import { joinRoom } from 'trystero';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { coordinates } from './store.js';

  // Define the IndexedDB database
  let indexeddb: IDBDatabase;

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

  // Function to authorize the user
  async function authorizeUser() {
    const transaction = indexeddb.transaction(['client'], 'readwrite');
    const store = transaction.objectStore('client');

    // Get the username and appid from the client object store
    const getUsername = store.get('username');
    const getAppId = store.get('appid');

    // Wait for the requests to complete
    const usernameRequest = await new Promise((resolve, reject) => {
      getUsername.onsuccess = () => resolve(getUsername.result);
      getUsername.onerror = () => reject(getUsername.error);
    });

    const appidRequest = await new Promise((resolve, reject) => {
      getAppId.onsuccess = () => resolve(getAppId.result);
      getAppId.onerror = () => reject(getAppId.error);
    });

    // Assign the results to variables
    const username = usernameRequest;
    const appid = appidRequest;

    // If the username or appid doesn't exist, create a new one
    if (!username || !appid) {
      const randomUUID = crypto.randomUUID();
      const salt = 'salt1234';
      const hashedUsername = await hashData(randomUUID + salt);

      // Store the new username and appid in the client object store
      const newTransaction = indexeddb.transaction(['client'], 'readwrite');
      const newStore = newTransaction.objectStore('client');
      newStore.put({ appid: hashedUsername, username: randomUUID });
    } else {
      // If the username and appid exist, check if they match
      const salt = 'salt1234';
      const hashedUsername = await hashData(username + salt);

      // If they don't match, re-authorize the user
      if (hashedUsername !== appid) {
        await authorizeUser();
      } else {
        console.log(`${username} with ${appid} authorized`);
      }
    }
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
    return new Promise<Record[]>((resolve, reject) => {
      const request = store.openCursor();

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
    await authorizeUser();
    deleteOldRecords(); // Delete old records on app start
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
  const MAX_CACHE_SIZE = 1000;

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
      if ($coordinates.latitude && $coordinates.longitude && recordIsValid(record)) {
        records.update(recs => [...recs, record]);
        recordCache.push(record);

        // Maintain cache size limit
        if (recordCache.length > MAX_CACHE_SIZE) {
          recordCache.shift(); // Remove the oldest record
        }

        await storeRecord(record);
        console.log('Self-processed the sent record and stored in IndexedDB');
      }

      record = createEmptyRecord(); // Reset record

    } else {
      console.log('Please click on the map to fetch coordinates');
    }
  };

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

  // Subscribe to coordinates from click/touch in store
  coordinates.subscribe(value => {
    record.latitude = value.latitude;
    record.longitude = value.longitude;
  });

  onMount(() => {
    initializeApp();

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
    const isTitleValid = rec.title.trim() !== '';
    // Regular expression to check if the link starts with the specified patterns
    const linkPattern = /.*(?=zoom\.us\/)/;
    const isLinkValid = linkPattern.test(rec.link.trim());
    
    return isTitleValid && isLinkValid;
  }

  // Function to validate latitude and longitude with max 6 decimal places
  function isValidCoordinate(coord) {
    // Regular expression to match coordinates with up to 6 decimal places
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

  interface Record {
    mapid: string;
    timestamp: string;
    title: string;
    text: string;
    link: string;
    longitude: string;
    latitude: string;
  }
</script>

<main>
  <h4>
    <span class="highlight">🔥🔥🔥 <br>
      Post cant be edited or deleted and deleting themself after 30 days.<br>
      The first app is Brainstorming on private and public, local and global issues and solutions. More apps? Hit me and our fellows anytime on GitHub, Gitter.im, and the coming weekly Zoom Brainstormings on Youtube.</span><br><br>

    Welcome to Cloud Atlas, your gateway to a new decentralized world!<br><br>
    
    Cloud Atlas is an independent, community-owned Google Earth, free from centralized servers and overpowered entities, owned solely by you and the public!<br><br>
    No back-end! Syncs via public tracker networks. Now BitTorrent, fallback to Nostr coming...<br><br>

    What's stopping you from creating right now? Make the world work!<br>
    <a target="_blank" href="https://github.com/worldpeaceenginelabs/METAVERSE-SEED">Check out our GitHub and Collaboration Hub</a><br>
    UI and apps thrive solely on your feedback. We've developed Crowd Engineering into an application.<br><br>

    Imagine creating our own version of Google Maps/Earth, incorporating all the services we desire, free from the constraints of profit-driven entities. Goodbye monopolies, influential lone wolves, guerrillas, and political cults.<br><br>

Imagine decentralized payments without intermediaries. Goodbye banks.<br><br>

Imagine combining crowd engineering and petitioning with crowdfunding. Envision decentralized allocation of homes, schools, jobs, medical services, transport, food, goods, and services. Goodbye governments, corporations, employers, and landlords.<br><br>

And don't forget ChatGPT, evolving rapidly to become your all-day digital assistant with coming access to your display and the Cloud Atlas API.<br><br>

    Open this app on another tab: They sync!<br>
    Open this on your mobile and desktop: They sync!<br>
    Call all your friends and tell them to open this web-app in their browser: Guess what? They sync!!!<br><br>

    With Cloud Atlas, users can create searchable pins and indexes on the map with a simple click or touch, without worrying about back-ends or programming. Cloud Atlas scales automatically with it's user devices!<br><br>

    A pin can represent everything: posts, profiles, links, streams, apps, games, your non-profit business, your business - you name it - Literally! For displays, AR, and VR out of the box!<br><br>

    Higly adaptable:<br>
    The first "app" is Brainstorming on Zoom Meetings. Simple as that. Now, imagine re-engineering the Couchsurfing app (free home/shelter allocation, which went commercial due to lack of funding). By simply changing the link validation to another URL and modifying the button text, you can create a new app.<br><br>

    This network is free of cost. Funding not needed. If needed: Crowdfunding it is!<br><br>

    The possibilities are endless. The question is: How can we implement various apps in an organized way, ensuring the most sustainable ones remain prioritized?<br><br>

    I've always held the theory that "everything is already there, it is just mismanaged".<br>
    Cloud Atlas is a Collective Computer and was realized with only two publicly available repositories and watching too much science fiction:<br><br>

    CesiumJS is a powerful open-source JavaScript library for creating 3D globes and maps on the web. It enables high-performance visualization of geospatial data, dynamic data, and 3D models. Integrating seamlessly with Unreal Engine and Unity 3D, it leverages advanced rendering and development tools to create high-fidelity, interactive 3D geospatial experiences for urban planning, simulations, immersive virtual environments, apps, and games, supporting display, AR, and VR out of the box.<br><br>

    To establish a direct peer-to-peer connection with WebRTC, a signaling channel is needed to exchange peer information (SDP). Typically, this involves running your own matchmaking server, but Trystero abstracts this away for you and offers multiple "serverless" strategies for connecting peers (currently BitTorrent, Nostr, MQTT, Firebase, and IPFS). <br><br>

    What's more on GitHub and the internet to aim for the moon of a post-scarcity, post-government society? Imagine dragons...!
  </h4>

  <div id="records" style="height: 20px; overflow-y: scroll;">
    {#each $records as rec}
      <div class="record">
        <p>MapID: {rec.mapid}</p>
        <p>Timestamp: {rec.timestamp}</p>
        <p>Title: {rec.title}</p>
        <p>Text: {rec.text}</p>
        <p>Link: {rec.link}</p>
        <p>Latitude: {rec.latitude}</p>
        <p>Longitude: {rec.longitude}</p>
      </div>
    {/each}
  </div>

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
    text-align: left;
    height: 100px;  /* Set the height to make the content scrollable */
    overflow: auto; /* Enable scrolling when content overflows */
    border: 1px solid #ccc; /* Optional: Add a border for better visibility */
    padding: 10px; /* Optional: Add padding for better appearance */
  }

  .highlight {
  color: red; /* Change 'red' to the desired color */
  }

</style>
