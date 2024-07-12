<script lang="ts">
    import Cesium from "./Cesium.svelte";
    
    // State to track visibility of the picture
    let showPicture = true;
    
    // You can also fetch a picture and quote here if needed
    let pictureUrl = "./cloudatlas8k.jpg";
    let quote = "“Decentralization places the globe within your grasp, ensuring your voice resonates daily, not merely at the ballot box every few years. It’s about making your voice count every day, not just delegating it during elections.” BK";
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
          <Cesium />
        {/if}
      </div>

    <style>
      .picture-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        width: 100vw;
        background-color: #f0f0f0;
        text-align: center;
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