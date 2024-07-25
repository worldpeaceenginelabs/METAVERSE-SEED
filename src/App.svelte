<script lang="ts">
  import Cesium from "./Cesium.svelte";
  import AddMapmarker from "./AddMapmarker.svelte"; // Importiere die AddMapmarker Komponente
  import Appsearch from "./Dappstore/Appsearch.svelte";
  import Infobox from "./Infobox.svelte";

  // State to track visibility of the picture
  let showPicture = false;

  // You can also fetch a picture and quote here if needed
  let pictureUrl = "./cloudatlas8kzip.jpg";
  let quote = "“You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete.” Buckminster Fuller";
</script>

<div>
  {#if showPicture}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="picture-container" on:click={() => showPicture = false}>
          <img class="picture" src={pictureUrl} alt="Inspiring" />
          <div class="quote">{quote}</div>
      </div>
  {:else}
  
    <div class="cesiumcontainer"><Cesium /></div> 
    <div class="searchcontainer"><Appsearch /></div>
    <div><Infobox /></div>
  
  {/if}

  
  
</div>

<!-- Hintergrundinitialisierung der AddMapmarker-Komponente -->
<div style="position: absolute; left: -9999px; top: -9999px;">
  <AddMapmarker />
</div>

<style>
  :global(body) {
      margin: 0;
      overflow: hidden; /* Prevent scrolling */
  }

  .cesiumcontainer {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
  }

  .searchcontainer {
      position: absolute; /* Position it absolutely to overlay */
      top: 0; /* Align to the top of the cesium container */
      left: 50%; /* Center horizontally */
      transform: translateX(-50%); /* Adjust for exact centering */
      z-index: 20; /* Ensure it's above the Cesium component */
      width: 99%;
      max-width: 800px;
  }

  .picture-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1; /* Make the container take up the full height */
      text-align: center;
      background-color: #f0f0f0;
      height: 100vh;
      width: 100vw;
  }


  .picture {
      max-width: 100%;
      max-height: 80vh;
      cursor: pointer;
  }

  .quote {
      margin-top: 20px;
      font-size: 1.5em;
      font-style: italic;
      color: black;
  }
</style>
