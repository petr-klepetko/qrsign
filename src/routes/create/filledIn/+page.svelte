<script context="module">
  import { onMount } from "svelte";
  import Device from "svelte-device-info";
  import BackArrow from "$lib/BackArrow.svelte";
</script>

<script>
  let templates = [
    {
      id: 1,
      header: "Potvrzení o studiu",
      fields: [
        { id: 1, name: "Jméno" },
        { id: 2, name: "Škola" },
        { id: 3, name: "Datum od" },
        { id: 4, name: "Datum do" },
      ],
      html: `
      <div></div>
      `,
    },
  ];

  let currentTemplate = {
    id: 1,
    header: "Potvrzení o studiu",
    fields: [
      { id: 1, name: "Jméno" },
      { id: 2, name: "Škola" },
      { id: 3, name: "Datum od" },
      { id: 4, name: "Datum do" },
    ],
    html: `
      <div></div>
      `,
  };

  // let currentData = [
  //   { id: 1, value: "Petr Klepetko" },
  //   { id: 2, value: "VŠE" },
  //   { id: 3, value: "2023-01-01" },
  //   { id: 4, value: "2024-01-01" },
  // ];

  let currentData = ["Petr Klepetko", "VŠE", "2023-01-01", "2024-01-01"];

  // let currentPage = isMobile ? "ScanMenuMobile" : "ScanMenu";
  let currentPage = "ScanMenu";
  let pageHistory = [];
  let avatar, fileinput;

  const handleClick = (e) => {
    let option = e.detail;
    pageHistory.push(currentPage);
    // console.log(pageHistory);
    let success = false;
    if (success) {
      currentPage = "Successful";
    } else {
      currentPage = "Unsuccessful";
    }
  };

  const goBack = () => {
    if (!pageHistory[pageHistory.length - 1]) {
      // console.log("na zacatku");
      if (browser) {
        // to prevent error window is not defined, because it's SSR
        window.location.href = "/";
      }
    } else {
      currentPage = pageHistory.pop();
    }
  };
  // console.log(templates[0].fields);
</script>

<!-- <BackArrow on:click={goBack} /> -->
<!-- {#each templates[0].fields as field}
  {field.name}
{/each} -->

<div class="form-container">
  <div class="form">
    <h3>{currentTemplate.header}</h3>
    <p>
      Student jménem <strong>{currentData[0]}</strong> studuje na škole
      <strong>{currentData[1]}</strong>
      od <strong>{currentData[2]}</strong> do <strong>{currentData[3]}</strong>
    </p>
    <div class="qr-code">
      <img src="/src/img/ahoj_kod.png" />
    </div>
  </div>
</div>

<!-- {#if currentPage == "ScanMenu"}
  <ScanMenu on:read={handleClick} />
{:else if currentPage == "ScanMenuMobile"}
  <ScanMenuMobile on:read={handleClick} />
{:else if currentPage == "Successful"}
  <Successful />
{:else if currentPage == "Unsuccessful"}
  <Unsuccessful />
{/if} -->

<style>
  .form-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .form {
    width: calc(100vw - 50px);
    height: calc((100vw - 50px) * 1.414);
    max-width: 50vh;
    max-height: 70vh;
    margin: 10px 0;
    padding: 5px 10px;
    border: 1px solid;
  }
  .qr-code {
    width: 100%;
    height: max;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
