<script>
  import { Modals, closeModal } from "svelte-modals";
</script>

<div id="page-container">
  <header>
    <a href="/">
      <h1>QR SIGN!</h1>
    </a>
  </header>
  <div class="main">
    <div class="container">
      <Modals>
        <div slot="backdrop" class="backdrop" on:click={closeModal} />
      </Modals><slot />
    </div>
  </div>
  <footer>2023, Petr Klepetko, VŠE</footer>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: "Courier New", Courier, monospace;
    height: fit-content;
  }
  #page-container {
    position: relative;
    min-height: 100vh;
  }
  h1 {
    /* margin: 10px 40px; */
    margin: 0;
    padding: 10px;
  }
  header {
    width: 100%;
    height: 60px;
    text-align: center;
    border-bottom: rgba(0, 0, 0, 0.199) solid 1px;
  }
  .main {
    padding-bottom: 2.5rem;
    position: absolute;
    width: 100%;
    /* height: 100%; */
    height: calc(100% - 60px - 2.5rem);
  }
  footer {
    width: 100%;
    background: rgb(202, 202, 202);
    position: absolute;
    bottom: 0;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
  }
  .container {
    height: 100%;
    overflow: scroll;
    padding: 15px;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
</style>
