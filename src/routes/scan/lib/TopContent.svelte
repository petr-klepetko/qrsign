<script>
  export let scanCompleted = false;
  import Center from "$lib/Center.svelte";
</script>

{#if !scanCompleted}
  <p>Here you can read and verify a signed document</p>
  <p>
    First, you can either take a new picture, or upload if from your gallery.
  </p>
{:else}
  <Center direction="column">
    <p>Here you <s>go</s> code :)</p>
  </Center>
{/if}

<style>
  p {
    margin: 0 0 10px 0;
  }
</style>
