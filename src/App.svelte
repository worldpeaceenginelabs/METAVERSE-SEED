
<!-- Every .svelte file is both a page and component. This makes it so easy to create with it for Single Page Applications. You don't need complicated router logic. You can have the magic just with Modals and Links. -->

<script lang="ts">
  
  // Your Javascript goes here! (you can even copy paste react code here, by only deleting the react boilerplate (usally the lines at the begin) and replace useEffect with onMount. Voila!))
  
  // example js begin - delete
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  // example js end - delete

</script>

  <!-- Your HTML goes here!-->

  <!-- example html begin - delete -->
  <main>
  <div>
    <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + Svelte</h1>

  <div class="card">
    <Counter />
  </div>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
  <!-- example html end - delete -->

</main>

<!-- Your CSS goes here (inside <style></style>)-->

<!-- example css begin - delete exept <style> -->
<style>

  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }

</style>
<!-- example css end - delete exept </style> -->