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
    console.log("this device is " + (Device.isMobile ? "" : "not") + " mobile");
    isMobile = Device.isMobile;
  });

  // let currentPage = isMobile ? "ScanMenuMobile" : "ScanMenu";
  let currentPage = "ScanMenu";
  let pageHistory = [];
  let avatar, fileinput;

  const onFileSelected = (e) => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      avatar = e.target.result;
    };
  };

  const handleClick = (e) => {
    let option = e.detail;
    pageHistory.push(currentPage);
    console.log(pageHistory);
    let success = false;
    if (success) {
      currentPage = "Successful";
    } else {
      currentPage = "Unsuccessful";
    }
  };

  const goBack = () => {
    if (!pageHistory[pageHistory.length - 1]) {
      console.log("na zacatku");
      if (browser) {
        // to prevent error window is not defined, because it's SSR
        window.location.href = "/";
      }
    } else {
      currentPage = pageHistory.pop();
    }
  };
</script>

<BackArrow on:click={goBack} />
{#if currentPage == "ScanMenu"}
  <ScanMenu on:read={handleClick} />
{:else if currentPage == "ScanMenuMobile"}
  <ScanMenuMobile on:read={handleClick} />
{:else if currentPage == "Successful"}
  <Successful />
{:else if currentPage == "Unsuccessful"}
  <Unsuccessful />
{/if}
