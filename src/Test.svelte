<script lang="ts">

    // Allowed dependencies

    import { joinRoom } from 'trystero';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    
    // App initialization
    // Check if an indexeddb with the name "indexeddbstore" and the two objectstores "mapmarker" and "client" already exists.
    // indexeddb.createObjectStore('mapmarker', { keyPath: 'mapid' });
    // indexeddb.createObjectStore('client', { keyPath: 'appid' });


    // If not, create an indexeddb with the name "indexeddbstore".
    // Create two objectstores.
   

    // If the indexeddb with the name indexeddbstore already exists, check if appid and username already exists in the objectstore "client".
    // If not, store a randomuuid into the objectstore "client" in username.
    // Then fetch the username from the objectstore "client", add a salt (let salt = salt1234), and take a sha256 hash of "username+salt".
    // Write this hash into the objectstore "client" in appid.

    // If an appid and username already exists in the objectstore "client", fetch them from the objectstore "client",
    // add the same salt from before (same variable let=salt) to the fetched username and create a sha256 hash from the combination (hash of username+salt12345)


    // Join the user to a room with a namespace:
    const config = { appId: 'hashOfRandomuuidPlusSecretsalt' };
    const room = joinRoom(config, 'chat-room');
  
    const messages = writable<string[]>([]);
    let message = '';
  
    // Nachrichtensendeaktion erstellen
    const [sendMessage, getMessage] = room.makeAction('message');
  
    // Empfange Nachrichten von anderen Peers
    getMessage((data: string) => {
      messages.update(msgs => [...msgs, data]);
    });
  
    // Nachricht senden und empfangen
    const send = () => {
      if (message.trim()) {
        sendMessage(message);
        messages.update(msgs => [...msgs, message]);
        message = '';
      }
    };
  
    onMount(() => {
      room.onPeerJoin(peerId => console.log(`Peer ${peerId} joined`));
      room.onPeerLeave(peerId => console.log(`Peer ${peerId} left`));
    });
  </script>
  
  <main>
    <h1>Svelte P2P Chat</h1>
    <div id="chat">
      {#each $messages as msg}
        <div class="message">{msg}</div>
      {/each}
    </div>
    <input bind:value={message} placeholder="Type a message" on:keypress="{(e) => e.key === 'Enter' && send()}" />
    <button on:click={send}>Send</button>
  </main>
  
  <style>
    main {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 1rem;
    }
  
    #chat {
      border: 1px solid #ccc;
      padding: 1rem;
      height: 300px;
      overflow-y: scroll;
      margin-bottom: 1rem;
    }
  
    .message {
      padding: 0.5rem;
      border-bottom: 1px solid #eee;
    }
  
    input {
      width: calc(100% - 2rem);
      padding: 0.5rem;
      margin-right: 1rem;
    }
  
    button {
      padding: 0.5rem 1rem;
    }
  </style>
  