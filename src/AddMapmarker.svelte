<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { joinRoom } from 'trystero';
  import { writable } from 'svelte/store';

  type Record = {
    id: string;
    timestamp: string;
    title: string;
    text: string;
    link: string;
    longitude: string;
    latitude: string;
  };

  export const recordsStore = writable<Record[]>([]);

  let title = '';
  let text = '';
  let link = '';
  let longitude = '';
  let latitude = '';
  let message = '';

  let tempRecords: Record[] = [];
  let db: IDBDatabase;
  let room: any;
  let sendRecord: (record: Record) => void;
  let receiveRecord: (callback: (record: Record, peerId: string) => void) => void;

  const openDB = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('svelte-trystero-db', 1);

      request.onupgradeneeded = (event) => {
        db = request.result;
        db.createObjectStore('records', { keyPath: 'id' });
        db.createObjectStore('app', { keyPath: 'key' });
      };

      request.onsuccess = () => {
        db = request.result;
        resolve(db);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  const getAppId = () => {
    return new Promise<string>((resolve, reject) => {
      const transaction = db.transaction('app', 'readonly');
      const store = transaction.objectStore('app');
      const request = store.get('appId');

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.value);
        } else {
          const newAppId = crypto.randomUUID();
          const putTransaction = db.transaction('app', 'readwrite');
          const putStore = putTransaction.objectStore('app');
          putStore.put({ key: 'appId', value: newAppId });
          putTransaction.oncomplete = () => {
            resolve(newAppId);
          };
          putTransaction.onerror = () => {
            reject(putTransaction.error);
          };
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  const getAllIndexedDBRecords = () => {
    return new Promise<Record[]>((resolve, reject) => {
      const transaction = db.transaction('records', 'readonly');
      const store = transaction.objectStore('records');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  const addIndexedDBRecord = (record: Record) => {
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('records', 'readwrite');
      const store = transaction.objectStore('records');
      const request = store.add(record);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        if (request.error.name === 'ConstraintError') {
          console.warn('Duplicate ID:', record.id);
        }
        reject(request.error);
      };
    });
  };

  const handleSubmit = async () => {
    const record: Record = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      title,
      text,
      link,
      longitude,
      latitude
    };

    // Send the record via Trystero
    sendRecord(record);

    // Reset form fields
    title = '';
    text = '';
    link = '';
    longitude = '';
    latitude = '';
  };

  onMount(() => {
    openDB().then(async (database: IDBDatabase) => {
      db = database;
      const appId = await getAppId();

      // Create a Trystero room
      room = joinRoom({ appId }, 'svelte-trystero-room');

      // Listen for peers joining the room
      room.onPeerJoin((peerId: string) => {
        console.log(`${peerId} joined the room`);
      });

      // Listen for peers leaving the room
      room.onPeerLeave((peerId: string) => {
        console.log(`${peerId} left the room`);
      });

      // Create actions for sending and receiving records
      const actions = room.makeAction('newRecord');
      sendRecord = actions[0] as (record: Record) => void;
      receiveRecord = actions[1] as (callback: (record: Record, peerId: string) => void) => void;

      // Subscribe to new records from the room
      receiveRecord(async (trysteroRecord: Record, peerId: string) => {
        tempRecords = [trysteroRecord, ...tempRecords];
        recordsStore.set(tempRecords); // Update the store with new records

        // Add received records to IndexedDB
        try {
          await addIndexedDBRecord(trysteroRecord);
        } catch (error) {
          console.error('Failed to add record from Trystero to IndexedDB:', error);
        }
      });

      // Fetch existing records from IndexedDB
      getAllIndexedDBRecords().then((indexedDBRecords) => {
        tempRecords = indexedDBRecords;
        recordsStore.set(tempRecords); // Update the store with stored records
      });

      return () => {
        // Leave the Trystero room when the component unmounts
        room.leave();
      };
    }).catch((error) => {
      console.error('Failed to open database:', error);
    });
  });

  onDestroy(() => {
    room.leave();
  });
</script>

<!-- Form for inputting new records -->
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

<!-- Styling for the form -->
<style>
  form {
    display: flex;
    flex-direction: column;
    max-width: 300px;
  }

  label, input, button {
    margin-bottom: 10px;
  }
</style>
