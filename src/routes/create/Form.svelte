<script>
  import { onMount, onDestroy } from "svelte";
  import Device from "svelte-device-info";
  import Button from "../../lib/Button.svelte";
  import Center from "$lib/Center.svelte";

  import QRCode, { qrcode } from "$lib/QRJS.svelte";

  import { signingUtility } from "./SigningUtility.svelte";

  import {
    padString,
    templates,
    updateFinalQRValue,
    prepareFormField,
  } from "./lib/utils.svelte";

  let debug = false;
  let editMode = true;

  let finalQRCodeValue = {
    templateId: 1,
    fields: [],
    signature: "",
    author: "",
  };

  const reloadQRcode = async () => {
    // finalQRCodeValue.signature = "";
    finalQRCodeValue = await updateFinalQRValue(
      signingUtility,
      finalQRCodeValue,
      currentTemplate
    );

    qrcode.makeCode(padString(JSON.stringify(finalQRCodeValue)));
  };

  let currentTemplate = templates[0];

  let formData = currentTemplate.fields.forEach((field) => {
    return field.value;
  });

  let currentData = currentTemplate.fields.map((field) => field.value);

  onMount(async () => {
    await signingUtility.init();
  });
</script>

<!-- {currentTemplate.fields[0].value} -->

<div class="form-container">
  <div class="form">
    <h3>{currentTemplate.header}</h3>
    {#if editMode}
      <p>
        Student jménem <input
          bind:value={currentTemplate.fields[0].value}
          on:change={() => {
            //console.log(currentTemplate.fields[0].value);
            reloadQRcode();
          }}
          placeholder="Jméno"
        />
        studuje na škole
        <input
          placeholder="Škola"
          bind:value={currentTemplate.fields[1].value}
          on:change={() => {
            //console.log(currentTemplate.fields[0].value);
            reloadQRcode();
          }}
        />
        od
        <input
          type="date"
          placeholder="Datum od"
          bind:value={currentTemplate.fields[2].value}
          on:change={() => {
            //console.log(currentTemplate.fields[0].value);
            reloadQRcode();
          }}
        />
        do
        <input
          type="date"
          placeholder="Datum do"
          bind:value={currentTemplate.fields[3].value}
          on:input={() => {
            //console.log(currentTemplate.fields[0].value);
            reloadQRcode();
          }}
        />
      </p>
    {:else}
      <p>
        Student jménem <strong
          >{prepareFormField(currentTemplate.fields[0])}</strong
        >
        studuje na škole
        <strong>{prepareFormField(currentTemplate.fields[1])}</strong>
        od
        <strong>{prepareFormField(currentTemplate.fields[2])}</strong>
        do
        <strong>{prepareFormField(currentTemplate.fields[3])}</strong>
      </p>
    {/if}
    <div class="qr-code" id="qr-code">
      <QRCode codeValue={JSON.stringify(formData ?? "")} squareSize="420" />
    </div>
  </div>

  {#if editMode}
    <Button hidden={!editMode} on:click={() => (editMode = false)}>Save</Button>
  {:else}
    <Center hidden={editMode}>
      <Button on:click={() => (editMode = true)} cssClass={"small"}>Back</Button
      >
      <Button
        on:click={() => {
          window.print();
        }}
        cssClass={"small"}>Print</Button
      >
    </Center>
  {/if}
</div>

{#if debug}
  <Center>
    <Center direction="column"
      >Final QR code value:
      <pre>{JSON.stringify(finalQRCodeValue, null, 4)}</pre>
    </Center>
    <Center direction="column">
      Current data:<br />
      <pre>{JSON.stringify(currentData, null, 4)}</pre>
    </Center>
  </Center>
{/if}

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
    /* margin: 10px 0; */
    padding: 5px 10px;
    border: 1px solid;
  }
  .qr-code {
    width: 100%;
    /* height: 100%; */
    display: flex;
    justify-content: left;
    margin: 0;
    padding: 0;
    padding-top: 3px;
    /* background-color: pink; */
  }

  img {
    size: 100px;
  }

  @page {
    size: A4;
    margin: 0;
  }
  @media print {
    .form {
      width: 21cm;
      min-height: 29.7cm;
      padding: 2cm;
      margin: 1cm auto;
      background: white;
      border: initial;
      border-radius: initial;
      page-break-after: always;
    }

    .form-container {
      margin: 0;
      padding: 0;
    }

    .qr-code {
      width: 100%;
    }

    h3 {
      font-size: 28px;
    }

    * {
      font-size: 15px;
    }
  }
</style>
