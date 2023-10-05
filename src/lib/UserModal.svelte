<script>
  import { closeModal } from "svelte-modals";
  import Button from "./Button.svelte";
  import Center from "./Center.svelte";
  import axios from "axios";

  import {
    PUBLIC_BE_URL as BE_URL,
    PUBLIC_BE_PORT as BE_PORT,
    PUBLIC_LOGOUT_ENDPOINT as LOGOUT_ENDPOINT,
  } from "$env/static/public";

  // provided by <Modals />
  export let isOpen;

  export let user;
  // export let title;
  // export let message;
  console.log(user);

  const logout = async () => {
    try {
      const options = {
        method: "POST",
        url: `${BE_URL}:${BE_PORT}${LOGOUT_ENDPOINT}`,
        withCredentials: true,
      };
      const response = await axios.request(options);
      closeModal();
      window.location.href = "/";
    } catch (err) {
      console.log(err);
    }
  };
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h2>{user.name}</h2>
      <h3>{user.uuid}</h3>
      <Button on:click={logout}>Log out</Button>
      <div class="actions" />
    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    top: 0;
    bottom: 1;
    right: 0;
    left: 1;
    margin: 10px 10px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;

    /* allow click-through to backdrop */
    pointer-events: none;
  }

  .contents {
    min-width: 100px;
    border-radius: 6px;
    padding: 16px;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: auto;
  }

  h2 {
    text-align: center;
    font-size: 24px;
  }

  .actions {
    margin-top: 32px;
    display: flex;
    justify-content: flex-end;
  }
</style>
