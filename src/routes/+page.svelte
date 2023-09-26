<script>
  import Button from "$lib/Button.svelte";
  import Center from "$lib/Center.svelte";
  import Spacer from "$lib/Spacer.svelte";

  let user = {};
  export let test;

  /** @type {import('./$types').PageData} */
  export let data;

  // console.log(user);

  $: {
    data = data;
    console.log("data.user.anonymous: ", data.user.anonymous);
    // console.log("USer: ", user);
    // console.log("test: ", test);
    // console.log("data: ", data);
  }
</script>

<header>
  <h1>Welcome to QR SIGN!</h1>
</header>

<Center direction="column">
  <Spacer height="40px" />

  <a href="/scan">
    <Button>Scan</Button>
  </a>
  <!-- {#if typeof data.user.name !== "undefined"} -->
  {#if !data.user.anonymous}
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
  #container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  #textOr {
    margin: 10px auto;
  }
</style>
