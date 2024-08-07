<script lang="ts">
  import { slide } from 'svelte/transition';
  import { writable } from 'svelte/store';

  export let isVisible = writable(true);

  function toggleInfobox() {
    isVisible.update(visible => !visible);
  }
</script>

{#if $isVisible}
<div class="main_div" transition:slide={{ duration: 500 }}>

  <div style="position: fixed; left: 0px; top: 5px; width: 100%; display: flex; justify-content: center; align-items: center;">
    <div class="animated-gradient" style="width: 100%; height: 30px; position: relative; display: flex; align-items: center;">
      <h5 style="margin: 0; position: absolute; left: 50%; transform: translateX(-50%); width: 100%;">⚠️ Decentralized Government coming 2024 ⚠️</h5>
      
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="close" style="margin: 0; position: absolute; right: 10px; cursor: pointer;" on:click={toggleInfobox}>
    <svg viewBox="0 0 36 36" class="circle">
      <path
        stroke-dasharray="100, 100"
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
      />
    </svg>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>

  </div>
  </div>

  <div class="textbox">
    <h4>Welcome to Cloud Atlas - Your gateway to a new decentralized world of the people, run by the people, for the people.</h4>
  
    <h4 style="text-align: left;">
      Our Main Directive: "Make the world work for 100% of humanity, in the shortest possible time, through spontaneous cooperation, without ecological offense or the disadvantage of anyone." <strong>Buckminster Fuller</strong><br><br>
  
      Cloud Atlas is an independent, community-owned Google Earth, free from centralized servers and overpowered entities, owned solely by you and the public! A Collective Computer!<br><br>
  
      IT'S FREE! More users mean more app storage and computational power. No back-end needed! Syncs via public tracker networks. Now using BitTorrent, with Nostr as a fallback coming soon...<br><br>
  
      The Stackblitz IDE is seamlessly integrated (settings icon top-right), enabling you to propose, create, and implement new applications, enhancements, and bug fixes directly - in Browser — all without the need for installing a coding environment. Contributions can be made effortlessly via a simple pull request.<br><br>
    </h4>
  
    <div class="center"><h4>What's stopping you from creating right now?</h4></div>
    <br>
  
    <div class="center">
      <a class="neumorphic" target="_blank" href="https://github.com/worldpeaceenginelabs/METAVERSE-SEED">Check out our GitHub and Collaboration Hub</a><br>
    </div>
  
    <br>
    <div class="center"><h4>UI and apps will thrive solely on your feedback. We've developed Crowd Engineering into a social network application.</h4></div>
    <br>
  
    
    <h4>🔥 Want more apps? Reach out to me and our community anytime on GitHub, Element.io (DEVChat), or during our upcoming weekly Zoom brainstorming sessions on YouTube.</h4>
   
    <br>   
  
    <div class="center"><h4>⚠️ Please note our one essential guideline:⚠️</h4></div>
    <br>
    <h4>
      1. In our unique gathering, let’s embrace our unique backgrounds and perspectives. We strive for a space where everyone feels comfortable, so please leave discussions of politics, religion, nationality, gender, age, and profession at the door.<br><br>
      2. Our meeting thrives on collective participation, no one person orchestrates our time together. If someone becomes too prominent, we trust in our collective wisdom to guide the conversation back to balance. Remember, those who help to moderate or remind others of our guidelines are not assuming leadership; they are simply helping to preserve our shared space. Stepping in to guide or moderate does not make one the leader; there are no leaders here.<br><br>
      3. If a member seeks help, we champion a culture where everyone pitches in to assist.<br><br>
      4. Together, we’ll create a space that’s collaborative, respectful, and leaderless. Thank you for contributing to our collective journey.<br><br>
      5. This introduction reinforces the idea that even those who help ensure the meeting runs smoothly are not taking on a leadership role, but rather contributing to the group’s collective operation.
    </h4>
  </div>


  <div style="position: fixed; bottom: 5px; left: 0; height: 30px; width: 100%; display: flex; justify-content: center; align-items: center;">
    <a href="https://worldpeaceenginelabs.org/" target="_blank">
        <img class="bottomicons" style="background-color: white;" src="/public/tree-icon.gif" alt="" title="World Peace Engine Labs" height="30" width="30">
    </a>
    <a href="https://app.element.io/#/room/#METAVERSE-DAO_CLOUD-ATLAS_community:gitter.im" target="_blank">
        <img class="bottomicons" src="/public/chat-icon.svg" alt="" title="Developer Chat" height="30" width="30">
    </a>
    <a href="https://github.com/worldpeaceenginelabs/METAVERSE-SEED#readme" target="_blank">
        <img class="bottomicons" src="/public/github-icon.svg" alt="" title="GitHub" height="30" width="30">
    </a>
    <a href="https://twitter.com/peace_engine" target="_blank">
        <img class="bottomicons" src="/public/x-icon.svg" alt="" title="X" height="30" width="30">
    </a>
    <a href="https://www.youtube.com/@worldpeaceenginelabs3955/videos" target="_blank">
        <img class="bottomicons" src="/public/youtube-icon.svg" alt="" title="Youtube" height="30" width="30">
    </a>
</div>


</div>
{:else}
<h5 class="toggle-bar-hidden" on:click={toggleInfobox}>About</h5>
{/if}

<style>
  a {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #007bff;
    padding: 0px;
    margin: 0px;
    text-decoration: none;           
  }

  a:hover {
    color: #abd6ff;
  }

  h5 {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: white;
  }

  h4 {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: white;
  }

  .textbox{
    overflow-y: scroll;
    top: 50px;
    position: fixed;
    bottom: 50px;
    
  }

  .center {
    text-align: center;
  }

  .toggle-bar-hidden {
    height: 15px;
    background: #ccc;
    color: black;
    cursor: pointer;
    z-index: 20;
    position: fixed;
    bottom: -18px;
    left: 50%;
    transform: translateX(-50%);
    width: 95%;
    max-width: 800px;
    backdrop-filter: blur(10px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 5px;
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
  }

  .toggle-bar-hidden:hover {
    background: #abd6ff;
  }


  .main_div {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);    
    color: #fff;
    overflow: hidden;
    position: fixed;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    width: 99%;
    max-width: 800px;
    height: 500px;
    padding: 5px;
  }

  .bottomicons{
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 2.5px;
    margin-left: 2.5px;
    margin-right: 2.5px;
  }

  .bottomicons:hover{
    background: #abd6ff;
  }
  

  .animated-gradient {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
  }

  @keyframes gradientBG {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .neumorphic {
    background: #e0e5ec;
    border-radius: 10px;
    box-shadow: 6px 6px 10px #a3b1c6, -6px -6px 10px #ffffff;
  }

  .glassmorphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

 

  .close {
  --size: 22px;
  --borderSize: 2px;
  --borderColor: rgba(255, 255, 255, 1);
  --speed: 0.5s;

  width: var(--size);
  height: var(--size);
  position: relative;
  background: #455A64;
  border-radius: 50%;
  box-shadow: 0 0 20px -5px rgba(255, 255, 255, 0.5);
  transition: 0.25s ease-in-out;
  cursor: pointer;
  animation: fade-in var(--speed) ease-out 0.25s both;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(1.1);
  }
}

.close .circle path {
  stroke: var(--borderColor);
  fill: none;
  stroke-width: calc(var(--borderSize) / 2);
  stroke-linecap: round;
  animation: progress var(--speed) ease-out 0.25s both;
}

@keyframes progress {
  from {
    stroke-dasharray: 0 100;
  }
}

.close span {
  display: block;
  width: calc(var(--size) / 4 - 2px);
  height: var(--borderSize);
  background: var(--borderColor);
  box-shadow: 0 0 20px -5px rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  position: absolute;
  --padding: calc(var(--size) / 3);
  transition: 0.25s ease-in-out;
  animation: slide-in var(--speed) ease-in-out 0.25s both;
}

@keyframes slide-in {
  from {
    width: 0;
  }
}

.close span:nth-child(2) {
  top: calc(var(--padding) - var(--borderSize) / 2);
  left: var(--padding);
  transform: rotate(45deg);
  transform-origin: top left;
}

.close span:nth-child(3) {
  top: calc(var(--padding) - var(--borderSize) / 2);
  right: var(--padding);
  transform: rotate(-45deg);
  transform-origin: top right;
}

.close span:nth-child(4) {
  bottom: calc(var(--padding) - var(--borderSize) / 2);
  left: var(--padding);
  transform: rotate(-45deg);
  transform-origin: bottom left;
}

.close span:nth-child(5) {
  bottom: calc(var(--padding) - var(--borderSize) / 2);
  right: var(--padding);
  transform: rotate(45deg);
  transform-origin: bottom right;
}

.close:hover {
  background: #37474F;
}

.close:hover span {
  width: calc(var(--size) / 4);
}


 /* WebKit Scrollbar Styles */
 ::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    ::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.5);
    }

    /* Firefox Scrollbar Styles */
    * {
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
    }

    *::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    *::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    *::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.5);
    }
</style>
