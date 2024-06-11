# METAVERSE-SEED
[Live on Cloudflare](https://metaverse-seed.pages.dev/) <br>
[Live Edit on Stackblitz](https://stackblitz.com/github/worldpeaceenginelabs/metaverse-seed)

Restarted project The Seed at 30.03.2024

# In one sentence

A decentralized Google Earth running as a 4MB stand-alone package, capable of working offline, in your browser.


## Metaverse-Seed is fully decentralized and uses Trystero as "back-end"! How does it connect?

To establish a direct peer-to-peer connection with WebRTC, a signalling channel is needed to exchange peer information (SDP). Typically this involves running your own matchmaking server but Trystero abstracts this away for you and offers multiple "serverless" strategies for connecting peers (currently BitTorrent, Nostr, MQTT, Firebase, and IPFS).
Metaverse-Seed uses the BitTorrent strategy: peer-to-peer real-time data transfers with WebRTC, but without signal server but the public Bittorrent tracker network instead. A network consisting of 2 Billion users. One quarter of the world's population.

# Short description

- Location pins (Info, News, Brainstorming, Event, Petition, Crowdfunding, Live Stream, App, Game, VR Location, Live Stream, and/or game, everything else...) are shared directly peer-to-peer (P2P) between users via WebRTC.
- Map tiles can come from every accessible map tile API, but will also be shared directly peer-to-peer (P2P) between users via WebRTC.
- Apps, code, and assets will be shared directly peer-to-peer (P2P) between users via WebRTC.

# FEATURES

### Already working / What's coming?

- [x] Authentication-less authentication. (combo from appid + ENVsalt + https)
- [x] Trystero connects everyone using the app.
- [x] Records are transferred between all online users.
- [x] If a new user comes online, the new user gets all past records from the other users' record cache.
- [x] Only records which are received via Trystero (also valid for the sender) are stored in IndexedDB.
- [x] Records older than 7 days are deleted "on every submit". (will be changed to "on every init")
- [x] IndexedDB refills the record cache after reload.
- [ ] The globe populates pins from IndexedDB.
- [ ] Progressive Web App features (PWA).
- [ ] Transfer limiting.
- [ ] Rate limiting.
- [ ] WebRTC channel for synchronizing assets (get client from client, P2P downloadable software).
- [ ] Multiple other protocols as fallbacks.
- [ ] Bluetooth beacon and other Adhoc strategies (quickshare?)
- [ ] Decentralized domains.

# Introduction

Introducing "The Seed" – where developers wield the power to forge their own decentralized Metaverses! With this Dev Kit, developers can unleash their creativity, crafting unique digital realms that seamlessly connect with others. Imagine a network where Metaverses, created by different developers, intertwine to form a decentralized ecosystem.

This Dev Kit isn't just a tool – it's a catalyst for innovation, enabling developers to shape the digital landscape like never before. Together, we're building a Collective Computer, transcending the limitations of individual projects to create something truly extraordinary. "The Seed" puts the control firmly in the hands of developers, freeing them from the grasp of monopolies and ushering in a new era of digital collaboration.

With "The Seed" you will create your own, location based, decentralized Metaverse, as a Webapp which can be installed on mobile and desktop like an app. 
Let's make this tiny Dev Kit the base for our creativity and creations, this way let our Metaverses stay compatible with each other, so in turn we will be able to share our private hosted, free tier hosted, paid servers, user devices! etc. to decentralize our Nexus of Metaverses.

Picture it: Your single creations adding up to a Collective Computer rivaling the might of Google Earth, but run by the people, for the people. No longer under the thumb of monopolies – "The Seed" places the power directly in your hands. Join us in sculpting a digital frontier where innovation knows no bounds. It's time to unlock the true potential of the digital realm – it's time to grow with "The Seed".

## What is it?

A client which is meant as a clean start point for decentralized, location based apps. I even go so far to say, EVERY APP should be location based! Since everything in reality is happening in the 3D space anyway, we miss a lot of spatial intelligence and even very positive outcomes/synergies in app logic, compared to our traditional systems today.

This repository is a clean code base with basic instructions (coming) for expanding it with your creativity and all available tools (HTML, JS, CSS, APIs! (JAMstack),  WASM (C, C++, Rust for the Web), WebContainers (Node in Browser), Unreal Engine 5 (C++ and visual blueprints), Unity6 (C#), and you name it!, to unleash your creativity without without caring to much about the back-end scaling (99% "automatically") or locking you in!

# HOW TO...

### How to create a client?
- clone
- npm install
- npm run dev

##### No framework boilerplate
Enjoy only the per page view, reactive store, and the bind feature of SvelteJS, but code in plain Javascript! (every .svelte file is a page AND a component, based on your usecase. every file has an area for script, markup, css per page/component)

Blazing fast because the build output is your app precompiled. Static, but reactive! This is SvelteJS/JAMstack, which runs on edge and every other storage. 😝

Simply get started with whatever you can think of. Everything is well pre-configured. In turn you can start to code your idea instant, without thinking about the repo configuration or the back-end. In Javascript, without any framework boilerplate. Only the reactive store and the binds are Sveltejs, but the modifications/extensions can be done by anyone who knows JS without understanding a shred of Sveltejs. (when you see how the form in AddMapmarker.svelte works, it will click, promise! 😉😁)

- Cesium.svelte: Here you control the globe and the population with entities (pins, objects, events, apps, etc...)

- AddMapmarker.svelte: Infinit possibilities. For instance Title, Text, Zoom Link, and Coordinates alone are already enabling Online Meetings, but location based, for instance brainstorming, event planning, live session, you name it... It's perfect for social networks, multiplayer games, E-Learning, you name it...

- from here you can do litteraly everything because you can connect everything with this digtal twin of the globe:
HTML, JS, CSS, APIs! (JAMstack),  WASM (C, C++, Rust for the Web), WebContainers (Node in Browser), Unreal Engine 5 (C++ and visual blueprints), Unity6 (C#), you name it!
