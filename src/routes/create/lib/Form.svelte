<script>
  import { onMount, onDestroy } from "svelte";

  import Button from "$lib/Button.svelte";
  import Center from "$lib/Center.svelte";

  import QRCode, { qrcode } from "$lib/QRJS.svelte";

  import {
    padString,
    templates,
    updateFinalQRValue,
    prepareFormField,
  } from "./utils.svelte";

  import { getContext } from "svelte";

  let user = getContext("userStored");
  // console.log("user (Form.svelte): ", JSON.stringify($user));

  let debug = false;
  let editMode = true;

  let finalQRCodeValue = {
    templateId: 1,
    fields: [],
    signature: "",
    author: $user.uuid,
  };

  const reloadQRcode = async () => {
    finalQRCodeValue = await updateFinalQRValue(
      finalQRCodeValue,
      currentTemplate
    );
    qrcode.makeCode(padString(JSON.stringify(finalQRCodeValue)));
    console.log(
      "finalQRCodeValue: ",
      padString(JSON.stringify(finalQRCodeValue))
    );
  };

  let currentTemplate = templates[0];

  currentTemplate.author = user;

  let formData = currentTemplate.fields.forEach((field) => {
    return field.value;
  });

  let currentData = currentTemplate.fields.map((field) => field.value);
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
            reloadQRcode();
          }}
          placeholder="Jméno"
        />
        studuje na škole
        <input
          placeholder="Škola"
          bind:value={currentTemplate.fields[1].value}
          on:change={() => {
            reloadQRcode();
          }}
        />
        od
        <input
          type="date"
          placeholder="Datum od"
          bind:value={currentTemplate.fields[2].value}
          on:change={() => {
            reloadQRcode();
          }}
        />
        do
        <input
          type="date"
          placeholder="Datum do"
          bind:value={currentTemplate.fields[3].value}
          on:input={() => {
            reloadQRcode();
          }}
        />
      </p>
    {:else}
      <p>
        Student jménem {@html prepareFormField(currentTemplate.fields[0])}
        studuje na škole
        {@html prepareFormField(currentTemplate.fields[1])}
        od
        {@html prepareFormField(currentTemplate.fields[2])}
        do
        {@html prepareFormField(currentTemplate.fields[3])}
      </p>
    {/if}
    <div class="qr-code" id="qr-code">
      <QRCode codeValue={JSON.stringify(formData ?? "")} squareSize="420" />
    </div>
  </div>

  {#if editMode}
    <Button on:click={() => (editMode = false)}>Save</Button>
  {:else}
    <Center>
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
