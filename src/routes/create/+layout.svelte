<script>
  import { getContext } from "svelte";
  const user = getContext("userStored");
  console.log("userStored (create/+layout.svelte)", $user);
</script>

{#if !$user.anonymous}
  <slot />
{:else}
  <p>You have to log in first</p>
{/if}
