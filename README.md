![image](https://github.com/user-attachments/assets/7fd81918-d51f-465b-b396-99287b8f6607)
# You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete. _Buckminster Fuller_
<br>

**Live Domain:** [cloudatlas.club](https://cloudatlas.club)  
**Live Edit on Stackblitz:** [Metaverse-Seed (MAIN)](https://stackblitz.com/~/github.com/worldpeaceenginelabs/METAVERSE-SEED)  
**Live Preview:** [Preview](https://preview.metaverse-seed.pages.dev/)  
**Join Our Discussion:** [CCC - Collective Computer Collaboration Hub (Developer Chat)](https://app.element.io/#/room/#METAVERSE-DAO_CLOUD-ATLAS_community:gitter.im)
<br>

Restarted Project The Seed on 30.03.2024
<br><br>

# Want more apps and functions?
Reach out to me and our community anytime on GitHub, Gitter.im, or during our upcoming weekly Zoom brainstorming sessions on YouTube.<br><br>

![cloudatlas8k](https://github.com/user-attachments/assets/e4e5443d-7f66-4e2b-a973-f42fe1c113da)
“Decentralization places the globe within your grasp, ensuring your voice resonates daily, not merely at the ballot box every few years. It’s about making your voice count every day, not just delegating it during elections.” BK<br><br>

### Status: Lean Startup Mode (Startup, Incubator & Accelerator united in one entity)<br>Prototyping, MVPs, and Optimizing as an ongoing process.
The first application on Cloud Atlas is Brainstorming. On private and public, local and global issues and tasks.<br>An incubator and accelerator for your ideas, solutions and funding.(GoFundMe implementation coming soon)<br><br>

Simple as that. Now, imagine the crowdfunding feature. By simply changing the link validation to the Gofundme.com URL and modifying the UI (button text and choice brainstorming/crowdfunding on form), you can create a new app.<br><br>

This network is free of cost. Funding not needed. If needed: Crowdfunding it is!<br><br>

The possibilities are endless. The question is: How can we implement various apps in an organized way, ensuring the most sustainable ones remain prioritized?<br><br>

![image](https://github.com/worldpeaceenginelabs/METAVERSE-SEED/assets/67427045/c20604d6-10af-4d98-bab0-05cc053aa743)
### 2D/3D Display, Augmented, Virtual... Everything out of the box!<br><br>


# Metaverse-Seed is the repository where we collaboratively work together on Cloud Atlas, a Collective Computer akin to those from the movies...

### Cloud Atlas - An independent, community-owned Google Earth, free from centralized servers and overpowered entities, owned solely by you and the public!<br>
### No backend! Syncs via public tracker networks. Now BitTorrent, with fallback to Nostr coming soon...<br><br>

### A serverfarm-less, decentralized Google Earth running as a 4MB standalone package, capable of working offline in your browser. Scales automatically with its user devices. You are the server farm.<br><br>

# Imagine...

### Imagine creating our own version of Google Maps/Earth, incorporating all the services we desire, free from the constraints of profit-driven entities. Goodbye monopolies, influential lone wolves, guerrillas, and political cults.
### Imagine decentralized payments without intermediaries. Goodbye banks.
### Imagine combining crowd engineering and petitioning with crowdfunding. Envision decentralized allocation of homes, schools, jobs, medical services, transport, food, goods, and services. Goodbye governments, corporations, employers, and landlords.
### And don't forget ChatGPT, evolving rapidly to become your all-day digital assistant with coming access to your display and the Cloud Atlas API.
<br>

# Running prototype

Open this app on another tab: They sync!<br>
Open this on your mobile and desktop: They sync!<br>
Call all your friends and tell them to open this web-app in their browser: Guess what? They sync!!!<br><br>

With Cloud Atlas, users can create searchable pins and indexes on the map with a simple click or touch, without worrying about back-ends or programming. Cloud Atlas scales automatically with it's user devices!

A pin can represent everything: posts, profiles, links, streams, apps, games, your non-profit business, your business - you name it - Literally! For displays, AR, and VR out of the box!

# Highly Adaptable

The first "app" is Brainstorming on Zoom Meetings. Simple as that. Now, imagine re-engineering the Couchsurfing app (free home/shelter allocation, which went commercial due to lack of funding). By simply changing the link validation to another URL and modifying the button text, you can create a new app.<br><br>

This network is free of cost. Funding not needed. If needed: Crowdfunding it is!<br><br>

The possibilities are endless. The question is: How can we implement various apps in an organized way, ensuring the most sustainable ones remain prioritized?<br><br>

I've always held the theory that "everything is already there, it is just mismanaged".<br>
Cloud Atlas is a Collective Computer and was realized with only two publicly available repositories and watching too much science fiction:<br><br>

### CesiumJS is a powerful open-source JavaScript library for creating 3D globes and maps on the web

It enables high-performance visualization of geospatial data, dynamic data, and 3D models. Integrating seamlessly with Unreal Engine and Unity 3D, it leverages advanced rendering and development tools to create high-fidelity, interactive 3D geospatial experiences for urban planning, simulations, immersive virtual environments, apps, and games, supporting display, AR, and VR out of the box.

### Cloud Atlas is fully decentralized and uses Trystero as "back-end"! How does it connect?

To establish a direct peer-to-peer connection with WebRTC, a signalling channel is needed to exchange peer information (SDP). Typically this involves running your own matchmaking server but Trystero abstracts this away for you and offers multiple "serverless" strategies for connecting peers (currently BitTorrent, Nostr, MQTT, Firebase, and IPFS).<br><br>

Cloud Atlas uses the BitTorrent strategy: peer-to-peer real-time data transfers with WebRTC, but without signal server but the public Bittorrent tracker network instead. A network consisting of 2 Billion users. One quarter of the world's population.<br><br>

What's more on GitHub and the internet to aim for the moon of a post-scarcity, post-government society? Imagine dragons...!<br><br>

# Basics

- Location pins can be everything (Info, News, Brainstorming, Event, Petition, Crowdfunding, Live Stream, App, Game, VR Location, Live Stream, and/or game, your non-profit business, your business, everything else...) and are shared directly peer-to-peer (P2P) between users via WebRTC.
- Map tiles can come from every accessible map tile API (users can use their maptile service api keys and or server addresses in the future), but maptiles will eventually also be shared directly peer-to-peer (P2P) between users via WebRTC in the future.<br><br>

# FEATURES

### Already working / What's coming?

- [x] Authentication-less authentication. Checks indexeddb for username and appid, if no result creates new username and appid (combination from username, appid, ENVsalt + https)
- [x] Trystero connects everyone using the app. Without any server in the middle!!! WebRTC + BitTorrent Signalling 🥷
- [x] Records are transferred between all online users automatically.
- [x] If a new user comes online, the new user gets all past records from the other users' record cache.
- [x] Records older than 30 days are deleted on every app start.
- [x] IndexedDB refills the record cache after reload.
- [x] The globe populates pins from IndexedDB every 5000ms
- [x] Rate limiting. Decentralized approach: More than five post in localpins objectstore will disable the input form. checkRecordCount()
- [x] Sharing function: Posts can be shared to Whatsapp, Gmail, and many more app and services via the Web Share API, on both mobile (templatetext + post text + post link) and desktop (post link only)
- [ ] Fallback on another decentralized network: The Nostr network serves as a fallback in case the BitTorrent network fails for any reason.
- [ ] Swearwords Detection: a static list or API
- [ ] Decentralized censorship: If you dont like it, you can block it! But locally only! Every user decides for themselves what they want and what they dont want to see!
- [ ] Progressive Web App features (PWA).
- [ ] Transfer limiting.
- [ ] WebRTC channel for synchronizing assets (get client from client, P2P downloadable software).
- [ ] Multiple other protocols as fallbacks.
- [ ] Bluetooth beacon and other Adhoc strategies (quickshare?)
- [ ] Decentralized domains.
<br><br>

# Summarize

This repository is meant as a clean start point for decentralized, location based apps. I even go so far to say, EVERY APP should be location based! Since everything in reality is happening in the 3D space anyway, we miss a lot of spatial intelligence and even very positive outcomes/synergies in app logic, compared to our traditional systems today.

It's a clean code base with basic instructions (coming) for expanding it with your creativity and all available tools (HTML, JS, CSS, APIs! (JAMstack),  WASM (C, C++, Rust for the Web), WebContainers (Node in Browser), Unreal Engine 5 (C++ and visual blueprints), Unity6 (C#), and you name it!, to unleash your creativity without without caring to much about the back-end scaling (99% "automatically") or locking you in!<br><br>

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
HTML, JS, CSS, APIs! (JAMstack),  WASM (C, C++, Rust for the Web), WebContainers (Node in Browser), Unreal Engine 5 (C++ and visual blueprints), Unity6 (C#), you name it!<br><br>

# My Journey with Cloud Atlas
I have always been fascinated by the peaceful and knowledge-seeking society depicted in Star Trek. The movie
“First Contact” explains the shift from our current society to a post-scarcity society, triggered by the Vulcans’ first
contact with humanity. However, the movie never explained what the Vulcans gave humanity to facilitate this
transformation. Given our tendency to use new technologies as weapons, I wondered what could possibly have led
to such a profound change.<br><br>

The answer, I believe, lies in a collective computer—a resource-based economy management system with a
collective knowledge database and collaboration tools. This is what I have been working on for the past seven years:
creating The Cloud Atlas, a platform inspired by the idea of The Computer from Star Trek.<br><br>

The Cloud Atlas is designed to enable spontaneous cooperation and innovative problem-solving, making the world
work for 100% of humanity without ecological offense or disadvantaging anyone. It allows participants to brainstorm
solutions, petition for necessary changes, and crowdfund their initiatives. Whether it’s a local private matter project
or a global public initiative, The Cloud Atlas provides the resources and support needed to turn ideas into reality.<br><br>

My journey has been filled with challenges and learning experiences, but each step has brought me closer to
realizing a world where collaboration and innovation drive positive change. I believe that by working together, we can
create a more connected, proactive, and sustainable future.<br><br>

# Pitch

Buckminster Fuller once said, "You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete."<br><br>

Ira Chaleff, in his book Intelligent Disobedience: Doing Right When What You're Told to Do Is Wrong, stated, "A function of civil society is to organize ourselves to collectively stand up to those who add to the suffering of others."<br><br>

Inspired by these visions, Cloud Atlas was born: a decentralized platform akin to a global, user-owned Google Earth. Imagine a collective computer similar to the one in the post-scarcity society of Star Trek, and a basic digital government gradually replacing traditional governments. Cloud Atlas empowers users to create micro and large-scale missions, projects, and apps effortlessly.<br><br>

For non-technical users, the platform offers seamless linking to existing infrastructures or resources, whether it's a website, web app, GitHub repository, game on Steam/Epic Games, or even online meetings and live streaming. The possibilities are endless.<br><br>

Developers can extend and customize every aspect, from the UI to elements, using their preferred programming languages or graphical development environments like Unreal Engine 5 and Unity 3D. With CesiumJS services and a range of free tools, visualizing and animating data on the globe becomes straightforward.<br><br>

Trystero ensures decentralized data synchronization in the background via WebRTC and Bittorrent-Signaling, though traditional data persistence methods are also supported out of the box. Cloud Atlas is integrative and flexible, allowing IoT devices, sensors, or any other data sources and devices to be added to the globe or individual pins.<br><br>

Additionally, Cloud Atlas offers digital governance through Crowd Engineering Missions: a sequence of brainstorming, petitioning, crowdfunding, and action events, accelerating the journey from problem to solution to realization, to a fraction of the time compared to traditional governments.<br><br>

Cloud Atlas aims to become the world's united operating system. Whether private or public, local or global, idea generation or conflict resolution, non-profit initiative or profitable enterprise – with Cloud Atlas, anything is possible.<br><br>

Our Main Directive: "Make the world work for 100% of humanity, in the shortest possible time, through spontaneous cooperation, without ecological offense or the disadvantage of anyone."<br><br>

# The future

With Cloud Atlas, you can explore stunning UE5 content, games, and applications on any device, including browser, mobile, desktop, and VR. But that's not all.<br><br>

You can also experience Wikipedia articles in 3D and engage with them on a whole new level. Each article has an artificial identity, which means they can communicate with each other and identify conflicting information, which they will forward as pull-requests to the Wikipedia community. This helps maintain the accuracy of Wikipedia and promotes collaboration on knowledge among users.<br><br>

But Cloud Atlas is more than just a platform for exploration and learning. It also provides a social network where people from different backgrounds can come together to brainstorm solutions to local and global issues. With the power of in-person meetups, crowdfunding, and petitions, you can turn your ideas into reality and make a difference in the world. And that's not all.<br><br>

Cloud Atlas also features MissionTV, a decentralized platform similar to YouTube or Twitch, but with a focus on showcasing good deeds. With built-in live-chat and donation options, MissionTV provides an easy way to share your achievements and inspire others to do good.<br><br>

But what if you want to create your own apps and features for Cloud Atlas? That's where Metaverse-DAO comes in. The simple and intuitive red dot system allows users to request apps, features, bug-fixes, and improvements, from inside the app, which are then tackled by the talented community of developers, You.<br>
And if you want to fund your requested feature or app yourself or request community donations and crowdfunding, you can do that too. This creates a huge marketplace for development jobs and incentivized contributions, making app development more accessible and democratic than ever before. And the best part? All updates and new apps are available to all users for free!<br>
We believe that the potential for Metaverse-DAO is enormous, and we're excited to see it evolve into the future of app development.<br><br>

Join us on Cloud Atlas and be a part of this exciting new community today. Together, we can create a better world for ourselves and future generations.<br><br>

# Join our discussion:
[CCC - Collective Computer Collaboration Hub (Developer Chat)](https://app.element.io/#/room/#METAVERSE-DAO_CLOUD-ATLAS_community:gitter.im) <br><br>

# Some inspiration...

https://worldpeaceengine.pubpub.org/pub/futurefeatures/release/78
