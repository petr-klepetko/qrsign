<script>
  import Button from "$lib/Button.svelte";
  import Center from "$lib/Center.svelte";
  import Spacer from "$lib/Spacer.svelte";
  import { getContext } from "svelte";

  const user = getContext("userStored");
  console.log("userStored (+page.svelte)", $user);
</script>

<header>
  <h1>Welcome to QR SIGN!</h1>
</header>

<Center direction="column">
  <Spacer height="40px" />

  <a href="/scan">
    <Button>Scan</Button>
  </a>

  {#if !$user.anonymous}
    <div id="textOr">or</div>
    <a href="/create"><Button>Create</Button></a>
  {/if}
</Center>

<style>
  header {
    width: 100%;
    text-align: center;
  }
  h1 {
    margin: 100px 40px 10px 40px;
  }
  #textOr {
    margin: 10px auto;
  }
</style>
