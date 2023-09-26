<script context="module">
  import { onMount } from "svelte";
  import Device from "svelte-device-info";
</script>

<script>
  import ScanMenu from "./pages/ScanMenu.svelte";
  import ScanMenuMobile from "./pages/ScanMenuMobile.svelte";
  import BackArrow from "$lib/BackArrow.svelte";
  import Successful from "./pages/Successful.svelte";
  import { getContext } from "svelte";

  const user = getContext("userStored");
  console.log("userStored (create/+layout.svelte)", $user);

  let currentPage = "ScanMenu";
  let pageHistory = [];

  let qrCodeValue;

  const handleClick = (e) => {
    pageHistory.push(currentPage);
    console.log("pageHistory: ", pageHistory);
    let success = true;
    if (success) {
      currentPage = "Successful";
    } else {
      currentPage = "Unsuccessful";
    }
  };

  onMount(() => {
    // const
  });
</script>

{#if currentPage == "ScanMenu"}
  <ScanMenu on:read={handleClick} bind:qrCodeValue />
{:else if currentPage == "ScanMenuMobile"}
  <ScanMenuMobile on:read={handleClick} />
{:else if currentPage == "Successful"}
  <Successful bind:qrCodeValue />
{/if}
