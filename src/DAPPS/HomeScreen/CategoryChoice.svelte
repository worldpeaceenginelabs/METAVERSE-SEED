<script>
  import Brainstorming from "./Brainstorming.svelte";
  import ActionEvent from "./ActionEvent.svelte";
  import Petition from "./Petition.svelte";
  import Crowdfunding from "./Crowdfunding.svelte";
  import { onMount } from "svelte";

  let showModal = false;
  let currentComponent = null;

  const components = {
    Brainstorming,
    ActionEvent,
    Petition,
    Crowdfunding,
  };

  function openModal(componentName) {
    currentComponent = components[componentName];
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    currentComponent = null;
  }

  onMount(() => {
    // Handle clicks outside the modal to close it
    window.addEventListener('click', (event) => {
      const modalContent = document.querySelector('.modal-content');
      if (showModal && !modalContent.contains(event.target)) {
        closeModal();
      }
    });
  });
</script>



<div class="container">
  <div class="boxcontainer">
    <div class="box" on:click={() => openModal("Brainstorming")}>
      <div class="title">Brainstorming (zoom.us)</div>
      <div class="description">Brainstorm solutions, with people from all walks of life...</div>
    </div>

    <div class="box" on:click={() => openModal("ActionEvent")}>
      <div class="title">(coming soon) ActionEvent (cloudatlas.club)</div>
      <div class="description">Realize your solutions through sheer man-power...</div>
    </div>

    <div class="box" on:click={() => openModal("Petition")}>
      <div class="title">(coming soon) Petition (change.org)</div>
      <div class="description">Secure eventually necessary permissions to enhance public spaces...</div>
    </div>

    <div class="box" on:click={() => openModal("Crowdfunding")}>
      <div class="title">(coming soon) Crowdfunding (gofundme.com)</div>
      <div class="description">Turn your visionary ideas into reality with the power of Crowdfunding...</div>
    </div>
  </div>
</div>



{#if showModal}
  <div class="modal">
    <div class="modal-content glassmorphism">

      <div class="close float-right" on:click={closeModal}>
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
        
      {#if currentComponent}
        <svelte:component this={currentComponent} />
      {/if}
    </div>
  </div>
{/if}




<style>
  .container {
    top: 0px;
    left:0px;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .boxcontainer {
    width: 300px;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
  }

  .box {
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
    text-align: left;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }

  .box:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  .title {
    font-weight: bold;
    margin-bottom: 5px;
    color: black;
    font-size: 0.7em;
  }

  .description {
    font-size: 0.7em;
    color: #666;
  }

  /* Modal styles */
  .modal {
    display: flex;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    
  }

  .modal-content {
	  background-color: white;
	  color: white;
	  padding: 10px;
	  border-radius: 5px;
	  width: 90%;
	  max-width: 800px;  
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: white;
    padding: 0%;
    margin: 0%;
    text-decoration: none;   
	}

  .glassmorphism {
    /* Apply glassmorphism style for the modal content */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .float-right {
        float: right;
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
  animation: fade-in-scale-down var(--speed) ease-out 0.25s both;
}

/* Keyframes for fade-in-scale down effect */
@keyframes fade-in-scale-down {
    from {
        opacity: 0;
        transform: scale(1.1); /* Optional: add a slight zoom-in effect */
    }
    to {
        opacity: 1;
        transform: scale(1); /* Reset to normal scale */
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
</style>


