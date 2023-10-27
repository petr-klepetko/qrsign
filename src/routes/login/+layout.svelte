<script>
  import { getContext } from "svelte";
  const user = getContext("userStored");
  // console.log("userStored (create/+layout.svelte)", $user);
</script>

{#if !user}
  <p>Loading</p>
{/if}

{#if !$user.anonymous}
  <p>You are already logged in :)</p>
{:else}
  <slot />
{/if}
