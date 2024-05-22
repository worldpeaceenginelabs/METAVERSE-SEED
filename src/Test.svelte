<script lang="ts">

// Allowed dependencies

import { joinRoom } from 'trystero';
import { onMount } from 'svelte';
import { writable } from 'svelte/store';
    



    // App initialization
    // Check if an indexeddb with the name "indexeddbstore" and the two objectstores "locationpins" and "client" already exists.
    // If not, create them.
    // indexeddb.createObjectStore('locationpins', { keyPath: 'mapid' });
    // indexeddb.createObjectStore('client', { keyPath: 'appid' });
   
    // If the indexeddb with the name indexeddbstore already exists, check if appid and username already exists in the objectstore "client".
    // If not, store a randomuuid into the objectstore "client" in username.
    // Then fetch the username from the objectstore "client", add a salt (let salt = salt1234), and take a sha256 hash of "username+salt".
    // Write this hash into the objectstore "client" in appid.

    // If an appid and username already exists in the objectstore "client", fetch them from the objectstore "client",
    // add the same salt from before (same variable let=salt) to the fetched username and create a sha256 hash from the combination (hash of username+salt12345)
    // Fetch appid from the objectstore "client" and match with the just new generated hash.
    // If the new hash and the hash in the objectstore mismatch = start from "App initialization" again.
    // If they match, the user is allowed to join the room, and console.log("username" with "appid" authorized) 
    



// Trystero logic

// Join the user to a room with a namespace:
    const config = { appId: 'hashOfRandomuuidPlusSecretsalt' };
    const room = joinRoom(config, 'chat-room');
  
    const messages = writable<string[]>([]);
    let message = '';

// Create message send action
const [sendMessage, getMessage] = room.makeAction('message');

// Message cache to send messages to new peers
let messageCache: string[] = [];

// Receive messages from other peers
getMessage((data: string, peerId: string) => {
    if (!messageCache.includes(data)) {
        messages.update(msgs => [...msgs, data]);
        messageCache.push(data); // Add message to cache
    }
});

// Send and receive messages
const send = () => {
    if (message.trim()) {
        sendMessage(message);
        messages.update(msgs => [...msgs, message]);
        messageCache.push(message); // Add message to cache
        message = '';
    }
};

// New peers receive all previous messages
const [sendCache, getCache] = room.makeAction('cache');

getCache((data: string[]) => {
    const receivedMessages = data.filter(msg => !messageCache.includes(msg));
    messages.update(msgs => [...msgs, ...receivedMessages]);
    messageCache.push(...receivedMessages); // Add messages to cache
});

onMount(() => {
    room.onPeerJoin(peerId => {
        console.log(`Peer ${peerId} joined`);
        // Send message cache to the new peer, but only the messages the peer doesn't have yet
        sendCache(messageCache);
    });
    room.onPeerLeave(peerId => console.log(`Peer ${peerId} left`));
});




    // Store only received messages into the objectstore "locationpins"
    // Delete all messages older then 7 days from the objectstore "locationspins"




  </script>
  
  <main>
    <h3>P2P WebRTC without signal server but the public Bittorrent tracker network instead.<br>Testing out a few things! The globe is coming back soon...</h3>
    
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
  