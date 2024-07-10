# METAVERSE-SEED

![image](https://github.com/worldpeaceenginelabs/METAVERSE-SEED/assets/67427045/af250984-bd9f-4473-bf41-9ff24a6947f8)

https://cloudatlas.club<br>
[Live on Cloudflare](https://metaverse-seed.pages.dev/) <br>
[Live Edit on Stackblitz](https://stackblitz.com/github/worldpeaceenginelabs/metaverse-seed)

Restarted project The Seed at 30.03.2024<br><br>

# Metaverse-Seed/CLOUD ATLAS

Metaverse-Seed is the repository where we collaboratively work together on Cloud Atlas, a Collective Computer akin to those from the movies:<br><br>

Cloud Atlas - An independent, community-owned Google Earth, free from centralized servers and monopolized players, owned solely by you and the public!<br>
No backend! Syncs via public tracker networks. Now BitTorrent, with fallback to Nostr coming soon...<br><br>

A server farm-less, decentralized Google Earth running as a 4MB standalone package, capable of working offline in your browser. Scales automatically with its user devices. You are the server farm.<br><br>

### Imagine building Google Maps/Earth ourselves and adding all the services that we wish, free from the grip of any profit-oriented entity. Bye bye monopolies, highly influential lone wolves, guerrillas, governmental and political cults.
### Imagine decentralized payments without middleman. Bye bye banks.
### Imagine crowd engineering and petitioning combined with crowdfunding. Imagine decentralized allocation of homes, schools, jobs, medical services, transport, food, goods and services. Bye bye governments...
<br>

# Running prototype

Open this app on another tab: They sync!<br>
Open this on your mobile and desktop: They sync!<br>
Call all your friends and tell them to open this web in their browser: Guess what? They sync!!!<br><br>

With Cloud Atlas, users can create searchable pins and indexes on the map with a simple click or touch, without worrying about back-ends or programming. Cloud Atlas scales automatically with it's user devices!

A pin can represent everything: posts, profiles, links, streams, apps, games, your business, your non-profit organisation - you name it - Literally! For displays, AR, and VR out of the box!

I've always held the theory that "everything is already there, it is just mismanaged".
Cloud Atlas is a Collective Computer and was realized with only two publicly available repositories:<br><br>

## CesiumJS is a powerful open-source JavaScript library for creating 3D globes and maps on the web

It enables high-performance visualization of geospatial data, dynamic data, and 3D models. Integrating seamlessly with Unreal Engine and Unity 3D, it leverages advanced rendering and development tools to create high-fidelity, interactive 3D geospatial experiences for urban planning, simulations, immersive virtual environments, apps, and games, supporting display, AR, and VR out of the box.

## Metaverse-Seed is fully decentralized and uses Trystero as "back-end"! How does it connect?

To establish a direct peer-to-peer connection with WebRTC, a signalling channel is needed to exchange peer information (SDP). Typically this involves running your own matchmaking server but Trystero abstracts this away for you and offers multiple "serverless" strategies for connecting peers (currently BitTorrent, Nostr, MQTT, Firebase, and IPFS).
Metaverse-Seed uses the BitTorrent strategy: peer-to-peer real-time data transfers with WebRTC, but without signal server but the public Bittorrent tracker network instead. A network consisting of 2 Billion users. One quarter of the world's population.<br><br>

# Basics

- Location pins can be everything (Info, News, Brainstorming, Event, Petition, Crowdfunding, Live Stream, App, Game, VR Location, Live Stream, and/or game, everything else...) and are shared directly peer-to-peer (P2P) between users via WebRTC.
- Map tiles can come from every accessible map tile API, but will eventually also be shared directly peer-to-peer (P2P) between users via WebRTC in the future.

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

# Pitch

Buckminster Fuller once said, "You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete."<br><br>

Ira Chaleff, in his book Intelligent Disobedience: Doing Right When What You're Told to Do Is Wrong, stated, "A function of civil society is to organize ourselves to collectively stand up to those who add to the suffering of others."<br><br>

Inspired by these visions, Cloud Atlas was born: a decentralized platform akin to a global, user-owned Google Earth. Imagine a collective computer similar to the one in the post-scarcity society of Star Trek, and a basic digital government gradually replacing traditional governments. Cloud Atlas empowers users to create micro and large-scale missions, projects, and apps effortlessly.<br><br>

For non-technical users, the platform offers seamless linking to existing infrastructures or resources, whether it's a website, web app, GitHub repository, game on Steam/Epic Games, or even online meetings and live streaming. The possibilities are endless.<br><br>

Developers can extend and customize every aspect, from the UI to elements, using their preferred programming languages or graphical development environments like Unreal Engine 5 and Unity 3D. With CesiumJS services and a range of free tools, visualizing and animating data on the globe becomes straightforward.<br><br>

With Cloud Atlas, users and developers can create searchable pins and indexes on the map with a simple click or touch, without complex back-ends or programming. These can represent anything: posts, profiles, links, streams, apps, games - you name it - Literally! For displays, AR, and VR out of the box!<br><br>

Trystero ensures decentralized data synchronization in the background via WebRTC and Bittorrent-Signaling, though traditional data persistence methods are also supported out of the box. Cloud Atlas is integrative and flexible, allowing IoT devices, sensors, or any other data sources and devices to be added to the globe or individual pins.<br><br>

Additionally, Cloud Atlas offers digital governance through Crowd Engineering Missions: a sequence of brainstorming, petitioning, crowdfunding, and action events, accelerating the journey from problem to solution to realization, to a fraction of the time compared to traditional governments.<br><br>

Cloud Atlas aims to become the world's united operating system. Whether private or public, local or global, idea generation or conflict resolution, non-profit initiative or profitable enterprise – with Cloud Atlas, anything is possible.<br><br>

Our Main Directive: "Make the world work for 100% of humanity, in the shortest possible time, through spontaneous cooperation, without ecological offense or the disadvantage of anyone."<br><br>

##### A working prototype already exists: Imagine a Google Earth without the server farm, where data is transferred in the background via peer-to-peer WebRTC, while signaling is done via the worldwide BitTorrent network.

# Introduction to Metaverse-Seed

Introducing "The Seed" – where developers wield the power to forge their own decentralized Metaverses! With this Dev Kit, developers can unleash their creativity, crafting unique digital realms that seamlessly connect with others. Imagine a network where Metaverses, created by different developers, intertwine to form a decentralized ecosystem.

This Dev Kit isn't just a tool – it's a catalyst for innovation, enabling developers to shape the digital landscape like never before. Together, we're building a Collective Computer, transcending the limitations of individual projects to create something truly extraordinary. "The Seed" puts the control firmly in the hands of developers, freeing them from the grasp of monopolies and ushering in a new era of digital collaboration.

With "The Seed" you will create your own, location based, decentralized Metaverses, apps, games, whatever... as a Webapp which is a website that can be installed on mobile and desktop like an app. 
Let's make this tiny Dev Kit the base for our creativity and creations, this way let our Metaverses stay compatible with each other, so in turn we will be able to share our private hosted, free tier hosted, paid servers, user devices! etc. to decentralize our Nexus of Metaverses.

Picture it: Your single creations adding up to a Collective Computer rivaling the might of Google Earth, but run by the people, for the people. No longer under the thumb of monopolies – "The Seed" places the power directly in your hands. Join us in sculpting a digital frontier where innovation knows no bounds. It's time to unlock the true potential of the digital realm – it's time to grow with "The Seed".

## What is it?

A client which is meant as a clean start point for decentralized, location based apps. I even go so far to say, EVERY APP should be location based! Since everything in reality is happening in the 3D space anyway, we miss a lot of spatial intelligence and even very positive outcomes/synergies in app logic, compared to our traditional systems today.

This repository is a clean code base with basic instructions (coming) for expanding it with your creativity and all available tools (HTML, JS, CSS, APIs! (JAMstack),  WASM (C, C++, Rust for the Web), WebContainers (Node in Browser), Unreal Engine 5 (C++ and visual blueprints), Unity6 (C#), and you name it!, to unleash your creativity without without caring to much about the back-end scaling (99% "automatically") or locking you in!

# HOW TO...

### How to create your idea, app, game, network...?
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
