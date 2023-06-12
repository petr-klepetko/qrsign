<script>
  import { onMount, onDestroy } from "svelte";
  import Device from "svelte-device-info";
  import BackArrow from "$lib/BackArrow.svelte";
  import Button from "../../lib/Button.svelte";
  // import QrCode from "svelte-qrcode";

  // import QRcomponent from "../../lib/QRcomponent.svelte";
  import QRCode, { qrcode } from "$lib/QRJS.svelte";

  // let QRcomponent;
  const importQRcomponent = async () => {
    try {
      QRcomponent = (await import("$lib/QRcomponent.svelte")).default;
    } catch (e) {
      // do some thing
    }
  };

  let unique = {}; // every {} is unique, {} === {} evaluates to false
  const reloadQRcode = () => {
    console.log("Reloaded");
    unique = {};
    qrcode.makeCode("AhojAhojAhoj");
    // qrcode
  };
  // onMount(importQRcomponent);

  // onMount(() => {
  //   let script = document.createElement("script");
  //   script.src =
  //     "https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js";
  //   document.head.append(script);

  //   script.onload = function () {
  //     qrcode = new QRCode("qrcode", {
  //       text: codeValue,
  //       width: squareSize,
  //       height: squareSize,
  //       colorDark: "#000000",
  //       colorLight: "#ffffff",
  //       correctLevel: QRCode.CorrectLevel.H,
  //     });
  //   };
  // });

  // onDestroy(() => {
  //   QRcomponent = null;
  // });
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
      { id: 1, name: "Jméno", value: "Pe" },
      { id: 2, name: "Škola", value: "" },
      { id: 3, name: "Datum od", value: "" },
      { id: 4, name: "Datum do", value: "" },
    ],
    html: `
      <div></div>
      `,
  };

  let test = "Test";
  console.log(currentTemplate.fields[0]);
  let formData = currentTemplate.fields.forEach((field) => {
    return field.value;
  });

  // let currentData = [
  //   { id: 1, value: "Petr Klepetko" },
  //   { id: 2, value: "VŠE" },
  //   { id: 3, value: "2023-01-01" },
  //   { id: 4, value: "2024-01-01" },
  // ];

  let currentData = ["Petr Klepetko", "VŠE", "2023-01-01", "2024-01-01"];
</script>

<!-- {currentTemplate.fields[0].value} -->

<div class="form-container">
  <div class="form">
    <h3>{currentTemplate.header}</h3>
    <p>
      Student jménem <input
        bind:value={currentTemplate.fields[0].value}
        on:change={null}
        on:input={() => {
          console.log(currentTemplate.fields[0].value);
          reloadQRcode();
        }}
        placeholder="Jméno"
      />
      studuje na škole
      <input placeholder="Škola" bind:value={currentTemplate.fields[1].value} />
      od
      <input
        type="date"
        placeholder="Datum od"
        bind:value={currentTemplate.fields[2].value}
      />
      do
      <input
        type="date"
        placeholder="Datum do"
        bind:value={currentTemplate.fields[3].value}
      />
    </p>
    <div class="qr-code" id="qr-code">
      <!-- <svelte:component this={QRcomponent} url={"https://github.com/"} /> -->

      <QRCode codeValue={JSON.stringify(formData ?? "")} squareSize="200" />

      <!-- <QrCode value="https://github.com/" /> -->
      <!-- <img src="/src/img/ahoj_kod.png" alt="qrCode" /> -->
    </div>
  </div>
  <Button>Save</Button>
</div>
<pre>{JSON.stringify(currentTemplate.fields, null, 4)}</pre>
{formData}

<style>
  .form-container {
    width: 100%;
    display: flex;
    flex-direction: column;
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
    width: fit-content;
    height: max;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
  }
</style>
