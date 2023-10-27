<script>
  import { setContext } from "svelte";
  import { Modals, closeModal } from "svelte-modals";
  import BackArrow from "$lib/BackArrow.svelte";

  import { openModal } from "svelte-modals";
  import UserModal from "$lib/UserModal.svelte";

  import { writable } from "svelte/store";

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

  export let data;
  const user = data?.user;
  user.initials = user?.name?.split(" ")[0][0] + user?.name?.split(" ")[1][0];

  // console.log("data (+layout.svelte): ", data);
  // console.log("user (+layout.svelte): ", user);
  // console.log("user.initials: ", user.initials);

  const userStored = writable();
  $: {
    userStored.set(data?.user);
  }
  setContext("userStored", userStored);

  const openUserModal = () => {
    openModal(UserModal, { user });
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
    <div class="right-header">
      {#if !user?.anonymous}
        <div
          on:keypress={openUserModal}
          on:click={openUserModal}
          id="user-info"
        >
          {user.initials ?? "XX"}
        </div>
      {:else}
        <a href="/login">Login</a>
      {/if}
    </div>
  </header>
  <div class="main">
    <div class="container">
      <Modals>
        <div
          slot="backdrop"
          class="backdrop"
          on:click={closeModal}
          on:keypress={closeModal}
        /></Modals
      >
      <slot />
    </div>
  </div>
  <footer>2023, Petr Klepetko, VŠE</footer>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: "Courier New", Courier, monospace;
    height: 100vh;
    width: 100vw;
    overflow-x: hidden;
  }
  #page-container {
    position: relative;
    min-height: 100vh;
    min-width: 100vw;
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
    width: 150px;
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .right-header {
    width: 150px;
  }

  .center-header {
    min-width: max-content;
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
    width: 100%;
    overflow: scroll;
  }
  a {
    text-decoration: none;
    color: inherit;
  }

  #user-info {
    max-width: 100%;
  }

  #user-info:hover {
    background-color: rgba(0, 0, 0, 0.091);
    cursor: pointer;
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
