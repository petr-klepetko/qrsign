<script>
  import Center from "$lib/Center.svelte";
  import Spacer from "$lib/Spacer.svelte";
  import { Jumper } from "svelte-loading-spinners";

  export let scannerIsLoaded = false;
</script>

{#if !scannerIsLoaded}
  <Center direction="column">
    <Spacer height="60px" />
    <p>Just a moment please :)</p>
    <Jumper size="60" color="grey" unit="px" duration="1s" />
  </Center>
{/if}
