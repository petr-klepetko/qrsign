<script>
  import { Modals, closeModal } from "svelte-modals";
  import BackArrow from "$lib/BackArrow.svelte";
  import Center from "$lib/Center.svelte";
  import { onMount } from "svelte";
  import axios from "axios";

  import {
    PUBLIC_BE_URL as BE_URL,
    PUBLIC_BE_PORT as BE_PORT,
    PUBLIC_USER_FROM_COOKIE_ENDPOINT as USER_FROM_COOKIE_ENDPOINT,
  } from "$env/static/public";

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

  let user = {};
  let userInitials = "";

  onMount(async () => {
    await refreshUser();
  });

  const refreshUser = async () => {
    try {
      const options = {
        method: "GET",
        // url: `http://localhost:8079/${entityEndpoint}/${uuid}`,
        url: `${BE_URL}:${BE_PORT}${USER_FROM_COOKIE_ENDPOINT}`,
        withCredentials: true,
      };
      const response = await axios.request(options);
      user = response.data;

      userInitials = user.name.split(" ")[0][0] + user.name.split(" ")[1][0];
    } catch (error) {
      console.log("error: ", error);
      userInitials = null;
    }
  };

  $: {
    try {
      user = user;
      userInitials = user.name.split(" ")[0][0] + user.name.split(" ")[1][0];
      // console.log(user);
    } catch (error) {}
  }
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
      {#if userInitials}
        <div id="user-info">{userInitials ?? ""}</div>
      {:else if userInitials === null}
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
          {user}
        />
      </Modals>
      <slot {user} test="123" />
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
    overflow-x: hidden;
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
    padding: 15px;
  }
  a {
    text-decoration: none;
    color: inherit;
  }

  #user-info {
    max-width: 100%;
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
