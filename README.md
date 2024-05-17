# METAVERSE-SEED
[Live on Cloudflare](https://metaverse-seed.pages.dev/) <br>
[Live Edit on Stackblitz](https://stackblitz.com/github/worldpeaceenginelabs/metaverse-seed)

Restarted project The Seed at 30.03.2024

Introducing "The Seed" – where developers wield the power to forge their own decentralized Metaverses! With this Dev Kit, developers can unleash their creativity, crafting unique digital realms that seamlessly connect with others. Imagine a network where Metaverses, created by different developers, intertwine to form a decentralized ecosystem.

This Dev Kit isn't just a tool – it's a catalyst for innovation, enabling developers to shape the digital landscape like never before. Together, we're building a Collective Computer, transcending the limitations of individual projects to create something truly extraordinary. "The Seed" puts the control firmly in the hands of developers, freeing them from the grasp of monopolies and ushering in a new era of digital collaboration.

With "The Seed" you will create your own, location based, decentralized Metaverse, as a Webapp which can be installed on mobile and desktop like an app. 
Let's make this tiny Dev Kit the base for our creativity and creations, this way let our Metaverses stay compatible with each other, so in turn we will be able to share our private hosted, free tier hosted, paid servers, user devices! etc. to decentralize our Nexus of Metaverses.

Picture it: Your single creations adding up to a Collective Computer rivaling the might of Google Earth (if their devs would not sleep), but run by the people, for the people. No longer under the thumb of monopolies – "The Seed" places the power directly in your hands. Join us in sculpting a digital frontier where innovation knows no bounds. It's time to unlock the true potential of the digital realm – it's time to grow with "The Seed".

## What is it?

A client/server which is meant as a clean start point for location based apps. I even go so far to say, EVERY APP should be location based! Since everything in reality is happening in the 3D space anyway, we miss a lot of spatial intelligence and even very positive outcomes/synergies in app logic, compared to our traditional systems today.

This repository is a clean code base with basic instructions (coming) for expanding it with your creativity and all available tools (HTML, JS, CSS, APIs! (JAMstack),  WASM (C, C++, Rust for the Web), WebContainers (Node in Browser), Unreal Engine 5 (C++ and visual blueprints), Unity6 (C#), and you name it!, to unleash your creativity without without caring to much about the back-end scaling (99% "automatically") or locking you in!

# HOW TO...

### How to create a client?
- clone
- npm install
- npm run dev
 
Enjoy only the per page view and the bind feature of Svelte, but Code in Javascript! Blazing fast because the build output is your app precompiled. Static, but reactive! This is JAMstack, which runs on edge and every other storage.

- Form_prototype.svelte (showcase and livepage coming, infinit possibilities. For instance Title, Text, Zoom Link, and Coordinates alone are already enabling Online Meetings, but location based, for instance brainstorming, event planning, live session, you name it... It's perfect for social networks, multiplayer games, E-Learning, you name it...)
- from here you can do litteraly everything because you can connect everything with this digtal twin of the globe:
HTML, JS, CSS, APIs! (JAMstack),  WASM (C, C++, Rust for the Web), WebContainers (Node in Browser), Unreal Engine 5 (C++ and visual blueprints), Unity6 (C#), you name it!

### How to create a server?
- npm run server.js

# FEATURES 

### What does it do for now?

- The client deduplicates the client's IndexedDB entries by ID.
- The client deletes messages in the IndexedDB that are older than 7 days every 24 hours.
- The example client and server are broadcasting messages published to topic 1 to all clients.
- The client schedules turning the connection on and after 5min off, as well as reconnecting at a random time between 10-30min.

Regarding the WebSocket connection behavior:

Currently, when the WebSocket connection starts, it shuts down after five minutes regardless of activity and reconnects after a random time between 10 and 30 minutes. This setting is suitable for networks where real-time updates are not necessary but everyone needs to stay updated.

This simple setup ensures two things:
   1. If the server disconnects all clients simultaneously, not all clients come back online at the same time, potentially avoiding another server outage.
   2. The connection remains open only for the necessary duration. Five minutes should be sufficient to synchronize all changes; if not, the process repeats and/or continues during the next connection attempt.

You can already control the likelihood of concurrent connections. Currently, the probability is 12:1/h (5 minutes), plus the randomness of reconnection, of clients being online simultaneously. Lowering the connection duration from 5 minutes to 1 minute reduces the chance to 60:1, plus the randomness of reconnection.

For my project, Cloud Atlas, based on Metaverse-Seed, I will maintain this setup until an average of 1 million clients are online simultaneously (uWebSockets can theoretically handle up to 5 million concurrent connections). Afterward, as the user base grows, I will decrease the connection duration from 5 minutes to 1-3 minutes to scale the server. This ensures that fewer online clients coincide at the same time, which is acceptable when still being connected to a big fraction of millions of users. And on the next reconnect to another big fraction. Till everything is synced.

Feel free to experiment with different strategies to find the optimal one for your development or business scenario!

Remove the turn off and set the reconnection strategy to a fixed 0.083 seconds (because of the multiplicator in the random function) for reconnecting after 1000ms (1 second) for real-time.

### What's now?
Now i'm searching for the most simple logic without storing to much bs or private data, so the websockets server is not transfereing already sent data to each other again.
Any help appreciated (30.03.2024)

### What's coming?
Optimizing the base:
- Progressive Web App features (PWA)
- transfer limiting
- rate limiting
- authentication-"less" authentication
- many more ideas, but one of them is webrtc on top, as a second sync channel for client to client sync, saving server ressources.
- multiple other protocols as fallbacks
- the performance is already high due to Sveltes precompile step. But with Bun instead of Nodejs, the performance could get up another 2-4 times!!!

### About the performance of the uwebsocket server

[https://unetworkingab.medium.com/100k-secure-websockets-with-raspberry-pi-4-1ba5d2127a23](https://unetworkingab.medium.com/100k-secure-websockets-with-raspberry-pi-4-1ba5d2127a23)

[https://unetworkingab.medium.com/5-million-http-3-requests-per-second-d8f0074a5367](https://unetworkingab.medium.com/5-million-http-3-requests-per-second-d8f0074a5367)

[https://ga1.medium.com/exploring-the-power-of-uwebsockets-a-high-performance-websocket-library-83aedc26ae1](https://ga1.medium.com/exploring-the-power-of-uwebsockets-a-high-performance-websocket-library-83aedc26ae1)
