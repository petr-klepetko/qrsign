<script context="module">
  import { onMount } from "svelte";
  import Device from "svelte-device-info";
</script>

<script>
  import ScanMenu from "./pages/ScanMenu.svelte";
  import BackArrow from "$lib/BackArrow.svelte";
  import LoadedDocument from "./pages/LoadedDocument.svelte";
  import { getContext } from "svelte";

  const user = getContext("userStored");
  console.log("userStored (create/+layout.svelte)", $user);

  let currentPage = "ScanMenu";
  let pageHistory = [];

  let qrCodeValue;

  const handleClick = (e) => {
    pageHistory.push(currentPage);
    console.log("pageHistory: ", pageHistory);
    currentPage = "LoadedDocument";
    console.log("Changing to LoadedDocument");
  };
</script>

{#if currentPage == "ScanMenu"}
  <ScanMenu on:read={handleClick} bind:qrCodeValue />
{:else if currentPage == "LoadedDocument"}
  <LoadedDocument bind:qrCodeValue />
{/if}
