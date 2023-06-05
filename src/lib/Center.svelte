<script>
  export let direction = "row";
  import { fade } from "svelte/transition";
</script>

<div style="flex-direction: {direction}">
  <slot />
</div>

<style>
  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
