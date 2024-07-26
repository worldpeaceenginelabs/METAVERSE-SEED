<script lang="ts">
  import { slide } from 'svelte/transition';
  import { writable } from 'svelte/store';

  export let isVisible = writable(true);

  function toggleInfobox() {
    isVisible.update(visible => !visible);
  }
</script>

{#if $isVisible}
  <div class="main_div" transition:slide={{ duration: 300 }}>
    <h5 class="animated-gradient" on:click={toggleInfobox}>⚠️Digital Government coming 2024⚠️</h5>
    <h4>Welcome to Cloud Atlas, your gateway to a new decentralized world!<br><br>
        
        Our Main Directive: "Make the world work for 100% of humanity, in the shortest possible time, through spontaneous cooperation, without ecological offense or the disadvantage of anyone."<br><strong>Buckminster Fuller</strong><br><br>
    
        Cloud Atlas is an independent, community-owned Google Earth, free from centralized servers and overpowered entities, owned solely by you and the public! A Collective Computer!<br><br>
        IT'S FREE! More users mean more app storage and computational power. No back-end needed! Syncs via public tracker networks. Now using BitTorrent, with Nostr as a fallback coming soon...<br><br>
    
        What's stopping you from creating right now?<br>
        
        <a class="neumorphic" target="_blank" href="https://github.com/worldpeaceenginelabs/METAVERSE-SEED">Check out our GitHub and Collaboration Hub</a><br>
        UI and apps will thrive solely on your feedback. We've developed Crowd Engineering into a social network application.<br><br>
        
        <span class="highlight">
            🔥 Want more apps? Reach out to me and our community anytime on GitHub, Element.io (DEVChat), or during our upcoming weekly Zoom brainstorming sessions on YouTube.</span><br><br>

        ⚠️ Please note our one essential guideline:⚠️<br>
        In our unique gathering, let’s embrace our unique backgrounds and perspectives. We strive for a space where everyone feels comfortable, so please leave discussions of politics, religion, nationality, gender, age, and profession at the door.<br><br>
        Our meeting thrives on collective participation, no one person orchestrates our time together. If someone becomes too prominent, we trust in our collective wisdom to guide the conversation back to balance. Remember, those who help to moderate or remind others of our guidelines are not assuming leadership; they are simply helping to preserve our shared space. Stepping in to guide or moderate does not make one the leader; there are no leaders here.<br><br>
        
        If a member seeks help, we champion a culture where everyone pitches in to assist.<br><br>
        
        Together, we’ll create a space that’s collaborative, respectful, and leaderless. Thank you for contributing to our collective journey.<br><br>
        
        This introduction reinforces the idea that even those who help ensure the meeting runs smoothly are not taking on a leadership role, but rather contributing to the group’s collective operation.
    </h4>
    <h5>
        <a class="glassmorphism" href="https://github.com/worldpeaceenginelabs/METAVERSE-DAO_CLOUD-ATLAS#readme" target="blank">@Github</a>
        <a class="glassmorphism" href="https://app.element.io/#/room/#METAVERSE-DAO_CLOUD-ATLAS_community:gitter.im" target="_blank">@DEVChat</a>
        <a class="glassmorphism" href="https://twitter.com/peace_engine" target="blank">@Twitter</a>
        <a class="glassmorphism" href="https://www.youtube.com/@worldpeaceenginelabs3955/videos" target="_blank">@YouTube</a>
    </h5>
  </div>
{:else}
<h5 class="toggle-bar-hidden" on:click={toggleInfobox}>
  ⚠️“A decentralized government of the people, run by the people, for the people.”⚠️
</h5>
{/if}

<style>
  a {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #007bff;
    padding: 0%;
    margin: 0%;
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
    text-align: center;
    color: white;
    padding: 0px 10px;
    outline: 0;
    -webkit-appearance: none;
  }

  h4 {
    text-align: center;
    height: 100px;
    overflow: auto;
    padding: 10px;
  }

  .highlight {
    color: red;
  }

  .ovalbox {
    backdrop-filter: blur(10px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 5px;
  }

  .toggle-bar {
    height: 5px;
    background: #ccc;
    cursor: pointer;
    z-index: 20;
    position: absolute;
    bottom: 220px;
    left: 50%;
    transform: translateX(-50%);
    width: 97%;
    max-width: 800px;
    backdrop-filter: blur(10px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 5px;
  }

  .toggle-bar:hover {
    background: #abd6ff;
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
    position: fixed;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    width: 99%;
    max-width: 800px;
    height: 230px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 0px;
    color: #fff;
    overflow: hidden;
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
    padding: 5px;
    color: #fff;
  }
</style>
