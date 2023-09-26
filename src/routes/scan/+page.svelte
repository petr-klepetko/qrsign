<script context="module">
  import { onMount } from "svelte";
  import Device from "svelte-device-info";
</script>

<script>
  import ScanMenu from "./pages/ScanMenu.svelte";
  import ScanMenuMobile from "./pages/ScanMenuMobile.svelte";
  import BackArrow from "$lib/BackArrow.svelte";
  import Successful from "./pages/Successful.svelte";
  import Unsuccessful from "./pages/Unsuccessful.svelte";
  import { redirect } from "@sveltejs/kit";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";

  let isMobile = null;
  onMount(() => {
    isMobile = Device.isMobile;
  });

  // let currentPage = isMobile ? "ScanMenuMobile" : "ScanMenu";
  let currentPage = "ScanMenu";
  let pageHistory = [];

  let qrCodeValue;
  let avatar, fileinput;

  export let data;
  console.log("Data: ", data);

  // const onFileSelected = (e) => {
  //   let image = e.target.files[0];
  //   let reader = new FileReader();
  //   reader.readAsDataURL(image);
  //   reader.onload = (e) => {
  //     avatar = e.target.result;
  //   };
  // };

  const handleClick = (e) => {
    // console.log(e);
    // console.log("qrCodeValue: ", qrCodeValue);
    let option = e.detail;
    pageHistory.push(currentPage);
    // console.log(pageHistory);
    let success = true;
    if (success) {
      currentPage = "Successful";
    } else {
      currentPage = "Unsuccessful";
    }
  };

  // const verify
</script>

{#if currentPage == "ScanMenu"}
  <ScanMenu on:read={handleClick} bind:qrCodeValue />
{:else if currentPage == "ScanMenuMobile"}
  <ScanMenuMobile on:read={handleClick} />
  <!-- {:else if currentPage == "ScanMenuReDone"}
  <ScanMenuReDone on:read={handleClick} /> -->
{:else if currentPage == "Successful"}
  <Successful bind:qrCodeValue />
{:else if currentPage == "Unsuccessful"}
  <Unsuccessful />
{/if}
