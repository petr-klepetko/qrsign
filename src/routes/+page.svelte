<script>
  import Button from "$lib/Button.svelte";
  import Center from "$lib/Center.svelte";
  import Spacer from "$lib/Spacer.svelte";
</script>

<header>
  <h1>Welcome to QR SIGN!</h1>
</header>

<!-- <div id="container"> -->
<Center direction="column">
  <Spacer height="40px" />

  <a href="/scan">
    <Button>Scan</Button>
  </a>
  <div id="textOr">or</div>

  <a href="/create"><Button>Create</Button></a>
</Center>

<!-- </div> -->

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
