<script lang="ts">
  import { onMount } from 'svelte';

  let light;

  function moveLight() {
    // Get the viewport dimensions
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    // Randomly choose an edge of the screen (top, right, bottom, left)
    const edge = Math.floor(Math.random() * 4);
    let startX, startY, endX, endY;

    // Calculate start and end positions based on the chosen edge
    switch (edge) {
      case 0: // top
        startX = Math.random() * vw;
        startY = 0;
        endX = Math.random() * vw;
        endY = vh;
        break;
      case 1: // right
        startX = vw;
        startY = Math.random() * vh;
        endX = 0;
        endY = Math.random() * vh;
        break;
      case 2: // bottom
        startX = Math.random() * vw;
        startY = vh;
        endX = Math.random() * vw;
        endY = 0;
        break;
      case 3: // left
        startX = 0;
        startY = Math.random() * vh;
        endX = vw;
        endY = Math.random() * vh;
        break;
    }

    // Set the starting position of the light
    if (light) {
      light.style.left = `${startX}px`;
      light.style.top = `${startY}px`;
    }

    // Calculate the distance to travel
    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

    // Set the transition for smooth movement
    light.style.transition = `all ${distance / 100}s linear`;

    // Move the light to the end position after a delay
    setTimeout(() => {
      if (light) {
        light.style.left = `${endX}px`;
        light.style.top = `${endY}px`;
      }
    }, 100);
  }

  onMount(() => {
    // Call the moveLight function every few seconds
    setInterval(moveLight, 6000);
  });
</script>

<div class="container">
  <div id="hex-grid">
    <div bind:this={light} class="light"></div>
    <div class="grid"></div>
  </div>
</div>

<style>
  .container {
    background: #2b2b2b;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    position: relative;
    z-index: 0;
  }

  #hex-grid {
    height: 100vh;
    background: #000;
    z-index: 1;
  }

  #hex-grid .grid {
    position: absolute;
    top: 0;
    left: 0;
    background: url(grid.svg) repeat;
    width: 100%;
    height: 100%;
    z-index: 3;
    background-size: 500px;
  }

  #hex-grid .light {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 15em;
    height: 15em;
    filter: blur(15px);
    background: linear-gradient(90deg, #335bf4 0%, #2ae9c9 100%);
    z-index: 2;
  }
</style>
