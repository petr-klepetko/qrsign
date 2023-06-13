<script>
  import { Modals, closeModal } from "svelte-modals";
  import BackArrow from "$lib/BackArrow.svelte";
  import Center from "$lib/Center.svelte";

  /** Page history */
  let pageHistory = [];

  const goBack = () => {
    if (!pageHistory[pageHistory.length - 1]) {
      console.log("na zacatku");
      if (browser) {
        // to prevent error window is not defined, because it's SSR
        window.location.href = "/";
      }
    } else {
      currentPage = pageHistory.pop();
    }
  };
</script>

<div id="page-container">
  <header>
    <div class="left-header">
      <BackArrow on:click={() => (window.location.href = "/")} />
    </div>
    <div class="center-header">
      <a href="/">
        <h1>QR SIGN!</h1>
      </a>
    </div>
    <div class="right-header" />
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
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .left-header {
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .right-header {
    width: 80px;
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

  @media print {
    #page-container {
      margin: 0;
      padding: 0;
    }
    .container {
      margin: 0;
      padding: 0;
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
    header {
      display: none;
    }
    footer {
      display: none;
    }
    .main {
      display: initial;
    }
  }
</style>
